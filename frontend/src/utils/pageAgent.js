import { PageAgent } from 'page-agent'

let agentInstance = null

function getConfig() {
  const apiKey = import.meta.env.VITE_PAGE_AGENT_API_KEY
  const model = import.meta.env.VITE_PAGE_AGENT_MODEL || 'qwen3.5-plus'
  const baseURL = import.meta.env.VITE_PAGE_AGENT_BASE_URL || 'https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run'
  const language = import.meta.env.VITE_PAGE_AGENT_LANGUAGE || 'zh-CN'

  return {
    apiKey,
    model,
    baseURL,
    language
  }
}

function createPageAgent() {
  const { apiKey, model, baseURL, language } = getConfig()

  if (!apiKey) {
    throw new Error('未配置 VITE_PAGE_AGENT_API_KEY，无法初始化 page-agent')
  }

  return new PageAgent({
    apiKey,
    model,
    baseURL,
    language
  })
}

function resetPageAgent() {
  agentInstance = null
}

function isDisposedError(error) {
  const message = error?.message || String(error) || ''
  return /disposed|Create a new instance/i.test(message)
}

export function getPageAgent() {
  if (!agentInstance) {
    agentInstance = createPageAgent()
  }

  return agentInstance
}

export async function executeInstruction(instruction) {
  const text = instruction?.trim()

  if (!text) {
    throw new Error('请输入要执行的指令')
  }

  try {
    const agent = getPageAgent()
    await agent.execute(text)
  } catch (error) {
    if (!isDisposedError(error)) {
      throw error
    }

    resetPageAgent()

    const nextAgent = getPageAgent()
    await nextAgent.execute(text)
  }

  return {
    success: true,
    message: `已执行：${text}`
  }
}
