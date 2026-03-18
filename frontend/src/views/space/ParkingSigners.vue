<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>车位签订人</span>
          <el-button type="primary" size="small">新增</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="签订人名称" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="id_card" label="证件号" width="180" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
const tableData = ([{ name: "张三", phone: "13800138001", id_card: "", remark: "" }])
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
}.card-header { display: flex; justify-content: space-between; }</style>

