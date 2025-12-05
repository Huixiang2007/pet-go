<template>
  <div class="demo-goLogin demo-login">
    <transition name="box-animation">
      <form class="layui-form demo-login-container" v-if="isRegister">
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
              <input type="text" name="vercode" value="" v-model="form.vercode"
                @input="handleInput('vercode', $event.target.value)" lay-verify="required" placeholder="验证码"
                lay-reqtext="请填写验证码" autocomplete="off" class="layui-input" />
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-password"></i>
              </div>
              <input type="password" name="password" value="" lay-verify="required|password" v-model="form.password"
                @input="handleInput('password', $event.target.value)" placeholder="密码" autocomplete="off"
                class="layui-input" id="reg-password" lay-affix="eye" />
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-password"></i>
              </div>
              <input type="password" name="confirmPassword" value="" lay-verify="required|confirmPassword"
                v-model="form.confirm" @input="handleInput('confirm', $event.target.value)" placeholder="确认密码"
                autocomplete="off" class="layui-input" lay-affix="eye" id="confirm-password" />
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-username"></i>
              </div>
              <input type="text" name="nickname" value="" lay-verify="required|nickname" placeholder="账号"
                v-model="form.name" @input="handleInput('name', $event.target.value)" autocomplete="off"
                class="layui-input" lay-affix="clear" />
            </div>
          </div>
          <div class="layui-form-item">
            <div class="agreement-item">
              <input v-model="isAgreed" @change="handleCheck" type="checkbox" id="agree" class="agreement-checkbox"
                style="display: block" />
              <label class="agreement-label">
                我已阅读并同意<span class="agreement-link" @click="toProtocal">用户服务协议</span>
              </label>
            </div>
            <p v-if="showError" class="error-message">
              <span class="error-icon">⚠</span>请阅读并同意用户服务协议
            </p>
          </div>
          <div class="layui-form-item">
            <button class="layui-btn btn-donate" lay-submit lay-filter="demo-reg" @click="handleRegister">
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
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRegisterStore, RegisterForm } from '../../stores/register'
import ConfirmCode from '../../components/ConfirmCode.vue'
const ConfirmCodeRef = ref<InstanceType<typeof ConfirmCode> | null>(null)
const registerStore = useRegisterStore()
const router = useRouter()
const route = useRoute()
const isRegister = ref(false)
const form = registerStore.form
const titleRegisterChars = '欢迎注册 PetGo'.split('')
const isSending = ref(false)
declare global {
  interface Window {
    layui: any
  }
}
// 响应式状态管理
const isAgreed = ref(false) // 协议勾选状态
const showError = ref(false) // 错误提示显示状态
const registerActive = ref(false) // 注册按钮激活状态
const handleInput = (key: keyof RegisterForm, value: string) => {
  // 调用Store的setField方法，更新对应字段（key必须是form中定义的：phone/vercode等）
  registerStore.setField(key, value)
}
// 定时器管理（避免内存泄漏）
let hideErrorTimer: NodeJS.Timeout | null = null

/**
 * 处理协议勾选状态变化
 */
const handleCheck = () => {
  // 勾选时立即隐藏错误提示
  if (isAgreed.value) {
    showError.value = false
    if (hideErrorTimer) clearTimeout(hideErrorTimer)
    return
  }

  // 未勾选时显示错误提示并定时隐藏
  showError.value = true
  if (hideErrorTimer) clearTimeout(hideErrorTimer) // 清除旧定时器，防止多次触发
  hideErrorTimer = setTimeout(() => {
    showError.value = false
    hideErrorTimer = null // 清空定时器引用
  }, 3000)
}

/**
 * 处理注册逻辑
 */
const handleRegister = async () => {
  if (registerActive.value) return
  registerActive.value = true
  if (!form.email || !form.vercode || !form.password || !form.confirm || !form.name) {
    return
  }
  // 校验协议勾选状态
  if (!isAgreed.value) {
    showError.value = true
    if (hideErrorTimer) clearTimeout(hideErrorTimer)
    hideErrorTimer = setTimeout(() => {
      showError.value = false
      hideErrorTimer = null
    }, 3000)
    return
  }

  try {
    console.log('wobeidianl')
    console.log(ConfirmCodeRef.value.startCountdown())
    // 调用注册接口
    const response = await axios.post(
      '/server/api/user/register',
      {},
      {
        params: {
          email: form.email,
          code: form.vercode,
          password: form.password,
          account: form.name,
        },
      },
    )
    console.log(response)
    if (response.data.code === 0) {
      const { token, userId } = response.data.data

      // 存储token到localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('userId', userId)
      ElMessage.success('注册成功')
      // 注册成功后清空表单并跳转到登录页
      registerStore.clearForm()
      router.push('/person')
    } else {
      ElMessage.error(response.data.msg || '注册失败')
    }
  } catch (error) {
    ElMessage.error('注册失败: ' + (error as Error).message)
  }
}

//发送验证码
const SendVerificationCode = async (email: string) => {
  try {
    const qqEmailReg = /^[1-9]\d+@qq\.com$/
    if (!qqEmailReg.test(email)) {
      ElMessage.error('请输入正确的QQ邮箱格式')
      return
    }
    if (ConfirmCodeRef.value) {
      isSending.value = true
    }
    const response = await axios.post(
      '/server/api/user/sendCode',
      {},
      {
        params: { email },
      },
    )
    console.log(response)
    if (response.data.code == 0) {
      ElMessage.success('验证码发送成功')
      setTimeout(() => {
        if (ConfirmCodeRef.value) {
          ConfirmCodeRef.value.startCountdown()
        }
      }, 100)
    } else {
      ElMessage.error(response.data.msg || '验证码发送失败')
    }
  } catch (error) {
    ElMessage.error('发送验证码失败: ' + (error as Error).message)
  } finally {
    // 重置发送状态
    // if (ConfirmCodeRef.value) {
    //   ConfirmCodeRef.value.isSending = false
    // }
  }
}

/**
 * 初始化 Layui 组件（在组件挂载后执行）
 */
onMounted(() => {
  // 确保 Layui 已加载

  if (window.layui) {
    isRegister.value = true
    window.layui.use(['form', 'layer', 'util'], function (form: any) {

      const $ = window.layui.$

      form.config.verifyOnBlur = true
      // 自定义验证规则
      form.verify({
        QQemail: function (value: string) {
          const qqEmailReg = /^[1-9]\d+@qq\.com$/
          if (!qqEmailReg.test(value)) {
            return '请输入正确的QQ邮箱格式'
          }
        },
        nickname: function (value: string) {
          if (!value) {
            return '请输入账号'
          }
          const nicknameReg = /^[a-zA-Z][a-zA-Z0-9]{5,19}$/
          if (!nicknameReg.test(value)) {
            return '账号必须是6-20位字母、数字，首位不能为数字'
          }
        },
        // 确认密码
        password: [
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/, // 正则表达式
          '密码需8-20位，包含大小写字母、数字和特殊字符',
        ],
        confirmPassword: function (value: string) {
          const passwordValue = $('#reg-password').val()
          if (value !== passwordValue) {
            return '两次密码输入不一致'
          }
        },
      })
      $('#reg-password').on('blur', function (this: HTMLElement) {
        const $this = $(this)
        $this.attr('lay-verify', 'password')
        form.validate(this) // 触发当前输入框的验证
      })

      // 为确认密码框添加防重复验证机制
      let isConfirm = false
      let isForcedBlur = false
      $('#confirm-password')
        .off('blur')
        .on('blur', function (this: HTMLElement) {
          const $this = $(this)

          if (isForcedBlur) {
            isForcedBlur = false // 重置标志
            return
          }
          if (isConfirm) {
            return
          }
          isConfirm = true
          $this.attr('lay-verify', 'confirmPassword')
          const isValid = form.validate(this)
          if (!isValid) {
            // 注意：这里应该判断“验证失败”（!isValid），而非 isConfirm

            isForcedBlur = true

            setTimeout(() => {
              this.blur() // 原生方法更可靠
            }, 100) //
          }
          // 使用 setTimeout 确保验证完成后重置标志
          setTimeout(() => {
            isConfirm = false
          }, 200)
        })

      // 提交事件
      form.on('submit(demo-reg)', function () {
        // 获取表单字段值

        // 是否勾选同意
        if (!isAgreed.value) {
          return false
        }
        // 调用注册接口
        handleRegister()

        return false // 阻止默认 form 跳转
      })
    })
    const agreementCheck = route.query.isAgreed === 'true'
    if (agreementCheck) {
      isAgreed.value = true
    }
  }
})

/**
 * 组件卸载时清理资源（防止内存泄漏）
 */
onUnmounted(() => {
  if (hideErrorTimer) {
    clearTimeout(hideErrorTimer)
    hideErrorTimer = null
  }
})

const toLogin = () => {
  router.push('/login')
}
const toProtocal = () => {
  router.push('/protocal')
}
</script>

<style scoped>
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

::v-deep .layui-input {
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
