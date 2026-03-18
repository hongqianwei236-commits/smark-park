require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { router: authRouter, authenticateToken } = require('./routes/auth');

// 新模块路由
const dashboardRouter = require('./routes/dashboard');
const spaceRouter = require('./routes/space');
const investmentRouter = require('./routes/investment');
const merchantRouter = require('./routes/merchant');
const financeRouter = require('./routes/finance');
const propertyRouter = require('./routes/property');
const operationRouter = require('./routes/operation');

// 保留原有路由
const tenantsRouter = require('./routes/tenants');
const projectsRouter = require('./routes/projects');
const buildingsRouter = require('./routes/buildings');
const roomsRouter = require('./routes/rooms');
const contractsRouter = require('./routes/contracts');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { sanitizeRequest } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3001;

// 启用 CORS
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 请求参数清理
app.use(sanitizeRequest);

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    modules: ['dashboard', 'space', 'investment', 'merchant', 'finance', 'property', 'operation']
  });
});

// 公开路由
app.use('/api/auth', authRouter);

// ============ 新模块路由 ============
// 数据中心
app.use('/api/dashboard', dashboardRouter);

// 空间管理（项目、楼宇、房源、车位）
app.use('/api/space', spaceRouter);

// 招商管理（线索、团队、渠道、佣金）
app.use('/api/investment', investmentRouter);

// 客商管理（承租方、供应商、出租方）
app.use('/api/merchant', merchantRouter);

// 财务管理（收入账单、支出账单、费用类型等）
app.use('/api/finance', financeRouter);

// 物业管理（投诉、报修、水电表、资产等）
app.use('/api/property', propertyRouter);

// 运营管理（入驻企业、场地、活动、公告等）
app.use('/api/operation', operationRouter);

// ============ 保留原有路由兼容 ============
app.use('/api/tenants', tenantsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/contracts', contractsRouter);

// ============ 字典接口 ============
const db = require('./models/db');

app.get('/api/dictionaries', (req, res) => {
  res.json({
    success: true,
    data: {
      industries: db.getTable('industries'),
      feeTypes: db.getTable('fee_types'),
      paymentMethods: db.getTable('payment_methods'),
      paymentTypes: db.getTable('payment_types'),
      clueSources: db.getTable('clue_sources'),
      roomUsages: db.getTable('room_usages'),
      parkingTypes: db.getTable('parking_types'),
      contractTypes: db.getTable('contract_types')
    }
  });
});

// 404 处理
app.use(notFoundHandler);

// 全局错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`智慧园区 SaaS 系统后端服务 v2.0`);
  console.log(`========================================`);
  console.log(`服务地址: http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================`);
  console.log(`已加载模块:`);
  console.log(`  - 数据中心: /api/dashboard`);
  console.log(`  - 空间管理: /api/space`);
  console.log(`  - 招商管理: /api/investment`);
  console.log(`  - 客商管理: /api/merchant`);
  console.log(`  - 财务管理: /api/finance`);
  console.log(`  - 物业管理: /api/property`);
  console.log(`  - 运营管理: /api/operation`);
  console.log(`========================================`);
});
