<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>采购管理</span><el-button type="primary" size="small" @click="handleAdd">新增采购</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="supplier" label="供应商" width="150" />
        <el-table-column prop="purchase_time" label="采购时间" width="100" />
        <el-table-column prop="warehouse" label="所属仓库" width="120" />
        <el-table-column prop="items" label="采购品项" min-width="200" />
        <el-table-column prop="total_amount" label="总金额" width="100" align="right">
          <template #default="{ row }">¥{{ row.total_amount?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="制单人" width="80" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">详情</el-button><el-button link type="primary" size="small">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增采购" width="800px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="供应商" prop="supplier_id">
              <el-select v-model="form.supplier_id" style="width:100%"><el-option label="供应商A" value="1" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购时间" prop="purchase_time"><el-date-picker v-model="form.purchase_time" type="date" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属仓库" prop="warehouse_id"><el-select v-model="form.warehouse_id" style="width:100%"><el-option label="A栋仓库" value="1" /></el-select></el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">采购品项</el-divider>
        <el-table :data="form.items" size="small" border>
          <el-table-column label="品项名称" width="150"><template #default="{ row }"><el-input v-model="row.name" size="small" /></template></el-table-column>
          <el-table-column label="库存数量" width="100"><template #default="{ row }"><el-input-number v-model="row.stock" :min="0" size="small" style="width:100%" /></template></el-table-column>
          <el-table-column label="计量单位" width="100"><template #default="{ row }"><el-input v-model="row.unit" size="small" /></template></el-table-column>
          <el-table-column label="单价" width="100"><template #default="{ row }"><el-input-number v-model="row.price" :min="0" :precision="2" size="small" style="width:100%" /></template></el-table-column>
          <el-table-column label="采购数量" width="100"><template #default="{ row }"><el-input-number v-model="row.quantity" :min="0" size="small" style="width:100%" /></template></el-table-column>
          <el-table-column label="优惠金额" width="100"><template #default="{ row }"><el-input-number v-model="row.discount" :min="0" size="small" style="width:100%" /></template></el-table-column>
          <el-table-column label="总价" width="100"><template #default="{ row }">¥{{ ((row.price || 0) * (row.quantity || 0) - (row.discount || 0)).toFixed(2) }}</template></el-table-column>
          <el-table-column label="备注"><template #default="{ row }"><el-input v-model="row.remark" size="small" /></template></el-table-column>
        </el-table>
        <el-button type="primary" link size="small" @click="addItem" style="margin-top:8px">+ 添加品项</el-button>
        
        <el-form-item label="备注" style="margin-top:16px"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ supplier: '供应商A', purchase_time: '2024-03-15', warehouse: 'A栋仓库', items: '办公用品 x100, 清洁用品 x50', total_amount: 5000, operator: '管理员' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ supplier_id: '', purchase_time: '', warehouse_id: '', items: [{ name: '', stock: 0, unit: '', price: 0, quantity: 0, discount: 0, remark: '' }], remark: '' })
const rules = { supplier_id: [{ required: true }], purchase_time: [{ required: true }], warehouse_id: [{ required: true }] }
const addItem = () => form.items.push({ name: '', stock: 0, unit: '', price: 0, quantity: 0, discount: 0, remark: '' })
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [{ name: '', stock: 0, unit: '', price: 0, quantity: 0, discount: 0, remark: '' }] : ''); dialogVisible.value = true }
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

