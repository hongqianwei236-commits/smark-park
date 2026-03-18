<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>计费规则</span><el-button type="primary" size="small" @click="dialogVisible = true">新增规则</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="计费规则名称" />
        <el-table-column prop="project" label="所属项目" width="150" />
        <el-table-column prop="billing_type" label="计费类型" width="100">
          <template #default="{ row }">{{ row.billing_type === 'step' ? '阶梯计费' : '按次收费' }}</template>
        </el-table-column>
        <el-table-column prop="first_time" label="首时计费时长(分钟)" width="130" />
        <el-table-column prop="first_price" label="首时计费金额(元)" width="120" />
        <el-table-column prop="unit_time" label="计费时长(分钟)" width="110" />
        <el-table-column prop="unit_price" label="计费金额(元)" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '启用' : '禁用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增计费规则" width="550px">
      <el-form :model="form" label-width="140px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="计费规则名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select>
        </el-form-item>
        <el-form-item label="计费类型" prop="billing_type">
          <el-radio-group v-model="form.billing_type"><el-radio value="step">阶梯计费</el-radio><el-radio value="once">按次收费</el-radio></el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="首时计费时长" prop="first_time"><el-input-number v-model="form.first_time" :min="0" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首时计费金额" prop="first_price"><el-input-number v-model="form.first_price" :min="0" :precision="2" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计费时长" prop="unit_time"><el-input-number v-model="form.unit_time" :min="0" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计费金额" prop="unit_price"><el-input-number v-model="form.unit_price" :min="0" :precision="2" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="特殊日期价格"><el-switch v-model="form.special_price" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ name: '标准计费规则', project: '科技创新园', billing_type: 'step', first_time: 60, first_price: 100, unit_time: 30, unit_price: 50, status: true }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ name: '', project_id: '', billing_type: 'step', first_time: 60, first_price: 0, unit_time: 30, unit_price: 0, special_price: false, status: true })
const rules = { name: [{ required: true }], project_id: [{ required: true }], billing_type: [{ required: true }] }
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

