<template>
  <el-header class="header">
    <div class="left">
      <el-icon class="collapse-btn" @click="menuStore.toggleCollapse">
        <Fold v-if="!menuStore.isCollapse" />
        <Expand v-else />
      </el-icon>
      <breadcrumb />
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          {{ authStore.user?.username || '用户' }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMenuStore } from '../stores/menu'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.right {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
