<template>
  <div class="fixed z-10 w-full h-16">
    <div class="container mx-auto px-4">
      <!-- 导航容器（固定高度，避免过高） -->
      <div class="flex items-center justify-center h-14">
        <!-- 左侧导航 -->
        <div class="flex items-center space-x-5">
          <div v-for="item in navLeftItems" :key="item.text" class="nav-item relative px-1 py-2 cursor-pointer text-sm">
            {{ item.text }}
          </div>
        </div>

        <!-- 中间Logo（缩小尺寸，避免遮挡） -->
        <div class="py-10 mx-5">
          <div class="flex items-center justify-center">
            <div class="text-purple-800 text-lg mr-1">🐾</div>
            <h1 class="text-purple-900 font-bold text-sm">PetGo</h1>
          </div>
        </div>

        <!-- 右侧导航 -->
        <div class="flex items-center space-x-5">
          <div v-for="item in navRightItems" :key="item.text" class="nav-item relative px-1 py-2 cursor-pointer text-sm"
            :class="{ active: item.text === '我的宠物' }">
            {{ item.text }}
          </div>
          <el-button type="warning" plain size="default" class="ml-1">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'

const navRightItems = [
  { text: '购物车' },
  { text: '旅游足迹' },
  { text: '我的消息' },
  { text: '加入我们' }

]
const navLeftItems = [
  { text: '优宠托管' },
  { text: '宠品甄选' },
  { text: '宠行天下' },
  { text: '我的宠物' },
  { text: '我的订单' },


]
</script>

<style scoped>
.nav-item {
  color: #333;
  position: relative;
  white-space: nowrap;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #f5a623;
  transition: width 0.3s ease-in-out;
}

.nav-item.active::after,
.nav-item:hover::after {
  width: 100%;
}

.el-button {
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
}
</style>
