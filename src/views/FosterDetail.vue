<template>
  <div id="app">
    <!-- 导航栏 -->
    <NavBar />

    <div class="container mx-auto px-4 py-6 max-w-6xl mt-16">
      <div class="">
        <div class="">
          <!-- 基本信息卡片 -->
          <div class="cute-card p-6 bg-white mb-6">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- 基本信息 -->
              <div class="flex-1">
                <div class="flex justify-between items-start mb-4">
                  <h1 class="text-2xl font-bold text-blue-500">{{ fosterHome.name }}</h1>
                  <span
                    class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ fosterHome.type }}
                  </span>
                </div>

                <!-- 评分 -->
                <div class="flex items-center mb-4">
                  <el-rate
                    v-model="fosterHome.rating"
                    disabled
                    :colors="['#4A90E2', '#4A90E2', '#4A90E2']"
                    class="mr-2"
                  ></el-rate>
                  <span class="text-blue-500 font-bold text-lg">{{ fosterHome.rating }}</span>
                  <span class="text-gray-500 ml-2">({{ fosterHome.reviewCount }}条评价)</span>
                </div>

                <!-- 地址 -->
                <div class="flex items-center mb-4 text-gray-600">
                  <i class="el-icon-location mr-2 text-blue-400"></i>
                  <span>{{ fosterHome.address }}</span>
                </div>

                <!-- 资质认证 -->
                <div class="mb-4">
                  <h3 class="font-semibold text-gray-700 mb-2">资质认证</h3>
                  <div class="flex flex-wrap gap-2">
                    <el-tag
                      v-for="cert in fosterHome.certifications"
                      :key="cert.type"
                      :type="cert.verified ? 'success' : 'info'"
                      class="rounded-full"
                    >
                      <i :class="cert.icon" class="mr-1"></i>
                      {{ cert.name }}
                      <i v-if="cert.verified" class="el-icon-success ml-1"></i>
                    </el-tag>
                  </div>
                </div>

                <!-- 简介和服务理念，联系方式 -->
                <div class="mt-4">
                  <h3 class="text-lg font-semibold text-blue-500 mb-3">家庭简介</h3>
                  <p class="text-gray-700 leading-relaxed">{{ fosterHome.description }}</p>

                  <h3 class="text-lg font-semibold text-blue-500 mt-4 mb-3">服务理念</h3>
                  <p class="text-gray-700 leading-relaxed">{{ fosterHome.servicePhilosophy }}</p>
                  <h3 class="text-lg font-semibold text-blue-500 mt-4 mb-3">联系方式</h3>
                  <p class="text-gray-700 leading-relaxed">{{ fosterHome.contact.phone }}</p>
                  <button class="cute-btn bg-white text-blue-500 border border-blue-300 w-full">
                    <i class="el-icon-chat-dot-round mr-1"></i>在线咨询
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 环境图片展示 -->
          <div class="cute-card p-6 bg-white mb-6">
            <h2 class="text-xl font-bold text-blue-500 mb-4">环境展示</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="(image, index) in fosterHome.images"
                :key="index"
                class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all"
                @click="showImagePreview(fosterHome.images, index)"
              >
                <img
                  :src="image"
                  :alt="`环境照片${index + 1}`"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
          <!-- 服务套餐 -->
          <div class="cute-card p-6 bg-white mb-6">
            <h2 class="text-xl font-bold text-blue-500 mb-4">服务套餐</h2>

            <div class="grid grid-cols-1 gap-4">
              <div
                v-for="packageItem in fosterHome.servicePackages"
                :key="packageItem.id"
                class="border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <!-- 基本信息 -->
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="font-semibold text-blue-500 text-lg">{{ packageItem.title }}</h4>
                    <p class="text-gray-600 text-sm mt-1">{{ packageItem.description }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-blue-500">
                      {{ packageItem.basePrice }}<span class="text-base font-normal">元/天</span>
                    </div>
                    <div
                      class="text-sm"
                      :class="packageItem.maxPets > 0 ? 'text-green-500' : 'text-red-500'"
                    >
                      {{ packageItem.maxPets > 0 ? `剩余${packageItem.maxPets}个名额` : '已满' }}
                    </div>
                  </div>
                </div>

                <!-- 套餐特色 -->
                <div class="mb-3">
                  <div class="text-sm text-gray-600 mb-2">套餐包含：</div>
                  <div class="flex flex-wrap gap-2">
                    <!-- <span v-for="feature in packageItem.features" :key="feature"
                                            class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                            {{ feature }}
                                        </span> -->
                  </div>
                </div>

                <!-- 服务详情 -->
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div class="flex items-center">
                    <i class="el-icon-guide mr-2 text-blue-400"></i>
                    <span class="text-gray-600"
                      >宠物类型：{{ packageItem.petTypes.join('、') }}</span
                    >
                  </div>
                  <!-- <div class="flex items-center">
                                        <i class="el-icon-time mr-2 text-blue-400"></i>
                                        <span class="text-gray-600">服务时间：{{ packageItem.serviceHours }}</span>
                                    </div> -->
                </div>
                <!-- 点击预约 -->
                <div class="mt-2 flex justify-end">
                  <button
                    class="cute-btn px-8"
                    :disabled="packageItem.maxPets === 0"
                    @click="goToBooking(packageItem)"
                  >
                    <i class="el-icon-date mr-2"></i>
                    立即预订
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 评价系统 -->
          <div class="cute-card p-6 bg-white">
            <h2 class="text-xl font-bold text-blue-500 mb-4">用户评价</h2>

            <!-- 评价统计 -->
            <div class="bg-blue-50 rounded-xl p-6 mb-6">
              <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="text-center md:text-left mb-4 md:mb-0">
                  <div class="text-4xl font-bold text-blue-500">{{ fosterHome.rating }}</div>
                  <div class="text-gray-600">综合评分</div>
                  <el-rate
                    v-model="fosterHome.rating"
                    disabled
                    :colors="['#4A90E2', '#4A90E2', '#4A90E2']"
                    class="mt-1"
                  ></el-rate>
                  <div class="text-gray-500 text-sm mt-1">{{ fosterHome.reviewCount }}条评价</div>
                </div>

                <div class="flex-1 md:px-8">
                  <div
                    v-for="item in ratingDetails"
                    :key="item.name"
                    class="flex items-center mb-2"
                  >
                    <span class="w-20 text-gray-600 text-sm">{{ item.name }}</span>
                    <el-rate
                      v-model="item.score"
                      disabled
                      show-score
                      :colors="['#4A90E2', '#4A90E2', '#4A90E2']"
                      class="flex-1"
                      score-template="{value}"
                    ></el-rate>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评价列表 - 无限滚动 -->
            <!-- <div class="space-y-6" v-infinite-scroll="loadMoreReviews" infinite-scroll-distance="100">
                            <div v-for="review in displayedReviews" :key="review.id"
                                class="border-b border-blue-100 pb-6 last:border-0">
                                
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex items-center">
                                        <img :src="review.avatar" class="w-10 h-10 rounded-full mr-3">
                                        <div>
                                            <div class="font-semibold">{{ review.userName }}</div>
                                            <div class="text-gray-500 text-sm">
                                                {{ review.petType }} · {{ review.packageType }} · {{
                                                    formatDate(review.date) }}
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

                                
                                <div v-if="activeReply === review.id" class="mt-3 ml-12">
                                    <el-input v-model="replyContent" placeholder="写下你的回复..." class="mb-2"
                                        type="textarea" :rows="2"></el-input>
                                    <div class="flex justify-end gap-2">
                                        <button class="text-sm text-gray-500 hover:text-gray-700"
                                            @click="cancelReply">取消</button>
                                        <button class="cute-btn text-sm px-4 py-1"
                                            @click="submitReply(review.id)">回复</button>
                                    </div>
                                </div>

                               
                                <div v-if="review.replies && review.replies.length > 0" class="mt-4 ml-12 space-y-4">
                                    <div v-for="reply in review.replies" :key="reply.id"
                                        class="bg-gray-50 rounded-lg p-3">
                                        <div class="flex justify-between items-start mb-2">
                                            <div class="flex items-center">
                                                <img :src="reply.avatar" class="w-8 h-8 rounded-full mr-2">
                                                <div>
                                                    <div class="font-semibold text-sm">{{ reply.userName }}</div>
                                                    <div class="text-gray-500 text-xs">{{ formatDate(reply.date) }}
                                                    </div>
                                                </div>
                                            </div>
                                            <span v-if="reply.isOwner"
                                                class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                店家
                                            </span>
                                        </div>
                                        <p class="text-gray-700 text-sm">{{ reply.content }}</p>
                                    </div>
                                </div>
                            </div>
                        </div> -->

            <!-- 加载状态 -->
            <div v-if="loadingReviews" class="text-center py-4">
              <i class="el-icon-loading text-blue-500 text-xl"></i>
              <span class="text-gray-500 ml-2">加载中...</span>
            </div>

            <!-- <div v-if="!hasMoreReviews && displayedReviews.length > 0"
                            class="text-center py-4 text-gray-500">
                            没有更多评价了
                        </div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 图片预览 -->
    <el-dialog v-model="showImageDialog" width="80%" top="5vh">
      <img :src="previewImage" class="w-full h-auto rounded-lg" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useBookingStore } from '@/stores/booking'

// 寄养家庭数据
const fosterHome = reactive({
  id: 1,
  name: '蓝海宠物乐园',
  type: '机构',
  address: '北京市东城区王府井大街123号',
  rating: 4.8,
  reviewCount: 128,
  businessHours: '09:00-21:00',
  description:
    '我们是一家专业的宠物寄养机构，拥有多年的宠物照顾经验。我们的环境舒适安全，工作人员都经过专业培训，致力于为每一只宠物提供最好的照顾。',
  servicePhilosophy:
    '以爱心和专业对待每一只宠物，让主人放心，让宠物开心。我们相信宠物也是家庭的一员，应该得到最好的关爱。',
  images: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400',
  ],
  certifications: [
    { type: 'identity', name: '实名认证', verified: true, icon: 'el-icon-user' },
    { type: 'environment', name: '环境认证', verified: true, icon: 'el-icon-office-building' },
    { type: 'professional', name: '专业认证', verified: true, icon: 'el-icon-medal' },
  ],
  servicePackages: [
    {
      id: 1,

      title: '基础寄养套餐',
      basePrice: 120,
      maxPets: 10,
      serviceType: 1,
      description: '适合短期寄养的基础服务',
      petTypes: ['猫', '狗'],
    },
    {
      id: 2,

      title: '基础寄养套餐',
      basePrice: 120,
      maxPets: 10,
      serviceType: 1,

      description: '适合短期寄养的基础服务',
      petTypes: ['猫', '狗'],
    },
    {
      id: 3,

      title: '基础寄养套餐',
      basePrice: 120,
      maxPets: 10,
      serviceType: 1,

      description: '适合短期寄养的基础服务',
      petTypes: ['猫', '狗'],
    },
  ],
  contact: {
    name: '张小姐',
    phone: '15037347372',
  },
})
const showImageDialog = ref(false)
const previewImage = ref('')

// ==================== 评价系统 ====================
// const activeReply = ref('')
// const replyContent = ref('')
const loadingReviews = ref(false)
// const hasMoreReviews = ref(true)
// const pageSize = 5
// const currentPage = ref(0)
// const displayedReviews = ref<Review[]>([])

//套餐选择
const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()
interface PackageItem {
  id: number
  title: string
  basePrice: number
  description: string
  petTypes: string[]
  maxPets: number
  serviceType: number
}

const goToBooking = (packageItem: PackageItem) => {
  // 保存到store
  console.log('保存到store', packageItem)
  const fosterHomeId = route.params.id
  bookingStore.setSelectedPackage(packageItem)
  router.push({
    name: 'fosterBook',
    params: {
      fosterId: fosterHomeId,
      packageId: packageItem.id,
    },
  })
}

// ==================== 图片预览 ====================
const showImagePreview = (images: string[], index: number) => {
  previewImage.value = images[index] ?? ''
  showImageDialog.value = true
}

// ==================== 评价相关 ====================
const ratingDetails = ref([
  { name: '环境整洁', score: 4.8 },
  { name: '服务态度', score: 4.9 },
  { name: '专业程度', score: 4.7 },
  { name: '性价比', score: 4.6 },
])

// 模拟评价数据
// const allReviews = [
//     {
//         id: '1',
//         userName: '王小姐',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
//         petType: '柯基',
//         packageType: '尊享寄养套餐',
//         rating: 5,
//         content: '非常满意！工作人员很专业，每天都会发视频和照片，让我很放心。环境也很干净整洁，下次还会选择这里！',
//         images: [
//             'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
//             'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200'
//         ],
//         tags: ['环境干净', '服务贴心', '专业负责'],
//         likes: 12,
//         date: '2024-01-15',
//         replies: [
//             {
//                 id: '1-1',
//                 userName: '蓝海宠物乐园',
//                 avatar: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=100',
//                 content: '感谢您的认可！我们会继续努力为每只宠物提供最好的服务。',
//                 date: '2024-01-16',
//                 isOwner: true
//             }
//         ]
//     },
//     {
//         id: '2',
//         userName: '李先生',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
//         petType: '布偶猫',
//         packageType: '基础寄养套餐',
//         rating: 4,
//         content: '猫咪在这里住得很开心，工作人员对猫咪很有耐心。环境舒适，价格合理，推荐！',
//         images: [
//             'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200'
//         ],
//         tags: ['环境干净', '性价比高'],
//         likes: 8,
//         date: '2024-01-12',
//         replies: []
//     }
// ]

// const loadMoreReviews = () => {
//     if (loadingReviews.value || !hasMoreReviews.value) return

//     loadingReviews.value = true
//     setTimeout(() => {
//         const start = currentPage.value * pageSize
//         const end = start + pageSize
//         const newReviews = allReviews.slice(start, end)

//         if (newReviews.length > 0) {
//             displayedReviews.value.push(...newReviews)
//             currentPage.value++
//         }

//         hasMoreReviews.value = newReviews.length === pageSize
//         loadingReviews.value = false
//     }, 1000)
// }

// const toggleReply = (reviewId: string) => {
//     activeReply.value = activeReply.value === reviewId ? '' : reviewId
//     if (activeReply.value) {
//         replyContent.value = ''
//     }
// }

// const cancelReply = () => {
//     activeReply.value = ''
//     replyContent.value = ''
// }

// const submitReply = (reviewId: string) => {
//     if (!replyContent.value.trim()) {
//         ElMessage.warning('请输入回复内容')
//         return
//     }

//     const review = displayedReviews.value.find(r => r.id === reviewId)
//     if (review) {
//         if (!review.replies) {
//             review.replies = []
//         }
//         review.replies.push({
//             id: `${reviewId}-${Date.now()}`,
//             userName: '当前用户',
//             avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
//             content: replyContent.value,
//             date: new Date().toISOString().split('T')[0],
//             isOwner: false
//         })
//         ElMessage.success('回复成功')
//         cancelReply()
//     }
// }

// const toggleLike = (reviewId: string) => {
//     const review = displayedReviews.value.find(r => r.id === reviewId)
//     if (review) {
//         review.likes += 1
//         ElMessage.success('感谢您的认可')
//     }
// }

// const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('zh-CN')
// }

// ==================== 初始化 ====================
onMounted(() => {
  // 初始加载评价
  // loadMoreReviews()
})
</script>

<style scoped>
#app {
  border-top: 1px solid transparent;
}

.cute-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.12);
  border: 1px solid #e0f0ff;
  transition: all 0.3s ease;
  background-color: white;
}

.cute-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(74, 144, 226, 0.15);
}

.cute-btn {
  background: linear-gradient(135deg, #6bc4ff, #4a90e2);
  border: none;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);
}

.cute-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(74, 144, 226, 0.3);
}

.cute-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #6bc4ff, #4a90e2);
  border-radius: 16px 16px 0 0;
  margin: 0;
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: bold;
}
</style>
