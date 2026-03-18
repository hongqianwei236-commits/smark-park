<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>黑名单</span><el-button type="primary" size="small" @click="dialogVisible = true">新增</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="姓名" width="150" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="reason" label="拉黑原因" />
        <el-table-column prop="create_time" label="添加时间" width="140" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">移除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增黑名单" width="400px">
      <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="电话" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="原因"><el-input v-model="form.reason" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ name: '王某', phone: '13800000000', reason: '多次违规', create_time: '2024-03-10' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ name: '', phone: '', reason: '' })
const rules = { name: [{ required: true }], phone: [{ required: true }] }
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

