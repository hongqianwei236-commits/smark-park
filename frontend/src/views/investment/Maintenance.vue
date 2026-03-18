<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>招商维护</span>
          <el-button type="primary" size="small" @click="openAdd">新增招商房源</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="title" label="房源标题" />
        <el-table-column prop="room" label="房间" width="100" />
        <el-table-column prop="decoration" label="装修状态" width="80" />
        <el-table-column prop="price" label="报价(元/㎡/月)" width="120" />
        <el-table-column prop="free_period" label="免租期(天)" width="100" />
        <el-table-column prop="layout" label="户型" width="80" />
        <el-table-column prop="orientation" label="朝向" width="80" />
        <el-table-column prop="tags" label="房源标签" width="150" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }"><el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑招商房源' : '新增招商房源'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="房源标题" required><el-input v-model="form.title" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="房间" required><el-input v-model="form.room" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="装修状态"><el-input v-model="form.decoration" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="报价" required><el-input-number v-model="form.price" :min="0" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="免租期"><el-input-number v-model="form.free_period" :min="0" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="户型"><el-input v-model="form.layout" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="朝向"><el-input v-model="form.orientation" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="房源标签"><el-input v-model="form.tags" placeholder="多个标签用逗号分隔" /></el-form-item>
        <el-form-item label="房源介绍"><el-input v-model="form.intro" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="主图"><el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1"><el-icon><Plus /></el-icon></el-upload></el-form-item>
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
const tableData = ref([{ title: "A栋101精装办公室", room: "A栋101", decoration: "精装", price: 4.5, free_period: 30, layout: "两室", orientation: "南", tags: "精装,采光好" }])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({ title: "", room: "", decoration: "", price: 0, free_period: 0, layout: "", orientation: "", tags: "", intro: "" })

function openAdd() {
  isEdit.value = false
  Object.assign(form, { title: "", room: "", decoration: "", price: 0, free_period: 0, layout: "", orientation: "", tags: "", intro: "" })
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  Object.assign(form, { ...row, intro: row.intro || "" })
  dialogVisible.value = true
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
}.card-header { display: flex; justify-content: space-between; }</style>

