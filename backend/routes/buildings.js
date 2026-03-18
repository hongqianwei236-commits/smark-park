const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { asyncHandler } = require('../middleware/errorHandler');

// 获取所有楼栋
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
  const project_id = req.query.project_id;
  const keyword = req.query.keyword;
  
  let buildings = [...db.tables.buildings];
  
  // 项目过滤
  if (project_id) {
    const pid = parseInt(project_id);
    if (!isNaN(pid)) {
      buildings = buildings.filter(b => b.project_id === pid);
    }
  }
  
  // 搜索过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    buildings = buildings.filter(b => {
      const project = db.tables.projects.find(p => p.id === b.project_id);
      return b.name.toLowerCase().includes(lowerKeyword) ||
             (project && project.name.toLowerCase().includes(lowerKeyword));
    });
  }
  
  const total = buildings.length;
  
  // 分页
  const offset = (page - 1) * pageSize;
  buildings = buildings.slice(offset, offset + pageSize);
  
  // 添加项目名称
  buildings = buildings.map(b => {
    const project = db.tables.projects.find(p => p.id === b.project_id);
    return { ...b, project_name: project?.name || '' };
  });
  
  // 排序
  buildings.sort((a, b) => b.id - a.id);
  
  res.json({ data: buildings, total, page, pageSize });
}));

// 获取单个楼栋
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '楼栋ID格式不正确' });
  }
  
  const building = db.tables.buildings.find(b => b.id === id);
  if (!building) {
    return res.status(404).json({ error: '楼栋不存在' });
  }
  
  const project = db.tables.projects.find(p => p.id === building.project_id);
  
  // 获取楼栋下的房间
  const rooms = db.tables.rooms.filter(r => r.building_id === id);
  
  // 统计
  const stats = {
    total_rooms: rooms.length,
    vacant_rooms: rooms.filter(r => r.status === 'vacant').length,
    occupied_rooms: rooms.filter(r => r.status === 'occupied').length,
    reserved_rooms: rooms.filter(r => r.status === 'reserved').length
  };
  
  res.json({ 
    ...building, 
    project_name: project?.name || '',
    rooms, 
    stats 
  });
}));

// 创建楼栋
router.post('/', asyncHandler(async (req, res) => {
  const { project_id, name, floors, rooms_count } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: '楼栋名称不能为空' });
  }
  
  if (!project_id) {
    return res.status(400).json({ error: '所属项目不能为空' });
  }
  
  const pid = parseInt(project_id);
  if (isNaN(pid)) {
    return res.status(400).json({ error: '项目ID格式不正确' });
  }
  
  // 检查项目是否存在
  const project = db.tables.projects.find(p => p.id === pid);
  if (!project) {
    return res.status(404).json({ error: '所属项目不存在' });
  }
  
  const building = {
    id: db.idCounters.buildings++,
    project_id: pid,
    name: name.trim(),
    floors: parseInt(floors) || 1,
    rooms_count: parseInt(rooms_count) || 0
  };
  
  db.tables.buildings.push(building);
  res.status(201).json(building);
}));

// 更新楼栋
router.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '楼栋ID格式不正确' });
  }
  
  const building = db.tables.buildings.find(b => b.id === id);
  if (!building) {
    return res.status(404).json({ error: '楼栋不存在' });
  }
  
  const { project_id, name, floors, rooms_count } = req.body;
  
  // 检查新项目是否存在
  if (project_id !== undefined) {
    const pid = parseInt(project_id);
    if (isNaN(pid)) {
      return res.status(400).json({ error: '项目ID格式不正确' });
    }
    const project = db.tables.projects.find(p => p.id === pid);
    if (!project) {
      return res.status(404).json({ error: '所属项目不存在' });
    }
  }
  
  Object.assign(building, {
    project_id: project_id !== undefined ? parseInt(project_id) : building.project_id,
    name: name !== undefined ? name.trim() : building.name,
    floors: floors !== undefined ? (parseInt(floors) || 1) : building.floors,
    rooms_count: rooms_count !== undefined ? (parseInt(rooms_count) || 0) : building.rooms_count
  });
  
  res.json(building);
}));

// 删除楼栋
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '楼栋ID格式不正确' });
  }
  
  const index = db.tables.buildings.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '楼栋不存在' });
  }
  
  // 检查是否有关联房间
  const hasRooms = db.tables.rooms.some(r => r.building_id === id);
  if (hasRooms) {
    return res.status(400).json({ error: '该楼栋有关联房间，无法删除' });
  }
  
  db.tables.buildings.splice(index, 1);
  res.json({ message: '删除成功' });
}));

module.exports = router;