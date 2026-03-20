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
            <el-select v-model="timeType" size="small" style="width: 120px">
              <el-option label="今日" value="today" />
              <el-option label="昨日" value="yesterday" />
              <el-option label="近7天" value="7days" />
              <el-option label="近30天" value="30days" />
            </el-select>
          </div>

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
                    class="text-xs mt-2 flex items-center"
                    :class="statsData.sales.rate > 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.sales.rate > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
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
                    class="text-xs mt-2 flex items-center"
                    :class="statsData.order.rate > 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.order.rate > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
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
                    class="text-xs mt-2 flex items-center"
                    :class="statsData.visitor.rate > 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.visitor.rate > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
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
                    class="text-xs mt-2 flex items-center"
                    :class="statsData.goods.rate > 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    <i
                      class="fa"
                      :class="statsData.goods.rate > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
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

          <!-- 趋势 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- 销售额 -->
            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3">销售额趋势</p>
              <div id="salesChart" class="w-full h-[300px]"></div>
            </div>

            <!-- 订单数 -->
            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3">订单数趋势</p>
              <div id="orderChart" class="w-full h-[300px]"></div>
            </div>
          </div>

          <!-- 表格 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <i class="fa fa-trophy text-[#f77e21] mr-2"></i>
                热销商品排行
              </p>
              <el-table :data="hotGoodsList" stripe size="small" style="width: 100%">
                <el-table-column prop="rank" label="排名" width="60" />
                <el-table-column prop="name" label="商品名称" min-width="180" />
                <el-table-column prop="sales" label="销量(件)" width="80" />
                <el-table-column prop="amount" label="销售额(元)" width="100" />
              </el-table>
            </div>

            <!-- 订单状态 -->
            <div class="rounded-lg border border-gray-200 p-4">
              <p class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <i class="fa fa-list-alt text-[#f77e21] mr-2"></i>
                订单状态统计
              </p>
              <el-table :data="orderStatusList" stripe size="small" style="width: 100%">
                <el-table-column prop="status" label="订单状态" min-width="100" />
                <el-table-column prop="count" label="数量(单)" width="80" />
                <el-table-column prop="rate" label="占比" width="100">
                  <template #default="scope">
                    <el-progress :percentage="scope.row.rate" size="small" :show-text="false" />
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
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const timeType = ref('7days')

// 统计数据
const statsData = ref({
  sales: { amount: 12580, rate: 12.5 }, // 销售额、涨幅
  order: { count: 326, rate: 8.2 }, // 订单数、涨幅
  visitor: { count: 5820, rate: -3.1 }, // 访客数、跌幅
  goods: { sales: 896, rate: 15.7 }, // 商品销量、涨幅
})

// 热销商品列表
const hotGoodsList = ref([
  { rank: 1, name: '宠物狗粮 成犬通用型10kg', sales: 126, amount: 24974 },
  { rank: 2, name: '猫咪逗猫棒 羽毛铃铛款', sales: 98, amount: 1950.2 },
  { rank: 3, name: '宠物狗窝 中型犬四季通用', sales: 76, amount: 6764 },
  { rank: 4, name: '猫咪化毛膏 营养吐毛球120g', sales: 65, amount: 2593.5 },
  { rank: 5, name: '宠物牵引绳 反光防爆冲', sales: 52, amount: 1820 },
])

// 订单状态统计
const orderStatusList = ref([
  { status: '待付款', count: 28, rate: 8.6 },
  { status: '待发货', count: 105, rate: 32.2 },
  { status: '待收货', count: 156, rate: 47.8 },
  { status: '已完成', count: 37, rate: 11.4 },
])

const dateXData = ref(['05-20', '05-21', '05-22', '05-23', '05-24', '05-25', '05-26'])
const salesYData = ref([1520, 1850, 1680, 2100, 1950, 2320, 2160])
const orderYData = ref([42, 48, 45, 52, 49, 55, 35])

const initSalesChart = () => {
  const chartDom = document.getElementById('salesChart')
  if (!chartDom) return
  const myChart = echarts.init(chartDom) //初始化echart表
  const option = {
    //配置
    grid: { top: 20, right: 10, bottom: 30, left: 40 },
    xAxis: { type: 'category', data: dateXData.value }, //x轴
    yAxis: { type: 'value', name: '元' }, //y轴
    tooltip: { trigger: 'axis' }, //提示框，鼠标悬停时出先数据
    series: [
      {
        name: '销售额',
        type: 'line', //折现
        data: salesYData.value,
        smooth: true,
        lineStyle: { color: '#f77e21' },
        itemStyle: { color: '#f77e21' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //折现下方的渐变颜色
            { offset: 0, color: '#f77e2133' }, //起始位置
            { offset: 1, color: '#f77e2100' },
          ]),
        }, //结束位置
      },
    ],
  }
  myChart.setOption(option)
  window.addEventListener('resize', () => myChart.resize()) //自适应窗口大小
}

//订单数图表
const initOrderChart = () => {
  const chartDom = document.getElementById('orderChart')
  if (!chartDom) return
  const myChart = echarts.init(chartDom)
  const option = {
    grid: { top: 20, right: 10, bottom: 30, left: 40 },
    xAxis: { type: 'category', data: dateXData.value },
    yAxis: { type: 'value', name: '单' },
    tooltip: { trigger: 'axis' },
    series: [
      {
        name: '订单数',
        type: 'bar', //柱形
        data: orderYData.value,
        itemStyle: { color: '#409eff' },
        barWidth: '60%',
      },
    ],
  }
  myChart.setOption(option)
  window.addEventListener('resize', () => myChart.resize())
}
watch(timeType, (newType) => {
  switch (newType) {
    case 'today':
      statsData.value = {
        sales: { amount: 1850, rate: 25.3 },
        order: { count: 45, rate: 18.2 },
        visitor: { count: 820, rate: 5.6 },
        goods: { sales: 126, rate: 22.1 },
      }
      break
    case 'yesterday':
      statsData.value = {
        sales: { amount: 1520, rate: 8.7 },
        order: { count: 38, rate: 6.3 },
        visitor: { count: 750, rate: -2.1 },
        goods: { sales: 98, rate: 10.5 },
      }
      break
    case '7days':
      statsData.value = {
        sales: { amount: 12580, rate: 12.5 },
        order: { count: 326, rate: 8.2 },
        visitor: { count: 5820, rate: -3.1 },
        goods: { sales: 896, rate: 15.7 },
      }
      break
    case '30days':
      statsData.value = {
        sales: { amount: 56820, rate: 28.3 },
        order: { count: 1560, rate: 22.5 },
        visitor: { count: 26500, rate: 18.7 },
        goods: { sales: 4250, rate: 30.2 },
      }
      break
  }
})

// 页面挂载图表
onMounted(() => {
  initSalesChart()
  initOrderChart()
})
</script>

<style scoped>
#salesChart,
#orderChart {
  width: 100%;
  height: 300px;
}

:deep(.el-progress-bar__outer) {
  height: 6px !important;
}

:deep(.el-progress-bar__inner) {
  background-color: #f77e21 !important;
}
</style>
