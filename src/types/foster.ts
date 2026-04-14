export interface FosterHomeDetail {
  id: number
  providerType: string
  userId: number | null
  contactName: string | null
  name: string
  description: string
  province: string
  city: string
  district: string
  detailAddress: string
  longitude: number | null
  latitude: number | null

  contactPhone: string | null
  experienceYears: number | null
  maxPets: number | null
  petTypes: string | null
  environmentPhotos: string | string[]
  qualificationPhotos: string | string[]

  // 评分信息
  serviceScore: number
  environmentScore: number
  communicationScore: number
  totalScore: number
  totalOrders: number

  status: string | null
  verifiedTime: string
  createTime: string
  updateTime: string
}
export interface FosterServiceItem {
  id: number
  title: string
  basePrice: number
  description: string
  available: number
  petTypes: string
  serviceType: number
  additionalServices: AdditionalServiceItem[]
}
export interface FosterServicePageData {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: FosterServiceItem[]
  emptyFlag: boolean
  current: number
}
//附加服务的类型
export interface AdditionalServiceItem {
  id: number
  serviceId: number
  title: string
  price: number
}
export interface AdditionalServicePageData {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: AdditionalServiceItem[]
  emptyFlag: boolean
  current: number
}
//预约提交
export interface BookingSubmitParams {
  serviceId: number
  petName: string
  startDate: string
  endDate: string
  petType: string
  additionalServiceId: number[]
  specialRequirements: string
  emergencyPhone: string
  pictureUrlList: string[]
  userNotes: string
}
interface AdditionalService {
  serviceName: string
  price: number
}
//寄养订单列表
export interface FosterOrderList extends FosterOrder {
  orderNo: number
  orderStatusDesc: string
  createTime: string
  serviceName: string
  totalDays: number
  totalAmount: number
}

// 寄养订单详情类型
export interface FosterOrder {
  orderNo: number
  orderStatusDesc: string
  createTime: string
  updateTime: string
  startDate: string
  endDate: string
  totalDays: number
  specialRequirements: string
  emergencyPhone: string
  userNotes: string
  pictureUrl: string
  dailyPrice: number
  totalAmount: number
  actualPayAmount: number
  serviceName: string
  petType: string
  petName: string
  fosterProviderType: string
  fosterProviderName: string
  providerName: string
  providerPhone: string
  providerAvatar: string
  additionalServices: AdditionalService[]
}
