<template>
  <div class="verification-code">
    <div class="layui-input-wrap">
      <div class="layui-input-prefix">
        <i class="layui-icon layui-icon-email"></i>
      </div>
      <input type="text" v-model="email" lay-verify="required" @input="handleEmailInput" :placeholder="placeholder"
        autocomplete="off" class="layui-input" :class="inputClass" :disabled="disabled" />
    </div>

    <div class="verification-button-container">
      <button type="button" class="layui-btn layui-btn-fluid layui-btn-primary " 
          :class="[
                 buttonClass,
                 isDisabled ? 'layui-btn-disabled' : ''  
            ]"
         @click="sendCode"
        :disabled="isDisabled">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, readonly, defineProps, defineEmits, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'

// 1. 定义Props（替代Vue2的props选项）
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入邮箱',
  },
  inputClass: {
    type: String,
    default: '',
  },
  buttonClass: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  emailPattern: {
    type: RegExp,
    default: () => /^[1-9]\d+@qq\.com$/,
  },
  emailErrorMessage: {
    type: String,
    default: '请输入正确的QQ邮箱格式',
  },
  sendButtonText: {
    type: String,
    default: '获取验证码',
  },
  resendButtonText: {
    type: String,
    default: '重新发送',
  },
  sendingText: {
    type: String,
    default: '发送中...',
  },
  countdownSeconds: {
    type: Number,
    default: 60,
  },
})

// 2. 定义Emits（替代Vue2的emits选项）
const emit = defineEmits(['update:modelValue', 'send'])

// 3. 响应式数据（替代Vue2 setup中的ref定义）
const email = ref(props.modelValue)
const countdown = ref(0)
const isSending = ref(false)
const timer = ref<number | null>(null)

// 4. 计算属性（逻辑不变）
const isDisabled = computed(() => {
  return props.disabled || isSending.value || countdown.value > 0
})

const buttonText = computed(() => {
  if (isSending.value) return props.sendingText
  if (countdown.value > 0) return `${countdown.value}s后${props.resendButtonText}`
  return props.sendButtonText
})

// 5. 监听modelValue变化（逻辑不变）
watch(
  () => props.modelValue,
  (newValue) => {
    email.value = newValue
  },
)

// 6. 方法定义（所有方法直接声明，无需return）
// 处理邮箱输入
const handleEmailInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  email.value = target.value
  emit('update:modelValue', target.value)
}

// 验证邮箱
const validateEmail = (): boolean => {
  if (!email.value) {
    ElMessage.error('请输入邮箱地址')
    return false
  }

  if (!props.emailPattern.test(email.value)) {
    ElMessage.error(props.emailErrorMessage)
    return false
  }

  return true
}

// 发送验证码
const sendCode = () => {
  if (!validateEmail() || isDisabled.value) {
    return
  }

  isSending.value = true
  // 触发父组件的send事件
  emit('send', email.value)
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = props.countdownSeconds
  isSending.value = false
  if (timer.value) {
    clearInterval(timer.value)
  }

  timer.value = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      stopCountdown()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  countdown.value = 0
  isSending.value = false
}

// 重置组件状态
const reset = () => {
  stopCountdown()
  isSending.value = false
  email.value = ''
}

// 7. 生命周期（逻辑不变）
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// 8. 暴露方法/属性给父组件（替代Vue2的defineExpose）
defineExpose({
  email,
  isDisabled,
  buttonText,
  handleEmailInput,
  sendCode,
  startCountdown,
  stopCountdown,
  reset,
  isSending: readonly(isSending),
  countdown: readonly(countdown),
})
</script>

<style scoped>
.verification-code {
  display: flex;
  gap: 1px;
}

.verification-button-container {
  flex-shrink: 0;
  width: 35%;
}

.layui-input-wrap {
  flex: 1;
}

.layui-input:focus,
.layui-textarea:focus {
  border-color: rgb(253, 152, 96) !important;
}

.layui-btn {
  padding: 0 2px;
  background-color: rgb(253, 152, 96);
}

.layui-input:focus {
  border-color: rgb(253, 152, 96) !important;
  box-shadow: 0 0 3px 1px rgba(253, 152, 96, 0.3) !important;
}

.layui-checkbox:hover .layui-checkbox {
  border-color: rgb(253, 152, 96);
}

.layui-btn-primary:hover {
  border: none;
}

.layui-input-wrap .layui-input {
  padding-right: 0px !important;
}

.layui-btn-primary {
  color: aliceblue;
  border: none;
}

.layui-btn-primary:focus {
  border: none;
}
</style>