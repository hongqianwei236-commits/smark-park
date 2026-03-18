<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>审批流管理</span><el-button type="primary" size="small">新增</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="审批流名称" />
        <el-table-column prop="type" label="审批类型" width="120" />
        <el-table-column prop="nodes" label="审批节点数" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { name: '合同审批流', type: '合同审批', nodes: 3, status: 'active' },
  { name: '退款审批流', type: '退款审批', nodes: 2, status: 'active' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}.card-header{display:flex;justify-content:space-between}</style>
