//注册商铺
import request from '../../utils/request'
import type { ShopRegisterForm } from '../../types/shop'
//注册店铺
export const registerShop = async (shopData: ShopRegisterForm) => {
  const res = await request('/server/api/shop/shops/add','POST',shopData)
  return res.data
}
//首页展示
// @param shopId 店铺ID
export const getShopInfo = async (product:Record<string,any>) => {
  const res = await request(`/server/api/shop/shops/list`, 'GET',{product})
  return res.data
}
//获取店铺信息
export const getBrands = async (shopId: number) => {
  const res = await request(`/server/api/shop/shops/detail/${shopId}`,'GET')
  return res.data
}
//店铺编辑
// @param shopId 店铺ID
// @param shopData 店铺数据
export const editShop = async (shopData: ShopRegisterForm) => {
  const res = await request(`/server/api/shop/shops/update`,'POST',shopData)
  return res.data
}
//注销店铺
// @param shopId 店铺ID
export const deleteShop = async (shopId: number) => {
  const res = await request(`/server/api/shop/shops/delete/${shopId}`,'POST')
  return res.data
}
//首页分类的商品展示（拿到类别的id）
//
export const getProductListId = async () => {
  const res = await request(`/server/api/shop/product/type-list`, 'GET')
  return res.data
}
//类别的商品展示
export const getProductList = async (TypeId: number,pageNum: number, pageSize: number) => {
  const res = await request(`/server/api/shop/product/type?typeId=${TypeId}&pageNum=${pageNum}&pageSize=${pageSize}`, 'POST')
  return res.data
}
//更新商铺信息
export const updateShopInfo = async (shopData: ShopRegisterForm) => {
  const res = await request('/server/api/shop/shops/update','POST',shopData)
  return res.data
}
//注销
export const logout = async (shopId: number) => {
  const res = await request(`/server/api/shop/shops/delete/` + shopId ,'POST')
  return res.data
}
//获取商铺信息（商户可见）
export const getShopDetail = async (shopId: number) => {
  const res = await request(`/server/api/shop/shops/detail-internal/${shopId}`,'GET')
  return res.data
}
