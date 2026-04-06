import request from '@/utils/request'
import type { ApiResponse } from './index'

export interface NewsInfo {
  messageType: string
  receiverId: number
  messageTitle: string
  messageContent: string
  priority: number
  attachment: string
  dataId: string
}
//发送广播消息
export const sendBroadcastMessage = (params: NewsInfo) => {
  return request<ApiResponse<any>>('/server/api/In-site/message/broadcast-send', 'POST', params)
}
//发送私信
export const sendPrivateMessage = (params: NewsInfo) => {
  return request<ApiResponse<any>>('/server/api/In-site/message/single-send', 'POST', params)
}