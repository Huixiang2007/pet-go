<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10">
      <form class="space-y-8">
        <!-- 商铺基本信息 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-purple-100 pb-2">
            <i class="fa fa-store text-purple-600 text-xl mr-3"></i>
            <h2 class="text-xl font-semibold text-gray-800">商铺基本信息</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="shop-name" class="block text-sm font-medium text-gray-700">
                商铺名称 <span class="text-red-500">*</span>
              </label>
              <input type="text" id="shop-name" v-model="form.shopName"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                placeholder="请输入商铺名称" required />
            </div>
            <div class="space-y-2">
              <label for="shop-type" class="block text-sm font-medium text-gray-700">
                店铺类型 <span class="text-red-500">*</span>
              </label>
              <select id="shop-type" v-model="form.shopType"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none bg-white"
                required>
               <option value="" class="text-gray-400">请选择店铺类型</option>
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
              <div v-if="imagePreviews.shopAvatar" class="mb-2">
                <img :src="imagePreviews.shopAvatar" class="max-w-full max-h-40 object-contain rounded" alt="商铺头像预览" />
              </div>
              <FileUpload :preview-image="imagePreviews.shopAvatar" accept="image/*"
                @file-change="handleFileChange($event, 'shopAvatar')">
                <template #default>
                  <i class="fa fa-cloud-upload text-4xl text-purple-500 mb-2"></i>
                  <span class="text-gray-600">点击上传商铺头像</span>
                  <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                </template>
              </FileUpload>
            </div>


            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                营业执照照片 <span class="text-red-500">*</span>
              </label>

              <div v-if="imagePreviews.businessLicense" class="mb-2">
                <img :src="imagePreviews.businessLicense" class="max-w-full max-h-40 object-contain rounded"
                  alt="营业执照预览" />
              </div>
              <FileUpload :preview-image="imagePreviews.businessLicense" accept="image/*"
                @file-change="handleFileChange($event, 'businessLicense')">
                <template #default>
                  <i class="fa fa-file-image-o text-4xl text-purple-500 mb-2"></i>
                  <span class="text-gray-600">点击上传营业执照</span>
                  <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                </template>
              </FileUpload>
            </div>
          </div>
        </div>

        <!-- 商家信息 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-purple-100 pb-2">
            <i class="fa fa-user text-purple-600 text-xl mr-3"></i>
            <h2 class="text-xl font-semibold text-gray-800">商家信息</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="contact-name" class="block text-sm font-medium text-gray-700">
                联系人姓名 <span class="text-red-500">*</span>
              </label>
              <input type="text" id="contact-name" v-model="form.contactName"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                placeholder="请输入联系人姓名" required />
            </div>
            <div class="space-y-2">
              <label for="contact-phone" class="block text-sm font-medium text-gray-700">
                联系人电话 <span class="text-red-500">*</span>
              </label>
              <input type="tel" id="contact-phone" v-model="form.contactPhone"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                placeholder="请输入联系人电话" required />
            </div>
          </div>

          <div class="space-y-2">
            <label for="contact-email" class="block text-sm font-medium text-gray-700">
              联系人邮箱 <span class="text-red-500">*</span>
            </label>
            <input type="email" id="contact-email" v-model="form.contactEmail"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
              placeholder="请输入联系人邮箱" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                身份证正面 <span class="text-red-500">*</span>
              </label>

              <div v-if="imagePreviews.idCardFront" class="mb-2">
                <img :src="imagePreviews.idCardFront" class="max-w-full max-h-40 object-contain rounded"
                  alt="身份证正面预览" />
              </div>
              <FileUpload :preview-image="imagePreviews.idCardFront" accept="image/*"
                @file-change="handleFileChange($event, 'idCardFront')">
                <template #default>
                  <i class="fa fa-id-card-o text-4xl text-purple-500 mb-2"></i>
                  <span class="text-gray-600">点击上传身份证正面</span>
                  <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                </template>
              </FileUpload>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                身份证反面 <span class="text-red-500">*</span>
              </label>

              <div v-if="imagePreviews.idCardBack" class="mb-2">
                <img :src="imagePreviews.idCardBack" class="max-w-full max-h-40 object-contain rounded" alt="身份证反面预览" />
              </div>
              <FileUpload :preview-image="imagePreviews.idCardBack" accept="image/*"
                @file-change="handleFileChange($event, 'idCardBack')">
                <template #default>
                  <i class="fa fa-id-card text-4xl text-purple-500 mb-2"></i>
                  <span class="text-gray-600">点击上传身份证反面</span>
                  <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                </template>
              </FileUpload>
            </div>
          </div>
        </div>

        <!-- 地址信息 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-purple-100 pb-2">
            <i class="fa fa-map-marker text-purple-600 text-xl mr-3"></i>
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
            <input type="text" id="address" v-model="form.address"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
              placeholder="请输入详细地址" required />
          </div>
        </div>

        <!-- 商铺简介 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-purple-100 pb-2">
            <i class="fa fa-info-circle text-purple-600 text-xl mr-3"></i>
            <h2 class="text-xl font-semibold text-gray-800">商铺简介</h2>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              商铺介绍 <span class="text-red-500">*</span>
            </label>
            <textarea v-model="form.description"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
              placeholder="请输入商铺介绍" required></textarea>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mt-8">
          <button
            class="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 active:from-purple-800 active:to-purple-700 transition-all shadow-md hover:shadow-lg"
            type="button" @click="submitForm" :disabled="isSubmitting">
            <span v-if="!isSubmitting">提交申请</span>
            <span v-if="isSubmitting"> <i class="fa fa-spinner fa-spin mr-2"></i>提交中... </span>
          </button>
          <p class="text-center text-gray-500 text-sm mt-4">
            提交后将在1-3个工作日内审核，请保持电话畅通
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 导入依赖
import { reactive, ref, computed, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 导入组件
import AddressSelect from '@/components/business/AddressSelect.vue'
import FileUpload from '@/components/FileUpload.vue'

// 导入地区数据
import provincesData from 'china-division/dist/provinces.json'
import citiesData from 'china-division/dist/cities.json'
import districtsData from 'china-division/dist/areas.json'

// 响应式状态定义
const isSubmitting = ref(false)

// 图片预览对象
const imagePreviews = ref({
  shopAvatar: '',
  businessLicense: '',
  idCardFront: '',
  idCardBack: '',
})

// 地址选择对象
const addressObject = ref({
  province: '',
  city: '',
  district: '',
})

// 表单数据
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
// 监听地址对象变化，同步到表单
watch(
  addressObject,
  (newValue) => {
    form.province = newValue.province
    form.city = newValue.city
    form.district = newValue.district
  },
  { deep: true },
)

// 计算属性：地址显示文本
const addressDisplayText = computed(() => {
  if (!addressObject.value.province) return '请选择地区'

  let provinceName = ''
  let cityName = ''
  let districtName = ''

  try {
    // 获取省份名称
    const province = provincesData.find((p) => p.code === addressObject.value.province)
    provinceName = province ? province.name : `未知(${addressObject.value.province})`

    // 获取城市名称
    if (addressObject.value.city) {
      const city = citiesData.find((c) => c.code === addressObject.value.city)
      cityName = city ? city.name : `未知(${addressObject.value.city})`
    }

    // 获取区县名称
    if (addressObject.value.district) {
      const district = districtsData.find((d) => d.code === addressObject.value.district)
      districtName = district ? district.name : `未知(${addressObject.value.district})`
    }
  } catch (error) {
    console.error('地址名称转换失败:', error)
  }
  return [provinceName, cityName, districtName].filter(Boolean).join(' - ')
})

// 辅助函数：获取字段中文名称
const getFieldName = (type: string): string => {
  const names: Record<string, string> = {
    shopAvatar: '商铺头像',
    businessLicense: '营业执照',
    idCardFront: '身份证正面',
    idCardBack: '身份证反面',
    otherDocs: '其他证件',
  }
  return names[type] || type
}
const imageData = ref({
  shopAvatar: '',
  businessLicense: '',
  idCardFront: '',
  idCardBack: '',
  otherDocs: '',
})
// 文件上传处理函数 - 修改为存储base64字符串
const handleFileChange = async (dataUrl:string, type: keyof typeof imageData.value) => {
  try {
    if (dataUrl && dataUrl.startsWith('data:image/')) {

      // 直接存储base64字符串
      imageData.value[type] = dataUrl
      ElMessage.success(`${getFieldName(type)}上传成功`)
    } else {
      // 清除无效上传
      imageData.value[type] = ''
      ElMessage.error(`${getFieldName(type)}格式错误，请重新上传`)
    }
  } catch (error) {
    console.error(`处理${getFieldName(type)}时出错:`, error)
    imageData.value[type] = ''
    ElMessage.error(`${getFieldName(type)}处理失败，请重试`)
  }
}

// 表单验证函数
const validateForm = (): boolean => {
  // 基础字段验证
  const requiredFields = [
    { value: form.shopName, field: '商铺名称' },
    { value: form.shopType, field: '店铺类型' },
    { value: form.contactName, field: '联系人姓名' },
    { value: form.contactPhone, field: '联系人电话' },
    { value: form.contactEmail, field: '联系人邮箱' },
    { value: form.province, field: '所在省份' },
    { value: form.city, field: '所在城市' },
    { value: form.district, field: '所在区县' },
    { value: form.address, field: '详细地址' },
    { value: form.description, field: '商铺介绍' },
  ]

  // 验证必填字段
  for (const field of requiredFields) {
    if (!field.value) {
      ElMessage.error(`请填写${field.field}！`)
      return false
    }
  }

  // 文件验证
  const requiredImages = [
    { value: imageData.value.shopAvatar, field: '商铺头像' },
    { value: imageData.value.businessLicense, field: '营业执照' },
    { value: imageData.value.idCardFront, field: '身份证正面' },
    { value: imageData.value.idCardBack, field: '身份证反面' },
  ]

  // 验证必填文件
  for (const image of requiredImages) {
    if (!image.value) {
      ElMessage.error(`请上传${image.field}！`)
      return false
    }
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(form.contactPhone)) {
    ElMessage.error('请输入正确的手机号码！')
    return false
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.contactEmail)) {
    ElMessage.error('请输入正确的邮箱地址！')
    return false
  }

  return true
}

// 表单提交函数
const submitForm = async () => {
  // 验证表单
  if (!validateForm() || isSubmitting.value) return

  try {
    let provinceName = ''
    let cityName = ''
    let districtName = ''

    // 获取省份名称
    if (addressObject.value.province) {
      const province = provincesData.find((p) => p.code === addressObject.value.province)
      provinceName = province ? province.name : ''
    }

    // 获取城市名称
    if (addressObject.value.city) {
      const city = citiesData.find((c) => c.code === addressObject.value.city)
      cityName = city ? city.name : ''
    }

    // 获取区县名称
    if (addressObject.value.district) {
      const district = districtsData.find((d) => d.code === addressObject.value.district)
      districtName = district ? district.name : ''
    }

    const userId = Number(localStorage.getItem('userId'))

    const data = {
      userId: userId,
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
    console.log('FormData内容:')
    console.log(data)
    console.log(typeof userId)
    console.log(typeof form.shopName)
    console.log(typeof form.shopType)

    console.log(typeof form.contactName)
    console.log(typeof form.contactPhone)
    console.log(typeof form.contactEmail)

    console.log(typeof provinceName)
    console.log(typeof cityName)
    console.log(typeof districtName)

    console.log(typeof form.address)
    console.log(typeof form.description)
    console.log(typeof imageData.value.shopAvatar)

    console.log(typeof imageData.value.businessLicense)
    console.log(typeof imageData.value.idCardFront)
    console.log(typeof imageData.value.idCardBack)

    // 发送请求
    axios
      .request({
        url: '/server/api/shop/shops/test',
        method: 'POST',
        data: data,
      })
      .then((response) => {
        // 处理成功响应
        ElMessage.success('提交成功，等待审核！')
        console.log('提交成功', response.data)
      })
      .catch((error) => {
        // 处理错误
        console.log('提交失败:', error.response.data)
        ElMessage.error('提交失败，请稍后重试。')
      })
      .finally(() => {
        // 重置提交状态
        isSubmitting.value = true
      })
  } catch (error) {
    // 处理错误
    console.log('提交失败:', error)
    ElMessage.error('提交失败，请稍后重试。')
  }
}

// 重置图片预览
Object.keys(imagePreviews.value).forEach((key) => {
  imagePreviews.value[key as keyof typeof imagePreviews.value] = ''
})

// 重置地址对象
addressObject.value = {
  province: '',
  city: '',
  district: '',
}
</script>
