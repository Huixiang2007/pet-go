import { defineStore } from 'pinia'
import { ref } from 'vue'
interface PackageItem {
  id: string
  name: string
  price: number
  availableSpots: number
  type: string
  description: string
  petTypes: string[]
  serviceHours: string
  features: string[]
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    selectedPackage: null as PackageItem | null,
    fosterHome: null as any | null,
    bookingForm: {} as any,
  }),
  actions: {
    setSelectedPackage(packageInfo: PackageItem) {
      this.selectedPackage = packageInfo
    },
    clearBookingData() {
      this.selectedPackage = null
      this.bookingForm = {}
    },
  },
})
