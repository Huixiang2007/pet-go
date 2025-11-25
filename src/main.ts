// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './index.css'
import App from './App.vue'

// 引入图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index'
import '@/assets/icon.css'
const app = createApp(App)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(router)

app.mount('#app')
