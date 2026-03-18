<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>招商团队</span><el-button type="primary" size="small" @click="handleAdd">新增团队</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="团队名称" />
        <el-table-column prop="manager" label="招商经理" width="100" />
        <el-table-column prop="project" label="所属项目" width="150" />
        <el-table-column prop="commission" label="佣金模板" width="150" />
        <el-table-column prop="member_count" label="成员数量" width="80" align="center" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }"><el-button link type="primary" size="small" @click="openMembers(row)">团队人员</el-button><el-button link type="primary" size="small">编辑</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 团队人员穿梭框弹窗 -->
    <el-dialog v-model="membersVisible" :title="currentTeam?.name + ' - 团队人员'" width="680px">
      <el-transfer
        v-model="selectedMembers"
        :data="allStaff"
        :titles="['所有成员', '已选择成员']"
        filterable
        filter-placeholder="请输入姓名"
        style="display:flex;justify-content:center"
      />
      <template #footer>
        <el-button @click="membersVisible=false">取消</el-button>
        <el-button type="primary" @click="saveMembers">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible" title="新增招商团队" width="500px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="团队名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="招商经理" prop="manager_id">
          <el-select v-model="form.manager_id" style="width:100%"><el-option label="张三" value="1" /></el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="form.project_id" style="width:100%"><el-option label="科技创新园" value="1" /></el-select>
        </el-form-item>
        <el-form-item label="佣金模板" prop="commission_id">
          <el-select v-model="form.commission_id" style="width:100%">
            <el-option label="标准佣金规则" value="1" />
            <el-option label="+ 新增佣金模板" value="new" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary">确定</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { investmentApi } from '@/api/index.js'
const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ name: '', manager_id: '', project_id: '', commission_id: '' })
const rules = { name: [{ required: true }], manager_id: [{ required: true }], project_id: [{ required: true }], commission_id: [{ required: true }] }
const handleAdd = () => { Object.keys(form).forEach(k => form[k] = ''); dialogVisible.value = true }

onMounted(async () => {
  const res = await investmentApi.getTeams()
  if (res.success) tableData.value = res.data
})

// 团队人员穿梭框
const allStaff = ref([])
const membersVisible = ref(false)
const currentTeam = ref(null)
const selectedMembers = ref([])

onMounted(async () => {
  try {
    const res = await investmentApi.getStaff()
    allStaff.value = (res.data || []).map(s => ({ key: s.id, label: s.name }))
  } catch {}
})

const openMembers = (row) => {
  currentTeam.value = row
  selectedMembers.value = row.memberKeys ? [...row.memberKeys] : []
  membersVisible.value = true
}
const saveMembers = () => {
  if (currentTeam.value) {
    currentTeam.value.memberKeys = [...selectedMembers.value]
    currentTeam.value.member_count = selectedMembers.value.length
  }
  membersVisible.value = false
}
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

