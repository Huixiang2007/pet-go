<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-800 pb-8">
    <header class="sticky top-0 z-50 bg-[#ff4757] text-white px-4 py-3 text-center shadow-md">
      <h1 class="text-lg font-semibold">限时抢券 · 手慢无</h1>
      <p class="text-xs opacity-90 mt-1">领券下单立减，优惠不等人</p>
    </header>

    <!-- 优惠券列表 -->
    <div class="max-w-[750px] mx-auto px-4 py-4" id="couponList">
      <div
        v-for="coupon in coupons"
        :key="coupon.id"
        class="bg-white rounded-3xl mb-4 flex overflow-hidden shadow-md hover:translate-y-[-2px] transition-transform duration-200"
      >
        <div class="w-[35%] bg-gradient-to-br from-[#ff4757] to-[#ff6b81] text-white flex flex-col items-center justify-center py-4">
          <span class="text-4xl font-bold leading-none">{{ coupon.amount }}</span>
          <span class="text-xs mt-1">元券</span>
        </div>

        <!-- 信息区 -->
        <div class="w-[65%] px-4 py-4 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-semibold mb-2 text-gray-800">{{ coupon.title }}</h3>
            <p class="text-xs text-gray-600 mb-2 leading-relaxed">{{ coupon.desc }}</p>
            <p class="text-[0.75rem] text-gray-500 mb-3">
              {{ coupon.validTime }}
              <span v-if="coupon.countdownEnd">|</span>
              <!-- 倒计时 -->
              <span v-if="coupon.countdownEnd" class="text-[#ff4757] font-semibold">
                抢券倒计时：
                <span class="bg-[#ff4757] text-white px-1 rounded text-xs mx-1">
                  {{ hours.toString().padStart(2, '0') }}
                </span>:
                <span class="bg-[#ff4757] text-white px-1 rounded text-xs mx-1">
                  {{ minutes.toString().padStart(2, '0') }}
                </span>:
                <span class="bg-[#ff4757] text-white px-1 rounded text-xs mx-1">
                  {{ seconds.toString().padStart(2, '0') }}
                </span>
              </span>
              <span v-if="coupon.countdownEnd && isCountdownEnd" class="text-gray-500">已结束</span>
            </p>
          </div>

          <button
            :class="[
              'self-start px-4 py-1.5 rounded-full text-[0.85rem] font-medium transition-all duration-200',
              coupon.status === 'can-get' ? 'bg-[#ff4757] text-white hover:bg-[#ff3042] hover:scale-105 cursor-pointer' : '',
              coupon.status === 'got' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : '',
              coupon.status === 'expired' ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : ''
            ]"
            :disabled="coupon.status !== 'can-get' || isCountdownEnd"
            @click="handleGetCoupon(coupon.id)"
          >
            {{ coupon.btnText }}
          </button>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div
        class="fixed inset-0 bg-black/50 z-50"
        :class="{ 'hidden': !popupVisible, 'block': popupVisible }"
        @click="popupVisible = false"
      ></div>

      <!-- 弹窗内容 -->
      <div
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 text-center shadow-lg z-50 transition-transform duration-300"
        :class="{ 'scale-0': !popupVisible, 'scale-100': popupVisible }"
        @click.stop
      >
        <div class="text-4xl text-green-500 mb-3">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <p class="text-base mb-4">{{ popup.popupText }}</p>
        <button
          class="bg-[#ff4757] text-white px-6 py-2 rounded-full cursor-pointer"
          @click="popupVisible = false"
        >
          {{ popup.btnText }}
        </button>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';

const coupons = reactive([
  {
    id: 1,
    amount: 50,
    title: '满200减50 全场通用券',
    desc: '全品类通用，特价商品除外',
    validTime: '2025.12.06 - 2025.12.12',
    status: 'can-get',
    countdownEnd: '2025-12-06 23:59:59',
    btnText: '立即抢券'
  },
  {
    id: 2,
    amount: 20,
    title: '满100减20 生鲜专用券',
    desc: '仅限生鲜品类使用，有效期7天',
    validTime: '2025.12.01 - 2025.12.08',
    status: 'got',
    countdownEnd: '',
    btnText: '已领取'
  },
  {
    id: 3,
    amount: 100,
    title: '满500减100 家电专用券',
    desc: '仅限大家电品类，限前100名领取',
    validTime: '已抢完 | 原有效期：2025.11.20 - 2025.12.05',
    status: 'expired',
    countdownEnd: '',
    btnText: '已抢完'
  }
]);

const popup = reactive({
  popupText: '恭喜！优惠券领取成功',
  btnText: '我知道了'
});

const popupVisible = ref(false);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const isCountdownEnd = ref(false);
let countdownTimer = null;

const initCountdown = () => {
  const targetCoupon = coupons.find(item => item.status === 'can-get' && item.countdownEnd);
  if (!targetCoupon) return;

  const updateCountdown = () => {
    const endTime = new Date(targetCoupon.countdownEnd).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;

    if (diff <= 0) {
      isCountdownEnd.value = true;
      targetCoupon.status = 'expired';
      targetCoupon.btnText = '已过期';
      clearInterval(countdownTimer);
      return;
    }
    hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((diff % (1000 * 60)) / 1000);
  };

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
};

const handleGetCoupon = (couponId) => {
  console.log(`领取优惠券ID：${couponId}`);
  const coupon = coupons.find(item => item.id === couponId);
  if (coupon) {
    coupon.status = 'got';
    coupon.btnText = '已领取';
  }
  popupVisible.value = true;
};

onMounted(() => {
  initCountdown();
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style scoped>


.empty-tips {
    text-align: center;
    color: #ff4757;
    padding: 48px 16px;

}
.empty-tips i {
   color: #ff4757;
   font-size: 3.5rem;
   margin-bottom: 16px;
   opacity: 50;
}
</style>
