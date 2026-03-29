<!-- 商品清单组件 -->
<template>
  <section class="bg-white rounded-xl p-6 card-shadow">
    <h2 class="text-lg font-semibold mb-6">商品清单</h2>

    <!-- 商品列表 -->
    <div class="space-y-6">
      <!-- 商品1 -->
      <div class="flex items-center gap-4 pb-6 border-b border-gray-100">
        <img
          src="https://picsum.photos/100/100?random=1"
          alt="天然狗粮"
          class="w-20 h-20 object-cover rounded-md"
        />
        <div class="flex-1">
          <h3 class="font-medium">天然狗粮 成犬专用 高蛋白营养配方</h3>
          <p class="text-sm text-light mt-1">规格：1.5kg/袋</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-[#f3ce48] font-medium">¥89.90</span>
            <span class="text-sm">x2</span>
          </div>
        </div>
      </div>

      <!-- 商品2 -->
      <div class="flex items-center gap-4 pb-6 border-b border-gray-100">
        <img
          src="https://picsum.photos/100/100?random=2"
          alt="宠物指甲剪"
          class="w-20 h-20 object-cover rounded-md"
        />
        <div class="flex-1">
          <h3 class="font-medium">宠物指甲剪 防刮伤设计</h3>
          <p class="text-sm text-light mt-1">规格：通用款</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-[#f3ce48] font-medium">¥29.90</span>
            <span class="text-sm">x1</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单备注 -->
    <div class="mt-6">
      <label class="block text-sm font-medium mb-2">订单备注</label>
      <textarea
        class="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#f3ce48]/30 focus:border-[#f3ce48] transition-base resize-none"
        rows="2"
        placeholder="请输入特殊要求（如送货时间等）"
      ></textarea>
    </div>
  </section>
</template>

<script setup lang="ts">
// 暂无逻辑，仅展示
</script>

<style scoped lang="scss">
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
