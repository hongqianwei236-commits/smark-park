<template>
  <div class="page-container">
    <el-card>
      <template #header><span>巡检任务</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="plan_no" label="计划编号" width="120" />
        <el-table-column prop="plan_name" label="计划名称" width="180" />
        <el-table-column prop="check_date" label="计划检查日期" width="110" />
        <el-table-column prop="inspector" label="检查员" width="80" />
        <el-table-column prop="check_area" label="检查区域" width="120" />
        <el-table-column prop="check_type" label="检查类型" width="80" />
        <el-table-column prop="content" label="专项检查内容" min-width="150" />
        <el-table-column prop="check_result" label="检查结果" width="80">
          <template #default="{ row }"><el-tag :type="row.check_result === 'pass' ? 'success' : 'danger'" size="small">{{ row.check_result === 'pass' ? '合格' : '不合格' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="check_time" label="检查时间" width="140" />
        <el-table-column label="操作" width="100">
          <template #default><el-button link type="primary" size="small">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { plan_no: 'XP2024002', plan_name: '第二季度消防安全巡检', check_date: '2024-04-15', inspector: '张三', check_area: 'A栋', check_type: '消防', content: '消防栓、灭火器检查', check_result: 'pass', check_time: '2024-04-15 10:00' },
  { plan_no: 'XP2024002', plan_name: '第二季度消防安全巡检', check_date: '2024-04-15', inspector: '李四', check_area: 'B栋', check_type: '消防', content: '消防栓、灭火器检查', check_result: 'fail', check_time: '2024-04-15 14:00' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
