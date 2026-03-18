<template>
  <div class="page-container">
    <el-card>
      <template #header><span>意向客户</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="company" label="企业名称" />
        <el-table-column prop="contact" label="客户姓名" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="project" label="所属项目" width="120" />
        <el-table-column prop="industry" label="所属行业" width="100" />
        <el-table-column prop="intention_level" label="意向程度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.intention_level" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag type="warning" size="small">待审核</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="success" size="small" @click="handleSubmit(row)">提交审核</el-button>
            <el-button link type="primary" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const tableData = ref([
  { company: '新创科技', contact: '张三', phone: '13800138001', project: '科技创新园', industry: '科技', intention_level: 5, status: 'pending' }
])
const handleSubmit = async (row) => {
  await ElMessageBox.confirm('确认提交审核？', '提示')
  ElMessage.success('已提交审核')
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

