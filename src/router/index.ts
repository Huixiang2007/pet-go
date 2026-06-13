
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
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
  //促销活动详情
  {
    path: '/promotion',
    name: 'promotionDetail',
    component: () => import('@/views/petShop/shop/PromotionDetail.vue'),
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
  //优惠卷中心
    {
    path: '/coupon',
    name: 'coupon',
    component: () => import('@/views/petShop/marketing/CouponDisplay.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo优惠卷中心',
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
  // 电商的首页
  {
    path: '/shop',
    name: 'shops',
    component: () => import('@/views/petShop/shop/pet-shop-view.vue'),
    meta: {
      requiresAuth: true,
      title: '欢迎来到宠物商城',
    },
  },
{
  path: '/flash-sale',
  name: 'flashSale',
  component: () => import('@/views/petShop/marketing/flash-sale.vue'),
  meta: { title: '限时秒杀' }
},
{
  path: '/seller/flash-sale/apply',
  name: 'sellerFlashSaleApply',
  component: () => import('@/views/petShop/marketing/seller-flash-sale-apply.vue'),
  meta: { title: '申请秒杀活动', requiresAuth: true, role: 'seller' }
},
{
  path: '/seller/flash-sale/records',
  name: 'sellerFlashSaleRecords',
  component: () => import('@/views/petShop/marketing/seller-flash-sale-records.vue'),
  meta: { title: '秒杀活动记录', requiresAuth: true, role: 'seller' }
},
{
  path: '/seller/flash-sale/participated',
  name: 'sellerFlashSaleParticipated',
  component: () => import('@/views/petShop/marketing/seller-participated-activities.vue'),
  meta: { title: '已参与秒杀活动', requiresAuth: true, role: 'seller' }
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
    component: () => import('@/views/enterPet/login-pet.vue'),
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
    component: () => import('@/views/enterPet/register-pet.vue'),
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
    component: () => import('@/views/enterPet/forget-password.vue'),
    meta: { title: '找回密码', requiresAuth: false },
  },

  {
    path: '/persons',
    name: 'PersonalCenter',
    component: () => import('@/views/userCenter/person-center.vue'),
    meta: { title: '个人中心' },
  },

  //后台管理
  {
    path: '/admin',
    component: () => import('@/views/admin/home-page.vue'),
    meta: { title: '后台管理', requiresAuth: true },
    children: [
      // 数据概览
      {
        path: '', // 空路径 = /admin 默认子路由
        redirect: '/admin/user',
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
        component: () => import('@/views/admin/components/user/AllUser.vue'),
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
      // router/index.ts
      {
        path: '/foster/detail/:id',
        name: 'FosterDetail',
        component: () => import('@/views/admin/components/foster/FosterDetail.vue'),
        meta: { title: '寄养方详情' },
      },
      //电商管理
      {
        path: 'shop',
        name: 'shop',
        redirect: '/admin/shop/store',
        meta: { title: '电商管理', icon: 'el-icon-s-platform' },
        children: [
          {
            path: 'store',
            name: 'createShop',
            component: () => import('@/views/admin/components/shop/shopStore.vue'),
            meta: { title: '商铺管理' },
          },
          {
            path: 'product',
            name: 'shoreProduct',
            component: () => import('@/views/admin/components/shop/shopProduct.vue'),
            meta: { title: '商品管理' },
          },
          {
            path: 'sku',
            name: 'shopSku',
            component: () => import('@/views/admin/components/shop/shopSku.vue'),
            meta: { title: 'Sku管理' },
          },
          {
            path: 'detail',
            name: 'shopDetail',
            component: () => import('@/views/admin/components/shop/shopDetail.vue'),
            meta: { title: '商铺详情' },
          },
          {
            path: 'audit',
            name: 'auditDetail',
            component: () => import('@/views/admin/components/shop/auditDetail.vue'),
            meta: { title: '商铺审核详情' },
          },
          {
            path: 'goods',
            name: 'goodsDetail',
            component: () => import('@/views/admin/components/shop/productDetail.vue'),
            meta: { title: '商品详情' },
          },
          {
            path: 'update',
            name: 'updateDetail',
            component: () => import('@/views/admin/components/shop/productAuditDetail.vue'),
            meta: { title: '商品审核详情' },
          },
          {
            path: 'style',
            name: 'styleDetail',
            component: () => import('@/views/admin/components/shop/skuDetail.vue'),
            meta: { title: 'sku详情' },
          },
          {
            path: 'specific',
            name: 'specficDetail',
            component: () => import('@/views/admin/components/shop/skuAuditDetail.vue'),
            meta: { title: 'sku详情' },
          },
        ],
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
import { store, usePermissionStore, useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
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
