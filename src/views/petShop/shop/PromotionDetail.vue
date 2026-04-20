<template>
  <NavBar />
  <header
    class="bg-white shadow-md top-[85px] left-0 right-0 z-100"
    :class="{ shadow: isScrolledPast50 }"
  >
    <ShopCategoryNav v-model="currentCategory" @categoryChange="handleCategoryChange" />
  </header>

  <div class="min-h-screen bg-amber-50 relative overflow-hidden">
    <div class="absolute top-20 left-10 w-32 h-32 bg-yellow-100/50 rounded-full -z-1"></div>
    <div
      class="absolute bottom-20 right-10 w-48 h-48 bg-amber-100/40 rounded-tl-3xl rounded-br-3xl -z-1"
    ></div>

    <main class="mx-auto px-4 sm:px-6 lg:px-[5rem] py-8 relative z-1">
      <div class="mb-8">
        <h2 class="text-2xl font-bold flex items-center text-amber-800">
          <i class="fa fa-gift text-amber-500 mr-2"></i>
          宠物好物促销专区
          <span class="ml-3 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full"
            >全场特惠</span
          >
        </h2>
        <p class="text-amber-700 mt-2">🐾 精选萌宠好物，优惠券+直降双重福利，囤货正当时！</p>
      </div>

      <!-- 热门商品 -->
      <div class="bg-white rounded-2xl shadow-md p-6 border border-amber-100/50">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-amber-800 flex items-center">
            <i class="fa fa-star text-amber-500 mr-2"></i> 热门促销商品
            <span class="ml-2 text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full"
              >直降特惠</span
            >
          </h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="item in hotSaleList"
            :key="item.id"
            class="group hover:-translate-y-1 transition-all"
          >
            <div
              class="bg-amber-50 rounded-xl overflow-hidden border border-amber-100 group-hover:shadow-md"
            >
              <div class="relative">
                <img :src="item.img" :alt="item.name" class="w-full h-40 object-cover" />
                <div
                  class="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md"
                >
                  直降¥{{ item.originalPrice - item.discountPrice }}
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-sm text-gray-800 line-clamp-2 mb-2">{{ item.name }}</h3>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-red-500 font-bold text-lg">¥{{ item.discountPrice }}</span>
                    <span class="text-gray-400 text-xs line-through ml-1"
                      >¥{{ item.originalPrice }}</span
                    >
                  </div>
                  <button
                    class="bg-amber-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-amber-600"
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const hotSaleList = ref([])
const isScrolledPast50 = ref(false)
const currentCategory = ref('all')
const route = useRoute()

const handleCategoryChange = (newCategory: string) => {
  currentCategory.value = newCategory
}

watch(
  () => route.params.id,
  () => {},
)
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #ff7043;
  border-radius: 3px;
}
</style>
