<template>
  <div class="bg-white rounded-md p-2 px-5">
    <!-- 筛选栏 -->
    <div class="flex flex-row justify-between items-center border-b-[1px] px-8 py-2">
      <div class="text-md font-bold">订单管理</div>
      <div class="flex flex-row gap-2">
        <el-select v-model="orderStatusFilter" placeholder="全部状态" clearable size="small">
          <el-option label="全部状态" value=""></el-option>
          <el-option label="待发货" value="待发货"></el-option>
          <el-option label="待收货" value="待收货"></el-option>
          <el-option label="待评价" value="待评价"></el-option>
          <el-option label="退款中/售后" value="退款中/售后"></el-option>
        </el-select>
        <el-input
          placeholder="订单号/姓名/手机号"
          v-model="orderSearchInput"
          clearable
          size="small"
        >
          <template #prefix>
            <i class="fas fa-search text-md text-gray-300"></i>
          </template>
        </el-input>
        <el-button size="small" @click="searchOrder">搜索</el-button>
        <el-button size="small" type="primary" @click="refreshOrder">刷新</el-button>
      </div>
    </div>

    <!-- 订单表格 -->
    <el-table
      :data="filteredOrderData"
      style="width: 100%"
      stripe
      :loading="loading"
      :cell-style="{ padding: '12px 0' }"
      :header-cell-style="{
        background: '#fafafa',
        color: '#606266',
        fontWeight: '500',
      }"
      @selection-change="handleOrderSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderSn" label="订单号" width="180" />
      <el-table-column prop="username" label="买家姓名" width="100" />
      <el-table-column prop="productName" label="商品名称" width="200">
        <template #default="scope">
          <div class="text-ellipsis overflow-hidden" :title="scope.row.productName">
            {{ scope.row.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="specText" label="商品规格" width="150">
        <template #default="scope">
          <div class="text-ellipsis overflow-hidden" :title="scope.row.specText">
            {{ scope.row.specText }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="80" />
      <el-table-column prop="orderStatus" label="订单状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.orderStatus)" size="small">
            {{ scope.row.orderStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payStatus" label="支付状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.payStatus === '已支付' ? 'success' : 'warning'" size="small">
            {{ scope.row.payStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="160" />
      <el-table-column prop="totalAmount" label="订单金额" width="100">
        <template #default="scope">¥{{ scope.row.totalAmount }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="flex gap-2">
            <el-button size="mini" type="text" class="text-blue-600" @click="viewOrder(scope.row)"
              >查看</el-button
            >

            <el-button
              v-if="scope.row.orderStatus === '待发货'"
              size="mini"
              type="text"
              class="text-green-600"
              @click="openShipModal(scope.row)"
            >
              发货
            </el-button>
            <el-button
              v-if="scope.row.orderStatus === '待付款'"
              size="mini"
              type="text"
              class="text-red-600"
              @click="cancelOrder(scope.row)"
            >
              取消
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="px-6 py-3 border-t flex justify-between items-center">
      <div class="text-sm text-gray-500">共 {{ total }} 条记录</div>
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <!-- 订单详情弹窗 -->
  <el-dialog
    v-model="orderDetailVisible"
    title="订单详情"
    width="800px"
    :close-on-click-modal="false"
  >
    <div v-if="currentOrder" class="space-y-4">
      <div class="flex justify-between items-center pb-2 border-b">
        <div class="font-bold">订单信息</div>
        <el-tag :type="getStatusTagType(currentOrder.orderStatus)">{{
          currentOrder.orderStatus
        }}</el-tag>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">订单编号：{{ currentOrder.orderSn }}</p>
          <p class="text-sm text-gray-500">下单时间：{{ currentOrder.createTime }}</p>
          <p class="text-sm text-gray-500">买家姓名：{{ currentOrder.username }}</p>
          <p class="text-sm text-gray-500">支付方式：{{ currentOrder.payType }}</p>
          <p class="text-sm text-gray-500">支付状态：{{ currentOrder.payStatus }}</p>
          <p class="text-sm text-gray-500">支付时间：{{ currentOrder.payTime || '未支付' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">商品名称：{{ currentOrder.productName }}</p>
          <p class="text-sm text-gray-500">商品规格：{{ currentOrder.specText }}</p>
          <p class="text-sm text-gray-500">订单金额：¥{{ currentOrder.totalAmount }}</p>
          <p class="text-sm text-gray-500">实付金额：¥{{ currentOrder.payAmount }}</p>
          <p class="text-sm text-gray-500">订单状态：{{ currentOrder.orderStatus }}</p>
        </div>
      </div>

      <div class="pt-2 border-t">
        <h4 class="font-medium mb-2">商品信息</h4>
        <el-table
          :data="[
            {
              name: currentOrder.productName,
              price: currentOrder.price,
              num: currentOrder.quantity,
            },
          ]"
          size="mini"
        >
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价" />
          <el-table-column prop="num" label="数量" />
          <el-table-column label="小计">
            <template #default="scope">¥{{ scope.row.price * scope.row.num || '0.00' }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pt-2 border-t">
        <h4 class="font-medium mb-2">费用明细</h4>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span>商品总价</span>
            <span>¥{{ currentOrder.price * currentOrder.quantity || '0.00' }}</span>
          </div>
          <div class="flex justify-between">
            <span>运费</span>
            <span>¥{{ currentOrder.freightAmount || '0.00' }}</span>
          </div>
          <div class="flex justify-between">
            <span>优惠</span>
            <span>-¥{{ currentOrder.discountAmount || '0.00' }}</span>
          </div>
          <div class="flex justify-between font-medium mt-2">
            <span>实付款</span>
            <span class="text-orange-500">¥{{ currentOrder.payAmount }}</span>
          </div>
        </div>
      </div>

      <div class="text-right pt-2">
        <p class="text-lg font-bold">订单总价：¥{{ currentOrder.totalAmount || '0.00' }}</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="orderDetailVisible = false">关闭</el-button>
      <el-button
        v-if="currentOrder && currentOrder.orderStatus === '待发货'"
        type="primary"
        @click="openShipModal(currentOrder)"
      >
        发货
      </el-button>
    </template>
  </el-dialog>

  <!-- 发货弹窗 -->
  <el-dialog
    v-model="shipModalVisible"
    title="发货操作"
    width="500px"
    :close-on-click-modal="false"
  >
    <div v-if="currentOrder" class="space-y-4">
      <p class="text-sm">订单编号：{{ currentOrder.orderSn }}</p>
      <p class="text-sm">商品名称：{{ currentOrder.productName }}</p>
      <p class="text-sm">商品规格：{{ currentOrder.specText }}</p>

      <el-form :model="shipForm" label-width="80px">
        <el-form-item label="快递公司" required>
          <el-select v-model="shipForm.express" placeholder="请选择快递公司">
            <el-option label="SF" value="顺丰速运"></el-option>
            <el-option label="YTO" value="圆通快递"></el-option>
            <el-option label="ZTO" value="中通快递"></el-option>
            <el-option label="YD" value="韵达快递"></el-option>
            <el-option label="EMS" value="邮政快递"></el-option>
            <el-option label="HTKY" value="申通快递"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="运单编号" required>
          <el-input v-model="shipForm.expressNo" placeholder="请输入运单编号"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="shipForm.remark" type="textarea" rows="2"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="shipModalVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmShip">确认发货</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { getShopOrderList, shipOrder } from '@/api/pet-shop/order'

const orderSearchInput = ref('')
const orderStatusFilter = ref('')
const selectedOrders = ref<any[]>([])
const orderDetailVisible = ref(false)
const shipModalVisible = ref(false)
const currentOrder = ref<any>(null)

// 分页数据
const pageNum = ref(1)
const pageSize = ref(7)
const total = ref(0)
const loading = ref(false)

// 发货表单
const shipForm = ref({
  express: '',
  expressNo: '',
  remark: '',
})

// 订单数据
interface OrderRow {
  id: string
  orderSn: string
  username: string
  productName: string
  orderStatus: string
  createTime: string
  totalAmount: number
  payAmount: number
  payType: string
  price?: number
  payStatus: string
  deliveryCompany: string
  deliverySn: string
  productPic: string
  specText: string
  quantity: number
  commentStatus: string
  addressId: string
}

const orderData = ref<OrderRow[]>([])

// 筛选订单
const filteredOrderData = computed(() => {
  return orderData.value
})

// 加载订单列表
const loadOrderList = async () => {
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
      listStatus: getStatusValue(orderStatusFilter.value),
      orderSn: orderSearchInput.value || undefined,
    }
    console.log('订单列表参数:', params)
    const res = await getShopOrderList(params)
    console.log(res)
    if (res?.ok) {
      orderData.value = (res.data.list || []).map((item: any) => ({
        id: item.id,
        orderSn: item.orderSn,
        username: item.username,
        productName: item.productName,
        orderStatus: item.orderStatus,
        createTime: item.createTime,
        totalAmount: item.totalAmount,
        payAmount: item.payAmount,
        payType: item.payType,
        payStatus: item.payStatus,
        price: item.price || 0,
        deliveryCompany: item.deliveryCompany,
        deliverySn: item.deliverySn,
        productPic: item.productPic,
        specText: item.specText,
        quantity: item.quantity,
        commentStatus: item.commentStatus,
        addressId: item.addressId,
      }))
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res?.msg || '获取订单列表失败')
    }
  } catch (e) {
    console.error('获取订单列表失败：', e)
    ElMessage.error('获取订单列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 状态映射
const getStatusValue = (status: string): number => {
  const statusMap: Record<string, number> = {
    待发货: 1,
    待收货: 2,
    待评价: 3,
    '退款中/售后': 4,
  }
  return statusMap[status] || 0
}

// 订单状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case '待发货':
      return 'info'
    case '待收货':
      return 'success'
    case '待评价':
      return 'primary'
    case '退款中/售后':
      return 'warning'
    default:
      return ''
  }
}

// 查看订单
const viewOrder = (row: OrderRow) => {
  currentOrder.value = row
  orderDetailVisible.value = true
}

// 打开发货弹窗
const openShipModal = (row: OrderRow) => {
  currentOrder.value = row
  shipForm.value = { express: '', expressNo: '', remark: '' }
  shipModalVisible.value = true
}

// 确认发货
const confirmShip = async () => {
  if (!shipForm.value.express) {
    ElMessage.warning('请选择快递公司！')
    return
  }
  if (!shipForm.value.expressNo) {
    ElMessage.warning('请输入运单编号！')
    return
  }

  ElMessageBox.confirm('确认发货吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const params = {
        orderSn: currentOrder.value.orderSn,
        deliveryCompany: shipForm.value.express,
        shopNote: shipForm.value.remark,
      }
      console.log('发货参数:', params)
      const res = await shipOrder(params)
      console.log('发货结果:', res)
      if (res) {
        currentOrder.value.orderStatus = '待收货'
        shipModalVisible.value = false
        orderDetailVisible.value = false
        ElMessage.success(`发货成功！运单号：${shipForm.value.expressNo}`)
        loadOrderList()
      } else {
        ElMessage.error(res?.msg || '发货失败')
      }
    } catch (e) {
      console.error('发货失败：', e)
      ElMessage.error('发货失败，请稍后重试')
    }
  })
}

// 取消订单
const cancelOrder = (row: OrderRow) => {
  ElMessageBox.confirm('确认取消该订单吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    row.orderStatus = '已取消'
    ElMessage.success('订单已取消！')
  })
}

// 其他工具方法
const handleOrderSelectionChange = (val: any[]) => {
  selectedOrders.value = val
}
// 搜索订单
const searchOrder = () => {
  pageNum.value = 1
  loadOrderList()
}
// 刷新订单
const refreshOrder = () => {
  pageNum.value = 1
  loadOrderList()
  ElMessage.success('订单列表已刷新')
}
// 改变分页大小
const handleSizeChange = (val: number) => {
  pageSize.value = val
  pageNum.value = 1
  loadOrderList()
}
// 改变当前页
const handleCurrentChange = (val: number) => {
  pageNum.value = val
  loadOrderList()
}

// 初始化加载
onMounted(() => {
  loadOrderList()
})
</script>

<style scoped>
:deep(.el-tag--primary) {
  background-color: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}

:deep(.el-table__row:hover > td) {
  background-color: #f9fafb !important;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}
:deep(.el-button) {
  border-radius: 4px;
}

:deep(.address-text) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.5;
  max-height: 3em;
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
