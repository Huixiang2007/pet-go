<template>
  <NavBar />
  <InfiniteScroll :is-loading="isLoading" :has-more="hasmore" @load-more="getProducts">
    <header
      class="bg-white shadow-md top-[85px] left-0 right-0 z-100"
      :class="{ shadow: isScrolledPast50 }"
    >
      <ShopCategoryNav v-model="currentCategory" @categoryChange="handleCategoryChange" />
    </header>

    <div class="min-h-screen bg-amber-50 pt-1">
      <div class="absolute top-40 right-0 w-64 h-64 bg-yellow-200/30 rounded-full"></div>
      <div
        class="absolute top-[1100px] left-0 w-64 h-64 bg-yellow-200/30 rounded-full"
        id="pointBottom"
      ></div>

      <div class="pet-shop-container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        <div
          class="carousel bg-white rounded-3xl overflow-hidden shadow-lg mb-8 transform hover:shadow-xl transition-all duration-500"
        >
          <div class="relative h-80 sm:h-96">
            <button
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-full flex items-center justify-center transition-all z-10 shadow-md hover:scale-105"
              @click="prevSlide"
            >
              <i class="fa fa-chevron-left text-lg"></i>
            </button>

            <img
              v-for="(item, index) in carouselItems"
              :key="index"
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover transition-all duration-700 ease-in-out"
              :class="{
                'opacity-100': currentSlide === index,
                'opacity-0 absolute inset-0': currentSlide !== index,
              }"
            />

            <button
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-full flex items-center justify-center transition-all z-10 shadow-md hover:scale-105"
              @click="nextSlide"
            >
              <i class="fa fa-chevron-right text-lg"></i>
            </button>

            <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
              <button
                v-for="(item, index) in carouselItems"
                :key="index"
                class="w-3 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                :class="{
                  'bg-amber-500 w-8': currentSlide === index,
                  'bg-white/70 hover:bg-amber-300': currentSlide !== index,
                }"
                @click="currentSlide = index"
              ></button>
            </div>

            <!-- 轮播角标：黄色系宠物爪印装饰 -->
            <div
              class="absolute top-4 left-4 bg-amber-100/90 rounded-full px-3 py-1 text-sm font-medium text-amber-700 shadow-sm flex items-center"
            >
              <i class="fa fa-paw mr-1"></i>宠物资讯
            </div>
          </div>
        </div>

        <div class="features grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-8">
          <div
            @click="FlashSale"
            class="feature-card bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-amber-200/50"
          >
            <img src="/img/秒杀.gif" alt="秒杀" class="h-[120px] w-[120px] absolute top-[-20px]" />
            <div
              class="w-20 h-20 bg-amber-200/50 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
            >
              <i
                class="fa fa-fire text-3xl text-amber-600 transition-transform duration-500 hover:rotate-12"
              ></i>
              <div class="absolute bottom-1 right-1 w-4 h-4 bg-amber-400 rounded-full"></div>
            </div>
            <h3 class="font-medium text-amber-800 mt-2 text-lg">爆款秒杀</h3>
            <p class="text-sm text-amber-600 mt-1">万人关注的爆款商品秒杀</p>
          </div>

          <div
            @click="aiServer"
            class="feature-card bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-amber-200/50"
          >
            <div
              class="w-20 h-20 bg-amber-200/50 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
            >
              <i
                class="fa fa-headphones text-3xl text-amber-600 transition-transform duration-500 hover:rotate-12"
              ></i>
              <div class="absolute bottom-1 right-1 w-4 h-4 bg-amber-400 rounded-full"></div>
            </div>
            <h3 class="font-medium text-amber-800 mt-2 text-lg">专业客服</h3>
            <p class="text-sm text-amber-600 mt-1">专业客服，科学养宠贴心陪伴</p>
          </div>

          <div
            @click="goCart"
            class="feature-card bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-amber-200/50"
          >
            <div
              class="w-20 h-20 bg-amber-200/50 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
            >
              <i
                class="fa fa-truck text-3xl text-amber-600 transition-transform duration-500 hover:rotate-12"
              ></i>
              <div class="absolute bottom-1 right-1 w-4 h-4 bg-amber-400 rounded-full"></div>
            </div>
            <h3 class="font-medium text-amber-800 mt-2 text-lg">购物车</h3>
            <p class="text-sm text-amber-600 mt-1">你想要的，都在这里</p>
          </div>
        </div>

        <div
          class="bg-gradient-to-r from-amber-100 to-yellow-200 rounded-3xl p-6 shadow-lg mb-10 mt-3 border border-amber-200/30"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <i class="fa fa-ticket text-amber-600 text-2xl mr-3"></i>
              <h2 class="text-xl font-bold text-amber-800">优惠券中心</h2>
            </div>
            <a href="/coupon" class="text-amber-600 text-sm hover:underline flex items-center">
              查看全部 <i class="fa fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" v-if="shopCoupons.length > 0">
            <div
              v-for="coupon in shopCoupons"
              :key="coupon.id"
              class="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden"
            >
              <div class="mb-3">
                <h4 class="text-base font-semibold text-gray-800 mb-1">{{ coupon.couponName }}</h4>
                <p class="text-xs text-gray-400 mb-1">
                  适用：{{ coupon.usedToShopName || '全平台' }} /
                  {{ coupon.usedToProductTypeName || '全品类' }}
                </p>
                <p class="text-xs text-gray-400">
                  已领：{{ coupon.receiveCount || 0 }} / 上限：{{ coupon.perLimit || 0 }}
                </p>
              </div>

              <button
                :disabled="!canReceive(coupon)"
                :class="[
                  canReceive(coupon)
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500'
                    : 'bg-gray-300 cursor-not-allowed',
                ]"
                class="w-full text-white text-sm py-2 rounded-lg transition-all"
                @click="receiveCouponHandler(coupon.id)"
              >
                {{ getReceiveButtonText(coupon) }}
              </button>
            </div>
          </div>

          <div v-else class="no-coupons">暂无优惠券</div>
        </div>

        <div
          class="flex flex-col md:flex-row items-center justify-between py-4 px-6 bg-white/80 rounded-2xl mt-6 border border-amber-200/20 backdrop-blur-sm"
        >
          <div class="flex items-center mb-3 md:mb-0">
            <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-paw text-amber-700"></i>
            </div>
            <div class="text-amber-700 text-sm">不错过每一次优惠</div>
          </div>
          <div class="flex gap-3">
            <button
              class="bg-amber-100 text-amber-700 text-sm px-4 py-2 rounded-full transition-all duration-300 hover:bg-amber-200 hover:scale-105"
              @click="popupVisible = true"
            >
              查看规则
            </button>
          </div>
        </div>
        <div class="products mt-8">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
          >
            <h2 class="text-xl font-bold text-amber-800 flex items-center">
              <i class="fa fa-star text-amber-500 mr-2"></i>热门商品
            </h2>

            <div class="flex flex-wrap gap-3 text-sm">
              <label class="cursor-pointer">
                <input
                  v-model="includeHot"
                  type="checkbox"
                  class="hidden"
                  @change="onFilterChange"
                />
                <span
                  class="inline-block px-4 py-1.5 rounded-full border transition-all duration-200 border-amber-300 text-amber-700 hover:bg-amber-50 checked:bg-amber-500 checked:text-white checked:border-amber-500"
                  :class="includeHot ? 'bg-amber-500 text-white border-amber-500' : 'bg-white'"
                >
                  热销商品
                </span>
              </label>

              <label class="cursor-pointer">
                <input
                  v-model="includeNew"
                  type="checkbox"
                  class="hidden"
                  @change="onFilterChange"
                />
                <span
                  class="inline-block px-4 py-1.5 rounded-full border transition-all duration-200 border-amber-300 text-amber-700 hover:bg-amber-50"
                  :class="includeNew ? 'bg-amber-500 text-white border-amber-500' : 'bg-white'"
                >
                  新品上市
                </span>
              </label>

              <label class="cursor-pointer">
                <input
                  v-model="includePersonalized"
                  type="checkbox"
                  class="hidden"
                  @change="onFilterChange"
                />
                <span
                  class="inline-block px-4 py-1.5 rounded-full border transition-all duration-200 border-amber-300 text-amber-700 hover:bg-amber-50"
                  :class="
                    includePersonalized ? 'bg-amber-500 text-white border-amber-500' : 'bg-white'
                  "
                >
                  个性化推荐
                </span>
              </label>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100/50"
              @click="productsDeatil(product.id)"
            >
              <div class="w-full h-64 bg-amber-50 overflow-hidden rounded-t-2xl">
                <img
                  :src="product.mainImage"
                  :alt="product.title"
                  class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div
                  class="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  热销
                </div>
              </div>

              <div class="p-5">
                <div class="mb-3">
                  <h3 class="font-medium text-gray-800 line-clamp-1 text-base">
                    {{ product.title }}
                  </h3>
                  <p class="text-xs text-amber-600 mt-1">品牌：{{ product.brandName }}</p>
                </div>

                <div class="flex items-center text-xs text-gray-500 mb-4">
                  <span>{{ product.shopName }}</span>
                  <span class="mx-2">|</span>
                  <span>销量：{{ product.sales > 9000 ? '9000+' : product.sales }} 件</span>
                </div>

                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-amber-600 font-bold text-lg"
                      >¥{{ product.currentPrice }}</span
                    >
                    <span class="text-xs text-gray-400 ml-2">{{ product.warrantyTip }}</span>
                  </div>
                  <button
                    class="w-10 h-10 bg-amber-50 hover:bg-amber-100 rounded-full flex items-center justify-center transition-colors shadow-sm hover:scale-110"
                  >
                    <i class="fa fa-shopping-cart text-amber-600 text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看优惠券规则弹窗 -->
    <div
      v-if="popupVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
    >
      <div
        class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl transform transition-all duration-300 scale-100"
      >
        <!-- 弹窗头部 -->
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 class="text-xl font-bold text-amber-800 flex items-center">
            <i class="fas fa-ticket-alt mr-2 text-amber-600"></i>
            优惠券使用规则
          </h3>
          <button
            @click="popupVisible = false"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            title="关闭"
          >
            <i class="fas fa-times text-gray-500"></i>
          </button>
        </div>

        <!-- 规则内容 -->
        <div class="space-y-4 mb-6">
          <div class="flex items-start">
            <div
              class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm mr-3 flex-shrink-0 mt-0.5"
            >
              1
            </div>
            <p class="text-gray-700">优惠券领取后有效期为7天，请在有效期内使用</p>
          </div>
          <div class="flex items-start">
            <div
              class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm mr-3 flex-shrink-0 mt-0.5"
            >
              2
            </div>
            <p class="text-gray-700">每个用户每种优惠券最多领取3张</p>
          </div>
          <div class="flex items-start">
            <div
              class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm mr-3 flex-shrink-0 mt-0.5"
            >
              3
            </div>
            <p class="text-gray-700">优惠券不可叠加使用，每次订单只能使用一张</p>
          </div>
          <div class="flex items-start">
            <div
              class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm mr-3 flex-shrink-0 mt-0.5"
            >
              4
            </div>
            <p class="text-gray-700">优惠券仅适用于指定店铺和商品类别</p>
          </div>
          <div class="flex items-start">
            <div
              class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm mr-3 flex-shrink-0 mt-0.5"
            >
              5
            </div>
            <p class="text-gray-700">优惠券过期后自动失效，不予补发</p>
          </div>
          <div class="flex items-start">
            <div
              class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm mr-3 flex-shrink-0 mt-0.5"
            >
              6
            </div>
            <p class="text-gray-700">如有疑问，请联系客服</p>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="flex justify-center">
          <button
            @click="popupVisible = false"
            class="px-6 py-2.5 bg-amber-500 text-white rounded-lg transition-all hover:bg-amber-600 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  </InfiniteScroll>
</template>

<script setup lang="ts">
import InfiniteScroll from './components/infiniteScroll.vue'
import { receiveCoupon, getReceiveCouponList } from '../../../api/pet-shop/coupos'
import { ElMessage } from 'element-plus'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getRecommend } from '../../../api/pet-shop/recommend'
import { useRouter } from 'vue-router'
console.log('pet-shop-view')
const router = useRouter()
const includeHot = ref(true)
const includeNew = ref(true)
const includePersonalized = ref(true)

// 筛选切换重置列表
const onFilterChange = () => {
  page.value = 1
  hasmore.value = true
  products.value = []
  getProducts()
}

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

const shopCoupons = ref([])

const canReceive = (coupon: any) => {
  const limitNotReached = (coupon.receiveCount || 0) < (coupon.perLimit || 0)
  return limitNotReached
}

// 按钮
const getReceiveButtonText = (coupon: any) => {
  if ((coupon.receiveCount || 0) >= (coupon.perLimit || 0)) return '已达领取上限'
  return '立即领取'
}

const getProducts = async () => {
  if (!isLoading.value && hasmore.value) {
    isLoading.value = true
    try {
      const params = {
        pageNum: page.value,
        pageSize: pageSize.value,
        current: page.value,
        searchCount: true,
        includeHot: includeHot.value,
        includeNew: includeNew.value,
        includePersonalized: includePersonalized.value,
        sortItemList: [{ isAsc: false, column: '223r2' }],
      }
      const res = await getRecommend(params)
      const newProducts = res.data?.list || []

      if (page.value === 1) {
        products.value = newProducts
      } else {
        products.value = [...products.value, ...newProducts]
      }

      if (newProducts.length < pageSize.value) {
        hasmore.value = false
      } else {
        page.value++
      }
    } catch (error) {
      console.error('获取商品数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }
}
//优惠卷
const loadShopCoupons = async () => {
  try {
    const params = {
      pageNum: page.value,
      pageSize: 3,
    }
    const res = await getReceiveCouponList(params)
    console.log('加载店铺优惠券成功:', res)
    if (res.ok) {
      shopCoupons.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载店铺优惠券失败:', error)
  }
}

const receiveCouponHandler = async (couponId) => {
  try {
    const res = await receiveCoupon(couponId)
    if (res.ok) {
      ElMessage.success('优惠券领取成功！')
    }
  } catch (error) {
    console.error('领取优惠券失败:', error)
    ElMessage.error('领取优惠券失败')
  }
}

onMounted(() => {
  loadShopCoupons()
})

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

const handleCategoryChange = (newCategory: string) => {
  currentCategory.value = newCategory
  page.value = 1
  hasmore.value = true
  products.value = []
  getProducts()
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

  getProducts()
})

onBeforeUnmount(() => {
  if (carouselInterval.value !== null) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
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
.z-100 {
  z-index: 100;
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
