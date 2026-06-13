<template>
  <div class="seckill-detail-container">
    <div class="page-header">
      <el-button @click="handleBack" circle icon="ArrowLeft" />
      <h2 style="margin-left: 15px">秒杀活动详情</h2>
    </div>

    <div v-loading="loading">
      <el-row :gutter="20">
        <!-- 基本信息卡片 -->
        <el-col :span="24">
          <el-card shadow="never" class="info-card">
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
              </div>
            </template>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="活动 ID">{{ activityDetail?.activityId }}</el-descriptions-item>
              <el-descriptions-item label="活动状态">
                <el-tag :type="getStatusTag(activityDetail?.activityStatus)">
                  {{ getStatusText(activityDetail?.activityStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建人">{{ activityDetail?.createUserName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="活动封面" :span="3">
                <el-image 
                  v-if="activityDetail?.mainImage" 
                  :src="activityDetail.mainImage" 
                  class="activity-cover-preview"
                  :preview-src-list="[activityDetail.mainImage]"
                />
                <span v-else>未设置封面</span>
              </el-descriptions-item>
              <el-descriptions-item label="活动名称">{{ activityDetail?.activityName }}</el-descriptions-item>
              <el-descriptions-item label="活动类型">
                {{ activityDetail?.activityType === 1 ? '普通秒杀' : '整点秒杀' }}
              </el-descriptions-item>
              <el-descriptions-item label="排序权重">{{ activityDetail?.sortOrder || 0 }}</el-descriptions-item>
              <el-descriptions-item label="秒杀类型">
                {{ activityDetail?.seckillType === 1 ? '商品秒杀' : '优惠券秒杀' }}
              </el-descriptions-item>
              <el-descriptions-item label="内容数量">{{ activityDetail?.count || 0 }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ activityDetail?.createTime || '-' }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ activityDetail?.updateTime || '-' }}</el-descriptions-item>
              <el-descriptions-item label="最近更新人">{{ activityDetail?.updateUserName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="活动描述" :span="3">{{ activityDetail?.description || '暂无描述' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <!-- 内容列表卡片 -->
        <el-col :span="24" style="margin-top: 20px">
          <el-card shadow="never">
            <template #header>
              <div style="display: flex; align-items: center;">
                <span>{{ isProductSeckill() ? '参与商品列表' : '参与优惠券列表' }}</span>
                <el-button 
                  type="danger" 
                  :disabled="!selectedItems.length || (activityDetail?.activityStatus !== 0 && activityDetail?.activityStatus !== '未开始')" 
                  @click="handleBatchRemove"
                  style="margin-left: 100px;"
                >
                  批量移除
                </el-button>
              </div>
            </template>

            <!-- 商品秒杀列表 -->
            <el-table 
              v-if="isProductSeckill()" 
              :data="activityDetail?.productList" 
              border 
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="商品名称" prop="productName" show-overflow-tooltip />
              <el-table-column label="原价" width="120">
                <template #default="scope">￥{{ scope.row.originalPrice }}</template>
              </el-table-column>
              <el-table-column label="秒杀价" width="120">
                <template #default="scope">
                  <span class="price">￥{{ scope.row.seckillPrice }}</span>
                </template>
              </el-table-column>
              <el-table-column label="秒杀库存" prop="totalCount" width="100" align="center" />
              <el-table-column label="限购" prop="limitPerUser" width="100" align="center" />
              <el-table-column label="已抢进度" width="150">
                <template #default="scope">
                  <el-progress :percentage="parseFloat(scope.row.percent) || 0" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right" align="center">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    type="primary" 
                    plain
                    @click="openProductDetail(scope.row)"
                  >
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 优惠券秒杀列表 -->
            <el-table 
              v-else 
              :data="activityDetail?.couponList" 
              border 
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="优惠券名称" prop="couponName" show-overflow-tooltip />
              <el-table-column label="优惠类型" width="100">
                <template #default="scope">
                  {{ scope.row.discountType === 1 || scope.row.discountType === '满减' ? '满减' : '折扣' }}
                </template>
              </el-table-column>
              <el-table-column label="优惠金额" width="120">
                <template #default="scope">
                  <span class="price">
                    {{ scope.row.discountType === 1 || scope.row.discountType === '满减' ? '￥' + scope.row.discount : scope.row.discount + '折' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="最低使用金额" width="120">
                <template #default="scope">￥{{ scope.row.minAmount || 0 }}</template>
              </el-table-column>
              <el-table-column label="适用商品类型" width="120" prop="usedToProductTypeName" show-overflow-tooltip />
              <el-table-column label="剩余数量" width="100" align="center" prop="remainCount" />
              <el-table-column label="限购" width="100" align="center" prop="limitPerUser" />
              <el-table-column label="已抢进度" width="150">
                <template #default="scope">
                  <el-progress :percentage="parseFloat(scope.row.percent) || 0" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right" align="center">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    type="primary" 
                    plain
                    @click="openCouponDetail(scope.row)"
                  >
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 优惠券详情弹窗 -->
    <el-dialog title="优惠券详情" v-model="couponDetailVisible" width="800px">
      <el-descriptions :column="2" border v-if="currentCoupon">
        <el-descriptions-item label="秒杀优惠券关联ID">{{ currentCoupon.seckillCouponId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优惠券ID">{{ currentCoupon.couponId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优惠券名称">{{ currentCoupon.couponName }}</el-descriptions-item>
        <el-descriptions-item label="优惠类型">
          {{ currentCoupon.discountType === 1 || currentCoupon.discountType === '满减' ? '满减' : '折扣' }}
        </el-descriptions-item>
        <el-descriptions-item label="优惠金额">
          {{ currentCoupon.discountType === 1 || currentCoupon.discountType === '满减' ? '￥' + currentCoupon.discount : currentCoupon.discount + '折' }}
        </el-descriptions-item>
        <el-descriptions-item label="最低使用金额">￥{{ currentCoupon.minAmount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="秒杀总数量">{{ currentCoupon.totalCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="剩余数量">{{ currentCoupon.remainCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="每人限领">{{ currentCoupon.limitPerUser || 1 }}张</el-descriptions-item>
        <el-descriptions-item label="已抢进度">
          <el-progress :percentage="parseFloat(currentCoupon.percent) || 0" style="width: 100%" />
        </el-descriptions-item>
        <el-descriptions-item label="优惠券描述">{{ currentCoupon.description || '-' }}</el-descriptions-item>
        <el-descriptions-item label="生效天数">{{ currentCoupon.validDays }}天</el-descriptions-item>
        <el-descriptions-item label="适用商品类型ID">{{ currentCoupon.usedToProductType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="适用商品类型">{{ currentCoupon.usedToProductTypeName || '全部' }}</el-descriptions-item>
        <el-descriptions-item label="生效时间">{{ formatDateTime(currentCoupon.startTime) }}</el-descriptions-item>
        <el-descriptions-item label="失效时间">{{ formatDateTime(currentCoupon.endTime) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 商品详情弹窗 -->
    <el-dialog title="商品详情" v-model="productDetailVisible" width="700px">
      <el-descriptions :column="2" border v-if="currentProduct">
        <el-descriptions-item label="秒杀商品关联ID">{{ currentProduct.seckillProductId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品ID">{{ currentProduct.productId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="SKU ID">{{ currentProduct.skuId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ currentProduct.productName }}</el-descriptions-item>
        <el-descriptions-item label="原价">￥{{ currentProduct.originalPrice }}</el-descriptions-item>
        <el-descriptions-item label="秒杀价">
          <span class="price">￥{{ currentProduct.seckillPrice }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="秒杀库存">{{ currentProduct.totalCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="剩余数量">{{ currentProduct.remainCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="每人限购">{{ currentProduct.limitPerUser || 1 }}件</el-descriptions-item>
        <el-descriptions-item label="已抢进度" :span="2">
          <el-progress :percentage="parseFloat(currentProduct.percent) || 0" style="width: 100%" />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import marketApi from '@/api/admin/market'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const activityId = route.params.id as string
const loading = ref(false)
const activityDetail = ref<any>(null)
const selectedItems = ref<string[]>([])
const couponDetailVisible = ref(false)
const currentCoupon = ref<any>(null)
const productDetailVisible = ref(false)
const currentProduct = ref<any>(null)

const loadData = async () => {
  loading.value = true
  try {
    // 获取活动基本信息
    const detailRes = await marketApi.getActivityDetail(activityId)
    activityDetail.value = detailRes.data
    
    // 获取活动内容列表（商品列表/优惠券列表）
    const contentRes = await marketApi.getSeckillActivityContent(activityId)
    if (contentRes.data) {
      activityDetail.value.productList = contentRes.data.productList
      activityDetail.value.couponList = contentRes.data.couponList
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

const isProductSeckill = () => {
  const type = activityDetail.value?.seckillType
  return type === 1 || type === '1' || type === 'PRODUCT' || type === '商品秒杀'
}

const handleSelectionChange = (selection: any[]) => {
  selectedItems.value = selection.map(item => 
    isProductSeckill() ? item.seckillProductId : item.seckillCouponId
  )
}

const handleRemove = (relationId: string) => {
  ElMessageBox.confirm('确定要从活动中移除该项吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await marketApi.removeProductFromActivity([relationId])
      ElMessage.success('移除成功')
      loadData()
    } catch (err) {
      console.error(err)
    }
  })
}

const openCouponDetail = (coupon: any) => {
  currentCoupon.value = coupon
  couponDetailVisible.value = true
}

const openProductDetail = (product: any) => {
  currentProduct.value = product
  productDetailVisible.value = true
}

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  return dateTime.replace('T', ' ')
}

const handleBatchRemove = () => {
  ElMessageBox.confirm(`确定要批量移除选中的 ${selectedItems.value.length} 项吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      if (isProductSeckill()) {
        await marketApi.removeProductFromActivity(selectedItems.value)
      } else {
        await marketApi.removeCouponFromActivity(selectedItems.value)
      }
      ElMessage.success('批量移除成功')
      loadData()
    } catch (err) {
      console.error(err)
    }
  })
}

const getStatusTag = (status: number) => {
  switch (status) {
    case 0: return 'info'
    case 1: return 'success'
    case 2: return 'danger'
    default: return ''
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case '未开始': return '未开始'
    case '进行中': return '进行中'
    case '已结束': return '已结束'
    case '已禁用': return '已禁用'
    default: return '未知'
  }
}

const handleBack = () => {
  router.push('/admin/shop/seckill-manage')
}

onMounted(() => {
  if (activityId) {
    loadData()
  } else {
    ElMessage.error('无效的活动 ID')
    router.back()
  }
})
</script>

<style scoped lang="scss">
.seckill-detail-container {
  padding: 20px;

  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-size: 20px;
      color: #3d2b23;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .price {
    color: #f56c6c;
    font-weight: bold;
  }

  .info-card {
    :deep(.el-descriptions__label) {
      width: 120px;
      background-color: #f8f9fa;
    }
  }

  .activity-cover-preview {
    width: 120px;
    height: 60px;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid #ebeef5;
  }
}
</style>
