<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>合同模板</span>
          <el-button type="primary" @click="handleAdd">新增模板</el-button>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col v-for="item in templateList" :key="item.id" :span="8" style="margin-bottom: 20px">
          <el-card shadow="hover" :body-style="{ padding: '20px' }">
            <div class="template-header">
              <el-icon :size="40" color="#409EFF"><Document /></el-icon>
              <div class="template-info">
                <h4>{{ item.name }}</h4>
                <p class="template-desc">{{ item.description }}</p>
              </div>
            </div>
            <div class="template-meta">
              <span>版本: v{{ item.version }}</span>
              <span>更新: {{ item.updated_at }}</span>
            </div>
            <div class="template-actions">
              <el-button type="primary" text @click="handlePreview(item)">
                <el-icon><View /></el-icon> 预览
              </el-button>
              <el-button type="success" text @click="handleDownload(item)">
                <el-icon><Download /></el-icon> 下载
              </el-button>
              <el-button type="danger" text @click="handleDelete(item)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-empty v-if="templateList.length === 0" description="暂无合同模板" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" />
        </el-form-item>
        <el-form-item label="模板内容" prop="content">
          <el-input v-model="form.content" type="textarea" rows="10" placeholder="请输入合同模板内容..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="模板预览" width="800px">
      <div class="preview-content">
        <pre>{{ previewContent }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, View, Download, Delete } from '@element-plus/icons-vue'

const templateList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const previewVisible = ref(false)
const previewContent = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const formRef = ref()

const form = reactive({
  name: '',
  description: '',
  version: '1.0',
  content: ''
})

const formRules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  content: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
}

const defaultTemplates = [
  {
    id: 1,
    name: '标准租赁合同',
    description: '适用于普通办公/商业用房租赁',
    version: '1.0',
    updated_at: '2024-01-15',
    content: `房屋租赁合同

甲方（出租方）：___________
乙方（承租方）：___________

第一条 租赁房屋基本情况
房屋坐落于___________，建筑面积___________平方米。

第二条 租赁期限
租赁期自____年__月__日起至____年__月__日止。

第三条 租金及支付方式
月租金为人民币___________元，按月/季/年支付。

第四条 双方权利义务
...

甲方（签章）：___________    乙方（签章）：___________
日期：____年__月__日          日期：____年__月__日`
  },
  {
    id: 2,
    name: '短租合同模板',
    description: '适用于短期租赁（3个月以内）',
    version: '1.0',
    updated_at: '2024-02-10',
    content: `短期房屋租赁合同

出租方：___________
承租方：___________

租赁期限：自____年__月__日起至____年__月__日止，共计__个月。

租金总额：人民币___________元。

押金：人民币___________元。

...

签约日期：____年__月__日`
  },
  {
    id: 3,
    name: '商铺租赁合同',
    description: '适用于商铺、门面房租赁',
    version: '2.0',
    updated_at: '2024-03-01',
    content: `商铺租赁合同

出租方（甲方）：___________
承租方（乙方）：___________

第一条 商铺位置及面积
商铺位于___________，建筑面积___________平方米。

第二条 经营范围
乙方承诺经营___________业务。

第三条 租赁期限
自____年__月__日起至____年__月__日止。

第四条 租金标准
月租金___________元，每__年递增__%。

...

甲方：___________    乙方：___________
日期：____年__月__日`
  }
]

const fetchData = () => {
  const saved = localStorage.getItem('contractTemplates')
  if (saved) {
    templateList.value = JSON.parse(saved)
  } else {
    templateList.value = [...defaultTemplates]
    localStorage.setItem('contractTemplates', JSON.stringify(templateList.value))
  }
}

const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '新增模板'
  Object.assign(form, { name: '', description: '', version: '1.0', content: '' })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    if (isEdit.value) {
      const index = templateList.value.findIndex(item => item.id === currentId.value)
      if (index > -1) {
        templateList.value[index] = { ...templateList.value[index], ...form, updated_at: new Date().toISOString().split('T')[0] }
      }
    } else {
      const newId = Math.max(...templateList.value.map(item => item.id), 0) + 1
      templateList.value.push({
        id: newId,
        ...form,
        updated_at: new Date().toISOString().split('T')[0]
      })
    }
    
    localStorage.setItem('contractTemplates', JSON.stringify(templateList.value))
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handlePreview = (item) => {
  previewContent.value = item.content
  previewVisible.value = true
}

const handleDownload = (item) => {
  const blob = new Blob([item.content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${item.name}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('下载成功')
}

const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm('确定要删除该模板吗？', '提示', { type: 'warning' })
    templateList.value = templateList.value.filter(i => i.id !== item.id)
    localStorage.setItem('contractTemplates', JSON.stringify(templateList.value))
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(fetchData)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.template-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.template-info h4 { margin: 0 0 5px 0; }
.template-desc { color: #909399; font-size: 12px; margin: 0; }
.template-meta { display: flex; justify-content: space-between; color: #909399; font-size: 12px; margin-bottom: 15px; }
.template-actions { display: flex; justify-content: space-around; border-top: 1px solid #ebeef5; padding-top: 15px; }
.preview-content { background: #f5f7fa; padding: 20px; border-radius: 4px; }
.preview-content pre { white-space: pre-wrap; word-wrap: break-word; margin: 0; }
</style>