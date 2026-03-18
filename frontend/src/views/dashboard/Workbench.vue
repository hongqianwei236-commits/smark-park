<template>
  <div class="workbench">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in shortcuts" :key="item.name">
        <el-card class="shortcut-card" shadow="hover" @click="$router.push(item.path)">
          <div class="shortcut-content">
            <el-badge :value="item.count" :hidden="!item.count">
              <el-icon :size="40"><component :is="item.icon" /></el-icon>
            </el-badge>
            <span class="shortcut-name">{{ item.name }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>待办事项</span></template>
          <el-empty v-if="todos.length === 0" description="暂无待办事项" />
          <el-timeline v-else>
            <el-timeline-item v-for="todo in todos" :key="todo.id">
              {{ todo.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>快捷操作</span></template>
          <el-button type="primary" @click="$router.push('/investment/clues/pool')">新增线索</el-button>
          <el-button type="success" @click="$router.push('/merchant/tenants')">新增租户</el-button>
          <el-button type="warning" @click="$router.push('/contract/income')">新增合同</el-button>
          <el-button type="info" @click="$router.push('/space/rooms')">房源管理</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'

const shortcuts = ref([
  { name: '招商线索待跟进', path: '/investment/clues/pool', icon: 'User', count: 0 },
  { name: '到期合同', path: '/contract/income', icon: 'Document', count: 0 },
  { name: '逾期账单', path: '/finance/income', icon: 'Money', count: 0 },
  { name: '在线报修', path: '/property/repairs', icon: 'Tools', count: 0 }
])

const todos = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/dashboard/workbench')
    if (res.success) {
      shortcuts.value[0].count = res.data.pendingClues
      shortcuts.value[1].count = res.data.expiringContracts
      shortcuts.value[2].count = res.data.overdueBills
      shortcuts.value[3].count = res.data.pendingRepairs
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
})
</script>

<style scoped>
.workbench { padding: 20px; }
.shortcut-card { cursor: pointer; text-align: center; }
.shortcut-card:hover { transform: translateY(-2px); }
.shortcut-content { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.shortcut-name { font-size: 14px; color: #666; }
</style>
