import { ref, computed, onMounted } from 'vue'
import { getMyPets } from '@/api/foster-care'
import { useBookingFormStore } from '@/stores/booking'
export const useBookingForm = () => {
  const userId = localStorage.getItem('userId')
  const bookingFormStore = useBookingFormStore()
  const bookingForm = bookingFormStore.bookingForm
  //   bookingFormStore.resetBookingForm(serviceId)
  //宠物数据
  const myPets = ref([])
  const getPets = async () => {
    const res = await getMyPets(Number(userId))
    console.log('获取宠物数据成功', res)
    if (res.code === 0) {
      myPets.value = res.data.map((pet) => ({
        id: pet.id,
        name: pet.name,
        type: pet.type,
      }))
    }
  }

  const petTypeOptions = ref([
    { id: 1, type: '狗' },
    { id: 2, type: '猫' },
    { id: 3, type: '蛇' },
  ])
  //宠物切换
  const onPetChange = (petName: string) => {
    const pet = myPets.value.find((p) => p.name === petName)
    if (pet) {
      bookingForm.petName = pet.name
    }
  }
  // 手机号验证
  const isPhoneValid = computed(() => {
    if (!bookingForm.emergencyPhone) return true
    const phoneReg = /^1[3-9]\d{9}$/
    return phoneReg.test(bookingForm.emergencyPhone)
  })

  onMounted(() => {
    getPets()
  })
  return {
    bookingForm,
    myPets,
    petTypeOptions,
    isPhoneValid,
    onPetChange,
    getPets,
  }
}
