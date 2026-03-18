const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { asyncHandler } = require('../middleware/errorHandler');

// 获取所有租户
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
  const keyword = req.query.keyword;
  
  let tenants = [...db.tables.tenants];
  
  // 搜索过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    tenants = tenants.filter(t => 
      t.name.toLowerCase().includes(lowerKeyword) ||
      (t.contact && t.contact.toLowerCase().includes(lowerKeyword)) ||
      (t.phone && t.phone.includes(keyword))
    );
  }
  
  const total = tenants.length;
  
  // 分页
  const offset = (page - 1) * pageSize;
  tenants = tenants.slice(offset, offset + pageSize);
  
  // 排序
  tenants.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  res.json({ data: tenants, total, page, pageSize });
}));

// 获取单个租户
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '租户ID格式不正确' });
  }
  
  const tenant = db.tables.tenants.find(t => t.id === id);
  if (!tenant) {
    return res.status(404).json({ error: '租户不存在' });
  }
  
  // 获取关联合同
  const contracts = db.tables.contracts
    .filter(c => c.tenant_id === id)
    .map(c => {
      const room = db.tables.rooms.find(r => r.id === c.room_id);
      const building = room ? db.tables.buildings.find(b => b.id === room.building_id) : null;
      const project = building ? db.tables.projects.find(p => p.id === building.project_id) : null;
      return {
        ...c,
        room_no: room?.room_no,
        building_name: building?.name,
        project_name: project?.name
      };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  res.json({ ...tenant, contracts });
}));

// 创建租户
router.post('/', asyncHandler(async (req, res) => {
  const { name, contact, phone, email, address, status = 'active' } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: '租户名称不能为空' });
  }
  
  // 检查名称是否已存在
  const existing = db.tables.tenants.find(t => t.name === name);
  if (existing) {
    return res.status(400).json({ error: '租户名称已存在' });
  }
  
  const tenant = {
    id: db.idCounters.tenants++,
    name: name.trim(),
    contact: contact || '',
    phone: phone || '',
    email: email || '',
    address: address || '',
    status,
    created_at: new Date().toISOString()
  };
  
  db.tables.tenants.push(tenant);
  res.status(201).json(tenant);
}));

// 更新租户
router.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '租户ID格式不正确' });
  }
  
  const tenant = db.tables.tenants.find(t => t.id === id);
  if (!tenant) {
    return res.status(404).json({ error: '租户不存在' });
  }
  
  const { name, contact, phone, email, address, status } = req.body;
  
  // 检查名称冲突
  if (name && name !== tenant.name) {
    const existing = db.tables.tenants.find(t => t.name === name && t.id !== id);
    if (existing) {
      return res.status(400).json({ error: '租户名称已存在' });
    }
  }
  
  Object.assign(tenant, {
    name: name !== undefined ? name.trim() : tenant.name,
    contact: contact !== undefined ? contact : tenant.contact,
    phone: phone !== undefined ? phone : tenant.phone,
    email: email !== undefined ? email : tenant.email,
    address: address !== undefined ? address : tenant.address,
    status: status !== undefined ? status : tenant.status
  });
  
  res.json(tenant);
}));

// 删除租户
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: '租户ID格式不正确' });
  }
  
  const index = db.tables.tenants.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '租户不存在' });
  }
  
  // 检查是否有关联合同
  const hasContracts = db.tables.contracts.some(c => c.tenant_id === id);
  if (hasContracts) {
    return res.status(400).json({ error: '该租户有关联合同，无法删除' });
  }
  
  db.tables.tenants.splice(index, 1);
  res.json({ message: '删除成功' });
}));

module.exports = router;