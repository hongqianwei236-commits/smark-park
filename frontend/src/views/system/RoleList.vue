<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header"><span>角色管理</span><el-button type="primary" size="small">新增角色</el-button></div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="is_template" label="是否是模版" width="100">
          <template #default="{ row }"><el-tag :type="row.is_template ? 'success' : 'info'" size="small">{{ row.is_template ? '是' : '否' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="200">
          <template #default><el-button link type="primary" size="small">编辑</el-button><el-button link type="primary" size="small">权限设置</el-button><el-button link type="danger" size="small">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { name: '超级管理员', is_template: true, remark: '拥有所有权限' },
  { name: '运营管理员', is_template: true, remark: '运营相关权限' },
  { name: '财务管理员', is_template: false, remark: '财务相关权限' }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}.card-header{display:flex;justify-content:space-between}</style>
