<template>
  <div class="page-container">
    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="应收总计" :value="stats.totalAmount" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="已收总计" :value="stats.paidAmount" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="待收总计" :value="stats.unpaidAmount" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="收款率" :value="stats.collectRate" suffix="%" />
        </el-card>
      </el-col>
    </el-row>
    
    <el-card>
      <template #header>
        <div class="card-header">
          <span>收入账单</span>
          <el-button type="primary" @click="handleAdd">新增账单</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item label="房间"><el-input v-model="searchForm.room" clearable /></el-form-item>
        <el-form-item label="合同号"><el-input v-model="searchForm.contract_no" clearable /></el-form-item>
        <el-form-item label="费用类型">
          <el-select v-model="searchForm.fee_type" clearable style="width: 120px">
            <el-option label="租金" value="rent" />
            <el-option label="物业费" value="property" />
            <el-option label="水电费" value="utility" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable style="width: 100px">
            <el-option label="未收" value="unpaid" />
            <el-option label="已收" value="paid" />
            <el-option label="部分收" value="partial" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" @click="loadData">搜索</el-button></el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border size="small">
        <el-table-column prop="room" label="房间" width="100" />
        <el-table-column prop="contract_no" label="合同号" width="120" />
        <el-table-column prop="tenant" label="承租方" width="150" />
        <el-table-column prop="fee_type" label="费用类型" width="100" />
        <el-table-column prop="amount" label="金额" width="100" align="right">
          <template #default="{ row }">¥{{ row.amount?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="paid_amount" label="已收金额" width="100" align="right">
          <template #default="{ row }">¥{{ row.paid_amount || 0 }}</template>
        </el-table-column>
        <el-table-column prop="due_date" label="应收日期" width="100" />
        <el-table-column prop="paid_date" label="到账时间" width="100" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="{ paid: 'success', unpaid: 'danger', partial: 'warning' }[row.status]" size="small">
              {{ { paid: '已收', unpaid: '未收', partial: '部分收' }[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleVerify(row)" v-if="row.status !== 'paid'">核销</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增收入账单" width="550px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="记账类型">
          <el-input value="收入" disabled />
        </el-form-item>
        <el-form-item label="房间" prop="room_id">
          <el-select v-model="form.room_id" style="width: 100%">
            <el-option v-for="r in rooms" :key="r.id" :label="r.name" :value="r.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同号" prop="contract_id">
          <el-select v-model="form.contract_id" style="width: 100%">
            <el-option v-for="c in contracts" :key="c.id" :label="c.contract_no" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型" prop="fee_type">
          <el-select v-model="form.fee_type" style="width: 100%">
            <el-option label="租金" value="rent" />
            <el-option label="物业费" value="property" />
            <el-option label="水电费" value="utility" />
            <el-option label="停车费" value="parking" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="应收日期" prop="due_date">
          <el-date-picker v-model="form.due_date" type="date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../../api'

const loading = ref(false)
const tableData = ref([])
const rooms = ref([])
const contracts = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)

const stats = reactive({ totalAmount: 150000, paidAmount: 120000, unpaidAmount: 30000, collectRate: 80 })

const searchForm = reactive({ room: '', contract_no: '', fee_type: '', status: '' })
const form = reactive({ room_id: '', contract_id: '', fee_type: '', amount: 0, due_date: '', remark: '' })
const rules = {
  room_id: [{ required: true, message: '请选择房间', trigger: 'change' }],
  contract_id: [{ required: true, message: '请选择合同', trigger: 'change' }],
  fee_type: [{ required: true, message: '请选择费用类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  due_date: [{ required: true, message: '请选择应收日期', trigger: 'change' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/finance/income-bills')
    if (res.success) {
      tableData.value = res.data.list
      Object.assign(stats, res.data.stats)
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  Object.assign(form, { room_id: '', contract_id: '', fee_type: '', amount: 0, due_date: '', remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => { Object.assign(form, row); dialogVisible.value = true }

const handleVerify = async (row) => {
  await ElMessageBox.confirm('确认核销该账单？', '提示')
  await api.post(`/finance/income-bills/${row.id}/verify`, { paid_amount: row.amount - (row.paid_amount || 0) })
  ElMessage.success('核销成功')
  loadData()
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('创建成功')
  dialogVisible.value = false
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
.stat-card { text-align: center; }
</style>

