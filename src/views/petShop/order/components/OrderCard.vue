<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
    <!-- 订单头部 -->
    <div
      class="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
    >
      <div>
        <p class="text-gray-500 text-sm">
          订单编号：<span class="text-gray-700">{{ order.id }}</span>
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
        <button
          class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
        >
          查看详情
        </button>

        <!-- 待付款状态-->
        <template v-if="order.statusType === 'pending'">
          <button
            class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            取消订单
          </button>
          <router-link
            :to="`/order/?id=${order.id}`"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            立即付款
          </router-link>
        </template>

        <!-- 待发货状态-->
        <template v-else-if="order.statusType === 'shipping'">
          <button
            class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            提醒发货
          </button>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            @click="openRefundModal"
          >
            申请退款
          </button>
        </template>

        <!-- 待收货状态 -->
        <template v-else-if="order.statusType === 'receiving'">
          <router-link
            :to="`/package-info/?id=${order.id}`"
            class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            查看物流
          </router-link>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            @click="openRefundModal"
          >
            申请退款
          </button>
          <button
            class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            确认收货
          </button>
        </template>

        <!-- 已发货状态 -->
        <template v-else-if="order.statusType === 'completed'">
          <router-link
            :to="`/package-info/?id=${order.id}`"
            class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            查看物流
          </router-link>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            @click="aftersaleStatus = true"
          >
            申请售后
          </button>
        </template>

        <!-- 已收货状态 -->
        <template v-else-if="order.statusType === 'received'">
          <router-link
            to="/customer-service"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            联系客服
          </router-link>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            @click="aftersaleStatus = true"
          >
            申请售后
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            @click="commentStatus = true"
          >
            评价商品
          </button>
        </template>

        <!-- 退货中状态 -->
        <template v-else-if="order.statusType === 'returning'">
          <router-link
            :to="`/package-info/?id=${order.id}`"
            class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            查看进度
          </router-link>
          <router-link
            to="/customer-service"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            联系客服
          </router-link>
        </template>
      </div>
    </div>
  </div>

  <!-- 售后弹窗 -->
  <teleport to="body">
    <!-- 申请退货弹窗 -->
    <div
      v-if="aftersaleStatus"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100"
      >
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-800">申请售后</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="aftersaleStatus = false">
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>
        <form class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">订单编号</label>
            <input
              type="text"
              :value="order.id"
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
            <label class="block text-gray-700 text-sm font-medium mb-1">售后类型</label>
            <select
              v-model="aftersaleForm.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">请选择售后类型</option>
              <option value="refund">仅退款</option>
              <option value="return">退货退款</option>
              <option value="exchange">换货</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">退款金额</label>
            <input
              type="text"
              :value="order.total"
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">问题描述</label>
            <textarea
              v-model="aftersaleForm.description"
              rows="3"
              placeholder="请详细描述您的问题..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          <div
            class="mb-4"
            v-if="aftersaleForm.type === 'return' || aftersaleForm.type === 'exchange'"
          >
            <label class="block text-gray-700 text-sm font-medium mb-1">选择物流公司</label>
            <select
              v-model="aftersaleForm.logisticsCompany"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">请选择物流公司</option>
              <option value="顺丰">顺丰</option>
              <option value="圆通">圆通</option>
              <option value="韵达">韵达</option>
              <option value="中通">中通</option>
              <option value="申通">申通</option>
              <option value="百世">百世</option>
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-1">上传凭证（选填）</label>
            <div class="flex flex-wrap gap-2">
              <label
                class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input type="file" multiple class="hidden" accept="image/*" />
                <i class="fa fa-plus text-gray-400 text-xl"></i>
              </label>
              <div
                v-for="(img, index) in aftersaleForm.uploadedImages"
                :key="index"
                class="w-16 h-16 rounded-md overflow-hidden"
              >
                <img :src="img" alt="凭证图片" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <button
            type="button"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            @click="submitAftersale"
          >
            提交售后申请
          </button>
        </form>
      </div>
    </div>

    <!-- 申请退款弹窗 -->
    <div
      v-if="refundStatus"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100"
      >
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-800">申请退款</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="refundStatus = false">
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>
        <form class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">订单编号</label>
            <input
              type="text"
              :value="order.id"
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
              <option value="full">全额退款</option>
              <option value="partial">部分退款</option>
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
              <option value="no_delivery">长时间未发货</option>
              <option value="wrong_product">商品错发/漏发</option>
              <option value="quality_issue">商品质量问题</option>
              <option value="no_need">不需要了/拍错了</option>
              <option value="other">其他原因</option>
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

    <!-- 评论的弹窗 -->
    <div
      v-if="commentStatus"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100"
      >
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-800">评价商品</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="commentStatus = false">
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>
        <form class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">订单编号</label>
            <input
              type="text"
              :value="order.id"
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
            <label class="block text-gray-700 text-sm font-medium mb-2">商品评分</label>
            <el-rate v-model="commentForm.score" clearable />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">评价内容</label>
            <textarea
              v-model="commentForm.content"
              rows="3"
              placeholder="请评价商品..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-1">上传商品图片（选填）</label>
            <div class="flex flex-wrap gap-2">
              <label
                class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input type="file" multiple class="hidden" accept="image/*" />
                <i class="fa fa-plus text-gray-400 text-xl"></i>
              </label>
            </div>
          </div>

          <button
            type="button"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            @click="submitComment"
            :disabled="!commentForm.score"
          >
            提交评价
          </button>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export interface Order {
  id: string
  date: string
  status: string
  statusType: 'pending' | 'shipping' | 'receiving' | 'completed' | 'received' | 'returning'
  product: {
    name: string
    image: string
    spec: string
  }
  price: number
  quantity: number
  total: number
}

const props = defineProps<{
  order: Order
}>()

const aftersaleStatus = ref(false)
const refundStatus = ref(false)
const commentStatus = ref(false)

const getStatusClass = computed(() => {
  return (statusType: Order['statusType']) => {
    const statusMap = {
      pending: 'bg-yellow-50 text-yellow-700',
      shipping: 'bg-blue-50 text-blue-700',
      receiving: 'bg-purple-50 text-purple-700',
      completed: 'bg-green-50 text-green-700',
      received: 'bg-green-50 text-green-700',
      returning: 'bg-red-50 text-red-700',
    }
    return statusMap[statusType] || 'bg-gray-50 text-gray-700'
  }
})

const openRefundModal = () => {
  refundStatus.value = true
}

const aftersaleForm = ref({
  type: '',
  description: '',
  logisticsCompany: '',
  uploadedImages: [] as string[],
})

const refundForm = ref({
  type: '',
  amount: 0,
  reason: '',
  description: '',
})

const commentForm = ref({
  score: 0,
  content: '',
})

const submitAftersale = () => {
  if (!aftersaleForm.value.type) {
    ElMessage.warning('请选择售后类型')
    return
  }
  if (!aftersaleForm.value.description) {
    ElMessage.warning('请填写问题描述')
    return
  }

  // 模拟提交
  ElMessage.success('售后申请提交成功，我们会尽快处理')
  aftersaleStatus.value = false
  // 重置表单
  aftersaleForm.value = {
    type: '',
    description: '',
    logisticsCompany: '',
    uploadedImages: [],
  }
}

const submitRefund = () => {
  if (refundForm.value.amount <= 0 || refundForm.value.amount > props.order.total) {
    ElMessage.warning(`退款金额需在 0 到 ${props.order.total} 之间`)
    return
  }

  ElMessage.success('退款申请提交成功，我们会尽快审核')
  refundStatus.value = false
  refundForm.value = {
    type: '',
    amount: 0,
    reason: '',
    description: '',
  }
}

// 提交评价
const submitComment = () => {
  if (!commentForm.value.content) {
    ElMessage.warning('请填写评价内容')
    return
  }
  ElMessage.success('评价提交成功，感谢您的反馈')
  commentStatus.value = false
  commentForm.value = {
    score: 0,
    content: '',
  }
}
</script>

<style scoped>
.scale-100 {
  transform: scale(1);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
:deep(.el-rate) {
  --el-rate-icon-color: #f5a623;
  --el-rate-text-color: #666;
}
</style>
