<template>
  <div class="profile-container">
    <!-- 顶部用户核心信息 -->
    <header class="profile-header">
      <PersonalAvatar 
        :avatar="userInfo.avatar" 
        :nickname="userInfo.nickname" 
        :email="userInfo.email" 
        @avatar-change="handleAvatarChange"
      />
      <div class="header-actions">
        <button class="layui-btn layui-btn-primary" @click="logout">
          <i class="layui-icon layui-icon-logout"></i> 退出登录
        </button>
      </div>
    </header>

    <div class="profile-body">
      <!-- 侧边导航栏 -->
      <PersonalNav 
        :active-tab="currentTab" 
        @tab-change="currentTab = $event"
      />

      <!-- 内容展示区 -->
      <main class="content-area">
        <div class="content-header">
          <h1>{{ navItems[currentTab]?.name }}</h1>
        </div>
        <div class="content-wrapper">
          <!-- 子组件按需渲染 -->
          <BaseInfo 
            v-if="currentTab === 0" 
            :form-data="formData" 
            :user-info="userInfo"
            @save="saveBaseInfo" 
            @cancel="cancelEdit"
          />
          <RealNameAuth 
            v-if="currentTab === 1" 
            :status="realNameStatus" 
            :info="realNameInfo"
            @submit="submitRealName" 
            @refresh="getUserInfo"
          />
          <ChangePassword 
            v-if="currentTab === 2" 
            :email="userInfo.email"
            @change="changePassword" 
            @cancel="cancelWord"
          />
          <AddressManager 
            v-if="currentTab === 3" 
            @refresh="getAddressList"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
// 导入子组件
import PersonalAvatar from './components/PersonalAvatar.vue'
import PersonalNav from './components/PersonalNav.vue'
import BaseInfo from './components/BaseInfo.vue'
import RealNameAuth from './components/RealNameAuth.vue'
import ChangePassword from './components/ChangePassword.vue'
import AddressManager from './components/AddressManager.vue'

declare global {
  interface Window {
    layui: any
  }
}

// 导航项（供导航组件使用）
const navItems = [
  { name: '基本信息', icon: 'layui-icon-user' },
  { name: '实名认证', icon: 'layui-icon-auz' },
  { name: '修改密码', icon: 'layui-icon-password' },
  { name: '我的地址', icon: 'layui-icon-home' },
]

// 全局状态
const currentTab = ref(0)
const userInfo = ref({
  avatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
  nickname: 'PetGo用户',
  sex: '1',
  phone: '',
  birthday: '',
  email: '',
})
const formData = ref({ ...userInfo.value })
const realNameStatus = ref<'unverified' | 'pending' | 'verified'>('unverified')
const realNameInfo = ref({
  realName: '',
  idCard: '',
  idCardFront: '',
  idCardBack: '',
})
const isFetching = ref(false)
const router = useRouter()

// 初始化
onMounted(() => {
  getUserInfo()
  // 初始化layui表单验证
  setTimeout(() => {
    if (window.layui) {
      window.layui.use(['form', 'layer'], (form: any) => {
        form.render()
      })
    }
  }, 500)

  // 切换标签时重新渲染表单/加载数据
  watch(currentTab, () => {
    if (window.layui) {
      window.layui.use('form', (form: any) => form.render())
    }
    if (currentTab.value === 3) {
      // 通知地址组件刷新列表
      emit('refresh')
    }
    if (currentTab.value === 1) {
      getUserInfo()
    }
  })
})

onUnmounted(() => {
  // 清理定时器/请求等
})

// 全局方法：获取用户信息
const getUserInfo = async () => {
  if (isFetching.value) return
  isFetching.value = true
  try {
    const userId = localStorage.getItem('userId') || ''
    if (!userId) {
      window.layui?.layer.msg('用户未登录')
      router.push('/login')
      return
    }
    const response = await request('/server/api/user/getUserInfo/userId', 'GET', { userId })
    if (response.code === 0) {
      const userData = response.data.userVO
      userInfo.value = {
        ...userInfo.value,
        nickname: userData.username,
        sex: userData.gender,
        phone: userData.phone,
        birthday: userData.birthday,
        avatar: userData.avatar,
        email: userData.email,
      }
      formData.value = { ...userInfo.value }
      // 更新实名认证状态
      if (userData.status) {
        realNameInfo.value = {
          realName: userData.realName,
          idCard: userData.idCard,
          idCardFront: userData.idCardFront,
          idCardBack: userData.idCardBack,
        }
        switch (userData.status) {
          case 0: realNameStatus.value = 'unverified'; break
          case 1: realNameStatus.value = 'pending'; break
          case 2: realNameStatus.value = 'verified'; break
          default: realNameStatus.value = 'unverified'
        }
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    isFetching.value = false
  }
}

// 全局方法：头像修改
const handleAvatarChange = async (file: File) => {
  try {
    const avatarData = new FormData()
    avatarData.append('avatarUrl', file)
    const response = await request('/server/api/user/updateUserAvatar', 'POST', avatarData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (response.code === 0) {
      userInfo.value.avatar = URL.createObjectURL(file)
      ElMessage.success('头像上传成功！')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败！')
  }
}

// 全局方法：保存基本信息
const saveBaseInfo = async (formData: any) => {
  try {
    const response = await request('/server/api/user/updateUserInfo', 'POST', {
      userName: formData.nickname,
      phone: formData.phone,
      gender: formData.sex,
      birthday: formData.birthday,
    }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    if (response.code === 0) {
      userInfo.value = { ...userInfo.value, ...formData }
      ElMessage.success('保存信息成功！')
    }
  } catch (error) {
    console.error('保存基本信息失败:', error)
    ElMessage.error('保存失败！')
  }
}

// 全局方法：提交实名认证
const submitRealName = async (realNameForm: any) => {
  try {
    const formData = new FormData()
    formData.append('realName', realNameForm.realName)
    formData.append('idCard', realNameForm.idCard)
    formData.append('otherFiles', realNameForm.idCardFrontFile)
    formData.append('otherFiles', realNameForm.idCardBackFile)
    const response = await request('/server/api/user/userAuth', 'POST', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (response.code === 0) {
      realNameStatus.value = 'pending'
      realNameInfo.value = {
        realName: realNameForm.realName,
        idCard: realNameForm.idCard,
        idCardFront: realNameForm.idCardFront,
        idCardBack: realNameForm.idCardBack,
      }
      ElMessage.success('实名认证提交成功，等待审核')
    }
  } catch (error) {
    console.error('提交实名认证失败:', error)
    ElMessage.error('提交失败！')
  }
}

// 全局方法：修改密码
const changePassword = async (passwordForm: any) => {
  try {
    const response = await request('/server/api/user/changePassword', 'POST', passwordForm, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    if (response.code === 0) {
      ElMessage.success('密码修改成功，请重新登录')
      router.push('/login')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败！')
  }
}

// 全局方法：取消编辑（基本信息）
const cancelEdit = () => {
  formData.value = { ...userInfo.value }
  ElMessage.success('已恢复原始值')
}

// 全局方法：取消修改（密码）
const cancelWord = () => {
  // 子组件内重置，父组件仅提示
  ElMessage.success('已恢复原始值')
}

// 全局方法：退出登录
const logout = () => {
  window.layui.layer.confirm('确定要退出登录吗？', { title: '提示' }, (index: number) => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    window.layui.layer.close(index)
    router.push('/login')
  })
}
</script>

<style scoped>
/* 仅保留父组件全局样式，子组件样式抽离到各自文件 */
.profile-container {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-body {
  display: flex;
  min-height: calc(100vh - 133px);
}

.content-area {
  height: 80vh;
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.content-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.content-wrapper {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* 响应式 */
@media (max-width: 768px) {
  .profile-body {
    flex-direction: column;
  }
}
</style>