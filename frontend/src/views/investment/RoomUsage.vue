<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>房源用途</span><el-button type="primary" size="small" @click="handleAdd">新增</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="房源用途名称" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }"><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增房源用途" width="400px">
      <el-form :model="form" label-width="110px" ref="formRef">
        <el-form-item label="房源用途名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status"><el-radio value="active">启用</el-radio><el-radio value="inactive">禁用</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../api'
const tableData = ref([])
const dialogVisible = ref(false)
const form = reactive({ name: '', status: 'active', remark: '' })
const handleAdd = () => { Object.assign(form, { name: '', status: 'active', remark: '' }); dialogVisible.value = true }
onMounted(async () => {
  const res = await api.get('/dictionaries')
  if (res.success) tableData.value = res.data.roomUsages || []
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

