<template>
  <div class="bg-orange-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />

      <div class="flex-1 overflow-auto p-4 ml-1 md:p-6">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 max-w-5xl mx-auto">
          <h1 class="text-2xl font-bold mb-8 text-center text-[#f77e21]">店铺信息设置</h1>

          <form class="space-y-8">
            <!-- 商铺基本信息 -->
            <div class="space-y-4">
              <div class="flex items-center border-b border-orange-100 pb-2">
                <i class="fa fa-store text-orange-600 text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺基本信息</h2>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="shop-name" class="block text-sm font-medium text-gray-700">
                    商铺名称 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="shop-name"
                    v-model="form.shopName"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all outline-none placeholder:text-gray-400"
                    placeholder="请输入商铺名称"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label for="shop-type" class="block text-sm font-medium text-gray-700">
                    店铺类型 <span class="text-red-500">*</span>
                    <span class="text-xs">({{ form.shopType }}) </span>
                  </label>
                  <select
                    id="shop-type"
                    v-model="form.shopType"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all outline-none bg-white"
                    required
                  >
                    <option value="" class="text-gray-400" id="shopType">请选择店铺类型</option>
                    <option value="个人店">个人店</option>
                    <option value="企业店">企业店</option>
                    <option value="旗舰店">旗舰店</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    商铺头像 <span class="text-red-500">*</span>
                  </label>
                  <FileUpload
                    accept="image/*"
                    @file-change="(files) => handleFileChange(files, 'shopAvatar')"
                  >
                    <template #default>
                      <i class="fa fa-cloud-upload text-4xl text-orange-500 mb-2"></i>
                      <span class="text-gray-600">点击上传商铺头像</span>
                      <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                  </FileUpload>
                  <div v-if="imagePreviews.shopAvatar" class="mt-2">
                    <img
                      :src="imagePreviews.shopAvatar"
                      class="w-24 h-24 rounded-lg object-cover"
                      alt="商铺头像预览"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    营业执照照片 <span class="text-red-500">*</span>
                  </label>
                  <FileUpload
                    accept="image/*"
                    @file-change="(files) => handleFileChange(files, 'businessLicense')"
                  >
                    <template #default>
                      <i class="fa fa-file-image-o text-4xl text-orange-500 mb-2"></i>
                      <span class="text-gray-600">点击上传营业执照</span>
                      <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                  </FileUpload>
                  <div v-if="imagePreviews.businessLicense" class="mt-2">
                    <img
                      :src="imagePreviews.businessLicense"
                      class="w-24 h-24 rounded-lg object-cover"
                      alt="营业执照预览"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 商家信息 -->
            <div class="space-y-4">
              <div class="flex items-center border-b border-orange-100 pb-2">
                <i class="fa fa-user text-orange-600 text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商家信息</h2>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="contact-name" class="block text-sm font-medium text-gray-700">
                    联系人姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    v-model="form.contactName"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all outline-none placeholder:text-gray-400"
                    placeholder="请输入联系人姓名"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label for="contact-phone" class="block text-sm font-medium text-gray-700">
                    联系人电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    v-model="form.contactPhone"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all outline-none placeholder:text-gray-400"
                    placeholder="请输入联系人电话"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="contact-email" class="block text-sm font-medium text-gray-700">
                  联系人邮箱 <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  v-model="form.contactEmail"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all outline-none placeholder:text-gray-400"
                  placeholder="请输入联系人邮箱"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    身份证正面 <span class="text-red-500">*</span>
                  </label>
                  <FileUpload
                    accept="image/*"
                    @file-change="(files) => handleFileChange(files, 'idCardFront')"
                  >
                    <template #default>
                      <i class="fa fa-id-card-o text-4xl text-orange-500 mb-2"></i>
                      <span class="text-gray-600">点击上传身份证正面</span>
                      <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                  </FileUpload>
                  <div v-if="imagePreviews.idCardFront" class="mt-2">
                    <img
                      :src="imagePreviews.idCardFront"
                      class="w-24 h-24 rounded-lg object-cover"
                      alt="商铺头像预览"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    身份证反面 <span class="text-red-500">*</span>
                  </label>
                  <FileUpload
                    accept="image/*"
                    @file-change="(files) => handleFileChange(files, 'idCardBack')"
                  >
                    <template #default>
                      <i class="fa fa-id-card text-4xl text-orange-500 mb-2"></i>
                      <span class="text-gray-600">点击上传身份证反面</span>
                      <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                  </FileUpload>
                  <div v-if="imagePreviews.idCardBack" class="mt-2">
                    <img
                      :src="imagePreviews.idCardBack"
                      class="w-24 h-24 rounded-lg object-cover"
                      alt="商铺头像预览"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 地址信息 -->
            <div class="space-y-4">
              <div class="flex items-center border-b border-orange-100 pb-2">
                <i class="fa fa-map-marker text-orange-600 text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺地址信息</h2>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  选择地区 <span class="text-red-500">*</span>
                </label>
                <AddressSelect v-model="addressObject" class="w-full border rounded-xl p-3" />
                <div class="text-xs text-gray-500 mt-1">当前选择: {{ addressDisplayText }}</div>
              </div>

              <div class="space-y-2">
                <label for="address" class="block text-sm font-medium text-gray-700">
                  详细地址 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  v-model="form.address"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all outline-none placeholder:text-gray-400"
                  placeholder="请输入详细地址"
                  required
                />
              </div>
            </div>

            <!-- 商铺简介 -->
            <div class="space-y-4">
              <div class="flex items-center border-b border-orange-100 pb-2">
                <i class="fa fa-info-circle text-orange-600 text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺简介</h2>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  商铺介绍 <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="form.description"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
                  placeholder="请输入商铺介绍"
                  required
                ></textarea>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="mt-8">
              <button
                class="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800 transition-all shadow-md hover:shadow-lg"
                type="button"
                @click="submitForm"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">提交更改</span>
                <span v-if="isSubmitting">
                  <i class="fa fa-spinner fa-spin mr-2"></i>提交中...
                </span>
              </button>
              <p class="text-center text-gray-500 text-sm mt-4">
                提交后将在1-3个工作日内审核，请保持电话畅通
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 脚本部分无需修改，保持原逻辑即可
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AddressSelect from '@/components/business/AddressSelect.vue'
import FileUpload from '@/components/common/FileUpload.vue'
import { updateShopInfo, getShopDetail } from '../../../api/pet-shop/shop'
import provincesData from 'china-division/dist/provinces.json'
import citiesData from 'china-division/dist/cities.json'
import districtsData from 'china-division/dist/areas.json'

const isSubmitting = ref(false)
const imagePreviews = ref({
  shopAvatar: '',
  businessLicense: '',
  idCardFront: '',
  idCardBack: '',
})
const imageData = ref({
  shopAvatar: '',
  businessLicense: '',
  idCardFront: '',
  idCardBack: '',
  otherDocs: '',
})
const addressObject = ref({
  province: '',
  city: '',
  district: '',
})
const form = reactive({
  shopName: '',
  shopType: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  province: '',
  city: '',
  district: '',
  address: '',
  description: '',
})
watch(
  addressObject,
  (newValue) => {
    form.province = newValue.province
    form.city = newValue.city
    form.district = newValue.district
  },
  { deep: true },
)

//根据api来获取商铺信息
const shopId = Number(localStorage.getItem('shopId'))
console.log('商铺ID:', shopId)
onMounted(async () => {
  if (!shopId) {
    ElMessage.error('请先登录')
    return
  }
  try {
    const res = await getShopDetail(shopId)
    const shop = res
    console.log('商铺信息:', shop)
    form.shopName = shop.shopName
    form.shopType = shop.shopType
    form.contactName = shop.contactName
    form.contactPhone = shop.contactPhone
    form.contactEmail = shop.contactEmail
    form.province = shop.province
    form.city = shop.city
    form.district = shop.district
    form.address = shop.address
    form.description = shop.description

    // 图片数据回显
    imageData.value.shopAvatar = shop.shopAvatar || ''
    imageData.value.businessLicense = shop.businessLicense || ''
    imageData.value.idCardFront = shop.idCardFront || ''
    imageData.value.idCardBack = shop.idCardBack || ''

    // 图片预览回显
    imagePreviews.value.shopAvatar = shop.shopAvatar || ''
    imagePreviews.value.businessLicense = shop.businessLicense || ''
    imagePreviews.value.idCardFront = shop.idCardFront || ''
    imagePreviews.value.idCardBack = shop.idCardBack || ''

    // 地区选择器同步更新
    addressObject.value = {
      province: shop.province,
      city: shop.city,
      district: shop.district,
    }

    // 存储店铺ID用于后续更新
    localStorage.setItem('shopId', shop.id?.toString() || shopId.toString())
  } catch (error: any) {
    console.error('获取商铺信息失败:', error)
    ElMessage.error('获取商铺信息失败，请稍后重试')
  }
})

const addressDisplayText = computed(() => {
  let provinceName = ''
  let cityName = ''
  let districtName = ''
  try {
    const province = provincesData.find((p) => p.code === addressObject.value.province)
    provinceName = province ? province.name : `(${addressObject.value.province})`
    if (addressObject.value.city) {
      const city = citiesData.find((c) => c.code === addressObject.value.city)
      cityName = city ? city.name : `(${addressObject.value.city})`
    }
    if (addressObject.value.district) {
      const district = districtsData.find((d) => d.code === addressObject.value.district)
      districtName = district ? district.name : `(${addressObject.value.district})`
    }
  } catch (error) {
    console.error('地址名称转换失败:', error)
  }
  return [provinceName, cityName, districtName].filter(Boolean).join(' - ')
})
const handleFileChange = (files: any[], type: keyof typeof imageData.value) => {
  try {
    if (files && files.length > 0) {
      const fileUrl = files[0].url
      if (fileUrl) {
        imageData.value[type] = fileUrl
        imagePreviews.value[type as keyof typeof imagePreviews.value] = fileUrl
        ElMessage.success('文件上传成功')
      }
    }
  } catch (error) {
    console.error(`处理文件上传时出错:`, error)
    ElMessage.error('文件处理失败，请重试')
  }
}
const validateForm = (): boolean => {
  const requiredFields = [
    { value: form.shopName, field: '商铺名称' },
    { value: form.contactName, field: '联系人姓名' },
    { value: form.contactPhone, field: '联系人电话' },
    { value: form.contactEmail, field: '联系人邮箱' },
    { value: form.address, field: '详细地址' },
    { value: form.description, field: '商铺介绍' },
  ]
  for (const field of requiredFields) {
    if (!field.value) {
      ElMessage.error(`请填写${field.field}！`)
      return false
    }
  }
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(form.contactPhone)) {
    ElMessage.error('请输入正确的手机号码！')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.contactEmail)) {
    ElMessage.error('请输入正确的邮箱地址！')
    return false
  }
  return true
}
const submitForm = async () => {
  if (!validateForm() || isSubmitting.value) return
  try {
    isSubmitting.value = true
    let provinceName = ''
    let cityName = ''
    let districtName = ''
    if (addressObject.value.province) {
      const province = provincesData.find((p) => p.code === addressObject.value.province)
      provinceName = province ? province.name : ''
    }
    if (addressObject.value.city) {
      const city = citiesData.find((c) => c.code === addressObject.value.city)
      cityName = city ? city.name : ''
    }
    if (addressObject.value.district) {
      const district = districtsData.find((d) => d.code === addressObject.value.district)
      districtName = district ? district.name : ''
    }
    const userId = Number(localStorage.getItem('userId'))
    if (!userId) {
      ElMessage.error('用户未登录，请先登录！')
      isSubmitting.value = false
      return
    }
    const data = {
      shopId: shopId,
      shopName: form.shopName,
      shopType: form.shopType,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      province: provinceName,
      city: cityName,
      district: districtName,
      address: form.address,
      description: form.description,
      shopAvatar: imageData.value.shopAvatar,
      businessLicense: imageData.value.businessLicense,
      idCardFront: imageData.value.idCardFront,
      idCardBack: imageData.value.idCardBack,
    }
    console.log('提交数据:', data)
    try {
      const response = await updateShopInfo(data)
      ElMessage.success('提交成功，等待审核！')
      console.log('提交成功', response)
      console.log('更新后的商铺信息:', response)
    } catch (error: any) {
      console.error('提交失败:', error)
      if (error.response && error.response.data && error.response.data.message) {
        ElMessage.error(`提交失败: ${error.response.data.message}`)
      }
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
img {
  object-fit: cover;
}

button:disabled {
  background-color: #f9a857 !important;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .grid-cols-1.md\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>
