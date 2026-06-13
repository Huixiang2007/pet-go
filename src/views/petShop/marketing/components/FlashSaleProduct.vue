<template>
  <div class="flash-sale-product" @click="handleClick">
    <div class="product-image">
      <img :src="product.mainImage" :alt="product.title" />
      <div class="discount-badge">
        {{ Math.round((1 - product.flashPrice / product.originalPrice) * 100) }}% OFF
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-price">
        <span class="flash-price">¥{{ product.flashPrice.toFixed(2) }}</span>
        <span class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
      </div>
      <div class="product-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: product.stockPercent + '%' }"></div>
        </div>
        <span class="progress-text">{{ product.stockPercent }}% 已抢</span>
      </div>
      <button class="buy-btn" :disabled="product.stock <= 0">
        {{ product.stock > 0 ? '立即抢购' : '已抢完' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
interface Product {
  id: number
  title: string
  mainImage: string
  flashPrice: number
  originalPrice: number
  stock: number
  stockPercent: number
}

const props = defineProps<{
  product: Product
}>()

//跳转详情页
const handleClick = () => {
  router.push({ name: 'flashSaleDetail', params: { id: props.product.id } })
}
</script>

<style scoped>
.flash-sale-product {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.flash-sale-product:hover {
  transform: translateY(-4px);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 10px;
}

.flash-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
  margin-right: 8px;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.product-progress {
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: #ff4d4f;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.buy-btn {
  width: 100%;
  padding: 8px 0;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buy-btn:hover:not(:disabled) {
  background: #ff7875;
}

.buy-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}
</style>
