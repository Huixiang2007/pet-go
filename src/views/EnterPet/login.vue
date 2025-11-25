<template>
  <div class="demo-login forPicture">
    <transition name="box-animation">
      <form class="layui-form demo-login-container" v-if="isLogin">
        <div class="container">
          <img src="../../assets/img/logo.png" alt="这是图标" class="logo" />

          <div class="title">
            <!-- 遍历字符数组，每个字符一个span，添加索引对应的延迟动画 -->
            <span
              v-for="(char, index) in titleLoginChars"
              :key="index"
              :style="{ animationDelay: `${index * 100}ms` }"
              class="char"
            >
              {{ char }}
            </span>
          </div>
        </div>

        <div class="myCenter">
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i
                  class="layui-icon"
                  :class="isAccount ? 'layui-icon-username' : 'layui-icon-email'"
                ></i>
              </div>
              <input
                type="text"
                name="loginId"
                value=""
                lay-verify="required|verifyType"
                :placeholder="isAccount ? '账号' : 'QQ邮箱'"
                :lay-reqtext="isAccount ? '请输入账号' : '请输入QQ邮箱'"
                autocomplete="off"
                class="layui-input"
                lay-affix="clear"
              />
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-password"></i>
              </div>
              <input
                type="password"
                name="password"
                value=""
                lay-verify="required|password"
                placeholder="密   码"
                lay-reqtext="请填写密码"
                autocomplete="off"
                class="layui-input"
                lay-affix="eye"
              />
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-row">
              <div class="layui-col-xs7">
                <div class="layui-input-wrap">
                  <div class="layui-input-prefix">
                    <i class="layui-icon layui-icon-vercode"></i>
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value=""
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
                <div style="margin-left: 10px">
                    <Captcha ref="captchaRef" :width="130" :height="38" />
                </div>
              </div>
            </div>
          </div>
          <div class="layui-form-item">
            <input type="checkbox" name="remember" lay-skin="primary" title="记住密码" />
            <span @click="toForgotPassword" style="float: right; margin-top: 7px; color: #333"
              >忘记密码？</span
            >
          </div>
          <div class="layui-form-item">
            <button class="layui-btn btn-donate" lay-submit lay-filter="demo-login">登录</button>
          </div>
          <div class="layui-form-item demo-login-other" style="text-align: right">
            <span @click="changeLoginType" class="register">
              {{ isAccount ? '使用QQ邮箱登录' : '使用账号登录' }}</span
            >
            或 <span @click="toRegister" class="register">注册帐号</span>
          </div>
        </div>
      </form>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,nextTick } from 'vue'
import { useRouter } from 'vue-router'
import  {ElMessage, type FormInstance,type FormRules, } from 'element-plus'
import Captcha from '../../components/CaptchaLoad.vue'
const captchaRef = ref<InstanceType<typeof Captcha> | null>(null)
import axios from 'axios'
const isAccount = ref(true)

// 定义登录表单数据类型
interface LoginForm {
  loginId: string
  password: string
}
declare global {
  interface Window {
    layui: any
  }
}
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const errorMessage = ref('')
const titleLoginChars = '欢迎登录 PetGo'.split('')
const isLogin = ref(false)
const encrypt = (text: string) => btoa(text)
const decrypt = (text: string) => atob(text)

const changeLoginType = () => {
  isAccount.value = !isAccount.value
  const loginInput = document.querySelector('input[name="loginId"]')
  if (loginInput) {
    ;(loginInput as HTMLInputElement).value = ''
  }
}
let hideErrorTimer: number | null = null
let layer: any
onMounted(() => {
     const loginInput = document.querySelector('input[name="loginId"]') as HTMLInputElement
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement
    const rememberCheckbox = document.querySelector('input[name="remember"]') as HTMLInputElement
    const captchaInput = document.querySelector('input[name="captcha"]') as HTMLInputElement
    
    // 清空所有输入框
    if (loginInput) loginInput.value = ''
    if (passwordInput) passwordInput.value = ''
    if (captchaInput) captchaInput.value = ''
    
    // 重置记住密码复选框
    if (rememberCheckbox) rememberCheckbox.checked = false
      const encryptedLoginId = localStorage.getItem('rememberedLoginId')
  const encryptedPassword = localStorage.getItem('rememberedPassword')
  const rememberedLoginType = localStorage.getItem('rememberedLoginType')
   
    if (encryptedLoginId && encryptedPassword&& rememberedLoginType) {
    // 设置登录类型
   try {
      const rememberedLoginId = decrypt(encryptedLoginId)
      const rememberedPassword = decrypt(encryptedPassword)
      
     
      isAccount.value = rememberedLoginType === 'account'
      
      // 填充表单字段
      nextTick(() => {
        const loginInput = document.querySelector('input[name="loginId"]') as HTMLInputElement
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement
        const rememberCheckbox = document.querySelector('input[name="remember"]') as HTMLInputElement
        
        if (loginInput) loginInput.value = rememberedLoginId
        if (passwordInput) passwordInput.value = rememberedPassword
        if (rememberCheckbox) rememberCheckbox.checked = true
      })
    } catch (e) {
      // 解密失败时清除无效数据
      localStorage.removeItem('rememberedLoginId')
      localStorage.removeItem('rememberedPassword')
      localStorage.removeItem('rememberedLoginType')
      console.log('解密记住密码数据失败，已清除无效数据')
    }
  }
  if (window.layui) {
    isLogin.value = true
    window.layui.use(['form', 'layer'], (form: any, layer: any) => {
      form.verify({
        verifyType: function (value: string) {
          if (isAccount.value) {
            // 账号验证规则：6-20位字母、数字、下划线，首位不能为数字
            const accountReg = /^[a-zA-Z_][a-zA-Z0-9_]{5,19}$/
            if (!accountReg.test(value)) {
              return '账号需为6-20位字母、数字或下划线，首位不能为数字'
            }
          } else {
            // QQ邮箱验证规则：以数字开头，@qq.com结尾
            const qqEmailReg = /^[1-9]\d+@qq\.com$/
            if (!qqEmailReg.test(value)) {
              return '请输入正确的QQ邮箱格式'
            }
          }
        },
        password: function (value: string) {
          // 密码验证规则：8-20位，包含大小写字母、数字和特殊字符
          const passwordReg =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
          if (!passwordReg.test(value)) {
            return '密码需8-20位，包含大小写字母、数字和特殊字符'
          }
        },
      })

      form.on('submit(demo-login)', (data: any) => {
      
        const formData = data.field
          handleLogin(data.field)   
        // layer.alert(JSON.stringify(formData, null, 2), {
        //   title: '登录表单数据',
        // })
        return false
      })
      form.render()
    })
  } else {
    console.error('Layui 未加载，请检查引入是否正确')
  }
})

onUnmounted(() => {
  if (hideErrorTimer) {
    clearTimeout(hideErrorTimer)
    hideErrorTimer = null
  }
   loginFormRef.value = undefined
})

const router = useRouter()
const toRegister = () => {
  router.push('/Register')
}
const toForgotPassword = () => {
  router.push('/Forget')
}

const handleLogin = async(formData: LoginForm) => {
  if (loading.value) return
  loading.value = true
   
  try {
     const rememberCheckbox = document.querySelector('input[name="remember"]') as HTMLInputElement
  const shouldRemember = rememberCheckbox?.checked || false
     const captchaInput = document.querySelector('input[name="captcha"]') as HTMLInputElement
    const captchaValue = captchaInput?.value.trim()
      if (captchaRef.value && !captchaRef.value.validateCaptcha(captchaValue)) {
      ElMessage.error('验证码错误，请重新输入')
      // 刷新验证码
      if (captchaRef.value) {
        captchaRef.value.refreshCaptcha()
      }
      // 清空验证码输入框
      if (captchaInput) {
        captchaInput.value = ''
      }
      loading.value = false
      return
    }
  let response: any
    // 调用登录接口
    if(isAccount.value){
      response = await axios.post('/server/api/user/login/account', {},
      {
        params:{
        account: formData.loginId,
        password: formData.password,
        }
       
      })
      
    }else{
     response = await axios.post('/server/api/user/login/email', {},
    {
      params:{
         email: formData.loginId,
         password: formData.password,
      }
    })
    }
    const { token, userId } = response.data.data

    // 存储token到localStorage
    localStorage.setItem('authToken', token)
    localStorage.setItem('userId', userId) 

  
    
 if (shouldRemember) {
      localStorage.setItem('rememberedLoginId', encrypt(formData.loginId))
      localStorage.setItem('rememberedPassword', encrypt(formData.password))
      localStorage.setItem('rememberedLoginType', isAccount.value ? 'account' : 'email')
    } else {
      // 如果没有选择记住密码，则清除已存储的登录信息
      localStorage.removeItem('rememberedLoginId')
      localStorage.removeItem('rememberedPassword')
      localStorage.removeItem('rememberedLoginType')
    }
  ElMessage.success('登录成功，欢迎进入PetGO!');

    // 显示成功消息
   
   router.push('/Person')

  } catch (error: any) {
    // 登录失败处理
    let errorMsg = '登录失败，请稍后重试'

    if (error.response && error.response.data) {
      errorMsg = error.response.data.message || errorMsg
    }

    errorMessage.value = errorMsg
   console.log(errorMsg)
  if (captchaRef.value) {
      captchaRef.value.refreshCaptcha()
    }
    // 清空验证码输入框
    const captchaInput = document.querySelector('input[name="captcha"]') as HTMLInputElement
    if (captchaInput) {
      captchaInput.value = ''
    }
    // 刷新验证码未做
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

::v-deep .layui-form-checked[lay-skin=primary]>i {
    border-color: #fd9860 !important;
    background-color: #fd9860;
    color: #fff;
}
body {
  overflow: hidden;
}
.layui-form-checkbox[lay-skin='primary'] > div {
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
  background-image: linear-gradient(
    325deg,
    var(--btn-bg-2) 0%,
    var(--btn-bg-1) 55%,
    var(--btn-bg-2) 90%
  );
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

.demo-login-container {
  width: 320px;
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
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
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
::v-deep .layui-input {
  height: 38px !important; /* 可以根据需要调整高度值，默认通常是 38px 左右 */
  line-height: 38px; /* 保持行高与高度一致，使文字垂直居中 */
  font-size: 15px; /* 可选：适当调整字体大小配合高度 */
}

.forPicture {
  background-image: url('../../assets/img/background6.png');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.demo-login-container {
  width: 400px; /* 表单宽度 */
  padding: 30px;
  background-color: rgba(951, 588, 235, 0.6); /* 半透明白色背景 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影增强层次感 */
}
.container {
  display: flex; /* 开启 Flex 布局 */
  align-items: center; /* 垂直居中对齐（可选，让文字和图片在同一水平线上） */
  gap: 10px; /* 子元素之间的间距（可选） */
  margin: 20px; /* 顶部外边距 */
}

/* 可选：调整文字和图片样式 */
.container span {
  display: inline-block;
  margin: 0; /* 清除 p 标签默认的上下外边距，避免错位 */
  font-size: 24px; /* 示例：调整文字大小 */
}

.logo {
  margin-left: 20px;
  width: 60px; /* 示例：设置图片宽度 */
  height: auto; /* 保持图片比例 */
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
::v-deep .layui-form-checkbox[lay-skin='primary']:hover i {
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
.agreement-checkbox:not(:checked) + .agreement-label + .register-btn {
  background-color: #cccccc;
  cursor: not-allowed;
}

.agreement-checkbox:not(:checked) + .agreement-label + .register-btn:hover {
  background-color: #cccccc;
}
.error-message {
  /* 间距控制：与上方元素保持距离 */
  margin-top: 0.5rem; /* mt-2的等价实现 */

  /* 文本样式 */
  font-size: 0.75rem; /* text-xs的等价实现 */
  color: #ef4444; /* text-red-500的等价实现 */

  /* 布局控制 */
  display: flex;
  align-items: center;
  line-height: 1; /* 紧凑显示 */
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
    opacity: 1; /* 完全显示 */
  }
  50% {
    opacity: 0.5; /* 半透明 */
  }
}

/* 隐藏状态（通过v-if已经移除元素，这里作为补充） */
.error-message.hidden {
  display: none;
}
/* 注册账号文字样式 */
.register {
  position: relative; /* 用于定位下划线伪元素 */
  cursor: pointer; /* 鼠标悬停时显示手型（提示可点击） */
  color: #333; /* 默认文字颜色 */
  padding-bottom: 2px; /* 预留下划线的空间（避免文字跳动） */
  transition: color 0.3s ease; /* 文字颜色过渡（可选） */
}

/* 下划线伪元素（初始隐藏状态） */
.register::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0; /* 初始宽度为 0（不显示） */
  height: 2px; /* 下划线高度 */
  background-color: #1677ff; /* 蓝色下划线（可自定义色值） */
  transition: width 0.4s ease; /* 宽度过渡动画：0.4秒缓慢展开 */
}

/* 鼠标 hover 时的效果 */
.register:hover {
  color: #1677ff; /* 文字同步变蓝（可选，增强交互感） */
}

.register:hover::after {
  width: 100%; /* 下划线宽度从 0 过渡到 100%（从左到右展开） */
}
</style>
