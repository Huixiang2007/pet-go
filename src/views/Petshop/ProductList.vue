<template>
  <NavBar />
  <header class="bg-white shadow-md top-[85px] left-0 right-0 z-50 ">
    <ShopCategoryNav
      :model="route.params.category ?? 'all'"
      :subModel="route.params.subCategory || ''"
      @categoryChange="handleCategoryChange"
      @subCategoryChange="handleSubCategoryChange"
    />
  </header>
  <div class="flex justify-center items-center">
    <div class="product-list-container ">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          <i class="fa fa-star text-[#FF7043] mr-2"></i>
          {{ currentCategoryName }}
          {{ currentSubCategoryName && ` - ${currentSubCategoryName}` }}
        </h2>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-8 ">
        <i class="fa fa-spinner fa-spin text-2xl text-[#FF7043]"></i>
        <p class="mt-2 text-gray-600">加载中...</p>
      </div>

      <!-- 商品网格 -->
      <div v-else-if="products.length > 0" class="grid grid-cols-3 gap-4 px-[70px]">
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
    </div>
  </div>
  <ShopFoot />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// 定义子分类接口
interface SubCategory {
  id: string
  name: string
  path: string
}

// 处理分类变化
const handleCategoryChange = (category: { path?: string; id?: string }) => {
  if (category.path) {
    router.push(category.path)
  } else if (category.id) {
    router.push(`/products/${category.id}`)
  }
}

// 处理子分类变化
const handleSubCategoryChange = (mainId: string, subCategory: SubCategory) => {
  if (subCategory.path) {
    router.push(subCategory.path)
  }
}

// 定义商品数据结构
interface Product {
  id: string | number
  name: string
  price: number
  image: string
  category: string
  subCategory?: string
  description?: string
}

// 加载状态
const loading = ref(false)
const products = ref<Product[]>([])

// 模拟商品数据 - 为所有14个大类和子分类提供数据
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
    { id: 11, name: '猫草饼干', price: 18, image: '/img/宠物3.jpg', category: 'snacks', description: '帮助消化，清新口气' },
    { id: 12, name: '宠物罐头', price: 15, image: '/img/宠物3.jpg', category: 'snacks', description: '营养美味，适口性好' }
  ],
  supplies: [
    { id: 13, name: '宠物饮水器', price: 45, image: '/img/宠物3.jpg', category: 'supplies', description: '自动循环，保持水质' },
    { id: 14, name: '宠物食盆', price: 28, image: '/img/宠物3.jpg', category: 'supplies', description: '防滑设计，易清洗' },
    { id: 15, name: '项圈牵引绳', price: 38, image: '/img/宠物3.jpg', category: 'supplies', description: '舒适耐用，安全可靠' }
  ],
  toys: [
    { id: 16, name: '智能互动球', price: 68, image: '/img/宠物3.jpg', category: 'toys', description: '自动滚动，激发运动' },
    { id: 17, name: '猫爬架', price: 158, image: '/img/宠物3.jpg', category: 'toys', description: '多层设计，锻炼攀爬' },
    { id: 18, name: '耐咬橡胶玩具', price: 25, image: '/img/宠物3.jpg', category: 'toys', description: '坚固耐用，清洁牙齿' }
  ],
  cleaning: [
    { id: 19, name: '宠物专用洗发水', price: 32, image: '/img/宠物3.jpg', category: 'cleaning', description: '温和无泪配方' },
    { id: 20, name: '除臭喷雾', price: 25, image: '/img/宠物3.jpg', category: 'cleaning', description: '天然成分，安全除臭' },
    { id: 21, name: '猫砂', price: 38, image: '/img/宠物3.jpg', category: 'cleaning', description: '快速结团，低粉尘' }
  ],
  care: [
    { id: 22, name: '宠物指甲剪', price: 19, image: '/img/宠物3.jpg', category: 'care', description: '安全设计，不易伤手' },
    { id: 23, name: '宠物梳子', price: 15, image: '/img/宠物3.jpg', category: 'care', description: '去除浮毛，防止打结' },
    { id: 24, name: '耳道清洁剂', price: 35, image: '/img/宠物3.jpg', category: 'care', description: '温和清洁，预防耳螨' }
  ],
  grooming: [
    { id: 25, name: '宠物吹风机', price: 89, image: '/img/宠物3.jpg', category: 'grooming', description: '静音设计，恒温护发' },
    { id: 26, name: '美容剪刀', price: 45, image: '/img/宠物3.jpg', category: 'grooming', description: '专业工具，精准修剪' },
    { id: 27, name: '宠物电推剪', price: 128, image: '/img/宠物3.jpg', category: 'grooming', description: '静音设计，多档调节' }
  ],
  clothing: [
    { id: 28, name: '宠物冬季外套', price: 55, image: '/img/宠物3.jpg', category: 'clothing', description: '保暖防风，时尚美观' },
    { id: 29, name: '宠物雨衣', price: 35, image: '/img/宠物3.jpg', category: 'clothing', description: '防水透气，雨天必备' },
    { id: 30, name: '宠物节日服装', price: 45, image: '/img/宠物3.jpg', category: 'clothing', description: '可爱造型，节日装扮' }
  ],
  health: [
    { id: 31, name: '宠物维生素片', price: 68, image: '/img/宠物3.jpg', category: 'health', description: '补充营养，增强免疫力' },
    { id: 32, name: '关节保健片', price: 89, image: '/img/宠物3.jpg', category: 'health', description: '呵护关节，缓解疼痛' },
    { id: 33, name: '肠胃调理益生菌', price: 58, image: '/img/宠物3.jpg', category: 'health', description: '调节肠道，促进消化' }
  ],
  training: [
    { id: 34, name: '训练响片', price: 25, image: '/img/宠物3.jpg', category: 'training', description: '科学训练，快速见效' },
    { id: 35, name: '宠物尿垫', price: 45, image: '/img/宠物3.jpg', category: 'training', description: '吸水透气，去除异味' },
    { id: 36, name: '宠物航空箱', price: 198, image: '/img/宠物3.jpg', category: 'training', description: '安全舒适，便于携带' }
  ],
  travel: [
    { id: 37, name: '宠物背包', price: 128, image: '/img/宠物3.jpg', category: 'travel', description: '透气舒适，方便出行' },
    { id: 38, name: '车载安全带', price: 58, image: '/img/宠物3.jpg', category: 'travel', description: '行车安全，防止意外' },
    { id: 39, name: '便携水碗', price: 25, image: '/img/宠物3.jpg', category: 'travel', description: '折叠设计，方便携带' }
  ],
  aquatic: [
    { id: 40, name: '鱼缸过滤器', price: 158, image: '/img/宠物3.jpg', category: 'aquatic', description: '高效过滤，保持水质' },
    { id: 41, name: '观赏鱼饲料', price: 35, image: '/img/宠物3.jpg', category: 'aquatic', description: '营养全面，增色健体' },
    { id: 42, name: '鱼缸加热棒', price: 89, image: '/img/宠物3.jpg', category: 'aquatic', description: '自动恒温，安全可靠' }
  ]
}

// 子分类名称映射
const subCategoryNames: Record<string, Record<string, string>> = {
  sale: {
    limited: '限时折扣',
    clearance: '清仓商品'
  },
  food: {
    cat: '猫粮',
    dog: '狗粮',
    small: '小宠粮食'
  },
  snacks: {
    freeze: '冻干零食',
    canned: '罐头食品',
    chew: '咬胶零食'
  },
  supplies: {
    collar: '项圈牵引',
    bed: '宠物窝垫',
    bowl: '食盆水盆'
  },
  toys: {
    chew: '咬胶玩具',
    interactive: '互动玩具',
    catnip: '猫薄荷玩具'
  },
  cleaning: {
    shampoo: '宠物香波',
    deodorant: '除臭用品',
    litter: '猫砂用品'
  },
  care: {
    nail: '指甲护理',
    comb: '梳毛工具',
    ear: '耳道清洁'
  },
  grooming: {
    dryer: '宠物吹风机',
    scissors: '美容剪刀',
    clipper: '电推剪'
  },
  clothing: {
    coat: '冬季外套',
    raincoat: '宠物雨衣',
    costume: '节日服装'
  },
  health: {
    vitamin: '维生素',
    joint: '关节保健',
    digestive: '肠胃调理'
  },
  training: {
    clicker: '响片训练',
    pad: '尿垫',
    crate: '航空箱'
  },
  travel: {
    carrier: '宠物背包',
    seatbelt: '车载安全带',
    portable: '便携用品'
  },
  aquatic: {
    tank: '鱼缸设备',
    filter: '过滤设备',
    food: '观赏鱼粮'
  }
}

// 当前分类名称
const currentCategoryName = computed(() => {
  const categoryNames: Record<string, string> = {
    all: '热门商品',
    sale: '特惠商品',
    food: '宠物主粮',
    snacks: '宠物零食',
    supplies: '日常用品',
    toys: '宠物玩具',
    cleaning: '洗护清洁',
    care: '宠物护理',
    grooming: '美容工具',
    clothing: '宠物服饰',
    health: '健康保健',
    training: '训练用品',
    travel: '宠物出行',
    aquatic: '水族用品'
  }
  const category = (route.params.category as string) || 'all'
  return categoryNames[category] || '全部商品'
})

// 当前子分类名称
const currentSubCategoryName = computed(() => {
  const category = (route.params.category as string) || ''
  const queryParams = new URLSearchParams(window.location.search)

  // 根据URL参数获取子分类ID
  let subCategoryId = ''
  if (category === 'sale') {
    subCategoryId = queryParams.get('type') || ''
  } else if (category === 'food') {
    subCategoryId = queryParams.get('pet') || ''
  } else {
    subCategoryId = queryParams.get('type') || ''
  }

  // 返回子分类名称
  if (category && subCategoryId && subCategoryNames[category]) {
    return subCategoryNames[category][subCategoryId] || ''
  }
  return ''
})

// 根据URL参数获取过滤后的商品
const getFilteredProducts = (category: string) => {
  const baseProducts = mockProducts[category] || []


  // 根据不同分类应用不同的过滤逻辑
  if (category === 'food') {
  } else if (category === 'sale' || category === 'supplies' || category === 'toys' ||
             category === 'cleaning' || category === 'care' || category === 'grooming' ||
             category === 'clothing' || category === 'health' || category === 'training' ||
             category === 'travel' || category === 'aquatic' || category === 'snacks') {
  }

  return baseProducts
}

// 监听路由参数变化
watch(() => [route.params.category, window.location.search], () => {
  loading.value = true
  const category = (route.params.category as string) || 'all'
  setTimeout(() => {
    products.value = getFilteredProducts(category)
    loading.value = false
  }, 300)
}, { immediate: true, deep: true })

// 处理商品点击
const handleProductClick = (product: Product) => {
  console.log('点击商品:', product)
  // 这里可以添加跳转到商品详情页的逻辑
}

// 添加到购物车
const addToCart = (product: Product) => {
  console.log('添加到购物车:', product)
  // 这里可以添加添加到购物车的逻辑
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
