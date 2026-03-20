<template>
  <div class="form-section">
    <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
      <i class="fa fa-image mr-2 text-yellow-500"></i>商品图片
    </h3>

    <!-- 主图上传 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-yellow-800 mb-2">
        商品主图 <span class="text-red-500">*</span>
      </label>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-shrink-0">
          <div
            class="relative border-2 border-dashed border-yellow-200 rounded-lg p-3 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group w-48 h-48 flex items-center justify-center"
          >
            <!-- 主图 -->
            <div v-if="!mainImageUrl" class="space-y-1">
              <i
                class="fa fa-cloud-upload text-xl text-yellow-400 group-hover:text-yellow-600 transition-colors"
              ></i>
              <p class="text-xs text-yellow-700">上传主图</p>
            </div>
            <div v-else class="relative w-full h-full overflow-hidden rounded">
              <img :src="mainImageUrl" alt="主图预览" class="w-full h-full object-cover rounded" />
              <button
                type="button"
                @click.stop="removeMainImage"
                class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all"
                style="z-index: 100;"
                >
                <i class="fa fa-times text-xs"></i>
              </button>
            </div>

            <input
              ref="mainImageInput"
              type="file"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              @change="handleMainImageUpload"
              @click.stop
            />
          </div>
        </div>

        <div class="flex-grow">
          <p class="text-sm text-yellow-700 mb-2">上传要求：</p>
          <ul class="text-xs text-yellow-600 space-y-1">
            <li>• 支持 JPG、PNG 格式</li>
            <li>• 图片大小不超过 2MB</li>
            <li>• 建议尺寸 800×800 像素以上</li>
            <li>• 第一张图片将作为商品主图</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 多图上传 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-yellow-800 mb-2"> 商品详情图 </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-if="detailImages.length < 5"
          class="relative border-2 border-dashed border-yellow-200 rounded-lg p-3 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group aspect-square flex items-center justify-center"
        >
          <div class="space-y-1">
            <i
              class="fa fa-plus text-xl text-yellow-400 group-hover:text-yellow-600 transition-colors"
            ></i>
            <p class="text-xs text-yellow-700">添加图片</p>
          </div>

          <input
            ref="detailImageInput"
            type="file"
            accept="image/*"
            multiple
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            @change="handleDetailImagesUpload"
            @click.stop
          />
        </div>

        <div
          v-for="(image, index) in detailImages"
          :key="`detail-img-${index}-${image.url.slice(-8)}`"
          class="relative border border-yellow-200 rounded-lg overflow-hidden w-full aspect-square"
        >
          <img :src="image.url" alt="详情图预览" class="w-full h-full object-cover" />
          <button
            type="button"
            @click.stop="removeDetailImage(index)"
            class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all"
          >
            <i class="fa fa-times text-xs"></i>
          </button>
        </div>
      </div>
      <p class="text-xs text-yellow-600 mt-2">
        最多可上传5张图片，已上传{{ detailImages.length }}张
      </p>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-yellow-800 mb-2"> 商品视频 </label>
      <div class="flex items-center gap-4">
        <div
          class="relative border-2 border-dashed border-yellow-200 rounded-lg p-3 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group w-48 h-24 flex items-center justify-center"
        >
          <div v-if="!videoUrl" class="space-y-1">
            <i
              class="fa fa-video-camera text-xl text-yellow-400 group-hover:text-yellow-600 transition-colors"
            ></i>
            <p class="text-xs text-yellow-700">上传视频</p>
          </div>
          <div
            v-else
            class="relative w-full h-full overflow-hidden rounded flex items-center justify-center"
          >
            <video :src="videoUrl" controls class="w-full h-full object-contain"></video>
            <button
              type="button"
              @click.stop="removeVideo"
              class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all"
            >
              <i class="fa fa-times text-xs"></i>
            </button>
          </div>
          <input
            ref="videoInput"
            type="file"
            accept="video/mp4"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            @change="handleVideoUpload"
            @click.stop
          />
        </div>
        <div v-if="videoUrl" class="text-sm text-yellow-700">
          <p>已上传视频</p>
          <p class="text-xs text-yellow-600">点击播放按钮预览</p>
        </div>
      </div>
      <p class="text-xs text-yellow-600 mt-2">支持 MP4 格式，大小不超过 10MB</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadWithChunk } from '../../../../utils/chunk-uploads'; // 对应你的chunk-upload.ts路径


const props = defineProps<{
  mainImage: string
  imagesList: { name: string; url: string; isImage: boolean }[]
  videoUrl: string
}>()

const emit = defineEmits<{
  (e: 'update:mainImage', value: string): void
  (e: 'update:imagesList', value: { name: string; url: string; isImage: boolean }[]): void
  (e: 'update:videoUrl', value: string): void
}>()

const mainImageUrl = ref(props.mainImage)
const detailImages = ref(props.imagesList)
const videoUrl = ref(props.videoUrl)

// 监听父组件数据变化
watch(() => props.mainImage, (newVal) => {
  mainImageUrl.value = newVal
})
watch(() => props.imagesList, (newVal) => {
  detailImages.value = newVal
})
watch(() => props.videoUrl, (newVal) => {
  videoUrl.value = newVal
})

const uploadConfig = {
  mainImage: {
    accept: 'image/*',
    maxSizeMB: 1024,
    uploadUrl: '/server/api/file/upload',
  },
  detailImage: {
    accept: 'image/*',
    maxSizeMB: 1024,
    maxCount: 5,
    uploadUrl: '/server/api/file/upload',
  },
  video: {
    accept: 'video/mp4',
    maxSizeMB: 1024,
    uploadUrl: '/server/api/file/upload',
  },
}


const handleMainImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    // 调用chunk-upload.ts的uploadWithChunk
    const url = await uploadWithChunk(file, uploadConfig.mainImage);
    mainImageUrl.value = url
    emit('update:mainImage', url)
    ElMessage.success('主图上传成功')
  } catch (error) {
    ElMessage.error((error as Error).message || '主图上传失败')
  } finally {
    target.value = ''
  }
}

const removeMainImage = () => {
  mainImageUrl.value = ''
  emit('update:mainImage', '')
  ElMessage.info('主图已移除')
}

const handleDetailImagesUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const remaining = uploadConfig.detailImage.maxCount - detailImages.value.length
  if (files.length > remaining) {
    ElMessage.warning(`最多只能上传${uploadConfig.detailImage.maxCount}张图片，还可上传${remaining}张`)
    target.value = ''
    return
  }

  const fileList = Array.from(files)
  const newImages = [...detailImages.value]
  let successCount = 0

  ElMessage.info(`开始上传${fileList.length}张图片，请稍候...`)

  await Promise.all(
    fileList.map(async (file) => {
      try {
        // 调用chunk-upload.ts的uploadWithChunk
        const url = await uploadWithChunk(file, uploadConfig.detailImage);
        newImages.push({
          name: file.name,
          url,
          isImage: file.type.startsWith('image/'),
        })
        successCount++
      } catch (error) {
        ElMessage.error(`文件${file.name}上传失败：${(error as Error).message}`)
      }
    }),
  )

  detailImages.value = [...newImages]
  emit('update:imagesList', detailImages.value)

  if (successCount > 0) {
    ElMessage.success(`成功上传${successCount}张详情图`)
  }

  target.value = ''
}

const removeDetailImage = (index: number) => {
  const newImages = [...detailImages.value]
  newImages.splice(index, 1)
  detailImages.value = newImages
  emit('update:imagesList', newImages)
  ElMessage.info('详情图已移除')
}

const handleVideoUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    // 调用chunk-upload.ts的uploadWithChunk
    const url = await uploadWithChunk(file, uploadConfig.video);
    videoUrl.value = url
    emit('update:videoUrl', url)
    ElMessage.success('视频上传成功')
  } catch (error) {
    ElMessage.error((error as Error).message || '视频上传失败')
  } finally {
    target.value = ''
  }
}

const removeVideo = () => {
  videoUrl.value = ''
  emit('update:videoUrl', '')
  ElMessage.info('视频已移除')
}
</script>

<style scoped>
.form-section {
  padding: 10px 0;
}

video {
  outline: none;
  border: none;
}

.group:hover {
  background-color: #fff9e6;
}

.aspect-square:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

input[type='file'] {
  z-index: 10;
}
</style>
