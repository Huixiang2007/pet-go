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
            <input
              type="file"
              accept="image/*"
              @change="handleMainImageUpload"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div v-if="!mainImage" class="space-y-1">
              <i class="fa fa-cloud-upload text-xl text-yellow-400 group-hover:text-yellow-600 transition-colors"></i>
              <p class="text-xs text-yellow-700">上传主图</p>
            </div>
            <div v-else class="relative w-full h-full overflow-hidden rounded">
              <img
                :src="mainImage"
                alt="主图预览"
                class="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                @click.stop="removeMainImage"
                class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all"
              >
                <i class="fa fa-times text-xs"></i>
              </button>
            </div>
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
      <label class="block text-sm font-medium text-yellow-800 mb-2">
        商品详情图
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <!-- 已上传图片 -->
        <div
          v-for="(image, index) in imagesList"
          :key="index"
          class="relative border border-yellow-200 rounded-lg overflow-hidden w-full aspect-square"
        >
          <img
            :src="image"
            alt="详情图预览"
            class="w-full h-full object-cover"
          />
          <button
            type="button"
            @click="removeImage(index)"
            class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all"
          >
            <i class="fa fa-times text-xs"></i>
          </button>
        </div>

        <!-- 上传按钮 -->
        <div
          v-if="imagesList.length < 10"
          class="relative border-2 border-dashed border-yellow-200 rounded-lg p-3 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group aspect-square flex items-center justify-center"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleImagesUpload"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div class="space-y-1">
            <i class="fa fa-plus text-xl text-yellow-400 group-hover:text-yellow-600 transition-colors"></i>
            <p class="text-xs text-yellow-700">添加图片</p>
          </div>
        </div>
      </div>
      <p class="text-xs text-yellow-600 mt-2">最多可上传10张图片，已上传{{ imagesList.length }}张</p>
    </div>

    <!-- 视频上传 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-yellow-800 mb-2">
        商品视频
      </label>
      <div class="flex items-center gap-4">
        <div
          class="relative border-2 border-dashed border-yellow-200 rounded-lg p-3 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group w-48 h-24 flex items-center justify-center"
        >
          <input
            type="file"
            accept="video/*"
            @change="handleVideoUpload"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div v-if="!videoUrl" class="space-y-1">
            <i class="fa fa-video-camera text-xl text-yellow-400 group-hover:text-yellow-600 transition-colors"></i>
            <p class="text-xs text-yellow-700">上传视频</p>
          </div>
          <div v-else class="relative w-full h-full overflow-hidden rounded flex items-center justify-center">
            <i class="fa fa-play-circle text-2xl text-yellow-500"></i>
            <button
              type="button"
              @click.stop="removeVideo"
              class="absolute -top-1 -right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all"
            >
              <i class="fa fa-times text-xs"></i>
            </button>
          </div>
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

// 定义组件属性
const props = defineProps<{
  mainImage: string
  imagesList: string[]
  videoUrl: string
}>()

// 定义事件发射器
const emit = defineEmits<{
  (e: 'update:mainImage', value: string): void
  (e: 'update:imagesList', value: string[]): void
  (e: 'update:videoUrl', value: string): void
}>()

// 文件转Base64
const readFileAsDataURL = (file: File, callback: (result: string) => void) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    if (typeof e.target?.result === 'string') callback(e.target.result)
  }
  reader.readAsDataURL(file)
}

// 处理主图上传
const handleMainImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }

    readFileAsDataURL(file, (result) => {
      emit('update:mainImage', result)
    })
  }
  target.value = ''
}

// 移除主图
const removeMainImage = () => {
  emit('update:mainImage', '')
}

// 处理多图上传
const handleImagesUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    // 检查总数是否超过限制
    if (props.imagesList.length + files.length > 10) {
      alert(`最多只能上传10张图片，您还可以上传${10 - props.imagesList.length}张`)
      return
    }

    // 处理每个文件
    Array.from(files).forEach(file => {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      // 检查文件大小 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB')
        return
      }

      readFileAsDataURL(file, (result) => {
        const newImagesList = [...props.imagesList, result]
        emit('update:imagesList', newImagesList)
      })
    })
  }
  target.value = ''
}

// 移除某张图片
const removeImage = (index: number) => {
  const newImagesList = [...props.imagesList]
  newImagesList.splice(index, 1)
  emit('update:imagesList', newImagesList)
}

// 处理视频上传
const handleVideoUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 检查文件类型
    if (!file.type.startsWith('video/')) {
      alert('请选择视频文件')
      return
    }

    // 检查文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('视频大小不能超过10MB')
      return
    }

    readFileAsDataURL(file, (result) => {
      emit('update:videoUrl', result)
    })
  }
  target.value = ''
}

// 移除视频
const removeVideo = () => {
  emit('update:videoUrl', '')
}
</script>

<style scoped>
.form-section {
  padding: 10px 0;
}
</style>
