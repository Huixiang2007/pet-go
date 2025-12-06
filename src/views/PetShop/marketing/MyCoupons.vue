<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      v-for="coupon in couponList"
      :key="coupon.id"
      class="coupon-card bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative"
    >
      <div class="absolute top-3 right-3 text-accent/30">
        <i class="fa fa-times text-xl mr-4 cursor-pointer text-gray-200 hover:text-gray-500"></i>
        <i class="fa fa-paw text-2xl"></i>
      </div>
      <div class="mb-4">
        <span class="text-4xl font-bold text-[#FF7043]">¥{{ coupon.price }}</span>
        <span class="text-gray-500 ml-2">满{{ coupon.total }}可用</span>
        <p class="text-xs text-gray-400 mt-2">有效期至 {{ coupon.expire || '长期有效' }}</p>
        <p class="text-gray-500 mt-2">{{ coupon.desc }}</p>
      </div>
      <button
        class="w-full bg-[#FF7043] hover:bg-[#FF7043]/90 text-white py-2 rounded-full text-sm transition-colors"
        :disabled="coupon.status !== '未使用'"
      >
        {{ coupon.status === '未使用' ? '立即使用' : coupon.status }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const couponList = ref([
  {
    id: '1',
    title: '满100减10',
    desc: '仅限会员使用',
    expire: '2022-12-31',
    price: 10,
    total: 100,
    status: '未使用',
    statusType: 'pending',
  },
  {
    id: '2',
    title: '满100减10',
    desc: '仅限小明店铺使用',
    price: 10,
    total: 100,
    status: '未使用',
    statusType: 'used',
  },
  {
    id: '3',
    title: '满200减20',
    desc: '仅限小红店铺使用',
    price: 20,
    total: 200,
    status: '已过期',
    statusType: 'expired',
  },
])
</script>

<style scoped></style>
