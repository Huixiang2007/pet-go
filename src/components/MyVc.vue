<template>
  <!-- 宠物卡片组件：用 Tailwind 类快速构建样式 -->
  <div
    class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100"
  >
    <!-- 宠物图片 -->
    <img
      src="https://picsum.photos/400/300"
      alt="宠物照片"
      class="w-full h-48 object-cover rounded-lg mb-4"
    />

    <!-- 宠物信息 -->
    <div class="space-y-2">
      <h3 class="text-red-500">金毛寻回犬</h3>
      <p class="text-gray-600 text-sm">年龄：2岁 · 性别：公</p>
      <div class="flex items-center text-yellow-500 mt-1">
        <!-- 星级评分（用 Tailwind 类控制图标颜色和间距） -->
        <span class="mr-1">★★★★★</span>
        <span class="text-gray-500 text-xs">5.0 (120人评价)</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-4 flex justify-between items-center">
      <span class="text-blue-600 font-semibold">¥2000</span>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        立即领养
      </button>
    </div>
  </div>
</template>

<script  lang="ts">
// TypeScript 逻辑代码（和 Tailwind 无关，正常编写即可）
export default {
  name: 'MyVc',
  setup() {
    return {}
  },
}
</script>

<!-- 无需额外写样式，所有样式通过模板中的 class 实现 -->
<style scoped></style>