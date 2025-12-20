<template>
    <div class="review-system-wrapper">
        <div class="cute-card p-6 bg-white">
            <h2 class="text-xl font-bold text-blue-500 mb-4">用户评价</h2>

            <!-- 评价统计 -->
            <div class="bg-blue-50 rounded-xl p-6 mb-6">
                <div class="flex flex-col md:flex-row items-center justify-between">
                    <div class="text-center md:text-left mb-4 md:mb-0">
                        <div class="text-gray-600">综合评分</div>
                        <el-rate :model-value="totalScore" disabled :colors="['#4A90E2', '#4A90E2', '#4A90E2']"
                            class="mt-1"></el-rate>
                    </div>

                    <div class="flex-1 md:px-8">
                        <div class="flex items-center mb-2">
                            <span class="w-20 text-gray-600 text-sm">服务评分</span>
                            <el-rate model-value="serviceScore" disabled show-score
                                :colors="['#4A90E2', '#4A90E2', '#4A90E2']" class="flex-1"
                                score-template="{value}"></el-rate>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 评价列表（保留原有注释结构，可自行填充数据） -->
            <div v-if="loadingReviews" class="text-center py-4">
                <i class="el-icon-loading text-blue-500 text-xl"></i>
                <span class="text-gray-500 ml-2">加载中...</span>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
                暂无用户评价
            </div>

            <!-- 可取消注释启用评价列表
      <div class="space-y-6" v-infinite-scroll="loadMoreReviews" infinite-scroll-distance="100">
        <div v-for="review in displayedReviews" :key="review.id"
          class="border-b border-blue-100 pb-6 last:border-0">
          
          <div class="flex justify-between items-start mb-3">
              <div class="flex items-center">
                  <img :src="review.avatar" class="w-10 h-10 rounded-full mr-3">
                  <div>
                      <div class="font-semibold">{{ review.userName }}</div>
                      <div class="text-gray-500 text-sm">
                          {{ review.petType }} · {{ review.packageType }} · {{ formatDate(review.date) }}
                      </div>
                  </div>
              </div>
              <el-rate v-model="review.rating" disabled size="small"
                  :colors="['#4A90E2', '#4A90E2', '#4A90E2']"></el-rate>
          </div>

          <p class="text-gray-700 mb-3">{{ review.content }}</p>

          <div v-if="review.images.length > 0" class="grid grid-cols-3 gap-2 mb-3">
              <img v-for="(img, index) in review.images" :key="index" :src="img"
                  class="w-full h-24 object-cover rounded-lg cursor-pointer"
                  @click="showImagePreview(review.images, index)">
          </div>

          <div class="flex flex-wrap gap-1 mb-3">
              <el-tag v-for="tag in review.tags" :key="tag" type="info" size="small"
                  class="rounded-full">
                  {{ tag }}
              </el-tag>
          </div>

          <div class="flex items-center text-sm text-gray-500">
              <span class="mr-4 cursor-pointer hover:text-blue-500"
                  @click="toggleReply(review.id)">
                  <i class="el-icon-chat-dot-round mr-1"></i>回复
              </span>
              <span class="cursor-pointer hover:text-blue-500" @click="toggleLike(review.id)">
                  <i class="el-icon-thumb mr-1"></i>有用 ({{ review.likes }})
              </span>
          </div>
        </div>
      </div>
      -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义Props
const props = defineProps<{
    totalScore: number
    serviceScore: number
}>()
console.log(props)
// 评价加载状态
const loadingReviews = ref(false)
// 可自行扩展评价相关状态
// const displayedReviews = ref<Review[]>([])
// const activeReply = ref('')
// const replyContent = ref('')
// const hasMoreReviews = ref(true)
</script>

<style scoped>
.review-system-wrapper {
    width: 100%;
}
</style>