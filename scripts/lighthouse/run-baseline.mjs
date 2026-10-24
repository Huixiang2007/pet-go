import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const lighthouseConfig = require(
  path.join(projectRoot, 'docs/performance/lighthouse-desktop-1536x695.cjs'),
)

const baseUrl = (process.env.LH_BASE_URL || 'http://localhost:5174').replace(/\/$/, '')
const apiBase = (process.env.LH_API_BASE || 'http://localhost:8085').replace(/\/$/, '')
const email = process.env.LH_EMAIL
const password = process.env.LH_PASSWORD
const runLabel = (process.env.LH_LABEL || 'baseline').replace(/[^a-zA-Z0-9_-]/g, '-')
const outputDir = path.resolve(
  projectRoot,
  process.env.LH_OUTPUT_DIR || 'docs/performance/lighthouse-reports',
)
const latitude = Number(process.env.LH_USER_LAT || 35.303)
const longitude = Number(process.env.LH_USER_LNG || 113.9268)
const address = process.env.LH_USER_ADDRESS || '河南省新乡市红旗区测试位置'

const pages = [
  {
    slug: 'foster-care',
    url: `${baseUrl}/foster-care?types=all&radius=555`,
    validateScript: `JSON.stringify({
      path: location.pathname,
      providerCount: document.querySelectorAll('.list-item').length,
      hasInstitution: document.body.innerText.includes('PetGo安心寄养机构'),
      hasFamily: document.body.innerText.includes('PetGo温馨家庭寄养'),
      summary: document.body.innerText.match(/找到\\s*\\d+\\s*个寄养服务/)?.[0] || '',
      hasMapPage: Boolean(document.querySelector('.map-component-container')),
      hasToken: Boolean(localStorage.getItem('authToken')),
      userLocation: localStorage.getItem('userLocation') || '',
      bodyText: document.body.innerText.slice(0, 300)
    })`,
    validate(state) {
      if (state.path !== '/foster-care') return '页面跳转到了 ' + state.path
      if (state.providerCount < 2) return `寄养列表只有 ${state.providerCount} 条`
      if (!state.hasInstitution || !state.hasFamily) return '寄养机构或寄养家庭未加载'
    },
    describe(state) {
      return `列表 ${state.providerCount} 条，${state.summary || '未找到统计文案'}`
    },
  },
  {
    slug: 'my-pets',
    url: `${baseUrl}/my-pets`,
    validateScript: `JSON.stringify({
      path: location.pathname,
      petCount: document.querySelectorAll('.pet-fullscreen-card').length,
      hasPetPage: Boolean(document.querySelector('.pet-showcase-app')),
      hasPetCounter: document.body.innerText.includes('宠物')
    })`,
    validate(state) {
      if (state.path !== '/my-pets') return '页面跳转到了 ' + state.path
      if (!state.hasPetPage || !state.hasPetCounter) return '我的宠物页面主体未加载'
      if (state.petCount < 1) return '当前账号没有加载到宠物数据'
    },
    describe(state) {
      return `宠物卡片 ${state.petCount} 个`
    },
  },
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function login() {
  const body = new URLSearchParams({ email, password })
  const response = await fetch(`${apiBase}/api/user/login/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!response.ok) throw new Error(`登录接口 HTTP ${response.status}`)
  const result = await response.json()
  if (result.code !== 0) throw new Error(`登录失败：${result.msg}`)
  return result.data
}

async function connectCdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  let messageId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (!message.id || !pending.has(message.id)) return
    const entry = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) entry.reject(new Error(message.error.message))
    else entry.resolve(message.result)
  })

  return {
    send(method, params = {}) {
      const id = ++messageId
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
        socket.send(JSON.stringify({ id, method, params }))
      })
    },
    close() {
      socket.close()
    },
  }
}

async function createPageTarget(port, url) {
  const response = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,
    { method: 'PUT' },
  )
  if (!response.ok) throw new Error(`创建 Chrome 页面失败：HTTP ${response.status}`)
  return response.json()
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || '浏览器脚本执行失败')
  }
  return result.result.value
}

async function waitForPageData(client, page) {
  let lastState = null
  for (let attempt = 0; attempt < 30; attempt++) {
    const rawState = await evaluate(client, page.validateScript)
    lastState = JSON.parse(rawState)
    const error = page.validate(lastState)
    if (!error) return { state: lastState, description: page.describe(lastState) }
    await sleep(500)
  }
  const error = page.validate(lastState)
  throw new Error(
    `${page.slug} 数据校验失败：${error}；当前状态 ${JSON.stringify(lastState)}`,
  )
}

function assertLighthouseSettings(lhr) {
  const settings = lhr.configSettings
  const screen = settings.screenEmulation
  if (settings.formFactor !== 'desktop') throw new Error('Lighthouse formFactor 不是 desktop')
  if (screen.width !== 1536 || screen.height !== 695) {
    throw new Error(`Lighthouse 屏幕尺寸错误：${screen.width}x${screen.height}`)
  }
  if (screen.deviceScaleFactor !== 1) {
    throw new Error(`Lighthouse DPR 错误：${screen.deviceScaleFactor}`)
  }
  if (screen.mobile !== false) throw new Error('Lighthouse mobile 应为 false')
  if (lhr.finalDisplayedUrl.includes('/login')) throw new Error('Lighthouse 最终跳回了登录页')
}

function extractMetrics(lhr) {
  return {
    performance: Math.round(lhr.categories.performance.score * 100),
    fcp: lhr.audits['first-contentful-paint'].displayValue,
    lcp: lhr.audits['largest-contentful-paint'].displayValue,
    tbt: lhr.audits['total-blocking-time'].displayValue,
    cls: lhr.audits['cumulative-layout-shift'].displayValue,
    speedIndex: lhr.audits['speed-index'].displayValue,
    tti: lhr.audits.interactive.displayValue,
    pageBytes: lhr.audits['total-byte-weight']?.displayValue || '',
  }
}

async function main() {
  if (!email || !password) {
    throw new Error('缺少 LH_EMAIL 或 LH_PASSWORD 环境变量')
  }

  const auth = await login()
  fs.mkdirSync(outputDir, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const chrome = await launch({
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1536,695',
      '--no-first-run',
      '--no-default-browser-check',
    ],
    logLevel: 'error',
  })

  const results = []
  try {
    const storageValues = {
      authToken: auth.token,
      userId: auth.userInfo.userId,
      userRole: auth.userInfo.userRole,
      fosterProviderIds: (auth.fosterProviderIds || []).join(','),
      userLocation: JSON.stringify({ lat: latitude, lng: longitude, address }),
    }

    for (const page of pages) {
      console.log(`\n[${page.slug}] 打开 ${page.url}`)
      const target = await createPageTarget(chrome.port, `${baseUrl}/login`)
      const client = await connectCdp(target.webSocketDebuggerUrl)
      await client.send('Runtime.enable')
      await sleep(1000)
      for (const [key, value] of Object.entries(storageValues)) {
        await evaluate(
          client,
          `localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(String(value))})`,
        )
      }
      await client.send('Page.navigate', { url: page.url })
      const pageCheck = await waitForPageData(client, page)
      console.log(`[${page.slug}] 页面数据通过：${pageCheck.description}`)
      try {
        await client.send('Page.close')
      } catch {}
      client.close()

      const result = await lighthouse(
        page.url,
        {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
          disableStorageReset: true,
        },
        lighthouseConfig,
      )
      assertLighthouseSettings(result.lhr)

      const reportPath = path.join(
        outputDir,
        `${page.slug}-${runLabel}-${timestamp}.report.json`,
      )
      fs.writeFileSync(reportPath, result.report)
      const metrics = extractMetrics(result.lhr)
      results.push({ page: page.slug, reportPath, ...metrics })
    }
  } finally {
    await chrome.kill()
  }

  console.log('\nLighthouse 基线结果：')
  console.table(results)
  console.log('\nJSON 报告：')
  for (const result of results) console.log(`- ${result.reportPath}`)
}

main()
  .then(() => {
    setTimeout(() => process.exit(0), 100)
  })
  .catch((error) => {
    console.error(`\n执行失败：${error.message}`)
    setTimeout(() => process.exit(1), 100)
  })
