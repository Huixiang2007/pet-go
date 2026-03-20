<template>
  <div class="w-72 border-l border-gray-200 bg-white flex flex-col">
    <!-- 人工商家信息  -->
    <div>
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="fa fa-shop text-blue-500 text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">{{ activeShop.name }}</h3>
            <div class="flex items-center mt-1">
              <span class="text-green-500 text-xs flex items-center"
                ><i class="fa fa-shield mr-1"></i> 已认证</span
              >
            </div>
          </div>
        </div>
        <router-link
          :to="{ path: '/store', query: { id: activeShop.id } }"
          class="mt-4 w-full bg-blue-500 text-white text-sm py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <i class="fa fa-comment-o"></i> 进店逛逛
        </router-link>
      </div>

      <!-- 聊天中商品 - 动态渲染 -->
      <div v-if="activeShop.goods.length > 0" class="p-4 border-b border-gray-200">
        <h4 class="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="fa fa-shopping-bag text-blue-500"></i> 聊天中商品
        </h4>
        <div class="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100">
          <div class="flex gap-3">
            <img
              :src="activeShop.goods[0].img"
              :alt="activeShop.goods[0].name"
              class="w-16 h-16 object-cover rounded-md shadow-sm flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h5 class="text-sm font-medium line-clamp-2 text-gray-800">
                {{ activeShop.goods[0].name }}
              </h5>
              <p class="text-blue-500 text-base mt-1 font-bold">{{ activeShop.goods[0].price }}</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-500">已售 {{ activeShop.goods[0].sales }}件</span>
                <router-link
                  :to="{ path: `/product-detail/${activeShop.goods[0].id}` }"
                  class="text-blue-500 text-xs hover:underline"
                  >查看详情</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 店铺服务 - 动态渲染 -->
      <div class="p-4 flex-1">
        <h4 class="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="fa fa-star text-blue-500"></i> 店铺服务
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="service in activeShop.services"
            :key="service.label"
            class="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i :class="`fa ${service.icon} text-blue-500 mb-1`"></i>
            <p class="text-xs text-gray-700">{{ service.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  activeShop: any
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
