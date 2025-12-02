import { createRouter, createWebHistory } from 'vue-router'
const FosterCare = () => import('@/views/FosterCare.vue')
const routes = [
  {
    path: '/fosterCare',
    name: 'fosterCare',
    component: FosterCare,
  },

  {
    path: '/fosterdetail/:id',
    name: 'fosterDetail',
    component: import('@/views/FosterDetail.vue'),
  },
  {
    path: '/fosterBook/:fosterId/:packageId',
    name: 'fosterBook',
    component: import('@/views/FosterBook.vue'),
  },
  // 电商的首页
  {
    path: '/shop',
    name: 'shop',
    component: import('@/views/Petshop/PetShopView.vue'),
  },
  // 宠物购物车
  {
    path: '/petCart',
    name: 'petCart',
    component: import('@/views/Petshop/PetShopCar.vue'),
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
    path: '/productDetail',
    name: 'productsDetail',
    component: () => import('@/views/Petshop/ProductDetail.vue'),
  },
  //  订单列表
  {
    path: '/OrderList',
    name: 'OrderList ',
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
  {
    path: '/Login',
    name: 'petLogin',
    component: () => import('@/views/EnterPet/login.vue'),
    meta: { title: '欢迎登录 PetGo' },
  },
  {
    path: '/MyPet',
    name: 'MyPet',
    component: () => import('@/views/MyPet.vue'),
  },

  {
    path: '/add-pet',
    name: 'AddPet',
    component: () => import('@/views/AddPet.vue'),
  },
  {
    path: '/Register',
    name: 'register',
    component: () => import('@/views/EnterPet/Register.vue'),
    meta: { title: '欢迎注册 PetGo' },
  },
  {
    path: '/Protocal',
    name: 'protocal',
    component: () => import('@/views/EnterPet/Protocal.vue'),
    meta: { title: '用户协议' },
  },
  {
    path: '/Forget',
    name: 'forget',
    component: () => import('@/views/EnterPet/ForgetPassword.vue'),
    meta: { title: '找回密码' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
