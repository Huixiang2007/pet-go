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
        <button class="layui-btn layui-btn-primary newColor" @click="gotoHome">
          <i class="layui-icon layui-icon-return"></i> 返回首页
        </button>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
// 导入子组件
import PersonalAvatar from '@/views/userCenter/components/PersonAvatar.vue'
import PersonalNav from '@/views/userCenter/components/PersonalNav.vue'
import BaseInfo from '@/views/userCenter/components/BaseInfo.vue'
import RealNameAuth from '@/views/userCenter/components/RealNameAuth.vue'
import ChangePassword from '@/views/userCenter/components/ChangePassword.vue'
import AddressManager from '@/views/userCenter/components/AddressManager.vue'

declare global {
  interface Window {
    layui: any
  }
}

// 定义组件可以触发的事件
const emit = defineEmits(['refresh']) 
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
   gender: '1',
  birthday: '',
  address: '',

})
const isFetching = ref(false)
const router = useRouter()
// 1. 定义地址分页参数（核心缺失的变量）
const addressPagination = ref({
  currentPage: 1,  
  pageSize: 5,    
  total: 0,        
  pages: 0       
})

// 2. 定义地址列表数据
const addressList = ref([])

// 3. 定义“显示添加地址表单”的开关
const showAddressForm = ref(false)
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
   getRealNameStatus()
    }
  })
})


const getRealNameStatus = async () => {
  // 避免重复请求
  if (isFetching.value) return
  isFetching.value = true

  try {
    const userId = localStorage.getItem('userId') || ''
    if (!userId) {
      ElMessage.error('用户未登录，请先登录')
      isFetching.value = false
      return
    }

    const response = await request('/server/api/user/getUserAuth', 'GET')
    console.log('实名认证状态:', response)

    if (response.code === 0) {
      // 1. 处理“用户未认证”的情况
      if (response.msg === '用户未认证') {
        realNameStatus.value = 'unverified'
        // 清空已有的认证信息
        realNameInfo.value = {
          realName: '',
          idCard: '',
          idCardFront: '',
          idCardBack: '',
          gender: '1',
          birthday: '',
          address: ''
        }
        return
      }

      // 2. 根据后端返回的status更新状态
      const backendStatus = response.data.status
      switch (backendStatus) {
        case '待审核':
          realNameStatus.value = 'pending'
          break
        case '审核通过':
          realNameStatus.value = 'verified'
          break
        case '审核未通过':
          realNameStatus.value = 'unverified'
          break
        default:
          realNameStatus.value = 'unverified'
      }

      // 3. 填充后端返回的认证信息（和realNameInfo的字段对应）
      realNameInfo.value = {
        realName: response.data.realName || '',
        idCard: response.data.idCard || '',
        idCardFront: response.data.idCardFront || '',
        idCardBack: response.data.idCardBack || '',
        gender: response.data.gender || '1', // 后端返回的gender可能是数字，转成字符串
        birthday: response.data.birthday || '',
        address: response.data.address || ''
      }
    } else {
      // 处理后端返回的业务错误
      ElMessage.warning(response.msg || '获取实名认证状态失败')
      realNameStatus.value = 'unverified'
    }
  } catch (error) {
    console.error('获取实名认证状态异常:', error)
  
    realNameStatus.value = 'unverified'
  } finally {
    // 无论成功失败，都关闭加载状态
    isFetching.value = false
  }
}

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
    console.log('获取用户信息:', response)
    if (response.code === 0) {
      const userData = response.data.userVO
      userInfo.value = {
        ...userInfo.value,
        nickname: userData.username,
        sex: userData.gender||1,
        phone: userData.phone,
        birthday: userData.birthday,
        avatar: userData.avatar,
        email: userData.email,
      }
      formData.value = { ...userInfo.value }
     
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    isFetching.value = false
  }
}

// 获取地址列表
const getAddressList = async () => {
  
  console.log('addressPagination:', addressPagination)
  try {
    const userId = localStorage.getItem('userId') || ''
    if (!userId) {
      ElMessage.warning('用户未登录或会话已过期，请重新登录')
      addressList.value = []
      return
    }
    const response = await request('/server/api/user/getUserAddresses', 'GET', {
      pageNum: addressPagination.value.currentPage,
      pageSize: addressPagination.value.pageSize,
    })
    console.log('获取地址列表成功:', response.data)
    addressList.value = response.data.list || []
    addressPagination.value.total = response.data.total || 0
    addressPagination.value.pages = response.data.pages || 1
    // 如果是第一页且没有地址，则显示添加地址表单
    if (addressPagination.value.currentPage === 1 && addressList.value.length === 0) {
      showAddressForm.value = true
    }
  } catch (error) {
    console.log('获取地址列表:', error)

    ElMessage.error('获取地址失败，请稍后重试')
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
   
  }
}

// 全局方法：提交实名认证
const submitRealName = async (realNameForm: any) => {
  try {
    const formData = new FormData()
    formData.append('realName', realNameForm.realName)
    formData.append('idCard', realNameForm.idCard)
    formData.append('gender', Number(realNameForm.gender))
    formData.append('birthday', realNameForm.birthday)
    formData.append('address', realNameForm.address)
    formData.append('pictureUrl', realNameForm.idCardFrontFile)
    formData.append('pictureUrl', realNameForm.idCardBackFile)
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
        gender: realNameForm.gender,
        birthday: realNameForm.birthday,
        address: realNameForm.address,
      }
       getRealNameStatus()
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


const logout = async (): Promise<void> => {
  window.layui.layer.confirm('确定要退出登录吗？', {
    title: '提示',
    yes: async(index: number) => {
        const response = await request('/server/api/user/logout', 'POST',{
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    console.log(response)
    if (response.code === 0) {
       localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.layui.layer.close(index);
      router.push('/login'); // 直接用 router 实例，无需 window.router
      window.layui.layer.msg('退出登录成功', { icon: 1, time: 1500 });
    }
    
    },
    no: (index: number) => {
      window.layui.layer.close(index);
   
    }
  });
};
const gotoHome = () => {
  router.push('/foster-care')
}
</script>

<style scoped>
.layui-btn-primary:hover {
  border-color: #fd9860;
  color: #fd9860;
}

.profile-container {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

.newColor{
  border-color: #c1d4f6;
  color: #419fe6;
}
.newColor:hover{
  border-color: #417fe6;
  color: #417fe6;
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