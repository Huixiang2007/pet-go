<template>
  <form class="layui-form profile-form" @submit.prevent="handleChange">
    <div class="layui-form-item">
      <label class="layui-form-label">原密码</label>
      <div class="layui-input-block">
         <div class="password-input-container">
          <input 
            :type="showOldPassword ? 'text' : 'password'" 
            name="oldPassword" 
            v-model="passwordForm.oldPassword"
            lay-verify="required|password" 
            placeholder="请输入原密码" 
            class="layui-input password-input" 
          />
          <span class="password-toggle" @click="toggleOldPasswordVisibility">
            <i class="layui-icon" :class="showOldPassword ? 'layui-icon-eye' : 'layui-icon-eye-invisible'"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">新密码</label>
      <div class="layui-input-block">
      <div class="password-input-container">
          <input 
            :type="showNewPassword ? 'text' : 'password'" 
            name="newPassword" 
            v-model="passwordForm.newPassword"
            lay-verify="required|password" 
            placeholder="请输入新密码" 
            class="layui-input password-input" 
          />
          <span class="password-toggle" @click="toggleNewPasswordVisibility">
            <i class="layui-icon" :class="showNewPassword ? 'layui-icon-eye' : 'layui-icon-eye-invisible'"></i>
          </span>
        </div>
        <p class="password-rule">密码需8-20位，包含大小写字母、数字和特殊字符</p>
        <p v-if="isSamePassword" class="password-same-warning" style="color: #e6a23c; margin-top: 5px">
          <i class="layui-icon layui-icon-tips"></i> 新密码不能与原密码相同
        </p>
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">确认密码</label>
      <div class="layui-input-block">
       <div class="password-input-container">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            name="confirmPassword" 
            v-model="passwordForm.confirmPassword"
            lay-verify="required|confirmPassword" 
            placeholder="请确认新密码" 
            class="layui-input password-input" 
          />
          <span class="password-toggle" @click="toggleConfirmPasswordVisibility">
            <i class="layui-icon" :class="showConfirmPassword ? 'layui-icon-eye' : 'layui-icon-eye-invisible'"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">邮箱</label>
      <div class="layui-input-block">
        <input 
          v-model="passwordForm.email" 
          type="text" 
          name="email" 
          placeholder="绑定的邮箱" 
          class="layui-input"
          readonly 
        />
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">验证码</label>
      <div class="layui-input-block code-input">
        <input 
          type="text" 
          name="verificationCode" 
          lay-verify="required|verificationCode" 
          v-model="passwordForm.code"
          placeholder="请输入邮箱验证码" 
          class="layui-input" 
        />
        <button style="background-color: #fd9860" type="button" class="layui-btn"
          :class="{ 'layui-btn-disabled': isSendingCode }" @click="sendVerificationCode"
          :disabled="isSendingCode">
          {{ isSendingCode ? `${countDown}s后重新发送` : '获取验证码' }}
        </button>
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn btn-save" type="submit">确认修改</button>
        <button class="layui-btn delete-btn" type="button" @click="handleCancel">取消修改</button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import {  ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { sendForgetPasswordCode } from '@/api/auth'

// 接收父组件的邮箱
const props = defineProps({
  email: { type: String, required: true }
})

// 定义事件
const emit = defineEmits(['change', 'cancel'])

// 本地状态
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  email: props.email,
  code: ''
})
const isSendingCode = ref(false)
const countDown = ref(60)
let timer: NodeJS.Timeout | null = null
// let timer: number | null = null
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
// 切换密码可见性
const toggleOldPasswordVisibility = () => {
  showOldPassword.value = !showOldPassword.value
}

const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
// 计算属性：新密码是否与原密码相同
const isSamePassword = computed(() => {
  return passwordForm.value.oldPassword && passwordForm.value.newPassword &&
    passwordForm.value.oldPassword === passwordForm.value.newPassword
})

// 初始化layui验证
if (window.layui) {
  window.layui.use('form', (form: any) => {
    form.verify({
      password: function (value: string) {
        const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
        if (!passwordReg.test(value)) {
          return '密码需8-20位，包含大小写字母、数字和特殊字符'
        }
      },
      confirmPassword: function (value: string) {
        if (value !== passwordForm.value.newPassword) {
          return '两次输入的密码不一致'
        }
      },
      verificationCode: function (value: string) {
        if (!value || value.length !== 6) {
          return '验证码长度应为6位'
        }
      }
    })
    form.on('submit(change-password)', () => {
      handleChange()
      return false
    })
  })
}

// 发送验证码
const sendVerificationCode = async () => {
  if (isSendingCode.value) return
  if (!props.email) {
    ElMessage.warning('未绑定邮箱，请先绑定邮箱！')
    return
  }

  try {
    isSendingCode.value = true
    const response = await sendForgetPasswordCode({
      email: passwordForm.value.email,
    })
    if (response.code === 0) {
      ElMessage.success('验证码已发送至您的邮箱！')
      startCountDown()
    } else {
      ElMessage.error(response.msg || '发送验证码失败！')
      isSendingCode.value = false
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送验证码失败！')
    isSendingCode.value = false
  }
}

// 开始倒计时
const startCountDown = () => {
  countDown.value = 60
  timer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      stopCountDown()
    }
  }, 1000)
}

// 停止倒计时
const stopCountDown = () => {
  if (timer) clearInterval(timer)
  timer = null
  isSendingCode.value = false
}

// 确认修改密码
const handleChange = () => {

  // 添加本地验证逻辑
  if (!passwordForm.value.oldPassword) {
    ElMessage.warning('请输入原密码！')
    return
  }
  
  if (!passwordForm.value.newPassword) {
    ElMessage.warning('请输入新密码！')
    return
  }
  
  if (!passwordForm.value.confirmPassword) {
    ElMessage.warning('请确认新密码！')
    return
  }
  
  if (!passwordForm.value.code) {
    ElMessage.warning('请输入验证码！')
    return
  }
  
  // 检查密码格式
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
  if (!passwordReg.test(passwordForm.value.newPassword)) {
    ElMessage.warning('密码需8-20位，包含大小写字母、数字和特殊字符')
    return
  }
  
  // 检查两次输入的密码是否一致
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  
  // 检查新密码是否与原密码相同
  if (isSamePassword.value) {
    ElMessage.warning('新密码不能与原密码相同！')
    return
  }
  // 通知父组件修改
  emit('change', passwordForm.value)

}

// 取消修改
const handleCancel = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: props.email,
    code: ''
  }
  emit('cancel')
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.profile-form {
  max-width: 600px;
}

:deep(.layui-form-label) {
  width:87px;
}
.password-input-container {
  position: relative;
}

.password-input {
  padding-right: 30px;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
}

.password-toggle:hover {
  color: #fd9860;
}
.password-rule {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
}

.code-input {
  display: flex;
  gap: 0.5rem;
}

.code-input .layui-input {
  flex: 1;
}

.layui-btn-disabled {
  background-color: #f5f5f5 !important;
  border-color: #ddd !important;
  color: #999 !important;
  cursor: not-allowed !important;
}

.layui-input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-save {
  background-color: #fd9860;
  border-color: #fd9860;
  min-width: 120px;
}

.btn-save:hover {
  background-color: #fc8747;
  border-color: #fc8747;
}

.delete-btn {
  min-width: 120px;
  border-color: #d2d2d2;
  background: 0 0;
  color: #5f5f5f;
}

.delete-btn:hover {
  border-color: #fd9860;
  color: #fd9860;
}

.layui-input:focus {
  border-color: #fd9860 !important;
  box-shadow: 0 0 0 3px #fd98600f;
}
</style>