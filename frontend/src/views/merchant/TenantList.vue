<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>承租方管理</span>
          <el-button type="primary" size="small" @click="dialogVisible = true">新增</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="承租方名称" />
        <el-table-column prop="short_name" label="简称" width="100" />
        <el-table-column prop="credit_code" label="统一社会信用代码" width="180" />
        <el-table-column prop="legal_person" label="法人" width="80" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="email" label="邮箱" width="150" />
        <el-table-column prop="industry" label="所属行业" width="80" />
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" title="新增承租方" width="600px">
      <el-form :model="form" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="承租方名称" required><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="简称" required><el-input v-model="form.short_name" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="统一社会信用代码" required><el-input v-model="form.credit_code" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="法人姓名" required><el-input v-model="form.legal_person" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="联系电话" required><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="邮箱" required><el-input v-model="form.email" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="所属行业"><el-select v-model="form.industry" style="width:100%"><el-option label="科技" value="tech" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="证件号"><el-input v-model="form.id_card" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="开户行"><el-input v-model="form.bank" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ name: '科技创新有限公司', short_name: '科创', credit_code: '91320000MA1A2B3C', legal_person: '张三', phone: '13800138001', email: 'info@tech.com', industry: '科技' }])
const dialogVisible = ref(false)
const form = reactive({ name: '', short_name: '', credit_code: '', legal_person: '', phone: '', email: '', industry: '', id_card: '', bank: '', remark: '' })
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

