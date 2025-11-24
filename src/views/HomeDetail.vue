<template>
    <div id="app">
        <!-- 导航栏 -->
        <div class="h-16 bg-gradient-to-r from-orange-400 to-orange-300 flex items-center justify-between px-6">
            <div class="text-white font-bold text-xl flex items-center cursor-pointer" @click="goBack">
                <i class="el-icon-arrow-left mr-2"></i>
                <span class="mr-2">🐾</span> 优宠托管
            </div>
            <div class="text-white">
                <el-button type="text" class="text-white" @click="$router.push('/')">
                    <i class="el-icon-house mr-1"></i>返回首页
                </el-button>
            </div>
        </div>

        <div class="container mx-auto px-4 py-6 max-w-6xl">
            <!-- 面包屑导航 -->
            <div class="mb-6">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>寄养家庭</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ fosterHome.name }}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- 左侧内容 -->
                <div class="lg:col-span-2">
                    <!-- 基本信息卡片 -->
                    <div class="cute-card p-6 bg-white mb-6">
                        <div class="flex flex-col md:flex-row gap-6">
                            <!-- 相册 -->
                            <div class="md:w-1/2">
                                <div class="mb-4">
                                    <el-carousel :interval="4000" type="card" height="200px" class="rounded-xl">
                                        <el-carousel-item v-for="(image, index) in fosterHome.images" :key="index">
                                            <img :src="image" :alt="`环境照片${index + 1}`"
                                                class="w-full h-full object-cover rounded-lg">
                                        </el-carousel-item>
                                    </el-carousel>
                                </div>
                                <div class="grid grid-cols-3 gap-2">
                                    <div v-for="(image, index) in fosterHome.images" :key="index"
                                        class="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-orange-200"
                                        @click="activeImageIndex = index">
                                        <img :src="image" class="w-full h-full object-cover">
                                    </div>
                                </div>
                            </div>

                            <!-- 基本信息 -->
                            <div class="md:w-1/2">
                                <div class="flex justify-between items-start mb-4">
                                    <h1 class="text-2xl font-bold text-orange-500">{{ fosterHome.name }}</h1>
                                    <span
                                        class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {{ fosterHome.type }}
                                    </span>
                                </div>

                                <!-- 评分 -->
                                <div class="flex items-center mb-4">
                                    <el-rate v-model="fosterHome.rating" disabled
                                        :colors="['#FFA500', '#FFA500', '#FFA500']" class="mr-2"></el-rate>
                                    <span class="text-orange-500 font-bold text-lg">{{ fosterHome.rating }}</span>
                                    <span class="text-gray-500 ml-2">({{ fosterHome.reviewCount }}条评价)</span>
                                </div>

                                <!-- 地址 -->
                                <div class="flex items-center mb-4 text-gray-600">
                                    <i class="el-icon-location mr-2"></i>
                                    <span>{{ fosterHome.address }}</span>
                                </div>

                                <!-- 价格 -->
                                <div class="bg-orange-50 rounded-xl p-4 mb-4">
                                    <div class="text-gray-600 text-sm">寄养价格</div>
                                    <div class="text-2xl font-bold text-orange-500">{{ fosterHome.price }}<span
                                            class="text-base font-normal">元/天</span></div>
                                </div>

                                <!-- 资质认证 -->
                                <div class="mb-4">
                                    <h3 class="font-semibold text-gray-700 mb-2">资质认证</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <el-tag v-for="cert in fosterHome.certifications" :key="cert.type"
                                            :type="cert.verified ? 'success' : 'info'" class="rounded-full">
                                            <i :class="cert.icon" class="mr-1"></i>
                                            {{ cert.name }}
                                            <i v-if="cert.verified" class="el-icon-success ml-1"></i>
                                        </el-tag>
                                    </div>
                                </div>

                                <!-- 空位状态 -->
                                <div class="mb-4">
                                    <span class="text-sm text-gray-600">当前空位：</span>
                                    <span
                                        :class="fosterHome.availableSpots > 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'">
                                        {{ fosterHome.availableSpots > 0 ? `${fosterHome.availableSpots}个空位` : '已满' }}
                                    </span>
                                </div>

                                <!-- 操作按钮 -->
                                <div class="flex gap-3">
                                    <button class="cute-btn flex-1" @click="showBookingModal = true">
                                        <i class="el-icon-date mr-1"></i>立即预订
                                    </button>
                                    <button class="cute-btn bg-white text-orange-500 border border-orange-300 flex-1"
                                        @click="toggleFavorite">
                                        <i :class="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                                            class="mr-1"></i>
                                        {{ isFavorite ? '已收藏' : '收藏' }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 简介和服务理念 -->
                        <div class="mt-6 pt-6 border-t border-orange-100">
                            <h3 class="text-lg font-semibold text-orange-500 mb-3">家庭简介</h3>
                            <p class="text-gray-700 leading-relaxed">{{ fosterHome.description }}</p>

                            <h3 class="text-lg font-semibold text-orange-500 mt-4 mb-3">服务理念</h3>
                            <p class="text-gray-700 leading-relaxed">{{ fosterHome.servicePhilosophy }}</p>
                        </div>
                    </div>

                    <!-- 服务信息卡片 -->
                    <div class="cute-card p-6 bg-white mb-6">
                        <h2 class="text-xl font-bold text-orange-500 mb-4">服务信息</h2>

                        <!-- 服务规则 -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-700 mb-3">服务规则</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="flex items-center">
                                    <i class="el-icon-guide mr-3 text-orange-400 text-xl"></i>
                                    <div>
                                        <div class="font-medium">接收宠物类型</div>
                                        <div class="text-gray-600 text-sm">{{ fosterHome.petTypes.join('、') }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <i class="el-icon-collection mr-3 text-orange-400 text-xl"></i>
                                    <div>
                                        <div class="font-medium">同时接收数量</div>
                                        <div class="text-gray-600 text-sm">最多{{ fosterHome.maxPets }}只</div>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <i class="el-icon-time mr-3 text-orange-400 text-xl"></i>
                                    <div>
                                        <div class="font-medium">营业时间</div>
                                        <div class="text-gray-600 text-sm">{{ fosterHome.businessHours }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <i class="el-icon-document mr-3 text-orange-400 text-xl"></i>
                                    <div>
                                        <div class="font-medium">接宠要求</div>
                                        <div class="text-gray-600 text-sm">需提供疫苗证明</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 服务套餐 -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-700 mb-3">服务套餐</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="packageItem in fosterHome.servicePackages" :key="packageItem.type"
                                    class="border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all"
                                    :class="{ 'bg-orange-50': selectedPackage === packageItem.type }"
                                    @click="selectedPackage = packageItem.type">
                                    <div class="flex justify-between items-start mb-2">
                                        <h4 class="font-semibold text-orange-500">{{ packageItem.name }}</h4>
                                        <span class="text-lg font-bold text-orange-500">{{ packageItem.price
                                            }}元/天</span>
                                    </div>
                                    <p class="text-gray-600 text-sm mb-2">{{ packageItem.description }}</p>
                                    <ul class="text-gray-500 text-xs space-y-1">
                                        <li v-for="feature in packageItem.features" :key="feature">• {{ feature }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- 附加服务 -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-700 mb-3">附加服务</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div v-for="service in fosterHome.additionalServices" :key="service.name"
                                    class="border border-orange-200 rounded-xl p-4 text-center hover:shadow-md transition-all"
                                    :class="{ 'bg-orange-50': selectedServices.includes(service.name) }"
                                    @click="toggleAdditionalService(service.name)">
                                    <div class="text-2xl mb-2">{{ service.icon }}</div>
                                    <div class="font-semibold text-orange-500">{{ service.name }}</div>
                                    <div class="text-gray-600 text-sm">{{ service.price }}元</div>
                                    <div class="text-gray-500 text-xs mt-1">{{ service.description }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 评价系统 -->
                    <div class="cute-card p-6 bg-white mb-6">
                        <h2 class="text-xl font-bold text-orange-500 mb-4">用户评价</h2>

                        <!-- 评价统计 -->
                        <div class="bg-orange-50 rounded-xl p-6 mb-6">
                            <div class="flex flex-col md:flex-row items-center justify-between">
                                <div class="text-center md:text-left mb-4 md:mb-0">
                                    <div class="text-4xl font-bold text-orange-500">{{ fosterHome.rating }}</div>
                                    <div class="text-gray-600">综合评分</div>
                                    <el-rate v-model="fosterHome.rating" disabled class="mt-1"></el-rate>
                                    <div class="text-gray-500 text-sm mt-1">{{ fosterHome.reviewCount }}条评价</div>
                                </div>

                                <div class="flex-1 md:px-8">
                                    <div v-for="item in ratingDetails" :key="item.name" class="flex items-center mb-2">
                                        <span class="w-20 text-gray-600 text-sm">{{ item.name }}</span>
                                        <el-rate v-model="item.score" disabled show-score class="flex-1"
                                            score-template="{value}"></el-rate>
                                    </div>
                                </div>

                                <div class="text-center">
                                    <button class="cute-btn" @click="showReviewModal = true">
                                        <i class="el-icon-edit mr-1"></i>写评价
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 评价标签 -->
                        <div class="mb-6">
                            <h3 class="font-semibold text-gray-700 mb-3">评价标签</h3>
                            <div class="flex flex-wrap gap-2">
                                <el-tag v-for="tag in reviewTags" :key="tag.name"
                                    :type="selectedTag === tag.name ? 'warning' : 'info'"
                                    class="rounded-full cursor-pointer"
                                    @click="selectedTag = selectedTag === tag.name ? '' : tag.name">
                                    {{ tag.name }} ({{ tag.count }})
                                </el-tag>
                            </div>
                        </div>

                        <!-- 评价列表 -->
                        <div class="space-y-6">
                            <div v-for="review in filteredReviews" :key="review.id"
                                class="border-b border-orange-100 pb-6 last:border-0">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex items-center">
                                        <img :src="review.avatar" class="w-10 h-10 rounded-full mr-3">
                                        <div>
                                            <div class="font-semibold">{{ review.userName }}</div>
                                            <div class="text-gray-500 text-sm">{{ review.petType }} · {{
                                                formatDate(review.date) }}</div>
                                        </div>
                                    </div>
                                    <el-rate v-model="review.rating" disabled size="small"></el-rate>
                                </div>

                                <p class="text-gray-700 mb-3">{{ review.content }}</p>

                                <!-- 评价图片 -->
                                <div v-if="review.images.length > 0" class="grid grid-cols-3 gap-2 mb-3">
                                    <img v-for="(img, index) in review.images" :key="index" :src="img"
                                        class="w-full h-24 object-cover rounded-lg cursor-pointer"
                                        @click="showImagePreview(review.images, index)">
                                </div>

                                <!-- 评价标签 -->
                                <div class="flex flex-wrap gap-1">
                                    <el-tag v-for="tag in review.tags" :key="tag" type="info" size="small"
                                        class="rounded-full">
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>

                        <!-- 加载更多 -->
                        <div class="text-center mt-6">
                            <button class="cute-btn bg-white text-orange-500 border border-orange-300"
                                @click="loadMoreReviews">
                                <i class="el-icon-more mr-1"></i>加载更多评价
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 右侧边栏 -->
                <div class="lg:col-span-1">
                    <!-- 空位日历 -->
                    <div class="cute-card p-6 bg-white mb-6 sticky top-6">
                        <h2 class="text-xl font-bold text-orange-500 mb-4">空位日历</h2>

                        <el-calendar v-model="calendarDate">
                            <template #date-cell="{ data }">
                                <div class="calendar-cell" :class="getDateClass(data.day)">
                                    <div class="day">{{ data.day.split('-').slice(2).join('-') }}</div>
                                    <div class="status" :class="getAvailabilityStatus(data.day)"></div>
                                </div>
                            </template>
                        </el-calendar>

                        <div class="mt-4 space-y-2">
                            <div class="flex items-center text-sm">
                                <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                <span class="text-gray-600">可预订</span>
                            </div>
                            <div class="flex items-center text-sm">
                                <div class="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                                <span class="text-gray-600">已满</span>
                            </div>
                            <div class="flex items-center text-sm">
                                <div class="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                                <span class="text-gray-600">不可预订</span>
                            </div>
                        </div>

                        <div class="mt-6 p-4 bg-orange-50 rounded-xl">
                            <div class="text-sm text-gray-600 mb-2">快速查询</div>
                            <el-date-picker v-model="quickDateRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" class="w-full"
                                :disabled-date="disabledDate"></el-date-picker>
                            <button class="cute-btn w-full mt-3" @click="checkAvailability">
                                查询空位
                            </button>
                        </div>
                    </div>

                    <!-- 联系信息 -->
                    <div class="cute-card p-6 bg-white">
                        <h2 class="text-xl font-bold text-orange-500 mb-4">联系信息</h2>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <i class="el-icon-user mr-3 text-orange-400"></i>
                                <span class="text-gray-700">联系人：{{ fosterHome.contact.name }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="el-icon-phone mr-3 text-orange-400"></i>
                                <span class="text-gray-700">{{ fosterHome.contact.phone }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="el-icon-chat-dot-round mr-3 text-orange-400"></i>
                                <span class="text-gray-700">在线咨询</span>
                            </div>
                        </div>

                        <div class="mt-4 space-y-2">
                            <button class="cute-btn w-full" @click="showContactModal = true">
                                <i class="el-icon-phone mr-1"></i>联系寄养家庭
                            </button>
                            <button class="cute-btn bg-white text-orange-500 border border-orange-300 w-full">
                                <i class="el-icon-chat-dot-round mr-1"></i>在线咨询
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 预订模态框 -->
        <el-dialog v-model="showBookingModal" title="预订寄养服务" width="500px" class="cute-dialog">
            <div class="space-y-4">
                <el-form :model="bookingForm" label-width="80px">
                    <el-form-item label="宠物类型">
                        <el-select v-model="bookingForm.petType" placeholder="选择宠物类型" class="w-full">
                            <el-option label="狗狗" value="dog"></el-option>
                            <el-option label="猫咪" value="cat"></el-option>
                            <el-option label="其他" value="other"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="寄养日期">
                        <el-date-picker v-model="bookingForm.dateRange" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" class="w-full"
                            :disabled-date="disabledDate"></el-date-picker>
                    </el-form-item>

                    <el-form-item label="服务套餐">
                        <el-radio-group v-model="bookingForm.package" class="w-full">
                            <el-radio v-for="pkg in fosterHome.servicePackages" :key="pkg.type" :label="pkg.type"
                                class="block mb-2">
                                {{ pkg.name }} - {{ pkg.price }}元/天
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="附加服务">
                        <el-checkbox-group v-model="bookingForm.additionalServices" class="w-full">
                            <el-checkbox v-for="service in fosterHome.additionalServices" :key="service.name"
                                :label="service.name" class="block mb-2">
                                {{ service.name }} - {{ service.price }}元
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="特别要求">
                        <el-input v-model="bookingForm.specialRequirements" type="textarea" :rows="3"
                            placeholder="请填写宠物的特殊需求或注意事项"></el-input>
                    </el-form-item>
                </el-form>

                <div class="bg-orange-50 rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-600">预计费用：</span>
                        <span class="text-2xl font-bold text-orange-500">{{ calculatedPrice }}元</span>
                    </div>
                    <div class="text-sm text-gray-500">最终费用以实际寄养天数为准</div>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <button class="cute-btn bg-gray-500" @click="showBookingModal = false">取消</button>
                    <button class="cute-btn ml-3" @click="confirmBooking">确认预订</button>
                </span>
            </template>
        </el-dialog>

        <!-- 评价模态框 -->
        <el-dialog v-model="showReviewModal" title="写评价" width="500px">
            <!-- 评价表单内容 -->
            <div class="text-center py-8">
                <p class="text-gray-500">评价功能开发中...</p>
            </div>
        </el-dialog>

        <!-- 联系模态框 -->
        <el-dialog v-model="showContactModal" title="联系寄养家庭" width="400px">
            <div class="text-center py-6">
                <div class="text-4xl mb-4">📞</div>
                <p class="text-lg font-semibold mb-2">{{ fosterHome.contact.name }}</p>
                <p class="text-gray-600 mb-4">{{ fosterHome.contact.phone }}</p>
                <p class="text-sm text-gray-500">请在工作时间联系（{{ fosterHome.businessHours }}）</p>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由返回
const goBack = () => {
    window.history.back()
}

// 寄养家庭数据
const fosterHome = reactive({
    id: 1,
    name: '橙子宠物乐园',
    type: '机构',
    address: '北京市东城区王府井大街123号',
    rating: 4.8,
    reviewCount: 128,
    price: 120,
    availableSpots: 3,
    maxPets: 5,
    businessHours: '09:00-21:00',
    description: '我们是一家专业的宠物寄养机构，拥有多年的宠物照顾经验。我们的环境舒适安全，工作人员都经过专业培训，致力于为每一只宠物提供最好的照顾。',
    servicePhilosophy: '以爱心和专业对待每一只宠物，让主人放心，让宠物开心。我们相信宠物也是家庭的一员，应该得到最好的关爱。',
    petTypes: ['猫', '狗'],
    images: [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
        'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400',
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
        'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400'
    ],
    certifications: [
        { type: 'identity', name: '实名认证', verified: true, icon: 'el-icon-user' },
        { type: 'environment', name: '环境认证', verified: true, icon: 'el-icon-office-building' },
        { type: 'professional', name: '专业认证', verified: true, icon: 'el-icon-medal' },
        { type: 'insurance', name: '宠物保险', verified: false, icon: 'el-icon-document' }
    ],
    servicePackages: [
        {
            type: 'daily',
            name: '日常寄养',
            price: 120,
            description: '基础寄养服务，包含日常喂养和基本照顾',
            features: ['每日两次遛狗', '定时喂食', '基础清洁', '日常互动']
        },
        {
            type: 'holiday',
            name: '节假日寄养',
            price: 180,
            description: '节假日专属服务，提供更贴心的照顾',
            features: ['增加遛狗次数', '专属玩具', '节日加餐', '视频互动']
        }
    ],
    additionalServices: [
        { name: '洗澡服务', price: 80, description: '专业宠物洗澡', icon: '🛁' },
        { name: '美容护理', price: 120, description: '修剪毛发、指甲护理', icon: '💇' },
        { name: '基础训练', price: 150, description: '基础行为训练', icon: '🎓' }
    ],
    contact: {
        name: '张小姐',
        phone: '138****5678'
    }
})

// 收藏状态
const isFavorite = ref(false)
const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
    ElMessage.success(isFavorite.value ? '已添加到收藏' : '已取消收藏')
}

// 模态框控制
const showBookingModal = ref(false)
const showReviewModal = ref(false)
const showContactModal = ref(false)

// 选择的服务
const selectedPackage = ref('daily')
const selectedServices = ref<string[]>([])

const toggleAdditionalService = (serviceName: string) => {
    const index = selectedServices.value.indexOf(serviceName)
    if (index > -1) {
        selectedServices.value.splice(index, 1)
    } else {
        selectedServices.value.push(serviceName)
    }
}

// 预订表单
const bookingForm = reactive({
    petType: '',
    dateRange: [] as Date[],
    package: 'daily',
    additionalServices: [] as string[],
    specialRequirements: ''
})

// 计算价格
const calculatedPrice = computed(() => {
    let basePrice = 0
    const selectedPkg = fosterHome.servicePackages.find(pkg => pkg.type === bookingForm.package)
    if (selectedPkg) {
        basePrice = selectedPkg.price
    }

    let additionalPrice = 0
    bookingForm.additionalServices.forEach(serviceName => {
        const service = fosterHome.additionalServices.find(s => s.name === serviceName)
        if (service) {
            additionalPrice += service.price
        }
    })

    // const days = bookingForm.dateRange?.length === 2 ?
    // Math.ceil((bookingForm.dateRange[1].getTime() - bookingForm.dateRange[0].getTime()) / (1000 * 60 * 60 * 24)) : 0

    return (basePrice + additionalPrice)
})

// 确认预订
const confirmBooking = async () => {
    if (!bookingForm.petType || bookingForm.dateRange.length !== 2) {
        ElMessage.error('请完善预订信息')
        return
    }

    try {
        await ElMessageBox.confirm('确认提交预订申请吗？', '确认预订', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })

        ElMessage.success('预订申请已提交，寄养家庭会尽快联系您确认')
        showBookingModal.value = false
        // 重置表单
        Object.assign(bookingForm, {
            petType: '',
            dateRange: [],
            package: 'daily',
            additionalServices: [],
            specialRequirements: ''
        })
    } catch {
        // 用户取消
    }
}

// 日历相关
const calendarDate = ref(new Date())
const quickDateRange = ref<Date[]>([])

const getDateClass = (date: string) => {
    const today = new Date().toISOString().split('T')[0]
    return date === today ? 'today' : ''
}

const getAvailabilityStatus = (date: string) => {
    const day = new Date(date).getDay()
    // 模拟可用性状态
    if (day === 0 || day === 6) return 'unavailable' // 周末不可用
    const random = Math.random()
    if (random > 0.7) return 'available'
    if (random > 0.4) return 'full'
    return 'unavailable'
}

const disabledDate = (time: Date) => {
    return time.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

const checkAvailability = () => {
    if (quickDateRange.value.length !== 2) {
        ElMessage.warning('请选择日期范围')
        return
    }
    ElMessage.info('正在查询空位...')
}

// 评价相关
const selectedTag = ref('')
const ratingDetails = ref([
    { name: '环境整洁', score: 4.8 },
    { name: '服务态度', score: 4.9 },
    { name: '专业程度', score: 4.7 },
    { name: '性价比', score: 4.6 }
])

const reviewTags = ref([
    { name: '环境干净', count: 45 },
    { name: '服务贴心', count: 38 },
    { name: '专业负责', count: 32 },
    { name: '性价比高', count: 28 },
    { name: '交通方便', count: 25 },
    { name: '设施齐全', count: 22 }
])

// 模拟评价数据
const reviews = ref([
    {
        id: 1,
        userName: '王小姐',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        petType: '柯基',
        rating: 5,
        content: '非常满意！工作人员很专业，每天都会发视频和照片，让我很放心。环境也很干净整洁，下次还会选择这里！',
        images: [
            'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200'
        ],
        tags: ['环境干净', '服务贴心', '专业负责'],
        date: '2024-01-15'
    },
    {
        id: 2,
        userName: '李先生',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        petType: '布偶猫',
        rating: 4,
        content: '猫咪在这里住得很开心，工作人员对猫咪很有耐心。环境舒适，价格合理，推荐！',
        images: [
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200'
        ],
        tags: ['环境干净', '性价比高'],
        date: '2024-01-12'
    }
])

const filteredReviews = computed(() => {
    if (!selectedTag.value) return reviews.value
    return reviews.value.filter(review => review.tags.includes(selectedTag.value))
})

const loadMoreReviews = () => {
    ElMessage.info('加载更多评价...')
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
}

const showImagePreview = (images: string[], index: number) => {
    // 实际项目中可以实现图片预览功能
    console.log('预览图片:', images, index)
}

// 图片预览
const activeImageIndex = ref(0)

onMounted(() => {
    // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.cute-card {
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(255, 165, 0, 0.15);
    border: 2px solid #ffd166;
    transition: all 0.3s ease;
}

.cute-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px rgba(255, 165, 0, 0.2);
}

.cute-btn {
    background: linear-gradient(135deg, #ffa500, #ff9a76);
    border: none;
    border-radius: 25px;
    color: white;
    font-weight: bold;
    padding: 10px 20px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.cute-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 165, 0, 0.4);
}

.cute-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.calendar-cell {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.calendar-cell.today .day {
    color: #ffa500;
    font-weight: bold;
}

.calendar-cell .status {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-top: 2px;
}

.calendar-cell .status.available {
    background-color: #10b981;
}

.calendar-cell .status.full {
    background-color: #ef4444;
}

.calendar-cell .status.unavailable {
    background-color: #9ca3af;
}

:deep(.el-calendar-table .el-calendar-day) {
    height: 40px;
}

:deep(.el-dialog) {
    border-radius: 20px;
    border: 2px solid #ffd166;
}

:deep(.el-dialog__header) {
    background: linear-gradient(135deg, #ffa500, #ff9a76);
    border-radius: 20px 20px 0 0;
    margin: 0;
    padding: 20px;
}

:deep(.el-dialog__title) {
    color: white;
    font-weight: bold;
}

:deep(.el-carousel__item) {
    border-radius: 12px;
    overflow: hidden;
}

:deep(.el-carousel__item img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>