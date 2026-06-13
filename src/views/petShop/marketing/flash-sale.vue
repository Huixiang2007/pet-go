<!-- src/views/petShop/marketing/flash-sale.vue -->
<template>
  <NavBar />
  <div
    class="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pt-16 relative overflow-hidden"
  >
    <!-- 背景浮动装饰点 -->
    <div class="floating-dots"></div>

    <header class="relative overflow-hidden">
      <div class="gradient-shine"></div>
      <div class="bg-gradient-to-r from-orange-500 to-red-500 py-5 shadow-xl relative z-10">
        <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center mb-3 md:mb-0">
            <i class="fa fa-bolt-lightning text-white text-2xl mr-3 animate-spin-slow"></i>
            <h1 class="text-2xl md:text-3xl font-bold text-white">限时秒杀</h1>
            <span
              class="ml-3 bg-white/25 text-white text-sm px-3 py-1 rounded-full backdrop-blur-md shadow-glow animate-pulse-soft"
            >
              低至3折
            </span>
          </div>

          <!-- 倒计时 -->
          <div class="flex flex-col items-center md:items-end">
            <p class="text-white text-sm md:text-base mb-1 flex items-center">
              <i class="fa fa-clock-o mr-1"></i>
              {{ countdownText }}
            </p>
            <div class="flex gap-1">
              <div class="countdown-box">{{ countdownData.hours }}</div>
              <span class="text-white text-xl font-bold">:</span>
              <div class="countdown-box">{{ countdownData.minutes }}</div>
              <span class="text-white text-xl font-bold">:</span>
              <div class="countdown-box">{{ countdownData.seconds }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 animate-shine"
      ></div>
    </header>

    <main class="mx-auto px-4 py-8 relative z-10">
      <!-- 带箭头滑动时间轴 -->
      <div class="activity-timeline-container mb-8 relative">
        <button
          @click="scrollTimeline('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full shadow-neumorph flex items-center justify-center hover:bg-orange-50 transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="isAtStart"
        >
          <i class="fa fa-angle-left text-orange-500 text-xl"></i>
        </button>

        <div ref="timelineRef" class="activity-timeline">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity-item"
            :class="[activity.id === currentActivity.id ? 'active' : '', activity.status]"
            @click="switchActivity(activity)"
          >
            <div class="activity-time">{{ activity.startTime }}</div>
            <div class="activity-status">
              {{ activity.activityType }}
            </div>
          </div>
        </div>

        <button
          @click="scrollTimeline('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full shadow-neumorph flex items-center justify-center hover:bg-orange-50 transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="isAtEnd"
        >
          <i class="fa fa-angle-right text-orange-500 text-xl"></i>
        </button>
      </div>

      <template v-if="currentActivity.seckillType === '优惠券秒杀'">
        <div class="coupon-section mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold text-gray-800 flex items-center">
              <i class="fa fa-ticket text-red-500 mr-2"></i> 秒杀专属优惠券
            </h3>
            <span class="text-sm text-orange-500">限时领取，先到先得！</span>
          </div>
          <div class="coupon-list flex gap-4 overflow-x-auto pb-3">
            <div
              v-for="coupon in coupons"
              :key="coupon.id"
              class="coupon-card flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 w-64 relative overflow-hidden"
            >
              <div
                class="absolute right-0 top-0 w-16 h-full bg-white/10 skew-x-[-20deg] transform translate-x-4"
              ></div>
              <!-- 金额：保留2位小数，解决超长问题 -->
              <div class="flex items-baseline gap-1 mb-2">
                <span class="text-2xl font-bold">¥{{ Number(coupon.amount).toFixed(2) }}</span>
                <span class="text-sm">满{{ Number(coupon.minAmount).toFixed(2) }}可用</span>
              </div>
              <p class="text-sm opacity-90">{{ coupon.couponName }}</p>
              <p class="text-xs opacity-75 mt-1">有效期：{{ coupon.validDays }}天</p>
              <button
                class="absolute right-3 top-3/4 -translate-y-3/4 bg-white text-red-500 px-3 py-1 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                @click="handleGrabCoupon(coupon.id)"
                :disabled="currentActivity.status !== 'ongoing'"
              >
                {{ currentActivity.status === 'upcoming' ? '未开始' : '立即领取' }}
              </button>
            </div>
            <div v-if="coupons.length === 0" class="text-gray-400 text-sm py-4">
              暂无可用优惠券~
            </div>
          </div>
        </div>
      </template>

      <!-- 商品秒杀模式 -->
      <template v-if="currentActivity.seckillType === '商品秒杀'">
        <div class="mb-4 text-center md:text-left">
          <h2
            class="text-2xl md:text-2.5xl font-bold text-gradient-title flex items-center justify-center md:justify-start"
          >
            <span class="inline-block w-3 h-8 bg-red-500 rounded-full mr-3 animate-pulse"></span>
            热门秒杀商品
          </h2>
          <p class="text-sm text-gray-500 mt-2 flex items-center justify-center md:justify-start">
            机不可失，时不再来！冲啊！
            <i class="fa fa-hourglass-half text-red-500 ml-1 animate-float"></i>
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-elegant p-4 md:p-8 relative overflow-hidden">
          <!-- 流光装饰 -->
          <div class="card-shine"></div>

          <!-- 加载中 -->
          <div
            v-if="loading"
            class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400"
          >
            <div
              class="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"
            ></div>
            <p>正在加载秒杀商品...</p>
          </div>

          <template v-else>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[200px]">
              <div
                v-for="product in products"
                :key="product.id"
                class="flash-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div class="relative">
                  <img :src="product.mainImage" class="w-full h-40 object-cover" alt="" />
                  <span
                    class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded transform -rotate-6 shadow-md"
                  >
                    {{ Math.round((1 - product.flashPrice / product.originalPrice) * 100) }}% OFF
                  </span>
                  <div
                    v-if="currentActivity.status === 'upcoming'"
                    class="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <span class="text-white text-xl font-bold">活动未开始</span>
                  </div>
                </div>
                <div class="p-3">
                  <h3 class="text-sm font-medium truncate mb-2">{{ product.title }}</h3>
                  <div class="flex items-baseline gap-2 mb-2">
                    <span class="text-red-500 text-xl font-bold">¥{{ product.flashPrice }}</span>
                    <span class="text-gray-400 text-sm line-through"
                      >¥{{ product.originalPrice }}</span
                    >
                  </div>
                  <!-- 进度条 -->
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      class="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                      :style="{ width: `${product.soldPercent}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 mb-3">
                    已抢{{ product.soldPercent }}%，剩余{{ product.stock }}件
                  </p>
                  <button
                    :disabled="
                      currentActivity.status === 'upcoming' ||
                      currentActivity.status === 'ended' ||
                      product.soldPercent >= 100
                    "
                    @click="handleBuyProduct(product)"
                    class="w-full py-2 rounded-lg font-bold transition-all duration-200 active:scale-95"
                    :class="
                      currentActivity.status === 'upcoming' ||
                      currentActivity.status === 'ended' ||
                      product.soldPercent >= 100
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 hover:shadow-lg'
                    "
                  >
                    {{
                      currentActivity.status === 'upcoming'
                        ? '活动未开始'
                        : currentActivity.status === 'ended'
                          ? '活动已结束'
                          : product.soldPercent >= 100
                            ? '已抢完'
                            : '立即抢购'
                    }}
                  </button>
                </div>
              </div>

              <!-- 空状态提示 -->
              <div
                v-if="products.length === 0"
                class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 animate-float-slow"
              >
                <i class="fa fa-shopping-basket text-5xl mb-4 opacity-60 text-gradient-icon"></i>
                <p class="text-lg font-medium mb-2 text-gradient-title">
                  {{
                    currentActivity.status === 'ended'
                      ? '该活动已结束'
                      : currentActivity.status === 'upcoming'
                        ? '活动尚未开始'
                        : '该场次暂无秒杀商品'
                  }}
                </p>
                <p class="text-sm">
                  {{
                    currentActivity.status === 'ended'
                      ? '请选择其他进行中的活动'
                      : currentActivity.status === 'upcoming'
                        ? '活动开始后可参与抢购'
                        : '换个时间段看看吧~'
                  }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getFlashSaleList,
  getFlashSaleDetail,
  grabCoupon,
  buyProduct,
} from '../../../api/pet-shop/flash'

interface Activity {
  id: string
  name: string
  startTime: string
  endTime: string
  status: 'ongoing' | 'upcoming' | 'ended'
  activityType: string
  seckillType: string
}

interface Product {
  id: number
  activityId?: string
  activityName?: string
  title: string
  mainImage: string
  flashPrice: number
  originalPrice: number
  stock: number
  soldPercent: number
}

interface Coupon {
  id: string
  couponName: string
  amount: number
  minAmount: number
  validDays: number
}

const activities = ref<Activity[]>([])
const products = ref<Product[]>([])
const coupons = ref<Coupon[]>([])
const loading = ref(false)

// 当前活动
const currentActivity = ref<Activity>({
  id: '',
  name: '限时秒杀',
  startTime: '',
  endTime: '',
  status: 'ongoing',
  activityType: '',
  seckillType: '',
})

// 倒计时
const countdownData = ref({ hours: '00', minutes: '00', seconds: '00' })
const countdownText = ref('活动结束倒计时')
let countdownTimer: any = null

// 时间轴滚动
const timelineRef = ref<HTMLDivElement | null>(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

// 倒计时计算
const updateCountdown = () => {
  if (!currentActivity.value.endTime) return
  const end = new Date(currentActivity.value.endTime).getTime()
  const now = new Date().getTime()
  const diff = end - now

  if (diff <= 0) {
    countdownData.value = { hours: '00', minutes: '00', seconds: '00' }
    countdownText.value = '活动已结束'
    return
  }

  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  countdownData.value = {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  }

  if (currentActivity.value.status === 'upcoming') {
    countdownText.value = '活动开始倒计时'
  } else if (currentActivity.value.status === 'ended') {
    countdownText.value = '活动已结束'
  } else {
    countdownText.value = '活动结束倒计时'
  }
}

// 领取优惠券
const handleGrabCoupon = async (couponId: string) => {
  const requestId = 'req_' + Date.now().toString(36) + Math.random().toString(36).substr(2)

  try {
    await grabCoupon({ requestId, couponId })
    ElMessage.success('领取成功！')
  } catch (err: any) {
    ElMessage.error(err.message || '领取失败，请重试')
  }
}
// 加载活动列表
const loadActivities = async () => {
  try {
    const res = await getFlashSaleList({ pageNum: 1, pageSize: 10 })
    if (res.code === 0 && res.data?.list) {
      activities.value = res.data.list.map((item: any) => ({
        id: String(item.activityId),
        name: item.activityName,
        startTime: item.startTime || '00:00',
        endTime: item.endTime || new Date(Date.now() + 3600000).toISOString(),
        status:
          item.activityStatus === '未开始'
            ? 'upcoming'
            : item.activityStatus === '已结束'
              ? 'ended'
              : 'ongoing',
        activityType: item.activityType || '秒杀专场',
        seckillType: item.seckillType || '',
      }))
      if (activities.value.length) {
        currentActivity.value = activities.value[0]
        await loadActivityDetail(activities.value[0].id)
      }
    }
  } catch (err) {
    console.error('加载活动失败', err)
  } finally {
    updateCountdown()
    countdownTimer = setInterval(updateCountdown, 1000)
  }
}

// 加载活动详情（商品+优惠券）
const loadActivityDetail = async (activityId: string) => {
  loading.value = true
  products.value = []
  coupons.value = []

  try {
    const res = await getFlashSaleDetail(activityId)
    console.log('res', res)
    if (res.code === 0 && res.data) {
      if (res.data.productList) {
        const list = res.data.productList
        products.value = list.map((p: any) => {
          const total = p.totalCount || 1
          const sold = Math.min(p.soldCount || 0, total)
          return {
            id: p.productId,
            title: p.productName,
            mainImage: p.mainImage,
            flashPrice: p.seckillPrice,
            originalPrice: p.originalPrice,
            stock: Math.max(0, total - sold),
            soldPercent: Math.round((sold / total) * 100),
          }
        })
      }

      if (res.data.couponList) {
        coupons.value = res.data.couponList.map((c: any) => {
          // 根据折扣类型计算优惠金额
          // discountType为"折扣"时，discount是折扣率（如0.8表示8折）
          // discountType为"满减"时，discount是直接减免金额（如30表示减30元）
          let amount = 0
          if (c.discountType === '折扣') {
            // 折扣：计算实际优惠金额 = 最低消费 * (1 - 折扣率)
            amount = Math.round(c.minAmount * (1 - c.discount) * 100) / 100
          } else if (c.discountType === '满减') {
            // 满减：直接使用discount作为优惠金额
            amount = c.discount
          } else {
            // 默认处理
            amount = c.discount || 0
          }
          return {
            id: c.couponId,
            couponName: c.couponName,
            amount: amount,
            minAmount: c.minAmount,
            validDays: c.validDays,
          }
        })
      }
    }
  } catch (err) {
    console.error('加载活动详情失败', err)
  } finally {
    loading.value = false
  }
}

// 秒杀商品
const handleBuyProduct = async (product: Product) => {
  if (currentActivity.value.status !== 'ongoing') {
    ElMessage.warning('当前活动未开始或已结束')
    return
  }

  if (product.stock <= 0) {
    ElMessage.warning('商品已抢光')
    return
  }

  try {
    const requestId = 'req_' + Date.now().toString(36) + Math.random().toString(36).substr(2)

    const res = await buyProduct({
      requestId: requestId,
      purchaseType: '立即购买',
      productId: String(product.id),
      skuId: '', // SKU ID，如无则传空
      quantity: 1,
      addressId: '', // 地址ID，如无则传空
      payType: '支付宝',
      orderRemark: '',
    })

    if (res.code === 0) {
      // 抢购成功，跳转到支付页面
      ElMessage.success('抢购成功，正在跳转支付页面...')
      setTimeout(() => {
        // 跳转到支付页面，携带订单信息
        window.location.href = `/pet-shop/payment?orderId=${res.data?.orderId || ''}&amount=${product.flashPrice}`
      }, 1500)
    } else {
      ElMessage.error(res.msg || '抢购失败')
    }
  } catch (err) {
    console.error('抢购失败', err)
    ElMessage.error('抢购失败，请重试')
  }
}

// 切换活动
const switchActivity = (act: Activity) => {
  currentActivity.value = act
  loadActivityDetail(act.id)
  clearInterval(countdownTimer)
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
}
// 时间轴滚动
const updateScrollState = () => {
  if (!timelineRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = timelineRef.value
  isAtStart.value = scrollLeft <= 0
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 10
}
const scrollTimeline = (dir: 'left' | 'right') => {
  timelineRef.value?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  setTimeout(updateScrollState, 300)
}

onMounted(async () => {
  await loadActivities()
  timelineRef.value?.addEventListener('scroll', updateScrollState)
  updateScrollState()
})

onBeforeUnmount(() => {
  timelineRef.value?.removeEventListener('scroll', updateScrollState)
  clearInterval(countdownTimer)
})
</script>

<style scoped>
:root {
  --shine-color: rgba(255, 255, 255, 0.3);
  --gradient-orange: linear-gradient(90deg, #ff7a45, #ff4d4f);
  --gradient-title: linear-gradient(90deg, #ff4d4f, #ff9145, #ff4d4f);
}

.countdown-box {
  background: #222;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.coupon-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.coupon-list::-webkit-scrollbar {
  height: 4px;
}
.coupon-list::-webkit-scrollbar-thumb {
  background: #ff7a45;
  border-radius: 2px;
}
.coupon-card {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
}

.gradient-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--shine-color), transparent);
  animation: shine 3s infinite linear;
  z-index: 1;
}
@keyframes shine {
  100% {
    left: 150%;
  }
}

.animate-shine {
  background-size: 200% 100%;
  animation: gradient-shine 2s infinite linear;
}
@keyframes gradient-shine {
  100% {
    background-position: 200% 0;
  }
}

.text-gradient-title {
  background: var(--gradient-title);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: text-shine 3s infinite linear;
}
@keyframes text-shine {
  100% {
    background-position: 200% 0;
  }
}
.text-gradient-icon {
  background: linear-gradient(90deg, #999, #ff7a45);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}
.animate-float-slow {
  animation: float 3.5s ease-in-out infinite;
}
@keyframes float {
  50% {
    transform: translateY(-6px);
  }
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.animate-pulse-soft {
  animation: pulse-soft 2s infinite;
}
@keyframes pulse-soft {
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

.shadow-glow {
  box-shadow: 0 0 12px rgba(255, 122, 69, 0.4);
}
.shadow-elegant {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}
.shadow-neumorph {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
}

.floating-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(255, 150, 100, 0.05) 1px, transparent 1px);
  background-size: 35px 35px;
  z-index: 0;
  opacity: 0.4;
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: card-shine 4s infinite linear;
}
@keyframes card-shine {
  100% {
    left: 150%;
  }
}

.activity-timeline-container {
  position: relative;
  padding: 0 44px;
}
.activity-timeline {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 12px 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
}
.activity-timeline::-webkit-scrollbar {
  display: none;
}

.activity-item {
  flex: 0 0 auto;
  padding: 14px 26px;
  background: white;
  border-radius: 28px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.35s;
  text-align: center;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}
.activity-item:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 20px rgba(255, 122, 69, 0.15);
  border-color: #ff7a45;
}
.activity-item.active {
  background: linear-gradient(135deg, #ff7a45, #ff4d4f);
  color: white;
  box-shadow: 0 6px 18px rgba(255, 77, 79, 0.3);
  transform: scale(1.05);
}
.activity-item.active::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 28px;
  padding: 2px;
  background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.5), #fff);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: active-shine 2s infinite linear;
}
@keyframes active-shine {
  100% {
    background-position: 200% 0;
  }
}
.activity-item.ended {
  background: #f7f7f7;
  color: #999;
}
.activity-item.upcoming {
  background: #e6f7ff;
  color: #1890ff;
}
.activity-time {
  font-weight: 800;
  font-size: 15px;
  margin-bottom: 4px;
}
.activity-status {
  font-size: 12px;
  opacity: 0.9;
}
</style>
