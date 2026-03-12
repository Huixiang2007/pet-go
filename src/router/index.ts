import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  // 寄养首页
  {
    path: '/foster-care',
    name: 'fosterCare',
    component: () => import('@/views/fosterCare/FosterCare.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  // 寄养详情
  {
    path: '/foster-detail/:id',
    name: 'fosterDetail',
    component: () => import('@/views/fosterCare/FosterDetail.vue'),
  },
  // 寄养预订
  {
    path: '/foster-book/:fosterId/:serviceId',
    name: 'fosterBook',
    component: () => import('@/views/fosterCare/FosterBook.vue'),
  },
  //寄养方管理
  {
    path: '/foster-manage',
    name: 'fosterManage',
    component: () => import('@/views/fosterCare/FosterManage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  //寄养订单
  {
    path: '/foster-order',
    name: 'fosterOrder',
    component: () => import('@/views/fosterCare/foster-orders.vue'),
  },
  // 电商的首页
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/petShop/shop/pet-shop-view.vue'),
    meta: {
      requiresAuth: true,
      title: '欢迎来到宠物商城',
    },
  },
  // 宠物购物车
  {
    path: '/pet-cart',
    name: 'petCart',
    component: () => import('@/views/petShop/order/pet-shop-car.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo购物车',
    },
  },
  //订单结算
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/petShop/order/order-checkout.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo订单结算',
    },
  },
  //  商品列表（分类）
  {
    path: '/products/:category?',
    name: 'products',
    component: () => import('@/views/petShop/product/product-list.vue'),
  },
  //  商品详情
  {
    path: '/product-detail/:id',
    name: 'productsDetail',
    component: () => import('@/views/petShop/product/product-detail.vue'),
    meta: {
      title: 'PetGo商品详情',
    },
  },
  //  订单列表
  {
    path: '/order-list',
    name: 'OrderList ',
    component: () => import('@/views/petShop/order/order-list.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo订单列表',
    },
  },
  //物流信息
  {
    path: '/package-info',
    name: 'PackageInfo',
    component: () => import('@/views/petShop/server/package-info.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo物流信息',
    },
  },
  //  搜索
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/petShop/product/search-product.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo搜索',
    },
  },
  // 店铺
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/petShop/shop/shop-store.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo店铺',
    },
  },
  // 订单管理
  {
    path: '/seller-order-manager',
    name: 'SellerOrderManager',
    component: () => import('@/views/petShop/order/seller-order-mana.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo订单管理',
    },
  },
  // 电商用户管理

  {
    path: '/seller-user-manager',
    name: 'SellerUserManager',
    component: () => import('@/views/petShop/user/seller-user-mana.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo用户管理',
    },
  },
  // 优惠卷管理
  {
    path: '/coupon-management',
    name: 'CouponManagement',
    component: () => import('@/views/petShop/marketing/coupon-management.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo优惠卷管理',
    },
  },
  // 商品管理
  {
    path: '/seller-item-manager',
    name: 'SellerItemManager',
    component: () => import('@/views/petShop/product/seller-item-mana.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo商品管理',
    },
  },
  // 店铺设置
  {
    path: '/shop-setting',
    name: '/ShopSetting',
    component: () => import('@/views/petShop/shop/shop-setting.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo店铺设置',
    },
  },
  // 销售分析
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/petShop/data/sales-analytics.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo销售分析',
    },
  },
  // 秒杀
  {
    path: '/flash-sale',
    name: 'FlashSale',
    component: () => import('@/views/petShop/marketing/flash-sale.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo秒杀',
    },
  },
  //消息
  {
    path: '/customer-service',
    name: 'CustomerService',
    component: () => import('@/views/petShop/server/customer-service.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo消息',
    },
  },
  // 添加商品
  {
    path: '/add-product',
    name: 'AddProduct',
    component: () => import('@/views/petShop/product/add-product.vue'),
    meta: { title: 'PetGo添加商品', requiresAuth: true },
  },
  //登录
  {
    path: '/login',
    name: 'petLogin',
    component: () => import('@/views/enterPet/LoginPet.vue'),
    meta: { title: '欢迎登录 PetGo', requiresAuth: false },
  },
  {
    path: '/my-pets',
    name: 'myPets',
    component: () => import('@/views/myPets/MyPets.vue'),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/add-pet',
    name: 'addPet',
    component: () => import('@/views/myPets/AddPet.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/edit-pet/:petId',
    name: 'editPet',
    component: () => import('@/views/myPets/AddPet.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  //加入我们
  {
    path: '/join-us',
    name: 'joinUs',
    component: () => import('@/views/joinUs/JoinUs.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  //注册
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/enterPet/RegisterPet.vue'),
    meta: { title: '欢迎注册 PetGo', requiresAuth: false },
  },

  //协议
  {
    path: '/protocal',
    name: 'protocal',
    component: () => import('@/views/enterPet/ProtocalPage.vue'),
    meta: { title: '用户协议' },
  },
  //找回密码
  {
    path: '/forget',
    name: 'forget',
    component: () => import('@/views/enterPet/ForgetPassword.vue'),
    meta: { title: '找回密码', requiresAuth: false },
  },

  {
    path: '/persons',
    name: 'PersonalCenter',
    component: () => import('@/views/userCenter/PersonCenter.vue'),
    meta: { title: '个人中心' },
  },
  //后台管理
  {
    path: '/admin',
    component: () => import('@/views/admin/HomePage.vue'),
    meta: { title: '后台管理', requiresAuth: true },
    children: [
      // 数据概览
      {
        path: '', // 空路径 = /admin 默认子路由
        redirect: '/admin/data', // 等价于 /admin/data
        name: 'homePage',
      },
      {
        path: 'data',
        name: 'dashboard',
        component: () => import('@/views/admin/components/AllCompete.vue'),
        meta: {
          title: '数据概览',
        },
      },
      // 用户管理
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/admin/components/AllUser.vue'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-user',
        },
      },
      // 寄养服务管理
      {
        path: 'foster',
        name: 'foster',
        component: () => import('@/views/admin/components/foster/FosterAudit.vue'),
        meta: {
          title: '寄养服务管理',
          icon: 'el-icon-house',
        },
      },
      //活动管理路由
      {
        path: 'active',
        name: 'active',
        redirect: '/admin/active/create',
        meta: { title: '活动管理', icon: 'el-icon-s-promotion' },
        children: [
          {
            path: 'create',
            name: 'activeCreate',
            component: () => import('@/views/admin/components/active/activeCreate.vue'), // 替换为实际路径
            meta: { title: '活动创建' },
          },
          {
            path: 'manage',
            name: 'activeManage',
            component: () => import('@/views/admin/components/active/activeManage.vue'), // 替换为实际路径
            meta: { title: '活动管理' },
          },
          {
            path: 'dashboard',
            name: 'activeDashboard',
            component: () => import('@/views/admin/components/active/activeDashboard.vue'), // 替换为实际路径
            meta: { title: '数据看板' },
          },
        ],
      },
      // 内容管理路由
      {
        path: 'content',
        name: 'content',
        redirect: '/admin/content/check',
        meta: { title: '内容管理', icon: 'el-icon-edit-pen' },
        children: [
          {
            path: 'check',
            name: 'contentCheck',
            component: () => import('@/views/admin/components/content/ContentCheck.vue'), // 替换为实际路径
            meta: { title: '内容审核' },
          },
          {
            path: 'comment',
            name: 'contentComment',
            component: () => import('@/views/admin/components/content/ContentComment.vue'), // 替换为实际路径
            meta: { title: '评论管理' },
          },
        ],
      },
      //通知发布
      {
        path: 'send',
        name: 'send',
        component: () => import('@/views/admin/components/AllSend.vue'),
        meta: {
          title: '通知发布',
          icon: 'el-icon-message',
        },
      },
    ],
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
  const requiresAuth = to.meta.requiresAuth ?? false
  const isLogin = !!localStorage.getItem('authToken')
  const isAdminRoute = to.path.startsWith('/admin')
  if (requiresAuth && !isLogin) {
    ElMessage.warning('请先登录后再访问')
    // 跳转到登录页，并记录当前页面路径（登录后可返回）
    next({
      path: '/login',
      query: { redirect: to.fullPath }, // 携带要返回的页面路径
    })
  } else if (isAdminRoute && isLogin) {
    // 如果访问的是管理员页面且已登录，需要进一步验证权限
    // 获取存储在localStorage中的用户角色信息
    const userRole = localStorage.getItem('userRole')

    if (userRole === '管理员') {
      // 是管理员，允许访问
      next()
    } else {
      // 不是管理员，拒绝访问
      ElMessage.error('请您登录后访问此页面')
      // 重定向到首页或其他合适页面
      next('/')
    }
  } else {
    // 已登录/无需登录 → 正常访问
    next()
  }
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  if (to.path === '/login') {
    return true
  }

  // 已登录 → 允许访问
  return true
})

export default router
