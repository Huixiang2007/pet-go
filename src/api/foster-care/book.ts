import request from '@/utils/request'
import type { AdditionalServicePageData } from '@/types/foster'
import type { ApiResponse } from '@/types/api'
//获取近三十天空位
export const getForecast = (serviceId: number): Promise<ApiResponse<number[]>> => {
  return request('/server/api/user/fosterServices/getRecent30DaysVacancy', 'GET', { serviceId })
}
//获取附加服务
export const getAdditionalServices = (
  serviceId: number,
): Promise<ApiResponse<AdditionalServicePageData>> => {
  return request(
    '/server/api/user/fosterServices/getAdditionalServices', // 替换为实际接口地址
    'GET',
    { serviceId },
  )
}
//提交预约
export const submitBookingOrder = (data: any): Promise<ApiResponse<any>> => {
  return request(
    '/server/api/user/foster-orders/reserveFoster', // 替换为实际提交接口地址
    'POST',
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
}
//获取我的宠物列表
export const getMyPets = (id: number): Promise<ApiResponse<any>> => {
  return request(`/server/api/pet/${id}`, 'GET')
}
//支付寄养订单
export const payFosterOrder = (data: any): Promise<ApiResponse<any>> => {
  return request('/server/api/user/foster-orders/payFosterOrders', 'POST', data)
}
//获取订单详情
export const getOrderDetail = (orderNo: number): Promise<ApiResponse<any>> => {
  return request('/server/api/user/foster-orders/fosterOrdersDetails', 'GET', { orderNo })
}
//获取余额
export const getBalance = (): Promise<ApiResponse<any>> => {
  return request('/server/api/user/searchBalance', 'GET')
}
