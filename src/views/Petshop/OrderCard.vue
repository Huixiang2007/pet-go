<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
    <!-- 订单头部 -->
    <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <p class="text-gray-500 text-sm">订单编号：<span class="text-gray-700">{{ order.id }}</span></p>
        <p class="text-gray-400 text-xs mt-1">{{ order.date }}</p>
      </div>
      <span
        class="px-3 py-1 rounded-full text-xs font-medium"
        :class="order.statusType === 'pending'
        ? 'bg-yellow-50 text-yellow-700'
        : order.statusType === 'shipping'
          ? 'bg-blue-50 text-blue-700'
          : order.statusType === 'receiving'
            ? 'bg-purple-50 text-purple-700'
            : order.statusType === 'completed'
              ? 'bg-green-50 text-green-700'
              : order.statusType === 'received'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'"
    >
        {{ order.status }}
      </span>
    </div>

    <!-- 商品信息 -->
    <div class="p-2">
      <div class="flex items-start gap-4">
        <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
          <img :src="order.product.image" alt="商品图片" class="w-full h-full object-cover">
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
    <div class="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p class="text-gray-500 text-sm">实付款</p>
        <p class="text-orange-500 font-bold text-lg mt-0.5">¥{{ order.total }}</p>
      </div>

      <div class="flex flex-wrap gap-2 self-end sm:self-auto">
        <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
          查看详情
        </button>

        <!-- 待付款状态-->
        <template v-if="order.statusType === 'pending'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            取消订单
          </button>
          <button class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            立即付款
          </button>
        </template>

        <!-- 待发货状态-->
        <template v-else-if="order.statusType === 'shipping'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            提醒发货
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            申请退款
          </button>
        </template>

        <!-- 待收货状态 -->
        <template v-else-if="order.statusType === 'receiving'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            查看物流
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            申请退款
          </button>
          <button class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            确认收货
          </button>
        </template>

        <!-- 已发货状态 -->
        <template v-else-if="order.statusType === 'completed'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            查看物流
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors" @click="aftersaleStatus = true">
            申请售后
          </button>
        </template>

        <!-- 已收货状态 -->
        <template v-else-if="order.statusType === 'received'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            查看物流
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors" @click="aftersaleStatus = true">
            申请售后
          </button>
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
            评价商品
          </button>
        </template>

        <!-- 退货中状态 -->
        <template v-else-if="order.statusType === 'returning'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            查看进度
          </button>
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
            联系客服
          </button>
        </template>
      </div>
    </div>
  </div>
    <!-- 售后的弹窗 -->
  <div v-if="aftersaleStatus==true"
   class="fixed inset-0 overflow-y-auto z-[200] flex items-center justify-center bg-black/50" style="margin-top: -4px;">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform scale-95 transition-transform duration-300">
      <div class="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 class="text-xl font-bold text-gray-800">申请售后</h3>
        <button id="close-modal" class="text-gray-500 hover:text-gray-700">
          <i class="fa fa-times text-xl" @click="aftersaleStatus = false"></i>
        </button>
      </div>
      <form id="aftersale-form" class="p-6">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-1">订单编号</label>
          <input type="text" value={{order.id}}  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed" disabled>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-1">商品名称</label>
          <input type="text" value="天然无谷狗粮 1.5kg" class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed" disabled>
        </div>

        <!-- 售后类型选择 -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-1">售后类型</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">请选择售后类型</option>
            <option value="refund">仅退款</option>
            <option value="return">退货退款</option>
            <option value="exchange">换货</option>
          </select>
        </div>

          <!-- 退款的价格 -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-1">退款金额</label>
          <input type="text" value={{order.total}} class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed" disabled>
        </div>


        <!-- 问题描述 -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-1">问题描述</label>
          <textarea rows="3" placeholder="请详细描述您的问题..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-1">选择物流公司</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">请选择物流公司</option>
            <option value="顺丰">顺丰</option>
            <option value="圆通">圆通</option>
            <option value="韵达">韵达</option>
            <option value="中通">中通</option>
            <option value="申通">申通</option>
            <option value="百世">百世</option>
          </select>
        </div>
        <!-- 上传凭证 -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-1">上传凭证（选填）</label>
          <div class="flex flex-wrap gap-2">
            <label class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="file" multiple class="hidden">
              <i class="fa fa-plus text-gray-400 text-xl"></i>
            </label>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button type="submit" class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
          提交售后申请
        </button>
      </form>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { ref } from 'vue';
// 售后状态
const aftersaleStatus = ref(false);

export interface Order {
  id: string;
  date: string;
  status: string;
  statusType: 'pending' | 'shipping' | 'receiving' | 'completed' | 'received' | 'returning';
  product: {
    name: string;
    image: string;
    spec: string;
  };
  price: number;
  quantity: number;
  total: number;
}

// 接受订单数据
defineProps<{
  order: Order;
}>();

</script>

<style scoped>
</style>
