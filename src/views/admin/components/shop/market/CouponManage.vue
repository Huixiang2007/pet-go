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
          <el-button 
            type="danger" 
            :disabled="selectedCouponIds.length === 0" 
            @click="handleBatchDisable"
            size="large"
          >
            批量禁用
          </el-button>
          <el-button 
            type="info" 
            :disabled="!selectedCouponIds.length || !selectedCouponIds.some(id => {
              const coupon = couponList.find(c => c.couponId === id)
              return coupon && isCouponCanAssign(coupon)
            })" 
            @click="openAssignDialog"
            :icon="Timer"
            size="large"
          >
            批量分配活动
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <el-table
          v-loading="loading"
          :data="couponList"
          border
          class="data-table"
          @selection-change="handleSelectionChange"
          :empty-text="couponList.length === 0 && !loading ? '暂无优惠券数据' : ''"
          row-key="couponId"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="优惠券 ID" prop="couponId" width="100" show-overflow-tooltip align="center">
            <template #default="scope">
              <div 
                class="copyable-cell" 
                @dblclick="handleCopy(scope.row.couponId, '优惠券ID')"
                :title="scope.row.couponId"
              >
                {{ scope.row.couponId ? (scope.row.couponId.length > 8 ? scope.row.couponId.slice(0, 8) + '...' : scope.row.couponId) : '' }}
                <el-icon v-if="hoveredId === scope.row.couponId" class="copy-icon"><DocumentCopy /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="优惠券名称" prop="couponName" min-width="200" show-overflow-tooltip align="center" />
          <el-table-column label="状态" width="120" align="center">
            <template #default="scope">
              <div class="status-wrapper">
                <el-tag 
                  :type="getStatusType(scope.row)" 
                  size="small" 
                  effect="light"
                >
                  {{ getStatusText(scope.row) }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="秒杀状态" width="130" align="center">
            <template #default="scope">
              <el-tag 
                :type="getSeckillStatusType(scope.row)" 
                size="small" 
                effect="light"
              >
                {{ getSeckillStatusText(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优惠类型" width="110" align="center">
            <template #default="scope">
              <el-tag :type="scope.row?.discountType === 1 || scope.row?.discountType === '满减' ? 'warning' : 'primary'" size="small" effect="light">
                {{ scope.row?.discountType === 1 || scope.row?.discountType === '满减' ? '满减' : '折扣' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额" width="120" align="center">
            <template #default="scope">
              <span class="price">
                {{ scope.row?.discountType === 1 || scope.row?.discountType === '满减' ? '￥' + scope.row?.discount : scope.row?.discount + '折' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="最低使用金额" width="120" align="center">
            <template #default="scope">
              <span class="min-amount">￥{{ scope.row?.minAmount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠券编号" prop="couponSn" width="130" show-overflow-tooltip align="center">
            <template #default="scope">
              <div 
                class="copyable-cell" 
                @dblclick="handleCopy(scope.row.couponSn, '优惠券编号')"
                :title="scope.row.couponSn"
              >
                {{ scope.row.couponSn ? (scope.row.couponSn.length > 10 ? scope.row.couponSn.slice(0, 10) + '...' : scope.row.couponSn) : '' }}
                <el-icon v-if="hoveredSn === scope.row.couponSn" class="copy-icon"><DocumentCopy /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" prop="createTime" align="center" />
          <el-table-column label="操作" width="210" fixed="right" align="center">
            <template #default="scope">
              <div class="action-buttons-wrapper">
                <el-button
                  size="small"
                  type="primary"
                  @click="openDetailDialog(scope.row)"
                  :disabled="!scope.row"
                  class="action-btn"
                >
                  详情
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="openEditDialog(scope.row)"
                  :disabled="!scope.row"
                  class="action-btn"
                >
                  编辑
                </el-button>
                <el-button
                  size="small"
                  :type="getPublishButtonType(scope.row)"
                  :disabled="!scope.row || isCouponExpired(scope.row.couponId) || isCouponAssigned(scope.row.couponId) || scope.row.status === 1 || scope.row.status === '启用' || scope.row.status === '已启用'"
                  @click="handleEnable(scope.row)"
                  class="action-btn"
                >
                  {{ getPublishButtonText(scope.row) }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 空状态 -->
        <div v-if="!loading && couponList.length === 0" class="empty-state">
          <el-empty description="暂无优惠券数据" />
        </div>
      </div>

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
        style="text-align: center; margin-top: 20px"
      />
    </el-card>

    <!-- 创建/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑优惠券' : '创建平台优惠券'"
      width="700px"
      class="coupon-dialog"
      @closed="resetForm"
    >
      <el-alert
        v-if="isEdit && editCouponDetail"
        :title="getEditAlertTitle()"
        :type="canEditSensitiveField() ? 'success' : 'warning'"
        :closable="false"
        show-icon
        class="edit-alert"
      >
        <template #default>
          <div v-if="!canEditSensitiveField()" class="alert-content">
            <div class="alert-title">{{ getEditAlertTitle() }}</div>
            <div class="alert-list">
              <div class="alert-item">折扣类型、优惠金额/折扣</div>
              <div class="alert-item">最低使用金额</div>
              <div class="alert-item">生效时间、失效时间</div>
              <div class="alert-item">适用商品类型</div>
              <div class="alert-item">有效天数</div>
            </div>
          </div>
          <div v-else class="alert-content">
            <div class="alert-title">{{ getEditAlertTitle() }}</div>
          </div>
        </template>
      </el-alert>
      <el-form :model="couponForm" :rules="couponRules" ref="couponFormRef" :label-width="formLabelWidth" class="coupon-form">
        <el-form-item v-if="isEdit" label="优惠券ID">
          <el-input v-model="couponForm.couponId" disabled />
        </el-form-item>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="couponForm.couponName" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="优惠类型" prop="discountType">
          <el-radio-group v-model="couponForm.discountType" :disabled="isEdit && !canEditSensitiveField()">
            <el-radio :label="1" :disabled="isEdit && !canEditSensitiveField()" @click.prevent="!isEdit || canEditSensitiveField() ? (couponForm.discountType === 1 ? couponForm.discountType = undefined : couponForm.discountType = 1) : null">满减</el-radio>
            <el-radio :label="2" :disabled="isEdit && !canEditSensitiveField()" @click.prevent="!isEdit || canEditSensitiveField() ? (couponForm.discountType === 2 ? couponForm.discountType = undefined : couponForm.discountType = 2) : null">折扣</el-radio>
          </el-radio-group>
          <span v-if="isEdit && !canEditSensitiveField()" class="field-lock-hint">
            <el-icon><Lock /></el-icon> 有效期内不可修改
          </span>
        </el-form-item>
        <div class="coupon-row">
          <el-form-item label="优惠金额/折扣" prop="discount" class="coupon-item">
            <div class="input-with-unit">
              <el-input 
                v-model.number="couponForm.discount" 
                :placeholder="couponForm.discountType === 1 ? '请输入满减金额' : '请输入折扣率'" 
                class="main-input"
                :disabled="isEdit && !canEditSensitiveField()"
              />
              <span class="input-unit">{{ couponForm.discountType === 1 ? '元' : '折（如0.8表示8折）' }}</span>
            </div>
            <span v-if="isEdit && !canEditSensitiveField()" class="field-lock-hint">
              <el-icon><Lock /></el-icon> 有效期内不可修改
            </span>
          </el-form-item>
          <el-form-item label="最低使用金额" prop="minAmount" class="coupon-item">
            <div class="input-with-unit">
              <el-input 
                v-model.number="couponForm.minAmount" 
                placeholder="请输入最低使用金额" 
                class="main-input"
                :disabled="isEdit && !canEditSensitiveField()"
              />
              <span class="input-unit">元</span>
            </div>
            <span v-if="isEdit && !canEditSensitiveField()" class="field-lock-hint">
              <el-icon><Lock /></el-icon> 有效期内不可修改
            </span>
          </el-form-item>
        </div>
        <el-form-item label="适用商品类型" prop="usedToProductType">
          <el-select 
            v-model="couponForm.usedToProductType" 
            placeholder="请选择适用商品类型" 
            style="width: 100%;"
            :disabled="isEdit && !canEditSensitiveField()"
          >
            <el-option label="全部商品" :value="0" />
            <el-option 
              v-for="type in productTypes" 
              :key="type.id" 
              :label="type.name" 
              :value="type.id" 
            />
          </el-select>
          <span v-if="isEdit && !canEditSensitiveField()" class="field-lock-hint">
            <el-icon><Lock /></el-icon> 有效期内不可修改
          </span>
        </el-form-item>
        <el-form-item label="发放数量" prop="totalCount">
          <div v-if="isEdit" class="add-count-wrapper">
            <el-input-number v-model="couponForm.totalCount" :min="1" placeholder="请输入增加的发放数量" style="width: 200px;" />
            <span class="add-hint">（增加的数量）</span>
          </div>
          <el-input-number v-else v-model="couponForm.totalCount" :min="1" placeholder="请输入发放数量" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="每人限领" prop="perLimit">
          <el-input-number v-model="couponForm.perLimit" :min="1" placeholder="请输入每人限领数量" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="有效天数" prop="validDays">
          <el-input-number 
            v-model="couponForm.validDays" 
            :min="0" 
            placeholder="请输入有效天数" 
            style="width: 100%;"
            :disabled="isEdit && !canEditSensitiveField()"
          />
          <span style="color: #f56c6c; font-size: 12px; margin-left: 8px;">*用户领到优惠券后的有效使用天数，为0则默认过期时间为优惠券失效时间</span>
          <span v-if="isEdit && !canEditSensitiveField()" class="field-lock-hint">
            <el-icon><Lock /></el-icon> 有效期内不可修改
          </span>
        </el-form-item>
        <div class="time-row">
          <el-form-item label="生效时间" prop="startTime" class="time-item">
            <el-date-picker 
              v-model="couponForm.startTime" 
              type="datetime" 
              placeholder="请选择生效时间" 
              style="width: 100%;"
              :disabled="isEdit && !canEditSensitiveField()"
            />
            <span v-if="isEdit && !canEditSensitiveField()" class="field-lock-hint">
              <el-icon><Lock /></el-icon> 有效期内不可修改
            </span>
          </el-form-item>
          <el-form-item label="失效时间" prop="endTime" class="time-item">
            <el-date-picker 
              v-model="couponForm.endTime" 
              type="datetime" 
              placeholder="请选择失效时间" 
              style="width: 100%;"
              :disabled="isEdit && !canEditSensitiveField()"
            />
            <span v-if="isEdit && !canEditSensitiveField()" class="field-lock-hint">
              <el-icon><Lock /></el-icon> 有效期内不可修改
            </span>
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
    <el-dialog title="优惠券详情" v-model="detailVisible" width="700px">
      <el-descriptions :column="2" border v-if="currentCoupon">
        <el-descriptions-item label="优惠券 ID">{{ currentCoupon?.couponId }}</el-descriptions-item>
        <el-descriptions-item label="优惠券编号">{{ currentCoupon?.couponSn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优惠券名称">{{ currentCoupon?.couponName }}</el-descriptions-item>
        <el-descriptions-item label="优惠类型">
          {{ currentCoupon?.discountType === 1 || currentCoupon?.discountType === '满减' ? '满减' : '折扣' }}
        </el-descriptions-item>
        <el-descriptions-item label="优惠金额">
          {{ currentCoupon?.discountType === 1 || currentCoupon?.discountType === '满减' ? '￥' + currentCoupon?.discount : currentCoupon?.discount + '折' }}
        </el-descriptions-item>
        <el-descriptions-item label="最低使用金额">￥{{ currentCoupon?.minAmount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="适用商品类型">{{ getProductTypeName(currentCoupon?.usedToProductType) }}</el-descriptions-item>
        <el-descriptions-item label="发放数量">{{ currentCoupon?.totalCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="已领取数量">{{ currentCoupon?.receiveCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="已使用数量">{{ currentCoupon?.usedCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="每人限领">{{ currentCoupon?.perLimit || 1 }}张</el-descriptions-item>
        <el-descriptions-item label="有效天数">{{ currentCoupon?.validDays }}天</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getDetailStatusType()">
            {{ getDetailStatusText() }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="秒杀状态">
          <el-tag :type="getDetailSeckillStatusType()">
            {{ getDetailSeckillStatusText() }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="getDetailActivityInfo()" label="分配活动">
          <div class="activity-info">
            <div>活动ID: {{ getDetailActivityInfo()?.activityId }}</div>
            <div v-if="getDetailActivityInfo()?.activityName">活动名称: {{ getDetailActivityInfo()?.activityName }}</div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="生效时间">{{ formatTime(currentCoupon?.startTime) }}</el-descriptions-item>
        <el-descriptions-item label="失效时间">{{ formatTime(currentCoupon?.endTime) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentCoupon?.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优惠券描述" :span="2">{{ currentCoupon?.description || '暂无描述' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 分配活动弹窗 -->
    <el-dialog
      v-model="assignVisible"
      title="分配秒杀活动"
      width="600px"
      @closed="resetAssignForm"
    >
      <div class="assign-info">
        <p><strong>已选择优惠券数量：</strong><span style="color: #409eff; font-weight: 600;">{{ selectedCouponIds.length }} 张</span></p>
        <p style="color: #909399; font-size: 13px; margin-top: 8px;">* 只有未发布的平台优惠券才能参与秒杀活动</p>
      </div>
      <el-form :model="assignForm" :rules="assignRules" ref="assignFormRef" label-width="100px" style="margin-top: 20px">
        <el-form-item label="秒杀活动" prop="activityId">
          <el-select v-model="assignForm.activityId" placeholder="请选择要加入的活动" style="width: 100%" filterable>
            <el-option 
              v-for="item in availableActivities" 
              :key="item.activityId" 
              :label="item.activityName" 
              :value="item.activityId" 
            >
              <template #label>
                <div class="activity-option">
                  <span style="font-weight: 500;">{{ item.activityName }}</span>
                  <span :class="['activity-type-tag', getActivityTypeTag(item.activityType)]">{{ getActivityTypeText(item.activityType) }}</span>
                  <span class="sort-order-tag">排序: {{ item.sortOrder }}</span>
                  <div class="activity-tooltip">
                    <div class="tooltip-header">
                      <strong>ActivityAddVO 详情</strong>
                    </div>
                    <div><span class="tip-label">活动ID：</span>{{ item.activityId }}</div>
                    <div><span class="tip-label">活动名称：</span>{{ item.activityName }}</div>
                    <div><span class="tip-label">活动类型：</span>{{ getActivityTypeText(item.activityType) }}</div>
                    <div><span class="tip-label">已有秒杀优惠券数：</span>{{ item.count }} 个</div>
                    <div><span class="tip-label">开始时间：</span>{{ item.startTime }}</div>
                    <div><span class="tip-label">结束时间：</span>{{ item.endTime }}</div>
                    <div><span class="tip-label">活动描述：</span>{{ item.description || '-' }}</div>
                    <div><span class="tip-label">排序权重：</span>{{ item.sortOrder }}</div>
                  </div>
                </div>
              </template>
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- 选中活动详情 -->
        <div v-if="currentSelectedActivity" class="activity-detail" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin-bottom: 10px; color: #333;">活动详情</h4>
          <div class="detail-grid">
            <div><span class="detail-label">活动类型：</span><span>{{ getActivityTypeText(currentSelectedActivity.activityType) }}</span></div>
            <div><span class="detail-label">已有秒杀优惠券数：</span><span>{{ currentSelectedActivity.count }} 个</span></div>
            <div><span class="detail-label">开始时间：</span><span>{{ currentSelectedActivity.startTime }}</span></div>
            <div><span class="detail-label">结束时间：</span><span>{{ currentSelectedActivity.endTime }}</span></div>
            <div><span class="detail-label">活动描述：</span><span>{{ currentSelectedActivity.description || '-' }}</span></div>
            <div><span class="detail-label">排序权重：</span><span>{{ currentSelectedActivity.sortOrder }}</span></div>
          </div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleAssignSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { Ticket, Search, Refresh, Plus, Check, Document, Edit, Promotion, DocumentCopy, Lock, Timer, CircleClose } from '@element-plus/icons-vue'
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
const editCouponDetail = ref<any>(null)
const hoveredId = ref<string | null>(null)
const hoveredSn = ref<string | null>(null)
const couponEndTimeMap = ref<Record<string, string>>({})
const couponActivityMap = ref<Record<string, { activityId: string; activityName: string } | null>>({})

// 分配活动相关
const assignVisible = ref(false)
const assignFormRef = ref()
const availableActivities = ref<any[]>([])
const currentSelectedActivity = ref<any>(null)

const assignForm = reactive({
  activityId: ''
})

const assignRules = {
  activityId: [{ required: true, message: '请选择秒杀活动', trigger: 'change' }]
}

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
  discount: '',
  minAmount: '',
  usedToProductType: 0,
  totalCount: 1000,
  originalTotalCount: 0,
  perLimit: 1,
  validDays: 7,
  startTime: '',
  endTime: '',
  description: ''
})

const formLabelWidth = ref('110px')

const couponRules = {
  couponName: [],
  discountType: [],
  discount: [],
  totalCount: [],
  perLimit: [],
  startTime: [],
  endTime: []
}

const loadCouponData = async () => {
  loading.value = true
  try {
    const res = await marketApi.getCouponList(couponQuery)
    couponList.value = res.data.list
    total.value = res.data.total
    await loadCouponEndTimes()
  } catch (err) {
    console.error(err)
    ElMessage.error('获取优惠券列表失败')
  } finally {
    loading.value = false
  }
}

const loadCouponEndTimes = async () => {
  const newMap: Record<string, string> = {}
  const newActivityMap: Record<string, { activityId: string; activityName: string } | null> = {}
  const promises = couponList.value.map(async (coupon) => {
    if (coupon.couponId) {
      try {
        const detailRes = await marketApi.getCouponDetail(coupon.couponId)
        if (detailRes.data) {
          if (detailRes.data.endTime) {
            newMap[coupon.couponId] = detailRes.data.endTime
          }
          if (detailRes.data.activityId || detailRes.data.seckillActivityId) {
            newActivityMap[coupon.couponId] = {
              activityId: detailRes.data.activityId || detailRes.data.seckillActivityId,
              activityName: detailRes.data.activityName || detailRes.data.seckillActivityName || ''
            }
          } else {
            newActivityMap[coupon.couponId] = null
          }
        }
      } catch (err) {
        console.error(`获取优惠券${coupon.couponId}详情失败:`, err)
      }
    }
  })
  await Promise.all(promises)
  couponEndTimeMap.value = newMap
  couponActivityMap.value = newActivityMap
}

const isCouponExpired = (couponId: string) => {
  const endTimeStr = couponEndTimeMap.value[couponId]
  if (!endTimeStr) return false
  const endTime = new Date(endTimeStr)
  const now = new Date()
  return endTime < now
}

const isCouponAssigned = (couponId: string) => {
  return couponActivityMap.value[couponId] !== undefined && couponActivityMap.value[couponId] !== null
}

const isCouponCanAssign = (row: any) => {
  const isEnabled = row?.status === 1 || row?.status === '启用' || row?.status === '已启用'
  const isExpired = isCouponExpired(row.couponId)
  const isAssigned = isCouponAssigned(row.couponId)
  return !isEnabled && !isExpired && !isAssigned
}

const getStatusType = (row: any) => {
  if (row?.status === 1 || row?.status === '启用' || row?.status === '已启用' || row?.status?.desc === '启用') return 'success'
  return 'danger'
}

const getStatusText = (row: any) => {
  if (row?.status === 1 || row?.status === '启用' || row?.status === '已启用' || row?.status?.desc === '启用') return '已发布'
  return '待发布'
}

const getSeckillStatusType = (row: any) => {
  const isPublished = row?.status === 1 || row?.status === '启用' || row?.status === '已启用' || row?.status?.desc === '启用'
  if (isPublished) return 'info'
  
  const seckillStatus = row?.seckillStatus
  if (!seckillStatus) return 'info'
  let statusValue = typeof seckillStatus === 'object' ? seckillStatus.value : seckillStatus
  if (statusValue === '已加入活动') return 'success'
  if (statusValue === '已完成') return 'warning'
  if (statusValue === '待加入活动') return 'primary'
  return 'info'
}

const getSeckillStatusText = (row: any) => {
  const isPublished = row?.status === 1 || row?.status === '启用' || row?.status === '已启用' || row?.status?.desc === '启用'
  if (isPublished) return '-'
  
  const seckillStatus = row?.seckillStatus
  if (!seckillStatus) return '-'
  if (typeof seckillStatus === 'object') return seckillStatus.desc || '-'
  const statusValue = seckillStatus
  if (statusValue === '已加入活动') return '已加入'
  if (statusValue === '已完成') return '已完成'
  if (statusValue === '待加入活动') return '待加入'
  return '-'
}

const getPublishButtonText = (row: any) => {
  const isExpired = isCouponExpired(row.couponId)
  const isAssigned = isCouponAssigned(row.couponId)
  const isEnabled = row?.status === 1 || row?.status === '启用' || row?.status === '已启用'
  
  if (isExpired) return '已失效'
  if (isAssigned) return '已分配'
  if (isEnabled) return '已发布'
  return '发布'
}

const getPublishButtonType = (row: any) => {
  const isExpired = isCouponExpired(row.couponId)
  const isAssigned = isCouponAssigned(row.couponId)
  const isEnabled = row?.status === 1 || row?.status === '启用' || row?.status === '已启用'
  
  if (isExpired) return 'warning'
  if (isAssigned) return 'primary'
  if (isEnabled) return 'info'
  return 'danger'
}

const loadProductTypes = async () => {
  try {
    const res = await marketApi.getProductTypes()
    const types = res.data
    const uniqueTypes = []
    const seen = new Set()
    for (const item of types) {
      const name = item.name?.trim() || ''
      if (!seen.has(name)) {
        seen.add(name)
        uniqueTypes.push(item)
      }
    }
    productTypes.value = uniqueTypes
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

const openEditDialog = async (row: any) => {
  isEdit.value = true
  if (productTypes.value.length === 0) {
    await loadProductTypes()
  }
  try {
    const detailRes = await marketApi.getCouponDetail(row.couponId)
    editCouponDetail.value = detailRes.data
  } catch (err) {
    console.error(err)
    editCouponDetail.value = row
  }
  Object.assign(couponForm, {
    couponId: row.couponId,
    couponName: '',
    discountType: undefined,
    discount: '',
    minAmount: '',
    usedToProductType: undefined,
    totalCount: 0,
    originalTotalCount: row.totalCount || 0,
    perLimit: row.perLimit,
    validDays: row.validDays,
    startTime: row.startTime || '',
    endTime: row.endTime || '',
    description: row.description || ''
  })
  dialogVisible.value = true
}

const isEditCouponExpired = () => {
  if (!editCouponDetail.value || !editCouponDetail.value.endTime) return false
  const endTime = new Date(editCouponDetail.value.endTime)
  const now = new Date()
  return endTime < now
}

const isEditCouponEnabled = () => {
  if (!editCouponDetail.value) return false
  const status = editCouponDetail.value.status
  return status === 1 || status === '启用' || status === '已启用'
}

const canEditSensitiveField = () => {
  return isEditCouponExpired() || !isEditCouponEnabled()
}

const getEditAlertTitle = () => {
  if (isEditCouponExpired()) {
    return '优惠券已失效，所有字段均可修改'
  }
  if (!isEditCouponEnabled()) {
    return '优惠券未启用，所有字段均可修改'
  }
  return '优惠券有效期内且已启用，部分敏感字段不可修改'
}

const openDetailDialog = async (row: any) => {
  if (productTypes.value.length === 0) {
    await loadProductTypes()
  }
  try {
    const res = await marketApi.getCouponDetail(row.couponId)
    currentCoupon.value = res.data
  } catch (err) {
    console.error(err)
    currentCoupon.value = row
  }
  detailVisible.value = true
}

const getDetailActivityInfo = () => {
  if (!currentCoupon.value?.couponId) return null
  const cached = couponActivityMap.value[currentCoupon.value.couponId]
  if (cached) return cached
  if (currentCoupon.value?.activityId || currentCoupon.value?.seckillActivityId) {
    return {
      activityId: currentCoupon.value.activityId || currentCoupon.value.seckillActivityId,
      activityName: currentCoupon.value.activityName || currentCoupon.value.seckillActivityName || ''
    }
  }
  return null
}

const getDetailStatusType = () => {
  if (!currentCoupon.value) return 'info'
  if (currentCoupon.value?.status === 1 || currentCoupon.value?.status === '启用' || currentCoupon.value?.status === '已启用' || currentCoupon.value?.status?.desc === '启用') return 'success'
  return 'danger'
}

const getDetailStatusText = () => {
  if (!currentCoupon.value) return '未知'
  if (currentCoupon.value?.status === 1 || currentCoupon.value?.status === '启用' || currentCoupon.value?.status === '已启用' || currentCoupon.value?.status?.desc === '启用') return '已发布'
  return '待发布'
}

const getDetailSeckillStatusType = () => {
  if (!currentCoupon.value) return 'info'
  const isPublished = currentCoupon.value?.status === 1 || currentCoupon.value?.status === '启用' || currentCoupon.value?.status === '已启用' || currentCoupon.value?.status?.desc === '启用'
  if (isPublished) return 'info'
  
  const seckillStatus = currentCoupon.value?.seckillStatus
  if (!seckillStatus) return 'info'
  let statusValue = typeof seckillStatus === 'object' ? seckillStatus.value : seckillStatus
  if (statusValue === '已加入活动') return 'success'
  if (statusValue === '已完成') return 'warning'
  if (statusValue === '待加入活动') return 'primary'
  return 'info'
}

const getDetailSeckillStatusText = () => {
  if (!currentCoupon.value) return '-'
  const isPublished = currentCoupon.value?.status === 1 || currentCoupon.value?.status === '启用' || currentCoupon.value?.status === '已启用' || currentCoupon.value?.status?.desc === '启用'
  if (isPublished) return '-'
  
  const seckillStatus = currentCoupon.value?.seckillStatus
  if (!seckillStatus) return '-'
  if (typeof seckillStatus === 'object') return seckillStatus.desc || '-'
  const statusValue = seckillStatus
  if (statusValue === '已加入活动') return '已加入'
  if (statusValue === '已完成') return '已完成'
  if (statusValue === '待加入活动') return '待加入'
  return '-'
}

const resetForm = () => {
  editCouponDetail.value = null
  Object.assign(couponForm, {
    couponId: '',
    couponName: '',
    discountType: 1,
    discount: 0,
    minAmount: 0,
    usedToProductType: 0,
    totalCount: 1000,
    originalTotalCount: 0,
    perLimit: 1,
    validDays: 7,
    startTime: '',
    endTime: '',
    description: ''
  })
  couponFormRef.value?.resetFields()
}

const formatDateTime = (date: any) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')
  const second = d.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const handleSubmit = async () => {
  try {
    await couponFormRef.value.validate()
    submitLoading.value = true
    
    const submitData: any = {
      ...couponForm,
      startTime: formatDateTime(couponForm.startTime),
      endTime: formatDateTime(couponForm.endTime)
    }
    
    if (isEdit.value) {
      submitData.id = couponForm.couponId
      delete submitData.discountType
      delete submitData.minAmount
      delete submitData.usedToProductType
      delete submitData.validDays
      delete submitData.couponId
      
      if (!submitData.startTime) delete submitData.startTime
      if (!submitData.endTime) delete submitData.endTime
      
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

const handleBatchDisable = async () => {
  ElMessageBox.confirm(`确定要批量禁用选中的 ${selectedCouponIds.value.length} 张优惠券吗？禁用后秒杀状态将改为待加入`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await marketApi.disableCoupon(selectedCouponIds.value)
      ElMessage.success('批量禁用成功')
      loadCouponData()
    } catch (err) {
      console.error(err)
      ElMessage.error('批量禁用失败')
    }
  })
}

const openAssignDialog = async () => {
  const canAssignIds: string[] = []
  const invalidIds: string[] = []
  
  selectedCouponIds.value.forEach(id => {
    const coupon = couponList.value.find(c => c.couponId === id)
    if (coupon && isCouponCanAssign(coupon)) {
      canAssignIds.push(id)
    } else {
      invalidIds.push(id)
    }
  })
  
  if (invalidIds.length > 0 && canAssignIds.length === 0) {
    ElMessage.warning('所选优惠券都不可分配（只有状态为已禁用且未分配活动的优惠券可以分配）')
    return
  }
  
  if (invalidIds.length > 0) {
    ElMessage.warning(`有${invalidIds.length}个优惠券不可分配，仅处理可分配的${canAssignIds.length}个`)
    selectedCouponIds.value = canAssignIds
  }
  
  assignVisible.value = true
  await loadAvailableActivities()
}

const resetAssignForm = () => {
  assignForm.activityId = ''
  currentSelectedActivity.value = null
  assignFormRef.value?.resetFields()
}

const loadAvailableActivities = async () => {
  try {
    const res = await marketApi.getSeckillCouponActivityAddList()
    availableActivities.value = res.data.list || []
  } catch (err) {
    console.error(err)
    ElMessage.error('获取可选活动失败')
  }
}

const handleAssignSubmit = async () => {
  try {
    await assignFormRef.value.validate()
    submitLoading.value = true
    
    const formData = {
      activityId: assignForm.activityId,
      couponIds: selectedCouponIds.value
    }
    
    const res = await marketApi.addCouponToActivity(formData)
    if (res.ok) {
      ElMessage.success(res.msg || '分配成功')
      assignVisible.value = false
      loadCouponData()
    } else {
      ElMessage.error(res.msg || '分配失败')
    }
  } catch (err: any) {
    console.error(err)
    ElMessage.error(err.message || '分配失败')
  } finally {
    submitLoading.value = false
  }
}

const getActivityTypeText = (type: any) => {
  if (type === 1 || type === '1' || type === 'NORMAL' || type === '普通秒杀') return '普通秒杀'
  if (type === 2 || type === '2' || type === 'HOURLY' || type === '整点秒杀') return '整点秒杀'
  return type
}

const getActivityTypeTag = (type: any) => {
  return (type === '1' || type === 'NORMAL' || type === '普通秒杀') ? 'info' : 'warning'
}

watch(() => assignForm.activityId, (newVal) => {
  if (newVal) {
    currentSelectedActivity.value = availableActivities.value.find(item => item.activityId === newVal)
  } else {
    currentSelectedActivity.value = null
  }
})

const handleCopy = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${label}已复制到剪贴板`)
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败，请手动复制')
  }
}

onMounted(() => {
  loadCouponData()
  loadProductTypes()
})

const getProductTypeName = (type: any) => {
  if (!type) return '全部商品'
  const typeStr = String(type)
  const item = productTypes.value.find(p => String(p.id) === typeStr)
  return item?.name || '全部商品'
}

const formatTime = (time: any) => {
  if (!time) return '-'
  return String(time).replace('T', ' ')
}

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
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .icon {
    font-size: 28px;
    color: #409eff;
    margin-right: 12px;
  }

  h2 {
    margin: 0;
    color: #1f2937;
    font-size: 20px;
    font-weight: 600;
  }
}

.main-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.coupon-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 8px 0 0;
  
  .el-dialog__title {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }
  
  .el-dialog__close {
    color: rgba(255, 255, 255, 0.8);
    
    &:hover {
      color: #fff;
    }
  }
}

:deep(.coupon-dialog .el-dialog__body) {
  padding: 24px;
  background-color: #fafbfc;
}

:deep(.coupon-dialog .el-form-item) {
  margin-bottom: 20px;
  
  .el-form-item__label {
    font-weight: 500;
    color: #303133;
    padding-right: 12px;
  }
  
  .el-form-item__content {
    flex: 1;
  }
}

:deep(.coupon-dialog .el-input),
:deep(.coupon-dialog .el-select),
:deep(.coupon-dialog .el-input-number) {
  .el-input__wrapper {
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #409eff;
    }
    
    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    }
  }
}

:deep(.coupon-dialog .el-radio-group) {
  display: flex;
  gap: 24px;
}

.coupon-row {
  display: flex;
  gap: 24px;
  
  .coupon-item {
    flex: 1;
  }
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .main-input {
    flex: 1;
    
    :deep(.el-input__wrapper) {
      width: 100%;
    }
  }
  
  .input-unit {
    color: #909399;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    min-width: 100px;
  }
}

.add-count-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  
  .original-count {
    color: #67c23a;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 12px;
    background: #f0f9eb;
    border-radius: 4px;
  }
  
  :deep(.el-input-number) {
    width: 220px;
    
    .el-input__wrapper {
      border-radius: 6px;
    }
  }
  
  .add-hint {
    color: #909399;
    font-size: 14px;
  }
}

:deep(.coupon-form .el-input-number) {
  .el-input__wrapper {
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #409eff;
    }
    
    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    }
  }
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.filter-input {
  width: 200px;
}

.filter-select {
  width: 140px;
}

.filter-buttons {
  margin-left: 10px;
}

.action-bar {
  display: flex;
  gap: 10px;
}

.table-wrapper {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  
  :deep(.el-table__header-wrapper) {
    th {
      background-color: #fafafa;
      color: #333;
      font-weight: 600;
      font-size: 14px;
    }
  }
  
  :deep(.el-table__body-wrapper) {
    tr:hover > td {
      background-color: #f5f7fa !important;
    }
    
    .action-buttons-wrapper {
      opacity: 1;
      transition: opacity 0.2s ease;
    }
  }
}

.copyable-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 0;
  position: relative;
  
  &:hover {
    .copy-icon {
      opacity: 1;
    }
  }
  
  .copy-icon {
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 14px;
    color: #909399;
  }
}

.action-buttons-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.action-btn {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin: 0;
  height: 26px;
  line-height: 1;
  white-space: nowrap;
  flex-shrink: 0;
  
  &.el-button--primary:nth-child(1) {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #fff;
    
    &:hover {
      color: #409eff;
      border-color: #409eff;
      background-color: #ecf5ff;
    }
  }
  
  &.el-button--primary:nth-child(2) {
    color: #409eff;
    border-color: #b3d8ff;
    background-color: #ecf5ff;
    
    &:hover {
      color: #409eff;
      border-color: #409eff;
      background-color: #d9ecff;
    }
  }
  
  &.el-button--danger {
    color: #f56c6c;
    border-color: #fbc4c4;
    background-color: #fef0f0;
    
    &:hover {
      color: #f56c6c;
      border-color: #f56c6c;
      background-color: #fde2e2;
    }
    
    &:disabled {
      color: #c0c4cc;
      border-color: #ebeef5;
      background-color: #f5f7fa;
    }
  }
  
  &.el-button--warning {
    color: #e6a23c;
    border-color: #f5dab1;
    background-color: #fdf6ec;
    
    &:hover {
      color: #e6a23c;
      border-color: #e6a23c;
      background-color: #faecd8;
    }
    
    &:disabled {
      color: #c0c4cc;
      border-color: #ebeef5;
      background-color: #f5f7fa;
    }
  }
  
  &.el-button--info {
    color: #909399;
    border-color: #d3d4d6;
    background-color: #f4f4f5;
    
    &:hover {
      color: #909399;
      border-color: #909399;
      background-color: #e9e9eb;
    }
    
    &:disabled {
      color: #c0c4cc;
      border-color: #ebeef5;
      background-color: #f5f7fa;
    }
  }
}

.empty-state {
  padding: 60px 0;
}

.add-count-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .original-count {
    color: #606266;
    font-size: 14px;
    font-weight: 500;
  }
  
  .add-hint {
    color: #909399;
    font-size: 12px;
  }
}

.min-amount {
  color: #6b7280;
  font-weight: 500;
}

.price {
  color: #dc2626;
  font-weight: 700;
  font-size: 15px;
}

.coupon-form {
  padding: 10px 0;
  
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
  
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #374151;
  }
  
  :deep(.el-input-number) {
    width: 100%;
  }
  
  :deep(.el-select) {
    width: 280px;
    
    .el-input__wrapper {
      border-radius: 8px;
      border-color: #d1d5db;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #9ca3af;
      }
      
      &.is-focus {
        border-color: #409eff;
        box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
      }
    }
    
    .el-input__inner {
      font-size: 14px;
      color: #374151;
    }
  }
  
  :deep(.el-select-dropdown) {
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    
    .el-select-dropdown__item {
      padding: 10px 20px;
      font-size: 14px;
      color: #374151;
      
      &:hover {
        background-color: #f3f4f6;
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
    color: #6b7280;
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
  margin-top: 24px;
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

:deep(.el-pagination.is-background .el-pager li:not(.is-active):hover) {
  color: #409eff;
  background-color: #eff6ff;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #409eff;
}

.edit-alert {
  margin-bottom: 20px;
  
  .alert-content {
    font-size: 14px;
    line-height: 1.8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  .alert-title {
    font-weight: 500;
    margin-bottom: 12px;
    color: inherit;
  }
  
  .alert-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
  }
  
  .alert-item {
    padding-left: 16px;
    position: relative;
    color: #e6a23c;
    font-size: 13px;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #e6a23c;
      font-size: 14px;
    }
  }
}

.field-lock-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #e6a23c;
  font-size: 12px;
  margin-left: 8px;
  font-weight: 500;
  
  .el-icon {
    font-size: 14px;
  }
}

.status-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.assign-info {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  
  p {
    margin: 0;
    font-size: 14px;
    color: #333;
  }
}

.activity-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  
  .activity-type-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    
    &.info {
      background: #ecf5ff;
      color: #409eff;
    }
    
    &.warning {
      background: #fef7e8;
      color: #e6a23c;
    }
  }
  
  .sort-order-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    background: #f0f2f5;
    color: #606266;
    margin-left: auto;
  }
  
  .activity-tooltip {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    padding: 0;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    z-index: 100;
    font-size: 12px;
    color: #606266;
    min-width: 320px;
    max-width: 400px;
    overflow: hidden;
    
    .tooltip-header {
      background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
      color: #fff;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px 8px 0 0;
    }
    
    div:not(.tooltip-header) {
      padding: 6px 12px;
      
      &:hover {
        background: #f8f9fa;
      }
      
      &:last-child {
        padding-bottom: 12px;
      }
    }
    
    .tip-label {
      color: #909399;
      margin-right: 8px;
      min-width: 65px;
      display: inline-block;
    }
  }
  
  &:hover .activity-tooltip {
    display: block;
  }
}

.activity-detail {
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    font-size: 13px;
    color: #606266;
    
    .full-width {
      grid-column: span 2;
    }
    
    .detail-label {
      color: #909399;
      margin-right: 8px;
    }
  }
}

.activity-info {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  
  div {
    margin-bottom: 2px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>