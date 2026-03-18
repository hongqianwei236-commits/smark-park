<template>
  <div class="page-container">
    <el-card>
      <template #header><span>停车场设置</span></template>
      <el-form :model="form" label-width="120px" style="max-width:600px">
        <el-form-item label="系统名称"><el-input v-model="form.system_name" /></el-form-item>
        <el-form-item label="接口地址"><el-input v-model="form.api_url" placeholder="停车场系统接口地址" /></el-form-item>
        <el-form-item label="AccessKey"><el-input v-model="form.access_key" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.enabled" /></el-form-item>
        <el-form-item><el-button type="primary">保存</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
const form = reactive({ system_name: '停车场管理系统', api_url: '', access_key: '', enabled: false })
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;overflow-y:auto}</style>
