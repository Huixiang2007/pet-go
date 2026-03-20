import request from '@/utils/request'

interface SendMessageParams {
  receiverId: number
  videoUrl?: string
  content?: string
  image?: string
}
interface ChatRecord {
  msgId: number
  senderId: number
  senderName: string
  senderAvatar: string
  receiverId: number
  content: string
  image: string
  video: string
  msgType: string
  isRead: number
  sendTime: string
}
// 发送消息
export const sendMessage = async (params: SendMessageParams): Promise<void> => {
  const response = await request('/server/api/chat/sendMessage', 'POST', params)
  return response.data;
}

export const getChatRecords = async (pageNum: number, pageSize: number, receiverId:number): Promise<ChatRecord[]> => {
  const { data } = await request<{ data: ChatRecord[] }>('/server/api/chat/getChatRecords', 'GET', { pageNum, pageSize, receiverId })
  return data?.data || []
}

//消息
export const getMessage = async (pageNum: number, pageSize: number): Promise<ChatRecord[]> => {
  const { data } = await request<{ data: ChatRecord[] }>('/server/api/chat/getMessage', 'GET', { pageNum, pageSize })
  return data?.data || []
}
