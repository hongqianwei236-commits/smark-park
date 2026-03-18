<template>
  <div class="page-container">
    <el-card>
      <template #header><span>发票类型</span></template>
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="name" label="类型名称" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { financeApi } from '../../api/index.js'
const tableData = ref([])
onMounted(async () => {
  const res = await financeApi.getInvoiceTypes()
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

