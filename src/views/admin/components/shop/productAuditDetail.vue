<template>
  <div class="product-audit-detail-container">
    <!-- 顶部返回 + 标题 -->
    <div class="detail-header-bar">
      <el-button type="default" @click="goBack" round>
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回列表
      </el-button>
      <h2>商品审批详情</h2>
    </div>

    <!-- 主体卡片 -->
    <el-card class="main-card" shadow="hover">


      <!-- 商品头部：主图 + 基础信息 -->
      <div class="product-header">
        <div class="product-image-group">
          <el-image :src="auditData.mainImage" class="main-image" preview-teleported fit="cover" />
          <div class="sub-images" v-if="auditData.images">
            <el-image v-for="(img, idx) in auditData.images.split(',')" :key="idx" :src="img" class="sub-image"
              preview-teleported fit="cover" />
          </div>
        </div>
        <div class="product-base-info">
          <h1 class="product-title">{{ auditData.title }}</h1>

          <div class="tag-group">

            <el-tag class="product-subtitle">{{ auditData.subTitle || '暂无副标题' }}</el-tag>


            <el-tag :type="getAuditStatusTagType(auditData.auditResult)" class="audit-status-tag">
              {{ auditData.auditResult || '待审核' }}
            </el-tag>
          </div>
          <div class="price-group">
            <div class="price-item">
              <span class="price-label">销售价</span>
              <span class="price-value">¥{{ auditData.currentPrice }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">市场价</span>
              <span class="price-value market">¥{{ auditData.marketPrice }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">原价</span>
              <span class="price-value cost">¥{{ auditData.costPrice }}</span>
            </div>
          </div>
          <div class="status-group">
            <span class="stock-info">库存：{{ auditData.stock }} 件</span>
            <span class="weight-info">重量：{{ auditData.productWeight }}g</span>
          </div>
        </div>
      </div>

      <!-- 商品详细信息 -->
      <el-descriptions :column="2" border label-style="color:#956b3e; font-weight:500;" content-style="color:#6b5b45;"
        class="info-desc">

        <el-descriptions-item label="商品编号">{{ auditData.productSn }}</el-descriptions-item>

        <el-descriptions-item label="父级分类ID">{{ auditData.typeParent || '-' }}</el-descriptions-item>
        <el-descriptions-item label="子级分类ID">{{ auditData.typeChild || '-' }}</el-descriptions-item>
        <el-descriptions-item label="质保信息">{{ auditData.warrantyTip || '无' }}</el-descriptions-item>
        <el-descriptions-item label="审批人ID">{{ auditData.auditorId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批类型">{{ auditData.auditType }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{ auditData.auditTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="视频URL" :span="2">
          <el-link :href="auditData.videoUrl" target="_blank" v-if="auditData.videoUrl">
            {{ auditData.videoUrl }}
          </el-link>
          <span v-else>无视频</span>
        </el-descriptions-item>
        <el-descriptions-item label="商品详情" :span="2">
          <div class="detail-content">{{ auditData.detail || '暂无详情' }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 审批理由区域（动态控制：待审核可输入，已审核只读） -->
      <div class="audit-reason-section">
        <h3 class="section-title">📝 审批意见</h3>
        <el-input v-model="auditReason" type="textarea" rows="4" :disabled="auditData.auditResult !== '待审核'"
          placeholder="请输入审批理由" class="reason-input" />
      </div>
    </el-card>

    <div class="audit-btn-group" v-if="auditData.auditResult === '待审核'">

      <el-button type="danger" size="default" round @click="handleReject">
        <el-icon>
          <Close />
        </el-icon>
        &nbsp;驳回申请
      </el-button>
      <el-button type="success" size="default" round @click="handlePass">
        <el-icon>
          <Check />
        </el-icon>
        &nbsp;审核通过
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ProductAudit } from '@/api/admin/shop'
import { getProductAuditDetail, updateProductAudit, addProductAudit } from '@/api/admin/shop'
import { ElMessage } from 'element-plus'

// 路由
const router = useRouter()
const route = useRoute()

// 商品审批数据（1:1 对应你给的接口字段）
const auditData = ref<ProductAudit>({} as ProductAudit)

const auditReason = ref("")

// 获取商品审批详情
async function loadAuditDetail() {
  const auditId = route.query.id as string // 从路由获取审批ID
  if (!auditId) {
    ElMessage.error('未找到审批ID')
    return
  }

  try {
    const res = await getProductAuditDetail(auditId)
    if (res.data && res.code == 0) {
      auditData.value = res.data
      auditReason.value = res.data.auditReason || ''
    } else {
      ElMessage.error(res.msg || '获取商品审批详情失败')
    }
  } catch (err) {
    console.error('获取详情失败', err)
    ElMessage.error('获取商品审批详情失败')
  }
}

// 返回列表
const goBack = () => {
  router.go(-1)
}

// 审核通过
const handlePass = async () => {
  if (!auditReason.value) {
    ElMessage.warning("请输入审批理由")
    return
  }
  try {
    const params = {
      auditContentId: Number(auditData.value.productId),
      auditRecordId: Number(auditData.value.id),
      auditResult: '审核通过',
      auditReason: auditReason.value,
    }
    let res
    if (auditData.value.auditType === '添加审核') {
      res = await addProductAudit(params)
    } else {
      res = await updateProductAudit(params)
    }
    if (res.ok) {
      ElMessage.success('商品审核已通过')
      router.go(-1)
    } else {
      ElMessage.error(res.msg || '审核失败')
    }
  } catch (err) {
    console.error('审核失败', err)
  }

}

// 驳回申请
const handleReject = async () => {
  if (!auditReason.value) {
    ElMessage.warning("请输入驳回理由")
    return
  }

  try {
    const params = {
      auditContentId: Number(auditData.value.productId),
      auditRecordId: Number(auditData.value.id),
      auditResult: '审核不通过',
      auditReason: auditReason.value
    }

    let res
    // 根据审批类型选择接口
    if (auditData.value.auditType === '更新审核') {
      res = await updateProductAudit(params)
    } else if (auditData.value.auditType === '添加审核') {
      res = await addProductAudit(params)
    } else {
      ElMessage.error('未知的审批类型')
      return
    }

    if (res.ok) {
      ElMessage.warning('已驳回该商品申请')
      router.go(-1)
    } else {
      ElMessage.error(res.msg || '驳回失败')
    }
  } catch (err) {
    console.error('驳回申请失败', err)
    ElMessage.error('操作失败，请重试')
  }
}

const getAuditStatusTagType = (status: string) => {
  switch (status) {
    case '审核通过':
      return 'success'
    case '审核不通过':
      return 'danger'
    case '待审核':
      return 'warning'
    default:
      return 'info'
  }
}




onMounted(() => {
  loadAuditDetail()
})
</script>

<style scoped lang="scss">
/* 整体背景（沿用温馨治愈风格） */
.product-audit-detail-container {
  padding: 20px;
  background: #faf6f0;
  min-height: 100vh;
}

/* 顶部返回栏 */
.detail-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #6b5b45;
    font-weight: 600;
  }
}

/* 主卡片 */
.main-card {
  border-radius: 16px;
  border-color: #e8d6c4;
  background: #ffffff;
  padding: 24px;
}

/* 审批基础信息 */
.audit-base-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8d6c4;

  .audit-info-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .audit-id {
      color: #6b5b45;
      font-weight: 500;
      margin: 0;
    }

    .audit-status-tag {
      border-radius: 6px;
    }

    .audit-type-tag {
      background: #f3d9b9;
      color: #956b3e;
      border: none;
      border-radius: 6px;
    }
  }
}

/* 商品头部 */
.product-header {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8d6c4;

  .product-image-group {
    .main-image {
      width: 300px;
      height: 300px;
      border-radius: 12px;
      border: 2px solid #e8d6c4;
      margin-bottom: 12px;
    }

    .sub-images {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .sub-image {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        border: 1px solid #e8d6c4;
      }
    }
  }

  .product-base-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .product-title {
      margin: 0;
      color: #3e2723;
      font-size: 24px;
    }

    .product-subtitle {
      margin: 0 10px 0 0;
      color: #9e7d66;
      font-size: 12px;
    }

    .price-group {
      display: flex;
      gap: 24px;
      background: #fff9f2;
      padding: 16px;
      border-radius: 12px;

      .price-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .price-label {
          color: #956b3e;
          font-size: 12px;
        }

        .price-value {
          color: #e8a87c;
          font-size: 20px;
          font-weight: 600;

          &.market {
            color: #9e7d66;
            text-decoration: line-through;
            font-size: 16px;
          }

          &.cost {
            color: #6b5b45;
            font-size: 16px;
          }
        }
      }
    }

    .status-group {
      display: flex;
      align-items: center;
      gap: 16px;

      .stock-info,
      .weight-info {
        color: #6b5b45;
        font-size: 14px;
      }
    }
  }
}

/* 信息描述表格（表头加深，和之前风格统一） */
.info-desc {
  --el-descriptions-border-color: #e8d6c4;
  --el-descriptions-header-bg-color: #e8a87c;
  --el-descriptions-header-text-color: #ffffff;
  --el-descriptions-item-padding: 12px 16px;

  .detail-content {
    line-height: 1.6;
    color: #6b5b45;
    white-space: pre-wrap;
  }
}

/* 审批理由区域 */
.audit-reason-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e8d6c4;

  .section-title {
    font-size: 16px;
    color: #e8a87c;
    margin-bottom: 12px;
  }

  .reason-input {
    border-radius: 8px;
    border-color: #e8d6c4;
    --el-input-focus-border-color: #e8a87c;
  }
}

/* 审批按钮组 */
.audit-btn-group {
  display: flex;
  justify-content: space-around;
  gap: 36px;
  margin-top: 10px;
}
</style>