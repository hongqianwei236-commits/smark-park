<template>
  <div class="page-container">
    <el-card>
      <template #header><span>投诉建议</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="tenant" label="投诉人" width="120" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }"><el-tag :type="row.type === 'complaint' ? 'danger' : 'success'" size="small">{{ row.type === 'complaint' ? '投诉' : '建议' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200" />
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="{ row }"><el-tag :type="{urgent:'danger',high:'warning',normal:'info'}[row.priority]" size="small">{{ {urgent:'紧急',high:'高',normal:'普通'}[row.priority] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="{pending:'warning',processing:'primary',completed:'success'}[row.status]" size="small">{{ {pending:'待处理',processing:'处理中',completed:'已完成'}[row.status] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="140" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleProcess(row)" v-if="row.status === 'pending'">处理</el-button>
            <el-button link type="success" size="small" @click="handleComplete(row)" v-if="row.status === 'processing'">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { propertyApi } from '../../api/index.js'
const tableData = ref([])
onMounted(async () => {
  const res = await propertyApi.getComplaints()
  if (res.success) tableData.value = res.data
})
const handleProcess = async (row) => {
  const res = await propertyApi.updateComplaint(row.id, { status: 'processing' })
  if (res.success) { row.status = 'processing'; ElMessage.success('已开始处理') }
}
const handleComplete = async (row) => {
  const res = await propertyApi.updateComplaint(row.id, { status: 'completed' })
  if (res.success) { row.status = 'completed'; ElMessage.success('处理完成') }
}
</script>
<style scoped>.page-container {
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
}</style>

