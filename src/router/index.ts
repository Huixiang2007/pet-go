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
  // 电商的首页
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/Petshop/PetShopView.vue'),
  },
  // 宠物购物车
  {
    path: '/pet-cart',
    name: 'petCart',
    component: () => import('@/views/Petshop/PetShopCar.vue'),
  },
  //订单结算
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Petshop/OrderCheckout.vue'),
  },
  //  商品列表（分类）
  {
    path: '/products/:category?',
    name: 'products',
    component: () => import('@/views/Petshop/ProductList.vue'),
  },
  //  商品详情
  {
    path: '/producDetail/:id',
    name: 'productsDetail',
    component: () => import('@/views/Petshop/ProductDetail.vue'),
  },
  //  订单列表
  {
    path: '/order-list',
    name: 'orderList ',
    component: () => import('@/views/Petshop/OrderList.vue'),
  },
  //物流信息
  {
    path: '/PackageInfo',
    name: 'PackageInfo',
    component: () => import('@/views/Petshop/PackageInfo.vue'),
  },
  //  搜索
  {
    path: '/Search',
    name: 'Search',
    component: () => import('@/views/Petshop/SearchProduct.vue'),
  },
  // 店铺
  {
    path: '/Store',
    name: 'Store',
    component: () => import('@/views/Petshop/ShopStore.vue'),
  },
  // 注册店铺
  // {
  //   path: '/StoreRegister',
  //   name: 'StoreRegister',
  //   component: () => import('@/views/Petshop/SellerRegisition.vue'),
  // },
  // 订单管理
  {
    path: '/SellerOrderManager',
    name: 'SellerOrderManager',
    component: () => import('@/views/Petshop/SellerOrderMana.vue'),
  },
  // 电商用户管理

  {
    path: '/SellerUserManager',
    name: 'SellerUserManager',
    component: () => import('@/views/Petshop/SellerUserMana.vue'),
  },
  // 优惠卷管理
  {
    path: '/CouponManagement',
    name: 'CouponManagement',
    component: () => import('@/views/Petshop/CouponManagement.vue'),
  },
  // 商品管理
  {
    path: '/SellerItemManager',
    name: 'SellerItemManager',
    component: () => import('@/views/Petshop/SellerItemMana.vue'),
  },
  // 店铺设置
  {
    path: '/ShopSetting',
    name: '/ShopSetting',
    component: () => import('@/views/Petshop/ShopSetting.vue'),
  },
  {
    path: '/AddProduct',
    name: 'addProduct',
    component: () => import('@/views/Petshop/AddProduct.vue'),
    meta: { title: '欢迎注册 PetGo' },
  },
  // 销售分析
  {
    path: '/Analytics',
    name: 'Analytics',
    component: () => import('@/views/Petshop/SalesAnalytics.vue'),
  },
  // 秒杀
  {
    path: '/FlashSale',
    name: 'FlashSale',
    component: () => import('@/views/Petshop/FlashSale.vue'),
  },
  //消息
  {
    path: '/customer-service',
    name: 'customerService',
    component: () => import('@/views/Petshop/CustomerService.vue'),
  },
  // 添加商品
  {
    path: '/AddProduct',
    name: 'AddProduct',
    component: () => import('@/views/Petshop/AddProduct.vue'),
  },
  //登录
  {
    path: '/login',
    name: 'petLogin',
    component: () => import('@/views/EnterPet/login.vue'),
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
  //注册
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/EnterPet/Register.vue'),
    meta: { title: '欢迎注册 PetGo' },
  },

  //协议
  {
    path: '/protocal',
    name: 'protocal',
    component: () => import('@/views/EnterPet/Protocal.vue'),
    meta: { title: '用户协议' },
  },
  //找回密码
  {
    path: '/forget',
    name: 'forget',
    component: () => import('@/views/EnterPet/ForgetPassword.vue'),
    meta: { title: '找回密码' },
  },
  //个人中心
  {
    path: '/person',
    name: 'personalCenter',
    component: () => import('@/views/PersonalCenter.vue'),
    meta: { title: '个人中心' },
  },
  {
    path: '/join-us',
    name: 'joinUs',
    component: () => import('@/views/JoinUs.vue'),
    meta: { title: '加入我们' },
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
