<template>
  <div
    v-for="product in flashProducts"
    :key="product.id"
    class="bg-white rounded-xl overflow-hidden w-[300px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    @click="productsDeatil(product.id)"
  >
    <div class="w-full h-64 bg-gray-50 overflow-hidden relative">
      <img
        :src="product.mainImage"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />

      <div class="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
        秒杀
      </div>

      <div v-if="product.stock <= 100" class="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
        仅剩{{ product.stock }}件
      </div>

      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div class="flex items-center justify-between text-xs text-white mb-1">
          <span>已抢 {{ product.sales }}/{{ product.totalStock }} 件</span>
          <span>{{ Math.round((product.sales / product.totalStock) * 100) }}%</span>
        </div>
        <div class="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
            :style="{ width: `${(product.sales / product.totalStock) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

  <div class="p-4">
    <div class="mb-2">
      <h3 class="font-medium text-gray-800 line-clamp-2 text-sm md:text-base h-10">
        {{ product.title }}
      </h3>
    </div>

    <div class="flex items-center text-xs text-gray-400 mb-3">
      <i class="fa fa-shop mr-1"></i>
      <span>{{ product.shopName }}</span>
      <span class="mx-2">|</span>
      <i class="fa fa-fire text-red-400 mr-1"></i>
      <span>销量：{{ product.sales }}+</span>
    </div>

    <div class="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-l-xl relative overflow-hidden">
      <div class="flex items-center">
        <span class="text-red-600 font-bold text-lg md:text-xl">¥{{ product.seckillPrice.toFixed(2) }}</span>
      </div>
 <div class="flex items-center ml-4">
    <div
      :style="{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }"
      class="h-[40px] w-[100px] ml-[-10px] text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-0.5 font-medium flex items-center justify-center"
    >
    <i class="fa fa-arrow-down mr-2 text-white"></i>
      直降
      ¥{{ (product.originalPrice - product.seckillPrice).toFixed(2) }}
    </div>
    <button
      class="w-[60px] h-[40px] z-80 bg-gradient-to-r from-orange-500 to-red-600 text-white
      flex items-center justify-center
      transition-all duration-300 hover:opacity-90 active:scale-95
      shadow-md relative overflow-hidden z-10"
      :class="{ 'animate-pulse': product.stock <= 10 }"
      :style="{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }"
      :disabled="product.sales >= product.totalStock"
      @click.stop="handleBuyNow(product)"
    >
      <span class="relative z-10 font-bold text-sm md:text-base" :class="{ 'animate-pulse': product.stock <= 10 }">
        <i class="fa fa-bell animate-bell"></i>
        抢!
      </span>
    </button>
  </div>
  </div>

  </div>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

interface FlashProduct {
  id: number
  name: string
  mainImage: string
  title: string
  brandName: string
  shopName: string
  sales: number
  seckillPrice: number
  originalPrice: number
  totalStock: number
  stock: number
}

const flashProducts = ref<FlashProduct[]>([
  {
    id: 1,
    name: '智能宠物喂食器',
    mainImage: 'https://picsum.photos/400/400?random=1',
    title: '智能定时喂食器 猫咪狗狗自动投食机 远程操控 定量喂食',
    brandName: 'PetSmart',
    shopName: '宠物用品官方旗舰店',
    sales: 2356,
    seckillPrice: 99.0,
    originalPrice: 199.0,
    totalStock: 3000,
    stock: 3000
  },
  {
    id: 2,
    name: '宠物航空箱',
    mainImage: 'https://picsum.photos/400/400?random=2',
    title: '宠物专用航空箱 抗压透气 中大型犬猫咪出行便携箱 安全防逃',
    brandName: 'PetFly',
    shopName: '宠物出行装备店',
    sales: 1892,
    seckillPrice: 129.0,
    originalPrice: 259.0,
    totalStock: 2000,
    stock: 200
  },
  {
    id: 3,
    name: '进口天然猫粮',
    mainImage: 'https://picsum.photos/400/400?random=3',
    title: '进口无谷低敏猫粮 成猫幼猫通用 5kg装 美毛护肠胃',
    brandName: 'CatNature',
    shopName: '进口宠物食品旗舰店',
    sales: 4567,
    seckillPrice: 89.0,
    originalPrice: 169.0,
    totalStock: 5000,
    stock: 50
  },
  {
    id: 4,
    name: '智能饮水器',
    mainImage: 'https://picsum.photos/400/400?random=4',
    title: '宠物智能饮水器 自动循环过滤 静音防打翻 猫咪狗狗通用',
    brandName: 'WaterPaw',
    shopName: '宠物智能用品店',
    sales: 3210,
    seckillPrice: 69.0,
    originalPrice: 139.0,
    totalStock: 4000,
    stock: 4
    },
  {
    id: 5,
    name: '宠物尿垫',
    mainImage: 'https://picsum.photos/400/400?random=5',
    title: '加厚除臭宠物尿垫 狗狗猫咪一次性尿垫 100片装 超强吸水',
    brandName: 'PawDry',
    shopName: '宠物日用品超市',
    sales: 6789,
    seckillPrice: 29.9,
    originalPrice: 59.9,
    totalStock: 10000,
    stock: 100
  }
])


const productsDeatil = (id: number) => {
  router.push({
    path: `/productDetail/${id}`,
    query: { id: id }
  })
}

const handleBuyNow = (product: FlashProduct) => {
  if (product.sales >= product.totalStock) {
    alert(`「${product.title}」已抢完！`)
    return
  }
  alert(`已成功抢购「${product.title}」\n秒杀价：¥${product.seckillPrice.toFixed(2)}`)
}
</script>

<style scoped>
/* 禁用状态按钮样式 */
button:disabled {
  background-color: #a09f9f;
  cursor: not-allowed;
}

button:disabled i {
  color: #a09f9f;
}
button:disabled:hover {
opacity: 100;
transform: scale(1.3);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.animate-pulse {
  animation: pulse 1.5s infinite;
}
@keyframes bell {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(30deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-30deg); }
  100% { transform: rotate(0deg); }
}
.animate-bell {
  animation: bell 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
}
.animate-pulse {
  animation: pulse 1.5s infinite;
}
</style>
