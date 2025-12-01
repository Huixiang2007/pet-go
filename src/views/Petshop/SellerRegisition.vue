<template>
  <div class="min-h-screen bg-[#fdf5ed] flex justify-center items-center py-8 px-4">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="bg-[#f77e21] py-6 px-8 text-white">
        <h1 class="text-[28px] font-bold text-center">商家注册</h1>
        <p class="text-[#fff8f0] text-center mt-2">填写信息，完成商铺入驻申请</p>
      </div>

      <form class="p-8 space-y-8">
        <!-- 商铺基本信息 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-gray-100 pb-2">
            <i class="fa fa-store text-[#f77e21] text-xl mr-3"></i>
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
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400"
                placeholder="请输入商铺名称"
                required
              />
            </div>
            <div class="space-y-2">
              <label for="shop-type" class="block text-sm font-medium text-gray-700">
                店铺类型 <span class="text-red-500">*</span>
              </label>
              <select
                id="shop-type"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none bg-white"
                required
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
                商铺头像 <span class="text-red-500">*</span>
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">
                <label for="shop-avatar-file" class="cursor-pointer flex flex-col items-center justify-center">
                  <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                  <span class="text-gray-600">点击上传商铺头像</span>
                  <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                </label>
                <input type="file" class="hidden" id="shop-avatar-file" accept="image/*" required />
              </div>
            </div>

              <div class="space-y-2" id="business-license-section" >
            <label for="business-license" class="block text-sm font-medium text-gray-700">
              营业执照照片<span class="text-red-500">*</span>
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">

              <label for="business-license-file" class="cursor-pointer flex flex-col items-center justify-center">
                <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                <span class="text-gray-600">点击上传营业执照</span>
                <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
              </label>
              <input type="file" class="hidden" id="business-license-file" accept="image/*" required />
            </div>
          </div>
          </div>



          <div class=" grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="id-card-front" class="block text-sm font-medium text-gray-700">
                身份证正面<span class="text-red-500">*</span>
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">

                <label for="id-card-front-file" class="cursor-pointer flex flex-col items-center justify-center">
                  <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                  <span class="text-gray-600">点击上传身份证正面</span>
                  <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                </label>
                <input type="file" class="hidden" id="id-card-front-file" accept="image/*" required />
              </div>
            </div>
            <div class="space-y-2">
              <label for="id-card-back" class="block text-sm font-medium text-gray-700">
                身份证反面<span class="text-red-500">*</span>
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#f77e21] hover:bg-[#fdf5ed]/50 transition-all cursor-pointer">

                <label for="id-card-back-file" class="cursor-pointer flex flex-col items-center justify-center">
                  <i class="fa fa-cloud-upload text-4xl text-[#f77e21]/70 mb-2"></i>
                  <span class="text-gray-600">点击上传身份证反面</span>
                  <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                </label>
                <input type="file" class="hidden" id="id-card-back-file"  accept="image/*" required />
              </div>
            </div>
          </div>
        </div>

        <!-- 商铺拥有者信息 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-gray-100 pb-2">
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
              />
            </div>
            <div class="space-y-2">
              <label for="contact-phone" class="block text-sm font-medium text-gray-700">
                拥有者电话 <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                pattern="^1[3-9]\d{9}$"
                id="contact-phone"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400"
                placeholder="请输入拥有者电话"
                required
              />
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
            />
          </div>
        </div>

        <!-- 商铺地址信息 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-gray-100 pb-2">
            <i class="fa fa-map-marker text-[#f77e21] text-xl mr-3"></i>
            <h2 class="text-xl font-semibold text-gray-800">商铺地址信息</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div class="space-y-2">
              <label for="province" class="block text-sm font-medium text-gray-700">
                所在省份 <span class="text-red-500">*</span>
              </label>
            <select id="province"
              v-model="selectedProvince"
              @change="handleProvinceChange"
             class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
          <input type="text" id="address" class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="请输入详细地址" >
          </div>
        </div>

        <!-- 商铺简介 -->
        <div class="space-y-4">
          <div class="flex items-center border-b border-gray-100 pb-2">
            <i class="fa fa-info-circle text-[#f77e21] text-xl mr-3"></i>
            <h2 class="text-xl font-semibold text-gray-800">商铺简介</h2>
          </div>
          <div class="space-y-2">
            <label for="shop-desc" class="block text-sm font-medium text-gray-700">
              商铺介绍 <span class="text-red-500">*</span>
            </label>
            <textarea
              id="shop-desc"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f77e21]/30 focus:border-[#f77e21] transition-all outline-none placeholder:text-gray-400 resize-y min-h-[100px]"
              placeholder="请输入商铺介绍（如经营品类、店铺特色等）"
              required
            ></textarea>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mt-6">
          <button
            class="w-full py-3 bg-[#f77e21] text-white font-medium rounded-lg hover:bg-[#e67010] active:bg-[#d56300] transition-all shadow-md hover:shadow-lg"
            type="submit"
          >
            提交注册信息
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref} from 'vue'

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



// 模拟城市数据
const provinceList :Province[] =  [
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
const selectedProvince = ref<string>('') // 选中的省份ID
const selectedCity = ref<string>('')     // 选中的城市ID
const selectedDistrict = ref<string>('') // 选中的区县名称
const cityList = ref<City[]>([])
const districtList = ref<string[]>([])

// 省份
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

</script>

<style scoped>
.hidden {
  display: none !important;
}
</style>
