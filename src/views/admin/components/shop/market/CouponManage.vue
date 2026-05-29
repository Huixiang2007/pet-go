<template>
  <div class="coupon-manage-container">
    <div class="page-header">
      <el-icon class="icon"><Ticket /></el-icon>
      <h2>电商管理 - 平台优惠券管理</h2>
    </div>

    <el-card shadow="hover" class="main-card">
      <!-- 搜索区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="couponQuery" class="filter-form">
          <el-form-item label="优惠券名称">
            <el-input 
              v-model="couponQuery.couponName" 
              placeholder="请输入优惠券名称" 
              clearable 
              class="filter-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="优惠类型">
            <el-select 
              v-model="couponQuery.discountType" 
              placeholder="全部类型" 
              clearable 
              class="filter-select"
            >
              <el-option label="满减" :value="1" />
              <el-option label="折扣" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select 
              v-model="couponQuery.status" 
              placeholder="全部状态" 
              clearable 
              class="filter-select"
            >
              <el-option label="禁用" :value="0" />
              <el-option label="启用" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item class="filter-buttons">
            <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
            <el-button @click="resetSearch" :icon="Refresh">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="action-bar">
          <el-button type="success" @click="openCreateDialog" :icon="Plus" size="large">
            创建优惠券
          </el-button>
          <el-button 
            type="primary" 
            :disabled="!selectedCouponIds.length" 
            @click="handleBatchEnable"
            :icon="Check"
            size="large"
          >
            批量发布
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="couponList"
        border
        class="data-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="优惠券 ID" prop="couponId" width="100" show-overflow-tooltip />
        <el-table-column label="优惠券编号" prop="couponSn" width="160" show-overflow-tooltip />
        <el-table-column label="优惠券名称" prop="couponName" min-width="160" show-overflow-tooltip />
        <el-table-column label="优惠类型" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row?.discountType === 1 || scope.row?.discountType === '满减' ? 'success' : 'warning'" size="small">
              {{ scope.row?.discountType === 1 || scope.row?.discountType === '满减' ? '满减' : '折扣' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" width="110" align="center">
          <template #default="scope">
            <span class="price">
              {{ scope.row?.discountType === 1 || scope.row?.discountType === '满减' ? '￥' + scope.row?.discount : scope.row?.discount + '折' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="最低使用金额" width="110" align="center">
          <template #default="scope">
            ￥{{ scope.row?.minAmount || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="适用商品" width="120" prop="usedToProductTypeName" show-overflow-tooltip />
        <el-table-column label="发放/领取/已用" width="150" align="center">
          <template #default="scope">
            <span class="usage-stat">
              <el-tooltip content="发放数量" placement="top">
                <span class="stat-item stat-total">{{ scope.row?.totalCount ?? '-' }}</span>
              </el-tooltip>
              <span class="stat-sep">/</span>
              <el-tooltip content="已领取" placement="top">
                <span class="stat-item stat-receive">{{ scope.row?.receiveCount ?? 0 }}</span>
              </el-tooltip>
              <span class="stat-sep">/</span>
              <el-tooltip content="已使用" placement="top">
                <span class="stat-item stat-used">{{ scope.row?.usedCount ?? 0 }}</span>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="每人限领" width="80" align="center" prop="perLimit" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row?.status === 1 || scope.row?.status === '已启用' ? 'success' : 'danger'" size="small">
              {{ scope.row?.status === 1 || scope.row?.status === '已启用' ? '已启用' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生效时间" width="170" prop="startTime" />
        <el-table-column label="失效时间" width="170" prop="endTime" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="openDetailDialog(scope.row)"
              :disabled="!scope.row"
            >
              详情
            </el-button>
            <el-button
              size="small"
              type="success"
              link
              @click="openEditDialog(scope.row)"
              :disabled="!scope.row"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="warning"
              link
              :disabled="!scope.row || scope.row.status === 1 || scope.row.status === '已启用'"
              @click="handleEnable(scope.row)"
            >
              发布
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination-wrapper"
        v-model:current-page="couponQuery.pageNum"
        v-model:page-size="couponQuery.pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadCouponData"
        @current-change="loadCouponData"
        style="text-align: right; margin-top: 20px"
      />
    </el-card>

    <!-- 创建/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑优惠券' : '创建平台优惠券'"
      width="700px"
      @closed="resetForm"
    >
      <el-form :model="couponForm" :rules="couponRules" ref="couponFormRef" :label-width="formLabelWidth" class="coupon-form">
        <el-form-item v-if="isEdit" label="优惠券ID">
          <el-input v-model="couponForm.couponId" disabled />
        </el-form-item>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="couponForm.couponName" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="优惠类型" prop="discountType">
          <el-radio-group v-model="couponForm.discountType">
            <el-radio :label="1">满减</el-radio>
            <el-radio :label="2">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="coupon-row">
          <el-form-item label="优惠金额/折扣" prop="discount" class="coupon-item">
            <div class="input-with-unit">
              <el-input 
                v-model.number="couponForm.discount" 
                :placeholder="couponForm.discountType === 1 ? '请输入满减金额' : '请输入折扣率'" 
                class="main-input"
              />
              <span class="input-unit">{{ couponForm.discountType === 1 ? '元' : '折（如0.8表示8折）' }}</span>
            </div>
          </el-form-item>
          <el-form-item label="最低使用金额" prop="minAmount" class="coupon-item">
            <div class="input-with-unit">
              <el-input v-model.number="couponForm.minAmount" placeholder="请输入最低使用金额" class="main-input" />
              <span class="input-unit">元</span>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="适用商品类型" prop="usedToProductType">
          <el-select v-model="couponForm.usedToProductType" placeholder="请选择适用商品类型">
            <el-option label="全部商品" :value="0" />
            <el-option 
              v-for="type in productTypes" 
              :key="type.id" 
              :label="type.name" 
              :value="type.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发放数量" prop="totalCount">
          <el-input-number v-model="couponForm.totalCount" :min="1" placeholder="请输入发放数量" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="每人限领" prop="perLimit">
          <el-input-number v-model="couponForm.perLimit" :min="1" placeholder="请输入每人限领数量" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="有效天数" prop="validDays">
          <el-input-number v-model="couponForm.validDays" :min="0" placeholder="请输入有效天数" style="width: 100%;" />
          <span style="color: #f56c6c; font-size: 12px; margin-left: 8px;">*用户领到优惠券后的有效使用天数，为0则默认过期时间为优惠券失效时间</span>
        </el-form-item>
        <div class="time-row">
          <el-form-item label="生效时间" prop="startTime" class="time-item">
            <el-date-picker 
              v-model="couponForm.startTime" 
              type="datetime" 
              placeholder="请选择生效时间" 
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="失效时间" prop="endTime" class="time-item">
            <el-date-picker 
              v-model="couponForm.endTime" 
              type="datetime" 
              placeholder="请选择失效时间" 
              style="width: 100%;"
            />
          </el-form-item>
        </div>
        <el-form-item label="优惠券描述" prop="description">
          <el-input v-model="couponForm.description" type="textarea" rows="3" placeholder="请输入优惠券描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="优惠券详情" v-model="detailVisible" width="600px">
      <el-descriptions :column="2" border v-if="currentCoupon">
        <el-descriptions-item label="优惠券 ID">{{ currentCoupon?.couponId }}</el-descriptions-item>
        <el-descriptions-item label="优惠券名称">{{ currentCoupon?.couponName }}</el-descriptions-item>
        <el-descriptions-item label="优惠类型">
          {{ currentCoupon?.discountType === 1 || currentCoupon?.discountType === '满减' ? '满减' : '折扣' }}
        </el-descriptions-item>
        <el-descriptions-item label="优惠金额">
          {{ currentCoupon?.discountType === 1 || currentCoupon?.discountType === '满减' ? '￥' + currentCoupon?.discount : currentCoupon?.discount + '折' }}
        </el-descriptions-item>
        <el-descriptions-item label="最低使用金额">￥{{ currentCoupon?.minAmount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="适用商品类型">{{ currentCoupon?.usedToProductTypeName || '全部商品' }}</el-descriptions-item>
        <el-descriptions-item label="发放数量">{{ currentCoupon?.totalCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="每人限领">{{ currentCoupon?.perLimit || 1 }}张</el-descriptions-item>
        <el-descriptions-item label="有效天数">{{ currentCoupon?.validDays }}天</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentCoupon?.status === 1 || currentCoupon?.status === '已启用' ? 'success' : 'danger'">
            {{ currentCoupon?.status === 1 || currentCoupon?.status === '已启用' ? '已启用' : '已禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="生效时间">{{ currentCoupon?.startTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="失效时间">{{ currentCoupon?.endTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优惠券描述" :span="2">{{ currentCoupon?.description || '暂无描述' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Ticket, Search, Refresh, Plus, Check } from '@element-plus/icons-vue'
import marketApi from '@/api/admin/market'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const couponFormRef = ref()
const selectedCouponIds = ref<string[]>([])
const total = ref(0)
const couponList = ref<any[]>([])
const productTypes = ref<any[]>([])
const currentCoupon = ref<any>(null)

const couponQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  couponName: '',
  discountType: undefined,
  status: undefined
})

const couponForm = reactive({
  couponId: '',
  couponName: '',
  discountType: 1,
  discount: 0,
  minAmount: 0,
  usedToProductType: 0,
  totalCount: 1000,
  perLimit: 1,
  validDays: 7,
  startTime: '',
  endTime: '',
  description: ''
})

const formLabelWidth = ref('110px')

const couponRules = {
  couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  discountType: [{ required: true, message: '请选择优惠类型', trigger: 'change' }],
  discount: [{ required: true, message: '请输入优惠金额/折扣', trigger: 'blur' }],
  totalCount: [{ required: true, message: '请输入发放数量', trigger: 'blur' }],
  perLimit: [{ required: true, message: '请输入每人限领数量', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择生效时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择失效时间', trigger: 'change' }]
}

const loadCouponData = async () => {
  loading.value = true
  try {
    const res = await marketApi.getCouponList(couponQuery)
    couponList.value = res.data.list
    total.value = res.data.total
  } catch (err) {
    console.error(err)
    ElMessage.error('获取优惠券列表失败')
  } finally {
    loading.value = false
  }
}

const loadProductTypes = async () => {
  try {
    const res = await marketApi.getProductTypes()
    productTypes.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const handleSearch = () => {
  couponQuery.pageNum = 1
  loadCouponData()
}

const resetSearch = () => {
  couponQuery.pageNum = 1
  couponQuery.couponName = ''
  couponQuery.discountType = undefined
  couponQuery.status = undefined
  loadCouponData()
}

const handleSelectionChange = (selection: any[]) => {
  selectedCouponIds.value = selection.map(item => item.couponId)
}

const openCreateDialog = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const openEditDialog = (row: any) => {
  isEdit.value = true
  Object.assign(couponForm, {
    couponId: row.couponId,
    couponName: row.couponName,
    discountType: typeof row.discountType === 'string' ? (row.discountType === '满减' ? 1 : 2) : row.discountType,
    discount: row.discount,
    minAmount: row.minAmount,
    usedToProductType: row.usedToProductType || 0,
    totalCount: row.totalCount,
    perLimit: row.perLimit,
    validDays: row.validDays,
    startTime: row.startTime || '',
    endTime: row.endTime || '',
    description: row.description || ''
  })
  dialogVisible.value = true
}

const openDetailDialog = (row: any) => {
  currentCoupon.value = row
  detailVisible.value = true
}

const resetForm = () => {
  Object.assign(couponForm, {
    couponId: '',
    couponName: '',
    discountType: 1,
    discount: 0,
    minAmount: 0,
    usedToProductType: 0,
    totalCount: 1000,
    perLimit: 1,
    validDays: 7,
    startTime: '',
    endTime: '',
    description: ''
  })
  couponFormRef.value?.resetFields()
}

const formatDateTime = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const handleSubmit = async () => {
  try {
    await couponFormRef.value.validate()
    submitLoading.value = true
    
    const submitData = {
      ...couponForm,
      startTime: formatDateTime(new Date(couponForm.startTime)),
      endTime: formatDateTime(new Date(couponForm.endTime))
    }
    
    if (isEdit.value) {
      await marketApi.updateCoupon(submitData)
      ElMessage.success('更新成功')
    } else {
      await marketApi.createCoupon(submitData)
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
    loadCouponData()
  } catch (err: any) {
    console.error(err)
    ElMessage.error(err.message || (isEdit.value ? '更新失败' : '创建失败'))
  } finally {
    submitLoading.value = false
  }
}

const handleEnable = async (row: any) => {
  ElMessageBox.confirm('确定要发布该优惠券吗？发布后将不能参与秒杀活动', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await marketApi.enableCoupon([row.couponId])
      ElMessage.success('发布成功')
      loadCouponData()
    } catch (err) {
      console.error(err)
      ElMessage.error('发布失败')
    }
  })
}

const handleBatchEnable = async () => {
  ElMessageBox.confirm(`确定要批量发布选中的 ${selectedCouponIds.value.length} 张优惠券吗？发布后将不能参与秒杀活动`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await marketApi.enableCoupon(selectedCouponIds.value)
      ElMessage.success('批量发布成功')
      loadCouponData()
    } catch (err) {
      console.error(err)
      ElMessage.error('批量发布失败')
    }
  })
}

onMounted(() => {
  loadCouponData()
  loadProductTypes()
})

onUnmounted(() => {
  couponList.value = []
  productTypes.value = []
  currentCoupon.value = null
  dialogVisible.value = false
  detailVisible.value = false
})
</script>

<style lang="scss" scoped>
.coupon-manage-container {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .icon {
    font-size: 24px;
    color: #ff8a65;
    margin-right: 10px;
  }

  h2 {
    margin: 0;
    color: #333;
    font-size: 18px;
  }
}

.main-card {
  border-radius: 8px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-input {
  width: 200px;
}

.filter-select {
  width: 150px;
}

.filter-buttons {
  margin-left: 10px;
}

.action-bar {
  display: flex;
  gap: 10px;
}

.data-table {
  width: 100%;
}

.coupon-form {
  padding: 10px 0;
  
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
  
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
  }
  
  :deep(.el-input-number) {
    width: 100%;
  }
  
  :deep(.el-select) {
    width: 280px;
    
    .el-input__wrapper {
      border-radius: 6px;
      border-color: #dcdfe6;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #c0c4cc;
      }
      
      &.is-focus {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }
    
    .el-input__inner {
      font-size: 14px;
      color: #606266;
    }
  }
  
  :deep(.el-select-dropdown) {
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .el-select-dropdown__item {
      padding: 10px 20px;
      font-size: 14px;
      color: #606266;
      
      &:hover {
        background-color: #f5f7fa;
        color: #409eff;
      }
      
      &.selected {
        color: #409eff;
        font-weight: 500;
      }
    }
  }
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .main-input {
    flex: 1;
  }
  
  .input-unit {
    color: #666;
    font-size: 13px;
    white-space: nowrap;
    padding-right: 4px;
  }
}

.coupon-row {
  display: flex;
  gap: 20px;
  
  .coupon-item {
    flex: 1;
    margin-bottom: 20px;
  }
}

.time-row {
  display: flex;
  gap: 20px;
  
  .time-item {
    flex: 1;
    margin-bottom: 20px;
  }
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0;
}

:deep(.el-pagination) {
  display: flex !important;
  justify-content: center !important;
  width: 100% !important;
}

.price {
  color: #f5222d;
  font-weight: bold;
}
</style>