<template>
  <main class=" mx-auto px-4 py-8 bg-white ">
    <div class="flex items-center ml-[56px]">
      <img src="https://picsum.photos/id/237/80/80" alt="PetGo Logo" class="h-12 w-12" />
      <span class="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">PetGo</span>
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
            :src="item.thumbSrc"
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

          <!-- 详情-->
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

            <div v-if="activeTab === 'detail'" class="p-6 md:p-8">
              <h3 class="text-lg font-semibold mb-4">商品详情</h3>
              <p class="text-sm text-gray-600 mb-6">高保真音质、主动降噪、长续航，适合通勤与运动场景。</p>
              <img src="https://picsum.photos/1200/400?random=20" class="w-full rounded-lg mb-4">
              <img src="https://picsum.photos/1200/600?random=21" class="w-full rounded-lg mb-4">
            </div>

            <div v-if="activeTab === 'spec'" class="p-6 md:p-8">
              <h2 class="text-lg font-semibold mb-4">规格参数</h2>
              <table class="spec-table w-full border-collapse">
                <tr>
                  <th class="border border-gray-200 p-3 text-left">项目</th>
                  <th class="border border-gray-200 p-3 text-left">参数</th>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">品牌</td>
                  <td class="border border-gray-200 p-3">SoundPro</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">型号</td>
                  <td class="border border-gray-200 p-3">SP-NC800</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">降噪深度</td>
                  <td class="border border-gray-200 p-3">40dB</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">续航时间</td>
                  <td class="border border-gray-200 p-3">单次8小时，总续航30小时</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">蓝牙版本</td>
                  <td class="border border-gray-200 p-3">Bluetooth 5.3</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-3">防水等级</td>
                  <td class="border border-gray-200 p-3">IPX5</td>
                </tr>
              </table>
            </div>

            <div v-if="activeTab === 'review'" class="p-6 md:p-8">
              <h2 class="text-lg font-semibold mb-4">用户评价</h2>
              <div class="review-item mb-6 pb-6 border-b border-gray-100">
                <div class="review-star text-yellow-400 mb-2">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                </div>
                <p><strong>用户：张先生</strong></p>
                <p class="text-gray-600">降噪效果真的很不错，在地铁上几乎听不到外界声音，音质也很清晰，续航能力也很强，充一次电用了好几天，值得推荐！</p>
              </div>
              <div class="review-item">
                <div class="review-star text-yellow-400 mb-2">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star-half-o"></i>
                </div>
                <p><strong>用户：李女士</strong></p>
                <p class="text-gray-600">戴着很舒服，长时间佩戴也不会觉得耳朵疼。音质方面表现出色，降噪功能在办公室使用很合适，同事说话基本听不到，工作效率都提高了。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息 -->

        <div class="lg:block lg:col-span-1">
       <div class=" lg:fixed h-[100vh] w-[430px] bg-white p-5 mt-[-112px] pr-4">
            <div>
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">TaMall · 官方旗舰店</div>
              </div>
              <h1 class="mt-4 text-2xl font-bold">无线降噪蓝牙耳机</h1>

              <div class="flex items-center gap-3 mt-3">
                <div class="flex items-center text-yellow-400">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-alt"></i>
                </div>
                <div class="text-sm text-gray-500">4.8 · 2,356评价</div>
              </div>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg mt-3 mb-3">
              <div class="flex items-baseline gap-4">
                <div class="text-sm text-gray-400">活动价</div>
                <div class="text-3xl font-bold text-orange-500">¥{{ selectedSku.price }}</div>
                <div class="text-sm text-gray-400 line-through">¥{{ product.originalPrice }}</div>
                <div class="ml-auto text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-600">直降{{ product.originalPrice - selectedSku.price }}元</div>
              </div>
              <div class="mt-2 text-sm text-gray-500">满299减30 · 满599减80 · <a class="text-orange-500">查看更多优惠</a></div>
            </div>

            <!-- SKU规格选择区 -->
            <div v-for="(spec, specIndex) in product.specs" :key="specIndex" class="mb-5">
              <h3 class="text-sm font-medium text-gray-600 mb-2">{{ spec.name }}</h3>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="(option, optIndex) in spec.options"
                  :key="optIndex"
                  @click="selectSpec(spec.id, option.id)"
                  :class="{
                    'border-2 border-orange-400 bg-orange-50': selectedSpecs[spec.id] === option.id,
                    'border border-gray-200 hover:border-gray-400': selectedSpecs[spec.id] !== option.id && option.available,
                    'border border-gray-200 opacity-50 cursor-not-allowed': !option.available
                  }"
                  :disabled="!option.available"
                  class="px-4 py-2 rounded-md text-sm transition-colors"
                >
                  {{ option.value }}
                  <span v-if="!option.available" class="ml-1 text-xs">无货</span>
                </button>
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
              库存：<span class="text-green-600">{{ selectedSku.stock }}</span> 件
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
              <div class="flex items-center gap-2"><i class="fa fa-check-circle text-orange-500"></i>7天无理由</div>
              <div class="flex items-center gap-2"><i class="fa fa-check-circle text-orange-500"></i>2年官方质保</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
const activeTab = ref('detail')

const mediaList = ref([
  {
    type: 'video',
    src: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4',
    thumbSrc: 'https://picsum.photos/120/120?random=3',
    format: 'mp4'
  },
  {
    type: 'image', // 类型：图片
    src: 'https://picsum.photos/1200/400?random=1', // 图片地址
    thumbSrc: 'https://picsum.photos/120/120?random=1' // 缩略图地址
  },
  {
    type: 'image',
    src: 'https://picsum.photos/1200/400?random=2',
    thumbSrc: 'https://picsum.photos/120/120?random=2'
  },
  {
    type: 'image',
    src: 'https://picsum.photos/1200/400?random=4',
    thumbSrc: 'https://picsum.photos/120/120?random=4'
  }
])

// 状态管理
const activeMediaIndex = ref(0)
const videoPlayer = ref<HTMLVideoElement | null>(null)

const currentMedia = computed(() => {
  return mediaList.value[activeMediaIndex.value] || { type: 'image', src: '', thumbSrc: '', format: 'mp4' }
})

const hasVideo = computed(() => {
  return mediaList.value.some(item => item.type === 'video')
})

// 切换媒体
function switchMedia(index: number) {
  if (currentMedia.value?.type === 'video') {
    videoPlayer.value?.pause()
  }
  // 更新选中索引
  activeMediaIndex.value = index
  if (mediaList.value[index]?.type === 'video') {
    setTimeout(() => {
      videoPlayer.value?.play()
    }, 100)
  }
}

// 从图片状态直接播放视频
function playVideoFromImage() {
  const videoIndex = mediaList.value.findIndex(item => item.type === 'video')
  if (videoIndex !== -1) {
    switchMedia(videoIndex)
  }
}

// 视频播放结束时
function onVideoEnded() {
  activeMediaIndex.value = 0
}

// SKU核心数据
const product = ref({
  name: '无线降噪蓝牙耳机',
  originalPrice: 499,
  specs: [
    {
      id: 'color',
      name: '颜色',
      options: [
        { id: 'black', value: '黑色', available: true },
        { id: 'white', value: '白色', available: true },
        { id: 'blue', value: '蓝色', available: false },
        { id: 'green', value: '绿色', available: true }
      ]
    },
    {
      id: 'version',
      name: '规格',
      options: [
        { id: 'standard', value: '标准版', available: true },
        { id: 'deluxe', value: '豪华版', available: true }
      ]
    }
  ],
  // SKU映射表：颜色ID,规格ID -> 价格和库存
  skus: {
    'black,standard': { price: 299, stock: 120 },
    'black,deluxe': { price: 399, stock: 80 },
    'white,standard': { price: 299, stock: 50 },
    'white,deluxe': { price: 399, stock: 30 },
    'blue,standard': { price: 299, stock: 0 },
    'blue,deluxe': { price: 399, stock: 0 },
    'green,standard': { price: 299, stock: 75 },
    'green,deluxe': { price: 399, stock: 45 }
  }
})

const selectedSpecs = ref<Record<string, string>>({})

// 计算当前选中的SKU
const selectedSku = computed(() => {
  //收集用户选择的具体规格 ID，得到一个数组
  const specKeys = product.value.specs.map(spec => selectedSpecs.value[spec.id])
  //用于过滤掉未选择的规格
  const selectedCount = specKeys.filter(Boolean).length
  //如果已选数量 不等于 总规格类型数量,返回原来的价格
  if (selectedCount !== product.value.specs.length) {
    return { price: product.value.originalPrice, stock: 0 }
  }
  const skuKey = specKeys.join(',')//将数拼接成字符串，作为 SKU 的唯一键
  const skus = product.value.skus as Record<string, { price: number; stock: number }>
  return skus[skuKey] ?? { price: product.value.originalPrice, stock: 0 }
})

// 判断是否已选择完整规格
const isSkuSelected = computed(() => {
  return Object.keys(selectedSpecs.value).length === product.value.specs.length
})

// 选择规格
function selectSpec(specId: string, optionId: string) {
  selectedSpecs.value[specId] = optionId
}

// 数量控制
const qty = ref<number>(1)

function increase() {
  if (qty.value < selectedSku.value.stock) {
    qty.value++
  }
}

function decrease() {
  if (qty.value > 1) {
    qty.value--
  }
}

// 监听SKU变化，重置数量不超过库存
watch(selectedSku, (newSku) => {
  qty.value = Math.min(qty.value, newSku.stock)
})
</script>

<style scoped>
.product-grid {
  grid-template-columns: 1fr 1fr 300px;
}

:deep(.lg\:sticky) {
  align-self: start;
}
</style>
