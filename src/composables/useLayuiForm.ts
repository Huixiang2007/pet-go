import { ref, reactive, onUnmounted, nextTick, type Ref } from 'vue'
import { ElMessage } from 'element-plus'
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

interface UseLayuiFormOptions {
  isAccount: Ref<boolean>
  onSubmit: (formData: LoginForm) => Promise<void>
  captchaRef: Ref<(InstanceType<any> & CaptchaExposed) | null>
}

export const useLayuiForm = (options: UseLayuiFormOptions) => {
  const { isAccount, onSubmit, captchaRef } = options

  const loading = ref(false)
  const layuiLoaded = ref(false)

  const formData = reactive<LoginForm>({
    loginId: '',
    password: '',
    captcha: '',
    remember: false,
  })

  const errorMessage = ref('')
  const isMessageShowing = ref(false)
  let currentMessageInstance: any = null
  let hideErrorTimer: number | null = null

  const showMessage = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    if (isMessageShowing.value && currentMessageInstance) {
      currentMessageInstance.close()
    }

    currentMessageInstance = ElMessage({
      type,
      message,
      onClose: () => {
        isMessageShowing.value = false
        currentMessageInstance = null
      },
    })

    isMessageShowing.value = true
    return currentMessageInstance
  }

  const validators = {
    verifyType: (value: string) => {
      console.log('[layui验证] verifyType 被调用, value=', value, 'isAccount=', isAccount.value)
      if (isAccount.value) {
        const accountReg = /^[a-zA-Z_][a-zA-Z0-9_]{5,19}$/
        const result = accountReg.test(value)
        console.log('[layui验证] 账号验证结果:', result)
        if (!result) {
          return '账号需为6-20位字母、数字或下划线，首位不能为数字'
        }
      } else {
        const qqEmailReg = /^[1-9]\d+@qq\.com$/
        const result = qqEmailReg.test(value)
        console.log('[layui验证] QQ邮箱验证结果:', result)
        if (!result) {
          return '请输入正确的QQ邮箱格式'
        }
      }
      return true
    },

    password: (value: string) => {
      console.log('[layui验证] password 被调用, value长度=', value?.length)
      const passwordReg =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
      const result = passwordReg.test(value)
      console.log('[layui验证] 密码验证结果:', result)
      if (!result) {
        return '密码需8-20位，包含大小写字母、数字和特殊字符'
      }
      return true
    },

    captcha: (value: string) => {
      console.log('[layui验证] captcha 被调用, value=', value, 'captchaRef=', !!captchaRef.value)
      if (!value) {
        return '请填写验证码'
      }
      if (!captchaRef.value?.validateCaptcha(value)) {
        return '验证码错误'
      }
      return true
    },
  }

  const validateForm = (): boolean => {
    const { loginId, password, captcha } = formData
    console.log(loginId, password, captcha)
    let isValid = true

    if (!loginId) {
      showMessage('error', isAccount.value ? '请输入账号' : '请输入QQ邮箱')
      isValid = false
    } else if (validators.verifyType(loginId) !== true) {
      isValid = false
    }

    if (isValid && !password) {
      showMessage('error', '请填写密码')
      isValid = false
    } else if (isValid && validators.password(password) !== true) {
      isValid = false
    }

    if (isValid && !captcha) {
      showMessage('error', '请输入验证码')
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async () => {
    console.log('[handleSubmit] 被调用, loading=', loading.value)
    if (loading.value) return

    if (!validateForm()) {
      refreshCaptcha()
      return
    }

    console.log('[handleSubmit] 验证通过，开始发送请求...')
    loading.value = true

    try {
      await onSubmit({
        loginId: formData.loginId,
        password: formData.password,
        captcha: formData.captcha,
        remember: formData.remember,
      })
    } catch (error: any) {
      showMessage('error', error.message || '登录失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  const refreshCaptcha = () => {
    captchaRef.value?.refreshCaptcha()
    formData.captcha = ''
  }

  const resetForm = () => {
    formData.loginId = ''
    formData.password = ''
    formData.captcha = ''
    formData.remember = false
  }

  const initLayuiForm = () => {
    console.log('[initLayuiForm] 开始初始化, window.layui=', !!window.layui)
    if (window.layui) {
      layuiLoaded.value = true
      nextTick(() => {
        console.log('[initLayuiForm] nextTick 回调, 开始加载 layui form 模块')
        window.layui.use(['form'], (form: any) => {
          console.log('[initLayuiForm] layui form 模块加载完成')
          form.verify({
            verifyType: validators.verifyType,
            password: validators.password,
            captcha: validators.captcha,
          })

          form.render()
          console.log('[initLayuiForm] form.render() 完成')
        })
      })
    } else {
      console.error('Layui 未加载，请检查引入是否正确')
    }
  }

  const cleanup = () => {
    if (hideErrorTimer) {
      clearTimeout(hideErrorTimer)
      hideErrorTimer = null
    }
    if (currentMessageInstance) {
      currentMessageInstance.close()
    }
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    formData,
    loading,
    layuiLoaded,
    errorMessage,
    showMessage,
    validateForm,
    handleSubmit,
    refreshCaptcha,
    resetForm,
    initLayuiForm,
    cleanup,
  }
}

export const useRememberPassword = () => {
  const encrypt = (text: string) => btoa(encodeURIComponent(text))
  const decrypt = (text: string) => {
    try {
      return decodeURIComponent(atob(text))
    } catch {
      return ''
    }
  }

  const saveRemember = (loginId: string, password: string, loginType: 'account' | 'email') => {
    localStorage.setItem('rememberedLoginId', encrypt(loginId))
    localStorage.setItem('rememberedPassword', encrypt(password))
    localStorage.setItem('rememberedLoginType', loginType)
  }

  const clearRemember = () => {
    localStorage.removeItem('rememberedLoginId')
    localStorage.removeItem('rememberedPassword')
    localStorage.removeItem('rememberedLoginType')
  }

  const getRemembered = (): {
    loginId: string
    password: string
    loginType: 'account' | 'email'
  } | null => {
    const encryptedLoginId = localStorage.getItem('rememberedLoginId')
    const encryptedPassword = localStorage.getItem('rememberedPassword')
    const rememberedLoginType = localStorage.getItem('rememberedLoginType') as
      | 'account'
      | 'email'
      | null

    if (encryptedLoginId && encryptedPassword && rememberedLoginType) {
      try {
        return {
          loginId: decrypt(encryptedLoginId),
          password: decrypt(encryptedPassword),
          loginType: rememberedLoginType,
        }
      } catch {
        clearRemember()
        return null
      }
    }
    return null
  }

  return {
    saveRemember,
    clearRemember,
    getRemembered,
  }
}
