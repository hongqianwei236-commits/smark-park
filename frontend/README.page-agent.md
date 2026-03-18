# Page Agent 测试助手说明

这是当前智慧园区前端中的轻量测试助手，用于验证 `page-agent` 在真实页面上的自动操作能力。

## 1. 配置环境变量

在 `frontend` 目录下复制一份环境文件：

- 复制 `frontend/.env.example`
- 重命名为 `frontend/.env.local`

并填写你自己的 Key：

```env
VITE_PAGE_AGENT_API_KEY=NA
VITE_PAGE_AGENT_MODEL=qwen3.5-plus
VITE_PAGE_AGENT_BASE_URL=https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run
VITE_PAGE_AGENT_LANGUAGE=zh-CN
```

如果没有配置 `VITE_PAGE_AGENT_API_KEY`，页面上的测试面板仍会显示，但无法真正执行指令。

当前文档中的默认示例使用的是 `page-agent` 官方免费测试接口，仅用于技术评估和联调验证，不可用于生产环境。

## 2. 启动方式

先启动后端，再启动前端。

### 后端

```powershell
Set-Location 'd:\code\park-saas\park-saas\backend'
npm install
npm run dev
```

### 前端

```powershell
Set-Location 'd:\code\park-saas\park-saas\frontend'
npm install
npm run dev
```

## 3. 页面入口

启动后访问前端页面，在右下角可以看到一个圆形“助”按钮。

点击后会展开测试助手面板，支持：

- 输入自然语言指令
- 点击快捷测试指令
- 查看执行状态

## 4. 推荐先测的指令

- 打开租户列表
- 搜索华为租户
- 打开项目列表
- 打开楼栋列表
- 进入合同审批页面

## 5. 当前已补稳定标识的页面

- `frontend/src/views/Login.vue`
- `frontend/src/views/tenant/TenantList.vue`

如果后续发现识别不稳定，建议继续给 `ProjectList`、`BuildingList`、`ContractApproval` 补 `data-agent` 标识。

## 6. 当前边界

- 当前是测试版，只做前端直连 `page-agent`
- API Key 当前在前端，仅适合本地验证
- 高风险操作不建议直接自动执行
