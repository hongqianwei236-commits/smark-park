<template>
  <div class="page-container">
    <el-card>
      <template #header><span>消息中心</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="type" label="消息类型" width="100">
          <template #default="{ row }"><el-tag :type="{system:'info',contract:'primary',finance:'warning'}[row.type]" size="small">{{ {system:'系统',contract:'合同',finance:'财务'}[row.type] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="content" label="消息内容" />
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="is_read" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.is_read ? 'info' : 'success'" size="small">{{ row.is_read ? '已读' : '未读' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default><el-button link type="primary" size="small">查看</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { type: 'contract', content: '合同HT2024001即将到期，请及时处理', time: '2024-03-17 16:00:00', is_read: false },
  { type: 'finance', content: '收到租金30000元，合同：HT2024001', time: '2024-03-17 15:30:00', is_read: true },
  { type: 'system', content: '系统将于今晚22:00进行维护升级', time: '2024-03-17 10:00:00', is_read: true }
])
</script>
<style scoped>.page-container{padding:20px;height:calc(100vh - 50px);box-sizing:border-box;display:flex;flex-direction:column}.page-container :deep(.el-card){flex:1;display:flex;flex-direction:column;overflow:hidden}.page-container :deep(.el-card__body){flex:1;overflow-y:auto}</style>
