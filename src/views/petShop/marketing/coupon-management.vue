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
              <el-button size="default" type="primary">搜索</el-button>
              <el-button size="default" type="success" icon="Plus" @click="openCouponDialog">
                新增优惠券
              </el-button>
            </div>
          </div>

          <el-table
            :data="couponList"
            style="width: 100%"
            stripe
            :cell-style="{ padding: '14px 0', borderRight: '1px solid #f0f0f0' }"
            :header-cell-style="{
              background: '#f5f5f5',
              color: '#606266',
              fontWeight: '500',
              borderBottom: '1px solid #e0e0e0',
            }"
          >
            <el-table-column prop="id" label="优惠券编号" width="120" />
            <el-table-column prop="name" label="优惠券名称" />
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
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default>
                <div class="flex gap-2">
                  <el-button size="mini" type="text" class="text-blue-600" @click="openCouponDialog"
                    >编辑</el-button
                  >
                  <el-button size="mini" type="text" class="text-green-600">启用</el-button>
                  <el-button size="mini" type="text" class="text-red-600">禁用</el-button>
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
            <div class="text-sm text-gray-500">共 {{ couponList.length }} 张优惠券</div>
            <el-pagination
              layout="prev, pager, next"
              :total="100"
              :page-size="10"
              :pager-count="5"
              style="margin: 0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
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
      <el-button type="primary">确认修改</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索输入
const searchInput = ref('')

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
  status: '未开始' | '生效中' | '已过期' | '已禁用'
}

const getStatusType = (status: string) => {
  switch (status) {
    case '生效中':
      return 'success'
    case '未开始':
      return 'info'
    case '已过期':
      return 'warning'
    case '已禁用':
      return 'danger'
    default:
      return ''
  }
}

const couponList: Coupon[] = [
  {
    id: 'CP2025001',
    name: '新人专享券',
    value: '20',
    condition: '100',
    total: '1000',
    used: '782',
    startTime: '2025-01-01',
    endTime: '2025-12-31',
    status: '生效中',
  },
  {
    id: 'CP2025002',
    name: '周末特惠折扣',
    value: '8.5',
    condition: '',
    total: '500',
    used: '129',
    startTime: '2025-06-01',
    endTime: '2025-06-30',
    status: '已过期',
  },
  {
    id: 'CP2025003',
    name: '会员专属满减',
    value: '50',
    condition: '200',
    total: '300',
    used: '0',
    startTime: '2025-11-01',
    endTime: '2025-11-30',
    status: '未开始',
  },
  {
    id: 'CP2025004',
    name: '清仓折扣券',
    value: '7',
    condition: '',
    total: '200',
    used: '56',
    startTime: '2025-09-01',
    endTime: '2025-09-15',
    status: '已禁用',
  },
]

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
const submitCoupon = () => {
  if (couponFormRef.value) {
    couponFormRef.value.validate((valid: boolean) => {
      if (valid) {
        console.log('优惠券表单数据:', couponForm.value)
        ElMessage.success('优惠券发放成功')
        couponDialogVisible.value = false
        resetCouponForm()
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
  total: [
    { required: true, message: '请输入发行量', trigger: 'blur' },
    { type: 'number', min: 1, message: '发行量必须大于0', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '请输入优惠金额或折扣值', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '优惠金额必须大于0', trigger: 'blur' },
  ],
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
