<template>
    <div class="foster-pay-step">
        <NavBar />
        <div class="container mx-auto px-4 py-6 max-w-4xl mt-16">
            <!-- 步骤条 -->
            <el-steps :active="activeStep" finish-status="success" :style="{
                '--el-steps-finish-color': '#f97316',
                '--el-steps-process-color': '#f97316',
                '--el-steps-title-font-size': '16px'
            }" class="mb-8">
                <el-step title="确认订单" />
                <el-step title="确认支付" />
                <el-step title="支付成功" />
            </el-steps>

            <!-- 步骤1：确认订单 -->
            <!-- <BookingStep3Confirm v-if="activeStep === 0" :booking-form="order.bookingForm"
                :calculate-stay-days="() => order.days" /> -->

            <!-- 步骤2：确认支付 -->
            <BookingStep4Pay v-if="activeStep === 1" :order-no="order.orderNo" :user-balance="userBalance"
                :calculate-total-price="order.totalAmount" :is-step-validated="isStepValidated"
                v-model:show-agreement="showAgreement" v-model:agreed-to-terms="agreedToTerms" />

            <!-- 步骤3：支付成功 -->
            <BookingStep5Success v-if="activeStep === 2" :order-no="order.orderNo" :total-price="order.totalAmount"
                :user-balance="userBalance" @go-to-home="goToOrderList" />

            <!-- 步骤操作按钮 -->
            <div class="step-buttons flex justify-between mt-8" v-if="activeStep < 2">
                <el-button v-if="activeStep > 0" @click="activeStep--"
                    :style="{ color: '#f97316', borderColor: '#f97316' }">
                    上一步
                </el-button>
                <el-button v-if="activeStep === 0" type="primary" @click="nextStep"
                    :style="{ backgroundColor: '#f97316', borderColor: '#f97316' }">
                    下一步
                </el-button>
                <el-button v-if="activeStep === 1" type="primary" @click="submitPay" :loading="payLoading"
                    :disabled="!agreedToTerms" :style="{
                        backgroundColor: agreedToTerms ? '#f97316' : '#fdba74',
                        borderColor: agreedToTerms ? '#f97316' : '#fdba74',
                        cursor: agreedToTerms ? 'pointer' : 'not-allowed'
                    }">
                    确认支付
                </el-button>
            </div>
        </div>

        <!-- 服务协议弹窗 -->
        <el-dialog v-model="showAgreement" title="宠物寄养服务协议" width="600px">
            <div class="agreement-content" style="max-height: 400px; overflow-y: auto; line-height: 1.8;">
                <h3 class="text-center mb-4">宠物寄养服务协议</h3>
                <p>1. 甲方（用户）承诺所提供的宠物信息真实有效，确保宠物无传染病、皮肤病等疾病。</p>
                <p>2. 乙方（寄养家庭）需按照协议约定照顾宠物，提供安全、卫生的寄养环境。</p>
                <p>3. 寄养期间如因宠物自身疾病、性格问题导致的损失，由甲方承担；因乙方照顾不当导致的损失，由乙方承担。</p>
                <p>4. 甲方需按时支付寄养费用，逾期未支付的，乙方有权终止寄养服务。</p>
                <p>5. 本协议自支付成功之日起生效，至寄养结束之日终止。</p>
            </div>
            <template #footer>
                <el-button @click="showAgreement = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
// import BookingStep3Confirm from '@/components/foster/BookingStep3Confirm.vue'
import BookingStep4Pay from '@/components/foster/BookingStep4Pay.vue'
import BookingStep5Success from '@/components/foster/BookingStep5Success.vue'
import type { FosterOrder } from '@/types/foster'
import { getFosterOrderDetail, payFosterOrder } from '@/api/foster-care'

// 路由/状态
const router = useRouter()
const route = useRoute()
const activeStep = ref(0) // 0-确认订单 1-确认支付 2-支付成功
const payLoading = ref(false)
const isStepValidated = ref(false)
const showAgreement = ref(false)
const agreedToTerms = ref(false)

// 订单/用户信息
const order = ref<FosterOrder>({} as FosterOrder)
const userBalance = ref(1000) // 模拟用户余额，实际从接口获取

// 获取订单详情
const fetchOrderDetail = async () => {
    const orderId = route.params.orderId as string
    try {
        const res = await getFosterOrderDetail(Number(orderId))
        if (res.code === 0) {
            order.value = res.data
        } else {
            ElMessage.error(res.msg || '获取订单详情失败')
            router.push('/my-foster-orders')
        }
    } catch (error) {
        console.error('获取订单详情失败：', error)
        ElMessage.error('获取订单详情失败')
        router.push('/my-foster-orders')
    }
}

// 下一步
const nextStep = () => {
    isStepValidated.value = true
    activeStep.value += 1
}

// 提交支付
const submitPay = async () => {
    if (!agreedToTerms.value) {
        ElMessage.warning('请阅读并同意服务协议')
        return
    }
    payLoading.value = true
    try {
        const res = await payFosterOrder({
            orderId: order.value.orderNo,
            payType: 'balance'
        })
        if (res.code === 0) {
            ElMessage.success('支付成功！')
            activeStep.value += 1
            // 更新用户余额（模拟）
            userBalance.value -= order.value.totalAmount
        } else {
            ElMessage.error(res.msg || '支付失败')
        }
    } catch (error) {
        console.error('支付失败：', error)
        ElMessage.error('支付失败，请稍后重试')
    } finally {
        payLoading.value = false
    }
}

// 支付成功后返回订单列表
const goToOrderList = () => {
    router.push('/my-foster-orders')
}

// 初始化
onMounted(() => {
    fetchOrderDetail()
})
</script>

<style scoped lang="scss">
.foster-pay-step {
    min-height: 100vh;
    background-color: #f9fafb;
}

.step-buttons {
    padding-top: 20px;
    border-top: 1px solid #f3f4f6;
}

:deep(.el-steps__item) {
    .el-steps__icon {
        width: 24px;
        height: 24px;
        line-height: 24px;
    }
}

:deep(.el-dialog__header) {
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 12px;
}
</style>