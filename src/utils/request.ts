import axios from 'axios'
import type { Method, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { ElMessageBox } from 'element-plus' // 需引入Element组件
import { useUserStore, store } from '@/stores'
const service = axios.create({
  timeout: 60000,
})
// 请求拦截器上方新增白名单
const noTokenApiList = [
  '/server/api/user/login/email',
  '/server/api/user/login/account',
  '/server/api/user/register', // 注册接口
  '/server/api/user/sendCode', // 发送验证码接口
]
//请求拦截器-在发送请求之前做些什么
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore(store)
    const token = userStore.token
    const isNoTokenApi = noTokenApiList.some((api) => config.url?.includes(api))
    if (token && config.headers && !isNoTokenApi) {
      // 仅非白名单接口加 Token
      config.headers.Authorization = `Bearer ${token}`
    } else if (isNoTokenApi) {
      // 白名单接口：主动删除 Authorization 头（防止残留）
      if (config.headers) {
        delete config.headers.Authorization
      }
      // console.log('白名单接口，跳过 Token 添加')
    } else {
      console.log('token不存在')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
//处理响应类型
//明确后端返回的数据结构，并让request返回Data<T>类型
type Data<T = any> = {
  code: number
  msg: string
  data: T
  level: null
  ok: boolean
}
//响应拦截器-在收收数据后做些什么
service.interceptors.response.use(
  //第一个回调：HTTP状态码为2xx时触发，请求网络层面处理成功，在这个处理业务错误
  (response: AxiosResponse) => {
    const { code, msg, data, level, ok } = response.data
    //业务成功
    if (code === 0) {
      return { ...response, data: { code, msg, data, level, ok } }
      // return { code, msg, data, level, ok  }
    }
    //业务失败，处理自定义错误码
    switch (code) {
      case 30001: // 参数错误
        console.log(msg)

        break
      case 30002: // 找不到数据
        console.log(msg)
        break
      case 30003: // 数据已存在
        console.log(msg)
        break
      case 30004: // 操作太快
        console.log(msg)
        break
      case 30005: // 无访问权限
        console.log(msg)
        break
      case 30006: // 系统紧急开发中
        console.log(msg)
        break
      case 30007: // 登录状态失效
        ElMessageBox.confirm('登录已失效，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const userStore = useUserStore(store)
          userStore.logout()
          localStorage.removeItem('userLocation')
          window.location.href = '/login' // 跳登录页
        })
        break
      case 30008: // 用户状态异常
        console.log(msg)
        break
      case 30009: // 请勿重复提交
        console.log(msg)
        break
      case 20001: // 业务繁忙
        console.log(msg)
        break
      case 20002: //付款单id异常
        console.log(msg)
        break
      case 10001: //系统错误
        console.log(msg)
        break
      default: // 其他业务错误
        console.log(msg)
    }
    return Promise.reject(new Error(msg))
  },
  //第二个回调，HTTP状态码非2xx时触发，处理HTTP错误
  (error: AxiosError) => {
    // 处理HTTP网络错误（非2xx状态码）
    if (error.response) {
      // 有响应但状态码异常
      console.log('HTTP错误：', error.response)
      const { status, config } = error.response
      switch (status) {
        case 400:
          // ElMessage.error('请求参数错误（HTTP 400）')
          break
        case 401:
          ElMessageBox.confirm('登录已失效，请重新登录', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            const userStore = useUserStore(store)
            userStore.logout()
            localStorage.removeItem('userLocation')
            window.location.href = '/login'
          })
          break
        case 404:
          console.log(`请求地址不存在：${config.url}（HTTP 404）`)
          // ElMessage.error(`请求地址不存在：${config.url}（HTTP 404）`)
          break
        case 500:
          // 核心修改：判断500错误是否包含“未登录”相关提示
          // const isLoginError = data?.msg?.includes('未登录') || data?.msg?.includes('登录态') || data?.msg?.includes('token');
          // if (isLoginError) {
          //   // 500但属于登录态问题：触发登录跳转
          //   ElMessageBox.confirm('登录状态异常，请重新登录', '提示', {
          //     confirmButtonText: '重新登录',
          //     cancelButtonText: '取消',
          //     type: 'warning',
          //   }).then(() => {
          //     localStorage.removeItem('authToken');
          //     window.location.href = '/login';
          //   });
          // } else {
          // 普通500错误：仅提示
          // ElMessage.error('服务器内部错误（HTTP 500）')
          console.log('服务器内部错误（HTTP 500）')
          // }
          break

        default:
          console.log(`网络错误：${status}（HTTP状态码）`)
        // ElMessage.error(`网络错误：${status}（HTTP状态码）`)
      }
    } else if (error.message.includes('timeout')) {
      // 超时错误
      console.log('请求超时啦，请稍后重试')
    } else if (error.message.includes('Network Error')) {
      // 断网等网络连接错误
      console.log('网络连接失败，请检查网络')
    } else {
      // 其他未知错误
      console.log('请求失败，请稍后重试')
    }
    return Promise.reject(error)
  },
)
//axios中的ts认为data有的，但是响应拦截器实际去掉了
//再次对请求方法进行封装

const request = <T = any>(
  //参数
  url: string,
  method: Method,
  submitData?: object,
  config: AxiosRequestConfig = {},
) => {
  //T, Data<T>分别表示请求数据类型（暂时用不到）和响应数据类型
  return service
    .request<Data<T>, AxiosResponse<Data<T>>>({
      url,
      method,
      [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
      ...config,
    })
    .then((response) => {
      // 直接返回业务数据，简化调用方使用
      return response.data
    })
}
export default request
