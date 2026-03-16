// server/data/shopData.ts
export const shopList = [
  {
    id: 'shop1',
    name: '小明的店铺',
    avatar: 'https://picsum.photos/id/237/120/120',
    lastMessage: '您的订单已发货，请注意查收',
    lastTime: '',
    unreadCount: 2,
    goods: [
      {
        id: 'goods1',
        name: '宠物零食大礼包',
        price: '¥89.00',
        img: 'https://picsum.photos/id/237/60/60',
        sales: 128
      }
    ],
    services: [
      { icon: 'fa-truck', label: '包邮' },
      { icon: 'fa-shield', label: '正品保障' },
      { icon: 'fa-comments', label: '12h客服' },
      { icon: 'fa-undo', label: '退货包运费' }
    ]
  },
  {
    id: 'shop2',
    name: '旧书网四川旧书城',
    avatar: 'https://picsum.photos/id/169/120/120',
    lastMessage: '请确认收货地址信息',
    lastTime: '10:27',
    unreadCount: 0,
    goods: [
      {
        id: 'goods2',
        name: '二手正版 工程数学 线性代数 第六版 同济',
        price: '¥40.00',
        img: 'https://picsum.photos/60/60?book2',
        sales: 23
      }
    ],
    services: [
      { icon: 'fa-truck', label: '包邮' },
      { icon: 'fa-refresh', label: '7天无理由' },
      { icon: 'fa-shield', label: '正品保障' },
      { icon: 'fa-comments', label: '24h客服' }
    ]
  },
  {
    id: 'shop3',
    name: 'PetGo优品生活馆',
    avatar: 'https://picsum.photos/id/1074/120/120',
    lastMessage: '您的宠物零食已打包完毕',
    lastTime: '昨天',
    unreadCount: 0,
    goods: [
      {
        id: 'goods3',
        name: '进口宠物冻干零食',
        price: '¥129.00',
        img: 'https://picsum.photos/id/1074/60/60',
        sales: 89
      }
    ],
    services: [
      { icon: 'fa-truck', label: '次日达' },
      { icon: 'fa-shield', label: '正品保障' },
      { icon: 'fa-gift', label: '满赠活动' },
      { icon: 'fa-comments', label: '24h客服' }
    ]
  }
]

// 导出默认选中的店铺（第一个）
export const defaultActiveShop = shopList[0]
