import { computed, reactive } from 'vue'
import { PageAgentCore } from 'page-agent'
import { PageController } from '@page-agent/page-controller'

const DEMO_BASE_URL = 'https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run'
const DEFAULT_MODEL = 'qwen3.5-plus'
const DEFAULT_LANGUAGE = 'zh-CN'
const DEFAULT_MODELS = ['qwen3-max', 'qwen3-plus', 'qwen3.5-plus']

function getModelOptions() {
  const raw = import.meta.env.VITE_PAGE_AGENT_MODEL_OPTIONS
  if (!raw) return DEFAULT_MODELS

  const options = raw
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  return options.length ? options : DEFAULT_MODELS
}

function createId(prefix = 'msg') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getConfig() {
  return {
    apiKey: import.meta.env.VITE_PAGE_AGENT_API_KEY,
    model: state.selectedModel || import.meta.env.VITE_PAGE_AGENT_MODEL || DEFAULT_MODEL,
    baseURL: import.meta.env.VITE_PAGE_AGENT_BASE_URL || DEMO_BASE_URL,
    language: import.meta.env.VITE_PAGE_AGENT_LANGUAGE || DEFAULT_LANGUAGE
  }
}

function summarizeActivity(activity) {
  if (!activity) return ''

  switch (activity.type) {
    case 'thinking':
      return '正在思考下一步操作…'
    case 'executing':
      return `正在执行工具：${activity.tool}`
    case 'executed':
      return `已执行工具：${activity.tool}`
    case 'retrying':
      return `正在重试（${activity.attempt}/${activity.maxAttempts}）…`
    case 'error':
      return activity.message || '执行出错'
    default:
      return ''
  }
}

function stringifyValue(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function formatStepEvent(event) {
  const items = []
  const stepTitle = `第 ${(event.stepIndex ?? 0) + 1} 步`

  if (event.reflection) {
    const { evaluation_previous_goal, memory, next_goal } = event.reflection
    const reflectionLines = [
      evaluation_previous_goal ? `评估：${evaluation_previous_goal}` : '',
      memory ? `记忆：${memory}` : '',
      next_goal ? `下一步：${next_goal}` : ''
    ].filter(Boolean)

    if (reflectionLines.length) {
      items.push({
        id: createId('reflection'),
        kind: 'reflection',
        title: `${stepTitle} · 思考步骤`,
        text: reflectionLines.join('\n'),
        meta: stepTitle,
        raw: event
      })
    }
  }

  return items
}

function formatHistory(history = []) {
  return history.flatMap((event) => {
    if (event.type === 'step') {
      return formatStepEvent(event)
    }

    if (event.type === 'observation') {
      return [{
        id: createId('observation'),
        kind: 'observation',
        title: '页面观察',
        text: event.content || '',
        raw: event
      }]
    }

    if (event.type === 'retry') {
      return [{
        id: createId('retry'),
        kind: 'retry',
        title: '重试',
        text: event.message || `正在重试（${event.attempt}/${event.maxAttempts}）`,
        raw: event
      }]
    }

    if (event.type === 'error') {
      return [{
        id: createId('error'),
        kind: 'error',
        title: '执行错误',
        text: event.message || '执行失败',
        raw: event
      }]
    }

    if (event.type === 'user_takeover') {
      return [{
        id: createId('user'),
        kind: 'observation',
        title: '用户接管',
        text: '任务执行过程中已切换为用户接管。',
        raw: event
      }]
    }

    return []
  })
}

const state = reactive({
  visible: false,
  status: 'idle',
  activity: null,
  activityText: '等待输入任务',
  task: '',
  input: '',
  history: [],
  timeline: [],
  error: '',
  waitingForAnswer: false,
  pendingQuestion: '',
  isConfigured: false,
  timelineVersion: 0,
  selectedModel: import.meta.env.VITE_PAGE_AGENT_MODEL || DEFAULT_MODEL,
  availableModels: getModelOptions()
})

let agent = null
let answerResolver = null

function appendTimeline(item) {
  state.timeline.push({
    id: createId('timeline'),
    time: new Date().toLocaleTimeString(),
    ...item
  })
  state.timelineVersion += 1
}

function bumpTimeline() {
  state.timelineVersion += 1
}

function upsertEphemeralActivity(activity) {
  state.timeline = state.timeline.filter(item => item.kind !== 'activity')

  if (!activity) {
    bumpTimeline()
    return
  }

  state.timeline.push({
    id: createId('activity'),
    time: new Date().toLocaleTimeString(),
    kind: 'activity',
    title: '当前操作',
    text: summarizeActivity(activity),
    ephemeral: true,
    raw: activity
  })

  bumpTimeline()
}

function syncHistory() {
  state.history = agent?.history ? [...agent.history] : []
  const formatted = formatHistory(state.history)
  const nonPersistent = state.timeline.filter(
    item => item.ephemeral && ['question', 'answer', 'activity'].includes(item.kind)
  )
  state.timeline = [...nonPersistent, ...formatted]

  if (state.task) {
    const hasTask = state.timeline.some(item => item.kind === 'task' && item.text === state.task)
    if (!hasTask) {
      state.timeline.unshift({
        id: createId('task'),
        kind: 'task',
        title: '任务',
        text: state.task,
        time: new Date().toLocaleTimeString()
      })
    }
  }

  bumpTimeline()
}

function bindAgentEvents(instance) {
  instance.addEventListener('statuschange', () => {
    state.status = instance.status

    if (instance.status === 'running') {
      state.error = ''
      state.activityText = '正在准备执行任务…'
    }

    if (instance.status === 'completed') {
      state.waitingForAnswer = false
      state.pendingQuestion = ''
      state.activity = null
      state.activityText = '任务执行完成'
      upsertEphemeralActivity(null)
    }

    if (instance.status === 'error') {
      state.activity = null
      state.activityText = state.error || '任务执行失败'
      upsertEphemeralActivity(null)
    }
  })

  instance.addEventListener('historychange', () => {
    syncHistory()
  })

  instance.addEventListener('activity', (event) => {
    state.activity = event.detail
    state.activityText = summarizeActivity(event.detail)
    upsertEphemeralActivity(event.detail)
  })

  instance.addEventListener('dispose', () => {
    agent = null
  })
}

function createAgent() {
  const config = getConfig()
  if (!config.apiKey) {
    throw new Error('未配置 VITE_PAGE_AGENT_API_KEY，无法启动小助手')
  }

  const pageController = new PageController({
    enableMask: true,
    highlightOpacity: 0,
    highlightLabelOpacity: 0
  })

  const instance = new PageAgentCore({
    pageController,
    ...config
  })

  instance.onAskUser = async (question) => {
    state.waitingForAnswer = true
    state.pendingQuestion = question
    appendTimeline({
      kind: 'question',
      title: '助手追问',
      text: question,
      ephemeral: true
    })

    return new Promise((resolve) => {
      answerResolver = (answer) => {
        appendTimeline({
          kind: 'answer',
          title: '用户回答',
          text: answer,
          ephemeral: true
        })
        resolve(answer)
      }
    })
  }

  bindAgentEvents(instance)
  state.isConfigured = true
  return instance
}

function ensureAgent() {
  if (!agent) {
    agent = createAgent()
  }

  return agent
}

function resetSession() {
  state.status = 'idle'
  state.activity = null
  state.activityText = '等待输入任务'
  state.task = ''
  state.history = []
  state.timeline = []
  state.error = ''
  state.waitingForAnswer = false
  state.pendingQuestion = ''
  answerResolver = null
  bumpTimeline()
}

async function execute() {
  const text = state.input.trim()

  if (!text) {
    throw new Error(state.waitingForAnswer ? '请输入对追问的回答' : '请输入任务内容')
  }

  if (state.waitingForAnswer) {
    const resolver = answerResolver
    state.waitingForAnswer = false
    state.pendingQuestion = ''
    state.input = ''
    answerResolver = null

    if (!resolver) {
      throw new Error('当前没有待回答的问题')
    }

    resolver(text)
    return { success: true, data: text }
  }

  const instance = ensureAgent()
  resetSession()
  state.task = text
  state.input = ''
  state.visible = true
  appendTimeline({ kind: 'task', title: '任务', text })

  try {
    const result = await instance.execute(text)
    appendTimeline({
      kind: result.success ? 'result' : 'error',
      title: result.success ? '最终结果' : '执行结果',
      text: result.data || (result.success ? '任务完成' : '任务失败'),
      ephemeral: true
    })
    return result
  } catch (error) {
    state.error = error?.message || String(error) || '执行失败'
    appendTimeline({
      kind: 'error',
      title: '执行异常',
      text: state.error,
      ephemeral: true
    })
    throw error
  }
}

function stop() {
  if (!agent) return
  agent.stop()
  state.activity = null
  state.activityText = '任务已停止'
  upsertEphemeralActivity(null)
  appendTimeline({
    kind: 'observation',
    title: '任务停止',
    text: '已手动停止当前任务。',
    ephemeral: true
  })
}

function dispose() {
  if (agent) {
    agent.dispose()
    agent = null
  }
  resetSession()
}

function switchModel(model) {
  if (!model || model === state.selectedModel) return

  state.selectedModel = model

  if (agent) {
    agent.dispose()
    agent = null
  }

  appendTimeline({
    role: 'assistant',
    kind: 'observation',
    title: '模型已切换',
    text: `当前模型已切换为 ${model}`,
    ephemeral: true
  })
}

export function usePageAssistant() {
  const config = getConfig()

  const headerTag = computed(() => {
    if (state.waitingForAnswer) return '等待回答'
    if (state.status === 'running') return '执行中'
    if (state.status === 'completed') return '已完成'
    if (state.status === 'error') return '失败'
    return '待命'
  })

  const canSubmit = computed(() => Boolean(state.input.trim()))
  const canStop = computed(() => state.status === 'running')

  return {
    state,
    config,
    headerTag,
    canSubmit,
    canStop,
    execute,
    stop,
  switchModel,
    dispose,
    resetSession,
    ensureAgent,
    toggleVisible(value) {
      state.visible = typeof value === 'boolean' ? value : !state.visible
    },
    setInput(value) {
      state.input = value
    }
  }
}