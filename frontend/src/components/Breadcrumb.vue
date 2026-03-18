<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '../stores/menu'

const route = useRoute()
const menuStore = useMenuStore()

const breadcrumbs = computed(() => {
  const matched = []
  const path = route.path
  
  function findInMenu(items, parentPath = '') {
    for (const item of items) {
      if (path.startsWith(item.path) && item.path !== '/') {
        matched.push({ name: item.name, path: item.path })
      }
      if (item.children) {
        findInMenu(item.children, item.path)
      }
    }
  }
  
  findInMenu(menuStore.menuData)
  return matched
})
</script>
