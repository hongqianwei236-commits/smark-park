<template>
  <div class="page-container">
    <el-card>
      <template #header">
        <div class="card-header"><span>库存调整</span><el-button type="primary" size="small" @click="handleAdd">新增调整</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="bill_no" label="单据编号" width="120" />
        <el-table-column prop="warehouse" label="仓库" width="120" />
        <el-table-column prop="items" label="调整物品" min-width="200" />
        <el-table-column prop="create_time" label="创建时间" width="140" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">提交审核</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增库存调整" width="650px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="仓库" prop="warehouse_id"><el-select v-model="form.warehouse_id" style="width:200px"><el-option label="A栋仓库" value="1" /></el-select></el-form-item>
        
        <el-divider content-position="left">库存调整单</el-divider>
        <el-table :data="form.items" size="small" border>
          <el-table-column label="物品名称"><template #default="{ row }"><el-select v-model="row.item_id" size="small"><el-option label="办公用品" value="1" /></el-select></template></el-table-column>
          <el-table-column label="计量单位" width="80"><template #default="{ row }">{{ row.unit || '件' }}</template></el-table-column>
          <el-table-column label="库存数量" width="80"><template #default="{ row }">{{ row.stock || 100 }}</template></el-table-column>
          <el-table-column label="实际数量" width="100"><template #default="{ row }"><el-input-number v-model="row.actual" :min="0" size="small" style="width:100%" /></template></el-table-column>
          <el-table-column label="盈亏数量" width="100"><template #default="{ row }"><span :style="{color: (row.actual - row.stock) >= 0 ? '#67c23a' : '#f56c6c'}">{{ row.actual - row.stock }}</span></template></el-table-column>
          <el-table-column label="备注"><template #default="{ row }"><el-input v-model="row.remark" size="small" /></template></el-table-column>
        </el-table>
        <el-button type="primary" link size="small" @click="addItem" style="margin-top:8px">+ 添加物品</el-button>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ bill_no: 'KC2024001', warehouse: 'A栋仓库', items: '办公用品 盘盈10件', create_time: '2024-03-15' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ warehouse_id: '', items: [{ item_id: '', unit: '件', stock: 100, actual: 100, remark: '' }] })
const rules = { warehouse_id: [{ required: true }] }
const addItem = () => form.items.push({ item_id: '', unit: '件', stock: 100, actual: 100, remark: '' })
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [{ item_id: '', unit: '件', stock: 100, actual: 100, remark: '' }] : ''); dialogVisible.value = true }
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
}.card-header{display:flex;justify-content:space-between}</style>

