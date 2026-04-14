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
            <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div class="p-5" @click="activeTab = 'orders'">
                <h3 class="text-lg font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-4">
                  订单状态
                </h3>
                <ul class="space-y-1">
                  <li v-for="(status, index) in statusFilters" :key="index">
                    <button @click="handleStatusChange(status.value)"
                      class="w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all" :class="activeStatus === status.value && activeTab === 'orders'
                        ? 'bg-orange-50 text-orange-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        ">
                      <span class="w-2.5 h-2.5 rounded-full mr-3" :class="activeStatus === status.value && activeTab === 'orders'
                        ? 'bg-orange-500'
                        : 'bg-gray-300'
                        "></span>
                      {{ status.label }}
                    </button>
                  </li>
                </ul>
              </div>

              <div class="border-t border-gray-100">
                <nav class="p-2">
                  <button @click="activeTab = 'keep-pet'"
                    class="w-full flex items-center px-3 py-2.5 rounded-lg transition-all mb-1" :class="activeTab === 'keep-pet'
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      ">
                    <i class="fa fa-comment w-5 text-center mr-3"></i>
                    寄养订单
                  </button>

                  <button @click="activeTab = 'coupons'"
                    class="w-full flex items-center px-3 py-2.5 rounded-lg transition-all mb-1" :class="activeTab === 'coupons'
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      ">
                    <i class="fa fa-ticket w-5 text-center mr-3"></i>
                    我的优惠券
                  </button>
                  <button @click="activeTab = 'comments'"
                    class="w-full flex items-center px-3 py-2.5 rounded-lg transition-all mb-1" :class="activeTab === 'comments'
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      ">
                    <i class="fa fa-comment w-5 text-center mr-3"></i>
                    评论管理
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          <main class="flex-1">
            <div v-if="activeTab === 'orders'">
              <div class="bg-white rounded-xl shadow-sm p-4 md:p-5 mb-6 transition-all hover:shadow-md">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div class="relative w-full sm:w-72">
                    <input v-model="searchKey" type="text" placeholder="搜索订单号/商品名称"
                      class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all"
                      @keyup.enter="fetchOrders()" />
                    <i class="fa fa-search absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div v-if="orders.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
                <div class="w-32 h-32 mx-auto mb-4 opacity-30">
                  <img src="https://picsum.photos/id/225/200/200" alt="暂无订单" class="w-full h-full object-contain" />
                </div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">暂无相关订单</h3>
                <p class="text-gray-500 mb-6 max-w-md mx-auto">
                  您还没有相关订单，快去挑选心仪的商品吧～
                </p>
                <router-link to="/petShop"
                  class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg transition-colors">
                  去逛逛
                </router-link>
              </div>
              <div v-else class="space-y-4">
                <OrderCard v-for="value in orders" :key="value.id" :order="value" @refresh="fetchOrders" />
              </div>
            </div>

            <div class="mt-8 mb-8" v-else-if="activeTab === 'coupons'">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-800">
                  <i class="fa fa-ticket text-[#FF7043] mr-2"></i>
                  我的优惠券
                </h2>
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
              </div>
              <div class="bg-white rounded-xl shadow-sm p-5">
                <Comments :page-num="pageNum" :page-size="pageSize" @page-change="handlePageChange"
                  @update:total="total = $event" />
              </div>
            </div>

            <div class="mt-8 mb-8" v-else-if="activeTab === 'keep-pet'">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-800">
                  <i class="fa fa-comment text-[#FF7043] mr-2"></i>
                  寄养管理
                </h2>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-5">
                <FosterOrderList />
              </div>
            </div>

            <div class="mt-6 flex justify-center">
              <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" page-sizes="[5, 10, 15, 20]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handlePageChange"
                @current-change="handlePageChange" />
            </div>
          </main>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderCard from './components/OrderCard.vue'
import { type Order } from '@/types/shop'
import Comments from './components/MyComments.vue'
import Coupons from './components/MyCoupons.vue'
import FosterOrderList from './components/FosterOrderList.vue'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyOrders } from '@/api/pet-shop/order'

// 状态变量
const activeStatus = ref<string | number>('all') // 支持 all/数字
const activeTab = ref('orders')
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKey = ref('')
const orders = ref<Order[]>([])
const loading = ref(false)

const statusMap = {
  all: 0, // 0表示全部
  pending: 1, // 待付款
  shipping: 2, // 待发货
  receiving: 3, // 待收货
  returning: 4, // 退款/售后
}

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {
      searchCount: true,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      current: pageNum.value,
      sortItemList: [{ isAsc: true, column: 'createTime' }],
      deliverySn: '',
      productName: searchKey.value,
      listStatus: activeStatus.value === 'all' ? 0 : statusMap[activeStatus.value],
    }

    const res = await getMyOrders(params)
    console.log('订单列表响应:', res)
    // 检查响应结构
    if (res && (res.code === 0 || res.ok || res.success)) {
      // 适配不同的响应结构
      const data = res.data || res
      console.log('订单列表数据:', data.list)
      // 转换数据结构
      orders.value = (data.list || []).map((item: any) => ({
        id: item.orderSn || item.id,
        date: item.createTime || new Date().toISOString(),
        status: item.orderStatus,
        statusType: mapOrderStatus(item.orderStatus),
        product: {
          name: item.productName,
          image: item.productMainImg,
          spec: item.specText,
        },
        price: item.payAmount / item.quantity || item.payAmount,
        quantity: item.quantity,
        total: item.totalAmount || item.payAmount,
      }))
      total.value = data.total || data.list.length
      console.log('处理后订单数据:', orders.value)
      console.log('总数量:', total.value)
    } else {
      console.log('响应状态异常:', res)
      ElMessage.error('获取订单失败')
    }
  } catch (err) {
    console.error('获取订单错误:', err)
    ElMessage.error('获取订单失败')
  } finally {
    loading.value = false
  }
}

// 订单状态映射
const mapOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    待付款: 'pending',
    待发货: 'shipping',
    待收货: 'receiving',
    已完成: 'completed',
    已收货: 'received',
    退货中: 'returning',
  }
  return statusMap[status] || 'pending'
}

// 分页/筛选变化
const handlePageChange = () => {
  fetchOrders()
}

// 状态筛选（修复版）
const handleStatusChange = (value: string | number) => {
  activeStatus.value = value
  pageNum.value = 1
  fetchOrders()
}

// 初始化
onMounted(() => {
  fetchOrders()
})

// 状态选项
const statusFilters = [
  { label: '全部订单', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待发货', value: 'shipping' },
  { label: '待收货', value: 'receiving' },
  { label: '退货中', value: 'returning' },
]
</script>

<style scoped>
.content-auto {
  content-visibility: auto;
}
</style>

<style scoped>
.content-auto {
  content-visibility: auto;
}
</style>
