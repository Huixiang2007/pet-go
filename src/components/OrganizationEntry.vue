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
                    <FileUpload :preview-image="imagePreviews.orgLogo" accept="image/*"
                        @file-change="handleFileChange($event, 'orgLogo')">
                        <template #default>
                            <i class="fa fa-picture-o text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传机构logo</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </template>
                    </FileUpload>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        机构资质证书 <span class="text-red-500">*</span>
                    </label>
                    <FileUpload :preview-image="imagePreviews.orgCert" accept="image/*"
                        @file-change="handleFileChange($event, 'orgCert')">
                        <template #default>
                            <i class="fa fa-file-text-o text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传资质证书</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </template>
                    </FileUpload>
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

            <!-- 身份证正反面上传 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        身份证正面 <span class="text-red-500">*</span>
                    </label>
                    <FileUpload :preview-image="imagePreviews.orgIdCardFront" accept="image/*"
                        @file-change="handleFileChange($event, 'orgIdCardFront')">
                        <template #default>
                            <i class="fa fa-id-card-o text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传负责人身份证正面</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </template>
                    </FileUpload>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        身份证反面 <span class="text-red-500">*</span>
                    </label>
                    <FileUpload :preview-image="imagePreviews.orgIdCardBack" accept="image/*"
                        @file-change="handleFileChange($event, 'orgIdCardBack')">
                        <template #default>
                            <i class="fa fa-id-card text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传负责人身份证反面</span>
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
                <FileUpload :preview-image="imagePreviews.orgOtherDocs" accept="image/*"
                    @file-change="handleFileChange($event, 'orgOtherDocs')">
                    <template #default>
                        <i class="fa fa-files-o text-4xl text-purple-500 mb-2"></i>
                        <span class="text-gray-600">点击上传其他相关证件（如消防许可证、卫生许可证等）</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                </FileUpload>
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

const emit = defineEmits<{
    'submit-success': [data: any]
    'validation-error': [message: string]
}>()

// 图片预览
interface ImagePreviews {
    orgLogo: string
    orgCert: string
    orgIdCardFront: string
    orgIdCardBack: string
    orgOtherDocs: string
}

const imagePreviews = reactive<ImagePreviews>({
    orgLogo: '',
    orgCert: '',
    orgIdCardFront: '',
    orgIdCardBack: '',
    orgOtherDocs: ''
})

// 表单数据
const form = reactive({
    orgName: '',
    orgType: '',
    orgContactName: '',
    orgContactPhone: '',
    orgContactEmail: '',
    orgAddress: '',
    orgDescription: ''
})

// 文件上传处理
const handleFileChange = (dataUrl: string, type: keyof ImagePreviews) => {
    imagePreviews[type] = dataUrl
}

// 表单验证
const validateForm = (): boolean => {
    const requiredFields = [
        { value: form.orgName, field: '机构名称' },
        { value: form.orgType, field: '机构类型' },
        { value: form.orgContactName, field: '负责人姓名' },
        { value: form.orgContactPhone, field: '负责人电话' },
        { value: form.orgContactEmail, field: '负责人邮箱' },
        { value: form.orgAddress, field: '机构地址' },
        { value: form.orgDescription, field: '机构介绍' }
    ]

    for (const field of requiredFields) {
        if (!field.value) {
            emit('validation-error', `请填写${field.field}！`)
            return false
        }
    }

    const requiredFiles = [
        { value: imagePreviews.orgLogo, field: '机构logo' },
        { value: imagePreviews.orgCert, field: '资质证书' },
        { value: imagePreviews.orgIdCardFront, field: '身份证正面' },
        { value: imagePreviews.orgIdCardBack, field: '身份证反面' }
    ]

    for (const file of requiredFiles) {
        if (!file.value) {
            emit('validation-error', `请上传${file.field}！`)
            return false
        }
    }

    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(form.orgContactPhone)) {
        emit('validation-error', '请输入正确的手机号码！')
        return false
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.orgContactEmail)) {
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
    formData.append('type', 'organization')
    formData.append('userId', localStorage.getItem('userId') || '')

    Object.keys(form).forEach(key => {
        formData.append(key, form[key as keyof typeof form])
    })

    const files = [
        { key: 'orgLogo', preview: imagePreviews.orgLogo },
        { key: 'orgCert', preview: imagePreviews.orgCert },
        { key: 'orgIdCardFront', preview: imagePreviews.orgIdCardFront },
        { key: 'orgIdCardBack', preview: imagePreviews.orgIdCardBack }
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

        Object.keys(form).forEach(key => {
            form[key as keyof typeof form] = ''
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