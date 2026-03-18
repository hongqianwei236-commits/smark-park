<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>巡检计划</span><el-button type="primary" size="small">新增计划</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="plan_no" label="隐患排查计划编号" width="150" />
        <el-table-column prop="plan_name" label="隐患排查计划名称" />
        <el-table-column prop="plan_date" label="计划制定日期" width="110" />
        <el-table-column prop="plan_status" label="计划状态" width="80">
          <template #default="{ row }"><el-tag :type="{draft:'info',active:'success',completed:'warning'}[row.plan_status]" size="small">{{ {draft:'草稿',active:'执行中',completed:'已完成'}[row.plan_status] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="executor" label="计划执行人员" width="100" />
        <el-table-column prop="approver" label="审批人" width="80" />
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
  { plan_no: 'XP2024001', plan_name: '第一季度消防安全巡检计划', plan_date: '2024-01-15', plan_status: 'completed', executor: '张三', approver: '李总' },
  { plan_no: 'XP2024002', plan_name: '第二季度消防安全巡检计划', plan_date: '2024-04-01', plan_status: 'active', executor: '张三', approver: '李总' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}.card-header{display:flex;justify-content:space-between}</style>
