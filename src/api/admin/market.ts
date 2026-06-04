import request from '@/utils/request'
import type { PageParams, PageResult } from './index'

export enum SeckillActivityType {
  NORMAL = 1,
  HOURLY = 2
}

export enum SeckillType {
  PRODUCT = 1,
  COUPON = 2
}

// 状态枚举改为字符串，适配后端 @JsonValue 序列化后的中文
export type SeckillActivityStatus = '未开始' | '进行中' | '已结束' | '已禁用'
export type SeckillApplyStatus = '待审核' | '已通过' | '已拒绝' | '已撤销'

export interface SeckillActivity {
  activityId: string
  activityName: string
  activityType: SeckillActivityType
  seckillType: SeckillType
  count: number
  activityStatus: number
  startTime: string
  endTime: string
  description?: string
  mainImage?: string
  sortOrder?: number
}

export interface SeckillActivityCreateForm {
  activityName: string
  activityType: SeckillActivityType
  seckillType: SeckillType
  startTime: string
  endTime: string
  description?: string
  mainImage?: string
  sortOrder?: number
}

export interface SeckillActivityUpdateForm extends SeckillActivityCreateForm {
  activityId: string
}

export interface SeckillActivityListForm extends PageParams {
  activityName?: string
  activityStatus?: number
  activityType?: number
  seckillType?: number
  sortField?: number
  sortOrder?: number
}

export interface SeckillApply {
  applyId: string
  productName: string
  specText: string
  seckillPrice: number
  stock: number
  limitPerUser: number
  auditStatus: SeckillApplyStatus
  allocateStatus: number
  createTime: string
}

export interface SeckillApplyQueryForm extends PageParams {
  productName?: string
  auditStatus?: number
}

export interface SeckillProductAuditForm {
  applyId: string
  auditResult: number
  auditComment: string
}

export interface SeckillProductAddForm {
  activityId: string
  applyIds: string[]
}

export interface ActivityAddVO {
  activityId: string
  activityName: string
}

const BASE_URL = '/server/api/shop/market/platform'

const marketApi = {
  // 活动管理
  createActivity(form: SeckillActivityCreateForm) {
    return request(`${BASE_URL}/activity-create`, 'POST', form)
  },
  getActivityList(form: SeckillActivityListForm) {
    return request<PageResult<SeckillActivity>>(`${BASE_URL}/activity-list`, 'POST', form)
  },
  updateActivity(form: SeckillActivityUpdateForm) {
    return request(`${BASE_URL}/activity-update`, 'POST', form)
  },
  getActivityDetail(activityId: string) {
    return request(`${BASE_URL}/activity-detail/${activityId}`, 'GET')
  },
  getSeckillActivityContent(activityId: string) {
    return request(`${BASE_URL}/activity/${activityId}`, 'GET')
  },
  updateActivityStatus(form: { activityId: string, status: number }) {
    return request(`${BASE_URL}/activity-status`, 'POST', form)
  },
  deleteActivity(activityIds: string[]) {
    return request(`${BASE_URL}/activity-delete`, 'POST', activityIds)
  },

  // 申请管理
  getApplyList(form: SeckillApplyQueryForm) {
    return request<PageResult<SeckillApply>>(`${BASE_URL}/apply-list`, 'POST', form)
  },
  getApplyDetail(applyId: string) {
    return request(`${BASE_URL}/apply-detail/${applyId}`, 'GET')
  },
  auditApply(form: SeckillProductAuditForm) {
    return request(`${BASE_URL}/apply-audit`, 'POST', form)
  },

  // 商品分配
  addProductToActivity(form: SeckillProductAddForm) {
    return request(`${BASE_URL}/add-product`, 'POST', form)
  },
  getActivityProductAddList() {
    return request<PageResult<ActivityAddVO>>(`${BASE_URL}/activity-product-add-list`, 'POST', {})
  },
  removeProductFromActivity(relationIds: string[]) {
    return request(`${BASE_URL}/remove-product-batch`, 'POST', relationIds)
  },
  removeCouponFromActivity(relationIds: string[]) {
    return request(`${BASE_URL}/remove-coupon-batch`, 'POST', relationIds)
  },

  // 平台优惠券管理
  createCoupon(form: any) {
    return request(`${BASE_URL}/create-coupon`, 'POST', form)
  },
  updateCoupon(form: any) {
    return request(`${BASE_URL}/update-coupon`, 'POST', form)
  },
  getCouponList(form: any) {
    return request(`${BASE_URL}/coupon-list`, 'POST', form)
  },
  enableCoupon(couponIds: string[]) {
    return request(`${BASE_URL}/enable-coupon`, 'POST', couponIds)
  },
  disableCoupon(couponIds: string[]) {
    return request(`${BASE_URL}/disable-coupon`, 'POST', couponIds)
  },
  getCouponDetail(couponId: string) {
    return request(`${BASE_URL}/coupon-detail/${couponId}`, 'GET')
  },
  getProductTypes() {
    return request(`${BASE_URL}/product-types`, 'GET')
  },
  
  // 优惠券分配活动
  addCouponToActivity(form: { activityId: string, couponIds: string[] }) {
    return request(`${BASE_URL}/add-to-activity`, 'POST', form)
  },
  getSeckillCouponActivityAddList() {
    return request(`${BASE_URL}/activity-coupon-add-list`, 'POST', {})
  }
}

export default marketApi
