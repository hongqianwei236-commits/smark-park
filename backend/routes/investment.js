const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ============ 线索管理 ============
router.get('/clues', (req, res) => {
  const { page = 1, pageSize = 10, status, project_id, keyword } = req.query;
  let data = db.getTable('clues');
  if (status) data = data.filter(c => c.status === status);
  if (project_id) data = data.filter(c => c.project_id == project_id);
  if (keyword) data = data.filter(c => c.name?.includes(keyword) || c.company?.includes(keyword) || c.phone?.includes(keyword));
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(c => {
    const project = db.findById('projects', c.project_id);
    const source = db.findById('clue_sources', c.source_id);
    const industry = db.findById('industries', c.industry_id);
    return { ...c, project_name: project?.name, source_name: source?.name, industry_name: industry?.name };
  });
  res.json({ success: true, data: { list, total } });
});

router.post('/clues', (req, res) => {
  const item = db.insert('clues', { ...req.body, status: 'pending' });
  res.json({ success: true, data: item, message: '创建成功' });
});

router.get('/clues/:id', (req, res) => {
  const item = db.findById('clues', Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: '线索不存在' });
  res.json({ success: true, data: item });
});

router.put('/clues/:id', (req, res) => {
  const item = db.update('clues', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

// 线索状态变更
router.put('/clues/:id/status', (req, res) => {
  const { status } = req.body;
  const item = db.update('clues', Number(req.params.id), { status });
  res.json({ success: true, data: item, message: '状态已更新' });
});

// ============ 招商团队 ============
router.get('/teams', (req, res) => {
  const { project_id } = req.query;
  let data = db.getTable('investment_teams');
  if (project_id) data = data.filter(t => t.project_id == project_id);
  const list = data.map(t => {
    const project = db.findById('projects', t.project_id);
    const commission = db.findById('commissions', t.commission_id);
    return { ...t, project_name: project?.name, commission_name: commission?.name };
  });
  res.json({ success: true, data: list });
});

router.post('/teams', (req, res) => {
  const item = db.insert('investment_teams', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.put('/teams/:id', (req, res) => {
  const item = db.update('investment_teams', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

router.delete('/teams/:id', (req, res) => {
  db.delete('investment_teams', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 渠道管理 ============
router.get('/channels', (req, res) => {
  const data = db.getTable('channels');
  res.json({ success: true, data });
});

router.post('/channels', (req, res) => {
  const item = db.insert('channels', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 佣金设置 ============
router.get('/commissions', (req, res) => {
  const data = db.getTable('commissions');
  res.json({ success: true, data });
});

router.post('/commissions', (req, res) => {
  const item = db.insert('commissions', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

// ============ 招商人员 ============
router.get('/staff', (req, res) => {
  const data = db.getTable('investment_users');
  res.json({ success: true, data });
});

router.post('/staff', (req, res) => {
  const item = db.insert('investment_users', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.put('/staff/:id', (req, res) => {
  const item = db.update('investment_users', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

router.delete('/staff/:id', (req, res) => {
  db.delete('investment_users', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 招商维护 ============
router.get('/maintenance', (req, res) => {
  const { project_id } = req.query;
  const projects = db.getTable('projects');
  const rooms = db.getTable('rooms');
  
  const projectData = project_id ? [db.findById('projects', Number(project_id))] : projects;
  
  const result = projectData.filter(p => p).map(project => {
    const projectBuildings = db.findWhere('buildings', { project_id: project.id });
    const buildingIds = projectBuildings.map(b => b.id);
    const projectRooms = rooms.filter(r => buildingIds.includes(r.building_id));
    const occupiedRooms = projectRooms.filter(r => r.status === 'occupied');
    
    return {
      project,
      stats: {
        totalRooms: projectRooms.length,
        occupiedRooms: occupiedRooms.length,
        vacantRooms: projectRooms.length - occupiedRooms.length,
        occupancyRate: projectRooms.length > 0 ? ((occupiedRooms.length / projectRooms.length) * 100).toFixed(1) : 0
      },
      rooms: projectRooms.slice(0, 20).map(r => {
        const building = db.findById('buildings', r.building_id);
        return { ...r, building_name: building?.name };
      })
    };
  });
  
  res.json({ success: true, data: result });
});

module.exports = router;
