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
    path: '/foster-book/:fosterId/:packageId',
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
  // 电商的首页
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/petShop/shop/PetShopView.vue'),
    meta: {
      requiresAuth: true,
      title: '欢迎来到宠物商城',
    },
  },
  // 宠物购物车
  {
    path: '/pet-cart',
    name: 'petCart',
    component: () => import('@/views/petShop/order/PetShopCar.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo购物车',
    },
  },
  //订单结算
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/petShop/order/OrderCheckout.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo订单结算',

    },
  },
  //  商品列表（分类）
  {
    path: '/products/:category?',
    name: 'products',
    component: () => import('@/views/petShop/product/ProductList.vue'),
  },
  //  商品详情
  {
    path: '/product-detail/:id',
    name: 'productsDetail',
    component: () => import('@/views/petShop/product/ProductDetail.vue'),
    meta: {
      title: 'PetGo商品详情',
    },
  },
  //  订单列表
  {
    path: '/order-list',
    name: 'OrderList ',
    component: () => import('@/views/petShop/order/OrderList.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo订单列表',
    },
  },
  //物流信息
  {
    path: '/package-info',
    name: 'PackageInfo',
    component: () => import('@/views/petShop/server/PackageInfo.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo物流信息',
    },
  },
  //  搜索
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/petShop/product/SearchProduct.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo搜索',
    },
  },
  // 店铺
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/petShop/shop/ShopStore.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo店铺',
    },
  },
  // 订单管理
  {
    path: '/seller-order-manager',
    name: 'SellerOrderManager',
    component: () => import('@/views/petShop/order/SellerOrderMana.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo订单管理',
    },
  },
  // 电商用户管理

  {
    path: '/seller-user-manager',
    name: 'SellerUserManager',
    component: () => import('@/views/petShop/user/SellerUserMana.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo用户管理',
    },
  },
  // 优惠卷管理
  {
    path: '/coupon-management',
    name: 'CouponManagement',
    component: () => import('@/views/petShop/marketing/CouponManagement.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo优惠卷管理',
    },
  },
  // 商品管理
  {
    path: '/seller-item-manager',
    name: 'SellerItemManager',
    component: () => import('@/views/petShop/product/SellerItemMana.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo商品管理',
    },
  },
  // 店铺设置
  {
    path: '/shop-setting',
    name: '/ShopSetting',
    component: () => import('@/views/petShop/shop/ShopSetting.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo店铺设置',
    },
  },
  // 销售分析
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/petShop/data/SalesAnalytics.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo销售分析',
    },
  },
  // 秒杀
  {
    path: '/flash-sale',
    name: 'FlashSale',
    component: () => import('@/views/petShop/marketing/FlashSale.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo秒杀',
    },
  },
  //消息
  {
    path: '/customer-service',
    name: 'CustomerService',
    component: () => import('@/views/petShop/server/CustomerService.vue'),
    meta: {
      requiresAuth: true,
      title: 'PetGo消息',
    },
  },
  // 添加商品
  {
    path: '/add-product',
    name: 'AddProduct',
    component: () => import('@/views/petShop/product/AddProduct.vue'),
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
        redirect: '/admin/foster/audit',
        meta: {
          title: '寄养服务管理',
          icon: 'el-icon-house',
        },
        children: [
          {
            path: 'audit',
            name: 'fosterAudit',
            component: () => import('@/views/admin/components/foster/FosterAudit.vue'),
            meta: {
              title: '服务审核',
            },
          },
          {
            path: 'orders',
            name: 'fosterOrder',
            component: () => import('@/views/admin/components/foster/FosterOrder.vue'),
            meta: {
              title: '寄养订单',
            },
          },
           {
            path: 'home',
            name: 'fosterHome',
            component: () => import('@/views/admin/components/foster/FosterHome.vue'),
            meta: {
              title: '寄养家庭管理',
            },
          },
          {
            path: 'comment',
            name: 'fosterComment',
            component: () => import('@/views/admin/components/foster/FosterComment.vue'),
            meta: {
              title: '评价管理',
            },
          },
        ],
      },
      // 补全电商管理路由
      // {
      //   path: 'mall',
      //   name: 'mall',
      //   redirect: '/admin/mall/goods',
      //   meta: { title: '宠物电商管理', icon: 'el-icon-shop' },
      //   children: [
      //     {
      //       path: 'goods',
      //       name: 'mallGoods',
      //       component: () => import('@/views/admin/components/AllGoods.vue'), // 替换为实际路径
      //       meta: { title: '商品管理' },
      //     },
      //     {
      //       path: 'order',
      //       name: 'mallOrder',
      //       component: () => import('@/views/admin/components/AllMallOrder.vue'), // 替换为实际路径
      //       meta: { title: '订单管理' },
      //     },
      //     {
      //       path: 'stock',
      //       name: 'mallStock',
      //       component: () => import('@/views/admin/components/AllStock.vue'), // 替换为实际路径
      //       meta: { title: '库存管理' },
      //     },
      //     {
      //       path: 'coupon',
      //       name: 'mallCoupon',
      //       component: () => import('@/views/admin/components/AllCoupon.vue'), // 替换为实际路径
      //       meta: { title: '优惠券管理' },
      //     },
      //   ],
      // },
      // // 补全系统管理路由
      // {
      //   path: 'system',
      //   name: 'system',
      //   redirect: '/admin/system/notice',
      //   meta: { title: '系统管理', icon: 'el-icon-setting' },
      //   children: [
      //     {
      //       path: 'notice',
      //       name: 'systemNotice',
      //       component: () => import('@/views/admin/components/AllNotice.vue'), // 替换为实际路径
      //       meta: { title: '通知发布' },
      //     },
      //     {
      //       path: 'role',
      //       name: 'systemRole',
      //       component: () => import('@/views/admin/components/AllRole.vue'), // 替换为实际路径
      //       meta: { title: '角色权限管理' },
      //     },
      //     {
      //       path: 'log',
      //       name: 'systemLog',
      //       component: () => import('@/views/admin/components/AllLog.vue'), // 替换为实际路径
      //       meta: { title: '操作日志查询' },
      //     },
      //   ],
      // },
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
  console.log(isLogin)
  if (requiresAuth && !isLogin) {
    ElMessage.warning('请先登录后再访问')
    // 跳转到登录页，并记录当前页面路径（登录后可返回）
    next({
      path: '/login',
      query: { redirect: to.fullPath }, // 携带要返回的页面路径
    })
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
