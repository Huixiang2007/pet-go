import request from '@/utils/request'
import type {  PageParams, PageResult,ApiResponse} from './index'


export interface StoreInfo {
  id: string
  userId:string
  shopName: string
  shopAvatar: string
  shopType: string
  businessLicense: string 
  idCardFront: string
  idCardBack: string
  contactName: string  
  contactPhone: string
  contactEmail: string
  address: string
  province: string  
  city: string
  district: string
  description: string
  status: string
  createTime: string
  updateTime: string
  openTime: string
  closeTime: string
  isDeleted:number
  salesCount:number
  creditScore:number
} 

export interface StoreAudit {
  id: string
  shopId:string
  userId:number
  shopName: string
  shopAvatar: string
  shopType: string
  businessLicense: string 
  idCardFront: string
  idCardBack: string
  contactName: string  
  contactPhone: string
  contactEmail: string
  address: string
  province: string  
  city: string
  district: string
  description: string
  status: string
  auditTime: string
  auditResult: string
  auditType: string
  auditorId: number
  auditorName: string
  auditReason: string

}

export interface ProductInfo{
       id: string,
			shopId: string,
			productSn: string,
			title: string,
			subTitle: string,
			categoryId: number,
			brandId: number,
			typeId: number,
			currentPrice: number,
			marketPrice: number,
			costPrice: number, 
			stock: number,
			sales: number,
			mainImage: string,
			images: string,
			videoUrl: string,
			status: string,
			publishTime: string,
			createTime: string,
			updateTime: string,
			isDeleted: number,
			reviewCount: number,
			productScore: number,
			detail: string,
			productWeight: number,
			warrantyTip: string
}
			
export interface ProductAudit{
       id: string,
			productId: string,
		auditResult: string,
				auditorId: number,
				auditorName: string,
				auditReason: string,
				auditTime: string,
				shopId: number,
				productSn: string,
				title: string,
				subTitle: string,
				brandId: number,
				typeParent: number,
				typeChild: number,
				currentPrice: number,
				marketPrice: number,
				costPrice: number,
				stock: number,
				mainImage: string,
				images: string,
				videoUrl: string,
				detail: string,
				productWeight: number,
				warrantyTip: string,
				auditType: string
}


// 分页返回数据类型（对应接口里的 data 字段）
export type ShopPageResult = PageResult<StoreInfo>
export type ShopAuditResult = PageResult<StoreAudit>
export type ProductPageResult = PageResult<ProductInfo>
export type ProductAuditResult = PageResult<ProductAudit>


// 完整接口返回类型
export type ShopListResponse = ApiResponse<ShopPageResult>
export type ShopAuditResponse = ApiResponse<ShopAuditResult>
export type ProductListResponse = ApiResponse<ProductPageResult>
export type ProductAuditResponse = ApiResponse<ProductAuditResult>
//获取所有商铺列表
export const getShopPageList=(params: PageParams) => {
   return request<ShopListResponse>(
    '/server/api/shop-admin/shop/page-shop-list',
    'POST',
    params
  )
}
//获取商铺审批列表
export const getShopAuditList=(params: PageParams) => {
   return request<ShopAuditResponse>(
    '/server/api/shop-admin/shop/page-audit-shop-list',
    'POST',
    params
  )
}
//获取所有商品列表
export const getProductList =(param:PageParams) =>{
  return request<ProductListResponse>(
    '/server/api/shop-admin/product/page-product-list',
    'POST',
    param
  )
}
//获取商品审批列表
export const getProductAuditList =(param:PageParams) =>{
  return request<ProductAuditResponse>(
    '/server/api/shop-admin/product/page-audit-product-list',
    'POST',
    param
  )}
// 获取商铺详情
export const getShopDetail = (shopId: string) => {
  return request<ApiResponse<StoreInfo>>(
    `/server/api/shop-admin/shop/detail-shop/${shopId}`,
    'GET'
  )
}

//获取审核详细
export const getShopAuditDetail = (id: string) => { 
  return request<ApiResponse<StoreAudit>>(
    `/server/api/shop-admin/shop/detail-audit-shop/${id}`,
    'GET'
  )
}
//获取商品详情
export const getProductDetail = (productId: string) => {
  return request<ApiResponse<ProductInfo>>(    
    `/server/api/shop-admin/product/detail-product/${productId}`,
    'GET'
  )
}

  
//获取审批商品详情
export const getProductAuditDetail = (auditId: string) => {
  return request<ApiResponse<ProductInfo>>(    
    `/server/api/shop-admin/product/detail-audit-product/${auditId}`,
    'GET'
  )
} 

//下架商品
export const deleteProduct = (productId: string) => {
  return request<ApiResponse<string>>(
    `/server/api/shop-admin/product/delete-product/${productId}`,
    'POST'
  )
}
//审批结果

