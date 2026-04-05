<template>
  <div class="sku-audit-detail-container">
    <!-- 顶部返回 -->
    <div class="detail-header-bar">
      <el-button type="default" @click="goBack" round>
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h2>SKU 审批详情</h2>
    </div>

    <!-- 主卡片 -->
    <el-card class="main-card" shadow="hover">
      <!-- 审批状态信息 -->
      <div class="audit-base-section">
        <div class="audit-info-group">
          <p class="audit-id">审批ID：{{ auditData.id }}</p>
          <el-tag :type="getAuditTagType(auditData.auditResult)" class="audit-status-tag">
            {{ auditData.auditResult}}
          </el-tag>
          <el-tag class="audit-type-tag">
            {{ auditData.auditType === '添加审核' ? '新增SKU' : '更新SKU' }}
          </el-tag>
        </div>
      </div>

      <!-- SKU 图片 + 基础信息 -->
      <div class="sku-header">
        <div class="sku-image-group">
          <el-image :src="auditData.imageUrl" class="main-image" preview-teleported fit="cover" />
        </div>
        <div class="sku-base-info">
          <h1 class="sku-title">{{ auditData.specText }}</h1>
       
          <div class="price-group">
            <div class="price-item">
              <span class="price-label">售价</span>
              <span class="price-value">¥{{ auditData.price }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">市场价</span>
              <span class="price-value market">¥{{ auditData.marketPrice }}</span>
            </div>
            <div class="price-item">
              <span class="price-label">成本价</span>
              <span class="price-value cost">¥{{ auditData.costPrice }}</span>
            </div>
          </div>

          <div class="status-group">
            <span class="stock-info">库存：{{ auditData.stock }} 件</span>
            <span class="weight-info">重量：{{ auditData.weight || '--'}} kg</span>
          </div>
        </div>
      </div>

      <!-- 详细信息 -->
      <el-descriptions
        :column="2"
        border
        label-style="color:#956b3e; font-weight:500;"
        content-style="color:#6b5b45;"
        class="info-desc"
      >
        <el-descriptions-item label="SKU ID">{{ auditData.skuId }}</el-descriptions-item>
        <el-descriptions-item label="商品ID">{{ auditData.productId }}</el-descriptions-item>
      
        <el-descriptions-item label="规格名称">{{ auditData.specText }}</el-descriptions-item>
        <el-descriptions-item label="体积">{{ auditData.volume }}m³</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ auditData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ auditData.updateTime }}</el-descriptions-item>
      
     

       
      </el-descriptions>

      <!-- 审批意见 -->
      <div class="audit-reason-section">
        <h3 class="section-title">📝 审批意见</h3>
        <el-input
          v-model="auditReason"
          type="textarea"
          :rows=4
          :disabled="auditData.auditResult !== '待审核'"
          placeholder="请输入审批意见"
          class="reason-input"
        />
      </div>
    </el-card>

    <div class="audit-btn-group" v-if="auditData.auditResult ==='待审核'">
      <el-button type="danger" round @click="handleReject">
        <el-icon><Close /></el-icon> 驳回申请
      </el-button>
      <el-button type="success" round @click="handlePass">
        <el-icon><Check /></el-icon> 审核通过
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type {SkuAudit} from '@/api/admin/shop'
import { getSkuAuditDetail,addSkuAudit,updateSkuAudit } from '@/api/admin/shop'
const router = useRouter()
const route = useRoute()

// 审批数据
const auditData = ref<SkuAudit>({} as SkuAudit)
const auditReason = ref("")


// 加载详情
async function loadDetail() {
  const id = route.query.id as string

  // const res = await getSkuAuditDetail(id)
  // auditData.value = res.data
    try {
    const res = await getSkuAuditDetail(id)
    if (res.data && res.ok) {
      auditData.value = res.data
      auditReason.value = res.data.auditReason || ''
    } else {
      ElMessage.error(res.msg || '获取sku审批详情失败')
    }
  } catch (err) {
    console.error('获取详情失败', err)
    ElMessage.error('获取sku审批详情失败')
  }
}

// 返回
const goBack = () => router.go(-1)



// 驳回
const handleReject = async() => {
  if (!auditReason.value) {
    ElMessage.warning('请填写驳回理由')
    return
  }
  try {
    const params = {
      auditContentId: auditData.value.skuId,
      auditRecordId: auditData.value.id,
      auditResult: '审核不通过',
      auditReason: auditReason.value
    }

    let res
    // 根据审批类型选择接口
    if (auditData.value.auditType === '更新审核') {
      res = await updateSkuAudit(params)
    } else if (auditData.value.auditType === '添加审核') {
      res = await addSkuAudit(params)
    } else {
      ElMessage.error('未知的审批类型')
      return
    }

    if (res.ok) {
      ElMessage.warning('已驳回该商品sku申请')
      router.go(-1)
    } else {
      ElMessage.error(res.msg || '驳回失败')
    }
  } catch (err) {
    console.error('驳回申请失败', err)
    ElMessage.error('操作失败，请重试')
  }
}
// 审核通过
const handlePass = async() => {
  if (!auditReason.value) {
    ElMessage.warning("请输入审批理由")
    return
  }
  try{
    const params={
      auditContentId: auditData.value.skuId,
      auditRecordId:auditData.value.id,
      auditResult: '审核通过', 
      auditReason: auditReason.value,
    }
    let res
    if(auditData.value.auditType === '添加审核'){
      res = await addSkuAudit(params)
    }else{
      res = await updateSkuAudit(params)
    }
    if (res.ok) {
      ElMessage.success('sku审核已通过')
      router.go(-1)
    } else {
      ElMessage.error(res.msg || '审核失败')
    }
  }catch(err){
    console.error('审核失败', err)
  }
  
}
// 审批状态标签
const getAuditTagType = (val: any) => {
  if (  val === '待审核') return 'warning'
  if (val === '审核通过') return 'success'
  return 'danger'
}


onMounted(() => loadDetail())
</script>

<style scoped lang="scss">
.sku-audit-detail-container {
  padding: 20px;
  background: #faf6f0;
  min-height: 100vh;
}

.detail-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #6b5b45;
  }
}

.main-card {
  border-radius: 16px;
  border-color: #e8d6c4;
  background: #fff;
  padding: 24px;
  margin-bottom: 20px;
}

.audit-base-section {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8d6c4;
  margin-bottom: 20px;

  .audit-info-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

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

.sku-header {
  display: flex;
  gap: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8d6c4;
  margin-bottom: 24px;
}

.sku-image-group .main-image {
  width: 300px;
  height: 300px;
  border-radius: 12px;
  border: 2px solid #e8d6c4;
}

.sku-base-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .sku-title {
    margin: 0;
    font-size: 24px;
    color: #3e2723;
  }

  .sku-sn {
    color: #9e7d66;
    margin: 0;
  }
}

.price-group {
  display: flex;
  gap: 24px;
  background: #fff9f2;
  padding: 16px;
  border-radius: 12px;
}

.price-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .price-label {
    color: #956b3e;
    font-size: 12px;
  }

  .price-value {
    font-size: 20px;
    font-weight: 600;
    color: #e8a87c;

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

.status-group {
  display: flex;
  gap: 16px;
  color: #6b5b45;
}

.info-desc {
  --el-descriptions-border-color: #e8d6c4;
  --el-descriptions-header-bg-color: #e8a87c;
  --el-descriptions-header-text-color: #fff;
}

.json-input {
  background: #faf6f0;
  border-radius: 8px;
}

.audit-reason-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e8d6c4;

  .section-title {
    color: #e8a87c;
    margin-bottom: 12px;
  }
}

.reason-input {
  border-radius: 8px;
  border-color: #e8d6c4;
}

.audit-btn-group {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}
</style>