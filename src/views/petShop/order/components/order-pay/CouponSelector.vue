<!-- 优惠券选择组件 -->
<template>
  <section class="bg-white rounded-xl p-6 card-shadow mt-6">
    <h2 class="text-lg font-semibold mb-4">优惠券</h2>

    <div class="space-y-3">
      <!-- 优惠券列表 -->
      <div
        v-for="coupon in coupons"
        :key="coupon.id"
        :class="[
          'rounded-lg p-4 transition-base cursor-pointer flex justify-between items-center',
          coupon.isSelected
            ? 'border-2 border-[#f3ce48] bg-[#f3ce48]/5'
            : 'border border-gray-200 hover:border-[#f3ce48]/50',
        ]"
        @click="$emit('select-coupon', coupon.id)"
      >
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            :class="
              coupon.isSelected ? 'bg-[#f3ce48]/10 text-[#f3ce48]' : 'bg-gray-100 text-gray-400'
            "
          >
            <i class="fa fa-ticket"></i>
          </div>
          <div>
            <div class="font-medium">{{ coupon.discount }}</div>
            <div class="text-xs text-gray-400">有效期至{{ coupon.validity }}</div>
          </div>
        </div>
        <i
          class="text-lg"
          :class="
            coupon.isSelected ? 'fa fa-check-circle text-[#f3ce48]' : 'fa fa-circle-o text-gray-400'
          "
        ></i>
      </div>

      <button
        class="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-[#f3ce48] hover:border-[#f3ce48]/50 transition-base text-sm"
      >
        查看更多优惠券 <i class="fa fa-angle-right ml-1"></i>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
// 定义Props
interface Coupon {
  id: number
  discount: string
  validity: string
  isSelected: boolean
}
defineProps<{
  coupons: Coupon[]
}>()

defineEmits(['select-coupon'])
</script>

<style scoped lang="scss">
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
