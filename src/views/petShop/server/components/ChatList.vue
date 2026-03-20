<template>
  <div class="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
    <!-- 列表标题 + 自动回复设置按钮 -->
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="fas fa-comments text-blue-500 text-lg"></i>
        <span class="font-bold text-gray-800 text-lg">聊天列表</span>
      </div>
      <!-- 自动回复设置按钮 -->
      <button
        @click="showAutoReplySettings = true"
        class="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
      >
        <i class="fa fa-cog text-xs"></i>
        自动回复
      </button>
    </div>

    <!-- 自动回复设置弹窗 -->
    <div
      v-if="showAutoReplySettings"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">自动回复设置</h3>
          <button @click="showAutoReplySettings = false" class="text-gray-500 hover:text-gray-700">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- 欢迎语配置 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"> 首次接待欢迎语 </label>
          <textarea
            v-model="autoReplyContent"
            class="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
            rows="3"
            placeholder="输入用户首次咨询时的自动回复内容，例如：您好，欢迎咨询，我会尽快回复您的问题！"
          ></textarea>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-3">
          <button
            @click="showAutoReplySettings = false"
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveAutoReply"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="p-3">
      <div class="relative">
        <input
          type="text"
          placeholder="搜索宝贝或联系人"
          class="w-full pl-10 pr-4 py-2 bg-white rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
        />
        <i
          class="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></i>
      </div>
    </div>

    <!-- 列表内容 -->
    <div class="flex-1 overflow-y-auto bg-white">
      <div class="flex flex-col">
        <SystemNoticeItem
          :latest-notice="latestNotice"
          :unread-count="unreadCount"
          @click="handleSwitchToSystemNotice"
        />

        <!-- 店铺列表项 - 动态渲染 -->
        <div
          v-for="shop in shopList"
          :key="shop.id"
          class="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-100 transition-colors"
          :class="{ 'bg-blue-100': activeShopId === shop.id }"
          @click="handleSwitchShop(shop)"
        >
          <img
            :src="shop.avatar"
            alt="店铺头像"
            class="w-12 h-12 rounded-full border-2 object-cover"
            :class="{
              'border-blue-500': activeShopId === shop.id,
              'border-transparent': activeShopId !== shop.id,
            }"
          />
          <div class="ml-3 flex-1 min-w-0">
            <h1 class="text-base font-bold text-gray-800">{{ shop.name }}</h1>
            <p class="text-xs text-gray-500 truncate">{{ shop.lastMessage }}</p>
          </div>
          <span
            v-if="shop.unreadCount > 0"
            class="text-xs text-white bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ shop.unreadCount }}
          </span>
          <span v-else class="text-xs text-gray-400">{{ shop.lastTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import SystemNoticeItem from './SystemNoticeItem.vue'
import { shopList } from '../data/shopData'
import { ElMessage } from 'element-plus' // 引入提示组件

// 接收主页面传递的参数
const props = defineProps<{
  latestNotice: { id: string; content: string; time: string }
  unreadCount: number
  activeShopId: string // 当前选中的店铺ID
}>()

// 触发给主页面的事件
const emit = defineEmits(['switch-to-system-notice', 'switch-shop', 'save-auto-reply'])

// 自动回复设置
const showAutoReplySettings = ref(false)
const autoReplyContent = ref('')

// 确保shopList有效
const safeShopList = computed(() => {
  return Array.isArray(shopList) ? shopList : []
})

// 从本地缓存加载配置
onMounted(() => {
  const savedContent = localStorage.getItem('auto_reply_welcome')
  if (savedContent) {
    autoReplyContent.value = savedContent
  }

  // 如果没有选中的店铺且有店铺列表，自动选中第一个
  if (!props.activeShopId && safeShopList.value.length > 0) {
    handleSwitchShop(safeShopList.value[0])
  }
})

// 保存自动回复
const saveAutoReply = () => {
  if (!autoReplyContent.value.trim()) {
    ElMessage.warning('欢迎语不能为空！')
    return
  }
  // 通知父组件
  emit('save-auto-reply', {
    content: autoReplyContent.value,
  })
  ElMessage.success('自动回复设置保存成功！')
  showAutoReplySettings.value = false
}
// 切换到系统公告逻辑
const handleSwitchToSystemNotice = () => {
  emit('switch-to-system-notice')
}

// 切换店铺逻辑
const handleSwitchShop = (shop: any) => {
  emit('switch-shop', shop)
}
</script>
