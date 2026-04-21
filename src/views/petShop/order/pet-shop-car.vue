<template>
  <NavBar />
  <div class="min-h-screen bg-amber-50 pt-[60px] relative overflow-hidden">
    <div class="absolute top-20 left-10 w-32 h-32 bg-yellow-100/50 rounded-full -z-1"></div>
    <div
      class="absolute bottom-20 right-10 w-48 h-48 bg-amber-100/40 rounded-tl-3xl rounded-br-3xl -z-1"
    ></div>

    <main class="mx-auto px-4 sm:px-6 lg:px-[5rem] py-8 relative z-1">
      <div class="flex justify-between items-center mr-10 mb-8">
        <h2 class="text-2xl font-bold flex items-center text-amber-800">
          <i class="fa fa-shopping-cart text-amber-500 mr-2"></i>
          我的购物车
          <span class="ml-3 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full"
            >萌宠清单</span
          >
        </h2>
        <div class="flex items-center gap-3">
          <button
            v-if="cartItems.length > 0"
            class="p-2 rounded-full hover:bg-amber-100 transition-colors flex items-center gap-1"
            @click="handleClearCart"
          >
            <i class="fas fa-trash-alt text-amber-700"></i>
            <span class="hidden sm:inline text-sm text-amber-700">清空</span>
          </button>
          <button
            class="p-2 rounded-full hover:bg-amber-100 transition-colors flex items-center gap-1"
          >
            <i class="fas fa-sign-out-alt text-amber-700"></i>
            <span class="hidden sm:inline text-sm text-amber-700">退出</span>
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="bg-white rounded-2xl p-10 text-center shadow-md border border-amber-100/50"
      >
        <i class="fa fa-spinner fa-spin text-amber-50 text-3xl mb-4"></i>
        <p class="text-amber-700 text-lg">🐕 正在加载购物车...</p>
      </div>

      <div
        v-else-if="cartItems.length === 0"
        class="bg-white rounded-2xl p-10 text-center shadow-md border border-amber-100/50"
      >
        <img
          src="/img/宠物1.jpg"
          alt="空购物车"
          class="w-40 h-40 mx-auto mb-6 opacity-70 object-cover rounded-full border-4 border-amber-100"
        />
        <p class="text-amber-700 mb-8 text-lg">
          您的购物车还是空空的哦～🐱<br />快去挑选心仪的萌宠好物吧～
        </p>
        <router-link to="/shop">
          <button
            class="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <i class="fa fa-paw"></i> 💛 去逛逛
          </button>
        </router-link>
      </div>
      <div v-else class="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100/50">
        <div
          class="grid grid-cols-12 py-4 px-6 items-center border-b border-amber-100 text-amber-700 text-sm bg-amber-50/70"
        >
          <div class="col-span-1">
            <input
              type="checkbox"
              v-model="selectAll"
              @change="handleSelectAllChange"
              class="rounded text-amber-500 focus:ring-amber-500 w-5 h-5"
            />
          </div>
          <div class="col-span-5">📦 商品信息</div>
          <div class="col-span-2 text-center">💰 单价</div>
          <div class="col-span-2 text-center">🔢 数量</div>
          <div class="col-span-1 text-center">🧮 小计</div>
          <div class="col-span-1 text-center">⚙️ 操作</div>
        </div>
        <infiniteScroll :is-loading="isLoading" :has-more="hasMore" @load-more="Cartlist">
          <div class="divide-y divide-amber-100/50">
            <div
              v-for="(item, index) in cartItems"
              :key="item.id"
              :class="[
                'grid grid-cols-12 py-4 px-6 items-center hover:bg-amber-50/50 transition-all duration-300',
                item.status === '有效' ? 'bg-white' : 'bg-gray-100',
                item.status !== '有效' ? 'opacity-80 grayscale' : '',
              ]"
            >
              <div class="col-span-1">
                <input
                  type="checkbox"
                  v-model="item.selected"
                  @change="handleSelectItem(item.id, item.selected)"
                  class="rounded text-amber-500 focus:ring-amber-500 w-5 h-5"
                  :disabled="item.status !== '有效'"
                />
              </div>

              <div class="col-span-5 flex items-center">
                <img
                  :src="item.imgUrl"
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded-xl mr-4 border-2 border-amber-100 transition-transform duration-500 hover:scale-105"
                />
                <div>
                  <div class="flex justify-between">
                    <h3 class="font-medium line-clamp-2 text-gray-800">{{ item.name }}</h3>
                    <div v-if="item.status !== '有效'" class="text-red-500 text-sm mt-[-3px] ml-5">
                      <span>❌ 商品无效：</span>
                      <span>{{ item.invalidReason || '商品已下架/库存不足' }}，请删除</span>
                    </div>
                  </div>
                  <p
                    class="text-sm text-amber-600 mt-1 bg-amber-100/70 px-2 py-1 rounded-lg inline-block"
                  >
                    🐾 {{ item.spec }}
                  </p>
                </div>
              </div>

              <div class="col-span-2 text-center text-gray-800 font-medium">
                ¥{{ item.price.toFixed(2) }}
              </div>

              <div class="col-span-2 flex justify-center">
                <div class="flex items-center border-2 border-amber-200 rounded-xl overflow-hidden">
                  <button
                    @click="handleDecrease(index)"
                    class="w-10 h-10 flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors text-lg"
                    :disabled="item.quantity <= 1 || item.status !== '有效'"
                    :class="{ 'text-amber-300 cursor-not-allowed': item.quantity <= 1 }"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    class="w-14 h-10 text-center border-x border-amber-200 focus:outline-none focus:border-amber-500 text-gray-800 font-medium"
                    min="1"
                    @blur="handleQuantityBlur(index)"
                    :disabled="item.status !== '有效'"
                  />
                  <button
                    @click="handleIncrease(index)"
                    class="w-10 h-10 flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors text-lg"
                    :disabled="item.status !== '有效'"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="col-span-1 text-center text-amber-500 font-bold text-lg">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>

              <div class="col-span-1 text-center">
                <button
                  class="text-red-500 hover:text-red-600 transition-colors text-sm flex items-center gap-1 mx-auto hover:scale-110"
                  @click="handleDeleteSingleItem(index)"
                >
                  🗑️ 删除
                </button>
              </div>
            </div>
          </div>
        </infiniteScroll>
        <div
          class="flex flex-col md:flex-row justify-between items-center py-6 px-6 bg-amber-50/80 rounded-b-2xl"
        >
          <div class="flex items-center mb-4 md:mb-0 gap-4">
            <button
              @click="removeSelectedItems"
              class="text-sm flex items-center gap-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 px-3 py-1.5 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              删除选中
            </button>
          </div>

          <div class="flex flex-col items-end gap-3">
            <div class="flex items-center gap-3">
              <span class="text-amber-700 font-medium">合计：</span>
              <div class="flex items-baseline">
                <span class="text-base text-gray-400 line-through mr-2">
                  ¥{{ carttotalPrice.toFixed(2) }}
                </span>
                <span class="text-2xl font-bold text-amber-500">
                  ¥{{ discountPrice.toFixed(2) }}
                </span>
                <span class="ml-2 text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">
                  减{{ discount }}
                </span>
              </div>
            </div>
            <router-link
              :to="{ path: '/order?type=cart' }"
              class="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white px-12 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
              :disabled="!cartItems.length"
              :class="{ 'opacity-70 cursor-not-allowed': !cartItems.length }"
            >
              🛒 去结算
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="mt-12">
        <div class="flex justify-between items-center mb-8">
          <h3
            class="text-[clamp(1.1rem,2vw,1.5rem)] font-bold text-amber-800 relative flex items-center"
          >
            ✨ 为您推荐 ✨
            <span
              class="absolute left-0 bottom-0 w-20 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
            ></span>
          </h3>
        </div>
        <div
          v-if="recommendProducts.length === 0"
          class="text-center py-8 text-amber-700 bg-white rounded-2xl shadow-md p-6 border border-amber-100/50"
        >
          🐱 暂无推荐商品~ 下次再来看看吧～
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="item in recommendProducts"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-100/50"
          >
            <div class="relative overflow-hidden rounded-t-2xl">
              <img
                :src="item.imgUrl"
                :alt="item.name"
                class="w-full h-52 object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
              <div
                class="absolute top-3 right-3 bg-amber-100/90 rounded-full px-2 py-1 text-xs text-amber-700 font-medium"
              >
                🐾 热销
              </div>
            </div>
            <div class="p-5">
              <h4 class="font-medium text-gray-800 line-clamp-1 text-base leading-tight mb-2">
                {{ item.name }}
              </h4>
              <p class="text-amber-500 font-bold mt-1 text-xl">¥{{ item.price.toFixed(2) }}</p>
              <router-link
                :to="'/product-detail/' + item.id"
                class="mt-4 block w-full bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-600 py-2 rounded-xl text-sm font-medium transition-colors text-center flex items-center justify-center gap-1"
              >
                👀 查看详情
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <ShopFoot />
</template>

<script setup lang="ts">
import type { CartItem } from '../../../types/shop'
import infiniteScroll from '../shop/components/infiniteScroll.vue'
import { getRecommendApi } from '../../../api/pet-shop/product'
import {
  getCartItems,
  updateCartItemQuantity,
  getCartTotalCount,
  getCartTotalCountPrice,
  updateCartItemSelected,
  selectAllCartItems,
  deleteCartItem,
  deleteCartItems,
  clearCartItems,
  discountTotalCountPrice,
} from '../../../api/pet-shop/order'
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(true)
const cartItems = ref<CartItem[]>([])
const selectAll = ref(false)
const recommendProducts = ref<any[]>([])

const countTotal = ref(0)
const carttotalPrice = ref(0)
const discountPrice = ref(0)

const discount = computed(() => {
  return Math.max(Number(carttotalPrice.value) - Number(discountPrice.value), 0)
})

const isLoading = ref(false)
const hasMore = ref(true)
const CpageNum = ref(1)
const CpageSize = ref(99)

const selectedCount = async () => {
  try {
    const count = await getCartTotalCount()
    countTotal.value = count.data
  } catch (error) {
    console.error('获取数量失败', error)
  }
}

// 总价格计算
const totalPrice = async () => {
  try {
    const res = await getCartTotalCountPrice()
    carttotalPrice.value = res.data
    console.log('总价', res)
  } catch (error) {
    console.error('获取总价失败', error)
  }
}

// 优惠价计算
const discountTotalPrice = async () => {
  try {
    const res = await discountTotalCountPrice()
    discountPrice.value = res.data
    console.log('优惠价', res)
  } catch (error) {
    console.error('获取优惠价失败', error)
  }
}

// 购物车列表加载
const Cartlist = async (isLoadMore = false) => {
  try {
    if (!hasMore.value || isLoading.value) return
    isLoading.value = true

    if (isLoadMore) {
      CpageNum.value++
    } else {
      CpageNum.value = 1
      cartItems.value = []
      loading.value = true
    }

    const res = await getCartItems(CpageNum.value, CpageSize.value, '')
    const raw = Array.isArray(res) ? res : []
    console.log('cartlist响应', res)
    const list = raw.map((item) => ({
      id: item.id || 0,
      name: item.productName || '未知商品',
      spec: item.skuSpecText || '默认规格',
      price: Number(item.price) || 0,
      quantity: item.quantity || 1,
      imgUrl: item.mainImage || '/img/宠物1.jpg',
      selected: item.selected === '选中',
      status: item.status || '有效',
      invalidReason: item.invalidReason || '已下架',
    }))

    if (isLoadMore) {
      cartItems.value = [...cartItems.value, ...list]
    } else {
      cartItems.value = list
    }

    hasMore.value = list.length === CpageSize.value
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
    loading.value = false
    selectedCount()
    totalPrice()
    discountTotalPrice()
  }
}

// 获取推荐商品
const recommendProduct = async () => {
  try {
    const response = await getRecommendApi(1, 10)
    console.log('推荐商品响应:', response)
    let newProducts: any[] = []
    if (response && response.data && response.data.data && response.data.data.list) {
      newProducts = response.data.data.list
    } else if (Array.isArray(response)) {
      newProducts = response
    }

    recommendProducts.value = newProducts.map((item: any) => ({
      id: item.id || 0,
      name: item.productName || item.name || '未知商品',
      price: Number(item.price) || 0,
      imgUrl: item.mainImage || item.imgUrl || '/img/宠物1.jpg',
    }))
  } catch (error: any) {
    console.error('获取推荐商品失败:', error)
    console.error('获取推荐商品失败详情:', error.response?.data)
    ElMessage.warning('获取推荐商品失败，使用默认推荐')
  }
}

// 商品选中状态改变
const handleSelectItem = async (id, selected) => {
  try {
    const res = await updateCartItemSelected(id.toString(), selected ? 1 : 0)
    console.log('选中状态响应', res)
    const item = cartItems.value.find((item) => item.id === id)
    if (item) {
      item.selected = selected
      window.location.reload()
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('更新选中状态失败')
  }
}

// 全选/取消全选
const handleSelectAllChange = async () => {
  const target = selectAll.value
  try {
    loading.value = true
    const res = await selectAllCartItems(target ? 1 : 0)
    console.log('全选响应', res)
    cartItems.value.forEach((item) => {
      if (item.status === '有效') {
        item.selected = target
      }
    })
    ElMessage.success(target ? '全选成功' : '取消全选成功')
    Cartlist()
  } catch (e) {
    console.error(e)
    ElMessage.error(target ? '全选失败' : '取消全选失败')
  } finally {
    loading.value = false
  }
}

// 监听商品选中状态，自动更新全选框
watch(
  () => cartItems.value.map((i) => ({ selected: i.selected, status: i.status })),
  () => {
    const valid = cartItems.value.filter((i) => i.status === '有效')
    selectAll.value = valid.length > 0 && valid.every((i) => i.selected)
  },
  { deep: true, immediate: true },
)

// 数量减1
const handleDecrease = async (index) => {
  const item = cartItems.value[index]
  if (!item || item.quantity <= 1) return
  item.quantity--
  await updateCartItemQuantity(item.id.toString(), item.quantity)
  totalPrice()
  discountTotalPrice()
}

// 数量加1
const handleIncrease = async (index) => {
  const item = cartItems.value[index]
  if (!item) return
  item.quantity++
  await updateCartItemQuantity(item.id.toString(), item.quantity)
  totalPrice()
  discountTotalPrice()
}

// 数量输入框失焦
const handleQuantityBlur = async (index) => {
  const item = cartItems.value[index]
  if (!item) return
  if (item.quantity < 1 || isNaN(item.quantity)) item.quantity = 1
  await updateCartItemQuantity(item.id.toString(), item.quantity)
  totalPrice()
  discountTotalPrice()
}

// 删除单个商品
const handleDeleteSingleItem = async (index) => {
  const item = cartItems.value[index]
  if (!item) return
  try {
    await deleteCartItem(item.id.toString())
    cartItems.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.error('删除失败')
  } finally {
    selectedCount()
    totalPrice()
    discountTotalPrice()
  }
}

// 删除选中商品
const removeSelectedItems = async () => {
  const selectedIds = cartItems.value
    .filter((item) => item.selected)
    .map((item) => item.id.toString()) // 强制转字符串

  if (selectedIds.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }

  try {
    loading.value = true
    console.log('批量删除请求参数（字符串数组）:', selectedIds)
    const res = await deleteCartItems(selectedIds)

    cartItems.value = cartItems.value.filter((item) => !selectedIds.includes(item.id.toString()))
    ElMessage.success('选中商品删除成功')
    console.log('批量删除商品响应', res)
  } catch (error) {
    console.error('批量删除商品失败:', error)
    ElMessage.error('删除失败，请稍后再试')
  } finally {
    loading.value = false
    selectedCount()
    totalPrice()
    discountTotalPrice()
  }
}

// 清空购物车
const handleClearCart = async () => {
  try {
    await clearCartItems()
    cartItems.value = []
    ElMessage.success('已清空')
  } catch {
    ElMessage.error('清空失败')
  } finally {
    selectedCount()
    totalPrice()
    discountTotalPrice()
  }
}

onMounted(() => {
  Cartlist()
  recommendProduct()
})
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
