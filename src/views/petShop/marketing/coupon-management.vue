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
            <div class="text-lg font-bold text-gray-800">优惠券管理</div>
            <div class="flex flex-row gap-3">
              <el-input
                placeholder="请输入优惠券名称/编号"
                v-model="searchInput"
                clearable
                style="width: 200px"
              >
                <template #prefix>
                  <i class="fas fa-search text-md text-gray-300"></i>
                </template>
              </el-input>
              <el-button size="default" type="primary" @click="searchCoupon">搜索</el-button>
              <el-button size="default" type="success" icon="Plus" @click="openCouponDialog">
                新增优惠券
              </el-button>
            </div>
          </div>

          <el-table
            :data="couponList"
            style="width: 100%"
            stripe
            :loading="loading"
            :cell-style="{ padding: '14px 0', borderRight: '1px solid #f0f0f0' }"
            :header-cell-style="{
              background: '#f5f5f5',
              color: '#606266',
              fontWeight: '500',
              borderBottom: '1px solid #e0e0e0',
            }"
          >
            <el-table-column prop="id" label="优惠券编号" width="200" />
            <el-table-column prop="name" label="优惠券名称" width="140" />
            <el-table-column prop="value" label="优惠金额" width="120">
              <template #default="scope">
                {{
                  scope.row.type === '满减券'
                    ? `满${scope.row.condition}减${scope.row.value}`
                    : `打${scope.row.value}折`
                }}
              </template>
            </el-table-column>
            <el-table-column prop="total" label="总发行量" width="100" />
            <el-table-column prop="used" label="已使用" width="100" />
            <el-table-column prop="startTime" label="开始时间" width="160" />
            <el-table-column prop="endTime" label="结束时间" width="160" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
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
                    @click="openEditCouponDialog(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="scope.row.status === '禁用'"
                    size="mini"
                    type="text"
                    class="text-green-600"
                    @click="toggleCouponStatus(scope.row, 1)"
                    >启用</el-button
                  >
                  <el-button
                    v-if="scope.row.status === '启用'"
                    size="mini"
                    type="text"
                    class="text-red-600"
                    @click="toggleCouponStatus(scope.row, 0)"
                    >禁用</el-button
                  >
                  <el-button
                    v-if="scope.row.status === '禁用'"
                    size="mini"
                    type="text"
                    class="text-red-600"
                    @click="deleteCoupon(scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    class="text-purple-600"
                    @click="openCouponDetail(scope.row)"
                    >详情</el-button
                  >
                </div>
              </template>
            </el-table-column>

            <template #empty>
              <div class="py-10 flex flex-col items-center justify-center text-gray-400">
                <i class="fas fa-ticket-alt text-4xl mb-3"></i>
                <div class="text-lg">暂无优惠券数据</div>
                <div class="text-sm mt-1">点击"新增优惠券"创建优惠活动</div>
              </div>
            </template>
          </el-table>

          <!-- 分页 -->
          <div class="px-4 py-3 border-t border-gray-200 flex justify-between items-center mt-3">
            <div class="text-sm text-gray-500">共 {{ total }} 张优惠券</div>
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :page-size="pageSize"
              :current-page="pageNum"
              :pager-count="5"
              style="margin: 0"
              @current-change="
                (current) => {
                  pageNum = current
                  loadCouponList()
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 优惠券详情弹窗 -->
  <el-dialog
    v-model="couponDetailVisible"
    title="优惠券详情"
    width="600px"
    :close-on-click-modal="false"
  >
    <div v-if="currentCoupon" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">优惠券名称：{{ currentCoupon.name }}</p>
          <p class="text-sm text-gray-500">优惠券编号：{{ currentCoupon.couponSn || '未知' }}</p>
          <p class="text-sm text-gray-500">
            优惠券类型：{{ currentCoupon.discountType || '未知' }}
          </p>
          <p class="text-sm text-gray-500">
            折扣/金额：{{ currentCoupon.discount || currentCoupon.value || '未知' }}
          </p>
          <p class="text-sm text-gray-500">使用条件：{{ currentCoupon.minAmount || '无' }}</p>
          <p class="text-sm text-gray-500">每人限领：{{ currentCoupon.perLimit || '无限制' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">总发行量：{{ currentCoupon.totalCount || '0' }}</p>
          <p class="text-sm text-gray-500">已领取：{{ currentCoupon.receiveCount || '0' }}</p>
          <p class="text-sm text-gray-500">已使用：{{ currentCoupon.usedCount || '0' }}</p>
          <p class="text-sm text-gray-500">状态：{{ currentCoupon.status }}</p>
          <p class="text-sm text-gray-500">
            有效期：{{ currentCoupon.startTime }} 至 {{ currentCoupon.endTime }}
          </p>
          <p class="text-sm text-gray-500">
            适用商品类型：{{ currentCoupon.usedToProductTypeName || '全部' }}
          </p>
        </div>
      </div>
      <div v-if="currentCoupon.description" class="pt-2 border-t">
        <h4 class="font-medium mb-2">优惠券描述</h4>
        <p class="text-sm bg-gray-50 p-2 rounded">{{ currentCoupon.description }}</p>
      </div>
      <div class="pt-2 border-t">
        <h4 class="font-medium mb-2">创建信息</h4>
        <p class="text-sm text-gray-500">创建时间：{{ currentCoupon.createTime || '未知' }}</p>
        <p class="text-sm text-gray-500">更新时间：{{ currentCoupon.updateTime || '未知' }}</p>
      </div>
    </div>
    <template #footer>
      <el-button @click="couponDetailVisible = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 发放优惠卷弹窗 -->
  <el-dialog
    v-model="couponDialogVisible"
    title="发放优惠券"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form :model="couponForm" :rules="couponRules" ref="couponFormRef" label-width="100px">
      <el-form-item label="优惠券编号" prop="id">
        <el-input v-model="couponForm.id" />
      </el-form-item>
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="couponForm.name" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="type">
        <el-radio-group v-model="couponForm.type" size="small">
          <el-radio label="满减券">满减券</el-radio>
          <el-radio label="折扣券">折扣券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="couponForm.type === '满减券'" label="优惠金额" prop="value">
        <el-input
          v-model.number="couponForm.value"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="请输入优惠金额"
          prefix-icon="el-icon-monitor"
        />
      </el-form-item>
      <el-form-item v-else-if="couponForm.type === '折扣券'" label="折扣值" prop="value">
        <el-input
          v-model.number="couponForm.value"
          type="number"
          min="0.1"
          max="9.9"
          step="0.1"
          placeholder="请输入折扣值（如8.5表示85折）"
        />
        <div class="text-sm text-gray-500 mt-1">输入格式:8.5表示85折</div>
      </el-form-item>
      <el-form-item label="使用门槛" prop="min">
        <div class="flex items-center">
          <el-input
            v-model.number="couponForm.min"
            type="number"
            min="0"
            step="1"
            placeholder="请输入使用门槛"
          />
          <span class="ml-2 text-gray-500">元</span>
          <el-checkbox v-model="couponForm.isFree" class="ml-4">无门槛</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="发行量" prop="total">
        <el-input
          v-model.number="couponForm.total"
          type="number"
          min="1"
          placeholder="请输入发行量"
        />
      </el-form-item>
      <el-form-item label="有效期" prop="validPeriod">
        <el-select v-model="couponForm.validPeriod" placeholder="请选择有效期">
          <el-option label="7天" :value="7" />
          <el-option label="30天" :value="30" />
          <el-option label="90天" :value="90" />
          <el-option label="自定义" :value="'custom'" />
        </el-select>
      </el-form-item>
      <el-form-item label="自定义时间">
        <el-date-picker
          v-model="couponForm.customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="couponDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitCoupon">确认发放</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editCouponDialogVisible"
    title="编辑优惠券"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
      <el-form-item label="优惠券编号" prop="id">
        <el-input v-model="editForm.id" disabled />
      </el-form-item>
      <!-- 其他表单项保持不变，但都使用editForm -->
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="type">
        <el-radio-group v-model="editForm.type" size="small">
          <el-radio label="满减券">满减券</el-radio>
          <el-radio label="折扣券">折扣券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="editForm.type === '满减券'" label="优惠金额" prop="value">
        <el-input
          v-model.number="editForm.value"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="请输入优惠金额"
          prefix-icon="el-icon-monitor"
        />
      </el-form-item>
      <el-form-item v-else-if="editForm.type === '折扣券'" label="折扣值" prop="value">
        <el-input
          v-model.number="editForm.value"
          type="number"
          min="0.1"
          max="9.9"
          step="0.1"
          placeholder="请输入折扣值（如8.5表示85折）"
        />
        <div class="text-sm text-gray-500 mt-1">输入格式:8.5表示85折</div>
      </el-form-item>
      <el-form-item label="使用门槛" prop="min">
        <div class="flex items-center">
          <el-input
            v-model.number="editForm.min"
            type="number"
            min="0"
            step="1"
            placeholder="请输入使用门槛"
          />
          <span class="ml-2 text-gray-500">元</span>
          <el-checkbox v-model="editForm.isFree" class="ml-4">无门槛</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="发行量" prop="total">
        <el-input
          v-model.number="editForm.total"
          type="number"
          min="1"
          placeholder="请输入发行量"
        />
      </el-form-item>
      <el-form-item label="有效期" prop="validPeriod">
        <el-select v-model="editForm.validPeriod" placeholder="请选择有效期">
          <el-option label="7天" :value="7" />
          <el-option label="30天" :value="30" />
          <el-option label="90天" :value="90" />
          <el-option label="自定义" :value="'custom'" />
        </el-select>
      </el-form-item>
      <el-form-item label="自定义时间">
        <el-date-picker
          v-model="editForm.customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="editCouponDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEditCoupon">确认修改</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getShopCouponList,
  createShopCoupon,
  updateShopCoupon,
  deleteShopCoupon,
  updateCouponStatus,
} from '@/api/pet-shop/coupos'

// 搜索输入
const searchInput = ref('')

// 分页数据
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

// 优惠券类型
interface Coupon {
  id: string
  name: string
  value: string
  condition: string
  total: string
  used: string
  startTime: string
  endTime: string
  status: string
}

const couponList = ref<Coupon[]>([])

// 优惠券详情弹窗
const couponDetailVisible = ref(false)
const currentCoupon = ref<any>(null)

// 打开优惠券详情
const openCouponDetail = (coupon: Coupon) => {
  currentCoupon.value = coupon
  couponDetailVisible.value = true
}
// 加载优惠券列表
const loadCouponList = async () => {
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
      couponName: searchInput.value,
    }

    const res = await getShopCouponList(params)
    console.log('res', res)
    if (res?.ok) {
      couponList.value = (res.data.list || []).map((item: any) => ({
        id: item.id,
        name: item.couponName,
        value: item.discountType === 1 ? item.discountValue : item.minAmount,
        condition: item.minAmount || '',
        total: item.totalCount || '0',
        used: item.usedCount || '0',
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        couponSn: item.couponSn,
        discountType: item.discountType === 1 ? '满减' : '折扣',
        discount: item.discount,
        perLimit: item.perLimit,
        receiveCount: item.receiveCount,
        description: item.description,
        usedToProductType: item.usedToProductType,
        usedToProductTypeName: item.usedToProductTypeName,
        usedToShop: item.usedToShop,
        usedToShopName: item.usedToShopName,
        validDays: item.validDays,
        createTime: item.createTime,
        updateTime: item.updateTime,
      }))
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res?.msg || '获取优惠券列表失败')
    }
  } catch (e) {
    console.error('获取优惠券列表失败：', e)
    ElMessage.error('获取优惠券列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 搜索优惠券
const searchCoupon = () => {
  pageNum.value = 1
  loadCouponList()
}

// 优惠券弹窗
const couponDialogVisible = ref(false)
const couponFormRef = ref()

// 优惠券表单数据
const couponForm = ref({
  id: '',
  name: '',
  type: '满减券',
  value: 0,
  min: 0,
  isFree: false,
  total: 1,
  validPeriod: 30,
  customDateRange: null,
})

const couponRules = ref({
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  total: [
    { required: true, message: '请输入发行量', trigger: 'blur' },
    { type: 'number', min: 1, message: '发行量必须大于0', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '请输入优惠金额或折扣值', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '优惠金额必须大于0', trigger: 'blur' },
  ],
})

const openCouponDialog = (coupon?: Coupon) => {
  if (coupon) {
    couponForm.value = {
      id: coupon.id,
      name: coupon.name,
      type: coupon.condition ? '满减券' : '折扣券',
      value: parseFloat(coupon.value),
      min: coupon.condition ? parseFloat(coupon.condition) : 0,
      isFree: !coupon.condition,
      total: parseInt(coupon.total),
      validPeriod: 30,
      customDateRange: null,
    }
  } else {
    resetCouponForm()
  }
  couponDialogVisible.value = true
}

// 重置
const resetCouponForm = () => {
  if (couponFormRef.value) {
    couponFormRef.value.resetFields()
  }
  couponForm.value = {
    id: '',
    name: '',
    type: '满减券',
    value: 0,
    min: 0,
    isFree: false,
    total: 1,
    validPeriod: 30,
    customDateRange: null,
  }
}

// 提交
// 提交
const submitCoupon = async () => {
  if (couponFormRef.value) {
    couponFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        try {
          const now = new Date()
          const endDate = new Date(Date.now() + couponForm.value.validPeriod * 24 * 60 * 60 * 1000)

          const params = {
            couponName: couponForm.value.name,
            discountType: couponForm.value.type === '满减券' ? 1 : 0, // 修正：折扣券使用0
            discount: couponForm.value.value, // 添加discount参数
            discountValue: couponForm.value.type === '折扣券' ? couponForm.value.value : 0,
            minAmount: couponForm.value.isFree ? 0 : couponForm.value.min,
            totalCount: couponForm.value.total,
            description: '',
            startTime: formatDateTimeForBackend(now),
            endTime: formatDateTimeForBackend(endDate),
            usedToProductType: 0,
          }
          const res = await createShopCoupon(params)
          if (res?.ok) {
            ElMessage.success('优惠券发放成功')
            couponDialogVisible.value = false
            resetCouponForm()
            loadCouponList()
          } else {
            ElMessage.error(res?.msg || '优惠券发放失败')
          }
        } catch (e) {
          console.error('优惠券发放失败：', e)
          ElMessage.error('优惠券发放失败，请稍后重试')
        }
      }
    })
  }
}

//编辑
const editCouponDialogVisible = ref(false)
const editForm = ref({
  id: '',
  name: '',
  type: '满减券',
  value: 0,
  min: 0,
  isFree: false,
  total: 1,
  validPeriod: 30,
  customDateRange: null,
})
const editRules = ref({
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  total: [
    { required: true, message: '请输入发行量', trigger: 'blur' },
    { type: 'number', min: 1, message: '发行量必须大于0', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '请输入优惠金额或折扣值', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '优惠金额必须大于0', trigger: 'blur' },
  ],
})

// 打开编辑弹窗
const openEditCouponDialog = (coupon: Coupon) => {
  editForm.value = {
    id: coupon.id,
    name: coupon.name,
    type: coupon.condition ? '满减券' : '折扣券',
    value: parseFloat(coupon.value),
    min: coupon.condition ? parseFloat(coupon.condition) : 0,
    isFree: !coupon.condition,
    total: parseInt(coupon.total),
    validPeriod: 30,
    customDateRange: null,
  }
  editCouponDialogVisible.value = true
}

// 提交编辑
const submitEditCoupon = async () => {
  if (editForm.value.id) {
    try {
      const now = new Date()
      const endDate = new Date(Date.now() + editForm.value.validPeriod * 24 * 60 * 60 * 1000)

      const params = {
        id: editForm.value.id,
        couponName: editForm.value.name,
        discountType: editForm.value.type === '满减券' ? 1 : 0, // 修正：折扣券使用0
        discount: editForm.value.value, // 添加discount参数
        discountValue: editForm.value.type === '折扣券' ? editForm.value.value : 0,
        minAmount: editForm.value.isFree ? 0 : editForm.value.min,
        totalCount: editForm.value.total,
        description: '',
        startTime: formatDateTimeForBackend(now),
        endTime: formatDateTimeForBackend(endDate),
        usedToProductType: 0,
      }

      const res = await updateShopCoupon(params)
      if (res?.ok) {
        ElMessage.success('优惠券更新成功')
        editCouponDialogVisible.value = false
        loadCouponList()
      } else {
        ElMessage.error(res?.msg || '优惠券更新失败')
      }
    } catch (e) {
      console.error('优惠券更新失败：', e)
      ElMessage.error('优惠券更新失败，请稍后重试')
    }
  }
}

const formatDateTimeForBackend = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${h}:${m}:${s}`
}

// 删除优惠券
const deleteCoupon = (coupon: Coupon) => {
  ElMessageBox.confirm('确认删除该优惠券吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await deleteShopCoupon(coupon.id)
      if (res?.ok) {
        ElMessage.success('优惠券删除成功')
        loadCouponList()
      } else {
        ElMessage.error(res?.msg || '优惠券删除失败')
      }
    } catch (e) {
      console.error('优惠券删除失败：', e)
      ElMessage.error('优惠券删除失败，请稍后重试')
    }
  })
}

// 启用/禁用优惠券
const toggleCouponStatus = async (coupon: Coupon, status: number) => {
  try {
    const res = await updateCouponStatus(coupon.id, status)
    if (res?.ok) {
      ElMessage.success(status === 1 ? '优惠券启用成功' : '优惠券禁用成功')
      loadCouponList()
    } else {
      ElMessage.error(res?.msg || '操作失败')
    }
  } catch (e) {
    console.error('操作失败：', e)
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 初始化加载
onMounted(() => {
  loadCouponList()
})
</script>

<style scoped>
:deep(.el-tag--success) {
  background-color: #f0f9ff;
  color: #52c41a;
  border-color: #b7eb8f;
}
:deep(.el-tag--info) {
  background-color: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}
:deep(.el-tag--warning) {
  background-color: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}
:deep(.el-tag--danger) {
  background-color: #fff2f0;
  color: #f5222d;
  border-color: #ffccc7;
}
:deep(.el-table__row--striped td) {
  background-color: #fafafa !important;
}
</style>
