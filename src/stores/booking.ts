import { defineStore } from 'pinia'
import type { FosterServiceItem, AdditionalServiceItem } from '@/types/foster'
import { reactive } from 'vue'
export const useBookingPackageStore = defineStore('booking', {
  state: () => ({
    selectedPackage: null as FosterServiceItem | null,
    // fosterHome: null as any | null,
    // bookingForm: {} as any,
  }),
  actions: {
    setSelectedPackage(packageInfo: FosterServiceItem) {
      this.selectedPackage = packageInfo
    },
    clearBookingData() {
      this.selectedPackage = null
      // this.bookingForm = {}
    },
  },
})
export const useBookingFormStore = defineStore('bookingForm', () => {
  // 全局共享的 bookingForm
  const bookingForm = reactive({
    petName: '',
    serviceId: 0,
    startDate: '',
    endDate: '',
    petType: '',
    additionalServices: [] as AdditionalServiceItem[],
    additionalServiceId: [] as number[],
    specialRequirements: '',
    emergencyPhone: '',
    userNotes: '',
    pictureUrlList: [] as File[],
    vaccineUrls: [] as string[],
  })
  // 重置表单
  const resetBookingForm = (serviceId: number) => {
    bookingForm.serviceId = serviceId
    bookingForm.petName = ''
    bookingForm.petType = ''
    bookingForm.additionalServiceId = []
    bookingForm.specialRequirements = ''
    bookingForm.emergencyPhone = ''
    bookingForm.pictureUrlList = []
    bookingForm.vaccineUrls = []
  }

  // 更新附加服务
  const updateAdditionalServiceIds = (ids: number[]) => {
    bookingForm.additionalServiceId = ids
  }

  return {
    bookingForm,
    resetBookingForm,
    updateAdditionalServiceIds,
  }
})
