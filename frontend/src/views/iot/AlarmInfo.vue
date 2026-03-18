<template>
  <div class="page-container">
    <el-card>
      <template #header><span>报警信息</span></template>
      <el-form :inline="true" size="small">
        <el-form-item label="报警类型">
          <el-select v-model="searchForm.type" clearable style="width:120px">
            <el-option label="设备故障" value="fault" />
            <el-option label="安全报警" value="security" />
            <el-option label="设备离线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="searchForm.deviceType" clearable style="width:120px">
            <el-option label="摄像头" value="camera" />
            <el-option label="门禁" value="access" />
            <el-option label="电表" value="meter_elec" />
            <el-option label="水表" value="meter_water" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">搜索</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="latest_alarm" label="最新报警" width="160" />
        <el-table-column prop="first_alarm" label="首次报警" width="160" />
        <el-table-column prop="source" label="事件源" width="150" />
        <el-table-column prop="alarm_type" label="报警类型" width="100">
          <template #default="{ row }"><el-tag :type="{fault:'danger',security:'warning',offline:'info'}[row.alarm_type]" size="small">{{ {fault:'设备故障',security:'安全报警',offline:'设备离线'}[row.alarm_type] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="device_type" label="设备类型" width="100">
          <template #default="{ row }">{{ {camera:'摄像头',access:'门禁',meter_elec:'电表',meter_water:'水表'}[row.device_type] }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button link type="primary" size="small">处理</el-button>
            <el-button link type="primary" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const searchForm = reactive({ type: '', deviceType: '' })
const tableData = ref([
  { latest_alarm: '2024-03-17 16:00:00', first_alarm: '2024-03-17 15:30:00', source: 'A栋101水表', alarm_type: 'offline', device_type: 'meter_water' },
  { latest_alarm: '2024-03-17 14:20:00', first_alarm: '2024-03-17 14:20:00', source: 'B栋入口摄像头', alarm_type: 'fault', device_type: 'camera' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
