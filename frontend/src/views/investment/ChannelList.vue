<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>渠道管理</span><el-button type="primary" size="small" @click="handleAdd">新增渠道</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="渠道名称" width="150" />
        <el-table-column prop="manager" label="招商负责人" width="100" />
        <el-table-column prop="projects" label="绑定项目" width="150" />
        <el-table-column prop="region" label="所属城市/区域" width="120" />
        <el-table-column prop="commission" label="佣金模板" width="150" />
        <el-table-column prop="email" label="邮箱" width="150" />
        <el-table-column prop="bank" label="开户行" width="120" />
        <el-table-column prop="address" label="通讯地址" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增渠道" width="600px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="渠道名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="招商负责人" prop="manager_id"><el-select v-model="form.manager_id" style="width:100%"><el-option label="张三" value="1" /></el-select></el-form-item>
        <el-form-item label="绑定项目" prop="project_ids"><el-select v-model="form.project_ids" multiple style="width:100%"><el-option label="科技创新园" value="1" /></el-select></el-form-item>
        <el-form-item label="所属城市/区域" prop="region"><el-cascader v-model="form.region" :options="regionOptions" style="width:100%" /></el-form-item>
        <el-form-item label="佣金模板" prop="commission_id"><el-select v-model="form.commission_id" style="width:100%"><el-option label="标准佣金规则" value="1" /></el-select></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="开户行"><el-input v-model="form.bank" /></el-form-item>
        <el-form-item label="通讯地址"><el-input v-model="form.address" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { investmentApi } from '../../api/index.js'
const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ name: '', manager_id: '', project_ids: [], region: [], commission_id: '', email: '', bank: '', address: '' })
const rules = { name: [{ required: true }], manager_id: [{ required: true }], project_ids: [{ required: true, type: 'array' }], region: [{ required: true }], commission_id: [{ required: true }] }
const regionOptions = [{ value: '江苏省', label: '江苏省', children: [{ value: '苏州市', label: '苏州市', children: [{ value: '工业园区', label: '工业园区' }] }] }]
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [] : ''); dialogVisible.value = true }

onMounted(async () => {
  const res = await investmentApi.getChannels()
  if (res.success) tableData.value = res.data
})
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
}.card-header{display:flex;justify-content:space-between}</style>

