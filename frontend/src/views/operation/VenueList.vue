<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>场地管理</span><el-button type="primary" size="small" @click="handleAdd">新增场地</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="venue_type" label="场地类型" width="100" />
        <el-table-column prop="name" label="场地名称" width="150" />
        <el-table-column prop="project" label="所属项目" width="120" />
        <el-table-column prop="address" label="场地地址" min-width="150" />
        <el-table-column prop="price_rule" label="计费规则" width="120" />
        <el-table-column prop="sort" label="排序" width="60" align="center" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'available' ? 'success' : 'warning'" size="small">{{ row.status === 'available' ? '可用' : '占用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增场地" width="700px">
      <el-form :model="form" label-width="140px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="场地类型" prop="venue_type">
              <el-select v-model="form.venue_type" style="width:100%"><el-option label="会议室" value="meeting" /><el-option label="活动室" value="activity" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地名称" prop="name"><el-input v-model="form.name" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id">
              <el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地地址"><el-input v-model="form.address" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="经纬度"><el-input v-model="form.location" placeholder="如: 120.123,31.456" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计费规则" prop="price_rule_id">
              <el-select v-model="form.price_rule_id" style="width:100%"><el-option label="标准计费" value="1" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="场地图片"><el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="3"><el-icon><Plus /></el-icon></el-upload></el-form-item>
        <el-form-item label="最早提前预订"><el-input-number v-model="form.advance_days" :min="0" style="width:120px" /><span style="margin-left:8px">天</span></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="可预订时间"><el-time-picker v-model="form.available_time" is-range range-separator="至" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间间隔"><el-input-number v-model="form.time_interval" :min="15" step="15" style="width:120px" /><span style="margin-left:8px">分钟</span></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="最多进场人数"><el-input-number v-model="form.max_people" :min="0" style="width:120px" /></el-form-item>
        <el-form-item label="通知人"><el-input v-model="form.notifier" /></el-form-item>
        <el-form-item label="场地介绍"><el-input v-model="form.intro" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { operationApi } from '../../api/index.js'
const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ venue_type: '', name: '', project_id: '', address: '', location: '', price_rule_id: '', sort: 0, advance_days: 1, available_time: [], time_interval: 30, max_people: 50, notifier: '', intro: '' })
const rules = { venue_type: [{ required: true }], name: [{ required: true }], project_id: [{ required: true }], price_rule_id: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [] : (typeof form[k] === 'number' ? 0 : '')); dialogVisible.value = true }

onMounted(async () => {
  const res = await operationApi.getVenues()
  if (res.success) tableData.value = res.data
})
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

