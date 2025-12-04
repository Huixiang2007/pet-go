<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <el-aside
      :width="sidebarOpened ? '220px' : '64px'"
      class="sidebar-container"
      :class="{ 'sidebar-folded': !sidebarOpened }"
    >
      <Sidebar />
    </el-aside>
    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="header-container">
        <Header />
      </el-header>
      <!-- 内容区域 -->
      <el-main class="content-container">
        <router-view />
        <Data />
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 导入子组件
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'


import Data from '@/views/admin/Data.vue'
// 侧边栏折叠状态（仅为样式服务）
const sidebarOpened = ref(true)
</script>

<style scoped lang="scss">
$sidebar-bg: #252d3a;
$header-height: 60px;

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar-container {
  background-color: $sidebar-bg;
  color: #fff;
  transition: width 0.3s ease;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-folded {
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header-container {
  height: $header-height;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.content-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
</style>