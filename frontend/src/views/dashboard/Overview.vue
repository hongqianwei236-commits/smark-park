<template>
  <div class="overview">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="管理面积" :value="stats.totalArea" suffix="㎡" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="已租面积" :value="stats.occupiedArea" suffix="㎡" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="出租率" :value="parseFloat(stats.occupancyRate)" suffix="%" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="入驻企业" :value="stats.tenantCount" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>房源状态分布</span></template>
          <div style="height: 300px; display: flex; align-items: center; justify-content: center;">
            <el-progress type="dashboard" :percentage="parseFloat(stats.occupancyRate) || 0" :width="200">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
                <span class="percentage-label">出租率</span>
              </template>
            </el-progress>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>行业分布</span></template>
          <el-empty v-if="stats.industryDistribution?.length === 0" />
          <el-table v-else :data="stats.industryDistribution" style="width: 100%">
            <el-table-column prop="name" label="行业" />
            <el-table-column prop="value" label="企业数" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'

const stats = ref({
  totalArea: 0,
  occupiedArea: 0,
  occupancyRate: 0,
  tenantCount: 0,
  industryDistribution: []
})

onMounted(async () => {
  try {
    const res = await api.get('/dashboard/overview')
    if (res.success) {
      stats.value = res.data
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
})
</script>

<style scoped>
.overview { padding: 20px; }
.stat-card { text-align: center; }
.percentage-value { font-size: 28px; }
.percentage-label { display: block; font-size: 14px; color: #909399; margin-top: 10px; }
</style>
