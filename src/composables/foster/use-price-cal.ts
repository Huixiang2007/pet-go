import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { getAdditionalServices } from '@/api/foster-care'
import type { AdditionalServicePageData } from '@/types/foster'
import type { ApiResponse } from '@/types/api'
import { useBookingFormStore } from '@/stores/booking'

export const usePriceCalculator = (
  selectedPackage: ComputedRef<any>,
  calculateStayDays: () => number,
) => {
  const bookingFormStore = useBookingFormStore()
  const bookingForm = bookingFormStore.bookingForm
  // 获取附加服务列表
  const fetchAdditionalServices = async () => {
    if (!selectedPackage.value?.id) return

    try {
      const res: ApiResponse<AdditionalServicePageData> = await getAdditionalServices(
        selectedPackage.value.id,
      )
      if (res.code === 0) {
        console.log(res)
        bookingForm.additionalServices = res.data.list
      }
    } catch (error) {
      console.error('获取附加服务失败：', error)
    }
  }
  //计算附加服务总费用
  const additionalServiceTotalFee = computed(() => {
    return bookingForm.additionalServiceId.reduce((sum, id) => {
      console.log('additionalServices', bookingForm.additionalServices)
      const service = bookingForm.additionalServices.find((s) => s.id === id)
      return sum + (service?.price || 0)
    }, 0)
  })

  // 基础费用
  const basePrice = computed(() => {
    const days = calculateStayDays()
    console.log(selectedPackage.value.basePrice)
    return selectedPackage.value.basePrice * days
  })
  //总费用
  const calculateTotalPrice = computed(() => {
    const days = calculateStayDays()
    if (days === 0 || !selectedPackage.value) return 0
    return basePrice.value + additionalServiceTotalFee.value
  })
  return {
    fetchAdditionalServices,
    additionalServiceTotalFee,
    basePrice,
    calculateTotalPrice,
  }
}
