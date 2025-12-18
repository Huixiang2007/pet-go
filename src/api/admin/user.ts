import request from '@/utils/request'
import type { PageParams, PageResult } from './index'

// 用户信息类型定义
export interface UserInfo {
  id: number,
  account: string
  userName: string
  avatar: string
  realName: string
  gender: number
  birthday: string
  email: string
  address: string
  status: string
}

// 用户列表查询参数
export interface UserQueryParams extends PageParams {
  keyword?: string
}

//用户认证信息参数
export interface UserAuthDetail {
  id: number
  realName: string
  idCard: string
  address: string
  birthday: string
  gender: number
  status: string
  pictureUrl: string|string[]
}


//未认证列表
export const getUnAuthUserList = (params: PageParams) => {
  return request<PageResult<UserInfo>>('/server/api/user/getUnAuthUserList', 'GET', params)
}


 // 获取已认证用户列表

export const getAuthUserList = (params: UserQueryParams) => {
  return request<PageResult<UserInfo>>('/server/api/user/getAuthUserList', 'GET', params)
}
/**
 * 获取用户认证详情
 * @param id 用户ID
 * @returns 用户认证详情
 */
export const getUserAuthDetail = (id: number) => {
  return request<UserAuthDetail>(`/server/api/user/getUserAuthDetail`, 'GET', { id })
}

//分页查询用户
export const searchDetail = (params: UserQueryParams) => {
  return request<UserAuthDetail>('/server/api/user/admin/getUser', 'GET', params)
}
//通过或拒绝认证
export const approveOrReject = (id: number, status: string) => {
  return request<UserInfo>(`/server/api/user/admin/review/auth`, 'POST', { authRecordId:id, status }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
)};