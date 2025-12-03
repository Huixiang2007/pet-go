<template>
  <div class="likeBody">
    <!-- 使用响应式变量控制容器类名 -->
    <div class="demo-login forPicture" :class="{ 'right-panel-active': isRightPanelActive }">
      <!-- 验证邮箱表单（原form1） -->
      <form class="layui-form demo-login-container forPicture__form forPicture--signin" v-if="step === 1"
        @submit.prevent="handleFirstFormSubmit">
        <div class="container">
          <img src="../../assets/img/logo.png" alt="这是图标" class="logo" />
          <div class="title">
            <span v-for="(char, index) in titleEmailChars" :key="index" :style="{ animationDelay: `${index * 100}ms` }"
              class="char">
              {{ char }}
            </span>
          </div>
        </div>

        <!-- 邮箱和验证码输入区域 -->
        <div class="myCenter">
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-email"></i>
              </div>
              <input type="text" name="email" v-model="formData.email" lay-verify="required|email" placeholder="QQ邮箱"
                lay-reqtext="请输入QQ邮箱" autocomplete="off" class="layui-input" lay-affix="clear" />
            </div>
          </div>

          <div class="layui-form-item">
            <div class="layui-row" style="width: 400px">
              <div class="layui-col-xs7">
                <div class="layui-input-wrap">
                  <div class="layui-input-prefix">
                    <i class="layui-icon layui-icon-vercode"></i>
                  </div>
                  <input type="text" name="captcha" v-model="formData.captcha" lay-verify="required" placeholder="验证码"
                    lay-reqtext="请填写验证码" autocomplete="off" class="layui-input" lay-affix="clear" />
                </div>
              </div>
              <div class="layui-col-xs5">
                <button type="button" class="layui-btn" :disabled="countdown > 0" @click="sendCaptcha"
                  style="margin-left: 10px">
                  {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="layui-form-item">
          <button class="layui-btn btn-donate" lay-submit lay-filter="verify-email">
            验证邮箱
          </button>
        </div>

        <div class="layui-form-item demo-login-other" style="text-align: center" v-if="step === 1">
          <span @click="toLogin" class="register">返回登录</span>
        </div>
      </form>

      <!-- 重置密码表单（原form2） -->
      <form class="layui-form demo-login-container forPicture__form forPicture--signup"
        @submit.prevent="handleSecondFormSubmit" v-if="step === 2">
        <div class="container">
          <img src="../../assets/img/logo.png" alt="这是图标" class="logo" />
          <div class="title">
            <span v-for="(char, index) in titleResetChars" :key="index" :style="{ animationDelay: `${index * 100}ms` }"
              class="char">
              {{ char }}
            </span>
          </div>
        </div>

        <div class="layui-form-item">
          <div class="layui-input-wrap">
            <div class="layui-input-prefix">
              <i class="layui-icon layui-icon-password"></i>
            </div>
            <input type="password" name="newPassword" v-model="formData.newPassword" lay-verify="required|password"
              placeholder="新密码" lay-reqtext="请填写新密码" autocomplete="off" class="layui-input" lay-affix="eye" />
          </div>
        </div>

        <div class="layui-form-item">
          <div class="layui-input-wrap">
            <div class="layui-input-prefix">
              <i class="layui-icon layui-icon-password"></i>
            </div>
            <input type="password" name="confirmPassword" v-model="formData.confirmPassword"
              lay-verify="required|confirmPassword" placeholder="确认新密码" lay-reqtext="请确认新密码" autocomplete="off"
              class="layui-input" lay-affix="eye" />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <i class="layui-icon layui-icon-info-circle error-icon"></i>
          {{ errorMessage }}
        </div>

        <div class="layui-form-item">
          <button class="layui-btn btn-donate" lay-submit lay-filter="reset-password">
            重置密码
          </button>
        </div>

        <div class="layui-form-item demo-login-other" style="display: flex; justify-content: space-between"
          v-if="step === 2">
          <span @click="toLogin" class="register">返回登录</span>
          <span @click="togglePanel" class="backEmail register" style="margin-left: auto">返回身份认证</span>
        </div>
      </form>

      <!-- 切换按钮区域 -->
      <div class="forPicture__overlay">
        <div class="overlay">
          <div class="overlay__panel overlay--left" v-if="step === 1"></div>
          <div class="overlay__panel overlay--right" v-if="step === 2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '../../utils/request'
import { el } from 'element-plus/es/locale'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

declare global {
  interface Window {
    layui: any
  }
}

const isRightPanelActive = ref(true)

// 状态管理
const step = ref(1)
const countdown = ref(0)
const errorMessage = ref('')
const isResetPassword = ref(true)
const titleEmailChars = '身份验证'.split('')
const titleResetChars = '重置密码'.split('')

const timer = ref<number | null>(null)
let layer: any

// 表单数据
const formData = ref({
  email: '',
  captcha: '',
  newPassword: '',
  confirmPassword: '',
})

const togglePanel = () => {
  step.value = 1
  isRightPanelActive.value = true
  errorMessage.value = ''
}
// 路由实例
const router = useRouter()

// 跳转登录页
const toLogin = () => {
  router.push('/login')
}

// 表单提交处理（替代原生事件绑定）
const handleFirstFormSubmit = () => {
  // 阻止默认提交行为（已通过@submit.prevent实现）
  // 可在这里添加额外的表单处理逻辑
}

const handleSecondFormSubmit = () => {
  // 阻止默认提交行为（已通过@submit.prevent实现）
  // 可在这里添加额外的表单处理逻辑
}

// 发送验证码

const sendCaptcha = async () => {
  if (countdown.value > 0) return
  const qqEmailReg = /^[1-9]\d+@qq\.com$/
  if (!qqEmailReg.test(formData.value.email)) {
    errorMessage.value = '请输入正确的QQ邮箱格式'
    return
  }

  try {
    const response = await request(
      '/server/api/user/sendCode',
      'POST',
      {
        email: formData.value.email,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    console.log('发送验证码:', response)
    if (response.code === 0) {
      ElMessage.success('验证码已发送至您的邮箱')
      // 开始倒计时
      countdown.value = 60
      if (timer.value) {
        clearInterval(timer.value)
      }
      timer.value = window.setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer.value as number)
          timer.value = null
        }
      }, 1000)
    } else {
      ElMessage.error(response.msg || '发送验证码失败，请稍后重试')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '发送验证码失败，请重试'
    console.error('发送验证码失败:', error)
  }
}

// 验证邮箱和验证码
const verifyEmail = async () => {
  try {
    layer.msg('验证成功，请重置密码', { icon: 1 })
    step.value = 2
    isRightPanelActive.value = false
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '验证失败，请检查信息'
  }
}

// 重置密码
const resetPassword = async () => {
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  try {
    // await axios.post('/api/user/reset-password', {
    //   email: formData.value.email,
    //   newPassword: formData.value.newPassword
    // })

    layer.msg('密码重置成功，请登录', { icon: 1 })
    router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '密码重置失败，请重试'
  }
}

// 生命周期钩子
onMounted(() => {
  if (window.layui) {
    isResetPassword.value = true
    window.layui.use(['form', 'layer'], (form: any, layerInstance: any) => {
      layer = layerInstance
      // 扩展验证规则
      form.verify({
        email: function (value: string) {
          const qqEmailReg = /^[1-9]\d+@qq\.com$/
          if (!qqEmailReg.test(value)) {
            return '请输入正确的QQ邮箱格式'
          }
        },
        password: function (value: string) {
          const passwordReg =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
          if (!passwordReg.test(value)) {
            return '密码需8-20位，包含大小写字母、数字和特殊字符'
          }
        },
        confirmPassword: function (value: string) {
          if (value !== formData.value.newPassword) {
            return '两次输入的密码不一致'
          }
        },
      })

      // 表单提交事件
      form.on('submit(verify-email)', () => {
        verifyEmail()
        return false
      })

      form.on('submit(reset-password)', () => {
        resetPassword()
        return false
      })

      form.render()
    })
  } else {
    console.error('Layui 未加载，请检查引入是否正确')
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
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

/* 保持原有样式不变 */
.layui-form-checkbox[lay-skin='primary']>div {
  margin-top: 0.5px !important;
}

.btn-donate {
  --clr-font-main: hsla(0 0% 20% / 100);
  --btn-bg-1: hsla(165, 80%, 60%, 1);
  --btn-bg-2: hsla(217 100% 56% / 1);
  --btn-bg-color: hsla(360 100% 100% / 1);
  --radii: 0.5em;
  cursor: pointer;
  padding: 0.4em 1.4em;
  min-width: 345px;
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

.btn-donate {
  margin-left: 9px;
}

.logo {
  margin-left: 20px;
  height: auto;
  /* 保持图片比例 */
  width: 66px;
}

.container span {
  font-size: 27px;
}

.layui-form-item {
  width: 361px;
  margin-bottom: 30px;
  margin-left: 16px;
}

.layui-col-xs7 {
  width: 60.333333%;
}

.layui-col-xs5 {
  width: 28.666667%;
}

.demo-login-container {
  width: 400px;
  padding: 41px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
}

.container {
  display: flex;
  /* 开启 Flex 布局 */
  align-items: center;
  /* 垂直居中对齐（可选，让文字和图片在同一水平线上） */
  gap: 10px;
  margin: 20px 20px 25px;
}

body {
  overflow: hidden;
}

.demo-login {
  min-height: 54vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.likeBody {
  background-image: url('../../assets/img/background1.png');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  align-items: center;
  background-color: var(--white);
  display: grid;
  height: 100vh;
  place-items: center;
}

.container {
  width: 85%;
  justify-content: center;
}

.demo-login-container {
  margin: -19px auto 0;
}

::v-deep .forPicture {
  background-image: url('../../assets/img/background1.png');
  height: 300px !important;
  background-color: var(--white);
  border-radius: var(--button-radius);
  box-shadow:
    0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
    0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  max-width: var(--max-width);
  overflow: hidden;
  position: relative;
  width: 65%;
}

.forPicture__form {
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.forPicture--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.forPicture.right-panel-active .forPicture--signin {
  transform: translateX(100%);
}

.forPicture--signup {
  left: 0;
  width: 50%;
  z-index: 1;
}

.forPicture.right-panel-active .forPicture--signup {
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.forPicture__overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.forPicture.right-panel-active .forPicture__overlay {
  transform: translateX(-100%);
}

.overlay {
  background-color: var(--lightblue);
  background: url('../../assets/img/background1.png');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.forPicture.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay__panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-20%);
}

.forPicture.right-panel-active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.forPicture.right-panel-active .overlay--right {
  transform: translateX(20%);
}

@keyframes show {

  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

::v-deep .layui-input {
  height: 40px;
  /* 可以根据需要调整高度值，默认通常是 38px 左右 */
  line-height: 40px;
  /* 保持行高与高度一致，使文字垂直居中 */
  font-size: 15px;
  /* 可选：适当调整字体大小配合高度 */
}

.layui-btn {
  background-color: rgb(253, 152, 96);
}

.layui-input:focus {
  border-color: rgb(253, 152, 96) !important;
  box-shadow: 0 0 3px 1px rgba(253, 152, 96, 0.3) !important;
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

.register {
  position: relative;
  /* 用于定位下划线伪元素 */
  cursor: pointer;
  /* 鼠标悬停时显示手型（提示可点击） */
  color: #333;
  /* 默认文字颜色 */
  padding-bottom: 2px;
  /* 预留下划线的空间（避免文字跳动） */
  transition: color 0.3s ease;
  /* 文字颜色过渡（可选） */
}

/* 下划线伪元素（初始隐藏状态） */
.register::after {
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
.register:hover {
  color: #1677ff;
  /* 文字同步变蓝（可选，增强交互感） */
}

.register:hover::after {
  width: 100%;
  /* 下划线宽度从 0 过渡到 100%（从左到右展开） */
}
</style>
