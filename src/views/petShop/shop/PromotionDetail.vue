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
      <!-- 页面标题（弱化秒杀，突出促销） -->
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

      <!-- 全部优惠券（核心模块） -->
      <div class="bg-amber-100/70 rounded-2xl p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-amber-800 flex items-center">
            <i class="fa fa-ticket text-amber-600 mr-2"></i> 全部优惠券
          </h3>
          <!-- 可加：跳转到秒杀页的入口（如果需要） -->
          <router-link
            to="/seckill"
            class="text-amber-700 text-sm hover:text-amber-800 transition-colors"
          >
            去秒杀专区 →
          </router-link>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="coupon in allCouponList"
            :key="coupon.id"
            class="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div class="absolute left-0 top-0 w-1.5 h-full bg-amber-400"></div>
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="text-3xl font-bold text-amber-600">¥{{ coupon.amount }}</span>
                <span class="text-sm text-gray-500 ml-1">{{ coupon.condition }}</span>
              </div>
              <i class="fa fa-paw text-amber-400 text-xl"></i>
            </div>
            <div class="text-sm text-gray-400 mb-3">有效期至 {{ coupon.expireDate }}</div>
            <button
              class="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-sm py-2 rounded-lg hover:from-amber-500 hover:to-yellow-500 transition-all"
            >
              立即领取
            </button>
          </div>
        </div>
      </div>

      <!-- 热门促销商品（核心模块） -->
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
                    class="bg-amber-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-amber-600 transition-colors"
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
import { ref } from 'vue'
// 模拟全部优惠券数据
const allCouponList = [
  { id: 1, amount: 50, condition: '满500可用', expireDate: '2023-12-31' },
  { id: 2, amount: 30, condition: '满300可用', expireDate: '2023-12-31' },
  { id: 3, name: '无门槛券', amount: 10, condition: '无门槛', expireDate: '2023-12-31' },
  { id: 4, amount: 20, condition: '满200可用', expireDate: '2023-12-31' },
  { id: 5, amount: 5, condition: '满50可用', expireDate: '2023-12-31' },
]
const isScrolledPast50 = ref(false)
const currentCategory = ref('promotion')
const handleCategoryChange = (newCategory: string) => {
  currentCategory.value = newCategory
}
// 模拟热门促销商品
const hotSaleList = [
  {
    id: 1,
    name: '水族护理全套清洁工具',
    img: '/img/宠物1.jpg',
    discountPrice: 89,
    originalPrice: 129,
  },
  {
    id: 2,
    name: '幼宠护理全套洗护套装',
    img: '/img/宠物2.jpg',
    discountPrice: 129,
    originalPrice: 199,
  },
  { id: 3, name: '大型犬幼犬奶粉', img: '/img/宠物3.jpg', discountPrice: 159, originalPrice: 229 },
  {
    id: 4,
    name: '幼宠奶粉+营养膏组合',
    img: '/img/宠物4.jpg',
    discountPrice: 199,
    originalPrice: 299,
  },
]
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
