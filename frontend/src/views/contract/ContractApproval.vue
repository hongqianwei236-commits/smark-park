<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>合同审批</span>
          <el-tag type="warning">待审批: {{ pendingCount }} 条</el-tag>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="id" label="合同编号" width="100" />
        <el-table-column prop="tenant_name" label="租户" min-width="150" />
        <el-table-column prop="room_info" label="租赁房间" min-width="150" />
        <el-table-column prop="start_date" label="开始日期" width="120" />
        <el-table-column prop="end_date" label="结束日期" width="120" />
        <el-table-column prop="amount" label="合同金额" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="handleApprove(row)">
              <el-icon><Check /></el-icon> 通过
            </el-button>
            <el-button type="danger" size="small" @click="handleReject(row)">
              <el-icon><Close /></el-icon> 驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="tableData.length === 0 && !loading" description="暂无待审批合同" />

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

    <el-dialog v-model="rejectDialogVisible" title="驳回原因" width="500px">
      <el-input v-model="rejectReason" type="textarea" rows="4" placeholder="请输入驳回原因" />
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject" :loading="submitLoading">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
import { contractApi } from '../../api'

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const rejectDialogVisible = ref(false)
const rejectReason = ref('')
const submitLoading = ref(false)
const currentRow = ref(null)

const pendingCount = computed(() => pagination.total)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await contractApi.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      status: 'pending'
    })
    tableData.value = res.data.map(item => ({
      ...item,
      room_info: item.building_name ? `${item.building_name}-${item.room_no}` : item.room_no
    }))
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val) => { pagination.pageSize = val; fetchData() }
const handleCurrentChange = (val) => { pagination.page = val; fetchData() }

const handleApprove = async (row) => {
  try {
    await ElMessageBox.confirm(`确定通过合同 ${row.id} 吗？`, '审批确认', { type: 'warning' })
    await contractApi.update(row.id, { status: 'active' })
    ElMessage.success('审批通过')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error(error || '审批失败')
  }
}

const handleReject = (row) => {
  currentRow.value = row
  rejectReason.value = ''
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }
  submitLoading.value = true
  try {
    await contractApi.update(currentRow.value.id, { status: 'rejected', reject_reason: rejectReason.value })
    ElMessage.success('已驳回')
    rejectDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(error || '驳回失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>