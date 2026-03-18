# 智慧园区 SaaS 系统

一套完整的园区管理演示系统，包含租户、项目、楼栋、合同等核心功能模块。

## 技术栈

- **后端**: Node.js + Express + SQLite
- **前端**: Vue 3 + Element Plus + Vue Router + Pinia
- **构建工具**: Vite

## 项目结构

```
park-saas/
├── backend/              # Express 后端
│   ├── server.js         # 服务入口
│   ├── routes/           # API 路由
│   │   ├── auth.js       # 认证
│   │   ├── tenants.js    # 租户管理
│   │   ├── projects.js   # 项目管理
│   │   ├── buildings.js  # 楼栋管理
│   │   ├── rooms.js      # 房间管理
│   │   └── contracts.js  # 合同管理
│   └── models/
│       └── db.js         # SQLite 数据库
├── frontend/             # Vue 3 前端
│   ├── src/
│   │   ├── views/        # 页面组件
│   │   ├── components/   # 公共组件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # Pinia 状态
│   │   └── api/          # API 封装
│   └── package.json
└── README.md
```

## 功能模块

### 1. 租户管理
- 租户列表（搜索、分页、增删改查）
- 租户详情
- 租户分析

### 2. 项目管理
- 项目列表
- 项目详情
- 项目报表

### 3. 资产管理
- 楼栋管理（列表、详情）
- 房间管理（列表、详情）

### 4. 合同管理
- 合同列表
- 合同审批（通过/驳回）
- 合同模板

### 5. 4级菜单结构
```
租户管理
├── 租户列表
├── 租户详情
└── 租户分析

项目管理
├── 项目列表
├── 项目详情
└── 项目报表

资产管理
├── 楼栋管理
│   ├── 楼栋列表
│   └── 楼栋详情
└── 房间管理
    ├── 房间列表
    └── 房间详情

合同管理
├── 合同列表
├── 合同审批
└── 合同模板
```

## 快速启动

### 1. 启动后端服务

```bash
cd backend
npm install
npm run dev
```

后端运行在: http://localhost:3001

### 2. 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端运行在: http://localhost:5173

### 3. 访问系统

打开浏览器访问: http://localhost:5173

## 默认账号

- **用户名**: admin
- **密码**: admin123

## 数据库说明

系统使用 SQLite 数据库，首次启动时会自动创建数据库并插入示例数据：

- 10+ 租户数据
- 10+ 项目数据
- 10+ 楼栋数据
- 20+ 房间数据
- 10+ 合同数据

## API 接口

### 认证
- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 获取当前用户

### 租户管理
- `GET /api/tenants` - 租户列表
- `POST /api/tenants` - 创建租户
- `GET /api/tenants/:id` - 租户详情
- `PUT /api/tenants/:id` - 更新租户
- `DELETE /api/tenants/:id` - 删除租户

### 项目管理
- `GET /api/projects` - 项目列表
- `POST /api/projects` - 创建项目
- `GET /api/projects/:id` - 项目详情
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目

### 资产管理
- `GET /api/buildings` - 楼栋列表
- `POST /api/buildings` - 创建楼栋
- `GET /api/buildings/:id` - 楼栋详情
- `PUT /api/buildings/:id` - 更新楼栋
- `DELETE /api/buildings/:id` - 删除楼栋

- `GET /api/rooms` - 房间列表
- `POST /api/rooms` - 创建房间
- `GET /api/rooms/:id` - 房间详情
- `PUT /api/rooms/:id` - 更新房间
- `DELETE /api/rooms/:id` - 删除房间

### 合同管理
- `GET /api/contracts` - 合同列表
- `POST /api/contracts` - 创建合同
- `GET /api/contracts/:id` - 合同详情
- `PUT /api/contracts/:id` - 更新合同
- `DELETE /api/contracts/:id` - 删除合同

## 开发说明

### 后端开发

```bash
cd backend
npm run dev    # 开发模式（nodemon 热更新）
```

### 前端开发

```bash
cd frontend
npm run dev    # 开发服务器
npm run build  # 生产构建
```

## 演示截图

系统包含完整的 4 级菜单导航、数据表格、表单验证、分页等功能，可直接用于演示。

## 许可证

MIT