<template>
  <div class="border-t border-gray-200 p-4 bg-white">
    <div class="flex items-end gap-3">
      <textarea
        v-model="innerMessage"
        placeholder="请输入消息，按Enter键或点击发送按钮发送"
        class="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none transition-all"
        @keydown="handleKeydown"
        maxlength="300"
        ref="textareaRef"
      ></textarea>
      <!-- 发送图片按钮 -->
      <label class="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
        <i class="fa fa-paperclip cursor-pointer hover:text-blue-500 transition-colors"></i>
        <input type="file" class="hidden" accept="image/*" @change="handleImageSelect" />
      </label>
      <button
        class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        @click="handleSend"
        :disabled="!innerMessage.trim() && !selectedImage"
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
import { ref, watch, onMounted } from 'vue'
import { sendMessage, getChatRecords } from '@/api/pet-shop/chat'
import { normalUploadApi } from '@/api/file-upload/fileUpload'
import { ElMessage } from 'element-plus'

//从父组件接收
const props = defineProps<{
  modelValue: string
  activeShopId: string
}>()
const emit = defineEmits(['update:modelValue', 'send', 'refreshChat']) // 新增刷新聊天记录的事件

const innerMessage = ref(props.modelValue)
const textareaRef = ref<HTMLTextAreaElement>(null)
const selectedImage = ref<File | null>(null)
const isSending = ref(false) // 防止重复发送
//同步
watch(
  () => props.modelValue,
  (val) => {
    innerMessage.value = val
  },
  { immediate: true },
)

//Enter发送，Shift+Enter换行
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const handleSend = async () => {
  if (!props.activeShopId) {
    ElMessage.warning('请先选择聊天店铺！')
    return
  }
  if (!innerMessage.value.trim() && !selectedImage.value) {
    ElMessage.warning('请输入消息内容或选择图片！')
    return
  }
  if (isSending.value) return

  try {
    isSending.value = true

    if (selectedImage.value) {
      await sendImageMessage(selectedImage.value)
    }
    // 情况2：发送文本消息
    else if (innerMessage.value.trim()) {
      await sendTextMessage(innerMessage.value.trim())
    }

    innerMessage.value = ''
    selectedImage.value = null
    emit('update:modelValue', '') // 通知父组件清空输入框
    ElMessage.success('消息发送成功！')

    await fetchChatRecords(Number(props.activeShopId))
  } catch (err: any) {
    ElMessage.error(err.msg || '消息发送失败，请重试！')
    console.error('发送失败:', err)
  } finally {
    isSending.value = false
  }
}

// 发送文本消息
const sendTextMessage = async (content: string) => {
  const res = (await sendMessage({
    receiverId: Number(props.activeShopId),
    content,
  })) as any

  // 适配接口返回格式
  if (res.code !== 200) {
    throw new Error(res.msg || '文本消息发送失败')
  }
}

// 发送图片消息
const sendImageMessage = async (file: File) => {
  const uploadRes = await normalUploadApi(file)
  if (uploadRes.code !== 200 || !uploadRes.data) {
    throw new Error(uploadRes.msg || '图片上传失败')
  }

  const res = (await sendMessage({
    receiverId: Number(props.activeShopId),
    image: uploadRes.data, // 上传返回的图片URL
  })) as any

  if (res.code !== 200) {
    throw new Error(res.msg || '图片消息发送失败')
  }
}

// 选择图片（仅选择，不立即发送）
const handleImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 校验图片格式和大小
  const isImage = file.type.startsWith('image/')
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (!isImage) {
    ElMessage.warning('请选择图片文件！')
    return
  }
  if (file.size > maxSize) {
    ElMessage.warning('图片大小不能超过5MB！')
    return
  }

  selectedImage.value = file
  ElMessage.success('图片选择成功，点击发送按钮即可发送')
}

// 手动刷新聊天记录
const fetchChatRecords = async (receiverId: number) => {
  try {
    const records = await getChatRecords(1, 100, receiverId)
    emit('send', records)
  } catch (err: any) {
    ElMessage.error(err.msg || '加载聊天记录失败')
  }
}

onMounted(() => {
  textareaRef.value?.focus()
})
</script>

<style scoped>
textarea {
  min-height: 60px;
}
/* 发送中按钮样式 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
