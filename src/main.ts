// import './assets/main.css'

import { createApp } from 'vue'

import './index.css'
import App from './App.vue'

// 引入图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import router from './router/index'
import '@/assets/icon.css'
import { store } from './stores'
const app = createApp(App)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
