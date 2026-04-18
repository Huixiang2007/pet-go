<template>
  <div class="flex-1 p-4 overflow-y-auto space-y-6" ref="messageContainer" @scroll="handleScroll">
    <!-- 加载更多指示器 -->
    <div v-if="props.loadingMore" class="py-4 text-center">
      <i class="fas fa-spinner fa-spin mr-2"></i>
      <span>加载更多通知...</span>
    </div>
    <div v-else-if="props.hasMore === false" class="py-4 text-center text-gray-400 text-sm">
      没有更多通知了
    </div>
    <div v-if="deleteMode" class="flex justify-between items-center mb-4">
      <div class="flex gap-3">
        <button
          @click="handleMarkAllRead"
          class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
          :disabled="isLoading"
        >
          全部已读
        </button>

        <button
          @click="handleBatchDelete"
          :disabled="selectedIds.length === 0 || isLoading"
          class="px-3 py-1 text-sm bg-red-50 text-red-800 rounded hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          批量删除
        </button>

        <button
          @click="handleCancel"
          class="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition"
          :disabled="isLoading"
        >
          取消
        </button>
      </div>

      <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" v-model="selectAll" class="w-4 h-4 text-blue-500" />
        {{ selectAll ? '取消全选' : '全选' }}
      </label>
    </div>

    <div v-for="(group, timeKey) in noticeGroups" :key="timeKey" class="space-y-6">
      <div class="flex justify-center">
        <span class="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">{{ timeKey }}</span>
      </div>

      <div
        v-for="notice in group"
        :key="notice.id"
        class="flex items-start gap-3 group relative"
        :class="{ 'bg-gray-50': selectedIds.includes(notice.id) }"
      >
        <input
          v-if="deleteMode"
          type="checkbox"
          v-model="selectedIds"
          :value="notice.id"
          class="w-4 h-4 mt-1 text-blue-500 cursor-pointer"
          :disabled="isLoading"
        />

        <div
          class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-bell text-green-500"></i>
        </div>

        <div class="max-w-[70%] w-full">
          <div class="bg-white p-4 rounded-tl-none rounded-lg shadow-sm border border-gray-100">
            <div class="mb-2 flex items-center gap-3 flex-wrap">
              <span
                class="text-xs px-2 py-1 rounded bg-green-50 text-green-600 border border-green-200"
              >
                {{ notice.type || '系统通知' }}
              </span>
              <span v-if="notice.senderName" class="text-base font-bold text-rose-600">
                {{ notice.senderName }}
              </span>
            </div>

            <h4
              @click="handleViewDetail(notice)"
              class="text-base font-medium text-gray-800 cursor-pointer hover:text-blue-500 mb-2 line-clamp-2"
            >
              {{ notice.title }}
            </h4>

            <p class="text-sm text-gray-600 mb-3">{{ notice.content }}</p>
            <p class="text-xs text-gray-400">
              发布时间：{{ notice.publishTime || '发布后立即生效' }}
            </p>

            <div class="mt-3 flex gap-3">
              <button
                v-if="!notice.read"
                @click="handleMarkRead(notice.id)"
                class="text-xs text-blue-500 hover:underline"
                :disabled="isLoading"
              >
                标为已读
              </button>

              <button
                v-if="!deleteMode"
                @click="handleDelete(notice.id)"
                class="text-xs text-red-500 hover:underline"
                :disabled="isLoading"
              >
                删除
              </button>
            </div>
          </div>
          <span class="text-xs text-gray-400 mt-1 block">{{ notice.time }}</span>
        </div>

        <button
          @click="enterDeleteMode"
          class="absolute right-2 top-2 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
          title="批量操作"
          :disabled="isLoading"
        >
          <i class="fas fa-ellipsis-v text-xs"></i>
        </button>
      </div>
    </div>

    <div
      v-if="Object.keys(noticeGroups).length === 0"
      class="flex justify-center items-center h-full"
    >
      <span class="text-gray-400 text-sm">暂无系统通知</span>
    </div>

    <!-- 消息详情弹窗 -->
    <teleport to="body">
      <div
        v-if="detailVisible"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="detailVisible = false"
      >
        <div class="bg-white rounded-lg w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800">{{ currentNotice?.title }}</h3>
            <button @click="detailVisible = false" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="mb-4">
            <span
              class="text-xs px-2 py-1 rounded bg-green-50 text-green-600 border border-green-200"
            >
              {{ currentNotice?.type || '系统通知' }}
            </span>
            <span v-if="currentNotice?.senderName" class="ml-2 text-base font-bold text-rose-600">
              {{ currentNotice.senderName }}
            </span>
          </div>

          <div class="text-sm text-gray-600 mb-6 whitespace-pre-line">
            {{ currentNotice?.content }}
          </div>

          <div class="flex justify-between text-xs text-gray-400">
            <p>发布时间：{{ currentNotice?.publishTime }}</p>
            <p>接收时间：{{ currentNotice?.time }}</p>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="detailVisible = false"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 删除确认 -->
    <teleport to="body">
      <div
        v-if="deleteConfirmVisible"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="deleteConfirmVisible = false"
      >
        <div class="bg-white rounded-lg w-[90%] max-w-md p-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">
            {{ deleteType === 'single' ? '确认删除这条通知？' : '确认删除选中的通知？' }}
          </h3>
          <div class="flex justify-end gap-3">
            <button
              @click="deleteConfirmVisible = false"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              :disabled="isLoading"
            >
              取消
            </button>
            <button
              @click="confirmDeleteAction"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              :disabled="isLoading"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  markRead as apiMarkRead,
  markReadAll as apiMarkReadAll,
  deleteMessage as apiDeleteMessage,
  deleteBatch as apiDeleteBatch,
  getMessageDetail as apiGetMessageDetail,
} from '@/api/message/message'

const props = defineProps<{
  notices: Array<{
    id: string
    type: string
    title: string
    content: string
    time: string
    date: string
    publishTime: string
    read: boolean
    senderName?: string
  }>
  loadingMore?: boolean
  hasMore?: boolean
}>()

const selectedIds = ref<string[]>([])
const detailVisible = ref(false)
const currentNotice = ref<any>(null)
const deleteConfirmVisible = ref(false)
const deleteType = ref<'single' | 'batch'>('single')
const pendingDeleteId = ref('')
const deleteMode = ref(false)
const isLoading = ref(false)
const messageContainer = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// 日期分组
const noticeGroups = computed(() => {
  const groups: Record<string, any[]> = {}
  props.notices.forEach((item) => {
    if (!groups[item.date]) groups[item.date] = []
    groups[item.date].push(item)
  })
  // 按日期正序排列，最早的日期在前
  const sortedGroups: Record<string, any[]> = {}
  Object.keys(groups)
    .sort((a, b) => {
      // 假设日期格式为 '2024-01-01' 这样的字符串，可以直接比较
      return new Date(a).getTime() - new Date(b).getTime()
    })
    .forEach((key) => {
      sortedGroups[key] = groups[key]
    })
  return sortedGroups
})

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const handleScroll = () => {
  const el = messageContainer.value
  if (!el) return
  if (el.scrollTop <= 50) {
    // 距离顶部50px就触发
    if (props.hasMore && !props.loadingMore) {
      loadMore()
    }
  }
}
// 加载更多
const loadMore = () => {
  if (!props.loadingMore && props.hasMore) {
    console.log('=== 触发向上加载更多 ===')
    emit('loadMore')
  }
}

// 初始化无限滚动（向上加载）
const initInfiniteScroll = () => {
  if (!messageContainer.value) return

  const options = {
    root: messageContainer.value,
    rootMargin: '100px 0px 0px 0px', // 👈 关键！向上加载必须用这个
    threshold: 0,
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && props.hasMore && !props.loadingMore) {
        loadMore()
      }
    })
  }, options)

  // 创建目标节点
  const target = document.createElement('div')
  target.className = 'scroll-top-observer'
  target.style.height = '1px'
  target.style.width = '100%'

  messageContainer.value.prepend(target)
  observer.value.observe(target)
}
// 清理观察器
const cleanupObserver = () => {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }

  // 移除观察目标元素
  const target = document.querySelector('.infinite-scroll-target')
  if (target && messageContainer.value) {
    messageContainer.value.removeChild(target)
  }
}

// 全选
const selectAll = computed({
  get() {
    const allIds = props.notices.map((i) => i.id)
    return allIds.length > 0 && selectedIds.value.length === allIds.length
  },
  set(val) {
    selectedIds.value = val ? props.notices.map((i) => i.id) : []
  },
})

const emit = defineEmits<{
  markRead: [id: string]
  markAllRead: []
  delete: [id: string]
  batchDelete: [ids: string[]]
  viewDetail: [id: string]
  loadMore: []
}>()

// 取消删除模式
const handleCancel = () => {
  deleteMode.value = false
  selectedIds.value = []
}

// 进入删除模式
const enterDeleteMode = () => {
  deleteMode.value = true
}

// 获取用户ID
const getUserId = () => {
  const uid = localStorage.getItem('userId')
  if (!uid || uid === 'undefined') {
    ElMessage.error('请先登录')
    throw new Error('userId 不存在')
  }
  return Number(uid)
}

// 标为已读
const handleMarkRead = async (id: string) => {
  try {
    isLoading.value = true
    await apiMarkRead({ messageId: BigInt(id) })
    emit('markRead', id)
    ElMessage.success('已标记为已读')
  } catch (err) {
    ElMessage.error('操作失败')
    console.error('已读操作失败', err)
  } finally {
    isLoading.value = false
  }
}

// 全部已读
const handleMarkAllRead = async () => {
  try {
    isLoading.value = true
    await apiMarkReadAll({ userId: getUserId() })
    emit('markAllRead')
    ElMessage.success('全部已读')
  } catch (err) {
    ElMessage.error('操作失败')
    console.error('全部一度操作失败', err)
  } finally {
    isLoading.value = false
  }
}

// 查看详情（正确渲染）
const handleViewDetail = async (notice: any) => {
  try {
    isLoading.value = true
    const data = await apiGetMessageDetail({
      messageId: BigInt(notice.id),
      userId: getUserId(),
    })

    currentNotice.value = {
      id: (data?.messageId || notice.id).toString(),
      title: data?.messageTitle || notice.title,
      content: data?.messageContent || notice.content,
      type: data?.messageType || notice.type,
      publishTime: data?.sendTime || notice.publishTime,
      senderName: data?.senderName || notice.senderName,
      read: data?.isRead === 1 || notice.read,
      time: notice.time,
      date: notice.date,
    }

    detailVisible.value = true
    emit('viewDetail', notice.id)
  } catch (err) {
    ElMessage.error('获取详情失败')
    console.error('获取详情失败', err)
  } finally {
    isLoading.value = false
  }
}

// 单条删除弹窗
const handleDelete = (id: string) => {
  deleteType.value = 'single'
  pendingDeleteId.value = id
  deleteConfirmVisible.value = true
}

// 批量删除弹窗
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的通知')
    return
  }
  deleteType.value = 'batch'
  deleteConfirmVisible.value = true
}

// 确认删除
const confirmDeleteAction = async () => {
  try {
    isLoading.value = true
    if (deleteType.value === 'single') {
      await apiDeleteMessage({ messageId: BigInt(pendingDeleteId.value) })
      emit('delete', pendingDeleteId.value)
      ElMessage.success('删除成功')
    } else {
      await apiDeleteBatch(selectedIds.value)
      emit('batchDelete', selectedIds.value)
      ElMessage.success('批量删除成功')
    }
    deleteConfirmVisible.value = false
    deleteMode.value = false
    selectedIds.value = []
  } catch (err) {
    ElMessage.error('删除失败')
    console.error('删除失败', err)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  scrollToBottom()
  nextTick(() => {
    initInfiniteScroll()
  })
})

onUnmounted(() => {
  cleanupObserver()
})
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
.group {
  transition: background-color 0.2s;
}
.group:hover {
  background-color: #f9fafb;
}
:deep(.fa-ellipsis-v) {
  font-size: 12px;
}
</style>
