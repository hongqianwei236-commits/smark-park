<template>
  <div class="page-container">
    <el-card>
      <template #header><span>设备列表</span></template>
      <el-form :inline="true" size="small">
        <el-form-item label="设备名称"><el-input v-model="searchForm.name" clearable /></el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="searchForm.type" clearable style="width:120px">
            <el-option label="摄像头" value="camera" />
            <el-option label="门禁" value="access" />
            <el-option label="电表" value="meter_elec" />
            <el-option label="水表" value="meter_water" />
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="searchForm.online" clearable style="width:100px">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">搜索</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="type" label="设备类型" width="100">
          <template #default="{ row }">{{ {camera:'摄像头',access:'门禁',meter_elec:'电表',meter_water:'水表'}[row.type] }}</template>
        </el-table-column>
        <el-table-column prop="serial" label="序列号" width="150" />
        <el-table-column prop="unit" label="所属单位" width="150" />
        <el-table-column prop="online" label="在线状态" width="80">
          <template #default="{ row }"><el-tag :type="row.online === 'online' ? 'success' : 'danger'" size="small">{{ row.online === 'online' ? '在线' : '离线' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="status" label="设备状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'normal' ? 'success' : 'warning'" size="small">{{ row.status === 'normal' ? '正常' : '异常' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const searchForm = reactive({ name: '', type: '', online: '' })
const tableData = ref([
  { name: 'A栋入口摄像头', type: 'camera', serial: 'CAM001', unit: '科技创新园', online: 'online', status: 'normal' },
  { name: 'A栋大厅门禁', type: 'access', serial: 'ACC001', unit: '科技创新园', online: 'online', status: 'normal' },
  { name: 'A栋101电表', type: 'meter_elec', serial: 'ELEC001', unit: 'A栋101', online: 'online', status: 'normal' },
  { name: 'A栋101水表', type: 'meter_water', serial: 'WATER001', unit: 'A栋101', online: 'offline', status: 'normal' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
