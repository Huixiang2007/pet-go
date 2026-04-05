import request from '@/utils/request'
import type { ApiResponse } from './index'

//获取余额
export const getMoney= () => {
    return request<ApiResponse<any>>('/server/api/user/searchBalance', 'GET')
}

//充值
export const recharge= ( amount: number) => { 
    return request<ApiResponse<any>>('/server/api/user/topUp', 'POST',{amount},{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}