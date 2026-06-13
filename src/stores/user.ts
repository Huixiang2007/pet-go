import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  userId: string
  userRole: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('authToken') || '')
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('authToken', newToken)
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    roles.value = info.userRole || []
    localStorage.setItem('userRole', info.userRole?.[0] || '用户')
    localStorage.setItem('userId', info.userId)
  }

  const getUserInfo = async (): Promise<string[]> => {
    if (userInfo.value) {
      return userInfo.value.userRole
    }

    const userRole = localStorage.getItem('userRole') || '用户'
    const userId = localStorage.getItem('userId') || ''

    roles.value = [userRole]
    userInfo.value = {
      userId,

      userRole: [userRole],
    }

    return roles.value
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    roles.value = []
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('shopId')
    localStorage.removeItem('fosterProviderIds')
  }

  const getUserId = (): string => {
    return userInfo.value?.userId || localStorage.getItem('userId') || ''
  }

  const isLoggedIn = (): boolean => {
    return !!token.value || !!localStorage.getItem('authToken')
  }

  return {
    token,
    userInfo,
    roles,
    setToken,
    setUserInfo,
    getUserInfo,
    getUserId,
    isLoggedIn,
    logout,
  }
})
