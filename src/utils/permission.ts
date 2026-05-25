import type { RouteRecordRaw } from 'vue-router'
//判断用户是否拥有访问某个路由的权限
// 输入：用户角色数组 + 路由对象
// 输出：true（有权限）或 false（无权限）

// 判断逻辑：
// ├── 路由没有配置 roles → true（无限制）
// └── 路由配置了 roles
//     ├── 用户角色在允许列表中 → true（有权限）
//     └── 用户角色不在允许列表中 → false（无权限）
export function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta?.roles) {
    return roles.some((role) => (route.meta!.roles as string[]).includes(role))
  }
  return true
}
// 根据用户角色，从路由数组中筛选出该用户可以访问的路由
// 输入：所有路由数组 + 用户角色数组
// 输出：该用户有权限访问的路由数组

// 处理流程：
// ├── 遍历每个路由
// │   ├── 有权限 → 保留，继续检查子路由
// │   │   └── 递归过滤子路由
// │   └── 无权限 → 跳过（不加入结果）
// └── 返回过滤后的路由数组
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
// 将嵌套的路由树结构转换为一维数组
// 输入：嵌套路由树
// 输出：一维路由数组（包含所有层级的路由）

// 处理流程：
// ├── 遍历每个路由
// │   ├── 先把当前路由加入结果
// │   └── 如果有子路由
// │       └── 递归展开子路由，全部加入结果
// └── 返回扁平化的一维数组
export function flattenRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    res.push(route)
    if (route.children && route.children.length > 0) {
      res.push(...flattenRoutes(route.children))
    }
  })
  return res
}
