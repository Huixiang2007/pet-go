import request from '@/utils/request'
import type { FosterHomeDetail, FosterServicePageData } from '@/types/foster'
import type { ApiResponse } from '@/types/api'
export const fosterHomeDetail = (id: number): Promise<ApiResponse<FosterHomeDetail>> => {
  return request(`/server/api/foster/provider/detail/${id}`, 'GET')
}
export const packageItem = (params: {
  providerId: number
  pageNum: number
  pageSize: number
}): Promise<ApiResponse<FosterServicePageData>> => {
  return request('/server/api/user/fosterServices/searchFosterServices', 'GET', params)
}
