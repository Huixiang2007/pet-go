<template>
  <div class="bg-gray-100 min-h-screen text-gray-800 font-['Microsoft_Yahei',sans-serif]">
    <div
      class="sticky top-0 z-10 h-12 bg-[#edcf60] shadow-sm flex items-center px-5 justify-between"
    >
      <h2 class="text-lg font-semibold text-gray-500">物流详情</h2>
      <div class="flex space-x-5">
        <router-link to="/order" class="text-gray-600 text-sm no-underline hover:text-gray-900">
          我的订单
        </router-link>
        <router-link to="/shop" class="text-gray-600 text-sm no-underline hover:text-gray-900">
          首页
        </router-link>
      </div>
    </div>

    <!-- 物流内容 -->
    <div class="max-w-5xl mx-auto px-4 py-5">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-5">
        <div class="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
          <div class="text-base font-semibold text-[#f3ce48]">
            {{ waybillInfo.status }}
          </div>
          <div class="flex items-center space-x-2">
            <img src="/img/dog.png" alt="" class="w-[40px] h-[40px]" />
            <div class="text-sm text-gray-600">运单号：{{ waybillInfo.waybillNo }}</div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
          <div v-for="(value, key) in waybillInfo.details" :key="key" class="flex flex-col">
            <span class="text-gray-400 text-xs mb-1.5">{{ key }}</span>
            <span class="text-gray-800">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- 物流轨迹 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="text-base font-semibold mb-5">物流轨迹</div>
        <div class="relative pl-7">
          <div class="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-100"></div>

          <div class="relative mb-7" v-for="(item, index) in logisticsData" :key="index">
            <div
              class="absolute left-[-22px] top-0 rounded-full z-10"
              :class="[index === 0 ? 'w-5 h-5 left-[-24px] bg-[#f3ce48]' : 'w-4 h-4 bg-gray-200']"
            ></div>
            <!-- 物流内容 -->
            <div class="flex flex-col gap-1">
              <div class="text-xs text-gray-400">{{ item.time }}</div>
              <div class="text-sm text-gray-800 leading-relaxed">{{ item.desc }}</div>
            </div>
          </div>
        </div>

        <div class="mt-7 flex gap-2.5 flex-wrap">
          <button
            class="px-5 py-2.5 rounded bg-[#f3ce48] text-white text-sm hover:bg-[#ef7412] transition-colors"
            @click="contactCourier"
          >
            联系配送员
          </button>
          <button
            class="px-5 py-2.5 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
            @click="buyAgain"
          >
            再次购买
          </button>
          <button
            class="px-5 py-2.5 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
            @click="viewOrder"
          >
            查看订单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 运单信息
const waybillInfo = ref({
  status: '已签收',
  waybillNo: '7628941357892',
  details: {
    快递公司: '顺丰速运',
    寄件地址: '广东省深圳市南山区',
    收件地址: '北京市朝阳区建国路88号',
    收件人: '张先生 138****1234',
  },
})

// 物流
const logisticsData = ref([
  {
    time: '2025-11-19 18:30:25',
    desc: '【北京市】快件已被张先生（门卫代收）签收，感谢使用顺丰速运！',
  },
  {
    time: '2025-11-19 16:20:10',
    desc: '【北京市】快递员小李（139****5678）正在为您派送，请保持电话畅通',
  },
  {
    time: '2025-11-19 10:05:33',
    desc: '【北京市】快件已到达朝阳区建国路配送站',
  },
  {
    time: '2025-11-18 22:40:15',
    desc: '【北京市】快件已从首都机场转运中心发出，下一站朝阳区建国路配送站',
  },
  {
    time: '2025-11-18 18:15:42',
    desc: '【北京市】快件已到达首都机场转运中心',
  },
  {
    time: '2025-11-17 23:00:08',
    desc: '【广东省】快件已从深圳宝安集散中心发出，下一站北京首都机场转运中心',
  },
  {
    time: '2025-11-17 20:25:30',
    desc: '【广东省深圳市】快件已被顺丰小哥揽收，揽收员：王师傅（137****9876）',
  },
])

const contactCourier = () => {
  alert('正在联系配送员，电话：139****5678')
}

const buyAgain = () => {
  alert('跳转到商品详情页，执行再次购买逻辑')
}

const viewOrder = () => {
  alert('跳转到订单详情页面')
}
</script>

<style scoped></style>
