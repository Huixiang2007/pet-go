<template>
  <div class="flex-1 p-4 overflow-y-auto space-y-6">
    <!-- 通知时间分割线 -->
    <div v-for="(group, timeKey) in noticeGroups" :key="timeKey" class="space-y-6">
      <div class="flex justify-center">
        <span class="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">{{ timeKey }}</span>
      </div>

      <!-- 单条通知 -->
      <div v-for="notice in group" :key="notice.id" class="flex items-start gap-3">
        <!-- 通知图标-->
        <div
          class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-bell text-green-500"></i>
        </div>

        <!-- 通知内容区-->
        <div class="max-w-[70%] w-full">
          <div class="bg-white p-4 rounded-tl-none rounded-lg shadow-sm border border-gray-100">
            <!-- 通知类型标签 -->
            <div class="mb-2 flex items-center gap-2">
              <span
                class="text-xs px-2 py-1 rounded bg-green-50 text-green-600 border border-green-200"
              >
                {{ notice.type || '系统通知' }}
              </span>
              <!-- 通知标题 -->
              <h4 class="text-base font-medium text-gray-800">{{ notice.title }}</h4>
            </div>

            <!-- 通知正文内容 -->
            <p class="text-sm text-gray-600 mb-3">{{ notice.content }}</p>

            <!-- 发布时间 -->
            <p class="text-xs text-gray-400">
              发布时间：{{ notice.publishTime || '发布后立即生效' }}
            </p>

            <!-- 标为已读按钮 -->
            <button
              v-if="!notice.read"
              @click="markAsRead(notice.id)"
              class="mt-3 text-xs text-blue-500 hover:underline"
            >
              标为已读
            </button>
          </div>

          <!-- 通知接收时间 -->
          <span class="text-xs text-gray-400 mt-1 block">{{ notice.time }}</span>
        </div>
      </div>
    </div>

    <!-- 无通知提示 -->
    <div
      v-if="Object.keys(noticeGroups).length === 0"
      class="flex justify-center items-center h-full"
    >
      <span class="text-gray-400 text-sm">暂无系统通知</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

// 接收所有通知数据
const props = defineProps<{
  notices: Array<{
    id: string // 唯一标识
    type: string // 通知类型
    title: string // 通知标题
    content: string // 通知正文内容
    time: string // 通知接收时间
    date: string // 通知日期
    publishTime: string // 发布时间
    read: boolean // 是否已读
  }>
}>()

// 按日期分组通知
const noticeGroups = computed(() => {
  const groups: Record<string, typeof props.notices> = {}
  props.notices.forEach((notice) => {
    if (!groups[notice.date]) {
      groups[notice.date] = []
    }
    groups[notice.date].push(notice)
  })
  return groups
})

// 标为已读事件
const emit = defineEmits(['markRead'])
const markAsRead = (noticeId: string) => {
  emit('markRead', noticeId)
}
</script>

<style scoped>
:deep(.bg-green-50) {
  background-color: #f0fdf4;
}
:deep(.text-green-600) {
  color: #16a34a;
}
:deep(.border-green-200) {
  border-color: #bbf7d0;
}
</style>
