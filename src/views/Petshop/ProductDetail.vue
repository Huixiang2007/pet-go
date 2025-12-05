<template>
  <main class="mx-auto px-4 py-8 bg-white">
    <div class="flex items-center ml-[56px]">
      <span class="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">PetGo</span>
      <router-link to="/shop" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <i class="fas fa-sign-out-alt text-gray-700"></i>
        <span class="hidden sm:inline ml-1 text-sm text-gray-600">退出</span>
      </router-link>
      <!-- 搜索框 -->
      <div class="hidden md:flex justify-center items-center flex-1 max-w-md mx-8">
        <div class="relative w-full">
          <input type="text" placeholder="搜索宠物用品..." class="w-full py-2 pl-10 pr-4 rounded-full border border-[#f5a623]">
          <i class="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f5a623]"></i>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="product-grid grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
        <div class="lg:col-span-2">
          <div class="flex gap-4">
            <!-- 缩略图列表 -->
            <div class="hidden md:flex flex-col gap-3 w-20">
              <div
                v-for="(item, i) in mediaList"
                :key="i"
                class="thumb cursor-pointer rounded-md border overflow-hidden relative"
                :class="activeMediaIndex === i ? 'ring-2 ring-orange-400' : ''"
                @click="switchMedia(i)"
              >
                <img
                  :src=" '/img/宠物1.jpg'"
                  alt="缩略图"
                  class="w-full h-full object-cover"
                />
                <div v-if="item.type === 'video'" class="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <i class="fa fa-play text-white text-sm"></i>
                </div>
              </div>
            </div>

            <div class="flex-1 rounded-lg overflow-hidden bg-gray-100 relative">
              <img
                ref="mainImage"
                :src=" '/img/宠物1.jpg'"
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
                <source :src="currentMedia.src" :type="`video/${currentMedia.format}`">
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
                :class="{ 'text-orange-500 border-b-2 border-orange-500': activeTab === 'review' }"
                @click="activeTab = 'review'"
              >
                用户评价
              </button>
            </div>

            <!-- 商品详情 -->
            <div v-if="activeTab === 'detail'" class="p-6 md:p-8">
              <h3 class="text-lg font-semibold mb-4">商品详情</h3>
              <p class="text-sm text-gray-600 mb-6">{{ product.detail}}</p>
              <img
                v-for="(img, idx) in product.images?.split(',') || []"
                :key="idx"
                :src="'/img/宠物1.jpg'"
                class="w-full rounded-lg mb-4"
              >
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
                  <td class="border border-gray-200 p-3">{{ product.title || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">型号</td>
                  <td class="border border-gray-200 p-3">{{ product.productSn || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">品牌</td>
                  <td class="border border-gray-200 p-3">{{ product.brandName || '-' }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">价格</td>
                  <td class="border border-gray-200 p-3">¥{{ selectedSku.price || product.currentPrice || 0 }}</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">重量</td>
                  <td class="border border-gray-200 p-3">{{ product.productWeight || 0 }}kg</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">质保</td>
                  <td class="border border-gray-200 p-3">{{ product.warrantyTip || '-' }}</td>
                </tr>
              </table>
            </div>

            <!-- 用户评价 -->
            <div v-if="activeTab === 'review'" class="p-6 md:p-8">
              <h2 class="text-lg font-semibold mb-4">用户评价</h2>
              <p class="text-gray-600 mb-4">共 {{ product.reviewCount || 0 }} 条评价</p>
              <div class="review-item mb-6 pb-6 border-b border-gray-100">
                <div class="review-star text-yellow-400 mb-2">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <p><strong>用户：张先生</strong></p>
                <p class="text-gray-600">监控画质很清晰，夜视效果也不错，能随时看家里的宠物，很安心！</p>
              </div>
              <div class="review-item">
                <div class="review-star text-yellow-400 mb-2">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i>
                </div>
                <p><strong>用户：李女士</strong></p>
                <p class="text-gray-600">连接很稳定，手机端操作也简单，还能语音互动，宠物听到声音会凑过来，太可爱了~</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息 -->
        <div class="lg:block lg:col-span-1">
          <div class="lg:fixed h-[100vh] w-[430px] py-5 pl-2 mt-[-112px] pr-[6rem] overflow-auto">
            <div>
              <div class="flex items-center justify-between">
                <div @click="goStore"
                 class="text-sm text-gray-500">{{ product.shopName }}</div>
              </div>
              <h1 class="mt-4 text-2xl font-bold">{{ product.title}}</h1>

              <div class="flex items-center gap-3 mt-3">
                <div class="flex items-center text-yellow-400">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-alt"></i>
                </div>
                <div class="text-sm text-gray-500">{{ product.productScore || 0 }} · {{ product.reviewCount || 0 }}评价</div>
              </div>
            </div>

            <!-- 价格区域 -->
            <div class="bg-gray-100 p-4 rounded-lg mt-3 mb-3">
              <div class="flex flex-col items-baseline gap-4">
                <div class="text-sm text-gray-400">活动价</div>
                <div class="text-3xl font-bold text-orange-500">¥{{ selectedSku.price || product.currentPrice || 0 }}</div>
                <div class="text-sm text-gray-400 line-through">¥{{ product.marketPrice || 0 }}</div>
                <div class="text-xs py-0.5 rounded bg-orange-50 text-orange-600">
                  直降{{ (product.marketPrice) - (product.currentPrice ) }}元
                </div>
              </div>
              <div class="mt-2 text-sm text-gray-500">{{'无可用优惠券' }}</div>
            </div>

            <!-- SKU规格选择区 -->
            <div v-if="specGroups.length > 0">
              <div v-for="(group, groupIndex) in specGroups" :key="groupIndex" class="mb-5">
                <h3 class="text-sm font-medium text-gray-600 mb-2">{{ group.name }}</h3>
                <div class="flex gap-3 flex-wrap">
                  <button
                    v-for="(option, optIndex) in group.options"
                    :key="optIndex"
                    @click="selectSkuOption(group.name, option)"
                    :class="{
                      'border-2 border-orange-400 bg-orange-50': selectedOptions[group.name] === option,
                      'border border-gray-200 hover:border-gray-400': selectedOptions[group.name] !== option
                    }"
                    class="px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>

              <!-- 已选规格显示 -->
              <div v-if="Object.keys(selectedOptions).length > 0" class="mb-5">
                <h3 class="text-sm font-medium text-gray-600 mb-2">已选</h3>
                <div class="text-sm text-gray-500">
                  <span v-for="(value, key) in selectedOptions" :key="key" class="mr-3">{{ key }}: {{ value }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-600 mb-2">数量</h3>
              <div class="flex items-center w-32 border border-gray-200 rounded-md">
                <button @click="decrease" class="w-10 h-10 text-gray-500 hover:text-orange-500" :disabled="qty <= 1">
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
                <button @click="increase" class="w-10 h-10 text-gray-500 hover:text-orange-500" :disabled="qty >= selectedSku.stock">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>

            <div class="mt-3 text-sm text-gray-500">
              库存：<span class="text-green-600">{{ selectedSku.stock || 999 }}</span> 件
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-4">
              <button
                id="addCart"
                class="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
                :disabled="!isSkuSelected || selectedSku.stock <= 0"
              >
                <i class="fa fa-shopping-cart mr-2"></i> 加入购物车
              </button>
              <button
                id="buyNow"
                class="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                :disabled="!isSkuSelected || selectedSku.stock <= 0"
              >
                <i class="fa fa-bolt mr-2"></i> 立即购买
              </button>
            </div>

            <div class="text-sm text-gray-500 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              <div class="flex items-center gap-2"><i class="fa fa-check-circle text-orange-500"></i>{{ product.warrantyTip || '正品保障' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
interface MediaItem { //定义媒体资源
  type: 'image' | 'video'
  src: string
  thumbSrc: string
  format: string
}

interface SkuInfo { //定义SKU信息
  skuId: number
  productId: number
  skuSn: string
  specJson: string | null
  specText: string
  imageUrl?: string
  price?: number
  stock?: number
  volume?: number
  weight?: number
}

interface Product { //定义产品信息
  shopName: string
  title: string
  productScore: number
  reviewCount: number
  currentPrice: number
  marketPrice: number
  detail: string
  images: string
  mainImage: string
  videoUrl: string
  productSn: string
  brandName: string
  productWeight: number
  warrantyTip: string
  skuList: SkuInfo[]
}

interface SpecGroup { //定义规格组
  name: string
  options: string[]
}

interface SelectedSku { //定义选中的SKU信息
  price: number
  stock: number
}

const activeTab = ref('detail') //页面转台
const route = useRoute()
const id = route.params.id as string
console.log('产品ID:', id)

// 产品数据
const product = ref<Product>({
  shopName: "",
  title: "",
  productScore: 0,
  brandName: "",
  reviewCount: 0,
  currentPrice: 0,
  marketPrice: 0,
  detail: "",
  images: "",
  mainImage: "",
  videoUrl: "",
  productSn: "",
  productWeight: 0,
  warrantyTip: "",
  skuList: []
})

// 媒体
const mediaList = ref<MediaItem[]>([
  { type: 'image',
   src: '',
   thumbSrc: '',
   format: 'jpg' }
])
const activeMediaIndex = ref(0) // 当前媒体索引
const mainImage = ref<HTMLImageElement>()
const videoPlayer = ref<HTMLVideoElement>()

const selectedOptions = ref<Record<string, string>>({})  // 选中的规格选项
const selectedSkuInfo = ref<SkuInfo | null>(null)  // 选中的SKU信息

// 数量
const qty = ref<number>(1)

// 计算当前媒体
const currentMedia = computed<MediaItem>(() => {
  return mediaList.value[activeMediaIndex.value] || { type: 'image', src: '', thumbSrc: '', format: 'jpg' }
})

// 是否有视频
const hasVideo = computed(() => {
  return mediaList.value.some(item => item.type === 'video')
})

// 计算规格组和选项
const specGroups = computed<SpecGroup[]>(() => {
  const groups: SpecGroup[] = []
  const specMap = new Map<string, Set<string>>()

  // 从所有SKU中提取规格信息
  if (product.value.skuList && Array.isArray(product.value.skuList) && product.value.skuList.length > 0) {
    product.value.skuList.forEach((sku: SkuInfo) => {
      if (sku.specText) {
        const specs = sku.specText.split(';')
        specs.forEach((spec: string) => {
          const [name, value] = spec.split(':')
          if (name && value) {
            if (!specMap.has(name)) {  //判断是否已有该规格组，没有则新建
              specMap.set(name, new Set())
            }
            specMap.get(name)?.add(value)  //有的话添加到该规格组的选项集合中
          }
        })
      }
    })
  }

  specMap.forEach((options, name) => {
    groups.push({
      name,  // 规格组名称
      options: Array.from(options) // 转换为数组
    })
  })
  return groups
})

// 计算选中的SKU信息
const selectedSku = computed<SelectedSku>(() => {
  if (selectedSkuInfo.value) {
    return {
      price: selectedSkuInfo.value.price || product.value.currentPrice || 0,
      stock: selectedSkuInfo.value.stock || 999
    }
  }
  return {
    price: product.value.currentPrice || 0,
    stock: 999
  }
})

// 判断是否选完规格
const isSkuSelected = computed(() => {
  return specGroups.value.length === 0 ||
    Object.keys(selectedOptions.value).length === specGroups.value.length
})

const productDetail = () => {
  axios.request({
    url: "/server/api/shop/product/detail/" + id,
    method: 'GET',
    params: {
      id: id
    }
  })
  .then(res => {
    console.log('接口返回数据:', res)
    const productNew = res.data.data
    product.value = productNew
    const imageList = productNew.images?.split(',') || []
    const mainImage = productNew.mainImage || imageList[0] || ""

    // 初始化媒体列表
    mediaList.value = [
      {
        type: 'image',
        src: mainImage,
        thumbSrc: mainImage,
        format: 'jpg'
      }
    ]

    // 添加剩余图片
    if (imageList.length > 1) {
      imageList.slice(1).forEach((img: string) => {
        mediaList.value.push({
          type: 'image',
          src: img || "",
          thumbSrc: img || "",
          format: 'jpg'
        })
      })
    }

    // 添加视频
    if (productNew.videoUrl && productNew.videoUrl !== "暂无商品视频url") {
      mediaList.value.unshift({
        type: 'video',
        src: productNew.videoUrl,
        thumbSrc: mainImage,
        format: 'mp4'
      })
    }

    // 初始化默认选中第一个SKU
    if (productNew.skuList && Array.isArray(productNew.skuList) && productNew.skuList.length > 0) {
      selectedSkuInfo.value = productNew.skuList[0]

      if (selectedSkuInfo.value ) {
        const specs = selectedSkuInfo.value.specText.split(';') //选中的规格组分开
        specs.forEach((spec: string) => {    //遍历规格组
          const [name, value] = spec.split(':')  //分割规格名和值
          if (name && value) {
            selectedOptions.value[name] = value
          }
        })
      }
    }
  })
  .catch(err => {
    console.log('产品详情请求失败:', err)
    console.log('错误详情:', err.response.data)
  })
}
const goStore = () => {
  router.push({
    path: '/Store'
  })
}

function selectSkuOption(specName: string, option: string) {
  selectedOptions.value[specName] = option

  // 根据已选选项查找匹配的SKU
  const matchSku = findMatchingSku()
  if (matchSku) {
    selectedSkuInfo.value = matchSku
  }
}

// 查找匹配的SKU
function findMatchingSku(): SkuInfo | null {
  if (!product.value.skuList || !Array.isArray(product.value.skuList) || product.value.skuList.length === 0) {
    return null
  }

  return product.value.skuList.find((sku: SkuInfo) => {
    if (!sku.specText) return false

    const specs = sku.specText.split(';')
    return specs.every((spec: string) => {
      const [name, value] = spec.split(':')
      if (!name || !value) return true
      return !selectedOptions.value[name] || selectedOptions.value[name] === value
    })
  }) || null
}

// 媒体相关函数
function switchMedia(index: number) {
  activeMediaIndex.value = index
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
}

function playVideoFromImage() {
  // 查找第一个视频并播放
  const videoIndex = mediaList.value.findIndex(item => item.type === 'video')
  if (videoIndex !== -1) {
    activeMediaIndex.value = videoIndex
    setTimeout(() => {
      if (videoPlayer.value) {
        videoPlayer.value.play()
      }
    }, 100)
  }
}

function onVideoEnded() {
  // 视频播放结束后切换回第一个图片
  const firstImageIndex = mediaList.value.findIndex(item => item.type === 'image')
  if (firstImageIndex !== -1) {
    activeMediaIndex.value = firstImageIndex
  }
}

// 数量控制函数
function increase() {
  if (qty.value < (selectedSku.value.stock || 999)) {
    qty.value++
  }
}

function decrease() {
  if (qty.value > 1) {
    qty.value--
  }
}

// 监听SKU变化重置数量
watch(selectedSku, (newSku) => {
  qty.value = Math.min(qty.value, newSku.stock || 999)
})

onMounted(() => {
  if (id) {
    productDetail()
  }
})
</script>

<style scoped>
.product-grid {
  grid-template-columns: 1fr 1fr 300px;
}

:deep(.lg\:sticky) {
  align-self: start;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button.option-active {
  border-color: #f5a623;
  background-color: #fff8ee;
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
