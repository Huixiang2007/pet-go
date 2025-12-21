import request from '@/utils/request'
// import type { ApiResponse } from '@/types/api'

// 获取寄养订单列表
export const getFosterOrderList = (params: { pageNum: number; pageSize: number }) => {
  return request('/server/api/user/foster-orders/userOrderList', 'GET', {
    params,
  })
}

// 申请退款
export const applyRefund = (data: { orderNo: number }) => {
  return request('/server/api/user/foster-orders/applyRefund', 'POST', data)
}

// 获取订单详情
export const getFosterOrderDetail = (orderNo: number) => {
  return request('/server/api/user/foster-orders/fosterOrdersDetails', 'GET', { orderNo })
}
