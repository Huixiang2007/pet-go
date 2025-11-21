<template>
  <div class="w-full">
  <NavBar />
  <header class="bg-white shadow-md top-[85px] left-0 right-0 z-50 " :class="{ shadow: isScrolledPast50 }">
      <ShopCategoryNav/>

  </header>
<main class="flex flex-col items-center bg-[#fefcea] min-h-screen">

    <div class="bg-white rounded-lg shadow-sm p-6 my-8 mx-[120px] shawdow-xl">
      <div class="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
        <h1 class="text-md font-bold text-gray-700">搜索结果</h1>
        <span class="text-gray-500 text-sm">找到 128 件相关商品</span>
      </div>


       <div class="flex items-center justify-center px-6">
      <button class="relative px-5 py-2 bg-[#fefcec] text-[#f5a623] font-medium text-sm rounded-md border border-[#f5a623] mr-2 transition-all hover:bg-[#fff8f0]">
        筛选状态
       <span class="absolute top-[-0.95rem] right-[-0.75rem] w-12 h-6 bg-red-500 text-white rounded-[0.5rem] flex items-center justify-center text-xs">已筛选</span>
      </button>
      <button class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 mr-2 transition-all hover:border-[#f5a623] hover:text-[#f5a623] flex items-center gap-1">
        <i class="fa fa-money-check-alt"></i>
        价格
        <div  class="flex flex-col items-center justify-center relative mx-2">
          <i class="fa fa-angle-up absolute" :class="activesort ? 'opacity-100' : 'opacity-0'"></i>
        <i class="fa fa-angle-down absolute"></i>
        </div>
      </button>

      <button
      class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 transition-all hover:border-[#f5a623] hover:text-[#f5a623] flex items-center gap-1">
        区间
        <i class="fa fa-angle-down"></i>
      </button>

      <button
      @click="showRegionModal = true"
       class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 ml-4 transition-all hover:border-[#f5a623] hover:text-[#f5a623]">
          <i class="fa fa-map-marked"></i>
        地区选择
      </button>

      <button
      @click="showBrandModal=true"
      class="px-5 py-2 text-gray-600 font-medium text-sm rounded-md border border-gray-200 ml-2 transition-all hover:border-[#f5a623] hover:text-[#f5a623]">
        <i class="fa fa-shopping-bag"></i>
        品牌选择
      </button>
        <!-- 地区选择弹窗 -->
    <div v-if="showRegionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[5000]" @click.self="showRegionModal = false">
      <div class="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col animate-fade-in">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-800">选择地区</h3>
          <button @click="showRegionModal = false" class="text-gray-500 hover:text-gray-700 text-xl">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div class="grid grid-cols-4 gap-2 mb-4">
            <button
              v-for="region in regions"
              :key="region"
              @click="selectRegion(region)"
              :class="['px-3 py-2 rounded-md text-sm transition-all', selectedRegion === region ? 'bg-[#f5a623] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
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
                :class="['px-3 py-2 rounded-md text-sm transition-all', selectedCity === city ? 'bg-[#f5a623] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
              >
                {{ city }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end p-4 border-t border-gray-200 gap-3">
          <button @click="resetRegion" class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
            重置
          </button>
          <button @click="confirmRegion" class="px-4 py-2 bg-[#f5a623] text-white rounded-md hover:bg-[#e09612] transition-colors">
            确定
          </button>
        </div>
      </div>
    </div>

<!-- 品牌选择弹窗 -->
    <div v-if="showBrandModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[5000]" @click.self="showBrandModal = false">
      <div class="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col animate-fade-in">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-800">选择品牌</h3>
          <button @click="showBrandModal = false" class="text-gray-500 hover:text-gray-700 text-xl">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div class="grid grid-cols-3 gap-3">
            <label
              v-for="brand in filteredBrands"
              :key="brand.id"
              class="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer transition-all hover:border-[#f5a623] hover:bg-[#fff8f0]"
            >
              <input
                type="checkbox"
                :value="brand.name"
                v-model="selectedBrands"
                class="w-4 h-4 text-[#f5a623] focus:ring-[#f5a623] border-gray-300 rounded"
              >
              <span class="ml-2">{{ brand.name }}</span>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-end p-4 border-t border-gray-200 gap-3">
          <button @click="resetBrands" class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
            重置
          </button>
          <button @click="confirmBrands" class="px-4 py-2 bg-[#f5a623] text-white rounded-md hover:bg-[#e09612] transition-colors">
            确定
          </button>
        </div>
      </div>
    </div>
    </div></div>


    <!-- 商品列表 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
        <div class="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div class="h-48 bg-gray-100 flex items-center justify-center">
            <img src="https://picsum.photos/300/200" alt="商品图片" class="w-full h-full object-cover">
          </div>
          <div class="p-4">
            <h3 class="text-gray-800 font-medium mb-2 line-clamp-2">宠物专用粮 全价成猫粮 营养均衡易消化</h3>
            <div class="flex items-center text-gray-500 text-sm mb-3">
              <span>产地：河南新乡</span>
              <span class="mx-2">•</span>
              <span>品牌：宠乐滋</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#f5a623] font-bold text-lg">¥89.00</span>
              <button class="text-white bg-[#f5a623] px-3 py-1 rounded-md text-sm hover:bg-[#e09612] transition-colors">
                加入购物车
              </button>
            </div>
          </div>
        </div>

        <!-- 复制上方商品卡片，生成多个商品（实际项目中用v-for循环） -->
        <div class="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div class="h-48 bg-gray-100 flex items-center justify-center">
            <img src="https://picsum.photos/301/200" alt="商品图片" class="w-full h-full object-cover">
          </div>
          <div class="p-4">
            <h3 class="text-gray-800 font-medium mb-2 line-clamp-2">宠物牵引绳 反光防挣脱 中小型犬专用</h3>
            <div class="flex items-center text-gray-500 text-sm mb-3">
              <span>产地：北京</span>
              <span class="mx-2">•</span>
              <span>品牌：宠伴行</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#f5a623] font-bold text-lg">¥59.00</span>
              <button class="text-white bg-[#f5a623] px-3 py-1 rounded-md text-sm hover:bg-[#e09612] transition-colors">
                加入购物车
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页区-->
      <div class="flex justify-center mt-10">
        <nav class="flex items-center space-x-2">
          <button class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">上一页</button>
          <button class="px-4 py-2 border border-[#f5a623] bg-[#f5a623] text-white rounded-md">1</button>
          <button class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">2</button>
          <button class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">3</button>
          <button class="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">下一页</button>
        </nav>
      </div>
    </div>
</main></div>

</template>

<script lang="ts" setup>
 import { ref, computed, onMounted } from 'vue'

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
const brandSearch = ref('')
const selectedBrands = ref<string[]>([])

// 地区数据
const regions = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '山东', '河南', '湖南']
const cities: Record<string, string[]> = {
  '北京': ['北京'],
  '上海': ['上海'],
  '广东': ['广州', '深圳', '东莞', '佛山', '珠海'],
  '浙江': ['杭州', '宁波', '温州', '嘉兴', '绍兴'],
  '江苏': ['南京', '苏州', '无锡', '常州', '徐州'],
  '四川': ['成都', '绵阳', '德阳', '自贡', '泸州'],
  '湖北': ['武汉', '襄阳', '宜昌', '黄石', '十堰'],
  '山东': ['济南', '青岛', '烟台', '潍坊', '淄博'],
  '河南': ['郑州', '洛阳', '开封', '安阳', '新乡'],
  '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳']
}

// 品牌数据
const brands = [
  { id: 1, name: '宠乐滋' },
  { id: 2, name: '宠伴行' },
  { id: 3, name: '皇家Royal Canin' },
  { id: 4, name: '渴望Orijen' },
  { id: 5, name: '爱肯拿Acana' },
  { id: 6, name: '比瑞吉' },
  { id: 7, name: '伯纳天纯' },
  { id: 8, name: '冠能Pro Plan' },
  { id: 9, name: '麦德氏IN-VET' },
  { id: 10, name: '卫仕NOURSE' },
  { id: 11, name: '宝路Pedigree' },
  { id: 12, name: '伟嘉Whiskas' },
  { id: 13, name: '伊纳宝INABA' },
  { id: 14, name: '顽皮Wanpy' },
  { id: 15, name: '阿飞和巴弟' },
  { id: 16, name: '佩玛思特PetMaster' },
  { id: 17, name: '蓝氏LANSIE' },
  { id: 18, name: '素力高Solid Gold' }
]

// 过滤后的品牌列表
const filteredBrands = computed(() => {
  if (!brandSearch.value) return brands
  return brands.filter(brand => brand.name.toLowerCase().includes(brandSearch.value.toLowerCase()))
})

// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  scrollY.value = window.scrollY
  showBackToTop.value = scrollY.value > 300
  isScrolledPast50.value = scrollY.value > 50
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
  brandSearch.value = ''
}

const confirmBrands = () => {
  // 这里可以添加确认品牌选择后的逻辑
  console.log('选择的品牌:', selectedBrands.value)
  showBrandModal.value = false
}
</script>
<style scoped>
</style>
