const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ============ 承租方管理 ============
router.get('/tenants', (req, res) => {
  const { page = 1, pageSize = 10, keyword, type } = req.query;
  let data = db.getTable('tenants');
  if (keyword) data = data.filter(t => t.name?.includes(keyword) || t.contact?.includes(keyword));
  if (type) data = data.filter(t => t.type === type);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(t => {
    const industry = db.findById('industries', t.industry_id);
    return { ...t, industry_name: industry?.name };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/tenants', (req, res) => {
  const item = db.insert('tenants', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.get('/tenants/:id', (req, res) => {
  const item = db.findById('tenants', Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: '承租方不存在' });
  const contracts = db.findWhere('contracts', { tenant_id: item.id });
  res.json({ success: true, data: { ...item, contracts } });
});

router.put('/tenants/:id', (req, res) => {
  const item = db.update('tenants', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

router.delete('/tenants/:id', (req, res) => {
  db.delete('tenants', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 供应商管理 ============
router.get('/suppliers', (req, res) => {
  const { page = 1, pageSize = 10, keyword } = req.query;
  let data = db.getTable('suppliers');
  if (keyword) data = data.filter(s => s.name?.includes(keyword));
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize);
  res.json({ success: true, data: { list, total } });
});

router.post('/suppliers', (req, res) => {
  const item = db.insert('suppliers', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.put('/suppliers/:id', (req, res) => {
  const item = db.update('suppliers', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

router.delete('/suppliers/:id', (req, res) => {
  db.delete('suppliers', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 出租方管理 ============
router.get('/landlords', (req, res) => {
  const data = db.getTable('landlords');
  res.json({ success: true, data });
});

router.post('/landlords', (req, res) => {
  const item = db.insert('landlords', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});
router.put('/landlords/:id', (req, res) => {
  const item = db.update('landlords', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});
router.delete('/landlords/:id', (req, res) => {
  db.delete('landlords', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

module.exports = router;
