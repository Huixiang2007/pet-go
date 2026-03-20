<template>
  <div
    class="bg-white w-full h-16 px-4 sm:px-6 flex items-center justify-between shadow-sm border-b border-gray-100"
  >
    <div class="flex items-center gap-3">
      <!-- 店铺图标：黄底 + 暖色店铺图标（参考截图） -->
      <div class="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
        <i class="fas fa-store text-2xl text-yellow-600"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-800 tracking-tight">Pet-go - 商家管理</h2>
      <!-- 营业状态标签：参考截图 → 圆角小标签 -->
      <div
        v-if="shopStatus !== null"
        class="px-2 py-0.5 rounded-full text-xs font-medium"
        :class="
          shopStatus === '关门大吉' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        "
      >
        {{ shopStatus === '关门大吉' ? '关门大吉' : '开工顺利' }}
      </div>
    </div>

    <div class="flex items-center gap-1 sm:gap-3">
      <div
        class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <img
          :src="shopAvatar"
          :alt="shopName"
          class="w-8 h-8 rounded-full border border-gray-200 object-cover"
        />
        <span class="text-sm font-medium text-gray-800">{{ shopName }}</span>
      </div>

      <el-dropdown>
        <el-button type="text">
          更多操作 <el-icon class="ml-1"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleBack">
              <i class="fas fa-sign-out-alt text-gray-700"></i>退出店铺
            </el-dropdown-item>

            <!-- 下拉菜单：改成参考截图风格 → 圆黄底图标 + 暖色 -->
            <el-dropdown-item @click="handleShopStatusToggle" class="shop-status-item">
              <span class="inline-flex items-center">
                <!-- 大门图标：黄底圆图标（参考截图风格） -->
                <div
                  class="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-2"
                >
                  <i
                    class="text-xl"
                    :class="[
                      shopStatus === '正常营业'
                        ? 'fas fa-door-open text-orange-500'
                        : 'fas fa-door-closed text-red-500',
                    ]"
                  ></i>
                </div>

                <span
                  class="transition-all duration-300"
                  :class="shopStatus === '正常营业' ? 'text-orange-600' : 'text-red-600'"
                >
                  {{ shopStatus === '正常营业' ? '关闭店铺' : '正常营业' }}
                </span>
              </span>
            </el-dropdown-item>

            <el-dropdown-item @click="handleLogout">
              <i class="fas fa-user-alt text-gray-700"></i>注销店铺
            </el-dropdown-item>
            <el-dropdown-item @click="handleProfile">
              <i class="fas fa-user-circle text-gray-700"></i>个人中心
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 全屏弹窗：参考截图奶油黄风格 + 双开大门（简单自然动画） -->
  <div v-if="showDoorModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
    <!-- 半透明磨砂背景 -->
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

    <!-- 奶油黄磨砂弹窗（完全参考截图风格） -->
    <div
      class="relative w-[300px] h-[280px] bg-yellow-50/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center shadow-xl border border-yellow-100"
    >
      <!-- 超大双开大门（贴合主题：简单旋转+缩放） -->
      <div class="relative w-[140px] h-[160px] mb-4">
        <!-- 左门 -->
        <div
          class="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-b from-yellow-700 to-yellow-800 rounded-l-xl"
          :class="targetStatus === '正常营业' ? 'door-left-open' : 'door-left-close'"
        ></div>
        <!-- 右门 -->
        <div
          class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-yellow-700 to-yellow-800 rounded-r-xl"
          :class="targetStatus === '正常营业' ? 'door-right-open' : 'door-right-close'"
        ></div>
        <!-- 门把手 -->
        <div class="absolute top-1/2 left-[20px] w-3 h-5 bg-yellow-900 rounded-full"></div>
        <div class="absolute top-1/2 right-[20px] w-3 h-5 bg-yellow-900 rounded-full"></div>
      </div>

      <!-- 状态文字 -->
      <h2 class="text-2xl font-bold text-orange-800">
        {{ targetStatus === '关门大吉' ? '关门大吉' : '开工顺利' }}
      </h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { logout, getShopDetail } from '../../api/pet-shop/shop'
import { toggleShopStatus } from '../../api/pet-shop/shop'
import { ref, onMounted } from 'vue'

const router = useRouter()

const shopStatus = ref<'正常营业' | '关门大吉' | null>(null)
const targetStatus = ref<'正常营业' | '关门大吉'>('正常营业')
const shopAvatar = ref('')
const shopName = ref('')
const showDoorModal = ref(false)

function handleBack() {
  router.push('/shop')
  window.scrollTo(0, 0)
}

function getSellerInfo() {
  const shopId = Number(localStorage.getItem('shopId'))
  if (!shopId) {
    ElMessage.warning('未检测到商家ID，请先登录')
    return
  }
  getShopDetail(shopId)
    .then((res) => {
      if (res) {
        shopAvatar.value = res.shopAvatar || ''
        shopName.value = res.shopName || ''
        shopStatus.value = res.shopStatus || '正常营业'
      }
    })
    .catch((error: any) => {
      ElMessage.error('获取商家信息失败，请稍后重试', error)
    })
}
function handleProfile() {
  router.push('/persons')
  window.scrollTo(0, 0)
}

function handleLogout() {
  ElMessageBox.confirm('确定要注销店铺吗？', '提示', {
    confirmButtonText: '确认注销',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const shopIdStr = localStorage.getItem('shopId')
      if (!shopIdStr) {
        ElMessage.error('未找到店铺ID')
        return
      }

      try {
        const res = await logout(Number(shopIdStr))
        if (res.ok) {
          localStorage.removeItem('shopId')
          ElMessage.success('店铺已注销')
          router.push('/shop/login')
        } else {
          ElMessage.error('注销失败：' + (res.msg || '未知错误'))
        }
      } catch (error) {
        console.error('注销失败:', error)
        ElMessage.error('注销失败，请稍后重试')
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}
// 切换营业状态
function handleShopStatusToggle() {
  const shopId = Number(localStorage.getItem('shopId'))
  if (!shopId || !shopStatus.value) {
    ElMessage.warning('未检测到商家ID')
    return
  }

  targetStatus.value = shopStatus.value === '正常营业' ? '关门大吉' : '正常营业'
  const confirmText = targetStatus.value === '关门大吉' ? '确定关闭店铺吗？' : '确定开门营业吗？'

  ElMessageBox.confirm(confirmText, '提示', {
    confirmButtonText: targetStatus.value === '关门大吉' ? '确认关闭' : '确认开门',
    cancelButtonText: '取消',
    type: targetStatus.value === '关门大吉' ? 'warning' : 'success',
  })
    .then(async () => {
      const res = await toggleShopStatus(Number(shopId), targetStatus.value !== '关门大吉' ? 0 : 1)
      if (res.ok) {
        shopStatus.value = targetStatus.value
        showDoorModal.value = true
        setTimeout(() => (showDoorModal.value = false), 1500)
        ElMessage.success(targetStatus.value === '关门大吉' ? '关门大吉' : '开工顺利')
      }
    })
    .catch(() => ElMessage.info('已取消操作'))
}

onMounted(() => {
  getSellerInfo()
})
</script>

<style scoped>
@media (max-width: 640px) {
  .hidden.sm\:inline {
    display: none;
  }
}
:deep(.el-dropdown) {
  padding: 4px 8px;
  border-radius: 8px;
}
:deep(.el-dropdown-menu) {
  padding: 8px 12px;
  border-radius: 12px;
}
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 2px;
}
</style>

<style>
/* 下拉菜单小动画（柔和缩放） */
@keyframes doorOpen {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}
@keyframes doorClose {
  0% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 弹窗大门动画（左右双开） */
@keyframes doorLeftOpen {
  0% {
    transform: rotateY(0deg) translateX(0);
  }
  100% {
    transform: rotateY(45deg) translateX(-5px);
  }
}
@keyframes doorLeftClose {
  0% {
    transform: rotateY(45deg) translateX(-5px);
  }
  100% {
    transform: rotateY(0deg) translateX(0);
  }
}
@keyframes doorRightOpen {
  0% {
    transform: rotateY(0deg) translateX(0);
  }
  100% {
    transform: rotateY(-45deg) translateX(10px);
  }
}
@keyframes doorRightClose {
  0% {
    transform: rotateY(-45deg) translateX(10px);
  }
  100% {
    transform: rotateY(0deg) translateX(0);
  }
}

/* 应用动画 */
.door-open {
  animation: doorOpen 0.5s forwards;
}
.door-close {
  animation: doorClose 0.5s forwards;
}
.door-left-open {
  animation: doorLeftOpen 0.8s forwards;
}
.door-left-close {
  animation: doorLeftClose 0.8s forwards;
}
.door-right-open {
  animation: doorRightOpen 0.8s forwards;
}
.door-right-close {
  animation: doorRightClose 0.8s forwards;
}
</style>
