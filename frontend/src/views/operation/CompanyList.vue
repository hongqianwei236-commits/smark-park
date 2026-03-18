<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>入驻企业</span><el-button type="primary" size="small" @click="handleAdd">新增企业</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="企业名称" min-width="150" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="project" label="所属项目" width="120" />
        <el-table-column prop="industry" label="所属行业" width="80" />
        <el-table-column prop="email" label="商务邮箱" width="150" />
        <el-table-column prop="website" label="企业网址" width="150" />
        <el-table-column prop="settled_date" label="入驻日期" width="100" />
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">查看</el-button><el-button link type="primary" size="small">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增入驻企业" width="700px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="name"><el-input v-model="form.name" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact"><el-input v-model="form.contact" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone"><el-input v-model="form.phone" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id"><el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属行业" prop="industry"><el-select v-model="form.industry" style="width:100%"><el-option label="科技" value="tech" /><el-option label="金融" value="finance" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商务邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="企业网址"><el-input v-model="form.website" /></el-form-item>
        <el-form-item label="企业图标"><el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1"><el-icon><Plus /></el-icon></el-upload></el-form-item>
        <el-form-item label="企业简介"><el-input v-model="form.intro" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="公司介绍"><el-input v-model="form.company_intro" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="产品介绍"><el-input v-model="form.product_intro" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
const tableData = ref([{ name: '科技创新有限公司', contact: '张经理', phone: '13800138001', project: '科技创新园', industry: '科技', email: 'info@tech.com', website: 'www.tech.com', settled_date: '2024-01-01' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ name: '', contact: '', phone: '', project_id: '', industry: '', email: '', website: '', intro: '', company_intro: '', product_intro: '' })
const rules = { name: [{ required: true }], contact: [{ required: true }], phone: [{ required: true }], project_id: [{ required: true }], industry: [{ required: true }], email: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = ''); dialogVisible.value = true }
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

