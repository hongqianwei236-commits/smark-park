<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>员工管理</span><el-button type="primary" size="small" @click="handleAdd">新增员工</el-button></div>
      </template>
      <el-form :inline="true" size="small">
        <el-form-item label="姓名"><el-input v-model="searchForm.name" clearable /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="searchForm.phone" clearable /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable style="width:80px">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">搜索</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="org" label="组织" width="150" />
        <el-table-column prop="dept" label="所属部门" width="120" />
        <el-table-column prop="position" label="职务" width="100" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button><el-button link type="primary" size="small">重置密码</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增员工" width="600px">
      <el-form :model="form" label-width="100px" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="用户名" prop="username"><el-input v-model="form.username" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="组织"><el-input v-model="form.org" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="所属部门"><el-select v-model="form.dept" style="width:100%"><el-option label="行政部" value="行政部" /><el-option label="财务部" value="财务部" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="职务"><el-input v-model="form.position" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="角色"><el-select v-model="form.role" style="width:100%"><el-option label="管理员" value="admin" /><el-option label="普通员工" value="user" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio value="active">启用</el-radio><el-radio value="inactive">禁用</el-radio></el-radio-group></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const searchForm = reactive({ name: '', phone: '', status: '' })
const dialogVisible = ref(false)
const form = reactive({ name: '', username: '', phone: '', org: '', dept: '', position: '', role: '', status: 'active' })
const tableData = ref([
  { name: '张三', username: 'zhangsan', phone: '13800138001', org: '科技创新园', dept: '行政部', position: '经理', role: 'admin', status: 'active' },
  { name: '李四', username: 'lisi', phone: '13800138002', org: '科技创新园', dept: '财务部', position: '会计', role: 'user', status: 'active' }
])
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = k === 'status' ? 'active' : ''); dialogVisible.value = true }
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}.card-header{display:flex;justify-content:space-between}</style>
