import { createRouter, createWebHistory } from 'vue-router'
import PetLogin from '@/views/login.vue'

const routes = [
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
    {
    path: '/petCart',
    name: 'petCart',
    component: import('@/views/Petshop/PetShopCar.vue') ,
    },
    {
      path:'/order',
      name:'order',
      component: () => import('@/views/Petshop/OrderCheckout.vue')
    },
{
  path: '/products/:category?',
  name: 'products',
  component: () => import('@/views/Petshop/ProductList.vue')
},
{
  path: '/productDetail',
  name: 'productsDetail',
  component: () => import('@/views/Petshop/ProductDetail.vue')
},
  {
    path: '/login',
    name: 'petLogin',
    component: PetLogin,
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
