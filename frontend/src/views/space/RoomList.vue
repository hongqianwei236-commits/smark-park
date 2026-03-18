<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>房源管理</span>
          <el-button type="primary" @click="handleAdd">新增房源</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="所属项目">
          <el-select v-model="searchForm.project_id" placeholder="全部" clearable @change="loadBuildings" style="width: 140px">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属楼宇">
          <el-select v-model="searchForm.building_id" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="b in buildings" :key="b.id" :label="b.name" :value="b.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 100px">
            <el-option label="可出租" value="vacant" />
            <el-option label="已出租" value="occupied" />
            <el-option label="不可出租" value="unavailable" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="project_name" label="项目" width="120" />
        <el-table-column prop="building_name" label="楼栋" width="100" />
        <el-table-column prop="floor" label="楼层" width="60" align="center" />
        <el-table-column prop="room_no" label="房号" width="80" />
        <el-table-column prop="name" label="房源名称" width="120" />
        <el-table-column prop="area" label="建筑面积(㎡)" width="100" align="right" />
        <el-table-column prop="rentable_area" label="计租面积(㎡)" width="100" align="right" />
        <el-table-column prop="inside_area" label="套内面积(㎡)" width="100" align="right" />
        <el-table-column prop="price" label="单价(元/㎡/月)" width="110" align="right" />
        <el-table-column prop="decoration" label="装修" width="80" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]" size="small">
              {{ statusLabel[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
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
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id">
              <el-select v-model="form.project_id" @change="onProjectChange" style="width: 100%">
                <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属楼栋" prop="building_id">
              <el-select v-model="form.building_id" style="width: 100%">
                <el-option v-for="b in formBuildings" :key="b.id" :label="b.name" :value="b.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="楼层" prop="floor">
              <el-input-number v-model="form.floor" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房号" prop="room_no">
              <el-input v-model="form.room_no" placeholder="如: 101" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房源名称" prop="name">
              <el-input v-model="form.name" placeholder="如: A栋101室" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数字编号">
              <el-input v-model="form.room_number" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间状态" prop="status">
              <el-select v-model="form.status" style="width: 100%">
                <el-option label="可出租" value="vacant" />
                <el-option label="已出租" value="occupied" />
                <el-option label="不可出租" value="unavailable" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟房源">
              <el-switch v-model="form.is_virtual" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">面积信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="建筑面积" prop="area">
              <el-input-number v-model="form.area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计租面积" prop="rentable_area">
              <el-input-number v-model="form.rentable_area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="套内面积">
              <el-input-number v-model="form.inside_area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">价格信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="预租单价">
              <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最低价格">
              <el-input-number v-model="form.min_price" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="装修状态">
              <el-select v-model="form.decoration" style="width: 100%">
                <el-option label="毛坯" value="毛坯" />
                <el-option label="简装" value="简装" />
                <el-option label="精装" value="精装" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
const buildings = ref([])
const formBuildings = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增房源')
const editingId = ref(null)
const formRef = ref(null)

const statusMap = { vacant: 'success', occupied: 'warning', unavailable: 'info' }
const statusLabel = { vacant: '可出租', occupied: '已出租', unavailable: '不可出租' }

const searchForm = reactive({ project_id: '', building_id: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({
  project_id: '', building_id: '', floor: 1, room_no: '', name: '', room_number: '',
  status: 'vacant', is_virtual: false, area: 0, rentable_area: 0, inside_area: 0,
  price: 0, min_price: 0, decoration: '毛坯'
})

const rules = {
  project_id: [{ required: true, message: '请选择项目', trigger: 'change' }],
  building_id: [{ required: true, message: '请选择楼栋', trigger: 'change' }],
  floor: [{ required: true, message: '请输入楼层', trigger: 'blur' }],
  room_no: [{ required: true, message: '请输入房号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入房源名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  area: [{ required: true, message: '请输入建筑面积', trigger: 'blur' }],
  rentable_area: [{ required: true, message: '请输入计租面积', trigger: 'blur' }]
}

const loadProjects = async () => {
  const res = await api.get('/space/projects', { params: { pageSize: 100 } })
  if (res.success) projects.value = res.data.list
}

const loadBuildings = async (projectId) => {
  if (!projectId) { buildings.value = []; return }
  const res = await api.get('/space/buildings', { params: { project_id: projectId, pageSize: 100 } })
  if (res.success) buildings.value = res.data.list
}

const onProjectChange = async (projectId) => {
  form.building_id = ''
  if (projectId) {
    const res = await api.get('/space/buildings', { params: { project_id: projectId, pageSize: 100 } })
    if (res.success) formBuildings.value = res.data.list
  } else {
    formBuildings.value = []
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/space/rooms', { params: { ...searchForm, ...pagination } })
    if (res.success) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增房源'
  editingId.value = null
  Object.keys(form).forEach(k => {
    form[k] = typeof form[k] === 'boolean' ? false : (typeof form[k] === 'number' ? (k === 'floor' ? 1 : 0) : '')
  })
  form.status = 'vacant'
  form.decoration = '毛坯'
  formBuildings.value = []
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  dialogTitle.value = '编辑房源'
  editingId.value = row.id
  Object.assign(form, row)
  await onProjectChange(row.project_id)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该房源？', '提示', { type: 'warning' })
  await api.delete(`/space/rooms/${row.id}`)
  ElMessage.success('删除成功')
  loadData()
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (editingId.value) {
    await api.put(`/space/rooms/${editingId.value}`, form)
    ElMessage.success('更新成功')
  } else {
    await api.post('/space/rooms', form)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  loadData()
}

onMounted(() => { loadProjects(); loadData() })
</script>

<style scoped>
.page-container { padding: 20px; height: calc(100vh - 50px); box-sizing: border-box; display: flex; flex-direction: column; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>

