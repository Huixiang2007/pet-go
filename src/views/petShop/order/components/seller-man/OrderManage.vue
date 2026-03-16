<template>
  <div class="bg-white rounded-md p-2 px-5">
    <!-- 筛选栏 -->
    <div class="flex flex-row justify-between items-center border-b-[1px] px-8 py-2">
      <div class="text-md font-bold">订单管理</div>
      <div class="flex flex-row gap-2">
        <el-select v-model="orderStatusFilter" placeholder="全部状态" clearable size="small">
          <el-option label="全部状态" value=""></el-option>
          <el-option label="待付款" value="待付款"></el-option>
          <el-option label="待发货" value="待发货"></el-option>
          <el-option label="待收货" value="待收货"></el-option>
          <el-option label="待评价" value="待评价"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
          <el-option label="已取消" value="已取消"></el-option>
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

    <!-- 批量操作 -->
    <div class="px-8 py-3 flex justify-between items-center">
      <div class="flex gap-2">
        <el-button size="mini" type="primary" icon="el-icon-s-tools" @click="batchOperation"
          >批量操作</el-button
        >
        <el-button size="mini" type="success" icon="el-icon-s-check" @click="batchShip"
          >批量发货</el-button
        >
      </div>
      <div class="text-sm text-gray-500">共 {{ filteredOrderData.length }} 条记录</div>
    </div>

    <!-- 订单表格 -->
    <el-table
      :data="filteredOrderData"
      style="width: 100%"
      stripe
      :cell-style="{ padding: '12px 0' }"
      :header-cell-style="{
        background: '#fafafa',
        color: '#606266',
        fontWeight: '500',
      }"
      @selection-change="handleOrderSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="订单号" width="140" />
      <el-table-column prop="name" label="买家姓名" width="100" />
      <el-table-column prop="productName" label="商品名称" width="200">
        <template #default="scope">
          <div class="text-ellipsis overflow-hidden" :title="scope.row.productName">
            {{ scope.row.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="收货地址" min-width="200">
        <template #default="scope">
          <div class="address-text" :title="scope.row.address">
            {{ scope.row.address }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="status" label="订单状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.status)" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="下单时间" width="160" />
      <el-table-column prop="price" label="订单金额" width="100">
        <template #default="scope">¥{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="flex gap-2">
            <el-button size="mini" type="text" class="text-blue-600" @click="viewOrder(scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="text"
              class="text-orange-500"
              @click="openEditModal(scope.row)"
              :disabled="!isEditable(scope.row.status)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.status === '待发货'"
              size="mini"
              type="text"
              class="text-green-600"
              @click="openShipModal(scope.row)"
            >
              发货
            </el-button>
            <el-button
              v-if="scope.row.status === '待付款'"
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
      <div class="text-sm text-gray-500">共 {{ filteredOrderData.length }} 条记录</div>
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="120"
        :page-size="10"
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
        <el-tag :type="getStatusTagType(currentOrder.status)">{{ currentOrder.status }}</el-tag>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">订单编号：{{ currentOrder.id }}</p>
          <p class="text-sm text-gray-500">下单时间：{{ currentOrder.time }}</p>
          <p class="text-sm text-gray-500">买家姓名：{{ currentOrder.name }}</p>
          <p class="text-sm text-gray-500">联系电话：{{ currentOrder.phone }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">商品名称：{{ currentOrder.productName }}</p>
          <p class="text-sm text-gray-500">订单金额：¥{{ currentOrder.price }}</p>
          <p class="text-sm text-gray-500">收货地址：{{ currentOrder.address }}</p>
        </div>
      </div>

      <div class="pt-2 border-t">
        <h4 class="font-medium mb-2">商品信息</h4>
        <el-table
          :data="[{ name: currentOrder.productName, price: currentOrder.price, num: 1 }]"
          border
          size="mini"
        >
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价" />
          <el-table-column prop="num" label="数量" />
          <el-table-column label="小计">
            <template #default="scope">¥{{ scope.row.price }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="text-right pt-2">
        <p class="text-lg font-bold">订单总价：¥{{ currentOrder.price }}</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="orderDetailVisible = false">关闭</el-button>
      <el-button
        v-if="currentOrder && currentOrder.status === '待发货'"
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
      <p class="text-sm">订单编号：{{ currentOrder.id }}</p>
      <p class="text-sm">商品名称：{{ currentOrder.productName }}</p>

      <el-form :model="shipForm" label-width="80px">
        <el-form-item label="快递公司" required>
          <el-select v-model="shipForm.express" placeholder="请选择快递公司">
            <el-option label="顺丰速运" value="顺丰速运"></el-option>
            <el-option label="圆通快递" value="圆通快递"></el-option>
            <el-option label="中通快递" value="中通快递"></el-option>
            <el-option label="韵达快递" value="韵达快递"></el-option>
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

  <!-- 订单编辑弹窗（核心新增） -->
  <el-dialog
    v-model="editModalVisible"
    title="编辑订单"
    width="700px"
    :close-on-click-modal="false"
  >
    <div v-if="currentEditOrder" class="space-y-4">
      <el-form :model="editForm" label-width="100px" :rules="editRules" ref="editFormRef">
        <el-form-item label="买家姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入买家姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input
            v-model="editForm.address"
            type="textarea"
            rows="2"
            placeholder="请输入收货地址"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="editForm.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="订单金额" prop="price">
          <el-input v-model="editForm.price" placeholder="请输入订单金额" prefix="¥" />
        </el-form-item>
        <el-form-item label="订单备注">
          <el-input
            v-model="editForm.remark"
            type="textarea"
            rows="2"
            placeholder="请输入备注（选填）"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="editModalVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存修改</el-button>
    </template>
  </el-dialog>

  <!-- 批量操作弹窗 -->
  <el-dialog
    v-model="batchOperationVisible"
    title="批量操作"
    width="400px"
    :close-on-click-modal="false"
  >
    <div class="space-y-4">
      <p class="text-sm">已选择 {{ selectedOrders.length }} 个订单</p>
      <p class="text-sm text-gray-500">请选择要执行的操作：</p>

      <el-radio-group v-model="batchType">
        <el-radio label="batchShip">批量发货</el-radio>
        <el-radio label="batchCancel">批量取消</el-radio>
        <el-radio label="batchExport">导出订单</el-radio>
      </el-radio-group>
    </div>

    <template #footer>
      <el-button @click="batchOperationVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmBatchOperation">确认执行</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'

// ===================== 基础数据 =====================
const orderSearchInput = ref('')
const orderStatusFilter = ref('')
const selectedOrders = ref<any[]>([])
const orderDetailVisible = ref(false)
const shipModalVisible = ref(false)
const batchOperationVisible = ref(false)
const editModalVisible = ref(false)
const currentOrder = ref<any>(null)
const currentEditOrder = ref<any>(null)
const batchType = ref('batchShip')
const editFormRef = ref<InstanceType<typeof ElForm>>()

// 发货表单
const shipForm = ref({
  express: '',
  expressNo: '',
  remark: '',
})

// 编辑表单（核心新增）
const editForm = reactive({
  name: '',
  phone: '',
  address: '',
  productName: '',
  price: '',
  remark: '',
})

// 编辑表单
const editRules = reactive<Record<string, import('element-plus').FormItemRule[]>>({
  name: [{ required: true, message: '请输入买家姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入订单金额', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的金额格式', trigger: 'blur' },
  ],
})

// 订单数据
interface OrderRow {
  id: string
  name: string
  productName: string
  address: string
  phone: string
  status: string
  time: string
  price: string
  remark?: string
}

const orderData = ref<OrderRow[]>([
  {
    id: '20160502',
    time: '2016-05-02 10:20:30',
    name: '王小虎',
    productName: '宠物零食大礼包-鸡肉味',
    address: '上海',
    phone: '18888888888',
    status: '待付款',
    price: '500',
    remark: '',
  },
  {
    id: '20160504',
    time: '2016-05-02 14:30:20',
    name: '王小虎',
    productName: '进口宠物冻干零食-三文鱼味',
    address: '上海市普陀江路 1518上海市普陀区金沙江路 1518 ',
    phone: '18888888888',
    status: '待发货',
    price: '500',
    remark: '',
  },
  {
    id: '20160501',
    time: '2016-05-02 09:15:45',
    name: '王小虎',
    productName: '宠物主食罐-牛肉味',
    address: '上海',
    phone: '18888888888',
    status: '待收货',
    price: '500',
    remark: '',
  },
  {
    id: '20160503',
    time: '2016-05-02 16:40:10',
    name: '王小虎',
    productName: '宠物玩具-耐咬球',
    address: '上海',
    phone: '18888888888',
    status: '待评价',
    price: '500',
    remark: '',
  },
])

// ===================== 核心方法 =====================
// 筛选订单
const filteredOrderData = computed(() => {
  return orderData.value.filter((item) => {
    if (orderStatusFilter.value && item.status !== orderStatusFilter.value) return false
    if (orderSearchInput.value) {
      const searchStr = orderSearchInput.value.toLowerCase()
      return (
        item.id.toLowerCase().includes(searchStr) ||
        item.name.toLowerCase().includes(searchStr) ||
        item.phone.includes(searchStr)
      )
    }
    return true
  })
})

// 判断订单是否可编辑（核心新增）
const isEditable = (status: string) => {
  return ['待付款', '待发货'].includes(status)
}

// 订单状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case '待付款':
      return 'warning'
    case '待发货':
      return 'info'
    case '待收货':
      return 'success'
    case '待评价':
      return 'primary'
    case '已完成':
      return 'success'
    case '已取消':
      return 'danger'
    default:
      return ''
  }
}

// 打开编辑弹窗（核心新增）
const openEditModal = (row: OrderRow) => {
  if (!isEditable(row.status)) return
  currentEditOrder.value = { ...row }
  // 初始化编辑表单
  editForm.name = row.name
  editForm.phone = row.phone
  editForm.address = row.address
  editForm.productName = row.productName
  editForm.price = row.price
  editForm.remark = row.remark || ''
  editModalVisible.value = true
}

// 保存编辑（核心新增）
const saveEdit = () => {
  if (!editFormRef.value) return
  editFormRef.value.validate((valid) => {
    if (valid && currentEditOrder.value) {
      // 更新订单数据
      const index = orderData.value.findIndex((item) => item.id === currentEditOrder.value.id)
      if (index > -1) {
        orderData.value[index] = {
          ...orderData.value[index],
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
          productName: editForm.productName,
          price: editForm.price,
          remark: editForm.remark,
        }
        ElMessage.success('订单编辑成功！')
        editModalVisible.value = false
      }
    } else {
      ElMessage.warning('请完善表单信息！')
    }
  })
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
const confirmShip = () => {
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
  }).then(() => {
    currentOrder.value.status = '待收货'
    shipModalVisible.value = false
    orderDetailVisible.value = false
    ElMessage.success(`发货成功！运单号：${shipForm.value.expressNo}`)
  })
}

// 取消订单
const cancelOrder = (row: OrderRow) => {
  ElMessageBox.confirm('确认取消该订单吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    row.status = '已取消'
    ElMessage.success('订单已取消！')
  })
}

// 批量操作
const batchOperation = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请先选择要操作的订单！')
    return
  }
  batchOperationVisible.value = true
}

// 批量发货
const batchShip = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请先选择要发货的订单！')
    return
  }
  batchType.value = 'batchShip'
  batchOperationVisible.value = true
}

// 确认批量操作
const confirmBatchOperation = () => {
  let msg = ''
  switch (batchType.value) {
    case 'batchShip':
      msg = '确认批量发货选中的订单吗？'
      break
    case 'batchCancel':
      msg = '确认批量取消选中的订单吗？'
      break
    case 'batchExport':
      msg = '确认导出选中的订单数据吗？'
      break
    default:
      msg = '确认执行批量操作吗？'
  }

  ElMessageBox.confirm(msg, '批量操作', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchOperationVisible.value = false
    if (batchType.value === 'batchShip') {
      selectedOrders.value.forEach((order) => {
        order.status = '待收货'
      })
      ElMessage.success(`成功发货 ${selectedOrders.value.length} 个订单！`)
    } else if (batchType.value === 'batchCancel') {
      selectedOrders.value.forEach((order) => {
        order.status = '已取消'
      })
      ElMessage.success(`成功取消 ${selectedOrders.value.length} 个订单！`)
    } else if (batchType.value === 'batchExport') {
      ElMessage.success(`成功导出 ${selectedOrders.value.length} 个订单数据！`)
    }
    selectedOrders.value = []
  })
}

// 其他工具方法
const handleOrderSelectionChange = (val: any[]) => {
  selectedOrders.value = val
}
const searchOrder = () => {
  console.log('搜索订单:', orderSearchInput.value, orderStatusFilter.value)
}
const refreshOrder = () => {
  ElMessage.success('订单列表已刷新')
}
const handleSizeChange = (val: number) => {
  console.log('每页条数:', val)
}
const handleCurrentChange = (val: number) => {
  console.log('当前页:', val)
}
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
