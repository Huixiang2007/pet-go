import request from '@/utils/request'

import type{SendMessageParams} from '@/types/chat'

//***********电商聊天
// 发送消息(客服)
export const sendMessage = async (params: SendMessageParams): Promise<any> => {
  const formData = new FormData()
  formData.append('receiverId', params.receiverId.toString())
  if (params.content) {
    formData.append('content', params.content)
  }
  if (params.image) {
    formData.append('image', params.image)
  }
  if (params.videoUrl) {
    formData.append('video', params.videoUrl)
  }
  const response = await request('/server/api/chat/sendShopMessage', 'POST', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response
  }


//获取电商的聊天记录

export const  getChatRecords= async (receiverId: number, pageNum: number, pageSize: number) => {
  const res = await request(`/server/api/chat/getShopChatMsg`, 'GET', { receiverId,pageNum, pageSize })
  return res.data;
}

//获取电商的聊天列表

export const getChatList = async (pageNum: number, pageSize: number) => {
  const res = await request(`/server/api/chat/getShopList`, 'GET', { pageNum, pageSize })
  return res.data;
}
//获取店铺的商品
export const getShopGoods = async (shopId: number,pageNum: number, pageSize: number) => {
  const res = await request(`/server/api/chat/getShopProducts`, 'GET', { shopId, pageNum, pageSize })
  return res.data;
}
//发送商品的消息
export const sendShopMessage = async (receiverId: number, productId: number) => {
  const res = await request(
    '/server/api/chat/sendShopProductMessage',
    'POST',
    null,
    { params: { receiverId, productId } }
  )
  return res.data
}
//获取未聊过天的商铺的信息
export const getShopBaseInfoByUserId=async (shopUserId: number)=>{
  const res=await request('/server/api/chat/getShopInformation', 'GET', { shopUserId })
  return res.data
}


//***********寄养聊天
export const sendFosterMessage = async (params: SendMessageParams): Promise<any> => {
  const formData = new FormData()
  formData.append('receiverId', params.receiverId.toString())
  if (params.content) {
    formData.append('content', params.content)
  }
  if (params.image) {
    formData.append('image', params.image)
  }
  if (params.videoUrl) {
    formData.append('video', params.videoUrl)
  }
  const response = await request('/server/api/chat/sendFosterMessage', 'POST', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
  }


//获取寄养的聊天记录

export const  getFosterChatRecords= async (receiverId: number, pageNum: number, pageSize: number) => {
  const res = await request(`/server/api/chat/getFosterChatMsg`, 'GET', { receiverId,pageNum, pageSize })
  return res.data;
}

//获取寄养的聊天列表

export const getFosterChatList = async (pageNum: number, pageSize: number) => {
  const res = await request(`/server/api/chat/getFosterList`, 'GET', { pageNum, pageSize })
  return res.data;
}
//获取寄养的商品
export const getFosterGoods = async (fosterProviderId: number,pageNum: number, pageSize: number) => {
  const res = await request(`/server/api/chat/getFosterServices`, 'GET', { fosterProviderId, pageNum, pageSize })
  return res.data;
}
//发送寄养的消息
export const sendFosterGoodsMessage = async (receiverId: number, fosterServiceId: number) => {
  const res = await request(
    '/server/api/chat/sendFosterServiceMessage',
    'POST',
    null,
    { params: { receiverId, fosterServiceId } }
  )
  return res.data
}
//获取未聊过天的寄养的信息
export const getFosterBaseInfoByUserId=async (fosterUserId: number)=>{
  const res=await request('/server/api/chat/getFosterInformation', 'GET', { fosterUserId })
  return res.data
}
