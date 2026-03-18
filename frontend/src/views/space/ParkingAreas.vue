<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>区域管理</span>
          <el-button type="primary" @click="handleAdd">新增区域</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="所属停车场">
          <el-select v-model="searchForm.parking_lot_id" placeholder="全部" clearable style="width: 180px">
            <el-option v-for="lot in parkingLots" :key="lot.id" :label="lot.name" :value="lot.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="name" label="区域名称" width="150" />
        <el-table-column prop="lot_name" label="所属停车场" width="180" />
        <el-table-column prop="spaces_count" label="车位数" width="100" align="center" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="所属停车场" prop="parking_lot_id">
          <el-select v-model="form.parking_lot_id" placeholder="选择停车场" style="width: 100%">
            <el-option v-for="lot in parkingLots" :key="lot.id" :label="lot.name" :value="lot.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../../api'

const loading = ref(false)
const tableData = ref([])
const parkingLots = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增区域')
const editingId = ref(null)
const formRef = ref(null)

const searchForm = reactive({ parking_lot_id: '' })
const form = reactive({ parking_lot_id: '', name: '', remark: '' })
const rules = {
  parking_lot_id: [{ required: true, message: '请选择停车场', trigger: 'change' }],
  name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }]
}

const loadParkingLots = async () => {
  const res = await api.get('/space/parking-lots')
  if (res.success) parkingLots.value = res.data
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/space/parking-areas', { params: searchForm })
    if (res.success) tableData.value = res.data
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增区域'
  editingId.value = null
  Object.assign(form, { parking_lot_id: '', name: '', remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑区域'
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该区域？', '提示', { type: 'warning' })
  ElMessage.success('删除成功')
  loadData()
}

const handleSubmit = async () => {
  await formRef.value.validate()
  ElMessage.success(editingId.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

onMounted(() => { loadParkingLots(); loadData() })
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
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>

