// import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
// 引入按需引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 自动导入 Element Plus 相关函数（如 ElMessage）
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url))
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/server': {
        target: 'http://8.131.100.56:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['echarts'],
    },
  },
})
