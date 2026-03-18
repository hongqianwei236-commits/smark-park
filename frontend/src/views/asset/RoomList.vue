<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>房间列表</span>
          <el-button type="primary" @click="handleAdd">新增房间</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-select v-model="searchForm.buildingId" placeholder="选择楼栋" clearable>
            <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.roomNo" placeholder="房号" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="房间状态" clearable>
            <el-option label="空闲" value="vacant" />
            <el-option label="已租" value="occupied" />
            <el-option label="预留" value="reserved" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="room_no" label="房号" width="120" />
        <el-table-column prop="building_name" label="所属楼栋" min-width="150" />
        <el-table-column prop="floor" label="楼层" width="80" />
        <el-table-column prop="area" label="面积(m²)" width="100" />
        <el-table-column prop="price" label="租金(元/月)" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="所属楼栋" prop="building_id">
          <el-select v-model="form.building_id" placeholder="选择楼栋" style="width: 100%">
            <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="房号" prop="room_no">
          <el-input v-model="form.room_no" />
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input-number v-model="form.floor" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input-number v-model="form.area" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="租金" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="vacant">空闲</el-radio>
            <el-radio label="occupied">已租</el-radio>
            <el-radio label="reserved">预留</el-radio>
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
import { roomApi, buildingApi } from '../../api'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const buildingList = ref([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const searchForm = reactive({ buildingId: '', roomNo: '', status: '' })
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const formRef = ref()

const form = reactive({
  building_id: null,
  room_no: '',
  floor: 1,
  area: 0,
  price: 0,
  status: 'vacant'
})

const formRules = {
  building_id: [{ required: true, message: '请选择楼栋', trigger: 'change' }],
  room_no: [{ required: true, message: '请输入房号', trigger: 'blur' }]
}

const getStatusType = (status) => {
  const map = { vacant: 'success', occupied: 'danger', reserved: 'warning' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { vacant: '空闲', occupied: '已租', reserved: '预留' }
  return map[status] || status
}

const fetchBuildings = async () => {
  try {
    const res = await buildingApi.getList({ page: 1, pageSize: 1000 })
    buildingList.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await roomApi.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    tableData.value = res.data
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => {
  Object.assign(searchForm, { buildingId: '', roomNo: '', status: '' })
  handleSearch()
}
const handleSizeChange = (val) => { pagination.pageSize = val; fetchData() }
const handleCurrentChange = (val) => { pagination.page = val; fetchData() }

const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '新增房间'
  Object.assign(form, { building_id: null, room_no: '', floor: 1, area: 0, price: 0, status: 'vacant' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑房间'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    if (isEdit.value) {
      await roomApi.update(currentId.value, form)
    } else {
      await roomApi.create(form)
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
  router.push(`/asset/room/detail/${row.id}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该房间吗？', '提示', { type: 'warning' })
    await roomApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error(error || '删除失败')
  }
}

onMounted(() => { fetchBuildings(); fetchData() })
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>