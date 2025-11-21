import { createRouter, createWebHistory } from 'vue-router'
import PetLogin from '@/views/login.vue'

const routes = [
  // 电商的首页
  {
    path: '/shop',
    name: 'shop',
    component: import('@/views/Petshop/PetShopView.vue'),
  },
  {
    path: '/petCenter',
    name: 'petCenter',
    component: import('@/views/PetCenter.vue'),
  },
  // 宠物购物车
    {
    path: '/petCart',
    name: 'petCart',
    component: import('@/views/Petshop/PetShopCar.vue') ,
    },
    //订单结算
    {
      path:'/order',
      name:'order',
      component: () => import('@/views/Petshop/OrderCheckout.vue')
    },
    //  商品列表（分类）
{
  path: '/products/:category?',
  name: 'products',
  component: () => import('@/views/Petshop/ProductList.vue')
},
//  商品详情
{
  path: '/productDetail',
  name: 'productsDetail',
  component: () => import('@/views/Petshop/ProductDetail.vue')
},
//  订单列表
{
  path: '/OrderList',
  name: 'OrderList ',
  component: () =>import('@/views/Petshop/OrderList.vue')
},
{
  path: '/PackageInfo',
  name: 'PackageInfo',
  component: () => import('@/views/Petshop/PackageInfo.vue')
},
{
  path: '/Search',
  name: 'Search',
  component: () => import('@/views/Petshop/SearchProduct.vue')
},
  {
    path: '/Login',
    name: 'petLogin',
    component: PetLogin,
  },
  {
    path:'/Register',
    name:'register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '欢迎注册 PetGo' ,keepAlive: true
    }
  },
  {
    path:'/Protocal',
    name:'protocal',
    component: () => import('@/views/Protocal.vue'),
    meta: { title: '用户协议' }
  },


]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
