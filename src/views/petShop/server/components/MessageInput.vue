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
        <input type="file" class="hidden" accept="image/*" @change="handleImageSend" />
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
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue', 'send'])

const innerMessage = ref(props.modelValue)
const textareaRef = ref<HTMLTextAreaElement>(null)
const selectedImage = ref<File | null>(null)

// 同步外部值
watch(
  () => props.modelValue,
  (val) => {
    innerMessage.value = val
  },
)

// 键盘事件：Enter发送，Shift+Enter换行
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// 发送文本消息
const handleSend = () => {
  const trimedMsg = innerMessage.value.trim()
  if (!trimedMsg && !selectedImage.value) return

  // 发送消息（区分文本/图片）
  if (selectedImage.value) {
    // 图片消息：传递File对象
    emit('send', { type: 'image', file: selectedImage.value })
    selectedImage.value = null
  } else {
    emit('send', trimedMsg)
  }
  emit('update:modelValue', '')
  innerMessage.value = ''
  textareaRef.value?.focus()
}

// 发送图片
const handleImageSend = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  selectedImage.value = file
  handleSend()
}
</script>

<style scoped>
textarea {
  min-height: 60px;
}
</style>
