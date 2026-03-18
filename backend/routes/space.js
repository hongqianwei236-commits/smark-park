const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ============ 项目管理 ============
router.get('/projects', (req, res) => {
  const { page = 1, pageSize = 10, keyword } = req.query;
  let data = db.getTable('projects');
  if (keyword) data = data.filter(p => p.name?.includes(keyword));
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize);
  res.json({ success: true, data: { list, total, page: Number(page), pageSize: Number(pageSize) } });
});

router.post('/projects', (req, res) => {
  const item = db.insert('projects', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.get('/projects/:id', (req, res) => {
  const item = db.findById('projects', Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: '项目不存在' });
  const buildings = db.findWhere('buildings', { project_id: item.id });
  res.json({ success: true, data: { ...item, buildings } });
});

router.put('/projects/:id', (req, res) => {
  const item = db.update('projects', Number(req.params.id), req.body);
  if (!item) return res.status(404).json({ success: false, message: '项目不存在' });
  res.json({ success: true, data: item, message: '更新成功' });
});

router.delete('/projects/:id', (req, res) => {
  if (db.delete('projects', Number(req.params.id))) {
    res.json({ success: true, message: '删除成功' });
  } else {
    res.status(404).json({ success: false, message: '项目不存在' });
  }
});

// ============ 楼宇管理 ============
router.get('/buildings', (req, res) => {
  const { page = 1, pageSize = 10, project_id } = req.query;
  let data = db.getTable('buildings');
  if (project_id) data = data.filter(b => b.project_id == project_id);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(b => {
    const project = db.findById('projects', b.project_id);
    const rooms = db.findWhere('rooms', { building_id: b.id });
    const occupiedRooms = rooms.filter(r => r.status === 'occupied');
    return {
      ...b,
      project_name: project?.name,
      room_count: rooms.length,
      occupied_count: occupiedRooms.length,
      occupancy_rate: rooms.length > 0 ? ((occupiedRooms.length / rooms.length) * 100).toFixed(1) : 0
    };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/buildings', (req, res) => {
  const item = db.insert('buildings', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.get('/buildings/:id', (req, res) => {
  const item = db.findById('buildings', Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: '楼宇不存在' });
  res.json({ success: true, data: item });
});

router.put('/buildings/:id', (req, res) => {
  const item = db.update('buildings', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

router.delete('/buildings/:id', (req, res) => {
  db.delete('buildings', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 房源管理 ============
router.get('/rooms', (req, res) => {
  const { page = 1, pageSize = 10, building_id, status } = req.query;
  let data = db.getTable('rooms');
  if (building_id) data = data.filter(r => r.building_id == building_id);
  if (status) data = data.filter(r => r.status === status);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(r => {
    const building = db.findById('buildings', r.building_id);
    const project = building ? db.findById('projects', building.project_id) : null;
    return { ...r, building_name: building?.name, project_name: project?.name };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/rooms', (req, res) => {
  const item = db.insert('rooms', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.get('/rooms/:id', (req, res) => {
  const item = db.findById('rooms', Number(req.params.id));
  res.json({ success: true, data: item });
});

router.put('/rooms/:id', (req, res) => {
  const item = db.update('rooms', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

router.delete('/rooms/:id', (req, res) => {
  db.delete('rooms', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 停车场管理 ============
router.get('/parking-lots', (req, res) => {
  const { project_id } = req.query;
  let data = db.getTable('parking_lots');
  if (project_id) data = data.filter(p => p.project_id == project_id);
  const list = data.map(p => {
    const project = db.findById('projects', p.project_id);
    const areas = db.findWhere('parking_areas', { parking_lot_id: p.id });
    const spaces = areas.reduce((sum, a) => {
      return sum + db.findWhere('parking_spaces', { parking_area_id: a.id }).length;
    }, 0);
    return { ...p, project_name: project?.name, areas_count: areas.length, spaces_count: spaces };
  });
  res.json({ success: true, data: list });
});

router.post('/parking-lots', (req, res) => {
  const item = db.insert('parking_lots', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 停车区域 ============
router.get('/parking-areas', (req, res) => {
  const { parking_lot_id } = req.query;
  let data = db.getTable('parking_areas');
  if (parking_lot_id) data = data.filter(a => a.parking_lot_id == parking_lot_id);
  const list = data.map(a => {
    const lot = db.findById('parking_lots', a.parking_lot_id);
    const spaces = db.findWhere('parking_spaces', { parking_area_id: a.id });
    return { ...a, lot_name: lot?.name, spaces_count: spaces.length };
  });
  res.json({ success: true, data: list });
});

router.post('/parking-areas', (req, res) => {
  const item = db.insert('parking_areas', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 车位管理 ============
router.get('/parking-spaces', (req, res) => {
  const { page = 1, pageSize = 10, parking_area_id, status } = req.query;
  let data = db.getTable('parking_spaces');
  if (parking_area_id) data = data.filter(s => s.parking_area_id == parking_area_id);
  if (status) data = data.filter(s => s.status === status);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(s => {
    const area = db.findById('parking_areas', s.parking_area_id);
    const lot = area ? db.findById('parking_lots', area.parking_lot_id) : null;
    const type = db.findById('parking_types', s.parking_type_id);
    return { ...s, area_name: area?.name, lot_name: lot?.name, type_name: type?.name };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/parking-spaces', (req, res) => {
  const item = db.insert('parking_spaces', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

module.exports = router;
