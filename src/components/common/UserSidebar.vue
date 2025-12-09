<template>
  <div class="sidebar">
    <!-- 品牌Logo -->
    <div class="sidebar-logo">
      <div class="logo-wrapper">
        <el-icon class="logo-icon">
          <img src="@/assets/img/logo.png" alt="这是图标" class="logo" />
        </el-icon>
        <span v-if="sidebarOpened" class="logo-text">PetGo 管理后台</span>
      </div>
      <!-- 折叠按钮 -->
      <el-button icon="Menu" class="fold-btn" @click="sidebarOpened = !sidebarOpened" circle />
    </div>
    <!-- 菜单列表 -->
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="!sidebarOpened"
      background-color="#995f4687"
      text-color="#F5E8D9"
      active-text-color="#FF8A65"
      router
    >
      <!-- 数据概览 -->
      <el-menu-item index="/admin/data">
        <el-icon><PieChart /></el-icon>
        <!-- 补充数据概览图标 -->
        <span v-if="sidebarOpened">数据概览</span>
      </el-menu-item>
      <!-- 用户管理 -->
      <el-menu-item index="/admin/user">
        <!-- <template #title> -->
          <el-icon><User /></el-icon>
          <span v-if="sidebarOpened">用户管理</span>
    
      </el-menu-item>
      <!-- 寄养服务管理 -->
      <el-sub-menu index="/admin/foster">
        <template #title>
          <el-icon><House /></el-icon>
          <span v-if="sidebarOpened">寄养服务管理</span>
        </template>
        <el-menu-item index="/admin/foster/audit">服务审核</el-menu-item> 
      <el-menu-item index="/admin/foster/orders">寄养订单管理</el-menu-item> 
         <el-menu-item index="/admin/foster/home">寄养家庭管理</el-menu-item>
        <el-menu-item index="/admin/foster/comment">评价管理</el-menu-item>
      </el-sub-menu>
      <!-- 电商管理 -->
      <!-- <el-sub-menu index="admin/mall">
        <template #title>
          <el-icon><Shop /></el-icon>
          <span v-if="sidebarOpened">宠物电商管理</span>
        </template>
        <el-menu-item index="/mall/goods">商品管理</el-menu-item>
        <el-menu-item index="/mall/order">订单管理</el-menu-item>
        <el-menu-item index="/mall/stock">库存管理</el-menu-item>
        <el-menu-item index="/mall/coupon">优惠券管理</el-menu-item>
      </el-sub-menu> -->

      <!-- 系统管理 -->
      <!-- <el-sub-menu index="/admin/system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span v-if="sidebarOpened">系统管理</span>
        </template> -->
        <!-- <el-menu-item index="/system/notice">通知发布</el-menu-item>
        <el-menu-item index="/system/role">角色权限管理</el-menu-item>
        <el-menu-item index="/system/log">操作日志查询</el-menu-item> -->
      <!-- </el-sub-menu>-->
    </el-menu> 
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 路由实例
const route = useRoute()
// 侧边栏折叠状态
const sidebarOpened = ref(true)
// 当前激活菜单
const activeMenu = computed(() => route.path ||'/admin/data')
</script>

<script lang="ts">
export default {
  name: 'SidebarLeft',
}
</script>

<style scoped lang="scss">
// 暖色系主题变量（与其他页面保持一致）
$primary-orange: #ff8a65; // 主橙色
$sidebar-bg: #3d2b23; // 侧边栏深棕色背景
$sidebar-hover: #4a3629; // 侧边栏hover背景
$sidebar-active: rgba(255, 138, 101, 0.2); // 激活项背景
$text-normal: #f5e8d9; // 普通文字色（浅米色）
$text-active: #ff8a65; // 激活文字色（主橙色）
$border-color: #4a3629; // 边框色

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $sidebar-bg;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
  border-bottom: 1px solid $border-color;
}
.sidebar-logo img {
  margin-bottom: 20%;
  margin-right: 14%;
  max-width: 143%;
  height: auto;
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo-icon {
  font-size: 24px;
  color: $primary-orange; // Logo图标改为主橙色
  margin-right: 8px;
}

.logo-text {
  font-size: 16px;
  font-weight: 500;
  color: $text-normal; // Logo文字为浅米色
}

.fold-btn {
  color: $text-normal;
  background-color: transparent;
  border: none;
  &:hover {
    background-color: $sidebar-hover;
    color: $primary-orange; // hover时按钮颜色变为主橙色
  }
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  --el-menu-bg-color: $sidebar-bg;
  --el-menu-text-color: $text-normal;
  --el-menu-active-text-color: $text-active;
  --el-menu-hover-bg-color: $sidebar-hover;
}

// 修复子菜单标题样式
.el-sub-menu__title {
  height: 50px !important;
  line-height: 50px !important;
  color: $text-normal !important;
  &:hover {
    background-color: $sidebar-hover !important;
    color: $text-active !important;
  }
  // 子菜单图标颜色
  .el-icon {
    color: $text-normal !important;
  }
  &:hover .el-icon {
    color: $text-active !important;
  }
}

// 菜单项样式
.el-menu-item {
  height: 50px !important;
  line-height: 50px !important;
  color: $text-normal !important;
  &:hover {
    background-color: $sidebar-hover !important;
    color: $text-active !important;
  }
  // 菜单项图标颜色
  .el-icon {
    color: $text-normal !important;
  }
  &:hover .el-icon {
    color: $text-active !important;
  }
}

// 激活菜单项样式
.el-menu-item.is-active {
  background-color: $sidebar-active !important;
  color: $text-active !important;
  // 激活项图标颜色
  .el-icon {
    color: $text-active !important;
  }
}

// 子菜单展开时的样式
.el-sub-menu.is-opened .el-sub-menu__title {
  color: $text-active !important;
  .el-icon {
    color: $text-active !important;
  }
}

// 折叠状态下的菜单宽度调整
.el-menu--collapse {
  width: 64px !important;
  .el-sub-menu__title {
    justify-content: center !important;
  }
}
</style>
