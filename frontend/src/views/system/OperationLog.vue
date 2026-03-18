<template>
  <div class="page-container">
    <el-card>
      <template #header><span>操作日志</span></template>
      <el-form :inline="true" size="small">
        <el-form-item label="操作人"><el-input v-model="searchForm.operator" clearable /></el-form-item>
        <el-form-item label="时间范围"><el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" style="width:220px" /></el-form-item>
        <el-form-item><el-button type="primary">搜索</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="permission_type" label="权限类型" width="100" />
        <el-table-column prop="permission_desc" label="权限描述" min-width="200" />
        <el-table-column prop="api" label="调用接口" width="200" />
        <el-table-column prop="time" label="调用时间" width="160" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const searchForm = reactive({ operator: '', dateRange: [] })
const tableData = ref([
  { operator: '张三', phone: '13800138001', permission_type: '新增', permission_desc: '新增项目：科技创新园二期', api: 'POST /api/projects', time: '2024-03-17 16:00:00' },
  { operator: '李四', phone: '13800138002', permission_type: '编辑', permission_desc: '编辑合同：HT2024001', api: 'PUT /api/contracts/1', time: '2024-03-17 15:30:00' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
