const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { asyncHandler } = require('../middleware/errorHandler');

// 合同类型
router.get('/types', (req, res) => {
  res.json({ success: true, data: db.getTable('contract_types') });
});
router.post('/types', (req, res) => {
  const item = db.insert('contract_types', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});
router.put('/types/:id', (req, res) => {
  const item = db.update('contract_types', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});
router.delete('/types/:id', (req, res) => {
  db.delete('contract_types', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// 获取所有合同
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
  const tenant_id = req.query.tenant_id;
  const room_id = req.query.room_id;
  const status = req.query.status;
  const keyword = req.query.keyword;
  
  let contracts = [...db.tables.contracts];
  
  // 租户过滤
  if (tenant_id) {
    const tid = parseInt(tenant_id);
    if (!isNaN(tid)) {
      contracts = contracts.filter(c => c.tenant_id === tid);
    }
  }
  
  // 房间过滤
  if (room_id) {
    const rid = parseInt(room_id);
    if (!isNaN(rid)) {
      contracts = contracts.filter(c => c.room_id === rid);
    }
  }
  
  // 状态过滤
  if (status) {
    contracts = contracts.filter(c => c.status === status);
  }
  
  // 搜索过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    contracts = contracts.filter(c => {
      const tenant = db.tables.tenants.find(t => t.id === c.tenant_id);
      const room = db.tables.rooms.find(r => r.id === c.room_id);
      return (tenant && tenant.name.toLowerCase().includes(lowerKeyword)) ||
             (room && room.room_no.toLowerCase().includes(lowerKeyword));
    });
  }
  
  const total = contracts.length;
  
  // 分页
  const offset = (page - 1) * pageSize;
  contracts = contracts.slice(offset, offset + pageSize);
  
  // 添加关联信息
  contracts = contracts.map(c => {
    const tenant = db.tables.tenants.find(t => t.id === c.tenant_id);
    const room = db.tables.rooms.find(r => r.id === c.room_id);
    const building = room ? db.tables.buildings.find(b => b.id === room.building_id) : null;
    const project = building ? db.tables.projects.find(p => p.id === building.project_id) : null;
    return {
      ...c,
      tenant_name: tenant?.name || '',
      room_no: room?.room_no || '',
      building_name: building?.name || '',
      project_name: project?.name || ''
    };
  });
  
  // 排序
  contracts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  res.json({ data: contracts, total, page, pageSize });
}));

// 获取单个合同
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '合同ID格式不正确' });
  }
  
  const contract = db.tables.contracts.find(c => c.id === id);
  if (!contract) {
    return res.status(404).json({ error: '合同不存在' });
  }
  
  const tenant = db.tables.tenants.find(t => t.id === contract.tenant_id);
  const room = db.tables.rooms.find(r => r.id === contract.room_id);
  const building = room ? db.tables.buildings.find(b => b.id === room.building_id) : null;
  const project = building ? db.tables.projects.find(p => p.id === building.project_id) : null;
  
  res.json({
    ...contract,
    tenant_name: tenant?.name || '',
    tenant_contact: tenant?.contact || '',
    tenant_phone: tenant?.phone || '',
    room_no: room?.room_no || '',
    floor: room?.floor || '',
    area: room?.area || '',
    price: room?.price || '',
    building_name: building?.name || '',
    project_name: project?.name || ''
  });
}));

// 创建合同
router.post('/', asyncHandler(async (req, res) => {
  const { tenant_id, room_id, start_date, end_date, amount, status = 'active' } = req.body;
  
  // 验证必填字段
  if (!tenant_id || !room_id || !start_date || !end_date) {
    return res.status(400).json({ error: '租户、房间、开始日期和结束日期不能为空' });
  }
  
  const tid = parseInt(tenant_id);
  const rid = parseInt(room_id);
  
  if (isNaN(tid) || isNaN(rid)) {
    return res.status(400).json({ error: '租户ID或房间ID格式不正确' });
  }
  
  // 检查租户是否存在
  const tenant = db.tables.tenants.find(t => t.id === tid);
  if (!tenant) {
    return res.status(404).json({ error: '租户不存在' });
  }
  
  // 检查房间是否存在
  const room = db.tables.rooms.find(r => r.id === rid);
  if (!room) {
    return res.status(404).json({ error: '房间不存在' });
  }
  
  // 检查房间是否已有有效合同
  if (status === 'active') {
    const existingContract = db.tables.contracts.find(c => c.room_id === rid && c.status === 'active');
    if (existingContract) {
      return res.status(400).json({ error: '该房间已有有效合同' });
    }
  }
  
  const contract = {
    id: db.idCounters.contracts++,
    tenant_id: tid,
    room_id: rid,
    start_date,
    end_date,
    amount: parseFloat(amount) || 0,
    status,
    created_at: new Date().toISOString()
  };
  
  db.tables.contracts.push(contract);
  
  // 更新房间状态
  if (status === 'active') {
    room.status = 'occupied';
  } else if (status === 'reserved') {
    room.status = 'reserved';
  }
  
  res.status(201).json(contract);
}));

// 更新合同
router.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '合同ID格式不正确' });
  }
  
  const contract = db.tables.contracts.find(c => c.id === id);
  if (!contract) {
    return res.status(404).json({ error: '合同不存在' });
  }
  
  const { tenant_id, room_id, start_date, end_date, amount, status } = req.body;
  
  // 验证新租户和房间
  if (tenant_id !== undefined) {
    const tid = parseInt(tenant_id);
    if (isNaN(tid)) {
      return res.status(400).json({ error: '租户ID格式不正确' });
    }
    const tenant = db.tables.tenants.find(t => t.id === tid);
    if (!tenant) {
      return res.status(404).json({ error: '租户不存在' });
    }
  }
  
  if (room_id !== undefined) {
    const rid = parseInt(room_id);
    if (isNaN(rid)) {
      return res.status(400).json({ error: '房间ID格式不正确' });
    }
    const room = db.tables.rooms.find(r => r.id === rid);
    if (!room) {
      return res.status(404).json({ error: '房间不存在' });
    }
  }
  
  const oldRoomId = contract.room_id;
  const oldStatus = contract.status;
  
  Object.assign(contract, {
    tenant_id: tenant_id !== undefined ? parseInt(tenant_id) : contract.tenant_id,
    room_id: room_id !== undefined ? parseInt(room_id) : contract.room_id,
    start_date: start_date !== undefined ? start_date : contract.start_date,
    end_date: end_date !== undefined ? end_date : contract.end_date,
    amount: amount !== undefined ? (parseFloat(amount) || 0) : contract.amount,
    status: status !== undefined ? status : contract.status
  });
  
  // 更新房间状态
  const room = db.tables.rooms.find(r => r.id === contract.room_id);
  if (room) {
    if (contract.status === 'active') {
      room.status = 'occupied';
    } else if (contract.status === 'expired') {
      room.status = 'vacant';
    }
  }
  
  // 如果房间变更，重置原房间状态
  if (room_id !== undefined && oldRoomId !== contract.room_id) {
    const oldRoom = db.tables.rooms.find(r => r.id === oldRoomId);
    if (oldRoom) {
      oldRoom.status = 'vacant';
    }
  }
  
  res.json(contract);
}));

// 删除合同
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '合同ID格式不正确' });
  }
  
  const index = db.tables.contracts.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '合同不存在' });
  }
  
  const contract = db.tables.contracts[index];
  
  // 将房间状态重置为空闲
  const room = db.tables.rooms.find(r => r.id === contract.room_id);
  if (room) {
    room.status = 'vacant';
  }
  
  db.tables.contracts.splice(index, 1);
  res.json({ message: '删除成功' });
}));

module.exports = router;