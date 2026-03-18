<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>隐患库</span><el-button type="primary" size="small">新增</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="description" label="隐患描述" min-width="200" />
        <el-table-column prop="basis" label="检查依据" width="150" />
        <el-table-column prop="suggestion" label="整改建议" width="150" />
        <el-table-column prop="level" label="隐患级别" width="80">
          <template #default="{ row }"><el-tag :type="{high:'danger',medium:'warning',low:'info'}[row.level]" size="small">{{ {high:'高',medium:'中',low:'低'}[row.level] }}</el-tag></template>
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
  { description: '灭火器压力不足', basis: '消防法第16条', suggestion: '更换或充装', level: 'medium' },
  { description: '消防通道堵塞', basis: '消防法第28条', suggestion: '清理通道杂物', level: 'high' },
  { description: '电线老化裸露', basis: '电气安全规程', suggestion: '更换电线', level: 'high' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}.card-header{display:flex;justify-content:space-between}</style>
