const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ============ 收入账单 ============
router.get('/income-bills', (req, res) => {
  const { page = 1, pageSize = 10, status, tenant_id } = req.query;
  let data = db.getTable('income_bills');
  if (status) data = data.filter(b => b.status === status);
  if (tenant_id) data = data.filter(b => b.tenant_id == tenant_id);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize).map(b => {
    const tenant = db.findById('tenants', b.tenant_id);
    const contract = db.findById('contracts', b.contract_id);
    const feeType = db.findById('fee_types', b.fee_type_id);
    return { ...b, tenant_name: tenant?.name, contract_no: contract?.contract_no, fee_type_name: feeType?.name };
  });
  
  const allBills = db.getTable('income_bills');
  const stats = {
    totalAmount: allBills.reduce((sum, b) => sum + (b.amount || 0), 0),
    paidAmount: allBills.reduce((sum, b) => sum + (b.paid_amount || 0), 0),
    unpaidAmount: allBills.reduce((sum, b) => sum + ((b.amount || 0) - (b.paid_amount || 0)), 0)
  };
  
  res.json({ success: true, data: { list, total, stats } });
});

router.post('/income-bills', (req, res) => {
  const item = db.insert('income_bills', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.put('/income-bills/:id', (req, res) => {
  const item = db.update('income_bills', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

// 核销
router.post('/income-bills/:id/verify', (req, res) => {
  const { paid_amount, payment_method_id } = req.body;
  const bill = db.findById('income_bills', Number(req.params.id));
  if (!bill) return res.status(404).json({ success: false, message: '账单不存在' });
  
  const newPaid = (bill.paid_amount || 0) + paid_amount;
  const status = newPaid >= bill.amount ? 'paid' : 'partial';
  const item = db.update('income_bills', Number(req.params.id), { 
    paid_amount: newPaid, 
    status, 
    payment_method_id,
    paid_at: new Date().toISOString()
  });
  res.json({ success: true, data: item, message: '核销成功' });
});

// ============ 支出账单 ============
router.get('/expense-bills', (req, res) => {
  const { page = 1, pageSize = 10, status } = req.query;
  let data = db.getTable('expense_bills');
  if (status) data = data.filter(b => b.status === status);
  const total = data.length;
  const list = data.slice((page - 1) * pageSize, page * pageSize);
  
  const allBills = db.getTable('expense_bills');
  const stats = {
    totalAmount: allBills.reduce((sum, b) => sum + (b.amount || 0), 0),
    paidAmount: allBills.reduce((sum, b) => sum + (b.paid_amount || 0), 0),
    unpaidAmount: allBills.reduce((sum, b) => sum + ((b.amount || 0) - (b.paid_amount || 0)), 0)
  };
  
  res.json({ success: true, data: { list, total, stats } });
});

router.post('/expense-bills', (req, res) => {
  const item = db.insert('expense_bills', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});

router.put('/expense-bills/:id', (req, res) => {
  const item = db.update('expense_bills', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});

// ============ 费用类型 ============
router.get('/fee-types', (req, res) => {
  res.json({ success: true, data: db.getTable('fee_types') });
});
router.post('/fee-types', (req, res) => {
  const item = db.insert('fee_types', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});
router.put('/fee-types/:id', (req, res) => {
  const item = db.update('fee_types', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});
router.delete('/fee-types/:id', (req, res) => {
  db.delete('fee_types', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 收款方式 ============
router.get('/payment-methods', (req, res) => {
  res.json({ success: true, data: db.getTable('payment_methods') });
});
router.post('/payment-methods', (req, res) => {
  const item = db.insert('payment_methods', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});
router.put('/payment-methods/:id', (req, res) => {
  const item = db.update('payment_methods', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});
router.delete('/payment-methods/:id', (req, res) => {
  db.delete('payment_methods', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 发票类型 ============
router.get('/invoice-types', (req, res) => {
  res.json({ success: true, data: db.getTable('invoice_types') });
});
router.post('/invoice-types', (req, res) => {
  const item = db.insert('invoice_types', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});
router.put('/invoice-types/:id', (req, res) => {
  const item = db.update('invoice_types', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});
router.delete('/invoice-types/:id', (req, res) => {
  db.delete('invoice_types', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 支出科目 ============
router.get('/expense-subjects', (req, res) => {
  res.json({ success: true, data: db.getTable('expense_subjects') });
});
router.post('/expense-subjects', (req, res) => {
  const item = db.insert('expense_subjects', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});
router.put('/expense-subjects/:id', (req, res) => {
  const item = db.update('expense_subjects', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});
router.delete('/expense-subjects/:id', (req, res) => {
  db.delete('expense_subjects', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 成本中心 ============
router.get('/cost-centers', (req, res) => {
  const data = db.getTable('cost_centers').map(c => {
    const project = db.findById('projects', c.project_id);
    return { ...c, project_name: project?.name };
  });
  res.json({ success: true, data });
});
router.post('/cost-centers', (req, res) => {
  const item = db.insert('cost_centers', req.body);
  res.json({ success: true, data: item, message: '创建成功' });
});
router.put('/cost-centers/:id', (req, res) => {
  const item = db.update('cost_centers', Number(req.params.id), req.body);
  res.json({ success: true, data: item, message: '更新成功' });
});
router.delete('/cost-centers/:id', (req, res) => {
  db.delete('cost_centers', Number(req.params.id));
  res.json({ success: true, message: '删除成功' });
});

// ============ 流水管理 ============
router.get('/cash-flows', (req, res) => {
  const { type, startDate, endDate } = req.query;
  const incomeBills = db.getTable('income_bills').map(b => {
    const contract = db.findById('contracts', b.contract_id);
    const tenant = db.findById('tenants', b.tenant_id);
    const room = contract ? db.findById('rooms', contract.room_id) : null;
    const feeType = db.findById('fee_types', b.fee_type_id);
    const payMethod = db.findById('payment_methods', b.payment_method_id);
    return { ...b, type: 'income', contract_no: contract?.contract_no, room_no: room?.room_no, tenant_name: tenant?.name, fee_type_name: feeType?.name || '租金', pay_method_name: payMethod?.name };
  });
  const expenseBills = db.getTable('expense_bills').map(b => ({
    ...b, type: 'expense', bill_no: b.bill_no || `ZC${b.id}`, tenant_name: '-', room_no: '-', contract_no: '-',
    fee_type_name: b.fee_type_name || '支出'
  }));
  let data = [...incomeBills, ...expenseBills];
  if (type) data = data.filter(b => b.type === type);
  if (startDate) data = data.filter(b => b.paid_at >= startDate || b.created_at >= startDate);
  if (endDate) data = data.filter(b => b.paid_at <= endDate || b.created_at <= endDate);
  res.json({ success: true, data });
});

module.exports = router;
