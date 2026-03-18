<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>退租验收（退场管理）</span>
          <el-button type="primary" size="small" @click="handleAdd">新增退场</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="room" label="房源" width="100" />
        <el-table-column prop="tenant" label="房屋承租人" width="150" />
        <el-table-column prop="exit_type" label="退场类型" width="100" />
        <el-table-column prop="exit_date" label="退场日期" width="100" />
        <el-table-column prop="meters" label="抄表信息" width="100" />
        <el-table-column prop="assets" label="固定资产" width="120">
          <template #default="{ row }">{{ row.assets || '-' }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="经办人" width="80" />
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增退场" width="750px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="房源" prop="room_id"><el-select v-model="form.room_id" style="width: 100%"><el-option label="A栋101" value="1" /></el-select></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="房屋承租人" prop="tenant_id"><el-select v-model="form.tenant_id" style="width: 100%"><el-option label="科技创新有限公司" value="1" /></el-select></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退场日期" prop="exit_date"><el-date-picker v-model="form.exit_date" type="date" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="退场类型"><el-input v-model="form.exit_type" /></el-form-item>
        <el-form-item label="经办人"><el-input v-model="form.operator" /></el-form-item>
        
        <el-divider content-position="left">抄表信息</el-divider>
        <el-table :data="form.meter_list" size="small" border>
          <el-table-column label="表种类" width="100"><template #default="{ row }"><el-select v-model="row.type" size="small"><el-option label="电表" value="electric" /><el-option label="水表" value="water" /></el-select></template></el-table-column>
          <el-table-column label="上次读数" width="100"><template #default="{ row }"><el-input-number v-model="row.last_reading" size="small" :min="0" style="width:100%" /></template></el-table-column>
          <el-table-column label="当前读数" width="100"><template #default="{ row }"><el-input-number v-model="row.current_reading" size="small" :min="0" style="width:100%" /></template></el-table-column>
          <el-table-column label="抄表时间" width="150"><template #default="{ row }"><el-date-picker v-model="row.read_time" type="datetime" size="small" style="width:100%" /></template></el-table-column>
        </el-table>
        
        <el-divider content-position="left">固定资产</el-divider>
        <el-table :data="form.asset_list" size="small" border>
          <el-table-column label="资产编码"><template #default="{ row }"><el-input v-model="row.code" size="small" /></template></el-table-column>
          <el-table-column label="资产名称"><template #default="{ row }"><el-input v-model="row.name" size="small" /></template></el-table-column>
          <el-table-column label="赔偿金额" width="100"><template #default="{ row }"><el-input-number v-model="row.compensation" size="small" :min="0" style="width:100%" /></template></el-table-column>
          <el-table-column label="是否退回仓库" width="120"><template #default="{ row }"><el-switch v-model="row.return_warehouse" /></template></el-column>
        </el-table>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ room: 'A栋101', tenant: '某公司', exit_type: '正常退租', exit_date: '2024-03-20', meters: '-', assets: '空调1台', operator: '管理员' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ room_id: '', tenant_id: '', exit_date: '', exit_type: '', operator: '', meter_list: [], asset_list: [] })
const rules = { room_id: [{ required: true }], tenant_id: [{ required: true }], exit_date: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [] : ''); dialogVisible.value = true }
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

