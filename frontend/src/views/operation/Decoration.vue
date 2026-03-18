<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>装修管理</span><el-button type="primary" size="small" @click="handleAdd">新增装修</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="project" label="所属项目" width="120" />
        <el-table-column prop="tenant" label="承租方" width="150" />
        <el-table-column prop="start_time" label="开始装修时间" width="110" />
        <el-table-column prop="end_time" label="结束装修时间" width="110" />
        <el-table-column prop="contact" label="联系电话" width="120" />
        <el-table-column prop="rooms" label="选择房间" width="100" />
        <el-table-column prop="constructor" label="施工方名称" width="120" />
        <el-table-column prop="manager" label="主要对接人" width="100" />
        <el-table-column prop="manager_phone" label="对接人电话" width="120" />
        <el-table-column prop="deposit" label="押金" width="100" align="right">
          <template #default="{ row }">{{ row.has_deposit ? '¥' + row.deposit : '-' }}</template>
        </el-table-column>
        <el-table-column prop="plates" label="车牌号" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="{pending:'warning',ongoing:'primary',completed:'success'}[row.status]" size="small">{{ {pending:'待审批',ongoing:'装修中',completed:'已完成'}[row.status] }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增装修申请" width="650px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id"><el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承租方" prop="tenant_id"><el-select v-model="form.tenant_id" style="width:100%"><el-option label="科技创新有限公司" value="1" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始装修时间" prop="start_time"><el-date-picker v-model="form.start_time" type="date" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束装修时间" prop="end_time"><el-date-picker v-model="form.end_time" type="date" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话"><el-input v-model="form.contact" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择房间"><el-select v-model="form.room_ids" multiple style="width:100%"><el-option label="A栋101" value="1" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="施工方名称"><el-input v-model="form.constructor" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要对接人"><el-input v-model="form.manager" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主要对接人电话"><el-input v-model="form.manager_phone" style="width:200px" /></el-form-item>
        <el-form-item label="押金">
          <el-switch v-model="form.has_deposit" style="margin-right:10px" />
          <el-input-number v-model="form.deposit" :min="0" :precision="2" :disabled="!form.has_deposit" style="width:150px" />
          <span style="margin-left:8px">元</span>
        </el-form-item>
        <el-form-item label="添加车牌号">
          <div v-for="(plate, idx) in form.plates" :key="idx" style="display:flex;gap:8px;margin-bottom:8px">
            <el-input v-model="form.plates[idx]" placeholder="车牌号" style="width:150px" />
            <el-button size="small" @click="form.plates.splice(idx,1)" v-if="idx > 0">删除</el-button>
          </div>
          <el-button type="primary" link size="small" @click="form.plates.push('')">+ 添加车牌号</el-button>
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ project: '科技创新园', tenant: '科技创新有限公司', start_time: '2024-03-20', end_time: '2024-04-20', contact: '13800138001', rooms: 'A栋101', constructor: '装修公司A', manager: '张工', manager_phone: '13900139001', deposit: 5000, has_deposit: true, plates: '苏A12345', status: 'ongoing' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ project_id: '', tenant_id: '', start_time: '', end_time: '', contact: '', room_ids: [], constructor: '', manager: '', manager_phone: '', has_deposit: false, deposit: 0, plates: [''] })
const rules = { project_id: [{ required: true }], tenant_id: [{ required: true }], start_time: [{ required: true }], end_time: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [''] : (typeof form[k] === 'boolean' ? false : '')); dialogVisible.value = true }
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

