import axios from 'axios'
import type { Method, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus' // 需引入Element组件
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})
//请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
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
}
service.interceptors.response.use(
  //第一个回调：HTTP状态码为2xx时触发，请求网络层面处理成功，在这个处理业务错误
  (response: AxiosResponse<Data>) => {
    const { code, msg, data } = response.data
    //业务成功
    if (code === 0) {
      return { ...response, data: { code, msg, data } }
    }
    //业务失败，处理自定义错误码
    switch (code) {
      case 30001: // 参数错误
        ElMessage.error(msg)
        break
      case 30002: // 找不到数据
        ElMessage.error(msg)
        break
      case 30003: // 数据已存在
        ElMessage.error(msg)
        break
      case 30004: // 操作太快
        ElMessage.error(msg)
        break
      case 30005: // 无访问权限
        ElMessage.error(msg)
        break
      case 30006: // 系统紧急开发中
        ElMessage.error(msg)
        break
      case 30007: // 登录状态失效
        ElMessageBox.confirm('登录已失效，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          localStorage.removeItem('token')
          window.location.href = '/login' // 跳登录页
        })
        break
      case 30008: // 用户状态异常
        ElMessage.error(msg)
        break
      case 30009: // 请勿重复提交
        ElMessage.error(msg)
        break
      case 20001: // 业务繁忙
        ElMessage.error(msg)
        break
      case 20002: //付款单id异常
        ElMessage.error(msg)
        break
      case 10001: //系统错误
        ElMessage.error(msg)
        break
      default: // 其他业务错误
        ElMessage.error(msg || `业务错误：${code}`)
    }
    return Promise.reject(new Error(msg))
  },
  //第二个回调，HTTP状态码非2xx时触发，处理HTTP错误
  (error: AxiosError) => {
    // 处理HTTP网络错误（非2xx状态码）
    if (error.response) {
      // 有响应但状态码异常
      const { status, config } = error.response
      switch (status) {
        case 400:
          ElMessage.error('请求参数错误（HTTP 400）')
          break
        case 401:
          ElMessage.error('未授权，请登录（HTTP 401）')
          break
        case 404:
          ElMessage.error(`请求地址不存在：${config.url}（HTTP 404）`)
          break
        case 500:
          ElMessage.error('服务器内部错误（HTTP 500）')
          break

        default:
          ElMessage.error(`网络错误：${status}（HTTP状态码）`)
      }
    } else if (error.message.includes('timeout')) {
      // 超时错误
      ElMessage.error('请求超时，请稍后重试')
    } else if (error.message.includes('Network Error')) {
      // 断网等网络连接错误
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      // 其他未知错误
      ElMessage.error('请求失败，请稍后重试')
    }
  },
)
//axios中的ts认为data有的，但是响应拦截器实际去掉了
//再次对请求方法进行封装

const request = <T>(
  //参数
  url: string,
  method: Method,
  submitData: object,
  config: AxiosRequestConfig,
) => {
  //T, Data<T>分别表示请求数据类型（暂时用不到）和响应数据类型
  return service.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
    ...config,
  })
}
export default request
