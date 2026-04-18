<!-- src/views/foster/BookingProcess.vue -->
<template>
  <div id="app">
    <NavBar />
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
        <BookingStep1Basic v-if="currentStep === 1" :serviceId="serviceId" ref="step1Ref" />

        <!-- 第二步：选择寄养日期 -->
        <BookingStep2Date v-else-if="currentStep === 2" :serviceId="serviceId" ref="step2Ref" />

        <!-- 第三步：确认信息 -->
        <BookingStep3Confirm v-else-if="currentStep === 3" :booking-form="bookingForm"
          :calculate-stay-days="calculateStayDays" />

        <!-- 第四步：确认支付 -->
        <BookingStep4Pay v-else-if="currentStep === 4" :order-no="orderNo" :user-balance="userBalance"
          :calculate-total-price="calculateTotalPrice" :is-step-validated="isStepValidated[4]"
          :showAgreement=showAgreement :agreedToTerms=agreedToTerms ref="step4Ref"
          @update:showAgreement="(value) => showAgreement = value"
          @update:agreedToTerms="(value) => agreedToTerms = value" />

        <!-- 第五步：支付成功 -->
        <BookingStep5Success v-if="currentStep === 5" :order-no="orderNo" :total-price="calculateTotalPrice"
          :user-balance="userBalance" />
      </div>

      <!-- 步骤按钮 -->
      <div class="step-actions">
        <el-button v-if="currentStep > 1 && currentStep < 5" @click="previousStep" :disabled="processing"
          class="prev-btn">
          <el-icon class="mr-2">
            <ArrowLeft />
          </el-icon>
          上一步
        </el-button>

        <el-button v-if="currentStep < 3 || (currentStep == 3 && isReserved)" type="primary" @click="nextStep"
          :disabled="!canProceed" :loading="processing" class="next-btn">
          下一步
          <el-icon class="ml-2">
            <ArrowRight />
          </el-icon>
        </el-button>

        <el-button v-if="currentStep === 3 && !isReserved" type="primary" @click="confirmBooking" :loading="processing"
          class="confirm-booking-btn">
          <el-icon class="mr-2">
            <Check />
          </el-icon>
          确定预约
        </el-button>

        <el-button v-if="currentStep === 4" type="success" @click="showPayConfirmDialog = true" :loading="processing"
          :disabled="!canConfirmPayment" class="pay-btn">
          <el-icon>
            <Check />
          </el-icon>
          确认支付
        </el-button>
      </div>

      <!-- 协议弹窗 -->
      <el-dialog v-model="showAgreement" title="宠物寄养服务协议" width="600px">
        <div class="agreement-content">
          <div class="agreement-section">
            <h4>一、服务条款</h4>
            <p>1.1 寄养服务由提供方按照约定标准为用户宠物提供照料服务，包括饮食、住宿、日常护理等。</p>
            <p>1.2 用户需保证所提供的宠物信息真实有效，包括健康状况、疫苗接种情况等。</p>
          </div>
          <div class="agreement-section">
            <h4>二、双方责任</h4>
            <p>2.1 用户需按时支付寄养费用，逾期未支付视为放弃服务。</p>
            <p>2.2 提供方需尽到合理照料义务，因不可抗力或宠物自身原因导致的损失，提供方不承担责任。</p>
          </div>
          <div class="agreement-section">
            <h4>三、退款政策</h4>
            <p>3.1 寄养开始前24小时取消订单，可全额退款；24小时内取消，扣除50%费用。</p>
            <p>3.2 寄养期间取消订单，已产生的费用不予退还。</p>
          </div>
        </div>
      </el-dialog>

      <!-- 支付确认弹窗 -->
      <FosterPayConfirm v-if="showPayConfirmDialog" :orderNo=orderNo :calculateTotalPrice=calculateTotalPrice
        :userBalance=userBalance :vaccineUrls="bookingForm.pictureUrlList" @go-to-recharge="goToRecharge"
        v-model=showPayConfirmDialog @pay-success="handlePayConfirm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'

// 组件
import NavBar from '@/components/common/NavBar.vue'
import BookingStep1Basic from './components/foster-book/BookingBasic.vue'
import BookingStep2Date from './components/foster-book/BookingDate.vue'
import BookingStep3Confirm from './components/foster-book/BookingConfirm.vue'
import BookingStep4Pay from './components/foster-book/BookingPay.vue'
import BookingStep5Success from './components/foster-book/BookingSuccess.vue'
import FosterPayConfirm from '@/components/common/FosterPayConfirm.vue'
// Composables
import { useBookingSteps } from '@/composables/foster/use-booking-steps'
import { useDateCalculator } from '@/composables/foster/use-date-cal'
import { usePriceCalculator } from '@/composables/foster/use-price-cal'

// Store & API
import { useBookingPackageStore, useBookingFormStore } from '@/stores/booking'
import { submitBookingOrder, payFosterOrder, getBalance } from '@/api/foster-care'

// 路由
const router = useRouter()
const route = useRoute()
const serviceId = Number(route.params.serviceId)
const pathSegments = route.path.split('/').filter(segment => segment)
const fosterId = pathSegments.find(segment => /^\d+$/.test(segment)) || ''

// Store
const bookingStore = useBookingPackageStore()
const selectedPackage = computed(() => bookingStore.selectedPackage)
const bookingFormStore = useBookingFormStore()
const bookingForm = bookingFormStore.bookingForm
console.log(bookingForm)
// 初始化检查
if (!selectedPackage.value) {
  ElMessage.error('请先选择套餐！')
  router.push({
    name: 'fosterDetail',
    params: { id: fosterId }
  })
}

const { calculateStayDays } = useDateCalculator(serviceId)
const { calculateTotalPrice, fetchAdditionalServices } = usePriceCalculator(selectedPackage, calculateStayDays)

// 步骤控制
const agreedToTerms = ref(false)
const userBalance = ref(0)

const {
  currentStep,
  processing,
  isStepValidated,
  showAgreement,
  showPayConfirmDialog,
  canProceed,
  canConfirmPayment,
  nextStep,
  previousStep
} = useBookingSteps(
  bookingForm,
  agreedToTerms,
  userBalance,
  calculateTotalPrice
)

// 组件引用
const step1Ref = ref<InstanceType<typeof BookingStep1Basic>>()
const step2Ref = ref<InstanceType<typeof BookingStep2Date>>()
const step4Ref = ref<InstanceType<typeof BookingStep4Pay>>()

// 订单相关
const orderNo = ref(0)
const bookingNo = ref('')
const isReserved = ref(false)
// 获取用户余额
const getUserBalance = async () => {
  try {
    const res = await getBalance()
    if (res.code === 0) {

      userBalance.value = res.data
    }
  } catch (error) {
    console.error('获取余额失败：', error)
    ElMessage.error('获取账户余额失败，请稍后重试')
  }
}

// 确定预约
const confirmBooking = async () => {
  processing.value = true
  isReserved.value = true
  try {
    const formData = new FormData()
    formData.append('serviceId', String(serviceId))
    formData.append('petName', bookingForm.petName)
    formData.append('startDate', bookingForm.startDate)
    formData.append('endDate', bookingForm.endDate)
    formData.append('petType', bookingForm.petType)

    formData.append('additionalServiceId', String(bookingForm.additionalServiceId))


    formData.append('specialRequirements', bookingForm.specialRequirements || '')
    formData.append('emergencyPhone', bookingForm.emergencyPhone)
    formData.append('userNotes', '')
    bookingForm.vaccineFiles.forEach((file: File) => {
      formData.append('pictureUrlList', file)
    })


    // 确认预约弹窗
    await ElMessageBox.confirm(
      '确认提交预约信息？提交后将进入支付环节',
      '确认预约',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await submitBookingOrder(formData)
    if (res.code === 0) {
      orderNo.value = res.data.orderNo
      bookingNo.value = res.data.bookingNo
      await getUserBalance()
      showPayConfirmDialog.value = true
      currentStep.value = 4 // 进入支付步骤
      ElMessage.success('预约信息提交成功，请完成支付')
    } else {
      ElMessage.error(res.msg || '提交预约信息失败，请稍后重试')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('提交预约失败：', error)
      ElMessage.error('提交预约失败，请稍后重试')
    }
  } finally {
    processing.value = false
  }
}

// 处理支付确认
const handlePayConfirm = async () => {
  showPayConfirmDialog.value = false
  await confirmPayment()
}

// 支付确认
const confirmPayment = async () => {
  if (!canConfirmPayment.value) {
    ElMessage.warning('请同意服务协议')
    return
  }

  processing.value = true

  try {
    const res = await payFosterOrder({
      orderNo: Number(orderNo.value)

    })
    if (res.code === 0) {
      currentStep.value = 5 // 进入支付成功页面
      ElMessage.success('支付成功！')
      userBalance.value -= calculateTotalPrice.value
    } else {
      ElMessage.error(res.msg || '支付失败，请重试')
    }
  } catch (error) {
    console.error('支付失败：', error)
    ElMessage.error('支付失败，请重试')
  } finally {
    processing.value = false
  }
}

// 前往充值
const goToRecharge = () => {
  showPayConfirmDialog.value = false
  router.push({
    name: 'recharge',
    query: {
      amount: (calculateTotalPrice.value - userBalance.value).toFixed(2),
      from: 'foster-payment'
    }
  })
}

// 初始化
onMounted(() => {
  getUserBalance()
  fetchAdditionalServices()

})

// 监听日期变化，更新第二步校验状态
watch([bookingForm.startDate, bookingForm.endDate], () => {
  isStepValidated.value[2] = !!bookingForm.startDate && !!bookingForm.endDate && bookingForm.startDate < bookingForm.endDate
})
</script>

<style scoped lang="scss">
#app {
  border-top: 1px solid transparent;
}

// 全局样式
.booking-process {
  max-width: 1200px;
  margin: 5.3rem auto;
  padding: 30px 20px;
  min-height: 100vh;
}

// 步骤条
.booking-steps {
  margin-bottom: 40px;

  :deep(.el-step__title) {
    font-weight: 500;
  }
}

// 步骤内容
.step-content {
  min-height: 500px;
  margin-bottom: 40px;
}

// 卡片样式（蓝色主题）
.info-card {
  border: 2px solid #e8f4fc;
  border-radius: 12px;
  background-color: #fff;
  transition: all 0.3s ease;

  :deep(.el-card__header) {
    border-bottom: 1px solid #e8f4fc;
    background-color: #f0f9ff;
    padding: 16px 20px;
    border-radius: 12px 12px 0 0;
  }

  :deep(.el-card__body) {
    padding: 24px;
  }
}

// 步骤按钮
.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 20px;

  .prev-btn {
    padding: 10px 24px;
    border-radius: 8px;
    background-color: #fff;
    color: #409eff;
    border-color: #409eff;

    &:hover {
      background-color: #f0f9ff;
      border-color: #2563eb;
      color: #2563eb;
    }
  }

  .next-btn,
  .pay-btn,
  .confirm-booking-btn {
    padding: 10px 32px;
    border-radius: 8px;
    font-weight: 500;

    &:hover {
      opacity: 0.9;
    }
  }

  .next-btn,
  .confirm-booking-btn {
    background-color: #409eff;
    border-color: #409eff;
  }

  .pay-btn {
    background-color: #67c23a;
    border-color: #67c23a;
    padding: 10px 40px;
  }
}

// 协议弹窗
.agreement-content {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;

  .agreement-section {
    margin-bottom: 20px;

    h4 {
      color: #1f2937;
      margin: 0 0 12px 0;
      font-size: 15px;
    }

    p {
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 8px 0;
    }
  }
}

// 支付确认弹窗
.pay-confirm-content {
  padding: 10px 0;

  .pay-info-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;

    &:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 14px;
      color: #475569;
    }

    .info-value {
      font-size: 14px;
      font-weight: 500;

      &.amount {
        color: #409eff;
        font-size: 18px;
        font-weight: 600;
      }

      .balance-tip {
        margin-left: 8px;
        font-size: 12px;
        color: #ef4444;
      }
    }
  }

  .recharge-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px;
    background-color: #fef2f2;
    border-radius: 8px;
    color: #ef4444;

    .tip-icon {
      font-size: 16px;
    }

    .recharge-btn {
      margin-left: auto;
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .booking-process {
    padding: 20px 16px;
  }

  .step-actions {
    flex-direction: column;

    .prev-btn,
    .next-btn,
    .pay-btn,
    .confirm-booking-btn {
      width: 100%;
    }
  }
}
</style>