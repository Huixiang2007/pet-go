<template>
  <div class="header">
    <!-- 左侧：移动端菜单按钮 -->
    <div class="header-left">
      <el-button
        icon="Menu"
        class="mobile-menu-btn"
        @click="sidebarOpened = !sidebarOpened"
        circle
        v-show="isMobile"
      ></el-button>
    </div>

    <!-- 中间：全局搜索框 -->
    <div class="header-search" v-show="!isMobile || (isMobile && sidebarOpened)">
      <el-input
        v-model="searchValue"
        placeholder="搜索用户、订单、服务ID/名称..."
        prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
        class="search-input"
      >
        <template #append>
          <el-button icon="Search" type="primary" size="small" @click="handleSearch"></el-button>
        </template>
      </el-input>
    </div>

    <!-- 右侧：功能入口区 -->
    <div class="header-right">
      <!-- 主题切换-->
      <el-dropdown trigger="click">
        <el-button icon="Moon" circle class="header-btn"></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="light">亮色模式</el-dropdown-item>
            <el-dropdown-item command="dark">暗色模式</el-dropdown-item>
            <el-dropdown-item command="auto">跟随系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 消息通知（简化 dropdown 插槽写法） -->
      <el-dropdown trigger="click" class="notification-dropdown">
        <el-button
          icon="Bell"
          circle
          class="header-btn"
          :class="{ 'has-notification': unreadCount > 0 }"
        >
          <span v-if="unreadCount > 0" class="notification-badge">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </el-button>
        <template #dropdown>
          <div class="notification-panel">
            <div class="notification-header">
              <span class="notification-title">消息通知</span>
              <el-button type="text" size="small" v-if="unreadCount > 0">全部已读</el-button>
            </div>
            <div class="notification-list">
              <el-empty description="暂无消息通知" v-if="!notificationList.length"></el-empty>
              <div
                v-for="(item, index) in notificationList"
                :key="index"
                class="notification-item"
                :class="{ unread: !item.read }"
              >
                <div class="notification-icon">
                  <el-icon :class="getIconClass(item.type)">
                    <component :is="getIconComponent(item.type)"></component>
                  </el-icon>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{{ item.title }}</div>
                  <div class="notification-desc">{{ item.content }}</div>
                  <div class="notification-time">{{ item.time }}</div>
                </div>
                <el-button
                  icon="Check"
                  size="mini"
                  class="mark-read-btn"
                  v-if="!item.read"
                ></el-button>
              </div>
            </div>
          </div>
        </template>
      </el-dropdown>

      <!-- 个人中心（简化结构，无冗余） -->
      <el-dropdown trigger="click" class="user-dropdown">
        <div class="user-info" @click.stop>
          <el-avatar :src="userAvatar" class="user-avatar"></el-avatar>
          <span class="user-name" v-show="!isMobile || (isMobile && sidebarOpened)">
            {{ userName }}
          </span>
          <el-icon class="user-arrow" v-show="!isMobile">
            <ArrowDown></ArrowDown>
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><User></User></el-icon>
              <span>个人资料</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Lock></Lock></el-icon>
              <span>修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<!-- 注意：如果使用的是 Element Plus（Vue 3），需要确保图标已导入，可在 script 中添加： -->
<script setup lang="ts">
import { ref } from 'vue'
// 导入所需图标（根据你的 Element 版本调整，Element Plus 需手动导入）

interface NotificationItem {
  type: string
  title: string
  content: string
  time: string
  read: boolean
}
// 其他逻辑（变量、方法）保持不变...
const isMobile = ref(false)
const sidebarOpened = ref(false)
const searchValue = ref('')
const unreadCount = ref(0)
const notificationList = ref<NotificationItem[]>([])
const userAvatar = ref('')
const userName = ref('')

const handleSearch = () => {
  // 搜索逻辑
}

const getIconClass = (type: string) => {
  // 图标类名逻辑
}

const getIconComponent = (type: string) => {
  // 图标组件逻辑
}
</script>
<script lang="ts">
export default {
  name: 'userHeader', // 名字随便填，核心是触发导出
}
</script>
<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 左侧样式 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-btn {
  background-color: transparent;
  color: #333;
  &:hover {
    background-color: #f5f7fa;
  }
}

/* 搜索框样式 */
.header-search {
  flex: 1;
  max-width: 600px;
  margin: 0 20px;
}

.search-input {
  width: 100%;
  border-radius: 20px;
}

/* 右侧样式 */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  background-color: transparent;
  color: #666;
  &:hover {
    background-color: #f5f7fa;
    color: #409eff;
  }
}

/* 消息通知样式 */
.notification-dropdown {
  position: relative;
}

.has-notification {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #f56c6c;
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-panel {
  width: 400px;
  max-height: 500px;
  overflow: hidden;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f5f7fa;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  &:hover {
    background-color: #f5f7fa;
  }
}

.notification-item.unread {
  background-color: #f0f9ff;
}

.notification-icon {
  margin-top: 2px;
}

.notification-content {
  flex: 1;
  overflow: hidden;
}

.notification-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 11px;
  color: #999;
}

.mark-read-btn {
  color: #409eff;
  background-color: transparent;
  &:hover {
    background-color: transparent;
    color: #2563eb;
  }
}

.empty-notification {
  padding: 40px 20px;
}

/* 个人中心样式 */
.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.user-arrow {
  font-size: 12px;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-search {
    display: none;
  }

  .user-name {
    display: none;
  }

  .notification-panel {
    width: 300px;
  }
}
</style>
