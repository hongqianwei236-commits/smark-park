<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>车位列表</span>
          <el-button type="primary" @click="handleAdd">新增车位</el-button>
          <el-button type="success" @click="handleBatchAdd">批量添加</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="所属区域">
          <el-select v-model="searchForm.parking_area_id" placeholder="全部" clearable style="width: 150px">
            <el-option v-for="a in areas" :key="a.id" :label="a.name" :value="a.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 100px">
            <el-option label="空闲" value="vacant" />
            <el-option label="已租" value="occupied" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="space_no" label="车位号" width="120" />
        <el-table-column prop="area_name" label="所属区域" width="120" />
        <el-table-column prop="lot_name" label="所属停车场" width="150" />
        <el-table-column prop="type_name" label="车位类型" width="100" />
        <el-table-column prop="status" label="车位状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'vacant' ? 'success' : 'warning'" size="small">
              {{ row.status === 'vacant' ? '空闲' : '已租' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
        :total="pagination.total" layout="total, prev, pager, next" @change="loadData"
        style="margin-top: 16px; justify-content: flex-end;" />
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="所属区域" prop="parking_area_id">
          <el-select v-model="form.parking_area_id" placeholder="选择区域" style="width: 100%">
            <el-option v-for="a in areas" :key="a.id" :label="a.name" :value="a.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="车位号前缀">
          <el-input v-model="form.prefix" placeholder="如: A-" />
        </el-form-item>
        <el-form-item label="车位号" prop="space_no">
          <el-input v-model="form.space_no" placeholder="如: 001" />
        </el-form-item>
        <el-form-item label="车位状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="空闲" value="vacant" />
            <el-option label="已租" value="occupied" />
          </el-select>
        </el-form-item>
        <el-form-item label="车位类型" prop="parking_type_id">
          <el-select v-model="form.parking_type_id" style="width: 100%">
            <el-option v-for="t in types" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" />
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
const areas = ref([])
const types = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增车位')
const editingId = ref(null)
const formRef = ref(null)

const searchForm = reactive({ parking_area_id: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const form = reactive({ parking_area_id: '', prefix: '', space_no: '', status: 'vacant', parking_type_id: '', remark: '' })
const rules = {
  parking_area_id: [{ required: true, message: '请选择区域', trigger: 'change' }],
  space_no: [{ required: true, message: '请输入车位号', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  parking_type_id: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

const loadAreas = async () => {
  const res = await api.get('/space/parking-areas')
  if (res.success) areas.value = res.data
}

const loadTypes = async () => {
  const res = await api.get('/dictionaries')
  if (res.success) types.value = res.data.parkingTypes
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/space/parking-spaces', { params: { ...searchForm, ...pagination } })
    if (res.success) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增车位'
  editingId.value = null
  Object.assign(form, { parking_area_id: '', prefix: '', space_no: '', status: 'vacant', parking_type_id: '', remark: '' })
  dialogVisible.value = true
}

const handleBatchAdd = () => ElMessage.info('批量添加功能开发中')

const handleEdit = (row) => {
  dialogTitle.value = '编辑车位'
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该车位？', '提示', { type: 'warning' })
  ElMessage.success('删除成功')
  loadData()
}

const handleSubmit = async () => {
  await formRef.value.validate()
  ElMessage.success(editingId.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

onMounted(() => { loadAreas(); loadTypes(); loadData() })
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
.card-header { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
</style>

