<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>佣金设置</span><el-button type="primary" size="small" @click="handleAdd">新增规则</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="佣金规则" />
        <el-table-column prop="settlement_type" label="结算方式" width="100" />
        <el-table-column prop="commission_mode" label="提成模式" width="100" />
        <el-table-column prop="upgrade_type" label="升档方式" width="120" />
        <el-table-column prop="commission_type" label="提成方式" width="100" />
        <el-table-column label="档位设置" width="200">
          <template #default="{ row }">
            <span v-for="(t, idx) in row.tiers" :key="idx">{{ t.name }}:{{ t.rate }}%{{ idx < row.tiers.length - 1 ? ', ' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="招商管理提成" width="100">
          <template #default="{ row }"><el-tag :type="row.sales_commission ? 'success' : 'info'" size="small">{{ row.sales_commission ? '开启' : '关闭' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="渠道提成" width="80">
          <template #default="{ row }"><el-tag :type="row.channel_commission ? 'success' : 'info'" size="small">{{ row.channel_commission ? '开启' : '关闭' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增佣金规则" width="750px">
      <el-form :model="form" label-width="130px" :rules="rules" ref="formRef" size="small">
        <el-form-item label="佣金规则" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结算方式" prop="settlement_type">
              <el-radio-group v-model="form.settlement_type"><el-radio value="manual">手动结算</el-radio><el-radio value="auto">自动结算</el-radio></el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提成模式" prop="commission_mode">
              <el-radio-group v-model="form.commission_mode"><el-radio value="standard">标准</el-radio><el-radio value="custom">自定义</el-radio></el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="升档方式" prop="upgrade_type">
              <el-radio-group v-model="form.upgrade_type">
                <el-radio value="none">无升档</el-radio>
                <el-radio value="contract_count">合同数量</el-radio>
                <el-radio value="contract_amount">合同金额</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提成方式" prop="commission_type">
              <el-radio-group v-model="form.commission_type"><el-radio value="fixed_ratio">固定比例</el-radio></el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">档位设置</el-divider>
        <el-table :data="form.tiers" size="small" border>
          <el-table-column label="档位名称" width="150">
            <template #default="{ row }"><el-input v-model="row.name" size="small" /></template>
          </el-table-column>
          <el-table-column label="档位下限" width="150">
            <template #default="{ row }">
              <el-input-number v-model="row.lower_limit" :min="0" size="small" style="width:100%" />
            </template>
          </el-table-column>
          <el-table-column label="提成比例" width="150">
            <template #default="{ row }">
              <el-input-number v-model="row.rate" :min="0" :max="100" :precision="2" size="small" style="width:100%">
                <template #append>%</template>
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{  }">
              <el-button link type="danger" size="small" @click="form.tiers.splice(, 1)" v-if=" > 0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" link size="small" @click="addTier" style="margin-top:8px">+ 新增档位</el-button>
        
        <el-divider />
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="招商管理提成"><el-switch v-model="form.sales_commission" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道提成"><el-switch v-model="form.channel_commission" /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { investmentApi } from '../../api/index.js'
const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ name: '', settlement_type: 'manual', commission_mode: 'standard', upgrade_type: 'none', commission_type: 'fixed_ratio', tiers: [{ name: '', lower_limit: 0, rate: 0 }], sales_commission: false, channel_commission: false })
const rules = { name: [{ required: true }], settlement_type: [{ required: true }], commission_mode: [{ required: true }], upgrade_type: [{ required: true }], commission_type: [{ required: true }] }
const addTier = () => form.tiers.push({ name: '', lower_limit: 0, rate: 0 })
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = Array.isArray(form[k]) ? [{ name: '', lower_limit: 0, rate: 0 }] : (typeof form[k] === 'boolean' ? false : '')); dialogVisible.value = true }

onMounted(async () => {
  const res = await investmentApi.getCommissions()
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

