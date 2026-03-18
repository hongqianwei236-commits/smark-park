<template>
  <div class="page-container">
    <el-page-header @back="goBack" title="楼栋详情" />

    <el-row :gutter="20" class="info-section">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>基本信息</span>
          </template>
          <el-descriptions :column="2" border v-loading="loading">
            <el-descriptions-item label="楼栋名称">{{ building.name }}</el-descriptions-item>
            <el-descriptions-item label="楼栋编号">{{ building.code }}</el-descriptions-item>
            <el-descriptions-item label="所属项目">{{ building.project_name }}</el-descriptions-item>
            <el-descriptions-item label="总楼层">{{ building.total_floors }}层</el-descriptions-item>
            <el-descriptions-item label="总面积">{{ building.total_area?.toLocaleString() }} m²</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="building.status === 'active' ? 'success' : 'danger'">
                {{ building.status === 'active' ? '正常' : '停用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ building.created_at }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>统计信息</span>
          </template>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-value">{{ building.total_rooms || 0 }}</div>
              <div class="stat-label">房间总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ availableRoomsCount }}</div>
              <div class="stat-label">可租赁</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="room-section">
      <template #header>
        <div class="card-header">
          <span>房间列表</span>
          <el-button type="primary" @click="handleAddRoom">新增房间</el-button>
        </div>
      </template>
      <el-table :data="rooms" border v-loading="loading">
        <el-table-column type="index" width="50" />
        <el-table-column prop="room_no" label="房间号" width="120" />
        <el-table-column prop="floor" label="楼层" width="80" />
        <el-table-column prop="area" label="面积(m²)" width="100">
          <template #default="{ row }">
            {{ row.area?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="rent_price" label="租金(元/月)" width="120">
          <template #default="{ row }">
            ¥{{ row.rent_price?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewRoom(row)">查看</el-button>
            <el-button link type="primary" @click="handleEditRoom(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDeleteRoom(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑房间对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="房间号" prop="room_no">
          <el-input v-model="form.room_no" placeholder="如：101、201A" />
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input-number v-model="form.floor" :min="1" :max="building.total_floors || 100" controls-position="right" />
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input-number v-model="form.area" :min="0" controls-position="right" />
          <span class="unit">m²</span>
        </el-form-item>
        <el-form-item label="租金" prop="rent_price">
          <el-input-number v-model="form.rent_price" :min="0" controls-position="right" />
          <span class="unit">元/月</span>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="available">可租赁</el-radio>
            <el-radio label="occupied">已出租</el-radio>
            <el-radio label="maintenance">维护中</el-radio>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { buildingApi, roomApi } from '../../api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const building = ref({})
const rooms = ref([])

const availableRoomsCount = computed(() => {
  return rooms.value.filter(r => r.status === 'available').length
})

const getStatusType = (status) => {
  const types = { available: 'success', occupied: 'danger', maintenance: 'warning' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { available: '可租赁', occupied: '已出租', maintenance: '维护中' }
  return texts[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await buildingApi.getById(route.params.id)
    building.value = res
    rooms.value = res.rooms || []
  } catch (error) {
    ElMessage.error(error || '获取数据失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

// 房间管理
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentRoomId = ref(null)
const formRef = ref()

const form = reactive({
  building_id: route.params.id,
  room_no: '',
  floor: 1,
  area: 0,
  rent_price: 0,
  status: 'available'
})

const formRules = {
  room_no: [{ required: true, message: '请输入房间号', trigger: 'blur' }],
  floor: [{ required: true, message: '请输入楼层', trigger: 'blur' }]
}

const handleAddRoom = () => {
  isEdit.value = false
  currentRoomId.value = null
  dialogTitle.value = '新增房间'
  Object.assign(form, {
    building_id: route.params.id,
    room_no: '',
    floor: 1,
    area: 0,
    rent_price: 0,
    status: 'available'
  })
  dialogVisible.value = true
}

const handleEditRoom = (row) => {
  isEdit.value = true
  currentRoomId.value = row.id
  dialogTitle.value = '编辑房间'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    if (isEdit.value) {
      await roomApi.update(currentRoomId.value, form)
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

const handleViewRoom = (row) => {
  router.push(`/asset/room/detail/${row.id}`)
}

const handleDeleteRoom = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该房间吗？', '提示', { type: 'warning' })
    await roomApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error || '删除失败')
    }
  }
}

onMounted(fetchData)
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.info-section {
  margin-top: 20px;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  margin-top: 8px;
  color: #606266;
}

.room-section {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit {
  margin-left: 8px;
  color: #606266;
}
</style>
