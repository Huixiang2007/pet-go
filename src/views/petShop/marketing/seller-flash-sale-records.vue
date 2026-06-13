<template>
  <SellerManHeader title="申请记录" />
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <SellerManNav />

    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto p-4">
        <div>
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800">秒杀活动申请记录</h1>
            <p class="text-gray-500 mt-1">查看和管理您的秒杀活动申请</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-600">状态：</label>
                <select
                  v-model="filter.auditStatus"
                  class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option :value="-1">全部状态</option>
                  <option value="0">待审核</option>
                  <option value="1">已通过</option>
                  <option value="2">已驳回</option>
                  <option value="3">已撤销</option>
                </select>
              </div>

              <button
                @click="loadRecords"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <i class="fa-solid fa-filter"></i>
                筛选
              </button>

              <button
                @click="
                  () => {
                    currentPage = 1
                    loadRecords()
                  }
                "
                class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 ml-auto"
              >
                <i class="fa-solid fa-refresh"></i>
                刷新
              </button>
            </div>
          </div>

          <!-- 统计卡片 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">全部申请</p>
                  <p class="text-2xl font-bold text-gray-800 mt-1">{{ statistics.total }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-file-text text-blue-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">待审核</p>
                  <p class="text-2xl font-bold text-yellow-600 mt-1">{{ statistics.pending }}</p>
                </div>
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-clock text-yellow-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">已通过</p>
                  <p class="text-2xl font-bold text-green-600 mt-1">{{ statistics.approved }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-check-circle text-green-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">已分配</p>
                  <p class="text-2xl font-bold text-purple-600 mt-1">{{ statistics.allocated }}</p>
                </div>
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-box-check text-purple-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- 申请记录列表 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- 列表头部 -->
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div class="col-span-3">商品信息</div>
                <div class="col-span-2">秒杀信息</div>
                <div class="col-span-2">申请信息</div>
                <div class="col-span-1">审核状态</div>
                <div class="col-span-1">分配状态</div>
                <div class="col-span-3">操作</div>
              </div>
            </div>

            <!-- 列表内容 -->
            <div class="divide-y divide-gray-100">
              <div
                v-for="record in records"
                :key="record.applyId"
                class="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div class="grid grid-cols-12 gap-4 items-center">
                  <!-- 商品信息 -->
                  <div class="col-span-3 flex items-center gap-3">
                    <img
                      :src="record.productImage || 'https://via.placeholder.com/100'"
                      :alt="record.productName"
                      class="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-800 truncate">
                        {{ record.productName }}
                      </p>
                      <p class="text-xs text-gray-500">{{ record.specText || '-' }}</p>
                    </div>
                  </div>

                  <!-- 秒杀信息 -->
                  <div class="col-span-2">
                    <p class="text-sm font-bold text-red-500">¥{{ record.seckillPrice }}</p>
                    <p class="text-xs text-gray-500">库存: {{ record.stock }}件</p>
                    <p class="text-xs text-gray-400">限购: {{ record.limitPerUser || '-' }}件/人</p>
                  </div>

                  <!-- 申请信息 -->
                  <div class="col-span-2 text-sm">
                    <p class="text-gray-700 truncate">申请ID: {{ record.applyId }}</p>
                    <p class="text-xs text-gray-500">{{ record.createTime || '-' }}</p>
                  </div>

                  <!-- 审核状态 -->
                  <div class="col-span-1">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClass(record.auditStatus)"
                    >
                      {{ record.auditStatus }}
                    </span>
                  </div>

                  <!-- 分配状态 -->
                  <div class="col-span-1">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        record.allocateStatus === '已分配'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      "
                    >
                      {{ record.allocateStatus || '未分配' }}
                    </span>
                  </div>

                  <!-- 操作 -->
                  <div class="col-span-3 flex gap-2">
                    <button
                      v-if="record.auditStatus === '待审核'"
                      @click="handleCancel(record.applyId)"
                      class="px-3 py-1 text-xs border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="提交申请后1小时内可撤销"
                    >
                      撤销申请
                    </button>
                    <button
                      @click="handleViewDetail(record)"
                      class="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="records.length === 0" class="py-16 text-center">
              <div
                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <i class="fa-solid fa-file-text text-gray-400 text-2xl"></i>
              </div>
              <p class="text-gray-500">暂无申请记录</p>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="records.length > 0" class="mt-6 flex items-center justify-center gap-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span class="px-4 py-2 text-gray-600">
              第 {{ currentPage }} / {{ totalPages }} 页
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getApplyRecords, cancelApply } from '../../../api/pet-shop/flash'

interface FlashRecord {
  applyId: string
  productName: string
  specText?: string
  seckillPrice: number
  stock: number
  limitPerUser?: number
  auditStatus: string
  allocateStatus?: string
  createTime?: string
  productImage?: string
}

const records = ref<FlashRecord[]>([])
const loading = ref(false)
const filter = ref({
  auditStatus: -1, // -1=全部，0=待审核，1=已通过，2=已驳回，3=已撤销
})
const currentPage = ref(1)
const totalPages = ref(1)

// 统计数据
const statistics = computed(() => ({
  total: records.value.length,
  pending: records.value.filter((r) => r.auditStatus === '待审核').length,
  approved: records.value.filter((r) => r.auditStatus === '已通过').length,
  allocated: records.value.filter((r) => r.allocateStatus === '已分配').length,
}))

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    待审核: 'bg-yellow-100 text-yellow-700',
    已通过: 'bg-green-100 text-green-700',
    已驳回: 'bg-red-100 text-red-700',
    已撤销: 'bg-gray-100 text-gray-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

// 加载申请记录（完全对齐接口参数）
const loadRecords = async () => {
  loading.value = true

  try {
    const params: any = {
      pageNum: currentPage.value,
      pageSize: 10,
    }
    if (filter.value.auditStatus !== -1) {
      params.auditStatus = filter.value.auditStatus
    }

    const res = await getApplyRecords(params)
    console.log('申请记录接口返回：', res)

    if (res.code === 0 && res.data) {
      records.value = res.data.list || []
      totalPages.value = res.data.pages || 1
    }
  } catch (err) {
    console.error('加载申请记录失败', err)
    ElMessage.error('加载申请记录失败')
  } finally {
    loading.value = false
  }
}
const handleCancel = async (applyId: string) => {
  try {
    await ElMessageBox.confirm(
      '<p>确定要撤销此申请吗？</p><p class="text-sm text-gray-500 mt-2">温馨提示：提交申请后1小时内可撤销，超过时间将无法撤销</p>',
      '撤销申请',
      {
        confirmButtonText: '确定撤销',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
      },
    )

    const res = await cancelApply(applyId)
    console.log('撤销申请接口返回：', res)
    if (res.code === 0) {
      ElMessage.success('撤销成功')
      loadRecords()
    } else {
      ElMessage.error(res.msg || '撤销失败')
    }
  } catch (err: any) {
    console.log('撤销申请失败', err)
    ElMessage.error(err.message)
  }
}

const handleViewDetail = (record: FlashRecord) => {
  window.location.href = `/seller/flash-sale/participated?applyId=${record.applyId}`
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadRecords()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadRecords()
  }
}

onMounted(() => {
  loadRecords()
})
</script>
