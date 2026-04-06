import request from '@/utils/request'

export interface ApiResponseAddress<T> {
  code: number
  data: T
  msg: string
}

// 2. 地址详情类型（后端 data 中的结构）
export interface AddressDetail {
  id: string
  street: string
  receiverPhone: string
  receiverName: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: string // 0=是，1=普通
}

// 3. 地址列表的 data 类型（带分页）
export interface AddressListData {
  list: AddressDetail[]
  total: number
  pages: number
}

// 4. 新增/编辑地址的请求参数
export interface AddressParams {
  street: string
  receiverPhone: string
  receiverName: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: '默认地址' | '普通地址'
}
//更新地址
export interface AddressUpdataParams {
  addressId: string
  street: string
  receiverPhone: string
  receiverName: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: '默认地址' | '普通地址'
}

/**
 * 5. 接口函数（修复返回类型，匹配统一响应结构）
 */

// 获取地址列表
export const getUserAddresses = async (params: {
  pageNum: number
  pageSize: number
}): Promise<ApiResponseAddress<AddressListData>> => {
  return request('/server/api/shop/user-address-manage/page-query', 'POST', params)
}

// 获取地址详情
export const getUserAddressDetail = async (
  addressId: string,
): Promise<ApiResponseAddress<AddressDetail>> => {
  return request(`/server/api/shop/user-address-manage/get-address-detail/${addressId}`, 'GET')
}

// 新增地址
export const addUserAddress = async (
  data: Omit<AddressParams, 'id'>,
): Promise<ApiResponseAddress<null>> => {
  return request('/server/api/shop/user-address-manage/add', 'POST', data)
}

// 更新地址
export const updateUserAddress = async (
  data: AddressUpdataParams,
): Promise<ApiResponseAddress<null>> => {
  return request(`/server/api/shop/user-address-manage/update`, 'POST', data)
}

// 删除地址
export const deleteUserAddress = async (addressId: string): Promise<ApiResponseAddress<null>> => {
  return request(`/server/api/shop/user-address-manage/delete/${addressId}`, 'POST', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 设置默认地址
export const setDefaultUserAddress = async (
  addressId: string,
): Promise<ApiResponseAddress<null>> => {
  return request(`/server/api/shop/user-address-manage/set-default-address/${addressId}`, 'POST', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
