<template>
  <div class="product-detail-container">
    <!-- 顶部返回 + 标题 -->
    <div class="detail-header-bar">
      <el-button type="default" @click="goBack" round>
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回列表
      </el-button>
      <h2>商品详情</h2>
    </div>

    <!-- 主体卡片 -->
    <el-card class="main-card" shadow="hover">
      <!-- 商品头部：主图 + 基础信息 -->
      <div class="product-header">
        <div class="product-image-group">
          <el-image :src="productData?.mainImage" class="main-image" preview-teleported fit="cover" />
          <div class="sub-images" v-if="productData?.images">
            <el-image v-for="(img, idx) in productData?.images.split(',')" :key="idx" :src="img" class="sub-image"
              preview-teleported fit="cover" />
          </div>
        </div>
        <div class="product-base-info">
          <h1 class="product-title">{{ productData?.title }}</h1>
          <p class="product-subtitle">{{ productData?.subTitle || '暂无副标题' }}</p>
          <div class="price-group">
            <div class="price-item">
              <span class="price-label">销售价</span>
              <span class="price-value">¥{{ productData?.currentPrice }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">市场价</span>
              <span class="price-value market">¥{{ productData?.marketPrice }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">成本价</span>
              <span class="price-value cost">¥{{ productData?.costPrice }}</span>
            </div>
          </div>
          <div class="status-group">
            <el-tag :type="getStatusTagType(productData?.status)" class="status-tag">
              {{ productData?.status }}
            </el-tag>
            <span class="stock-info">库存：{{ productData?.stock }} 件</span>
            <span class="sales-info">销量：{{ productData?.sales }} 件</span>
          </div>
        </div>
      </div>

      <!-- 商品详细信息 -->
      <el-descriptions :column="2" border label-style="color:#956b3e; font-weight:500;" content-style="color:#6b5b45;"
        class="info-desc">

        <el-descriptions-item label="商品编号">{{ productData?.productSn }}</el-descriptions-item>
        <el-descriptions-item label="品牌ID">{{ productData?.brandId }}</el-descriptions-item>
        <el-descriptions-item label="类别ID">{{ productData?.typeId }}</el-descriptions-item>
        <el-descriptions-item label="商品重量">{{ productData?.productWeight|| '-- ' }}g</el-descriptions-item>
        <el-descriptions-item label="商品评分">{{ productData?.productScore }} 分</el-descriptions-item>
        <el-descriptions-item label="累计评价">{{ productData?.reviewCount }} 条</el-descriptions-item>
        <el-descriptions-item label="质保提示">{{ productData?.warrantyTip || '无' }}</el-descriptions-item>
        <el-descriptions-item label="上架时间">{{ productData?.publishTime || '--' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ productData?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ productData?.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="视频URL" :span="2">
          <el-link :href="productData?.videoUrl" target="_blank" v-if="productData?.videoUrl">
            {{ productData?.videoUrl }}
          </el-link>
          <span v-else>无视频</span>
        </el-descriptions-item>
        <el-descriptions-item label="商品详情" :span="2">
          <div class="detail-content">{{ productData?.detail || '暂无详情' }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ProductInfo } from '@/api/admin/shop'
import { ElMessage } from 'element-plus'
import { getProductDetail } from '@/api/admin/shop'

// 路由
const router = useRouter()
const route = useRoute()

// 商品数据（1:1 对应你给的接口字段）
const productData = ref<ProductInfo>()

// 获取商品详情
async function loadProductDetail() {
  const productId = route.query.id as string // 从路由获取商品ID
  if (!productId) {
    ElMessage.error('未找到商品ID')
    return
  }

  try {
    const res = await getProductDetail(productId)
    if (res.data && res.code == 0) {
      productData.value = res.data
      console.log('商品详情', productData.value)
    } else {
      ElMessage.error(res.msg || '获取商品详情失败')
    }
  } catch (err) {
    console.error('获取详情失败', err)
    ElMessage.error('获取商品详情失败')
  }
}

// 返回列表
const goBack = () => {
  router.go(-1)
}

// 状态标签样式
const getStatusTagType = (status: string | number) => {
  const statusMap: Record<string | number, string> = {
    下架: 'info', // 下架
    上架: 'success', // 上架
    审核中: 'warning', // 审核中
    封禁: 'danger', // 封禁
    审核通过: 'success', // 审核通过
    审核不通过: 'danger' // 审核不通过
  }
  return statusMap[status] || 'info'
}


onMounted(() => {
  loadProductDetail()
})
</script>

<style scoped lang="scss">
/* 整体背景（沿用温馨治愈风格） */
.product-detail-container {
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

      .stock-info,
      .sales-info {
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
</style>