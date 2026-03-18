$pages = @{}

# 线索跟进中页面（完整字段）
$pages["investment/ClueFollowing.vue"] = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>跟进中线索</span></template>
      <el-table :data="tableData" stripe border size="small">
        <el-table-column prop="company" label="企业名称" />
        <el-table-column prop="name" label="客户姓名" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="follow_date" label="跟进日期" width="110" />
        <el-table-column prop="visit_date" label="回访日期" width="110" />
        <el-table-column prop="follow_type" label="跟进方式" width="100" />
        <el-table-column prop="follow_status" label="跟进状态" width="100" />
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button link type="primary" size="small">跟进</el-button>
            <el-button link type="success" size="small">转意向</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
const tableData = ref([
  { company: "新创科技", name: "张三", phone: "13800138001", follow_date: "2024-03-15", visit_date: "2024-03-20", follow_type: "电话", follow_status: "意向" }
])
</script>
<style scoped>.page-container { padding: 20px; }</style>
"@

# 招商维护页面（完整字段）
$pages["investment/Maintenance.vue"] = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>招商维护</span>
          <el-button type="primary" size="small">新增房源</el-button>
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
          <template #default><el-button link type="primary" size="small">编辑</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" title="新增招商房源" width="600px">
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
const form = reactive({ title: "", room: "", decoration: "", price: 0, free_period: 0, layout: "", orientation: "", tags: "", intro: "" })
</script>
<style scoped>.page-container { padding: 20px; }.card-header { display: flex; justify-content: space-between; }</style>
"@

# 占位页面模板
$placeholderPages = @(
    "investment/ClueIntention", "investment/ClueSigned", "investment/ChannelList",
    "investment/CommissionList",
    "merchant/LandlordList", "merchant/TenantList",
    "finance/ExpenseBills", "finance/CashFlow", "finance/ExpenseSubjects", "finance/CostCenters",
    "finance/ReportCollect", "finance/ReportExpenditure", "finance/ReportSummary", "finance/ReportFinance", "finance/ReportProfit", "finance/ReportBusiness",
    "property/ComplaintList", "property/MeterList", "property/WarehouseList", "property/AssetList",
    "property/Inventory", "property/Purchase", "property/Distribute", "property/InventoryAdjust", "property/ProductItems", "property/Units",
    "property/AssetStorage", "property/AssetBorrow",
    "operation/Approach", "operation/Decoration", "operation/Exit",
    "operation/VenueList", "operation/VenueReservation", "operation/VenueVerification", "operation/VenueRules", "operation/VenueTypes",
    "operation/PassCard", "operation/AccessRecords", "operation/Blacklist", "operation/PassCardSetup",
    "operation/VisitorList", "operation/ActivityList", "operation/CompanyList", "operation/AccessDevices",
    "contract/ExpenseContract", "contract/ContractTypes"
)

foreach ($p in $placeholderPages) {
    $name = $p.Split("/")[-1]
    $pages["$p.vue"] = @"
<template>
  <div class="page-container">
    <el-card>
      <template #header><span>$name</span></template>
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>
<style scoped>.page-container { padding: 20px; }</style>
"@
}

foreach ($page in $pages.Keys) {
    Set-Content -Path "D:\openclaw_projects\park-saas\frontend\src\views\$page" -Value $pages[$page] -Encoding UTF8
}

Write-Output "所有页面创建完成"
