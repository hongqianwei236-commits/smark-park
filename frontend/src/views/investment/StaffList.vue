<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>招商人员</span>
          <el-button type="primary" size="small" @click="openAdd">新增</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="招商人名称" />
        <el-table-column prop="phone" label="招商人电话" width="130" />
        <el-table-column prop="team" label="所属团队" />
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新建招商人员" width="460px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="姓名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="电话" required><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="所属团队">
          <el-select v-model="form.team" style="width:100%">
            <el-option label="招商一组" value="招商一组" />
            <el-option label="招商二组" value="招商二组" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { investmentApi } from '../../api/index.js'
const tableData = ref([])
const dialogVisible = ref(false)
const form = reactive({ name: '', phone: '', team: '' })
const openAdd = () => { Object.assign(form, { name: '', phone: '', team: '' }); dialogVisible.value = true }
const confirm = async () => {
  if (!form.name || !form.phone) return
  const res = await investmentApi.createStaff({ ...form })
  if (res.success) { tableData.value.push(res.data); dialogVisible.value = false }
}
onMounted(async () => {
  const res = await investmentApi.getStaff()
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
}.card-header { display: flex; justify-content: space-between; }</style>

