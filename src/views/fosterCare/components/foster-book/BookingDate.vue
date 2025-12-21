<!-- src/components/foster/BookingStep2Date.vue -->
<template>
  <el-card shadow="never" class="info-card">
    <template #header>
      <div class="card-header">
        <h3 class="header-title">选择寄养日期</h3>
        <span class="header-subtitle mt-3">最多可选择 {{ maxStayDays }} 天</span>
      </div>
    </template>

    <div class="date-preview">
      <div class="preview-header">
        <div class="preview-title">30天可用性预览</div>
        <div class="preview-legend">
          <div class="legend-item">
            <div class="legend-color available"></div>
            <span class="legend-text">可预订</span>
          </div>
          <div class="legend-item">
            <div class="legend-color unavailable"></div>
            <span class="legend-text">已满</span>
          </div>
          <div class="legend-item">
            <div class="legend-color selected"></div>
            <span class="legend-text">已选择</span>
          </div>
        </div>
      </div>

      <div class="preview-grid">
        <div v-for="(day, index) in previewDays" :key="index" class="preview-day" :class="{
          available: day.spots > 0,
          unavailable: day.spots === 0,
          selected: isDaySelected(day.date),
          today: isToday(day.date),
        }" @click="onPreviewDayClick(day)">
          <div class="day-number">{{ day.displayDate }}</div>
          <div class="day-spots" v-if="day.spots > 0">空位：{{ day.spots }}</div>
          <div class="day-full" v-else>满</div>
          <div class="day-today" v-if="isToday(day.date)">今</div>
        </div>
      </div>

      <div class="result-dates">
        <div class="result-label">寄养时间：</div>
        <div class="result-value" v-if="bookingForm.startDate && bookingForm.endDate">
          {{ formatDisplayDateWithYear(bookingForm.startDate) }} 至
          {{ formatDisplayDateWithYear(bookingForm.endDate) }}
        </div>
        <div class="result-value" v-else-if="bookingForm.startDate">
          {{ formatDisplayDateWithYear(bookingForm.startDate) }}
          <span class="result-hint">请选择结束日期</span>
        </div>
        <div class="result-placeholder" v-else>请选择寄养日期</div>
      </div>

      <div class="result-price">
        <div class="price-label">基础费用：</div>
        <div class="price-value">
          <span class="price-number">{{ basePrice }}</span>
          <span class="price-unit">元</span>
        </div>
      </div>

      <div class="result-price mt-2">
        <div class="price-label">附加服务费用：</div>
        <div class="price-value">
          <span class="price-number">{{ additionalServiceTotalFee }}</span>
          <span class="price-unit">元</span>
        </div>
      </div>

      <div class="result-price mt-2">
        <div class="price-label">订单总费用：</div>
        <div class="price-value">
          <span class="price-number">{{ calculateTotalPrice }}</span>
          <span class="price-unit">元</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDateCalculator } from '@/composables/foster/use-date-cal'
import { usePriceCalculator } from '@/composables/foster/use-price-cal'
import { useBookingPackageStore } from '@/stores/booking'

// Props
const props = defineProps<{
  serviceId: number
}>()
// Store
const bookingStore = useBookingPackageStore()
const selectedPackage = computed(() => bookingStore.selectedPackage)
// 日期逻辑
const {
  bookingForm,
  previewDays,
  maxStayDays,
  getDaySpots,
  formatDisplayDateWithYear,
  isToday,
  isDaySelected,
  onPreviewDayClick,
  calculateStayDays
} = useDateCalculator(props.serviceId)

// 价格逻辑
const {
  additionalServiceTotalFee,
  basePrice,
  calculateTotalPrice
} = usePriceCalculator(selectedPackage, calculateStayDays)


onMounted(() => {
  getDaySpots()

})

// 暴露给父组件的属性
defineExpose({
  calculateTotalPrice
})
</script>

<style scoped lang="scss">
.date-preview {
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .preview-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
    }

    .preview-legend {
      display: flex;
      gap: 16px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .available {
          background-color: #e0f2fe;
          border: 1px solid #409eff;
        }

        .unavailable {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
        }

        .selected {
          background-color: #409eff;
          border: 1px solid #2563eb;
        }

        .legend-text {
          font-size: 12px;
          color: #475569;
        }
      }
    }
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 24px;

    .preview-day {
      aspect-ratio: 1;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      padding: 8px;

      .day-number {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .day-spots {
        font-size: 12px;
        color: #16a34a;
      }

      .day-full {
        font-size: 12px;
        color: #ef4444;
      }

      .day-today {
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 10px;
        color: #fff;
        background: #16a34a;
        border-radius: 2px;
        padding: 0 3px;
      }

      &.available {
        background-color: #f0f9ff;
        border: 1px solid #94a3b8;

        &:hover {
          background-color: #e0f2fe;
          border-color: #409eff;
          transform: translateY(-2px);
        }
      }

      &.unavailable {
        background-color: #fef2f2;
        border: 1px solid #fecdd3;
        cursor: not-allowed;
        opacity: 0.7;
      }

      &.selected {
        background-color: #409eff;
        color: #fff;
        border-color: #2563eb;

        .day-spots {
          color: #dcfce7;
        }

        &:hover {
          background-color: #e0f2fe;
          color: #409eff;

          .day-spots {
            color: #409eff;
          }
        }
      }

      &.today {
        border-width: 2px;
      }
    }
  }

  .result-dates,
  .result-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f8fafc;
    border-radius: 8px;
    margin-bottom: 12px;

    .result-label,
    .price-label {
      font-size: 14px;
      color: #475569;
      font-weight: 500;
    }

    .result-value,
    .price-value {
      font-size: 15px;
      color: #1e293b;

      .result-hint {
        font-size: 14px;
        color: #f59e0b;
        margin-left: 8px;
      }

      .price-number {
        font-size: 18px;
        font-weight: 600;
        color: #409eff;
        margin-right: 4px;
      }
    }

    .result-placeholder {
      font-size: 14px;
      color: #94a3b8;
      font-style: italic;
    }
  }
}
</style>