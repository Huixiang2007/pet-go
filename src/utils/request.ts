import axios from 'axios'
import type { Method, AxiosRequestConfig } from 'axios'
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
service.interceptors.response.use((response) => response.data)
//axios中的ts认为data有的，但是响应拦截器实际去掉了
//再次对请求方法进行封装
type Data<T> = {
  code: number
  message: string
  data: T
}
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
