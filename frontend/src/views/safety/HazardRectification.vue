<template>
  <div class="page-container">
    <el-card>
      <template #header><span>隐患整改</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="project" label="项目名称" width="150" />
        <el-table-column prop="company" label="企业名称" width="150" />
        <el-table-column prop="check_type" label="检查类型" width="80" />
        <el-table-column prop="check_date" label="检查日期" width="100" />
        <el-table-column prop="inspector" label="检查人" width="80" />
        <el-table-column prop="deadline" label="整改期限" width="100" />
        <el-table-column prop="reviewer" label="复查人" width="80" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">整改</el-button><el-button link type="primary" size="small">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { project: '科技创新园', company: '智能制造公司', check_type: '消防', check_date: '2024-04-15', inspector: '李四', deadline: '2024-04-25', reviewer: '张三', remark: '灭火器过期' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
