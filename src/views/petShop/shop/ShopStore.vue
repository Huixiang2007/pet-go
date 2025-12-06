<template>
  <NavBar />
  <div
    class="bg-gradient-to-b from-amber-50 to-orange-50 min-h-screen pt-24 flex flex-col items-center"
  >
    <div class="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="bg-white rounded-full shadow-sm py-2 px-4 mb-6 flex items-center gap-3 overflow-hidden"
      >
        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="3"
          class="text-sm text-orange-600"
        >
          🐾 店铺活动：全场宠物食品满199减30 | 新品玩具买二送一 | 关注店铺领5元无门槛券 🐾
        </marquee>
        <i class="fa fa-bell text-orange-500 ml-2"></i>
      </div>

      <div class="bg-white rounded-2xl shadow-lg px-6 sm:px-10 py-4 mb-8">
        <div class="flex flex-col md:flex-row items-center gap-8">

          <div class="shop-avatar w-28 h-28 rounded-full overflow-hidden border-4 border-orange-100 shadow-lg hover:scale-105 transition-transform">
            <img :src="shopItem.shopAvatar" alt="店铺头像" class="w-full h-full object-cover hover:scale-110">
          </div>
          <div class="shop-detail text-center md:text-left flex-1 flex flex-row justify-between">
            <div>
            <h2 class="text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-center md:justify-start gap-3">
            {{ shopItem.shopName }}
              <span class="text-xs bg-orange-500 text-white px-2 py-1 rounded-full shadow-sm">{{ shopItem.shopType }}</span>
            </h2>
            <div class="shop-rating flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <div class="rating-score text-3xl font-bold text-orange-600">{{ shopItem.creditScore }}分</div>

              <div class="rating-star text-amber-500 text-lg">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="rating-text text-gray-600">超99%用户满意</div>
            </div>

            <div class="shop-meta text-gray-600 text-sm mb-5 flex flex-wrap justify-center md:justify-start gap-4">
              <span class="flex items-center gap-1"><i class="fa fa-calendar text-orange-500"></i>开店时间：{{ shopItem.openTime }}</span>
              <span class="flex items-center gap-1"><i class="fa fa-truck text-orange-500"></i>{{ shopItem.status }}</span>
            </div>
            <p class="shop-desc text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto md:mx-0">
              {{ shopItem.description }}
            </p></div>
            <div>
            <div class="shop-btn flex mt-20 justify-center md:justify-start gap-4">
              <button class="bg-white text-orange-500 px-6 py-2 rounded-full text-sm border-2 border-orange-500 hover:bg-orange-50 transition-all active:scale-95">联系客服</button>
            </div></div>

          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg py-3 mb-8">
        <div class="flex flex-wrap justify-around items-center gap-6">
          <div class="service-item flex flex-col items-center gap-2">
            <i class="fa fa-truck text-3xl text-orange-500"></i>
            <span class="text-sm text-gray-600">全国包邮</span>
          </div>
          <div class="service-item flex flex-col items-center gap-2">
            <i class="fa fa-shield text-3xl text-orange-500"></i>
            <span class="text-sm text-gray-600">正品保障</span>
          </div>
          <div class="service-item flex flex-col items-center gap-2">
            <i class="fa fa-refresh text-3xl text-orange-500"></i>
            <span class="text-sm text-gray-600">7天无理由退换</span>
          </div>
          <div class="service-item flex flex-col items-center gap-2">
            <i class="fa fa-comments text-3xl text-orange-500"></i>
            <span class="text-sm text-gray-600">24小时客服</span>
          </div>
          <div class="service-item flex flex-col items-center gap-2">
            <i class="fa fa-wrench text-3xl text-orange-500"></i>
            <span class="text-sm text-gray-600">一年质保</span>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i class="fa fa-fire text-orange-500"></i>热销商品
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-103 transition-all cursor-pointer border border-gray-100"
          >
            <div class="relative w-full h-48 sm:h-56 overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
              <span
                v-if="product.isNew"
                class="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
                >新品</span
              >
            </div>
            <div class="p-4">
              <h3 class="font-medium text-gray-800 line-clamp-1">{{ product.name }}</h3>
              <p class="text-gray-500 text-xs mt-1 line-clamp-1">{{ product.spec }}</p>
              <div class="mt-2 flex items-center gap-1">
                <div class="rating-star text-amber-400 text-xs">
                  <i v-for="star in product.rating" :key="star" class="fa fa-star"></i>
                </div>
                <span class="text-xs text-gray-500">{{ product.rating }}分</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">销量：{{ product.sales }}+</p>
              <div class="mt-3 flex justify-between items-center">
                <span class="text-orange-600 font-bold text-lg">¥{{ product.price }}</span>
                <button
                  class="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors"
                >
                  <i class="fa fa-shopping-cart text-orange-500 text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ShopFoot />
</template>

<script lang="ts" setup>
import { ref ,onMounted} from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
const router = useRoute()
const shopid = router.query.id


// 定义更详细的商品数据结构
interface Product {
  id: string | number
  name: string
  price: number
  spec: string
  image: string
  category: string
  rating: number
  sales: string
  isNew?: boolean
  description?: string
}
const products = ref<Product[]>([
  {
    id: 1,
    name: '麦富迪成犬通用狗粮',
    price: 29,
    spec: '1kg装 | 鸡肉味 | 无谷低敏',
    image: 'https://picsum.photos/id/237/300/300',
    category: 'food',
    rating: 5,
    sales: '2.3万',
    isNew: false,
  },
  {
    id: 2,
    name: '希宝进口猫咪零食罐',
    price: 15,
    spec: '85g/罐 | 吞拿鱼味 | 慕斯质地',
    image: 'https://picsum.photos/id/1074/300/300',
    category: 'food',
    rating: 4,
    sales: '1.8万',
    isNew: true,
  },
  {
    id: 3,
    name: '耐咬橡胶宠物玩具球',
    price: 12,
    spec: '直径8cm | 磨牙洁齿 | 弹力十足',
    image: 'https://picsum.photos/id/1025/300/300',
    category: 'toy',
    rating: 5,
    sales: '3.1万',
    isNew: false,
  },
  {
    id: 4,
    name: '雪貂留香宠物沐浴露',
    price: 35,
    spec: '500ml | 抑菌除螨 | 蓬松毛发',
    image: 'https://picsum.photos/id/1069/300/300',
    category: 'wash',
    rating: 4,
    sales: '1.5万',
    isNew: false,
  },
  {
    id: 5,
    name: '幼猫专用羊奶粉',
    price: 59,
    spec: '200g | 接近母乳 | 易吸收',
    image: 'https://picsum.photos/id/1084/300/300',
    category: 'food',
    rating: 5,
    sales: '9000',
    isNew: true,
  },
  {
    id: 6,
    name: '自动逗猫棒激光笔',
    price: 28,
    spec: 'USB充电 | 多模式 | 静音设计',
    image: 'https://picsum.photos/id/1059/300/300',
    category: 'toy',
    rating: 4,
    sales: '1.2万',
    isNew: true,
  },
  {
    id: 7,
    name: '宠物外出便携背包',
    price: 89,
    spec: '小号 | 透气网布 | 承重10斤',
    image: 'https://picsum.photos/id/1038/300/300',
    category: 'tool',
    rating: 5,
    sales: '7000',
    isNew: false,
  },
  {
    id: 8,
    name: '宠物指甲剪套装',
    price: 19,
    spec: '不锈钢 | 带锉刀 | 防飞溅',
    image: 'https://picsum.photos/id/1048/300/300',
    category: 'tool',
    rating: 4,
    sales: '2.5万',
    isNew: false,
  },
  {
    id: 9,
    name: '大型犬耐咬牛骨头',
    price: 25,
    spec: '1根装 | 磨牙补钙 | 天然牛骨',
    image: 'https://picsum.photos/id/1024/300/300',
    category: 'toy',
    rating: 5,
    sales: '1.1万',
    isNew: false,
  },
  {
    id: 10,
    name: '宠物除臭喷雾',
    price: 22,
    spec: '300ml | 植物配方 | 持久留香',
    image: 'https://picsum.photos/id/1040/300/300',
    category: 'wash',
    rating: 4,
    sales: '1.7万',
    isNew: false,
  },
  {
    id: 11,
    name: '猫抓板瓦楞纸窝',
    price: 39,
    spec: '大号 | 可磨爪 | 可当猫窝',
    image: 'https://picsum.photos/id/1072/300/300',
    category: 'tool',
    rating: 5,
    sales: '2万',
    isNew: false,
  },
  {
    id: 12,
    name: '狗狗生理裤姨妈巾',
    price: 18,
    spec: 'M码 | 可水洗 | 防漏设计',
    image: 'https://picsum.photos/id/1056/300/300',
    category: 'tool',
    rating: 4,
    sales: '8000',
    isNew: true,
  },
])
interface shop {
  shopName: string;
  shopAvatar: string;
  shopType: string;
  description: string;
  status: string;
  openTime: string;
  creditScore: string;
}
const shopItem = ref<shop>({
  shopName: '',
  shopAvatar: '',
  shopType: '',
  description: '',
  status: '',
  openTime: '',
  creditScore: ''
})

const getstore=()=>{
  axios.request({
    url: `/server/api/shop/shops/detail/${shopid}`,
    method: 'GET'
    }).then(res => {
      console.log('接口返回数据:', res)
      const store = res.data.data
      shopItem.value = store
      console.log('接口返回数据:', store)
    })
  .catch(err => {
    console.log('接口返回错误:', err)
    console.log('接口返回数据:', err.response.data)
  })
}
onMounted(() => {
  getstore()
})


</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

marquee {
  white-space: nowrap;
}

::-webkit-scrollbar-thumb {
  background-color: #f97316;
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  background-color: #fffbeb;
}
</style>
