<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>出租方管理</span>
          <el-button type="primary" @click="handleAdd">新增出租方</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="出租方名称" min-width="150" />
        <el-table-column prop="short_name" label="简称" width="100" />
        <el-table-column prop="credit_code" label="统一社会信用代码" width="180" />
        <el-table-column prop="legal_person" label="法人" width="80" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="email" label="邮箱" width="150" />
        <el-table-column prop="region" label="所属城市/区域" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增出租方" width="650px">
      <el-form :model="form" label-width="130px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出租方名称" prop="name"><el-input v-model="form.name" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出租方简称" prop="short_name"><el-input v-model="form.short_name" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="credit_code"><el-input v-model="form.credit_code" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人姓名" prop="legal_person"><el-input v-model="form.legal_person" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone"><el-input v-model="form.phone" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="所属城市/区域" prop="region">
          <el-cascader v-model="form.region" :options="regionOptions" style="width: 100%" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="证件号"><el-input v-model="form.id_card" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="开户行"><el-input v-model="form.bank" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="通讯地址"><el-input v-model="form.address" /></el-form-item>
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
import { ElMessage } from 'element-plus'
import { merchantApi } from '../../api/index.js'

const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref(null)
const regionOptions = [{ value: '江苏省', label: '江苏省', children: [{ value: '苏州市', label: '苏州市' }] }]

const form = reactive({ name: '', short_name: '', credit_code: '', legal_person: '', phone: '', email: '', region: [], id_card: '', bank: '', address: '', remark: '' })
const rules = {
  name: [{ required: true, message: '请输入出租方名称', trigger: 'blur' }],
  short_name: [{ required: true, message: '请输入简称', trigger: 'blur' }],
  credit_code: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
  legal_person: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}

onMounted(async () => {
  const res = await merchantApi.getLandlords()
  if (res.success) tableData.value = res.data
})

const handleAdd = () => { isEdit.value = false; editId.value = null; Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [] : ''); dialogVisible.value = true }
const handleEdit = (row) => { isEdit.value = true; editId.value = row.id; Object.assign(form, row); dialogVisible.value = true }
const handleSubmit = async () => {
  await formRef.value?.validate()
  if (isEdit.value) {
    const res = await merchantApi.updateLandlord(editId.value, form)
    if (res.success) { const idx = tableData.value.findIndex(r => r.id === editId.value); if (idx >= 0) tableData.value[idx] = res.data }
  } else {
    const res = await merchantApi.createLandlord(form)
    if (res.success) tableData.value.push(res.data)
  }
  ElMessage.success('保存成功'); dialogVisible.value = false
}
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

