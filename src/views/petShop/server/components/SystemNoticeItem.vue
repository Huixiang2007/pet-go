<template>
  <div
    class="flex items-center p-4 border-b border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
    @click="handleNoticeClick"
  >
    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
      <i class="fas fa-bell text-blue-500 text-xl"></i>
    </div>
    <div class="ml-3 flex-1 min-w-0">
      <h1 class="text-base font-bold text-gray-800">系统通知</h1>
    </div>
    <!-- 未读角标 -->
    <span
      v-if="unreadCount > 0"
      class="text-xs text-white bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center"
      >{{ unreadCount }}</span
    >
  </div>
</template>

<script lang="ts" setup>
// 接收通知数据和未读数
defineProps<{
  latestNotice: { id: string; content: string; time: string } // 最新一条通知
  unreadCount: number
}>()

// 点击通知项的事件
const emit = defineEmits(['click'])
const handleNoticeClick = () => {
  emit('click')
}
</script>
