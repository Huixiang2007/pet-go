import request from '@/utils/request'
//首页商品推荐
export const getRecommend = async (params:any) => {
  const response = await request('/server/api/shop/market/recommend/home-recommend', 'POST', params)
  return response
}
//用户个性化商品推荐
export const getUserRecommend = async (params:any) => {
  const response = await request('/server/api/shop/market/recommend/user-recommend', 'POST', params)
  return response
}
//购物车商品推荐
export const getCartRecommend = async (params:any) => {
  const response = await request('/server/api/shop/market/recommend/cart-recommend', 'POST', params)
  return response
}
