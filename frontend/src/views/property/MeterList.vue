<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>水电表抄表</span>
          <el-button type="primary" size="small" @click="handleAdd">新增抄表</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="room" label="所属房间" width="120" />
        <el-table-column prop="meter_type" label="表种类" width="80">
          <template #default="{ row }"><el-tag size="small" :type="row.meter_type === 'electric' ? 'warning' : 'primary'">{{ row.meter_type === 'electric' ? '电表' : '水表' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="meter_name" label="表名称" width="100" />
        <el-table-column prop="last_reading" label="上次读数" width="100" align="right" />
        <el-table-column prop="current_reading" label="当前读数" width="100" align="right" />
        <el-table-column prop="usage" label="用量" width="80" align="right">
          <template #default="{ row }">{{ row.meter_type === 'electric' ? row.usage + ' kWh' : row.usage + ' m³' }}</template>
        </el-table-column>
        <el-table-column prop="unit_price" label="单价" width="80" align="right">
          <template #default="{ row }">{{ '¥' + row.unit_price + '/' + (row.meter_type === 'electric' ? 'kWh' : 'm³') }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="100" align="right">
          <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="last_time" label="上次抄表时间" width="140" />
        <el-table-column prop="read_time" label="抄表时间" width="140" />
        <el-table-column prop="operator" label="操作人" width="80" />
        <el-table-column label="操作" width="100">
          <template #default><el-button link type="primary" size="small">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增抄表记录" width="550px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="所属房间" prop="room_id">
          <el-select v-model="form.room_id" style="width: 100%"><el-option label="A栋101" value="1" /></el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="表种类" prop="meter_type">
              <el-select v-model="form.meter_type" style="width: 100%">
                <el-option label="电表" value="electric" />
                <el-option label="水表" value="water" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表名称"><el-input v-model="form.meter_name" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="原始读数"><el-input-number v-model="form.last_reading" :min="0" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前读数" prop="current_reading"><el-input-number v-model="form.current_reading" :min="0" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="unit_price"><el-input-number v-model="form.unit_price" :min="0" :precision="2" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抄表时间" prop="read_time"><el-date-picker v-model="form.read_time" type="datetime" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件"><el-upload action="#" :auto-upload="false"><el-button size="small">上传附件</el-button></el-upload></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
const tableData = ref([
  { room: 'A栋101', meter_type: 'electric', meter_name: '电表1', last_reading: 1000, current_reading: 1250, usage: 250, unit_price: 0.85, amount: 212.50, last_time: '2024-02-01', read_time: '2024-03-01', operator: '管理员' },
  { room: 'A栋101', meter_type: 'water', meter_name: '水表1', last_reading: 500, current_reading: 580, usage: 80, unit_price: 3.5, amount: 280, last_time: '2024-02-01', read_time: '2024-03-01', operator: '管理员' }
])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ room_id: '', meter_type: 'electric', meter_name: '', last_reading: 0, current_reading: 0, unit_price: 0, read_time: '', remark: '' })
const rules = { room_id: [{ required: true, message: '请选择房间', trigger: 'change' }], meter_type: [{ required: true }], current_reading: [{ required: true }], unit_price: [{ required: true }], read_time: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = typeof form[k] === 'number' ? 0 : ''); form.meter_type = 'electric'; dialogVisible.value = true }
const handleSubmit = async () => { await formRef.value?.validate(); ElMessage.success('保存成功'); dialogVisible.value = false }
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

