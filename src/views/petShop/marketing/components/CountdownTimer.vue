<template>
  <div class="countdown">
    <div v-if="isExpired" class="countdown-expired">
      {{ expiredText }}
    </div>
    <div v-else class="countdown-items">
      <div class="countdown-item">{{ formatNumber(hours) }}</div>
      <span class="countdown-separator">:</span>
      <div class="countdown-item">{{ formatNumber(minutes) }}</div>
      <span class="countdown-separator">:</span>
      <div class="countdown-item">{{ formatNumber(seconds) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  endTime: string | number
  expiredText?: string
}

const props = withDefaults(defineProps<Props>(), {
  expiredText: '活动已结束',
})

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const isExpired = ref(false)
let timer: number | null = null

const formatNumber = (num: number) => {
  return num.toString().padStart(2, '0')
}

const updateCountdown = () => {
  const now = Date.now()
  const end = typeof props.endTime === 'string' ? new Date(props.endTime).getTime() : props.endTime
  const diff = end - now

  if (diff <= 0) {
    isExpired.value = true
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return
  }

  hours.value = Math.floor(diff / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
}

onMounted(() => {
  updateCountdown()
  timer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.countdown {
  display: flex;
  align-items: center;
}

.countdown-expired {
  color: #999;
  font-size: 14px;
}

.countdown-items {
  display: flex;
  align-items: center;
}

.countdown-item {
  width: 32px;
  height: 32px;
  background: #333;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.countdown-separator {
  margin: 0 4px;
  color: #333;
  font-weight: bold;
}
</style>
