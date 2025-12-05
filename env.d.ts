/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string // 也可以根据你的实际环境变量补充
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


// 更精确的Vue组件模块声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  export default component
}

// 路径别名类型声明
declare module '@/components/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '@/views/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
} /// <reference types="vite/client" />

