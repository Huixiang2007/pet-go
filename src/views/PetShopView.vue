<template>
  <div class="cart-container">
    <h1>我的购物车</h1>
    <div v-if="cartItems.length === 0" class="empty-cart">
      <i class="el-icon-shopping-cart-full"></i>
      <p>购物车还是空的，快去添加商品吧~</p>
    </div>
    <div v-else class="cart-items">
      <!-- 购物车商品列表 -->
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" alt="商品图片" class="item-image">
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
        </div>
        <div class="item-quantity">
          {{ item.quantity }}件
        </div>
      </div>

      <div class="cart-total">
        <span>合计：</span>
        <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义商品接口
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

// 模拟购物车数据
const cartItems = ref<CartItem[]>([
  {
    id: '1',
    name: '宠物零食大礼包',
    price: 89.9,
    quantity: 2,
    image: 'https://placehold.co/100x100?text=零食'
  },
  {
    id: '2',
    name: '宠物牵引绳',
    price: 59.9,
    quantity: 1,
    image: 'https://placehold.co/100x100?text=牵引绳'
  }
])

// 计算总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-cart i {
  font-size: 60px;
  margin-bottom: 20px;
  color: #ccc;
}

.cart-items {
  margin-top: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
  margin-left: 20px;
}

.item-price {
  color: #f56c6c;
  font-weight: bold;
  margin-top: 5px;
}

.item-quantity {
  font-size: 16px;
  color: #666;
}

.cart-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
  padding: 20px 0;
  border-top: 2px solid #f56c6c;
}

.total-price {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
  margin-left: 10px;
}
</style>
