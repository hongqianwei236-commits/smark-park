$pages = @{
    "space/ParkingSigners.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>车位签订人</span>
          <el-button type="primary" size="small">新增</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="签订人名称" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="id_card" label="证件号" width="180" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
const tableData = $ref([{ name: "张三", phone: "13800138001", id_card: "", remark: "" }])
</script>
<style scoped>.page-container { padding: 20px; }.card-header { display: flex; justify-content: space-between; }</style>
"@

    "investment/StaffList.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>招商人员</span>
          <el-button type="primary" size="small">新增</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="name" label="招商人名称" />
        <el-table-column prop="phone" label="招商人电话" width="130" />
        <el-table-column prop="team" label="所属团队" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
const tableData = $ref([{ name: "李四", phone: "13900139001", team: "招商一组" }])
</script>
<style scoped>.page-container { padding: 20px; }.card-header { display: flex; justify-content: space-between; }</style>
"@

    "investment/CommissionPayment.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>佣金发放</span></template>
      <el-empty description="暂无数据" />
    </el-card>
  </div>
</template>
<style scoped>.page-container { padding: 20px; }</style>
"@

    "investment/ClueSources.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>线索来源</span></template>
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="name" label="来源名称" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
const tableData = ref([])
onMounted(async () => {
  const res = await api.get('/dictionaries')
  if (res.success) tableData.value = res.data.clueSources
})
</script>
<style scoped>.page-container { padding: 20px; }</style>
"@

    "investment/RoomUsage.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>房源用途</span></template>
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="name" label="用途名称" />
        <el-table-column prop="status" label="状态" width="80" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
const tableData = ref([])
onMounted(async () => {
  const res = await api.get('/dictionaries')
  if (res.success) tableData.value = res.data.roomUsages
})
</script>
<style scoped>.page-container { padding: 20px; }</style>
"@

    "investment/PayTypes.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>支付类型</span></template>
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="name" label="类型名称" />
        <el-table-column prop="status" label="状态" width="80" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
const tableData = ref([])
onMounted(async () => {
  const res = await api.get('/dictionaries')
  if (res.success) tableData.value = res.data.paymentTypes
})
</script>
<style scoped>.page-container { padding: 20px; }</style>
"@

    "merchant/CustomerList.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>客户管理</span></template>
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>
<style scoped>.page-container { padding: 20px; }</style>
"@

    "finance/InvoiceTypes.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>发票类型</span></template>
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="name" label="类型名称" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
const tableData = ref([])
onMounted(async () => {
  const res = await api.get('/dictionaries')
  if (res.success) tableData.value = res.data.invoiceTypes || []
})
</script>
<style scoped>.page-container { padding: 20px; }</style>
"@

    "finance/FeeTypes.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>费用类型</span></template>
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="name" label="类型名称" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
const tableData = ref([])
onMounted(async () => {
  const res = await api.get('/dictionaries')
  if (res.success) tableData.value = res.data.feeTypes
})
</script>
<style scoped>.page-container { padding: 20px; }</style>
"@

    "finance/PaymentMethods.vue" = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>收款方式</span></template>
      <el-table :data="tableData" stripe size="small">
        <el-table-column prop="name" label="方式名称" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
const tableData = ref([])
onMounted(async () => {
  const res = await api.get('/dictionaries')
  if (res.success) tableData.value = res.data.paymentMethods
})
</script>
<style scoped>.page-container { padding: 20px; }</style>
"@
}

foreach ($page in $pages.Keys) {
    Set-Content -Path "D:\openclaw_projects\park-saas\frontend\src\views\$page" -Value $pages[$page] -Encoding UTF8
}

Write-Output "批量页面创建完成"
