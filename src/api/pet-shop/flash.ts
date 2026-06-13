
import request from '@/utils/request'

// 用户端接口
// 获取秒杀活动列表
export const getFlashSaleList = async (params: any) => {
  const response = await request('/server/api/shop/market/user/seckill-activity-list', 'POST', params)
  return response
}
// 获取秒杀活动详情
export const getFlashSaleDetail = async (activityId: string) => {
  const response = await request(`/server/api/shop/market/user/activity/${activityId}`, 'GET')
  return response
}

// 抢购优惠券
export const grabCoupon = async (params: { requestId: string; couponId: string }) => {
  const response = await request('/server/api/shop/market/user/grab-coupon', 'POST', params)
  return response
}

// 用户秒杀商品（立即购买模式）
export const buyProduct = async (params: any) => {
  const response = await request('/server/api/shop/market/user/buy-product', 'POST', params)
  return response
}

// 商家端接口
// 申请秒杀活动
export const applyFlashSale = async (params: any) => {
  const response = await request('/server/api/shop/market/shop/apply-products', 'POST', params)
  return response
}
// 获取秒杀活动申请记录
export const getApplyRecords = async (params: any) => {
  const response = await request('/server/api/shop/market/shop/apply-list', 'POST', params)
  return response
}
// 撤销申请
export const cancelApply = async (applyId: string) => {
  const response = await request(`/server/api/shop/market/shop/apply-cancel/${applyId}`, 'POST')
  return response
}
// 获取已参与的秒杀活动
export const getParticipatedActivities = async (applyId: string) => {
  const response = await request(`/server/api/shop/market/shop/activity-joined/${applyId}`, 'GET')
  return response
}
