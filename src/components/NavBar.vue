<template>
  <div class="bg-white shadow-sm nav">
    <!-- 顶部信息栏 -->
    <div
      class="nav-top container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3"
    >
      <div class="flex items-center">
        <img src="https://picsum.photos/id/237/80/80" alt="PetGo Logo" class="h-12 w-12" />
        <span
          class="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500"
          >PetGo</span
        >
      </div>
      <div class="flex items-center gap-6 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <!-- <el-icon class="text-green-600"><Phone /></el-icon> -->
          <span>优宠托管</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- <el-icon class="text-green-600"><Location /></el-icon> -->
          <span>宠品甄选</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- <el-icon class="text-green-600"><Message /></el-icon> -->
          <span>宠行天下</span>
        </div>
      </div>
      <el-button class="bg-green-500 hover:bg-green-600 text-white rounded-full">
        Donate
      </el-button>
    </div>

    <!-- 主导航栏 -->
    <div class="nav-bottom bg-yellow-400">
      <div class="nav-bottom-container container mx-auto px-4">
        <nav class="nav-bottom-text flex flex-wrap items-center justify-between py-3">
          <div class="flex items-center space-x-6">
            <a href="#" class="text-gray-800 font-semibold border-b-2 border-gray-800 pb-1"
              >我的宠物</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-gray-800"
              >寄养订单</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-gray-800"
              >商品订单</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-gray-800"
              >购物车</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-gray-800"
              >旅游足迹</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-gray-800"
              >我的消息</a
            >
            <a
              href="#"
              class="text-gray-700 hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-gray-800"
              >个人中心</a
            >
          </div>
          <div class="flex items-center gap-4">
            <el-icon class="text-gray-700 hover:text-gray-800 cursor-pointer"
              ><ShoppingCart
            /></el-icon>
            <el-icon class="text-gray-700 hover:text-gray-800 cursor-pointer"><Search /></el-icon>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, Location, Message, ShoppingCart, Search } from '@element-plus/icons-vue'
</script>

<style scoped>
/* 可选：调整图标大小 */
/* :deep(.el-icon) {
  font-size: 18px;
} */
.nav {
  position: relative;
}
.nav-top {
  padding: 10px 0;
  height: 62px;
}
.nav-bottom {
  padding: 3px 0;
  width: 80%;
  position: absolute;
  top: 73%;
  right: 0;
  z-index: 100;
  border-radius: 36px 0 0 36px;
  font-size: 16px;
}
.nav-bottom-container {
  padding-left: 5%;
}
.nav-bottom-text {
  padding: 5px 0;
}
</style>
