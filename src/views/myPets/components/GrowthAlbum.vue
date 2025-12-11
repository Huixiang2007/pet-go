<template>
  <div class="growth-album">

    <div class="growth-records">

      <div v-for="(group, age) in groupedGrowthRecords" :key="age" class="growth-record cute-card">
        <div class="record-header">
          <h4 class="record-age">🎯 {{ age }}</h4>
        </div>
        <div class="photos">
          <h5>📷 成长瞬间</h5>
          <div class="photos-scroll-container">
            <div class="photos-horizontal-grid">
              <div v-for="(photo, pIndex) in group" :key="pIndex" class="photo-card" @click="viewPhoto(age, pIndex)">

                <div class="photo-card-front">
                  <img :src="photo.src" :alt="`${age}的照片`" class="photo-img" />

                </div>

                <div class="photo-card-back">
                  <div class="back-content">
                    <el-button type="text" icon="Delete" class="remove-preview"
                      @click.stop="deletePetGrowthRecords(photo.id)">
                    </el-button>
                    <div class="photo-date">📅 {{ formatDate(photo.date) }}</div>
                    <div class="photo-desc">{{ photo.description || '无描述' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有记录时的提示 -->
    <div v-if="Object.keys(groupedGrowthRecords).length === 0" class="empty-state">
      <div class="empty-icon">📸</div>
      <h3>还没有成长记录</h3>
      <p>记录宝贝的成长历程，留下美好回忆</p>
    </div>

    <!-- 添加记录按钮 -->
    <div class="add-record-btn">
      <el-button type="primary" icon="Plus" @click="openAddRecordDialog" class="add-btn cute-btn">
        添加成长记录
      </el-button>
    </div>

    <!-- 添加成长记录弹窗 -->
    <el-dialog v-model="addRecordDialogVisible" title="✨ 添加成长记录" width="35%" class="cute-dialog growth-dialog"
      :close-on-click-modal="false">
      <el-form :model="newGrowthRecord" class="record-form">
        <!-- 年龄段输入 -->
        <el-form-item label="年龄段" prop="age" required>
          <el-input v-model="newGrowthRecord.age" placeholder="如：2个月、1岁、3岁半" class="age-input" maxlength="10"
            show-word-limit />
        </el-form-item>

        <!-- 图片上传区域 -->
        <el-form-item label="上传照片" prop="photos" required>
          <div class="upload-container">
            <!-- 自定义上传组件 -->
            <div class="custom-uploader" @click="triggerFileInput">
              <input type="file" ref="fileInput" class="file-input" accept="image/*" @change="handleFileUpload" />
              <div class="upload-placeholder" v-if="!uploadedPhoto.src">
                <div class="upload-icon">➕</div>
                <div class="upload-text">点击上传成长照片</div>
                <div class="upload-tip">支持jpg/png格式，单张≤5MB</div>
              </div>
              <div class="upload-preview" v-else>
                <img :src="uploadedPhoto.src" alt="预览图" class="preview-img" />

              </div>
            </div>

            <!-- 照片描述和日期 -->
            <div class="photo-info" v-if="uploadedPhoto.src">
              <el-form-item label="📝 照片描述">
                <el-input v-model="uploadedPhoto.description" placeholder="描述这张照片的故事..." type="textarea" rows="2"
                  maxlength="20" show-word-limit class="add-description" />
              </el-form-item>
              <el-form-item label="📅 拍摄日期">
                <el-date-picker v-model="uploadedPhoto.date" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                  placeholder="选择拍摄日期" class="date-picker" />
              </el-form-item>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addRecordDialogVisible = false" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="submitGrowthRecord"
          :disabled="!newGrowthRecord.age || !uploadedPhoto.src || !uploadedPhoto.date" class="submit-btn">
          确认添加
        </el-button>
      </template>
    </el-dialog>

    <!-- 图片查看器 -->
    <el-dialog v-model="photoViewerVisible" :title="`${currentPhotoAge} - 成长瞬间`" width="70%"
      class="cute-dialog photo-dialog">
      <div class="photo-viewer">
        <img :src="currentPhoto" class="viewer-image" />
        <div class="photo-detail">
          <div class="detail-date">📅 {{ formatDate(currentPhotoDate) }}</div>
          <div class="detail-desc">{{ currentPhotoDescription || '无描述' }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Pet } from '@/types/pet'
import request from '@/utils/request'
const props = defineProps<{ pet: Pet }>()

const addRecordDialogVisible = ref(false)
const photoViewerVisible = ref(false)

// 文件上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedPhoto = reactive({
  src: '',
  description: '',
  date: '' as string,
  file: null as File | null
})

// 新成长记录表单
const newGrowthRecord = reactive({
  age: '',
  src: '',
  description: '',
  date: '' as string
})

// 图片查看器状态
const currentPhotoAge = ref('')
const currentPhotoIndex = ref(0)
const currentPhoto = ref('')
const currentPhotoDescription = ref('')
const currentPhotoDate = ref('')

// 按年龄段分组成长记录
const groupedGrowthRecords = computed(() => {
  if (!props.pet.growthRecords || props.pet.growthRecords.length === 0) {
    return {}
  }
  const groups: Record<string, Array<{
    id: number
    src: string
    description: string
    date: string
  }>> = {}

  // 遍历所有记录，按年龄段分组
  props.pet.growthRecords.forEach(record => {
    const age = record.age
    if (record.photos && record.photos.length) {
      if (!groups[age]) {
        groups[age] = []
      }
      groups[age].push({
        id: record.id,
        src: record.photos[0].src,
        description: record.photos[0].description,
        date: record.photos[0].date
      })
    }
  })
  return groups
})

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 校验文件大小和格式
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('请上传图片格式文件！')
    return
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB！')
    return
  }

  try {

    const formData = new FormData()
    formData.append('file', file)
    const response = await request('/server/api/file/upload', 'POST', formData)

    // 预览图
    uploadedPhoto.src = response.data
    uploadedPhoto.file = file
    ElMessage.success('图片上传成功！')
  } catch (err) {
    ElMessage.error('图片上传失败，请重试！')
    console.error('上传失败：', err)
  }

  // 清空input值，支持重复选择同一文件
  target.value = ''
}

// 清空上传的图片
const clearUploadedPhoto = () => {
  uploadedPhoto.src = ''
  uploadedPhoto.description = ''
  uploadedPhoto.date = ''
  uploadedPhoto.file = null
}

// 打开添加记录弹窗
const openAddRecordDialog = () => {
  // 重置表单
  newGrowthRecord.age = ''
  newGrowthRecord.src = ''
  newGrowthRecord.description = ''
  newGrowthRecord.date = ''
  clearUploadedPhoto()
  addRecordDialogVisible.value = true
}

const emit = defineEmits<{
  'add-growth-records': [records: any],
  'delete-growth-records': [petId: number, id: number, type: string]
}>()

// 提交成长记录
const submitGrowthRecord = () => {
  const submitData = {
    petId: props.pet.id,
    recordType: "成长记录",
    age: newGrowthRecord.age,

    photos: [{
      src: uploadedPhoto.src,
      description: uploadedPhoto.description,
      date: uploadedPhoto.date
    }]
  }

  emit('add-growth-records', submitData)

  // 关闭弹窗并重置表单
  addRecordDialogVisible.value = false
  clearUploadedPhoto()
  newGrowthRecord.age = ''

}

// 查看照片
const viewPhoto = (age: string, index: number) => {
  const group = groupedGrowthRecords.value[age]
  if (group && group[index]) {
    currentPhotoAge.value = age
    currentPhotoIndex.value = index
    currentPhoto.value = group[index].src
    currentPhotoDescription.value = group[index].description
    currentPhotoDate.value = group[index].date
    photoViewerVisible.value = true
  }
}

// 删除记录
const deletePetGrowthRecords = (id: number) => {
  console.log(id)
  ElMessageBox.confirm(
    '确定要删除这条成长记录吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    emit('delete-growth-records', props.pet.id, id, 'growth')


  }).catch(() => {
    ElMessage.info('已取消删除')
  })

}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未设置日期'
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style scoped>
/* 整体容器 */
.growth-album {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff5f7;
  padding: 15px;
}

/* 记录列表 */
.growth-records {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 8px;
  margin-bottom: 15px;
}

/* 成长记录卡片 */
.growth-record {
  padding: 20px;
  background: linear-gradient(135deg, #fff0f5 0%, #ffe6f2 100%);
  border-radius: 16px;
  border: 2px solid #ffc2d1;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.record-age {
  color: #e63946;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.delete-btn {
  background: linear-gradient(135deg, #ff8fa3 0%, #ff6b8b 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 4px 12px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #ff6b8b 0%, #ff5277 100%);
  transform: scale(1.05);
}

.add-description {
  margin-bottom: 5px;
}

/* 照片区域 */
.photos h5 {
  color: #d62828;
  margin: 0 0 12px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 横向滚动容器 - 核心改造 */
.photos-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 8px;
  /* 给滚动条留空间 */
  /* 隐藏默认滚动条，自定义样式 */
  scrollbar-width: thin;
  scrollbar-color: #ff8fab #fff0f5;
}

/* 自定义横向滚动条样式 */
.photos-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.photos-scroll-container::-webkit-scrollbar-track {
  background: #fff0f5;
  border-radius: 3px;
}

.photos-scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #ff8fab 0%, #ff6b8b 100%);
  border-radius: 3px;
}

.photos-scroll-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #ff6b8b 0%, #ff5277 100%);
}

/* 横向照片网格 */
.photos-horizontal-grid {
  display: flex;
  gap: 12px;
  width: max-content;
  /* 宽度自适应内容，实现横向滚动 */
}

/* 3D翻转照片卡片 */
.photo-card {
  width: 120px;
  /* 固定宽度 */
  height: 120px;
  /* 固定高度 */
  border-radius: 12px;
  perspective: 1000px;
  cursor: pointer;
  flex-shrink: 0;
  /* 防止卡片被挤压 */
}

.photo-card-front,
.photo-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  transition: transform 0.6s ease;
  box-shadow: 0 3px 8px rgba(255, 105, 180, 0.2);
}

.photo-card-front {
  transform: rotateY(0deg);
  overflow: hidden;
}

.photo-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #ffd6e0 0%, #ffc2d1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.photo-card:hover .photo-card-front {
  transform: rotateY(-180deg);
}

.photo-card:hover .photo-card-back {
  transform: rotateY(0deg);
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-img {
  transform: scale(1.05);
}

.back-content {
  text-align: center;
  color: #800f2f;
}

.photo-date {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.photo-desc {
  font-size: 0.75rem;
  line-height: 1.4;
  word-break: break-all;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ff8fab;
  text-align: center;
  padding: 40px 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #e63946;
  font-size: 1.3rem;
}

.empty-state p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.95rem;
}

/* 添加按钮 */
.add-record-btn {
  padding: 10px 0;
  text-align: center;
}

.add-btn {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  padding: 10px 30px;
  box-shadow: 0 4px 10px rgba(255, 154, 158, 0.3);
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: linear-gradient(135deg, #ff6b9e 0%, #ff9a9e 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 107, 158, 0.4);
}

/* 添加记录弹窗 */
.growth-dialog {
  --el-dialog-bg-color: #fff0f5;
  --el-dialog-border-color: #ffc2d1;
}

.growth-dialog :deep(.el-overlay-dialog) {
  top: -40px;
}

.growth-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #ffdee9 0%, #ffc2d1 100%);
  padding: 15px 20px;
  border-radius: 12px 12px 0 0;
  margin: -20px -20px 20px -20px;
}

.growth-dialog :deep(.el-dialog__title) {
  color: #e63946;
  font-size: 1.1rem;
  font-weight: 600;
}

.record-form {
  padding: 10px 0;
}

.age-input {
  --el-input-bg-color: #fff5f7;
  --el-input-border-color: #ffc2d1;
  --el-input-text-color: #800f2f;
  border-radius: 8px;
}

/* 自定义上传组件 */
.upload-container {
  width: 100%;
}

.custom-uploader {
  width: 56%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.file-input {
  display: none;
}

.upload-placeholder {
  height: 200px;
  background: linear-gradient(135deg, #fff5f7 0%, #ffe6f2 100%);
  border: 2px dashed #ff8fab;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  background: linear-gradient(135deg, #ffe6f2 0%, #ffd6e0 100%);
  border-color: #ff6b8b;
}

.upload-icon {
  font-size: 2.5rem;
  color: #ff8fab;
  margin-bottom: 10px;
}

.upload-text {
  color: #e63946;
  font-size: 1rem;
  margin-bottom: 5px;
}

.upload-tip {
  color: #ff8fab;
  font-size: 0.8rem;
  opacity: 0.8;
}

.upload-preview {
  position: relative;
  height: 261px;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-preview {
  position: absolute;
  top: 1px;
  right: 2px;
  color: #fa3a6a;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-preview:hover {
  color: #fa3a6a;
  transform: scale(1.1);
}

.photo-info {
  margin-top: 15px;
  padding: 15px;
  background-color: #fff5f7;
  border-radius: 8px;
  border: 1px solid #ffc2d1;
}

.photo-info :deep(.el-input) {
  --el-input-bg-color: #fff;
  --el-input-border-color: #ffc2d1;
  border-radius: 8px;
}

.date-picker {
  --el-input-bg-color: #fff;
  --el-input-border-color: #ffc2d1;
  border-radius: 8px;
}

/* 弹窗按钮 */
.cancel-btn {
  background-color: #ffe6f2;
  border: 1px solid #ffc2d1;
  color: #ff8fab;
  border-radius: 8px;
  padding: 8px 20px;
}

.submit-btn {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 8px 25px;
  transition: all 0.3s ease;
}

.submit-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #ff6b9e 0%, #ff9a9e 100%);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #ffd6e0;
  cursor: not-allowed;
}

/* 图片查看器 */
.photo-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.photo-viewer {
  text-align: center;
}

.viewer-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.2);
  margin-bottom: 15px;
}

.photo-detail {
  text-align: center;
  color: #800f2f;
}

.detail-date {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.detail-desc {
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.9;
}

/* 纵向滚动条样式 */
.growth-records::-webkit-scrollbar {
  width: 8px;
}

.growth-records::-webkit-scrollbar-track {
  background: #fff0f5;
  border-radius: 4px;
}

.growth-records::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff8fab 0%, #ff6b8b 100%);
  border-radius: 4px;
}

.growth-records::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff6b8b 0%, #ff5277 100%);
}
</style>