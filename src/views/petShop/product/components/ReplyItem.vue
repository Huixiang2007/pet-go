<template>
  <div class="text-sm">
    <div class="flex items-center gap-2 mb-1">
      <img :src="reply.fromAvatar" class="w-6 h-6 rounded-full object-cover" />
      <div class="text-xs text-gray-500">{{ reply.fromNickname }}</div>
      <span v-if="reply.replyType === 1" class="text-xs bg-blue-50 text-blue-500 px-1.5 rounded">
        商家
      </span>
      <div class="text-xs text-gray-400 ml-auto">{{ reply.replyTime }}</div>
    </div>

    <div class="text-gray-700 mb-1">
      <span v-if="reply.toNickname" class="text-blue-500">@{{ reply.toNickname }} </span>
      {{ reply.content }}
    </div>

    <div class="flex items-center gap-3 text-xs text-gray-400 mb-1">
      <div class="cursor-pointer" @click="$emit('toggle-like', reply)">
        <i :class="reply.liked ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'"></i>
        {{ reply.likeCount }}
      </div>

      <div class="cursor-pointer text-blue-500" @click="showInput = !showInput">回复</div>

      <div
        class="cursor-pointer text-blue-500"
        v-if="reply.childReplies && reply.childReplies.length > 0"
        @click="localShowChild = !localShowChild"
      >
        {{ localShowChild ? '收起' : '展开' }}
      </div>
    </div>

    <!-- 回复输入框 -->
    <div v-if="showInput" class="mt-2">
      <textarea
        v-model="content"
        class="w-full border p-2 rounded text-sm"
        rows="2"
        placeholder="回复"
      ></textarea>
      <div class="flex justify-end gap-2 mt-1">
        <button class="px-2 py-1 text-xs border rounded" @click="showInput = false">取消</button>
        <button class="px-2 py-1 text-xs bg-orange-500 text-white rounded" @click="send">
          发送
        </button>
      </div>
    </div>

    <div
      v-if="localShowChild && reply.childReplies && reply.childReplies.length > 0"
      class="ml-4 mt-2 pl-2 border-l border-gray-200 space-y-2"
    >
      <ReplyItem
        v-for="child in reply.childReplies"
        :key="child.id"
        :reply="child"
        :comment-id="commentId"
        @toggle-like="$emit('toggle-like', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { replyComment } from '../../../../api/pet-shop/comment'

const props = defineProps({
  reply: { type: Object, required: true },
  commentId: { type: String, required: true },
})

const emit = defineEmits(['toggle-like', 'update:show-child'])
const showInput = ref(false)
const content = ref('')
const localShowChild = ref(false)

watch(
  () => props.reply.showChild,
  (val) => {
    if (val !== undefined) localShowChild.value = val
  },
  { immediate: true },
)
const send = async () => {
  if (!content.value?.trim()) return
  try {
    // 区分直接回复和回复自评论
    const params: any = {
      commentId: props.commentId,
      content: content.value,
    }
    const isDirectReply = !props.reply.parentId || !props.reply.toUid
    if (!isDirectReply) {
      params.parentId = props.reply.id
      params.toUid = props.reply.fromUid
    }

    console.log('回复参数:', params)
    await replyComment(params)
    content.value = ''
    showInput.value = false
    emit('update:show-child', true)
  } catch (e) {
    console.error('回复失败', e)
  }
}
</script>
