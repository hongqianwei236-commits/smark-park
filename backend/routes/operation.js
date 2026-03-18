const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ============ 入驻企业 ============
router.get('/settled-companies', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const data = db.getTable('settled_companies');
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(c => {
    const industry = db.findById('industries', c.industry_id);
    return { ...c, industry_name: industry?.name };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/settled-companies', (req, res) => {
  const item = db.insert('settled_companies', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 场地管理 ============
router.get('/venues', (req, res) => {
  const data = db.getTable('venues');
  res.json({ success: true, data });
});

router.post('/venues', (req, res) => {
  const item = db.insert('venues', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// 场地预约
router.get('/venue-reservations', (req, res) => {
  const { venue_id } = req.query;
  let data = db.getTable('venue_reservations');
  if (venue_id) data = data.filter(r => r.venue_id == venue_id);
  res.json({ success: true, data });
});

router.post('/venue-reservations', (req, res) => {
  const item = db.insert('venue_reservations', req.body);
  res.json({ success: true, data: item, message: '预约成功' });
});

// ============ 活动管理 ============
router.get('/activities', (req, res) => {
  const data = db.getTable('activities');
  res.json({ success: true, data });
});

router.post('/activities', (req, res) => {
  const item = db.insert('activities', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 资讯公告 ============
router.get('/announcements', (req, res) => {
  const { page = 1, pageSize = 10, type } = req.query;
  let data = db.getTable('announcements');
  if (type) data = data.filter(a => a.type === type);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize);
  res.json({ success: true, data: { list, total } });
});

router.post('/announcements', (req, res) => {
  const item = db.insert('announcements', { ...req.body, status: 'published', publish_date: new Date().toISOString() });
  res.json({ success: true, data: item, message: '发布成功' });
});

router.delete('/announcements/:id', (req, res) => {
  db.delete('announcements', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 访客记录 ============
router.get('/visitors', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const data = db.getTable('visitor_records');
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize);
  res.json({ success: true, data: { list, total } });
});

router.post('/visitors', (req, res) => {
  const item = db.insert('visitor_records', { ...req.body, visit_time: new Date().toISOString(), status: 'visited' });
  res.json({ success: true, data: item, message: '登记成功' });
});

// ============ 门禁设备 ============
router.get('/access-devices', (req, res) => {
  const data = db.getTable('access_devices');
  res.json({ success: true, data });
});

router.post('/access-devices', (req, res) => {
  const item = db.insert('access_devices', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

module.exports = router;
