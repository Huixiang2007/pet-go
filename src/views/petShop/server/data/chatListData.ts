
import type { ChatList } from '@/types/chat'
import { getChatList,getFosterChatList} from '@/api/message/chat'

export const getShopList: ChatList[] = []

export const defaultActiveShop: ChatList = {
  shopId: 0,
  shopName: '加载中...',
  shopAvatar: '/public/img/_趣味小星星_爱给网_aigei_com.gif',
  unreadCount: 0,
  lastMsgContent: '',
  lastMsgTime: '',
  userId: 0
}

export const shopList = async function () {
  const pageNum = 1
  const pageSize = 10
  try {
    const res = await getChatList(pageNum, pageSize)
    console.log('获取电商聊天列表成功:', res)
    if (res.records.length > 0) {
      getShopList.length = 0
      res.records.forEach(item => getShopList.push(item))
      return getShopList
    }
    return []
  } catch (err) {
    console.error('获取电商聊天列表失败:', err)
    return []
  }
}



//寄养

export const getFosterList: ChatList[] = []
export const defaultActiveFoster: ChatList = {
  shopId: 0,
  shopName: '加载中...',
  shopAvatar: '/public/img/_趣味小星星_爱给网_aigei_com.gif',
  unreadCount: 0,
  lastMsgContent: '',
  lastMsgTime: '',
  userId: 0
}

export const forserList = async function () {
  const pageNum = 1
  const pageSize = 10
  try {
    const res = await getFosterChatList(pageNum, pageSize)
    console.log('获取寄养聊天列表成功:', res)
    if (res.records.length > 0) {
      getFosterList.length = 0
      res.records.forEach(item => getFosterList.push(item))
      return getFosterList
    }
    return []
  } catch (err) {
    console.error('获取寄养聊天列表失败:', err)
    return []
  }
}
