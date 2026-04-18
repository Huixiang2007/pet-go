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
//获取父类和子类商品分类列表
export const getProductCategoryList = async (): Promise<any> => {
  const response = await request('/server/api/shop/coupons/shop/product-types', 'GET')
  return response
}
//用户领取优惠卷
export const receiveCoupon = async (couponId: string): Promise<any> => {
  const response = await request(`/server/api/shop/coupons/user/receive-coupon/${couponId}`, 'POST')
  return response
}
//用户查找我的优惠卷
export const getMyCouponList = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/coupons/user/my-coupons', 'POST',param)
  return response
}
//用户批量删除优惠卷
export const deleteMyCoupon = async (couponIds: string[]): Promise<any> => {
  const response = await request('/server/api/shop/coupons/user/delete-coupons', 'POST',couponIds)
  return response
}
//可领取的优惠卷列表
export const getReceiveCouponList = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/coupons/user/available-receive-coupons', 'POST',param)
  return response
}
//优惠卷详情
export const getCouponDetail = async (couponId: string): Promise<any> => {
  const response = await request(`/server/api/shop/coupons/coupon-detail/${couponId}`, 'GET')
  return response
}
//用户获取订单的优惠卷列表
export const getBestCouponOrderList= async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/coupons/user/order-available-coupons', 'POST',param)
  return response
}
