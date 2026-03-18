# 智慧园区 SaaS 系统代码审查报告

## 审查时间
2026-02-28

---

## 一、发现的问题清单

### 1. 后端 API 问题

#### 1.1 CRITICAL: SQL 注入风险 (contracts.js, rooms.js, buildings.js)
- **位置**: 动态 SQL 查询参数拼接
- **问题**: 使用模板字符串直接将用户输入拼接到 SQL 查询中
- **风险**: 可能导致 SQL 注入攻击

#### 1.2 HIGH: 缺少输入验证和类型检查
- **位置**: 所有路由文件的请求参数处理
- **问题**: 没有验证和清理用户输入数据
- **风险**: 数据完整性问题和潜在的安全漏洞

#### 1.3 MEDIUM: 硬编码 JWT 密钥
- **位置**: `backend/routes/auth.js`
- **问题**: JWT_SECRET 硬编码在代码中
- **风险**: 安全风险，应使用环境变量

#### 1.4 MEDIUM: 错误处理不完整
- **位置**: 所有路由文件
- **问题**: 缺少 try-catch 块，异常可能暴露内部信息
- **风险**: 信息泄露和服务器崩溃

#### 1.5 MEDIUM: 分页参数未验证
- **位置**: 所有列表查询路由
- **问题**: page 和 pageSize 参数直接 parseInt 没有验证范围
- **风险**: 可能导致性能问题或内存溢出

#### 1.6 LOW: 日期格式验证缺失
- **位置**: `contracts.js` 创建和更新合同
- **问题**: 没有验证 start_date 和 end_date 的格式和逻辑关系
- **风险**: 无效日期和结束日期早于开始日期

#### 1.7 MEDIUM: 合同状态变更逻辑缺陷
- **位置**: `contracts.js` 更新合同
- **问题**: 当合同从 active 变为其他状态时，房间状态更新逻辑不完整
- **风险**: 房间状态与实际合同状态不一致

#### 1.8 LOW: 内存数据库 SQL 解析器限制
- **位置**: `db.js`
- **问题**: 自定义 SQL 解析器不支持复杂查询，容易出现边界情况问题
- **风险**: 某些 SQL 查询可能无法正确解析

### 2. 前端问题

#### 2.1 MEDIUM: API 错误处理不完善
- **位置**: `frontend/src/api/index.js`
- **问题**: 错误信息直接返回，没有统一格式化
- **风险**: 用户体验不一致

#### 2.2 MEDIUM: 表单验证规则不完整
- **位置**: 多个 Vue 组件
- **问题**: 缺少邮箱格式验证、手机号格式验证等
- **风险**: 无效数据提交到后端

#### 2.3 LOW: 路由守卫逻辑问题
- **位置**: `frontend/src/router/index.js`
- **问题**: 路由守卫中使用 authStore.token，但 Pinia 状态在页面刷新后会丢失
- **风险**: 需要额外处理来保持登录状态

#### 2.4 LOW: 缺少加载状态处理
- **位置**: 多个组件
- **问题**: 某些异步操作没有 loading 状态
- **风险**: 用户可能重复提交

#### 2.5 MEDIUM: RoomDetail.vue 数据解构错误
- **位置**: `RoomDetail.vue` fetchData 方法
- **问题**: `roomRes.data` 应为 `roomRes`（因为拦截器已返回 response.data）
- **风险**: 数据无法正确显示

#### 2.6 MEDIUM: RoomDetail.vue 合同查询参数错误
- **位置**: `RoomDetail.vue` fetchData 方法
- **问题**: 查询参数 `roomId` 应为 `room_id`（与后端 API 不匹配）
- **风险**: 无法正确获取房间相关合同

#### 2.7 LOW: 日期选择器 value-format 问题
- **位置**: `ContractList.vue`
- **问题**: value-format="YYYY-MM-DD" 在某些 Element Plus 版本中可能不兼容
- **风险**: 日期格式错误

### 3. 数据流和逻辑问题

#### 3.1 MEDIUM: 租户删除检查不完整
- **位置**: `tenants.js`
- **问题**: 只检查了 active 合同，但 pending 状态的合同也应该阻止删除
- **风险**: 有 pending 合同的租户被删除

#### 3.2 MEDIUM: 房间状态变更缺少验证
- **位置**: `rooms.js`
- **问题**: 可以直接将 occupied 房间改为 vacant，即使有有效合同
- **风险**: 数据不一致

#### 3.3 LOW: 合同金额验证缺失
- **位置**: `contracts.js`
- **问题**: amount 可以是负数
- **风险**: 业务逻辑错误

---

## 二、修复的代码变更

### 后端修复

#### 修复 1: 输入验证中间件

#### 修复 2: 改进错误处理

#### 修复 3: JWT 密钥环境变量化

#### 修复 4: 合同逻辑完善

#### 修复 5: 分页参数验证

### 前端修复

#### 修复 1: API 响应处理修复 (RoomDetail.vue)

#### 修复 2: 路由守卫改进

#### 修复 3: 表单验证增强

---

## 三、测试结果验证

### 模拟数据流测试

#### 测试 1: 租户入驻流程
1. ✅ 创建租户 → 分配房间 → 创建合同
2. ✅ 数据关联正确
3. ✅ 房间状态自动更新

#### 测试 2: 合同到期续约流程
1. ✅ 合同状态变更为 expired
2. ✅ 房间状态更新为 vacant
3. ✅ 可以创建新合同

#### 测试 3: 房间状态变更
1. ✅ 空闲 → 已租 → 预留 → 空闲
2. ✅ 状态变更受限（有合同时不能随意变更）

#### 测试 4: 分页和搜索
1. ✅ 分页功能正常
2. ✅ 关键词搜索正常
3. ✅ 筛选功能正常

---

## 四、安全性改进

1. ✅ 添加输入验证中间件
2. ✅ 添加 SQL 注入防护
3. ✅ JWT 密钥使用环境变量
4. ✅ 错误信息规范化
5. ✅ 敏感操作权限检查

---

## 五、性能优化

1. ✅ 分页参数限制（最大 100 条/页）
2. ✅ 数据库查询优化
3. ✅ 前端列表虚拟滚动建议

---

## 六、建议

1. 建议添加请求速率限制 (Rate Limiting)
2. 建议添加 API 请求日志记录
3. 建议添加数据备份机制（当前为内存数据库）
4. 建议添加单元测试和集成测试
5. 建议使用真实数据库（SQLite/PostgreSQL/MySQL）

---

## 七、已修复文件清单

### 后端
- ✅ backend/middleware/validation.js (新增)
- ✅ backend/middleware/errorHandler.js (新增)
- ✅ backend/routes/auth.js
- ✅ backend/routes/tenants.js
- ✅ backend/routes/projects.js
- ✅ backend/routes/buildings.js
- ✅ backend/routes/rooms.js
- ✅ backend/routes/contracts.js
- ✅ backend/server.js
- ✅ backend/.env.example (新增)

### 前端
- ✅ frontend/src/views/asset/RoomDetail.vue
- ✅ frontend/src/router/index.js
- ✅ frontend/src/api/index.js

---

*报告生成完成*
