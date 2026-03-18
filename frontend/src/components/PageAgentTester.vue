<template>
  <div class="page-agent-tester">
    <transition name="fade-slide">
      <div v-if="visible" class="tester-panel">
        <div class="tester-header">
          <div>
            <div class="tester-title">Page Agent 测试助手</div>
            <div class="tester-subtitle">
              直接输入指令，验证页面自动操作效果
            </div>
          </div>
          <el-button text @click="visible = false">收起</el-button>
        </div>

        <div class="tester-env-summary">
          <el-tag :type="hasApiKey ? 'success' : 'warning'" size="small">
            {{ hasApiKey ? "已检测到 API Key" : "未检测到 API Key" }}
          </el-tag>
          <span class="env-hint"
            >读取来源：`import.meta.env.VITE_PAGE_AGENT_API_KEY`</span
          >
        </div>

        <el-alert
          v-if="!hasApiKey"
          title="未配置 VITE_PAGE_AGENT_API_KEY，当前只能看到界面，无法执行指令。"
          type="warning"
          :closable="false"
          class="tester-alert"
        />

        <div class="tester-config">
          <div class="config-row">
            <span class="config-label">Model</span>
            <span class="config-value">{{ currentModel }}</span>
          </div>
          <div class="config-row">
            <span class="config-label">Base URL</span>
            <span class="config-value">{{ currentBaseURL }}</span>
          </div>
          <div class="config-row">
            <span class="config-label">Language</span>
            <span class="config-value">{{ currentLanguage }}</span>
          </div>
        </div>

        <el-input
          v-model="instruction"
          type="textarea"
          :rows="4"
          resize="none"
          placeholder="例如：打开租户列表并搜索华为"
          class="tester-input"
          @keydown.ctrl.enter.prevent="handleExecute"
        />

        <div class="tester-actions">
          <el-button type="primary" :loading="executing" @click="handleExecute">
            执行指令
          </el-button>
          <el-button @click="instruction = ''">清空</el-button>
        </div>

        <div class="tester-quick-actions">
          <span class="quick-label">快捷测试：</span>
          <el-button
            v-for="item in quickActions"
            :key="item"
            size="small"
            @click="applyQuickAction(item)"
          >
            {{ item }}
          </el-button>
        </div>

        <div class="tester-status" :class="status.type">
          <div class="status-label">状态</div>
          <div class="status-text">{{ status.message }}</div>
        </div>
      </div>
    </transition>

    <el-button
      class="tester-fab"
      type="primary"
      circle
      @click="visible = !visible"
    >
      助
    </el-button>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { executeInstruction } from "../utils/pageAgent";

const visible = ref(true);
const executing = ref(false);
const instruction = ref("");
const hasApiKey = Boolean(import.meta.env.VITE_PAGE_AGENT_API_KEY);
const currentModel = import.meta.env.VITE_PAGE_AGENT_MODEL || "kimi-k2.5";
const currentBaseURL =
  import.meta.env.VITE_PAGE_AGENT_BASE_URL || "https://api.moonshot.cn/v1";
const currentLanguage = import.meta.env.VITE_PAGE_AGENT_LANGUAGE || "zh-CN";

const quickActions = [
  "点击左侧菜单“租户管理”，再点击“租户列表”",
  "点击左侧菜单“租户管理”，进入“租户列表”后搜索华为",
  "点击左侧菜单“项目管理”，再点击“项目列表”",
  "点击左侧菜单“资产管理”，展开“楼栋管理”，再点击“楼栋列表”",
  "点击左侧菜单“合同管理”，再点击“合同审批”",
];

const status = reactive({
  type: "idle",
  message: hasApiKey
    ? "请输入指令后点击执行，或使用下方快捷测试指令。"
    : "请先在 .env 文件中配置 VITE_PAGE_AGENT_API_KEY。",
});

function applyQuickAction(text) {
  instruction.value = text;
}

async function handleExecute() {
  if (!instruction.value.trim()) {
    status.type = "error";
    status.message = "请输入要执行的指令";
    return;
  }

  executing.value = true;
  status.type = "running";
  status.message = `正在执行：${instruction.value}`;

  try {
    const result = await executeInstruction(instruction.value);
    status.type = "success";
    status.message = result.message;
    ElMessage.success(result.message);
  } catch (error) {
    status.type = "error";
    status.message = error?.message || String(error) || "执行失败";
    ElMessage.error(status.message);
  } finally {
    executing.value = false;
  }
}
</script>

<style scoped>
.page-agent-tester {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 3000;
}

.tester-panel {
  width: 380px;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.tester-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tester-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.tester-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.tester-alert,
.tester-config,
.tester-input,
.tester-actions,
.tester-quick-actions {
  margin-top: 12px;
}

.tester-env-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
}

.env-hint {
  font-size: 12px;
  color: #6b7280;
  word-break: break-all;
}

.tester-config {
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.config-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 1.6;
}

.config-label {
  min-width: 68px;
  color: #6b7280;
}

.config-value {
  flex: 1;
  color: #111827;
  word-break: break-all;
}

.tester-actions {
  display: flex;
  gap: 12px;
}

.tester-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-label {
  width: 100%;
  font-size: 12px;
  color: #6b7280;
}

.tester-status {
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.tester-status.running {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.tester-status.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.tester-status.error {
  background: #fef2f2;
  border-color: #fecaca;
}

.status-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.status-text {
  font-size: 13px;
  color: #111827;
  word-break: break-word;
}

.tester-fab {
  width: 52px;
  height: 52px;
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.35);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
