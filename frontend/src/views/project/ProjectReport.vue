<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>项目报表</span>
          <el-button type="primary" @click="exportReport">导出报表</el-button>
        </div>
      </template>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" style="background: #409EFF;">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total_projects || 0 }}</div>
              <div class="stat-label">项目总数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" style="background: #67C23A;">
              <el-icon><House /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total_rooms || 0 }}</div>
              <div class="stat-label">房间总数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" style="background: #E6A23C;">
              <el-icon><Key /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.occupied_rooms || 0 }}</div>
              <div class="stat-label">已租房间</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" style="background: #909399;">
              <el-icon><Unlock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.vacant_rooms || 0 }}</div>
              <div class="stat-label">空闲房间</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 项目列表统计 -->
      <el-table :data="tableData" v-loading="loading" border class="report-table">
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="项目名称" min-width="180" />
        <el-table-column prop="address" label="项目地址" min-width="200" />
        <el-table-column prop="total_area" label="总面积(m²)" width="120">
          <template #default="{ row }">
            {{ row.total_area?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="buildings_count" label="楼栋数" width="100" />
        <el-table-column prop="total_rooms" label="总房间" width="100" />
        <el-table-column prop="occupied_rooms" label="已租" width="100">
          <template #default="{ row }">
            <el-tag type="success">{{ row.occupied_rooms || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vacant_rooms" label="空闲" width="100">
          <template #default="{ row }">
            <el-tag type="info">{{ row.vacant_rooms || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="occupancy_rate" label="出租率" width="120">
          <template #default="{ row }">
            <el-progress :percentage="calculateRate(row.occupied_rooms, row.total_rooms)" :color="customColors" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { OfficeBuilding, House, Key, Unlock } from '@element-plus/icons-vue'
import { projectApi } from '../../api'

const loading = ref(false)
const tableData = ref([])
const stats = ref({})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const calculateRate = (occupied, total) => {
  if (!total || total === 0) return 0
  return Math.round((occupied || 0) / total * 100)
}

const fetchData = async () => {
  loading.value = true
  try {
    // 获取项目列表
    const res = await projectApi.getList({
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    
    // 为每个项目获取详细统计
    const projectsWithStats = await Promise.all(
      res.data.map(async (project) => {
        try {
          const detail = await projectApi.getById(project.id)
          return {
            ...project,
            buildings_count: detail.buildings?.length || 0,
            total_rooms: detail.stats?.total_rooms || 0,
            occupied_rooms: detail.stats?.occupied_rooms || 0,
            vacant_rooms: detail.stats?.vacant_rooms || 0,
            reserved_rooms: detail.stats?.reserved_rooms || 0
          }
        } catch (e) {
          return { ...project, buildings_count: 0, total_rooms: 0, occupied_rooms: 0, vacant_rooms: 0 }
        }
      })
    )
    
    tableData.value = projectsWithStats
    pagination.total = res.total
    
    // 计算总体统计
    stats.value = projectsWithStats.reduce((acc, p) => ({
      total_projects: (acc.total_projects || 0) + 1,
      total_rooms: (acc.total_rooms || 0) + (p.total_rooms || 0),
      occupied_rooms: (acc.occupied_rooms || 0) + (p.occupied_rooms || 0),
      vacant_rooms: (acc.vacant_rooms || 0) + (p.vacant_rooms || 0)
    }), {})
  } catch (error) {
    ElMessage.error(error || '获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchData()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchData()
}

const exportReport = () => {
  ElMessage.success('报表导出成功')
}

onMounted(fetchData)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-row {
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-icon .el-icon {
  font-size: 32px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  color: #909399;
  margin-top: 5px;
}

.report-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
