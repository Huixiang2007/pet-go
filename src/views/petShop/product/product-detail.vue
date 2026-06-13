<template>
  <NavBar />

  <!-- 右上角购物车图标（抛物线动画专用） -->
  <div
    ref="cartIcon"
    class="fixed top-6 right-6 z-50 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg"
  >
    <i class="fa fa-shopping-cart text-xl"></i>
    <span
      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center"
    >
      {{ cartCount }}
    </span>
  </div>

  <main class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
    <div
      class="max-w-7xl mx-auto bg-white/85 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-amber-100/30"
    >
      <div class="product-grid grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 md:p-8">
        <div class="lg:col-span-2">
          <div class="flex gap-4 mt-[40px]">
            <!-- 缩略图列表 -->
            <div class="hidden md:flex flex-col gap-3 w-20">
              <div
                v-for="(item, i) in mediaList"
                :key="i"
                class="thumb cursor-pointer rounded-lg overflow-hidden relative shadow-sm transition-all hover:scale-105"
                :class="
                  activeMediaIndex === i
                    ? 'ring-2 ring-orange-400 shadow-md'
                    : 'ring-1 ring-gray-200'
                "
                @click="switchMedia(i)"
              >
                <img :src="item.thumbSrc" alt="缩略图" class="w-full h-full object-cover" />
                <div
                  v-if="item.type === 'video'"
                  class="absolute inset-0 bg-black/30 flex items-center justify-center"
                >
                  <i class="fa fa-play text-white text-sm"></i>
                </div>
              </div>
            </div>

            <div class="flex-1 rounded-xl overflow-hidden bg-gray-100 relative shadow-md">
              <img
                ref="mainImage"
                :src="currentMedia.src"
                alt="主图"
                class="w-full h-[520px] object-cover transition-opacity"
                :style="{ display: currentMedia.type === 'image' ? 'block' : 'none' }"
              />

              <video
                ref="videoPlayer"
                class="w-full h-[520px] object-cover"
                :style="{ display: currentMedia.type === 'video' ? 'block' : 'none' }"
                controls
                @ended="onVideoEnded"
              >
                <source :src="currentMedia.src" :type="`video/${currentMedia.format}`" />
                您的浏览器不支持视频播放
              </video>

              <button
                @click="playVideoFromImage"
                class="absolute bottom-6 left-6 bg-black/40 text-white px-3 py-2 rounded-full flex items-center gap-2 hover:bg-black/60 transition-colors"
                :style="{ display: currentMedia.type === 'image' && hasVideo ? 'flex' : 'none' }"
              >
                <i class="fa fa-play-circle"></i>
                <span class="text-sm">观看产品演示视频</span>
              </button>
            </div>
          </div>

          <!-- 详情 -->
          <div class="border-t border-gray-200 mt-6">
            <div class="flex gap-1 px-2 py-3 overflow-x-auto bg-gray-50/50 rounded-xl">
              <button
                class="px-6 py-3 font-medium rounded-lg transition-all"
                :class="{ 'text-white bg-orange-400 shadow-sm': activeTab === 'detail' }"
                @click="activeTab = 'detail'"
              >
                商品详情
              </button>
              <button
                class="px-6 py-3 text-gray-500 rounded-lg transition-all"
                :class="{ 'text-white bg-orange-400 shadow-sm': activeTab === 'spec' }"
                @click="activeTab = 'spec'"
              >
                规格参数
              </button>
              <button
                class="px-6 py-3 text-gray-500 rounded-lg transition-all"
                :class="{ 'text-white bg-orange-400 shadow-sm': activeTab === 'allReview' }"
                @click="activeTab = 'allReview'"
              >
                全部评价
              </button>
              <button
                class="px-6 py-3 text-gray-500 rounded-lg transition-all"
                :class="{ 'text-white bg-orange-400 shadow-sm': activeTab === 'question' }"
                @click="activeTab = 'question'"
              >
                问大家
              </button>
            </div>

            <!-- 商品详情 -->
            <div v-if="activeTab === 'detail'" class="p-6 md:p-8">
              <div
                v-if="!product.detail || product.detail.trim() === ''"
                class="text-center py-10 bg-amber-50 rounded-xl mb-6 border border-amber-100"
              >
                <div class="text-amber-500 text-4xl mb-3">🐾</div>
                <p class="text-amber-700 font-medium mb-2">哎呀！商家偷懒啦～</p>
                <p class="text-gray-500 text-sm">居然忘了放商品详情，不过放心，好物不会差</p>
              </div>
              <p v-else class="text-sm text-gray-600 mb-6 leading-relaxed">{{ product.detail }}</p>

              <div class="mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-2">
                  {{ product.name }}
                </h2>
                <p class="text-sm text-gray-500">{{ product.subTitle || '' }}</p>
              </div>
            </div>

            <!-- 规格参数 -->
            <div v-if="activeTab === 'spec'" class="p-6 md:p-8">
              <h2 class="text-lg font-semibold mb-4 text-gray-800">规格参数</h2>
              <table class="spec-table w-full border-collapse rounded-xl overflow-hidden shadow-sm">
                <tr class="bg-amber-50">
                  <th class="border border-gray-200 p-3 text-left text-amber-800">项目</th>
                  <th class="border border-gray-200 p-3 text-left text-amber-800">参数</th>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3 bg-white">商品名称</td>
                  <td class="border border-gray-200 p-3 bg-white">{{ product.title || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3 bg-white">型号</td>
                  <td class="border border-gray-200 p-3 bg-white">
                    {{ product.productSn || '-' }}
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3 bg-white">品牌</td>
                  <td class="border border-gray-200 p-3 bg-white">{{ product.shopName || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3 bg-white">价格</td>
                  <td class="border border-gray-200 p-3 bg-white">
                    ¥{{ selectedSku.price || product.currentPrice || 0 }}
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3 bg-white">重量</td>
                  <td class="border border-gray-200 p-3 bg-white">
                    {{ product.productWeight || 0 }}kg
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3 bg-white">质保</td>
                  <td class="border border-gray-200 p-3 bg-white">
                    {{ product.warrantyTip || '-' }}
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3 bg-white">销量</td>
                  <td class="border border-gray-200 p-3 bg-white">
                    {{ product.sales > 9000 ? '9000+' : product.sales }} 件
                  </td>
                </tr>
              </table>
            </div>

            <!-- 用户评价 -->
            <div v-if="activeTab === 'allReview'" class="p-6 md:p-8">
              <CommentList
                :shopId="Number(product.shopId)"
                :activeTab="activeTab"
                :productId="product.id"
              />
            </div>
            <!-- 问大家 -->
            <div v-if="activeTab === 'question'" class="p-6 md:p-8">
              <QuestionUs
                :shopId="Number(product.shopId)"
                :activeTab="activeTab"
                :productId="product.id"
              />
            </div>
          </div>
        </div>
        <!-- 右侧信息 -->
        <div class="lg:block lg:col-span-1 mt-10">
          <div class="lg:sticky lg:top-8">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-amber-100/30">
              <div class="flex items-center justify-between mb-2">
                <div
                  @click="goStore"
                  class="text-sm text-gray-500 cursor-pointer hover:text-orange-600 flex items-center gap-1"
                >
                  <i class="fa fa-store text-amber-500"></i>
                  {{ product.shopName }}
                </div>
              </div>

              <h1 class="text-2xl font-bold text-gray-800 mb-3">{{ product.title }}</h1>

              <div class="flex items-center gap-3 mb-4">
                <div class="flex items-center text-yellow-400">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star-half-alt"></i>
                </div>
                <div class="text-sm text-gray-500">
                  {{ product.productScore || 0 }} · {{ product.reviewCount || 0 }}评价
                </div>
              </div>

              <!-- 价格卡片 -->
              <div
                class="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-xl mb-5 border border-orange-100"
              >
                <div class="text-sm text-gray-500 mb-1">活动专享价</div>
                <div class="text-3xl font-bold text-orange-500 mb-1">
                  ¥{{ selectedSku.price || product.currentPrice || 0 }}
                </div>
                <div class="text-sm text-gray-400 line-through mb-1">
                  ¥{{ product.marketPrice || 0 }}
                </div>
                <div
                  class="inline-block text-xs py-1 px-2 rounded-full bg-orange-100 text-orange-600 font-medium"
                >
                  直降{{ (product.marketPrice - product.currentPrice || 0).toFixed(1) }}元
                </div>
              </div>

              <!-- 优惠券模块 -->
              <div class="mb-5">
                <p class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <i class="fa fa-ticket text-orange-500"></i> 可用优惠券
                </p>
                <div v-if="product.couponsList && product.couponsList.length > 0" class="space-y-2">
                  <div
                    v-for="(coupon, idx) in product.couponsList"
                    :key="idx"
                    class="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-orange-200 shadow-sm"
                  >
                    <div class="flex flex-col">
                      <span class="text-orange-500 font-bold text-lg">¥{{ coupon.discount }}</span>
                      <span class="text-xs text-gray-500">满{{ coupon.minAmount }}可用</span>
                    </div>
                    <button
                      class="text-xs text-white bg-orange-500 px-2 py-1.5 rounded-full hover:bg-orange-600 transition-colors"
                      @click="handleClaimCoupon(coupon.couponId)"
                    >
                      立即领取
                    </button>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500 py-2">🎫 暂无可用优惠券</p>
              </div>

              <!-- 规格选择 -->
              <div v-if="specGroups.length > 0" class="mb-5">
                <h3 class="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <i class="fa fa-paw text-amber-500"></i>选择规格
                </h3>
                <div v-for="(group, groupIndex) in specGroups" :key="groupIndex" class="mb-4">
                  <div class="text-xs text-gray-500 mb-2">{{ group.name }}</div>
                  <div class="flex gap-2 flex-wrap">
                    <button
                      v-for="(option, optIndex) in group.options"
                      :key="optIndex"
                      @click="selectSkuOption(group.name, option)"
                      :class="{
                        'bg-orange-500 text-white shadow-sm':
                          selectedOptions[group.name] === option,
                        'bg-white border border-gray-200 text-gray-600 hover:border-orange-300':
                          selectedOptions[group.name] !== option,
                      }"
                      class="px-4 py-2 rounded-full text-sm transition-all"
                    >
                      {{ option }}
                    </button>
                  </div>
                </div>

                <div
                  v-if="Object.keys(selectedOptions).length > 0"
                  class="mb-4 p-3 bg-gray-50 rounded-xl"
                >
                  <h3 class="text-xs text-gray-500 mb-1">已选规格</h3>
                  <div class="text-sm text-gray-600 flex flex-wrap gap-2">
                    <span v-for="(value, key) in selectedOptions" :key="key" class="mr-1">
                      {{ key }}: {{ value }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 数量 -->
              <div class="mb-6">
                <h3 class="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <i class="fa fa-calculator text-amber-500"></i>购买数量
                </h3>
                <div
                  class="flex items-center w-32 border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    @click="decrease"
                    class="w-10 h-10 text-gray-500 hover:text-orange-500 bg-white"
                    :disabled="qty <= 1"
                  >
                    <i class="fa fa-minus"></i>
                  </button>
                  <input
                    id="qty"
                    type="number"
                    v-model.number="qty"
                    min="1"
                    class="w-12 h-10 text-center border-x border-gray-200 focus:outline-none"
                    :max="selectedSku.stock"
                  />
                  <button
                    @click="increase"
                    class="w-10 h-10 text-gray-500 hover:text-orange-500 bg-white"
                    :disabled="qty >= selectedSku.stock"
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>

              <!-- 按钮 -->
              <div class="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  id="addCart"
                  ref="addCartBtn"
                  class="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl font-medium hover:shadow-md transition-all flex items-center justify-center"
                  :disabled="!isSkuSelected || selectedSku.stock <= 0"
                  @click="addToCartWithAnimation"
                >
                  <i class="fa fa-shopping-cart mr-2"></i> 加入购物车
                </button>
                <router-link
                  :to="`/order?id=${id}&sku=${selectedSkuInfo?.skuId ?? ''}&qty=${qty}&type=buyNow`"
                  id="buyNow"
                  class="flex-1 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl font-medium hover:shadow-md transition-all flex items-center justify-center"
                  :disabled="!isSkuSelected || selectedSku.stock <= 0"
                >
                  <i class="fa fa-bolt mr-2"></i> 立即购买
                </router-link>
              </div>

              <div class="text-sm text-gray-500 pt-4 flex flex-wrap gap-3">
                <div class="flex items-center gap-1">
                  <i class="fa fa-check-circle text-orange-500"></i>
                  {{ product.warrantyTip || '正品保障' }}
                </div>
                <div class="flex items-center gap-1">
                  <i class="fa fa-shield-alt text-orange-500"></i>
                  放心购
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!--                个性化推荐（猜你喜欢）            -->
    <!-- ============================================== -->
    <div class="max-w-7xl mx-auto px-4 mt-16 mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 relative">
        <i class="fa fa-heart text-orange-400"></i>
        猜你喜欢
        <span class="absolute left-0 bottom-0 w-16 h-1 bg-orange-400 rounded-full"></span>
      </h2>

      <!-- 加载中 -->
      <div
        v-if="loadingRec && recProducts.length === 0"
        class="bg-white rounded-2xl p-10 text-center shadow-sm border border-amber-100/30"
      >
        <i class="fa fa-spinner fa-spin text-orange-400 text-2xl"></i>
        <p class="mt-2 text-gray-500">正在为你推荐好物...</p>
      </div>

      <!-- 无数据 -->
      <div
        v-else-if="recProducts.length === 0"
        class="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm border border-amber-100/30"
      >
        <div class="text-amber-400 text-4xl mb-3">🐾</div>
        <p>暂无推荐商品，换个商品看看吧～</p>
      </div>

      <!-- 商品列表（无限滚动） -->
      <div
        v-else
        v-infinite-scroll="loadMoreRec"
        :infinite-scroll-disabled="!recHasMore || loadingRec"
        infinite-scroll-distance="300"
        :infinite-scroll-immediate="false"
        class="w-full"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(item, index) in recProducts"
            :key="`rec_${item.id || index}`"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100/50 flex flex-col h-full"
          >
            <!-- 商品图片（固定比例，防抖动） -->
            <div class="relative w-full pt-[75%] bg-amber-50 overflow-hidden rounded-t-2xl">
              <img
                :src="item.imgUrl"
                :alt="item.name"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                style="aspect-ratio: 4/3"
              />
              <div class="absolute top-2 right-2">
                <div
                  class="bg-orange-100 text-xs text-orange-700 px-2 py-1 rounded-full font-medium"
                >
                  🐾 热销 {{ item.sales || 0 }} 件
                </div>
              </div>
            </div>

            <!-- 商品全部信息 -->
            <div class="p-4 flex-1 flex flex-col gap-1.5">
              <h3 class="font-semibold text-gray-800 text-base line-clamp-2 leading-tight">
                {{ item.name }}
              </h3>

              <p class="text-xs text-gray-500 line-clamp-2 min-h-[18px]">
                {{ item.subTitle || '暂无商品描述' }}
              </p>

              <!-- 店铺、品牌信息 -->
              <div class="text-xs text-gray-500 space-y-0.5">
                <p v-if="item.shopName" class="truncate">🏪 店铺：{{ item.shopName }}</p>
                <p v-if="item.brandName" class="truncate">🏷️ 品牌：{{ item.brandName }}</p>
              </div>

              <!-- 质保标签 -->
              <p v-if="item.warrantyTip" class="text-xs text-green-600 font-medium mt-1">
                ✅ {{ item.warrantyTip }}
              </p>

              <!-- 价格 -->
              <div class="mt-1.5">
                <p class="text-orange-500 font-bold text-lg">¥{{ item.price.toFixed(2) }}</p>
              </div>

              <!-- 查看详情按钮（底部固定） -->
              <router-link
                :to="`/product-detail/${item.id}`"
                class="mt-auto block w-full bg-orange-50 text-orange-700 py-2 rounded-xl text-center text-sm font-medium hover:bg-orange-100 transition-colors"
              >
                查看详情
              </router-link>
            </div>
          </div>
        </div>

        <!-- 加载提示 -->
        <div class="col-span-full text-center py-6 text-sm text-gray-500">
          <span v-if="loadingRec">加载更多中...</span>
          <span v-else-if="!recHasMore">— 已加载全部推荐商品 —</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CommentList from './components/CommentList.vue'
import QuestionUs from './components/QuestionUs.vue'
import { addCartApi, getProductDetail } from '../../../api/pet-shop/product'
import { receiveCoupon } from '../../../api/pet-shop/coupos'
import { getCartRecommend } from '../../../api/pet-shop/recommend'
import type { ProductDetail, SkuInfo } from '../../../types/shop'

const router = useRouter()
const shopId = ref('')

interface MediaItem {
  type: 'image' | 'video'
  src: string
  thumbSrc: string
  format: string
}

interface SpecGroup {
  name: string
  options: string[]
}

interface SelectedSku {
  price: number
  stock: number
}

const activeTab = ref('detail')
const route = useRoute()
const id = route.params.id as string
console.log('产品ID:', id)

const product = ref<ProductDetail>({
  id: 0,
  brandId: 0,
  shopName: '',
  shopOwnerId: 0,

  name: '',
  productScore: 0,
  brandName: '',

  reviewCount: 0,
  currentPrice: 0,
  marketPrice: 0,

  detail: '',
  images: '',
  mainImage: '',

  videoUrl: '',
  shopId: '',
  productSn: '',

  productWeight: 0,
  warrantyTip: '',
  skuList: [],
  subTitle: '',

  sales: 0,
  couponsList: [],
  shopType: '',
  title: '',
  typeId: 0,
  imageUrls: [],
})

// 媒体
const mediaList = ref<MediaItem[]>([])
const activeMediaIndex = ref(0)
const mainImage = ref<HTMLImageElement>()
const videoPlayer = ref<HTMLVideoElement>()

const selectedOptions = ref<Record<string, string>>({})
const selectedSkuInfo = ref<SkuInfo | null>(null)
const qty = ref<number>(1)

// 购物车抛物线动画相关
const cartCount = ref(0)
const addCartBtn = ref<HTMLElement | null>(null)
const cartIcon = ref<HTMLElement | null>(null)
const ball = ref<HTMLElement | null>(null)

// 计算当前媒体
const currentMedia = computed<MediaItem>(() => {
  return (
    mediaList.value[activeMediaIndex.value] || {
      type: 'image',
      src: product.value.mainImage || '',
      thumbSrc: product.value.mainImage || '',
      format: 'jpg',
    }
  )
})

// 是否有视频
const hasVideo = computed(() => {
  return mediaList.value.some((item) => item.type === 'video')
})

// 计算规格组
const specGroups = computed<SpecGroup[]>(() => {
  const groups: SpecGroup[] = []
  const specMap = new Map<string, Set<string>>()

  if (product.value.skuList?.length) {
    product.value.skuList.forEach((sku: SkuInfo) => {
      if (!sku.specJson) return
      try {
        const specObj = JSON.parse(sku.specJson)
        Object.entries(specObj).forEach(([name, value]) => {
          if (name && value) {
            if (!specMap.has(name)) {
              specMap.set(name, new Set())
            }
            specMap.get(name)?.add(value as string)
          }
        })
      } catch (e) {
        console.error('解析 specJson 失败:', e)
        if (sku.specText) {
          const parts = sku.specText.split(' - ').map((s) => s.trim())
          if (parts.length === 2) {
            const [name, value] = parts
            if (!specMap.has(name)) {
              specMap.set(name, new Set())
            }
            specMap.get(name)?.add(value)
          }
        }
      }
    })
  }

  specMap.forEach((options, name) => {
    groups.push({ name, options: Array.from(options) })
  })
  return groups
})

// 计算选中的SKU信息
const selectedSku = computed<SelectedSku>(() => {
  if (selectedSkuInfo.value) {
    return {
      price: selectedSkuInfo.value.price || product.value.currentPrice || 0,
      stock: selectedSkuInfo.value.stock || 999,
    }
  }
  return {
    price: product.value.currentPrice || 0,
    stock: 999,
  }
})

// 判断是否选完规格
const isSkuSelected = computed(() => {
  return (
    specGroups.value.length === 0 ||
    Object.keys(selectedOptions.value).length === specGroups.value.length
  )
})

// 获取产品详情
const productDetail = async () => {
  try {
    console.log('获取产品详情')
    const res = await getProductDetail(id)
    console.log('接口返回数据:', res)
    const productNew = res
    product.value = productNew
    shopId.value = productNew.shopId

    const imageList = productNew.images?.split(',') || []
    const mainImage = productNew.mainImage || imageList[0] || ''
    mediaList.value = []

    if (productNew.videoUrl && productNew.videoUrl !== '暂无商品视频url') {
      mediaList.value.push({
        type: 'video',
        src: productNew.videoUrl,
        thumbSrc: mainImage,
        format: 'mp4',
      })
      activeMediaIndex.value = 0
    }

    mediaList.value.push({
      type: 'image',
      src: mainImage,
      thumbSrc: mainImage,
      format: 'jpg',
    })
    imageList.slice(1).forEach((img: string) => {
      mediaList.value.push({
        type: 'image',
        src: img,
        thumbSrc: img,
        format: 'jpg',
      })
    })

    if (productNew.skuList?.length) {
      selectedSkuInfo.value = productNew.skuList[0]
      if (selectedSkuInfo.value?.specJson) {
        try {
          const specObj = JSON.parse(selectedSkuInfo.value.specJson)
          Object.assign(selectedOptions.value, specObj)
        } catch {
          if (selectedSkuInfo.value.specText) {
            const parts = selectedSkuInfo.value.specText.split(' - ').map((s) => s.trim())
            if (parts.length === 2) {
              const [name, value] = parts
              selectedOptions.value[name] = value
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('产品详情请求失败:', err)
    ElMessage.error('获取商品信息失败')
  }
}

const goStore = () => {
  router.push({
    path: '/Store',
    query: { id: shopId.value },
  })
}

function selectSkuOption(specName: string, option: string) {
  selectedOptions.value[specName] = option
  const matchSku = findMatchingSku()
  if (matchSku) {
    selectedSkuInfo.value = matchSku
  }
}

function findMatchingSku(): SkuInfo | null {
  if (!product.value.skuList?.length) return null
  return (
    product.value.skuList.find((sku: SkuInfo) => {
      if (!sku.specJson) return false
      try {
        const specObj = JSON.parse(sku.specJson)
        return Object.entries(selectedOptions.value).every(([name, value]) => {
          return specObj[name] === value
        })
      } catch {
        if (sku.specText) {
          const parts = sku.specText.split(' - ').map((s) => s.trim())
          if (parts.length === 2) {
            const [name, value] = parts
            return Object.entries(selectedOptions.value).every(
              ([n, v]) => n === name && v === value,
            )
          }
        }
        return false
      }
    }) || null
  )
}

function switchMedia(index: number) {
  activeMediaIndex.value = index
  videoPlayer.value?.pause()
}
function playVideoFromImage() {
  const videoIndex = mediaList.value.findIndex((item) => item.type === 'video')
  if (videoIndex !== -1) {
    activeMediaIndex.value = videoIndex
    setTimeout(() => videoPlayer.value?.play(), 100)
  }
}
function onVideoEnded() {
  const firstImageIndex = mediaList.value.findIndex((item) => item.type === 'image')
  if (firstImageIndex !== -1) {
    activeMediaIndex.value = firstImageIndex
  }
}

function increase() {
  if (qty.value < (selectedSku.value.stock || 999)) qty.value++
}
function decrease() {
  if (qty.value > 1) qty.value--
}

// 原加入购物车逻辑
const addToCart = async () => {
  if (!product.value.id || !selectedSkuInfo.value?.skuId) {
    ElMessage.warning('缺少产品/SKU信息')
    return
  }
  const cartItem = {
    productId: product.value.id,
    skuId: selectedSkuInfo.value.skuId,
    quantity: qty.value,
  }
  try {
    const res = await addCartApi(cartItem)
    ElMessage.success('添加购物车成功')
    return res
  } catch (error) {
    console.error('购物车添加失败', error)
    ElMessage.error('添加购物车失败，请稍后重试')
  }
}

// 加入购物车 + 抛物线动画
const addToCartWithAnimation = async () => {
  await addToCart() // 执行原来的逻辑

  if (!addCartBtn.value || !cartIcon.value) return
  const btnRect = addCartBtn.value.getBoundingClientRect()
  const cartRect = cartIcon.value.getBoundingClientRect()

  if (!ball.value) {
    const el = document.createElement('div')
    el.style.cssText = `
      position: fixed; z-index: 9999; width: 20px; height: 20px;
      border-radius: 50%; background: orange; pointer-events: none;
      box-shadow: 0 0 10px rgba(255,140,0,.5); display: none;
    `
    document.body.appendChild(el)
    ball.value = el
  }

  const b = ball.value
  b.style.left = btnRect.left + btnRect.width / 2 - 10 + 'px'
  b.style.top = btnRect.top + btnRect.height / 2 - 10 + 'px'
  b.style.display = 'block'
  b.style.opacity = '1'
  b.style.transform = 'scale(1)'

  const toX = cartRect.left + cartRect.width / 2 - 10
  const toY = cartRect.top + cartRect.height / 2 - 10
  let t = 0
  const duration = 36

  const frame = () => {
    t++
    const p = t / duration
    const ease = 1 - Math.pow(1 - p, 3)
    const x = btnRect.left + (toX - btnRect.left) * ease
    const y = btnRect.top + (toY - btnRect.top) * ease - 80 * Math.sin(p * Math.PI)

    b.style.left = x + 'px'
    b.style.top = y + 'px'
    b.style.opacity = (1 - ease * 0.6).toString()
    b.style.transform = `scale(${1 - ease * 0.5})`

    if (t < duration) {
      requestAnimationFrame(frame)
    } else {
      b.style.display = 'none'
      cartCount.value++
    }
  }
  requestAnimationFrame(frame)
}

const handleClaimCoupon = async (couponId) => {
  try {
    console.log('领取优惠券:', couponId)
    const res = await receiveCoupon(couponId)
    if (res.ok) {
      ElMessage.success('优惠券领取成功！')
    } else {
      ElMessage.error(res.msg || '优惠券领取失败')
    }
  } catch (error: any) {
    console.error('领取优惠券失败:', error)
    ElMessage.error(error?.message || '领取失败，请稍后重试')
  }
}

// ==============================================
// 商品详情页 → 个性化推荐（猜你喜欢）
// ==============================================
const recProducts = ref<any[]>([])
const loadingRec = ref(false)
const recPageNum = ref(1)
const recPageSize = ref(8)
const recHasMore = ref(true)

// 获取推荐商品
const fetchRecommend = async () => {
  if (loadingRec.value || !recHasMore.value) return
  try {
    loadingRec.value = true
    const res = await getCartRecommend({
      pageNum: recPageNum.value,
      pageSize: recPageSize.value,
      sortItemList: [
        {
          isAsc: true,
          column: 'price',
        },
      ],
    })
    const list = res?.data?.list || []
    if (list.length === 0) {
      recHasMore.value = false
      return
    }
    // 数组追加，避免全量替换导致抖动
    recProducts.value.push(
      ...list.map((item: any) => ({
        id: item.id || 0,
        name: item.title || item.productName || '未知商品',
        price: Number(item.currentPrice || item.price || 0),
        imgUrl: item.mainImage || item.imgUrl || '/img/empty.png',
        subTitle: item.subTitle || '',
        shopName: item.shopName || '',
        brandName: item.brandName || '',
        sales: item.sales || 0,
        warrantyTip: item.warrantyTip || '正品保障',
      })),
    )
    recHasMore.value = list.length === recPageSize.value
  } catch (err) {
    console.error('推荐接口失败', err)
  } finally {
    loadingRec.value = false
  }
}

// 加载更多
const loadMoreRec = () => {
  recPageNum.value++
  fetchRecommend()
}

watch(selectedSku, (newSku) => {
  qty.value = Math.min(qty.value, newSku.stock || 999)
})

onMounted(() => {
  if (id) productDetail()
  // 进入页面加载推荐商品
  fetchRecommend()
})
</script>

<style scoped>
.product-grid {
  grid-template-columns: 1fr 1fr 380px;
}

:deep(.lg\:sticky) {
  align-self: start;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.thumb {
  aspect-ratio: 1;
  overflow: hidden;
}
.spec-table tr:hover {
  background-color: #f8f9fa;
}

/* 推荐商品卡片hover动画优化 */
:deep(.hover\:-translate-y-1) {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

/* 无限滚动容器样式 */
:deep(.infinite-scroll-container) {
  overflow: visible;
}
</style>
