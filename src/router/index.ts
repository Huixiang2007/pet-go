import { createRouter, createWebHistory } from 'vue-router'
import PetShopView from '@/views/PetShopView.vue'
import PetCenter from '@/views/PetCenter.vue'
const routes = [
  {
    path: '/shop',
    name: 'shop',
    component: PetShopView,
  },
  {
    path: '/petCenter',
    name: 'petCenter',
    component: PetCenter,
  },
  {
    path: '/Login',
    name: 'petLogin',
    component: () => import('@/views/Login.vue'),
    meta: { title: '欢迎登录 PetGo' }
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
