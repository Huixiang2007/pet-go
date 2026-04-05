<template>
  <div class="sku-detail-container">
    <!-- 顶部返回 + 标题 -->
    <div class="detail-header-bar">
      <el-button type="default" @click="goBack" round>
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h2>SKU 商品详情</h2>
    </div>

    <!-- 主体卡片 -->
    <el-card class="main-card" shadow="hover">
      <!-- SKU头部：图片 + 基础信息 -->
      <div class="sku-header">
        <div class="sku-image-group">
          <el-image
            :src="skuData.imageUrl"
            class="main-image"
            preview-teleported
            fit="cover"
          />
        </div>
        <div class="sku-base-info">
          <h1 class="sku-title">{{ skuData.specText || 'SKU规格' }}</h1>
          <p class="sku-sn">SKU编号：{{ skuData.skuSn }}</p>
          <div class="price-group">
            <div class="price-item">
              <span class="price-label">销售价</span>
              <span class="price-value">¥{{ skuData.price }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">市场价</span>
              <span class="price-value market">¥{{ skuData.marketPrice }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">成本价</span>
              <span class="price-value cost">¥{{ skuData.costPrice }}</span>
            </div>
          </div>
          <div class="status-group">
            <el-tag :type="getStatusTagType(skuData.status)" class="status-tag">
              {{ getStatusName(skuData.status) }}
            </el-tag>
            <span class="stock-info">库存：{{ skuData.stock }} 件</span>
            <span class="sales-info">销量：{{ skuData.sales }} 件</span>
          </div>
        </div>
      </div>

      <!-- SKU详细信息 -->
      <el-descriptions
        :column="2"
        border
        label-style="color:#956b3e; font-weight:500;"
        content-style="color:#6b5b45;"
        class="info-desc"
      >
        <el-descriptions-item label="SKU ID">{{ skuData.skuId }}</el-descriptions-item>
        <el-descriptions-item label="商品ID">{{ skuData.productId }}</el-descriptions-item>
        <el-descriptions-item label="SKU编号">{{ skuData.skuSn }}</el-descriptions-item>
        <el-descriptions-item label="规格组合">{{ skuData.specText }}</el-descriptions-item>
        <el-descriptions-item label="sku市场价">{{ skuData.marketPrice }}</el-descriptions-item>
        <el-descriptions-item label="sku销量">{{ skuData.sales }}</el-descriptions-item>
        <el-descriptions-item label="sku库存">{{ skuData.stock }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ skuData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ skuData.updateTime }}</el-descriptions-item>
      
         
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref,  onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { getSkuDetail } from '@/api/admin/shop' 

// 路由
const router = useRouter()
const route = useRoute()

// SKU数据（1:1 对应你给的接口字段）
const skuData = ref({
  skuId: 0,
  productId: 0,
  skuSn: "",
  specJson: "",
  specText: "",
  price: 0,
  marketPrice: 0,
  costPrice: 0,
  stock: 0,
  sales: 0,
  imageUrl: "",
  weight: 0,
  volume: 0,
  status: "",
  publishTime: "",
  createTime: "",
  updateTime: ""
})


// 获取SKU详情
async function loadSkuDetail() {
  const skuId = route.query.id as string // 从路由获取SKU ID
  if (!skuId) {
    ElMessage.error('未找到SKU ID')
    return
  }

  try {
    const res = await getSkuDetail(skuId)
    if (res.data && res.ok) {
      skuData.value = res.data
    } else {
      ElMessage.error(res.msg || '获取SKU详情失败')
    }
  } catch (err) {
    console.error('获取详情失败', err)
    ElMessage.error('获取SKU详情失败')
  }
}

// 返回列表
const goBack = () => {
  router.go(-1)
}

// 状态标签样式
const getStatusTagType = (status: string | number) => {
  const statusMap: Record<string | number, string> = {
    下架: 'info',    // 下架
    上架: 'success', // 上架
    缺货: 'warning', // 缺货
    审核中: 'warning', // 审核中
    审核通过: 'success', // 审核通过
    审核不通过: 'danger'   // 审核不通过
  }
  return statusMap[status] || 'info'
}

// 状态名称
const getStatusName = (status: string | number) => {
  const statusNameMap: Record<string | number, string> = {
    下架: '已下架',
    上架: '已上架',
    缺货: '缺货',
    审核中: '审核中',
    审核通过: '审核通过',
    审核不通过: '审核失败'
  }
  return statusNameMap[status] || '未知状态'
}

onMounted(() => {
  loadSkuDetail()
})
</script>

<style scoped lang="scss">
/* 整体背景（沿用温馨治愈风格） */
.sku-detail-container {
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

/* SKU头部 */
.sku-header {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8d6c4;

  .sku-image-group {
    .main-image {
      width: 300px;
      height: 300px;
      border-radius: 12px;
      border: 2px solid #e8d6c4;
    }
  }

  .sku-base-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .sku-title {
      margin: 0;
      color: #3e2723;
      font-size: 24px;
    }

    .sku-sn {
      margin: 0;
      color: #9e7d66;
      font-size: 14px;
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

      .status-tag {
        border-radius: 6px;
      }

      .stock-info, .sales-info {
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

  .json-input {
    border-radius: 8px;
    border-color: #e8d6c4;
    background: #faf6f0;
    --el-input-disabled-bg-color: #faf6f0;
  }
}
</style>