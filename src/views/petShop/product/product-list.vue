<template>
  <NavBar />
  <header class="bg-white shadow-md top-[85px] left-0 right-0 z-50">
    <ShopCategoryNav
      :model="currentCategoryId"
      :subModel="currentSubCategoryId"
      @categoryChange="handleCategoryChange"
      @subCategoryChange="handleSubCategoryChange"
    />
  </header>
  <div class="min-h-screen pt-1 bg-yellow-50">
    <div class="flex justify-center items-center">
      <div class="product-list-container max-w-7xl w-full">
        <div class="flex justify-between items-center mb-6 px-40px]">
          <h2 class="flex items-center gap-2 text-xl font-bold text-gray-800">
            <div
              class="w-6 h-6 rounded-full bg-[#FF7043] flex items-center justify-center text-white"
            >
              <i class="fa fa-star text-xs"></i>
            </div>
            {{ currentCategoryName }}
            <span v-if="currentSubCategoryName" class="text-gray-500 font-normal">
              - {{ currentSubCategoryName }}
            </span>
          </h2>
        </div>

        <div v-if="loading && products.length === 0" class="text-center py-16">
          <div
            class="inline-block w-12 h-12 border-4 border-[#FF7043]/30 border-t-[#FF7043] rounded-full animate-spin mb-4"
          ></div>
          <p class="text-gray-600">加载中...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="products.length === 0" class="text-center py-16">
          <div
            class="inline-block w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          >
            <i class="fa fa-box text-2xl text-gray-300"></i>
          </div>
          <p class="text-gray-600">暂无商品</p>
        </div>

        <!-- 商品-->
        <infiniteScroll
          v-else
          :isLoading="loading"
          :hasMore="hasMore"
          @load-more="loadMore"
          class="bg-yellow-50"
        >
          <div class="grid grid-cols-4 gap-6 pb-8">
            <!-- 商品卡 -->
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              @click="handleProductClick(product)"
            >
              <!-- 商品图片 -->
              <div class="relative overflow-hidden">
                <img
                  :src="product.mainImage"
                  :alt="product.title"
                  class="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                />
                <!-- 销量标签 -->
                <div
                  class="absolute top-3 right-3 bg-[#FF7043] text-white text-xs px-2 py-1 rounded-full"
                >
                  销量 {{ product.sales }}
                </div>
              </div>

              <!-- 商品信息 -->
              <div class="p-4">
                <!-- 商品标题+副标题 -->
                <h3 class="font-medium text-gray-800 line-clamp-1 mb-1">{{ product.title }}</h3>
                <p class="text-xs text-gray-500 line-clamp-1 mb-3">{{ product.subTitle }}</p>

                <!-- 价格+购物车按钮 -->
                <div class="flex justify-between items-center">
                  <span class="text-[#FF7043] font-bold text-lg">¥{{ product.currentPrice }}</span>
                  <button
                    @click.stop="addToCart(product)"
                    class="w-9 h-9 bg-orange-50 hover:bg-[#FF7043]/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <i class="fa fa-shopping-cart text-[#FF7043] text-[16px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </infiniteScroll>
      </div>
    </div>
  </div>

  <ShopFoot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductList, getProductListId } from '@/api/pet-shop/shop'
import infiniteScroll from '@/views/petShop/shop/components/infiniteScroll.vue'

// 路由实例
const router = useRouter()
const route = useRoute()

interface ApiCategory {
  id: string
  name: string
  children: ApiCategory[] | null
}
interface SubCategory {
  id: string
  name: string
  path: string
}
interface Product {
  id: string
  title: string
  currentPrice: number
  mainImage: string
  shopName: string
  subTitle: string
  sales: number
}

const loading = ref(false)
const products = ref<Product[]>([])
const total = ref(0) // 商品总数
const pageNum = ref(1) // 当前页
const pageSize = ref(12) // 每页条数
const allCategories = ref<ApiCategory[]>([]) // 全部分类数据
const hasMore = ref(true) // 是否还有更多数据

// 当前分类ID
const currentCategoryId = computed(() => {
  return route.params.category as string
})
const currentSubCategoryId = computed(() => {
  const pathArr = route.path.split('/').filter(Boolean)
  return pathArr.length >= 3 ? pathArr[2] : ''
})

//加载分类数据
const loadAllCategories = async () => {
  try {
    const res = await getProductListId()
    if (res) {
      allCategories.value = res
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const getCategoryName = (id: number | string): string => {
  const targetId = id.toString()

  const findName = (cats: ApiCategory[], targetId: string): string => {
    for (const cat of cats) {
      if (cat.id?.toString() === targetId) return cat.name || '未知分类'
      if (cat.children && Array.isArray(cat.children)) {
        const childName = findName(cat.children, targetId)
        if (childName) return childName
      }
    }
  }
  console.log(allCategories.value)
  return findName(allCategories.value, targetId)
}
// 当前分类名称
const currentCategoryName = computed(() => {
  console.log(currentCategoryId.value)
  return getCategoryName(currentCategoryId.value)
})
// 当前子分类名称
const currentSubCategoryName = computed(() => {
  return currentSubCategoryId.value ? getCategoryName(currentSubCategoryId.value) : ''
})

//加载商品列表
const loadProducts = async () => {
  loading.value = true
  try {
    const res = await getProductList(
      Number(currentCategoryId.value),
      Number(pageNum.value),
      Number(pageSize.value),
    )
    console.log(res)
    if (res) {
      if (pageNum.value === 1) {
        products.value = res.list || []
      } else {
        products.value = [...products.value, ...(res.list || [])]
      }
      total.value = res.total || 0
      hasMore.value = products.value.length < total.value
    }
  } catch (error) {
    console.error('加载商品失败:', error)
    if (pageNum.value === 1) {
      products.value = []
    }
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

// 加载更多数据
const loadMore = () => {
  if (!loading.value && hasMore.value) {
    pageNum.value++
    loadProducts()
  }
}

// 监听分类变化，重置页码和数据
watch([currentCategoryId, currentSubCategoryId], () => {
  pageNum.value = 1
  products.value = []
  hasMore.value = true
  loadProducts()
})

const handleCategoryChange = (category: { id?: string }) => {
  if (category.id) {
    router.push({
      path: `/${category.id}`,
      query: { typeId: category.id },
    })
  }
}
const handleSubCategoryChange = (mainId: string, subCategory: SubCategory) => {
  if (subCategory.id) {
    router.push({
      path: subCategory.path,
      query: { typeId: subCategory.id },
    })
  }
}

const handleProductClick = (product: Product) => {
  router.push(`/product-detail/${product.id}`)
}
const addToCart = (product: Product) => {
  console.log('添加到购物车:', product)
}

onMounted(() => {
  loadAllCategories()
  loadProducts()
})
</script>

<style scoped>
.product-list-container {
  padding: 20px 40px;
  max-width: 1200px;
  width: 100%;
}
.product-card {
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-2px);
}
</style>
