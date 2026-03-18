<template>
  <div class="page-container">
    <el-card>
      <template #header><span>风险任务</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="task_no" label="安全巡检编号" width="130" />
        <el-table-column prop="owner" label="风险责任人" width="100" />
        <el-table-column prop="name" label="风险名称" />
        <el-table-column prop="location" label="风险位置" width="120" />
        <el-table-column prop="level" label="风险等级" width="80">
          <template #default="{ row }"><el-tag :type="{high:'danger',medium:'warning',low:'info'}[row.level]" size="small">{{ {high:'高',medium:'中',low:'低'}[row.level] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="description" label="风险描述" width="150" />
        <el-table-column prop="frequency" label="巡检频次" width="80" />
        <el-table-column prop="result" label="巡检结果" width="80">
          <template #default="{ row }"><el-tag :type="row.result === 'normal' ? 'success' : 'warning'" size="small">{{ row.result === 'normal' ? '正常' : '异常' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="check_time" label="巡检时间" width="140" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { task_no: 'AQ202401001', owner: '张三', name: '消防通道堵塞风险', location: 'A栋1层', level: 'high', description: '消防通道是否畅通', frequency: '每日', result: 'normal', check_time: '2024-03-17 09:00' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
