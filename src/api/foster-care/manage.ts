import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
//获取寄养服务套餐列表
export const getFosterService = (params: { providerId: number }): Promise<ApiResponse<any>> => {
  return request('/server/api/user/fosterServices/searchFosterServices', 'GET', params)
}
//添加服务套餐
export const addFosterService = (data: any): Promise<ApiResponse<any>> => {
  return request('/server/api/user/fosterServices/addFosterServices', 'POST', data)
}
//删除服务套餐
export const deleteFosterService = (params: { id: number }): Promise<ApiResponse<any>> => {
  return request(
    `/server/api/user/fosterServices/deleteFosterServices?id=${params.id}`,
    'POST',
    params,
  )
}
//更新服务套餐
export const updateFosterService = (id: number, data: any): Promise<ApiResponse<any>> => {
  return request('/server/api/user/fosterServices/updateFosterServices', 'POST', data, {
    params: { id },
  })
}
//添加附加服务
export const addAdditionalService = (data: any): Promise<ApiResponse<any>> => {
  return request('/server/api/user/fosterServices/addAdditionalServices', 'POST', data)
}
//获取附加服务
export const getAddService = (serviceId: number): Promise<ApiResponse<any>> => {
  return request('/server/api/user/fosterServices/getAdditionalServices', 'GET', { serviceId })
}

//获取寄养人订单数据
export const getFosterOrderData = (params: { providerId: number }): Promise<ApiResponse<any>> => {
  return request(
    `/server/api/user/foster-orders/orderTrend?providerId=${params.providerId}`,
    'POST',
  )
}
