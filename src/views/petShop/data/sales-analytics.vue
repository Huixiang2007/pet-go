<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />

      <div class="flex-1 overflow-auto p-4 md:p-6">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800 flex items-center">
              <i class="fa fa-bar-chart text-[#f77e21] mr-2"></i>
              店铺数据统计
            </h2>
            <el-select
              v-model="timeType"
              size="small"
              style="width: 120px"
              @change="handleTimeChange"
            >
              <el-option label="今日" value="2" />
              <el-option label="近7天" value="7" />
              <el-option label="近30天" value="30" />
              <el-option label="近90天" value="90" />
            </el-select>
          </div>

          <!-- 顶部统计卡片 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-500">销售额 (元)</p>
                  <h3 class="text-2xl font-bold text-[#f77e21] mt-1">
                    {{ statsData.sales.amount }}
                  </h3>
                  <p
                    class="text-xs mt-2 flex items-center gap-1"
                    :class="statsData.sales.rate >= 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.sales.rate >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
                    ></i>
                    {{ Math.abs(statsData.sales.rate) }}% 较上期
                  </p>
                </div>
                <div
                  class="w-10 h-10 rounded-full bg-[#f77e21]/10 flex items-center justify-center"
                >
                  <i class="fa fa-coins text-[#f77e21]"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-500">订单数</p>
                  <h3 class="text-2xl font-bold text-blue-600 mt-1">{{ statsData.order.count }}</h3>
                  <p
                    class="text-xs mt-2 flex items-center gap-1"
                    :class="statsData.order.rate >= 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.order.rate >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
                    ></i>
                    {{ Math.abs(statsData.order.rate) }}% 较上期
                  </p>
                </div>
                <div class="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <i class="fa fa-shopping-cart text-blue-600"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-500">访客数 (人)</p>
                  <h3 class="text-2xl font-bold text-purple-600 mt-1">
                    {{ statsData.visitor.count }}
                  </h3>
                  <p
                    class="text-xs mt-2 flex items-center gap-1"
                    :class="statsData.visitor.rate >= 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.visitor.rate >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
                    ></i>
                    {{ Math.abs(statsData.visitor.rate) }}% 较上期
                  </p>
                </div>
                <div
                  class="w-10 h-10 rounded-full bg-purple-600/10 flex items-center justify-center"
                >
                  <i class="fa fa-eye text-purple-600"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-500">商品销量 (件)</p>
                  <h3 class="text-2xl font-bold text-green-600 mt-1">
                    {{ statsData.goods.sales }}
                  </h3>
                  <p
                    class="text-xs mt-2 flex items-center gap-1"
                    :class="statsData.goods.rate >= 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.goods.rate >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
                    ></i>
                    {{ Math.abs(statsData.goods.rate) }}% 较上期
                  </p>
                </div>
                <div
                  class="w-10 h-10 rounded-full bg-green-600/10 flex items-center justify-center"
                >
                  <i class="fa fa-boxes text-green-600"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- 趋势图表 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3">销售额趋势</p>
              <div ref="salesChartRef" class="w-full h-[300px]"></div>
            </div>
            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3">订单数趋势</p>
              <div ref="orderChartRef" class="w-full h-[300px]"></div>
            </div>
          </div>

          <!-- 数据表格 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <i class="fa fa-trophy text-[#f77e21] mr-2"></i>
                热销商品排行
              </p>
              <el-table
                :data="hotGoodsList"
                stripe
                size="small"
                style="width: 100%"
                v-loading="loading"
              >
                <el-table-column prop="rank" label="排名" width="60" />
                <el-table-column prop="productName" label="商品名称" min-width="180" />
                <el-table-column prop="salesCount" label="销量(件)" width="90" />
                <el-table-column prop="salesAmount" label="销售额(元)" width="110">
                  <template #default="{ row }">¥{{ row.salesAmount?.toFixed(2) }}</template>
                </el-table-column>
              </el-table>
            </div>

            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <i class="fa fa-list-alt text-[#f77e21] mr-2"></i>
                订单状态统计
              </p>
              <el-table
                :data="orderStatusList"
                stripe
                size="small"
                style="width: 100%"
                v-loading="loading"
              >
                <el-table-column prop="statusDesc" label="订单状态" min-width="100" />
                <el-table-column prop="count" label="数量(单)" width="90" />
                <el-table-column label="占比" width="110">
                  <template #default="{ row }">
                    <el-progress
                      :percentage="Number(row.percentage)"
                      size="small"
                      :show-text="false"
                    />
                    <span class="text-xs ml-1">{{ row.percentage }}%</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  queryShopData,
  querySalesData,
  queryOrderData,
  queryHotProduct,
  queryProductOrderStatus,
} from '@/api/pet-shop/count'

const timeType = ref('7days')
const loading = ref(false)

const salesChartRef = ref<HTMLElement>()
const orderChartRef = ref<HTMLElement>()
let salesChartInstance: echarts.ECharts | null = null
let orderChartInstance: echarts.ECharts | null = null

// 顶部统计数据
const statsData = ref({
  sales: { amount: 0, rate: 0 },
  order: { count: 0, rate: 0 },
  visitor: { count: 0, rate: 0 },
  goods: { sales: 0, rate: 0 },
})
const hotGoodsList = ref<any[]>([])
const orderStatusList = ref<any[]>([])

// 销毁图表防止内存泄漏
const disposeCharts = () => {
  salesChartInstance?.dispose()
  orderChartInstance?.dispose()
  salesChartInstance = null
  orderChartInstance = null
}
const shopId = localStorage.getItem('shopId') || ''
// 加载概览统计
const loadShopData = async () => {
  try {
    const res = await queryShopData(shopId)
    if (res) {
      const d = res
      statsData.value = {
        sales: { amount: d.salesAmount, rate: d.salesGrowthRate },
        order: { count: d.orderCount, rate: d.orderGrowthRate },
        visitor: { count: d.visitorCount, rate: d.visitorGrowthRate },
        goods: { sales: d.productSalesCount, rate: d.productSalesGrowthRate },
      }
    }
    console.log(statsData)
  } catch (e) {
    console.error(e)
  }
}

// 销售额趋势
const loadSalesData = async () => {
  try {
    const res = await querySalesData(shopId)
    console.log('salesData', res)
    if (res) {
      const xData = res.map((i: any) => i.date)
      const yData = res.map((i: any) => i.salesAmount)
      await nextTick()
      initSalesChart(xData, yData)
    }
  } catch (e) {
    console.error(e)
  }
}

// 订单趋势
const loadOrderData = async () => {
  try {
    const res = await queryOrderData(shopId)
    console.log('orderData', res)
    if (res) {
      const xData = res.map((i: any) => i.date)
      const yData = res.map((i: any) => i.orderCount)
      await nextTick()
      initOrderChart(xData, yData)
    }
  } catch (e) {
    console.error(e)
  }
}

// 热销商品
const loadHotProducts = async () => {
  try {
    const res = await queryHotProduct(shopId, getDays())
    if (res) {
      hotGoodsList.value = res
    }
  } catch (e) {
    console.error(e)
  }
}

// 订单状态统计
const loadOrderStatus = async () => {
  try {
    const res = await queryProductOrderStatus(shopId, getDays())
    console.log('orderStatus', res)
    if (res) {
      orderStatusList.value = res
    }
  } catch (e) {
    console.error(e)
  }
}

const getDays = () => {
  const map: Record<string, number> = { today: 7, yesterday: 7, '7days': 7, '30days': 30 }
  return map[timeType.value] || 7
}

// 初始化销售额图表
const initSalesChart = (xData: string[], yData: number[]) => {
  if (!salesChartRef.value) return
  disposeCharts()
  salesChartInstance = echarts.init(salesChartRef.value)
  salesChartInstance.setOption({
    grid: { top: 30, right: 20, bottom: 35, left: 50 },
    xAxis: { type: 'category', data: xData, boundaryGap: false },
    yAxis: { type: 'value', name: '金额(元)' },
    tooltip: { trigger: 'axis' },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: yData,
        smooth: true,
        color: '#f77e21',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(247,126,33,0.2)' },
            { offset: 1, color: 'rgba(247,126,33,0)' },
          ]),
        },
      },
    ],
  })
}

// 初始化订单图表
const initOrderChart = (xData: string[], yData: number[]) => {
  if (!orderChartRef.value) return
  orderChartInstance = echarts.init(orderChartRef.value)
  orderChartInstance.setOption({
    grid: { top: 30, right: 20, bottom: 35, left: 50 },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value', name: '订单数' },
    tooltip: { trigger: 'axis' },
    series: [
      {
        name: '订单量',
        type: 'bar',
        data: yData,
        itemStyle: { color: '#409eff' },
        barWidth: '50%',
      },
    ],
  })
}

// 窗口自适应
const resizeCharts = () => {
  salesChartInstance?.resize()
  orderChartInstance?.resize()
}

// 全部加载
const loadAllData = async () => {
  loading.value = true
  disposeCharts()
  try {
    await Promise.all([
      loadShopData(),
      loadSalesData(),
      loadOrderData(),
      loadHotProducts(),
      loadOrderStatus(),
    ])
  } finally {
    loading.value = false
  }
}

const handleTimeChange = () => {
  loadAllData()
}

onMounted(() => {
  loadAllData()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts)
  disposeCharts()
})
</script>

<style scoped>
:deep(.el-progress-bar__outer) {
  height: 6px !important;
}
:deep(.el-progress-bar__inner) {
  background-color: #f77e21 !important;
}
</style>
