<!-- 优惠券选择组件 -->
<template>
  <section class="bg-white rounded-xl p-6 card-shadow mt-6">
    <h2 class="text-lg font-semibold mb-4">优惠券</h2>

    <div class="space-y-3">
      <!-- 平台优惠券 -->
      <div v-if="platformCoupons.length > 0" class="mb-4">
        <h3 class="text-sm font-medium text-gray-600 mb-2">平台优惠券</h3>
        <!-- 平台优惠券列表 -->
        <div
          v-for="coupon in platformCoupons"
          :key="coupon.id"
          :class="[
            'rounded-lg p-4 transition-base cursor-pointer flex justify-between items-center',
            selectedCouponId === coupon.id
              ? 'border-2 border-[#f3ce48] bg-[#f3ce48]/5'
              : 'border border-gray-200 hover:border-[#f3ce48]/50',
          ]"
          @click="$emit('select-coupon', coupon.id, 'platform')"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              :class="
                selectedCouponId === coupon.id
                  ? 'bg-[#f3ce48]/10 text-[#f3ce48]'
                  : 'bg-gray-100 text-gray-400'
              "
            >
              <i class="fa fa-ticket"></i>
            </div>
            <div>
              <div class="font-medium">{{ coupon.couponName }}</div>
              <div class="font-medium mt-1">
                {{ coupon.discountType === '满减' ? '¥' : '' }}{{ coupon.discount }}
                {{ coupon.discountType === '折扣' ? '折' : '' }}
              </div>
              <div class="text-xs text-gray-400">
                {{ coupon.minAmount > 0 ? `满${coupon.minAmount}元可用` : '' }}
              </div>
              <div class="text-xs text-gray-400 mt-1">
                有效期至{{ formatDate(coupon.expireTime) }}
              </div>
              <div v-if="coupon.estimatedDiscount" class="text-xs text-green-600 mt-1">
                预计节省: ¥{{ coupon.estimatedDiscount.toFixed(2) }}
              </div>
            </div>
          </div>
          <i
            class="text-lg"
            :class="
              selectedCouponId === coupon.id
                ? 'fa fa-check-circle text-[#f3ce48]'
                : 'fa fa-circle-o text-gray-400'
            "
          ></i>
        </div>
      </div>

      <!-- 店铺优惠券 -->
      <div v-if="shopCoupons.length > 0" class="mb-4">
        <h3 class="text-sm font-medium text-gray-600 mb-2">店铺优惠券</h3>
        <!-- 店铺优惠券列表 -->
        <div
          v-for="coupon in shopCoupons"
          :key="coupon.id"
          :class="[
            'rounded-lg p-4 transition-base cursor-pointer flex justify-between items-center',
            selectedCouponId === coupon.id
              ? 'border-2 border-[#f3ce48] bg-[#f3ce48]/5'
              : 'border border-gray-200 hover:border-[#f3ce48]/50',
          ]"
          @click="$emit('select-coupon', coupon.id, 'shop')"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              :class="
                selectedCouponId === coupon.id
                  ? 'bg-[#f3ce48]/10 text-[#f3ce48]'
                  : 'bg-gray-100 text-gray-400'
              "
            >
              <i class="fa fa-ticket"></i>
            </div>
            <div>
              <div class="font-medium">{{ coupon.couponName }}</div>
              <div class="font-medium mt-1">
                {{ coupon.discountType === '满减' ? '¥' : '' }}{{ coupon.discount }}
                {{ coupon.discountType === '折扣' ? '折' : '' }}
              </div>
              <div class="text-xs text-gray-400">
                {{ coupon.minAmount > 0 ? `满${coupon.minAmount}元可用` : '' }}
              </div>
              <div class="text-xs text-gray-400 mt-1">适用店铺：{{ coupon.usedToShopName }}</div>
              <div class="text-xs text-gray-400 mt-1">
                有效期至{{ formatDate(coupon.expireTime) }}
              </div>
              <div v-if="coupon.estimatedDiscount" class="text-xs text-green-600 mt-1">
                预计节省: ¥{{ coupon.estimatedDiscount.toFixed(2) }}
              </div>
            </div>
          </div>
          <i
            class="text-lg"
            :class="
              selectedCouponId === coupon.id
                ? 'fa fa-check-circle text-[#f3ce48]'
                : 'fa fa-circle-o text-gray-400'
            "
          ></i>
        </div>
      </div>

      <!-- 无优惠券 -->
      <div
        v-if="platformCoupons.length === 0 && shopCoupons.length === 0"
        class="text-center py-4 text-gray-500"
      >
        暂无可用优惠券
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
  id: number | string
  couponName: string
  couponType: string
  discount: number
  discountType: string
  minAmount: number
  expireTime: string
  usedToShopName?: string
  estimatedDiscount?: number
  available?: boolean
  unavailableReason?: string
}
defineProps<{
  platformCoupons: Coupon[]
  shopCoupons: Coupon[]
  selectedCouponId: string
}>()

defineEmits(['select-coupon'])

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<style scoped lang="scss">
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
