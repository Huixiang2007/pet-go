<template>
  <NavBar />
  <div class="min-h-screen bg-yellow-50">
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

    <main class="order-container mx-auto px-4 py-8 flex flex-row justify-center">
      <div class="flex flex-col items-between w-[60%]">
        <div class="mr-4">
          <AddressSelector
            :address-list="addressList"
            @set-default="setDefaultAddress"
            @jump-to-address="jumpToAddressManage"
          />
          <CouponSelector :coupons="coupons" @select-coupon="selectCoupon" />
        </div>

        <OrderSummary
          :goods="selectedGoods"
          :shipping-fee="shippingFee"
          :discount="selectedDiscount"
          :total-price="totalPrice"
          @confirm-pay="confirmOrder"
          @update:agreementAccepted="agreementAccepted = $event"
        />
      </div>

      <div class="w-[40%]">
        <GoodsList
          :goods="selectedGoods"
          @update:goods="updateGoods"
          @update:remark="orderRemark = $event"
        />
      </div>
    </main>

    <el-loading v-if="loading" fullscreen text="确认订单中..." />
    <!-- 支付弹窗 -->
    <PayPopup
      v-model="payDialogVisible"
      :order-no="orderNo"
      :calculate-total-price="totalPrice"
      :user-balance="userBalance"
      @go-to-recharge="handleGoToRecharge"
      @pay-success="handlePay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AddressSelector from './components/order-pay/AddressSelector.vue'
import CouponSelector from './components/order-pay/CouponSelector.vue'
import OrderSummary from './components/order-pay/OrderSummary.vue'
import GoodsList from './components/order-pay/GoodsList.vue'
import { getBalance } from '@/api/foster-care/book'

import { ElMessage, ElLoading } from 'element-plus'
import {
  submitOrder,
  getAddressList,
  getDefaultAddress,
  updateDefaultAddress,
  payOrder,
  payOrderCart,
} from '@/api/pet-shop/order'
import { getProductDetail } from '@/api/pet-shop/product'
import PayPopup from '@/views/petShop/order/components/order-pay/PayPopup.vue'
import { getCartItems } from '@/api/pet-shop/order'
import router from '@/router/index'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(false)
const orderRemark = ref('')
// 支付弹窗状态
const payDialogVisible = ref(false)
const orderNo = ref('')
// 订单核心
const selectedGoods = ref([])
const addressList = ref([])
const shippingFee = ref(0)
const selectedDiscount = ref(0)
const purchaseType = ref('立即购买')

// 购物车 / 立即购买id
const type = ref('')

// 加载数据
onMounted(() => {
  const productId = route.query.id as string
  const skuId = route.query.sku as string
  const qty = route.query.qty as string
  type.value = route.query.type as string

  if (productId) {
    purchaseType.value = type.value === 'buyNow' ? '立即购买' : '购物车购买'
    loadGoods(productId, skuId, qty) // 传参进去
  } else {
    purchaseType.value = type.value === 'buyNow' ? '立即购买' : '购物车购买'
    loadGoodsFromCart()
  }

  loadAddress()
  loadDefaultAddress()
  getUserBalance()
})
//立即购买加载商品
const loadGoods = async (id: string, skuId: string, qty: string) => {
  try {
    const res = await getProductDetail(id)
    if (res) {
      selectedGoods.value = [
        {
          id: res.id,
          name: res.name || res.title,
          spec: res.subTitle || '默认规格',
          price: res.currentPrice,
          quantity: Number(qty) || 1,
          image: res.mainImage,
          skuId: skuId,
        },
      ]
    }
  } catch (e) {
    console.error('加载商品失败', e)
  }
}
const pageNum = ref(1)
const pageSize = ref(10000)
const selectStatus = ref('1') // 选中状态(1-选中)
const loadGoodsFromCart = async () => {
  try {
    const res = await getCartItems(pageNum.value, pageSize.value, selectStatus.value)
    console.log('购物车接口返回数据:', res)
    if (res) {
      selectedGoods.value = res.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        spec: item.skuSpecText,
        price: item.price,
        quantity: item.quantity,
        image: item.mainImage,
        skuId: item.skuId,
        stock: item.stock,
        shopName: item.shopName,
      }))
      console.log('处理后购物车商品:', selectedGoods.value)
    }
  } catch (e) {
    console.error('加载购物车商品失败', e)
    ElMessage.error('加载购物车商品失败')
  }
}
// 地址
const loadAddress = async () => {
  try {
    const res = await getAddressList({})
    if (res.ok) {
      addressList.value = res.data.list.map((item: any) => ({
        id: item.id,
        name: item.receiverName,
        phone: item.receiverPhone,
        address: item.detailAddress,
        addressDetail: item.detailAddress,
        isDefault: item.isDefault === '默认地址',
        province: item.province,
        city: item.city,
        district: item.district,
      }))
    }
  } catch (e) {
    console.error('加载地址失败:', e)
  }
}

const loadDefaultAddress = async () => {
  const res = (await getDefaultAddress()) as any
  if (res) {
    addressList.value.forEach((i) => (i.isDefault = i.id === res.id))
  }
}

const setDefaultAddress = async (id: number) => {
  addressList.value.forEach((i) => (i.isDefault = i.id === id))
  await updateDefaultAddress(id + '')
  ElMessage.success('默认地址已更新')
}

// 优惠券
const coupons = ref([
  { id: 1, discount: '满199减30', isSelected: false },
  { id: 2, discount: '满99减10', isSelected: true },
])

const selectCoupon = (id: number) => {
  coupons.value.forEach((c) => (c.isSelected = c.id === id))
  const c = coupons.value.find((v) => v.id === id)
  selectedDiscount.value = c?.discount.includes('30') ? 30 : 10
}

// 总价
const totalPrice = computed(() => {
  const sum = selectedGoods.value.reduce((s, g) => s + g.price * g.quantity, 0)
  return Math.max(0, sum + shippingFee.value - selectedDiscount.value)
})
const agreementAccepted = ref(false)
const updateGoods = (val: any) => (selectedGoods.value = val)
// 确认订单
let orderNos: string[] = []
const confirmOrder = async () => {
  const addr = addressList.value.find((a) => a.isDefault)
  if (!addr) {
    ElMessage.warning('请选择收货地址')
    return
  }
  if (!agreementAccepted.value) {
    ElMessage.warning('请同意服务协议')
    return
  }

  loading.value = true
  try {
    const isBuyNow = !!route.query.id
    const finalPurchaseType = isBuyNow ? '立即购买' : '购物车购买'
    const baseParams = {
      purchaseType: finalPurchaseType,
      addressId: addr.id + '',
      couponIds: coupons.value.filter((c) => c.isSelected).map((c) => c.id + ''),
      payType: '支付宝',
      orderRemark: orderRemark.value ? orderRemark.value : '',
    }

    let finalParams = {}
    if (isBuyNow) {
      const goods = selectedGoods.value[0] // 立即购买只有1个商品
      finalParams = {
        ...baseParams,
        productId: goods.id + '',
        skuId: goods.skuId,
        quantity: goods.quantity,
      }
    } else {
      finalParams = {
        ...baseParams,
        cartIds: selectedGoods.value.map((g) => g.id + ''), // 购物车ID列表
      }
    }
    console.log('最终请求参数：', finalParams)
    const res = await submitOrder(finalParams)
    console.log('确认订单响应：', res)
    if (res.ok) {
      ElMessage.success('确认订单成功！订单已生成，待支付')
      payDialogVisible.value = true
      const orderNoMatch = res.data.match(/\[([^\]]+)\]/)
      if (!orderNoMatch || !orderNoMatch[1]) {
        ElMessage.error('订单创建成功，但订单号提取失败')
        return
      }

      const orderNoStr = orderNoMatch[1]
      orderNos = orderNoStr.split(',').map((item) => item.trim())

      console.log('订单号：', orderNos)
    } else {
      ElMessage.error(res.msg || '确认订单失败')
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('确认订单异常')
  } finally {
    loading.value = false
  }
}
const handlePay = async () => {
  const type = route.query.type as string

  if (type === 'buyNow') {
    if (!orderNos.length) {
      ElMessage.error('订单号不存在')
      return
    }

    try {
      const res = await payOrder({
        orderSn: orderNos[0],
      })

      if (res.ok) {
        ElMessage.success('支付成功')
        payDialogVisible.value = false
        setTimeout(() => router.push('/order-list'), 1500)
      } else {
        ElMessage.error(res.msg || '支付失败')
      }
    } catch (e) {
      console.error('支付异常:', e)
      ElMessage.error('支付异常')
    }
  } else {
    if (!orderNos.length) {
      ElMessage.error('订单号不存在')
      return
    }

    try {
      const res = await payOrderCart(orderNos)

      if (res.ok) {
        ElMessage.success('支付成功')
        payDialogVisible.value = false
        setTimeout(() => router.push('/order-list'), 1500)
      } else {
        ElMessage.error(res.msg || '支付失败')
      }
    } catch (e) {
      console.error('支付异常:', e)
      ElMessage.error('支付异常')
    }
  }
}
//充值
const handleGoToRecharge = () => {
  ElMessage.info('跳转到充值页面')
  router.push('/recharge')
}
//获取余额支付金额
const userBalance = ref(0)
const getUserBalance = async () => {
  try {
    const res = await getBalance()
    if (res.code === 0) {
      userBalance.value = res.data
    }
  } catch (error) {
    console.error('获取余额失败：', error)
    ElMessage.error('获取账户余额失败，请稍后重试')
  }
}
const jumpToAddressManage = () => router.push('/persons')
</script>

<style scoped lang="scss">
.order-container {
  max-width: 1200px;
  width: 1300px;
}
</style>
