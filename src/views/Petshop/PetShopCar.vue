<template>
  <NavBar />
  <div class="min-h-screen bg-yellow-50">
    <main class="mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6 flex items-center">
        <i class="fa fa-shopping-cart text-[#FF7043] mr-2"></i>
        我的购物车
      </h2>

      <!-- 空购物车状态 -->
      <div v-if="cartItems.length === 0" class="bg-white rounded-lg p-10 text-center shadow-sm">
        <img src="/img/宠物1.jpg" alt="空购物车" class="w-32 h-32 mx-auto mb-4 opacity-50">
        <p class="text-gray-500 mb-6">您的购物车还是空的哦~</p>
        <button class="bg-[#FF7043] hover:bg-[#FF7043]/90 text-white px-6 py-2 rounded-full transition-colors">
          去逛逛
        </button>
      </div>

      <!-- 购物车列表 -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- 列表头部 -->
        <div class="grid grid-cols-12 py-4 px-6 border-b text-gray-500 text-sm">
          <div class="col-span-1">
            <input type="checkbox" v-model="selectAll" @change="handleSelectAll" class="rounded text-[#FF7043] focus:ring-[#FF7043]">
          </div>
          <div class="col-span-5">商品信息</div>
          <div class="col-span-2 text-center">单价</div>
          <div class="col-span-2 text-center">数量</div>
          <div class="col-span-1 text-center">小计</div>
          <div class="col-span-1 text-center">操作</div>
        </div>

        <!-- 商品列表 -->
        <div class="divide-y">
          <div v-for="(item, index) in cartItems" :key="item.id" class="grid grid-cols-12 py-4 px-6 items-center">
            <!-- 勾选框 -->
            <div class="col-span-1">
              <input
                type="checkbox"
                v-model="item.selected"
                @change="handleSelectItem"
                class="rounded text-[#FF7043] focus:ring-[#FF7043]"
              >
            </div>

            <!-- 商品信息 -->
            <div class="col-span-5 flex items-center">
              <img :src="item.imgUrl" :alt="item.name" class="w-20 h-20 object-cover rounded mr-4">
              <div>
                <h3 class="font-medium line-clamp-2">{{ item.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ item.spec }}</p>
              </div>
            </div>

            <!-- 单价 -->
            <div class="col-span-2 text-center">¥{{ item.price.toFixed(2) }}</div>

            <!-- 数量 -->
            <div class="col-span-2 flex justify-center">
              <div class="flex items-center border rounded">
                <button
                  @click="handleDecrease(index)"
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  class="w-12 h-8 text-center border-x focus:outline-none"
                  min="1"
                >
                <button
                  @click="handleIncrease(index)"
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div class="col-span-1 text-center text-[#FF7043] font-medium">
              ¥{{ (item.price * item.quantity).toFixed(2) }}
            </div>


            <div class="col-span-1 text-center">
              <button
                @click="removeItem(index)"
                class="text-gray-500 hover:text-red-500 transition-colors text-sm"
              >
                删除
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-gray-50">
          <div class="flex items-center mb-4 md:mb-0">
            <input
              type="checkbox"
              v-model="selectAll"
              @change="handleSelectAll"
              class="rounded text-[#FF7043] focus:ring-[#FF7043] mr-2"
            >
            <label class="text-gray-700 mr-6">全选</label>
            <button

              class="text-gray-600 hover:text-red-500 transition-colors text-sm"
            >
              删除选中
            </button>
          </div>

          <div class="flex flex-col items-end">
            <div class="flex items-center mb-2">
              <span class="text-gray-600 mr-2">已选 {{ selectedCount }} 件商品</span>
              <span class="text-gray-600 mr-2">合计：</span>
              <span class="text-2xl font-bold text-[#FF7043]">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <button class="bg-[#FF7043] hover:bg-[#FF7043]/90 text-white px-10 py-3 rounded-full transition-colors font-medium">
              去结算
            </button>
          </div>
        </div>
      </div>

      <!-- 推荐 -->
      <div v-if="cartItems.length > 0" class="mt-12">
        <h3 class="text-xl font-bold mb-6">为您推荐</h3>
        <div class="grid grid-cols-4 gap-6">
          <div v-for="item in recommendProducts" :key="item.id" class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img :src="item.imgUrl" :alt="item.name" class="w-full h-48 object-cover">
            <div class="p-3">
              <h4 class="font-medium line-clamp-1">{{ item.name }}</h4>
              <p class="text-[#FF7043] font-bold mt-2">¥{{ item.price.toFixed(2) }}</p>
              <button
                @click="addToCart(item)"
                class="mt-3 w-full bg-yellow-100 hover:bg-yellow-200 text-[#FF7043] py-1 rounded text-sm transition-colors"
              >
                加入购物车
              </button>
            </div>
          </div>
        </div>
      </div>
    </main></div>
       <ShopFoot />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
console.log('PetShopCar component loaded');
interface Product {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
  spec?: string;
}

interface CartItem extends Product {
  spec: string;
  quantity: number;
  selected: boolean;
}

// 购物车商品数据
const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: '天然狗粮 成犬专用 高蛋白营养配方',
    spec: '1.5kg/袋',
    price: 89.9,
    quantity: 2,
    imgUrl: '/img/宠物1.jpg',
    selected: true
  },
  {
    id: 2,
    name: '猫咪自动饮水机 静音流动活水',
    spec: '白色/2L',
    price: 129.0,
    quantity: 1,
    imgUrl: '/img/宠物2.jpg',
    selected: false
  },
  {
    id: 3,
    name: '宠物指甲剪 防刮伤设计',
    spec: '通用款',
    price: 29.9,
    quantity: 1,
    imgUrl: '/img/宠物3.jpg',
    selected: true
  }
]);

// 推荐商品
const recommendProducts = ref<Product[]>([
  {
    id: 101,
    name: '宠物航空箱 便携出行',
    price: 159.0,
    imgUrl: '/img/宠物1.jpg'
  },
  {
    id: 102,
    name: '猫咪逗猫棒 羽毛铃铛玩具',
    price: 19.9,
    imgUrl: '/img/宠物3.jpg'
  },
  {
    id: 103,
    name: '宠物湿巾 无刺激配方',
    price: 35.9,
    imgUrl: '/img/宠物2.jpg'
  },
  {
    id: 104,
    name: '狗狗牵引绳 反光安全设计',
    price: 69.0,
    imgUrl: '/img/宠物3.jpg'
  }
]);


const selectAll = ref(true);

// 数量
const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0);
});

//总价
const totalPrice = computed(() => {
  return cartItems.value.filter(item => item.selected).reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

watch(
  () => cartItems.value.map(item => item.selected),
  (newSelected) => {
    selectAll.value = newSelected.every(checked => checked);
  }
);

// 全选/取消全选
const handleSelectAll = () => {
  console.log(selectAll.value);
  cartItems.value.forEach(item => {
    item.selected = selectAll.value;
  });
};


const handleSelectItem = () => {
  selectAll.value = cartItems.value.every(item => item.selected);
};

//数量减1

const handleDecrease = (index: number) => {
  if (cartItems.value[index]?.quantity && cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--;
  }
  console.log(cartItems.value[index]?.quantity);
};

//数量加1

const handleIncrease = (index: number) => {
if (cartItems.value[index]) {
    cartItems.value[index].quantity++;
    console.log(cartItems.value[index]?.quantity);
}
};

const removeItem = (index: number) => {
  if (index >= 0 && index < cartItems.value.length) {
    cartItems.value.splice(index, 1);
  }
};


const addToCart = (product: Product) => {
  if (!product || !product.id) {
    console.warn('无效的商品数据');
    return;
  }

  const existingItem = cartItems.value.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const newItem: CartItem = {
      ...product,
      spec: product.spec || '默认规格',
      quantity: 1,
      selected: true
    };
    cartItems.value.push(newItem);
  }
};
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
