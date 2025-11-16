<template>
  <div class="flex flex-col gap-5">
    <div
      v-for="comment in commentList"
      :key="comment.id"
      class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      <div class=" px-5 py-3 bg-gray-50 flex flex-row items-center justify-between">
        <div class="flex flex-col  justify-between">
            <div class="text-sm text-gray-400">{{ comment.createTime }}</div>
            <div class="mt-2 text-gray-600">{{ comment.content }}</div>
        </div>
        <div class="flex flex-row items-center justify-end w-[70%]">
          <img :src="comment.img" alt="" class="w-20 h-20 mr-7">
        <div class="text-sm text-gray-400">{{ comment.itemsName }} </div>
      </div>
  </div>  </div>  </div>
</template>

<script lang="ts" setup>
// import { ref, computed } from 'vue'
const commentList = [
  {
    img: 'img/dog.png',
    createTime: '2022-01-01 12:00:00',
    content: 'This is a good product!',
    itemsName: '搅蒜器打蒜器家用绞蒜切蒜器多功能辅食料理机电动蒜泥神器蒜蓉机自动切菜机压蒜器 蓝色-升级大电机 0.26',
    id: 1,
  },
  {
    createTime: '2022-01-02 12:00:00',
    content: 'I love this product!',
    itemsName: '搅蒜器打蒜器家用绞蒜切蒜器多功能辅食料理机电动蒜泥神器蒜蓉机自动切菜机压蒜器 蓝色-升级大电机 0.26',
    img: '/public/img/宠物2.jpg',
  },

]
</script>

<style scoped>
</style>
