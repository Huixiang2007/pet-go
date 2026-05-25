import { createPinia } from 'pinia'

export const store = createPinia()

export { useUserStore } from './user'
export { usePermissionStore } from './permission'
