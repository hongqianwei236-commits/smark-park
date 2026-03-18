<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>出入证信息</span><el-button type="primary" size="small" @click="handleAdd">发放通行证</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="pass_no" label="出入证编号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="id_card" label="身份证号码" width="180" />
        <el-table-column prop="valid_start" label="有效期开始" width="100" />
        <el-table-column prop="valid_end" label="有效期结束" width="100" />
        <el-table-column prop="room" label="归属房源" width="100" />
        <el-table-column prop="position" label="位置" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'valid' ? 'success' : 'info'" size="small">{{ row.status === 'valid' ? '有效' : '过期' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">注销</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="发放通行证" width="600px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id">
              <el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone"><el-input v-model="form.phone" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="id_card"><el-input v-model="form.id_card" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="出入起止时间" prop="valid_range">
          <el-date-picker v-model="form.valid_range" type="daterange" range-separator="至" style="width:100%" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="归属房源" prop="room_id"><el-select v-model="form.room_id" style="width:100%"><el-option label="A栋101" value="1" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置"><el-input v-model="form.position" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="发放原因"><el-input v-model="form.reason" type="textarea" /></el-form-item>
        <el-form-item label="人脸门禁">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1"><el-icon><Plus /></el-icon></el-upload>
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
const tableData = ref([{ pass_no: 'CRZ2024001', name: '张三', phone: '13800138001', id_card: '320123199001011234', valid_start: '2024-01-01', valid_end: '2024-12-31', room: 'A栋101', position: 'A栋', status: 'valid' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ project_id: '', name: '', phone: '', id_card: '', valid_range: [], room_id: '', position: '', reason: '' })
const rules = { project_id: [{ required: true }], name: [{ required: true }], phone: [{ required: true }], id_card: [{ required: true }], valid_range: [{ required: true }], room_id: [{ required: true }] }
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

