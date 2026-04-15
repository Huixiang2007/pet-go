<template>
  <div class="w-72 border-l border-gray-200 bg-white flex flex-col">
    <!-- 商家/寄养机构信息 -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="props.activeShop?.shopAvatar || props.activeShop?.fosterProviderAvatar"
            :src="props.activeShop?.shopAvatar || props.activeShop?.fosterProviderAvatar"
            alt="头像"
            class="w-full h-full object-cover"
          />
          <i v-else class="fa fa-paw text-blue-500 text-xl"></i>
        </div>
        <div>
          <h3 class="font-medium text-gray-800">
            {{ props.activeShop?.shopName || props.activeShop?.fosterProviderName || '寄养机构' }}
          </h3>
          <div class="flex items-center mt-1">
            <span class="text-green-500 text-xs flex items-center">
              <i class="fa fa-shield mr-1"></i> 已认证
            </span>
          </div>
        </div>
      </div>

      <router-link
        v-if="chatType === 'shop'"
        :to="{ path: '/store', query: { id: props.activeShop?.shopId } }"
        class="mt-4 w-full bg-blue-500 text-white text-sm py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <i class="fa fa-comment-o"></i> 进店逛逛
      </router-link>
      <router-link
        v-else
        :to="{ path: `/foster-detail/${props.activeShop?.fosterProviderId}` }"
        class="mt-4 w-full bg-blue-500 text-white text-sm py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <i class="fa fa-home"></i> 查看寄养机构
      </router-link>
    </div>

    <div
      v-if="
        (chatType === 'shop' && goods.length > 0) ||
        (chatType === 'foster' && fosterServices.length > 0)
      "
      class="p-4 border-b border-gray-200 max-h-[400px] overflow-y-auto"
    >
      <h4 class="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
        <i
          :class="chatType === 'shop' ? 'fa fa-shopping-bag' : 'fa fa-paw'"
          class="text-blue-500"
        ></i>
        {{ chatType === 'shop' ? '聊天中商品' : '寄养服务' }}
      </h4>

      <!-- 商家商品 -->
      <template v-if="chatType === 'shop'">
        <div
          v-for="item in goods"
          :key="item.id"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 last:mb-0 hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col gap-3">
            <img
              :src="item.mainImage"
              :alt="item.title"
              class="w-full h-16 object-cover rounded-lg shadow-sm"
            />
            <div>
              <h5 class="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                {{ item.title }}
              </h5>
              <p class="text-blue-500 text-lg font-bold mt-2">¥{{ item.currentPrice }}</p>
              <div class="flex justify-between items-center mt-3">
                <span class="text-xs text-gray-500">已售 {{ item.sales }} 件</span>
                <div class="flex gap-3">
                  <router-link
                    :to="{ path: `/product-detail/${item.id}` }"
                    class="text-blue-500 text-xs hover:underline"
                  >
                    查看详情
                  </router-link>
                  <span
                    class="text-green-500 text-xs flex items-center cursor-pointer hover:text-green-600 transition-colors"
                    @click="sendGoods(item.id)"
                  >
                    <i class="fa fa-paper-plane mr-1"></i> 发送
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 寄养服务 -->
      <template v-else>
        <div
          v-for="item in fosterServices"
          :key="item.id"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 last:mb-0 hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col gap-3">
            <img
              v-if="item.mainImage"
              :src="item.mainImage"
              :alt="item.title"
              class="w-full h-16 object-cover rounded-lg shadow-sm"
            />
            <div>
              <h5 class="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                {{ item.title }}
              </h5>
              <p class="text-blue-500 text-lg font-bold mt-2">¥{{ item.basePrice }}</p>
              <div class="flex justify-between items-center mt-3">
                <span class="text-xs text-gray-500">适用宠物：{{ item.petTypes || '全品类' }}</span>
                <div class="flex gap-3">
                  <router-link
                    :to="{ path: `/foster-detail/${props.activeShop?.shopId}` }"
                    class="text-blue-500 text-xs hover:underline"
                  >
                    查看详情
                  </router-link>
                  <span
                    class="text-green-500 text-xs flex items-center cursor-pointer hover:text-green-600 transition-colors"
                    @click="sendGoods(item.id)"
                  >
                    <i class="fa fa-paper-plane mr-1"></i> 发送
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 空状态提示 -->
    <div
      v-if="
        (chatType === 'shop' && goods.length === 0) ||
        (chatType === 'foster' && fosterServices.length === 0)
      "
      class="p-4 border-b border-gray-200 text-center py-10"
    >
      <i
        :class="chatType === 'shop' ? 'fa fa-shopping-bag' : 'fa fa-paw'"
        class="text-gray-300 text-4xl mb-3"
      ></i>
      <p class="text-gray-500 text-sm">
        {{ chatType === 'shop' ? '暂无聊天商品' : '暂无寄养服务' }}
      </p>
    </div>

    <!-- 返回按钮 -->
    <div
      @click="GoBack"
      class="m-4 text-center py-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all shadow-sm"
    >
      <span class="align-middle">返回上一页</span>
      <i class="fa fa-arrow-left ml-1"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getShopGoods,
  sendShopMessage,
  getFosterGoods,
  sendFosterGoodsMessage,
} from '@/api/message/chat'

const props = defineProps<{
  activeShop: any
  chatType: string
}>()
const emit = defineEmits<{
  send: []
}>()
const chatType = computed(() => props.chatType)

const goods = ref<
  Array<{
    id: number
    title: string
    currentPrice: number
    sales: number
    mainImage: string
  }>
>([])

const fosterServices = ref<
  Array<{
    id: number
    title: string
    basePrice: number
    petTypes: string
    mainImage: string
    description: string
  }>
>([])

// 获取商品/寄养服务列表
const getGoods = async () => {
  if (!props.activeShop?.shopId) return
  try {
    if (chatType.value === 'shop') {
      const res = await getShopGoods(props.activeShop.shopId, 1, 1000)
      console.log('获取商品成功:', res.records)
      goods.value = res.records
    } else {
      const res = await getFosterGoods(props.activeShop.shopId, 1, 10)
      console.log('获取寄养服务成功:', res.records)
      fosterServices.value = res.records
    }
  } catch (err) {
    console.error('获取聊天对象商品/服务失败', err)
  }
}

// 发送商品/寄养服务到聊天
const sendGoods = async (itemId: number) => {
  if (!props.activeShop.userId) {
    console.warn('接收者ID无效，无法发送')
    return
  }
  console.log('接收者userId:', props.activeShop.userId, '商品/服务ID:', itemId)
  try {
    if (chatType.value === 'shop') {
      const res = await sendShopMessage(props.activeShop.userId, itemId)
      console.log('发送商品成功:', res)
      emit('send')
      ElMessage.success('发送成功')
    } else {
      const res = await sendFosterGoodsMessage(props.activeShop.userId, itemId)
      console.log('发送寄养服务成功:', res)
      emit('send')
      ElMessage.success('发送成功')
    }
  } catch (err) {
    console.error('发送失败', err)
  }
}

// 返回上一页
const GoBack = () => {
  window.history.back()
}

watch(
  () => props.activeShop,
  (newShop) => {
    goods.value = []
    fosterServices.value = []
    if (newShop?.shopId) {
      getGoods()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
/* 商品列表滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 2px;
}
</style>
