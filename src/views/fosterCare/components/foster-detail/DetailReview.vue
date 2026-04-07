<template>
    <div class="review-system-wrapper">
        <div class="cute-card p-6 bg-white">
            <h2 class="text-xl font-bold text-blue-500 mb-6 flex items-center">
                <i class="el-icon-star-on mr-2 text-blue-400"></i>用户评价
            </h2>

            <!-- 评价统计 -->
            <div class="bg-blue-50 rounded-xl p-6 mb-6">
                <div class="flex flex-col md:flex-row items-center justify-between">
                    <div class="text-center md:text-left mb-4 md:mb-0">
                        <div class="text-gray-600">综合评分</div>
                        <el-rate :model-value="totalScore" disabled :colors="['#4A90E2', '#4A90E2', '#4A90E2']"
                            class="mt-2 text-xl"></el-rate>
                    </div>

                    <div class="flex-1 md:px-8 w-full md:w-auto">
                        <div class="flex items-center mb-3">
                            <span class="w-24 text-gray-600 text-sm">服务评分</span>
                            <el-rate :model-value="serviceScore" disabled show-score
                                :colors="['#4A90E2', '#4A90E2', '#4A90E2']" class="flex-1"
                                score-template="{value}"></el-rate>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 评价列表 -->
            <div v-if="loadingReviews" class="text-center py-8">
                <i class="el-icon-loading text-blue-500 text-2xl"></i>
                <p class="text-gray-500 mt-2">加载评价中...</p>
            </div>

            <div v-else-if="reviews.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                <i class="el-icon-chat-line-round text-4xl mb-3 text-gray-400"></i>
                <p>暂无用户评价</p>
            </div>

            <div v-else class="space-y-6">
                <div v-for="review in reviews" :key="review.id"
                    class="border-b border-blue-100 pb-6 last:border-0 hover:bg-blue-50 rounded-lg p-4 transition-all">

                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center">
                            <img :src="review.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                                class="w-12 h-12 rounded-full mr-4 border-2 border-blue-200">
                            <div>
                                <div class="font-semibold text-gray-800">{{ review.userName }}</div>
                                <div class="text-gray-500 text-sm mt-1">
                                    {{ review.petType }} · {{ review.packageType }} · {{ formatDate(review.date) }}
                                </div>
                            </div>
                        </div>
                        <el-rate :model-value="review.rating" disabled size="small"
                            :colors="['#4A90E2', '#4A90E2', '#4A90E2']"></el-rate>
                    </div>

                    <p class="text-gray-700 mb-4 leading-relaxed">{{ review.content }}</p>

                    <div v-if="review.images && review.images.length > 0" class="grid grid-cols-3 gap-3 mb-4">
                        <img v-for="(img, index) in review.images" :key="index" :src="img"
                            class="w-full h-28 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            @click="showImagePreview(img)">
                    </div>

                    <div v-if="review.tags && review.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
                        <el-tag v-for="tag in review.tags" :key="tag" type="info" size="small" class="rounded-full">
                            {{ tag }}
                        </el-tag>
                    </div>

                    <div class="flex items-center text-sm text-gray-500">
                        <span class="mr-6 cursor-pointer hover:text-blue-500 transition-colors">
                            <i class="el-icon-chat-dot-round mr-1"></i>回复
                        </span>
                        <span class="cursor-pointer hover:text-blue-500 transition-colors">
                            <i class="el-icon-thumb mr-1"></i>有用 ({{ review.likes || 0 }})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义Props
const props = defineProps<{
    totalScore: number
    serviceScore: number
}>()

// 定义事件
const emit = defineEmits<{
    'preview-image': [image: string]
}>()

// 评价相关状态
const loadingReviews = ref(false)
const reviews = ref<any[]>([])

// 模拟评价数据（实际项目中应从后端获取）
const fetchReviews = async () => {
    loadingReviews.value = true
    try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 模拟数据
        reviews.value = [
            {
                id: 1,
                userName: '宠物爱好者',
                avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                petType: '猫咪',
                packageType: '标准寄养',
                date: '2026-03-15',
                rating: 5,
                content: '服务非常好，寄养环境干净整洁，工作人员对宠物很有耐心，猫咪回来后状态很好，下次还会选择这里！',
                images: [
                    'https://img.alicdn.com/imgextra/i2/O1CN01bXq3dC1H0zI1Jz3Hf_!!6000000000709-2-tps-800-800.jpg',
                    'https://img.alicdn.com/imgextra/i3/O1CN01W7W4t61aZ7rY4i7oO_!!6000000004623-2-tps-800-800.jpg'
                ],
                tags: ['环境好', '服务周到', '价格合理'],
                likes: 12
            },
            {
                id: 2,
                userName: '狗狗家长',
                avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                petType: '狗狗',
                packageType: '高级寄养',
                date: '2026-03-10',
                rating: 4,
                content: '整体服务不错，就是价格稍微有点高，不过环境和服务质量都很好，狗狗在这里很开心。',
                images: [],
                tags: ['服务好', '环境优美'],
                likes: 8
            }
        ]
    } catch (error) {
        console.error('获取评价失败：', error)
    } finally {
        loadingReviews.value = false
    }
}

// 格式化日期
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN')
}

// 图片预览
const showImagePreview = (image: string) => {
    emit('preview-image', image)
}

// 初始化
onMounted(() => {
    fetchReviews()
})
</script>

<style scoped>
.review-system-wrapper {
    width: 100%;
}
</style>