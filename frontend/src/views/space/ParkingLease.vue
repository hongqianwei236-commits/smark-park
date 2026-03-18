<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>车位租赁</span>
          <el-button type="primary" @click="handleAdd">新增租赁</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="project_name" label="所属项目" width="120" />
        <el-table-column prop="company_name" label="签约企业" width="150" />
        <el-table-column prop="contract_type" label="签约类型" width="100" />
        <el-table-column prop="spaces" label="车位列表" width="150" />
        <el-table-column prop="charge_type" label="收费类型" width="100" />
        <el-table-column prop="total_amount" label="收费总金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.total_amount?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" width="110" />
        <el-table-column prop="end_date" label="结束日期" width="110" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '生效中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增车位租赁" width="700px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id">
              <el-select v-model="form.project_id" placeholder="选择项目" style="width: 100%">
                <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签约类型" prop="contract_type">
              <el-select v-model="form.contract_type" style="width: 100%">
                <el-option label="企业租赁" value="enterprise" />
                <el-option label="个人租赁" value="personal" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属企业" prop="company_id">
              <el-select v-model="form.company_id" placeholder="选择企业" style="width: 100%">
                <el-option v-for="t in tenants" :key="t.id" :label="t.name" :value="t.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆收费类型" prop="charge_type">
              <el-select v-model="form.charge_type" style="width: 100%">
                <el-option label="按月收费" value="monthly" />
                <el-option label="按次收费" value="per_use" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="车位列表" prop="space_ids">
          <el-select v-model="form.space_ids" multiple placeholder="选择车位" style="width: 100%">
            <el-option v-for="s in spaces" :key="s.id" :label="s.space_no" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收费总金额" prop="total_amount">
              <el-input-number v-model="form.total_amount" :min="0" :precision="2" style="width: 100%">
                <template #append>元</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计租日期" prop="rent_start_date">
              <el-date-picker v-model="form.rent_start_date" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="start_date">
              <el-date-picker v-model="form.start_date" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="end_date">
              <el-date-picker v-model="form.end_date" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="凭证">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="3">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
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
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '../../api'

const loading = ref(false)
const tableData = ref([])
const projects = ref([])
const tenants = ref([])
const spaces = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)

const form = reactive({
  project_id: '', contract_type: 'enterprise', company_id: '',
  charge_type: 'monthly', space_ids: [], total_amount: 0,
  start_date: '', end_date: '', rent_start_date: ''
})

const rules = {
  project_id: [{ required: true, message: '请选择项目', trigger: 'change' }],
  contract_type: [{ required: true, message: '请选择签约类型', trigger: 'change' }],
  company_id: [{ required: true, message: '请选择企业', trigger: 'change' }],
  space_ids: [{ required: true, message: '请选择车位', trigger: 'change', type: 'array' }],
  charge_type: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
  total_amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  start_date: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  end_date: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
}

const loadData = async () => {
  loading.value = true
  try {
    // 模拟数据
    tableData.value = [
      { project_name: '科技创新园', company_name: '科技创新有限公司', contract_type: '企业租赁', spaces: 'A-1-001, A-1-002', charge_type: '按月收费', total_amount: 6000, start_date: '2024-01-01', end_date: '2024-12-31', status: 'active' }
    ]
  } finally {
    loading.value = false
  }
}

const loadProjects = async () => {
  const res = await api.get('/space/projects', { params: { pageSize: 100 } })
  if (res.success) projects.value = res.data.list
}

const handleAdd = () => {
  Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [] : (typeof form[k] === 'number' ? 0 : ''))
  form.contract_type = 'enterprise'
  form.charge_type = 'monthly'
  dialogVisible.value = true
}

const handleView = (row) => ElMessage.info('查看详情')

const handleSubmit = async () => {
  await formRef.value.validate()
  ElMessage.success('创建成功')
  dialogVisible.value = false
}

onMounted(() => { loadData(); loadProjects() })
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

