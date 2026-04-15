<template>
  <div class="shop-audit-detail-container">
    <div class="detail-header-bar">
      <el-button type="default" @click="goBack" round>
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回列表
      </el-button>
      <h2>商铺审批详情</h2>
    </div>

    <!-- 主体卡片 -->
    <el-card class="main-card" shadow="hover">
      <!-- 商铺基础信息 -->
      <div class="shop-base-section">
        <el-avatar :src="auditData?.shopAvatar" class="shop-avatar" />
        <div class="shop-base-info">
          <h1 class="shop-name">{{ auditData?.shopName }}</h1>
          <div class="tag-group">
            <el-tag class="tag-type">{{ auditData?.shopType }}</el-tag>
            <el-tag :type="getAuditStatusTagType(auditData?.auditResult)" class="audit-status-tag">
              {{ auditData?.auditResult || '待审核' }}
            </el-tag>
          </div>
        </div>
      </div>

      <el-descriptions :column="2" border label-style="color:#956b3e; font-weight:500;" content-style="color:#6b5b45;"
        class="info-desc">
        <el-descriptions-item label="店铺类型">{{ auditData?.shopType }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ auditData?.userId }}</el-descriptions-item>
        <el-descriptions-item label="审批类型">{{ auditData?.auditType }}</el-descriptions-item>
        <el-descriptions-item label="审批人ID">{{
          auditData?.auditorId || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="审批人姓名">{{
          auditData?.auditorName || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{
          auditData?.auditTime || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ auditData?.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ auditData?.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ auditData?.contactEmail }}</el-descriptions-item>
        <el-descriptions-item label="所在地区">
          {{ auditData?.province }} {{ auditData?.city }} {{ auditData?.district }}
        </el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="2">
          {{ auditData?.address }}
        </el-descriptions-item>
        <el-descriptions-item label="商铺简介" :span="2">
          {{ auditData?.description }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 资质证件 -->
      <div class="cert-section">
        <h3 class="section-title">📄 资质证件审核</h3>
        <div class="cert-images">
          <div class="cert-item" v-if="auditData?.shopType === '2' || auditData?.shopType === '企业店'">
            <p>营业执照</p>
            <el-image :src="auditData?.businessLicense" class="cert-img" preview-teleported fit="cover" />
          </div>
          <div class="cert-item">
            <p>身份证正面</p>
            <el-image :src="auditData?.idCardFront" class="cert-img" preview-teleported fit="cover" />
          </div>
          <div class="cert-item">
            <p>身份证反面</p>
            <el-image :src="auditData?.idCardBack" class="cert-img" preview-teleported fit="cover" />
          </div>
        </div>
      </div>

      <!-- 审批理由区域 -->
      <div class="audit-reason-section">
        <h3 class="section-title">📝 审批意见</h3>
        <el-input v-model="auditReason" type="textarea" rows="4" :disabled="auditData?.auditResult !== '待审核'"
          placeholder="请输入审批理由" class="reason-input" />
      </div>
    </el-card>

    <!-- 底部审批按钮-->
    <div class="audit-btn-group" v-if="auditData?.auditResult === '待审核'">
      <el-button type="danger" size="default" round @click="handleReject">
        <el-icon>
          <Close />
        </el-icon>
        驳回申请
      </el-button>
      <el-button type="success" size="default" round @click="handlePass">
        <el-icon>
          <Check />
        </el-icon>
        审核通过
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { getShopAuditDetail, updateShopAudit, addShopAudit } from '@/api/admin/shop'
import { ElMessage } from 'element-plus'

import type { StoreAudit } from '@/api/admin/shop'
const route = useRoute()
const router = useRouter()

const auditData = ref<StoreAudit>()
// 审批理由双向绑定
const auditReason = ref('')

// 计算属性：判断是否为待审核状态
// const isPending = computed(() => auditData.value.auditResult === "待审核")

// 审批状态标签样式
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

async function loadAuditDetail() {
  const id = route.query.id as string
  console.log('我是详细页获取到的id:' + id)
  if (!id) {
    ElMessage.error('未找到商铺 ID')
    return
  }

  try {
    const res = await getShopAuditDetail(id)
    auditData.value = res.data;
    console.log(res.data);
  } catch (err) {
    console.error('获取商铺详情失败', err)
    ElMessage.error('获取商铺详情失败')
  }
}
onMounted(() => {
  loadAuditDetail()
})
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
      auditContentId: Number(auditData.value.shopId),
      auditRecordId: Number(auditData.value.id),
      auditResult: '审核通过',
      auditReason: auditReason.value,
    }
    let res
    if (auditData.value.auditType === '添加审核') {
      res = await addShopAudit(params)
    } else {
      res = await updateShopAudit(params)
    }
    if (res.ok) {
      ElMessage.success('商铺审核已通过')
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
    ElMessage.warning('请填写驳回理由')
    return
  }
  try {
    const params = {
      auditContentId: Number(auditData.value.shopId),
      auditRecordId: Number(auditData.value.id),
      auditResult: '审核不通过',
      auditReason: auditReason.value
    }

    let res
    // 根据审批类型选择接口
    if (auditData.value.auditType === '更新审核') {
      res = await updateShopAudit(params)
    } else if (auditData.value.auditType === '添加审核') {
      res = await addShopAudit(params)
    } else {
      ElMessage.error('未知的审批类型')
      return
    }

    if (res.ok) {
      ElMessage.warning('已驳回该商铺申请')
      router.go(-1)
    } else {
      ElMessage.error(res.msg || '驳回失败')
    }
  } catch (err) {
    console.error('驳回申请失败', err)
    ElMessage.error('操作失败，请重试')
  }
}
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
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}
</style>
