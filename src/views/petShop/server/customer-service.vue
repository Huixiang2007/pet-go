<template>
  <div class="min-h-screen bg-blue-50 py-8 flex justify-center items-center px-4 sm:px-6 lg:px-8">
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-[85vh] flex flex-row overflow-hidden"
    >
      <ChatList
        :chat-type="chatType"
        :latest-notice="latestSystemNotice"
        :unread-count="unreadNoticeCount"
        :active-shop-id="activeShop?.shopId || 0"
        :all-shops="allShops"
        :all-foster-lists="allFosterLists"
        @switch-to-system-notice="switchToSystemNotice"
        @switch-shop="handleSwitchShop"
        @save-auto-reply="handleSaveAutoReply"
      />

      <div class="flex-1 flex flex-col bg-gray-50">
        <div class="bg-white border-b border-gray-200 p-2">
          <div class="flex rounded-lg overflow-hidden border border-gray-200 w-fit">
            <button
              @click="switchChatType('shop')"
              class="px-4 py-1.5 text-sm font-medium transition-colors"
              :class="
                chatType === 'shop' && !isSystemNotice
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              商家客服
            </button>
            <button
              @click="switchChatType('foster')"
              class="px-4 py-1.5 text-sm font-medium transition-colors"
              :class="
                chatType === 'foster' && !isSystemNotice
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              寄养服务
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

        <template v-if="isSystemNotice">
          <SystemNoticeChat
            :notices="systemNotices"
            @markRead="handleMarkNoticeRead"
            @delete="handleDelete"
            @batchDelete="handleBatchDelete"
          />
        </template>
        <template v-else>
          <ChatContent
            ref="chatContainer"
            :chat-type="chatType"
            :active-shop="activeShop"
            :chat-records="chatRecords[`${chatType}_${activeShop.userId}`] || []"
          />
          <MessageInput
            v-model="message"
            :chat-type="chatType"
            :target-user-id="activeShop.userId"
            :url-id="route.query.id"
            @send="sendMessage"
          />
        </template>
      </div>

      <SidebarInfo
        v-if="!isSystemNotice && activeShop.shopId"
        :active-shop="activeShop"
        :chat-type="chatType"
        @send="() => loadChatRecords(activeShop.userId)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatList from './components/ChatList.vue'
import ChatContent from './components/ChatContent.vue'
import SystemNoticeChat from './components/SystemNoticeChat.vue'
import SidebarInfo from './components/SidebarInfo.vue'
import MessageInput from './components/MessageInput.vue'
import { systemNotices } from './data/noticeData'
import type { ChatRecord } from '@/types/chat'
import {
  defaultActiveShop,
  getShopList,
  shopList,
  getFosterList,
  forserList,
} from './data/chatListData'
import { createSSE, closeSSE } from '@/api/message/sse'
import {
  getChatRecords,
  getFosterChatRecords,
  getShopBaseInfoByUserId,
  getFosterBaseInfoByUserId,
} from '@/api/message/chat'

const route = useRoute()
const router = useRouter()

const message = ref('')
const isSystemNotice = ref(false)
const allShops = ref<any[]>([])
const allFosterLists = ref<any[]>([])
const activeShop = ref(defaultActiveShop)
const chatContainer = ref(null)

// 聊天类型
const chatType = computed(() => (route.query.type as 'shop' | 'foster') || 'shop')
console.log('聊天类型:', chatType.value)
// 切换聊天类型（电商/寄养）
const switchChatType = (type: 'shop' | 'foster') => {
  isSystemNotice.value = false
  router.replace({ query: { ...route.query, type } })
}

const chatRecords = ref<Record<string, ChatRecord[]>>({})

// 切换类型时刷新列表
watch(
  chatType,
  async (newType) => {
    chatRecords.value = {}
    activeShop.value = defaultActiveShop

    if (newType === 'shop') {
      await shopList()
      allShops.value = [...getShopList]
      console.log('加载电商列表成功:', getShopList)
    } else {
      await forserList()
      allFosterLists.value = getFosterList.map((item) => ({
        ...item,
        userId: item.userId || extractNumberFromStr(route.query.type as string),
        shopId: item.shopId || item.fosterProviderId,
        shopName: item.shopName || item.fosterProviderName,
        shopAvataravatar: item.shopAvatar || item.fosterProviderAvatar,
      }))
      console.log('加载寄养列表成功:', allFosterLists.value)
    }

    const currentList = newType === 'shop' ? allShops.value : allFosterLists.value
    if (currentList.length > 0) {
      activeShop.value = currentList[0]
      loadChatRecords(activeShop.value.userId)
      console.log('切换tab，默认选中第一个，userId:', activeShop.value.userId)
    }
  },
  { immediate: true },
)

// 加载聊天记录
const loadChatRecords = async (userId: number) => {
  if (!userId) return
  try {
    let res
    if (chatType.value === 'shop') {
      res = await getChatRecords(userId, 1, 100000)
    } else {
      res = await getFosterChatRecords(userId, 1, 100000)
      console.log('寄养聊天记录', res)
    }

    const currentUserId = +(localStorage.getItem('userId') || 0)
    const key = `${chatType.value}_${userId}`

    chatRecords.value[key] = res.records
      .sort((a: any, b: any) => new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime())
      .map((item: any) => {
        const base = {
          id: String(item.msgId),
          type: item.senderId === currentUserId ? 'user' : 'shop',
          time: new Date(item.sendTime).toLocaleTimeString().slice(0, 5),
          isWithdrawn: false,
          msgType: item.msgType,
        }

        // 文本消息
        if (item.msgType === 'text') {
          return {
            ...base,
            content: item.content || '',
            isImage: !!item.image,
            imageUrl: item.image || '',
            isGoods: false,
            isService: false,
          }
        }

        // 商品消息
        if (item.msgType === 'product') {
          return {
            ...base,
            isGoods: true,
            isService: false,
            isImage: false,
            content: '',
            goodsInfo: {
              id: item.shopId || item.msgId,
              title: item.shopTitle || '商品',
              currentPrice: item.shopPrice || 0,
              sales: item.shopSales || 0,
              mainImage: item.shopMainImage || '',
            },
          }
        }

        //  寄养服务消息
        if (item.msgType === 'service') {
          return {
            ...base,
            isGoods: false,
            isService: true,
            isImage: false,
            content: '',
            serviceInfo: {
              id: item.shopId || item.msgId,
              title: item.shopTitle || '商品',
              currentPrice: item.shopPrice || 0,
              sales: item.shopSales || 0,
              mainImage: item.shopMainImage || '',
            },
          }
        }

        // 兜底
        return {
          ...base,
          content: item.content || '',
          isImage: false,
          imageUrl: '',
          isGoods: false,
          isService: false,
        }
      })

    scrollToBottom()
  } catch (e) {
    console.error('加载聊天记录失败', e)
  }
}
// 发送消息
const sendMessage = (record: any) => {
  let uid = activeShop.value.userId
  if (!uid) {
    uid = extractNumberFromStr(route.query.id as string)
  }
  const key = `${chatType.value}_${uid}`
  if (!chatRecords.value[key]) chatRecords.value[key] = []

  const newRecord: ChatRecord = {
    id: `msg_${record.msgId || Date.now()}`,
    type: 'user',
    time: new Date(record.sendTime).toLocaleTimeString().slice(0, 5),
    isWithdrawn: false,
    msgType: record.msgType || 'text',

    // 必须补齐，否则模板判断不生效！
    isGoods: false,
    isService: false,
    content: '',
    isImage: false,
    imageUrl: '',
  }

  // 文本
  if (newRecord.msgType === 'text') {
    newRecord.content = record.content || ''
    newRecord.isImage = !!record.isImage
    newRecord.imageUrl = record.imageUrl || ''
  }

  // 商品
  else if (newRecord.msgType === 'product') {
    newRecord.isGoods = true
    newRecord.goodsInfo = {
      id: record.id,
      title: record.title || '商品',
      currentPrice: record.price || 0,
      sales: record.sales || 0,
      mainImage: record.mainImage || '',
    }
  }

  // 服务
  else if (newRecord.msgType === 'service') {
    newRecord.isService = true
    newRecord.serviceInfo = {
      id: record.id,
      title: record.title || '寄养服务',
      currentPrice: record.price || 0,
      sales: record.sales || 0,
      mainImage: record.mainImage || '',
    }
  }

  chatRecords.value[key].push(newRecord)
  scrollToBottom()
}

// 处理SSE消息
const handleSSEMessage = (data: any) => {
  try {
    const currentUserId = Number(localStorage.getItem('userId') || 0)
    const type: 'user' | 'shop' = data.senderId === currentUserId ? 'user' : 'shop'
    const key = `${chatType.value}_${data.targetUserId || activeShop.value.userId}`
    // 基础消息结构
    const base = {
      id: String(data.msgId || `msg_${Date.now()}`),
      type,
      time: new Date(data.sendTime).toLocaleTimeString().slice(0, 5),
      isWithdrawn: false,
      msgType: data.msgType,
    }

    let record: ChatRecord
    // 文本消息
    if (data.msgType === 'text') {
      record = {
        ...base,
        content: data.content || '',
        isImage: !!data.image,
        imageUrl: data.image || '',
        isGoods: false,
        isService: false,
      }
    }
    //  商品消息
    else if (data.msgType === 'product') {
      record = {
        ...base,
        isGoods: true,
        isService: false,
        isImage: false,
        content: '',
        goodsInfo: {
          id: data.shopId || data.msgId,
          title: data.shopTitle || '商品',
          currentPrice: data.shopPrice || 0,
          sales: data.shopSales || 0,
          mainImage: data.shopMainImage || '',
        },
      }
    }

    // 寄养服务消息
    else if (data.msgType === 'service') {
      record = {
        ...base,
        isGoods: false,
        isService: true,
        isImage: false,
        content: '',
        serviceInfo: {
          id: data.shopId || data.msgId,
          title: data.shopTitle || '寄养服务',
          currentPrice: data.shopPrice || 0,
          sales: data.shopSales || 0,
          mainImage: data.shopMainImage || '',
        },
      }
    }

    // 兜底
    else {
      record = {
        ...base,
        content: data.content || '',
        isImage: false,
        imageUrl: '',
        isGoods: false,
        isService: false,
      }
    }

    // 确保数组存在
    if (!chatRecords.value[key]) {
      chatRecords.value[key] = []
    }
    const exists = chatRecords.value[key].some((item) => item.id === record.id)
    if (!exists) {
      chatRecords.value[key].push(record)
      scrollToBottom()
    }
  } catch (error) {
    console.error('处理 SSE 消息失败:', error)
  }
}
// 新增电商店铺到列表
const addShopToList = (newShop: any) => {
  const isExist = allShops.value.some((shop) => shop.userId === newShop.userId)
  if (!isExist) {
    allShops.value.unshift(newShop)
  }
}

// 新增寄养店铺到列表
const addFosterToList = (newFoster: any) => {
  const fosterWithUserId = {
    ...newFoster,
    userId: extractNumberFromStr(route.query.id as string),
    shopId: newFoster.fosterProviderId,
    shopName: newFoster.fosterProviderName,
    avatar: newFoster.fosterProviderAvatar,
  }
  const isExist = allFosterLists.value.some((item) => item.userId === fosterWithUserId.userId)
  if (!isExist) {
    allFosterLists.value.unshift(fosterWithUserId)
  }
  return fosterWithUserId
}

//对获取到的id进性一个正则检验
const extractNumberFromStr = (str: string): number => {
  const match = str.match(/^\d+/)
  return match ? Number(match[0]) : NaN
}

onMounted(async () => {
  if (!route.query.type) {
    router.replace({
      query: { ...route.query, type: 'shop' },
    })
    return
  }
  if (chatType.value === 'shop') {
    await shopList()
    allShops.value = [...getShopList]
  } else {
    await forserList()
    allFosterLists.value = getFosterList.map((item) => ({
      ...item,
      shopId: item.fosterProviderId,
      shopName: item.fosterProviderName,
      shopAvatar: item.fosterProviderAvatar,
    }))
  }

  const currentList = chatType.value === 'shop' ? allShops.value : allFosterLists.value
  if (currentList.length > 0) {
    activeShop.value = currentList[0]
    console.log('11111', activeShop)
    console.log('初始化，默认选中第一个，userId:', activeShop.value.userId)
  }
  isSystemNotice.value = false

  const urlUserId = extractNumberFromStr(route.query.id as string)
  if (urlUserId) {
    const targetId = Number(urlUserId)
    const currentList = chatType.value === 'shop' ? allShops.value : allFosterLists.value

    const targetItem = currentList.find((s: any) => s.userId === targetId)

    if (!targetItem) {
      try {
        let info = null
        if (chatType.value === 'shop') {
          info = await getShopBaseInfoByUserId(targetId)
          addShopToList(info)
          if (info) {
            activeShop.value = info
            loadChatRecords(info.userId)
            console.log('新增成功，userId:', info.userId)
          }
        } else {
          info = await getFosterBaseInfoByUserId(targetId)
          console.log('获取未聊天寄养信息成功:', info)
          addFosterToList(info)
          if (info) {
            activeShop.value = info.fosterProviderId
            loadChatRecords(info.fosterProviderId)
          }
        }
      } catch (e) {
        console.error('获取未聊天店铺/寄养信息失败', e)
      }
    } else {
      activeShop.value = targetItem
      loadChatRecords(targetItem.userId)
    }
  } else {
    if (activeShop.value.userId) {
      loadChatRecords(activeShop.value.userId)
    }
  }

  //  建立SSE连接
  const userId = Number(localStorage.getItem('userId'))
  if (!userId || isNaN(userId)) {
    console.error('userId 无效！')
    return
  }
  sseInstance = createSSE(userId)
  sseInstance.onmessage = (event) => {
    console.log('SSE 收到消息:', event.data)
    try {
      const data = JSON.parse(event.data)
      handleSSEMessage(data)
    } catch (error) {
      console.error('解析SSE消息失败:', error)
    }
  }
})

watch(
  () => route.query.id,
  async (newUserId) => {
    if (!newUserId) return
    const targetId = Number(extractNumberFromStr(newUserId as string))
    const currentList = chatType.value === 'shop' ? allShops.value : allFosterLists.value
    const targetItem = currentList.find((s: any) => s.userId === targetId)

    if (targetItem) {
      activeShop.value = targetItem
      loadChatRecords(targetItem.userId)
      console.log('URL id 变化，跳转到对象，userId:', targetId)
    } else {
      console.warn('URL id 未找到对应对象，不修改当前选中，targetId:', targetId)
    }
  },
)

// 滚动到聊天底部
const scrollToBottom = () =>
  nextTick(() => {
    if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })

// 切换店铺/寄养
const handleSwitchShop = (shop: any) => {
  activeShop.value = shop
  isSystemNotice.value = false
  loadChatRecords(shop.userId)
}

// 最新系统通知
const latestSystemNotice = computed(
  () => systemNotices.value[0] || { id: '', content: '', time: '' },
)

// 未读系统通知数量
const unreadNoticeCount = computed(() => systemNotices.value.filter((n) => !n.read).length)

// 切换到系统通知
const switchToSystemNotice = () => (isSystemNotice.value = true)

// 保存自动回复
const handleSaveAutoReply = (d: any) => console.log(d)

// 删除系统通知
const handleDelete = (id: string) => {
  systemNotices.value = systemNotices.value.filter((i) => i.id !== id)
}

// 批量删除系统通知
const handleBatchDelete = (ids: string[]) => {
  systemNotices.value = systemNotices.value.filter((i) => !ids.includes(i.id))
}

// 标记系统通知已读（
const handleMarkNoticeRead = (id: string) => {
  const n = systemNotices.value.find((i) => i.id === id)
  if (n) n.read = true
}

// SSE销毁
let sseInstance: any = null
onUnmounted(() => {
  if (sseInstance) {
    closeSSE(sseInstance)
  }
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}
</style>
