import request from '@/utils/request';


export interface ApiResponseAddress<T> {
  code: number;        
  data: T;             
  msg: string;         
}

// 2. 地址详情类型（后端 data 中的结构）
export interface AddressDetail {
  id: string;
  consignee: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: number; // 0=默认，1=非默认
}

// 3. 地址列表的 data 类型（带分页）
export interface AddressListData {
  list: AddressDetail[];
  total: number;
  pages: number;
}

// 4. 新增/编辑地址的请求参数
export interface AddressParams {
  id?: string;
  consignee: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: number;
}

/**
 * 5. 接口函数（修复返回类型，匹配统一响应结构）
 */

// 获取地址列表
export const getUserAddresses = async (params: {
  pageNum: number;
  pageSize: number;
}): Promise<ApiResponseAddress<AddressListData>> => {
  return request('/server/api/user/getUserAddresses', 'GET', params);
};

// 获取地址详情
export const getUserAddressDetail = async (id: string): Promise<ApiResponseAddress<AddressDetail>> => {
  return request('/server/api/user/UserAddressDetail', 'GET', { id });
};

// 新增地址
export const addUserAddress = async (data: Omit<AddressParams, 'id'>): Promise<ApiResponseAddress<null>> => {
  return request('/server/api/user/addUserAddress', 'POST', data);
};

// 更新地址
export const updateUserAddress = async (
  id: string,
  data: AddressParams
): Promise<ApiResponseAddress<null>> => {
  return request(`/server/api/user/updateUserAddress?id=${id}`, 'POST', data);
};

// 删除地址
export const deleteUserAddress = async (id: string): Promise<ApiResponseAddress<null>> => {
  return request('/server/api/user/deleteUserAddress', 'POST', { id }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

// 设置默认地址
export const setDefaultUserAddress = async (id: string): Promise<ApiResponseAddress<null>> => {
  return request('/server/api/user/setDefaultUserAddress', 'POST', { id }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};