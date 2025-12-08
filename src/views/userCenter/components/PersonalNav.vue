<template>
  <aside class="sidebar">
    <ul class="nav-list">
      <li 
        v-for="(item, index) in navItems" 
        :key="index" 
        :class="{ active: activeTab === index }"
        @click="handleTabChange(index)"
      >
        <i class="layui-icon" :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <div class="show-photos">
      <img src="@/assets/img/catPicture.png" alt="这是展示图片" />
    </div>
  </aside>
</template>

<script setup lang="ts">


// 导航项数据（与父组件保持一致）
const navItems = [
  { name: '基本信息', icon: 'layui-icon-user' },
  { name: '实名认证', icon: 'layui-icon-auz' },
  { name: '修改密码', icon: 'layui-icon-password' },
  { name: '我的地址', icon: 'layui-icon-home' },
]

// 接收父组件的激活标签
defineProps({
  activeTab: { type: Number, default: 0 }
})

// 定义切换事件
const emit = defineEmits(['tab-change'])

// 切换标签
const handleTabChange = (index: number) => {
  emit('tab-change', index)
}
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 220px;
  background-color: rgba(255, 255, 255, 0.9);
  padding-top: 1.5rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.nav-list li:hover {
  background-color: rgba(253, 152, 96, 0.1);
  color: #fd9860;
}

.nav-list li.active {
  background-color: rgba(253, 152, 96, 0.2);
  color: #fd9860;
  border-left: 3px solid #fd9860;
}

.nav-list li .layui-icon {
  font-size: 1.2rem;
}

.show-photos {
  max-height: 34%;
  position: absolute;
  width: 74%;
  height: 67%;
  bottom: 6%;
  right: 15%;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    padding: 1rem 0;
  }
  .nav-list {
    display: flex;
    overflow-x: auto;
  }
  .nav-list li {
    flex: none;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  .nav-list li.active {
    border-left: none;
    border-bottom: 3px solid #fd9860;
  }
}
</style>