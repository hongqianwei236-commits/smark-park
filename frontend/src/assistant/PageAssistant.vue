<template>
  <div class="page-assistant">
    <transition name="assistant-slide">
      <section v-if="state.visible" class="assistant-panel">
        <header class="assistant-header">
          <div class="assistant-header-main">
            <div class="assistant-brand">
              <div class="assistant-brand-mark">✦</div>
              <div class="assistant-brand-copy">
                <div class="assistant-title-row">
                  <h2 class="assistant-title">园区智办</h2>
                  <span class="assistant-tag" :class="state.status">{{
                    headerTag
                  }}</span>
                </div>
                <p class="assistant-subtitle">你的园区事务协作助手</p>
              </div>
            </div>

            <div class="assistant-header-actions">
              <button
                v-if="canStop"
                class="ghost-btn danger"
                @click="handleStop"
              >
                停止
              </button>
              <button class="ghost-btn" @click="toggleVisible(false)">
                收起
              </button>
            </div>
          </div>

          <div class="assistant-toolbar">
            <label class="assistant-field">
              <span>当前模型</span>
              <select
                class="assistant-select"
                :value="state.selectedModel"
                @change="handleModelChange"
              >
                <option
                  v-for="model in state.availableModels"
                  :key="model"
                  :value="model"
                >
                  {{ model }}
                </option>
              </select>
            </label>

            <div class="assistant-field assistant-field-static">
              <span>工作语言</span>
              <strong>{{ config.language }}</strong>
            </div>
          </div>
        </header>

        <div class="assistant-status-bar" :class="state.status">
          <div class="status-dot" :class="state.status"></div>
          <div class="status-copy">
            <div class="status-main">{{ state.activityText }}</div>
            <div class="status-sub">持续感知页面并逐步推进任务</div>
          </div>
        </div>

        <div v-if="!config.apiKey" class="assistant-warning">
          未配置 `VITE_PAGE_AGENT_API_KEY`，当前无法执行任务。
        </div>

        <div
          ref="timelineRef"
          class="assistant-timeline"
          @scroll="handleTimelineScroll"
        >
          <div v-if="!state.timeline.length" class="assistant-empty">
            <div class="assistant-empty-icon">✦</div>
            <div class="assistant-empty-title">开始一段新的协作</div>
            <div class="assistant-empty-desc">
              输入任务后，这里会像聊天一样逐步输出思考过程、追问和结果。
            </div>
          </div>

          <article
            v-for="item in displayTimeline"
            :key="item.id"
            class="message-row"
            :class="item.role || 'assistant'"
          >
            <div v-if="item.role !== 'user'" class="message-avatar assistant">
              ✦
            </div>
            <div
              class="message-bubble"
              :class="[item.kind, item.role || 'assistant']"
            >
              <div class="message-meta">
                <strong>{{ getMessageTitle(item) }}</strong>
                <span>{{ item.time }}</span>
              </div>
              <pre class="message-text">{{ item.text }}</pre>
            </div>
            <div v-if="item.role === 'user'" class="message-avatar user">
              你
            </div>
          </article>
        </div>

        <div class="assistant-quick-actions">
          <button
            v-for="action in quickActions"
            :key="action"
            class="quick-action"
            @click="setInput(action)"
          >
            {{ action }}
          </button>
        </div>

        <footer class="assistant-composer">
          <div v-if="state.waitingForAnswer" class="assistant-question-box">
            <div class="question-label">等待用户补充</div>
            <div class="question-text">{{ state.pendingQuestion }}</div>
          </div>

          <textarea
            :value="state.input"
            class="assistant-input"
            :placeholder="
              state.waitingForAnswer
                ? '请输入补充信息…'
                : '例如：打开租户列表并搜索华为'
            "
            rows="4"
            @input="setInput($event.target.value)"
            @keydown.ctrl.enter.prevent="handleSubmit"
          />

          <div class="assistant-composer-actions">
            <button class="ghost-btn" @click="resetSession">清空</button>
            <button
              class="primary-btn"
              :disabled="!canSubmit || !config.apiKey"
              @click="handleSubmit"
            >
              {{ state.waitingForAnswer ? "提交回答" : "发送任务" }}
            </button>
          </div>
        </footer>
      </section>
    </transition>

    <button class="assistant-fab" @click="toggleVisible()">
      {{ state.visible ? "收" : "✦" }}
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { usePageAssistant } from "./usePageAssistant";

const timelineRef = ref(null);
const autoFollowTimeline = ref(true);

const {
  state,
  config,
  headerTag,
  canSubmit,
  canStop,
  execute,
  stop,
  switchModel,
  resetSession,
  setInput,
  toggleVisible,
} = usePageAssistant();

const quickActions = [
  "点击左侧菜单“租户管理”，再点击“租户列表”",
  "打开项目列表",
  "进入合同审批页面",
  "查看当前页面上最重要的操作入口",
  "总结一下当前页面可以执行的关键操作",
];

const displayTimeline = computed(() =>
  state.timeline.map((item) => ({
    role:
      item.role ||
      (item.kind === "task" || item.kind === "answer" ? "user" : "assistant"),
    ...item,
  })),
);

function getMessageTitle(item) {
  if (item.role === "user") {
    return item.kind === "answer" ? "你的补充" : "你";
  }

  if (item.kind === "reflection") return "思考步骤";
  if (item.kind === "activity") return "当前进度";
  return item.title;
}

function scrollTimelineToBottom() {
  nextTick(() => {
    if (!timelineRef.value || !autoFollowTimeline.value) return;
    timelineRef.value.scrollTop = timelineRef.value.scrollHeight;
  });
}

function handleTimelineScroll() {
  if (!timelineRef.value) return;
  const { scrollTop, clientHeight, scrollHeight } = timelineRef.value;
  const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
  autoFollowTimeline.value = distanceToBottom <= 24;
}

watch(
  () => state.timelineVersion,
  () => {
    if (state.visible) {
      scrollTimelineToBottom();
    }
  },
);

watch(
  () => state.visible,
  (visible) => {
    if (visible) {
      autoFollowTimeline.value = true;
      scrollTimelineToBottom();
    }
  },
);

async function handleSubmit() {
  try {
    const result = await execute();
    if (!state.waitingForAnswer && result?.data) {
      ElMessage.success(
        typeof result.data === "string" ? result.data : "任务执行完成",
      );
    }
  } catch (error) {
    ElMessage.error(error?.message || String(error) || "执行失败");
  }
}

function handleStop() {
  stop();
  ElMessage.warning("已停止当前任务");
}

function handleModelChange(event) {
  const model = event.target.value;
  switchModel(model);
  ElMessage.success(`已切换到模型：${model}`);
}
</script>

<style scoped>
.page-assistant {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2147483647;
}

.assistant-panel {
  width: 460px;
  max-height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  margin-bottom: 14px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(12px);
}

.assistant-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.assistant-header-main {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.assistant-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assistant-brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
  color: #fff;
  font-size: 20px;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.28);
}

.assistant-brand-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.assistant-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.assistant-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.assistant-subtitle {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.assistant-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assistant-toolbar {
  display: flex;
  gap: 12px;
}

.assistant-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.assistant-field span {
  font-size: 12px;
  color: #64748b;
}

.assistant-field strong {
  color: #0f172a;
  font-size: 14px;
}

.assistant-select {
  border: none;
  background: transparent;
  outline: none;
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.assistant-tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  background: #f3f4f6;
  color: #4b5563;
}

.assistant-tag.running {
  background: #dbeafe;
  color: #1d4ed8;
}

.assistant-tag.completed {
  background: #dcfce7;
  color: #166534;
}

.assistant-tag.error {
  background: #fee2e2;
  color: #b91c1c;
}

.assistant-status-bar {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, #f8fbff, #f8fafc);
  border: 1px solid #e5e7eb;
}

.assistant-status-bar.running {
  background: linear-gradient(180deg, #eff6ff, #f8fafc);
  border-color: #bfdbfe;
}

.assistant-status-bar.error {
  background: linear-gradient(180deg, #fef2f2, #fff);
  border-color: #fecaca;
}

.assistant-status-bar.completed {
  background: linear-gradient(180deg, #f0fdf4, #fff);
  border-color: #bbf7d0;
}

.status-dot {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
  background: #9ca3af;
}

.status-dot.running {
  background: #2563eb;
}
.status-dot.completed {
  background: #16a34a;
}
.status-dot.error {
  background: #dc2626;
}

.status-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-main {
  font-size: 14px;
  color: #111827;
}

.status-sub {
  font-size: 12px;
  color: #64748b;
}

.assistant-warning {
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  font-size: 12px;
}

.assistant-timeline {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  max-height: 380px;
  padding-right: 4px;
}

.assistant-empty {
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  font-size: 13px;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  border-radius: 18px;
  padding: 20px;
  background: linear-gradient(180deg, #fbfdff, #fff);
}

.assistant-empty-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
  color: #fff;
  font-size: 18px;
}

.assistant-empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.assistant-empty-desc {
  max-width: 280px;
  line-height: 1.6;
}

.message-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.message-row.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.message-avatar.assistant {
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
  color: #fff;
}

.message-avatar.user {
  background: #dbeafe;
  color: #1d4ed8;
}

.message-bubble {
  max-width: 86%;
  padding: 12px 14px;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.message-bubble.assistant {
  border-top-left-radius: 8px;
}

.message-bubble.user {
  border-top-right-radius: 8px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border-color: transparent;
}

.message-bubble.user .message-meta,
.message-bubble.user .message-text {
  color: #fff;
}

.message-bubble.reflection {
  background: linear-gradient(180deg, #faf5ff, #fff);
  border-color: #ddd6fe;
}

.message-bubble.activity {
  background: linear-gradient(180deg, #eff6ff, #fff);
  border-color: #bfdbfe;
}

.message-bubble.question {
  background: linear-gradient(180deg, #fff7ed, #fff);
  border-color: #fdba74;
}

.message-bubble.answer {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  border-color: transparent;
}

.message-bubble.result {
  background: linear-gradient(180deg, #f0fdf4, #fff);
  border-color: #bbf7d0;
}

.message-bubble.error {
  background: linear-gradient(180deg, #fef2f2, #fff);
  border-color: #fecaca;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #64748b;
}

.message-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.65;
  color: #111827;
  font-family: inherit;
}

.assistant-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-action,
.ghost-btn,
.primary-btn,
.assistant-fab {
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action,
.ghost-btn {
  padding: 8px 10px;
  border-radius: 10px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
}

.ghost-btn:hover,
.quick-action:hover {
  background: #e5e7eb;
}

.ghost-btn.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.assistant-composer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.assistant-question-box {
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff7ed;
  border: 1px solid #fdba74;
}

.question-label {
  margin-bottom: 4px;
  font-size: 12px;
  color: #9a3412;
}

.question-text {
  font-size: 13px;
  color: #7c2d12;
}

.assistant-input {
  width: 100%;
  resize: none;
  border: 1px solid #d1d5db;
  border-radius: 18px;
  padding: 14px;
  font-size: 14px;
  outline: none;
}

.assistant-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.assistant-composer-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.primary-btn {
  padding: 12px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.assistant-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
  color: #fff;
  font-size: 22px;
  box-shadow: 0 14px 30px rgba(79, 70, 229, 0.35);
}

.assistant-slide-enter-active,
.assistant-slide-leave-active {
  transition: all 0.2s ease;
}

.assistant-slide-enter-from,
.assistant-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

<style>
#playwright-highlight-container,
.playwright-highlight-label {
  opacity: 0 !important;
}

.playwright-highlight-label {
  display: none !important;
  visibility: hidden !important;
}

#playwright-highlight-container > div {
  background-color: transparent !important;
}
</style>
