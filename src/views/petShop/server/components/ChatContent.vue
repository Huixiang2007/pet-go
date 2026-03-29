<template>
  <div class="flex-1 p-4 overflow-y-auto space-y-6" ref="chatContentRef">
    <!-- 无聊天记录状态 -->
    <div
      v-if="safeChatRecords.length === 0"
      class="flex flex-col items-center justify-center h-full text-gray-400"
    >
      <i class="fa fa-comments-o text-4xl mb-3"></i>
      <p>暂无聊天记录，开始和商家聊聊吧～</p>
    </div>

    <!-- 有聊天记录 -->
    <template v-else>
      <!-- 日期分割线 -->
      <div class="flex justify-center mb-2">
        <span class="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">今天</span>
      </div>

      <div
        v-for="record in safeChatRecords"
        :key="record.id"
        class="flex items-start gap-3"
        :class="{ 'justify-end': record.type === 'user' }"
      >
        <template v-if="record.type === 'user'">
          <div class="max-w-[70%] relative group">
            <!-- 撤回按钮 -->
            <button
              v-if="record.content !== '你撤回了一条消息' && !record.isWithdrawn"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
              @click.stop="handleWithdraw(record.id)"
              title="撤回消息"
            >
              撤回
            </button>

            <!-- 文本消息 -->
            <div
              v-if="
                record.msgType === 'text' ||
                (!record.isImage && !record.isGoods && !record.isService)
              "
              class="bg-blue-500 p-4 rounded-tr-none rounded-lg shadow-sm text-white"
              :class="{ 'opacity-60 line-through': record.isWithdrawn }"
            >
              <p class="text-sm">
                {{ record.isWithdrawn ? '你撤回了一条消息' : record.content }}
              </p>
            </div>

            <!-- 图片消息 -->
            <div v-else-if="record.isImage" class="bg-transparent">
              <img
                :src="record.imageUrl"
                alt="图片"
                class="max-w-[200px] max-h-[200px] rounded-lg shadow-sm object-cover"
                :class="{ 'opacity-60': record.isWithdrawn }"
                @click="previewImage(record.imageUrl)"
              />
              <span v-if="record.isWithdrawn" class="text-xs text-gray-400 block text-right mt-1">
                你撤回了一张图片
              </span>
            </div>

            <div
              v-else-if="record.msgType === 'product' && record.goodsInfo"
              class="bg-blue-500 p-2 rounded-tr-none rounded-lg shadow-sm"
            >
              <div class="bg-white rounded p-2 w-52">
                <img
                  :src="record.goodsInfo.mainImage"
                  class="w-full h-24 object-cover rounded mb-1"
                />
                <div class="text-xs font-medium line-clamp-2 text-gray-800">
                  {{ record.goodsInfo.title }}
                </div>
                <div class="text-blue-500 text-sm font-bold mt-1">
                  ¥{{ record.goodsInfo.currentPrice }}
                </div>
                <div class="text-xs text-gray-500 mt-1">已售 {{ record.goodsInfo.sales }} 件</div>
              </div>
            </div>

            <div
              v-else-if="record.msgType === 'service' && record.serviceInfo"
              class="bg-blue-500 p-2 rounded-tr-none rounded-lg shadow-sm"
            >
              <div class="bg-white rounded p-2 w-52">
                <img
                  v-if="record.serviceInfo.mainImage"
                  :src="record.serviceInfo.mainImage"
                  class="w-full h-24 object-cover rounded mb-1"
                />
                <div class="text-xs font-medium line-clamp-2 text-gray-800">
                  {{ record.serviceInfo.title }}
                </div>
                <div class="text-blue-500 text-sm font-bold mt-1">
                  ¥{{ record.serviceInfo.basePrice }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  适用宠物：{{ record.serviceInfo.petTypes }}
                </div>
              </div>
            </div>

            <!-- 时间 -->
            <span class="text-xs text-gray-400 mt-1 block text-right">
              {{ record.time }}
            </span>
          </div>

          <!-- 用户头像 -->
          <img
            src="https://picsum.photos/id/64/120/120"
            alt="头像"
            class="w-10 h-10 rounded-full object-cover"
          />
        </template>

        <template v-else>
          <img :src="safeActiveShop.avatar" class="w-10 h-10 rounded-full object-cover" />

          <div class="max-w-[70%]">
            <!--文本消息 -->
            <div
              v-if="
                record.msgType === 'text' ||
                (!record.isImage && !record.isGoods && !record.isService)
              "
              class="bg-white p-4 rounded-tl-none rounded-lg shadow-sm border border-gray-100"
            >
              <p class="text-sm">{{ record.content }}</p>
            </div>

            <!-- 2. 图片消息 -->
            <div v-else-if="record.isImage" class="bg-transparent">
              <img
                :src="record.imageUrl"
                class="max-w-[200px] max-h-[200px] rounded-lg shadow-sm object-cover"
                @click="previewImage(record.imageUrl)"
              />
            </div>

            <!-- 商品卡片 -->
            <div
              v-else-if="(record.msgType === 'product' || record.isGoods) && record.goodsInfo"
              class="overflow-hidden bg-white rounded-xl shadow-sm w-[200px] border border-gray-100"
            >
              <img :src="record.goodsInfo.mainImage" class="w-full h-[120px] object-cover" />
              <div class="p-2">
                <div class="text-sm font-medium text-gray-800 line-clamp-2">
                  {{ record.goodsInfo.title }}
                </div>
                <div class="mt-1 text-blue-600 font-bold text-base">
                  ¥{{ record.goodsInfo.currentPrice }}
                </div>
                <div class="text-xs text-gray-400 mt-0.5">已售 {{ record.goodsInfo.sales }} 件</div>
              </div>
            </div>

            <!-- 服务卡片 -->
            <div
              v-else-if="(record.msgType === 'service' || record.isService) && record.serviceInfo"
              class="overflow-hidden bg-white rounded-xl shadow-sm w-[200px] border border-gray-100"
            >
              <img
                v-if="record.serviceInfo.mainImage"
                :src="record.serviceInfo.mainImage"
                class="w-full h-[120px] object-cover"
              />
              <div class="p-2">
                <div class="text-sm font-medium text-gray-800 line-clamp-2">
                  {{ record.serviceInfo.title }}
                </div>
                <div class="mt-1 text-blue-600 font-bold text-base">
                  ¥{{ record.serviceInfo.currentPrice }}
                </div>
                <div class="text-xs text-gray-400 mt-0.5">
                  已售 {{ record.serviceInfo.sales }} 件
                </div>
              </div>
            </div>

            <!-- 时间 -->
            <span class="text-xs text-gray-400 mt-1 block">
              {{ record.time }}
            </span>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import type { ChatRecord } from '@/types/chat'

interface ActiveShop {
  shopId: number
  shopName: string
  shopAvatar: string
  userId: number
}

const props = defineProps<{
  activeShop?: ActiveShop
  chatRecords?: ChatRecord[]
}>()

const emit = defineEmits<{
  (e: 'withdraw-message', recordId: string): void
  (e: 'preview-image', url: string): void
}>()

const chatContentRef = ref<HTMLDivElement>(null)

const safeActiveShop = computed(() => ({
  avatar: 'https://picsum.photos/id/237/120/120',
  name: '商家',
  ...props.activeShop,
}))

const safeChatRecords = computed(() => (Array.isArray(props.chatRecords) ? props.chatRecords : []))

const handleWithdraw = (recordId: string) => {
  if (!recordId) return
  emit('withdraw-message', recordId)
}

const previewImage = (url: string) => {
  emit('preview-image', url)
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  }, 0)
}

watch(() => safeChatRecords.value, scrollToBottom, { deep: true, immediate: true })
onMounted(scrollToBottom)
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.flex.items-start {
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
