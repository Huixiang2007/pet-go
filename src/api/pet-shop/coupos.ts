import request from '@/utils/request'

// 查询优惠券列表(商家端)
export const getShopCouponList = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/coupons/shop/coupon-list', 'POST', param)
  return response
}

// 创建优惠券(商家端)
export const createShopCoupon = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/coupons/shop/create-coupon', 'POST', param)
  return response
}

// 商家删除优惠券
export const deleteShopCoupon = async (couponId: string): Promise<any> => {
  const response = await request(`/server/api/shop/coupons/shop/delete-coupon/${couponId}`, 'POST')
  return response
}

// 启用-禁用优惠券(商家端)
export const updateCouponStatus = async (couponId: string, status: number): Promise<any> => {
  const response = await request(`/server/api/shop/coupons/shop/update-coupon-status/${couponId}?status=${status}`, 'POST')
  return response
}

// 更新优惠券(商家端)
export const updateShopCoupon = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/coupons/shop/update-coupon', 'POST', param)
  return response
}
