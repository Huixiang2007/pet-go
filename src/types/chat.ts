export interface ChatList {
  shopId: number
  shopName: string
  shopAvatar: string
  unreadCount: number
  lastMsgContent: string
  lastMsgTime: string
  userId:number
  fosterProviderId?:number
  fosterProviderName?:string
  fosterProviderAvatar?:string

}
export interface SendMessageParams {
  receiverId: number
  videoUrl?: File
  content?: string
  image?: File
}
export interface  ChatRecord {
  id: string
  type: 'user' | 'shop'
  content: string
  msgType: string
  time: string
  isImage?: boolean
  imageUrl?: string
  image?:string
  isWithdrawn?: boolean
  isGoods?: boolean
  isService?: boolean
  goodsInfo?: {
    id: number
    title: string
    currentPrice: number
    sales: number
    mainImage: string
  }
  serviceInfo?: {
    id: number
    title: string
    currentPrice: number
    sales: number
    mainImage: string
    petTypes?: string
    serviceDescription?: string
  }
}
