<template>
  <div class="likeBody">
    <!-- 使用响应式变量控制容器类名 -->
    <div class="demo-login forPicture" :class="{ 'right-panel-active': isRightPanelActive }">
      <!-- 验证邮箱表单（原form1） -->
      <form 
        class="layui-form demo-login-container forPicture__form forPicture--signin" 
        v-if="step === 1"
        @submit.prevent="handleFirstFormSubmit"
      >
        <!-- 表单内容保持不变 -->
        <div class="container">
          <img src="../assets/img/logo.png" alt="这是图标" class="logo" />
          <div class="title">
            <span
              v-for="(char, index) in titleEmailChars"
              :key="index"
              :style="{ animationDelay: `${index * 100}ms` }"
              class="char"
            >
              {{ char }}
            </span>
          </div>
        </div>

        <!-- 邮箱和验证码输入区域 -->
        <div class="myCenter">
          <div class="layui-form-item" >
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-email"></i>
              </div>
              <input
                type="text"
                name="email"
                v-model="formData.email"
                lay-verify="required|email"
                placeholder="QQ邮箱"
                lay-reqtext="请输入QQ邮箱"
                autocomplete="off"
                class="layui-input"
                lay-affix="clear"
              />
            </div>
          </div>

          <div class="layui-form-item" >
            <div class="layui-row" style="width: 400px;">
              <div class="layui-col-xs7">
                <div class="layui-input-wrap">
                  <div class="layui-input-prefix">
                    <i class="layui-icon layui-icon-vercode"></i>
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    v-model="formData.captcha"
                    lay-verify="required"
                    placeholder="验证码"
                    lay-reqtext="请填写验证码"
                    autocomplete="off"
                    class="layui-input"
                    lay-affix="clear"
                  />
                </div>
              </div>
              <div class="layui-col-xs5">
                <button
                  type="button"
                  class="layui-btn"
                  :disabled="countdown > 0"
                  @click="sendCaptcha"
                  style="margin-left: 10px"
                >
                  {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="layui-form-item" >
          <button
            class="layui-btn btn-donate"
            lay-submit
            lay-filter="verify-email"
          
          >
            验证邮箱
          </button>
        </div>

        <div class="layui-form-item demo-login-other" style="text-align: center;" v-if="step === 1">
          <span @click="toLogin" class="register">返回登录</span>
        </div>
      </form>

      <!-- 重置密码表单（原form2） -->
      <form 
        class="layui-form demo-login-container forPicture__form forPicture--signup"
        @submit.prevent="handleSecondFormSubmit"
        v-if="step === 2 "
      >
        <!-- 表单内容保持不变 -->
        <div class="container">
          <img src="../assets/img/logo.png" alt="这是图标" class="logo" />
          <div class="title">
            <span
              v-for="(char, index) in titleResetChars"
              :key="index"
              :style="{ animationDelay: `${index * 100}ms` }"
              class="char"
            >
              {{ char }}
            </span>
          </div>
        </div>

        <div class="layui-form-item" >
          <div class="layui-input-wrap">
            <div class="layui-input-prefix">
              <i class="layui-icon layui-icon-password"></i>
            </div>
            <input
              type="password"
              name="newPassword"
              v-model="formData.newPassword"
              lay-verify="required|password"
              placeholder="新密码"
              lay-reqtext="请填写新密码"
              autocomplete="off"
              class="layui-input"
              lay-affix="eye"
            />
          </div>
        </div>

        <div class="layui-form-item" >
          <div class="layui-input-wrap">
            <div class="layui-input-prefix">
              <i class="layui-icon layui-icon-password"></i>
            </div>
            <input
              type="password"
              name="confirmPassword"
              v-model="formData.confirmPassword"
              lay-verify="required|confirmPassword"
              placeholder="确认新密码"
              lay-reqtext="请确认新密码"
              autocomplete="off"
              class="layui-input"
              lay-affix="eye"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <i class="layui-icon layui-icon-info-circle error-icon"></i>
          {{ errorMessage }}
        </div>

        <div class="layui-form-item" >
          <button
            class="layui-btn btn-donate"
            lay-submit
            lay-filter="reset-password"
          >
            重置密码
          </button>
        </div>

        <div class="layui-form-item demo-login-other" style="display: flex; justify-content: space-between;" v-if="step === 2">
          <span @click="toLogin" class="register">返回登录</span>
          <span @click="togglePanel" class="backEmail register" style="margin-left:auto;">返回身份认证</span>
        </div>
      </form>

      <!-- 切换按钮区域 -->
      <div class="forPicture__overlay" >
        <div class="overlay" >
          <div class="overlay__panel overlay--left" v-if="step === 1">
            
          </div>
          <div class="overlay__panel overlay--right" v-if="step === 2">
           
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

declare global {
  interface Window {
    layui: any
  }
}

// 响应式变量控制面板切换状态
const isRightPanelActive= ref(true)

// 切换面板方法
// const togglePanel = (active: boolean) => {
//   isRightPanelActive.value = active
// }

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
  confirmPassword: ''
})

const togglePanel=() => {
  step.value = 1;
  isRightPanelActive.value = true;  // 切换回身份认证面板的样式
  errorMessage.value = '';  // 清除错误信息
};
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
  const qqEmailReg = /^[1-9]\d+@qq\.com$/
  if (!qqEmailReg.test(formData.value.email)) {
    errorMessage.value = '请输入正确的QQ邮箱格式'
    return
  }

  try {
    await axios.post('/api/user/send-captcha', {
      email: formData.value.email
    })
    
    countdown.value = 60
    timer.value = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer.value as number)
      }
    }, 1000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '发送验证码失败，请重试'
  }
}

// 验证邮箱和验证码
const verifyEmail = async () => {
  try {
    // await axios.post('/api/user/verify-email', {
    //   email: formData.value.email,
    //   captcha: formData.value.captcha
    // })
    layer.msg('验证成功，请重置密码', { icon: 1 })
    step.value = 2
      isRightPanelActive.value = false  // 切换到重置密码时显示左侧
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
        email: function(value: string) {
          const qqEmailReg = /^[1-9]\d+@qq\.com$/
          if (!qqEmailReg.test(value)) {
            return '请输入正确的QQ邮箱格式'
          }
        },
        password: function(value: string) {
          const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
          if (!passwordReg.test(value)) {
            return '密码需8-20位，包含大小写字母、数字和特殊字符';
          }
        },
        confirmPassword: function(value: string) {
          if (value !== formData.value.newPassword) {
            return '两次输入的密码不一致'
          }
        }
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
/* 保持原有样式不变 */

.btn-donate {
  margin-left: 9px;
}
.logo {
   
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
.container{
  margin: 20px 20px 25px;
}

body{
  overflow: hidden;
}
.demo-login {
    min-height: 54vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.likeBody {
  background-image: url('../assets/img/background3.png');
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
.container{
  width: 85%;
  justify-content: center;
}
.demo-login-container {
    margin: -19px auto 0;
}
::v-deep .forPicture {
  background-image: url('../assets/img/background3.png');
  height: 300px !important;
	background-color: var(--white);
	border-radius: var(--button-radius);
	box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
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
	background: url('../assets/img/background3.png');
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
  height: 40px; /* 可以根据需要调整高度值，默认通常是 38px 左右 */
  line-height: 40px; /* 保持行高与高度一致，使文字垂直居中 */
  font-size: 15px; /* 可选：适当调整字体大小配合高度 */
}
</style>