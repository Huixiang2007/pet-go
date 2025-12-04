<template>
    <div class="shop-management">
        <!-- 简洁的店铺管理头部 -->
        <div class="dashboard-header">
            <div class="header-left">
                <h2 class="page-title">店铺管理中心</h2>
                <p class="page-subtitle">管理您的宠物寄养服务与经营数据</p>
            </div>
            <div class="header-right">
                <div class="quick-stats">
                    <div class="stat-badge">
                        <i class="el-icon-s-order"></i>
                        <span class="stat-text">今日订单：{{ todayOrders }}</span>
                    </div>
                    <div class="stat-badge">
                        <i class="el-icon-chat-dot-round"></i>
                        <span class="stat-text">待回复：{{ pendingReplies }}</span>
                    </div>
                    <div class="stat-badge">
                        <i class="el-icon-date"></i>
                        <span class="stat-text">进行中：{{ ongoingServices }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="main-content">
            <!-- 左侧功能区 -->
            <div class="left-panel">
                <!-- 经营概览卡片 -->
                <el-card class="overview-card" shadow="never">
                    <template #header>
                        <div class="card-header">
                            <i class="header-icon el-icon-data-line"></i>
                            <span>经营概览</span>
                            <span class="time-range">本月数据</span>
                        </div>
                    </template>

                    <div class="overview-content">
                        <!-- 主要指标 -->
                        <div class="main-metrics">
                            <div class="metric-item">
                                <div class="metric-label">总收入</div>
                                <div class="metric-value">¥{{ formatNumber(totalIncome) }}</div>
                                <div class="metric-change positive">
                                    <i class="el-icon-top"></i> {{ incomeChange }}%
                                </div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-label">总订单</div>
                                <div class="metric-value">{{ totalOrders }}</div>
                                <div class="metric-change positive">
                                    <i class="el-icon-top"></i> {{ ordersChange }}%
                                </div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-label">完成率</div>
                                <div class="metric-value">{{ completionRate }}%</div>
                                <div class="metric-change">
                                    <i class="el-icon-bottom"></i> 2%
                                </div>
                            </div>
                        </div>

                        <!-- 图表区域 -->
                        <div class="chart-area">
                            <div class="chart-header">
                                <span>近7天收入趋势</span>
                                <el-select v-model="chartType" size="small" style="width: 120px">
                                    <el-option label="日收入" value="daily"></el-option>
                                    <el-option label="周收入" value="weekly"></el-option>
                                    <el-option label="月收入" value="monthly"></el-option>
                                </el-select>
                            </div>
                            <div class="chart-container">
                                <!-- 这里可以放置图表组件，暂时用模拟数据展示 -->
                                <div class="simple-chart">
                                    <div class="chart-bars">
                                        <div v-for="(item, index) in incomeData" :key="index" class="chart-bar">
                                            <div class="bar-value">{{ item.value }}</div>
                                            <div class="bar" :style="{ height: item.height + '%' }"
                                                :class="{ 'active-bar': item.active }">
                                            </div>
                                            <div class="bar-label">{{ item.label }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>

                <!-- 快捷操作卡片 -->
                <el-card class="quick-actions-card" shadow="never">
                    <template #header>
                        <div class="card-header">
                            <i class="header-icon el-icon-menu"></i>
                            <span>快捷操作</span>
                        </div>
                    </template>
                    <div class="action-grid">
                        <div class="action-item" @click="showAddPackageDialog">
                            <div class="action-icon add">
                                <i class="el-icon-circle-plus"></i>
                            </div>
                            <span class="action-text">添加套餐</span>
                        </div>
                        <div class="action-item" @click="showEditShopDialog">
                            <div class="action-icon edit">
                                <i class="el-icon-edit"></i>
                            </div>
                            <span class="action-text">店铺设置</span>
                        </div>
                        <div class="action-item" @click="goToBookings">
                            <div class="action-icon calendar">
                                <i class="el-icon-date"></i>
                            </div>
                            <span class="action-text">预约管理</span>
                        </div>
                        <div class="action-item" @click="goToReviews">
                            <div class="action-icon message">
                                <i class="el-icon-chat-line-square"></i>
                            </div>
                            <span class="action-text">评价管理</span>
                        </div>
                        <div class="action-item" @click="exportData">
                            <div class="action-icon export">
                                <i class="el-icon-download"></i>
                            </div>
                            <span class="action-text">导出数据</span>
                        </div>
                        <div class="action-item" @click="viewAnalytics">
                            <div class="action-icon analytics">
                                <i class="el-icon-data-analysis"></i>
                            </div>
                            <span class="action-text">数据分析</span>
                        </div>
                    </div>
                </el-card>

                <!-- 最近活动 -->
                <el-card class="recent-activity" shadow="never">
                    <template #header>
                        <div class="card-header">
                            <i class="header-icon el-icon-alarm-clock"></i>
                            <span>最近活动</span>
                        </div>
                    </template>
                    <div class="activity-list">
                        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                            <div class="activity-icon" :class="activity.type">
                                <i :class="activity.icon"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-text">{{ activity.text }}</div>
                                <div class="activity-time">{{ activity.time }}</div>
                            </div>
                            <el-tag size="small" :type="activity.tagType">{{ activity.tag }}</el-tag>
                        </div>
                    </div>
                </el-card>
            </div>

            <!-- 右侧套餐管理 -->
            <div class="right-panel">
                <!-- 套餐管理卡片 -->
                <el-card class="packages-card" shadow="never">
                    <template #header>
                        <div class="card-header-with-actions">
                            <div class="header-left">
                                <i class="header-icon el-icon-s-goods"></i>
                                <span>服务套餐管理</span>
                                <el-tag size="small" class="count-tag">{{ packages.length }}个套餐</el-tag>
                            </div>
                            <div class="header-right">
                                <el-button type="primary" size="small" @click="showAddPackageDialog">
                                    <i class="el-icon-circle-plus"></i>新增套餐
                                </el-button>
                                <el-button size="small" @click="batchManage">
                                    <i class="el-icon-set-up"></i>批量管理
                                </el-button>
                            </div>
                        </div>
                    </template>

                    <!-- 套餐列表 -->
                    <div class="packages-grid">
                        <el-card v-for="pkg in packages" :key="pkg.id" class="package-card" shadow="hover">
                            <!-- 套餐状态标签 -->
                            <div class="package-status" :class="{ 'status-active': pkg.status === 'active' }">
                                {{ pkg.status === 'active' ? '上架中' : '已下架' }}
                            </div>

                            <div class="package-header">
                                <div class="package-title-section">
                                    <h3 class="package-title">{{ pkg.name }}</h3>
                                    <el-rate v-model="pkg.rating" disabled show-score text-color="#ff9900"
                                        score-template="{value}" size="small" />
                                </div>
                                <div class="package-actions">
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-more"></i>
                                        </span>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item @click="editPackage(pkg)">
                                                    <i class="el-icon-edit"></i>编辑套餐
                                                </el-dropdown-item>
                                                <el-dropdown-item @click="togglePackageStatus(pkg)"
                                                    :class="{ 'warning-text': pkg.status === 'active' }">
                                                    <i class="el-icon-switch-button"></i>
                                                    {{ pkg.status === 'active' ? '下架套餐' : '上架套餐' }}
                                                </el-dropdown-item>
                                                <el-dropdown-item @click="viewPackageStats(pkg)">
                                                    <i class="el-icon-data-line"></i>查看数据
                                                </el-dropdown-item>
                                                <el-dropdown-item @click="deletePackage(pkg.id)" divided
                                                    class="danger-text">
                                                    <i class="el-icon-delete"></i>删除套餐
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </div>
                            </div>

                            <p class="package-desc">{{ pkg.description }}</p>

                            <!-- 宠物类型标签 -->
                            <div class="package-tags">
                                <el-tag v-for="pet in pkg.petTypes" :key="pet" size="small" class="pet-tag">
                                    <i class="el-icon-sunny"></i>{{ pet }}
                                </el-tag>
                            </div>

                            <!-- 套餐特色 -->
                            <div class="package-features">
                                <div class="features-title">套餐包含：</div>
                                <ul class="features-list">
                                    <li v-for="(feature, index) in pkg.features" :key="index">
                                        <i class="el-icon-check"></i>{{ feature }}
                                    </li>
                                </ul>
                            </div>

                            <!-- 套餐信息 -->
                            <div class="package-info">
                                <div class="info-item">
                                    <i class="el-icon-time"></i>
                                    <span>{{ pkg.serviceTime }}</span>
                                </div>
                                <div class="info-item">
                                    <i class="el-icon-sold-out"></i>
                                    <span>已售{{ pkg.soldCount }}</span>
                                </div>
                                <div class="info-item">
                                    <i class="el-icon-user"></i>
                                    <span>剩余{{ pkg.quota }}名额</span>
                                </div>
                            </div>

                            <!-- 价格和操作 -->
                            <div class="package-footer">
                                <div class="price-section">
                                    <div class="price-main">¥{{ pkg.price }}/天</div>
                                    <div class="price-original" v-if="pkg.originalPrice">
                                        ¥{{ pkg.originalPrice }}/天
                                    </div>
                                </div>
                                <div class="action-buttons">
                                    <el-button size="small" @click="viewPackageDetails(pkg)" class="detail-btn">
                                        查看详情
                                    </el-button>
                                    <el-button type="primary" size="small" @click="editPackage(pkg)" class="edit-btn">
                                        <i class="el-icon-edit"></i>编辑
                                    </el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-card>
            </div>
        </div>

        <!-- 添加/编辑套餐对话框 -->
        <el-dialog :title="dialogTitle" v-model="packageDialogVisible" width="600px" class="package-dialog">
            <el-form :model="packageForm" :rules="packageRules" ref="packageFormRef" label-width="100px">
                <el-tabs v-model="activeTab">
                    <!-- 基本信息 -->
                    <el-tab-pane label="基本信息" name="basic">
                        <el-form-item label="套餐名称" prop="name">
                            <el-input v-model="packageForm.name" placeholder="请输入套餐名称，如：基础营养套餐" maxlength="20"
                                show-word-limit />
                        </el-form-item>
                        <el-form-item label="套餐描述" prop="description">
                            <el-input v-model="packageForm.description" type="textarea" :rows="2" placeholder="简要描述套餐特点"
                                maxlength="100" show-word-limit />
                        </el-form-item>
                        <el-form-item label="服务时长" prop="serviceTime">
                            <el-input v-model="packageForm.serviceTime" placeholder="如：24小时照顾" />
                        </el-form-item>
                        <el-form-item label="宠物类型" prop="petTypes">
                            <el-select v-model="packageForm.petTypes" multiple placeholder="请选择适合的宠物类型"
                                style="width: 100%">
                                <el-option v-for="item in petTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 价格与名额 -->
                    <el-tab-pane label="价格设置" name="price">
                        <el-form-item label="价格（元/天）" prop="price">
                            <el-input-number v-model="packageForm.price" :min="0" :step="10" controls-position="right"
                                style="width: 200px" />
                            <span class="form-tip">建议定价在80-300元之间</span>
                        </el-form-item>
                        <el-form-item label="原价（可选）">
                            <el-input-number v-model="packageForm.originalPrice" :min="0" :step="10"
                                controls-position="right" style="width: 200px" />
                            <span class="form-tip">设置原价可显示折扣</span>
                        </el-form-item>
                        <el-form-item label="名额限制" prop="quota">
                            <el-input-number v-model="packageForm.quota" :min="1" :max="100" controls-position="right"
                                style="width: 200px" />
                            <span class="form-tip">同时可服务的最大宠物数量</span>
                        </el-form-item>
                        <el-form-item label="上架状态">
                            <el-switch v-model="packageForm.status" active-value="active" inactive-value="inactive"
                                active-text="立即上架" inactive-text="暂不上架" />
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 服务内容 -->
                    <el-tab-pane label="服务内容" name="features">
                        <el-form-item label="服务特色" prop="features">
                            <div class="features-editor">
                                <div class="features-list">
                                    <div v-for="(feature, index) in packageForm.features" :key="index"
                                        class="feature-item">
                                        <el-input v-model="packageForm.features[index]" placeholder="请输入服务内容"
                                            style="width: 80%; margin-right: 10px;" />
                                        <el-button type="danger" size="small" circle @click="removeFeature(index)"
                                            :disabled="packageForm.features.length <= 1">
                                            <i class="el-icon-minus"></i>
                                        </el-button>
                                    </div>
                                </div>
                                <el-button type="primary" plain @click="addFeature" class="add-feature-btn">
                                    <i class="el-icon-plus"></i>添加服务项
                                </el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="注意事项">
                            <el-input v-model="packageForm.notes" type="textarea" :rows="3" placeholder="可填写服务限制、特殊要求等"
                                maxlength="200" show-word-limit />
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="packageDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="savePackage" class="save-btn" :loading="saving">
                        {{ isEditing ? '保存修改' : '创建套餐' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑店铺信息对话框 -->
        <el-dialog title="店铺信息设置" v-model="shopDialogVisible" width="500px" class="shop-dialog">
            <el-form :model="shopForm" :rules="shopRules" ref="shopFormRef" label-width="100px">
                <el-form-item label="店铺名称" prop="name">
                    <el-input v-model="shopForm.name" placeholder="请输入店铺名称" />
                </el-form-item>
                <el-form-item label="店铺描述" prop="description">
                    <el-input v-model="shopForm.description" type="textarea" :rows="3" placeholder="简要描述您的店铺特色" />
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="shopForm.contact" placeholder="请输入联系电话或微信" />
                </el-form-item>
                <el-form-item label="营业时间" prop="businessHours">
                    <el-time-picker v-model="shopForm.businessHours" is-range range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择营业时间" style="width: 100%" />
                </el-form-item>
                <el-form-item label="服务地址" prop="address">
                    <el-input v-model="shopForm.address" placeholder="请输入详细地址" />
                </el-form-item>
                <el-form-item label="店铺封面">
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false"
                        :on-change="handleAvatarChange" :auto-upload="false">
                        <img v-if="shopForm.coverImage" :src="shopForm.coverImage" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="特色标签">
                    <el-select v-model="shopForm.tags" multiple placeholder="选择店铺特色标签" style="width: 100%">
                        <el-option v-for="tag in shopTagOptions" :key="tag" :label="tag" :value="tag" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="shopDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveShopInfo" :loading="savingShop">保存设置</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 头部统计数据
const todayOrders = ref(8)
const pendingReplies = ref(3)
const ongoingServices = ref(12)

// 经营数据
const totalIncome = ref(28740)
const totalOrders = ref(156)
const completionRate = ref(98)
const incomeChange = ref(12.5)
const ordersChange = ref(8.2)
const chartType = ref('daily')

// 模拟收入数据
const incomeData = ref([
    { label: '周一', value: '¥1200', height: 60, active: false },
    { label: '周二', value: '¥1800', height: 90, active: false },
    { label: '周三', value: '¥2100', height: 100, active: true },
    { label: '周四', value: '¥1600', height: 80, active: false },
    { label: '周五', value: '¥1900', height: 95, active: false },
    { label: '周六', value: '¥2400', height: 120, active: false },
    { label: '周日', value: '¥2000', height: 100, active: false },
])

// 最近活动
const recentActivities = ref([
    { id: 1, type: 'order', icon: 'el-icon-s-order', text: '新订单：张小姐预订了基础营养套餐', time: '10分钟前', tag: '待确认', tagType: 'warning' },
    { id: 2, type: 'review', icon: 'el-icon-chat-line-round', text: '收到新评价：★★★★★', time: '30分钟前', tag: '已回复', tagType: 'success' },
    { id: 3, type: 'package', icon: 'el-icon-s-goods', text: '豪华呵护套餐售出1单', time: '1小时前', tag: '已完成', tagType: 'success' },
    { id: 4, type: 'message', icon: 'el-icon-message', text: '新咨询：关于宠物特殊饮食需求', time: '2小时前', tag: '待回复', tagType: 'warning' },
])

// 宠物类型选项
const petTypeOptions = [
    { value: '猫', label: '猫' },
    { value: '狗', label: '狗' },
    { value: '鱼', label: '鱼' },
    { value: '鸟', label: '鸟' },
    { value: '兔', label: '兔' },
    { value: '蛇', label: '蛇' },
    { value: '其他', label: '其他' },
]

// 店铺标签选项
const shopTagOptions = [
    '24小时照顾', '专业宠物医生', '环境优美', '交通便利',
    '免费接送', '实时监控', '个性定制', '经验丰富'
]

// 套餐数据
const packages = ref([
    {
        id: 1,
        name: '基础营养套餐',
        description: '适合短期营养的基础服务',
        features: ['每日两次邀约', '定时喂食', '基础清洁', '日常互动', '定期照片反馈'],
        petTypes: ['猫', '狗'],
        serviceTime: '24小时照顾',
        price: 120,
        originalPrice: 150,
        quota: 3,
        soldCount: 42,
        rating: 4.8,
        status: 'active',
        notes: ''
    },
    {
        id: 2,
        name: '豪华呵护套餐',
        description: '为爱宠提供全方位贴心照顾',
        features: ['全天候看护', '定制饮食', '每日梳毛', '专业训练', '视频连线'],
        petTypes: ['猫', '狗', '兔'],
        serviceTime: '24小时精心照顾',
        price: 200,
        originalPrice: 250,
        quota: 5,
        soldCount: 28,
        rating: 4.9,
        status: 'active',
        notes: '需提前3天预约'
    },
    {
        id: 3,
        name: '小型宠物专享',
        description: '专为小型宠物设计的舒适空间',
        features: ['独立空间', '特殊饮食照顾', '温度调控', '安静环境'],
        petTypes: ['兔', '鸟', '其他'],
        serviceTime: '24小时专业照顾',
        price: 80,
        quota: 8,
        soldCount: 15,
        rating: 4.7,
        status: 'inactive',
        notes: '仅限2kg以下小型宠物'
    }
])

// 套餐对话框
const packageDialogVisible = ref(false)
const isEditing = ref(false)
const editingPackageId = ref<number | null>(null)
const activeTab = ref('basic')
const saving = ref(false)
const packageFormRef = ref()

const dialogTitle = computed(() => isEditing.value ? '编辑套餐' : '添加新套餐')

const packageForm = reactive({
    name: '',
    description: '',
    serviceTime: '24小时照顾',
    price: 120,
    originalPrice: 0,
    quota: 5,
    petTypes: [] as string[],
    features: ['每日两次邀约', '定时喂食', '基础清洁'],
    notes: '',
    status: 'active'
})

const packageRules = {
    name: [
        { required: true, message: '请输入套餐名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入套餐描述', trigger: 'blur' },
        { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
    ],
    serviceTime: [
        { required: true, message: '请输入服务时长', trigger: 'blur' }
    ],
    petTypes: [
        { required: true, message: '请至少选择一种宠物类型', trigger: 'change' }
    ],
    price: [
        { required: true, message: '请设置价格', trigger: 'blur' },
        { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' }
    ],
    quota: [
        { required: true, message: '请设置名额限制', trigger: 'blur' },
        { type: 'number', min: 1, max: 100, message: '名额限制在1-100之间', trigger: 'blur' }
    ]
}

// 店铺对话框
const shopDialogVisible = ref(false)
const savingShop = ref(false)
const shopFormRef = ref()

const shopForm = reactive({
    name: '温馨宠物寄养',
    description: '提供专业、贴心的宠物寄养服务，让您的爱宠享受家的温暖',
    contact: '13800138000',
    businessHours: [new Date(2024, 0, 1, 8, 0, 0), new Date(2024, 0, 1, 22, 0, 0)],
    address: 'XX市XX区XX街道XX号',
    coverImage: '',
    tags: ['24小时照顾', '环境优美', '经验丰富']
})

const shopRules = {
    name: [
        { required: true, message: '请输入店铺名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入店铺描述', trigger: 'blur' }
    ],
    contact: [
        { required: true, message: '请输入联系方式', trigger: 'blur' }
    ],
    businessHours: [
        { required: true, message: '请选择营业时间', trigger: 'change' }
    ],
    address: [
        { required: true, message: '请输入服务地址', trigger: 'blur' }
    ]
}

// 显示添加套餐对话框
const showAddPackageDialog = () => {
    isEditing.value = false
    editingPackageId.value = null
    activeTab.value = 'basic'
    resetPackageForm()

    if (packageFormRef.value) {
        packageFormRef.value.clearValidate()
    }

    packageDialogVisible.value = true
}

// 编辑套餐
const editPackage = (pkg: any) => {
    isEditing.value = true
    editingPackageId.value = pkg.id
    activeTab.value = 'basic'

    packageForm.name = pkg.name
    packageForm.description = pkg.description
    packageForm.serviceTime = pkg.serviceTime
    packageForm.price = pkg.price
    packageForm.originalPrice = pkg.originalPrice || 0
    packageForm.quota = pkg.quota
    packageForm.petTypes = [...pkg.petTypes]
    packageForm.features = [...pkg.features]
    packageForm.notes = pkg.notes || ''
    packageForm.status = pkg.status

    if (packageFormRef.value) {
        packageFormRef.value.clearValidate()
    }

    packageDialogVisible.value = true
}

// 删除套餐
const deletePackage = (id: number) => {
    ElMessageBox.confirm('确定要删除这个套餐吗？删除后不可恢复。', '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
    }).then(() => {
        packages.value = packages.value.filter(pkg => pkg.id !== id)
        ElMessage.success('套餐删除成功')
    }).catch(() => {
        // 用户取消删除
    })
}

// 切换套餐状态
const togglePackageStatus = (pkg: any) => {
    const newStatus = pkg.status === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? '上架' : '下架'

    ElMessageBox.confirm(`确定要${action}这个套餐吗？`, `${action}确认`, {
        confirmButtonText: `确定${action}`,
        cancelButtonText: '取消',
        type: 'info'
    }).then(() => {
        pkg.status = newStatus
        ElMessage.success(`套餐已${action}`)
    })
}

// 重置套餐表单
const resetPackageForm = () => {
    packageForm.name = ''
    packageForm.description = ''
    packageForm.serviceTime = '24小时照顾'
    packageForm.price = 120
    packageForm.originalPrice = 0
    packageForm.quota = 5
    packageForm.petTypes = []
    packageForm.features = ['每日两次邀约', '定时喂食', '基础清洁']
    packageForm.notes = ''
    packageForm.status = 'active'
}

// 添加服务项
const addFeature = () => {
    packageForm.features.push('')
}

// 删除服务项
const removeFeature = (index: number) => {
    if (packageForm.features.length > 1) {
        packageForm.features.splice(index, 1)
    }
}

// 保存套餐
const savePackage = async () => {
    if (!packageFormRef.value) return

    try {
        await packageFormRef.value.validate()
        saving.value = true

        // 模拟保存操作
        setTimeout(() => {
            const features = packageForm.features.filter(f => f.trim())

            const newPackage = {
                id: isEditing.value ? editingPackageId.value! : packages.value.length + 1,
                name: packageForm.name,
                description: packageForm.description,
                features: features,
                petTypes: packageForm.petTypes,
                serviceTime: packageForm.serviceTime,
                price: packageForm.price,
                originalPrice: packageForm.originalPrice > 0 ? packageForm.originalPrice : undefined,
                quota: packageForm.quota,
                soldCount: isEditing.value ? packages.value.find(p => p.id === editingPackageId.value)?.soldCount || 0 : 0,
                rating: isEditing.value ? packages.value.find(p => p.id === editingPackageId.value)?.rating || 4.5 : 4.5,
                status: packageForm.status,
                notes: packageForm.notes
            }

            if (isEditing.value) {
                const index = packages.value.findIndex(p => p.id === editingPackageId.value)
                if (index !== -1) {
                    packages.value[index] = newPackage
                }
            } else {
                packages.value.push(newPackage)
            }

            packageDialogVisible.value = false
            ElMessage.success(isEditing.value ? '套餐修改成功' : '套餐创建成功')
            saving.value = false
        }, 500)

    } catch (error) {
        saving.value = false
    }
}

// 显示编辑店铺对话框
const showEditShopDialog = () => {
    shopDialogVisible.value = true
}

// 处理封面图片上传
const handleAvatarChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        shopForm.coverImage = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
}

// 保存店铺信息
const saveShopInfo = async () => {
    if (!shopFormRef.value) return

    try {
        await shopFormRef.value.validate()
        savingShop.value = true

        // 模拟保存操作
        setTimeout(() => {
            ElMessage.success('店铺信息保存成功')
            shopDialogVisible.value = false
            savingShop.value = false
        }, 500)

    } catch (error) {
        savingShop.value = false
    }
}

// 其他功能
const goToBookings = () => {
    ElMessage.info('跳转到预约管理页面')
}

const goToReviews = () => {
    ElMessage.info('跳转到评价管理页面')
}

const exportData = () => {
    ElMessage.success('数据导出功能开发中')
}

const viewAnalytics = () => {
    ElMessage.info('跳转到数据分析页面')
}

const viewPackageDetails = (pkg: any) => {
    ElMessage.info(`查看套餐详情：${pkg.name}`)
}

const batchManage = () => {
    ElMessage.info('批量管理功能开发中')
}

const viewPackageStats = (pkg: any) => {
    ElMessage.info(`查看套餐数据：${pkg.name}`)
}

// 工具函数
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

onMounted(() => {
    // 初始化数据
    console.log('店铺管理页面加载完成')
})
</script>

<style lang="scss" scoped>
.shop-management {
    padding: 20px;
    background: linear-gradient(135deg, #f9f7ff 0%, #f0ebff 100%);
    min-height: 100vh;
}

// 简洁头部样式
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding: 0 8px;

    .header-left {
        .page-title {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
            color: #5a4fcf;
        }

        .page-subtitle {
            margin: 0;
            font-size: 14px;
            color: #8a7fd9;
        }
    }

    .header-right {
        .quick-stats {
            display: flex;
            gap: 16px;

            .stat-badge {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e8e4ff;
                box-shadow: 0 2px 8px rgba(123, 95, 255, 0.1);

                i {
                    color: #7b5fff;
                    font-size: 16px;
                }

                .stat-text {
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }
            }
        }
    }
}

// 主要内容区域
.main-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
}

// 卡片通用样式
.el-card {
    border: none;
    border-radius: 12px;
    margin-bottom: 20px;
    background: white;

    :deep(.el-card__header) {
        border-bottom: 1px solid #f0f0ff;
        padding: 16px 20px;
        background: transparent;
    }

    .card-header {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #5a4fcf;

        .header-icon {
            margin-right: 10px;
            font-size: 18px;
            color: #7b5fff;
        }

        .time-range {
            margin-left: auto;
            font-size: 12px;
            color: #a99eff;
            font-weight: normal;
        }
    }

    .card-header-with-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;

            .count-tag {
                background: #f0ebff;
                border-color: #d9d1ff;
                color: #7b5fff;
            }
        }
    }
}

// 经营概览卡片
.overview-card {
    .overview-content {
        .main-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;

            .metric-item {
                padding: 20px;
                background: linear-gradient(135deg, #f5f3ff 0%, #e8e4ff 100%);
                border-radius: 10px;
                text-align: center;

                .metric-label {
                    font-size: 14px;
                    color: #8a7fd9;
                    margin-bottom: 8px;
                }

                .metric-value {
                    font-size: 28px;
                    font-weight: 700;
                    color: #5a4fcf;
                    margin-bottom: 8px;
                }

                .metric-change {
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;

                    &.positive {
                        color: #52c41a;
                    }

                    i {
                        font-size: 10px;
                    }
                }
            }
        }

        .chart-area {
            .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f0f0ff;

                span {
                    font-weight: 600;
                    color: #5a4fcf;
                }
            }

            .chart-container {
                height: 200px;

                .simple-chart {
                    height: 100%;
                    padding: 20px 0;

                    .chart-bars {
                        display: flex;
                        justify-content: space-around;
                        align-items: flex-end;
                        height: 100%;

                        .chart-bar {
                            text-align: center;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: flex-end;
                            height: 100%;

                            .bar-value {
                                font-size: 12px;
                                color: #8a7fd9;
                                margin-bottom: 8px;
                            }

                            .bar {
                                width: 30px;
                                background: linear-gradient(to top, #9b7bff 0%, #c9bfff 100%);
                                border-radius: 4px 4px 0 0;
                                transition: height 0.3s ease;

                                &.active-bar {
                                    background: linear-gradient(to top, #7b5fff 0%, #a99eff 100%);
                                }
                            }

                            .bar-label {
                                margin-top: 8px;
                                font-size: 12px;
                                color: #a99eff;
                            }
                        }
                    }
                }
            }
        }
    }
}

// 快捷操作卡片
.quick-actions-card {
    .action-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;

        .action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background: #f9f7ff;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2px);
                background: linear-gradient(135deg, #9b7bff 0%, #7b5fff 100%);
                box-shadow: 0 4px 12px rgba(123, 95, 255, 0.2);

                .action-icon {
                    background: white;

                    i {
                        color: #7b5fff;
                    }
                }

                .action-text {
                    color: white;
                }
            }

            .action-icon {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
                font-size: 24px;

                &.add {
                    background: #e6f7ff;

                    i {
                        color: #1890ff;
                    }
                }

                &.edit {
                    background: #f6ffed;

                    i {
                        color: #52c41a;
                    }
                }

                &.calendar {
                    background: #fff7e6;

                    i {
                        color: #fa8c16;
                    }
                }

                &.message {
                    background: #f9f0ff;

                    i {
                        color: #722ed1;
                    }
                }

                &.export {
                    background: #e6fffb;

                    i {
                        color: #13c2c2;
                    }
                }

                &.analytics {
                    background: #fff0f6;

                    i {
                        color: #eb2f96;
                    }
                }
            }

            .action-text {
                font-size: 14px;
                font-weight: 500;
                color: #5a4fcf;
            }
        }
    }
}

// 最近活动
.recent-activity {
    .activity-list {
        .activity-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0ff;

            &:last-child {
                border-bottom: none;
            }

            .activity-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                font-size: 16px;

                &.order {
                    background: #e6f7ff;
                    color: #1890ff;
                }

                &.review {
                    background: #f6ffed;
                    color: #52c41a;
                }

                &.package {
                    background: #fff7e6;
                    color: #fa8c16;
                }

                &.message {
                    background: #f9f0ff;
                    color: #722ed1;
                }
            }

            .activity-content {
                flex: 1;

                .activity-text {
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 4px;
                }

                .activity-time {
                    font-size: 12px;
                    color: #a99eff;
                }
            }
        }
    }
}

// 套餐卡片
.packages-card {
    .packages-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .package-card {
        position: relative;
        border: 1px solid #e8e4ff;
        transition: all 0.3s ease;
        background: white;

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(123, 95, 255, 0.15);
            border-color: #c9bfff;
        }

        :deep(.el-card__body) {
            padding: 20px;
        }

        .package-status {
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 2px 8px;
            background: #f0f0ff;
            color: #8a7fd9;
            font-size: 12px;
            border-radius: 4px;

            &.status-active {
                background: #f6ffed;
                color: #52c41a;
            }
        }

        .package-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;

            .package-title-section {
                flex: 1;

                .package-title {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    color: #5a4fcf;
                }
            }

            .package-actions {
                .el-dropdown-link {
                    cursor: pointer;
                    color: #a99eff;
                    font-size: 18px;

                    &:hover {
                        color: #7b5fff;
                    }
                }
            }
        }

        .package-desc {
            margin: 0 0 16px 0;
            color: #8a7fd9;
            font-size: 14px;
            line-height: 1.5;
        }

        .package-tags {
            margin-bottom: 16px;

            .pet-tag {
                margin-right: 8px;
                margin-bottom: 8px;
                background: #f0ebff;
                border-color: #d9d1ff;
                color: #7b5fff;

                i {
                    margin-right: 4px;
                    font-size: 12px;
                }
            }
        }

        .package-features {
            margin-bottom: 20px;

            .features-title {
                font-size: 14px;
                color: #5a4fcf;
                font-weight: 500;
                margin-bottom: 8px;
            }

            .features-list {
                margin: 0;
                padding-left: 20px;

                li {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 4px;
                    line-height: 1.5;

                    i {
                        color: #7b5fff;
                        margin-right: 6px;
                        font-size: 12px;
                    }
                }
            }
        }

        .package-info {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-top: 1px solid #f0f0ff;
            border-bottom: 1px solid #f0f0ff;
            margin-bottom: 16px;

            .info-item {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: #a99eff;

                i {
                    margin-right: 4px;
                    font-size: 12px;
                }
            }
        }

        .package-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price-section {
                .price-main {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ff6b9d;
                }

                .price-original {
                    font-size: 14px;
                    color: #a99eff;
                    text-decoration: line-through;
                }
            }

            .action-buttons {
                display: flex;
                gap: 8px;

                .detail-btn {
                    border-color: #e8e4ff;
                    color: #5a4fcf;
                }

                .edit-btn {
                    background: linear-gradient(135deg, #9b7bff 0%, #7b5fff 100%);
                    border: none;
                    color: white;
                }
            }
        }
    }
}

// 对话框样式
.package-dialog,
.shop-dialog {
    :deep(.el-dialog__header) {
        background: linear-gradient(135deg, #f9f7ff 0%, #e8e4ff 100%);
        border-radius: 12px 12px 0 0;
        padding: 20px;

        .el-dialog__title {
            color: #5a4fcf;
            font-weight: 600;
        }
    }

    :deep(.el-dialog__body) {
        padding: 20px;
    }

    :deep(.el-tabs__header) {
        margin-bottom: 20px;
    }

    :deep(.el-tabs__item) {
        color: #8a7fd9;

        &.is-active {
            color: #7b5fff;
        }
    }

    :deep(.el-tabs__active-bar) {
        background-color: #7b5fff;
    }

    :deep(.el-form-item__label) {
        color: #5a4fcf;
        font-weight: 500;
    }

    .form-tip {
        margin-left: 12px;
        font-size: 12px;
        color: #a99eff;
    }

    .features-editor {
        .features-list {
            margin-bottom: 16px;

            .feature-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
        }

        .add-feature-btn {
            width: 100%;
            border: 1px dashed #d9d1ff;
            color: #7b5fff;

            &:hover {
                border-color: #7b5fff;
                background: #f9f7ff;
            }
        }
    }

    .avatar-uploader {
        :deep(.el-upload) {
            border: 1px dashed #d9d1ff;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: border-color 0.3s ease;

            &:hover {
                border-color: #7b5fff;
            }
        }

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c8c8c;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }

        .avatar {
            width: 178px;
            height: 178px;
            display: block;
            object-fit: cover;
        }
    }

    .save-btn {
        background: linear-gradient(135deg, #9b7bff 0%, #7b5fff 100%);
        border: none;

        &:hover {
            opacity: 0.9;
        }
    }
}

// 下拉菜单样式
:deep(.el-dropdown-menu) {
    border: 1px solid #e8e4ff;
    box-shadow: 0 4px 12px rgba(123, 95, 255, 0.15);

    .el-dropdown-menu__item {
        color: #5a4fcf;

        &:hover {
            background-color: #f9f7ff;
        }

        &.warning-text {
            color: #fa8c16;
        }

        &.danger-text {
            color: #ff4d4f;
        }

        i {
            margin-right: 8px;
        }
    }
}

// 响应式设计
@media (max-width: 1200px) {
    .main-content {
        grid-template-columns: 1fr;
    }

    .packages-card .packages-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        gap: 16px;

        .quick-stats {
            width: 100%;
            flex-wrap: wrap;
        }
    }

    .overview-card .overview-content .main-metrics {
        grid-template-columns: 1fr;
    }

    .quick-actions-card .action-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .packages-card .packages-grid {
        grid-template-columns: 1fr;
    }

    .package-card .package-footer {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
}
</style>