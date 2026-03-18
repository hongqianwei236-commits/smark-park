const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { asyncHandler } = require('../middleware/errorHandler');

// 获取所有房间
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
  const building_id = req.query.building_id;
  const status = req.query.status;
  const keyword = req.query.keyword;
  
  let rooms = [...db.tables.rooms];
  
  // 楼栋过滤
  if (building_id) {
    const bid = parseInt(building_id);
    if (!isNaN(bid)) {
      rooms = rooms.filter(r => r.building_id === bid);
    }
  }
  
  // 状态过滤
  if (status) {
    rooms = rooms.filter(r => r.status === status);
  }
  
  // 搜索过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    rooms = rooms.filter(r => {
      const building = db.tables.buildings.find(b => b.id === r.building_id);
      return r.room_no.toLowerCase().includes(lowerKeyword) ||
             (building && building.name.toLowerCase().includes(lowerKeyword));
    });
  }
  
  const total = rooms.length;
  
  // 分页
  const offset = (page - 1) * pageSize;
  rooms = rooms.slice(offset, offset + pageSize);
  
  // 添加关联信息
  rooms = rooms.map(r => {
    const building = db.tables.buildings.find(b => b.id === r.building_id);
    const project = building ? db.tables.projects.find(p => p.id === building.project_id) : null;
    return {
      ...r,
      building_name: building?.name || '',
      project_name: project?.name || ''
    };
  });
  
  // 排序
  rooms.sort((a, b) => b.id - a.id);
  
  res.json({ data: rooms, total, page, pageSize });
}));

// 获取单个房间
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '房间ID格式不正确' });
  }
  
  const room = db.tables.rooms.find(r => r.id === id);
  if (!room) {
    return res.status(404).json({ error: '房间不存在' });
  }
  
  const building = db.tables.buildings.find(b => b.id === room.building_id);
  const project = building ? db.tables.projects.find(p => p.id === building.project_id) : null;
  
  // 获取当前合同
  const contract = db.tables.contracts.find(c => c.room_id === id && c.status === 'active');
  let contractWithTenant = null;
  if (contract) {
    const tenant = db.tables.tenants.find(t => t.id === contract.tenant_id);
    contractWithTenant = { ...contract, tenant_name: tenant?.name };
  }
  
  // 获取历史合同
  const historyContracts = db.tables.contracts
    .filter(c => c.room_id === id && c.status !== 'active')
    .map(c => {
      const tenant = db.tables.tenants.find(t => t.id === c.tenant_id);
      return { ...c, tenant_name: tenant?.name };
    })
    .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
  
  res.json({
    ...room,
    building_name: building?.name || '',
    project_name: project?.name || '',
    contract: contractWithTenant,
    historyContracts
  });
}));

// 创建房间
router.post('/', asyncHandler(async (req, res) => {
  const { building_id, room_no, floor, area, price, status = 'vacant' } = req.body;
  
  if (!building_id || !room_no) {
    return res.status(400).json({ error: '所属楼栋和房间号不能为空' });
  }
  
  const bid = parseInt(building_id);
  if (isNaN(bid)) {
    return res.status(400).json({ error: '楼栋ID格式不正确' });
  }
  
  // 检查楼栋是否存在
  const building = db.tables.buildings.find(b => b.id === bid);
  if (!building) {
    return res.status(404).json({ error: '所属楼栋不存在' });
  }
  
  const room = {
    id: db.idCounters.rooms++,
    building_id: bid,
    room_no: room_no.trim(),
    floor: parseInt(floor) || 1,
    area: parseFloat(area) || 0,
    price: parseFloat(price) || 0,
    status
  };
  
  db.tables.rooms.push(room);
  res.status(201).json(room);
}));

// 更新房间
router.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '房间ID格式不正确' });
  }
  
  const room = db.tables.rooms.find(r => r.id === id);
  if (!room) {
    return res.status(404).json({ error: '房间不存在' });
  }
  
  const { building_id, room_no, floor, area, price, status } = req.body;
  
  // 检查新楼栋是否存在
  if (building_id !== undefined) {
    const bid = parseInt(building_id);
    if (isNaN(bid)) {
      return res.status(400).json({ error: '楼栋ID格式不正确' });
    }
    const building = db.tables.buildings.find(b => b.id === bid);
    if (!building) {
      return res.status(404).json({ error: '所属楼栋不存在' });
    }
  }
  
  Object.assign(room, {
    building_id: building_id !== undefined ? parseInt(building_id) : room.building_id,
    room_no: room_no !== undefined ? room_no.trim() : room.room_no,
    floor: floor !== undefined ? (parseInt(floor) || 1) : room.floor,
    area: area !== undefined ? (parseFloat(area) || 0) : room.area,
    price: price !== undefined ? (parseFloat(price) || 0) : room.price,
    status: status !== undefined ? status : room.status
  });
  
  res.json(room);
}));

// 删除房间
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '房间ID格式不正确' });
  }
  
  const index = db.tables.rooms.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '房间不存在' });
  }
  
  // 检查是否有关联合同
  const hasContracts = db.tables.contracts.some(c => c.room_id === id);
  if (hasContracts) {
    return res.status(400).json({ error: '该房间有关联合同，无法删除' });
  }
  
  db.tables.rooms.splice(index, 1);
  res.json({ message: '删除成功' });
}));

module.exports = router;