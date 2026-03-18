<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>仓库管理</span><el-button type="primary" size="small" @click="handleAdd">新增仓库</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="project" label="所属项目" width="150" />
        <el-table-column prop="type" label="仓库类型" width="100">
          <template #default="{ row }"><el-tag size="small">{{ row.type === 'storage' ? '仓储仓库' : '资产仓库' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="location" label="仓库位置" width="150" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增仓库" width="450px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="仓库名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select>
        </el-form-item>
        <el-form-item label="仓库类型" prop="type">
          <el-radio-group v-model="form.type"><el-radio value="storage">仓储仓库</el-radio><el-radio value="asset">资产仓库</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="仓库位置"><el-input v-model="form.location" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ name: 'A栋仓库', project: '科技创新园', type: 'storage', location: 'A栋负一层', remark: '' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ name: '', project_id: '', type: 'storage', location: '', remark: '' })
const rules = { name: [{ required: true }], project_id: [{ required: true }], type: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = typeof form[k] === 'number' ? 0 : ''); form.type = 'storage'; dialogVisible.value = true }
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

