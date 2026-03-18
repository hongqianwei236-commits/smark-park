<template>
  <div class="page-container">
    <el-page-header @back="goBack" title="房间详情" />
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>基本信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="房间ID">{{ room.id }}</el-descriptions-item>
            <el-descriptions-item label="房号">{{ room.room_no }}</el-descriptions-item>
            <el-descriptions-item label="所属楼栋">{{ room.building_name }}</el-descriptions-item>
            <el-descriptions-item label="楼层">{{ room.floor }}层</el-descriptions-item>
            <el-descriptions-item label="面积">{{ room.area }} m²</el-descriptions-item>
            <el-descriptions-item label="租金">
              <span style="color: #f56c6c; font-weight: bold">¥{{ room.price }}</span> /月
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(room.status)">
                {{ getStatusText(room.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ room.created_at }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>状态概览</span>
          </template>
          <div class="status-box">
            <el-statistic title="房间状态" :value="getStatusText(room.status)">
              <template #prefix>
                <el-icon :size="20" :color="getStatusColor(room.status)"><House /></el-icon>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>当前合同</span>
      </template>
      <el-table :data="contracts" v-loading="loading" border>
        <el-table-column prop="id" label="合同编号" width="100" />
        <el-table-column prop="tenant_name" label="租户" min-width="150" />
        <el-table-column prop="start_date" label="开始日期" width="120" />
        <el-table-column prop="end_date" label="结束日期" width="120" />
        <el-table-column prop="amount" label="合同金额" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '生效中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="contracts.length === 0 && !loading" description="暂无合同" />
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>历史记录</span>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in history"
          :key="index"
          :type="item.type"
          :timestamp="item.time"
        >
          {{ item.content }}
        </el-timeline-item>
        <el-timeline-item v-if="history.length === 0">暂无历史记录</el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { roomApi, contractApi } from '../../api'
import { House } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const room = ref({})
const contracts = ref([])
const history = ref([])
const loading = ref(false)

const getStatusType = (status) => {
  const map = { vacant: 'success', occupied: 'danger', reserved: 'warning' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { vacant: '空闲', occupied: '已租', reserved: '预留' }
  return map[status] || status
}

const getStatusColor = (status) => {
  const map = { vacant: '#67c23a', occupied: '#f56c6c', reserved: '#e6a23c' }
  return map[status] || '#909399'
}

const goBack = () => {
  router.push('/asset/room/list')
}

const fetchData = async () => {
  const id = route.params.id
  loading.value = true
  try {
    const roomRes = await roomApi.getById(id)
    // API 拦截器已返回 response.data，直接使用
    room.value = roomRes || {}
    
    // 修复：使用 room_id 作为参数名（与后端 API 匹配）
    const contractRes = await contractApi.getList({ room_id: id, page: 1, pageSize: 100 })
    // API 拦截器已返回 response.data
    contracts.value = (contractRes && contractRes.data) ? contractRes.data : []
    
    history.value = [
      { type: 'primary', time: room.value.created_at || '-', content: '房间创建' },
      ...(contracts.value.length > 0 ? [{ type: 'success', time: contracts.value[0].start_date, content: `签订合同: ${contracts.value[0].tenant_name}` }] : [])
    ]
  } catch (error) {
    ElMessage.error(error || '获取房间详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.status-box { text-align: center; padding: 20px; }
</style>