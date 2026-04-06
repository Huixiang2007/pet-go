<!-- 商品清单组件 -->
<template>
  <section class="bg-white rounded-xl p-6 card-shadow">
    <h2 class="text-lg font-semibold mb-6">商品清单</h2>

    <div class="space-y-6">
      <div
        v-for="item in goods"
        :key="item.id"
        class="flex items-center gap-4 pb-6 border-b border-gray-100"
      >
        <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-md" />
        <div class="flex-1">
          <h3 class="font-medium">{{ item.name }}</h3>
          <p class="text-sm text-light mt-1">规格：{{ item.spec }}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-[#f3ce48] font-medium">¥{{ item.price.toFixed(2) }}</span>
            <div class="flex items-center gap-2">
              <button
                class="w-6 h-6 flex items-center justify-center border rounded"
                @click="decreaseQuantity(String(item.id))"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <span class="text-sm min-w-8 text-center">{{ item.quantity }}</span>
              <button
                class="w-6 h-6 flex items-center justify-center border rounded"
                @click="increaseQuantity(item.id)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单备注 -->
    <div class="mt-6">
      <label class="block text-sm font-medium mb-2">订单备注</label>
      <textarea
        v-model="orderRemark"
        class="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#f3ce48]/30 focus:border-[#f3ce48] transition-base resize-none"
        rows="2"
        placeholder="请输入特殊要求（如送货时间等）"
      ></textarea>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  goods: Array<{
    id: string | number
    name: string
    spec: string
    price: number
    quantity: number
    image: string
  }>
}>()
const orderRemark = ref('')
orderRemark.value = ''
watch(orderRemark, (newRemark) => {
  emit('update:remark', newRemark)
})

const emit = defineEmits(['update:goods', 'update:remark'])

// 增加商品数量
const increaseQuantity = (id: string | number) => {
  const updatedGoods = [...props.goods]
  const item = updatedGoods.find((item) => item.id === id)
  if (item) {
    item.quantity++
    emit('update:goods', updatedGoods)
  }
}

// 减少商品数量
const decreaseQuantity = (id: string) => {
  const updatedGoods = [...props.goods]
  const item = updatedGoods.find((item) => item.id === id)
  if (item && item.quantity > 1) {
    item.quantity--
    emit('update:goods', updatedGoods)
  }
}
</script>

<style scoped lang="scss">
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
