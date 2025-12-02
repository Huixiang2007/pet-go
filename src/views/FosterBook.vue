<template>

    <div class="booking-process">
        <!-- 步骤条 -->
        <el-steps :active="currentStep" finish-status="success" class="booking-steps">
            <el-step title="填写基本信息" />
            <el-step title="选择寄养日期" />
            <el-step title="确认信息" />
            <el-step title="确认支付" />
            <el-step title="支付成功" />

        </el-steps>
        <!-- 步骤内容 -->
        <div class="step-content">
            <!-- 第一步：基本信息 -->
            <div v-if="currentStep === 1" class="step-basic-info">
                <el-card shadow="never" class="info-card">
                    <template #header>
                        <div class="card-header">
                            <h3>填写宠物基本信息</h3>
                        </div>
                    </template>
                    <!-- 选择宠物 -->
                    <el-select v-model="name" placeholder="Select" style="width: 240px">
                        <el-option v-for="item in myPets" :key="item.id" :value="item.name" />
                    </el-select>
                    <!-- 填写特殊要求 -->
                    <div class="section">
                        <div class="section-title">
                            <el-icon>
                                <ChatDotRound />
                            </el-icon>
                            <span>备注</span>
                        </div>
                        <el-input v-model="textarea" style="width: 240px" :autosize="{ minRows: 2, maxRows: 4 }"
                            type="textarea" placeholder="请填写宠物的特殊要求，比如宠物的疾病、过敏史、特殊需求等" />

                    </div>
                    <!-- 上传疫苗本 -->
                    <div class="section">
                        <div class="section-title">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>上传疫苗本</span>
                            <el-tooltip content="请上传宠物的疫苗接种记录" placement="top">
                                <el-icon class="tip-icon">
                                    <Warning />
                                </el-icon>
                            </el-tooltip>
                        </div>

                        <div class="upload-section">
                            <el-upload class="vaccine-upload" drag :on-success="handleUploadSuccess"
                                :on-error="handleUploadError" :before-upload="beforeUpload" :file-list="vaccineFiles"
                                multiple accept=".jpg,.jpeg,.png,.pdf" :auto-upload="true" :show-file-list="false">
                                <el-icon class="el-icon--upload">
                                    <UploadFilled />
                                </el-icon>
                                <div class="el-upload__text">
                                    将文件拖到此处，或 <em>点击上传</em>
                                </div>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        支持 JPG、PNG、PDF 格式，单个文件不超过 5MB
                                    </div>
                                </template>
                            </el-upload>

                            <div v-if="vaccineFiles.length > 0" class="uploaded-files">
                                <div class="files-title">已上传文件：</div>
                                <div class="files-list">
                                    <div v-for="(file, index) in vaccineFiles" :key="index" class="file-item">
                                        <el-icon>
                                            <Document />
                                        </el-icon>
                                        <span class="file-name">{{ file.name }}</span>
                                        <el-icon class="delete-icon" @click="removeFile(index)">
                                            <Close />
                                        </el-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
            <!-- 第二步：选择寄养日期 -->
            <div v-else-if="currentStep === 2">
                <el-card shadow="never">
                    <template #header>
                        <div class="card-header">
                            <span class="header-title">选择寄养日期</span>
                            <span class="header-subtitle">最多可选择 {{ maxStayDays }} 天</span>
                        </div>
                    </template>
                    <div class="date-preview">
                        <div class="preview-header">
                            <div class="preview-title">30天可用性预览</div>
                            <div class="preview-legend">
                                <div class="legend-item">
                                    <div class="legend-color available"></div>
                                    <span class="legend-text">可预订</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color unavailable"></div>
                                    <span class="legend-text">已满</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color selected"></div>
                                    <span class="legend-text">已选择</span>
                                </div>
                            </div>
                        </div>

                        <div class="preview-grid">
                            <!-- <div v-for="(day, index) in previewDays" :key="index" class="preview-day" :class="{
                                'available': day.spots > 0,
                                'unavailable': day.spots === 0,
                                'selected': isDaySelected(day.date),
                                'today': isToday(day.date)
                            }" :title="`${day.displayDate}: ${day.spots > 0 ? `剩余${day.spots}个空位` : '已满'}`"
                                @click="onPreviewDayClick(day)">
                                <div class="day-number">{{ day.day }}</div>
                                <div class="day-spots" v-if="day.spots > 0">{{ day.spots }}</div>
                                <div class="day-full" v-else>满</div>
                                <div class="day-today" v-if="isToday(day.date)">今</div>
                            </div> -->
                        </div>
                        <div class="result-dates">
                            <div class="result-label">寄养时间：</div>
                            <div class="result-value" v-if="startDate && endDate">
                                {{ formatDisplayDate(startDate) }} 至 {{ formatDisplayDate(endDate) }}
                                <!-- <span class="result-nights">（共 {{ stayNights }} 晚）</span> -->
                            </div>
                            <div class="result-value" v-else-if="startDate">
                                {{ formatDisplayDate(startDate) }}
                                <span class="result-hint">请选择结束日期</span>
                            </div>
                            <div class="result-placeholder" v-else>请选择寄养日期</div>
                        </div>

                        <div class="result-price">
                            <div class="price-label">预计费用：</div>
                            <div class="price-value">
                                <!-- <span class="price-number">{{ calculatedPrice }}</span> -->
                                <span class="price-unit">元</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
            <!-- 第三步：确认信息 -->
            <div v-else-if="currentStep === 3">
                <!-- 所选套餐 -->
                <!-- 寄养的宠物信息和特殊要求 -->
                <!-- 寄养的时间 -->
                <!-- 寄养费用 -->
            </div>
            <!-- 第四步：确认支付 -->
            <div v-else-if="currentStep === 4">
                <el-card shadow="never" class="info-card">
                    <template #header>
                        <div class="card-header">
                            <h3>确认支付</h3>
                            <span class="step-subtitle">请核对信息并完成支付</span>
                        </div>
                    </template>

                    <!-- 订单信息汇总 -->
                    <div class="order-summary">
                        <div class="summary-section">
                            <h4>宠物信息</h4>
                            <div class="summary-item">
                                <span class="label">宠物名称：</span>
                                <!-- <span class="value">{{ selectedPet?.name }}</span> -->
                            </div>
                            <div class="summary-item">
                                <span class="label">品种年龄：</span>
                                <!-- <span class="value">{{ selectedPet?.breed }} · {{ selectedPet?.age }}</span> -->
                            </div>
                        </div>

                        <div class="summary-section">
                            <h4>寄养信息</h4>
                            <div class="summary-item">
                                <span class="label">寄养家庭：</span>
                                <!-- <span class="value">{{ fosterHome.name }}</span> -->
                            </div>
                            <div class="summary-item">
                                <span class="label">寄养套餐：</span>
                                <!-- <span class="value">{{ selectedPackageInfo?.name }}</span> -->
                            </div>
                            <div class="summary-item">
                                <span class="label">寄养时间：</span>
                                <span class="value">
                                    {{ formatDate(bookingForm.startDate) }} 至 {{ formatDate(bookingForm.endDate) }}
                                </span>
                            </div>
                            <div class="summary-item">
                                <span class="label">寄养天数：</span>
                                <span class="value">{{ calculateStayDays() }} 晚</span>
                            </div>
                        </div>

                        <div class="summary-section">
                            <h4>费用明细</h4>
                            <div class="price-details">
                                <div class="price-item">
                                    <span class="label">寄养费用：</span>
                                    <!-- <span class="value">{{ selectedPackageInfo?.price }} × {{ calculateStayDays() }} =
                                        {{
                                            selectedPackageInfo?.price * calculateStayDays() }} 元</span> -->
                                </div>
                                <div class="price-item">
                                    <span class="label">清洁费用：</span>
                                    <span class="value">50 元</span>
                                </div>
                                <div class="price-item total">
                                    <span class="label">总计：</span>
                                    <span class="value">{{ calculatedPrice }} 元</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 支付方式 -->
                    <div class="payment-methods">
                        <h4>选择支付方式</h4>
                        <el-radio-group v-model="paymentMethod" class="payment-options">
                            <el-radio label="wechat" border>
                                <div class="payment-option">
                                    <!-- <img src="@/assets/wechat-pay.png" alt="微信支付" class="payment-icon" /> -->
                                    <span>微信支付</span>
                                </div>
                            </el-radio>
                            <el-radio label="alipay" border>
                                <div class="payment-option">
                                    <!-- <img src="@/assets/alipay.png" alt="支付宝" class="payment-icon" /> -->
                                    <span>支付宝</span>
                                </div>
                            </el-radio>
                            <el-radio label="bank" border>
                                <div class="payment-option">
                                    <el-icon>
                                        <CreditCard />
                                    </el-icon>
                                    <span>银行卡支付</span>
                                </div>
                            </el-radio>
                        </el-radio-group>
                    </div>

                    <!-- 服务协议 -->
                    <div class="service-agreement">
                        <el-checkbox v-model="agreedToTerms">
                            我已阅读并同意
                            <el-link type="primary" @click="showAgreement = true">《宠物寄养服务协议》</el-link>
                        </el-checkbox>
                    </div>
                </el-card>
            </div>
            <!-- 第五步：支付成功 -->
            <div v-if="currentStep === 5"></div>
        </div>
        <div class="step-actions">
            <!-- <el-button v-if="currentStep > 1" @click="previousStep" :disabled="processing">
                上一步
            </el-button>

            <el-button v-if="currentStep < 5" type="primary" @click="nextStep" :loading="processing"
                :disabled="!canProceed">
                {{ currentStep === 2 ? '下一步：确认支付' : '下一步' }}
            </el-button>

            <el-button v-if="currentStep === 3" type="success" @click="confirmPayment" :loading="processing"
                :disabled="!canConfirmPayment">
                确认支付
            </el-button>

            <el-button v-if="currentStep === 3" @click="saveAsDraft" :disabled="processing">
                保存为草稿
            </el-button> -->
        </div>
    </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBookingStore } from '@/stores/booking'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
const real30DaySpots = [
    3,  // 第1天 - 当天
    3,  // 第2天
    2,  // 第3天
    2,  // 第4天
    2,  // 第5天
    1,  // 第6天
    1,  // 第7天 - 周末
    3,  // 第8天
    3,  // 第9天
    2,  // 第10天
    2,  // 第11天
    1,  // 第12天
    1,  // 第13天
    0,  // 第14天 - 周末，已满
    3,  // 第15天
    3,  // 第16天
    2,  // 第17天
    2,  // 第18天
    1,  // 第19天
    1,  // 第20天
    0,  // 第21天 - 周末，已满
    3,  // 第22天
    2,  // 第23天
    2,  // 第24天
    1,  // 第25天
    1,  // 第26天
    0,  // 第27天 - 周末，已满
    3,  // 第28天
    3,  // 第29天
    2,  // 第30天
    1   // 第31天
]
const currentStep = ref(1)
const processing = ref(false)
const route = useRoute()
const bookingStore = useBookingStore()
// 从store中获取数据
const selectedPackage = computed(() => bookingStore.selectedPackage)
console.log('selectedPackage', selectedPackage.value)
//如果store中不存在数据，则从路由参数中获取数据
//离开页面清理数据
onBeforeRouteLeave((to, from, next) => {
    // 如果离开到非预约相关页面，清理数据
    if (!to.name?.toString().includes('booking')) {
        bookingStore.clearBookingData()
    }
    next()
})
// 第一步：填写基本信息
const myPets = ref([
    {
        id: 1,
        name: '皮皮'
    },
    {
        id: 2,
        name: '小黑'
    },
    {
        id: 3,
        name: '小黄'
    }
])
const name = ref('')
const textarea = ref('')
// 上传相关
const vaccineFiles = ref<File[]>([])
// 文件上传
const handleUploadSuccess = (response: any, file: File) => {
    vaccineFiles.value.push(file)
    ElMessage.success(`${file.name} 上传成功`)
}

const handleUploadError = (error: Error, file: File) => {
    ElMessage.error(`${file.name} 上传失败: ${error.message}`)
}

const beforeUpload = (file: File) => {
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
        ElMessage.error('文件大小不能超过 5MB')
        return false
    }
    return true
}

const removeFile = (index: number) => {
    vaccineFiles.value.splice(index, 1)
}

const startDate = ref('')
const endDate = ref('')
const confirmLoading = ref(false)
// 预订表单数据
const bookingForm = reactive({
    petId: null as number | null,
    startDate: '',
    endDate: '',
    dietaryRequirements: '',
    healthCondition: '',
    behaviorHabits: '',
    otherRequirements: '',
    vaccineFiles: [] as File[]
})


// 支付相关
const paymentMethod = ref('wechat')
const agreedToTerms = ref(false)
const showAgreement = ref(false)

// 计算属性
// const selectedPet = computed(() => {
//   return pets.value.find(pet => pet.id === bookingForm.petId)
// })

const canProceed = computed(() => {
    switch (currentStep.value) {
        case 1:
            return bookingForm.petId !== null
        case 2:
            return bookingForm.startDate && bookingForm.endDate
        default:
            return true
    }
})

const canConfirmPayment = computed(() => {
    return agreedToTerms.value && bookingForm.petId !== null &&
        bookingForm.startDate && bookingForm.endDate
})

const calculatedPrice = computed(() => {
    const days = calculateStayDays()
    if (days === 0 || !selectedPackage.value) return 0
    // 基础费用 + 清洁费
    return (selectedPackage.value.price * days) + 50
})

// 方法
const calculateStayDays = (): number => {
    if (!bookingForm.startDate || !bookingForm.endDate) return 0

    const start = new Date(bookingForm.startDate)
    const end = new Date(bookingForm.endDate)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    return Math.max(0, diff)
}

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 步骤控制
const nextStep = async () => {
    // 验证当前步骤
    if (!canProceed.value) {
        ElMessage.warning('请先完成当前步骤的必要信息')
        return
    }

    processing.value = true
    try {
        // 这里可以添加API调用验证
        await new Promise(resolve => setTimeout(resolve, 500))

        currentStep.value++
    } catch (error) {
        ElMessage.error('操作失败，请重试')
    } finally {
        processing.value = false
    }
}

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}


// 日期选择器回调
const handleDateSelected = (dates: { startDate: string; endDate: string }) => {
    bookingForm.startDate = dates.startDate
    bookingForm.endDate = dates.endDate
}

// 支付确认
const confirmPayment = async () => {
    if (!canConfirmPayment.value) {
        ElMessage.warning('请完成所有必要信息并同意服务协议')
        return
    }

    processing.value = true

    try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))

        // 构建订单数据
        // const orderData = {
        //   petId: bookingForm.petId,
        //   petName: selectedPet.value?.name,
        //   fosterHomeId: fosterHome.value.id,
        //   fosterHomeName: fosterHome.value.name,
        //   packageType: selectedPackage.value,
        //   startDate: bookingForm.startDate,
        //   endDate: bookingForm.endDate,
        //   days: calculateStayDays(),
        //   totalPrice: calculatedPrice.value,
        //   specialRequirements: {
        //     dietary: bookingForm.dietaryRequirements,
        //     health: bookingForm.healthCondition,
        //     behavior: bookingForm.behaviorHabits,
        //     other: bookingForm.otherRequirements
        //   },
        //   vaccineFiles: vaccineFiles.value,
        //   paymentMethod: paymentMethod.value,
        //   status: 'paid'
        // }

        // console.log('订单数据:', orderData)

        // 显示成功消息
        ElMessage.success({
            message: `支付成功！订单已生成，寄养家庭将联系您确认细节`,
            duration: 3000
        })

        // 这里可以跳转到订单详情页或者返回上一页
        // router.push('/orders/' + orderId)

    } catch (error) {
        ElMessage.error('支付失败，请重试')
    } finally {
        processing.value = false
    }
}
// 最大连续可预订天数
const maxStayDays = computed(() => {
    let maxDays = 0
    let currentDays = 0

    for (let i = 0; i < real30DaySpots.length; i++) {
        const spot = real30DaySpots[i];
        if (spot !== undefined && spot > 0) {
            currentDays++
            maxDays = Math.max(maxDays, currentDays)
        } else {
            currentDays = 0
        }
    }

    return Math.min(maxDays, 30)
})


// 计算价格
// const calculatedPrice = computed(() => {
//     if (!selectedPackageInfo.value || stayNights.value === 0) return 0

//     return selectedPackageInfo.value.price * stayNights.value
// })

// // 选择是否有效
// const isSelectionValid = computed(() => {
//     return startDate.value && endDate.value && stayNights.value > 0 && dateValidation.value?.type === 'success'
// })

// 预览天数
const previewDays = computed(() => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        const dateStr = formatDateToYYYYMMDD(date)
        const spots = real30DaySpots[i]

        days.push({
            index: i,
            date: dateStr,
            day: date.getDate(),
            month: date.getMonth() + 1,
            spots: spots,
            displayDate: `${date.getMonth() + 1}月${date.getDate()}日`
        })
    }

    return days
})
const dateValidation = ref<{
    type: 'success' | 'error' | 'warning' | 'info'
    icon: string
    message: string
} | null>(null)
// 日期格式转换
const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// 显示格式
const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取日期索引
const getDateIndex = (dateStr: string): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const targetDate = new Date(dateStr)
    targetDate.setHours(0, 0, 0, 0)

    const timeDiff = targetDate.getTime() - today.getTime()
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24))
}

// 检查是否是今天
const isToday = (dateStr: string): boolean => {
    const today = new Date()
    const date = new Date(dateStr)
    return today.toDateString() === date.toDateString()
}

// 检查日期是否被选择
const isDaySelected = (dateStr: string): boolean => {
    if (!startDate.value && !endDate.value) return false
    if (!endDate.value) return dateStr === startDate.value

    const date = new Date(dateStr)
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)

    return date >= start && date <= end
}

// 开始日期变化
// const onStartDateChange = (value: string) => {
//     if (value) {
//         startDate.value = value
//         endDate.value = ''
//         validateDateRange(value, '')

//         // 自动查找连续可用的结束日期
//         findAvailableEndDate(value)
//     } else {
//         startDate.value = ''
//         endDate.value = ''
//         dateValidation.value = null
//     }
// }

// // 结束日期变化
// const onEndDateChange = (value: string) => {
//     if (value && startDate.value) {
//         endDate.value = value
//         validateDateRange(startDate.value, value)
//     } else if (!value) {
//         endDate.value = ''
//         dateValidation.value = null
//     }
// }

// 预览日期点击
const onPreviewDayClick = (day: any) => {
    if (day.spots === 0) {
        ElMessage.warning(`${day.displayDate} 已无空位，请选择其他日期`)
        return
    }

    if (!startDate.value || (startDate.value && endDate.value)) {
        // 重新选择
        startDate.value = day.date
        endDate.value = ''
        validateDateRange(day.date, '')
        findAvailableEndDate(day.date)
    } else if (startDate.value && !endDate.value) {
        const start = new Date(startDate.value)
        const end = new Date(day.date)

        if (end < start) {
            // 如果选择的结束日期在开始日期之前，交换
            endDate.value = startDate.value
            startDate.value = day.date
        } else {
            endDate.value = day.date
        }
        validateDateRange(startDate.value, endDate.value)
    }
}
// 查找可用结束日期
const findAvailableEndDate = (startDateStr: string) => {
    const startIndex = getDateIndex(startDateStr)
    let availableEndIndex = startIndex

    // 从开始日期往后查找连续可用日期
    for (let i = startIndex + 1; i < 30; i++) {

        // if (real30DaySpots[i] > 0) {
        //     availableEndIndex = i
        // } else {
        //     break
        // }
    }

    if (availableEndIndex === startIndex) {
        dateValidation.value = {
            type: 'warning',
            icon: 'Warning',
            message: '该日期后无可预订日期，只能预订单日'
        }
        return
    }

    // 自动设置结束日期
    // const today = new Date()
    // today.setHours(0, 0, 0, 0)
    // const endDate = new Date(today)
    // endDate.setDate(today.getDate() + availableEndIndex)

    // setTimeout(() => {
    //     if (startDate.value === startDateStr) {
    //         onEndDateChange(formatDateToYYYYMMDD(endDate))
    //         ElMessage.info('已自动选择连续可预订的结束日期')
    //     }
    // }, 100)
}

// 验证日期范围
const validateDateRange = (startStr: string, endStr: string) => {
    if (!startStr) {
        dateValidation.value = null
        return
    }

    const startIndex = getDateIndex(startStr)

    if (!endStr) {
        // 只选择了开始日期
        if (real30DaySpots[startIndex]) {
            if (real30DaySpots[startIndex] > 0) {
                dateValidation.value = {
                    type: 'info',
                    icon: 'InfoFilled',
                    message: '请选择结束日期'
                }
            } else {
                dateValidation.value = {
                    type: 'error',
                    icon: 'CircleCloseFilled',
                    message: '该日期已无空位，请选择其他日期'
                }
            }
        }

        return
    }

    const endIndex = getDateIndex(endStr)

    // 检查结束日期是否在开始日期之后
    if (endIndex <= startIndex) {
        dateValidation.value = {
            type: 'error',
            icon: 'CircleCloseFilled',
            message: '结束日期必须晚于开始日期'
        }
        return
    }

    // 检查范围内的每一天都有空位
    let hasNoAvailability = false
    let minSpots = Infinity

    for (let i = startIndex; i <= endIndex; i++) {
        if (i >= 30) {
            hasNoAvailability = true
            break
        }

        // if (real30DaySpots[i] <= 0) {
        //     hasNoAvailability = true
        //     break
        // }

        // minSpots = Math.min(minSpots, real30DaySpots[i])
    }

    if (hasNoAvailability) {
        dateValidation.value = {
            type: 'error',
            icon: 'CircleCloseFilled',
            message: '选择的时间范围内包含已满的日期'
        }

        // 自动调整结束日期
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const newEndDate = new Date(today)

        // 找到第一个空位为0的日期
        for (let i = startIndex; i <= endIndex; i++) {
            // if (i >= 30 || real30DaySpots[i] <= 0) {
            //     newEndDate.setDate(today.getDate() + Math.max(startIndex, i - 1))
            //     break
            // }
        }

        setTimeout(() => {
            if (startDate.value === startStr && endDate.value === endStr) {
                endDate.value = formatDateToYYYYMMDD(newEndDate)
                ElMessage.info('已自动调整结束日期，避开不可预订日期')
            }
        }, 100)
    } else {
        const nights = endIndex - startIndex
        dateValidation.value = {
            type: 'success',
            icon: 'SuccessFilled',
            message: `可预订 ${nights} 晚，共 ${nights + 1} 天，每天至少还有 ${minSpots} 个空位`
        }
    }
}



// ==================== 日期选择器选项 ====================
const startDateOptions = {
    disabledDate: (time: Date) => {
        const dateStr = formatDateToYYYYMMDD(time)
        const index = getDateIndex(dateStr)

        // 禁用今天之前的日期
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (time < today) return true

        // 禁用30天后的日期
        const maxDate = new Date(today)
        maxDate.setDate(today.getDate() + 29)
        if (time > maxDate) return true

        // 禁用没有空位的日期
        // return index < 0 || index >= 30 || real30DaySpots[index] <= 0
    }
}

const endDateOptions = computed(() => {
    return {
        disabledDate: (time: Date) => {
            if (!startDate.value) return true

            const dateStr = formatDateToYYYYMMDD(time)
            const start = new Date(startDate.value)

            // 禁用开始日期之前的日期
            if (time <= start) return true

            // 禁用30天后的日期
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const maxDate = new Date(today)
            maxDate.setDate(today.getDate() + 29)
            if (time > maxDate) return true

            // 检查从开始日期到当前日期的每一天都有空位
            const startIndex = getDateIndex(startDate.value)
            const endIndex = getDateIndex(dateStr)

            // for (let i = startIndex; i <= endIndex; i++) {
            //     if (i >= 30 || real30DaySpots[i] <= 0) {
            //         return true
            //     }
            // }

            return false
        }
    }
})

// ==================== 操作按钮处理 ====================
// const confirmSelection = async () => {
//     if (!isSelectionValid.value) {
//         ElMessage.error('请选择有效的日期范围')
//         return
//     }

//     confirmLoading.value = true

//     try {
//         const selection = {
//             package: selectedPackage.value,
//             startDate: startDate.value,
//             endDate: endDate.value,
//             price: calculatedPrice.value
//         }

//         // 模拟API调用
//         await new Promise(resolve => setTimeout(resolve, 1000))

//         ElMessage.success({
//             message: `预订成功！${formatDisplayDate(startDate.value)} 至 ${formatDisplayDate(endDate.value)}，共 ${stayNights.value} 晚`,
//             duration: 3000
//         })

//         // 触发父组件事件
//         emit('confirm', selection)

//     } catch (error) {
//         ElMessage.error('预订失败，请稍后重试')
//     } finally {
//         confirmLoading.value = false
//     }
// }


onMounted(() => {
    // // 初始化选择第一个可用的套餐
    // const availablePackage = packages.find(pkg => pkg.availableSpots > 0)
    // if (availablePackage) {
    //     selectedPackage.value = availablePackage.type
    // }
})
</script>

<style scoped>
/* 日期预览 */
.date-preview {
    margin-bottom: 24px;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.preview-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
}

.preview-legend {
    display: flex;
    gap: 16px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 3px;
}

.legend-color.available {
    background-color: #f0f9ff;
    border: 1px solid #bae0ff;
}

.legend-color.unavailable {
    background-color: #fef0f0;
    border: 1px solid #fbc4c4;
}

.legend-color.selected {
    background-color: #409eff;
    border: 1px solid #409eff;
}

.legend-text {
    font-size: 12px;
    color: #606266;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 6px;
}

.preview-day {
    aspect-ratio: 1;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    padding: 2px;
}

.preview-day.available {
    background-color: #f0f9ff;
    border: 1px solid #bae0ff;
}

.preview-day.available:hover {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    transform: translateY(-2px);
}

.preview-day.unavailable {
    background-color: #fef0f0;
    border: 1px solid #fbc4c4;
    cursor: not-allowed;
    opacity: 0.6;
}

.preview-day.selected {
    background-color: #409eff;
    border-color: #409eff;
    color: white;
}

.preview-day.today {
    border-width: 2px;
}

.preview-day.today.available {
    border-color: #67c23a;
}

.day-number {
    font-size: 14px;
    font-weight: 500;
}

.day-spots,
.day-full {
    font-size: 10px;
    margin-top: 2px;
}

.day-spots {
    color: #67c23a;
}

.preview-day.selected .day-spots {
    color: rgba(255, 255, 255, 0.9);
}

.day-full {
    color: #f56c6c;
}

.preview-day.selected .day-full {
    color: rgba(255, 255, 255, 0.9);
}

.day-today {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 8px;
    color: #67c23a;
    background: white;
    border-radius: 2px;
    padding: 0 2px;
}

.preview-day.selected .day-today {
    color: #409eff;
    background: white;
}

/* 选择结果 */
.selection-result {
    margin-top: 24px;
}

.result-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.result-dates {
    flex: 1;
}

.result-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 4px;
}

.result-value {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
}

.result-nights {
    font-size: 14px;
    color: #909399;
    margin-left: 4px;
}

.result-hint {
    font-size: 14px;
    color: #e6a23c;
    margin-left: 8px;
}

.result-placeholder {
    font-size: 14px;
    color: #c0c4cc;
    font-style: italic;
}

.result-price {
    text-align: right;
}

.price-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 4px;
}

.price-value {
    display: flex;
    align-items: baseline;
}

.price-number {
    font-size: 24px;
    font-weight: bold;
    color: #409eff;
}

.price-unit {
    font-size: 14px;
    color: #909399;
    margin-left: 2px;
}

.validation-alert {
    margin-top: 8px;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
}

.confirm-button {
    min-width: 200px;
}

.booking-process {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.booking-steps {
    margin-bottom: 40px;
}

.step-content {
    min-height: 500px;
    margin-bottom: 30px;
}

.info-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h3 {
    margin: 0;
    color: #303133;
}

.step-subtitle {
    color: #909399;
    font-size: 14px;
}

.section {
    margin-bottom: 30px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
    font-weight: 500;
    color: #303133;
}

.tip-icon {
    color: #909399;
    cursor: help;
}

/* 宠物选择样式 */
.pet-selection {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    width: 100%;
}

.pet-card {
    cursor: pointer;
    transition: all 0.3s ease;
}

.pet-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pet-card.selected {
    border-color: #409eff;
    background-color: #f0f9ff;
}

:deep(.pet-card .el-card__body) {
    padding: 0 !important;
}

:deep(.pet-card .el-radio) {
    display: block;
    padding: 15px;
}

.pet-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.pet-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.pet-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pet-details {
    flex: 1;
}

.pet-name {
    font-weight: 600;
    font-size: 16px;
    color: #303133;
    margin-bottom: 4px;
}

.pet-type {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
}

.pet-tags {
    display: flex;
    gap: 6px;
}

/* 上传区域样式 */
.upload-section {
    margin-top: 15px;
}

.vaccine-upload {
    margin-bottom: 20px;
}

.uploaded-files {
    margin-top: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 6px;
}

.files-title {
    font-weight: 500;
    margin-bottom: 10px;
    color: #303133;
}

.file-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    background: white;
    border-radius: 4px;
    margin-bottom: 8px;
    border: 1px solid #dcdfe6;
}

.file-name {
    flex: 1;
    font-size: 14px;
    color: #606266;
}

.delete-icon {
    color: #f56c6c;
    cursor: pointer;
}

.delete-icon:hover {
    color: #f78989;
}

/* 日期选择器占位符 */
.date-picker-placeholder {
    min-height: 400px;
}

.date-picker-example {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    border-radius: 8px;
    border: 2px dashed #dcdfe6;
}

.example-header {
    text-align: center;
    color: #909399;
}

.example-header h4 {
    margin-bottom: 10px;
}

/* 已选择信息 */
.selected-info {
    margin-top: 30px;
    padding: 20px;
    background: #f0f9ff;
    border-radius: 8px;
    border: 1px solid #bae0ff;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 15px;
}

.info-item .label {
    color: #606266;
}

.info-item .value {
    color: #303133;
    font-weight: 500;
}

.info-item.total-price {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #bae0ff;
}

.info-item.total-price .value {
    color: #409eff;
    font-size: 18px;
    font-weight: 600;
}

/* 订单汇总 */
.order-summary {
    margin-bottom: 30px;
}

.summary-section {
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
}

.summary-section h4 {
    color: #303133;
    margin-bottom: 15px;
    font-size: 16px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
}

.summary-item .label {
    color: #606266;
}

.summary-item .value {
    color: #303133;
    font-weight: 500;
}

.price-details {
    padding-left: 10px;
}

.price-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
}

.price-item.total {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e4e7ed;
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
}

/* 支付方式 */
.payment-methods {
    margin-bottom: 25px;
}

.payment-methods h4 {
    color: #303133;
    margin-bottom: 15px;
    font-size: 16px;
}

.payment-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    width: 100%;
}

.payment-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
}

.payment-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

/* 服务协议 */
.service-agreement {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
    text-align: center;
}

/* 操作按钮 */
.step-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

/* 协议内容 */
.agreement-content {
    max-height: 400px;
    overflow-y: auto;
}

.agreement-section {
    margin-bottom: 20px;
}

.agreement-section h4 {
    color: #303133;
    margin-bottom: 10px;
}

.agreement-section p {
    margin-bottom: 8px;
    color: #606266;
    line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .booking-process {
        padding: 10px;
    }

    .pet-selection {
        grid-template-columns: 1fr;
    }

    .payment-options {
        grid-template-columns: 1fr;
    }

    .step-actions {
        flex-direction: column;
    }

    .step-actions .el-button {
        width: 100%;
    }
}
</style>