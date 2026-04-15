<!-- 支付确认弹窗组件 PayConfirmDialog.vue -->
<template>
  <!-- 使用teleport挂载到body，避免样式嵌套问题 -->
  <teleport to="body">
    <el-dialog
      v-model="innerVisible"
      title="确认支付"
      class="custom-dialog"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleBeforeClose"
    >
      <div class="pay-confirm-content">
        <!-- 应付金额 -->
        <div class="pay-info-item">
          <span class="info-label">应付金额：</span>
          <span class="info-value amount">{{ calculateTotalPrice }} 元</span>
        </div>

        <!-- 账户余额 -->
        <div class="pay-info-item">
          <span class="info-label">账户余额：</span>
          <span class="info-value" :class="{ 'text-red-500': userBalance < calculateTotalPrice }">
            {{ userBalance }} 元
            <span v-if="userBalance < calculateTotalPrice" class="balance-tip">（余额不足）</span>
          </span>
        </div>

        <!-- 余额不足提示 -->
        <div v-if="userBalance < calculateTotalPrice" class="recharge-tip">
          <el-icon class="tip-icon">
            <Warning />
          </el-icon>
          <span>余额不足，是否前往充值？</span>
          <el-button type="primary" size="small" class="recharge-btn" @click="handleRecharge">
            立即充值
          </el-button>
        </div>
      </div>

      <!-- 弹窗底部按钮 -->
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handlePayConfirm"
          :disabled="userBalance < calculateTotalPrice"
          :loading="isPayLoading"
        >
          确认支付
        </el-button>
      </template>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Warning } from '@element-plus/icons-vue'

const props = defineProps<{
  orderNo: number | string
  calculateTotalPrice: number
  userBalance: number
  modelValue: boolean
}>()

// 定义组件事件
const emit = defineEmits<{
  'go-to-recharge': []
  'update:modelValue': [value: boolean]
  'pay-success': []
}>()

const innerVisible = ref(props.modelValue)
const isPayLoading = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    innerVisible.value = newVal
    if (!newVal) isPayLoading.value = false
  },
  { immediate: true },
)

// 监听内部状态变化，同步给父组件
watch(
  () => innerVisible.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
)

// 关闭弹窗
const closeDialog = () => {
  innerVisible.value = false
}

const handleBeforeClose = () => {
  isPayLoading.value = false
  return true
}

// 前往充值
const handleRecharge = () => {
  emit('go-to-recharge')
  closeDialog()
}

// 确认支付
const handlePayConfirm = async () => {
  try {
    isPayLoading.value = true
    const res = await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(res)
    emit('pay-success')
    closeDialog()
  } catch (error) {
    console.error('支付失败：', error)
  } finally {
    isPayLoading.value = false
  }
}
</script>

<style scoped lang="scss">
:deep(.custom-dialog) {
  --el-dialog-margin-top: 22vh;
  --el-dialog-border-radius: 8px;
}

// 支付确认内容区
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

  // 余额不足提示
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
      --el-button-padding: 6px 12px;
    }
  }
}

// 禁用状态的支付按钮样式优化
:deep(.el-button.is-disabled) {
  background-color: #ccc !important;
  border-color: #ccc !important;
  cursor: not-allowed;
}
</style>
