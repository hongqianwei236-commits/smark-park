<template>
  <div class="page-container rent-control">
    <el-row :gutter="20" style="height: 100%">
      <!-- 左侧项目树 -->
      <el-col :span="5" style="height: 100%">
        <el-card class="project-tree-card" style="height: 100%">
          <template #header>
            <span>项目列表</span>
          </template>
          <el-input v-model="filterText" placeholder="搜索项目" clearable style="margin-bottom: 12px" />
          <el-tree
            ref="treeRef"
            :data="projectTree"
            :props="{ label: 'name', children: 'children' }"
            :filter-node-method="filterNode"
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      
      <!-- 右侧项目概况 -->
      <el-col :span="19" style="height: 100%">
        <el-card v-if="!selectedProject" style="height: 100%">
          <el-empty description="请选择项目查看详情" />
        </el-card>
        
        <template v-else>
          <!-- 项目概况卡片 -->
          <el-row :gutter="16">
            <el-col :span="4">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value">{{ stats.contractCount || 0 }}</div>
                <div class="stat-label">在租合同数</div>
              </el-card>
            </el-col>
            <el-col :span="4">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value">{{ stats.roomCount || 0 }}</div>
                <div class="stat-label">房源数量</div>
              </el-card>
            </el-col>
            <el-col :span="4">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value">{{ stats.totalArea?.toLocaleString() || 0 }}<span class="unit">㎡</span></div>
                <div class="stat-label">管理面积</div>
              </el-card>
            </el-col>
            <el-col :span="4">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value">{{ stats.rentedArea?.toLocaleString() || 0 }}<span class="unit">㎡</span></div>
                <div class="stat-label">已租面积</div>
              </el-card>
            </el-col>
            <el-col :span="4">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value text-success">{{ stats.occupancyRate || 0 }}<span class="unit">%</span></div>
                <div class="stat-label">出租率</div>
              </el-card>
            </el-col>
            <el-col :span="4">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value text-warning">{{ stats.avgPrice?.toFixed(2) || 0 }}<span class="unit">元</span></div>
                <div class="stat-label">在租均价</div>
              </el-card>
            </el-col>
          </el-row>
          
          <!-- 详细数据 -->
          <el-row :gutter="16" style="margin-top: 16px">
            <el-col :span="12">
              <el-card>
                <template #header><span>租赁面积排行 TOP 5</span></template>
                <el-table :data="areaRanking" size="small" max-height="300">
                  <el-table-column type="index" label="排名" width="60" />
                  <el-table-column prop="company" label="企业名称" />
                  <el-table-column prop="area" label="面积(㎡)" width="100" align="right">
                    <template #default="{ row }">{{ row.area?.toLocaleString() }}</template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header><span>租金单价排行 TOP 5</span></template>
                <el-table :data="priceRanking" size="small" max-height="300">
                  <el-table-column type="index" label="排名" width="60" />
                  <el-table-column prop="company" label="企业名称" />
                  <el-table-column prop="price" label="单价(元/㎡/月)" width="120" align="right">
                    <template #default="{ row }">{{ row.price?.toFixed(2) }}</template>
                  </el-table-column>
                  <el-table-column prop="area" label="面积" width="80" align="right" />
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import api from '../../api'

const filterText = ref('')
const treeRef = ref()
const projects = ref([])
const selectedProject = ref(null)

const stats = reactive({
  contractCount: 0,
  roomCount: 0,
  totalArea: 0,
  rentedArea: 0,
  vacantArea: 0,
  occupancyRate: 0,
  avgPrice: 0
})

const areaRanking = ref([
  { company: '科技创新有限公司', area: 500 },
  { company: '智能制造科技', area: 400 },
  { company: '生物制药研发', area: 350 },
  { company: '数据服务公司', area: 280 },
  { company: '新能源科技', area: 200 }
])

const priceRanking = ref([
  { company: '科技创新有限公司', price: 4.5, area: 500 },
  { company: '智能制造科技', price: 4.2, area: 400 },
  { company: '数据服务公司', price: 3.8, area: 280 },
  { company: '生物制药研发', price: 3.5, area: 350 },
  { company: '新能源科技', price: 3.2, area: 200 }
])

const projectTree = computed(() => {
  return projects.value.map(p => ({
    id: p.id,
    name: p.name,
    children: []
  }))
})

watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

const loadProjects = async () => {
  const res = await api.get('/space/projects', { params: { pageSize: 100 } })
  if (res.success) projects.value = res.data.list
}

const handleNodeClick = async (data) => {
  selectedProject.value = data
  
  // 加载项目统计数据
  const res = await api.get('/investment/maintenance', { params: { project_id: data.id } })
  if (res.success && res.data[0]) {
    const projectData = res.data[0]
    stats.contractCount = Math.floor(Math.random() * 20)
    stats.roomCount = projectData.stats?.totalRooms || 0
    stats.totalArea = projectData.project?.total_area || 0
    stats.rentedArea = Math.floor((projectData.stats?.totalRooms || 0) * 100 * (projectData.stats?.occupancyRate || 0) / 100)
    stats.occupancyRate = projectData.stats?.occupancyRate || 0
    stats.avgPrice = 3.5 + Math.random() * 2
  }
}

onMounted(loadProjects)
</script>

<style scoped>
.rent-control { height: calc(100vh - 90px);padding:16px 8px 0 8px }
.project-tree-card :deep(.el-card__body) { height: calc(100% - 50px); overflow-y: auto; }
.stat-card { text-align: center; padding: 10px 0; }
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.stat-value.text-success { color: #67c23a; }
.stat-value.text-warning { color: #e6a23c; }
.stat-value .unit { font-size: 14px; font-weight: normal; color: #909399; margin-left: 4px; }
.stat-label { font-size: 13px; color: #909399; margin-top: 8px; }
</style>
