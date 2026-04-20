<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 px-4 py-6">
    <!-- 优惠券主容器 -->
    <div
      class="w-full max-w-7xl mx-auto rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-xl border border-amber-100"
    >
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-bold text-amber-700 flex items-center gap-2">
          <i class="fa fa-ticket-alt text-amber-500"></i>
          全部优惠券
        </h3>
        <router-link
          to="/flash-sale"
          class="text-amber-600 text-sm hover:text-amber-800 transition-all"
        >
          去秒杀专区 →
        </router-link>
      </div>

      <!-- 滚动列表 -->
      <div
        ref="scrollContainer"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[650px] overflow-y-auto pr-2"
      >
        <div
          v-for="coupon in couponList"
          :key="coupon.id"
          class="rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
        >
          <div
            v-if="!canReceive(coupon)"
            class="absolute top-0 right-0 bg-gray-400/80 text-white text-[11px] px-3 py-1 rounded-bl-xl"
          >
            已领完
          </div>

          <div class="mb-4">
            <h4 class="text-lg font-bold text-gray-800 mb-2 truncate">
              {{ coupon.couponName }}
            </h4>
            <p class="text-xs text-gray-500 mb-1 truncate">
              适用：{{ coupon.usedToShopName || '全平台' }} /
              {{ coupon.usedToProductTypeName || '全品类' }}
            </p>
            <p class="text-xs text-gray-400">
              已领 <span class="text-amber-600 font-medium">{{ coupon.receiveCount || 0 }}</span> /
              上限 {{ coupon.perLimit || 0 }}
            </p>
          </div>

          <button
            :disabled="!canReceive(coupon)"
            :class="[
              canReceive(coupon)
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500'
                : 'bg-gray-300 cursor-not-allowed text-gray-500',
              'w-full text-white text-sm py-2.5 rounded-xl transition-all font-medium',
            ]"
            @click="handleReceiveCoupon(coupon.id)"
          >
            {{ getReceiveButtonText(coupon) }}
          </button>
        </div>

        <div
          v-if="loading"
          class="col-span-full text-center py-6 text-amber-600 animate-pulse text-sm"
        >
          加载中...
        </div>

        <div
          v-if="noMore && couponList.length > 0"
          class="col-span-full text-center py-4 text-gray-400 text-sm"
        >
          已经到底啦～
        </div>

        <div
          v-if="noMore && couponList.length === 0"
          class="col-span-full text-center py-12 text-gray-300"
        >
          🎫 暂无优惠券
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getReceiveCouponList, receiveCoupon } from '@/api/pet-shop/coupos'
import { ElMessage } from 'element-plus'

const couponList = ref<any[]>([])
const pageNum = ref(1)
const pageSize = ref(12)
const loading = ref(false)
const noMore = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const scrollTimer = null

const handleScroll = () => {
  if (loading.value || noMore.value) return
  const el = scrollContainer.value
  if (!el) return
  const nearBottom = el.scrollTop + el.clientHeight + 100 >= el.scrollHeight
  if (nearBottom) {
    loading.value = true
    setTimeout(() => loadMore(), 300)
  }
}

const loadMore = async () => {
  try {
    const res = await getReceiveCouponList({
      searchCount: true,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      current: pageNum.value,
      sortItemList: [{ isAsc: true, column: 'createTime' }],
    })
    if (res.ok) {
      const list = res.data?.list || []
      if (list.length === 0) {
        noMore.value = true
      } else {
        couponList.value.push(...list)
        pageNum.value++
      }
      if (couponList.value.length >= (res.data?.total || 0)) noMore.value = true
    }
  } catch (err) {
    ElMessage.error('加载失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadCoupon = async () => {
  couponList.value = []
  pageNum.value = 1
  noMore.value = false
  await loadMore()
}

const canReceive = (coupon: any) => {
  const received = coupon.receiveCount ?? 0
  const limit = coupon.perLimit ?? 0
  return received < limit
}

const getReceiveButtonText = (coupon: any) => {
  return canReceive(coupon) ? '立即领取' : '已达上限'
}

const handleReceiveCoupon = async (id: string) => {
  try {
    const res = await receiveCoupon(id)
    if (res.ok) {
      ElMessage.success('领取成功 ✅')
      loadCoupon()
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('领取失败')
  }
}

onMounted(() => {
  loadCoupon()
  scrollContainer.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', handleScroll)
  if (scrollTimer) clearTimeout(scrollTimer)
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #fde68a;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #fdba74;
  border-radius: 10px;
}

:deep(.truncate) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
