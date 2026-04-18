<template>
  <NavBar />
  <main class="mx-auto px-4 py-8 bg-white">
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mt-12">
      <div class="product-grid grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
        <div class="lg:col-span-2">
          <div class="flex gap-4">
            <!-- 缩略图列表 -->
            <div class="hidden md:flex flex-col gap-3 w-20">
              <div
                v-for="(item, i) in mediaList"
                :key="i"
                class="thumb cursor-pointer rounded-md overflow-hidden relative"
                :class="activeMediaIndex === i ? 'ring-2 ring-orange-400' : ''"
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

            <div class="flex-1 rounded-lg overflow-hidden bg-gray-100 relative">
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
                class="absolute bottom-6 left-6 bg-black/40 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-black/60 transition-colors"
                :style="{ display: currentMedia.type === 'image' && hasVideo ? 'flex' : 'none' }"
              >
                <i class="fa fa-play-circle"></i>
                <span class="text-sm">观看产品演示视频</span>
              </button>
            </div>
          </div>

          <!-- 详情 -->
          <div class="border-t border-gray-200 mt-4">
            <div class="flex gap-2 px-6 py-3 overflow-x-auto">
              <button
                class="px-6 py-3 font-medium"
                :class="{ 'text-orange-500 border-b-2 border-orange-500': activeTab === 'detail' }"
                @click="activeTab = 'detail'"
              >
                商品详情
              </button>
              <button
                class="px-6 py-3 text-gray-500"
                :class="{ 'text-orange-500 border-b-2 border-orange-500': activeTab === 'spec' }"
                @click="activeTab = 'spec'"
              >
                规格参数
              </button>
              <button
                class="px-6 py-3 text-gray-500"
                :class="{
                  'text-orange-500 border-b-2 border-orange-500': activeTab === 'allReview',
                }"
                @click="activeTab = 'allReview'"
              >
                全部评价
              </button>
              <button
                class="px-6 py-3 text-gray-500"
                :class="{
                  'text-orange-500 border-b-2 border-orange-500': activeTab === 'question',
                }"
                @click="activeTab = 'question'"
              >
                问大家
              </button>
            </div>

            <!-- 商品详情 -->
            <div v-if="activeTab === 'detail'" class="p-6 md:p-8">
              <div
                v-if="!product.detail || product.detail.trim() === ''"
                class="text-center py-10 bg-amber-50 rounded-xl mb-6"
              >
                <div class="text-amber-500 text-4xl mb-3">🐾</div>
                <p class="text-amber-700 font-medium mb-2">哎呀！商家偷懒啦～</p>
                <p class="text-gray-500 text-sm">居然忘了放商品详情，不过放心，好物不会差</p>
              </div>
              <p v-else class="text-sm text-gray-600 mb-6">{{ product.detail }}</p>

              <div class="mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-2">
                  {{ product.name }}
                </h2>
                <p class="text-sm text-gray-600">{{ product.subTitle || '' }}</p>
              </div>
            </div>

            <!-- 规格参数 -->
            <div v-if="activeTab === 'spec'" class="p-6 md:p-8">
              <h2 class="text-lg font-semibold mb-4">规格参数</h2>
              <table class="spec-table w-full border-collapse">
                <tr>
                  <th class="border border-gray-200 p-3 text-left">项目</th>
                  <th class="border border-gray-200 p-3 text-left">参数</th>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">商品名称</td>
                  <td class="border border-gray-200 p-3">{{ product.name || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">型号</td>
                  <td class="border border-gray-200 p-3">{{ product.productSn || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">品牌ID</td>
                  <td class="border border-gray-200 p-3">{{ product.brandId || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">价格</td>
                  <td class="border border-gray-200 p-3">
                    ¥{{ selectedSku.price || product.currentPrice || 0 }}
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">重量</td>
                  <td class="border border-gray-200 p-3">{{ product.productWeight || 0 }}kg</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">质保</td>
                  <td class="border border-gray-200 p-3">{{ product.warrantyTip || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">销量</td>
                  <td class="border border-gray-200 p-3">{{ product.sales || 0 }} 件</td>
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
        <div class="lg:block lg:col-span-1 mt-20 mb-5">
          <div
            class="lg:fixed lg:w-[calc(100%-2rem)] max-w-[430px] py-5 px-4 mt-0 lg:mt-[-112px] overflow-auto max-h-[calc(100vh-4rem)]"
          >
            <div>
              <div class="flex items-center justify-between">
                <div
                  @click="goStore"
                  class="text-sm text-gray-500 cursor-pointer border-b border-gray-200 pb-2 hover:text-orange-600 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {{ product.shopName }}
                </div>
              </div>
              <div class="flex items-center gap-24">
                <div>
                  <h1 class="text-2xl font-bold break-words">{{ product.title }}</h1>
                </div>
                <div class="shop-btn flex justify-center md:justify-start gap-4">
                  <router-link
                    :to="`/customer-service?id=${product.shopOwnerId}&type=shop`"
                    class="bg-white text-orange-500 px-6 py-2 rounded-full text-sm border-2 border-orange-500 hover:bg-orange-50 transition-all active:scale-95"
                    >联系客服</router-link
                  >
                </div>
              </div>

              <div class="flex items-center gap-3 mt-3 flex-wrap">
                <div class="flex items-center text-yellow-400">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star-half-alt"></i>
                </div>
                <div class="text-sm text-gray-500">
                  {{ product.productScore || 0 }} · {{ product.reviewCount || 0 }}评价
                </div>
              </div>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg mt-3 mb-3 w-full">
              <div class="flex flex-col items-baseline gap-4">
                <div class="text-sm text-gray-400">活动价</div>
                <div class="text-3xl font-bold text-orange-500">
                  ¥{{ selectedSku.price || product.currentPrice || 0 }}
                </div>
                <div class="text-sm text-gray-400 line-through">
                  ¥{{ product.marketPrice || 0 }}
                </div>
                <div class="text-xs py-0.5 rounded bg-orange-50 text-orange-600">
                  直降{{ (product.marketPrice - product.currentPrice || 0).toFixed(1) }}元
                </div>
              </div>

              <!-- 优惠券模块 -->
              <div class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">可用优惠券</p>
                <div v-if="product.couponsList && product.couponsList.length > 0" class="space-y-2">
                  <div
                    v-for="(coupon, idx) in product.couponsList"
                    :key="idx"
                    class="flex items-center justify-between px-3 py-2 bg-white rounded border border-orange-200"
                  >
                    <div class="flex items-center gap-2">
                      <div class="coupon-item bg-white rounded-lg p-3 shadow-sm mb-2">
                        <div class="flex items-center justify-between mb-1.5">
                          <span class="text-orange-500 font-bold text-lg"
                            >¥{{ coupon.discount }}</span
                          >
                          <span class="text-gray-800 text-sm font-medium">{{
                            coupon.couponName
                          }}</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <span class="text-xs text-gray-500">{{ coupon.discountType }}</span>
                          <span class="text-xs text-gray-500">满{{ coupon.minAmount }}可用</span>
                        </div>
                      </div>
                    </div>
                    <button
                      class="text-xs text-orange-500 border border-orange-500 px-2 py-1 rounded"
                      @click="handleClaimCoupon(coupon.couponId)"
                    >
                      立即领取
                    </button>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500">无可用优惠券</p>
              </div>
            </div>

            <div v-if="specGroups.length > 0" class="w-full">
              <div v-for="(group, groupIndex) in specGroups" :key="groupIndex" class="mb-5">
                <h3 class="text-sm font-medium text-gray-600 mb-2">{{ group.name }}</h3>
                <div class="flex gap-3 flex-wrap">
                  <button
                    v-for="(option, optIndex) in group.options"
                    :key="optIndex"
                    @click="selectSkuOption(group.name, option)"
                    :class="{
                      'border-2 border-orange-400 bg-orange-50':
                        selectedOptions[group.name] === option,
                      'border border-gray-200 hover:border-gray-400':
                        selectedOptions[group.name] !== option,
                    }"
                    class="px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>

              <div v-if="Object.keys(selectedOptions).length > 0" class="mb-5">
                <h3 class="text-sm font-medium text-gray-600 mb-2">已选</h3>
                <div class="text-sm text-gray-500 flex flex-wrap gap-2">
                  <span v-for="(value, key) in selectedOptions" :key="key" class="mr-1"
                    >{{ key }}: {{ value }}</span
                  >
                </div>
              </div>
            </div>

            <div class="w-full">
              <h3 class="text-sm font-medium text-gray-600 mb-2">数量</h3>
              <div class="flex items-center w-32 border border-gray-200 rounded-md">
                <button
                  @click="decrease"
                  class="w-10 h-10 text-gray-500 hover:text-orange-500"
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
                  class="w-10 h-10 text-gray-500 hover:text-orange-500"
                  :disabled="qty >= selectedSku.stock"
                >
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>

            <div class="mt-3 text-sm text-gray-500">
              库存：<span class="text-green-600">{{ selectedSku.stock || 999 }}</span> 件
            </div>

            <div
              class="flex flex-col sm:flex-row gap-3 pt-4 pr-[4.5rem] border-t border-gray-100 mt-4"
            >
              <button
                id="addCart"
                class="w-full sm:flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
                :disabled="!isSkuSelected || selectedSku.stock <= 0"
                @click="addToCart"
              >
                <i class="fa fa-shopping-cart mr-2"></i> 加入购物车
              </button>
              <router-link
                :to="`/order?id=${id}&sku=${selectedSkuInfo?.skuId ?? ''}&qty=${qty}&type=buyNow`"
                id="buyNow"
                class="w-full sm:flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                :disabled="!isSkuSelected || selectedSku.stock <= 0"
              >
                <i class="fa fa-bolt mr-2"></i> 立即购买
              </router-link>
            </div>

            <div
              class="text-sm text-gray-500 pt-4 border-t border-gray-100 flex flex-wrap gap-3 w-full mb-6"
            >
              <div class="flex items-center gap-2 whitespace-nowrap">
                <i class="fa fa-check-circle text-orange-500"></i
                >{{ product.warrantyTip || '正品保障' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import CommentList from './components/CommentList.vue'
import QuestionUs from './components/QuestionUs.vue'
import { addCartApi, getProductDetail } from '../../../api/pet-shop/product'
import { receiveCoupon } from '../../../api/pet-shop/coupos'
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
      // 解析 specJson（接口返回的是 JSON 字符串，如 {"颜色":"红色","版本":"基础款"}）
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

    // 初始化媒体列表：视频优先展示
    const imageList = productNew.images?.split(',') || []
    const mainImage = productNew.mainImage || imageList[0] || ''
    mediaList.value = []

    // 有视频就先放视频
    if (productNew.videoUrl && productNew.videoUrl !== '暂无商品视频url') {
      mediaList.value.push({
        type: 'video',
        src: productNew.videoUrl,
        thumbSrc: mainImage,
        format: 'mp4',
      })
      activeMediaIndex.value = 0 // 默认展示视频
    }

    // 再放图片
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

    // 初始化默认选中第一个SKU
    if (productNew.skuList?.length) {
      selectedSkuInfo.value = productNew.skuList[0]
      // 解析默认SKU的规格
      if (selectedSkuInfo.value?.specJson) {
        try {
          const specObj = JSON.parse(selectedSkuInfo.value.specJson)
          Object.assign(selectedOptions.value, specObj)
        } catch {
          // 兼容旧格式
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

// 规格选择相关函数
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

// 媒体相关函数
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

// 数量控制
function increase() {
  if (qty.value < (selectedSku.value.stock || 999)) qty.value++
}
function decrease() {
  if (qty.value > 1) qty.value--
}

// 加入购物车
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
  console.log(cartItem)
  try {
    const res = await addCartApi(cartItem)
    ElMessage.success('添加购物车成功')
    console.log(res)
  } catch (error) {
    console.error('购物车添加失败', error)
    ElMessage.error('添加购物车失败，请稍后重试')
  }
}
//优惠卷
const handleClaimCoupon = async (couponId) => {
  try {
    console.log('领取优惠券:', couponId)
    const res = await receiveCoupon(couponId)
    if (res.ok) {
      ElMessage.success('优惠券领取成功！')
    }
  } catch (error) {
    console.error('领取优惠券失败:', error)
    ElMessage.error('领取优惠券失败')
  }
}

watch(selectedSku, (newSku) => {
  qty.value = Math.min(qty.value, newSku.stock || 999)
})

onMounted(() => {
  if (id) productDetail()
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
.spec-table th {
  background-color: #f8f9fa;
}
.spec-table tr:hover {
  background-color: #f8f9fa;
}
</style>
