<template>
  <div class="page-container">
    <el-card>
      <template #header><span>检查类目</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="category" label="检查类目" width="120" />
        <el-table-column prop="item" label="检查项目" />
        <el-table-column prop="method" label="检查方法" width="150" />
        <el-table-column prop="regulation" label="法律法规" width="150" />
        <el-table-column prop="check_type" label="检查类型" width="80" />
        <el-table-column prop="period" label="检查周期" width="80" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { category: '消防安全', item: '灭火器检查', method: '目测、压力表', regulation: '消防法', check_type: '消防', period: '每月', remark: '' },
  { category: '消防安全', item: '消防栓检查', method: '目测、试水', regulation: '消防法', check_type: '消防', period: '每月', remark: '' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
