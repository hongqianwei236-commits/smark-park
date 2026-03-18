<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>收入合同</span>
          <el-button type="primary" @click="handleAdd">新增合同</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item label="合同编号"><el-input v-model="searchForm.contract_no" clearable /></el-form-item>
        <el-form-item label="承租方"><el-input v-model="searchForm.tenant" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable style="width: 100px">
            <el-option label="草稿" value="draft" />
            <el-option label="执行中" value="active" />
            <el-option label="已到期" value="expired" />
            <el-option label="已退租" value="terminated" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" @click="loadData">搜索</el-button></el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border size="small">
        <el-table-column prop="contract_no" label="合同编号" width="120" />
        <el-table-column prop="contract_name" label="合同名称" min-width="150" />
        <el-table-column prop="landlord" label="出租方" width="120" />
        <el-table-column prop="tenant" label="承租方" width="150" />
        <el-table-column prop="contract_type" label="合同类型" width="100" />
        <el-table-column prop="sign_date" label="签订日期" width="100" />
        <el-table-column prop="start_date" label="生效日期" width="100" />
        <el-table-column prop="end_date" label="结束日期" width="100" />
        <el-table-column prop="first_year_rent" label="首年租金" width="100" align="right">
          <template #default="{ row }">¥{{ row.first_year_rent?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="deposit" label="押金" width="100" align="right">
          <template #default="{ row }">¥{{ row.deposit?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]" size="small">{{ statusLabel[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="900px" destroy-on-close>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="签约信息" name="info">
          <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="合同编号"><el-input v-model="form.contract_no" disabled placeholder="自动生成" /></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同名称" prop="contract_name"><el-input v-model="form.contract_name" /></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同类型" prop="contract_type">
                  <el-select v-model="form.contract_type" style="width: 100%">
                    <el-option label="租赁合同" value="lease" />
                    <el-option label="物业服务合同" value="property" />
                    <el-option label="车位租赁合同" value="parking" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="出租方" prop="landlord">
                  <el-select v-model="form.landlord" style="width: 100%">
                    <el-option label="园区运营公司" value="园区运营公司" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="承租方" prop="tenant_id">
                  <el-select v-model="form.tenant_id" style="width: 100%">
                    <el-option v-for="t in tenants" :key="t.id" :label="t.name" :value="t.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="支付类型" prop="payment_type">
                  <el-select v-model="form.payment_type" style="width: 100%">
                    <el-option label="月付" value="monthly" />
                    <el-option label="季付" value="quarterly" />
                    <el-option label="半年付" value="semiannual" />
                    <el-option label="年付" value="annual" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="签订日期" prop="sign_date">
                  <el-date-picker v-model="form.sign_date" type="date" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="生效日期" prop="start_date">
                  <el-date-picker v-model="form.start_date" type="date" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结束日期" prop="end_date">
                  <el-date-picker v-model="form.end_date" type="date" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="免租期(天)"><el-input-number v-model="form.free_period" :min="0" style="width: 100%" /></el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="首年租金" prop="first_year_rent">
                  <el-input-number v-model="form.first_year_rent" :min="0" :precision="2" style="width: 100%">
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="押金">
                  <el-input-number v-model="form.deposit" :min="0" :precision="2" style="width: 100%">
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="房源选择" prop="room_ids">
              <el-select v-model="form.room_ids" multiple placeholder="选择房源" style="width: 100%">
                <el-option v-for="r in rooms" :key="r.id" :label="`${r.building_name}-${r.room_no}`" :value="r.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="2" /></el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="租金明细" name="rent">
          <el-table :data="form.rent_details" size="small" border>
            <el-table-column prop="period" label="租金周期" width="120">
              <template #default="{ row }">第{{ row.period }}期</template>
            </el-table-column>
            <el-table-column prop="start_date" label="计租开始" width="130">
              <template #default="{ row }"><el-date-picker v-model="row.start_date" type="date" size="small" style="width: 100%" /></template>
            </el-table-column>
            <el-table-column prop="end_date" label="计租结束" width="130">
              <template #default="{ row }"><el-date-picker v-model="row.end_date" type="date" size="small" style="width: 100%" /></template>
            </el-table-column>
            <el-table-column prop="amount" label="租金金额" width="140">
              <template #default="{ row }"><el-input-number v-model="row.amount" :min="0" size="small" style="width: 100%" /></template>
            </el-table-column>
            <el-table-column prop="status" label="支付状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'paid' ? 'success' : 'warning'" size="small">{{ row.status === 'paid' ? '已付' : '未付' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" link size="small" @click="addRentDetail" style="margin-top: 10px">+ 添加租金期</el-button>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api'

const loading = ref(false)
const tableData = ref([])
const tenants = ref([])
const rooms = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增合同')
const editingId = ref(null)
const activeTab = ref('info')
const formRef = ref(null)

const statusMap = { draft: 'info', active: 'success', expired: 'warning', terminated: 'danger' }
const statusLabel = { draft: '草稿', active: '执行中', expired: '已到期', terminated: '已退租' }

const searchForm = reactive({ contract_no: '', tenant: '', status: '' })
const form = reactive({
  contract_no: '', contract_name: '', contract_type: 'lease', landlord: '', tenant_id: '',
  sign_date: '', start_date: '', end_date: '', free_period: 0, payment_type: 'quarterly',
  first_year_rent: 0, deposit: 0, room_ids: [], remark: '',
  rent_details: [{ period: 1, start_date: '', end_date: '', amount: 0, status: 'unpaid' }]
})

const rules = {
  contract_name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
  contract_type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  landlord: [{ required: true, message: '请选择出租方', trigger: 'change' }],
  tenant_id: [{ required: true, message: '请选择承租方', trigger: 'change' }],
  sign_date: [{ required: true, message: '请选择签订日期', trigger: 'change' }],
  start_date: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  end_date: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  payment_type: [{ required: true, message: '请选择支付类型', trigger: 'change' }],
  first_year_rent: [{ required: true, message: '请输入首年租金', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/space/contracts', { params: searchForm })
    if (res.success) tableData.value = res.data.list || []
    else tableData.value = [
      { contract_no: 'HT2024001', contract_name: '科技创新公司租赁合同', landlord: '园区运营公司', tenant: '科技创新有限公司', contract_type: '租赁合同', sign_date: '2024-01-01', start_date: '2024-01-01', end_date: '2025-12-31', first_year_rent: 360000, deposit: 30000, status: 'active' }
    ]
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增合同'
  editingId.value = null
  activeTab.value = 'info'
  Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [] : (typeof form[k] === 'number' ? 0 : ''))
  form.contract_type = 'lease'
  form.payment_type = 'quarterly'
  form.rent_details = [{ period: 1, start_date: '', end_date: '', amount: 0, status: 'unpaid' }]
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑合同'
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row) => ElMessage.info('查看详情: ' + row.contract_no)

const addRentDetail = () => {
  form.rent_details.push({ period: form.rent_details.length + 1, start_date: '', end_date: '', amount: 0, status: 'unpaid' })
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success(editingId.value ? '更新成功' : '创建成功')
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
</style>

