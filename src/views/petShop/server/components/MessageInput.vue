<template>
  <div class="border-t border-gray-200 p-4 bg-white">
    <!-- 预览选中的图片 -->
    <div v-if="selectedImage" class="mb-2">
      <div class="relative inline-block">
        <img :src="imagePreviewUrl" class="h-20 rounded-lg border object-cover" />
        <button
          class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          @click="removeImage"
        >
          ×
        </button>
      </div>
    </div>

    <div class="flex items-end gap-3">
      <textarea
        v-model="innerMessage"
        placeholder="请输入消息，按Enter键或点击发送按钮发送"
        class="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none transition-all"
        @keydown="handleKeydown"
        @input="autoResizeTextarea"
        maxlength="300"
        ref="textareaRef"
      ></textarea>

      <label class="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
        <i class="fa fa-paperclip"></i>
        <input type="file" class="hidden" accept="image/*" @change="handleImageSelect" />
      </label>

      <button
        class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        @click="handleSend"
        :disabled="isSending || (!innerMessage.trim() && !selectedImage)"
      >
        <i class="fa fa-paper-plane"></i>
      </button>
    </div>

    <div class="flex justify-between items-center text-xs text-gray-400 mt-3">
      <span>{{ innerMessage.length }}/300</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { sendMessage, sendFosterMessage } from '@/api/message/chat'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  chatType: string
  modelValue: string
  targetUserId: number
  urlId: string | number | string[] | undefined
}>()

const emit = defineEmits(['update:modelValue', 'send'])

const innerMessage = ref(props.modelValue)
const chatType = props.chatType
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const selectedImage = ref<File | null>(null)
const imagePreviewUrl = ref('')
const isSending = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    innerMessage.value = val
  },
  { immediate: true },
)

// 监听 userId 变化
watch(
  () => props.targetUserId,
  (id) => {
    console.log('当前聊天目标userId：', id)
  },
  { immediate: true },
)

const autoResizeTextarea = () => {
  if (!textareaRef.value) return
  textareaRef.value.style.height = '60px'
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`
}

// 键盘发送
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// 选择图片
const handleImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片不能超过5MB')
    return
  }

  selectedImage.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
  autoResizeTextarea() // 选择图片后自适应文本域高度
}

const removeImage = () => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }
  selectedImage.value = null
  imagePreviewUrl.value = ''
}

// 发送消息
const handleSend = async () => {
  const receiverId = props.targetUserId
  console.log('当前聊天目标userId：', receiverId)
  if (!receiverId || receiverId === 0) {
    ElMessage.warning('未选择聊天对象')
    return
  }
  if (!innerMessage.value.trim() && !selectedImage.value) {
    ElMessage.warning('不能发送空消息')
    return
  }
  if (isSending.value) return

  try {
    isSending.value = true

    const sendParams = {
      receiverId,
      content: innerMessage.value.trim() || '', // 改为空字符串，避免 undefined 导致后端报错
      image: selectedImage.value || undefined,
      urlId: props.urlId ? Number(props.urlId) : undefined, // 传递路由参数
      msgType: selectedImage.value ? 'image' : 'text',
    }
    console.log('发送参数:', sendParams)

    //判断
    if (chatType === 'shop') {
      await sendMessage(sendParams)
    } else {
      await sendFosterMessage(sendParams)
    }
    emit('send', {
      content: innerMessage.value.trim(),
      sendTime: new Date().toISOString(),
      msgId: Date.now(),
      isImage: !!selectedImage.value,
      imageUrl: selectedImage.value ? URL.createObjectURL(selectedImage.value) : '',
      msgType: sendParams.msgType,
    })

    ElMessage.success('发送成功')
    innerMessage.value = ''
    removeImage()
    emit('update:modelValue', '')
    // 重置文本域高度
    if (textareaRef.value) {
      textareaRef.value.style.height = '60px'
    }
  } catch (err: any) {
    ElMessage.error(err.msg || '发送失败')
    console.error(err)
  } finally {
    isSending.value = false
  }
}

// 组件挂载：聚焦 + 初始化文本域高度
onMounted(() => {
  textareaRef.value?.focus()
  autoResizeTextarea()
})

// 4. 修复：组件卸载时释放图片预览 URL 内存
onUnmounted(() => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }
})
</script>

<style scoped>
textarea {
  min-height: 60px;
  max-height: 200px; /* 新增：限制最大高度 */
}
/* 优化按钮禁用样式 */
button:disabled {
  opacity: 0.7;
}
</style>
