/// <reference types="vite/client" />

declare interface ImportMeta {
  readonly url: string
  readonly env: ImportMetaEnv
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
}
