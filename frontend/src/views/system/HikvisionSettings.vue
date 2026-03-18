<template>
  <div class="page-container">
    <el-card>
      <template #header><span>海康设置</span></template>
      <el-form :model="form" label-width="120px" style="max-width:600px">
        <el-form-item label="平台地址"><el-input v-model="form.platform_url" placeholder="海康平台地址" /></el-form-item>
        <el-form-item label="AppKey"><el-input v-model="form.app_key" /></el-form-item>
        <el-form-item label="AppSecret"><el-input v-model="form.app_secret" type="password" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.enabled" /></el-form-item>
        <el-form-item><el-button type="primary">保存</el-button><el-button @click="testConnection">测试连接</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
const form = reactive({ platform_url: '', app_key: '', app_secret: '', enabled: false })
const testConnection = () => ElMessage.info('测试连接...')
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;overflow-y:auto}</style>
