<template>
  <el-dialog
    v-model="dialogVisible"
    width="700px"
    :before-close="handleClose"
    :z-index="2000"
    class="detail-dialog"
  
  >
    <div v-loading="loading" class="dialog-content">
      <el-form
        v-if="userDetail"
        :model="userDetail"
        label-width="120px" 
        label-position="left"
        class="detail-form"
      >
        <div class="form-header">
          <h3>用户认证信息</h3>
        </div>

        <!-- 真实姓名（Label前加用户图标） -->
        <el-form-item class="warm-form-item">
          <template #label>
            <div class="label-wrapper">
              <el-icon class="label-icon"><User /></el-icon>
              <span>真实姓名:</span>
            </div>
          </template>
          <span class="info-value">{{ userDetail.realName }}</span>
        </el-form-item>

        <!-- 身份证号（Label前加证件图标） -->
        <el-form-item class="warm-form-item">
          <template #label>
            <div class="label-wrapper">
              <el-icon class="label-icon"><Notebook /></el-icon>
              <span>身份证号:</span>
            </div>
          </template>
          <span class="info-value">{{ userDetail.idCard }}</span>
        </el-form-item>

        <!-- 性别（Label前加性别图标） -->
        <el-form-item class="warm-form-item">
          <template #label>
            <div class="label-wrapper">
              <el-icon class="label-icon"><UserFilled /></el-icon>
              <span>性别:</span>
            </div>
          </template>
          <span class="info-value">{{ formatGender(userDetail.gender) }}</span>
        </el-form-item>

        <!-- 生日（Label前加日历图标） -->
        <el-form-item class="warm-form-item">
          <template #label>
            <div class="label-wrapper">
              <el-icon class="label-icon"><Calendar /></el-icon>
              <span>生日:</span>
            </div>
          </template>
          <span class="info-value">{{ userDetail.birthday }}</span>
        </el-form-item>

        <!-- 地址（Label前加位置图标） -->
        <el-form-item class="warm-form-item">
          <template #label>
            <div class="label-wrapper">
              <el-icon class="label-icon"><Location /></el-icon>
              <span>地址:</span>
            </div>
          </template>
          <span class="info-value">{{ userDetail.address }}</span>
        </el-form-item>

      
        <el-form-item class="warm-form-item">
          <template #label>
            <div class="label-wrapper">
              <el-icon class="label-icon">
                <template v-if="userDetail.status === '审核通过'">
                  <CircleCheckFilled style="color: #52c41a;" />
                </template>
                <template v-else-if="userDetail.status === '审核未通过'">
                  <CircleCloseFilled style="color: #ff4d4f;" />
                </template>
                <template v-else>
                  <Clock style="color: #faad14;" />
                </template>
              </el-icon>
              <span>认证状态:</span>
            </div>
          </template>
          <el-tag :type="getStatusType(userDetail.status)" class="status-tag">
            {{ userDetail.status }}
          </el-tag>
        </el-form-item>
         
          <el-form-item class="warm-form-item">
          <template #label>
            <div class="label-wrapper">
              <el-icon class="label-icon"><Picture /></el-icon>
              <span>认证材料:</span>
            </div>
          </template>
          <div class="image-preview-container">
            <el-image
              v-for="(url, index) in pictureUrlList"
              :key="`img-${index}-${url}`"
              :src="url"
              class="preview-image"
              fit="cover"
              :lazy="false"
              :preview-disabled="true" 
              @click="handleImagePreview(index)" 
              @error="(e) => { console.log('图片加载失败:', e); }"
            />
          </div>
        </el-form-item>
      </el-form>
      <div v-else class="empty-tip">暂无用户认证信息</div>
    </div>
    
    <!-- footer 部分不变 -->
    <template #footer >
      <div class="dialog-footer">
        <el-button 
          type="success" 
          @click="approveUser" 
          :loading="approvalLoading"
          v-if="shouldShowApprovalButtons"
          class="approve-btn"
        >
          通过认证
        </el-button>
        <el-button 
          type="danger" 
          @click="rejectUser" 
          :loading="rejectionLoading"
          v-if="shouldShowApprovalButtons"
          class="reject-btn"
        >
          认证失败
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, shallowRef, nextTick } from 'vue'
import { ElImageViewer } from 'element-plus'  // 引入预览组件
import { createVNode, render } from 'vue'     // 引入手动渲染API
import { type UserAuthDetail } from '@/api/admin/user'

// 新增：预览相关状态
const previewViewer = ref<HTMLElement | null>(null)  // 预览层DOM
const previewVisible = ref(false)                   // 预览显示状态

// 手动触发图片预览
const handleImagePreview = async (index: number) => {
  // 先移除旧的预览层
  if (previewViewer.value) {
    render(null, previewViewer.value)
    previewViewer.value.remove()
    previewViewer.value = null
  }

  await nextTick()

  // 创建预览层容器
  const container = document.createElement('div')
  container.style.zIndex = '9999'
  document.body.appendChild(container)

  // 渲染预览组件
  const vnode = createVNode(ElImageViewer, {
    urlList: pictureUrlList.value,    // 图片列表
    zIndex: 9999,
    initialIndex: index,              // 初始索引（当前点击的图片）
    onClose: () => {                  // 关闭回调
      if (previewViewer.value) {
        render(null, previewViewer.value)
        previewViewer.value.remove()
        previewViewer.value = null
      }
      previewVisible.value = false
    },
   
  })

  render(vnode, container)
  previewViewer.value = container
  previewVisible.value = true
}

// 原有逻辑不变
const handleClose = () => {
  // 关闭预览层
  if (previewViewer.value) {
    render(null, previewViewer.value)
    previewViewer.value.remove()
    previewViewer.value = null
  }
  emit('update:visible', false)
  emit('close')
}

const cachedPictureList = shallowRef<string[]>([])
const props = defineProps<{
  visible: boolean
  userDetail: UserAuthDetail | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
  (e: 'approve',id:number): void
  (e: 'reject',id:number): void
}>()

const dialogVisible = ref(props.visible)
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

watch(dialogVisible, (newVal) => {
  if (!newVal) {
    // 关闭时清理预览层
    if (previewViewer.value) {
      render(null, previewViewer.value)
      previewViewer.value.remove()
      previewViewer.value = null
    }
    emit('update:visible', false)
    emit('close')
  }
})

const approvalLoading = ref(false)
const rejectionLoading = ref(false)

const shouldShowApprovalButtons = computed(() => {
  return props.userDetail && props.userDetail.status === '待审核'
})

const formatGender = (gender: number | undefined) => {
  if (gender === undefined || gender === null) return '未知'
  if (gender === 1) return '男'
  if (gender === 2) return '女'
  return '未知'
}

const approveUser = async () => {
   if (props.userDetail) 
    emit('approve',props.userDetail.id)
 
}

const getStatusType = (status: string) => {
  switch (status) {
    case '审核通过':
      return 'success'
    case '审核未通过':
      return 'danger'
    default:
      return 'warning'
  }
}

watch(
  () => props.userDetail?.pictureUrl,
  (newUrl, oldUrl) => {
    const timer = setTimeout(() => {
      if (newUrl === oldUrl) return
      if (!newUrl) {
        cachedPictureList.value = []
        return
      }

      let list: string[] = []
      try {
        let parsedUrl: any = newUrl
        if (typeof parsedUrl === 'string') {
          const cleanedStr = parsedUrl.replace(/^["']|["']$/g, '').replace(/'/g, '"')
          parsedUrl = JSON.parse(cleanedStr)
        }
        if (Array.isArray(parsedUrl)) {
          list = parsedUrl
        } else if (typeof parsedUrl === 'string') {
          list = parsedUrl.split(',').map(url => url.trim()).filter(Boolean)
        }
      } catch (e) {
        console.error('图片URL解析失败：', e)
        list = (newUrl as string).split(',').map(url => url.trim()).filter(Boolean)
      }

      const finalList = Array.from(new Set(list)).filter(url => {
        return url && (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:image'))
      })
      cachedPictureList.value = finalList
    }, 100)

    return () => clearTimeout(timer)
  },
  { immediate: true, deep: false }
)

const pictureUrlList = computed(() => cachedPictureList.value)

const rejectUser = async () => {
  if (props.userDetail){
    emit('reject',props.userDetail.id)
  }
 
}
</script>

<style scoped>

:deep(.label-wrapper) {
  display: flex;
  align-items: center;
  color: #ff8a65;
  font-weight: 500;
  font-size: 14px;
}
:deep(.label-icon) {
  margin-right: 6px;
  font-size: 16px;
  color: #ff8a65;
}


.detail-dialog {
  border-radius: 12px !important;
  overflow: hidden;
}

.dialog-content {
  background: linear-gradient(135deg, #fffaf0 0%, #fff 100%);
  border-radius: 8px;
  padding: 20px;
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.form-header h3 {
  color: #ff8a65;
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.warm-form-item {
  margin-bottom: 18px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.warm-form-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.warm-form-item :deep(.el-form-item__label) {
  color: #ff8a65;
  font-weight: 500;
  font-size: 14px;
}

.info-value {
  color: #555;
  font-size: 15px;
  font-weight: 500;
}

.status-tag {
  font-weight: 500;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; 
  min-height: 80px; 
  padding: 10px 0;
}

.preview-image {
  width: 400px; 
  height: 200px; 
  cursor: pointer;
  border-radius: 8px;
  position: relative; 
}

:deep(.el-image-viewer) {
  z-index: 9999 !important; 
}

:deep(.el-image__inner) {
  display: block; 
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.empty-tip {
  text-align: center;
  padding: 60px 0;
  color: #ff8a65;
  font-size: 16px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.dialog-footer {
  margin-bottom: 10px;
  justify-content: space-around;
  display: flex;
  text-align: center;
  padding-top:0px !important;
}

.approve-btn {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.reject-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

/* 新增：预览层样式兼容 */
:deep(.el-image-viewer__wrapper) {
  background-color: rgba(0, 0, 0, 0.9) !important;
}
</style>