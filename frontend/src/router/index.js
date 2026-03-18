import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/Layout.vue'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/overview',
    children: [
      // 1️⃣ 数据中心
      {
        path: 'dashboard', name: 'Dashboard', meta: { title: '数据中心', icon: 'DataAnalysis' },
        children: [
          { path: 'overview', component: () => import('../views/dashboard/Overview.vue'), meta: { title: '数据总览' } },
          {
            path: 'section', name: 'Section', meta: { title: '剖面图' },
            children: [
              { path: 'room', component: () => import('../views/dashboard/RoomView.vue'), meta: { title: '房源视图' } },
              { path: 'parking', component: () => import('../views/dashboard/ParkingView.vue'), meta: { title: '车位视图' } }
            ]
          }
        ]
      },
      // 2️⃣ 空间管理
      {
        path: 'space', name: 'Space', meta: { title: '空间管理', icon: 'OfficeBuilding' },
        children: [
          { path: 'rent-control', component: () => import('../views/space/RentControl.vue'), meta: { title: '租控管理' } },
          { path: 'projects', component: () => import('../views/space/ProjectList.vue'), meta: { title: '项目管理' } },
          { path: 'buildings', component: () => import('../views/space/BuildingList.vue'), meta: { title: '楼宇管理' } },
          { path: 'rooms', component: () => import('../views/space/RoomList.vue'), meta: { title: '房源管理' } },
          {
            path: 'parking', name: 'Parking', meta: { title: '车位管理' },
            children: [
              { path: 'lots', component: () => import('../views/space/ParkingLots.vue'), meta: { title: '停车场管理' } },
              { path: 'areas', component: () => import('../views/space/ParkingAreas.vue'), meta: { title: '区域管理' } },
              { path: 'spaces', component: () => import('../views/space/ParkingSpaces.vue'), meta: { title: '车位列表' } },
              { path: 'lease', component: () => import('../views/space/ParkingLease.vue'), meta: { title: '车位租赁' } },
              { path: 'types', component: () => import('../views/space/ParkingTypes.vue'), meta: { title: '车位类型' } },
              { path: 'signers', component: () => import('../views/space/ParkingSigners.vue'), meta: { title: '车位签订人' } }
            ]
          }
        ]
      },
      // 3️⃣ 招商管理
      {
        path: 'investment', name: 'Investment', meta: { title: '招商管理', icon: 'TrendCharts' },
        children: [
          { path: 'maintenance', component: () => import('../views/investment/Maintenance.vue'), meta: { title: '招商维护' } },
          {
            path: 'clues', name: 'Clues', meta: { title: '线索管理' },
            children: [
              { path: 'pool', component: () => import('../views/investment/CluePool.vue'), meta: { title: '线索池' } },
              { path: 'following', component: () => import('../views/investment/ClueFollowing.vue'), meta: { title: '跟进中' } },
              { path: 'intention', component: () => import('../views/investment/ClueIntention.vue'), meta: { title: '意向客户' } },
              { path: 'signed', component: () => import('../views/investment/ClueSigned.vue'), meta: { title: '已签约' } }
            ]
          },
          {
            path: 'team', name: 'Team', meta: { title: '人员管理' },
            children: [
              { path: 'list', component: () => import('../views/investment/TeamList.vue'), meta: { title: '招商团队' } },
              { path: 'staff', component: () => import('../views/investment/StaffList.vue'), meta: { title: '招商人员' } },
              { path: 'channels', component: () => import('../views/investment/ChannelList.vue'), meta: { title: '渠道管理' } }
            ]
          },
          { path: 'commission', component: () => import('../views/investment/CommissionList.vue'), meta: { title: '佣金设置' } },
          { path: 'payment', component: () => import('../views/investment/CommissionPayment.vue'), meta: { title: '佣金发放' } },
          { path: 'sources', component: () => import('../views/investment/ClueSources.vue'), meta: { title: '线索来源' } },
          { path: 'usage', component: () => import('../views/investment/RoomUsage.vue'), meta: { title: '房源用途' } },
          { path: 'paytypes', component: () => import('../views/investment/PayTypes.vue'), meta: { title: '支付类型' } }
        ]
      },
      // 4️⃣ 客商管理
      {
        path: 'merchant', name: 'Merchant', meta: { title: '客商管理', icon: 'User' },
        children: [
          { path: 'landlords', component: () => import('../views/merchant/LandlordList.vue'), meta: { title: '出租方管理' } },
          { path: 'tenants', component: () => import('../views/merchant/TenantList.vue'), meta: { title: '承租方管理' } },
          { path: 'customers', component: () => import('../views/merchant/CustomerList.vue'), meta: { title: '客户管理' } }
        ]
      },
      // 5️⃣ 合同管理
      {
        path: 'contract', name: 'Contract', meta: { title: '合同管理', icon: 'Document' },
        children: [
          { path: 'income', component: () => import('../views/contract/ContractList.vue'), meta: { title: '收入合同' } },
          { path: 'expense', component: () => import('../views/contract/ExpenseContract.vue'), meta: { title: '支出合同' } },
          { path: 'types', component: () => import('../views/contract/ContractTypes.vue'), meta: { title: '合同类型' } }
        ]
      },
      // 6️⃣ 财务管理
      {
        path: 'finance', name: 'Finance', meta: { title: '财务管理', icon: 'Money' },
        children: [
          { path: 'income', component: () => import('../views/finance/IncomeBills.vue'), meta: { title: '收入账单' } },
          { path: 'expense', component: () => import('../views/finance/ExpenseBills.vue'), meta: { title: '支出账单' } },
          { path: 'flow', component: () => import('../views/finance/CashFlow.vue'), meta: { title: '流水管理' } },
          { path: 'subjects', component: () => import('../views/finance/ExpenseSubjects.vue'), meta: { title: '支出科目' } },
          { path: 'cost-centers', component: () => import('../views/finance/CostCenters.vue'), meta: { title: '成本中心' } },
          { path: 'invoice-types', component: () => import('../views/finance/InvoiceTypes.vue'), meta: { title: '发票类型' } },
          { path: 'fee-types', component: () => import('../views/finance/FeeTypes.vue'), meta: { title: '费用类型' } },
          { path: 'payment-methods', component: () => import('../views/finance/PaymentMethods.vue'), meta: { title: '收款方式' } },
          {
            path: 'reports', name: 'Reports', meta: { title: '财务报表' },
            children: [
              { path: 'collect', component: () => import('../views/finance/ReportCollect.vue'), meta: { title: '收款分析' } },
              { path: 'expenditure', component: () => import('../views/finance/ReportExpenditure.vue'), meta: { title: '支出分析' } },
              { path: 'summary', component: () => import('../views/finance/ReportSummary.vue'), meta: { title: '账单汇总' } },
              { path: 'finance', component: () => import('../views/finance/ReportFinance.vue'), meta: { title: '财务分析' } },
              { path: 'profit', component: () => import('../views/finance/ReportProfit.vue'), meta: { title: '利润分析' } },
              { path: 'business', component: () => import('../views/finance/ReportBusiness.vue'), meta: { title: '经营报表' } }
            ]
          }
        ]
      },
      // 7️⃣ 物业管理
      {
        path: 'property', name: 'Property', meta: { title: '物业管理', icon: 'House' },
        children: [
          { path: 'complaints', component: () => import('../views/property/ComplaintList.vue'), meta: { title: '投诉建议' } },
          { path: 'repairs', component: () => import('../views/property/RepairList.vue'), meta: { title: '在线报修' } },
          { path: 'meters', component: () => import('../views/property/MeterList.vue'), meta: { title: '水电表抄表' } },
          { path: 'warehouses', component: () => import('../views/property/WarehouseList.vue'), meta: { title: '仓库管理' } },
          {
            path: 'storage', name: 'Storage', meta: { title: '仓储管理' },
            children: [
              { path: 'inventory', component: () => import('../views/property/Inventory.vue'), meta: { title: '实时库存' } },
              { path: 'purchase', component: () => import('../views/property/Purchase.vue'), meta: { title: '采购管理' } },
              { path: 'distribute', component: () => import('../views/property/Distribute.vue'), meta: { title: '派发/领用' } },
              { path: 'adjust', component: () => import('../views/property/InventoryAdjust.vue'), meta: { title: '库存调整' } },
              { path: 'items', component: () => import('../views/property/ProductItems.vue'), meta: { title: '品项管理' } },
              { path: 'units', component: () => import('../views/property/Units.vue'), meta: { title: '计量单位' } }
            ]
          },
          {
            path: 'asset', name: 'Asset', meta: { title: '资产管理' },
            children: [
              { path: 'list', component: () => import('../views/property/AssetList.vue'), meta: { title: '资产清单' } },
              { path: 'storage', component: () => import('../views/property/AssetStorage.vue'), meta: { title: '资产入库' } },
              { path: 'borrow', component: () => import('../views/property/AssetBorrow.vue'), meta: { title: '借出归还' } }
            ]
          }
        ]
      },
      // 8️⃣ 运营管理
      {
        path: 'operation', name: 'Operation', meta: { title: '运营管理', icon: 'Setting' },
        children: [
          {
            path: 'inout', name: 'InOut', meta: { title: '进出场管理' },
            children: [
              { path: 'approach', component: () => import('../views/operation/Approach.vue'), meta: { title: '入驻办理' } },
              { path: 'decoration', component: () => import('../views/operation/Decoration.vue'), meta: { title: '装修管理' } },
              { path: 'exit', component: () => import('../views/operation/Exit.vue'), meta: { title: '退租验收' } }
            ]
          },
          {
            path: 'venue', name: 'Venue', meta: { title: '场地管理' },
            children: [
              { path: 'list', component: () => import('../views/operation/VenueList.vue'), meta: { title: '场地管理' } },
              { path: 'reservation', component: () => import('../views/operation/VenueReservation.vue'), meta: { title: '预约记录' } },
              { path: 'verification', component: () => import('../views/operation/VenueVerification.vue'), meta: { title: '核销记录' } },
              { path: 'rules', component: () => import('../views/operation/VenueRules.vue'), meta: { title: '计费规则' } },
              { path: 'types', component: () => import('../views/operation/VenueTypes.vue'), meta: { title: '场地类型' } }
            ]
          },
          {
            path: 'access', name: 'Access', meta: { title: '出入管理' },
            children: [
              { path: 'passcard', component: () => import('../views/operation/PassCard.vue'), meta: { title: '出入证信息' } },
              { path: 'records', component: () => import('../views/operation/AccessRecords.vue'), meta: { title: '出入记录' } },
              { path: 'blacklist', component: () => import('../views/operation/Blacklist.vue'), meta: { title: '黑名单' } },
              { path: 'setup', component: () => import('../views/operation/PassCardSetup.vue'), meta: { title: '出入证设置' } }
            ]
          },
          { path: 'visitor', component: () => import('../views/operation/VisitorList.vue'), meta: { title: '访客预约' } },
          { path: 'activities', component: () => import('../views/operation/ActivityList.vue'), meta: { title: '活动管理' } },
          { path: 'announcements', component: () => import('../views/operation/AnnouncementList.vue'), meta: { title: '资讯公告' } },
          { path: 'companies', component: () => import('../views/operation/CompanyList.vue'), meta: { title: '入驻企业' } },
          { path: 'devices', component: () => import('../views/operation/AccessDevices.vue'), meta: { title: '门禁设备' } }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) next('/login')
  else next()
})

export default router
