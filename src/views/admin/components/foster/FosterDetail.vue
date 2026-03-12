<template>
  <div class="foster-detail-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="🍀">
        <el-breadcrumb-item><a href="/admin/foster">寄养方管理</a></el-breadcrumb-item>
        <el-breadcrumb-item class="activeBread">寄养方详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 详情卡片 -->
    <el-card class="detail-card" shadow="hover">
      <!-- 基础信息区域 -->
      <div class="base-info">
        <h2 class="title">
          {{ fosterDetail.name }} 
          
          <span class="status-tag" :class="statusClass">{{ statusText }}</span>
          <!-- <span class="decor-icon">🐾</span> -->
        </h2>
      
        <el-row :gutter="20" class="info-row">
          <!-- 左侧基础信息（扩充所有字段） -->
          <el-col :span="16">
            <el-descriptions :column="1" border title="🏠 寄养方核心信息" class="desc-container">
              <!-- 第一行：类型+名称 -->
              <el-descriptions-item label="寄养方类型" class="desc-item">
                {{ fosterDetail.providerType === '个人' ? '个人寄养' : ' 机构寄养' }}
              </el-descriptions-item>
              <el-descriptions-item label="寄养方名称" class="desc-item">
                {{ fosterDetail.name || '暂无名称' }}
              </el-descriptions-item>
              
              <!-- 第二行：联系人+手机号 -->
              <el-descriptions-item label="联系人姓名" class="desc-item">
                {{ fosterDetail.contactName || '暂无联系人' }}
              </el-descriptions-item>
              <el-descriptions-item label="联系电话" class="desc-item">
                {{ fosterDetail.contactPhone || '暂无联系电话' }}
              </el-descriptions-item>
              
              <!-- 第三行：地址拆分展示 -->
              <el-descriptions-item label="所在省份" class="desc-item">
                {{ fosterDetail.province || '暂无省份信息' }}
              </el-descriptions-item>
              <el-descriptions-item label="所在城市" class="desc-item">
                {{ fosterDetail.city || '暂无城市信息' }}
              </el-descriptions-item>
              <el-descriptions-item label="所在区县" class="desc-item">
                {{ fosterDetail.district || '暂无区县信息' }}
              </el-descriptions-item>
              <el-descriptions-item label="详细地址" class="desc-item">
                 {{ fosterDetail.detailAddress || '暂无详细地址' }}
              </el-descriptions-item>
              
              <!-- 第四行：宠物类型+描述 -->
              <el-descriptions-item label="可接待宠物类型" class="desc-item">
                <el-tag v-for="type in (fosterDetail.petTypes || [])" :key="type" size="small" class="pet-tag">
                  {{ getPetIcon(type) }} {{ type }}
                </el-tag>
                <span v-if="!fosterDetail.petTypes || fosterDetail.petTypes.length === 0">暂无指定可接待宠物类型</span>
              </el-descriptions-item>
              <el-descriptions-item label="寄养方描述" class="desc-item desc-desc">
                {{ fosterDetail.description || '暂无寄养方介绍哦～' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>

          <!-- 右侧审核操作区（仅待审核显示） -->
          <el-col :span="8" v-if="fosterDetail.status === '待审核'">
            <div class="audit-actions">
              <h3>✏️ 审核操作</h3>
              <el-button 
                type="primary" 
                size="large" 
                class="pass-btn"
                @click="handleAudit('通过')"
                :loading="auditing"
              >
                ✅ 审核通过
              </el-button>
              <el-button 
                type="danger" 
                size="large" 
                class="reject-btn"
                @click="handleAudit('拒绝')"
                :loading="auditing"
              >
                ❌ 审核拒绝
              </el-button>
            </div>
          </el-col>
        </el-row>

        <!-- 环境照片（单独大区域） -->
        <div class="photos-section" v-if="fosterDetail.environmentPhotos && envPhotosList.length > 0">
          <h3 class="section-title">🖼️ 环境照片</h3>
          <el-image-viewer
            v-if="showEnvViewer"
            :url-list="envPhotosList"
            @close="showEnvViewer = false"
          />
          <div class="photos-grid">
            <div 
              class="photo-item" 
              v-for="(img, index) in envPhotosList" 
              :key="index"
              @click="showEnvViewer = true"
            >
              <el-image 
                :src="img" 
                fit="cover" 
                :preview-src-list="envPhotosList"
                alt="环境照片"
                class="photo-img"
              />
            </div>
          </div>
        </div>
        <!-- 无环境照片提示 -->
        <div class="no-photo-tip" v-if="fosterDetail.environmentPhotos && envPhotosList.length === 0">
          📸 暂无环境照片
        </div>

        <!-- 资质照片（单独大区域） -->
        <div class="photos-section" v-if="fosterDetail.qualificationPhotos && qualPhotosList.length > 0">
          <h3 class="section-title">📄 资质照片</h3>
          <el-image-viewer
            v-if="showQualViewer"
            :url-list="qualPhotosList"
            @close="showQualViewer = false"
          />
          <div class="photos-grid">
            <div 
              class="photo-item" 
              v-for="(img, index) in qualPhotosList" 
              :key="index"
              @click="showQualViewer = true"
            >
              <el-image 
                :src="img" 
                fit="cover" 
                :preview-src-list="qualPhotosList"
                alt="资质照片"
                class="photo-img"
              />
            </div>
          </div>
        </div>
        <!-- 无资质照片提示 -->
        <div class="no-photo-tip" v-if="fosterDetail.qualificationPhotos && qualPhotosList.length === 0">
          📃 暂无资质照片
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入你的接口函数
import { getFosterDetail, checkFosterInfo } from '@/api/admin/foster'
// 导入类型定义
import type { FosterPron } from '@/api/admin/foster'

// 路由相关
const route = useRoute()
const router = useRouter()

// 状态管理
const fosterDetail = ref<FosterPron>({} as FosterPron) // 寄养方详情
const auditing = ref(false) // 审核按钮加载状态
const showEnvViewer = ref(false) // 环境照片预览器
const showQualViewer = ref(false) // 资质照片预览器


const getPetIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    猫: '🐱',
    狗: '🐶',
    兔子: '🐰',
    魚: '🐟',
    鸟: '🐤',
    其他: '🐾'
  }
  return iconMap[type] || '🐾'
}

// 处理图片路径（接口返回的是JSON字符串，需要解析）

// const envPhotosList= computed(() => {
//   if (!fosterDetail.value.environmentPhotos) return []
//   // 将字符串按逗号分割，并去除空格
//   return fosterDetail.value.environmentPhotos
//     .split(',')
//     .map(url => url.trim())
//     .filter(url => url.length > 0)
// })

// const qualPhotosList = computed(() => {
//   if (!fosterDetail.value.qualificationPhotos) return []
//   return fosterDetail.value.qualificationPhotos
//     .split(',')
//     .map(url => url.trim())
//     .filter(url => url.length > 0)
// })
// 处理图片路径：兼容带引号、中英文逗号、空格的情况
const parsePhotoUrls = (photoStr: string | undefined) => {
  if (!photoStr) return [];
  // 步骤1：去除字符串前后的引号（如果有）
  const trimmedStr = photoStr.replace(/^["']|["']$/g, '').trim();
  // 步骤2：按“中文逗号、英文逗号、空格”拆分（兼容多种分隔符）
  return trimmedStr
    .split(/[,，\s]+/) // 匹配英文逗号、中文逗号、任意空格
    .map(url => url.trim()) // 去除每个URL的前后空格
    .filter(url => url.startsWith('http')); // 只保留有效的HTTP开头URL
};

// 环境照片解析
const envPhotosList = computed(() => {
  return parsePhotoUrls(fosterDetail.value.environmentPhotos);
});

// 资质照片解析（复用同一个函数）
const qualPhotosList = computed(() => {
  return parsePhotoUrls(fosterDetail.value.qualificationPhotos);
});
// 状态文本和样式
const statusText = computed(() => {

  switch (fosterDetail.value.status) {
    case '待审核':
      return '⏳ 待审核'
    case '已审核':
      return '✅ 已通过'
    case '已拒绝':
      return '❌ 已拒绝'
    default:
      return fosterDetail.value.status || '❓ 未知状态'
  }
})

const statusClass = computed(() => {
  switch (fosterDetail.value.status) {
    case '待审核':
      return 'status-pending'
    case '已通过':
      return 'status-passed'
    case '已拒绝':
      return 'status-rejected'
    default:
      return ''
  }
})

// 获取寄养方详情
const getDetail = async () => {
  try {
    // 从路由参数获取id
    const id = Number(route.params.id)
    if (!id) {
      ElMessage.error('无效的寄养方ID')
      router.push('/admin/foster')
      return
    }
    const res = await getFosterDetail(id)
    fosterDetail.value = res.data
  
  } catch (error) {
    console.error('获取寄养方详情失败:', error)
    ElMessage.error('获取寄养方详情失败，请重试')
  }
}

// 处理审核操作
const handleAudit = async (action: '通过' | '拒绝') => {
  const id = fosterDetail.value.id
  if (!id) return

  // 二次确认
  try {
    await ElMessageBox.confirm(
      `确定要${action}该寄养方的审核吗？`,
      '审核确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: action === '通过' ? 'warning' : 'error'
      }
    )

    auditing.value = true
    // 调用审核接口（status字段根据你的后端定义调整，比如'passed'/'rejected'）
    const status = action === '通过' ? 1 : 2
    const res = await checkFosterInfo(id, status)
    
    if (res.code === 0) {
      ElMessage.success(`审核${action}成功`)
      // 刷新详情或返回列表
      getDetail() // 刷新当前详情
    router.push('/admin/foster')
    } else {
      ElMessage.error(res.msg || `审核${action}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') { // 排除用户取消的情况
      console.error(`审核${action}失败:`, error)
      
    }
  } finally {
    auditing.value = false
  }
}

// 页面挂载时获取详情
onMounted(() => {
  getDetail()
})
</script>

<style scoped>
/* 全局容器 */
.foster-detail-container {
  padding: 20px;
  background: #fff9f2;
  min-height: 100vh;
  font-family: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif;
}
/* :deep(.activeBread){
  color: #4a3322 !important;
  font-size: 16px;
} */
:deep(.el-breadcrumb__inner){
      font-weight: 900 !important;
    font-size: 14.5px;
    color: #5f4b3c !important;
}
/* 面包屑 */
.breadcrumb {
  margin-bottom: 20px;
}
:deep(.el-breadcrumb) {
  font-size: 14px;
  color: #4a3322;
}
:deep(.el-breadcrumb a) {
  font-weight: 450 !important;
  color: #666;
  text-decoration: none;
}
:deep(.el-breadcrumb a:hover) {
  color: #4a3322;
  font-weight: 950 !important;
}

/* 详情卡片 */
.detail-card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0e9f2;
}

/* 标题区域 */
.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6f4e37;
}
.decor-icon {
  font-size: 20px;
}

/* 状态标签 */
.status-tag {
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 50px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.status-pending {
  background: linear-gradient(120deg, #fff7e6 0%, #fff3cd 100%);
  color: #ff9f1c;
  border: 1px solid #ffe8a3;
}
.status-passed {
  background: linear-gradient(120deg, #e8f8f5 0%, #d4edda 100%);
  color: #00b42a;
  border: 1px solid #b3e6be;
}
.status-rejected {
  background: linear-gradient(120deg, #fff2f0 0%, #f8d7da 100%);
  color: #f53f3f;
  border: 1px solid #f1b0b7;
}

/* 分割线 */
:deep(.el-divider) {
  margin: 15px 0 20px;
}
.divider-text {
  font-size: 16px;
  color: #917fb3;
  font-weight: 500;
}

/* 信息行 */
.info-row {
  margin-top: 20px;
}

/* 描述列表 */
.desc-container {
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #f0e9f2;
}
:deep(.el-descriptions__header) {
  background: linear-gradient(120deg, #dbf4ee 0%, #fff8dc 100%);
  color: #6f4e37;
  font-weight: 600;
  padding: 12px 20px;
  border-bottom: 1px solid #f0e9f2;
}
:deep(.el-descriptions-item__label) {
  background-color: #faf6fb;
  color: #917fb3;
  font-weight: 500;
  width: 120px; /* 固定标签宽度，排版更整齐 */
  padding: 15px 20px;
}
.desc-item {
  padding: 15px 20px;
  color: #555;
  font-size: 14px;
  border-bottom: 1px solid #f9f0fb;
}
/* 描述字段单独样式（换行展示） */
.desc-desc {
  line-height: 1.6;
  white-space: pre-wrap; /* 保留换行 */
}

/* 宠物标签 */
.pet-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 50px;
  background: #f9f0fb;
  color: #6f4e37;
  border: 1px solid #e8d5f2;
  padding: 4px 12px;
}

/* 审核操作区 */
.audit-actions {
  background: linear-gradient(120deg, #f9f0fb 0%, #f5e6f7 100%);
  padding: 25px 20px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid #f0e9f2;
}
.audit-actions h3 {
  margin-bottom: 25px;
  font-size: 16px;
  color: #6f4e37;
  font-weight: 600;
}
.pass-btn, .reject-btn {
  width: 100%;
  margin-bottom: 15px;
  border-radius: 50px;
  padding: 12px 0;
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
:deep(.pass-btn) {
  background: linear-gradient(120deg, #9decba 0%, #22c55e 100%);
}
:deep(.reject-btn) {
  background: linear-gradient(120deg, #f2acac 0%, #ef4444 100%);
  margin-left:0px;
}

/* 照片区域 */
.photos-section {
  margin-top: 35px;
}
.no-photo-tip {
  margin-top: 35px;
  text-align: center;
  font-size: 16px;
  color: #999;
  padding: 30px;
  background: #faf6fb;
  border-radius: 15px;
  border: 1px dashed #e8d5f2;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #6f4e37;
  border-left: 4px solid #917fb3;
  padding-left: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 照片网格 */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.photo-item {
  height: 160px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid #f0e9f2;
}
.photo-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.photo-img {
  width: 100%;
  height: 100%;
}

/* 适配小屏幕 */
@media (max-width: 768px) {
  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  .photo-item {
    height: 120px;
  }
  :deep(.el-descriptions-item__label) {
    width: 100px;
  }
}
</style>