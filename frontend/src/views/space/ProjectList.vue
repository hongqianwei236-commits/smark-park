<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>项目管理</span>
          <el-button type="primary" @click="handleAdd">新增项目</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="项目名称/简称/代码" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="name" label="项目名称" min-width="150" />
        <el-table-column prop="short_name" label="简称" width="100" />
        <el-table-column prop="code" label="项目代码" width="100" />
        <el-table-column prop="city" label="城市" width="100" />
        <el-table-column prop="total_area" label="管理面积(㎡)" width="120" align="right">
          <template #default="{ row }">{{ row.total_area?.toLocaleString() || 0 }}</template>
        </el-table-column>
        <el-table-column prop="rentable_area" label="可租面积(㎡)" width="120" align="right">
          <template #default="{ row }">{{ row.rentable_area?.toLocaleString() || 0 }}</template>
        </el-table-column>
        <el-table-column prop="room_count" label="房源数" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '运营中' : '其他' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @change="loadData"
        style="margin-top: 16px; justify-content: flex-end;"
      />
    </el-card>
    
    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" destroy-on-close>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础信息" name="basic">
          <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="项目名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入项目全称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目简称" prop="short_name">
                  <el-input v-model="form.short_name" placeholder="请输入简称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="项目代码" prop="code">
                  <el-input v-model="form.code" placeholder="唯一编码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="省/市/区">
                  <el-cascader v-model="form.region" :options="regionOptions" placeholder="选择地区" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="园区管理面积" prop="total_area">
                  <el-input-number v-model="form.total_area" :min="0" :precision="2" style="width: 100%">
                    <template #append>㎡</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="可租面积">
                  <el-input-number v-model="form.rentable_area" :min="0" :precision="2" style="width: 100%">
                    <template #append>㎡</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="项目简介">
              <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入项目简介" />
            </el-form-item>
            <el-form-item label="园区平面图">
              <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1">
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="拓展信息" name="extend">
          <el-form :model="form" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="VR链接">
                  <el-input v-model="form.vr_url" placeholder="VR看房链接" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序值">
                  <el-input-number v-model="form.sort_order" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="竣工时间">
                  <el-date-picker v-model="form.completion_date" type="date" placeholder="选择日期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准层高">
                  <el-input v-model="form.floor_height" placeholder="如: 3.5米" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="物业公司">
                  <el-input v-model="form.property_company" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="物业费">
                  <el-input-number v-model="form.property_fee" :min="0" :precision="2" style="width: 100%" />
                  <template #append>元/㎡/月</template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车位数量">
                  <el-input-number v-model="form.parking_count" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车位月租金">
                  <el-input-number v-model="form.parking_fee" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="空调类型">
                  <el-input v-model="form.air_conditioning" placeholder="如: 中央空调" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="空调费用">
                  <el-input v-model="form.ac_fee" placeholder="费用说明" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="电梯数量">
                  <el-input-number v-model="form.elevator_count" :min="0" style="width: 100%" />
                  <template #append>台</template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="网络类型">
                  <el-input v-model="form.network_type" placeholder="如: 光纤" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="招商电话">
                  <el-input v-model="form.investment_phone" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客服电话">
                  <el-input v-model="form.service_phone" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="招商时间">
              <el-input v-model="form.investment_time" placeholder="如: 周一至周五 9:00-18:00" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="空间设施" name="facility">
          <el-form :model="form" label-width="120px">
            <el-form-item label="空间设施">
              <el-select v-model="form.facilities" multiple placeholder="选择配套设施" style="width: 100%">
                <el-option label="会议室" value="会议室" />
                <el-option label="餐厅" value="餐厅" />
                <el-option label="健身房" value="健身房" />
                <el-option label="咖啡厅" value="咖啡厅" />
                <el-option label="便利店" value="便利店" />
                <el-option label="银行" value="银行" />
                <el-option label="快递柜" value="快递柜" />
                <el-option label="停车场" value="停车场" />
                <el-option label="充电桩" value="充电桩" />
              </el-select>
            </el-form-item>
            <el-form-item label="空间位置">
              <el-input v-model="form.location" placeholder="地图位置" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '../../api'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增项目')
const editingId = ref(null)
const activeTab = ref('basic')
const formRef = ref(null)

const searchForm = reactive({ keyword: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({
  name: '', short_name: '', code: '', region: [], address: '',
  total_area: 0, rentable_area: 0, description: '',
  vr_url: '', sort_order: 0, completion_date: '', floor_height: '',
  property_company: '', property_fee: 0, parking_count: 0, parking_fee: 0,
  air_conditioning: '', ac_fee: '', elevator_count: 0, network_type: '',
  investment_phone: '', service_phone: '', investment_time: '',
  facilities: [], location: ''
})

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  short_name: [{ required: true, message: '请输入简称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入项目代码', trigger: 'blur' }]
}

const regionOptions = [
  { value: '江苏省', label: '江苏省', children: [
    { value: '苏州市', label: '苏州市', children: [
      { value: '工业园区', label: '工业园区' },
      { value: '姑苏区', label: '姑苏区' },
      { value: '吴中区', label: '吴中区' }
    ]}
  ]}
]

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/space/projects', { params: { ...searchForm, ...pagination } })
    if (res.success) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.keyword = ''
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增项目'
  editingId.value = null
  activeTab.value = 'basic'
  Object.keys(form).forEach(k => {
    form[k] = Array.isArray(form[k]) ? [] : (typeof form[k] === 'number' ? 0 : '')
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑项目'
  editingId.value = row.id
  activeTab.value = 'basic'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleView = (row) => {
  ElMessage.info('查看详情: ' + row.name)
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该项目？', '提示', { type: 'warning' })
  await api.delete(`/space/projects/${row.id}`)
  ElMessage.success('删除成功')
  loadData()
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    if (editingId.value) {
      await api.put(`/space/projects/${editingId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/space/projects', form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } finally {
    submitting.value = false
  }
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

