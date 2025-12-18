<template>
  <div class="demo-goLogin demo-login">
    <transition name="box-animation">
      <form class="layui-form demo-login-container" v-if="isRegister" @submit.prevent="handleSubmit">
        <div class="container">
          <img src="../../assets/img/logo.png" alt="这是图标" class="logo" />

          <div class="title">
            <!-- 遍历字符数组，每个字符一个span，添加索引对应的延迟动画 -->
            <span v-for="(char, index) in titleRegisterChars" :key="index"
              :style="{ animationDelay: `${index * 100}ms` }" class="char">
              {{ char }}
            </span>
          </div>
        </div>

        <div class="demo-reg-container">
          <div class="layui-form-item">
            <div class="layui-row">
              <div class="layui-col-xs7">
                <ConfirmCode v-model="form.email" placeholder="QQ邮箱" :is-sending="isSending"
                  @send="SendVerificationCode" ref="ConfirmCodeRef" />
              </div>
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-vercode"></i>
              </div>
             <input type="text" name="vercode" v-model="form.vercode"
                lay-verify="required" placeholder="验证码" lay-reqtext="请填写验证码" autocomplete="off" class="layui-input" 
                :class="{ 'error-border': errors.vercode }" />
              <div v-if="errors.vercode" class="error-text">{{ errors.vercode }}</div>
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-password"></i>
              </div>
               <input :type="passwordVisible ? 'text' : 'password'" name="password" lay-verify="required|password" v-model="form.password"
                placeholder="密码" autocomplete="off" class="layui-input layui-input-password" id="reg-password"
                :class="{ 'error-border': errors.password }" @blur="validatePassword" />
                 <div class="layui-input-suffix">
                <i class="layui-icon" 
                  :class="passwordVisible ? 'layui-icon-eye' : 'layui-icon-eye-invisible'" 
                  @click="togglePasswordVisibility('password')"></i>
              </div>
              <div v-if="errors.password" class="error-text">{{ errors.password }}</div>
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-password"></i>
              </div>
              <input :type="confirmPasswordVisible ? 'text' : 'password'" name="confirmPassword" lay-verify="required|confirmPassword" v-model="form.confirm"
                placeholder="确认密码" autocomplete="off" class="layui-input layui-input-password" id="confirm-password"
                :class="{ 'error-border': errors.confirm }" @blur="validateConfirmPassword" />
              <div class="layui-input-suffix">
                <i class="layui-icon" 
                  :class="confirmPasswordVisible ? 'layui-icon-eye' : 'layui-icon-eye-invisible'" 
                  @click="togglePasswordVisibility('confirm')"></i>
              </div>
              <div v-if="errors.confirm" class="error-text">{{ errors.confirm }}</div>
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-username"></i>
              </div>
              <input type="text" name="nickname" lay-verify="required|nickname" placeholder="账号" v-model="form.name"
                autocomplete="off" class="layui-input" lay-affix="clear"
                :class="{ 'error-border': errors.name }" @blur="validateNickname" />
              <div v-if="errors.name" class="error-text">{{ errors.name }}</div>
            </div>
          </div>
          <div class="layui-form-item">
            <div class="agreement-item">
              <input v-model="isAgreed" type="checkbox" id="agree" class="agreement-checkbox"
                style="display: block" lay-ignore />
              <label class="agreement-label">
                我已阅读并同意<span class="agreement-link" @click="toProtocal">用户服务协议</span>
              </label>
            </div>
            <p v-if="showError" class="error-message">
              <span class="error-icon">⚠</span>请阅读并同意用户服务协议
            </p>
          </div>
          <div class="layui-form-item">
            <button class="layui-btn btn-donate" type="submit">
              注册
            </button>
          </div>
          <div class="layui-form-item demo-reg-other fontSet">
            <span @click="toLogin" class="goLogin">登录已有帐号</span>
          </div>
        </div>
      </form>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRegisterStore } from '@/stores/register'
import ConfirmCode from '@/components/common/ConfirmCode.vue'
import { register, sendVerificationCode } from '@/api/auth'

interface ConfirmCodeExposed {
  startCountdown: () => void;
}

interface FormErrors {
  vercode?: string;
  password?: string;
  confirm?: string;
  name?: string;
}

const ConfirmCodeRef = ref<InstanceType<typeof ConfirmCode> & ConfirmCodeExposed | null>(null);
const registerStore = useRegisterStore()
const router = useRouter()
const route = useRoute()
const isRegister = ref(false)
const form = registerStore.form
const titleRegisterChars = '欢迎注册 PetGo'.split('')
const isSending = ref(false)
const isAgreed = ref(false)
const showError = ref(false)
const registerActive = ref(false)
const errors = reactive<FormErrors>({})
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

// 表单验证规则
const validateEmail = () => {
  const qqEmailReg = /^[1-9]\d+@qq\.com$/
  if (!form.email) {
    return '请输入QQ邮箱'
  }
  if (!qqEmailReg.test(form.email)) {
    return '请输入正确的QQ邮箱格式'
  }
  return ''
}
// 切换密码可见性
const togglePasswordVisibility = (field: 'password' | 'confirm') => {
  if (field === 'password') {
    passwordVisible.value = !passwordVisible.value
  } else {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  }
}
const validateVercode = () => {
  if (!form.vercode) {
    return '请填写验证码'
  }
  return ''
}

const validatePassword = () => {
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
  if (!form.password) {
    errors.password = '请填写密码'
    return false
  }
  if (!passwordReg.test(form.password)) {
    errors.password = '密码需8-20位，包含大小写字母、数字和特殊字符'
    return false
  }
  errors.password = ''
  return true
}

const validateConfirmPassword = () => {
  if (!form.confirm) {
    errors.confirm = '请确认密码'
    return false
  }
  if (form.confirm !== form.password) {
    errors.confirm = '两次密码输入不一致'
    return false
  }
  errors.confirm = ''
  return true
}

const validateNickname = () => {
  const nicknameReg = /^[a-zA-Z][a-zA-Z0-9]{5,19}$/
  if (!form.name) {
    errors.name = '请输入账号'
    return false
  }
  if (!nicknameReg.test(form.name)) {
    errors.name = '账号必须是6-20位字母、数字，首位不能为数字'
    return false
  }
  errors.name = ''
  return true
}

const validateForm = () => {
  // 清除之前错误
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
  
  // 验证所有字段
  const isPasswordValid = validatePassword()
  const isConfirmValid = validateConfirmPassword()
  const isNicknameValid = validateNickname()
  
  errors.vercode = validateVercode()
  
  return isPasswordValid && isConfirmValid && isNicknameValid && !errors.vercode
}

const handleSubmit = async () => {
  if (registerActive.value) return
  registerActive.value = true
  
  // 校验表单
  if (!validateForm()) {
    registerActive.value = false
    return
  }
  
  // 校验协议勾选状态
  if (!isAgreed.value) {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 3000)
    registerActive.value = false
    return
  }
  
  try {
    // 调用注册接口
    const response = await register({
      email: form.email,
      code: form.vercode,
      password: form.password,
      account: form.name,
    })
    
    if (response.code === 0) {
      const { token, userId } = response.data
      
      // 存储token到localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('userId', userId)
      ElMessage.success('注册成功')
      
      // 注册成功后清空表单并跳转到登录页
      registerStore.clearForm()
      router.push('/foster-care')
    } else {
      ElMessage.error(response.msg || '注册失败')
    }
  } catch (error) {
    ElMessage.error('注册失败: ' + (error as Error).message)
  } finally {
    registerActive.value = false
  }
}

// 发送验证码
const SendVerificationCode = async (email: string) => {
  try {
    const errorMsg = validateEmail()
    if (errorMsg) {
      ElMessage.error(errorMsg)
      return
    }
    
    isSending.value = true
    
    const response =await sendVerificationCode({ email: email })
    
    if (response.code == 0) {
      ElMessage.success('验证码发送成功')
      setTimeout(() => {
        if (ConfirmCodeRef.value && typeof ConfirmCodeRef.value.startCountdown === 'function') {
          ConfirmCodeRef.value.startCountdown()
        }
      }, 100)
    } else {
      ElMessage.error(response.msg || '验证码发送失败')
    }
  } catch (error) {
    ElMessage.error('发送验证码失败: ' + (error as Error).message)
  } finally {
    isSending.value = false
  }
}



onMounted(() => {
  
  isRegister.value = true
  const agreementCheck = route.query.isAgreed === 'true'
  if (agreementCheck) {
    isAgreed.value = true
  }
})

/**
 * 组件卸载时清理资源（防止内存泄漏）
 */
onUnmounted(() => {
  // 清理工作已经在onUnmounted中完成
})

const toLogin = () => {
  router.push('/login')
}

const toProtocal = () => {
  router.push('/protocal')
}
</script>

<style scoped>


.layui-input-suffix {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
    z-index: 10; /* 确保图标在输入框上方 */
  pointer-events: auto; /* 确保可以接收点击事件 */
  cursor: pointer;
}

.layui-input-suffix .layui-icon {
  font-size: 18px;
}

.layui-input-wrap {
  position: relative;
}

.layui-input {
  padding-right: 30px;
}
.btn-donate {
  --clr-font-main: hsla(0 0% 20% / 100);
  --btn-bg-1: hsla(165, 80%, 60%, 1);
  --btn-bg-2: hsla(217 100% 56% / 1);
  --btn-bg-color: hsla(360 100% 100% / 1);
  --radii: 0.5em;
  cursor: pointer;
  padding: 0em 1.4em;
  min-width: 319px;
  min-height: 44px;
  font-size: var(--size, 1rem);
  font-weight: 500;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(325deg,
      var(--btn-bg-2) 0%,
      var(--btn-bg-1) 55%,
      var(--btn-bg-2) 90%);
  border: none;
  border-radius: var(--radii);
  color: var(--btn-bg-color);
}

.btn-donate:hover {
  background-position: right top;
}

.btn-donate:is(:focus, :focus-visible, :active) {
  outline: none;
  box-shadow:
    0 0 0 3px var(--btn-bg-color),
    0 0 0 6px var(--btn-bg-2);
}

@media (prefers-reduced-motion: reduce) {
  .btn-donate {
    transition: linear;
  }
}

.layui-col-xs5 {
  width: 35%;
}

.layui-col-xs7 {
  width: 99%;
}

.demo-goLogin {
  background-image: url('../../assets/img/background2.png');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.fontSet {
  text-align: right;
}

:deep(.layui-input) {
  height: 40px;
  line-height: 40px;
  font-size: 15px;
}

.layui-btn-primary {
  border-color: none !important;
  color: #f8f8f8;
}

.layui-btn-primary:hover {
  border-color: none !important;
  color: #f8f8f8 !important;
}

.demo-login-container {
  width: 427px;
  margin: 21px auto 0;
}

.demo-login-other .layui-icon {
  position: relative;
  display: inline-block;
  margin: 0 2px;
  top: 2px;
  font-size: 26px;
}

.demo-login {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.demo-reg-container {
  width: 320px;
  margin: 21px auto 0;
}

.demo-reg-other .layui-icon {
  position: relative;
  display: inline-block;
  margin: 0 2px;
  top: 2px;
  font-size: 26px;
}

.demo-login-container {
  width: 400px;
  padding: 30px;
  background-color: rgba(951, 588, 235, 0.6);
  /* 半透明白色背景 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* 阴影增强层次感 */
}

.container {
  display: flex;
  align-items: center;
  /* 垂直居中对齐（可选，让文字和图片在同一水平线上） */
  gap: 10px;
  margin: 20px;
}

/* 可选：调整文字和图片样式 */
.container span {
  display: inline-block;
  margin: 0;
  /* 清除 p 标签默认的上下外边距，避免错位 */
  font-size: 24px;
  /* 示例：调整文字大小 */
}

.logo {
  margin-left: 20px;
  width: 60px;
  /* 示例：设置图片宽度 */
  height: auto;
  /* 保持图片比例 */
}

.layui-btn {
  background-color: rgb(253, 152, 96);
}

.layui-input:focus {
  border-color: rgb(253, 152, 96) !important;
  box-shadow: 0 0 3px 1px rgba(253, 152, 96, 0.3) !important;
}

.error-border {
  border-color: #F56C6C !important;
}

.error-text {
    top: -9px;
    position: relative;
    height: 10px;
    color: #f44f4f;
    font-size: 12px;
    margin-top: 2px;
    text-align: left;
}

.layui-checkbox:hover .layui-checkbox {
  border-color: rgb(253, 152, 96);
}

.layui-form-checked[lay-skin='primary'] i {
  background-color: rgb(253, 152, 96);
  border-color: rgb(253, 152, 96) !important;
  color: #fff;
}

.layui-form-checkbox[lay-skin='primary']:hover i {
  border-color: rgb(253, 152, 96);
}

.layui-form-checkbox[lay-skin='primary'] {
  border-color: rgb(253, 152, 96);
}

.layui-btn-primary:hover {
  border-color: rgb(253, 152, 96);
  color: #333;
}

.title {
  /* 容器样式（可选） */
  font-size: 24px;
  font-weight: bold;
}

.char {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  animation: charPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  display: inline-block;
  min-width: 0.5em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@keyframes charPop {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

span {
  cursor: pointer;
}

.agreement-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* 复选框样式 */
.agreement-checkbox {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #165dff;
}

/* 文本样式 */
.agreement-label {
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

/* 链接样式 */
.agreement-link {
  color: #165dff;
  text-decoration: none;
  margin: 0 3px;
}

.agreement-link:hover {
  text-decoration: underline;
}

/* 未勾选状态按钮样式 */
.agreement-checkbox:not(:checked)+.agreement-label+.goLogin-btn {
  background-color: #cccccc;
  cursor: not-allowed;
}

.agreement-checkbox:not(:checked)+.agreement-label+.goLogin-btn:hover {
  background-color: #cccccc;
}

.error-message {
  /* 间距控制：与上方元素保持距离 */
  margin-top: 0.5rem;
  /* mt-2的等价实现 */

  /* 文本样式 */
  font-size: 0.75rem;
  /* text-xs的等价实现 */
  color: #ef4444;
  /* text-red-500的等价实现 */

  /* 布局控制 */
  display: flex;
  align-items: center;
  line-height: 1;
  /* 紧凑显示 */
}

/* 错误图标样式 */
.error-icon {
  /* 图标与文字间距 */
  margin-right: 0.25rem;

  /* 图标大小调整 */
  font-size: 0.875rem;

  /* 确保图标垂直居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 脉冲动画效果（animate-pulse） */
.error-message {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 定义脉冲动画 */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    /* 完全显示 */
  }

  50% {
    opacity: 0.5;
    /* 半透明 */
  }
}

/* 隐藏状态（通过v-if已经移除元素，这里作为补充） */
.error-message.hidden {
  display: none;
}

/* 注册账号文字样式 */
.goLogin {
  position: relative;
  cursor: pointer;
  color: #333;
  padding-bottom: 2px;
  transition: color 0.3s ease;
}

/* 下划线伪元素（初始隐藏状态） */
.goLogin::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  /* 初始宽度为 0（不显示） */
  height: 2px;
  /* 下划线高度 */
  background-color: #1677ff;
  /* 蓝色下划线（可自定义色值） */
  transition: width 0.4s ease;
  /* 宽度过渡动画：0.4秒缓慢展开 */
}

/* 鼠标 hover 时的效果 */
.goLogin:hover {
  color: #1677ff;
  /* 文字同步变蓝（可选，增强交互感） */
}

.goLogin:hover::after {
  width: 100%;
  /* 下划线宽度从 0 过渡到 100%（从左到右展开） */
}

body {
  overflow: hidden;
}
</style>