import { createRouter, createWebHistory } from 'vue-router'
import PetShopView from '@/views/PetShopView.vue'
import PetCenter from '@/views/PetCenter.vue'
import PetLogin from '@/views/login.vue'
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
