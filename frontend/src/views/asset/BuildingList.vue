<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>楼栋列表</span>
          <el-button type="primary" @click="handleAdd">新增楼栋</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-select v-model="searchForm.project_id" placeholder="选择项目" clearable>
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.keyword" placeholder="搜索楼栋名称/编号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="楼栋名称" min-width="150" />
        <el-table-column prop="code" label="楼栋编号" width="120" />
        <el-table-column prop="project_name" label="所属项目" min-width="150" />
        <el-table-column prop="total_floors" label="总楼层" width="80" />
        <el-table-column prop="total_rooms" label="房间数" width="80" />
        <el-table-column prop="total_area" label="总面积(m²)" width="120">
          <template #default="{ row }">
            {{ row.total_area?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleManageRooms(row)">房间管理</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="form.project_id" placeholder="选择项目" style="width: 100%">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="楼栋编号" prop="code">
          <el-input v-model="form.code" placeholder="如：A栋、1号楼" />
        </el-form-item>
        <el-form-item label="总楼层" prop="total_floors">
          <el-input-number v-model="form.total_floors" :min="1" :max="100" controls-position="right" />
        </el-form-item>
        <el-form-item label="总面积" prop="total_area">
          <el-input-number v-model="form.total_area" :min="0" controls-position="right" />
          <span class="unit">m²</span>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { buildingApi, projectApi } from '../../api'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const projectList = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive({
  keyword: '',
  project_id: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const formRef = ref()

const form = reactive({
  project_id: '',
  name: '',
  code: '',
  total_floors: 1,
  total_area: 0,
  status: 'active'
})

const formRules = {
  project_id: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
  name: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入楼栋编号', trigger: 'blur' }]
}

const fetchProjects = async () => {
  try {
    const res = await projectApi.getList({ pageSize: 1000 })
    projectList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取项目列表失败')
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await buildingApi.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword,
      project_id: searchForm.project_id
    })
    tableData.value = res.data
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.project_id = ''
  handleSearch()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchData()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '新增楼栋'
  Object.assign(form, {
    project_id: '',
    name: '',
    code: '',
    total_floors: 1,
    total_area: 0,
    status: 'active'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑楼栋'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    if (isEdit.value) {
      await buildingApi.update(currentId.value, form)
    } else {
      await buildingApi.create(form)
    }
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(error || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handleView = (row) => {
  router.push(`/asset/building/detail/${row.id}`)
}

const handleManageRooms = (row) => {
  router.push(`/asset/room?building_id=${row.id}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该楼栋吗？', '提示', { type: 'warning' })
    await buildingApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error || '删除失败')
    }
  }
}

onMounted(() => {
  fetchProjects()
  fetchData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.unit {
  margin-left: 8px;
  color: #606266;
}
</style>
