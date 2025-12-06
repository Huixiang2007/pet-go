<template>
  <NavBar />
  <header class="bg-white shadow-md top-[85px] left-0 right-0 z-50" :class="{ shadow: isScrolledPast50 }">
    <ShopCategoryNav v-model="currentCategory" @categoryChange="handleCategoryChange" />
  </header>
  <div class="min-h-screen pt-1 bg-yellow-50">
    <div class="pet-shop-container">
      <div class="top-section">
        <!-- 轮播图 -->
        <div class="carousel bg-white shadow-md rounded-lg overflow-hidden">
          <div class="relative h-80">
            <button
              class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all z-10 opacity-100"
              @click="prevSlide">
              <i class="fa fa-chevron-left"></i>
            </button>

            <!-- 轮播图片 -->
            <img v-for="(item, index) in carouselItems" :key="index" :src="item.image" :alt="item.title"
              class="w-full h-full object-cover" :class="{
                'opacity-100': currentSlide === index,
                'opacity-0 absolute inset-0 transition-opacity duration-500':
                  currentSlide !== index,
              }" />

            <!-- 右箭头 -->
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all z-10 opacity-100"
              @click="nextSlide">
              <i class="fa fa-chevron-right"></i>
            </button>
            <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <button v-for="(item, index) in carouselItems" :key="index" class="w-3 h-3 rounded-full" :class="{
                'bg-white': currentSlide === index,
                'bg-white/50': currentSlide !== index,
              }" @click="currentSlide = index"></button>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能 -->
      <div class="features grid grid-cols-3 gap-3 mt-6">
        <div @click="FlashSale"
          class="feature-card bg-red-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div class="flex justify-center items-center flex-row ml-[-123px] mt-[-27px] mb-[-35px]">
            <img src="/img/秒杀.gif" alt="秒杀" class="h-[120px] w-[120px]" />
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <i class="fa fa-fire text-2xl text-red-600"></i>
            </div>
          </div>
          <h3 class="font-medium text-gray-800 mt-4">爆款秒杀</h3>
          <p class="text-sm text-gray-500 mt-1">万人关注的爆款商品秒杀</p>
        </div>
        <div @click="aiServer"
          class="feature-card bg-[#e6f7ff] rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div class="w-16 h-16 bg-[#aadafa] rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fa fa-headphones text-2xl text-[#0288d1]"></i>
          </div>
          <h3 class="font-medium text-gray-800">ai客服</h3>
          <p class="text-sm text-gray-500 mt-1">ai专业客服,科学养宠为TA护航</p>
        </div>
        <div
          class="feature-card bg-purple-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div @click="goCart"
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fa fa-truck text-2xl text-purple-600"></i>
          </div>
          <h3 class="font-medium text-gray-800">购物车</h3>
          <p class="text-sm text-gray-500 mt-1">你想要的，都在这里</p>
        </div>
      </div>
      <!-- 优惠卷 -->
      <div class="bg-gradient-to-r from-[#FFD1DC] to-[#FFF3E0] rounded-xl p-6 shadow-md mb-8 mt-3">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <i class="fa fa-ticket text-[#FF7043] text-2xl mr-3"></i>
            <h2 class="text-xl font-bold">优惠券中心</h2>
          </div>
          <a href="#" class="text-[#FF7043] text-sm hover:underline">查看全部</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 优惠券1 -->
          <div
            class="coupon-edge bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative pl-8 pr-8">
            <div class="absolute top-3 right-3 text-accent/30">
              <i class="fa fa-paw text-2xl"></i>
            </div>
            <div class="flex items-end mb-3">
              <span class="text-4xl font-bold text-[#FF7043]">¥50</span>
              <span class="text-gray-500 ml-2 mb-1">满500可用</span>
            </div>
            <p class="text-xs text-gray-400 mb-4">有效期至 2023-12-31</p>
            <button
              class="w-full bg-[#FF7043] hover:bg-[#FF7043]/90 text-white py-2 rounded-full text-sm transition-colors">
              立即领取
            </button>
          </div>

          <!-- 优惠券2 -->
          <div
            class="coupon-edge bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative pl-8 pr-8">
            <div class="absolute top-3 right-3 text-accent/30">
              <i class="fa fa-paw text-2xl"></i>
            </div>
            <div class="flex items-end mb-3">
              <span class="text-4xl font-bold text-[#FF7043]">¥30</span>
              <span class="text-gray-500 ml-2 mb-1">满300可用</span>
            </div>
            <p class="text-xs text-gray-400 mb-4">有效期至 2023-12-31</p>
            <button
              class="w-full bg-[#FF7043] hover:bg-[#FF7043]/90 text-white py-2 rounded-full text-sm transition-colors">
              立即领取
            </button>
          </div>

          <!-- 优惠券3 -->
          <div
            class="coupon-edge bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative pl-8 pr-8">
            <div class="absolute top-3 right-3 text-accent/30">
              <i class="fa fa-paw text-2xl"></i>
            </div>
            <div class="flex items-end mb-3">
              <span class="text-4xl font-bold text-[#FF7043]">¥10</span>
              <span class="text-gray-500 ml-2 mb-1">无门槛</span>
            </div>
            <p class="text-xs text-gray-400 mb-4">有效期至 2023-12-31</p>
            <button
              class="w-full bg-[#FF7043] hover:bg-[#FF7043]/90 text-white py-2 rounded-full text-sm transition-colors">
              立即领取
            </button>
          </div>
        </div>

        <!-- 底部信息栏 -->
        <div
          class="flex flex-col md:flex-row items-center justify-between py-2 px-6 bg-white rounded-2xl mt-2 border-t border-gray-100">
          <div class="flex items-center mb-3 md:mb-0">
            <div class="w-10 h-5 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-paw text-[#333333]"></i>
            </div>
            <div class="text-gray-400 text-xs">不错过每一次优惠</div>
          </div>
          <div class="flex gap-3">
            <button
              class="bg-[#bbdefb] text-[#333333] text-xs px-4 py-2 rounded-full transition-all duration-300 hover:bg-blue-200"
              @click="popupVisible = true">
              查看规则
            </button>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="products mt-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fa fa-star text-[#FF7043] mr-2"></i>热门商品
          </h2>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="product in products" :key="product.id"
            class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
            @click="productsDeatil(product.id)">
            <div class="w-full h-64 bg-gray-50 overflow-hidden">
              <img :src="product.mainImage" :alt="product.title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>

            <div class="p-4">
              <div class="mb-2">
                <h3 class="font-medium text-gray-800 line-clamp-1">{{ product.title }}</h3>
                <p class="text-xs text-gray-500 mt-1">品牌：{{ product.brandName }}</p>
              </div>

              <div class="flex items-center text-xs text-gray-400 mb-3">
                <span>{{ product.shopName }}</span>
                <span class="mx-2">|</span>
                <span>销量：{{ product.sales }}+</span>
              </div>
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-[#FF7043] font-bold text-lg">¥{{ product.currentPrice }}</span>
                  <span class="text-xs text-gray-400 ml-2">{{ product.warrantyTip }}</span>
                </div>
                <button
                  class="w-9 h-9 hover:bg-[#FF7043]/20 rounded-full flex items-center justify-center transition-colors">
                  <i class="fa fa-shopping-cart text-[#FF7043] text-[16px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="text-red-500 text-xl font-bold text-center mt-8">加载中...</div> -->
    </div>
  </div>
  <!-- 弹窗 -->
  <div v-if="popupVisible" class="popup-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="popup-content bg-white rounded-lg w-1/2 max-h-[80vh] overflow-auto p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">优惠规则</h2>
        <button class="text-gray-500 hover:text-gray-700" @click="popupVisible = false">
          <i class="fa fa-times text-xl"></i>
        </button>
      </div>
      <div class="popup-details">
        <p>没天不定时发放优惠卷，注意查收</p>
      </div>
    </div>
  </div>
  <!-- 返回顶部按钮 -->
  <img v-show="showBackToTop" @click="scrollToTop"
    class="fixed bottom-6 right-4 z-50 w-20 h-20 hover:scale-105 transition-transform" aria-label="回到顶部"
    src="/img/火箭.gif" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentCategory = ref('all')
const carouselItems = ref([
  { image: '/img/宠物1.jpg', title: '双11促销' },
  { image: '/img/宠物2.jpg', title: '新品上市' },
  { image: '/img/宠物3.jpg', title: '宠物健康' },
  { image: '/img/宠物4.jpg', title: '宠物用品' },
])

const currentSlide = ref(0)
const popupVisible = ref(false)
const carouselInterval = ref<number | null>(null)
const scrollY = ref(0)
const showBackToTop = ref(false)
const isScrolledPast50 = ref(false)

interface Products {
  id: string
  mainImage: string
  brandName: string
  shopName: string
  sales: number
  currentPrice: number
  originalPrice: number
  warrantyTip: string
  title: string
}
const products = ref<Products[]>([])
const page = ref(1)
const pageSize = ref(12) //每页有10挑
const isLoading = ref(false) //是否正在加载数据
const hasmore = ref(true) //是否还有更多数据
const getProducts = () => {
  if (!isLoading.value && hasmore.value) {
    isLoading.value = true
    axios
      .request({
        url: '/server/api/shop/product/list',
        method: 'POST',
        data: {
          page: 1,
          pageSize: 12,
        },
      })
      .then((response) => {
        console.log(response)
        console.log(response.data)
        const newProducts = response.data.data.list
        products.value = [...products.value, ...newProducts]
        if (newProducts.length < pageSize.value) {
          hasmore.value = false
          console.log('没有更多数据了')
        } else {
          page.value++
        }
      })
      .catch((error) => {
        console.error('获取商品数据失败:', error)
      })
      .finally(() => {
        isLoading.value = false
        console.log('加载完成，重置加载状态')
      })
  }
}
const productsDeatil = (id: string) => {
  router.push({
    path: `/product-detail/${id}`,
  })
}
const FlashSale = () => {
  router.push({
    path: '/flash-sale',
  })
}
const goCart = () => {
  router.push({
    path: '/pet-cart',
  })
}
const aiServer = () => {
  router.push({
    path: '/customer-service',
  })
}
// 滚动
watch(scrollY, (newval) => {
  showBackToTop.value = newval > 300
  isScrolledPast50.value = newval > 50
})
const handleScroll = () => {
  scrollY.value = window.scrollY
  const scrollTop = window.scrollY
  const clientHeight = document.documentElement.clientHeight
  const scrollHeight = document.documentElement.scrollHeight

  if (scrollTop + clientHeight >= scrollHeight) {
    console.log('触发加载更多')
    getProducts()
  }
}
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const handleCategoryChange = (newCategory: string) => {
  currentCategory.value = newCategory
}
// 轮播图
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length
}

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + carouselItems.value.length) % carouselItems.value.length
}

onMounted(() => {
  carouselInterval.value = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length
  }, 3000)
  window.addEventListener('scroll', handleScroll, { passive: true })
  getProducts()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  if (carouselInterval.value !== null) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.pet-shop-container {
  max-width: 1200px;
  margin: 0px auto;
  padding: 20px;
}

.container {
  max-width: 100%;
}

.top-section {
  margin-bottom: 20px;
}

.left-nav {
  min-width: 200px;
}

.tab-btn {
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.3s;
}

.category-btn {
  cursor: pointer;
}

.carousel {
  flex: 1;
}

.features {
  margin-top: 20px;
}

.feature-card {
  cursor: pointer;
}

.products {
  margin-top: 30px;
}

.product-tabs button {
  cursor: pointer;
}

.product-card {
  cursor: pointer;
}

.popup-overlay {
  animation: fadeIn 0.3s;
}

.popup-content {
  animation: slideUp 0.3s;
}

.coupon-shadow {
  border-top: 3px solid #ffb83f;
}

.coupon-edge {
  position: relative;
}

.coupon-edge::before,
.coupon-edge::after {
  content: '';
  position: absolute;
  top: 0;
  width: 16px;
  height: 100%;
  pointer-events: none;
  background-size: 16px 24px;
  background-repeat: repeat-y;
}

.coupon-edge::before {
  left: -8px;
  background-image: radial-gradient(circle at 8px 12px, transparent 6px, #ff7043 7px);
}

.coupon-edge::after {
  right: -8px;
  background-image: radial-gradient(circle at 0 12px, transparent 6px, #ff7043 7px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
