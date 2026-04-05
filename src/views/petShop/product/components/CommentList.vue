<template>
  <div class="bg-white min-h-screen">
    <div class="max-w-4xl mx-auto py-4 px-4">
      <h2 class="text-lg font-semibold mb-4">商品评价</h2>
      <p class="text-gray-500 text-sm mb-6">共 {{ total }} 条评价</p>

      <div class="space-y-6" v-loading="loading">
        <div
          v-for="comment in commentList"
          :key="comment.id"
          class="pb-6 border-b border-gray-100 last:border-b-0"
        >
          <!-- 用户信息 -->
          <div class="flex items-center gap-3 mb-3">
            <img :src="comment.userAvatar" class="w-9 h-9 rounded-full object-cover" />
            <div>
              <div class="font-medium text-gray-800">
                {{ comment.isAnonymous === '匿名' ? '匿名用户' : comment.userNickname }}
              </div>
            </div>
          </div>

          <!-- 评价内容 -->
          <div class="text-gray-800 text-base mb-3 leading-relaxed">
            {{ comment.content }}
          </div>

          <!--  晒图/视频） -->
          <div
            v-if="comment.imageUrls || comment.videoUrl"
            class="flex gap-2 mb-4 overflow-x-auto pb-2"
          >
            <img
              v-if="comment.imageUrls"
              :src="comment.imageUrls"
              class="w-28 h-28 rounded-lg object-cover flex-shrink-0"
            />
            <video
              v-if="comment.videoUrl"
              :src="comment.videoUrl"
              class="w-28 h-28 rounded-lg object-cover flex-shrink-0"
              controls
              playsinline
            ></video>
          </div>

          <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-3">
            <img
              :src="itemInfo.mainImage"
              :alt="itemInfo.title"
              class="w-20 h-20 rounded object-cover"
            />
            <div class="flex-1">
              <div class="text-sm text-gray-800 line-clamp-2">
                {{ itemInfo.title }}
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-red-500 font-bold text-lg">¥{{ itemInfo.currentPrice }}</span>
                <span class="text-gray-400 text-xs">已抢{{ itemInfo.sales }}件</span>
              </div>
            </div>
          </div>

          <!--点赞/回复/展开 -->
          <div class="flex items-center gap-6 text-sm text-gray-500">
            <div class="flex items-center gap-1 cursor-pointer" @click="handleLike(comment)">
              <i
                :class="comment.liked ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'"
              ></i>
              <span>{{ comment.likeCount }}</span>
            </div>
            <div
              class="flex items-center gap-1 cursor-pointer"
              @click="comment.showReplyBox = !comment.showReplyBox"
            >
              <i class="fa-regular fa-comment"></i>
              <span>{{ comment.replyCount }}</span>
            </div>
            <div
              v-if="comment.replyList?.length"
              class="cursor-pointer text-blue-500"
              @click="comment.showReply = !comment.showReply"
            >
              {{ comment.showReply ? '收起回复' : '展开回复' }}
            </div>
          </div>

          <!-- 主评论回复框 -->
          <div v-if="comment.showReplyBox" class="mt-3">
            <textarea
              v-model="comment.replyContent"
              class="w-full border border-gray-200 p-3 rounded-lg text-sm"
              rows="2"
              placeholder="回复这条评价..."
            ></textarea>
            <div class="flex justify-end gap-2 mt-2">
              <button
                class="px-3 py-1.5 text-xs border border-gray-200 rounded"
                @click="comment.showReplyBox = false"
              >
                取消
              </button>
              <button
                class="px-3 py-1.5 text-xs bg-red-500 text-white rounded"
                @click="sendReply(comment)"
              >
                发送
              </button>
            </div>
          </div>

          <!--  回复列表 -->
          <div
            v-if="comment.showReply && comment.replyList?.length"
            class="mt-4 pl-4 border-l-2 border-gray-100 space-y-3"
          >
            <ReplyItem
              v-for="reply in comment.replyList"
              :key="reply.id"
              :reply="reply"
              :comment-id="String(comment.id)"
              @toggle-like="handleLike"
            />
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="commentList.length === 0" class="text-center py-16 text-gray-400">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  getProductCommentList,
  likeComment,
  cancelLikeComment,
  replyComment,
  isLikeComment,
} from '../../../../api/pet-shop/comment'
import { Detail } from '../../../../api/pet-shop/product'
import ReplyItem from './ReplyItem.vue'
import type { ProductDetail } from '../../../../types/shop'
const props = defineProps({
  shopId: [String, Number],
  productId: [String, Number],
})

const commentList = ref([])
const itemInfo = ref<ProductDetail | null>(null)
const total = ref(0)
const loading = ref(false)

//加载信息
const loadShopInfo = async () => {
  if (!props.productId) return
  loading.value = true
  try {
    const data = await Detail(Number(props.productId))
    console.log('加载成功', data)
    itemInfo.value = data || null
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}
const loadComment = async () => {
  if (!props.shopId) return
  loading.value = true
  try {
    const data = await getProductCommentList({
      shopId: props.shopId,
      pageNum: 1,
      pageSize: 100,
    })
    console.log('加载成功', data)

    commentList.value =
      data.list?.map((item) => ({
        ...item,
        liked: false,
        showReply: false,
        showReplyBox: false,
        replyContent: '',
        replyList:
          item.replyList?.map((reply) => ({
            ...reply,
            liked: false,
            showChild: false,
            childReplies:
              reply.childReplies?.map((child) => ({
                ...child,
                liked: false,
                showChild: false,
              })) || [],
          })) || [],
      })) || []

    total.value = data.total || 0
    await checkAllLikes()
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

// 批量判断点赞状态
const checkAllLikes = async () => {
  for (const comment of commentList.value) {
    try {
      const res = await isLikeComment(String(comment.id), 2)
      if (res == 'FALSE') {
        comment.liked = false
      } else {
        comment.liked = true
      }
      console.log('判断点赞状态成功', comment.liked, res)
    } catch {}
    // 子回复
    for (const reply of comment.replyList || []) {
      try {
        const res = await isLikeComment(String(reply.id), 2)
        if (res == 'FALSE') {
          reply.liked = false
        } else {
          reply.liked = true
        }
      } catch {}

      // 子子回复
      for (const child of reply.childReplies || []) {
        try {
          const res = await isLikeComment(String(child.id), 2)
          if (res == 'FALSE') {
            child.liked = false
          } else {
            child.liked = true
          }
        } catch {}
      }
    }
  }
}

// 点赞 / 取消点赞
const handleLike = async (item) => {
  try {
    if (item.commentId) {
      if (item.liked) {
        await cancelLikeComment(item.id, 2)
        item.liked = false
        item.likeCount = Math.max(0, item.likeCount - 1)
      } else {
        await likeComment(item.id, 2)
        item.liked = true
        item.likeCount += 1
      }
    } else {
      if (item.liked) {
        await cancelLikeComment(item.id, 1)
        item.liked = false
        item.likeCount = Math.max(0, item.likeCount - 1)
      } else {
        await likeComment(item.id, 1)
        item.liked = true
        item.likeCount += 1
      }
    }
  } catch (e) {
    console.error('点赞操作失败', e)
  }
}

// 发送主评论回复
const sendReply = async (comment) => {
  if (!comment.replyContent?.trim()) return
  try {
    await replyComment({
      commentId: String(comment.id),
      content: comment.replyContent,
      parentId: '0',
      toUid: String(comment.userId),
    })

    comment.replyContent = ''
    comment.showReplyBox = false
    comment.showReply = true
    loadComment()
  } catch (e) {
    console.error('回复失败', e)
  }
}

onMounted(() => {
  loadShopInfo()
  loadComment()
})
</script>

<style scoped>
img,
video {
  object-fit: cover;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
