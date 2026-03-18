<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>线索池</span>
          <el-button type="primary" @click="handleAdd">新增线索</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="全部">
            <el-option label="待分配" value="pending" />
            <el-option label="跟进中" value="following" />
            <el-option label="意向客户" value="intention" />
            <el-option label="已签约" value="signed" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="姓名/公司/电话" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="客户姓名" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="company" label="企业名称" />
        <el-table-column prop="source_name" label="来源" width="100" />
        <el-table-column prop="project_name" label="意向项目" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type">{{ statusMap[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">{{ row.created_at?.substring(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleFollow(row)">跟进</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleConvert(row)">转客户</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
        @change="loadData"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api'

const loading = ref(false)
const tableData = ref([])
const searchForm = reactive({ status: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const statusMap = {
  pending: { label: '待分配', type: 'info' },
  following: { label: '跟进中', type: 'warning' },
  intention: { label: '意向客户', type: 'primary' },
  signed: { label: '已签约', type: 'success' }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/investment/clues', { params: { ...searchForm, ...pagination } })
    if (res.success) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => ElMessage.info('新增线索')
const handleFollow = (row) => ElMessage.info('跟进: ' + row.name)
const handleEdit = (row) => ElMessage.info('编辑: ' + row.name)
const handleConvert = async (row) => {
  await api.put(`/investment/clues/${row.id}/status`, { status: 'intention' })
  ElMessage.success('已转为意向客户')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container {
  padding: 20px;
  height: calc(100vh - 50px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.page-container :deep(.el-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-container :deep(.el-card__header) {
  flex-shrink: 0;
}
.page-container :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
}
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>

