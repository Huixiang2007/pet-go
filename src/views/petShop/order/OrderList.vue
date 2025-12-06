<template>
  <div class="bg-[#fefcea] min-h-screen">
    <NavBar />
    <div class="text-gray-800 pt-[50px]">
      <main class="mx-auto px-4">
        <div class="mb-8 mt-[20px]">
          <h1 class="text-xl font-bold flex items-center">
            <i class="fa fa-shopping-bag text-orange-500 mr-3"></i>
            我的订单
          </h1>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <aside class="lg:w-64 shrink-0">
            <div
              class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <div class="p-5" @click="activeTab = 'orders'">
                <h3 class="text-lg font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-4">
                  订单状态
                </h3>
                <ul class="space-y-1">
                  <li v-for="(status, index) in statusFilters" :key="index">
                    <button
                      @click="activeStatus = status.value"
                      class="w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all"
                      :class="
                        activeStatus === status.value && activeTab === 'orders'
                          ? 'bg-orange-50 text-orange-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      "
                    >
                      <span
                        class="w-2.5 h-2.5 rounded-full mr-3"
                        :class="
                          activeStatus === status.value && activeTab === 'orders'
                            ? 'bg-orange-500'
                            : 'bg-gray-300'
                        "
                      ></span>
                      {{ status.label }}
                    </button>
                  </li>
                </ul>
              </div>

              <div class="border-t border-gray-100">
                <nav class="p-2">
                  <a
                    href="/petCart"
                    class="flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all mb-1"
                  >
                    <i class="fa fa-shopping-cart w-5 text-center mr-3"></i>
                    我的购物车
                  </a>
                  <button
                    @click="activeTab = 'coupons'"
                    class="w-full flex items-center px-3 py-2.5 rounded-lg transition-all mb-1"
                    :class="
                      activeTab === 'coupons'
                        ? 'bg-orange-50 text-orange-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <i class="fa fa-ticket w-5 text-center mr-3"></i>
                    我的优惠券
                  </button>
                  <button
                    @click="activeTab = 'comments'"
                    class="w-full flex items-center px-3 py-2.5 rounded-lg transition-all mb-1"
                    :class="
                      activeTab === 'comments'
                        ? 'bg-orange-50 text-orange-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <i class="fa fa-comment w-5 text-center mr-3"></i>
                    评论管理
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          <main class="flex-1">
            <div v-if="activeTab === 'orders'">
              <div
                class="bg-white rounded-xl shadow-sm p-4 md:p-5 mb-6 transition-all hover:shadow-md"
              >
                <div
                  class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div class="relative w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="搜索订单号/商品名称"
                      class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all"
                    />
                    <i
                      class="fa fa-search absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                    ></i>
                  </div>
                </div>
              </div>

              <div v-if="orders.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
                <div class="w-32 h-32 mx-auto mb-4 opacity-30">
                  <img
                    src="https://picsum.photos/id/225/200/200"
                    alt="暂无订单"
                    class="w-full h-full object-contain"
                  />
                </div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">暂无相关订单</h3>
                <p class="text-gray-500 mb-6 max-w-md mx-auto">
                  您还没有相关订单，快去挑选心仪的商品吧～
                </p>
                <button
                  class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg transition-colors"
                >
                  去逛逛
                </button>
              </div>
              <div v-else class="space-y-4">
                <OrderCard v-for="value in filteredOrders" :key="value.id" :order="value" />
              </div>
            </div>

            <div class="mt-8 mb-8" v-else-if="activeTab === 'coupons'">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-800">
                  <i class="fa fa-ticket text-[#FF7043] mr-2"></i>
                  我的优惠券
                </h2>
                <a href="#" class="text-[#FF7043] text-sm hover:underline">查看全部</a>
              </div>
              <div class="rounded-xl shadow-sm p-5">
                <Coupons />
              </div>
            </div>

            <div class="mt-8 mb-8" v-else-if="activeTab === 'comments'">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-800">
                  <i class="fa fa-comment text-[#FF7043] mr-2"></i>
                  评论管理
                </h2>
                <a href="#" class="text-[#FF7043] text-sm hover:underline">查看全部</a>
              </div>

              <div class="bg-white rounded-xl shadow-sm p-5">
                <Comments />
              </div>
            </div>

            <div class="flex justify-center mt-8">
              <nav class="inline-flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  class="w-10 h-10 flex items-center justify-center text-gray-400 border-r border-gray-100 disabled:cursor-not-allowed"
                  disabled
                >
                  <i class="fa fa-chevron-left text-xs"></i>
                </button>
                <button
                  v-for="page in 5"
                  :key="page"
                  class="w-10 h-10 flex items-center justify-center transition-colors border-r border-gray-100 last:border-r-0"
                  :class="
                    page === 1 ? 'bg-orange-500 text-white' : 'hover:bg-gray-50 text-gray-700'
                  "
                >
                  {{ page }}
                </button>
                <button
                  class="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i class="fa fa-chevron-right text-xs"></i>
                </button>
              </nav>
            </div>
          </main>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderCard from './components/OrderCard.vue'
import { type Order } from './components/OrderCard.vue'
import Coupons from '../marketing/MyCoupons.vue'
import Comments from '../comment/MyComments.vue'
import { ref, computed } from 'vue'

// 筛选状态
const activeStatus = ref('all')
const activeTab = ref('orders')

// 筛选选项数据
const statusFilters = [
  { label: '全部订单', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待发货', value: 'shipping' },
  { label: '待收货', value: 'receiving' },
  { label: '已发货', value: 'completed' },
  { label: '已收货', value: 'received' },
  { label: '退货中', value: 'returning' },
]
const orders = ref<Order[]>([
  {
    id: '20240610001',
    date: '2024-06-10 14:30',
    status: '待发货',
    statusType: 'shipping',
    product: {
      name: '天然无谷狗粮 1.5kg',
      image: 'https://picsum.photos/id/237/200/200',
      spec: '口味：鸡肉味 | 适用年龄：成年犬',
    },
    price: 89,
    quantity: 1,
    total: 89,
  },

  {
    id: '20240610001',
    date: '2024-06-10 14:30',
    status: '待发货',
    statusType: 'pending',
    product: {
      name: '天然无谷狗粮 1.5kg',
      image: 'https://picsum.photos/id/237/200/200',
      spec: '口味：鸡肉味 | 适用年龄：成年犬',
    },
    price: 89,
    quantity: 1,
    total: 89,
  },
  {
    id: '20240610002',
    date: '2024-06-10 14:30',
    status: '待收货',
    statusType: 'receiving',
    product: {
      name: '天然无谷狗粮 1.5kg',
      image: 'https://picsum.photos/id/237/200/200',
      spec: '口味：鸡肉味 | 适用年龄：成年犬',
    },
    price: 89,
    quantity: 1,
    total: 89,
  },
  {
    id: '20240610003',
    date: '2024-06-10 14:30',
    status: '已收货',
    statusType: 'completed',
    product: {
      name: '天然无谷狗粮 1.5kg',
      image: 'https://picsum.photos/id/237/200/200',
      spec: '口味：鸡肉味 | 适用年龄：成年犬',
    },
    price: 89,
    quantity: 1,
    total: 89,
  },
  {
    id: '20240610002',
    date: '2024-06-10 14:30',
    status: '待收货',
    statusType: 'received',
    product: {
      name: '天然无谷狗粮 1.5kg',
      image: 'https://picsum.photos/id/237/200/200',
      spec: '口味：鸡肉味 | 适用年龄：成年犬',
    },
    price: 89,
    quantity: 1,
    total: 89,
  },
  {
    id: '20240610004',
    date: '2024-06-10 14:30',
    status: '待收货',
    statusType: 'returning',
    product: {
      name: '天然无谷狗粮 1.5kg',
      image: 'https://picsum.photos/id/237/200/200',
      spec: '口味：鸡肉味 | 适用年龄：成年犬',
    },
    price: 89,
    quantity: 1,
    total: 89,
  },
])
const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order) => order.statusType === activeStatus.value)
})
</script>

<style scoped>
.content-auto {
  content-visibility: auto;
}
</style>
