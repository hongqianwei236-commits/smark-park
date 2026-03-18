<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>检查表</span><el-button type="primary" size="small">新增</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="检查表名称" />
        <el-table-column prop="item_count" label="检查内容（项）" width="120" align="center" />
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
  { name: '消防安全检查表', item_count: 15 },
  { name: '电气安全检查表', item_count: 12 },
  { name: '特种设备检查表', item_count: 8 }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}.card-header{display:flex;justify-content:space-between}</style>
