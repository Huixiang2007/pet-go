<template>
  <div class=" bg-white shadow-sm  sticky mt-4 overflow-hidden rounded-md transition-all duration-300"
    :class="{ 'w-48': isCollapsed, 'w-16': !isCollapsed }">
    <nav class="py-4 px-4 h-full flex flex-col">
      <div class="flex justify-between items-center pr-4 pl-2">
        <div class="px-4 py-2 text-xs text-gray-400 font-medium" v-if="isCollapsed">核心管理</div>
        <button id="toggle-btn" @click="toggleBtn" class="p-1 rounded hover:bg-gray-100 transition-colors">
          <i class="fa-solid fa-angle-left hover:text-blue-500 text-gray-500 transition-all duration-300"
            :class="{ 'rotate-180 pr-4': !isCollapsed }"></i>
        </button>
      </div>

      <a href="#user" class="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-blue-50 text-blue-600 rounded-md transition-colors">
        <i class="fa-solid fa-users w-5 text-center"></i>
        <span v-if="isCollapsed">订单管理</span>
      </a>
      
      <a href="#order" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
        <i class="fa-solid fa-receipt w-5 text-center"></i>
        <span v-if="isCollapsed">用户管理</span>
      </a>
      
      <a href="#product" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
        <i class="fa-solid fa-boxes-stacked w-5 text-center"></i>
        <span v-if="isCollapsed">商品管理</span>
      </a>
      
      <a href="#product" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
        <i class="fa-solid fa-ticket w-5 text-center"></i> 
        <span v-if="isCollapsed">优惠卷管理</span>
      </a>

      <div class="px-4 py-2 mt-4 text-xs text-gray-400 font-medium" v-if="isCollapsed">店铺设置</div>
      
      <a href="#" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
        <i class="fa-solid fa-gear w-5 text-center"></i>
        <span v-if="isCollapsed">店铺设置</span>
      </a>
      
      <a href="#" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
        <i class="fa-solid fa-chart-line w-5 text-center"></i>
        <span v-if="isCollapsed">数据统计</span>
      </a>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const isCollapsed = ref(true)
const toggleBtn = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
a {
  text-decoration: none;
  transition: all 0.2s ease;
}

#toggle-btn {
  cursor: pointer;
}

.fa-solid {
  flex-shrink: 0; 
}
</style>