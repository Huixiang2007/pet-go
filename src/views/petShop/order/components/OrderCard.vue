<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
    <!-- 订单头部 -->
    <div
      class="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
    >
      <div>
        <p class="text-gray-500 text-sm">
          订单编号：<span class="text-gray-700">{{ order.orderSn }}</span>
        </p>
        <p class="text-gray-400 text-xs mt-1">{{ order.date }}</p>
      </div>
      <span
        class="px-3 py-1 rounded-full text-xs font-medium"
        :class="getStatusClass(order.statusType)"
      >
        {{ order.status }}
      </span>
    </div>

    <!-- 商品信息 -->
    <div class="p-2">
      <div class="flex items-start gap-4">
        <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
          <img :src="order.product.image" alt="商品图片" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-gray-800 font-medium truncate">{{ order.product.name }}</h4>
          <p class="text-gray-500 text-xs mt-1 line-clamp-2">{{ order.product.spec }}</p>
          <div class="mt-3 flex justify-between items-center">
            <p class="text-gray-900 font-medium">¥{{ order.price }}</p>
            <p class="text-gray-500 text-sm">x{{ order.quantity }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单底部 -->
    <div
      class="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <p class="text-gray-500 text-sm">实付款</p>
        <p class="text-orange-500 font-bold text-lg mt-0.5">¥{{ order.total }}</p>
      </div>

      <div class="flex flex-wrap gap-2 self-end sm:self-auto">
        <!-- 查看详情 -->
        <button
          class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50"
          @click="openDetailDialog"
        >
          查看详情
        </button>

        <!-- 待付款 -->
        <template v-if="order.statusType === 'pending'">
          <button
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm"
            @click="handleCancelOrder"
          >
            取消订单
          </button>
          <button
            class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
            @click="openPayDialog"
          >
            立即付款
          </button>
        </template>
        <!-- //代发货状态 -->
        <template v-else-if="order.statusType === 'shipping'">
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
            @click="openRefundDialog"
          >
            申请退款
          </button>
        </template>
        <!-- // 待收货状态 -->
        <template v-else-if="order.statusType === 'receiving'">
          <router-link
            :to="`/package-info/?id=${order.orderSn}`"
            class="px-4 py-2 border rounded-lg text-sm"
            >查看物流</router-link
          >
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
            @click="openRefundDialog"
          >
            申请退款
          </button>
          <button
            class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
            @click="handleConfirmReceive"
          >
            确认收货
          </button>
        </template>
        <template v-else-if="order.statusType === 'returning'">
          <el-button size="mini" type="primary" @click="handleUserRefundDelivery(order)">
            确认发货
          </el-button>
        </template>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <PayPopup
      v-model="payDialogVisible"
      :order-no="order.orderSn"
      :calculate-total-price="order.total"
      :user-balance="userBalance"
      @pay-success="handlePaySuccess"
    />

    <!-- 退款弹窗 -->

    <div
      v-if="refundVisible"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100"
      >
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-800">申请退款</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="refundVisible = false">
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>
        <form class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">订单编号</label>
            <input
              type="text"
              :value="order.orderSn"
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              disabled
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">商品名称</label>
            <input
              type="text"
              :value="order.product.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">退款类型</label>
            <select
              v-model="refundForm.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">请选择退款类型</option>
              <option value="1">仅退款</option>
              <option value="2">退货退款</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">退款金额</label>
            <input
              v-model="refundForm.amount"
              type="number"
              :max="order.total"
              :min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="请输入退款金额"
            />
            <p class="text-xs text-gray-500 mt-1">最多可退 ¥{{ order.total }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">退款原因</label>
            <select
              v-model="refundForm.reason"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">请选择退款原因</option>
              <option value="长时间未发货">长时间未发货</option>
              <option value="商品错发/漏发">商品错发/漏发</option>
              <option value="商品质量问题">商品质量问题</option>
              <option value="不需要了/拍错了">不需要了/拍错了</option>
              <option value="其他原因">其他原因</option>
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-1">退款说明</label>
            <textarea
              v-model="refundForm.description"
              rows="3"
              placeholder="请简要说明退款原因..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          <button
            type="button"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            @click="submitRefund"
            :disabled="!refundForm.type || !refundForm.amount || !refundForm.reason"
          >
            提交退款申请
          </button>
        </form>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <teleport to="body">
      <el-dialog v-model="detailVisible" title="订单详情" width="600px">
        <div class="space-y-4 p-2">
          <el-skeleton :loading="loadingDetail" animated>
            <template #template>
              <div class="space-y-4">
                <div class="h-4 skeleton-block"></div>
                <div class="h-4 skeleton-block"></div>
                <div class="h-4 skeleton-block"></div>
              </div>
            </template>
            <template #default>
              <div class="space-y-4 text-sm">
                <p>
                  <span class="w-24 inline-block text-gray-500">订单编号</span>
                  {{ orderDetailData?.orderSn }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">创建时间</span>
                  {{ orderDetailData?.createTime }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">订单状态</span>
                  {{ orderDetailData?.orderStatus }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">评价状态</span>
                  {{ orderDetailData?.commentStatus || '暂无' }}
                </p>

                <div class="border-t pt-3"></div>

                <p>
                  <span class="w-24 inline-block text-gray-500">商品名称</span>
                  {{ orderDetailData?.productName }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">商品规格</span>
                  {{ orderDetailData?.specText || '无规格' }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">购买数量</span>
                  {{ orderDetailData?.quantity || order.quantity }} 件
                </p>

                <div class="border-t pt-3"></div>

                <p>
                  <span class="w-24 inline-block text-gray-500">商品单价</span>
                  ¥{{ orderDetailData?.price || order.price }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">优惠金额</span>
                  ¥{{ orderDetailData?.discountAmount || 0 }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">运费</span>
                  ¥{{ orderDetailData?.freightAmount || 0 }}
                </p>

                <div class="border-t pt-3"></div>

                <p>
                  <span class="w-24 inline-block text-gray-500">支付方式</span>
                  {{ orderDetailData?.payType }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">支付状态</span>
                  {{ orderDetailData?.payStatus }}
                </p>
                <p>
                  <span class="w-24 inline-block text-gray-500">支付时间</span>
                  {{ orderDetailData?.payTime || '未支付' }}
                </p>

                <p>
                  <span class="w-24 inline-block text-gray-500">店铺名称</span>
                  {{ orderDetailData?.shopName }}
                </p>

                <p v-if="orderDetailData?.receiveTime">
                  <span class="w-24 inline-block text-gray-500">确认收货时间</span>
                  {{ orderDetailData.receiveTime }}
                </p>
              </div>
            </template>
          </el-skeleton>
        </div>
      </el-dialog>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  cancelOrder,
  confirmOrder,
  orderDetail,
  userRefundDelivery,
  payOrder,
  applyRefund,
} from '@/api/pet-shop/order'
import PayPopup from './order-pay/PayPopup.vue'
import { getBalance } from '@/api/foster-care/book'

const emit = defineEmits(['refresh'])

export interface Order {
  id: string
  orderSn: string
  date: string
  status: string
  statusType:
    | 'pending'
    | 'shipping'
    | 'receiving'
    | 'completed'
    | 'received'
    | 'returning'
    | 'reviewing'
    | 'cancelled'
  product: { name: string; image: string; spec: string }
  price: number
  quantity: number
  total: number
}

const props = defineProps<{ order: Order }>()

// 支付
const payDialogVisible = ref(false)
const openPayDialog = () => {
  payDialogVisible.value = true
}

const handlePaySuccess = async () => {
  try {
    const res = await payOrder({ orderSn: props.order.orderSn })
    if (res?.success) {
      ElMessage.success('支付成功')
      emit('refresh')
      payDialogVisible.value = false
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('支付失败')
  }
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
onMounted(() => {
  getUserBalance()
})
//用户确认发货
const handleUserRefundDelivery = (order: Order) => {
  ElMessageBox.confirm('确认已经将商品寄回给商家吗？', '确认发货', {
    confirmButtonText: '确认发货',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await userRefundDelivery(props.order.id)
      console.log('确认发货', order.id)
      if (res?.ok) {
        ElMessage.success('确认发货成功！')
        emit('refresh')
      } else {
        ElMessage.error(res?.msg || '确认发货失败')
      }
    } catch (e) {
      console.error('确认发货失败：', e)
      ElMessage.error('确认发货失败，请稍后重试')
    }
  })
}

// 取消订单
const handleCancelOrder = async () => {
  try {
    const res = await cancelOrder({ orderSn: props.order.orderSn })
    if (res?.success) {
      ElMessage.success('取消成功')
      emit('refresh')
    }
  } catch (e) {
    console.error('取消订单失败：', e)
    ElMessage.error('取消失败')
  }
}

//退款
const refundVisible = ref(false)
const refundForm = ref({
  type: '',
  amount: 0,
  reason: '',
  description: '',
})

const openRefundDialog = () => {
  refundVisible.value = true
  refundForm.value = {
    type: '',
    amount: 0,
    reason: '',
    description: '',
  }
}

const submitRefund = async () => {
  if (!refundForm.value.type || !refundForm.value.amount || !refundForm.value.reason) {
    ElMessage.warning('请填写完整的退款信息')
    return
  }

  try {
    const refundData = {
      orderSn: props.order.orderSn,
      refundType: refundForm.value.type,
      refundAmount: refundForm.value.amount,
      reason: refundForm.value.reason,
      images: '',
    }

    const res = await applyRefund(refundData)
    if (res?.ok) {
      ElMessage.success('退款申请已提交')
      refundVisible.value = false
      emit('refresh')
    } else {
      ElMessage.error(res?.msg || '退款申请失败')
    }
  } catch (e) {
    console.error('退款申请失败：', e)
    ElMessage.error('退款申请失败，请稍后重试')
  }
}

//  订单详情
const detailVisible = ref(false)
const orderDetailData = ref<any>(null)
const loadingDetail = ref(false)

const openDetailDialog = async () => {
  loadingDetail.value = true
  try {
    const res = await orderDetail(props.order.orderSn)
    if (res?.ok === true) {
      orderDetailData.value = res.data
      detailVisible.value = true
    }
  } catch (e) {
    console.error('获取详情失败：', e)
    ElMessage.error('获取详情失败')
  } finally {
    loadingDetail.value = false
  }
}

// 确认收货
const handleConfirmReceive = async () => {
  try {
    const res = await confirmOrder(props.order.orderSn)
    if (res?.ok) {
      ElMessage.success('确认收货成功')
      emit('refresh')
    } else {
      ElMessage.error(res?.msg || '确认收货失败')
    }
  } catch (e) {
    console.error('确认收货失败：', e)
    ElMessage.error('确认收货失败，请稍后重试')
  }
}

const getStatusClass = computed(() => (type: Order['statusType']) => {
  const map = {
    pending: 'bg-yellow-50 text-yellow-700',
    shipping: 'bg-blue-50 text-blue-700',
    receiving: 'bg-purple-50 text-purple-700',
    completed: 'bg-green-50 text-green-700',
    received: 'bg-gray-50 text-gray-700',
    returning: 'bg-red-50 text-red-700',
    reviewing: 'bg-orange-50 text-orange-700',
    cancelled: 'bg-gray-50 text-gray-700',
  }
  return map[type] || ''
})
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.skeleton-block {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
