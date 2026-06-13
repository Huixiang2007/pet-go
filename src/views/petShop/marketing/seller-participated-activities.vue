<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <SellerManNav />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <!-- 页面标题 -->
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span
                  class="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full"
                ></span>
                秒杀申请详情
              </h1>
              <p class="text-gray-500 mt-1 text-sm ml-2">查看秒杀商品申请的详细信息与审核结果</p>
            </div>
            <div
              class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <span class="text-gray-500 text-sm">申请编号：</span>
              <span class="font-semibold text-gray-800 text-sm">{{ applyId }}</span>
            </div>
          </div>
        </div>

        <!-- 活动信息卡片 -->
        <div
          v-if="activityInfo"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
        >
          <div
            class="px-6 py-5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100"
          >
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              活动信息
            </h3>
          </div>
          <div class="p-5 md:p-7">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <p class="text-gray-500 text-sm mb-1">活动名称</p>
                <p class="font-bold text-gray-800">{{ activityInfo.activityName }}</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <p class="text-gray-500 text-sm mb-1">活动类型</p>
                <p class="font-bold text-gray-800">{{ activityInfo.activityType }}</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <p class="text-gray-500 text-sm mb-1">活动状态</p>
                <p class="font-bold text-green-600">{{ activityInfo.activityStatus }}</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <p class="text-gray-500 text-sm mb-1">活动描述</p>
                <p class="font-medium text-gray-700">
                  {{ activityInfo.activityDescription || '-' }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">活动开始时间</p>
                  <p class="text-gray-700 font-medium">
                    {{ activityInfo.activityStartTime || '-' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">活动结束时间</p>
                  <p class="text-gray-700 font-medium">{{ activityInfo.activityEndTime || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品信息卡片 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            class="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
          >
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                ></path>
              </svg>
              商品秒杀信息
            </h3>
          </div>

          <div class="p-5 md:p-7">
            <!-- 加载中 -->
            <div v-if="loading" class="py-20 text-center text-gray-400">
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4"
              >
                <i class="el-icon-loading text-blue-500 text-2xl"></i>
              </div>
              <p class="text-gray-500">正在加载数据...</p>
            </div>

            <!-- 有数据 -->
            <div v-else-if="activityInfo" class="space-y-6">
              <div
                class="relative bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <!-- 秒杀信息网格 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div
                    class="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100"
                  >
                    <p class="text-gray-500 mb-1 flex items-center gap-1">
                      <svg
                        class="w-4 h-4 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      秒杀价
                    </p>
                    <p class="font-bold text-red-500 text-xl">¥{{ activityInfo.seckillPrice }}</p>
                  </div>
                  <div
                    class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                  >
                    <p class="text-gray-500 mb-1 flex items-center gap-1">
                      <svg
                        class="w-4 h-4 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        ></path>
                      </svg>
                      总库存
                    </p>
                    <p class="font-bold text-gray-800 text-xl">{{ activityInfo.totalStock }}</p>
                  </div>
                  <div
                    class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"
                  >
                    <p class="text-gray-500 mb-1 flex items-center gap-1">
                      <svg
                        class="w-4 h-4 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      剩余库存
                    </p>
                    <p class="font-bold text-gray-800 text-xl">{{ activityInfo.availableStock }}</p>
                  </div>
                  <div
                    class="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-100"
                  >
                    <p class="text-gray-500 mb-1 flex items-center gap-1">
                      <svg
                        class="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                      已售数量
                    </p>
                    <p class="font-bold text-gray-800 text-xl">{{ activityInfo.soldCount }}</p>
                  </div>
                </div>

                <!-- 销售进度 -->
                <div class="mt-6">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-500">销售进度</span>
                    <span class="text-gray-700 font-medium"
                      >{{ activityInfo.salesProgress || 0 }}%</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                      :style="{ width: `${activityInfo.salesProgress || 0}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 无数据 -->
            <div v-else class="py-20 text-center">
              <div
                class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4"
              >
                <svg
                  class="w-10 h-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <p class="text-gray-400 text-lg mb-2">暂无该申请的商品信息</p>
              <p class="text-gray-300 text-sm">请确认申请编号是否正确</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getParticipatedActivities } from '../../../api/pet-shop/flash'

interface ActivityInfo {
  activityName: string
  activityType: string
  activityDescription: string
  activityEndTime: string
  activityStartTime: string
  activityStatus: string
  availableStock: number
  salesProgress: number
  seckillPrice: number
  soldCount: number
  totalStock: number
}

const activityInfo = ref<ActivityInfo | null>(null)
const applyId = ref<string>('')
const loading = ref<boolean>(false)

// 解析URL参数
const parseUrlParams = () => {
  const params = new URLSearchParams(window.location.search)
  applyId.value = params.get('applyId') || ''
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    parseUrlParams()
    if (!applyId.value) {
      ElMessage.error('缺少申请ID参数')
      return
    }

    const res = await getParticipatedActivities(applyId.value)
    if (res.code === 0 && res.data) {
      activityInfo.value = res.data
    } else {
      ElMessage.warning(res.msg || '获取数据失败')
    }
  } catch (err) {
    console.error('加载秒杀详情失败：', err)
    ElMessage.error('数据加载异常，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
