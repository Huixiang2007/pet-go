<template>
  <div class="seckill-manage-container">
    <div class="page-header">
      <el-icon class="icon"><Timer /></el-icon>
      <h2>电商管理 - 秒杀管理</h2>
    </div>

    <el-card shadow="hover" class="main-card">
      <el-tabs v-model="activeTab" class="cute-tabs" @tab-change="handleTabChange">
        <!-- 秒杀活动列表 -->
        <el-tab-pane label="活动列表" name="activity">
          <div class="filter-container">
            <el-form :inline="true" :model="activityQuery" class="filter-form">
              <el-form-item label="活动名称">
                <el-input 
                  v-model="activityQuery.activityName" 
                  placeholder="请输入活动名称" 
                  clearable 
                  class="filter-input"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="活动状态">
                <el-select 
                  v-model="activityQuery.activityStatus" 
                  placeholder="全部状态" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="未开始" :value="0" />
                  <el-option label="进行中" :value="1" />
                  <el-option label="已结束" :value="2" />
                  <el-option label="已禁用" :value="3" />
                </el-select>
              </el-form-item>
              <el-form-item label="活动类型">
                <el-select 
                  v-model="activityQuery.activityType" 
                  placeholder="全部类型" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="普通秒杀" :value="1" />
                  <el-option label="整点秒杀" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="秒杀类型">
                <el-select 
                  v-model="activityQuery.seckillType" 
                  placeholder="全部类型" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="商品秒杀" :value="1" />
                  <el-option label="优惠券秒杀" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="排序字段">
                <el-select 
                  v-model="activityQuery.sortField" 
                  placeholder="请选择排序字段" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="创建时间" :value="1" />
                  <el-option label="开始时间" :value="2" />
                  <el-option label="结束时间" :value="3" />
                </el-select>
              </el-form-item>
              <el-form-item label="排序规则">
                <el-select 
                  v-model="activityQuery.sortOrder" 
                  placeholder="请选择排序规则" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="正序" :value="0" />
                  <el-option label="倒序" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item class="filter-buttons">
                <el-button type="primary" @click="handleActivitySearch" :icon="Search">查询</el-button>
                <el-button @click="resetActivitySearch" :icon="Refresh">重置</el-button>
              </el-form-item>
            </el-form>
            <div class="action-bar">
              <el-button type="success" @click="openCreateDialog" :icon="Plus" size="large">
                创建活动
              </el-button>
              <el-button 
                type="danger" 
                :disabled="!selectedActivityIds.length" 
                @click="handleBatchDeleteActivity"
                :icon="Delete"
                size="large"
              >
                批量删除
              </el-button>
            </div>
          </div>

          <el-table 
            v-loading="activityLoading"
            :data="activityList" 
            border 
            class="data-table"
            @selection-change="handleActivitySelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="活动 ID" prop="activityId" width="180" show-overflow-tooltip />
            <el-table-column label="活动名称" prop="activityName" min-width="180" show-overflow-tooltip />
            <el-table-column label="权重" width="80" align="center" sortable prop="sortOrder">
              <template #default="scope">
                {{ scope.row.sortOrder ?? 0 }}
              </template>
            </el-table-column>
            <el-table-column label="活动类型" width="120">
              <template #default="scope">
                <el-tag :type="getActivityTypeTag(scope.row.activityType)">
                  {{ getActivityTypeText(scope.row.activityType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="秒杀类型" width="120">
              <template #default="scope">
                <el-tag :type="getSeckillTypeTag(scope.row.seckillType)">
                  {{ getSeckillTypeText(scope.row.seckillType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="活动状态" width="120" align="center">
              <template #default="scope">
                <el-tag :type="getActivityStatusTag(scope.row.activityStatus)">
                  {{ getActivityStatusText(scope.row.activityStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="内容数量" width="100" align="center">
              <template #default="scope">
                {{ scope.row.count ?? 0 }}
              </template>
            </el-table-column>
            <el-table-column label="活动时间" min-width="280">
              <template #default="scope">
                <div class="time-range">
                  <span>{{ scope.row.startTime }}</span>
                  <span class="separator">至</span>
                  <span>{{ scope.row.endTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="210" fixed="right" align="center" style="left: auto;">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button size="small" class="activity-btn-detail" @click="goToActivityDetail(scope.row.activityId)">详情</el-button>
                  <el-button size="small" class="activity-btn-edit" @click="openEditDialog(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :class="(scope.row.activityStatus === 3 || scope.row.activityStatus === '已禁用') ? 'activity-btn-enable' : 'activity-btn-disable'"
                    @click="handleToggleActivityStatus(scope.row)"
                  >
                    {{ (scope.row.activityStatus === 3 || scope.row.activityStatus === '已禁用') ? '启用' : '禁用' }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pagination-wrapper"
            v-model:current-page="activityQuery.pageNum"
            v-model:page-size="activityQuery.pageSize"
            :total="activityTotal"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadActivityData"
            @current-change="loadActivityData"
            style="text-align: right; margin-top: 20px"
          />
        </el-tab-pane>

        <!-- 秒杀商品审核 -->
        <el-tab-pane label="商品审核" name="audit">
          <div class="filter-container">
            <el-form :inline="true" :model="auditQuery" class="filter-form">
              <el-form-item label="商品名称">
                <el-input 
                  v-model="auditQuery.keyword" 
                  placeholder="请输入商品名称" 
                  clearable 
                  class="filter-input"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select 
                  v-model="auditQuery.auditStatus" 
                  placeholder="请选择状态" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="待审核" :value="0" />
                  <el-option label="已通过" :value="1" />
                  <el-option label="已拒绝" :value="2" />
                  <el-option label="已完成" :value="4" />
                </el-select>
              </el-form-item>
              <el-form-item label="排序字段">
                <el-select 
                  v-model="auditQuery.sortField" 
                  placeholder="请选择排序字段" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="申请时间" :value="1" />
                  <el-option label="审核时间" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="排序规则">
                <el-select 
                  v-model="auditQuery.sortOrder" 
                  placeholder="请选择排序规则" 
                  clearable 
                  class="filter-select"
                >
                  <el-option label="正序" :value="0" />
                  <el-option label="倒序" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item class="filter-buttons">
                <el-button type="primary" @click="handleAuditSearch" :icon="Search">查询</el-button>
                <el-button @click="resetAuditSearch" :icon="Refresh">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table v-loading="auditLoading" :data="auditList" border class="data-table">
            <el-table-column label="申请ID" prop="applyId" width="180" show-overflow-tooltip />
            <el-table-column label="商品名称" prop="productName" min-width="180" show-overflow-tooltip />
            <el-table-column label="规格" prop="specText" min-width="150" show-overflow-tooltip />
            <el-table-column label="秒杀价" width="120">
              <template #default="scope">
                <span class="price">￥{{ scope.row.seckillPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="审核状态" width="120" align="center">
              <template #default="scope">
                <el-tag :type="getAuditStatusTag(scope.row.auditStatus)">
                  {{ getAuditStatusText(scope.row.auditStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分配状态" width="120" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.allocateStatus === '已分配' ? 'success' : 'info'" effect="plain">
                  {{ scope.row.allocateStatus === '已分配' ? '已分配' : '未分配' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="库存" prop="stock" width="100" align="center" />
            <el-table-column label="限购" prop="limitPerUser" width="100" align="center" />
            <el-table-column label="申请时间" prop="createTime" width="180" align="center" />
            <el-table-column label="操作" width="180" fixed="right" align="center">
              <template #default="scope">
                <el-button size="small" type="primary" plain @click="openDetailDialog(scope.row)">详情</el-button>
                <el-button size="small" type="success" plain @click="openAuditDialog(scope.row)" v-if="scope.row.auditStatus === '待审核'">审核</el-button>
                <el-button size="small" type="warning" plain @click="openAssignDialog(scope.row)" v-if="scope.row.auditStatus === '已通过' && scope.row.allocateStatus === '未分配'">分配</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pagination-wrapper"
            v-model:current-page="auditQuery.pageNum"
            v-model:page-size="auditQuery.pageSize"
            :total="auditTotal"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadAuditData"
            @current-change="loadAuditData"
            style="text-align: right; margin-top: 20px"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 活动创建/编辑弹窗 -->
    <el-dialog
      v-model="activityDialogVisible"
      :title="isEdit ? '编辑秒杀活动' : '创建秒杀活动'"
      width="600px"
      @closed="resetActivityForm"
    >
      <el-form :model="activityForm" :rules="activityRules" ref="activityFormRef" label-width="100px">
        <!-- 编辑时显示活动 ID（只读） -->
        <el-form-item v-if="isEdit" label="活动 ID">
          <el-input v-model="activityForm.activityId" disabled />
        </el-form-item>
        
        <el-form-item label="活动名称" prop="activityName">
          <el-input 
            v-model="activityForm.activityName" 
            placeholder="请输入活动名称" 
          />
        </el-form-item>
        <el-form-item label="活动类型" prop="activityType">
          <el-radio-group v-model="activityForm.activityType">
            <el-radio :label="1" @click.prevent="activityForm.activityType === 1 ? activityForm.activityType = undefined : activityForm.activityType = 1">普通秒杀</el-radio>
            <el-radio :label="2" @click.prevent="activityForm.activityType === 2 ? activityForm.activityType = undefined : activityForm.activityType = 2">整点秒杀</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="秒杀类型" prop="seckillType">
          <el-radio-group v-model="activityForm.seckillType">
            <el-radio :label="1" @click.prevent="activityForm.seckillType === 1 ? activityForm.seckillType = undefined : activityForm.seckillType = 1">商品秒杀</el-radio>
            <el-radio :label="2" @click.prevent="activityForm.seckillType === 2 ? activityForm.seckillType = undefined : activityForm.seckillType = 2">优惠券秒杀</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="activityForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="排序权重" prop="sortOrder">
          <el-input-number v-model="activityForm.sortOrder" :min="0" :max="9999" placeholder="越大越靠前" style="width: 180px" />
          <span class="form-tip">数值越大，活动在前端展示越靠前</span>
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input 
            v-model="activityForm.description" 
            type="textarea" 
            rows="3" 
            placeholder="请输入活动描述" 
          />
        </el-form-item>
        <el-form-item label="活动封面" prop="mainImage">
          <el-upload
            class="activity-uploader"
            action="/server/api/file/upload"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="activityForm.mainImage" :src="activityForm.mainImage" class="activity-img" />
            <el-icon v-else class="activity-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：750*350px，支持JPG/PNG</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="activityDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleActivitySubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="秒杀申请详情"
      width="700px"
      @closed="resetDetailDialog"
    >
      <div v-if="detailData" class="detail-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请ID" width="120">{{ detailData.applyId }}</el-descriptions-item>
          <el-descriptions-item label="店铺ID" width="120">{{ detailData.shopId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="商品ID" width="120">{{ detailData.productId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="SKU ID" width="120">{{ detailData.skuId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="商品名称">{{ detailData.productName }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ detailData.specText || '-' }}</el-descriptions-item>
          <el-descriptions-item label="秒杀价格"><span class="price">￥{{ detailData.seckillPrice }}</span></el-descriptions-item>
          <el-descriptions-item label="提供库存">{{ detailData.stock }}</el-descriptions-item>
          <el-descriptions-item label="每人限购">{{ detailData.limitPerUser }}件</el-descriptions-item>
          <el-descriptions-item label="申请理由">{{ detailData.applyReason || '-' }}</el-descriptions-item>
          <el-descriptions-item label="商家备注">{{ detailData.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核状态"><el-tag :type="getAuditStatusTag(detailData.auditStatus)">{{ detailData.auditStatus }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="分配状态"><el-tag :type="detailData.allocateStatus === '已分配' ? 'success' : 'info'">{{ detailData.allocateStatus }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ detailData.auditTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核意见">{{ detailData.auditComment || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核人">{{ detailData.auditorName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="活动ID">{{ detailData.activityId || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog
      v-model="auditVisible"
      title="秒杀申请审核"
      width="600px"
      @closed="resetAuditForm"
    >
      <div v-if="currentApply" class="apply-info">
        <div class="info-row">
          <span class="info-label">商品名称：</span>
          <span class="info-value">{{ currentApply.productName }}</span>
          <el-button 
            size="small" 
            type="text" 
            @click="showApplyDetail(currentApply.applyId)"
            class="detail-btn"
          >查看详情</el-button>
        </div>
        <p><strong>规格：</strong>{{ currentApply.specText }}</p>
        <p><strong>秒杀价格：</strong><span class="price">￥{{ currentApply.seckillPrice }}</span></p>
        <p><strong>提供库存：</strong>{{ currentApply.stock }}</p>
        <p><strong>每人限购：</strong>{{ currentApply.limitPerUser }}件</p>
        <p><strong>申请时间：</strong>{{ currentApply.createTime }}</p>
        <div v-if="applyDetail" class="detail-section">
          <hr style="margin: 15px 0" />
          <p><strong>申请理由：</strong>{{ applyDetail.applyReason || '-' }}</p>
          <p><strong>商家备注：</strong>{{ applyDetail.remark || '-' }}</p>
          <p><strong>审核状态：</strong>{{ applyDetail.auditStatus || '-' }}</p>
          <p><strong>分配状态：</strong>{{ applyDetail.allocateStatus || '-' }}</p>
          <p v-if="applyDetail.auditComment"><strong>审核意见：</strong>{{ applyDetail.auditComment }}</p>
          <p v-if="applyDetail.auditTime"><strong>审核时间：</strong>{{ applyDetail.auditTime }}</p>
          <p v-if="applyDetail.auditorName"><strong>审核人：</strong>{{ applyDetail.auditorName }}</p>
        </div>
      </div>
      <el-form :model="auditForm" :rules="auditRules" ref="auditFormRef" label-width="80px" style="margin-top: 20px">
        <el-form-item label="审核结果" prop="auditResult">
          <el-radio-group v-model="auditForm.auditResult">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditComment">
          <el-input v-model="auditForm.auditComment" type="textarea" rows="3" placeholder="请输入审核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleAuditSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分配活动弹窗 -->
    <el-dialog
      v-model="assignVisible"
      title="分配秒杀活动"
      width="600px"
      @closed="resetAssignForm"
    >
      <div v-if="currentApply" class="apply-info">
        <p><strong>商品名称：</strong>{{ currentApply.productName }}</p>
        <p><strong>规格：</strong>{{ currentApply.specText }}</p>
        <p><strong>秒杀价格：</strong><span class="price">￥{{ currentApply.seckillPrice }}</span></p>
        <p><strong>提供库存：</strong>{{ currentApply.stock }}</p>
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
                  <div class="activity-tooltip">
                    <div><span class="tip-label">活动类型：</span>{{ getActivityTypeText(item.activityType) }}</div>
                    <div><span class="tip-label">已有商品数：</span>{{ item.count }} 个</div>
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
            <div><span class="detail-label">已有商品数：</span><span>{{ currentSelectedActivity.count }} 个</span></div>
            <div><span class="detail-label">开始时间：</span><span>{{ currentSelectedActivity.startTime }}</span></div>
            <div><span class="detail-label">结束时间：</span><span>{{ currentSelectedActivity.endTime }}</span></div>
            <div class="full-width"><span class="detail-label">活动描述：</span><span>{{ currentSelectedActivity.description || '-' }}</span></div>
            <div><span class="detail-label">排序权重：</span><span>{{ currentSelectedActivity.sortOrder }}</span></div>
          </div>
        </div>

        <el-form-item label="排序值" prop="sortOrder">
          <el-input v-model.number="assignForm.sortOrder" type="number" placeholder="请输入排序值（数值越大越靠前）" style="width: 280px" />
          <p style="color: #999; font-size: 12px; margin-top: 5px">* 排序值越大，商品在活动中的位置越靠前</p>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleAssignSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Timer, Plus, Delete, Search, Refresh } from '@element-plus/icons-vue'
import marketApi, { SeckillActivityType, SeckillType } from '@/api/admin/market'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('activity')
const submitLoading = ref(false)

// 上传请求头
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('authToken')}`
}

// ==================== 活动列表相关 ====================
const activityLoading = ref(false)
const activityList = ref([])
const activityTotal = ref(0)
const selectedActivityIds = ref<string[]>([])
const activityQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  activityName: '',
  activityStatus: undefined as number | undefined,
  activityType: undefined as number | undefined,
  seckillType: undefined as number | undefined,
  sortField: undefined as number | undefined,
  sortOrder: undefined as number | undefined
})

const activityDialogVisible = ref(false)
const isEdit = ref(false)
const activityFormRef = ref<FormInstance>()
const activityForm = reactive({
  activityId: '',
  activityName: '',
  activityType: SeckillActivityType.NORMAL,
  seckillType: SeckillType.PRODUCT,
  timeRange: [] as string[],
  description: '',
  mainImage: '',
  sortOrder: 0
})

const activityRules = computed(() => ({
  activityName: [{ required: !isEdit.value, message: '请输入活动名称', trigger: 'blur' }],
  activityType: [{ required: !isEdit.value, message: '请选择活动类型', trigger: 'change' }],
  seckillType: [{ required: !isEdit.value, message: '请选择秒杀类型', trigger: 'change' }],
  timeRange: [{ required: !isEdit.value, message: '请选择活动时间', trigger: 'change' }]
}))

const loadActivityData = async () => {
  activityLoading.value = true
  try {
    const params: any = {
      pageNum: activityQuery.pageNum,
      pageSize: activityQuery.pageSize
    }
    if (activityQuery.activityName) params.activityName = activityQuery.activityName
    if (activityQuery.activityStatus !== undefined) params.activityStatus = activityQuery.activityStatus
    if (activityQuery.activityType !== undefined) params.activityType = activityQuery.activityType
    if (activityQuery.seckillType !== undefined) params.seckillType = activityQuery.seckillType
    if (activityQuery.sortField !== undefined) params.sortField = activityQuery.sortField
    if (activityQuery.sortOrder !== undefined) params.sortOrder = activityQuery.sortOrder
    
    const res = await marketApi.getActivityList(params)
    
    if (res.code === 0) {
      // 打印完整数据结构
      // console.log('res.data 完整结构:', {
      //   hasRecords: !!res.data.records,
      //   recordsLength: res.data.records?.length,
      //   hasList: !!res.data.list,
      //   listLength: res.data.list?.length,
      //   total: res.data.total
      // })
      
      const dataList = res.data.list || []
      activityList.value = dataList
      activityTotal.value = res.data.total
      
      // 详细打印每条记录的完整数据
      // dataList.forEach((item: any, index: number) => {
      //   console.log(`[${index}] 活动详情:`, JSON.stringify(item))
      // })
      
      // console.log('最终 activityList 长度:', activityList.value.length)
    } else {
      ElMessage.error(res.msg || '获取活动列表失败')
    }
  } catch (err: any) {
    console.error('Activity list load error:', err)
    const errorMsg = err.response?.data?.msg || err.message || '网络请求失败'
    ElMessage.error(`获取活动列表失败: ${errorMsg}`)
  } finally {
    activityLoading.value = false
  }
}

const handleActivitySearch = () => {
  activityQuery.pageNum = 1
  loadActivityData()
}

const resetActivitySearch = () => {
  activityQuery.activityName = ''
  activityQuery.activityStatus = undefined
  activityQuery.activityType = undefined
  activityQuery.seckillType = undefined
  activityQuery.sortField = undefined
  activityQuery.sortOrder = undefined
  handleActivitySearch()
}

const handleActivitySelectionChange = (selection: any[]) => {
  selectedActivityIds.value = selection.map(item => item.activityId)
}

const openCreateDialog = () => {
  isEdit.value = false
  activityDialogVisible.value = true
}

const openEditDialog = async (row: any) => {
  isEdit.value = true
  
  try {
    // 调用详情接口获取封面图片和描述
    const res = await marketApi.getActivityDetail(row.activityId)
    if (res.code === 0 && res.data) {
      const detail = res.data
      
      // 编辑时只回显封面图片和排序权重，其他字段不回显
      Object.assign(activityForm, {
        activityId: row.activityId,
        activityName: '',
        activityType: undefined,
        seckillType: undefined,
        timeRange: [],
        description: '',
        mainImage: detail.mainImage || '',
        sortOrder: detail.sortOrder ?? 0
      })
    }
  } catch (err) {
    console.error('获取活动详情失败:', err)
    // 如果获取详情失败，仍然打开编辑对话框
    Object.assign(activityForm, {
      activityId: row.activityId,
      activityName: '',
      activityType: undefined,
      seckillType: undefined,
      timeRange: [],
      description: '',
      mainImage: '',
      sortOrder: 0
    })
  }
  
  activityDialogVisible.value = true
}

const resetActivityForm = () => {
  activityFormRef.value?.resetFields()
  activityForm.activityId = ''
  activityForm.timeRange = []
  activityForm.mainImage = ''
  activityForm.sortOrder = 0
}

const handleImageSuccess = (res: any) => {
  if (res.code === 0) {
    activityForm.mainImage = res.data
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}

const beforeImageUpload = (file: File) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('图片必须是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }
  return isJPGOrPNG && isLt2M
}

const handleActivitySubmit = async () => {
  if (!activityFormRef.value) return
  try {
    await activityFormRef.value.validate()
    submitLoading.value = true
    
    // 将数字类型转换为枚举描述文字（后端反序列化需要）
    const activityTypeMap: Record<number, string> = {
      1: '普通秒杀',
      2: '整点秒杀'
    }
    const seckillTypeMap: Record<number, string> = {
      1: '商品秒杀',
      2: '优惠券秒杀'
    }
    
    // 时间格式转换：将 ISO 8601 格式转换为后端期望的格式
    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return ''
      // 将 "2026-05-30T00:00:00" 转换为 "2026-05-30 00:00:00"
      return dateStr.replace('T', ' ')
    }
    
    try {
      if (isEdit.value) {
        // 编辑时，提交所有可修改的字段
        const updateData: any = {
          activityId: activityForm.activityId,
          activityName: activityForm.activityName,
          activityType: activityTypeMap[activityForm.activityType] || activityForm.activityType,
          seckillType: seckillTypeMap[activityForm.seckillType] || activityForm.seckillType,
          startTime: formatDateTime(activityForm.timeRange[0]),
          endTime: formatDateTime(activityForm.timeRange[1]),
          description: activityForm.description,
          mainImage: activityForm.mainImage,
          sortOrder: activityForm.sortOrder
        }
        console.log('编辑秒杀活动，提交数据:', JSON.stringify(updateData))
        await marketApi.updateActivity(updateData)
        ElMessage.success('更新成功')
      } else {
        // 创建时，提交所有字段
        const submitData: any = {
          activityName: activityForm.activityName,
          activityType: activityTypeMap[activityForm.activityType] || activityForm.activityType,
          seckillType: seckillTypeMap[activityForm.seckillType] || activityForm.seckillType,
          startTime: formatDateTime(activityForm.timeRange[0]),
          endTime: formatDateTime(activityForm.timeRange[1]),
          description: activityForm.description,
          mainImage: activityForm.mainImage,
          sortOrder: activityForm.sortOrder
        }
        await marketApi.createActivity(submitData)
        ElMessage.success('创建成功')
      }
      activityDialogVisible.value = false
      loadActivityData()
    } catch (err: any) {
      console.error(err)
      ElMessage.error(err.message || (isEdit.value ? '更新失败' : '创建失败'))
    } finally {
      submitLoading.value = false
    }
  } catch (err) {
    console.warn('表单校验未通过')
  }
}

const handleToggleActivityStatus = (row: any) => {
  const isDisable = row.activityStatus !== 3 && row.activityStatus !== '已禁用'
  const actionText = isDisable ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${actionText}该活动吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 后端期望接收枚举描述文字，而不是数字
      const newStatus = isDisable ? '已禁用' : '未开始'
      await marketApi.updateActivityStatus({ 
        activityId: row.activityId, 
        activityStatus: newStatus 
      } as any)
      ElMessage.success(`${actionText}成功`)
      loadActivityData()
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.response?.data?.msg || err.message || `${actionText}失败`
      ElMessage.error(errorMsg)
    }
  })
}


const handleBatchDeleteActivity = () => {
  ElMessageBox.confirm(`确定要批量删除选中的 ${selectedActivityIds.value.length} 个活动吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await marketApi.deleteActivity(selectedActivityIds.value)
      ElMessage.success('批量删除成功')
      loadActivityData()
    } catch (err) {
      console.error(err)
    }
  })
}

const goToActivityDetail = (id: string) => {
  router.push(`/admin/shop/seckill-detail/${id}`)
}

const getActivityStatusTag = (status: any) => {
  const statusMap: Record<string, string> = {
    '未开始': 'info',      // 蓝色
    '进行中': 'success',   // 绿色
    '已结束': 'danger',    // 红色
    '已禁用': 'warning'    // 橙色
  }
  if (typeof status === 'number') {
    switch (status) {
      case 0: return 'info'      // 蓝色
      case 1: return 'success'   // 绿色
      case 2: return 'danger'    // 红色
      case 3: return 'warning'   // 橙色
      default: return ''
    }
  }
  return statusMap[status] || ''
}

const getActivityStatusText = (status: any) => {
  if (typeof status === 'number') {
    switch (status) {
      case 0: return '未开始'
      case 1: return '进行中'
      case 2: return '已结束'
      case 3: return '已禁用'
      default: return '未知'
    }
  }
  return status || '未知'
}

const getActivityTypeText = (type: any) => {
  if (type === 1 || type === '1' || type === 'NORMAL' || type === '普通秒杀') return '普通秒杀'
  if (type === 2 || type === '2' || type === 'HOURLY' || type === '整点秒杀') return '整点秒杀'
  return type || '未知'
}

const getActivityTypeTag = (type: any) => {
  const t = String(type)
  return (t === '1' || t === 'NORMAL' || t === '普通秒杀') ? 'info' : 'warning'
}

const getSeckillTypeText = (type: any) => {
  if (type === 1 || type === '1' || type === 'PRODUCT' || type === '商品秒杀') return '商品秒杀'
  if (type === 2 || type === '2' || type === 'COUPON' || type === '优惠券秒杀') return '优惠券秒杀'
  return type || '未知'
}

const getSeckillTypeTag = (type: any) => {
  const t = String(type)
  return (t === '1' || t === 'PRODUCT' || t === '商品秒杀') ? 'success' : 'primary'
}

// ==================== 商品审核相关 ====================
const auditLoading = ref(false)
const auditList = ref([])
const auditTotal = ref(0)
const auditQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  auditStatus: undefined as number | undefined,
  sortField: undefined as number | undefined,
  sortOrder: undefined as number | undefined
})

const auditVisible = ref(false)
const detailVisible = ref(false)
const currentApply = ref<any>(null)
const applyDetail = ref<any>(null)
const detailData = ref<any>(null)
const auditFormRef = ref<FormInstance>()
const auditForm = reactive({
  applyId: '',
  auditResult: 1,
  auditComment: ''
})

const auditRules = {
  auditResult: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  auditComment: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
}

const assignVisible = ref(false)
const assignFormRef = ref<FormInstance>()
const availableActivities = ref<any[]>([])
const selectedActivity = ref<any>(null)
const assignForm = reactive({
  activityId: '',
  applyId: '',
  sortOrder: undefined as number | undefined
})

const currentSelectedActivity = computed(() => {
  if (!assignForm.activityId || availableActivities.value.length === 0) {
    return null
  }
  return availableActivities.value.find(item => item.activityId === assignForm.activityId) || null
})

const assignRules = {
  activityId: [{ required: true, message: '请选择秒杀活动', trigger: 'change' }]
}

const loadAuditData = async () => {
  auditLoading.value = true
  try {
    const res = await marketApi.getApplyList(auditQuery)
    if (res.code === 0) {
      auditList.value = res.data.list
      auditTotal.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取申请列表失败')
    }
  } catch (err: any) {
    console.error('Audit list load error:', err)
    const errorMsg = err.response?.data?.msg || err.message || '网络请求失败'
    ElMessage.error(`获取申请列表失败: ${errorMsg}`)
  } finally {
    auditLoading.value = false
  }
}

const handleAuditSearch = () => {
  auditQuery.pageNum = 1
  loadAuditData()
}

const resetAuditSearch = () => {
  auditQuery.keyword = ''
  auditQuery.auditStatus = undefined
  auditQuery.sortField = undefined
  auditQuery.sortOrder = undefined
  handleAuditSearch()
}

const openDetailDialog = async (row: any) => {
  try {
    const res = await marketApi.getApplyDetail(row.applyId)
    detailData.value = res.data
    detailVisible.value = true
  } catch (err: any) {
    console.error(err)
    ElMessage.error(err.message || '获取详情失败')
  }
}

const resetDetailDialog = () => {
  detailData.value = null
}

const openAuditDialog = (row: any) => {
  currentApply.value = row
  applyDetail.value = null
  auditForm.applyId = row.applyId
  auditVisible.value = true
}

const resetAuditForm = () => {
  auditFormRef.value?.resetFields()
  currentApply.value = null
  applyDetail.value = null
}

const showApplyDetail = async (applyId: string) => {
  try {
    const res = await marketApi.getApplyDetail(applyId)
    applyDetail.value = res.data
  } catch (err: any) {
    console.error(err)
    ElMessage.error(err.message || '获取详情失败')
  }
}

const handleAuditSubmit = async () => {
  if (!auditFormRef.value) return
  try {
    await auditFormRef.value.validate()
    submitLoading.value = true
    try {
      await marketApi.auditApply(auditForm as any)
      ElMessage.success('审核完成')
      auditVisible.value = false
      loadAuditData()
    } catch (err: any) {
      console.error(err)
      ElMessage.error(err.message || '审核失败')
    } finally {
      submitLoading.value = false
    }
  } catch (err) {
    console.warn('表单校验未通过')
  }
}

const openAssignDialog = async (row: any) => {
  currentApply.value = row
  assignForm.applyId = row.applyId
  assignForm.sortOrder = undefined
  selectedActivity.value = null
  try {
    const res = await marketApi.getActivityProductAddList()
    availableActivities.value = res.data.list
    assignVisible.value = true
  } catch (err) {
    console.error(err)
    ElMessage.error('获取可选活动失败')
  }
}

const onActivityChange = () => {
  if (assignForm.activityId) {
    const activity = availableActivities.value.find(item => item.activityId === assignForm.activityId)
    selectedActivity.value = activity ? { ...activity } : null
  } else {
    selectedActivity.value = null
  }
}

const resetAssignForm = () => {
  assignFormRef.value?.resetFields()
  currentApply.value = null
  selectedActivity.value = null
  assignForm.sortOrder = undefined
}

const handleAssignSubmit = async () => {
  if (!assignFormRef.value) return
  try {
    await assignFormRef.value.validate()
    submitLoading.value = true
    try {
      await marketApi.addProductToActivity(assignForm as any)
      ElMessage.success('分配成功')
      assignVisible.value = false
      loadAuditData()
    } catch (err: any) {
      console.error(err)
      ElMessage.error(err.message || '分配失败')
    } finally {
      submitLoading.value = false
    }
  } catch (err) {
    console.warn('表单校验未通过')
  }
}

const getAuditStatusTag = (status: string) => {
  switch (status) {
    case '待审核': return 'warning'
    case '已通过': return 'success'
    case '已拒绝': return 'danger'
    case '已完成': return 'primary'
    default: return ''
  }
}

const getAuditStatusText = (status: string) => {
  switch (status) {
    case '待审核': return '待审核'
    case '已通过': return '已通过'
    case '已拒绝': return '已拒绝'
    case '已完成': return '已完成'
    default: return '未知'
  }
}

// ==================== 标签切换处理 ====================
const handleTabChange = (name: any) => {
  if (name === 'activity') {
    loadActivityData()
  } else if (name === 'audit') {
    loadAuditData()
  }
}

onMounted(() => {
  loadActivityData()
})
</script>

<style scoped lang="scss">
.seckill-manage-container {
  padding: 12px;
  min-height: 100%;
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding: 10px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    
    .icon {
      font-size: 22px;
      margin-right: 10px;
      animation: pulse 2s infinite;
    }
    
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .main-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .filter-container {
    margin-bottom: 16px;
    
    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 16px;
      background: #fff;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      
      .el-form-item {
        margin-bottom: 0;
        
        :deep(.el-form-item__label) {
          font-weight: 500;
          color: #606266;
          font-size: 13px;
        }
      }
      
      .filter-input {
        width: 200px;
        
        :deep(.el-input__wrapper) {
          border-radius: 6px;
          box-shadow: 0 0 0 1px #dcdfe6 inset;
          transition: all 0.3s;
          
          &:hover {
            box-shadow: 0 0 0 1px #c0c4cc inset;
          }
          
          &.is-focus {
            box-shadow: 0 0 0 1px #409eff inset;
          }
        }
      }
      
      .filter-select {
        width: 140px;
        
        :deep(.el-select .el-input__wrapper) {
          border-radius: 6px;
        }
      }
      
      .filter-buttons {
        :deep(.el-button) {
          border-radius: 6px;
          font-weight: 500;
          padding: 8px 16px;
          font-size: 14px;
        }
      }
    }
  }

  .action-bar {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 6px;
    border: 1px solid #bae6fd;
    
    :deep(.el-button) {
      border-radius: 6px;
      font-weight: 500;
      padding: 10px 20px;
      font-size: 14px;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }

  .data-table {
    margin-top: 12px;
    border-radius: 6px;
    overflow: hidden;
    
    :deep(.el-table__header th) {
      background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
      color: #495057;
      font-weight: 600;
      font-size: 14px;
    }
    
    :deep(.el-table__row:hover) {
      background: #f8f9fa;
    }
    
    :deep(.el-table__cell) {
      padding: 10px 0;
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    
    .activity-btn-detail,
    .activity-btn-edit,
    .activity-btn-enable,
    .activity-btn-disable {
      padding: 13px 25px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 500;
      transition: all 0.3s ease;
      min-width: 55px;
      border-width: 1px;
      
      &:hover {
        opacity: 0.85;
      }
    }
    
    .activity-btn-detail {
      border-color: #b3c0e8;
      background: #f0f3fe;
      color: #667eea;
    }
    
    .activity-btn-edit {
      border-color: #91caff;
      background: #ecf5ff;
      color: #1890ff;
    }
    
    .activity-btn-enable {
      border-color: #a8e063;
      background: #f6ffed;
      color: #52c41a;
    }
    
    .activity-btn-disable {
      border-color: #ffccc7;
      background: #fff2f0;
      color: #ff4d4f;
    }
  }

  .time-range {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #606266;
    
    .separator {
      color: #909399;
      font-weight: 300;
    }
  }

  .price {
    color: #f56c6c;
    font-weight: 600;
    font-size: 15px;
  }

  .apply-info {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    
    p {
      margin: 8px 0;
      font-size: 14px;
      color: #495057;
      line-height: 1.6;
      
      strong {
        color: #343a40;
        font-weight: 600;
      }
      
      .price {
        font-size: 16px;
      }
    }
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    
    :deep(.el-pagination) {
      .el-pager li {
        border-radius: 6px;
        min-width: 32px;
        height: 32px;
        line-height: 32px;
        font-weight: 500;
        
        &.is-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        &:hover:not(.is-active) {
          background: #f5f7fa;
        }
      }
    }
  }

  // 活动状态标签样式
  :deep(.el-tag) {
    &.el-tag--info {
      background-color: #e6f7ff;
      border-color: #91d5ff;
      color: #1890ff;
    }
    &.el-tag--success {
      background-color: #f6ffed;
      border-color: #b7eb8f;
      color: #52c41a;
    }
    &.el-tag--danger {
      background-color: #fff2f0;
      border-color: #ffccc7;
      color: #f5222d;
    }
    &.el-tag--warning {
      background-color: #fff7e6;
      border-color: #ffd591;
      color: #fa8c16;
    }
  }

  // 图片上传样式
  .activity-uploader {
    :deep(.el-upload) {
      border: 2px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      width: 280px;
      height: 130px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fafafa;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        transform: translateY(-2px);
      }
    }
  }

  .activity-uploader-icon {
    font-size: 28px;
    color: #8c939d;
  }

  .activity-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 6px;
    line-height: 1.4;
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-left: 10px;
    font-style: italic;
  }
  
  // 只读输入框样式（编辑时显示用）
  .readonly-input {
    :deep(.el-input__wrapper) {
      background-color: #f5f7fa;
      box-shadow: none;
      border: 1px solid #e4e7ed;
      cursor: default;
      
      .el-input__inner {
        color: #606266;
        font-weight: 500;
      }
    }
  }
  
  .readonly-textarea {
    :deep(.el-textarea__inner) {
      background-color: #f5f7fa;
      box-shadow: none;
      border: 1px solid #e4e7ed;
      cursor: default;
      color: #606266;
      font-weight: 500;
    }
  }
  
  // Tabs 样式优化
  :deep(.el-tabs) {
    .el-tabs__header {
      margin-bottom: 16px;
      
      .el-tabs__item {
        font-size: 14px;
        font-weight: 500;
        padding: 10px 20px;
        border-radius: 6px 6px 0 0;
        transition: all 0.3s;
        
        &:hover {
          color: #667eea;
        }
        
        &.is-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      }
    }
    
    .el-tabs__content {
      padding: 0;
    }
  }
  
  // Dialog 样式优化
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    
    .el-dialog__header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      margin-right: 0;
      
      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn {
        .el-icon {
          color: white;
          
          &:hover {
            color: #e0e7ff;
          }
        }
      }
    }
    
    .el-dialog__body {
      padding: 20px;
      background: #fff;
    }
    
    .el-dialog__footer {
      padding: 12px 20px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }
  }

  // 操作按钮美化
  .btn-detail,
  .btn-audit,
  .btn-assign {
    margin: 0 4px;
    padding: 4px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    min-width: 60px;
    border-width: 1px;
    
    &:hover {
      opacity: 0.85;
    }
  }
  
  .btn-detail {
    border-color: #b3c0e8;
    background: #f0f3fe;
    color: #667eea;
  }
  
  .btn-audit {
    border-color: #a8e063;
    background: #f6ffed;
    color: #52c41a;
  }
  
  .btn-assign {
    border-color: #ffd666;
    background: #fffbe6;
    color: #fa8c16;
  }
  
  .no-action {
    color: #c0c4cc;
    font-size: 12px;
  }

  .activity-detail {
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 13px;
    }

    .detail-label {
      color: #666;
      font-weight: 500;
    }

    .full-width {
      grid-column: 1 / -1;
    }
  }

  .activity-type-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    
    &.info {
      background: #e6f7ff;
      color: #1890ff;
    }
    
    &.warning {
      background: #fff7e6;
      color: #fa8c16;
    }
  }

  :deep(.activity-option) {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    width: 100%;
    box-sizing: border-box;
    
    .activity-tooltip {
      display: none;
      position: absolute;
      left: 0;
      top: calc(100% + 4px);
      background: #fff;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 12px;
      min-width: 280px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-size: 12px;
      line-height: 1.8;
      white-space: normal;
      
      .tip-label {
        color: #666;
        font-weight: 500;
        margin-right: 4px;
      }
    }
    
    &:hover .activity-tooltip {
      display: block;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
</style>
