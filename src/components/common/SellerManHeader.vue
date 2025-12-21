<template>
  <div
    class="bg-white w-full h-16 px-4 sm:px-6 flex items-center justify-between shadow-sm border-b border-gray-100"
  >
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
        <i class="fas fa-store-alt text-2xl text-blue-600"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-800 tracking-tight">Pet-go - 商家管理</h2>
    </div>

    <div class="flex items-center gap-1 sm:gap-3">
      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
        <i class="fas fa-bell text-gray-700"></i>
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        <span class="hidden sm:inline ml-1 text-sm text-gray-600">消息通知</span>
      </button>

      <div
        class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <img
          src="/img/dog.png"
          alt="店铺头像"
          class="w-8 h-8 rounded-full border border-gray-200 object-cover"
        />
        <span class="text-sm font-medium text-gray-800">小明官方旗舰店</span>
      </div>
  <el-dropdown>
    <el-button type="text">
      更多操作 <el-icon class="ml-1"><ArrowDown /></el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleBack"><i class="fas fa-sign-out-alt text-gray-700"></i>退出店铺</el-dropdown-item>
        <el-dropdown-item @click="handleLogout"><i class="fas fa-user-alt text-gray-700"></i>注销店铺</el-dropdown-item>
        <el-dropdown-item @click="handleProfile"><i class="fas fa-user-circle text-gray-700"></i>个人中心</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {logout} from '../../api/pet-shop/shop'

const router = useRouter();

function handleBack() {
  router.push('/shop');
  window.scrollTo(0, 0);
}

function handleLogout() {
const shopId = localStorage.getItem('userId')
  ElMessageBox.confirm('确认注销登录？').then(() =>async () => {
    try{
      const res = await logout(Number(shopId))
      console.log(res)
     router.push('/shop')
     ElMessage.success('注销成功！')
    }
    catch(error){
    console.log(error)
    ElMessage.error('注销失败！')
    }
  })
}
function handleProfile() {
  router.push('/persons');
  window.scrollTo(0, 0);
}
</script>
<style scoped>
@media (max-width: 640px) {
  .hidden.sm:inline {
    display: none;
  }
}
:deep(.el-dropdown) {
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}
:deep(.el-dropdown-menu) {
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}
</style>
