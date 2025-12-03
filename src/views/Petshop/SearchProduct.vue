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
      <div class="bg-white rounded-lg shadow-sm p-6 my-8 mx-[120px] shawdow-xl">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h1 class="text-md font-bold text-gray-700">搜索结果</h1>
            <span class="text-gray-500 text-sm">找到 128 件相关商品</span>
          </div>

          <div class="flex items-center justify-center px-6">
            <button
              class="relative px-5 py-2 bg-[#fefcec] text-[#f5a623] font-medium text-sm rounded-md border border-[#f5a623] mr-2 transition-all hover:bg-[#fff8f0]"
            >
              筛选状态
              <span
                class="absolute top-[-0.95rem] right-[-0.75rem] w-12 h-6 bg-red-500 text-white rounded-[0.5rem] flex items-center justify-center text-xs"
                >已筛选</span
              >
            </button>
            <button
              class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 mr-2 transition-all hover:border-[#f5a623] hover:text-[#f5a623] flex items-center gap-1"
            >
              <i class="fa fa-money-check-alt"></i>
              价格
              <div class="flex flex-col items-center justify-center relative mx-2">
                <i
                  class="fa fa-angle-up absolute"
                  :class="activesort ? 'opacity-100' : 'opacity-0'"
                ></i>
                <i class="fa fa-angle-down absolute"></i>
              </div>
            </button>

            <button
              class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 transition-all hover:border-[#f5a623] hover:text-[#f5a623] flex items-center gap-1"
            >
              区间
              <i class="fa fa-angle-down"></i>
            </button>

            <button
              @click="showRegionModal = true"
              class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 ml-4 transition-all hover:border-[#f5a623] hover:text-[#f5a623]"
            >
              <i class="fa fa-map-marked"></i>
              地区选择
            </button>

            <button
              @click="showBrandModal = true"
              class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 ml-2 transition-all hover:border-[#f5a623] hover:text-[#f5a623]"
            >
              <i class="fa fa-shopping-bag"></i>
              品牌选择
            </button>
            <!-- 地区选择弹窗 -->
            <div
              v-if="showRegionModal"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-[5000]"
              @click.self="showRegionModal = false"
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
                  <div v-if="selectedRegion && cities[selectedRegion]" class="mt-6">
                    <h4 class="text-md font-medium text-gray-700 mb-3">{{ selectedRegion }}城市</h4>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="city in cities[selectedRegion]"
                        :key="city"
                        @click="selectCity(city)"
                        :class="[
                          'px-3 py-2 rounded-md text-sm transition-all',
                          selectedCity === city
                            ? 'bg-[#f5a623] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                        ]"
                      >
                        {{ city }}
                      </button>
                    </div>
                  </div>
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

            <!-- 品牌选择弹窗 -->
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
                      v-for="(brand,index ) in brandList"
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
        <div class="products mt-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">
              <i class="fa fa-star text-[#FF7043] mr-2"></i>热门商品
            </h2>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
              @click="productsDeatil(product.id)"
            >
              <div class="w-full h-64 bg-gray-50 overflow-hidden">
                <img
                  :src="product.mainImage"
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
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref,  onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRouter().currentRoute.value

// 滚动相关状态
const scrollY = ref(0)
const showBackToTop = ref(false)
const isScrolledPast50 = ref(false)
const activesort = ref(false)
const showRegionModal = ref(false)
const showBrandModal = ref(false)

const selectedRegion = ref('')
const selectedCity = ref('')

// 品牌选择
const brandList = ref<string[]>([])  // 品牌列表
const selectedBrands = ref<string[]>([])  // 选择的品牌

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
  title: string
}
const productsDeatil = (id: string) => {
  router.push({
    path: `/productDetail/${id}`,
  })
}
//搜索
const keywords = (route.query.keyword as string) || ''
console.log('搜索关键词:', keywords)
const SearchProducts = () => {
  if (!idLoading.value && hasmore.value) {
    idLoading.value = true
    axios
      .request({
        url: '/server/api/shop/product/filter',
        method: 'POST',
        data: {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          title: keywords,
        },
      })
      .then((res) => {
        idLoading.value = false
        console.log(res.data)
        const newSearchProducts = res.data.data.list

        products.value = [...products.value, ...newSearchProducts]
        if (newSearchProducts.length < pageSize.value) {
          hasmore.value = false
        } else {
          currentPage.value++
        }
      })
      .catch((error) => {
        idLoading.value = false
        console.log(error)
      })
  }
}
//获取品牌
const getBrands = () => {
  axios
    .request({
      url: '/server/api/shop/product/add/brand',
      method: 'GET',
    })
    .then((res) => {
      console.log(res.data)
      brandList.value = res.data.data
    })
    .catch((error) => {
      console.log(error)
    })
}
//品牌筛选
const confirmBrands = () => {
  console.log('选择的品牌:', selectedBrands.value)
  showBrandModal.value = false

  if (!idLoading.value && hasmore.value) {
    idLoading.value = true
    axios
      .request({
        url: '/server/api/shop/product/filter',
        method: 'POST',
        data: {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          title: keywords,
          brandName: selectedBrands.value,
        },
      })
      .then((res) => {
        idLoading.value = false
        console.log(res.data)
        const newSearchProducts = res.data.data.list

        products.value = [...products.value, ...newSearchProducts]
        if (newSearchProducts.length < pageSize.value) {
          hasmore.value = false
        } else {
          currentPage.value++
        }
      })
      .catch((error) => {
        idLoading.value = false
        console.log(error)
      })
  }
}

// 地区数据
const regions = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '山东', '河南', '湖南']
const cities: Record<string, string[]> = {
  北京: ['北京'],
  上海: ['上海'],
  广东: ['广州', '深圳', '东莞', '佛山', '珠海'],
  浙江: ['杭州', '宁波', '温州', '嘉兴', '绍兴'],
  江苏: ['南京', '苏州', '无锡', '常州', '徐州'],
  四川: ['成都', '绵阳', '德阳', '自贡', '泸州'],
  湖北: ['武汉', '襄阳', '宜昌', '黄石', '十堰'],
  山东: ['济南', '青岛', '烟台', '潍坊', '淄博'],
  河南: ['郑州', '洛阳', '开封', '安阳', '新乡'],
  湖南: ['长沙', '株洲', '湘潭', '衡阳', '邵阳'],
}



// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  SearchProducts()
     getBrands ()
})

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

// 地区选择相关方法
const selectRegion = (region: string) => {
  selectedRegion.value = region
  selectedCity.value = '' // 重置城市选择
}

const selectCity = (city: string) => {
  selectedCity.value = city
}

const resetRegion = () => {
  selectedRegion.value = ''
  selectedCity.value = ''
}

const confirmRegion = () => {
  // 这里可以添加确认地区选择后的逻辑
  console.log('选择的地区:', selectedRegion.value, '选择的城市:', selectedCity.value)
  showRegionModal.value = false
}

// 品牌选择相关方法
const resetBrands = () => {
  selectedBrands.value = []
}

</script>
<style scoped></style>
