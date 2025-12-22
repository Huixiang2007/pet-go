<template>
    <div id="app" class="order-page">
        <div class="order-list space-y-4">
            <div v-for="order in orderList" :key="order.orderNo"
                class="order-card bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">

                <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <!-- 订单头部 -->
                    <div
                        class="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <p class="text-gray-500 text-sm">
                                订单编号：<span class="text-gray-700">{{ order.orderNo }}</span>
                            </p>
                            <p class="text-gray-400 text-xs mt-1">{{ order.createTime }}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-medium"
                            :class="getStatusTagClass(order.orderStatusDesc)">
                            {{ order.orderStatusDesc }}
                        </span>
                    </div>

                    <!-- 商品信息 -->
                    <div class="p-2 pl-8">
                        <div class="flex items-start gap-4">
                            <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                <img :src="order.providerAvatar" alt="商品图片" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-gray-800 font-medium truncate">{{ order.fosterProviderName }}</h4>
                                <p class="text-xs text-gray-500 mt-1">
                                    {{ order.fosterProviderType }}
                                </p>

                            </div>
                        </div>
                    </div>

                    <!-- 订单底部 -->
                    <div
                        class="p-5 pl-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p class="text-gray-500 text-sm">实付款</p>
                            <p class="text-orange-500 font-bold text-lg mt-0.5">¥{{ order.totalAmount }}</p>
                        </div>

                        <div class="flex flex-wrap gap-2 self-end sm:self-auto">
                            <!-- 申请退款 -->
                            <button v-if="order.orderStatusDesc === '进行中'" size="small"
                                class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                @click="handleRefund(order)">
                                申请退款
                            </button>
                            <!-- 已退款 -->
                            <button v-if="order.orderStatusDesc === '已退款'" size="small" disabled>
                                退款成功
                            </button>
                            <!-- 待付款状态-->
                            <button v-if="order.orderStatusDesc === '待支付'" size="small"
                                class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                                立即支付
                            </button>

                            <!-- 已完成状态 -->
                            <template v-else-if="order.orderStatusDesc === '已完成'">
                                <router-link to="/customer-service"
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                                    联系客服
                                </router-link>
                                <button
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                                    去评价
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- 详情折叠面板（点击“查看详情”展开） -->
                <el-collapse v-model="activeDetailOrderNo" accordion class="border-t border-gray-100">

                    <el-collapse-item :name="order.orderNo" class="border-0">
                        <template #title>
                            <div class="pl-4 pr-4 text-end text-blue-600">
                                <span>{{ activeDetailOrderNo === order.orderNo ? '收起详情' : '查看详情' }}</span>

                            </div>
                        </template>
                        <div class="order-detail p-4 pl-8">
                            <!-- 1. 宠物信息 -->
                            <div class="detail-section mb-4">
                                <h4 class="text-base font-medium mb-3 flex items-center gap-2">
                                    <el-icon color="#f97316">
                                        <UserFilled />
                                    </el-icon>
                                    宠物信息
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">宠物名称：</span>
                                        <span class="ml-2">{{ order.petName || '未知' }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">宠物类型：</span>
                                        <span class="ml-2">{{ order.petType || '未知' }}</span>
                                    </div>
                                </div>
                                <!-- 疫苗文件 -->
                                <div class="detail-item mt-3">
                                    <span class="text-gray-500 text-sm">疫苗文件：</span>
                                    <div class="mt-2 flex gap-2 flex-wrap">
                                        <div v-for="(file, idx) in vaccineList" :key="idx"
                                            class="file-item w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                                            <img :src="file" alt="疫苗文件" class="w-full h-full object-cover">
                                        </div>
                                        <div v-if="vaccineList.length === 0" class="text-sm text-gray-400">
                                            暂无疫苗文件
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 2. 时间信息 -->
                            <div class="detail-section mb-4">
                                <h4 class="text-base font-medium mb-3 flex items-center gap-2">
                                    <el-icon color="#f97316">
                                        <Calendar />
                                    </el-icon>
                                    时间信息
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">预约时间：</span>
                                        <span class="ml-2">{{ extractDate(order.createTime) }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">付款时间：</span>
                                        <span class="ml-2">{{ order.updateTime ? extractDate(order.updateTime) : '未付款'
                                            }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">寄养日期：</span>
                                        <span class="ml-2">{{ extractDate(order.startDate) }} 至 {{
                                            extractDate(order.endDate) }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">寄养天数：</span>
                                        <span class="ml-2">{{ order.totalDays }} 天</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 3. 费用信息 -->
                            <div class="detail-section mb-4">
                                <h4 class="text-base font-medium mb-3 flex items-center gap-2">
                                    <el-icon color="#f97316">
                                        <Wallet />
                                    </el-icon>
                                    费用信息
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">基础费用：</span>
                                        <span class="ml-2">¥ {{ order.dailyPrice }} × {{ order.totalDays }} 天</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">附加服务费用：</span>
                                        <span class="ml-2">¥ {{ additionalAmount }}</span>
                                    </div>
                                    <div class="detail-item font-bold text-orange-600">
                                        <span class="text-gray-500 text-sm">总计：</span>
                                        <span class="ml-2">¥ {{ order.totalAmount }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 4. 寄养家庭信息 -->
                            <div class="detail-section">
                                <h4 class="text-base font-medium mb-3 flex items-center gap-2">
                                    <el-icon color="#f97316">
                                        <HomeFilled />
                                    </el-icon>
                                    寄养家庭信息
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">家庭名称：</span>
                                        <span class="ml-2">{{ order.fosterProviderName }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">家庭类型：</span>
                                        <span class="ml-2">{{ order.fosterProviderType }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">联系人：</span>
                                        <span class="ml-2">{{ order.providerName }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="text-gray-500 text-sm">联系电话：</span>
                                        <span class="ml-2">{{ order.providerPhone }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFosterOrderList, applyRefund, getFosterOrderDetail } from '@/api/foster-care'
import type { FosterOrderList } from '@/types/foster'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { UserFilled, Calendar, Wallet, HomeFilled } from '@element-plus/icons-vue'

dayjs.extend(utc);

const activeDetailOrderNo = ref(0)
// 订单列表
const orderList = ref<FosterOrderList[]>([])
const loading = ref(false)
const vaccineList = ref([])
const additionalAmount = ref(0)
// 获取订单列表
const fetchOrderList = async () => {
    loading.value = true
    try {
        const res = await getFosterOrderList({
            pageNum: 1,
            pageSize: 10,

        })
        if (res.code === 0) {
            orderList.value = res.data.list.map(order => ({
                ...order,

            }))
            console.log(orderList.value)
            await Promise.all(
                orderList.value.map(async (order) => {
                    try {

                        const detailRes = await getFosterOrderDetail(order.orderNo)
                        if (detailRes.code === 0) {

                            Object.assign(order, detailRes.data)
                        }
                    } catch (error) {
                        console.error(`获取订单${order.orderNo}详情失败：`, error)
                        ElMessage.warning(`订单${order.orderNo}详情加载失败`)
                    }
                })
            )
            additionalAmount.value = res.data.additionalService.reduce((total: number, item: any) => total + item.price, 0)
        } else {
            ElMessage.error(res.msg || '获取订单列表失败')
        }
    } catch (error) {
        console.error('获取订单列表失败：', error)
        ElMessage.error('获取订单列表失败，请稍后重试')
    } finally {
        loading.value = false
    }
}

// 切换详情展开/收起
// const toggleDetail = (orderNo: number) => {
//     activeDetailOrderNo.value = activeDetailOrderNo.value === orderNo ? 0 : orderNo
// }

// 格式化日期
const extractDate = (isoStr: string): string => {
    if (!isoStr) return '未知'
    return dayjs.utc(isoStr).format('YYYY-MM-DD HH:mm')
}

// 订单状态标签样式
const getStatusTagClass = (status: string) => {
    switch (status) {
        case '待付款': return 'bg-orange-100 text-orange-600';
        case '进行中': return 'bg-blue-100 text-blue-600';
        case '已退款': return 'bg-gray-100 text-gray-600';
        default: return 'bg-green-100 text-green-600';
    }
}

// 申请退款
const handleRefund = async (order: FosterOrderList) => {
    try {
        await ElMessageBox.confirm(
            '确认申请退款？退款将在1-3个工作日内处理',
            '退款确认',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        const res = await applyRefund({ orderNo: order.orderNo })
        if (res.code === 0) {
            ElMessage.success('退款申请提交成功！')
            fetchOrderList()
        } else {
            ElMessage.error(res.msg || '退款申请失败')
        }
    } catch (error) {
        if (error !== 'cancel') ElMessage.error('退款申请取消')
    }
}





// 初始化
onMounted(() => {
    fetchOrderList()
})
</script>

<style scoped lang="scss">
.order-page {
    padding: 16px;
    background-color: #f9fafb;
    min-height: 100vh;
    width: 60%;
    margin: 30px auto;
}

.order-card {
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
}

.order-header {
    .getStatusTagClass {
        border-radius: 4px;
    }
}

.order-body {
    img {
        border: 1px solid #f0f0f0;
    }
}

.order-detail {
    .detail-section {
        border-bottom: 1px solid #f3f4f6;
        padding-bottom: 12px;

        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
    }

    .detail-item {
        line-height: 1.8;
    }

    .file-item {
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.05);
        }
    }
}

:deep(.el-collapse-item__header) {
    border-bottom: none;

    &:hover {
        background-color: transparent;
    }
}

:deep(.el-collapse-item__content) {
    padding: 0;
    border-top: none;
}
</style>