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
              : 'bg-green-50 text-green-700'"
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

    <!-- 订单底部（动态按钮区域） -->
    <div class="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p class="text-gray-500 text-sm">实付款</p>
        <p class="text-orange-500 font-bold text-lg mt-0.5">¥{{ order.total }}</p>
      </div>

      <!-- 操作按钮组（根据订单状态动态显示） -->
      <div class="flex flex-wrap gap-2 self-end sm:self-auto">
        <!-- 通用按钮：查看详情（所有状态都显示） -->
        <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
          查看详情
        </button>

        <!-- 待付款状态（pending） -->
        <template v-if="order.statusType === 'pending'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            取消订单
          </button>
          <button class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            立即付款
          </button>
        </template>

        <!-- 待发货状态（shipping） -->
        <template v-else-if="order.statusType === 'shipping'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            提醒发货
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            申请退款
          </button>
        </template>

        <!-- 待收货状态（receiving） -->
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

        <!-- 已完成状态（completed） -->
        <template v-else-if="order.statusType === 'completed'">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            查看物流
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            申请售后
          </button>
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
            评价商品
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
export interface Order {
  id: string;
  date: string;
  status: string;
  statusType: 'pending' |'shipping' |'receiving' | 'completed';
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
