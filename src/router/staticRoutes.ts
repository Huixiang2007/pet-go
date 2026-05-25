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
  // 注意：兜底路由 /:pathMatch(.*)* 不能放在这里！
  // 它必须在动态路由加载完成后再添加，否则会拦截所有动态路由导致白屏。
  // 兜底路由在 permission.ts 的 generateRoutes 末尾动态添加。
]
