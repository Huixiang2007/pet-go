<template>
  <div class="w-full">
    <NavBar />
    <header
      class="bg-white shadow-md top-[85px] left-0 right-0 z-50"
      :class="{ shadow: isScrolledPast50 }"
    >
      <ShopCategoryNav />
    </header>
    <main class="flex flex-col items-center bg-[#fefcea] min-h-screen">
      <div class="bg-white rounded-lg shadow-sm py-6 my-8 shadow-xl px-12 w-[1260px]">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h1 class="text-md font-bold text-gray-700">搜索结果</h1>
            <span class="text-gray-500 text-sm">找到{{ products.total }}件相关商品</span>
          </div>

          <div class="flex items-center justify-center px-6">
            <button
              class="relative px-5 py-2 bg-[#fefcec] text-[#f5a623] font-medium text-sm rounded-md border border-[#f5a623] mr-2 transition-all hover:bg-[#fff8f0]"
            >
              筛选状态
            </button>

            <button
              @click="changeSortType('price')"
              class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 mr-2 transition-all hover:border-[#f5a623] hover:text-[#f5a623] flex items-center gap-1"
            >
              <i class="fa fa-money-check-alt"></i>
              价格
              <div class="flex flex-col items-center justify-center relative mx-2">
                <i
                  class="fa fa-angle-up absolute"
                  :class="sortType === 1 ? 'opacity-100' : 'opacity-0'"
                ></i>
                <i
                  class="fa fa-angle-down absolute"
                  :class="sortType === 2 ? 'opacity-100' : 'opacity-0'"
                ></i>
              </div>
            </button>
            <button
              @click="changeSortType('sales')"
              class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 mr-2 transition-all hover:border-[#f5a623] hover:text-[#f5a623] flex items-center gap-1"
            >
              <i class="fa fa-bar-chart"></i>
              销量
              <div class="flex flex-col items-center justify-center relative mx-2">
                <i
                  class="fa fa-angle-up absolute"
                  :class="sortType === 3 ? 'opacity-100' : 'opacity-0'"
                ></i>
                <i
                  class="fa fa-angle-down absolute"
                  :class="sortType === 4 ? 'opacity-100' : 'opacity-0'"
                ></i>
              </div>
            </button>

            <button
              @click="showRegionModal = true"
              class="relative px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 ml-4 transition-all hover:border-[#f5a623] hover:text-[#f5a623]"
            >
              <i class="fa fa-map-marked"></i>
              地区选择
              <span
                v-if="filterRegion"
                class="absolute top-[-0.95rem] right-[-0.55rem] w-12 h-6 bg-red-500 text-white rounded-[0.5rem] flex items-center justify-center text-xs"
                >已筛选</span
              >
            </button>

            <button
              @click="showBrandModal = true"
              class="relative px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 ml-2 transition-all hover:border-[#f5a623] hover:text-[#f5a623]"
            >
              <i class="fa fa-shopping-bag"></i>
              <span
                v-if="filterBrand"
                class="absolute top-[-0.95rem] right-[-0.55rem] w-12 h-6 bg-red-500 text-white rounded-[0.5rem] flex items-center justify-center text-xs"
                >已筛选</span
              >
              品牌选择
            </button>

            <div
              v-if="showRegionModal"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-[5000]"
            >
              <div
                class="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col animate-fade-in"
              >
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 class="text-lg font-bold text-gray-800">选择地区</h3>
                  <button
                    @click="showRegionModal = false"
                    class="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </div>
                <div class="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                  <div class="grid grid-cols-4 gap-2 mb-4">
                    <button
                      v-for="region in regions"
                      :key="region"
                      @click="selectRegion(region)"
                      :class="[
                        'px-3 py-2 rounded-md text-sm transition-all',
                        selectedRegion === region
                          ? 'bg-[#f5a623] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                      ]"
                    >
                      {{ region }}
                    </button>
                  </div>
                  <div class="flex items-center justify-end p-4 border-t border-gray-200 gap-3">
                    <button
                      @click="resetRegion"
                      class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      重置
                    </button>
                    <button
                      @click="confirmRegion"
                      class="px-4 py-2 bg-[#f5a623] text-white rounded-md hover:bg-[#e09612] transition-colors"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="showBrandModal"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-[5000]"
              @click.self="showBrandModal = false"
            >
              <div
                class="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col animate-fade-in"
              >
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 class="text-lg font-bold text-gray-800">选择品牌</h3>
                  <button
                    @click="showBrandModal = false"
                    class="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </div>
                <div class="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                  <div class="grid grid-cols-3 gap-3">
                    <label
                      v-for="(brand, index) in brandList"
                      :key="index"
                      class="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer transition-all hover:border-[#f5a623] hover:bg-[#fff8f0]"
                    >
                      <input
                        type="checkbox"
                        :value="brand"
                        v-model="selectedBrands"
                        class="w-4 h-4 text-[#f5a623] focus:ring-[#f5a623] border-gray-300 rounded"
                      />
                      <span class="ml-2">{{ brand }}</span>
                    </label>
                  </div>
                </div>
                <div class="flex items-center justify-end p-4 border-t border-gray-200 gap-3">
                  <button
                    @click="resetBrands"
                    class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    重置
                  </button>
                  <button
                    @click="confirmBrands"
                    class="px-4 py-2 bg-[#f5a623] text-white rounded-md hover:bg-[#e09612] transition-colors"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品列表 -->
        <div v-if="products.length > 0" class="products mt-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">
              <i class="fa fa-star text-[#FF7043] mr-2"></i>热门商品
            </h2>
          </div>
          <div class="grid grid-cols-4 gap-[2rem]">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card bg-white rounded-lg w-[270px] overflow-hidden shadow hover:shadow-md transition-shadow"
              @click="productsDeatil(product.id)"
            >
              <div class="w-full h-64 bg-gray-50 overflow-hidden">
                <img
                  :src="product.mainImage || './img/宠物1.jpg'"
                  :alt="product.title"
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div class="p-4">
                <div class="mb-2">
                  <h3 class="font-medium text-gray-800 line-clamp-1">{{ product.title }}</h3>
                  <p class="text-xs text-gray-500 mt-1">品牌：{{ product.brandName }}</p>
                </div>

                <div class="flex items-center text-xs text-gray-400 mb-3">
                  <span>{{ product.shopName }}</span>
                  <span class="mx-2">|</span>
                  <span>销量：{{ product.sales }}+</span>
                </div>
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-[#FF7043] font-bold text-lg"
                      >¥{{ product.currentPrice }}</span
                    >
                    <span class="text-xs text-gray-400 ml-2">{{ product.warrantyTip }}</span>
                  </div>
                  <button
                    class="w-9 h-9 hover:bg-[#FF7043]/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    <i class="fa fa-shopping-cart text-[#FF7043] text-[16px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!idLoading && products.length === 0" class="text-center py-16">
          <i class="fa fa-search text-5xl text-gray-300"></i>
          <p class="mt-4 text-lg text-gray-500">抱歉，没有找到相关商品</p>
          <p class="text-gray-400 mt-2">请尝试其他关键词或筛选条件</p>
          <button
            @click="clearAllFilters"
            class="mt-4 px-6 py-2 bg-[#f5a623] text-white rounded-md hover:bg-[#e09612]"
          >
            清空搜索条件
          </button>
        </div>
      </div>
    </main>
  </div>
  <img
    v-show="showBackToTop"
    @click="scrollToTop"
    class="fixed bottom-6 right-4 z-50 w-20 h-20 hover:scale-105 transition-transform"
    aria-label="回到顶部"
    src="/img/火箭.gif"
  />
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()


const filters = ref({
  title: '', // 搜索关键词
  brandName: '' ,// 选中的品牌
  region: '' // 选中的地区
})

// 排序类型（1-价格升序/2-价格降序/3-销量升序/4-销量降序）
const sortType = ref<number>(0) // 0表示未选择排序

// 滚动相关状态
const scrollY = ref(0)
const showBackToTop = ref(false)
const isScrolledPast50 = ref(false)
const showRegionModal = ref(false)
const showBrandModal = ref(false)
const filterRegion = ref(false)
const filterBrand = ref(false)
const selectedRegion = ref('')
const selectedCity = ref('')
const selectedBrands = ref('')

const regions = ref<string[]>([])
const brandList = ref<string[]>([])

const currentPage = ref(1)
const hasmore = ref(true)
const pageSize = ref(12)
const idLoading = ref(false)
const products = ref<Products[]>([])

interface Products {
  id: string
  mainImage: string
  brandName: string
  shopName: string
  sales: number
  currentPrice: number
  originalPrice: number
  warrantyTip: string
  title: string,
  total: number,
}

const productsDeatil = (id: string) => {
  router.push({
    path: `/product-detail/${id}`,
  })
}

// 切换排序类型
const changeSortType = (type: 'price' | 'sales') => {
  if (type === 'price') {
    // 价格排序：当前是升序则切换为降序，否则默认升序
    sortType.value = sortType.value === 1 ? 2 : 1
  } else if (type === 'sales') {
    // 销量排序：当前是升序则切换为降序，否则默认升序
    sortType.value = sortType.value === 3 ? 4 : 3
  }
  // 重置分页并重新搜索
  resetSearchState()
  SearchProducts()
}

const SearchProducts = () => {
  if (idLoading.value || !hasmore.value) return

  console.log("搜索商品请求参数:")
  console.log("title:", filters.value.title)
  console.log("brandName:", filters.value.brandName)
  console.log("region:", filters.value.region)
  console.log("sortType:", sortType.value)

  idLoading.value = true
  axios
    .request({
      url: '/server/api/shop/product/filter',
      method: 'POST',
      data: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        title: filters.value.title,
        brandNameList: filters.value.brandName,
        region: filters.value.region,
        sortType: sortType.value // 新增排序类型参数
      },
    })
    .then((res: any) => {
      console.log("商品搜索响应:", res)
      idLoading.value = false
      const newSearchProducts = res.data.data?.list || []
      products.value = [...products.value, ...newSearchProducts]
      products.value.total = res.data.data.total || 0

      if (newSearchProducts.length < pageSize.value) {
        hasmore.value = false
      } else {
        currentPage.value++
      }
    })
    .catch((error) => {
      idLoading.value = false
      console.error('商品搜索失败:', error)
    })
}

const resetSearchState = () => {
  products.value = []
  currentPage.value = 1
  hasmore.value = true
  idLoading.value = false
}

const clearAllFilters = () => {
  // 重置筛选条件
  filters.value = {
    title: '',
    brandName: '',
    region: ''
  }

  sortType.value = 0

  selectedBrands.value = ''
  selectedRegion.value = ''
  filterBrand.value = false
  filterRegion.value = false
  // 重置分页并重新搜索
  resetSearchState()
  SearchProducts()
}


watch(
  () => route.query.keyword,
  (newValue) => {
    filters.value.title = (newValue as string) || ''
    console.log("当前关键词:", filters.value.title)
    resetSearchState()
    SearchProducts()
  },
  { immediate: true }
)

// 获取品牌列表
const getBrands = () => {
  axios
    .request({
      url: '/server/api/shop/product/add/brand',
      method: 'GET',
    })
    .then((res: any) => {
      console.log("品牌列表响应:", res)
      brandList.value = res.data.data || []
    })
    .catch((error) => {
      console.error('获取品牌列表失败:', error)
    })
}

// 获取地区列表
const getRegions = () => {
  axios
    .request({
      url: '/server/api/shop/product/delivery',
      method: 'POST',
      data: {
        pageSize: 100,
        page: 1,
      },
    })
    .then((res: any) => {
      console.log("地区列表响应:", res)
      regions.value = res.data.data || []
      if (regions.value.length > 0 && regions.value[0] !== '全部') {
        regions.value.unshift('全部')
      }
    })
    .catch((error) => {
      console.error('获取地区列表失败:', error)
    })
}

// 品牌筛选确认
const confirmBrands = () => {
  filters.value.brandName = selectedBrands.value
  filterBrand.value = !!selectedBrands.value
  showBrandModal.value = false
  resetSearchState()
  SearchProducts()
}

// 地区选择
const selectRegion = (region: string) => {
  selectedRegion.value = region === '全部' ? '' : region
  selectedCity.value = ''
}

const resetRegion = () => {
  selectedRegion.value = ''
  selectedCity.value = ''
  filters.value.region = ''
  filterRegion.value = false
}

const resetBrands = () => {
  selectedBrands.value = ''
  filters.value.brandName = ''
  filterBrand.value = false
}

// 地区筛选确认
const confirmRegion = () => {
  filters.value.region = selectedRegion.value
  filterRegion.value = !!selectedRegion.value
  showRegionModal.value = false
  resetSearchState()
  SearchProducts()
}

// 滚动处理
const handleScroll = () => {
  scrollY.value = window.scrollY
  showBackToTop.value = scrollY.value > 300
  isScrolledPast50.value = scrollY.value > 50

  const scrollBottom =
    document.documentElement.scrollHeight - document.documentElement.clientHeight - scrollY.value
  if (scrollBottom <= 100) {
    SearchProducts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  getBrands()
  getRegions()
  SearchProducts()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
