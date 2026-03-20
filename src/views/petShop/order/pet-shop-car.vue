<template>
  <NavBar />
  <div class="min-h-screen bg-amber-50 pt-[60px] relative overflow-hidden">
    <div class="absolute top-20 left-10 w-32 h-32 bg-yellow-100/50 rounded-full -z-10"></div>
    <div
      class="absolute bottom-20 right-10 w-48 h-48 bg-amber-100/40 rounded-tl-3xl rounded-br-3xl -z-10"
    ></div>

    <main class="mx-auto px-4 sm:px-6 lg:px-[5rem] py-8 relative z-10">
      <!-- 购物车头部：新增清空购物车按钮 -->
      <div class="flex justify-between items-center mr-10 mb-8">
        <h2 class="text-2xl font-bold flex items-center text-amber-800">
          <i class="fa fa-shopping-cart text-amber-500 mr-2"></i>
          我的购物车
          <span class="ml-3 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full"
            >萌宠清单</span
          >
        </h2>
        <div class="flex items-center gap-3">
          <!-- 清空购物车按钮 -->
          <button
            v-if="cartItems.length > 0"
            class="p-2 rounded-full hover:bg-amber-100 transition-colors flex items-center gap-1"
            @click="handleClearCart"
          >
            <i class="fas fa-trash-alt text-amber-700"></i>
            <span class="hidden sm:inline text-sm text-amber-700">清空</span>
          </button>
          <!-- 退出按钮-->
          <button
            class="p-2 rounded-full hover:bg-amber-100 transition-colors flex items-center gap-1"
          >
            <i class="fas fa-sign-out-alt text-amber-700"></i>
            <span class="hidden sm:inline text-sm text-amber-700">退出</span>
          </button>
        </div>
      </div>

      <!-- 加载状态-->
      <div
        v-if="loading"
        class="bg-white rounded-2xl p-10 text-center shadow-md border border-amber-100/50"
      >
        <i class="fa fa-spinner fa-spin text-amber-500 text-3xl mb-4"></i>
        <p class="text-amber-700 text-lg">🐕 正在加载购物车...</p>
      </div>

      <!-- 空购物车状态 -->
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
        <!-- 表头：柔和配色 -->
        <div
          class="grid grid-cols-12 py-4 px-6 items-center border-b border-amber-100 text-amber-700 text-sm bg-amber-50/70"
        >
          <div class="col-span-1">✅</div>
          <div class="col-span-5">📦 商品信息</div>
          <div class="col-span-2 text-center">💰 单价</div>
          <div class="col-span-2 text-center">🔢 数量</div>
          <div class="col-span-1 text-center">🧮 小计</div>
          <div class="col-span-1 text-center">⚙️ 操作</div>
        </div>
<infiniteScroll
     :is-loading="isLoading"
    :has-more="hasMore"
    @load-more="Cartlist">
        <!-- 商品列表 -->
        <div class="divide-y divide-amber-100/50">
          <div
            v-for="(item, index) in cartItems"
            :key="item.id"
            :class="[
              'grid grid-cols-12 py-4 px-6 items-center hover:bg-amber-50/50 transition-colors',
              item.status === '有效' ? 'bg-white' : 'bg-gray-100',
              item.status !== '有效' ? 'opacity-80' : '',
            ]"
          >
            <div class="col-span-1">
              <input
                type="checkbox"
                :checked="item.selected === '选中'"
                @change="handleSelectItem(item.id.toString(), item.selected)"
                class="rounded text-amber-500 focus:ring-amber-500 w-5 h-5"
              />
            </div>

            <div class="col-span-5 flex items-center">
              <img
                :src="item.imgUrl"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded-xl mr-4 border-2 border-amber-100"
              />
              <div>
                <div class="flex justify-between">
                <h3 class="font-medium line-clamp-2 text-gray-800">{{ item.name }}</h3>
                 <div v-if="item.status !== '有效'" class="text-red-500 text-sm mt-[-3px] ml-5">
                <span>❌ 商品无效：</span>
                <span>{{ item.invalidReason || '商品已下架/库存不足' }}，请删除</span>
              </div></div>
                <p
                  class="text-sm text-amber-600 mt-1 bg-amber-100/70 px-2 py-1 rounded-lg inline-block"
                >
                  🐾 {{ item.spec }}
                </p>
              </div>
            </div>

            <!-- 单价 -->
            <div class="col-span-2 text-center text-gray-800 font-medium">
              ¥{{ item.price.toFixed(2) }}
            </div>

            <!-- 数量：优化按钮样式 -->
            <div class="col-span-2 flex justify-center">
              <div class="flex items-center border-2 border-amber-200 rounded-xl overflow-hidden">
                <button
                  @click="handleDecrease(index)"
                  class="w-10 h-10 flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors text-lg"
                  :disabled="item.quantity <= 1"
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
                />
                <button
                  @click="handleIncrease(index)"
                  class="w-10 h-10 flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors text-lg"
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
        <!-- 结算区域-->
        <div
          class="flex flex-col md:flex-row justify-between items-center py-6 px-6 bg-amber-50/80 rounded-b-2xl"
        >
          <div class="flex items-center mb-4 md:mb-0 gap-4">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="handleSelectAll"
                class="rounded text-amber-500 focus:ring-amber-500 w-5 h-5"
              />
              <label class="text-amber-800 font-medium">全选</label>
            </div>
            <button
              @click="removeSelectedItems"
              class="text-red-500 hover:text-red-600 transition-colors text-sm flex items-center gap-1 hover:scale-105"
            >
              🗑️ 删除选中
            </button>
          </div>

          <div class="flex flex-col items-end gap-3">
            <div class="flex items-center gap-3">
              <span class="text-amber-700 font-medium">已选 {{ countTotal }} 件商品</span>
              <span class="text-amber-700 font-medium">合计：</span>
            <div class="flex items-baseline">
            <span class="text-base text-gray-400 line-through mr-2">
              ¥{{ carttotalPrice.toFixed(2) }}
            </span>
            <span class="text-2xl font-bold text-amber-500">
              ¥{{ discountPrice.toFixed(2) }}
            </span>
            <span class="ml-2 text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">
              减{{discount}}
            </span>
            <span class="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
              | &nbsp;明细
                <el-icon class="text-red-500 w-3 h-3">
        <ArrowUp />
      </el-icon>
            </span>
          </div>
            </div>
            <button
              class="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white px-12 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              :disabled="countTotal === 0"
              :class="{ 'opacity-70 cursor-not-allowed': countTotal === 0 }"
            >
              🛒 去结算
            </button>
          </div>
        </div>
      </div>

      <!-- 推荐商品区域 -->
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

        <!-- 推荐商品为空时提示 -->
        <div
          v-if="
            recommendProducts.length === 0 ||
            (recommendProducts.length === 1 && !recommendProducts[0].name)
          "
          class="text-center py-8 text-amber-700 bg-white rounded-2xl shadow-md p-6 border border-amber-100/50"
        >
          🐱 暂无推荐商品~ 下次再来看看吧～
        </div>

        <!-- 推荐商品列表 -->
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
                :to="'/product-detail/' + Number(item.id)"
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
import infiniteScroll  from '../shop/components/infiniteScroll.vue'
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
  discountTotalCountPrice
} from '../../../api/pet-shop/order'
import { getShopInfo } from '../../../api/pet-shop/shop'
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(true)
const cartItems = ref<CartItem[]>([])
const selectAll = ref(true)
const recommendProducts = ref<any[]>([])

const countTotal = ref(0)
// 选中商品数量
const selectedCount = async () => {
  try {
    const count = await getCartTotalCount()
    console.log('购物车商品总数量', count.data)
    countTotal.value = count.data
  } catch (error) {
    console.error('获取购物车商品总数量失败:', error)
    ElMessage.error('获取购物车商品总数量失败，请稍后再试')
  }
}

//总价
const carttotalPrice = ref(0)
const totalPrice = async () => {
  try {
    const count = await getCartTotalCountPrice()
    console.log('购物车商品总价格', count.data)
    carttotalPrice.value = count.data
  } catch (error) {
    console.error('获取购物车商品总数量失败:', error)
    ElMessage.error('获取购物车商品总数量失败，请稍后再试')
  }
}
//优惠总价
const discountPrice = ref(0)
const discountTotalPrice = async () => {
  try {
    const count = await discountTotalCountPrice()
    console.log('购物车商品优惠总价格', count.data)
    discountPrice.value = count.data
  } catch (error) {
    console.error('获取购物车商品总数量失败:', error)
    ElMessage.error('获取购物车商品总数量失败，请稍后再试')
  }
}
const originalPrice = Number(carttotalPrice.value) || 0;
const discountedPrice = Number(discountPrice.value) || 0;
const discount = Math.max(originalPrice - discountedPrice, 0);
// 获取购物车列表
const isLoading = ref(false); // 正在加载状态
const hasMore = ref(true); // 是否还有更多数据
const CpageNum = ref(1); // 页码
const CpageSize = ref(5); // 每页数量

const Cartlist = async (isLoadMore = false) => {
  try {
    if (!hasMore.value || isLoading.value) return;

    isLoading.value = true;

    if (isLoadMore) {
      CpageNum.value += 1;
    } else {
      CpageNum.value = 1;
      cartItems.value = [];

      loading.value = true;
    }

    const res = await getCartItems(CpageNum.value, CpageSize.value);
    console.log('cartlist响应', res);

    let rawCartItems = [];
    // 处理API返回数据
    if (Array.isArray(res)) {
      // getCartItems函数已直接返回CartItem[]数组
      rawCartItems = res;
    } else {
      console.error('API返回数据格式错误:', res);
      if (isLoadMore) {
        CpageNum.value--;
      }
      // 即使数据格式错误，也需要确保cartItems为空数组，避免显示加载状态
      if (!isLoadMore) {
        cartItems.value = [];
      }
      ElMessage.warning('购物车数据加载异常，请稍后再试');
      return;
    }

    const formattedItems = rawCartItems.map((item) => ({
      id: item.id || 0,
      name: item.productName || '未知商品',
      spec: item.skuSpecText || '默认规格',
      price: item.price || 0,
      quantity: item.quantity || 1,
      imgUrl: item.mainImage || '/img/宠物1.jpg',
      selected: item.selected === '选中',
      status: item.status || '有效',
      invalidReason: item.invalidReason || '商品已下架，暂不可购买',
    }));

    if (isLoadMore) {
      cartItems.value = [...cartItems.value, ...formattedItems];
    } else {
      cartItems.value = formattedItems;
    }

    // 判断是否还有更多数据
    hasMore.value = formattedItems.length === CpageSize.value;

    // 用户提示
    if (!isLoadMore) {
      if (cartItems.value.length === 0) {
        ElMessage.info('购物车为空，快去添加商品吧');
      } else {
        ElMessage.success('获取购物车成功');
      }
    }
  } catch (error) {
    console.error('获取购物车失败', error);
    if (isLoadMore) {
      CpageNum.value--;
    }
    // 确保在错误情况下cartItems为空数组
    if (!isLoadMore) {
      cartItems.value = [];
    }
    ElMessage.error('获取购物车失败，请稍后再试');
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};
// 获取推荐商品
const recommendProduct = async () => {
  try {
    const datas = { pageNum: 1, pageSize: 8 }
    console.log('推荐商品请求参数', datas)
    const res = await getShopInfo(datas)
    console.log('推荐商品响应', res)

    const rawRecommendProducts = res.list || []
    recommendProducts.value = rawRecommendProducts.map((item: any) => ({
      id: item.id || 0,
      name: item.title || '未命名商品',
      price: item.price || 0,
      imgUrl: item.mainImage || '/img/宠物1.jpg',
    }))
  } catch (error) {
    console.error('获取推荐商品失败:', error)
    recommendProducts.value = []
  }
}

// 监听单个商品选中状态
watch(
  () => cartItems.value.map((item) => item.selected),
  (newSelected) => {
    selectAll.value = newSelected.every((checked) => checked)
  },
  { immediate: true },
)

// 单个商品选中/取消
const handleSelectItem = async (cartId: string, isSelected: boolean | string) => {
  try {
    //0-取消选中/1-选中),可用值:未选中,选中
    const selectedNum = isSelected ? 0 : 1
    const res = await updateCartItemSelected(cartId, selectedNum)
    console.log(`商品${cartId}选中状态更新为: ${isSelected}`)
    console.log('res', res)
  } catch (error) {
    console.error('更新商品选中状态失败:', error)
    ElMessage.error('选中状态更新失败，请稍后再试')

    cartItems.value = cartItems.value.map((item) => {
      if (item.id === Number(cartId)) item.selected = !isSelected
      return item
    })
  }
}

// 全选/取消全选
const handleSelectAll = async () => {
  try {
    //1=全选，0=取消全选
    const selectedNum = selectAll.value ? 1 : 0
    console.log('全选请求参数', selectedNum)
    const res = await selectAllCartItems(selectedNum)
    console.log('全选响应', res)
    cartItems.value.forEach((item) => {
      item.selected = selectAll.value
    })
    console.log(`全选状态更新为: ${selectAll.value}`)
  } catch (error) {
    console.error('全选状态更新失败:', error)
    ElMessage.error('全选操作失败，请稍后再试')
    selectAll.value = !selectAll.value
  }
}

// 数量减1
const handleDecrease = async (index: number) => {
  if (cartItems.value[index]?.quantity && cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--
    await syncCartQuantity(cartItems.value[index].id.toString(), cartItems.value[index].quantity)
  }
}

// 数量加1
const handleIncrease = async (index: number) => {
  if (cartItems.value[index]) {
    cartItems.value[index].quantity++
    await syncCartQuantity(cartItems.value[index].id.toString(), cartItems.value[index].quantity)
  }
}

//修改购物车数量
const syncCartQuantity = async (cartId: string, quantity: number) => {
  try {
    const res = await updateCartItemQuantity(cartId.toString(), quantity)
    console.log(`购物车${cartId}数量更新为${quantity}`)
    console.log('res', res)
  } catch (error) {
    console.log('更新购物车数量失败:', error)
    ElMessage.error('更新数量失败，请稍后再试')
  }
}

// 数量输入框失焦
const handleQuantityBlur = async (index: number) => {
  const item = cartItems.value[index]
  if (!item) return
  if (item.quantity < 1 || isNaN(item.quantity)) {
    item.quantity = 1
    ElMessage.warning('数量不能小于1')
  }
  await syncCartQuantity(item.id.toString(), item.quantity)
}

// 删除单个商品
const handleDeleteSingleItem = async (index: number) => {
  if (index < 0 || index >= cartItems.value.length) return

  const item = cartItems.value[index]
  try {
    loading.value = true
    const res = await deleteCartItem(item.id.toString())
    cartItems.value.splice(index, 1)
    ElMessage.success('商品删除成功')
    console.log('删除单个商品响应', res)
  } catch (error) {
    console.error('删除单个商品失败:', error)
    ElMessage.error('删除失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 删除选中商品
const removeSelectedItems = async () => {
  const selectedIds = cartItems.value
    .filter((item) => item.selected)
    .map((item) => item.id.toString())
  if (selectedIds.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  try {
    loading.value = true
    console.log('selectedIds', selectedIds)
    const res = await deleteCartItems(selectedIds)
    cartItems.value = cartItems.value.filter((item) => !selectedIds.includes(item.id.toString()))
    ElMessage.success('选中商品删除成功')
    console.log('批量删除商品响应', res)
  } catch (error) {
    console.error('批量删除商品失败:', error)
    ElMessage.error('删除失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 清空购物车
const handleClearCart = async () => {
  try {
    loading.value = true
    const res = await clearCartItems()
    cartItems.value = []
    console.log('清空购物车响应', res)
    ElMessage.success('购物车已清空')
  } catch (error) {
    console.error('清空购物车失败:', error)
    ElMessage.error('清空失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  Cartlist()
  recommendProduct()
  selectedCount()
  totalPrice()
   discountTotalPrice()
})
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #ff7043;
  border-radius: 3px;
}
</style>
