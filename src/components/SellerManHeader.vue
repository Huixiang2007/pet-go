<template>
  <div class="bg-white w-full h-16 px-4 sm:px-6 flex items-center justify-between shadow-sm border-b border-gray-100">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
        <i class="fas fa-store-alt text-2xl text-blue-600"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-800 tracking-tight">
        Pet-go - 商家管理
      </h2>
    </div>

    <div class="flex items-center gap-1 sm:gap-4">
      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
        <i class="fas fa-bell text-gray-700"></i>
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        <span class="hidden sm:inline ml-1 text-sm text-gray-600">消息通知</span>
      </button>

      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
        <img 
          src="/img/dog.png" 
          alt="店铺头像" 
          class="w-8 h-8 rounded-full border border-gray-200 object-cover"
        >
        <span class="text-sm font-medium text-gray-800">小明官方旗舰店</span>
      </div>

      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <i class="fas fa-sign-out-alt text-gray-700"></i>
        <span class="hidden sm:inline ml-1 text-sm text-gray-600">退出</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 保持原有逻辑不变
</script>

<style scoped>
@media (max-width: 640px) {
  .hidden.sm:inline {
    display: none !important;
  }
}
</style>