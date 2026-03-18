<template>
  <div class="page-container">
    <el-card>
      <template #header><span>风险辨识</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="risk_no" label="风险分级管控编号" width="150" />
        <el-table-column prop="category" label="风险分类" width="100" />
        <el-table-column prop="name" label="风险名称" />
        <el-table-column prop="location" label="风险位置" width="120" />
        <el-table-column prop="level" label="风险等级" width="80">
          <template #default="{ row }"><el-tag :type="{high:'danger',medium:'warning',low:'info'}[row.level]" size="small">{{ {high:'高',medium:'中',low:'低'}[row.level] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="owner" label="风险责任人" width="100" />
        <el-table-column prop="frequency" label="巡检频次" width="80" />
        <el-table-column prop="start_time" label="巡检开始时间" width="120" />
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="primary" size="small">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { risk_no: 'FX2024001', category: '消防', name: '消防通道堵塞风险', location: 'A栋1层', level: 'high', owner: '张三', frequency: '每日', start_time: '2024-01-01' },
  { risk_no: 'FX2024002', category: '电气', name: '配电室触电风险', location: '配电室', level: 'high', owner: '李四', frequency: '每周', start_time: '2024-01-01' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
