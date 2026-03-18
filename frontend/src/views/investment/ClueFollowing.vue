<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>跟进中线索</span></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="company" label="企业名称" min-width="150" />
        <el-table-column prop="contact" label="客户姓名" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="follow_date" label="跟进日期" width="100" />
        <el-table-column prop="visit_date" label="回访日期" width="100" />
        <el-table-column prop="follow_type" label="跟进方式" width="80" />
        <el-table-column prop="follow_status" label="跟进状态" width="80">
          <template #default="{ row }">
            <el-tag :type="{意向:'success',考察:'warning',谈判:'primary'}[row.follow_status]" size="small">{{ row.follow_status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="property_fee" label="物业费" width="80" align="right" />
        <el-table-column prop="rooms" label="选择房间" width="100" />
        <el-table-column prop="sign_time" label="签约时间" width="100" />
        <el-table-column prop="rent" label="租金" width="80" align="right" />
        <el-table-column prop="deposit" label="保证金" width="80" align="right" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleFollow(row)">跟进</el-button>
            <el-button link type="success" size="small" @click="handleToIntention(row)">转意向</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="线索跟进" width="650px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="company"><el-input v-model="form.company" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="contact"><el-input v-model="form.contact" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="跟进日期" prop="follow_date"><el-date-picker v-model="form.follow_date" type="date" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回访日期" prop="visit_date"><el-date-picker v-model="form.visit_date" type="date" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="跟进方式" prop="follow_type">
              <el-select v-model="form.follow_type" style="width:100%">
                <el-option label="电话" value="电话" />
                <el-option label="微信" value="微信" />
                <el-option label="上门" value="上门" />
                <el-option label="邮件" value="邮件" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跟进状态" prop="follow_status">
              <el-select v-model="form.follow_status" style="width:100%">
                <el-option label="意向" value="意向" />
                <el-option label="考察" value="考察" />
                <el-option label="谈判" value="谈判" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物业费"><el-input-number v-model="form.property_fee" :min="0" :precision="2" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择房间"><el-select v-model="form.room_ids" multiple style="width:100%"><el-option label="A栋101" value="1" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">可选信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="签约时间"><el-date-picker v-model="form.sign_time" type="date" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="租金"><el-input-number v-model="form.rent" :min="0" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="免租期(天)"><el-input-number v-model="form.free_period" :min="0" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付类型"><el-select v-model="form.payment_type" style="width:100%"><el-option label="月付" value="monthly" /><el-option label="季付" value="quarterly" /></el-select></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向定金"><el-input-number v-model="form.intention_deposit" :min="0" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="保证金"><el-input-number v-model="form.deposit" :min="0" style="width:200px" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
const tableData = ref([
  { company: '新创科技', contact: '张三', phone: '13800138001', follow_date: '2024-03-15', visit_date: '2024-03-20', follow_type: '电话', follow_status: '意向', property_fee: 5, rooms: 'A栋101', sign_time: '', rent: 0, deposit: 0 }
])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ company: '', contact: '', follow_date: '', visit_date: '', follow_type: '', follow_status: '', property_fee: 0, room_ids: [], sign_time: '', rent: 0, free_period: 0, payment_type: '', intention_deposit: 0, deposit: 0 })
const rules = { company: [{ required: true }], contact: [{ required: true }], follow_date: [{ required: true }], visit_date: [{ required: true }], follow_type: [{ required: true }], follow_status: [{ required: true }] }
const handleFollow = (row) => { Object.assign(form, row); dialogVisible.value = true }
const handleToIntention = (row) => { ElMessage.success('已转为意向客户') }
const handleSubmit = async () => { await formRef.value?.validate(); ElMessage.success('跟进成功'); dialogVisible.value = false }
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

