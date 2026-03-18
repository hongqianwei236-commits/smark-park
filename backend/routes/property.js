const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ============ 投诉建议 ============
router.get('/complaints', (req, res) => {
  const { page = 1, pageSize = 10, type, status } = req.query;
  let data = db.getTable('complaints');
  if (type) data = data.filter(c => c.type === type);
  if (status) data = data.filter(c => c.status === status);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(c => {
    const tenant = db.findById('tenants', c.tenant_id);
    return { ...c, tenant_name: tenant?.name };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/complaints', (req, res) => {
  const item = db.insert('complaints', { ...req.body, status: 'pending' });
  res.json({ success: true, data: item, message: '提交成功' });
});

router.put('/complaints/:id', (req, res) => {
  const item = db.update('complaints', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

// ============ 在线报修 ============
router.get('/repairs', (req, res) => {
  const { page = 1, pageSize = 10, status, type } = req.query;
  let data = db.getTable('repairs');
  if (status) data = data.filter(r => r.status === status);
  if (type) data = data.filter(r => r.type === type);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(r => {
    const tenant = db.findById('tenants', r.tenant_id);
    const room = db.findById('rooms', r.room_id);
    const building = room ? db.findById('buildings', room.building_id) : null;
    return { ...r, tenant_name: tenant?.name, room_no: room?.room_no, building_name: building?.name };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/repairs', (req, res) => {
  const item = db.insert('repairs', { ...req.body, status: 'pending' });
  res.json({ success: true, data: item, message: '报修提交成功' });
});

router.put('/repairs/:id', (req, res) => {
  const item = db.update('repairs', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

// ============ 水电表 ============
router.get('/meters', (req, res) => {
  const { room_id, type } = req.query;
  let data = db.getTable('meters');
  if (room_id) data = data.filter(m => m.room_id == room_id);
  if (type) data = data.filter(m => m.type === type);
  const list = data.map(m => {
    const room = db.findById('rooms', m.room_id);
    const building = room ? db.findById('buildings', room.building_id) : null;
    return { ...m, room_no: room?.room_no, building_name: building?.name };
  });
  res.json({ success: true, data: list });
});

router.post('/meters', (req, res) => {
  const item = db.insert('meters', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 仓库管理 ============
router.get('/warehouses', (req, res) => {
  res.json({ success: true, data: db.getTable('warehouses') });
});

router.post('/warehouses', (req, res) => {
  const item = db.insert('warehouses', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 资产管理 ============
router.get('/assets', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const data = db.getTable('assets');
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize);
  res.json({ success: true, data: { list, total } });
});

router.post('/assets', (req, res) => {
  const item = db.insert('assets', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 巡更路线 ============
router.get('/patrol-routes', (req, res) => {
  res.json({ success: true, data: db.getTable('patrol_routes') });
});

router.post('/patrol-routes', (req, res) => {
  const item = db.insert('patrol_routes', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 体系文件 ============
router.get('/documents', (req, res) => {
  res.json({ success: true, data: db.getTable('documents') });
});

router.post('/documents', (req, res) => {
  const item = db.insert('documents', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

module.exports = router;
