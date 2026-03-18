const express = require('express');
const router = express.Router();
const db = require('../models/db');

// 工作台数据
router.get('/workbench', (req, res) => {
  const clues = db.findWhere('clues', { status: 'pending' });
  const contracts = db.getTable('contracts').filter(c => {
    const endDate = new Date(c.end_date);
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return (endDate - now) < thirtyDays && endDate > now;
  });
  const incomeBills = db.findWhere('income_bills', { status: 'overdue' });
  const repairs = db.findWhere('repairs', { status: 'pending' });
  
  res.json({
    success: true,
    data: {
      pendingClues: clues.length,
      expiringContracts: contracts.length,
      overdueBills: incomeBills.length,
      pendingRepairs: repairs.length,
      shortcuts: [
        { name: '招商线索待跟进', path: '/investment/clues', count: clues.length },
        { name: '到期合同', path: '/contract/list', count: contracts.length },
        { name: '逾期账单', path: '/finance/income', count: incomeBills.length },
        { name: '在线报修', path: '/property/repairs', count: repairs.length }
      ]
    }
  });
});

// 数据总览
router.get('/overview', (req, res) => {
  const projects = db.getTable('projects');
  const buildings = db.getTable('buildings');
  const rooms = db.getTable('rooms');
  const tenants = db.getTable('tenants');
  const contracts = db.getTable('contracts');
  
  const totalArea = projects.reduce((sum, p) => sum + (p.total_area || 0), 0);
  const rentableArea = projects.reduce((sum, p) => sum + (p.rentable_area || 0), 0);
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const occupiedArea = occupiedRooms.reduce((sum, r) => sum + (r.rentable_area || r.area || 0), 0);
  const activeContracts = contracts.filter(c => c.status === 'active');
  const totalRent = activeContracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  
  res.json({
    success: true,
    data: {
      // 面积统计
      totalArea,
      rentableArea,
      occupiedArea,
      vacantArea: rentableArea - occupiedArea,
      occupancyRate: rentableArea > 0 ? ((occupiedArea / rentableArea) * 100).toFixed(1) : 0,
      
      // 房源统计
      buildingCount: buildings.length,
      roomCount: rooms.length,
      occupiedRoomCount: occupiedRooms.length,
      vacantRoomCount: rooms.length - occupiedRooms.length,
      
      // 企业统计
      tenantCount: tenants.length,
      activeContractCount: activeContracts.length,
      
      // 财务统计
      totalRent,
      
      // 图表数据
      roomStatus: [
        { name: '已出租', value: occupiedRooms.length },
        { name: '空置', value: rooms.length - occupiedRooms.length }
      ],
      industryDistribution: [
        { name: '科技', value: 5 },
        { name: '制造', value: 3 },
        { name: '金融', value: 2 },
        { name: '医疗', value: 1 }
      ]
    }
  });
});

module.exports = router;
