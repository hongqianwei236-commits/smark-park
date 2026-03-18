<template>
  <div class="page-container">
    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="应付总计" :value="stats.totalAmount" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="已付总计" :value="stats.paidAmount" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="待付总计" :value="stats.unpaidAmount" prefix="¥" />
        </el-card>
      </el-col>
    </el-row>
    
    <el-card>
      <template #header>
        <div class="card-header">
          <span>支出账单</span>
          <el-button type="primary" @click="handleAdd">新增账单</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" stripe border size="small">
        <el-table-column prop="payer" label="付款方" width="150" />
        <el-table-column prop="payer_account" label="付款账号" width="150" />
        <el-table-column prop="payee_type" label="收款方类型" width="100">
          <template #default="{ row }">{{ row.payee_type === 'supplier' ? '供应商' : '个人' }}</template>
        </el-table-column>
        <el-table-column prop="payee" label="收款方" width="150" />
        <el-table-column prop="payee_account" label="收款账号" width="150" />
        <el-table-column prop="fee_type" label="费用类型" width="100" />
        <el-table-column prop="amount" label="金额" width="100" align="right">
          <template #default="{ row }">¥{{ row.amount?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="due_date" label="应付日期" width="100" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'success' : 'warning'" size="small">{{ row.status === 'paid' ? '已付' : '未付' }}</el-tag>
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
    
    <el-dialog v-model="dialogVisible" title="新增支出账单" width="650px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="付款方" prop="payer"><el-input v-model="form.payer" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款账号" prop="payer_account"><el-input v-model="form.payer_account" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收款方类型" prop="payee_type">
              <el-select v-model="form.payee_type" style="width: 100%">
                <el-option label="供应商" value="supplier" />
                <el-option label="个人" value="person" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方" prop="payee"><el-input v-model="form.payee" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收款账号"><el-input v-model="form.payee_account" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用类型" prop="fee_type">
              <el-select v-model="form.fee_type" style="width: 100%">
                <el-option label="物业费" value="property" />
                <el-option label="维修费" value="maintenance" />
                <el-option label="水电费" value="utility" />
                <el-option label="采购支出" value="purchase" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="金额" prop="amount"><el-input-number v-model="form.amount" :min="0" :precision="2" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应付日期" prop="due_date"><el-date-picker v-model="form.due_date" type="date" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件"><el-upload action="#" :auto-upload="false"><el-button size="small">上传附件</el-button></el-upload></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
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
const dialogVisible = ref(false)
const formRef = ref(null)

const stats = reactive({ totalAmount: 50000, paidAmount: 10000, unpaidAmount: 40000 })

const form = reactive({
  payer: '园区运营公司', payer_account: '', payee_type: 'supplier', payee: '',
  payee_account: '', fee_type: '', amount: 0, due_date: '', remark: ''
})

const rules = {
  payer: [{ required: true, message: '请输入付款方', trigger: 'blur' }],
  payer_account: [{ required: true, message: '请输入付款账号', trigger: 'blur' }],
  payee_type: [{ required: true, message: '请选择收款方类型', trigger: 'change' }],
  payee: [{ required: true, message: '请输入收款方', trigger: 'blur' }],
  fee_type: [{ required: true, message: '请选择费用类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  due_date: [{ required: true, message: '请选择应付日期', trigger: 'change' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/finance/expense-bills')
    if (res.success) {
      tableData.value = res.data.list
      Object.assign(stats, res.data.stats)
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  Object.assign(form, { payer: '园区运营公司', payer_account: '', payee_type: 'supplier', payee: '', payee_account: '', fee_type: '', amount: 0, due_date: '', remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => { Object.assign(form, row); dialogVisible.value = true }

const handleVerify = async (row) => {
  await ElMessageBox.confirm('确认核销该账单？', '提示')
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

<style scoped>.page-container {
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
}.card-header { display: flex; justify-content: space-between; }</style>

