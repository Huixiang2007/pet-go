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

      <router-link to="/seller-order-manager" class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors"
       :class="currentRoute === '/seller-order-manager' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'">
        <i class="fa-solid fa-users w-5 text-center"></i>
        <span v-if="isCollapsed">订单管理</span>
      </router-link>

     <router-link to="/seller-user-manager" class="flex items-center gap-3 px-4 py-3 text-sm font-medium  rounded-md transition-colors"
      :class="currentRoute === '/seller-user-manager' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'">
        <i class="fa-solid fa-receipt w-5 text-center"></i>
        <span v-if="isCollapsed">用户管理</span>
      </router-link>



      <router-link to="/seller-item-manager" class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors"
       :class="currentRoute === '/seller-item-manager' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'">
        <i class="fa-solid fa-boxes-stacked w-5 text-center"></i>
        <span v-if="isCollapsed">商品管理</span>
      </router-link>



      <router-link to="/coupon-management" class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors"
       :class="currentRoute === '/coupon-management' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'">
        <i class="fa-solid fa-ticket w-5 text-center"></i>
        <span v-if="isCollapsed">优惠卷管理</span>
      </router-link>

      <div class="px-4 py-2 mt-4 text-xs text-gray-400 font-medium" v-if="isCollapsed">店铺设置</div>

      <router-link to="/shop-setting" class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors"
       :class="currentRoute === '/shop-setting' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'">
        <i class="fa-solid fa-gear w-5 text-center"></i>
        <span v-if="isCollapsed">店铺设置</span>
    </router-link>

      <router-link to="/analytics" class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors"
       :class="currentRoute === '/analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'">
        <i class="fa-solid fa-chart-line w-5 text-center"></i>
        <span v-if="isCollapsed">数据统计</span>
      </router-link>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const isCollapsed = ref(true)
const currentRoute = ref(window.location.pathname)
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
