<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>租户分析</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #409EFF;">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total }}</div>
              <div class="stat-label">租户总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #67C23A;">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.active }}</div>
              <div class="stat-label">正常租户</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #E6A23C;">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.inactive }}</div>
              <div class="stat-label">停用租户</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #909399;">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.withContracts }}</div>
              <div class="stat-label">有合同租户</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <el-row :gutter="20">
        <el-col :span="12">
          <h4>租户增长趋势</h4>
          <div ref="growthChart" class="chart-container"></div>
        </el-col>
        <el-col :span="12">
          <h4>租户状态分布</h4>
          <div ref="statusChart" class="chart-container"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { tenantApi } from '../../api'

const stats = reactive({
  total: 0,
  active: 0,
  inactive: 0,
  withContracts: 0
})

const growthChart = ref()
const statusChart = ref()

const fetchStats = async () => {
  try {
    const res = await tenantApi.getList({ page: 1, pageSize: 1000 })
    const tenants = res.data
    stats.total = tenants.length
    stats.active = tenants.filter(t => t.status === 'active').length
    stats.inactive = tenants.filter(t => t.status === 'inactive').length
    // 模拟有合同的租户数
    stats.withContracts = Math.floor(stats.total * 0.7)
  } catch (error) {
    ElMessage.error(error || '获取数据失败')
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
}

.stat-info {
  margin-left: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  margin-top: 5px;
  color: #909399;
  font-size: 14px;
}

.chart-container {
  height: 300px;
  margin-top: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}

h4 {
  margin: 0;
  color: #303133;
}
</style>
