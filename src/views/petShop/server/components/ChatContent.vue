<template>
  <div class="flex-1 p-4 overflow-y-auto space-y-6" ref="chatContentRef">
    <div
      v-if="(chatRecords || []).length === 0"
      class="flex flex-col items-center justify-center h-full text-gray-400"
    >
      <i class="fa fa-comments-o text-4xl mb-3"></i>
      <p>暂无聊天记录，开始和商家聊聊吧～</p>
    </div>

    <template v-else>
      <div class="flex justify-center">
        <span class="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">今天</span>
      </div>

      <div
        v-for="record in chatRecords || []"
        :key="record.id"
        class="flex items-start gap-3"
        :class="{ 'justify-end': record.type === 'user' }"
      >
        <!-- 用户消息 -->
        <template v-if="record.type === 'user'">
          <div class="max-w-[70%] relative group">
            <!-- 撤回按钮：hover显示 -->
            <button
              v-if="record.content !== '你撤回了一条消息'"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              @click="handleWithdraw(record.id)"
            >
              撤回
            </button>

            <!-- 文本消息 -->
            <div
              v-if="!record.isImage"
              class="bg-blue-500 p-4 rounded-tr-none rounded-lg shadow-sm text-white"
            >
              <p class="text-sm">{{ record.content }}</p>
            </div>

            <!-- 图片消息 -->
            <div v-else class="bg-transparent">
              <img
                :src="record.imageUrl"
                alt="发送的图片"
                class="max-w-[200px] max-h-[200px] rounded-lg shadow-sm object-cover"
              />
            </div>

            <span class="text-xs text-gray-400 mt-1 block text-right">{{ record.time }}</span>
          </div>
          <img
            src="https://picsum.photos/id/64/120/120"
            alt="用户头像"
            class="w-10 h-10 rounded-full object-cover"
          />
        </template>

        <!-- 商家消息 -->
        <template v-else>
          <img
            :src="activeShop.avatar"
            alt="商家头像"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div class="max-w-[70%]">
            <div class="bg-white p-4 rounded-tl-none rounded-lg shadow-sm border border-gray-100">
              <p class="text-sm">{{ record.content }}</p>
            </div>
            <span class="text-xs text-gray-400 mt-1 block">{{ record.time }}</span>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  activeShop: any
  chatRecords:
    | Array<{
        id: string
        type: 'user' | 'shop'
        content: string
        time: string
        isImage?: boolean
        imageUrl?: string
      }>
    | undefined
}>()

const emit = defineEmits(['withdraw-message'])
const chatContentRef = ref<HTMLDivElement>(null)

// 自动滚动到底部
watch(
  () => props.chatRecords,
  () => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  },
  { deep: true },
)

onMounted(() => {
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
  }
})

// 触发撤回
const handleWithdraw = (recordId: string) => {
  emit('withdraw-message', recordId)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
