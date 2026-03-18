<template>
  <div class="page-container">
    <el-card>
      <template #header><span>流水管理</span></template>
      <el-form :inline="true" size="small">
        <el-form-item label="流水类型">
          <el-select v-model="searchForm.type" clearable style="width:100px">
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" style="width:220px" />
        </el-form-item>
        <el-form-item><el-button type="primary">搜索</el-button></el-form-item>
      </el-form>
      
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }"><el-tag :type="row.type === 'income' ? 'success' : 'danger'" size="small">{{ row.type === 'income' ? '收入' : '支出' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="bill_no" label="账单编号" width="120" />
        <el-table-column prop="contract_no" label="合同号" width="120" />
        <el-table-column prop="room_no" label="房间" width="100" />
        <el-table-column prop="tenant_name" label="承租方" width="150" />
        <el-table-column prop="fee_type_name" label="费用类型" width="100" />
        <el-table-column prop="amount" label="金额" width="100" align="right">
          <template #default="{ row }"><span :style="{color: row.type === 'income' ? '#67c23a' : '#f56c6c'}">{{ row.type === 'income' ? '+' : '-' }}¥{{ row.amount?.toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column prop="pay_time" label="到账时间" width="140" />
        <el-table-column prop="pay_method" label="支付方式" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'paid' ? 'success' : 'warning'" size="small">{{ row.status === 'paid' ? '已到账' : '待到账' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small">详情</el-button>
            <el-button link type="primary" size="small" v-if="row.status !== 'paid'">核销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { financeApi } from '../../api/index.js'
const tableData = ref([])
const searchForm = reactive({ type: '', dateRange: [] })
onMounted(async () => {
  const res = await financeApi.getCashFlows()
  if (res.success) tableData.value = res.data
})
</script>
<style scoped>.page-container {
  padding: 20px;
  height: calc(100vh - 50px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.page-container :deep(.el-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-container :deep(.el-card__header) {
  flex-shrink: 0;
}
.page-container :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
}</style>

