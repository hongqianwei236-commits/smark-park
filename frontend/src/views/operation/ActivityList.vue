<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>活动管理</span>
          <el-button type="primary" size="small" @click="handleAdd">新增活动</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="title" label="活动名称" min-width="150" />
        <el-table-column prop="time" label="活动时间" width="180" />
        <el-table-column prop="contact" label="联系人" width="80" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="project" label="所属项目" width="100" />
        <el-table-column prop="address" label="活动地址" width="150" />
        <el-table-column prop="enrollment" label="开启报名" width="80">
          <template #default="{ row }"><el-tag :type="row.enrollment ? 'success' : 'info'" size="small">{{ row.enrollment ? '是' : '否' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增活动" width="650px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="活动名称" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动时间" prop="time_range">
              <el-date-picker v-model="form.time_range" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project">
              <el-select v-model="form.project" style="width: 100%"><el-option label="科技创新园" value="1" /></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="联系人" prop="contact"><el-input v-model="form.contact" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="联系电话" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="活动地址" prop="address"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="是否开启报名">
          <el-radio-group v-model="form.enrollment"><el-radio :value="true">是</el-radio><el-radio :value="false">否</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="活动封面"><el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1"><el-icon><Plus /></el-icon></el-upload></el-form-item>
        <el-form-item label="活动正文">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="富文本编辑区域" />
        </el-form-item>
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
import { Plus } from '@element-plus/icons-vue'
const tableData = ref([{ title: '企业家交流会', time: '2024-03-20 14:00 ~ 17:00', contact: '张经理', phone: '13800138001', project: '科技创新园', address: '会议室A', enrollment: true }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ title: '', time_range: [], contact: '', phone: '', project: '', address: '', enrollment: false, content: '' })
const rules = { title: [{ required: true }], time_range: [{ required: true }], contact: [{ required: true }], phone: [{ required: true }], project: [{ required: true }], address: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [] : (typeof form[k] === 'boolean' ? false : '')); dialogVisible.value = true }
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

