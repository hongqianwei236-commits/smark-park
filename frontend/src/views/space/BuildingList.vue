<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>楼宇管理</span>
          <el-button type="primary" @click="handleAdd">新增楼宇</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="所属项目">
          <el-select v-model="searchForm.project_id" placeholder="全部项目" clearable style="width: 150px">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="楼宇名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="name" label="楼宇名称" width="150" />
        <el-table-column prop="project_name" label="所属项目" width="150" />
        <el-table-column prop="code" label="楼宇编号" width="100" />
        <el-table-column prop="property_nature" label="产权性质" width="100" />
        <el-table-column prop="total_area" label="管理面积(㎡)" width="120" align="right">
          <template #default="{ row }">{{ row.total_area?.toLocaleString() || 0 }}</template>
        </el-table-column>
        <el-table-column prop="rentable_area" label="计租面积(㎡)" width="120" align="right">
          <template #default="{ row }">{{ row.rentable_area?.toLocaleString() || 0 }}</template>
        </el-table-column>
        <el-table-column prop="floors" label="楼层数" width="80" align="center" />
        <el-table-column prop="room_count" label="房间数" width="80" align="center" />
        <el-table-column prop="occupancy_rate" label="出租率" width="80" align="center">
          <template #default="{ row }">
            <span :class="row.occupancy_rate > 80 ? 'text-success' : ''">{{ row.occupancy_rate || 0 }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @change="loadData"
        style="margin-top: 16px; justify-content: flex-end;"
      />
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-divider content-position="left">基础信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id">
              <el-select v-model="form.project_id" placeholder="选择项目" style="width: 100%">
                <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入楼宇名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产权性质" prop="property_nature">
              <el-select v-model="form.property_nature" placeholder="选择产权性质" style="width: 100%">
                <el-option label="自持" value="自持" />
                <el-option label="租赁" value="租赁" />
                <el-option label="合作" value="合作" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼宇编号">
              <el-input v-model="form.code" placeholder="如: A001" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="楼宇地址">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼层数">
              <el-input-number v-model="form.floors" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="不动产证编号">
              <el-input v-model="form.property_cert_no" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产权编号">
              <el-input v-model="form.property_right_no" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="土地编号">
          <el-input v-model="form.land_no" />
        </el-form-item>
        
        <el-divider content-position="left">楼宇面积</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="管理面积" prop="total_area">
              <el-input-number v-model="form.total_area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权面积">
              <el-input-number v-model="form.property_area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可租面积">
              <el-input-number v-model="form.rentable_area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="自用面积">
              <el-input-number v-model="form.self_use_area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配套面积">
              <el-input-number v-model="form.supporting_area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车位数量">
              <el-input-number v-model="form.parking_count" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort_order" :min="0" style="width: 200px" />
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
const dialogTitle = ref('新增楼宇')
const editingId = ref(null)
const formRef = ref(null)

const searchForm = reactive({ project_id: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({
  project_id: '', name: '', code: '', property_nature: '', address: '', floors: 1,
  property_cert_no: '', property_right_no: '', land_no: '',
  total_area: 0, property_area: 0, rentable_area: 0, self_use_area: 0, supporting_area: 0,
  parking_count: 0, sort_order: 0
})

const rules = {
  project_id: [{ required: true, message: '请选择项目', trigger: 'change' }],
  name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
  property_nature: [{ required: true, message: '请选择产权性质', trigger: 'change' }],
  total_area: [{ required: true, message: '请输入管理面积', trigger: 'blur' }]
}

const loadProjects = async () => {
  const res = await api.get('/space/projects', { params: { pageSize: 100 } })
  if (res.success) projects.value = res.data.list
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/space/buildings', { params: { ...searchForm, ...pagination } })
    if (res.success) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增楼宇'
  editingId.value = null
  Object.keys(form).forEach(k => form[k] = typeof form[k] === 'number' ? (k === 'floors' ? 1 : 0) : '')
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑楼宇'
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该楼宇？', '提示', { type: 'warning' })
  await api.delete(`/space/buildings/${row.id}`)
  ElMessage.success('删除成功')
  loadData()
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (editingId.value) {
    await api.put(`/space/buildings/${editingId.value}`, form)
    ElMessage.success('更新成功')
  } else {
    await api.post('/space/buildings', form)
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
.text-success { color: #67c23a; font-weight: bold; }
</style>

