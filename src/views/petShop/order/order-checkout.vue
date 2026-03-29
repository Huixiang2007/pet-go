<!-- 订单结算主页面 -->
<template>
  <NavBar />
  <div class="min-h-screen bg-yellow-50">
    <!-- 步骤条 -->
    <div class="bg-white pt-24 pb-8 border-b border-gray-200">
      <div class="order-container mx-auto px-4">
        <div class="flex items-center justify-between max-w-3xl mx-auto">
          <div class="flex flex-col items-center">
            <div
              class="w-10 h-10 rounded-full bg-[#f3ce48] text-white flex items-center justify-center mb-2"
            >
              <i class="fa fa-shopping-cart"></i>
            </div>
            <span class="text-sm font-medium text-[#333333]">购物车</span>
          </div>
          <div class="flex-1 h-1 mx-2 bg-[#f3ce48]"></div>
          <div class="flex flex-col items-center">
            <div
              class="w-10 h-10 rounded-full bg-[#f3ce48] text-white flex items-center justify-center mb-2"
            >
              <i class="fa fa-map-marker"></i>
            </div>
            <span class="text-sm font-medium text-[#333333]">确认订单</span>
          </div>
          <div class="flex-1 h-1 mx-2 bg-gray-200"></div>
          <div class="flex flex-col items-center">
            <div
              class="w-10 h-10 rounded-full bg-gray-200 text-white flex items-center justify-center mb-2"
            >
              <i class="fa fa-credit-card"></i>
            </div>
            <span class="text-sm font-medium text-[#333333]">支付</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心内容区 -->
    <main class="order-container mx-auto px-4 py-8 flex flex-row justify-center">
      <div class="flex flex-col items-between w-[60%]">
        <div class="mr-4">
          <AddressSelector
            :address-list="addressList"
            @set-default="setDefaultAddress"
            @jump-to-address="jumpToAddressManage"
          />
          <!-- 优惠券选择组件 -->
          <CouponSelector :coupons="coupons" @select-coupon="selectCoupon" />
        </div>
        <!-- 订单摘要组件 -->
        <OrderSummary @confirm-pay="openPayPopup" />
      </div>
      <div class="w-[40%]">
        <GoodsList />
      </div>
    </main>

    <!-- 支付确认弹窗 -->
    <PayPopup
      v-model="showPayDialog"
      :order-no="orderNo"
      :calculate-total-price="totalPrice"
      :user-balance="userBalance"
      @go-to-recharge="handleGoToRecharge"
      @pay-success="handlePaySuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AddressSelector from './components/order-pay/AddressSelector.vue'
import CouponSelector from './components/order-pay/CouponSelector.vue'
import OrderSummary from './components/order-pay/OrderSummary.vue'
import GoodsList from './components/order-pay/GoodsList.vue'
import PayPopup from './components/order-pay/PayPopup.vue'
import router from '@/router/index'
// 弹窗状态
const showPayDialog = ref(false)
const orderNo = ref('20250518000123456')
const totalPrice = ref(179.7)
const userBalance = ref(200)

// 前往充值
const handleGoToRecharge = () => {
  alert('跳转至充值页面')
}

const handlePaySuccess = () => {
  alert('支付成功！')
}
//地址
interface Address {
  id: number
  name: string
  phone: string
  address: string
  addressDetail?: string
  isDefault: boolean
  province?: string
  city?: string
  district?: string
}
const addressList = ref<Address[]>([
  {
    id: 1,
    name: '张三',
    phone: '138****6789',
    address: '北京市朝阳区建国路88号',
    addressDetail: '现代城5号楼2307室',
    isDefault: true,
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
  },
  {
    id: 2,
    name: '李四',
    phone: '139****5678',
    address: '上海市浦东新区陆家嘴',
    addressDetail: '金融中心1号楼808室',
    isDefault: false,
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
  },
])

// 优惠券数据
const coupons = ref([
  {
    id: 1,
    discount: '满199减30',
    validity: '2023-12-31',
    isSelected: true,
  },
  {
    id: 2,
    discount: '满99减10',
    validity: '2023-12-15',
    isSelected: false,
  },
])
// 设置默认地址
const setDefaultAddress = (id: number) => {
  addressList.value.forEach((item) => {
    item.isDefault = item.id === id
  })
}

// 跳转至个人中心地址管理页
const jumpToAddressManage = () => {
  router.push('/persons')
  alert('跳转至个人中心-地址管理页')
}

// 选择优惠券
const selectCoupon = (selectedId: number) => {
  coupons.value.forEach((coupon) => {
    coupon.isSelected = coupon.id === selectedId
  })
}

// 打开支付弹窗
const openPayPopup = () => {
  showPayDialog.value = true
}
</script>

<style scoped lang="scss">
.order-container {
  max-width: 1200px;
  width: 1300px;
}
</style>
