<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>成本中心</span><el-button type="primary" size="small" @click="dialogVisible = true">新增</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="成本中心名称" />
        <el-table-column prop="project" label="所属项目" width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增成本中心" width="450px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="成本中心名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="所属项目">
          <el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width:100%"><el-option label="启用" value="active" /><el-option label="禁用" value="inactive" /></el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { financeApi } from '../../api/index.js'
const tableData = ref([])
const dialogVisible = ref(false)
const form = reactive({ name: '', project_id: '', status: 'active', remark: '' })
onMounted(async () => {
  const res = await financeApi.getCostCenters()
  if (res.success) tableData.value = res.data
})
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
}.card-header{display:flex;justify-content:space-between}</style>

