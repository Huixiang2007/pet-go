<template>
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
            <!-- 商铺头像上传 -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    商铺头像 <span class="text-red-500">*</span>
                </label>
                <div
                    class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                    <label for="shop-avatar-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <div v-if="imagePreviews.shopAvatar" class="mb-3">
                            <img :src="imagePreviews.shopAvatar"
                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm" alt="商铺头像预览" />
                        </div>
                        <div v-else>
                            <i class="fa fa-cloud-upload text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传商铺头像</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </div>
                    </label>
                    <input type="file" class="hidden" id="shop-avatar-file" accept="image/*"
                        @change="handleFileChange($event, 'shopAvatar')" />
                </div>
            </div>

            <!-- 营业执照上传 -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    营业执照照片 <span class="text-red-500">*</span>
                </label>
                <div
                    class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                    <label for="business-license-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <div v-if="imagePreviews.businessLicense" class="mb-3">
                            <img :src="imagePreviews.businessLicense"
                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm" alt="营业执照预览" />
                        </div>
                        <div v-else>
                            <i class="fa fa-file-image-o text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传营业执照</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </div>
                    </label>
                    <input type="file" class="hidden" id="business-license-file" accept="image/*"
                        @change="handleFileChange($event, 'businessLicense')" />
                </div>
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

        <!-- 新增：身份证正反面上传（必选） -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    身份证正面 <span class="text-red-500">*</span>
                </label>
                <div
                    class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                    <label for="id-card-front-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <div v-if="imagePreviews.idCardFront" class="mb-3">
                            <img :src="imagePreviews.idCardFront"
                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm" alt="身份证正面预览" />
                        </div>
                        <div v-else>
                            <i class="fa fa-id-card-o text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传身份证正面</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </div>
                    </label>
                    <input type="file" class="hidden" id="id-card-front-file" accept="image/*"
                        @change="handleFileChange($event, 'idCardFront')" />
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    身份证反面 <span class="text-red-500">*</span>
                </label>
                <div
                    class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                    <label for="id-card-back-file" class="cursor-pointer flex flex-col items-center justify-center">
                        <div v-if="imagePreviews.idCardBack" class="mb-3">
                            <img :src="imagePreviews.idCardBack"
                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm" alt="身份证反面预览" />
                        </div>
                        <div v-else>
                            <i class="fa fa-id-card text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传身份证反面</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </div>
                    </label>
                    <input type="file" class="hidden" id="id-card-back-file" accept="image/*"
                        @change="handleFileChange($event, 'idCardBack')" />
                </div>
            </div>
        </div>

        <!-- 新增：其他证件材料（可选） -->
        <div class="space-y-2 mt-4">
            <label class="block text-sm font-medium text-gray-700">
                其他证件材料（可选）
            </label>
            <div
                class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                <label for="other-docs-file" class="cursor-pointer flex flex-col items-center justify-center">
                    <div v-if="imagePreviews.otherDocs" class="mb-3">
                        <img :src="imagePreviews.otherDocs"
                            class="max-w-full max-h-44 object-contain rounded-lg shadow-sm" alt="其他证件预览" />
                    </div>
                    <div v-else>
                        <i class="fa fa-files-o text-4xl text-purple-500 mb-2"></i>
                        <span class="text-gray-600">点击上传其他相关证件（如行业资质、授权文件等）</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </div>
                </label>
                <input type="file" class="hidden" id="other-docs-file" accept="image/*"
                    @change="handleFileChange($event, 'otherDocs')" />
            </div>
        </div>
    </div>

    <!-- 地址信息 -->
    <div class="space-y-4">
        <div class="flex items-center border-b border-purple-100 pb-2">
            <i class="fa fa-map-marker text-purple-600 text-xl mr-3"></i>
            <h2 class="text-xl font-semibold text-gray-800">商铺地址信息</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    所在省份 <span class="text-red-500">*</span>
                </label>
                <select v-model="form.province" @change="handleProvinceChange"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none bg-white"
                    required>
                    <option value="">请选择</option>
                    <option v-for="province in provinceList" :key="province.id" :value="province.name">
                        {{ province.name }}
                    </option>
                </select>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    所在城市 <span class="text-red-500">*</span>
                </label>
                <select v-model="form.city" @change="handleCityChange" :disabled="!cityList.length"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none bg-white"
                    required>
                    <option value="">请选择</option>
                    <option v-for="city in cityList" :key="city.id" :value="city.name">
                        {{ city.name }}
                    </option>
                </select>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    所在区县 <span class="text-red-500">*</span>
                </label>
                <select v-model="form.district" :disabled="!districtList.length"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none bg-white"
                    required>
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
            <textarea
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
                placeholder="请输入商铺介绍（如经营品类、店铺特色等）" required></textarea>
        </div>
    </div>
</template>