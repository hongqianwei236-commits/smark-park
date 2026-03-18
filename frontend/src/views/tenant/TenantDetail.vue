<template>
  <div class="page-container">
    <el-page-header @back="goBack" title="租户详情" />

    <el-row :gutter="20" class="info-section">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>基本信息</span>
          </template>
          <el-descriptions :column="2" border v-loading="loading">
            <el-descriptions-item label="租户名称">{{ tenant.name }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ tenant.contact }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ tenant.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ tenant.email }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{ tenant.address }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="tenant.status === 'active' ? 'success' : 'danger'">
                {{ tenant.status === 'active' ? '正常' : '停用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ tenant.created_at }}</el-descriptions-item>
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
              <div class="stat-value">{{ tenant.contracts?.length || 0 }}</div>
              <div class="stat-label">合同数量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ activeContractsCount }}</div>
              <div class="stat-label">有效合同</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="contract-section">
      <template #header>
        <span>合同记录</span>
      </template>
      <el-table :data="tenant.contracts" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="room_no" label="房间号" width="100" />
        <el-table-column prop="building_name" label="楼栋" width="150" />
        <el-table-column prop="project_name" label="项目" width="150" />
        <el-table-column prop="start_date" label="开始日期" width="120" />
        <el-table-column prop="end_date" label="结束日期" width="120" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { tenantApi } from '../../api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const tenant = ref({ contracts: [] })

const activeContractsCount = computed(() => {
  return tenant.value.contracts?.filter(c => c.status === 'active').length || 0
})

const getStatusType = (status) => {
  const types = { active: 'success', pending: 'warning', expired: 'info' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { active: '有效', pending: '待审批', expired: '已过期' }
  return texts[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await tenantApi.getById(route.params.id)
    tenant.value = res
  } catch (error) {
    ElMessage.error(error || '获取数据失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
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

.contract-section {
  margin-top: 20px;
}
</style>
