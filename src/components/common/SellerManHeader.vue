<template>
  <div
    class="bg-white w-full h-16 px-4 sm:px-6 flex items-center justify-between shadow-sm border-b border-gray-100"
  >
    <div class="flex items-center gap-3">
      <!-- 店铺图标 -->
      <div class="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
        <i class="fas fa-store text-2xl text-yellow-600"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-800 tracking-tight">Pet-go - 商家管理</h2>
      <!-- 营业状态标签 -->
      <div
        v-if="shopStatus"
        class="px-2 py-0.5 rounded-full text-xs font-medium"
        :class="
          shopStatus === '关门大吉' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        "
      >
        {{ shopStatus }}
      </div>
    </div>

    <div class="flex items-center gap-1 sm:gap-3">
      <div
        class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <img
          :src="shopAvatar || 'https://via.placeholder.com/40'"
          :alt="shopName"
          class="w-8 h-8 rounded-full border border-gray-200 object-cover"
        />
        <span class="text-sm font-medium text-gray-800">{{ shopName || '店铺名称' }}</span>
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
            <el-dropdown-item @click="enterflash">
              <i class="fas fa-sign-out-alt text-gray-700"></i>申请秒杀活动
            </el-dropdown-item>

            <!-- 开关店操作 -->
            <el-dropdown-item @click="handleShopStatusToggle">
              <span class="inline-flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-2"
                >
                  <i
                    class="text-xl"
                    :class="[
                      shopStatus === '正常营业'
                        ? 'fas fa-door-open text-green-600'
                        : 'fas fa-door-closed text-red-600',
                    ]"
                  ></i>
                </div>
                <span :class="shopStatus === '正常营业' ? 'text-red-600' : 'text-green-600'">
                  {{ shopStatus === '正常营业' ? '关闭店铺' : '开门营业' }}
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

  <!-- 开关门动画 -->
  <div v-if="showDoorModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

    <div
      class="relative w-[300px] h-[280px] bg-yellow-50/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center shadow-xl border border-yellow-100"
    >
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

      <h2
        class="text-2xl font-bold"
        :class="targetStatus === '正常营业' ? 'text-orange-800' : 'text-gray-600'"
      >
        {{ targetStatus }}
      </h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { logout, getShopDetail, toggleShopStatus } from '../../api/pet-shop/shop'
import { ref, onMounted } from 'vue'

const router = useRouter()
// enterflash
function enterflash() {
  router.push('/seller/flash-sale/apply')
  window.scrollTo(0, 0)
}

type ShopStatus = '正常营业' | '关门大吉' | null

const shopStatus = ref<ShopStatus>(null)
const targetStatus = ref<'正常营业' | '关门大吉'>('正常营业')
const shopAvatar = ref('')
const shopName = ref('')
const showDoorModal = ref(false)

// 获取店铺信息
function getSellerInfo() {
  const shopId = Number(localStorage.getItem('shopId'))
  if (!shopId) {
    ElMessage.warning('未检测到商家ID，请先登录')
    return
  }

  getShopDetail(shopId)
    .then((res) => {
      if (res) {
        console.log('店铺信息:', res)
        shopAvatar.value = res.shopAvatar || ''
        shopName.value = res.shopName || '未命名店铺'
        shopStatus.value = res.shopStatus || '正常营业'
      }
    })
    .catch((error) => {
      console.error('获取商家信息失败:', error)
      ElMessage.error('获取商家信息失败，请稍后重试')
    })
}

//  退出店铺
function handleBack() {
  router.push('/shop')
  window.scrollTo(0, 0)
}
console.log(localStorage.getItem('shopId'))
//注销店铺
function handleLogout() {
  ElMessageBox.confirm('确定要注销店铺吗？此操作不可恢复！', '危险操作', {
    confirmButtonText: '确认注销',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })

    .then(async () => {
      const shopIdStr = localStorage.getItem('shopId')
      if (!shopIdStr) {
        ElMessage.error('未找到店铺ID')
        return
      }

      try {
        console.log('开始注销店铺...', Number(shopIdStr))
        const res = await logout(Number(shopIdStr))
        console.log('注销结果:', res)
        if (res?.ok) {
          localStorage.removeItem('shopId')
          ElMessage.success('店铺已注销')
          router.push('/')
        } else {
          ElMessage.error(res?.msg || '注销失败')
        }
      } catch (error) {
        console.error('注销报错:', error)
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

//  个人中心
function handleProfile() {
  router.push('/persons')
  window.scrollTo(0, 0)
}

//  开关店核心逻辑
async function handleShopStatusToggle() {
  const shopId = Number(localStorage.getItem('shopId'))
  if (!shopId) {
    ElMessage.warning('未检测到商家ID')
    return
  }
  const currentStatus = shopStatus.value
  targetStatus.value = currentStatus === '正常营业' ? '关门大吉' : '正常营业'

  const confirmText =
    targetStatus.value === '关门大吉' ? '确定要关闭店铺吗？买家将无法下单' : '确定要开门营业吗？'

  try {
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: targetStatus.value === '关门大吉' ? '确认关门' : '确认开门',
      cancelButtonText: '取消',
      type: targetStatus.value === '关门大吉' ? 'warning' : 'success',
    })
  } catch {
    return // 取消则直接返回
  }

  try {
    const apiStatus = targetStatus.value === '正常营业' ? 1 : 2
    console.log('apiStatus:', apiStatus)
    console.log('toggleShopStatus:', shopId)
    const res = await toggleShopStatus(shopId, apiStatus)
    if (res?.ok) {
      shopStatus.value = targetStatus.value
      showDoorModal.value = true
      setTimeout(() => {
        showDoorModal.value = false
      }, 1500) // 动画时长

      ElMessage.success(`操作成功：${targetStatus.value}`)
    } else {
      ElMessage.error(res?.msg || '状态修改失败')
    }
  } catch (error) {
    console.error('开关店接口报错:', error)
    ElMessage.error('网络异常，操作失败')
  }
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
:deep(.el-button--text) {
  color: #333;
}
:deep(.el-dropdown-menu) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
:deep(.el-dropdown-item) {
  padding: 10px 16px;
}
:deep(.el-dropdown-item:hover) {
  background-color: #fef7e5;
  border-radius: 8px;
}

/* 大门动画关键帧 */
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
