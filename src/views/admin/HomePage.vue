<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <el-aside
      :width="sidebarOpened ? '220px' : '64px'"
      class="sidebar-container"
      :class="{ 'sidebar-folded': !sidebarOpened }"
    >
      <Sidebar :is-opened="sidebarOpened"  @toggle="handleToggleSidebar"/>
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
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 导入子组件
import Sidebar from './components/UserSidebar.vue'
import Header from './components/UserHeader.vue'
// 侧边栏折叠状态


// 处理侧边栏切换
const handleToggleSidebar = () => {
  sidebarOpened.value = !sidebarOpened.value
}

// 侧边栏折叠状态（仅为样式服务）
const sidebarOpened = ref(true)

</script>

<style scoped lang="scss">
$sidebar-bg: #252d3a;
$header-height: 60px;
.el-select--small .el-select__wrapper {
  font-size: 14px;
  gap: 4px;
  line-height: 20px;
  min-height: 39px;
  max-width: 318px;
  padding: 2px 8px;
}
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
  background-color: #fff9f2;
}
:deep(.el-menu--collapse .el-sub-menu__popper.el-menu--popup){
  padding: 0 !important;
  --el-menu-bg-color: rgba(255, 138, 101, 0.2) !important; 
}
// :deep(.el-popper .is-pure .is-light .el-tooltip) {
//   background-color: rgb(255 138 101 / 20%) !important; // 子菜单背景色（与侧边栏一致）
//   border: none !important; // 去掉默认边框
//   box-shadow: 0 2px 12px rgba(0,0,0,0.2) !important; // 可选：加阴影增强层次
//   min-width: 180px !important; // 可选：自定义子菜单宽度
// }


</style>
