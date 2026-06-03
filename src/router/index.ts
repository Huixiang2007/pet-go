import { createRouter, createWebHistory } from 'vue-router'
import { store, usePermissionStore, useUserStore } from '@/stores'
import { staticRoutes } from './staticRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || 'PetGo'

  // 检查是否有 token
  const hasToken = localStorage.getItem('authToken')

  // 已登录情况
  if (hasToken) {
    // 已登录但想进入登录页，跳转到首页
    if (to.path === '/login') {
      const userRole = localStorage.getItem('userRole') || '用户'
      next(userRole === '管理员' ? '/admin' : '/foster-care')
      return
    }

    // 检查动态路由是否已加载
    const permissionStore = usePermissionStore(store)
    if (!permissionStore.isRoutesLoaded) {
      // 加载动态路由
      try {
        const userStore = useUserStore(store)
        const roles = await userStore.getUserInfo()
        const accessRoutes = await permissionStore.generateRoutes(roles)

        accessRoutes.forEach((route) => {
          router.addRoute(route)
        })

        permissionStore.isRoutesLoaded = true
        next({ ...to, replace: true })
        return
      } catch (error) {
        console.error('加载路由失败:', error)
        localStorage.removeItem('authToken')
        next('/login')
        return
      }
    }

    next()
    return
  }

  // 未登录情况：白名单页面直接放行
  const whiteList = ['/login', '/register', '/forget', '/protocal', '/404', '/test']
  if (whiteList.includes(to.path)) {
    next()
    return
  }

  // 未登录且不在白名单，跳转到登录页
  next({
    path: '/login',
    query: { redirect: to.fullPath },
  })
})

router.afterEach(() => {})

export default router
