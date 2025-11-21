declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
// src/shims-vue.d.ts
import { ComponentPublicInstance } from 'vue'

declare module 'element-plus' {
  interface InputInstance extends ComponentPublicInstance {
    $el: HTMLElement // 声明 $el 为 DOM 元素
  }
}
