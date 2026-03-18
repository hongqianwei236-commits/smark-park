<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>合同类型</span>
          <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="合同类型名称" />
        <el-table-column prop="cycle_type" label="周期类型" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增合同类型" width="450px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="类型名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="周期类型" prop="cycle_type">
          <el-select v-model="form.cycle_type" style="width: 100%">
            <el-option label="按月" value="monthly" />
            <el-option label="按季度" value="quarterly" />
            <el-option label="按年" value="yearly" />
            <el-option label="一次性" value="once" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { contractTypeApi } from '../../api/index.js'

const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref(null)
const form = reactive({ name: '', cycle_type: 'monthly', status: 'active', remark: '' })
const rules = { name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }] }

onMounted(async () => {
  const res = await contractTypeApi.getList()
  if (res.success) tableData.value = res.data
})

const handleAdd = () => {
  isEdit.value = false; editId.value = null
  Object.assign(form, { name: '', cycle_type: 'monthly', status: 'active', remark: '' })
  dialogVisible.value = true
}
const handleEdit = (row) => {
  isEdit.value = true; editId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}
const handleSubmit = async () => {
  await formRef.value?.validate()
  if (isEdit.value) {
    const res = await contractTypeApi.update(editId.value, form)
    if (res.success) { const idx = tableData.value.findIndex(r => r.id === editId.value); if (idx >= 0) tableData.value[idx] = res.data }
  } else {
    const res = await contractTypeApi.create(form)
    if (res.success) tableData.value.push(res.data)
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
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
}.card-header { display: flex; justify-content: space-between; }</style>

