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
            优惠券类型：{{ currentCoupon.discountType === 1 ? '满减券' : '折扣券' }}
          </p>
          <p class="text-sm text-gray-500">折扣/金额：{{ currentCoupon.discount }}</p>
          <p class="text-sm text-gray-500">使用条件：{{ currentCoupon.minAmount || '无门槛' }}</p>
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

  <el-dialog
    v-model="couponDialogVisible"
    title="发放优惠券"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="couponForm" :rules="couponRules" ref="couponFormRef" label-width="120px">
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input v-model="couponForm.couponName" placeholder="请输入优惠券名称" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="discountType">
        <el-radio-group v-model="couponForm.discountType" size="small">
          <el-radio :label="1">满减券</el-radio>
          <el-radio :label="2">折扣券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="couponForm.discountType === 1" label="满减金额" prop="discount">
        <el-input
          v-model.number="couponForm.discount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="请输入满减金额"
        />
      </el-form-item>
      <el-form-item v-else-if="couponForm.discountType === 2" label="折扣比例" prop="discount">
        <el-input
          v-model.number="couponForm.discount"
          type="number"
          min="0.1"
          max="9.9"
          step="0.1"
          placeholder="请输入折扣值（如8.5表示85折）"
        />
        <div class="text-sm text-gray-500 mt-1">输入格式:8.5表示85折</div>
      </el-form-item>
      <el-form-item label="使用门槛" prop="minAmount">
        <div class="flex items-center">
          <el-input
            v-model.number="couponForm.minAmount"
            type="number"
            min="0"
            step="1"
            placeholder="请输入使用门槛"
          />
          <span class="ml-2 text-gray-500">元</span>
          <el-checkbox v-model="couponForm.isFree" class="ml-4">无门槛</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="用户限领数量" prop="perLimit">
        <el-input
          v-model.number="couponForm.perLimit"
          type="number"
          min="0"
          placeholder="0表示不限领"
        />
      </el-form-item>
      <el-form-item label="发行量" prop="totalCount">
        <el-input
          v-model.number="couponForm.totalCount"
          type="number"
          min="1"
          placeholder="请输入发行量"
        />
      </el-form-item>
      <el-form-item label="优惠券描述" prop="description">
        <el-input
          v-model="couponForm.description"
          type="textarea"
          :rows="3"
          placeholder="请输入优惠券描述"
        />
      </el-form-item>

      <el-form-item label="生效天数" prop="validDays">
        <el-select v-model="couponForm.validDays" placeholder="请选择生效天数">
          <el-option label="7天" :value="7" />
          <el-option label="30天" :value="30" />
          <el-option label="90天" :value="90" />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期时间" prop="timeRange">
        <el-date-picker
          v-model="couponForm.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="适用商品类型" prop="usedToProductType">
        <el-select v-model="couponForm.usedToProductType" placeholder="请选择适用商品类型">
          <el-option label="全部商品" :value="0" />
          <el-option-group
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            style="font-weight: 600"
          >
            <el-option
              v-for="child in category.children"
              :key="child.id"
              :label="child.name"
              :value="Number(child.id)"
              style="font-weight: 600"
            />
          </el-option-group>
        </el-select>
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
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
      <el-form-item label="优惠券编号" prop="id">
        <el-input v-model="editForm.id" disabled />
      </el-form-item>
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input v-model="editForm.couponName" placeholder="请输入优惠券名称" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="discountType">
        <el-radio-group v-model="editForm.discountType" size="small">
          <el-radio :label="1">满减券</el-radio>
          <el-radio :label="2">折扣券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="editForm.discountType === 1" label="满减金额" prop="discount">
        <el-input
          v-model.number="editForm.discount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="请输入满减金额"
        />
      </el-form-item>
      <el-form-item v-else-if="editForm.discountType === 2" label="折扣比例" prop="discount">
        <el-input
          v-model.number="editForm.discount"
          type="number"
          min="0.1"
          max="9.9"
          step="0.1"
          placeholder="请输入折扣值（如8.5表示85折）"
        />
      </el-form-item>
      <el-form-item label="使用门槛" prop="minAmount">
        <div class="flex items-center">
          <el-input
            v-model.number="editForm.minAmount"
            type="number"
            min="0"
            step="1"
            placeholder="请输入使用门槛"
          />
          <span class="ml-2 text-gray-500">元</span>
          <el-checkbox v-model="editForm.isFree" class="ml-4">无门槛</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="用户限领数量" prop="perLimit">
        <el-input
          v-model.number="editForm.perLimit"
          type="number"
          min="0"
          placeholder="0表示不限领"
        />
      </el-form-item>
      <el-form-item label="发行量" prop="totalCount">
        <el-input
          v-model.number="editForm.totalCount"
          type="number"
          min="1"
          placeholder="请输入发行量"
        />
      </el-form-item>
      <el-form-item label="优惠券描述" prop="description">
        <el-input
          v-model="editForm.description"
          type="textarea"
          :rows="3"
          placeholder="请输入优惠券描述"
        />
      </el-form-item>

      <el-form-item label="生效天数" prop="validDays">
        <el-select v-model="editForm.validDays" placeholder="请选择生效天数">
          <el-option label="3天" :value="3" />
          <el-option label="7天" :value="7" />
          <el-option label="30天" :value="30" />
          <el-option label="90天" :value="90" />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期时间" prop="timeRange">
        <el-date-picker
          v-model="editForm.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="适用商品类型" prop="usedToProductType">
        <el-select v-model="editForm.usedToProductType" placeholder="请选择适用商品类型">
          <el-option label="全部商品" :value="0" />
          <el-option-group
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            style="font-weight: 600"
          >
            <el-option
              v-for="child in category.children"
              :key="child.id"
              :label="child.name"
              :value="Number(child.id)"
              style="font-weight: 600"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="editCouponDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEditCoupon">确认修改</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getShopCouponList,
  createShopCoupon,
  updateShopCoupon,
  deleteShopCoupon,
  updateCouponStatus,
  getProductCategoryList,
} from '@/api/pet-shop/coupos'

// 搜索输入
const searchInput = ref('')
const categories = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

interface Coupon {
  id: string
  name?: string
  couponName?: string
  discountType: number
  discount: number
  minAmount: number
  perLimit: number
  totalCount: number
  usedCount: number
  receiveCount: number
  description: string
  startTime: string
  endTime: string
  validDays: number
  status: string
  usedToProductType: number
  usedToProductTypeName: string
  couponSn?: string
  createTime?: string
  updateTime?: string
}

const couponList = ref<Coupon[]>([])
const couponDetailVisible = ref(false)
const currentCoupon = ref<any>(null)

// 加载商品分类
const loadCategories = async () => {
  try {
    const res = await getProductCategoryList()
    if (res.ok) categories.value = res.data
  } catch (error) {
    console.error('加载商品分类失败:', error)
  }
}

// 打开详情
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
        value: item.discountType === 1 ? item.discount : item.discount,
        condition: item.minAmount || '',
        total: item.totalCount || '0',
        used: item.usedCount || '0',
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        couponSn: item.couponSn,
        discountType: item.discountType,
        discount: item.discount,
        minAmount: item.minAmount,
        perLimit: item.perLimit,
        totalCount: item.totalCount,
        description: item.description,
        validDays: item.validDays,
        usedToProductType: item.usedToProductType,
        usedToProductTypeName: item.usedToProductTypeName,
        receiveCount: item.receiveCount,
        usedCount: item.usedCount,
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

const searchCoupon = () => {
  pageNum.value = 1
  loadCouponList()
}

//  新增优惠券
const couponDialogVisible = ref(false)
const couponFormRef = ref()
const couponForm = ref({
  couponName: '',
  discountType: 1,
  discount: 0,
  minAmount: 0,
  isFree: false,
  perLimit: 0,
  totalCount: 1,
  description: '',
  validDays: 30,
  timeRange: [],
  usedToProductType: 0,
})

// 无门槛自动设0
watch(
  () => couponForm.value.isFree,
  (val) => {
    if (val) couponForm.value.minAmount = 0
  },
)

// 表单校验（修复完成）
const couponRules = {
  couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  discountType: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  discount: [
    { required: true, message: '请输入优惠金额或折扣值', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '必须大于0', trigger: 'blur' },
  ],
  totalCount: [{ required: true, message: '请输入发行量', trigger: 'blur' }],
  validDays: [{ required: true, message: '请选择生效天数', trigger: 'change' }],
  timeRange: [
    { required: true, message: '请选择有效期', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value || value.length < 2) return callback()
        const start = new Date(value[0])
        const end = new Date(value[1])
        if (end <= start) callback(new Error('结束时间必须大于开始时间'))
        else callback()
      },
      trigger: 'change',
    },
  ],
}

const openCouponDialog = () => {
  couponForm.value = {
    couponName: '',
    discountType: 1,
    discount: 0,
    minAmount: 0,
    isFree: false,
    perLimit: 0,
    totalCount: 1,
    description: '',
    validDays: 30,
    timeRange: [],
    usedToProductType: 0,
  }
  couponDialogVisible.value = true
}

// 提交新增
const submitCoupon = async () => {
  await couponFormRef.value.validate()
  const f = couponForm.value
  const startTime = f.timeRange[0].replace('T', ' ')
  const endTime = f.timeRange[1].replace('T', ' ')

  const params = {
    couponName: f.couponName,
    discountType: f.discountType,
    discount: f.discount,
    minAmount: f.isFree ? 0 : f.minAmount,
    perLimit: f.perLimit,
    totalCount: f.totalCount,
    description: f.description,
    startTime: startTime,
    endTime: endTime,
    validDays: f.validDays,
    usedToProductType: f.usedToProductType,
  }

  const res = await createShopCoupon(params)
  if (res?.ok) {
    ElMessage.success('发放成功')
    couponDialogVisible.value = false
    loadCouponList()
  }
}

// 编辑优惠券

let originalForm: Coupon = {
  id: '',
  couponName: '',
  discountType: 1,
  discount: 0,
  minAmount: 0,
  perLimit: 0,
  totalCount: 1,
  description: '',
  validDays: 30,
  startTime: '',
  endTime: '',
  usedToProductType: 0,
  usedCount: 0,
  receiveCount: 0,
  status: '',
  usedToProductTypeName: '',
}

const editCouponDialogVisible = ref(false)
const editFormRef = ref()
const editForm = ref({
  id: '',
  couponName: '',
  discountType: 1,
  discount: 0,
  minAmount: 0,
  isFree: false,
  perLimit: 0,
  totalCount: 1,
  description: '',
  validDays: 30,
  timeRange: [],
  usedToProductType: 0,
})

const editRules = {
  couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  discountType: [{ required: true, message: '请选择折扣类型', trigger: 'change' }],
  discount: [{ required: true, message: '请输入折扣金额或比例', trigger: 'blur' }],
  timeRange: [{ required: true, message: '请选择有效期', trigger: 'change' }],
  validDays: [{ required: true, message: '请输入生效天数', trigger: 'blur' }],
  totalCount: [{ required: true, message: '请输入发行总数量', trigger: 'blur' }],
}

// 打开编辑弹窗
const openEditCouponDialog = (row: any) => {
  originalForm = {
    id: row.id,
    couponName: row.couponName || row.name, // 兼容不同字段名
    discountType: row.discountType,
    discount: row.discount,
    minAmount: row.minAmount,
    perLimit: row.perLimit,
    totalCount: row.totalCount,
    description: row.description,
    validDays: row.validDays,
    startTime: row.startTime,
    endTime: row.endTime,
    usedToProductType: row.usedToProductType,
    usedCount: row.usedCount || 0,
    receiveCount: row.receiveCount || 0,
    status: row.status || '',
    usedToProductTypeName: row.usedToProductTypeName || '',
  }

  editForm.value = {
    id: row.id,
    couponName: row.couponName || row.name,
    discountType: row.discountType,
    discount: row.discount,
    minAmount: row.minAmount,
    isFree: !row.minAmount,
    perLimit: row.perLimit,
    totalCount: row.totalCount,
    description: row.description,
    validDays: row.validDays,
    timeRange: [row.startTime, row.endTime],
    usedToProductType: row.usedToProductType,
  }
  editCouponDialogVisible.value = true
}

// 提交编辑（只传修改字段）
const submitEditCoupon = async () => {
  await editFormRef.value.validate()
  const f = editForm.value

  // 更可靠的时间格式处理
  const startTime = f.timeRange?.[0] ? f.timeRange[0].replace('T', ' ') : ''
  const endTime = f.timeRange?.[1] ? f.timeRange[1].replace('T', ' ') : ''

  const params: any = { id: f.id }

  if (f.couponName !== originalForm.couponName) params.couponName = f.couponName
  if (f.discountType !== originalForm.discountType) params.discountType = f.discountType
  if (f.discount !== originalForm.discount) params.discount = f.discount
  if (f.minAmount !== originalForm.minAmount) params.minAmount = f.isFree ? 0 : f.minAmount
  if (f.perLimit !== originalForm.perLimit) params.perLimit = f.perLimit
  if (f.totalCount !== originalForm.totalCount) params.totalCount = f.totalCount
  if (f.description !== originalForm.description) params.description = f.description
  if (f.timeRange[0] !== originalForm.startTime) params.startTime = startTime
  if (f.timeRange[1] !== originalForm.endTime) params.endTime = endTime
  if (f.validDays !== originalForm.validDays) params.validDays = f.validDays
  if (f.usedToProductType !== originalForm.usedToProductType)
    params.usedToProductType = f.usedToProductType

  try {
    const res = await updateShopCoupon(params)
    if (res?.ok) {
      ElMessage.success('修改成功')
      editCouponDialogVisible.value = false
      loadCouponList()
    }
  } catch (error) {
    console.error('修改优惠券失败:', error)
    ElMessage.error('修改优惠券失败')
  }
}

//  删除
const deleteCoupon = async (row: any) => {
  await ElMessageBox.confirm('确定删除？')
  const res = await deleteShopCoupon(row.id)
  if (res.ok) {
    ElMessage.success('删除成功')
    loadCouponList()
  }
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
  loadCategories()
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
