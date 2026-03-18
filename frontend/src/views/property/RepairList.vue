<template>
  <div class="page-container">
    <el-card>
      <template #header><span>在线报修</span></template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="building_name" label="楼宇" width="120" />
        <el-table-column prop="room_no" label="房间" width="100" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            {{ {electric:'电气',plumbing:'水暖',other:'其他'}[row.type] || row.type }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="问题描述" />
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="{ row }">
            <el-tag :type="{urgent:'danger',high:'warning',normal:'info'}[row.priority]" size="small">
              {{ {urgent:'紧急',high:'高',normal:'普通'}[row.priority] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{pending:'warning',processing:'primary',completed:'success'}[row.status]">
              {{ {pending:'待处理',processing:'处理中',completed:'已完成'}[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleProcess(row)" v-if="row.status==='pending'">处理</el-button>
            <el-button link type="success" @click="handleComplete(row)" v-if="row.status==='processing'">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api'

const loading = ref(false)
const tableData = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/property/repairs')
    if (res.success) tableData.value = res.data.list
  } finally {
    loading.value = false
  }
}

const handleProcess = async (row) => {
  await api.put(`/property/repairs/${row.id}`, { status: 'processing' })
  ElMessage.success('已开始处理')
  loadData()
}

const handleComplete = async (row) => {
  await api.put(`/property/repairs/${row.id}`, { status: 'completed' })
  ElMessage.success('已完成')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container {
  padding: 20px;
  height: calc(100vh - 50px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.page-container :deep(.el-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-container :deep(.el-card__header) {
  flex-shrink: 0;
}
.page-container :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
}
</style>

