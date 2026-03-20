<template>
  <div class="file-upload-wrapper">
    <!-- 上传区域（大图二样式） -->
    <div
      class="upload-area border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
      :class="{ 'opacity-50': disabled || isMaxReached }"
      @click="handleUploadClick"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <!-- 拖拽状态提示 -->
      <div
        v-if="isDragOver"
        class="drag-overlay absolute inset-0 bg-blue-100 rounded-lg flex items-center justify-center"
      >
        <div class="text-blue-600">
          <i class="fa fa-cloud-upload text-4xl mb-2"></i>
          <p>松开上传文件</p>
        </div>
      </div>

      <!-- 默认上传提示 -->
      <div v-else class="upload-prompt">
        <i class="fa fa-cloud-upload text-5xl text-blue-400 mb-4"></i>
        <p class="text-gray-600 mb-2">将文件拖到此处，或点击上传</p>
        <p class="text-xs text-gray-400">
          支持{{ acceptDescription || 'JPG、PNG格式' }}，单个文件不超过{{ maxSizeMB }}MB
          <template v-if="maxCount > 1">，最多{{ maxCount }}个文件</template>
        </p>
      </div>
    </div>

    <!-- 已上传文件预览区（底部列表样式） -->
    <div v-if="fileList.length > 0" class="preview-section mt-4">
      <p class="text-sm text-gray-600 mb-3">已上传文件：</p>
      <div class="preview-list flex flex-wrap gap-3">
        <div
          v-for="(file, index) in fileList"
          :key="index"
          class="preview-item relative bg-white rounded-md shadow-sm overflow-hidden border border-gray-100"
        >
          <!-- 图片预览 -->
          <img
            v-if="file.isImage"
            :src="file.url"
            :alt="file.name"
            class="w-24 h-24 object-cover"
          />

          <!-- 非图片文件图标 -->
          <div v-else class="w-24 h-24 bg-gray-50 flex items-center justify-center">
            <i class="fa fa-file-text-o text-3xl text-gray-400"></i>
          </div>

          <!-- 文件名（底部显示） -->
          <div v-if="!file.isImage" class="absolute bottom-0 left-0 right-0 bg-gray-50 p-1">
            <p class="text-xs text-gray-600 truncate text-center">{{ file.name }}</p>
          </div>

          <!-- 删除按钮（悬停显示） -->
          <button
            type="button"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
            @click.stop="removeFile(index)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUpload } from '@/composables/use-upload'
import { validateFile } from '@/utils/upload'
import type { FileItem } from '@/types/upload'
interface Props {
  accept?: string
  maxSizeMB?: number
  maxCount?: number
  acceptDescription?: string
  disabled?: boolean
  uploadUrl?: string
  chunkSizeMB?: number
  chunkThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSizeMB: 5,
  maxCount: 99,
  disabled: false,
  uploadUrl: '/server/api/file/upload',
  chunkThreshold: 5,
})

const emit = defineEmits<{
  'file-change': [files: FileItem[]]
  'upload-success': [urls: string[]]
  'upload-progress': [progress: number]
}>()

const { isUploading, uploadProgress, fileList, uploadFiles, removeFile } = useUpload({
  accept: props.accept,
  maxSizeMB: props.maxSizeMB,
  chunkThreshold: props.chunkThreshold * 1024 * 1024, // 转成字节
})

watch(uploadProgress, (progress) => {
  emit('upload-progress', progress)
})
// 响应式数据
// const fileList = ref<FileItem[]>([])
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

// 计算属性
const isMaxReached = computed(() => fileList.value.length >= props.maxCount)

// 创建隐藏的file input
const createFileInput = () => {
  if (fileInput.value) return fileInput.value
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = props.accept
  input.multiple = props.maxCount > 1
  input.style.display = 'none'
  input.onchange = handleFileSelect
  document.body.appendChild(input)
  fileInput.value = input
  return input
}

// 处理上传点击
const handleUploadClick = () => {
  if (props.disabled || isMaxReached.value) return
  const input = fileInput.value || createFileInput()
  input.click()
}

// 处理文件选择
const handleFileSelect = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)
  const validFiles = files
    .filter((file) => {
      const { isValid, message } = validateFile(file, props.accept, props.maxSizeMB)
      if (!isValid) ElMessage.error(message)
      return isValid
    })
    .slice(0, props.maxCount - fileList.value.length)

  if (validFiles.length === 0) return

  try {
    const urls = await uploadFiles(validFiles)
    emit('file-change', fileList.value)
    emit('upload-success', urls)
  } catch (error) {
    console.error('上传失败：', error)
  }

  input.value = ''
}
// const handleRemoveFile = (index: number) => {
//   if (props.disabled || isUploading.value) return
//   removeFileFromUseUpload(index) // 调用 useUpload 的删除方法
//   emit('file-change', fileList.value) // 删除后同步触发文件变化事件
// }
// 处理拖拽文件
const handleDrop = async (e: DragEvent) => {
  isDragOver.value = false
  if (props.disabled || isMaxReached.value) return

  const files = Array.from(e.dataTransfer?.files || [])
  const validFiles = files
    .filter((file) => {
      const { isValid, message } = validateFile(file, props.accept, props.maxSizeMB)
      if (!isValid) ElMessage.error(message)
      return isValid
    })
    .slice(0, props.maxCount - fileList.value.length)

  if (validFiles.length === 0) return

  try {
    const urls = await uploadFiles(validFiles)
    emit('file-change', fileList.value)
    emit('upload-success', urls)
  } catch (error) {
    console.error('上传失败：', error)
  }
}
onUnmounted(() => {
  if (fileInput.value) {
    document.body.removeChild(fileInput.value)
    fileInput.value = null
  }
})
defineExpose({
  removeFile,
  fileList,
  isUploading,
  uploadProgress,
})
</script>
<style scoped>
.file-upload-wrapper {
  position: relative;
}

.upload-area {
  position: relative;
  min-height: 200px;
}

.drag-overlay {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
}

.upload-prompt {
  position: relative;
  z-index: 8;
}

.preview-item {
  transition: transform 0.2s;
}

.preview-item:hover {
  transform: translateY(-2px);
}

.preview-item:hover button {
  opacity: 1;
}

.file-preview {
  max-width: 200px;
  margin: 0 auto;
}
</style>
