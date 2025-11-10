
import { createRouter, createWebHistory } from 'vue-router'
import PetShopView from '@/views/PetShopView.vue'

const routes = [
  {
    path: '/shop',
    name: 'shop',
    component: PetShopView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
