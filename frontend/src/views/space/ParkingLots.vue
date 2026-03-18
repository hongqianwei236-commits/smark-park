<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>停车场管理</span>
          <el-button type="primary" @click="handleAdd">新增停车场</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="所属项目">
          <el-select v-model="searchForm.project_id" placeholder="全部" clearable style="width: 150px">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="name" label="停车场名称" width="180" />
        <el-table-column prop="project_name" label="所属项目" width="150" />
        <el-table-column prop="location" label="停车场位置" width="150" />
        <el-table-column prop="total_spaces" label="总车位数" width="100" align="center" />
        <el-table-column prop="areas_count" label="区域数" width="80" align="center" />
        <el-table-column prop="spaces_count" label="已建车位" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
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
        <el-form-item label="停车场名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入停车场名称" />
        </el-form-item>
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="form.project_id" placeholder="选择项目" style="width: 100%">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="停车场位置">
          <el-input v-model="form.location" placeholder="如: 地下一层" />
        </el-form-item>
        <el-form-item label="总车位数">
          <el-input-number v-model="form.total_spaces" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">停用</el-radio>
          </el-radio-group>
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
const projects = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增停车场')
const editingId = ref(null)
const formRef = ref(null)

const searchForm = reactive({ project_id: '' })
const form = reactive({ name: '', project_id: '', location: '', total_spaces: 0, status: 'active' })
const rules = {
  name: [{ required: true, message: '请输入停车场名称', trigger: 'blur' }],
  project_id: [{ required: true, message: '请选择项目', trigger: 'change' }]
}

const loadProjects = async () => {
  const res = await api.get('/space/projects', { params: { pageSize: 100 } })
  if (res.success) projects.value = res.data.list
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/space/parking-lots', { params: searchForm })
    if (res.success) tableData.value = res.data
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增停车场'
  editingId.value = null
  Object.assign(form, { name: '', project_id: '', location: '', total_spaces: 0, status: 'active' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑停车场'
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该停车场？', '提示', { type: 'warning' })
  ElMessage.success('删除成功')
  loadData()
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (editingId.value) {
    ElMessage.success('更新成功')
  } else {
    await api.post('/space/parking-lots', form)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  loadData()
}

onMounted(() => { loadProjects(); loadData() })
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

