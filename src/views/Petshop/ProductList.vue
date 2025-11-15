<template>
    <NavBar />
  <header class="bg-white shadow-md top-[85px] left-0 right-0 z-50 ">
        <div class="container flex items-center flex-col pt-[35px] py-4">
<ShopCategoryNav
  :model="route.params.category ?? 'all'"
  @categoryChange="handleCategoryChange"
/>

       <!-- 搜索框 -->
        <div class="hidden md:flex justify-center items-center flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input type="text" placeholder="搜索宠物用品..."
                  class="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2  focus:border-[#FF7043]">
            <i class="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
    </div>
  </header>
  <div class="flex justify-center items-center">
  <div class="product-list-container ">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">
        <i class="fa fa-star text-[#FF7043] mr-2"></i>
        {{ currentCategoryName }}
      </h2>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8 ">
      <i class="fa fa-spinner fa-spin text-2xl text-[#FF7043]"></i>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <!-- 商品网格 -->
    <div v-else-if="products.length > 0" class="grid grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
        @click="handleProductClick(product)"
      >
        <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover bg-gray-50">
        <div class="p-3">
          <h3 class="font-medium">{{ product.name }}</h3>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-[#FF7043] font-bold">¥{{ product.price }}</span>
            <button
              @click.stop="addToCart(product)"
              class="w-8 h-8 hover:bg-[#FF7043]/20 rounded-full flex items-center justify-center transition-colors"
            >
              <i class="fa fa-shopping-cart text-[#FF7043] text-[16px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-8">
      <i class="fa fa-box text-4xl text-gray-300 mb-4"></i>
      <p class="text-gray-600">暂无商品</p>
    </div>
  </div></div>
   <ShopFoot />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const router = useRouter()
// 处理分类变化
const handleCategoryChange = (category: { path?: string; id?: string }) => {
  if (category.path) {
    router.push(category.path)
  } else if (category.id) {
    router.push(`/products/${category.id}`)
  }
}
// 定义商品数据结构
interface Product {
  id: string | number
  name: string
  price: number
  image: string
  category: string
  description?: string
}

// 加载状态
const loading = ref(false)
const products = ref<Product[]>([])
const route = useRoute()

// 模拟商品数据
const mockProducts: Record<string, Product[]> = {
  all: [
    { id: 1, name: '均衡营养狗粮', price: 29, image: '/img/宠物3.jpg', category: 'all', description: '营养均衡，适合各种犬种' },
    { id: 2, name: '猫咪零食罐', price: 15, image: '/img/宠物3.jpg', category: 'all', description: '美味可口，猫咪最爱' },
    { id: 3, name: '宠物玩具球', price: 12, image: '/img/宠物3.jpg', category: 'all', description: '安全材质，耐咬耐玩' },
    { id: 4, name: '宠物洗护用品', price: 35, image: '/img/宠物3.jpg', category: 'all', description: '温和配方，呵护毛发' }
  ],
  sale: [
    { id: 5, name: '特价狗粮大礼包', price: 89, image: '/img/宠物3.jpg', category: 'sale', description: '限时特惠，买二送一' },
    { id: 6, name: '猫咪玩具套装', price: 25, image: '/img/宠物3.jpg', category: 'sale', description: '多种玩具，一次满足' }
  ],
  food: [
    { id: 7, name: '高级成犬粮', price: 128, image: '/img/宠物3.jpg', category: 'food', description: '优质蛋白，健康成长' },
    { id: 8, name: '幼猫专用粮', price: 98, image: '/img/宠物3.jpg', category: 'food', description: '易消化，营养全面' },
    { id: 9, name: '老年犬粮', price: 138, image: '/img/宠物3.jpg', category: 'food', description: '关节保护，延缓衰老' }
  ],
  snacks: [
    { id: 10, name: '冻干鸡肉粒', price: 22, image: '/img/宠物3.jpg', category: 'snacks', description: '纯肉制作，高蛋白' },
    { id: 11, name: '猫草饼干', price: 18, image: '/img/宠物3.jpg', category: 'snacks', description: '帮助消化，清新口气' }
  ],
  toys: [
    { id: 12, name: '智能互动球', price: 68, image: '/img/宠物3.jpg', category: 'toys', description: '自动滚动，激发运动' },
    { id: 13, name: '猫爬架', price: 158, image: '/img/宠物3.jpg', category: 'toys', description: '多层设计，锻炼攀爬' }
  ],
  supplies: [
    { id: 14, name: '宠物饮水器', price: 45, image: '/img/宠物3.jpg', category: 'supplies', description: '自动循环，保持水质' },
    { id: 15, name: '宠物食盆', price: 28, image: '/img/宠物3.jpg', category: 'supplies', description: '防滑设计，易清洗' }
  ],
  cleaning: [
    { id: 16, name: '宠物专用洗发水', price: 32, image: '/img/宠物3.jpg', category: 'cleaning', description: '温和无泪配方' },
    { id: 17, name: '除臭喷雾', price: 25, image: '/img/宠物3.jpg', category: 'cleaning', description: '天然成分，安全除臭' }
  ],
  care: [
    { id: 18, name: '宠物指甲剪', price: 19, image: '/img/宠物3.jpg', category: 'care', description: '安全设计，不易伤手' },
    { id: 19, name: '宠物梳子', price: 15, image: '/img/宠物3.jpg', category: 'care', description: '去除浮毛，防止打结' }
  ],
  grooming: [
    { id: 20, name: '宠物吹风机', price: 89, image: '/img/宠物3.jpg', category: 'grooming', description: '静音设计，恒温护发' },
    { id: 21, name: '美容剪刀', price: 45, image: '/img/宠物3.jpg', category: 'grooming', description: '专业工具，精准修剪' }
  ],
  clothing: [
    { id: 22, name: '宠物冬季外套', price: 55, image: '/img/宠物3.jpg', category: 'clothing', description: '保暖防风，时尚美观' },
    { id: 23, name: '宠物雨衣', price: 35, image: '/img/宠物3.jpg', category: 'clothing', description: '防水透气，雨天必备' }
  ]
}

// 当前分类名称
const currentCategoryName = computed(() => {
  const categoryNames: Record<string, string> = {
    all: '热门商品',
    sale: '特惠商品',
    food: '宠物主粮',
    snacks: '宠物零食',
    toys: '宠物玩具',
    supplies: '日常用品',
    cleaning: '洗护清洁',
    care: '宠物护理',
    grooming: '沐浴美容',
    clothing: '宠物服饰'
  }
  const category = (route.params.category as string) || 'all'
  return categoryNames[category] || '全部商品'
})

// 监听路由参数变化
watch(() => route.params.category, (newCategory) => {
  loading.value = true
  const category = (newCategory as string) || 'all'
  setTimeout(() => {
    products.value = mockProducts[category] || []
    loading.value = false
  }, 300)
}, { immediate: true })

// 处理商品点击
const handleProductClick = (product: Product) => {
  console.log('点击商品:', product)
}

// 添加到购物车
const addToCart = (product: Product) => {
  console.log('添加到购物车:', product)
}
</script>

<style scoped>
.container{
  max-width: 100%
}
.product-list-container {
  padding: 20px 40px;
}

.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}
</style>
