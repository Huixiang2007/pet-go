import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getForecast } from '@/api/foster-care'
import { useBookingFormStore } from '@/stores/booking'

interface previewDaysOptions {
  index: number
  date: string
  day: number
  spots: number
  month: number
  displayDate: string
}
export const useDateCalculator = (serviceId: number) => {
  const bookingFormStore = useBookingFormStore()
  const bookingForm = bookingFormStore.bookingForm
  const realDaySpots = ref<number[]>([])
  const getDaySpots = async () => {
    const res = await getForecast(serviceId)
    if (res.code === 0) {
      realDaySpots.value = res.data
      console.log(realDaySpots.value)
    }
  }
  // 最大连续可预订天数
  const maxStayDays = computed(() => {
    let maxDays = 0
    let currentDays = 0

    for (let i = 0; i < realDaySpots.value.length; i++) {
      const spot = realDaySpots.value[i]
      if (spot !== undefined && spot > 0) {
        currentDays++
        maxDays = Math.max(maxDays, currentDays)
      } else {
        currentDays = 0
      }
    }
    return Math.min(maxDays, 30)
  })
  // 预览天数
  const previewDays = computed(() => {
    const days: previewDaysOptions[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const dateStr = formatDateToYYYYMMDD(date)
      const spots = realDaySpots.value[i]
      console.log('spots', spots)
      if (spots !== undefined) {
        console.log('spots', spots)
        days.push({
          index: i,
          date: dateStr,
          day: date.getDate(),
          month: date.getMonth() + 1,
          spots: spots,
          displayDate: `${date.getMonth() + 1}月${date.getDate()}日`,
        })
      }
    }

    return days
  })
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
  const formatDisplayDateWithYear = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
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
    if (!bookingForm.startDate && !bookingForm.endDate) return false
    if (!bookingForm.endDate) return dateStr === bookingForm.startDate

    const date = new Date(dateStr)
    const start = new Date(bookingForm.startDate)
    const end = new Date(bookingForm.endDate)

    return date >= start && date <= end
  }

  // 预览日期点击
  const onPreviewDayClick = (day: previewDaysOptions) => {
    if (day.spots === 0) {
      ElMessage.warning(`${day.displayDate} 已无空位，请选择其他日期`)
      return
    }
    console.log(day.date)
    if (!bookingForm.startDate || (bookingForm.startDate && bookingForm.endDate)) {
      // 重新选择
      bookingForm.startDate = day.date
      bookingForm.endDate = ''
      validateDateRange(day.date, '')
    } else if (bookingForm.startDate && !bookingForm.endDate) {
      const start = new Date(bookingForm.startDate)
      const end = new Date(day.date)

      if (end < start) {
        // 如果选择的结束日期在开始日期之前，交换
        bookingForm.endDate = bookingForm.startDate
        bookingForm.startDate = day.date
      } else {
        bookingForm.endDate = day.date
      }
      validateDateRange(bookingForm.startDate, bookingForm.endDate)
    }
    console.log(bookingForm.startDate, bookingForm.endDate)
  }

  // 验证日期范围
  const validateDateRange = (startStr: string, endStr: string) => {
    if (!startStr) {
      return
    }

    const startIndex = getDateIndex(startStr)
    const endIndex = getDateIndex(endStr)
    // 检查范围内的每一天都有空位
    let hasNoAvailability = false

    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= realDaySpots.value.length || realDaySpots.value[i] === undefined) {
        hasNoAvailability = true
        break
      }
      if (realDaySpots.value[i] === 0) {
        hasNoAvailability = true
      }
    }

    if (hasNoAvailability) {
      // 自动调整结束日期
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const newEndDate = new Date(today)

      // 找到第一个空位为0的日期
      for (let i = startIndex; i <= endIndex; i++) {
        if (realDaySpots[i] == 0) {
          newEndDate.setDate(today.getDate() + Math.max(startIndex, i - 1))
          break
        }
      }
      console.log(newEndDate)
      setTimeout(() => {
        if (bookingForm.startDate === startStr && bookingForm.endDate === endStr) {
          bookingForm.endDate = formatDateToYYYYMMDD(newEndDate)
          ElMessage.info('已自动调整结束日期，避开不可预订日期')
        }
      }, 100)
    }
  }
  const calculateStayDays = (): number => {
    if (!bookingForm.startDate || !bookingForm.endDate) return 0
    const start = new Date(bookingForm.startDate)
    const end = new Date(bookingForm.endDate)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }
  return {
    bookingForm,
    realDaySpots,
    maxStayDays,
    previewDays,
    getDaySpots,
    formatDateToYYYYMMDD,
    formatDisplayDate,
    formatDisplayDateWithYear,
    isToday,
    isDaySelected,
    onPreviewDayClick,
    calculateStayDays,
  }
}
