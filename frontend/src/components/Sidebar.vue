<template>
  <el-menu :default-active="activeMenu" router background-color="#263445" text-color="#bfcbd9" active-text-color="#409EFF">
    <template v-for="item in subMenus" :key="item.path">
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
        <template #title>
          <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="item.path">
        <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps(['currentTopMenu'])
const activeMenu = computed(() => route.path)

const allMenus = {
  '/dashboard': [
    { path: '/dashboard/overview', title: '数据总览', icon: 'DataAnalysis' },
    { path: '/dashboard/section', title: '剖面图', icon: 'View',
      children: [
        { path: '/dashboard/section/room', title: '房源视图' },
        { path: '/dashboard/section/parking', title: '车位视图' }
      ]
    }
  ],
  '/space': [
    { path: '/space/rent-control', title: '租控管理', icon: 'DataBoard' },
    { path: '/space/projects', title: '项目管理', icon: 'Folder' },
    { path: '/space/buildings', title: '楼宇管理', icon: 'OfficeBuilding' },
    { path: '/space/rooms', title: '房源管理', icon: 'House' },
    { path: '/space/parking', title: '车位管理', icon: 'Location',
      children: [
        { path: '/space/parking/lots', title: '停车场管理' },
        { path: '/space/parking/areas', title: '区域管理' },
        { path: '/space/parking/spaces', title: '车位列表' },
        { path: '/space/parking/lease', title: '车位租赁' },
        { path: '/space/parking/types', title: '车位类型' },
        { path: '/space/parking/signers', title: '车位签订人' }
      ]
    }
  ],
  '/investment': [
    { path: '/investment/maintenance', title: '招商维护', icon: 'DataBoard' },
    { path: '/investment/clues', title: '线索管理', icon: 'User',
      children: [
        { path: '/investment/clues/pool', title: '线索池' },
        { path: '/investment/clues/following', title: '跟进中' },
        { path: '/investment/clues/intention', title: '意向客户' },
        { path: '/investment/clues/signed', title: '已签约' }
      ]
    },
    { path: '/investment/team', title: '人员管理', icon: 'Avatar',
      children: [
        { path: '/investment/team/list', title: '招商团队' },
        { path: '/investment/team/staff', title: '招商人员' },
        { path: '/investment/team/channels', title: '渠道管理' }
      ]
    },
    { path: '/investment/commission', title: '佣金设置', icon: 'Money' },
    { path: '/investment/payment', title: '佣金发放', icon: 'Wallet' },
    { path: '/investment/sources', title: '线索来源', icon: 'List' },
    { path: '/investment/usage', title: '房源用途', icon: 'Grid' },
    { path: '/investment/paytypes', title: '支付类型', icon: 'CreditCard' }
  ],
  '/merchant': [
    { path: '/merchant/landlords', title: '出租方管理', icon: 'UserFilled' },
    { path: '/merchant/tenants', title: '承租方管理', icon: 'User' },
    { path: '/merchant/customers', title: '客户管理', icon: 'Avatar' }
  ],
  '/contract': [
    { path: '/contract/income', title: '收入合同', icon: 'Document' },
    { path: '/contract/expense', title: '支出合同', icon: 'DocumentCopy' },
    { path: '/contract/types', title: '合同类型', icon: 'Files' }
  ],
  '/finance': [
    { path: '/finance/income', title: '收入账单', icon: 'Money' },
    { path: '/finance/expense', title: '支出账单', icon: 'Wallet' },
    { path: '/finance/flow', title: '流水管理', icon: 'DataLine' },
    { path: '/finance/subjects', title: '支出科目', icon: 'List' },
    { path: '/finance/cost-centers', title: '成本中心', icon: 'Coin' },
    { path: '/finance/invoice-types', title: '发票类型', icon: 'Tickets' },
    { path: '/finance/fee-types', title: '费用类型', icon: 'PriceTag' },
    { path: '/finance/payment-methods', title: '收款方式', icon: 'CreditCard' },
    { path: '/finance/reports', title: '财务报表', icon: 'DataAnalysis',
      children: [
        { path: '/finance/reports/collect', title: '收款分析' },
        { path: '/finance/reports/expenditure', title: '支出分析' },
        { path: '/finance/reports/summary', title: '账单汇总' },
        { path: '/finance/reports/finance', title: '财务分析' },
        { path: '/finance/reports/profit', title: '利润分析' },
        { path: '/finance/reports/business', title: '经营报表' }
      ]
    }
  ],
  '/property': [
    { path: '/property/complaints', title: '投诉建议', icon: 'ChatDotSquare' },
    { path: '/property/repairs', title: '在线报修', icon: 'Tools' },
    { path: '/property/meters', title: '水电表抄表', icon: 'Odometer' },
    { path: '/property/warehouses', title: '仓库管理', icon: 'Box' },
    { path: '/property/storage', title: '仓储管理', icon: 'Grid',
      children: [
        { path: '/property/storage/inventory', title: '实时库存' },
        { path: '/property/storage/purchase', title: '采购管理' },
        { path: '/property/storage/distribute', title: '派发/领用' },
        { path: '/property/storage/adjust', title: '库存调整' },
        { path: '/property/storage/items', title: '品项管理' },
        { path: '/property/storage/units', title: '计量单位' }
      ]
    },
    { path: '/property/asset', title: '资产管理', icon: 'Files',
      children: [
        { path: '/property/asset/list', title: '资产清单' },
        { path: '/property/asset/storage', title: '资产入库' },
        { path: '/property/asset/borrow', title: '借出归还' }
      ]
    }
  ],
  '/operation': [
    { path: '/operation/inout', title: '进出场管理', icon: 'Switch',
      children: [
        { path: '/operation/inout/approach', title: '入驻办理' },
        { path: '/operation/inout/decoration', title: '装修管理' },
        { path: '/operation/inout/exit', title: '退租验收' }
      ]
    },
    { path: '/operation/venue', title: '场地管理', icon: 'Location',
      children: [
        { path: '/operation/venue/list', title: '场地管理' },
        { path: '/operation/venue/reservation', title: '预约记录' },
        { path: '/operation/venue/verification', title: '核销记录' },
        { path: '/operation/venue/rules', title: '计费规则' },
        { path: '/operation/venue/types', title: '场地类型' }
      ]
    },
    { path: '/operation/access', title: '出入管理', icon: 'Key',
      children: [
        { path: '/operation/access/passcard', title: '出入证信息' },
        { path: '/operation/access/records', title: '出入记录' },
        { path: '/operation/access/blacklist', title: '黑名单' },
        { path: '/operation/access/setup', title: '出入证设置' }
      ]
    },
    { path: '/operation/visitor', title: '访客预约', icon: 'UserFilled' },
    { path: '/operation/activities', title: '活动管理', icon: 'Calendar' },
    { path: '/operation/announcements', title: '资讯公告', icon: 'Bell' },
    { path: '/operation/companies', title: '入驻企业', icon: 'OfficeBuilding' },
    { path: '/operation/devices', title: '门禁设备', icon: 'Monitor' }
  ]
}

const subMenus = computed(() => allMenus[props.currentTopMenu] || [])
</script>

<style scoped>
.el-menu { border-right: none; height: 100%; }
</style>
