<template>
    <form class="space-y-8">
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
                <FileUpload :preview-image="imagePreviews.familyPhoto" accept="image/*"
                    @file-change="handleFileChange($event, 'familyPhoto')">
                    <template #default>
                        <i class="fa fa-camera text-4xl text-purple-500 mb-2"></i>
                        <span class="text-gray-600">点击上传家庭环境照片</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                </FileUpload>
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

            <!-- 身份证正反面上传 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        身份证正面 <span class="text-red-500">*</span>
                    </label>
                    <FileUpload :preview-image="imagePreviews.familyIdCardFront" accept="image/*"
                        @file-change="handleFileChange($event, 'familyIdCardFront')">
                        <template #default>
                            <i class="fa fa-id-card-o text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传户主身份证正面</span>
                            <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                        </template>
                    </FileUpload>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        身份证反面 <span class="text-red-500">*</span>
                    </label>
                    <FileUpload :preview-image="imagePreviews.familyIdCardBack" accept="image/*"
                        @file-change="handleFileChange($event, 'familyIdCardBack')">
                        <template #default>
                            <i class="fa fa-id-card text-4xl text-purple-500 mb-2"></i>
                            <span class="text-gray-600">点击上传户主身份证反面</span>
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
                <FileUpload :preview-image="imagePreviews.familyOtherDocs" accept="image/*"
                    @file-change="handleFileChange($event, 'familyOtherDocs')">
                    <template #default>
                        <i class="fa fa-files-o text-4xl text-purple-500 mb-2"></i>
                        <span class="text-gray-600">点击上传其他相关证件（如宠物疫苗证明、养宠经验证明等）</span>
                        <p class="text-xs text-gray-400 mt-1">支持JPG、PNG格式，大小不超过5MB</p>
                    </template>
                </FileUpload>
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
    familyPhoto: string
    familyIdCardFront: string
    familyIdCardBack: string
    familyOtherDocs: string
}

const imagePreviews = reactive<ImagePreviews>({
    familyPhoto: '',
    familyIdCardFront: '',
    familyIdCardBack: '',
    familyOtherDocs: ''
})

// 表单数据
const form = reactive({
    familyName: '',
    petType: '',
    familyContactName: '',
    familyContactPhone: '',
    familyAddress: '',
    maxPetCount: 1,
    hasPetExperience: '',
    familyDescription: ''
})

// 文件上传处理
const handleFileChange = (dataUrl: string, type: keyof ImagePreviews) => {
    imagePreviews[type] = dataUrl
}

// 表单验证
const validateForm = (): boolean => {
    const requiredFields = [
        { value: form.familyName, field: '家庭名称' },
        { value: form.petType, field: '可寄养宠物类型' },
        { value: form.familyContactName, field: '户主姓名' },
        { value: form.familyContactPhone, field: '联系电话' },
        { value: form.familyAddress, field: '居住地址' },
        { value: form.hasPetExperience, field: '养宠经验' },
        { value: form.familyDescription, field: '寄养说明' }
    ]

    for (const field of requiredFields) {
        if (!field.value) {
            emit('validation-error', `请填写${field.field}！`)
            return false
        }
    }

    const requiredFiles = [
        { value: imagePreviews.familyPhoto, field: '家庭环境照片' },
        { value: imagePreviews.familyIdCardFront, field: '身份证正面' },
        { value: imagePreviews.familyIdCardBack, field: '身份证反面' }
    ]

    for (const file of requiredFiles) {
        if (!file.value) {
            emit('validation-error', `请上传${file.field}！`)
            return false
        }
    }

    if (form.maxPetCount < 1) {
        emit('validation-error', '可寄养数量至少为1')
        return false
    }

    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(form.familyContactPhone)) {
        emit('validation-error', '请输入正确的手机号码！')
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
    formData.append('type', 'family')
    formData.append('userId', localStorage.getItem('userId') || '')

    Object.keys(form).forEach(key => {
        // formData.append(key, form[key as keyof typeof form])
    })

    const files = [
        { key: 'familyPhoto', preview: imagePreviews.familyPhoto },
        { key: 'familyIdCardFront', preview: imagePreviews.familyIdCardFront },
        { key: 'familyIdCardBack', preview: imagePreviews.familyIdCardBack }
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
            if (key !== 'maxPetCount') {
                // form[key as keyof typeof form] = ''
            }
        })
        form.maxPetCount = 1

        Object.keys(imagePreviews).forEach(key => {
            imagePreviews[key as keyof ImagePreviews] = ''
        })

    } catch (error) {
        console.error('提交失败', error)
        emit('validation-error', '提交失败，请稍后重试')
    }
}
</script>