
import type {CartItem} from '../../types/shop'
import request from '@/utils/request'
//获取购物车的商品列表
export const getCartItems = async (pageNum: number, pageSize: number,selectStatus?:string): Promise<CartItem[]> => {
 const response = await request(
    `/server/api/shop/shop-cart/page-list?pageNum=${pageNum}&pageSize=${pageSize}&selectStatus=${selectStatus}`,
    'GET'
  );
  return response.data.list || [];
};
//修改购物车的数量
export const updateCartItemQuantity = async (cartId: string, quantity: number): Promise<void> => {
  await request('/server/api/shop/shop-cart/update-quantity', 'POST', {
    cartId,
    quantity
  })
}
//购物车商品总数量
export const getCartTotalCount = async (): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/total-count', 'GET')
  return response || 0
}
//购物车商品总价格
export const getCartTotalCountPrice = async (): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/total-price', 'GET')
  return response || 0
}
//购物车商品优惠总价格
export const discountTotalCountPrice = async (): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/total-price-coupon', 'GET')
  return response || 0
}
//购物车选中/取消选中
export const updateCartItemSelected = async (cartId: string, selected:number): Promise<any> => {
  const response =  await request('/server/api/shop/shop-cart/select', 'POST', {
    cartId,
    selected
  })
  return response || 0
}
//购物车全选
export const selectAllCartItems = async (selected:number): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/select-all?selected='+selected, 'POST')
  return response || 0
}
//单个删除
export const deleteCartItem = async (cartId: string): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/remove/'+cartId, 'POST')
  return response || 0
}
//批量删除
export const deleteCartItems = async (cartIds: string[]): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/batch-remove', 'POST', cartIds)
  return response || 0
}

//清空购物车
export const clearCartItems = async (): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/clear', 'POST')
  return response || 0
}
//批量选中
export const selectCartItems = async (cartIds: string[]): Promise<any> => {
  const response = await request('/server/api/shop/shop-cart/batch-select', 'POST',
    cartIds)
  return response || 0
}

// 订单

// 获取我的订单
export const getMyOrders = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/my-orders', 'POST', param)
  return response || 0
}

// 提交订单
export const submitOrder = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/create-order', 'POST', param)
  return response
}

// 支付订单（立即支付）
export const payOrder = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/pay-order-immediate?orderSn=' + param.orderSn, 'POST')
  return response
}

// 支付订单（购物车）
export const payOrderCart = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/pay-order', 'POST', param)
  return response
}

//  取消订单（立即支付）
export const cancelOrder = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/cancel-immediate?orderSn=' + param.orderSn, 'POST')
  return response
}

// 取消订单（购物车批量）
export const cancelOrderCart = async (orderSn: string[]): Promise<any> => {
  const response = await request('/server/api/shop/order/cancel', 'POST', { orderSn })
  return response
}

// 订单详情
export const orderDetail = async (orderSn: string): Promise<any> => {
  const response = await request(`/server/api/shop/order/detail/${orderSn}`, 'GET')
  return response
}
//获取地址/api/shop/user-address-manage/page-query

export const getAddressList = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/user-address-manage/page-query', 'POST', param)
  return response
  }
  //获取默认地址api/shop/user-address-manage/get-default-address
  export const getDefaultAddress = async (): Promise<any> => {
    const response = await request('/server/api/shop/user-address-manage/get-default-address', 'POST')
    return response
  }
  //修改默认地址
  export const updateDefaultAddress = async (addressId: string): Promise<any> => {
    const response = await request(`/server/api/shop/user-address-manage/set-default-address/${addressId}`, 'POST', {
      addressId
    })
    return response
  }


  //申请退款
  export const applyRefund = async (param: any): Promise<any> => {
    const response = await request('/server/api/shop/order/refund-apply', 'POST', param)
    return response
  }
//确认收货
export const confirmOrder = async (orderSn: string): Promise<any> => {
  const response = await request(`/server/api/shop/order/confirm/${orderSn}`, 'POST')
  return response
  }
  //处理退款申请
  export const handleRefund = async (param: any): Promise<any> => {
    const response = await request('/server/api/shop/order/handle-refund', 'POST', param)
    return response
  }
//查讯退款申请详情
export const getRefundDetail = async (refundId: string): Promise<any> => {
  const response = await request('/server/api/shop/order/refund-detail', 'POST', {
    refundId
  })
  return response
  }
//退款处理（商户端）
export const handleRefundMerchant = async (refundId: string): Promise<any> => {
  const response = await request('/server/api/shop/order/handle-refund-merchant', 'POST', {
    refundId
  })
  return response
}
//退款申请列表

export const getRefundList = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/refund-list', 'POST', param)
  return response
}
//商家发活
export const shipOrder = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/ship-order', 'POST', param)
  return response
}
//模拟商家收货
export const shopRefundReceive = async (refundId: string): Promise<any> => {
  const response = await request('/server/api/shop/order/shop-refund-receive', 'POST', {
    refundId
  })
  return response
}
//用户发货
export const userRefundDelivery = async (refunId: string): Promise<any> => {
  const response = await request('/server/api/shop/order/user-refund-delivery', 'POST', {
    refunId
  })
  return response
}
//商家查看订单列表
export const getShopOrderList = async (param: any): Promise<any> => {
  const response = await request('/server/api/shop/order/shop-order-list', 'POST', param)
  return response
}
