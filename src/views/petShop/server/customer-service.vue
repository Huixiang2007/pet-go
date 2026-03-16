<template>
  <div class="min-h-screen bg-blue-50 py-8 flex justify-center items-center px-4 sm:px-6 lg:px-8">
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-[85vh] flex flex-row overflow-hidden"
    >
      <!-- 聊天列表组件 - 传递激活店铺ID -->
      <ChatList
        :latest-notice="latestSystemNotice"
        :unread-count="unreadNoticeCount"
        :active-shop-id="activeShop.id"
        @switch-to-system-notice="switchToSystemNotice"
        @switch-shop="handleSwitchShop"
        @save-auto-reply="handleSaveAutoReply"
      />

      <!-- 对话框核心区 -->
      <div class="flex-1 flex flex-col bg-gray-50">
        <div class="bg-white border-b border-gray-200 p-2">
          <div class="flex rounded-lg overflow-hidden border border-gray-200 w-fit">
            <button
              @click="isSystemNotice = false"
              class="px-4 py-1.5 text-sm font-medium transition-colors"
              :class="
                !isSystemNotice
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
              :disabled="!activeShop.id"
            >
              {{ activeShop.name || '人工客服' }}
            </button>
            <button
              @click="isSystemNotice = true"
              class="px-4 py-1.5 text-sm font-medium transition-colors"
              :class="
                isSystemNotice
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              <i class="fa fa-bell mr-1"></i>系统通知
            </button>
          </div>
        </div>

        <div
          class="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm"
        >
          <div class="flex items-center gap-3">
            <div
              v-if="isSystemNotice"
              class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <i class="fas fa-bell text-blue-500"></i>
            </div>
            <img
              v-else
              :src="activeShop.avatar"
              alt="店铺头像"
              class="w-10 h-10 rounded-full object-cover"
            />
            <h2 class="font-medium text-gray-800">
              <template v-if="isSystemNotice">系统通知</template>
              <template v-else>{{ activeShop.name }}</template>
            </h2>
          </div>
        </div>

        <template v-if="isSystemNotice">
          <SystemNoticeChat :notices="systemNotices" @markRead="handleMarkNoticeRead" />
        </template>
        <template v-else>
          <!-- 传递聊天记录给ChatContent -->
          <ChatContent
            :active-shop="activeShop"
            :chat-records="chatRecords[activeShop.id] || []"
            @withdraw-message="handleWithdrawMessage"
          />
          <MessageInput v-model="message" @send="sendMessage" />
        </template>
      </div>

      <!-- 仅在人工客服模式下显示侧边栏 -->
      <SidebarInfo v-if="!isSystemNotice" :active-shop="activeShop" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import ChatList from './components/ChatList.vue'
import ChatContent from './components/ChatContent.vue'
import SystemNoticeChat from './components/SystemNoticeChat.vue'
import SidebarInfo from './components/SidebarInfo.vue'
import MessageInput from './components/MessageInput.vue'
import { systemNotices } from './data/noticeData'
import { defaultActiveShop } from './data/shopData'

const message = ref('')
const isSystemNotice = ref(false)

const activeShop = ref(defaultActiveShop)

const chatRecords = ref<
  Record<
    string,
    Array<{
      id: string
      type: 'user' | 'shop'
      content: string
      time: string
      isImage?: boolean
      imageUrl?: string
    }>
  >
>({
  shop1: [
    {
      id: 'msg_1710300480000', // 补充初始化消息的id
      type: 'user',
      content: '我想修改一下收货地址',
      time: '10:28',
    },
    {
      id: 'msg_1710300540000', // 补充初始化消息的id
      type: 'shop',
      content: '您好，修改收货地址请在订单详情页操作哦～',
      time: '10:29',
    },
  ],
  shop2: [],
  shop3: [],
})

// 最新通知 + 未读数
const latestSystemNotice = computed(() => {
  return systemNotices.value[0] || { id: '', content: '暂无系统通知', time: '' }
})
const unreadNoticeCount = computed(() => {
  return systemNotices.value.filter((notice) => !notice.read).length
})

onMounted(() => {
  isSystemNotice.value = false
})

// 切换到系统通知
const switchToSystemNotice = () => {
  isSystemNotice.value = true
}
// 保存自动回复
const handleSaveAutoReply = (data: { content: string }) => {
  console.log('自动回复配置', data)
}
// 切换店铺逻辑
const handleSwitchShop = (shop: any) => {
  activeShop.value = shop
  isSystemNotice.value = false
  if (!chatRecords.value[shop.id]) {
    chatRecords.value[shop.id] = []
  }
}

// 标为已读
const handleMarkNoticeRead = (noticeId: string) => {
  const notice = systemNotices.value.find((item) => item.id === noticeId)
  if (notice) notice.read = true
}

// 自动回复逻辑
const sendMessage = (msg: string | { type: 'image'; file: File }) => {
  if (!activeShop.value.id) return
  const shopId = activeShop.value.id
  const now = new Date()
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  const recordId = `msg_${Date.now()}`

  // 添加用户消息
  if (typeof msg === 'string') {
    chatRecords.value[shopId].push({
      id: recordId,
      type: 'user',
      content: msg,
      time: time,
    })
  } else if (msg.type === 'image') {
    const imageUrl = URL.createObjectURL(msg.file)
    chatRecords.value[shopId].push({
      id: recordId,
      type: 'user',
      content: '[图片]',
      time: time,
      isImage: true,
      imageUrl: imageUrl,
    })
  }

  // 商家自动回复
  setTimeout(() => {
    const replyContent = getShopAutoReply(shopId)
    chatRecords.value[shopId].push({
      id: `msg_${Date.now()}`,
      type: 'shop',
      content: replyContent,
      time: time,
    })
  }, 1000)

  message.value = ''
}

// 撤回消息（不变）
const handleWithdrawMessage = (recordId: string) => {
  const shopId = activeShop.value.id
  const records = chatRecords.value[shopId]
  if (!records) return

  const index = records.findIndex((r) => r.id === recordId)
  if (index === -1) return

  records.splice(index, 1, {
    id: recordId,
    type: 'user',
    content: '你撤回了一条消息',
    time: new Date().toLocaleTimeString().slice(0, 5),
  })
}

// 不同店铺的自动回复
const getShopAutoReply = (shopId: string) => {
  const replyMap = {
    shop1: '您好，您的问题我已经收到，会尽快回复您～',
    shop2: '感谢您的咨询，我们会尽快处理您的问题！',
    shop3: '您好，有什么可以帮助您的吗？',
  }
  return replyMap[shopId as keyof typeof replyMap] || '您好，很高兴为您服务！'
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 3px;
}
</style>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 3px;
}
</style>
