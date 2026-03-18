<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>门禁设备</span><el-button type="primary" size="small" @click="handleAdd">新增设备</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="project" label="所属项目" width="150" />
        <el-table-column prop="name" label="门禁名称" width="150" />
        <el-table-column prop="device_type" label="设备类型" width="100" />
        <el-table-column prop="protocol" label="对接协议" width="100" />
        <el-table-column prop="device" label="选择设备" width="150" />
        <el-table-column prop="scene" label="使用场景" width="100" />
        <el-table-column prop="location" label="使用位置" width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'online' ? 'success' : 'danger'" size="small">{{ row.status === 'online' ? '在线' : '离线' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增门禁设备" width="550px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select>
        </el-form-item>
        <el-form-item label="门禁名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备类型" prop="device_type">
              <el-select v-model="form.device_type" style="width:100%"><el-option label="人脸门禁" value="face" /><el-option label="刷卡门禁" value="card" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对接协议" prop="protocol">
              <el-select v-model="form.protocol" style="width:100%"><el-option label="HTTP" value="http" /><el-option label="MQTT" value="mqtt" /></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="选择设备" prop="device"><el-input v-model="form.device" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="使用场景" prop="scene">
              <el-select v-model="form.scene" style="width:100%"><el-option label出入口" value="entrance" /><el-option label="电梯" value="elevator" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用位置" prop="location"><el-input v-model="form.location" /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const tableData = ref([{ project: '科技创新园', name: 'A栋大门', device_type: '人脸门禁', protocol: 'HTTP', device: '设备A001', scene: '出入口', location: 'A栋一层', status: 'online' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ project_id: '', name: '', device_type: '', protocol: '', device: '', scene: '', location: '' })
const rules = { project_id: [{ required: true }], name: [{ required: true }], device_type: [{ required: true }], protocol: [{ required: true }], device: [{ required: true }], scene: [{ required: true }], location: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = ''); dialogVisible.value = true }
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

