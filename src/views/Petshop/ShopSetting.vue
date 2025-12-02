<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />

      <div class="flex-1 overflow-auto p-4 ml-1 md:p-6">
        <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 max-w-5xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-800 mb-8 text-center text-[#f77e21]">店铺信息设置</h1>

          <form class="space-y-8" @submit.prevent="saveShopSetting">
            <!-- 商铺基本信息 -->
            <div class="space-y-4">
              <div class="flex items-center border-b border-gray-200 pb-3 mb-2">
                <i class="fa fa-store text-[#f77e21] text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺基本信息</h2>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 商铺名称 + 即时验证提示 -->
                <div class="space-y-2">
                  <label for="shop-name" class="block text-sm font-medium text-gray-700">
                    商铺名称 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="shop-name"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400"
                    placeholder="请输入商铺名称"
                    required
                    v-model="shopInfo.name"
                    @blur="validateShopName"
                  />
                  <p v-if="shopNameError" class="text-xs text-red-500 mt-1">{{ shopNameError }}</p>
                </div>

                <!-- 店铺类型 -->
                <div class="space-y-2">
                  <label for="shop-type" class="block text-sm font-medium text-gray-700">
                    店铺类型 <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="shop-type"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none bg-white"
                    required
                    v-model="shopInfo.type"
                  >
                    <option value="" class="text-gray-400">请选择店铺类型</option>
                    <option value="1">个人店</option>
                    <option value="2">企业店</option>
                    <option value="3">旗舰店</option>
                    <option value="4">专卖店</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="shop-avatar" class="block text-sm font-medium text-gray-700">
                    商铺头像
                  </label>
                  <div class="flex flex-col gap-3">
                    <div v-if="previewAvatar" class="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 relative group">
                      <img :src="previewAvatar" alt="商铺头像" class="w-full h-full object-cover">
                      <button
                        type="button"
                        class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="clearAvatar"
                      >
                        <i class="fa fa-times text-xs"></i>
                      </button>
                    </div>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">
                      <label for="shop-avatar-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                        <span class="text-gray-600">点击重新上传商铺头像</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                      </label>
                      <input type="file" class="hidden" id="shop-avatar-file" accept="image/*" @change="handleAvatarUpload" />
                    </div>
                  </div>
                </div>

                <!-- 营业执照-->
                <div class="space-y-2" id="business-license-section">
                  <label for="business-license" class="block text-sm font-medium text-gray-700">
                    营业执照照片
                  </label>
                  <div class="flex flex-col gap-3">
                    <div v-if="previewLicense" class="w-48 h-32 rounded-lg overflow-hidden border border-gray-200 relative group">
                      <img :src="previewLicense" alt="营业执照" class="w-full h-full object-cover">
                      <button
                        type="button"
                        class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="clearLicense"
                      >
                        <i class="fa fa-times text-xs"></i>
                      </button>
                    </div>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">
                      <label for="business-license-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                        <span class="text-gray-600">点击重新上传营业执照</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                      </label>
                      <input type="file" class="hidden" id="business-license-file" accept="image/*" @change="handleLicenseUpload" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 身份证正反面-->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="id-card-front" class="block text-sm font-medium text-gray-700">
                    身份证正面
                  </label>
                  <div class="flex flex-col gap-3">
                    <div v-if="previewIdCardFront" class="w-48 h-32 rounded-lg overflow-hidden border border-gray-200 relative group">
                      <img :src="previewIdCardFront" alt="身份证正面" class="w-full h-full object-cover">
                      <button
                        type="button"
                        class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="clearIdCardFront"
                      >
                        <i class="fa fa-times text-xs"></i>
                      </button>
                    </div>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">
                      <label for="id-card-front-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                        <span class="text-gray-600">点击重新上传身份证正面</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                      </label>
                      <input type="file" class="hidden" id="id-card-front-file" accept="image/*" @change="handleIdCardFrontUpload" />
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="id-card-back" class="block text-sm font-medium text-gray-700">
                    身份证反面
                  </label>
                  <div class="flex flex-col gap-3">
                    <div v-if="previewIdCardBack" class="w-48 h-32 rounded-lg overflow-hidden border border-gray-200 relative group">
                      <img :src="previewIdCardBack" alt="身份证反面" class="w-full h-full object-cover">
                      <button
                        type="button"
                        class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="clearIdCardBack"
                      >
                        <i class="fa fa-times text-xs"></i>
                      </button>
                    </div>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">
                      <label for="id-card-back-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                        <span class="text-gray-600">点击重新上传身份证反面</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                      </label>
                      <input type="file" class="hidden" id="id-card-back-file" accept="image/*" @change="handleIdCardBackUpload" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 商铺拥有者-->
            <div class="space-y-4">
              <div class="flex items-center border-b border-gray-200 pb-3 mb-2">
                <i class="fa fa-user text-[#f77e21] text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺拥有者信息</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="contact-name" class="block text-sm font-medium text-gray-700">
                    拥有者姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400"
                    placeholder="请输入拥有者姓名"
                    required
                    v-model="ownerInfo.name"
                  />
                </div>
                <div class="space-y-2">
                  <label for="contact-phone" class="block text-sm font-medium text-gray-700">
                    拥有者电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400"
                    placeholder="请输入拥有者电话"
                    required
                    v-model="ownerInfo.phone"
                    @blur="validatePhone"
                  />
                  <p v-if="phoneError" class="text-xs text-red-500 mt-1">{{ phoneError }}</p>
                </div>
              </div>
              <div class="space-y-2">
                <label for="contact-email" class="block text-sm font-medium text-gray-700">
                  拥有者邮箱 <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400"
                  placeholder="请输入拥有者邮箱"
                  required
                  v-model="ownerInfo.email"
                  @blur="validateEmail"
                />
                <p v-if="emailError" class="text-xs text-red-500 mt-1">{{ emailError }}</p>
              </div>
            </div>

            <!-- 商铺地址信息 -->
            <div class="space-y-4">
              <div class="flex items-center border-b border-gray-200 pb-3 mb-2">
                <i class="fa fa-map-marker text-[#f77e21] text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺地址信息</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label for="province" class="block text-sm font-medium text-gray-700">
                    所在省份 <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="province"
                    v-model="selectedProvince"
                    @change="handleProvinceChange"
                    class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none bg-white"
                  >
                    <option value="">请选择</option>
                    <option v-for="value in provinceList" :key="value.id" :value="value.id">{{ value.name }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label for="city" class="block text-sm font-medium text-gray-700">
                    所在城市 <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    v-model="selectedCity"
                    @change="handleCityChange"
                    :disabled="!cityList.length"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none bg-white"
                    required
                  >
                    <option value="">请选择</option>
                    <option v-for="city in cityList" :key="city.id" :value="city.id">{{ city.name }}</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label for="district" class="block text-sm font-medium text-gray-700">
                    所在区县 <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="district"
                    v-model="selectedDistrict"
                    :disabled="!districtList.length"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none bg-white"
                    required
                  >
                    <option value="">请选择</option>
                    <option v-for="(district, index) in districtList" :key="index" :value="district">
                      {{ district }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label for="address" class="block text-sm font-medium text-gray-700">
                  详细地址 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400"
                  placeholder="请输入详细地址"
                  v-model="addressInfo.detail"
                  required
                >
              </div>
            </div>

            <!-- 商铺简介 -->
            <div class="space-y-4">
              <div class="flex items-center border-b border-gray-200 pb-3 mb-2">
                <i class="fa fa-info-circle text-[#f77e21] text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺简介</h2>
              </div>
              <div class="space-y-2">
                <label for="shop-desc" class="block text-sm font-medium text-gray-700">
                  商铺介绍 <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="shop-desc"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
                  placeholder="请输入商铺介绍（如经营品类、店铺特色等）"
                  required
                  v-model="shopInfo.desc"
                ></textarea>
                <p class="text-xs text-gray-400 mt-1">最多输入500个字符</p>
              </div>
            </div>

            <div class="mt-8">
              <button
                class="w-full py-3 bg-[#f77e21] text-white font-medium rounded-lg hover:bg-[#e67010] active:bg-[#d56300] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                type="submit"
                :disabled="isSubmitting"
              >
                <i v-if="isSubmitting" class="fa fa-spinner fa-spin"></i>
                <span>{{ isSubmitting ? '保存中...' : '保存店铺设置' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted,Ref } from 'vue'

// 定义数据类型
interface Province {
  id: number
  name: string
  city: City[]
}
interface City {
  id: number
  name: string
  district: string[]
}

// 店铺基本信息（模拟回显数据）
const shopInfo = ref({
  name: '小明官方旗舰店',
  type: '3',
  desc: '本店主营宠物食品、宠物玩具、宠物用品等，专注为宠物提供高品质的产品和服务，欢迎各位铲屎官选购！'
})

// 拥有者信息（模拟回显数据）
const ownerInfo = ref({
  name: '王小明',
  phone: '18888888888',
  email: 'xiaoming@example.com'
})

// 地址信息（模拟回显数据）
const addressInfo = ref({
  detail: '北京市海淀区中关村大街1号'
})

// 图片预览相关
const previewAvatar = ref('') // 头像预览
const previewLicense = ref('') // 营业执照预览
const previewIdCardFront = ref('') // 身份证正面预览
const previewIdCardBack = ref('') // 身份证反面预览

// 表单验证错误提示
const shopNameError = ref('')
const phoneError = ref('')
const emailError = ref('')

// 提交状态（防重复提交）
const isSubmitting = ref(false)

// 模拟城市数据
const provinceList: Province[] = [
  { id: 1, name: '北京市', city: [{ id: 101, name: '北京市', district: ['东城区', '西城区', '海淀区', '朝阳区'] }] },
  { id: 2, name: '上海市', city: [{ id: 201, name: '上海市', district: ['黄浦区', '浦东新区', '静安区', '徐汇区'] }] },
  { id: 3, name: '天津市', city: [{ id: 301, name: '天津市', district: ['和平区', '南开区', '东丽区'] }] },
  { id: 4, name: '重庆市', city: [{ id: 401, name: '重庆市', district: ['江北区', '九龙坡区', '渝北区'] }] },
  { id: 5, name: '河北省', city: [
    { id: 501, name: '石家庄市', district: ['长安区', '桥西区', '裕华区'] },
    { id: 502, name: '唐山市', district: ['路南区', '路北区', '丰南区'] }
  ] },
  { id: 6, name: '山西省', city: [
    { id: 601, name: '太原市', district: ['小店区', '迎泽区', '杏花岭区'] },
    { id: 602, name: '大同市', district: ['平城区', '云冈区', '新荣区'] }
  ] }
]

// 地址选择相关状态
const selectedProvince = ref<string>('1') // 默认选中北京市
const selectedCity = ref<string>('101')   // 默认选中北京市
const selectedDistrict = ref<string>('海淀区') // 默认选中海淀区
const cityList = ref<City[]>([])
const districtList = ref<string[]>([])

// 省份切换逻辑
const handleProvinceChange = () => {
  selectedCity.value = ''
  selectedDistrict.value = ''
  const currentProv = provinceList.find(p => p.id === Number(selectedProvince.value))
  if (currentProv) {
    cityList.value = currentProv.city.map(c => ({ id: c.id, name: c.name, district: c.district }))
  } else {
    cityList.value = []
  }
}

// 城市切换逻辑
const handleCityChange = () => {
  selectedDistrict.value = ''
  const currentProv = provinceList.find(p => p.id === Number(selectedProvince.value))
  if (currentProv) {
    const currentCity = currentProv.city.find(c => c.id === Number(selectedCity.value))
    if (currentCity) {
      districtList.value = currentCity.district
    } else {
      districtList.value = []
    }
  } else {
    districtList.value = []
  }
}

// 图片上传预览逻辑 + 大小限制（5MB）
const handleFileUpload = (e: Event, previewRef: Ref<string>) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 文件大小限制：5MB
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert('文件大小不能超过5MB，请重新选择！')
    target.value = ''
    return
  }

  previewRef.value = URL.createObjectURL(file)
}

// 各图片上传的具体实现
const handleAvatarUpload = (e: Event) => handleFileUpload(e, previewAvatar)
const handleLicenseUpload = (e: Event) => handleFileUpload(e, previewLicense)
const handleIdCardFrontUpload = (e: Event) => handleFileUpload(e, previewIdCardFront)
const handleIdCardBackUpload = (e: Event) => handleFileUpload(e, previewIdCardBack)

// 清除预览图
const clearAvatar = () => previewAvatar.value = ''
const clearLicense = () => previewLicense.value = ''
const clearIdCardFront = () => previewIdCardFront.value = ''
const clearIdCardBack = () => previewIdCardBack.value = ''

// 表单验证逻辑
// 验证商铺名称（非空 + 长度）
const validateShopName = () => {
  if (!shopInfo.value.name.trim()) {
    shopNameError.value = '商铺名称不能为空！'
  } else if (shopInfo.value.name.length > 50) {
    shopNameError.value = '商铺名称不能超过50个字符！'
  } else {
    shopNameError.value = ''
  }
}

// 验证手机号
const validatePhone = () => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(ownerInfo.value.phone)) {
    phoneError.value = '请输入正确的11位手机号！'
  } else {
    phoneError.value = ''
  }
}

// 验证邮箱
const validateEmail = () => {
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailReg.test(ownerInfo.value.email)) {
    emailError.value = '请输入正确的邮箱格式！'
  } else {
    emailError.value = ''
  }
}

// 保存店铺设置逻辑 + 防重复提交
const saveShopSetting = async () => {
  // 先执行表单验证
  validateShopName()
  validatePhone()
  validateEmail()

  // 若有验证错误，终止提交
  if (shopNameError.value || phoneError.value || emailError.value) {
    return
  }

  isSubmitting.value = true
  try {
    // 整合所有表单数据
    const formData = {
      shopInfo: shopInfo.value,
      ownerInfo: ownerInfo.value,
      addressInfo: {
        province: selectedProvince.value,
        city: selectedCity.value,
        district: selectedDistrict.value,
        detail: addressInfo.value.detail
      },
      // 图片信息可后续对接后端上传接口
      imageInfo: {
        avatar: previewAvatar.value,
        license: previewLicense.value,
        idCardFront: previewIdCardFront.value,
        idCardBack: previewIdCardBack.value
      }
    }

    // 模拟接口请求（延迟1.5秒）
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('保存店铺设置：', formData)
    alert('店铺设置保存成功！')
  } catch (error) {
    console.error('保存失败：', error)
    alert('店铺设置保存失败，请重试！')
  } finally {
    isSubmitting.value = false
  }
}

// 页面挂载时初始化地址数据
onMounted(() => {
  handleProvinceChange()
  handleCityChange()
})
</script>

<style scoped>
/* 统一图片预览样式 */
img {
  object-fit: cover;
}

/* 禁用按钮样式 */
button:disabled {
  background-color: #f9a857 !important;
  cursor: not-allowed;
}

/* 修复小屏幕下的布局溢出 */
@media (max-width: 768px) {
  .grid-cols-1 md:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  .grid-cols-1 md:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>
