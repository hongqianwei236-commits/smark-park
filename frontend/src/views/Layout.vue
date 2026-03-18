<template>
  <el-container class="layout-container">
    <!-- 顶部导航 -->
    <el-header class="layout-header">
      <TopNav @menuChange="handleMenuChange" />
    </el-header>
    
    <el-container class="layout-body">
      <!-- 左侧二级菜单 -->
      <el-aside width="200px" class="layout-aside">
        <Sidebar :currentTopMenu="currentTopMenu" />
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '../components/TopNav.vue'
import Sidebar from '../components/Sidebar.vue'

const route = useRoute()
const currentTopMenu = ref('/dashboard')

const getTopMenuFromPath = (path) => {
  const topMenus = ['/dashboard', '/space', '/investment', '/merchant', '/contract', '/finance', '/property', '/operation']
  const match = topMenus.find(m => path.startsWith(m))
  return match || '/dashboard'
}

watch(() => route.path, (newPath) => {
  currentTopMenu.value = getTopMenuFromPath(newPath)
}, { immediate: true })

const handleMenuChange = (path) => {
  currentTopMenu.value = path
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.layout-header {
  padding: 0;
  height: 50px;
  flex-shrink: 0;
}
.layout-body {
  flex: 1;
  overflow: hidden;
}
.layout-aside {
  background-color: #263445;
  overflow-y: auto;
  flex-shrink: 0;
}
.layout-main {
  background-color: #f0f2f5;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
