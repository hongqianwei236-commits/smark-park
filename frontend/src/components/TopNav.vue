<template>
  <div class="top-nav">
    <div class="logo">
      <el-icon :size="20"><OfficeBuilding /></el-icon>
      <span class="logo-text">智慧园区</span>
    </div>
    <div class="nav-menu">
      <div v-for="item in topMenus" :key="item.path"
           :class="['nav-item', { active: activeTopMenu === item.path }]"
           @click="handleSelect(item.path)">
        {{ item.title }}
      </div>
    </div>
    <div class="right-menu">
      <el-dropdown trigger="click">
        <span class="user-info">
          <el-icon><User /></el-icon>
          <span>管理员</span>
          <el-icon class="arrow"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const topMenus = [
  { path: '/dashboard', title: '数据中心' },
  { path: '/space', title: '空间管理' },
  { path: '/investment', title: '招商管理' },
  { path: '/merchant', title: '客商管理' },
  { path: '/contract', title: '合同管理' },
  { path: '/finance', title: '财务管理' },
  { path: '/property', title: '物业管理' },
  { path: '/operation', title: '运营管理' }
]

const activeTopMenu = computed(() => {
  const path = route.path
  const match = topMenus.find(m => path.startsWith(m.path))
  return match ? match.path : '/dashboard'
})

const emit = defineEmits(['menuChange'])

const handleSelect = (path) => {
  emit('menuChange', path)
  const firstRoutes = {
    '/dashboard': '/dashboard/overview',
    '/space': '/space/rent-control',
    '/investment': '/investment/maintenance',
    '/merchant': '/merchant/landlords',
    '/contract': '/contract/income',
    '/finance': '/finance/income',
    '/property': '/property/complaints',
    '/operation': '/operation/inout/approach'
  }
  if (firstRoutes[path]) router.push(firstRoutes[path])
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.top-nav { display: flex; align-items: center; height: 50px; background-color: #304156; padding: 0; }
.logo { display: flex; align-items: center; padding: 0 16px; color: #fff; min-width: 130px; flex-shrink: 0; }
.logo-text { margin-left: 8px; font-size: 15px; font-weight: 600; }
.nav-menu { display: flex; flex: 1; height: 100%; overflow: hidden; }
.nav-item { display: flex; align-items: center; padding: 0 12px; height: 100%; color: #bfcbd9; cursor: pointer; font-size: 14px; white-space: nowrap; transition: all 0.2s; }
.nav-item:hover { color: #fff; background-color: rgba(255, 255, 255, 0.1); }
.nav-item.active { color: #409EFF; background-color: rgba(64, 158, 255, 0.15); border-bottom: 2px solid #409EFF; }
.right-menu { padding: 0 16px; flex-shrink: 0; }
.user-info { display: flex; align-items: center; color: #bfcbd9; cursor: pointer; font-size: 14px; }
.user-info .arrow { margin-left: 4px; font-size: 12px; }
</style>
