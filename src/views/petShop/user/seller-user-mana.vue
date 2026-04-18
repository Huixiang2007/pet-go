<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />
      <div class="flex-1 overflow-auto p-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div
            class="flex flex-row justify-between items-center border-b border-gray-200 px-4 py-3 mb-3"
          >
            <div class="text-lg font-bold text-gray-800">用户管理</div>
            <div class="flex flex-row gap-3">
              <el-input
                placeholder="请输入用户名搜索"
                v-model="searchKeyword"
                clearable
                style="width: 220px"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <i class="fas fa-search text-md text-gray-300"></i>
                </template>
              </el-input>
              <el-button size="default" type="primary" @click="handleSearch">搜索</el-button>
            </div>
          </div>

          <el-table
            :data="tableData"
            style="width: 100%"
            stripe
            v-loading="loading"
            :cell-style="{ padding: '14px 0', borderRight: '1px solid #f0f0f0' }"
            :header-cell-style="{
              background: '#f5f5f5',
              color: '#606266',
              fontWeight: '500',
            }"
          >
            <el-table-column prop="userId" label="用户ID" width="100" />
            <el-table-column prop="username" label="用户名" min-width="120" />
            <el-table-column label="累计订单数" width="120">
              <template #default="{ row }">
                {{ row.totalOrders || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="累计消费" width="150">
              <template #default="{ row }"> ¥{{ row.totalAmount?.toFixed(2) || '0.00' }} </template>
            </el-table-column>
            <el-table-column label="最近下单时间" min-width="190">
              <template #default="{ row }">
                {{ formatDate(new Date(row.lastOrderTime)) || '暂无订单' }}
              </template>
            </el-table-column>
            <el-table-column label="最近订单状态" width="150">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.lastOrderStatus)" size="small">
                  {{ getStatusText(row.lastOrderStatus) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="140">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="openOrderDialog(row)">
                  查看订单
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="py-12 flex flex-col items-center justify-center text-gray-400">
                <i class="fas fa-user-slash text-4xl mb-3"></i>
                <div class="text-lg">暂无用户数据</div>
              </div>
            </template>
          </el-table>

          <div class="px-4 py-3 border-t border-gray-200 flex justify-between items-center mt-3">
            <div class="text-sm text-gray-500">共 {{ total }} 条记录</div>
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :page-size="pageSize"
              :current-page="pageNum"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 订单记录弹窗 -->
    <el-dialog v-model="orderDialogVisible" title="用户订单记录" width="85%" append-to-body>
      <el-table :data="currentUserOrders" stripe v-loading="orderLoading" empty-text="暂无订单记录">
        <el-table-column label="订单编号" prop="orderSn" min-width="200" />
        <el-table-column label="商品名称" prop="productName" min-width="180" />
        <el-table-column label="商品规格" prop="specText" min-width="150" />
        <el-table-column label="购买数量" prop="quantity" width="100" />
        <el-table-column label="实付金额" width="120">
          <template #default="{ row }"> ¥{{ row.payAmount?.toFixed(2) || 0 }} </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderStatus" width="120" />
        <el-table-column label="支付状态" prop="payStatus" width="120" />
        <el-table-column label="支付方式" prop="payType" width="120" />
        <el-table-column label="下单时间" prop="createTime" min-width="190" />
      </el-table>

      <template #footer>
        <div class="flex justify-end">
          <el-button @click="orderDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { queryCustomerList } from '@/api/pet-shop/count'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

// 订单弹窗
const orderDialogVisible = ref(false)
const currentUserOrders = ref([])
const orderLoading = ref(false)

// 加载用户列表
const loadCustomerList = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      username: searchKeyword.value || '',
      sortList: [{ isAsc: false, column: 'totalOrders' }],
    }
    const res = await queryCustomerList(params)
    if (res) {
      tableData.value = res.list || []
      total.value = res.total || 0
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
}

// 搜索
const handleSearch = () => {
  pageNum.value = 1
  loadCustomerList()
}

// 分页
const handlePageChange = (page) => {
  pageNum.value = page
  loadCustomerList()
}

// 打开订单弹窗
const openOrderDialog = (row) => {
  currentUserOrders.value = row.orders || []
  orderDialogVisible.value = true
}

// 订单状态映射
const getStatusText = (status) => {
  const map = { 0: '待付款', 1: '待发货', 2: '已发货', 3: '已完成', 4: '已取消' }
  return map[status] || '无'
}

const getStatusType = (status) => {
  const map = { 0: 'warning', 1: 'primary', 2: 'info', 3: 'success', 4: 'danger' }
  return map[status] || 'info'
}

onMounted(() => {
  loadCustomerList()
})
</script>

<style scoped>
:deep(.el-table__row--striped td) {
  background-color: #fafafa !important;
}
</style>
