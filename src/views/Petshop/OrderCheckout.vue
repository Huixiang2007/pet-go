<!-- //订单结算 -->
<template>
   <NavBar />
   <div class="min-h-screen bg-yellow-50">
    <div class="bg-white py-4 border-b border-gray-200 mt-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between max-w-3xl mx-auto">
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-[#f3ce48] text-white flex items-center justify-center mb-2">
            <i class="fa fa-shopping-cart"></i>
          </div>
          <span class="text-sm font-medium text-[#333333]">购物车</span>
        </div>

        <div class="flex-1 h-1 mx-2 bg-[#f3ce48]"></div>

        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-[#f3ce48] text-white flex items-center justify-center mb-2">
            <i class="fa fa-map-marker"></i>
          </div>
          <span class="text-sm font-medium text-[#333333]">确认订单</span>
        </div>

        <div class="flex-1 h-1 mx-2 bg-gray-200"></div>

        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-gray-200 text-white flex items-center justify-center mb-2">
            <i class="fa fa-credit-card"></i>
          </div>
          <span class="text-sm font-medium text-[#333333]">支付</span>
        </div>
      </div>
    </div>
  </div>
   <main class="container mx-auto px-4 py-8 flex flex-row justify-center">
    <div class="flex flex-col items-between w-[60%]">
      <!-- 左侧订单信息 -->
      <div class="mr-4">
        <!-- 收货地址 -->
        <section class="bg-white rounded-xl p-6 card-shadow">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold">收货地址</h2>
            <button class="text-[#f3ce48] hover:text-[#f3ce48]/80 text-sm flex items-center transition-base">
              <i class="fa fa-plus-circle mr-1"></i> 新增地址
            </button>
          </div>

          <div v-for="value in address" :key="value.id"
             class="border-2 rounded-lg p-4 relative mt-3"
             :class="{'border-[#f3ce48] bg-[#f3ce48]/5': value.isDefault,
              ':hover:border-[#f3ce48] bg-[#f3ce48]/5 ': true,
             }"
             @click="setDefault(value.id)">
            <!-- 选中的地址 -->
             <div>
              <div v-if="value.isDefault" class="absolute top-3 right-3 bg-[#f3ce48] text-white text-xs px-2 py-1 rounded">默认</div>
              <div class="font-medium mb-2">{{value.name}}</div>
              <div class="text-sm text-gray-600 mb-1">138****6789</div>
              <div class="text-sm text-gray-600">北京市朝阳区建国路88号 现代城5号楼2307室</div>
                <button class="text-xs text-gray-400 mt-2 mr-1 border-[1px] w-12 h-5 border-gray-200 rounded-2xl hover:text-[#f3ce48] hover:border-[#f3ce48]">编辑</button>
                <button class="text-xs text-gray-400 mt-2 border-[1px] w-12 h-5 border-gray-200 rounded-2xl hover:text-red-500 hover:border-red-500">删除</button>
            </div>
            </div>

        </section>

        <!-- 优惠券 -->
        <section class="bg-white rounded-xl p-6 card-shadow">
          <h2 class="text-lg font-semibold mb-4">优惠券</h2>

          <div class="space-y-3">
            <!-- 循环渲染优惠券 -->
            <div
              v-for="coupon in coupons"
              :key="coupon.id"
              :class="[
                'rounded-lg p-4 transition-base cursor-pointer flex justify-between items-center',
                coupon.isSelected
                  ? 'border-2 border-primary bg-primary/5'  // 选中状态
                  : 'border border-gray-200 hover:border-primary/50'  // 未选中状态
              ]"
              @click="selectCoupon(coupon.id)"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  :class="coupon.isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'"
                >
                  <i class="fa fa-ticket"></i>
                </div>
                <div>
                  <div class="font-medium">{{ coupon.discount }}</div>
                  <div class="text-xs text-gray-400">有效期至{{ coupon.validity }}</div>
                </div>
              </div>
              <i
                class="text-lg"
                :class="coupon.isSelected
                  ? 'fa fa-check-circle text-red-200'
                  : 'fa fa-circle-o text-gray-400'"
              ></i>
            </div>

            <button class="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-primary hover:border-primary/50 transition-base text-sm">
              查看更多优惠券 <i class="fa fa-angle-right ml-1"></i>
            </button>
          </div>
                </section>
              </div>

      <!-- 右侧订单摘要 -->
      <div class="shadow-gary-300 rounded-xl pt-6 ">
        <div class="bg-white rounded-xl p-6 top-24">
          <h2 class="text-lg font-semibold mb-6">订单摘要</h2>

          <!-- 费用明细 -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-light">商品总价</span>
              <span>¥209.70</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-light">运费</span>
              <span>¥0.00</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-light">优惠券折扣</span>
              <span class="text-green-500">-¥30.00</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-light">积分抵扣</span>
              <span>¥0.00</span>
            </div>
          </div>

          <hr class="my-4 border-gray-100">

          <!-- 实付款 -->
          <div class="flex justify-between font-semibold text-lg mb-6">
            <span>实付款</span>
            <span>¥179.70</span>
          </div>

          <!-- 支付方式 -->
        <div>
          <h3 class="text-sm font-medium mb-3">支付方式</h3>
          <div class="grid grid-cols-2 gap-2">
            <!-- 支付宝选项 -->
            <div
              class="rounded-lg p-3 flex flex-col items-center transition-base cursor-pointer"
              :class="selectedPayType === 'alipay'
                ? 'border-[#1677FF] bg-[#E8F3FF]'
                : 'border-gray-200 hover:border-gray-300'"
              @click="handleSelectPay('alipay')"
            >
              <i class="fa fa-credit-card text-xl mb-1" :class="selectedPayType === 'alipay' ? 'text-[#1677FF]' : ''"></i>
              <span class="text-xs" :class="selectedPayType === 'alipay' ? 'text-[#1677FF] font-medium' : ''">支付宝提交支付</span>
            </div>

            <!-- 微信支付选项 -->
            <div
              class="rounded-lg p-3 flex flex-col items-center transition-base cursor-pointer"
              :class="selectedPayType === 'wechat'
                ? 'border-[#07C160] bg-[#F0FFF4]'
                : 'border-gray-200 hover:border-gray-300'"
              @click="handleSelectPay('wechat')"
            >
              <i class="fa fa-comment-dots text-xl mb-1" :class="selectedPayType === 'wechat' ? 'text-[#07C160]' : ''"></i>
              <span class="text-xs" :class="selectedPayType === 'wechat' ? 'text-[#07C160] font-medium' : ''">微信提交支付</span>
            </div>
          </div>
        </div>
          <div class="flex justify-center mt-4 text-xs text-[#333333]">
            <i class="fa fa-lock mr-1"></i> 支付安全由SSL加密保护
          </div>
        </div>
      </div>
    </div>
    <div class="w-[40%]">
       <!-- 商品清单 -->
        <section class="bg-white rounded-xl p-6 card-shadow">
          <h2 class="text-lg font-semibold mb-6">商品清单</h2>

          <div class="space-y-6">
            <!-- 商品1 -->
            <div class="flex items-center gap-4 pb-6 border-b border-gray-100">
              <img src="https://picsum.photos/100/100?random=1" alt="天然狗粮" class="w-20 h-20 object-cover rounded-md">
              <div class="flex-1">
                <h3 class="font-medium">天然狗粮 成犬专用 高蛋白营养配方</h3>
                <p class="text-sm text-light mt-1">规格：1.5kg/袋</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-primary font-medium">¥89.90</span>
                  <span class="text-sm">x2</span>
                </div>
              </div>
            </div>

            <!-- 商品2 -->
            <div class="flex items-center gap-4 pb-6 border-b border-gray-100">
              <img src="https://picsum.photos/100/100?random=2" alt="宠物指甲剪" class="w-20 h-20 object-cover rounded-md">
              <div class="flex-1">
                <h3 class="font-medium">宠物指甲剪 防刮伤设计</h3>
                <p class="text-sm text-light mt-1">规格：通用款</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-primary font-medium">¥29.90</span>
                  <span class="text-sm">x1</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 订单备注 -->
          <div class="mt-6">
            <label class="block text-sm font-medium mb-2">订单备注</label>
            <textarea
              class="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-base resize-none"
              rows="2"
              placeholder="请输入特殊要求（如送货时间等）"
            ></textarea>
          </div>
        </section>
    </div>
  </main></div>
  <!-- 支付弹窗 -->
  <div v-if="popupVisible" class="popup-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="popup-content bg-white rounded-lg w-1/2 max-h-[80vh] overflow-auto p-6">
        <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold mb-4">订单提交成功，请尽快付款！</h2>
      <div class="flex justify-between text-sm mb-6">
        <span>订单号：20250518000123456</span>
        <span class="text-primary font-medium">应付金额：¥42.00 元</span>
      </div>
          <button class="text-gray-500 hover:text-gray-700" @click="popupVisible = false">
          <i class="fa fa-times text-xl"></i>
          </button>
        </div>
        <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="w-full md:w-1/2">
          <div class="bg-white border border-gray-200 rounded-lg p-4 qr-shadow">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">
              {{ selectedPayType === 'alipay' ? '支付宝支付' : '微信支付' }}
            </h3>
              <span class="text-xs text-secondary">距离二维码过期还剩 <span class="countdown-text" id="countdown">69</span> 秒</span>
            </div>
               <!-- 二维码图片动态切换 -->
          <div class="flex justify-center mb-3">
            <img
              :src="selectedPayType === 'alipay'
                ? 'https://picsum.photos/200/200?random=3'
                : 'https://picsum.photos/200/200?random=1'"
              :alt="selectedPayType === 'alipay' ? '支付宝支付二维码' : '微信支付二维码'"
              class="w-48 h-48"
            >
          </div>
            <button class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              请使用微信扫一扫 扫描二维码支付
            </button>
          </div>
        </div>

        <div class="w-full md:w-1/2">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-3">支付引导</h3>
            <div class="flex items-center mb-4">
               <img
              :src="selectedPayType === 'alipay'
                ? 'https://picsum.photos/80/80?random=4'
                : 'https://picsum.photos/80/80?random=2'"
              :alt="selectedPayType === 'alipay' ? '支付宝操作指引' : '微信操作指引'"
              class="w-20 h-20 mr-3"
            >
              <div>
               <p class="text-sm" v-if="selectedPayType === 'alipay'">打开支付宝</p>
              <p class="text-sm" v-else>打开微信</p>

                <p class="text-sm">点击「扫一扫」</p>
                <p class="text-sm">扫描上方二维码完成支付</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <p class="text-sm text-secondary">
                <i class="fa fa-info-circle mr-1"></i> 若二维码过期，请刷新页面获取新码
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const popupVisible = ref(false)
const selectedPayType = ref<string>('')
const countdown = ref<number>(69)
const countdownTimer = ref<number | null>(null)
//优惠卷
const  coupons=ref([
        {
          id: 1,
          discount: '满199减30',
          validity: '2023-12-31',
          isSelected: true  // 默认选中第一张
        },
        {
          id: 2,
          discount: '满99减10',
          validity: '2023-12-15',
          isSelected: false
        },
        {
          id: 3,
          discount: '满299减50',
          validity: '2023-12-20',
          isSelected: false
        }
      ])
function selectCoupon(selectedId: number) {
  coupons.value.forEach(coupon => {
    coupon.isSelected = coupon.id === selectedId
  })
  console.log()
}
//地址的选择
const address=ref([
  {
    id:1,
    name:'张三',
    phone:'12345678901',
    address:'中国上海徐汇区',
    isDefault:true,
  },
  {
    id:2,
    name:'张三',
    phone:'12345678901',
    address:'中国上海徐汇区',
    isDefault:false
  },
    {
    id:3,
    name:'张三',
    phone:'12345678901',
    address:'中国上海徐汇区',
    isDefault:false
  }
])
const setDefault = (id:number) => {
  address.value.forEach(item => {
    item.isDefault = item.id === id
  })
}
//支付的选择
 function handleSelectPay(type:string) {
      selectedPayType.value = type
      popupVisible.value = true;
      resetCountdown();
    }
    // 重置倒计时
  function resetCountdown() {
      if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
      let time = 69;
      countdown.value = time;

      countdownTimer.value = setInterval(() => {
        time--;
        countdown.value = time;
        if (time <= 0) {
        if (countdownTimer.value !== null) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
      }
          alert('二维码已过期，请重新选择支付方式');
          popupVisible.value = false;
        }
      }, 1000);
    }
    </script>
<style scoped>
.container {
  max-width: 1200px;
  width: 1300px;
}
.submit-btn {
  background-color: #f3ce48;
  border-color: #f3ce48;
  color: #333;
  margin-left: 243px;
  width: 150px;
}

.submit-btn:hover {
  background-color: #eeeeee;
  border-color: #eeeeee;
  color: #333;
}
</style>
