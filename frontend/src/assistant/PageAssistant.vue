<template>
  <div class="page-assistant">
    <transition name="assistant-slide">
      <section v-show="state.visible" class="assistant-panel">
        <header class="assistant-header">
          <div class="assistant-header-main">
            <div class="assistant-brand">
              <div class="assistant-brand-mark" aria-hidden="true">
                <span class="robot-glyph robot-glyph--brand">
                  <span class="robot-glyph-core">
                    <span class="robot-eye left"></span>
                    <span class="robot-eye right"></span>
                    <span class="robot-mouth"></span>
                  </span>
                  <span class="robot-antenna"></span>
                  <span class="robot-ear left"></span>
                  <span class="robot-ear right"></span>
                </span>
              </div>
              <div class="assistant-brand-copy">
                <div class="assistant-title-row">
                  <h2 class="assistant-title">智能小助手</h2>
                  <span class="assistant-tag" :class="state.status">{{
                    headerTag
                  }}</span>
                </div>
                <p class="assistant-subtitle">你的工作自动化协作助手</p>
              </div>
            </div>

            <button
              class="ghost-btn ghost-btn--header"
              @click="toggleVisible(false)"
            >
              收起
            </button>
          </div>
        </header>

        <div v-if="state.status === 'running'" class="assistant-status-bar">
          <div class="status-loading" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="status-copy">
            <div class="status-main">{{ state.activityText }}</div>
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
            <div class="assistant-empty-icon" aria-hidden="true">
              <span class="robot-glyph robot-glyph--empty">
                <span class="robot-glyph-core">
                  <span class="robot-eye left"></span>
                  <span class="robot-eye right"></span>
                  <span class="robot-mouth"></span>
                </span>
                <span class="robot-antenna"></span>
                <span class="robot-ear left"></span>
                <span class="robot-ear right"></span>
              </span>
            </div>
            <div class="assistant-empty-title">准备开始协作</div>
            <div class="assistant-empty-desc">
              输入任务后，我会逐步执行操作并同步反馈过程。
            </div>
          </div>

          <article
            v-for="item in displayTimeline"
            :key="item.id"
            class="message-row"
            :class="getMessageRowClass(item)"
          >
            <div v-if="showTimelineNode(item)" class="timeline-node">
              <span class="timeline-node-dot" :class="item.kind"></span>
            </div>

            <div class="message-stack" :class="item.role || 'assistant'">
              <div
                v-if="item.role === 'user'"
                class="message-outside-meta user-outside-meta"
              >
                <strong>{{ getMessageTitle(item) }}</strong>
                <span v-if="showMessageTime(item)">{{ item.time }}</span>
              </div>

              <div
                class="message-bubble"
                :class="[item.kind, item.role || 'assistant']"
              >
                <template v-if="item.kind === 'reflection'">
                  <div class="step-block">
                    <button
                      class="step-card"
                      type="button"
                      @click="toggleStep(item.id)"
                    >
                      <div class="step-card-main">
                        <div class="message-meta step-meta">
                          <strong>{{ item.title }}</strong>
                          <span class="step-meta-right">
                            <span
                              v-if="item.toolTags?.length"
                              class="tool-tag-list"
                            >
                              <span
                                v-for="tag in item.toolTags.slice(0, 2)"
                                :key="tag"
                                class="tool-tag"
                                >{{ tag }}</span
                              >
                            </span>
                            <span class="step-time">{{ item.time }}</span>
                          </span>
                        </div>
                      </div>
                      <span class="step-toggle">{{
                        isStepExpanded(item.id) ? "⌃" : "⌄"
                      }}</span>
                    </button>

                    <div v-if="isStepExpanded(item.id)" class="step-detail">
                      <pre class="message-text">{{ item.text }}</pre>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div
                    v-if="item.role !== 'user'"
                    class="message-meta"
                    :class="{
                      'summary-meta': item.kind === 'result',
                      'question-meta': item.kind === 'question',
                    }"
                  >
                    <strong>{{ getMessageTitle(item) }}</strong>
                    <span v-if="showMessageTime(item)">{{ item.time }}</span>
                  </div>
                  <pre
                    class="message-text"
                    :class="{
                      'summary-text': item.kind === 'result',
                      'intro-text': item.kind === 'intro',
                      'question-text': item.kind === 'question',
                    }"
                    >{{ item.text }}</pre
                  >
                </template>
              </div>
            </div>
          </article>
        </div>

        <footer
          class="assistant-composer"
          :class="{ 'is-answer-mode': state.waitingForAnswer }"
        >
          <div v-if="state.waitingForAnswer" class="assistant-question-box">
            <div class="question-badge">等待确认</div>
            <div class="question-title">请补充这一步需要的信息</div>
            <div class="question-text">{{ state.pendingQuestion }}</div>
          </div>

          <div
            class="composer-shell"
            :class="{ 'answer-shell': state.waitingForAnswer }"
          >
            <textarea
              :value="state.input"
              class="assistant-input"
              :class="{ 'answer-input': state.waitingForAnswer }"
              :placeholder="
                state.waitingForAnswer
                  ? '请输入补充信息，按 Enter 提交回答'
                  : '请输入你的任务，按 Enter 发送'
              "
              rows="2"
              @input="setInput($event.target.value)"
              @keydown="handleComposerKeydown"
            />

            <div class="assistant-composer-actions">
              <div class="composer-inline-tools">
                <div ref="modelMenuRef" class="composer-model-wrap">
                  <button
                    type="button"
                    class="model-trigger"
                    @click="toggleModelMenu"
                  >
                    <span class="model-trigger-label">模型</span>
                    <span class="model-trigger-value">{{
                      state.selectedModel
                    }}</span>
                    <span class="model-trigger-arrow">⌄</span>
                  </button>

                  <transition name="model-menu-fade">
                    <div v-if="isModelMenuOpen" class="model-menu">
                      <button
                        v-for="model in state.availableModels"
                        :key="model"
                        type="button"
                        class="model-menu-item"
                        :class="{ active: model === state.selectedModel }"
                        @click="selectModel(model)"
                      >
                        <span>{{ model }}</span>
                        <span
                          v-if="model === state.selectedModel"
                          class="model-menu-check"
                          >✓</span
                        >
                      </button>
                    </div>
                  </transition>
                </div>
                <button class="ghost-btn" @click="resetSession">清空</button>
              </div>

              <button
                class="primary-btn composer-submit"
                :class="{
                  'answer-submit': state.waitingForAnswer,
                  'stop-submit': canStop,
                }"
                :disabled="(!canSubmit && !canStop) || !config.apiKey"
                @click="canStop ? handleStop() : handleSubmit()"
              >
                {{
                  canStop
                    ? "停止"
                    : state.waitingForAnswer
                      ? "提交回答"
                      : "发送"
                }}
              </button>
            </div>
          </div>
        </footer>
      </section>
    </transition>

    <button class="assistant-fab" @click="toggleVisible()">
      <template v-if="state.visible">收</template>
      <span v-else class="robot-glyph robot-glyph--fab" aria-hidden="true">
        <span class="robot-glyph-core">
          <span class="robot-eye left"></span>
          <span class="robot-eye right"></span>
          <span class="robot-mouth"></span>
        </span>
        <span class="robot-antenna"></span>
        <span class="robot-ear left"></span>
        <span class="robot-ear right"></span>
      </span>
    </button>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { usePageAssistant } from "./usePageAssistant";
import { createElementPlusNotifier } from "./notifications";

const props = defineProps({
  assistantConfig: {
    type: Object,
    default: () => ({}),
  },
  notifier: {
    type: Object,
    default: () => createElementPlusNotifier(),
  },
});

const timelineRef = ref(null);
const autoFollowTimeline = ref(true);
const expandedStepIds = ref([]);
const isModelMenuOpen = ref(false);
const modelMenuRef = ref(null);

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
  updateConfig,
  notify,
} = usePageAssistant({
  config: props.assistantConfig,
  notify: props.notifier,
});

const displayTimeline = computed(() =>
  state.timeline.map((item) => ({
    role:
      item.role ||
      (item.kind === "task" || item.kind === "answer" ? "user" : "assistant"),
    ...item,
  })),
);

function getMessageTitle(item) {
  if (item.role === "user") return item.kind === "answer" ? "你的补充" : "你";
  if (item.kind === "reflection") return "思考步骤";
  if (item.kind === "activity") return "当前进度";
  if (item.kind === "intro") return "助手";
  if (item.kind === "result") return "任务总结";
  if (item.kind === "question") return "需要确认";
  return item.title;
}

function getMessageRowClass(item) {
  if (item.role === "user") return "user";
  if (["reflection", "observation", "activity", "retry"].includes(item.kind))
    return "timeline";
  return "assistant";
}

function showTimelineNode(item) {
  return ["reflection", "observation", "activity", "retry"].includes(item.kind);
}

function showMessageTime(item) {
  return item.kind !== "intro";
}

function isStepExpanded(id) {
  return !expandedStepIds.value.includes(id);
}

function toggleStep(id) {
  if (isStepExpanded(id)) {
    expandedStepIds.value = [...expandedStepIds.value, id];
    return;
  }
  expandedStepIds.value = expandedStepIds.value.filter((item) => item !== id);
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
    if (
      !state.waitingForAnswer &&
      !result?.pendingConfirmation &&
      result?.data
    ) {
      notify.success(
        typeof result.data === "string" ? result.data : "任务执行完成",
      );
    }
  } catch (error) {
    notify.error(error?.message || String(error) || "执行失败");
  }
}

function handleComposerKeydown(event) {
  if (event.key !== "Enter") return;
  if (event.shiftKey) return;
  event.preventDefault();
  handleSubmit();
}

function handleStop() {
  stop();
  notify.warning("已停止当前任务");
}

function toggleModelMenu() {
  isModelMenuOpen.value = !isModelMenuOpen.value;
}

function selectModel(model) {
  switchModel(model);
  isModelMenuOpen.value = false;
  notify.success(`已切换到模型：${model}`);
}

watch(
  () => props.assistantConfig,
  (value) => {
    updateConfig(value || {});
  },
  { deep: true },
);

function handleClickOutside(event) {
  if (!modelMenuRef.value) return;
  if (!modelMenuRef.value.contains(event.target)) {
    isModelMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.page-assistant {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2147483647;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  --assistant-primary: #409eff;
  --assistant-primary-hover: #66b1ff;
  --assistant-primary-weak: rgba(64, 158, 255, 0.12);
  --assistant-text-main: #1f2d3d;
  --assistant-text-body: #3c4a5d;
  --assistant-text-muted: #7f8ea3;
  --assistant-text-soft: #a8b3c2;
}
.assistant-panel {
  width: 500px;
  max-height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  margin-bottom: 14px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.34);
  box-shadow: 0 22px 60px rgba(31, 45, 61, 0.12);
  backdrop-filter: blur(20px);
}
.assistant-header-main,
.assistant-brand,
.assistant-title-row,
.assistant-composer-actions,
.composer-inline-tools {
  display: flex;
  align-items: center;
}
.assistant-header-main {
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.assistant-brand {
  gap: 14px;
}
.assistant-title-row {
  gap: 12px;
}
.assistant-brand-copy,
.assistant-header,
.assistant-composer,
.composer-shell,
.assistant-timeline {
  display: flex;
  flex-direction: column;
}
.assistant-brand-copy,
.assistant-header {
  gap: 10px;
}
.assistant-brand-mark,
.assistant-empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(145deg, #57a8ff, #7bc2ff);
}
.assistant-brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    0 12px 28px rgba(64, 158, 255, 0.22);
}
.assistant-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--assistant-text-main);
}
.assistant-subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--assistant-text-muted);
}
.assistant-tag {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  background: rgba(31, 45, 61, 0.06);
  color: var(--assistant-text-muted);
}
.assistant-tag.running {
  background: var(--assistant-primary-weak);
  color: var(--assistant-primary);
}
.assistant-tag.completed {
  background: rgba(103, 194, 58, 0.12);
  color: #4f8b20;
}
.assistant-tag.error {
  background: rgba(245, 108, 108, 0.12);
  color: #c45656;
}
.assistant-status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(64, 158, 255, 0.08);
  border: 1px solid rgba(64, 158, 255, 0.18);
}
.status-loading {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.status-loading span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--assistant-primary);
  opacity: 0.3;
  animation: assistantDots 1.2s infinite ease-in-out;
}
.status-loading span:nth-child(2) {
  animation-delay: 0.18s;
}
.status-loading span:nth-child(3) {
  animation-delay: 0.36s;
}
.status-main {
  font-size: 13px;
  font-weight: 500;
  color: var(--assistant-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.assistant-warning {
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(245, 108, 108, 0.08);
  border: 1px solid rgba(245, 108, 108, 0.18);
  color: #c45656;
  font-size: 12px;
}
.assistant-timeline {
  gap: 16px;
  min-height: 220px;
  max-height: 430px;
  overflow: auto;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 158, 255, 0.14) transparent;
}
.assistant-timeline::-webkit-scrollbar {
  width: 4px;
}
.assistant-timeline::-webkit-scrollbar-track {
  background: transparent;
}
.assistant-timeline::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 999px;
}
.assistant-timeline:hover::-webkit-scrollbar-thumb {
  background: rgba(64, 158, 255, 0.16);
}
.assistant-timeline::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 158, 255, 0.22);
}
.assistant-empty {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  font-size: 13px;
  color: var(--assistant-text-muted);
}
.assistant-empty-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 10px 22px rgba(64, 158, 255, 0.18);
}
.robot-glyph {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: #fff;
}
.robot-glyph--brand {
  transform: translateY(1px);
}
.robot-glyph--empty {
  width: 20px;
  height: 20px;
}
.robot-glyph--fab {
  width: 24px;
  height: 24px;
}
.robot-glyph-core {
  position: relative;
  width: 16px;
  height: 13px;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), #d9ecff);
  box-shadow:
    inset 0 -1px 0 rgba(64, 158, 255, 0.18),
    0 2px 6px rgba(30, 64, 175, 0.12);
}
.robot-glyph--empty .robot-glyph-core {
  width: 12px;
  height: 10px;
  border-radius: 5px;
}
.robot-glyph--fab .robot-glyph-core {
  width: 15px;
  height: 12px;
}
.robot-eye,
.robot-mouth,
.robot-antenna,
.robot-ear {
  position: absolute;
}
.robot-eye {
  top: 4px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.08);
}
.robot-eye.left {
  left: 4px;
}
.robot-eye.right {
  right: 4px;
}
.robot-glyph--empty .robot-eye {
  top: 3px;
  width: 2px;
  height: 2px;
}
.robot-glyph--empty .robot-eye.left {
  left: 3px;
}
.robot-glyph--empty .robot-eye.right {
  right: 3px;
}
.robot-mouth {
  left: 50%;
  bottom: 3px;
  width: 7px;
  height: 2px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.8);
  transform: translateX(-50%);
}
.robot-glyph--empty .robot-mouth {
  bottom: 2px;
  width: 5px;
}
.robot-antenna {
  top: 1px;
  left: 50%;
  width: 2px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(-50%);
}
.robot-antenna::before {
  content: "";
  position: absolute;
  top: -3px;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ffd76a;
  box-shadow: 0 0 8px rgba(255, 215, 106, 0.38);
  transform: translateX(-50%);
}
.robot-ear {
  top: 9px;
  width: 4px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}
.robot-ear.left {
  left: 2px;
}
.robot-ear.right {
  right: 2px;
}
.robot-glyph--empty .robot-ear {
  top: 7px;
  width: 3px;
  height: 5px;
}
.assistant-empty-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--assistant-text-main);
}
.assistant-empty-desc {
  max-width: 300px;
  line-height: 1.7;
}
.message-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.message-row.user {
  justify-content: flex-end;
}
.message-row.timeline {
  gap: 14px;
}
.message-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.message-row.timeline .message-stack {
  flex: 1;
}
.message-stack.user {
  align-items: flex-end;
}
.message-outside-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--assistant-text-soft);
  padding: 0 4px;
}
.message-outside-meta strong {
  font-size: 12px;
  font-weight: 600;
  color: var(--assistant-text-muted);
}
.timeline-node {
  position: relative;
  width: 18px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}
.timeline-node::after {
  content: "";
  position: absolute;
  top: 20px;
  bottom: -16px;
  width: 1px;
  background: rgba(64, 158, 255, 0.16);
}
.message-row:last-child .timeline-node::after {
  display: none;
}
.timeline-node-dot {
  position: relative;
  z-index: 1;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.22);
  border: 2px solid rgba(255, 255, 255, 0.88);
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.08);
}
.timeline-node-dot.activity {
  background: var(--assistant-primary);
}
.timeline-node-dot.retry {
  background: #e6a23c;
}
.timeline-node-dot.reflection {
  background: rgba(64, 158, 255, 0.55);
}
.message-bubble {
  max-width: 88%;
  padding: 12px 14px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 28px rgba(31, 45, 61, 0.04);
}
.message-bubble.assistant {
  border-top-left-radius: 10px;
}
.message-bubble.user,
.message-bubble.answer {
  max-width: 90%;
  padding: 10px 14px;
  border-top-right-radius: 10px;
  background: linear-gradient(
    135deg,
    var(--assistant-primary),
    var(--assistant-primary-hover)
  );
  border-color: transparent;
  box-shadow: 0 12px 28px rgba(64, 158, 255, 0.2);
}
.message-bubble.user .message-meta,
.message-bubble.user .message-text,
.message-bubble.answer .message-meta,
.message-bubble.answer .message-text {
  color: #fff;
}
.message-bubble.question {
  background: rgba(64, 158, 255, 0.08);
  border-color: rgba(64, 158, 255, 0.18);
}
.message-bubble.error {
  border-color: rgba(245, 108, 108, 0.26);
  background: rgba(245, 108, 108, 0.08);
  box-shadow: 0 10px 24px rgba(245, 108, 108, 0.08);
}
.message-bubble.error .message-meta strong {
  color: #d64c4c;
}
.message-bubble.error .message-text {
  color: #7f1d1d;
}
.message-bubble.reflection,
.message-bubble.observation,
.message-bubble.activity,
.message-bubble.retry {
  width: 100%;
  max-width: none;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 11px;
  color: var(--assistant-text-soft);
}
.message-meta strong {
  font-size: 12px;
  font-weight: 600;
  color: var(--assistant-text-main);
}
.message-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: anywhere;
  font-size: 14px;
  line-height: 1.72;
  color: var(--assistant-text-body);
  font-family: inherit;
}
.step-block {
  position: relative;
  padding-left: 14px;
}
.step-block::before {
  content: "";
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 2px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.18);
}
.step-card {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  border: none;
  background: transparent;
  text-align: left;
  padding: 0;
  cursor: pointer;
}
.step-card-main {
  flex: 1;
  min-width: 0;
}
.step-meta-right,
.tool-tag-list {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.tool-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.08);
  color: var(--assistant-primary);
  font-size: 11px;
}
.ghost-btn,
.primary-btn,
.assistant-fab,
.model-trigger,
.model-menu-item {
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.ghost-btn {
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  color: var(--assistant-text-body);
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.ghost-btn.danger {
  background: rgba(245, 108, 108, 0.08);
  color: #f56c6c;
}
.assistant-question-box {
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(64, 158, 255, 0.08);
  border: 1px solid rgba(64, 158, 255, 0.18);
}
.question-badge {
  display: inline-flex;
  padding: 4px 8px;
  margin-bottom: 8px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.12);
  color: var(--assistant-primary);
  font-size: 11px;
  font-weight: 600;
}
.question-title {
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--assistant-text-main);
}
.question-text {
  font-size: 13px;
  line-height: 1.7;
  color: var(--assistant-text-body);
}
.composer-shell {
  gap: 16px;
  padding: 18px 18px 16px;
  border-radius: 28px;
  background: rgba(248, 250, 255, 0.66);
  border: 1px solid rgba(64, 158, 255, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    0 8px 24px rgba(64, 158, 255, 0.04);
}
.composer-shell.answer-shell {
  border-color: rgba(64, 158, 255, 0.16);
  box-shadow:
    0 0 0 3px rgba(64, 158, 255, 0.035),
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    0 8px 24px rgba(64, 158, 255, 0.05);
}
.assistant-input {
  width: 100%;
  min-height: 104px;
  resize: none;
  border: none;
  padding: 0;
  font-size: 15px;
  background: transparent;
  color: var(--assistant-text-main);
  outline: none;
  line-height: 1.8;
  box-sizing: border-box;
}
.assistant-input::placeholder {
  color: rgba(31, 45, 61, 0.34);
}
.assistant-input:focus {
  box-shadow: none;
}
.assistant-input.answer-input {
  background: transparent;
}
.assistant-composer-actions {
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}
.composer-inline-tools {
  flex-wrap: wrap;
  gap: 10px;
}
.composer-model-wrap {
  position: relative;
}
.model-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 156px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(64, 158, 255, 0.14);
  color: var(--assistant-text-main);
}
.model-trigger-arrow {
  margin-left: auto;
  color: var(--assistant-text-soft);
}
.model-menu {
  position: absolute;
  left: 0;
  bottom: calc(100% + 10px);
  width: 220px;
  padding: 8px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 18px 40px rgba(31, 45, 61, 0.12);
  backdrop-filter: blur(18px);
}
.model-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  background: transparent;
  color: var(--assistant-text-body);
  font-size: 13px;
  text-align: left;
}
.model-menu-item.active {
  background: rgba(64, 158, 255, 0.08);
  color: var(--assistant-primary);
}
.primary-btn {
  padding: 12px 18px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    var(--assistant-primary),
    var(--assistant-primary-hover)
  );
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.composer-submit {
  min-width: 82px;
  min-height: 44px;
  padding: 0 20px;
  box-shadow: 0 10px 24px rgba(64, 158, 255, 0.22);
}
.stop-submit {
  background: linear-gradient(135deg, #f56c6c, #e85d5d);
  box-shadow: 0 10px 24px rgba(245, 108, 108, 0.18);
}
.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.assistant-fab {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    var(--assistant-primary),
    var(--assistant-primary-hover)
  );
  color: #fff;
  font-size: 18px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 16px 34px rgba(64, 158, 255, 0.28);
}
.assistant-slide-enter-active,
.assistant-slide-leave-active {
  transition: all 0.22s ease;
}
.assistant-slide-enter-from,
.assistant-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.model-menu-fade-enter-active,
.model-menu-fade-leave-active {
  transition: all 0.16s ease;
}
.model-menu-fade-enter-from,
.model-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
@keyframes assistantDots {
  0%,
  80%,
  100% {
    opacity: 0.24;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-2px);
  }
}
</style>

<style>
#playwright-highlight-container,
.playwright-highlight-label {
  opacity: 0 !important;
}
#playwright-highlight-container,
#playwright-highlight-container * {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
.playwright-highlight-label {
  display: none !important;
  visibility: hidden !important;
}
#playwright-highlight-container > div {
  background-color: transparent !important;
}
</style>
