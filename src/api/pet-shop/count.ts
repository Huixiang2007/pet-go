import request from '@/utils/request'
//查询客户列表
export const queryCustomerList = async (params: any) => {
const res= await request(
    '/server/api/shop/shops/manage-customer',
    'POST',
    params
    )
  return res.data
  }
//获取销售额数据
export const querySalesData = async (shopId: string) => {
const res= await request(
    '/server/api/shop/shops/sales-trend',
    'GET',
    { shopId }
    )
  return res.data
  }
//店铺数据统计
export const queryShopData = async (shopId: string) => {
const res= await request(
    '/server/api/shop/shops/overview',
    'GET',
    { shopId }
    )
  return res.data
  }
//获取订单数据
export const queryOrderData = async (shopId: string) => {
const res= await request(
    '/server/api/shop/shops/order-trend',
    'GET',
    { shopId }
    )
  return res.data
  }
  //获取商品订单状态分布统计
export const queryProductOrderStatus = async (shopId: string,day:number) => {
const res= await request(
    '/server/api/shop/shops/order-status-stats',
    'GET',
    { shopId,day }
    )
  return res.data
  }
//获取热销商品排行榜
export const queryHotProduct = async (shopId: string,day:number) => {
const res= await request(
    '/server/api/shop/shops/hot-products',
    'GET',
    { shopId,day
     }
    )
  return res.data
  }
