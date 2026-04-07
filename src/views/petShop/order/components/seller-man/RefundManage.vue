<template>
  <div class="bg-white rounded-md p-2 px-5">
    <!-- 筛选栏 -->
    <div class="flex flex-row justify-between items-center border-b-[1px] px-8 py-2">
      <div class="text-md font-bold">退款/售后管理</div>
      <div class="flex flex-row gap-2">
        <el-select v-model="refundStatusFilter" placeholder="全部状态" clearable size="small">
          <el-option label="全部状态" value="0"></el-option>
          <el-option label="待商家审核" value="0"></el-option>
          <el-option label="审核通过" value="1"></el-option>
          <el-option label="审核拒绝" value="3"></el-option>
          <el-option label="用户已发货" value="4"></el-option>
          <el-option label="退款成功" value="5"></el-option>
        </el-select>
        <el-select v-model="refundTypeFilter" placeholder="退款类型" clearable size="small">
          <el-option label="全部类型" value="0"></el-option>
          <el-option label="仅退款" value="1"></el-option>
          <el-option label="退货退款" value="2"></el-option>
        </el-select>
        <el-input placeholder="订单编号" v-model="refundSearchInput" clearable size="small">
          <template #prefix>
            <i class="fas fa-search text-md text-gray-300"></i>
          </template>
        </el-input>
        <el-button size="small" @click="searchRefund">搜索</el-button>
      </div>
    </div>

    <!-- 退款表格 -->
    <el-table
      :data="refundData"
      style="width: 100%"
      table-layout="fixed"
      stripe
      :cell-style="{ padding: '12px 0' }"
      :header-cell-style="{
        background: '#fafafa',
        color: '#606266',
        fontWeight: '500',
      }"
    >
      <el-table-column prop="refundId" label="退款编号" width="160" />
      <el-table-column prop="orderId" label="关联订单号" width="160" />
      <el-table-column prop="productName" label="商品名称" width="230">
        <template #default="scope">
          <div class="text-ellipsis overflow-hidden" :title="scope.row.productName">
            {{ scope.row.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="refundType" label="退款类型" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.refundType === '仅退款' ? 'info' : 'warning'" size="small">
            {{ scope.row.refundType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="退款金额" width="100">
        <template #default="scope">¥{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" width="180" />
      <el-table-column prop="status" label="处理状态" width="100">
        <template #default="scope">
          <el-tag :type="getRefundTagType(scope.row.status)" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <div class="flex gap-2">
            <el-button
              size="mini"
              type="text"
              class="text-blue-600"
              @click="openRefundDetail(scope.row)"
              >查看详情</el-button
            >
            <el-button
              v-if="scope.row.status === '待处理'"
              size="mini"
              type="text"
              class="text-green-600"
              @click="agreeRefund(scope.row)"
            >
              同意退款
            </el-button>
            <el-button
              v-if="scope.row.status === '待处理'"
              size="mini"
              type="text"
              class="text-red-600"
              @click="openRejectRefundModal(scope.row)"
            >
              拒绝退款
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="px-6 py-3 border-t flex justify-between items-center">
      <div class="text-sm text-gray-500">共 {{ total }} 条记录</div>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="
          (current) => {
            pageNum = current
            loadRefundList()
          }
        "
      />
    </div>
  </div>

  <!-- 退款详情弹窗 -->
  <el-dialog
    v-model="refundDetailVisible"
    title="退款详情"
    width="700px"
    :close-on-click-modal="false"
  >
    <div v-if="currentRefund" class="space-y-4">
      <div class="flex justify-between items-center pb-2 border-b">
        <div class="font-bold">退款信息</div>
        <el-tag :type="getRefundTagType(currentRefund.status)">{{ currentRefund.status }}</el-tag>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">退款编号：{{ currentRefund.refundId }}</p>
          <p class="text-sm text-gray-500">关联订单：{{ currentRefund.orderId }}</p>
          <p class="text-sm text-gray-500">退款类型：{{ currentRefund.refundType }}</p>
          <p class="text-sm text-gray-500">申请时间：{{ currentRefund.applyTime }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">商品名称：{{ currentRefund.productName }}</p>
          <p class="text-sm text-gray-500">退款金额：¥{{ currentRefund.amount }}</p>
          <p class="text-sm text-gray-500">退款原因：{{ currentRefund.reason || '未填写' }}</p>
        </div>
      </div>

      <div v-if="currentRefund.reason" class="pt-2 border-t">
        <h4 class="font-medium mb-2">退款说明</h4>
        <p class="text-sm bg-gray-50 p-2 rounded">{{ currentRefund.reason }}</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="refundDetailVisible = false">关闭</el-button>
      <el-button
        v-if="currentRefund && currentRefund.status === '待处理'"
        type="primary"
        @click="agreeRefund(currentRefund)"
      >
        同意退款
      </el-button>
      <el-button
        v-if="currentRefund && currentRefund.status === '待处理'"
        type="danger"
        @click="openRejectRefundModal(currentRefund)"
      >
        拒绝退款
      </el-button>

      <el-button
        v-if="currentRefund && currentRefund.status === '已同意'"
        size="mini"
        type="text"
        class="text-purple-600"
        @click="handleMerchantRefund(currentRefund)"
      >
        退款
      </el-button>
    </template>
  </el-dialog>

  <!-- 拒绝退款弹窗 -->
  <el-dialog
    v-model="rejectRefundVisible"
    title="拒绝退款"
    width="500px"
    :close-on-click-modal="false"
  >
    <div v-if="currentRefund" class="space-y-4">
      <p class="text-sm">退款编号：{{ currentRefund.refundId }}</p>
      <p class="text-sm text-gray-500">请填写拒绝退款的原因（必填）</p>

      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="拒绝理由" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            rows="4"
            placeholder="请详细说明拒绝退款的原因"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="rejectRefundVisible = false">取消</el-button>
      <el-button type="danger" @click="confirmRejectRefund">确认拒绝</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRefundList,
  getRefundDetail,
  handleRefund,
  handleRefundMerchant,
} from '@/api/pet-shop/order'

// 基础数据
const refundSearchInput = ref('')
const refundStatusFilter = ref('0')
const refundTypeFilter = ref('0')
const refundDetailVisible = ref(false)
const rejectRefundVisible = ref(false)
const currentRefund = ref<any>(null)
const loading = ref(false)

// 分页数据
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 拒绝退款表单
const rejectForm = ref({
  reason: '',
})

// 退款数据
interface RefundRow {
  refundId: string
  orderId: string
  productName: string
  refundType: string
  amount: string
  applyTime: string
  status: string
  reason?: string
}

const refundData = ref<RefundRow[]>([])

// 退款状态标签类型
const getRefundTagType = (status: string) => {
  switch (status) {
    case '待处理':
      return 'warning'
    case '已同意':
      return 'primary' // 已同意
    case '已拒绝':
      return 'danger' // 拒绝
    case '退款成功':
      return 'success' // 最终成功
    default:
      return ''
  }
}

// 核心方法
const searchRefund = () => {
  pageNum.value = 1
  loadRefundList()
}
//退款列表
const loadRefundList = async () => {
  loading.value = true
  try {
    const params = {
      searchCount: true,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      current: pageNum.value,
      sortItemList: [
        {
          isAsc: false,
          column: 'create_time',
        },
      ],
      refundType: Number(refundTypeFilter.value),
    }

    const res = await getRefundList(params)
    if (res?.ok) {
      refundData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res?.msg || '获取退款列表失败')
    }
  } catch (e) {
    console.error('获取退款列表失败：', e)
    ElMessage.error('获取退款列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
//详情
const openRefundDetail = async (row: RefundRow) => {
  try {
    const res = await getRefundDetail(row.refundId)
    if (res?.ok) {
      currentRefund.value = res.data
      refundDetailVisible.value = true
    } else {
      ElMessage.error(res?.msg || '获取退款详情失败')
    }
  } catch (e) {
    console.error('获取退款详情失败：', e)
    ElMessage.error('获取退款详情失败，请稍后重试')
  }
}
//模拟商家退款
const handleMerchantRefund = (row: RefundRow) => {
  ElMessageBox.confirm('确认执行退款？退款后资金将退回用户账户，无法撤销', '确认退款', {
    confirmButtonText: '确认退款',
    cancelButtonText: '取消',
    type: 'success',
  }).then(async () => {
    try {
      // 调用接口
      const res = await handleRefundMerchant(row.refundId)
      if (res?.ok) {
        refundDetailVisible.value = false
        ElMessage.success('退款成功！')
        loadRefundList()
      } else {
        ElMessage.error(res?.msg || '退款失败')
      }
    } catch (e) {
      console.error(e)
      ElMessage.error('退款失败，请检查接口')
    }
  })
}
//同意退款
const agreeRefund = (row: RefundRow) => {
  ElMessageBox.confirm('确认同意该退款申请吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const params = {
        refundId: row.refundId,
        status: 2,
        shopNote: '',
        orderSn: row.orderId,
      }
      const res = await handleRefund(params)
      if (res?.ok) {
        row.status = '已同意'
        refundDetailVisible.value = false
        ElMessage.success('退款申请已同意！')
        loadRefundList()
      } else {
        ElMessage.error(res?.msg || '同意退款失败')
      }
    } catch (e) {
      console.error('同意退款失败：', e)
      ElMessage.error('同意退款失败，请稍后重试')
    }
  })
}

const openRejectRefundModal = (row: RefundRow) => {
  currentRefund.value = row
  rejectForm.value = { reason: '' }
  rejectRefundVisible.value = true
}
//拒绝退款
const confirmRejectRefund = async () => {
  if (!rejectForm.value.reason.trim()) {
    ElMessage.warning('拒绝理由不能为空！')
    return
  }

  ElMessageBox.confirm('确认拒绝该退款申请吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const params = {
        refundId: currentRefund.value.refundId,
        orderSn: currentRefund.value.orderId,
        status: 2,
        shopNote: rejectForm.value.reason,
      }
      const res = await handleRefund(params)
      if (res?.ok) {
        currentRefund.value.status = '已拒绝'
        rejectRefundVisible.value = false
        refundDetailVisible.value = false
        ElMessage.success('退款申请已拒绝！')
        loadRefundList()
      } else {
        ElMessage.error(res?.msg || '拒绝退款失败')
      }
    } catch (e) {
      console.error('拒绝退款失败：', e)
      ElMessage.error('拒绝退款失败，请稍后重试')
    }
  })
}

// 初始化加载
onMounted(() => {
  loadRefundList()
})
</script>

<style scoped>
:deep(.el-input__inner) {
  border-radius: 4px;
}
:deep(.el-button) {
  border-radius: 4px;
}
.grid {
  display: grid;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.gap-4 {
  gap: 1rem;
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}
</style>
