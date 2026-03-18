# 智慧园区管理系统 API 文档

## 基础信息

- **Base URL**: `/api`
- **默认端口**: 3000
- **提示**: 所有返回均为 JSON 格式

---

## 认证 API

### 1. 用户登录
- **URL**: `POST /auth/login`
- **参数**: `{ username, password }`
- **返回**: `{ success, data: { id, name, token }, message }`

### 2. 用户登出
- **URL**: `POST /auth/logout`
- **参数**: 无
- **返回**: `{ success, message }`

### 3. 获取当前用户信息
- **URL**: `GET /auth/me`
- **参数**: 无
- **返回**: `{ success, data: { id, name, role } }`

---

## 项目与空间 API

### 项目管理
- **列表**: `GET /projects` (支持分页、搜索)
- **详情**: `GET /projects/:id`
- **新增**: `POST /projects`
- **编辑**: `PUT /projects/:id`
- **删除**: `DELETE /projects/:id`

### 楼栋管理
- **列表**: `GET /buildings` (支持项目过滤)
- **详情**: `GET /buildings/:id` (含房间统计)
- **新增**: `POST /buildings`
- **编辑**: `PUT /buildings/:id`
- **删除**: `DELETE /buildings/:id`

### 房间管理
- **列表**: `GET /rooms` (支持楼栋、状态、关键词过滤)
- **详情**: `GET /rooms/:id` (含合同详情)
- **新增**: `POST /rooms`
- **编辑**: `PUT /rooms/:id`
- **删除**: `DELETE /rooms/:id`

### 停车位管理
- **停车场列表**: `GET /space/parking-lots`
- **停车区域列表**: `GET /space/parking-areas`
- **停车位列表**: `GET /space/parking-spaces` (支持分页、状态过滤)
- **停车位类型**: `GET /space/parking-lots` (included types)

---

## 租户与商户 API

### 承租方管理
- **列表**: `GET /merchant/tenants` (支持类型、关键词过滤)
- **详情**: `GET /merchant/tenants/:id` (含合同列表)
- **新增**: `POST /merchant/tenants`
- **编辑**: `PUT /merchant/tenants/:id`
- **删除**: `DELETE /merchant/tenants/:id`

### 出租方管理
- **列表**: `GET /merchant/landlords`
- **新增**: `POST /merchant/landlords`
- **编辑**: `PUT /merchant/landlords/:id`
- **删除**: `DELETE /merchant/landlords/:id`

### 供应商管理
- **列表**: `GET /merchant/suppliers` (支持关键词过滤)
- **新增**: `POST /merchant/suppliers`
- **编辑**: `PUT /merchant/suppliers/:id`
- **删除**: `DELETE /merchant/suppliers/:id`

---

## 合同管理 API

### 合同管理
- **列表**: `GET /contracts` (支持租户、房间、状态、关键词过滤)
- **详情**: `GET /contracts/:id`
- **新增**: `POST /contracts`
- **编辑**: `PUT /contracts/:id`

### 合同类型
- **列表**: `GET /contracts/types`
- **新增**: `POST /contracts/types`
- **编辑**: `PUT /contracts/types/:id`
- **删除**: `DELETE /contracts/types/:id`

---

## 财务管理 API

### 收入账单
- **列表**: `GET /finance/income-bills` (支持状态、租户过滤、分页)
- **新增**: `POST /finance/income-bills`
- **编辑**: `PUT /finance/income-bills/:id`
- **核销**: `POST /finance/income-bills/:id/verify` (参数: `paid_amount`, `payment_method_id`)

### 支出账单
- **列表**: `GET /finance/expense-bills` (支持状态过滤、分页)
- **新增**: `POST /finance/expense-bills`
- **编辑**: `PUT /finance/expense-bills/:id`

### 流水管理
- **列表**: `GET /finance/cash-flows` (支持类型、日期范围过滤)

### 财务字典
| 接口 | 列表 | 新增 | 编辑 | 删除 |
|------|------|------|------|------|
| 费用类型 | `GET /finance/fee-types` | `POST` | `PUT /:id` | `DELETE /:id` |
| 收款方式 | `GET /finance/payment-methods` | `POST` | `PUT /:id` | `DELETE /:id` |
| 发票类型 | `GET /finance/invoice-types` | `POST` | `PUT /:id` | `DELETE /:id` |
| 支出科目 | `GET /finance/expense-subjects` | `POST` | `PUT /:id` | `DELETE /:id` |
| 成本中心 | `GET /finance/cost-centers` | `POST` | `PUT /:id` | `DELETE /:id` |

---

## 招商管理 API

### 招商线索
- **列表**: `GET /investment/clues` (支持状态、项目、关键词过滤)
- **详情**: `GET /investment/clues/:id`
- **新增**: `POST /investment/clues`
- **编辑**: `PUT /investment/clues/:id`
- **状态变更**: `PUT /investment/clues/:id/status` (参数: `status`)

### 招商团队
- **列表**: `GET /investment/teams` (支持项目过滤)
- **新增**: `POST /investment/teams`
- **编辑**: `PUT /investment/teams/:id`
- **删除**: `DELETE /investment/teams/:id`

### 招商人员
- **列表**: `GET /investment/staff`
- **新增**: `POST /investment/staff`
- **编辑**: `PUT /investment/staff/:id`
- **删除**: `DELETE /investment/staff/:id`

### 渠道管理
- **列表**: `GET /investment/channels`
- **新增**: `POST /investment/channels`

### 佣金设置
- **列表**: `GET /investment/commissions`
- **新增**: `POST /investment/commissions`

### 招商维护
- **数据**: `GET /investment/maintenance` (支持项目过滤，返回项目维护数据)

---

## 物业管理 API

### 投诉建议
- **列表**: `GET /property/complaints` (支持类型、状态过滤)
- **编辑**: `PUT /property/complaints/:id`

### 报修管理
- **列表**: `GET /property/repairs` (支持状态、类型过滤)
- **新增**: `POST /property/repairs`
- **编辑**: `PUT /property/repairs/:id`

### 仪表管理
- **列表**: `GET /property/meters` (支持房间、类型过滤)
- **新增**: `POST /property/meters`

### 仓库/资产/巡更/文档
- **列表**: `GET /property/{warehouses|assets|patrol-routes|documents}`
- **新增**: `POST /property/{...}`

---

## 运营管理 API

### 场地管理
- **列表**: `GET /operation/venues` (支持过滤)
- **新增**: `POST /operation/venues`

### 活动管理
- **列表**: `GET /operation/activities`
- **新增**: `POST /operation/activities`

### 公告管理
- **列表**: `GET /operation/announcements` (支持类型过滤)
- **新增**: `POST /operation/announcements`
- **删除**: `DELETE /operation/announcements/:id`

### 其他运营接口
- **已入驻公司**: `GET /operation/settled-companies`
- **场地预订**: `GET /operation/venue-reservations`
- **访客记录**: `GET /operation/visitors`
- **门禁设备**: `GET /operation/access-devices`

---

## 仪表板 API

### 工作台
- **URL**: `GET /dashboard/workbench`
- **返回**: 待处理线索、将到期合同、逾期账单、待处理报修统计

### 概览统计
- **URL**: `GET /dashboard/overview`
- **返回**: 面积统计、房间分布、行业分析等

---

## 通用查询参数

### 分页参数
```
page=1              // 页码，默认 1
pageSize=10         // 每页条数，默认 10
```

### 过滤示例
```
GET /investment/clues?status=pending&project_id=1&keyword=张三
GET /finance/income-bills?page=2&pageSize=20&status=paid
GET /contracts?tenant_id=1&room_id=5&status=active
```

---

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "操作成功"
}
```

### 分页响应
```json
{
  "success": true,
  "data": {
    "list": [ /* ... */ ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息",
  "message": "详细说明"
}
```

---

## 常见状态值

### 合同状态
- `draft` - 草稿
- `active` - 执行中
- `expired` - 已到期
- `terminated` - 已退租

### 招商线索状态
- `pending` - 待分配
- `following` - 跟进中
- `intention` - 意向客户
- `signed` - 已签约

### 房间状态
- `vacant` - 空闲
- `occupied` - 占用
- `reserved` - 预留

### 账单状态
- `unpaid` - 未支付
- `partial` - 部分支付
- `paid` - 已支付

### 工作单状态
- `pending` - 待处理
- `processing` - 处理中
- `completed` - 已完成

---

## 数据库表一览

| 模块 | 表名 | 说明 |
|------|------|------|
| 认证 | users, roles, permissions | 用户与权限 |
| 空间 | projects, buildings, rooms | 项目、楼栋、房间 |
| 停车 | parking_lots, parking_areas, parking_spaces | 停车场管理 |
| 商户 | tenants, landlords, suppliers | 租户、房东、供应商 |
| 合同 | contracts, contract_types | 合同与合同类型 |
| 财务 | income_bills, expense_bills, cash_flows | 收支账单、流水 |
| 财务字典 | fee_types, payment_methods, invoice_types | 费用、支付、发票类型 |
| 支出 | expense_subjects, cost_centers | 支出科目、成本中心 |
| 招商 | investment_teams, investment_users, clues, channels, commissions | 团队、人员、线索、渠道、佣金 |
| 物业 | complaints, repairs, meters, warehouses, assets | 投诉、报修、仪表、仓库、资产 |
| 运营 | venues, activities, announcements, settled_companies | 场地、活动、公告、已入驻 |
| 字典 | clue_sources, room_usages, payment_types, industries | 线索来源、房间用途、支付类型、行业 |

---

## 快速开始

### 1. 启动后端服务
```bash
cd backend
npm install
npm start
# 服务运行在 http://localhost:3000
```

### 2. 启动前端开发服务
```bash
cd frontend
npm install
npm run dev
# 开发服务运行在 http://localhost:5173
```

### 3. 默认登录凭证
- **用户名**: `admin`
- **密码**: `admin123`

---

## 联系与支持

有问题或需要扩展接口，请提出 Issue 或联系开发团队。
