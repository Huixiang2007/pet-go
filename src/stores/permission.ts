import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { staticRoutes } from '@/router/staticRoutes'
import { asyncRoutes } from '@/router/asyncRoutes'
import { filterAsyncRoutes } from '@/utils/permission'
import request from '@/utils/request'

interface PermissionState {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
  isRoutesLoaded: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [], //完整路由列表
    addRoutes: [], //动态添加的路由
    isRoutesLoaded: false, //路由是否已加载
  }),
  getters: {
    //从所有路由中筛选出需要在侧边栏显示的路由
    sidebarRoutes: (state): RouteRecordRaw[] => {
      return state.routes.filter((router) => !router.meta?.hidden) as RouteRecordRaw[]
    },
  },
  actions: {
    //设置路由
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes //保存的动态路由
      this.routes = staticRoutes.concat(routes) //合并静态+动态路由
      this.isRoutesLoaded = true //标记已加载
    },

    async generateRoutes(roles: string[]): Promise<RouteRecordRaw[]> {
      let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)

      try {
        const res = await request('/server/api/foster/provider/judge', 'GET')
        const hasFoster = res.data
        console.log('[路由权限] 寄养服务提供者状态:', hasFoster)

        const fosterManageRoute = asyncRoutes.find((route) => route.path === '/foster-manage')
        const joinUsRoute = asyncRoutes.find((route) => route.path === '/join-us')

        if (hasFoster) {
          if (fosterManageRoute) {
            const hasFosterManage = accessedRoutes.some((route) => route.path === '/foster-manage')
            if (!hasFosterManage) {
              accessedRoutes.push(fosterManageRoute)
            }
          }
          accessedRoutes = accessedRoutes.filter((route) => route.path !== '/join-us')
        } else {
          if (joinUsRoute) {
            const hasJoinUs = accessedRoutes.some((route) => route.path === '/join-us')
            if (!hasJoinUs) {
              accessedRoutes.push(joinUsRoute)
            }
          }
          accessedRoutes = accessedRoutes.filter((route) => route.path !== '/foster-manage')
        }
      } catch (error) {
        console.error('[路由权限] 获取寄养状态失败:', error)
      }

      console.log('[路由权限] 最终路由:', accessedRoutes)

      const catchAllRoute: RouteRecordRaw = {
        path: '/:pathMatch(.*)*',
        redirect: '/login',
        meta: { hidden: true },
      }
      accessedRoutes.push(catchAllRoute)
      this.setRoutes(accessedRoutes)
      return accessedRoutes
    },
    //重置路由
    resetRoutes() {
      this.routes = []
      this.addRoutes = []
      this.isRoutesLoaded = false
    },
  },
})
