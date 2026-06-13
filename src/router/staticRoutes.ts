import { type RouteRecordRaw } from 'vue-router'
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/test',
    component: () => import('@/views/TestPage.vue'),
    meta: {
      title: '测试页面',
      requireAuth: false,
    },
  },
  {
    path: '/login',
    component: () => import('@/views/enterPet/login-pet.vue'),
    meta: {
      title: '欢迎登录PetGo',
      requireAuth: false,
    },
  },
  {
    path: '/register',
    component: () => import('@/views/enterPet/register-pet.vue'),
    meta: {
      title: '欢迎注册PetGo',
      requireAuth: false,
    },
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('@/views/enterPet/forget-password.vue'),
    meta: { title: '找回密码', requiresAuth: false },
  },
  {
    path: '/protocal',
    name: 'protocal',
    component: () => import('@/views/enterPet/ProtocalPage.vue'),
    meta: { title: '用户协议' },
  },
]
