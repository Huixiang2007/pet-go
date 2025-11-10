<template>

<div class="min-h-screen pt-16 bg-gradient-to-br from-[#fff9e6] via-[#fffacd] to-[#ffd6a0]">

  <div class="pet-shop-container">
    <div class="top-section flex">
      <div class="left-nav bg-white shadow-md rounded-lg p-4 w-64">
        <div class="tabs flex justify-center items-center border-b">

        <button class="tab-btn mb-[10px] bg-[#f2a286] text-center lh-4 text-lg  rounded-full font-medium px-6 py-2.5 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
  <i class="fa-solid fa-paw mr-2 text-sm"></i>宠物分类站
</button>
        </div>


     <div > <!-- 新增 flex-wrap 和 gap-2 -->
  <div class="categories grid grid-cols-2 gap-2 mt-4">
            <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-food')">
              主粮
            </button>
            <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-snack')">
              零食
            </button>
            <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-medical')">
              生活
            </button>
            <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-health')">
              清洁
            </button>
            <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-care')">
              护理
            </button>
            <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-toy')">
              玩具
            </button>
             <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-medical')">
              洗浴
            </button>
             <button class="category-btn w-full text-left py-2 px-3 rounded hover:bg-blue-50 hover:border-green-500 hover:border-l-2 transition-colors mb-2" @click="openPopup('dog-health')">
              装饰
            </button>
          </div>
        </div>
      </div>

      <!-- 轮播图 -->
      <div class="carousel flex-1 ml-4 bg-white shadow-md rounded-lg overflow-hidden">
        <div class="relative h-80">
          <img
            v-for="(item, index) in carouselItems"
            :key="index"
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
            :class="{ 'opacity-100': currentSlide === index, 'opacity-0 absolute transition-opacity duration-500': currentSlide !== index }"
          >
          <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <button
              v-for="(item, index) in carouselItems"
              :key="index"
              class="w-3 h-3 rounded-full"
              :class="{ 'bg-white': currentSlide === index, 'bg-white/50': currentSlide !== index }"
              @click="currentSlide = index"
            ></button>
          </div>
        </div>
      </div>
    </div>

  <!-- 优惠卷区域 -->
  <div class="container mx-auto max-w-[73rem] relative z-10 mt-6 mb-6">
    <div class="bg-[#FF7A45] rounded-t-2xl py-4 px-6 text-white text-center shadow-lg transform transition-all duration-300 hover:shadow-xl">
      <h2 class="text-2xl font-bold tracking-wide">宠物福利优惠券</h2>
      <p class="text-white/90 mt-1 animate-pulse">限时领取 · 先到先得</p>
    </div>

    <!-- 优惠券列表 -->
    <div class="flex flex-wrap justify-center gap-6 py-8 px-4 bg-[#FFE4E1] rounded-b-2xl shadow-md">

      <div class="coupon-shadow coupon-edge bg-[#ffffff] rounded-xl p-5 w-[284px] text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group cursor-pointer">
        <div class="absolute top-3 right-3 text-3xl transition-all duration-300  group-hover:scale-110">
          <i class="fas fa-paw text-[#8D4E40]"></i>
        </div>
        <div class="text-4xl font-bold mb-2 transition-all duration-300 ">¥50</div>
        <div class="text-sm mb-3">满500可用</div>
        <div class="text-gray-400 text-xs mb-4">11.1-11.15有效</div>
        <button class="w-full text-sm py-2 rounded-full bg-blue-200 transition-colors  group-hover:text-white">
          立即领取
        </button>
      </div>

      <!-- 优惠券2 -->
      <div class="coupon-shadow coupon-edge bg-[#ffffff] rounded-xl p-5 w-[284px] text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group cursor-pointer">
        <div class="absolute top-3 right-3  text-3xl transition-all duration-300  group-hover:scale-110">
          <i class="fas fa-paw text-[#8D4E40]"></i>
        </div>
        <div class=" text-4xl font-bold mb-2 transition-all duration-300 ">¥80</div>
         <div class="text-sm mb-3">满500可用</div>
        <div class="text-gray-400 text-xs mb-4">11.1-11.15有效</div>
        <button class="w-full text-sm py-2 rounded-full bg-blue-200 transition-colors  group-hover:text-white">
          立即领取
        </button>
      </div>

      <!-- 优惠券3 -->
      <div class="coupon-shadow coupon-edge bg-[#ffffff] rounded-xl p-5 w-[284px] text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group cursor-pointer">
        <div class="absolute top-3 right-3  text-3xl transition-all duration-300  group-hover:scale-110">
          <i class="fas fa-paw text-[#8D4E40]"></i>
        </div>
        <div class="text-4xl font-bold mb-2 transition-all duration-300 ">¥120</div>
         <div class="text-sm mb-3">满500可用</div>
        <div class="text-gray-400 text-xs mb-4">11.1-11.15有效</div>
        <button class="w-full text-sm py-2 rounded-full bg-blue-200 transition-colors  group-hover:text-white">
          立即领取
        </button>
      </div>
    </div>

    <!-- 底部信息栏 -->
    <div class="flex flex-col md:flex-row items-center justify-between py-4 px-6 bg-white rounded-b-2xl -mt-2 border-t border-gray-100">
      <div class="flex items-center mb-3 md:mb-0">
        <div class="w-10 h-10 rounded-full  flex items-center justify-center mr-3">
          <i class="fas fa-paw text-[#333333]"></i>
        </div>
          <div class="text-gray-400 text-xs">不错过每一次优惠</div>
      </div>
      <div class="flex gap-3">
   <button class="bg-[#bbdefb] text-[#333333] text-xs px-4 py-2 rounded-full transition-all duration-300 hover:bg-blue-200">
          查看规则
        </button>
      </div>
    </div>
  </div>

    <!-- 功能模块区域 -->
    <div class="features grid grid-cols-4 gap-4 mt-6">
      <div class="feature-card bg-green-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fa fa-wrench text-2xl text-green-600"></i>
        </div>
        <h3 class="font-medium text-gray-800">爆款秒杀</h3>
        <p class="text-sm text-gray-500 mt-1">万人关注的爆款商品秒杀</p>
      </div>
      <div class="feature-card bg-red-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fa fa-heart text-2xl text-red-600"></i>
        </div>
        <h3 class="font-medium text-gray-800">特惠专区</h3>
        <p class="text-sm text-gray-500 mt-1">每天都有特价惊喜哦</p>
      </div>
      <div class="feature-card bg-[#e6f7ff] rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
        <div class="w-16 h-16 bg-[#aadafa] rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fa fa-shield text-2xl text-[#0288d1]"></i>
        </div>
        <h3 class="font-medium text-gray-800">ai客服</h3>
        <p class="text-sm text-gray-500 mt-1">ai专业客服,科学养宠为TA护航</p>
      </div>
      <div class="feature-card bg-purple-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fa fa-flask text-2xl text-purple-600"></i>
        </div>
        <h3 class="font-medium text-gray-800">购物车</h3>
        <p class="text-sm text-gray-500 mt-1">你想要的，都在这里</p>
      </div>
    </div>

    <!-- 商品展示区域 -->
    <div class="products mt-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">狗狗主粮</h2>
        <div class="product-tabs">
          <button class="px-3 py-1 rounded-md" :class="{'bg-green-50 text-green-600': activeProductTab === 'import', 'text-gray-500': activeProductTab !== 'import'}" @click="activeProductTab = 'import'">进口狗粮</button>
          <button class="px-3 py-1 rounded-md" :class="{'bg-green-50 text-green-600': activeProductTab === 'freeze', 'text-gray-500': activeProductTab !== 'freeze'}" @click="activeProductTab = 'freeze'">冻干狗粮</button>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <div class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
          <div class="bg-orange-50 p-4 text-center">
            <h3 class="font-medium">生鲜本能 Instinct</h3>
            <p class="text-sm">单一低敏系列</p>
            <p class="text-sm">极简轻食主义</p>
          </div>
          <img src="https://via.placeholder.com/150" alt="狗粮" class="w-full h-40 object-cover">
        </div>
        <div class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
          <img src="https://via.placeholder.com/150" alt="狗粮" class="w-full h-40 object-cover">
          <div class="p-3">
            <h3 class="font-medium">均衡营养</h3>
            <p class="text-sm">稳定血糖</p>
          </div>
        </div>
        <div class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
          <img src="https://via.placeholder.com/150" alt="狗粮" class="w-full h-40 object-cover">
          <div class="p-3">
            <h3 class="font-medium">高DHA 经典六种鱼</h3>
            <p class="text-sm">内护心外美毛</p>
          </div>
        </div>
        <div class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
          <img src="https://via.placeholder.com/150" alt="狗粮" class="w-full h-40 object-cover">
          <div class="p-3">
            <h3 class="font-medium">all life stages</h3>
          </div>
        </div>
        <div class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
          <img src="https://via.placeholder.com/150" alt="狗粮" class="w-full h-40 object-cover">
          <div class="p-3">
            <h3 class="font-medium">冻干生骨肉</h3>
            <p class="text-sm">高蛋白易消化</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗
    <div v-if="popupVisible" class="popup-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="popup-content bg-white rounded-lg w-1/2 max-h-[80vh] overflow-auto p-6">
        <div class="flex justify-between items-center mb-4">
            <i class="far fa-times text-xl"></i>
          <h2 class="text-xl font-bold text-gray-800">{{ popupTitle }}</h2>
          <button class="text-gray-500 hover:text-gray-700" @click="popupVisible = false">
          <i class="fa fa-times text-xl"></i>
          </button>
        </div>
        <div class="popup-details">
          <p>这里是猫咪{{ popupTitle }}的详细信息...</p>
        </div>
      </div>
    </div> -->
  </div></div>
</template>

<script setup lang="ts">
// ...existing code...
import { ref, onMounted, onBeforeUnmount } from 'vue'

const carouselItems = ref([
  { image: 'https://picsum.photos/800/400?random=1', title: '双11促销' },
  { image: 'https://picsum.photos/800/400?random=2', title: '新品上市' },
  { image: 'https://picsum.photos/800/400?random=3', title: '宠物健康' }
])
const currentSlide = ref(0)
const activeProductTab = ref('import')
const popupVisible = ref(false)
const popupTitle = ref('')
const carouselInterval = ref<number | null>(null)

onMounted(() => {
  carouselInterval.value = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length
  }, 3000)
})

onBeforeUnmount(() => {
  if (carouselInterval.value !== null) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
})

const openPopup = (category: string) => {
  const titles: Record<string, string> = {
    'dog-food': '主粮',
    'dog-snack': '零食',
    'dog-medical': '医疗',
    'dog-health': '保健',
    'dog-care': '护理',
    'dog-toy': '玩具',
    'cat-food': '主粮',
    'cat-snack': '零食',
    'cat-medical': '医疗',
    'cat-health': '保健',
    'cat-care': '护理',
    'cat-litter': '猫砂'
  }
  popupTitle.value = titles[category] ?? ''
  popupVisible.value = true
}
// ...existing code...
</script>

<style scoped>
.pet-shop-container {
  max-width: 1200px;
  margin: 60px auto;
  padding: 20px;
}

.top-section {
  margin-bottom: 20px;
}

.left-nav {
  min-width: 200px;
}

.tab-btn {
  cursor: pointer;
  border: none;
    font-weight: 500;
    transition: all 0.3s;
}

.category-btn {
  cursor: pointer;

}
.carousel {
  flex: 1;
}

.features {
  margin-top: 20px;
}

.feature-card {
  cursor: pointer;
}

.products {
  margin-top: 30px;
}

.product-tabs button {
  cursor: pointer;
}

.product-card {
  cursor: pointer;
}

.popup-overlay {
  animation: fadeIn 0.3s;
}

.popup-content {
  animation: slideUp 0.3s;
}
.coupon-edge {
  position: relative;
  overflow: visible;
}
.coupon-edge::before {
  content: "";
  position: absolute;
  top: 0;
  left: -12px;
  width: 24px;
  height: 100%;
  pointer-events: none;
    background:
    radial-gradient(circle at 24px 12px, transparent 11px, #FFE4E1 12px) repeat-y;
  background-size: 24px 24px;
}

.coupon-edge::after {
  content: "";
  position: absolute;
  top: 0;
  right: -12px;
  width: 24px;
  height: 100%;
  pointer-events: none;
  background:
    radial-gradient(circle at 0 12px, transparent 11px, #FFE4E1 12px) repeat-y;
  background-size: 24px 24px;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
