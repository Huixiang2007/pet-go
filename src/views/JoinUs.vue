<template>
    <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white flex justify-center items-start py-8 px-4 pt-16">
        <!-- 主容器 -->
        <div class="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden border border-purple-100">
            <!-- 顶部标题栏 -->
            <div class="bg-gradient-to-r from-purple-600 to-purple-400 py-8 px-8 text-white">
                <h1 class="text-[32px] font-bold text-center">加入我们 · 成为合作伙伴</h1>
                <p class="text-purple-100 text-center mt-2">选择您的合作类型，完成入驻申请</p>
            </div>

            <!-- 选项卡切换 -->
            <div class="flex border-b border-purple-100 bg-purple-50">
                <button v-for="(item, index) in tabList" :key="index" :class="[
                    'flex-1 py-4 px-4 text-center font-medium transition-all',
                    activeTab === index ? 'text-purple-700 border-b-2 border-purple-500' : 'text-gray-500 hover:text-purple-600'
                ]" @click="switchTab(index)">
                    <i class="fa mr-2" :class="item.icon"></i>
                    {{ item.name }}
                </button>
            </div>

            <!-- 表单区域 -->
            <form class="p-8 space-y-8">
                <!-- 商家注册表单 -->
                <div v-if="activeTab === 0" class="space-y-8">
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
                                    <label for="shop-avatar-file"
                                        class="cursor-pointer flex flex-col items-center justify-center">
                                        <div v-if="imagePreviews.shopAvatar" class="mb-3">
                                            <img :src="imagePreviews.shopAvatar"
                                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm"
                                                alt="商铺头像预览" />
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
                                    <label for="business-license-file"
                                        class="cursor-pointer flex flex-col items-center justify-center">
                                        <div v-if="imagePreviews.businessLicense" class="mb-3">
                                            <img :src="imagePreviews.businessLicense"
                                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm"
                                                alt="营业执照预览" />
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
                            <textarea v-model="form.description"
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
                                placeholder="请输入商铺介绍（如经营品类、店铺特色等）" required></textarea>
                        </div>
                    </div>
                </div>

                <!-- 寄养机构注册表单 -->
                <div v-if="activeTab === 1" class="space-y-8">
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
                                <input type="text" v-model="form.orgName"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                    placeholder="请输入机构名称" required />
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    机构类型 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.orgType"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none bg-white"
                                    required>
                                    <option value="" class="text-gray-400">请选择机构类型</option>
                                    <option value="宠物寄养">宠物寄养</option>
                                    <option value="宠物医疗">宠物医疗</option>
                                    <option value="宠物训练">宠物训练</option>
                                    <option value="综合服务">综合服务</option>
                                </select>
                            </div>
                        </div>

                        <!-- 机构资质上传 -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    机构logo <span class="text-red-500">*</span>
                                </label>
                                <div
                                    class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                                    <label for="org-logo-file"
                                        class="cursor-pointer flex flex-col items-center justify-center">
                                        <div v-if="imagePreviews.orgLogo" class="mb-3">
                                            <img :src="imagePreviews.orgLogo"
                                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm"
                                                alt="机构logo预览" />
                                        </div>
                                        <div v-else>
                                            <i class="fa fa-picture-o text-4xl text-purple-500 mb-2"></i>
                                            <span class="text-gray-600">点击上传机构logo</span>
                                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                                        </div>
                                    </label>
                                    <input type="file" class="hidden" id="org-logo-file" accept="image/*"
                                        @change="handleFileChange($event, 'orgLogo')" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    机构资质证书 <span class="text-red-500">*</span>
                                </label>
                                <div
                                    class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                                    <label for="org-cert-file"
                                        class="cursor-pointer flex flex-col items-center justify-center">
                                        <div v-if="imagePreviews.orgCert" class="mb-3">
                                            <img :src="imagePreviews.orgCert"
                                                class="max-w-full max-h-44 object-contain rounded-lg shadow-sm"
                                                alt="资质证书预览" />
                                        </div>
                                        <div v-else>
                                            <i class="fa fa-file-text-o text-4xl text-purple-500 mb-2"></i>
                                            <span class="text-gray-600">点击上传资质证书</span>
                                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                                        </div>
                                    </label>
                                    <input type="file" class="hidden" id="org-cert-file" accept="image/*"
                                        @change="handleFileChange($event, 'orgCert')" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 机构负责人信息 -->
                    <div class="space-y-4">
                        <div class="flex items-center border-b border-purple-100 pb-2">
                            <i class="fa fa-user-circle text-purple-600 text-xl mr-3"></i>
                            <h2 class="text-xl font-semibold text-gray-800">负责人信息</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    负责人姓名 <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.orgContactName"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                    placeholder="请输入负责人姓名" required />
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    负责人电话 <span class="text-red-500">*</span>
                                </label>
                                <input type="tel" v-model="form.orgContactPhone"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                    placeholder="请输入负责人电话" required />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                负责人邮箱 <span class="text-red-500">*</span>
                            </label>
                            <input type="email" v-model="form.orgContactEmail"
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                placeholder="请输入负责人邮箱" required />
                        </div>
                    </div>

                    <!-- 机构地址与简介 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div class="flex items-center border-b border-purple-100 pb-2">
                                <i class="fa fa-map-marker text-purple-600 text-xl mr-3"></i>
                                <h2 class="text-lg font-semibold text-gray-800">机构地址</h2>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    详细地址 <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.orgAddress"
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
                                <textarea v-model="form.orgDescription"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
                                    placeholder="请输入机构介绍" required></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 寄养家庭注册表单 -->
                <div v-if="activeTab === 2" class="space-y-8">
                    <!-- 家庭基本信息 -->
                    <div class="space-y-4">
                        <div class="flex items-center border-b border-purple-100 pb-2">
                            <i class="fa fa-home text-purple-600 text-xl mr-3"></i>
                            <h2 class="text-xl font-semibold text-gray-800">家庭基本信息</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    家庭名称 <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.familyName"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                    placeholder="请输入家庭名称/昵称" required />
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    可寄养宠物类型 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.petType"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none bg-white"
                                    required>
                                    <option value="" class="text-gray-400">请选择可寄养类型</option>
                                    <option value="小型犬">小型犬</option>
                                    <option value="中型犬">中型犬</option>
                                    <option value="大型犬">大型犬</option>
                                    <option value="猫咪">猫咪</option>
                                    <option value="其他宠物">其他宠物</option>
                                    <option value="全部类型">全部类型</option>
                                </select>
                            </div>
                        </div>

                        <!-- 家庭环境照片 -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                家庭环境照片 <span class="text-red-500">*</span>
                            </label>
                            <div
                                class="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                                <label for="family-photo-file"
                                    class="cursor-pointer flex flex-col items-center justify-center">
                                    <div v-if="imagePreviews.familyPhoto" class="mb-3">
                                        <img :src="imagePreviews.familyPhoto"
                                            class="max-w-full max-h-44 object-contain rounded-lg shadow-sm"
                                            alt="家庭环境预览" />
                                    </div>
                                    <div v-else>
                                        <i class="fa fa-camera text-4xl text-purple-500 mb-2"></i>
                                        <span class="text-gray-600">点击上传家庭环境照片</span>
                                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                                    </div>
                                </label>
                                <input type="file" class="hidden" id="family-photo-file" accept="image/*"
                                    @change="handleFileChange($event, 'familyPhoto')" />
                            </div>
                        </div>
                    </div>

                    <!-- 家庭成员信息 -->
                    <div class="space-y-4">
                        <div class="flex items-center border-b border-purple-100 pb-2">
                            <i class="fa fa-user text-purple-600 text-xl mr-3"></i>
                            <h2 class="text-xl font-semibold text-gray-800">家庭成员信息</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    户主姓名 <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.familyContactName"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                    placeholder="请输入户主姓名" required />
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    联系电话 <span class="text-red-500">*</span>
                                </label>
                                <input type="tel" v-model="form.familyContactPhone"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                    placeholder="请输入联系电话" required />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                居住地址 <span class="text-red-500">*</span>
                            </label>
                            <input type="text" v-model="form.familyAddress"
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                placeholder="请输入详细居住地址" required />
                        </div>
                    </div>

                    <!-- 寄养能力说明 -->
                    <div class="space-y-4">
                        <div class="flex items-center border-b border-purple-100 pb-2">
                            <i class="fa fa-heart text-purple-600 text-xl mr-3"></i>
                            <h2 class="text-xl font-semibold text-gray-800">寄养能力说明</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    可寄养数量 <span class="text-red-500">*</span>
                                </label>
                                <input type="number" v-model="form.maxPetCount" min="1"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                                    placeholder="请输入可寄养宠物数量" required />
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    是否有养宠经验 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.hasPetExperience"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none bg-white"
                                    required>
                                    <option value="" class="text-gray-400">请选择</option>
                                    <option value="有">有</option>
                                    <option value="无">无</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                寄养说明 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.familyDescription"
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
                                placeholder="请描述您的寄养环境、经验、优势等" required></textarea>
                        </div>
                    </div>
                </div>

                <!-- 提交按钮 -->
                <div class="mt-8">
                    <button
                        class="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 active:from-purple-800 active:to-purple-700 transition-all shadow-md hover:shadow-lg"
                        type="submit" @click.prevent="submitForm">
                        提交申请
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
import { ref, reactive } from 'vue'
import axios from 'axios'

// 选项卡配置
const tabList = [
    { name: '商家入驻', icon: 'fa-shopping-bag' },
    { name: '寄养机构', icon: 'fa-building-o' },
    { name: '寄养家庭', icon: 'fa-home' }
]
const activeTab = ref(0)

// 切换选项卡
const switchTab = (index: number) => {
    activeTab.value = index
}

// 图片预览
interface ImagePreviews {
    shopAvatar: string;
    businessLicense: string;
    orgLogo: string;
    orgCert: string;
    familyPhoto: string;
}
const imagePreviews = ref<ImagePreviews>({
    shopAvatar: '',
    businessLicense: '',
    orgLogo: '',
    orgCert: '',
    familyPhoto: ''
})

// 文件上传处理
const handleFileChange = (event: Event, type: keyof ImagePreviews) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        const file = input.files[0]

        // 格式验证
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            alert('请上传JPG或PNG格式的图片')
            input.value = ''
            return
        }

        // 大小验证
        if (file.size > 5 * 1024 * 1024) {
            alert('文件大小不能超过5MB')
            input.value = ''
            return
        }

        // 生成预览
        const reader = new FileReader()
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
                imagePreviews.value[type] = e.target.result as string
            }
        }
        reader.readAsDataURL(file)
    }
}

// 表单数据
const form = reactive({
    // 商家表单
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

    // 机构表单
    orgName: '',
    orgType: '',
    orgContactName: '',
    orgContactPhone: '',
    orgContactEmail: '',
    orgAddress: '',
    orgDescription: '',

    // 家庭表单
    familyName: '',
    petType: '',
    familyContactName: '',
    familyContactPhone: '',
    familyAddress: '',
    maxPetCount: 1,
    hasPetExperience: '',
    familyDescription: ''
})

// 地区数据
interface Province {
    id: number;
    name: string;
    city: City[];
}
interface City {
    id: number;
    name: string;
    district: string[];
}
const provinceList = ref<Province[]>([
    { id: 1, name: '北京市', city: [{ id: 101, name: '北京市', district: ['东城区', '西城区', '海淀区', '朝阳区'] }] },
    { id: 2, name: '上海市', city: [{ id: 201, name: '上海市', district: ['黄浦区', '浦东新区', '静安区', '徐汇区'] }] },
    { id: 3, name: '天津市', city: [{ id: 301, name: '天津市', district: ['和平区', '南开区', '东丽区'] }] },
    { id: 4, name: '重庆市', city: [{ id: 401, name: '重庆市', district: ['江北区', '九龙坡区', '渝北区'] }] },
    {
        id: 5, name: '河北省', city: [
            { id: 501, name: '石家庄市', district: ['长安区', '桥西区', '裕华区'] },
            { id: 502, name: '唐山市', district: ['路南区', '路北区', '丰南区'] }
        ]
    },
    {
        id: 6, name: '山西省', city: [
            { id: 601, name: '太原市', district: ['小店区', '迎泽区', '杏花岭区'] },
            { id: 602, name: '大同市', district: ['平城区', '云冈区', '新荣区'] }
        ]
    }
])

const cityList = ref<City[]>([])
const districtList = ref<string[]>([])

// 省份选择
const handleProvinceChange = () => {
    form.city = ''
    form.district = ''
    const currentProv = provinceList.value.find(p => p.name === form.province)
    if (currentProv) {
        cityList.value = currentProv.city
    } else {
        cityList.value = []
    }
}

// 城市选择
const handleCityChange = () => {
    form.district = ''
    const currentProv = provinceList.value.find(p => p.name === form.province)
    if (currentProv) {
        const currentCity = currentProv.city.find(c => c.name === form.city)
        if (currentCity) {
            districtList.value = currentCity.district
        } else {
            districtList.value = []
        }
    } else {
        districtList.value = []
    }
}

// 表单提交
const submitForm = () => {
    // 基础验证
    if (activeTab.value === 0) {
        // 商家表单验证
        if (!form.shopName || !form.shopType || !form.contactName || !form.contactPhone || !form.contactEmail || !form.province || !form.city || !form.district || !form.address || !form.description) {
            alert('请填写完整商家信息！')
            return
        }
        if (!imagePreviews.value.shopAvatar || !imagePreviews.value.businessLicense) {
            alert('请上传商铺头像和营业执照！')
            return
        }
    } else if (activeTab.value === 1) {
        // 机构表单验证
        if (!form.orgName || !form.orgType || !form.orgContactName || !form.orgContactPhone || !form.orgContactEmail || !form.orgAddress || !form.orgDescription) {
            alert('请填写完整机构信息！')
            return
        }
        if (!imagePreviews.value.orgLogo || !imagePreviews.value.orgCert) {
            alert('请上传机构logo和资质证书！')
            return
        }
    } else if (activeTab.value === 2) {
        // 家庭表单验证
        if (!form.familyName || !form.petType || !form.familyContactName || !form.familyContactPhone || !form.familyAddress || !form.hasPetExperience || !form.familyDescription) {
            alert('请填写完整家庭信息！')
            return
        }
        if (!imagePreviews.value.familyPhoto) {
            alert('请上传家庭环境照片！')
            return
        }
    }

    // 构建表单数据
    const formData = new FormData()
    formData.append('type', activeTab.value.toString())
    formData.append('userId', localStorage.getItem('userId') || '')

    // 根据类型添加数据
    if (activeTab.value === 0) {
        // 商家数据
        formData.append('shopName', form.shopName)
        formData.append('shopType', form.shopType)
        formData.append('contactName', form.contactName)
        formData.append('contactPhone', form.contactPhone)
        formData.append('contactEmail', form.contactEmail)
        formData.append('province', form.province)
        formData.append('city', form.city)
        formData.append('district', form.district)
        formData.append('address', form.address)
        formData.append('description', form.description)

        // 文件
        const shopAvatarInput = document.getElementById('shop-avatar-file') as HTMLInputElement
        const businessLicenseInput = document.getElementById('business-license-file') as HTMLInputElement
        if (shopAvatarInput.files && shopAvatarInput.files[0]) {
            formData.append('shopAvatar', shopAvatarInput.files[0])
        }
        if (businessLicenseInput.files && businessLicenseInput.files[0]) {
            formData.append('businessLicense', businessLicenseInput.files[0])
        }
    } else if (activeTab.value === 1) {
        // 机构数据
        formData.append('orgName', form.orgName)
        formData.append('orgType', form.orgType)
        formData.append('orgContactName', form.orgContactName)
        formData.append('orgContactPhone', form.orgContactPhone)
        formData.append('orgContactEmail', form.orgContactEmail)
        formData.append('orgAddress', form.orgAddress)
        formData.append('orgDescription', form.orgDescription)

        // 文件
        const orgLogoInput = document.getElementById('org-logo-file') as HTMLInputElement
        const orgCertInput = document.getElementById('org-cert-file') as HTMLInputElement
        if (orgLogoInput.files && orgLogoInput.files[0]) {
            formData.append('orgLogo', orgLogoInput.files[0])
        }
        if (orgCertInput.files && orgCertInput.files[0]) {
            formData.append('orgCert', orgCertInput.files[0])
        }
    } else if (activeTab.value === 2) {
        // 家庭数据
        formData.append('familyName', form.familyName)
        formData.append('petType', form.petType)
        formData.append('familyContactName', form.familyContactName)
        formData.append('familyContactPhone', form.familyContactPhone)
        formData.append('familyAddress', form.familyAddress)
        formData.append('maxPetCount', form.maxPetCount.toString())
        formData.append('hasPetExperience', form.hasPetExperience)
        formData.append('familyDescription', form.familyDescription)

        // 文件
        const familyPhotoInput = document.getElementById('family-photo-file') as HTMLInputElement
        if (familyPhotoInput.files && familyPhotoInput.files[0]) {
            formData.append('familyPhoto', familyPhotoInput.files[0])
        }
    }

    // 提交请求
    axios({
        url: '/server/api/partner/apply',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            alert('申请提交成功！我们将尽快审核')
            console.log('提交成功', response.data)
            // 重置表单
            Object.keys(form).forEach(key => {
                if (key === 'maxPetCount') {
                    form[key] = 1
                } else {
                    // form[key] = ''
                }
            })
            Object.keys(imagePreviews.value).forEach(key => {
                imagePreviews.value[key as keyof ImagePreviews] = ''
            })
        })
        .catch(error => {
            console.error('提交失败', error)
            alert('提交失败，请稍后重试')
        })
}
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #c7d2fe;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a5b4fc;
}

/* 选项卡样式优化 */
button:hover {
    background-color: #faf5ff;
}

/* 输入框焦点效果 */
input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.2);
}

/* 卡片悬浮效果 */
.border-dashed:hover {
    transform: translateY(-2px);
}

/* 动画效果 */
.transition-all {
    transition: all 0.3s ease;
}
</style>