const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { asyncHandler } = require('../middleware/errorHandler');

// 获取所有项目
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
  const keyword = req.query.keyword;
  
  let projects = [...db.tables.projects];
  
  // 搜索过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    projects = projects.filter(p => 
      p.name.toLowerCase().includes(lowerKeyword) ||
      (p.address && p.address.toLowerCase().includes(lowerKeyword))
    );
  }

  // 排序：最新创建的项目优先，创建时间相同时按 ID 倒序兜底
  projects.sort((a, b) => {
    const timeDiff = new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return (b.id || 0) - (a.id || 0);
  });
  
  const total = projects.length;
  
  // 分页
  const offset = (page - 1) * pageSize;
  projects = projects.slice(offset, offset + pageSize);
  
  res.json({ data: projects, total, page, pageSize });
}));

// 获取单个项目
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '项目ID格式不正确' });
  }
  
  const project = db.tables.projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  
  // 获取项目下的楼栋
  const buildings = db.tables.buildings.filter(b => b.project_id === id);
  
  // 获取项目统计
  const buildingIds = buildings.map(b => b.id);
  const rooms = db.tables.rooms.filter(r => buildingIds.includes(r.building_id));
  
  const stats = {
    total_rooms: rooms.length,
    vacant_rooms: rooms.filter(r => r.status === 'vacant').length,
    occupied_rooms: rooms.filter(r => r.status === 'occupied').length,
    reserved_rooms: rooms.filter(r => r.status === 'reserved').length
  };
  
  res.json({ ...project, buildings, stats });
}));

// 创建项目
router.post('/', asyncHandler(async (req, res) => {
  const { name, address, total_area, status = 'active' } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: '项目名称不能为空' });
  }
  
  const project = {
    id: db.idCounters.projects++,
    name: name.trim(),
    address: address || '',
    total_area: parseFloat(total_area) || 0,
    status,
    created_at: new Date().toISOString()
  };
  
  db.tables.projects.push(project);
  res.status(201).json(project);
}));

// 更新项目
router.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '项目ID格式不正确' });
  }
  
  const project = db.tables.projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  
  const { name, address, total_area, status } = req.body;
  
  Object.assign(project, {
    name: name !== undefined ? name.trim() : project.name,
    address: address !== undefined ? address : project.address,
    total_area: total_area !== undefined ? (parseFloat(total_area) || 0) : project.total_area,
    status: status !== undefined ? status : project.status
  });
  
  res.json(project);
}));

// 删除项目
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '项目ID格式不正确' });
  }
  
  const index = db.tables.projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '项目不存在' });
  }
  
  // 检查是否有关联楼栋
  const hasBuildings = db.tables.buildings.some(b => b.project_id === id);
  if (hasBuildings) {
    return res.status(400).json({ error: '该项目有关联楼栋，无法删除' });
  }
  
  db.tables.projects.splice(index, 1);
  res.json({ message: '删除成功' });
}));

module.exports = router;