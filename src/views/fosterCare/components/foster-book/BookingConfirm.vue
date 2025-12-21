<!-- src/components/foster/BookingStep3Confirm.vue -->
<template>
    <el-card shadow="hover" class="info-card">
        <template #header>
            <div class="card-header">
                <h3>确认订单信息</h3>
            </div>
        </template>

        <div class="confirm-info">
            <!-- 宠物信息 -->
            <div class="info-group">
                <h4>
                    <el-icon color="#409eff">
                        <User />
                    </el-icon>
                    宠物信息
                </h4>
                <div class="info-item">
                    <span class="label">宠物名称：</span>
                    <span class="value">{{ bookingForm.petName || '未知' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">宠物类型：</span>
                    <span class="value">{{ bookingForm.petType || '未知' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">联系电话：</span>
                    <span class="value">{{ bookingForm.emergencyPhone || '无' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">备注：</span>
                    <span class="value">{{ bookingForm.specialRequirements || '无' }}</span>
                </div>
                <div class="info-item info-item-files">
                    <div class="flex justify-between">
                        <span class="label">疫苗文件：</span>
                        <span class="value">{{ bookingForm.pictureUrlList.length }} 个文件</span>
                    </div>
                    <div class="vaccineFilesList">
                        <div v-for="(file, index) in bookingForm.pictureUrlList" :key="index" class="file-item">
                            <img :src="file.previewUrl" alt="预览图" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 附加服务信息 -->
            <div class="info-group">
                <h4>
                    <el-icon color="#409eff">
                        <Service />
                    </el-icon>
                    附加服务
                </h4>
                <div v-if="bookingForm.additionalServiceId.length === 0" class="info-item">
                    <span class="value">未选择附加服务</span>
                </div>
                <div v-else class="info-item">
                    <div class="additional-services-list">
                        <div v-for="id in bookingForm.additionalServiceId" :key="id" class="additional-service-item">
                            <span class="service-name">{{bookingForm.additionalServices.find(s => s.id ===
                                id).title}}</span>
                            <span class="service-price">¥{{bookingForm.additionalServices.find(s => s.id ===
                                id).price}}</span>
                        </div>
                    </div>
                    <div class="info-item mt-2">
                        <span class="label">附加服务总计：</span>
                        <span class="value">¥{{ additionalServiceTotalFee }}</span>
                    </div>
                </div>
            </div>

            <!-- 寄养信息 -->
            <div class="info-group">
                <h4>
                    <el-icon color="#409eff">
                        <Calendar />
                    </el-icon>
                    寄养信息
                </h4>
                <div class="info-item">
                    <span class="label">寄养时间：</span>
                    <span class="value">{{ formatDisplayDate(bookingForm.startDate) }} 至 {{
                        formatDisplayDate(bookingForm.endDate) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">寄养天数：</span>
                    <span class="value">{{ calculateStayDays() }} 晚</span>
                </div>
            </div>

            <!-- 费用明细 -->
            <div class="info-group">
                <h4>
                    <el-icon color="#409eff">
                        <Wallet />
                    </el-icon>
                    费用明细
                </h4>
                <div class="info-item">
                    <span class="label">基础费用：</span>
                    <span class="value">{{ selectedPackage?.basePrice || 0 }} × {{ calculateStayDays() }} =
                        {{ (selectedPackage?.basePrice || 0) * calculateStayDays() }} 元</span>
                </div>
                <div class="info-item" v-if="bookingForm.pictureUrlList.length > 0">
                    <span class="label">附加服务费用：</span>
                    <span class="value">{{ additionalServiceTotalFee }} 元</span>
                </div>
                <div class="info-item total">
                    <span class="label">总计：</span>
                    <span class="value">{{ calculateTotalPrice }} 元</span>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, Service, Calendar, Wallet } from '@element-plus/icons-vue'
import { useBookingPackageStore } from '@/stores/booking'
import { usePriceCalculator } from '@/composables/foster/use-price-cal'

// Props
const props = defineProps<{
    bookingForm: any
    calculateStayDays: () => number
}>()

// Store
const bookingStore = useBookingPackageStore()
const selectedPackage = computed(() => bookingStore.selectedPackage)
const {
    bookingForm,
    calculateStayDays
} = props

// 价格计算
const {
    additionalServiceTotalFee,
    calculateTotalPrice
} = usePriceCalculator(selectedPackage, calculateStayDays)
// 日期格式化
const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
}

</script>

<style scoped lang="scss">
.confirm-info {
    .info-group {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        h4 {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 16px 0;
            color: #1f2937;
            font-size: 16px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;

            .label {
                color: #475569;
                font-size: 14px;
            }

            .value {
                color: #1e293b;
                font-size: 14px;
                font-weight: 500;

                &.total {
                    color: #409eff;
                    font-size: 16px;
                }
            }
        }
    }

    .info-item-files {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .vaccineFilesList {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding-bottom: 8px;

            .file-item {
                width: 130px;
                height: 130px;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
                background: #f1f5f9;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }

    .additional-services-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .additional-service-item {


            padding: 4px 0;


            .service-name {
                color: #475569;
            }

            .service-price {
                color: #409eff;
                font-weight: 500;
                margin-left: 6px;
            }
        }
    }
}
</style>