<template>
  <div class="flex flex-col gap-5">
    <div
      v-for="comment in commentList"
      :key="comment.id"
      class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      <div class="px-5 py-3 bg-gray-50 flex flex-row items-center justify-between">
        <div class="flex flex-col justify-between w-[25%]">
          <div class="text-sm text-gray-400">{{ comment.createTime }}</div>
          <div class="mt-2 text-gray-600">{{ comment.content }}</div>
        </div>
        <div class="flex flex-row items-center justify-end w-[70%]">
          <img :src="comment.img" alt="" class="w-20 h-20 mr-7" />
          <div class="text-sm text-gray-400 truncate">{{ comment.itemsName }}</div>
        </div>
        <div class="flex flex-row items-center justify-end w-[5%]">
          <button
            class="flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md px-2 py-1 transition-colors duration-200"
            @click="handleDelete(comment.id)"
          >
            <i class="fas fa-trash-alt mr-1 text-xs"></i>
            <span class="text-sm">删除</span>
          </button>
        </div>
      </div>

      <div
        v-if="comment.replies && comment.replies.length > 0"
        class="px-8 py-2 bg-gray-50/50 border-l-2 border-gray-200"
      >
        <div class="text-sm text-gray-500 mb-1">回复：</div>
        <div v-for="reply in comment.replies" :key="reply.id" class="text-sm text-gray-600 mb-2">
          {{ reply.replyTime }} - {{ reply.replyContent }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'

// 1. 给评论补充 replies 回复列表字段
const commentList = [
  {
    img: 'img/dog.png',
    createTime: '2022-01-01 12:00:00',
    content: 'This is a good product!',
    itemsName:
      '搅蒜器打蒜器家用绞蒜切蒜器多功能辅食料理机电动蒜泥神器蒜蓉机自动切菜机压蒜器 蓝色-升级大电机 0.26',
    id: 1,
    // 新增：回复列表
    replies: [
      { id: 101, replyTime: '2022-01-01 13:00:00', replyContent: '我也觉得超好用！' },
      { id: 102, replyTime: '2022-01-01 14:00:00', replyContent: '请问续航怎么样？' },
    ],
  },
  {
    createTime: '2022-01-02 12:00:00',
    content: 'I love this product!',
    itemsName:
      '搅蒜器打蒜器家用绞蒜切蒜器多功能辅食料理机电动蒜泥神器蒜蓉机自动切菜机压蒜器 蓝色-升级大电机 0.26',
    img: '/public/img/宠物2.jpg',
    id: 2, // 补充缺失的id
    replies: [], // 无回复时为空数组
  },
]

const handleDelete = (id: number) => {
  axios
    .request({
      url: '/server/api/shop/product/filter',
      method: 'POST',
      data: { id: id },
    })
    .then((res) => {
      console.log('删除自己的评论', res)
      if (res.data) {
        const index = commentList.findIndex((comment) => comment.id === id)
        if (index !== -1) {
          commentList.splice(index, 1)
        }
      }
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<style scoped>
/* 可选：优化回复内容的样式 */
.truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
