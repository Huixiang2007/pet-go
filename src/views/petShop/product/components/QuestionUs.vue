<template>
  <div class="qa-container">
    <!-- 顶部：发布留言按钮（新增！） -->
    <div class="publish-bar flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium">商品留言</h3>
      <el-button type="primary" @click="showAskModal = true">发布留言</el-button>
    </div>

    <!-- 提问列表 -->
    <div class="qa-list space-y-6">
      <div
        v-for="item in qaList"
        :key="item.id"
        class="qa-item border-b border-gray-100 pb-4 last:border-b-0"
      >
        <!-- 提问部分 -->
        <div class="question flex gap-3">
          <div
            class="question-tag w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
          >
            问
          </div>
          <div class="flex-1">
            <div class="question-content text-base font-medium text-gray-800 mb-2">
              {{ item.content }}
            </div>
            <div class="question-meta flex items-center gap-4 mt-1 text-xs text-gray-400">
              <span>{{ item.userNickname }}</span>
              <span v-if="item.isBuyer" class="px-1 py-0.5 bg-gray-100 rounded text-xs">已购</span>
              <span>{{ item.createTime }}</span>
              <button
                @click="toggleReplyInput(item.id, null, item.userId)"
                class="text-xs text-gray-500 hover:text-orange-500"
              >
                回复
              </button>
            </div>

            <!-- 回复主提问的输入框 -->
            <div
              v-if="showReplyInput.questionId === item.id && !showReplyInput.answerId"
              class="mt-3"
            >
              <textarea
                v-model="replyContent"
                class="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none"
                rows="2"
                placeholder="回复这条提问..."
              ></textarea>
              <div class="flex justify-end gap-2 mt-1">
                <button
                  @click="showReplyInput = { questionId: null, answerId: null, fromUid: null }"
                  class="px-3 py-1 text-xs border border-gray-200 rounded"
                >
                  取消
                </button>
                <button
                  @click="handleReply()"
                  class="px-3 py-1 text-xs bg-orange-500 text-white rounded"
                >
                  发送
                </button>
              </div>
            </div>

            <!-- 主提问的回复列表（即主回答，支持展开/收起） -->
            <div class="answers ml-9 mt-3 space-y-3">
              <div
                v-for="answer in (item.replyList || []).slice(0, showMoreMap[item.id] ? 999 : 1)"
                :key="answer.id"
                class="answer flex gap-3"
              >
                <img
                  :src="answer.fromAvatar"
                  class="w-6 h-6 rounded-full object-cover"
                  alt="头像"
                />
                <div class="flex-1">
                  <div class="answer-content text-sm text-gray-700">
                    <span class="font-medium text-gray-800 mr-1">{{ answer.fromName }}</span>
                    <span v-if="answer.isBuyer" class="px-1 py-0.5 bg-gray-100 rounded text-xs mr-1"
                      >已购</span
                    >
                    {{ answer.content }}
                  </div>
                  <div class="answer-meta flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span>{{ answer.replyTime }}</span>
                    <button
                      @click="handleLike(answer.id, answer.liked)"
                      class="flex items-center gap-1"
                    >
                      <i
                        :class="
                          answer.liked ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'
                        "
                      ></i>
                      <span>{{ answer.likeCount || 0 }}</span>
                    </button>
                    <button @click="toggleReplyInput(item.id, answer.id, answer.fromUid)">
                      回复
                    </button>
                  </div>

                  <!-- 回复主回答的输入框 -->
                  <div
                    v-if="
                      showReplyInput.questionId === item.id && showReplyInput.answerId === answer.id
                    "
                    class="mt-2"
                  >
                    <textarea
                      v-model="replyContent"
                      class="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none"
                      rows="2"
                      placeholder="回复这条回答..."
                    ></textarea>
                    <div class="flex justify-end gap-2 mt-1">
                      <button
                        @click="
                          showReplyInput = { questionId: null, answerId: null, fromUid: null }
                        "
                        class="px-3 py-1 text-xs border border-gray-200 rounded"
                      >
                        取消
                      </button>
                      <button
                        @click="handleReply()"
                        class="px-3 py-1 text-xs bg-orange-500 text-white rounded"
                      >
                        发送
                      </button>
                    </div>
                  </div>

                  <!-- 子评论列表（支持展开/收起） -->
                  <div
                    v-if="answer.childReplies && answer.childReplies.length > 0"
                    class="ml-4 mt-2 pl-2 border-l border-gray-200 space-y-2"
                  >
                    <div
                      v-for="child in (answer.childReplies || []).slice(
                        0,
                        childShowMoreMap[answer.id] ? 999 : 1,
                      )"
                      :key="child.id"
                      class="flex gap-3"
                    >
                      <img
                        :src="child.fromAvatar"
                        class="w-5 h-5 rounded-full object-cover"
                        alt="头像"
                      />
                      <div class="flex-1">
                        <div class="text-sm text-gray-700">
                          <span class="font-medium text-gray-800 mr-1">{{ child.fromName }}</span>
                          <span v-if="child.toNickname" class="text-blue-500 mr-1"
                            >@{{ child.toNickname }}</span
                          >
                          {{ child.content }}
                        </div>
                        <div class="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>{{ child.replyTime }}</span>
                          <button
                            @click="handleLike(child.id, child.liked)"
                            class="flex items-center gap-1"
                          >
                            <i
                              :class="
                                child.liked
                                  ? 'fa-solid fa-heart text-red-500'
                                  : 'fa-regular fa-heart'
                              "
                            ></i>
                            <span>{{ child.likeCount || 0 }}</span>
                          </button>
                          <button @click="toggleReplyInput(item.id, child.id, child.fromUid)">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- 子评论展开/收起按钮 -->
                    <div v-if="answer.childReplies && answer.childReplies.length > 1" class="mt-1">
                      <button
                        @click="toggleChildShowMore(answer.id)"
                        class="text-xs text-orange-500"
                      >
                        {{
                          childShowMoreMap[answer.id]
                            ? '收起回复'
                            : `${answer.childReplies.length}条回复 >`
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 主回答展开/收起按钮 -->
              <div v-if="(item.replyList || []).length > 1" class="ml-9 mt-2">
                <button @click="toggleShowMore(item.id)" class="text-sm text-orange-500">
                  {{
                    showMoreMap[item.id] ? '收起' : `${(item.replyList || []).length}个买家回答 >`
                  }}
                </button>
              </div>
            </div>
          </div>
          <button
            v-if="item.userId === currentUserId"
            @click="handleDelete(item.id)"
            class="text-xs text-gray-400 hover:text-red-500"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="qaList.length === 0" class="empty-state text-center py-10">
      <div class="text-3xl mb-2">💬</div>
      <p class="text-gray-500 text-sm">该商品暂时还没有买家提问</p>
    </div>

    <!-- 提问弹窗（发布留言/提问） -->
    <el-dialog v-model="showAskModal" title="我要提问" width="500px" :close-on-click-modal="false">
      <div class="ask-form">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">提问内容</label>
          <textarea
            v-model="askContent"
            class="w-full border border-gray-200 rounded-lg p-3 resize-none"
            rows="4"
            placeholder="写下你对商品的疑问，已购买的用户会为你解答~"
            maxlength="200"
          ></textarea>
          <div class="text-right text-xs text-gray-400 mt-1">{{ askContent.length }}/200</div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="showAskModal = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitAsk" :loading="submitting">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more text-center py-4">
      <el-button type="text" @click="loadMore" :loading="loadingMore"> 加载更多 </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  submitMessage,
  getMessageList,
  deleteMessage,
  replyMessage,
  likeComment,
  cancelLikeComment,
  isLikeComment,
} from '@/api/pet-shop/comment'

const props = defineProps<{
  productId: number | string
}>()

// 状态管理
const qaList = ref<any[]>([])
// 主回答展开/收起状态
const showMoreMap = ref<Record<string, boolean>>({})
// 子评论展开/收起状态
const childShowMoreMap = ref<Record<string, boolean>>({})
// 区分层级：记录提问ID、被回复ID、被回复人ID
const showReplyInput = ref<{
  questionId: string | null
  answerId: string | null
  fromUid: number | null
}>({ questionId: null, answerId: null, fromUid: null })
const replyContent = ref('')
const showAskModal = ref(false)
const askContent = ref('')
const submitting = ref(false)
const currentUserId = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loadingMore = ref(false)

// 加载问大家列表 + 初始化点赞状态
const loadQaList = async (reset = false) => {
  if (reset) {
    pageNum.value = 1
    hasMore.value = true
    qaList.value = []
    // 重置展开状态
    showMoreMap.value = {}
    childShowMoreMap.value = {}
  }
  if (!hasMore.value || !props.productId) return

  loadingMore.value = true
  try {
    const res = await getMessageList({
      productId: props.productId,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    })
    console.log('问大家接口返回：', res)
    if (res.list && res.list.length > 0) {
      const listWithLike = await Promise.all(
        res.list.map(async (item: any) => {
          // 主提问点赞状态（用item.id）
          const itemLiked = await isLikeComment(String(item.id), 2)
          const replyListWithLike = await Promise.all(
            (item.replyList || []).map(async (reply: any) => {
              // 主回答点赞状态（用reply.id）
              const replyLiked = await isLikeComment(String(reply.id), 2)
              return {
                ...reply,
                liked: replyLiked === 'TRUE',
                // 子评论点赞状态（用child.id）
                childReplies: await Promise.all(
                  (reply.childReplies || []).map(async (child: any) => {
                    const childLiked = await isLikeComment(String(child.id), 2)
                    return { ...child, liked: childLiked === 'TRUE' }
                  }),
                ),
              }
            }),
          )
          return {
            ...item,
            liked: itemLiked === 'TRUE',
            replyList: replyListWithLike,
          }
        }),
      )

      qaList.value = [...qaList.value, ...listWithLike]
      pageNum.value++
      hasMore.value = res.list.length === pageSize.value
    } else {
      hasMore.value = false
    }
  } catch (e) {
    console.error('加载问大家失败', e)
    ElMessage.error('加载失败')
  } finally {
    loadingMore.value = false
  }
}

// 主回答展开/收起
const toggleShowMore = (id: number | string) => {
  showMoreMap.value[id] = !showMoreMap.value[id]
}

// 子评论展开/收起
const toggleChildShowMore = (answerId: string) => {
  childShowMoreMap.value[answerId] = !childShowMoreMap.value[answerId]
}

// 切换回复输入框显示（支持主提问/主回答/子评论）
const toggleReplyInput = (
  questionId: number | string,
  answerId: number | string | null,
  fromUid: number | null,
) => {
  if (
    showReplyInput.value.questionId === questionId &&
    showReplyInput.value.answerId === answerId
  ) {
    showReplyInput.value = { questionId: null, answerId: null, fromUid: null }
  } else {
    showReplyInput.value = {
      questionId: String(questionId),
      answerId: answerId ? String(answerId) : null,
      fromUid,
    }
  }
}

// 提交提问（发布留言）
const handleSubmitAsk = async () => {
  if (!askContent.value.trim()) {
    ElMessage.warning('请输入提问内容')
    return
  }
  submitting.value = true
  try {
    await submitMessage({
      productId: String(props.productId),
      content: askContent.value,
      imageUrls: '',
    })
    ElMessage.success('提问成功，等待用户回答~')
    showAskModal.value = false
    askContent.value = ''
    loadQaList(true)
  } catch (e) {
    console.error('提问失败', e)
    ElMessage.error('提问失败')
  } finally {
    submitting.value = false
  }
}

// 删除提问
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条提问吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteMessage(Number(id))
    ElMessage.success('删除成功')
    loadQaList(true)
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

// 点赞回答
const handleLike = async (answerId: string | number, isLiked: boolean) => {
  try {
    if (isLiked) {
      console.log('取消点赞', answerId)
      await cancelLikeComment(String(answerId), 3)
    } else {
      console.log('点赞', answerId)
      await likeComment(String(answerId), 3)
    }
    loadQaList(true)
  } catch (e) {
    ElMessage.error('操作失败')
    console.error('点赞失败', e)
  }
}

// 核心修复：区分层级回复（支持主提问/主回答/子评论）
const handleReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  const { questionId, answerId, fromUid } = showReplyInput.value
  if (!questionId) return

  try {
    // 1. 回复主提问：只传 messageId + content
    const params: any = {
      messageId: questionId,
      content: replyContent.value,
    }

    // 2. 回复主回答/子评论：额外传 parentId + toUid
    if (answerId && fromUid) {
      params.parentId = answerId
      params.toUid = fromUid
    }

    await replyMessage(params)
    ElMessage.success('回复成功')
    replyContent.value = ''
    showReplyInput.value = { questionId: null, answerId: null, fromUid: null }
    loadQaList(true)
  } catch (e) {
    console.log(e)
    ElMessage.error('回复失败')
  }
}

// 加载更多
const loadMore = () => {
  loadQaList()
}

onMounted(() => {
  loadQaList(true)
  currentUserId.value = 24
})
</script>

<style scoped>
.qa-container {
  @apply relative p-4;
}
.publish-bar {
  @apply border-b border-gray-100 pb-4;
}
.qa-item {
  @apply hover:bg-gray-50 transition-colors rounded-lg p-3;
}
.question-tag {
  @apply flex-shrink-0;
}
.empty-state {
  @apply py-16;
}
</style>
