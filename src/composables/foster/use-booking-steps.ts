import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { ElMessage } from 'element-plus'
export const useBookingSteps = (
  bookingForm: any,
  agreedToTerms: Ref<boolean>,
  userBalance: Ref<number>,
  calculateTotalPrice: ComputedRef<number>,
) => {
  // 步骤状态
  const currentStep = ref(1)
  const processing = ref(false)
  const isStepValidated = ref({ 1: false, 2: false, 3: false, 4: false })

  // 弹窗控制
  const showAgreement = ref(false)
  const showPayConfirmDialog = ref(false)

  // 步骤权限校验
  const canProceed = computed(() => {
    console.log('canProceed', bookingForm)
    switch (currentStep.value) {
      case 1:
        return (
          bookingForm.petName !== '' &&
          bookingForm.petType !== '' &&
          bookingForm.emergencyPhone !== '' &&
          bookingForm.additionalServiceId.length > 0 &&
          bookingForm.pictureUrlList.length > 0
        )
      case 2:
        return bookingForm.startDate && bookingForm.endDate
      case 3:
        return true
      case 4:
        return agreedToTerms.value
      default:
        return true
    }
  })

  // 支付权限校验
  const canConfirmPayment = computed(() => {
    return (
      agreedToTerms.value &&
      bookingForm.petName !== '' &&
      bookingForm.startDate &&
      bookingForm.endDate &&
      userBalance.value >= calculateTotalPrice.value
    )
  })
  // 步骤控制
  const nextStep = async () => {
    console.log(bookingForm)
    isStepValidated.value[currentStep.value] = true
    if (!canProceed.value) {
      if (currentStep.value === 1) {
        ElMessage.warning('请将信息填写完整！')
      } else if (currentStep.value === 2) {
        ElMessage.warning('请选择完整的寄养日期！')
      }
      return
    }

    processing.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      currentStep.value++
      console.log(currentStep.value)
    } catch (error) {
      console.error(error)
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
  return {
    currentStep,
    processing,
    isStepValidated,
    showAgreement,
    showPayConfirmDialog,
    canProceed,
    canConfirmPayment,
    nextStep,
    previousStep,
  }
}
