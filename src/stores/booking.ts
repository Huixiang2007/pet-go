import { defineStore } from 'pinia'
interface PackageItem {
  id: number
  title: string
  basePrice: number
  description: string
  petTypes: string[]
  maxPets: number
  serviceType: number
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    selectedPackage: null as PackageItem | null,
    // fosterHome: null as any | null,
    // bookingForm: {} as any,
  }),
  actions: {
    setSelectedPackage(packageInfo: PackageItem) {
      this.selectedPackage = packageInfo
    },
    clearBookingData() {
      this.selectedPackage = null
      // this.bookingForm = {}
    },
  },
})
