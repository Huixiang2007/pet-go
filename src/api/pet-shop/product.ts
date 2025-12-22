import request from '@/utils/request'
import type { Brand, Category, ProductDetail, ProductEditForm } from '@/types/shop'

// 产品相关API

/**
 * 获取品牌列表
 */
export const getBrands = async (): Promise<Brand[]> => {
  const response = await request('/server/api/shop/product/add/brand', 'GET')
  return response.data || []
}

/**
 * 获取父分类列表
 */
export const getParentCategories = async (): Promise<Category[]> => {
  const response = await request('/server/api/shop/product/add/parentType', 'GET')
  return response.data || []
}

/**
 * 获取子分类列表
 * @param parentId 父分类ID
 */
export const getChildCategories = async (parentId: number): Promise<Category[]> => {
  const response = await request(`/server/api/shop/product/add/childType/${parentId}`, 'GET')
  return response.data || []
}

/**
 * 上传文件
 * @param file 文件对象
 */
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await request('/server/api/file/upload', 'POST', formData)
  return response.data
}

/**
 * 编辑商品
 * @param productData  id 商品数据
 */
export const updateProduct = async (productData: ProductEditForm, id:number |string) => {
  const response = await request(`/server/api/shop/product/update/${id}`, 'POST', productData)
  return response.data
}

/**
 * 新增商品
 * @param productData 商品数据
 */
export const addProduct = async (productData: ProductEditForm) => {
  const response = await request('/server/api/shop/product/add', 'POST', productData)
  return response.data
}
/**
 * 搜索商品
 * @param productData 商品数据
 */
export const searchProduct = async (productData: ProductEditForm) => {
  const response = await request('/server/api/shop/product/filter', 'POST', productData)
  return response.data
}
/**
 * 获取商品详情,面向用户
 * @param id 商品ID
 */
export const getProductDetail = async (id: string | number): Promise<ProductDetail> => {
  const response = await request(`/server/api/shop/product/detail/${id}`, 'GET')
  return response.data || {}
}




interface TableRow {
  id: string
  productName: string
  productType: string
  productSn: string
  price: number;
  stock: number;
  status: string
  stockStatus: string
}

/**
 商品列表
 * @param  productData 查询参数
 */
export const getProductList = async (productData: Record<string, any>): Promise<{
  data: any
  list: TableRow[]
  total: number
}> => {
  const response = await request('/server/api/shop/shops/list', 'POST', productData)
  return response.data || { list: [], total: 0 }
}

/**
 * 获取商品详情,面向商户
 * @param id 商品ID
 */
export const Detail = async (id: string | number): Promise<ProductDetail> => {
  const response = await request(`/server/api/shop/shops/list/${id}`, 'GET')
  return response.data || {}
}

//商家上架/下架
// @param id 商品ID
export const putProductOnSale = async (id: number | string, status: number) => {
  const response = await request(`/server/api/shop/shops/product-status?productId=${id}&status=${status}`, 'POST')
  return response.data
}
//上架批量上架/下架
// @param ids 商品ID数组
export const putProductsOnSale = async (ids: number[] | string[],status: number) => {
  const response = await request(`/server/api/shop/shops/product-status/batch?status=${status}`, 'POST', { ids })
  return response.data
}


//移除商品
// @param id 商品ID
export const removeProduct = async (id: number | string ) => {
  const response = await request(`/server/api/shop/product/remove/${id}`, 'POST')
  return response.data
  }

//sku列表
export const skuListApi = async (productId: number | string , pageNum: number, pageSize: number) => {
  const url = `/server/api/shop/sku/list?productId=${productId}&pageNum=${pageNum}&pageSize=${pageSize}`;
  const response = await request(url, 'GET');
  return response.data;
};
//编辑sku
export const editSkuApi = async (productId: number | string | bigint, sku: string[]) => {
  const url = `/server/api/shop/sku/update/sku/${productId}`;
  const response = await request(url, 'POST', sku);
  return response.data;
};
//sku删除
export const deleteSkuApi = async (productId:number | string |bigint) => {
  const url = `/server/api/shop/sku/delete/sku/${productId}`;
  const response = await request(url, 'POST');
  return response.data;
};
//新增sku
export const addSkuApi = async (productId: number | string, sku: string[]) => {
  const url = `/server/api/shop/sku/add?productId=${productId}`;
  const response = await request(url, 'POST', sku);
  return response.data;
};
//上/下架
export const skuStatusApi = async ( skuId: number|string|bigint, status: number) => {
  const url = `/server/api/shop/sku/sku-status?skuId=${skuId}&status=${status}`;
  const response = await request(url, 'POST');
  return response.data;
};
//sku详情
export const skuDetailApi = async ( skuId: number | string |bigint) => {
  const url = `/server/api/shop/sku/detail/${skuId}`;
  const response = await request(url, 'GET');
  return response.data;
};
//搜索
export const searchApi = async (productData: Record<string, any>)=>{
  const response = await request('/server/api/shop/shops/list', 'POST', productData)
  return response.data || { list: [], total: 0 }
}
//添加到购物车
export const addCartApi = async (CarData: Record<string, any>) => {
  const response = await request('/server/api/shop/shop-cart/add', 'POST', CarData);
  return response.data;
}
