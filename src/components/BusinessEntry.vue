<template>
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
                <!-- 商铺头像上传 -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        商铺头像 <span class="text-red-500">*</span>
                    </label>
                    <FileUpload :preview-image="imagePreviews.shopAvatar" accept="image/*"
                        @file-change="handleFileChange($event, 'shopAvatar')">
                        <template #default>
                            <i class="fa fa-cloud-upload text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传商铺头像</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </template>
                    </FileUpload>
                </div>

                <!-- 营业执照上传 -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        营业执照照片 <span class="text-red-500">*</span>
                    </label>
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

            <!-- 身份证正反面上传 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        身份证正面 <span class="text-red-500">*</span>
                    </label>
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

            <!-- 其他证件材料 -->
            <div class="space-y-2 mt-4">
                <label class="block text-sm font-medium text-gray-700">
                    其他证件材料（可选）
                </label>
                <FileUpload :preview-image="imagePreviews.otherDocs" accept="image/*"
                    @file-change="handleFileChange($event, 'otherDocs')">
                    <template #default>
                        <i class="fa fa-files-o text-4xl text-purple-500 mb-2"></i>
                        <span class="text-gray-600">点击上传其他相关证件（如行业资质、授权文件等）</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                </FileUpload>
            </div>
        </div>

        <!-- 地址信息 -->
        <div class="space-y-4">
            <div class="flex items-center border-b border-purple-100 pb-2">
                <i class="fa fa-map-marker text-purple-600 text-xl mr-3"></i>
                <h2 class="text-xl font-semibold text-gray-800">商铺地址信息</h2>
            </div>

            <!-- <RegionSelect v-model:province="form.province" v-model:city="form.city" v-model:district="form.district" /> -->

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

        <!-- 提交按钮 -->
        <div class="mt-8">
            <button
                class="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 active:from-purple-800 active:to-purple-700 transition-all shadow-md hover:shadow-lg"
                type="button" @click="submitForm">
                提交申请
            </button>
            <p class="text-center text-gray-500 text-sm mt-4">
                提交后将在1-3个工作日内审核，请保持电话畅通
            </p>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import axios from 'axios'
import FileUpload from '@/components/FileUpload.vue'
// import RegionSelect from './RegionSelect.vue'

const emit = defineEmits<{
    'submit-success': [data: any]
    'validation-error': [message: string]
}>()

// 图片预览
interface ImagePreviews {
    shopAvatar: string
    businessLicense: string
    idCardFront: string
    idCardBack: string
    otherDocs: string
}

const imagePreviews = reactive<ImagePreviews>({
    shopAvatar: '',
    businessLicense: '',
    idCardFront: '',
    idCardBack: '',
    otherDocs: ''
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
    description: ''
})

// 文件上传处理
const handleFileChange = (dataUrl: string, type: keyof ImagePreviews) => {
    imagePreviews[type] = dataUrl
}

// 表单验证
const validateForm = (): boolean => {
    // 基础信息验证
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
        { value: form.description, field: '商铺介绍' }
    ]

    for (const field of requiredFields) {
        if (!field.value) {
            emit('validation-error', `请填写${field.field}！`)
            return false
        }
    }

    // 文件验证
    const requiredFiles = [
        { value: imagePreviews.shopAvatar, field: '商铺头像' },
        { value: imagePreviews.businessLicense, field: '营业执照' },
        { value: imagePreviews.idCardFront, field: '身份证正面' },
        { value: imagePreviews.idCardBack, field: '身份证反面' }
    ]

    for (const file of requiredFiles) {
        if (!file.value) {
            emit('validation-error', `请上传${file.field}！`)
            return false
        }
    }

    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(form.contactPhone)) {
        emit('validation-error', '请输入正确的手机号码！')
        return false
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.contactEmail)) {
        emit('validation-error', '请输入正确的邮箱地址！')
        return false
    }

    return true
}

// 表单提交
const submitForm = async () => {
    if (!validateForm()) {
        return
    }

    const formData = new FormData()
    formData.append('type', 'business')
    formData.append('userId', localStorage.getItem('userId') || '')

    // 添加表单数据
    Object.keys(form).forEach(key => {
        formData.append(key, form[key as keyof typeof form])
    })

    // 添加文件数据（这里需要将base64转为File对象）
    const files = [
        { key: 'shopAvatar', preview: imagePreviews.shopAvatar },
        { key: 'businessLicense', preview: imagePreviews.businessLicense },
        { key: 'idCardFront', preview: imagePreviews.idCardFront },
        { key: 'idCardBack', preview: imagePreviews.idCardBack }
    ]

    for (const file of files) {
        if (file.preview) {
            const response = await fetch(file.preview)
            const blob = await response.blob()
            const fileObj = new File([blob], `${file.key}.jpg`, { type: 'image/jpeg' })
            formData.append(file.key, fileObj)
        }
    }

    try {
        const response = await axios({
            url: '/server/api/partner/apply',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        emit('submit-success', response.data)

        // 重置表单
        Object.keys(form).forEach(key => {
            if (key !== 'type') {
                form[key as keyof typeof form] = ''
            }
        })
        Object.keys(imagePreviews).forEach(key => {
            imagePreviews[key as keyof ImagePreviews] = ''
        })

    } catch (error) {
        console.error('提交失败', error)
        emit('validation-error', '提交失败，请稍后重试')
    }
}
</script>