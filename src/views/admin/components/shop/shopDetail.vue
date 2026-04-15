<template>
  <div class="shop-audit-detail-container">
    <div class="detail-header-bar">
      <el-button type="default" icon="Back" @click="goBack" round>返回列表</el-button>
      <h2>商铺申请详情审核</h2>
    </div>

    <!-- 主体卡片 -->
    <el-card class="main-card" shadow="hover">
      <!-- 店铺基础信息 -->
      <div class="shop-base-section">
        <el-avatar :src="shopData.shopAvatar" class="shop-avatar" />
        <div class="shop-base-info">
          <h1 class="shop-name">{{ shopData.shopName }}</h1>
          <div class="tag-group">
            <el-tag class="tag-type">{{ shopData.shopType }}</el-tag>
            <el-tag class="tag-status" type="success">{{ shopData.status }}</el-tag>
          </div>
        </div>
      </div>

      <!-- 详细信息网格 -->
      <el-descriptions :column="2" border label-style="color:#956b3e; font-weight:500;" content-style="color:#6b5b45;"
        class="info-desc">
        <el-descriptions-item label="联系人">{{ shopData.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ shopData.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ shopData.contactEmail }}</el-descriptions-item>
        <el-descriptions-item label="所在地区">
          {{ shopData.province }} {{ shopData.city }} {{ shopData.district }}
        </el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="2">
          {{ shopData.address }}
        </el-descriptions-item>
        <el-descriptions-item label="店铺介绍" :span="2">
          {{ shopData.description }}
        </el-descriptions-item>
        <el-descriptions-item label="营业时间">
          {{ shopData.openTime }} ~ {{ shopData.closeTime }}
        </el-descriptions-item>
        <el-descriptions-item label="信誉评分">{{ shopData.creditScore }} 分</el-descriptions-item>
        <el-descriptions-item label="累计销量">{{ shopData.salesCount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ shopData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ shopData.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <!-- 资质证件 -->
      <div class="cert-section">
        <h3 class="section-title">📄 资质证件审核</h3>
        <div class="cert-images">
          <div class="cert-item">
            <p>营业执照</p>
            <el-image :src="shopData.businessLicense" class="cert-img" preview-teleported fit="cover" />
          </div>
          <div class="cert-item">
            <p>身份证正面</p>
            <el-image :src="shopData.idCardFront" class="cert-img" preview-teleported fit="cover" />
          </div>
          <div class="cert-item">
            <p>身份证反面</p>
            <el-image :src="shopData.idCardBack" class="cert-img" preview-teleported fit="cover" />
          </div>
        </div>
      </div>
    </el-card>

    <!-- 底部审核按钮 -->
    <!-- <div class="audit-btn-group">
      <el-button type="warning" size="default" round @click="handleFreeze">冻结店铺</el-button>
      <el-button type="danger" size="default" round @click="handlePass">注销店铺</el-button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShopDetail } from '@/api/admin/shop'
import type { StoreInfo } from '@/api/admin/shop'
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()

// 商铺详情数据
const shopData = ref<StoreInfo>({} as StoreInfo)

// 获取商铺id
async function loadShopDetail() {
  const shopId = route.query.id as string

  if (!shopId) {
    ElMessage.error('未找到商铺 ID')
    return
  }

  try {
    const res = await getShopDetail(shopId)
    shopData.value = res.data
  } catch (err) {
    console.error('获取商铺详情失败', err)
    ElMessage.error('获取商铺详情失败')
  }
}

onMounted(() => {
  loadShopDetail()
})

// 返回
const goBack = () => {
  router.go(-1)
}

// 冻结
// const handleFreeze= () => {
//   ElMessage.success('商铺已冻结')
//   router.go(-1)
// }

// // 注销
// const handlePass = () => {
//   ElMessage.warning('商铺已注销')
//   router.go(-1)
// }
//解冻
</script>

<style scoped lang="scss">
.shop-audit-detail-container {
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
  margin-bottom: 20px;
  padding: 24px;
}

/* 店铺基础信息 */
.shop-base-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;

  .shop-avatar {
    width: 80px;
    height: 80px;
    border: 3px solid #e8a87c;
  }

  .shop-name {
    margin: 0 0 6px 0;
    color: #3e2723;
    font-size: 22px;
  }

  .tag-group {
    display: flex;
    gap: 8px;
  }

  .tag-type {
    background: #f3d9b9;
    color: #956b3e;
    border: none;
    border-radius: 6px;
  }

  .tag-status {
    border-radius: 6px;
  }
}

/* 信息描述表格 */
.info-desc {
  --el-descriptions-border-color: #e8d6c4;
  margin-bottom: 24px;
}

/* 资质证件 */
.cert-section {
  .section-title {
    font-size: 16px;
    color: #e8a87c;
    margin-bottom: 16px;
  }

  .cert-images {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .cert-item {
    text-align: center;

    p {
      margin: 0 0 8px 0;
      color: #6b5b45;
      font-weight: 500;
    }

    .cert-img {
      width: 240px;
      height: 160px;
      border-radius: 10px;
      border: 1px solid #e8d6c4;
    }
  }
}

/* 审核按钮组 */
.audit-btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}
</style>