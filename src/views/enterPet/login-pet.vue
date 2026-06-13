<template>
  <div class="demo-login forPicture">
    <transition name="box-animation">
      <form class="layui-form demo-login-container" v-show="true" @submit.prevent="handleSubmit">
        <div class="container">
          <img src="@/assets/img/logo.png" alt="这是图标" class="logo" />

          <div class="title">
            <span v-for="(char, index) in titleLoginChars" :key="index" :style="{ animationDelay: `${index * 100}ms` }"
              class="char">
              {{ char }}
            </span>
          </div>
        </div>

        <div class="myCenter">
          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon" :class="isAccount ? 'layui-icon-username' : 'layui-icon-email'"></i>
              </div>
              <input type="text" name="loginId" v-model="formData.loginId" :placeholder="isAccount ? '账号' : 'QQ邮箱'"
                :lay-reqtext="isAccount ? '请输入账号' : '请输入QQ邮箱'" lay-verify="verifyType" autocomplete="off"
                class="layui-input" lay-affix="clear" />
            </div>
          </div>

          <div class="layui-form-item">
            <div class="layui-input-wrap">
              <div class="layui-input-prefix">
                <i class="layui-icon layui-icon-password"></i>
              </div>
              <input type="password" name="password" v-model="formData.password" placeholder="密   码"
                lay-verify="password" lay-reqtext="请填写密码" autocomplete="off" class="layui-input" lay-affix="eye" />
            </div>
          </div>

          <div class="layui-form-item">
            <div class="layui-row">
              <div class="layui-col-xs7">
                <div class="layui-input-wrap">
                  <div class="layui-input-prefix">
                    <i class="layui-icon layui-icon-vercode"></i>
                  </div>
                  <input type="text" name="captcha" v-model="formData.captcha" placeholder="验证码" lay-verify="captcha"
                    lay-reqtext="请填写验证码" autocomplete="off" class="layui-input" lay-affix="clear" />
                </div>
              </div>
              <div class="layui-col-xs5">
                <div style="margin-left: 10px">
                  <CaptchaLoad ref="captchaRef" :width="130" :height="38" />
                </div>
              </div>
            </div>
          </div>

          <div class="layui-form-item">
            <input type="checkbox" name="remember" v-model="formData.remember" lay-skin="primary" title="记住密码" />
            <span @click="toForgotPassword" style="float: right; margin-top: 7px; color: #333">忘记密码？</span>
          </div>

          <div class="layui-form-item">
            <button type="submit" class="layui-btn btn-donate" :disabled="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>

          <div class="layui-form-item demo-login-other" style="text-align: right">
            <span @click="changeLoginType" class="register">
              {{ isAccount ? '使用QQ邮箱登录' : '使用账号登录' }}
            </span>
            或 <span @click="toRegister" class="register">注册帐号</span>
          </div>
        </div>
      </form>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CaptchaLoad from '@/components/common/CaptchaLoad.vue'
import { loginByAccount, loginByEmail } from '@/api/auth'
import { useLayuiForm, useRememberPassword } from '@/composables/useLayuiForm'
import { useUserStore, store } from '@/stores'


interface LoginForm {
  loginId: string
  password: string
  captcha: string
  remember: boolean
}

interface CaptchaExposed {
  refreshCaptcha: () => void
  validateCaptcha: (input: string) => boolean
  getCurrentCode: () => string
}

const captchaRef = ref<InstanceType<typeof CaptchaLoad> & CaptchaExposed | null>(null)
const isAccount = ref(true)
const titleLoginChars = '欢迎登录 PetGo'.split('')

const router = useRouter()
const { saveRemember, clearRemember, getRemembered } = useRememberPassword()
const userStore = useUserStore(store)

const handleLogin = async (formData: LoginForm) => {
  let response: any

  if (isAccount.value) {
    response = await loginByAccount({
      account: formData.loginId,
      password: formData.password
    })
  } else {
    response = await loginByEmail({
      email: formData.loginId,
      password: formData.password
    })
  }

  if (response.code === 0) {
    const { token } = response.data
    const { userId, userRole } = response.data.userInfo
    const shopId = response.data.shopInfo.shopId
    const fosterProviderIds = response.data.fosterProviderIds

    localStorage.setItem('authToken', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('userRole', userRole)
    localStorage.setItem('shopId', shopId)
    localStorage.setItem('fosterProviderIds', fosterProviderIds.toString())

    userStore.setToken(token)
    userStore.setUserInfo({ userId, userRole: [userRole] })

    if (formData.remember) {
      saveRemember(formData.loginId, formData.password, isAccount.value ? 'account' : 'email')
    } else {
      clearRemember()
    }

    if (userRole === '管理员') {
      ElMessage.success('登录成功，欢迎进入PetGO管理系统!')
      router.push('/admin')
    } else {
      ElMessage.success('登录成功，欢迎进入PetGO!')
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/foster-care')
    }
  } else {
    refreshCaptcha()

    throw new Error(response.msg || '登录失败')
  }
}


const changeLoginType = () => {
  isAccount.value = !isAccount.value
  resetForm()
}

const toRegister = () => {
  router.push('/register')
}

const toForgotPassword = () => {
  router.push('/forget')
}

declare global {
  interface Window {
    layui: any
  }
}

onMounted(() => {
  const remembered = getRemembered()
  if (remembered) {
    isAccount.value = remembered.loginType === 'account'
    nextTick(() => {
      formData.loginId = remembered.loginId
      formData.password = remembered.password
      formData.remember = true
    })
  }

  initLayuiForm()
})
const {
  formData,
  loading,
  handleSubmit,
  initLayuiForm,
  resetForm,
  refreshCaptcha
} = useLayuiForm({
  isAccount,
  onSubmit: handleLogin,
  captchaRef
})
</script>

<style scoped>
:deep .layui-form-checked[lay-skin='primary']>i {
  border-color: #fd9860 !important;
  background-color: #fd9860;
  color: #fff;
}

body {
  overflow: hidden;
}

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

.btn-donate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

:deep(.layui-input) {
  height: 38px !important;
  line-height: 38px;
  font-size: 15px;
}

.forPicture {
  background-image: url('@/assets/img/background6.png');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.demo-login-container {
  width: 400px;
  padding: 30px;
  background-color: rgba(951, 588, 235, 0.6);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px;
}

.container span {
  display: inline-block;
  margin: 0;
  font-size: 24px;
}

.logo {
  margin-left: 20px;
  width: 60px;
  height: auto;
}
</style>
