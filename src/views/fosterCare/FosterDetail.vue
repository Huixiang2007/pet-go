<template>
  <div id="app">
    <!-- 导航栏 -->
    <NavBar />

    <div class="container mx-auto px-4 py-6 max-w-6xl mt-16">
      <!-- 基本信息组件 -->
      <FosterHomeBasicInfo :fosterHome="fosterHome" @preview-image="handleImagePreview" />

      <!-- 套餐展示组件 -->
      <FosterServicePackage
        :provider-id="fosterHomeId"
        :max-pets="fosterHome.maxPets"
        @select-package="handleSelectPackage"
      />

      <!-- 评价系统组件 -->
<<<<<<< HEAD
      <FosterReviewSystem :total-score="fosterHome.totalScore" :service-score="fosterHome.serviceScore" @preview-image="handleImagePreview" />
=======
      <FosterReviewSystem
        :total-score="fosterHome.totalScore"
        :service-score="fosterHome.serviceScore"
      />
>>>>>>> 7f99d1688df2e23e815f54fb2c5ed956dde4298b
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="showImageDialog" width="80%" top="5vh">
      <img :src="previewImage" class="w-full h-auto rounded-lg" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingPackageStore } from '@/stores/booking'
import NavBar from '@/components/common/NavBar.vue'
import FosterHomeBasicInfo from '@/views/fosterCare/components/foster-detail/DetailBasic.vue'
import FosterServicePackage from '@/views/fosterCare/components/foster-detail/DetailPackage.vue'
import FosterReviewSystem from '@/views/fosterCare/components/foster-detail/DetailReview.vue'
import type { FosterHomeDetail, FosterServiceItem } from '@/types/foster'
import { fosterHomeDetail } from '@/api/foster-care'

// 路由与状态
const router = useRouter()
const route = useRoute()
const fosterHomeId = Number(route.params.id)
const bookingStore = useBookingPackageStore()

// 寄养家庭详情
const fosterHome = reactive<FosterHomeDetail>({
  id: 0,
  providerType: '',
  userId: null,
  contactName: null,
  name: '',
  description: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  longitude: null,
  latitude: null,
  contactPhone: null,
  experienceYears: null,
  maxPets: null,
  petTypes: null,
  environmentPhotos: '',
  qualificationPhotos: '',
  serviceScore: 0,
  environmentScore: 0,
  communicationScore: 0,
  totalScore: 0,
  totalOrders: 0,
  status: null,
  verifiedTime: '',
  createTime: '',
  updateTime: '',
})

// 图片预览状态
const showImageDialog = ref(false)
const previewImage = ref('')

// 获取寄养家庭详情
const getFosterHomeDetail = async (id: number) => {
  try {
    const res = await fosterHomeDetail(id)
    console.log('获取寄养家庭详情成功：', res)
    if (res.code === 0) {
      Object.assign(fosterHome, res.data)
      if (typeof fosterHome.environmentPhotos === 'string') {
        fosterHome.environmentPhotos = fosterHome.environmentPhotos.split(',').filter(Boolean)
      }
    }
  } catch (error) {
    console.error('获取寄养家庭详情失败：', error)
  }
}

// 图片预览处理
const handleImagePreview = (image: string) => {
  previewImage.value = image
  showImageDialog.value = true
}

// 选择套餐处理
const handleSelectPackage = (packageItem: FosterServiceItem) => {
  bookingStore.setSelectedPackage(packageItem)
  router.push({
    name: 'fosterBook',
    params: {
      fosterId: fosterHomeId,
      serviceId: packageItem.id,
    },
  })
}

// 初始化
onMounted(async () => {
  await getFosterHomeDetail(Number(fosterHomeId))
})
</script>

<style scoped lang="scss">
#app {
  border-top: 1px solid transparent;
}

.cute-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.12);
  border: 1px solid #e0f0ff;
  transition: all 0.3s ease;
  background-color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(74, 144, 226, 0.15);
  }
}

.cute-btn {
  background: linear-gradient(135deg, #6bc4ff, #4a90e2);
  border: none;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);
}

.cute-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(74, 144, 226, 0.3);
}

.cute-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #6bc4ff, #4a90e2);
  border-radius: 16px 16px 0 0;
  margin: 0;
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: bold;
}
</style>
