<template>
  <div class="page-container">
    <el-card>
      <template #header><span>审批记录</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="apply_no" label="申请编号" width="130" />
        <el-table-column prop="apply_type" label="申请类型" width="100" />
        <el-table-column prop="applicant" label="申请人" width="80" />
        <el-table-column prop="apply_time" label="申请时间" width="140" />
        <el-table-column prop="current_node" label="当前节点" width="100" />
        <el-table-column prop="approver" label="审批人" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="{pending:'warning',approved:'success',rejected:'danger'}[row.status]" size="small">{{ {pending:'待审批',approved:'已通过',rejected:'已拒绝'}[row.status] }}</el-tag></template>
        </el-table-column>
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
  { apply_no: 'SP2024001', apply_type: '合同审批', applicant: '张三', apply_time: '2024-03-17 10:00', current_node: '财务审核', approver: '李四', status: 'pending' },
  { apply_no: 'SP2024002', apply_type: '退款审批', applicant: '王五', apply_time: '2024-03-16 14:00', current_node: '完成', approver: '-', status: 'approved' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
