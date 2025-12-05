<template>
  <form class="space-y-8">
    <!-- 机构基本信息 -->
    <div class="space-y-4">
      <div class="flex items-center border-b border-purple-100 pb-2">
        <i class="fa fa-building text-purple-600 text-xl mr-3"></i>
        <h2 class="text-xl font-semibold text-gray-800">机构基本信息</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            机构名称 <span class="text-red-500">*</span>
          </label>
          <input type="text" v-model="form.name"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
            placeholder="请输入机构名称" required />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            可接待宠物类型 <span class="text-red-500">*</span>
          </label>
          <el-select v-model="form.petTypes" multiple class="w-full" placeholder="请选择可接待的宠物类型">
            <el-option v-for="animal in animalOptions" :key="animal.value" :label="animal.label"
              :value="animal.label" />
          </el-select>
        </div>
      </div>

      <!-- 机构资质上传（支持多张） -->
      <div class="space-y-2 mt-4">
        <label class="block text-sm font-medium text-gray-700">
          机构资质证书（支持多张，最多6张）<span class="text-red-500">*</span>
        </label>

        <FileUpload ref="qualificationRef" accept="image/*,.pdf" :max-count="6" accept-description="JPG、PNG、PDF格式"
          @file-change="(files) => (form.qualificationPhotos = files.map((f) => f.url))" />
      </div>
    </div>

    <!-- 环境照片上传（支持多张） -->
    <div class="space-y-2 mt-6">
      <label class="block text-sm font-medium text-gray-700">
        环境照片（支持多张，最多6张）<span class="text-red-500">*</span>
      </label>

      <FileUpload ref="environmentRef" accept="image/*" :max-count="6" accept-description="JPG、PNG格式"
        @file-change="(files) => (form.environmentPhotos = files.map((f) => f.url))" />
    </div>

    <!-- 机构地址与简介 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="space-y-4">
        <div class="flex items-center border-b border-purple-100 pb-2">
          <i class="fa fa-map-marker text-purple-600 text-xl mr-3"></i>
          <h2 class="text-lg font-semibold text-gray-800">机构地址</h2>
        </div>
        <AddressSelect v-model="selectedAddress" @change="handleAddressChange" />

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            详细地址 <span class="text-red-500">*</span>
          </label>
          <input type="text" v-model="form.detailAddress"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
            placeholder="请输入机构详细地址" required />
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center border-b border-purple-100 pb-2">
          <i class="fa fa-info-circle text-purple-600 text-xl mr-3"></i>
          <h2 class="text-lg font-semibold text-gray-800">机构简介</h2>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            机构介绍 <span class="text-red-500">*</span>
          </label>
          <textarea v-model="form.description"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
            placeholder="请输入机构介绍" required></textarea>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="mt-8">
      <button
        class="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 active:from-purple-800 active:to-purple-700 transition-all shadow-md hover:shadow-lg"
        type="button" @click="submitForm">
        提交申请
      </button>
      <p class="text-center text-gray-500 text-sm mt-4">提交后将在1-3个工作日内审核</p>
    </div>
    <div v-if="isSuccess" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl transform transition-all">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-check text-2xl text-green-500"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">提交成功！</h3>
        <p class="text-gray-600 mb-6">我们将在1-3个工作日内审核，请保持电话畅通</p>
        <button class="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          @click="isSuccess = false">
          确定
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import request from '@/utils/request'
import FileUpload from '@/components/FileUpload.vue'
import AddressSelect from '@/components/AddressSelect.vue'
// 引入Element Plus的消息提示组件（根据实际UI库替换）
import { ElMessage } from 'element-plus'
import provincesData from 'china-division/dist/provinces.json'
import citiesData from 'china-division/dist/cities.json'
import districtsData from 'china-division/dist/areas.json'

const animalOptions = [
  { value: 'cat', label: '猫' },
  { value: 'dog', label: '狗' },
  { value: 'fish', label: '鱼' },
  { value: 'bird', label: '鸟' },
  { value: 'rabbit', label: '兔' },
  { value: 'snake', label: '蛇' },
  { value: 'other', label: '其他' },
]

const selectedAddress = ref({
  province: '',
  city: '',
  district: '',
})
const isSuccess = ref(false)
// 表单数据
interface OrganizationForm {
  providerType: string
  name: string
  description: string
  province: string
  city: string
  district: string
  detailAddress: string
  cover: string
  petTypes: string[]
  qualificationPhotos: string[]
  environmentPhotos: string[]
}

const form = reactive<OrganizationForm>({
  providerType: '机构',
  name: '',
  description: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  cover: '',
  petTypes: [],
  qualificationPhotos: [],
  environmentPhotos: [],
})
const qualificationRef = ref<any>(null)
const environmentRef = ref<any>(null)

// 修复地址同步逻辑
interface Area {
  code: string
  name: string
}

interface City extends Area {
  provinceCode: string
}

interface District extends Area {
  cityCode: string
}

// 获取省份名称
const getProvinceName = (provinceCode: string) => {
  const province = (provincesData as Area[]).find((p) => p.code === provinceCode)
  return province ? province.name : provinceCode
}

// 获取城市名称
const getCityName = (cityCode: string) => {
  const city = (citiesData as City[]).find((c) => c.code === cityCode)
  return city ? city.name : cityCode
}

// 获取区县名称
const getDistrictName = (districtCode: string) => {
  const district = (districtsData as District[]).find((d) => d.code === districtCode)
  return district ? district.name : districtCode
}
const handleAddressChange = () => {
  form.province = getProvinceName(selectedAddress.value.province)
  form.city = getCityName(selectedAddress.value.city)
  form.district = getDistrictName(selectedAddress.value.district)
}
// 表单验证
const validateForm = (): boolean => {
  const requiredFields = [
    { value: form.name, field: '机构名称' },
    { value: form.petTypes.length > 0, field: '可接待宠物类型' },
    { value: form.province, field: '省份' },
    { value: form.city, field: '城市' },
    { value: form.district, field: '区域' },
    { value: form.detailAddress, field: '详细地址' },
    { value: form.description, field: '机构介绍' },
  ]

  for (const field of requiredFields) {
    if (!field.value) {
      ElMessage({
        message: `请填写${field.field}！`,
        type: 'error',
        duration: 3000,
      })

      return false
    }
  }

  // 验证文件上传
  if (form.qualificationPhotos.length === 0) {
    ElMessage.error('请至少上传1张机构资质证书！')

    return false
  }
  if (form.environmentPhotos.length === 0) {
    ElMessage.error('请至少上传1张环境照片！')

    return false
  }

  return true
}

// 表单提交
const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  const submitData = {
    ...form,

    qualificationPhotos: form.qualificationPhotos.join(','),
    environmentPhotos: form.environmentPhotos.join(','),
  }
  try {
    const response = await request('/server/api/foster/provider/add', 'POST', submitData)
    console.log('提交成功', response)
    if (response.code === 0) {
      ElMessage({
        message: '提交成功！我们将在1-3个工作日内审核',
        type: 'success',
        duration: 3000,
      })
      isSuccess.value = true
      // 重置表单
      form.name = ''
      form.description = ''
      form.province = ''
      form.city = ''
      form.district = ''
      form.detailAddress = ''
      form.petTypes = []
      form.qualificationPhotos = []
      form.environmentPhotos = []
      selectedAddress.value = { province: '', city: '', district: '' }
      if (qualificationRef.value) {
        qualificationRef.value.clearFiles()
      }
      if (environmentRef.value) {
        environmentRef.value.clearFiles()
      }
    } else {
      ElMessage.error(response.msg || '提交失败，请稍后重试')
    }
  } catch (error) {
    console.error('提交失败', error)

    ElMessage.error('提交失败，请稍后重试')
  }
}
</script>
<style scoped>
.fixed.inset-0 {
  backdrop-filter: blur(2px);
}

.rounded-2xl {
  border-radius: 16px;
}

.shadow-xl {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
