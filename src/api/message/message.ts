import request from '@/utils/request'

// 获取客服消息记录
export const getMessage = async (product: Record<string, any>) => {
  const res = await request(`/server/api/In-site/message/queryMyMessage`, 'POST', product)
  return res.data
}

// 标记已读
export const markRead = async (params: { messageId: bigint}) => {
  const res = await request(`/server/api/In-site/message/mark/read/${params.messageId}`, 'POST')
  return res.data
}

// 标记全部已读
export const markReadAll = async (params: { userId: number }) => {
  const url = `/server/api/In-site/message/mark/read-all?userId=${params.userId}`
  const res = await request(url, 'POST')
  return res.data
}

// 获取消息详情
export const getMessageDetail = async (params: { messageId:bigint, userId: number }) => {
  const url = `/server/api/In-site/message/detail/${params.messageId}?userId=${params.userId}`
  const res = await request(url, 'GET')
  return res.data
}

// 获取未读数量
export const getUnreadCount = async (params: { userId: number }) => {
  const url = `/server/api/In-site/message/unread/count?userId=${params.userId}`
  const res = await request(url, 'GET')
  return res.data
}

// 删除消息
export const deleteMessage = async (params: { messageId: bigint}) => {
  const res = await request(`/server/api/In-site/message/delete/${params.messageId}`, 'POST')
  return res
}

// 批量删除
export const deleteBatch = async (ids: string[]) => {
  const res = await request(`/server/api/In-site/message/batch/delete`, 'POST', ids )
  return res.data
}
