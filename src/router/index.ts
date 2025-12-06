import { createRouter, createWebHistory } from 'vue-router'
const FosterCare = () => import('@/views/FosterCare.vue')
const routes = [
  // 寄养首页
  {
    path: '/foster-care',
    name: 'fosterCare',
    component: FosterCare,
  },
  // 寄养详情
  {
    path: '/foster-detail/:id',
    name: 'fosterDetail',
    component: import('@/views/FosterDetail.vue'),
  },
  // 寄养预订
  {
    path: '/foster-book/:fosterId/:packageId',
    name: 'fosterBook',
    component: import('@/views/FosterBook.vue'),
  },
  //寄养方管理
  {
    path: '/foster-manage',
    name: 'fosterManage',
    component: import('@/views/FosterManage.vue'),
  },
  // 电商的首页
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/petShop/shop/PetShopView.vue'),
  },
  // 宠物购物车
  {
    path: '/pet-cart',
    name: 'petCart',
    component: () => import('./src/views/petShop/order/PetShopCar.vue'),
  },
  //订单结算
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/petShop/order/OrderCheckout.vue'),
  },
  //  商品列表（分类）
  {
    path: '/products/:category?',
    name: 'products',
    component: () => import('@/views/petShop/products/ProductList.vue'),
  },
  //  商品详情
  {
    path: '/product-detail/:id',
    name: 'productsDetail',
    component: () => import('@/views/petShop/products/ProductDetail.vue'),
  },
  //  订单列表
  {
    path: '/order-list',
    name: 'OrderList ',
    component: () => import('@/views/petShop/order/OrderList.vue'),
  },
  //物流信息
  {
    path: '/package-info',
    name: 'PackageInfo',
    component: () => import('@/views/petShop/server/PackageInfo.vue'),
  },
  //  搜索
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/petShop/shop/SearchProduct.vue'),
  },
  // 店铺
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/petShop/shop/ShopStore.vue'),
  },
  // 注册店铺
  {
    path: '/store-register',
    name: 'StoreRegister',
    component: () => import('@/views/petShop/shop/SellerRegisition.vue'),
  },
  // 订单管理
  {
    path: '/seller-order-manager',
    name: 'SellerOrderManager',
    component: () => import('@/views/petShop/order/SellerOrderMana.vue'),
  },
  // 电商用户管理

  {
    path: '/seller-user-manager',
    name: 'SellerUserManager',
    component: () => import('@/views/petShop/user/SellerUserMana.vue'),
  },
  // 优惠卷管理
  {
    path: '/coupon-management',
    name: 'CouponManagement',
    component: () => import('@/views/petShop/marketing/CouponManagement.vue'),
  },
  // 商品管理
  {
    path: '/seller-item-manager',
    name: 'SellerItemManager',
    component: () => import('@/views/petShop/shop/SellerItemMana.vue'),
  },
  // 店铺设置
  {
    path: '/shop-setting',
    name: '/ShopSetting',
    component: () => import('@/views/petShop/shop/ShopSetting.vue'),
  },
      {
    path: '/join-us',
    name: '/JoinUs',
    component: () => import('@/views/JoinUs.vue'),
  },
  {
    path: '/add-product',
    name: 'addProduct',
    component: () => import('@/views/petShop/product/AddProduct.vue'),
    meta: { title: '欢迎注册 PetGo' },
  },
  // 销售分析
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/petShop/data/SalesAnalytics.vue'),
  },
  // 秒杀
  {
    path: '/flash-sale',
    name: 'FlashSale',
    component: () => import('@/views/petShop/marketing/FlashSale.vue'),
  },
  //消息
  {
    path: '/customer-service',
    name: 'CustomerService',
    component: () => import('@/views/petShop/server/CustomerService.vue'),
  },
  // 添加商品
  {
    path: '/add-product',
    name: 'AddProduct',
    component: () => import('@/views/petShop/product/AddProduct.vue'),
    meta: { title: '欢迎注册 PetGo' },
  },
  //登录
  {
    path: '/login',
    name: 'petLogin',
    component: () => import('@/views/enterPet/LoginPet.vue'),
    meta: { title: '欢迎登录 PetGo' },
  },
  {
    path: '/my-pets',
    name: 'myPets',
    component: () => import('@/views/MyPets.vue'),
  },

  {
    path: '/add-pet',
    name: 'addPet',
    component: () => import('@/views/AddPet.vue'),
  },
  //加入我们
  {
    path: '/join-us',
    name: 'joinUs',
    component: () => import('@/views/JoinUs.vue'),
  },
  //注册
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/enterPet/RegisterPet.vue'),
    meta: { title: '欢迎注册 PetGo' },
  },

  //协议
  {
    path: '/protocal',
    name: 'protocal',
    component: () => import('@/views/enterPet/ProtocalPage.vue'),
    meta: { title: '用户协议' },
  },
  //找回密码
  {
    path: '/forget',
    name: 'forget',
    component: () => import('@/views/enterPet/ForgetPassword.vue'),
    meta: { title: '找回密码' },
  },
  //个人中心
  {
    path: '/person',
    name: 'PersonalCenter',
    component: () => import('@/views/user/PersonalCenter.vue'),
    meta: { title: '个人中心' },
  },
  //后台管理
  {
    path: '/admin',
    name: 'homePage',
    component: () => import('@/views/admin/HomePage.vue'),
    meta: { title: '后台管理' },
    children: [
      // 数据概览

      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/admin/components/AllCompete.vue'),
        meta: {
          title: '数据概览',
        },
      },
      // 用户管理
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/admin/components/AllUser.vue'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-user',
        },
      },
      // 寄养服务管理
      {
        path: 'foster',
        name: 'foster',
        meta: {
          title: '寄养服务管理',
          icon: 'el-icon-house',
        },
        children: [
          {
            path: 'audit',
            name: 'fosterAudit',
            component: () => import('@/views/admin/components/AllJudge.vue'),
            meta: {
              title: '服务审核',
            },
          },
          {
            path: 'orders',
            name: 'fosterOrder',
            component: () => import('@/views/admin/components/AllOrder.vue'),
            meta: {
              title: '寄养订单',
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_AURL),
  routes,
})
/**
 * 路由导航守卫
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
