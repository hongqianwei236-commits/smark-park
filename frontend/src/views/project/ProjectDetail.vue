<template>
  <div class="page-container">
    <el-page-header @back="goBack" title="项目详情" />

    <el-row :gutter="20" class="info-section">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>基本信息</span>
          </template>
          <el-descriptions :column="2" border v-loading="loading">
            <el-descriptions-item label="项目名称">{{ project.name }}</el-descriptions-item>
            <el-descriptions-item label="项目状态">
              <el-tag :type="project.status === 'active' ? 'success' : 'danger'">
                {{ project.status === 'active' ? '运营中' : '已停用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="项目地址" :span="2">{{ project.address }}</el-descriptions-item>
            <el-descriptions-item label="总面积">{{ project.total_area?.toLocaleString() }} m²</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ project.created_at }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>资源统计</span>
          </template>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-value">{{ project.stats?.total_rooms || 0 }}</div>
              <div class="stat-label">总房间数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ project.stats?.vacant_rooms || 0 }}</div>
              <div class="stat-label">空闲房间</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ project.stats?.occupied_rooms || 0 }}</div>
              <div class="stat-label">已租房间</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ project.stats?.reserved_rooms || 0 }}</div>
              <div class="stat-label">预留房间</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="building-section">
      <template #header>
        <span>楼栋列表</span>
      </template>
      <el-table :data="project.buildings" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="楼栋名称" min-width="150" />
        <el-table-column prop="floors" label="楼层数" width="100" />
        <el-table-column prop="rooms_count" label="房间数" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewBuilding(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { projectApi } from '../../api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const project = ref({ buildings: [], stats: {} })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await projectApi.getById(route.params.id)
    project.value = res
  } catch (error) {
    ElMessage.error(error || '获取数据失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const viewBuilding = (row) => {
  router.push(`/asset/building/detail/${row.id}`)
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

.building-section {
  margin-top: 20px;
}
</style>
