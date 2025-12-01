<template>
  <div class="min-h-screen bg-blue-50 py-8 flex justify-center items-center px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-[85vh] flex flex-row overflow-hidden">
      <!-- 聊天列表 -->
      <div class="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-comments text-blue-500 text-lg"></i>
            <span class="font-bold text-gray-800 text-lg">聊天列表</span>
          </div>
        </div>

        <div class="p-3">
          <div class="relative">
            <input
              type="text"
              placeholder="搜索宝贝或联系人"
              class="w-full pl-10 pr-4 py-2 bg-white rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
            >
            <i class="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-white">
          <div class="flex flex-col">
            <div class="flex items-center p-4 border-b border-gray-100 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
              <img src="https://picsum.photos/id/237/120/120" alt="店铺头像" class="w-12 h-12 rounded-full border-2 border-blue-500 object-cover">
              <div class="ml-3 flex-1 min-w-0">
                <h1 class="text-base font-bold text-gray-800">小明的店铺</h1>
                <p class="text-xs text-gray-500 truncate">您的订单已发货，请注意查收</p>
              </div>
              <span class="text-xs text-white bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">2</span>
            </div>

            <div class="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-100 transition-colors">
              <img src="https://picsum.photos/id/169/120/120" alt="店铺头像" class="w-12 h-12 rounded-full border-2 border-transparent object-cover">
              <div class="ml-3 flex-1 min-w-0">
                <h1 class="text-base font-bold text-gray-800">旧书网四川旧书城</h1>
                <p class="text-xs text-gray-500 truncate">请确认收货地址信息</p>
              </div>
              <span class="text-xs text-gray-400">10:27</span>
            </div>

            <div class="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-100 transition-colors">
              <img src="https://picsum.photos/id/1074/120/120" alt="店铺头像" class="w-12 h-12 rounded-full border-2 border-transparent object-cover">
              <div class="ml-3 flex-1 min-w-0">
                <h1 class="text-base font-bold text-gray-800">PetGo优品生活馆</h1>
                <p class="text-xs text-gray-500 truncate">您的宠物零食已打包完毕</p>
              </div>
              <span class="text-xs text-gray-400">昨天</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 对话框 -->
      <div class="flex-1 flex flex-col bg-gray-50">
        <div class="bg-white border-b border-gray-200 p-2">
          <div class="flex rounded-lg overflow-hidden border border-gray-200 w-fit">
              <button
              @click="isAiService = true"
              class="px-4 py-1.5 text-sm font-medium transition-colors"
              :class="isAiService ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              <i class="fa fa-robot mr-1"></i>AI客服
            </button>
            <button
              @click="isAiService = false"
              class="px-4 py-1.5 text-sm font-medium transition-colors"
              :class="!isAiService ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              人工客服
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
          <div class="flex items-center gap-3">
            <img
              :src="isAiService ? 'https://picsum.photos/id/180/120/120' : 'https://picsum.photos/id/169/120/120'"
              alt="客服头像"
              class="w-10 h-10 rounded-full object-cover"
            >
            <h2 class="font-medium text-gray-800">
              {{ isAiService ? '智能AI客服' : '旧书网四川旧书城' }}
            </h2>
          </div>
        </div>

        <!-- 聊天内容区 -->
        <div class="flex-1 p-4 overflow-y-auto space-y-6">
          <div class="flex justify-center">
            <span class="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">今天14:45</span>
          </div>


          <div v-if="!isAiService" class="flex items-start gap-3">
            <img src="https://picsum.photos/id/169/120/120" alt="商家头像" class="w-10 h-10 rounded-full object-cover" >
            <div class="max-w-[70%]">
              <div class="bg-white p-4 rounded-tl-none rounded-lg shadow-sm border border-gray-100">
                <p class="text-sm mb-3 text-gray-800">请确认收货地址</p>

                <!-- 商品信息 -->
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex gap-3 mt-2">
                  <img src="https://picsum.photos/60/60?book" alt="二手书" class="w-16 h-16 object-cover rounded-md shadow-sm">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium line-clamp-2 text-gray-800">二手正版 工程数学 线性代数 第六版 同济</h4>
                    <p class="text-blue-500 text-base mt-1 font-bold">¥40.00</p>
                  </div>
                </div>

                <!-- 地址信息 -->
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3 text-sm">
                  <p class="text-gray-500">收货人：李**</p>
                  <p class="text-gray-500 mt-1">手机号码：138****6789</p>
                  <p class="text-gray-500 mt-1 line-clamp-2">收货地址：四川省成都市武侯区XX街道XX路XX号XX小区X栋X单元XXX号</p>
                </div>

                <div class="flex gap-3 mt-4">
                  <button class="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm">确认收货</button>
                  <button class="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">取消</button>
                </div>
              </div>
              <span class="text-xs text-gray-400 mt-1 block">10:27</span>
            </div>
          </div>

          <div v-if="isAiService" class="flex items-start gap-3">
            <img src="https://picsum.photos/id/180/120/120" alt="AI客服头像" class="w-10 h-10 rounded-full object-cover" >
            <div class="max-w-[70%]">
              <div class="bg-white p-4 rounded-tl-none rounded-lg shadow-sm border border-gray-100">
                <p class="text-sm text-gray-800">您好！我是智能客服小蓝，很高兴为您服务～</p>
                <p class="text-sm text-gray-800 mt-2">请问您需要查询订单状态、修改收货地址，还是了解商品退货政策呢？</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  <button class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                    查询订单状态
                  </button>
                  <button class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                    修改收货地址
                  </button>
                  <button class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                    退货政策
                  </button>
                </div>
              </div>
              <span class="text-xs text-gray-400 mt-1 block">10:30</span>
            </div>
          </div>

          <div class="flex items-start gap-3 justify-end">
            <div class="max-w-[70%]">
              <div class="bg-blue-500 p-4 rounded-tr-none rounded-lg shadow-sm text-white">
                <p class="text-sm">我想修改一下收货地址</p>
              </div>
              <span class="text-xs text-gray-400 mt-1 block text-right">10:28</span>
            </div>
            <img src="https://picsum.photos/id/64/120/120" alt="用户头像" class="w-10 h-10 rounded-full object-cover" >
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-200 p-4 bg-white">
          <div class="flex items-end gap-3">
            <textarea
              v-model="message"
              placeholder="请输入消息，按Enter键或点击发送按钮发送"
              class="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none h-20 transition-all"
              @keydown.enter.prevent="sendMessage"
            ></textarea>
            <button
              class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              @click="sendMessage"
            >
              <i class="fa fa-paper-plane"></i>
            </button>
          </div>

          <div class="flex justify-between items-center text-xs text-gray-400 mt-3">
            <span>{{ message.length }}/300</span>
            <div class="flex gap-4">
              <i class="fa fa-smile-o cursor-pointer hover:text-blue-500 transition-colors"></i>
              <i class="fa fa-paperclip cursor-pointer hover:text-blue-500 transition-colors"></i>
              <button class="hover:text-blue-500 transition-colors">消息设置</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 商家信息-->
      <div class="w-72 border-l border-gray-200 bg-white flex flex-col">
        <div v-if="!isAiService">
          <!-- 原有店铺信息 -->
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fa fa-book text-blue-500 text-xl"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-800">旧书网四川旧书城</h3>
                <div class="flex items-center mt-1">
                  <span class="text-green-500 text-xs flex items-center"><i class="fa fa-shield mr-1"></i> 已认证</span>
                </div>
              </div>
            </div>

            <button class="mt-4 w-full bg-blue-500 text-white text-sm py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2">
              <i class="fa fa-comment-o"></i> 进店逛逛
            </button>
          </div>

          <!-- 聊天中商品 -->
          <div class="p-4 border-b border-gray-200">
            <h4 class="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
              <i class="fa fa-shopping-bag text-blue-500"></i>
              聊天中商品
            </h4>

            <div class="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100">
              <div class="flex gap-3">
                <img src="https://picsum.photos/60/60?book2" alt="二手书" class="w-16 h-16 object-cover rounded-md shadow-sm flex-shrink-0">
                <div class="flex-1 min-w-0">
                  <h5 class="text-sm font-medium line-clamp-2 text-gray-800">二手正版 工程数学 线性代数 第六版 同济</h5>
                  <p class="text-blue-500 text-base mt-1 font-bold">¥40.00</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">已售 23件</span>
                    <button class="text-blue-500 text-xs hover:underline">查看详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 店铺服务 -->
          <div class="p-4 flex-1">
            <h4 class="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
              <i class="fa fa-star text-blue-500"></i>
              店铺服务
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                <i class="fa fa-truck text-blue-500 mb-1"></i>
                <p class="text-xs text-gray-700">包邮</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                <i class="fa fa-refresh text-blue-500 mb-1"></i>
                <p class="text-xs text-gray-700">7天无理由</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                <i class="fa fa-shield text-blue-500 mb-1"></i>
                <p class="text-xs text-gray-700">正品保障</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                <i class="fa fa-comments text-blue-500 mb-1"></i>
                <p class="text-xs text-gray-700">24h客服</p>
              </div>
            </div>
          </div>
        </div>

        <!-- AI客服 -->
        <div v-if="isAiService" class="p-4 flex-1">
          <div class="p-4 border-b border-gray-200 text-center">
            <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <i class="fa fa-robot text-blue-500 text-2xl"></i>
            </div>
            <h3 class="font-medium text-gray-800 mt-3">智能AI客服</h3>
            <p class="text-xs text-gray-500 mt-1">24小时在线，即时响应</p>
          </div>

          <!-- AI服务 -->
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-800 mb-4">常用服务</h4>
            <div class="space-y-3">
              <button class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fa fa-search text-blue-500 w-5 text-center"></i>
                <span class="text-sm text-gray-700 text-left">订单查询</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fa fa-map-marker text-blue-500 w-5 text-center"></i>
                <span class="text-sm text-gray-700 text-left">修改收货地址</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fa fa-refresh text-blue-500 w-5 text-center"></i>
                <span class="text-sm text-gray-700 text-left">退换货申请</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fa fa-question-circle text-blue-500 w-5 text-center"></i>
                <span class="text-sm text-gray-700 text-left">常见问题解答</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const isAiService = ref(true)
const message = ref('')

// 发送消息
const sendMessage = () => {
  if (!message.value.trim()) return
  console.log('发送消息:', message.value)
  message.value = ''
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
