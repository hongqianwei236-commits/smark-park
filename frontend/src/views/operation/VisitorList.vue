<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>访客预约</span><el-button type="primary" size="small" @click="handleAdd">新增预约</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="visitor_name" label="访客姓名" width="100" />
        <el-table-column prop="visitor_phone" label="手机号码" width="120" />
        <el-table-column prop="company" label="拜访企业" width="150" />
        <el-table-column prop="visit_date" label="拜访日期" width="100" />
        <el-table-column prop="visit_time" label="拜访时间" width="100" />
        <el-table-column prop="purpose" label="拜访事由" min-width="150" />
        <el-table-column prop="room" label="选择房间" width="100" />
        <el-table-column prop="plate" label="车牌号" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="{pending:'warning',visiting:'success',left:'info'}[row.status]" size="small">{{ {pending:'待访问',visiting:'访问中',left:'已离开'}[row.status] }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default><el-button link type="primary" size="small">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增访客预约" width="600px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="project_id"><el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="visitor_name"><el-input v-model="form.visitor_name" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="visitor_phone"><el-input v-model="form.visitor_phone" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拜访企业" prop="company"><el-select v-model="form.company" style="width:100%"><el-option label="科技创新有限公司" value="1" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="拜访日期" prop="visit_date"><el-date-picker v-model="form.visit_date" type="date" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间" prop="start_time"><el-time-picker v-model="form.start_time" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="end_time"><el-time-picker v-model="form.end_time" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="拜访事由" prop="purpose"><el-input v-model="form.purpose" type="textarea" /></el-form-item>
        <el-form-item label="选择房间"><el-select v-model="form.room_id" style="width:200px"><el-option label="A栋101" value="1" /></el-select></el-form-item>
        <el-form-item label="车辆信息">
          <el-input v-model="form.plate" placeholder="车牌号" style="width:150px;margin-right:10px" />
          <el-button size="small" @click="addPlate">+ 添加车牌</el-button>
        </el-form-item>
        <el-form-item label="人脸图片"><el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1"><el-icon><Plus /></el-icon></el-upload></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
const tableData = ref([{ visitor_name: '李四', visitor_phone: '13900139001', company: '科技创新有限公司', visit_date: '2024-03-20', visit_time: '10:00-12:00', purpose: '商务洽谈', room: 'A栋101', plate: '', status: 'pending' }])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ project_id: '', visitor_name: '', visitor_phone: '', company: '', visit_date: '', start_time: '', end_time: '', purpose: '', room_id: '', plate: '', remark: '' })
const rules = { project_id: [{ required: true }], visitor_name: [{ required: true }], visitor_phone: [{ required: true }], company: [{ required: true }], visit_date: [{ required: true }], start_time: [{ required: true }], end_time: [{ required: true }], purpose: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = ''); dialogVisible.value = true }
const addPlate = () => {}
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

