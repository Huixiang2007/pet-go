import request from '@/utils/request'
import type {  PageParams, PageResult} from './index'

export interface FosterResponse {
  code: number;        
  data: null;             
  msg: string;         
}
export interface FosterInfo {
  id: number
  contactName: string  
  contactPhone: string
  providerType: string
  petTypes:string[]
  status: string
  createTime: string
  name: string
} 

export interface fourCard{

   auditCount: number,
   stayCount: number,
   todayOrderCount: number,
   chainGrowth: string,
   popularFosterProvider: string
 
}

export interface FosterQueryParams extends PageParams {  

  status?: string; // 状态（非必传）
 
  keyword?: string; // 关键词（非必传）
}
//接口返回详细数据参数
export interface FosterPron {
   id: number
   description: string
   province: string
   city: string
   district: string
   detailAddress: string
   environmentPhotos: string
   qualificationPhotos: string
  contactName: string  
  contactPhone: string
  providerType: string
  petTypes:string[]
  status: string
  createTime: string
  name: string
  verifiedTime: string
}


export const getFosterList = (params: FosterQueryParams) => {
  return request<PageResult<FosterInfo>>('/server/api/foster/getFosterList', 'GET', params)
}
//审核寄养方信息
export const checkFosterInfo = (id: number, status: number) => {
  return request<FosterResponse>(`/server/api/foster/provider/aduit/${id}`, 'POST', { id, status }, { 
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' // 声明请求体格式
      } 
    })
}
//后台分页条件查询
export const getFosterListByCondition = (params: FosterQueryParams) => {    
  return request<PageResult<FosterInfo>>('/server/api/foster/provider/admin/list', 'POST',   params ,{
     headers: {
      'Content-Type': 'application/json'
    }
  }
  )
}
//获取卡片数据
export const getCardData = () => {
  return request<fourCard>('/server/api/foster/provider/card', 'GET')
}
//获取寄养方详情
export const getFosterDetail = (id: number) => {
  return request<FosterPron>('/server/api/foster/provider/detail', 'GET',{id})
}