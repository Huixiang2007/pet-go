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
                    <input type="text" v-model="form.name"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400"
                        placeholder="请输入家庭名称/昵称" required />
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
            <div class="space-y-2 mt-4">
                <label class="block text-sm font-medium text-gray-700">
                    机构资质证书（支持多张，最多6张）<span class="text-red-500">*</span>
                </label>

                <FileUpload ref="qualificationRef" accept="image/*,.pdf" :max-count="6"
                    accept-description="JPG、PNG、PDF格式"
                    @file-change="files => form.qualificationPhotos = files.map(f => f.url)" />
            </div>
        </div>


        <!-- 家庭环境照片 -->
        <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
                环境照片（支持多张，最多6张）<span class="text-red-500">*</span>
            </label>

            <FileUpload ref="environmentRef" accept="image/*" :max-count="6" accept-description="JPG、PNG格式"
                @file-change="files => form.environmentPhotos = files.map(f => f.url)" />
        </div>


        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="space-y-4">
                <div class="flex items-center border-b border-purple-100 pb-2">
                    <i class="fa fa-map-marker text-purple-600 text-xl mr-3"></i>
                    <h2 class="text-lg font-semibold text-gray-800">家庭地址</h2>
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
                    <h2 class="text-lg font-semibold text-gray-800">寄养说明</h2>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        寄样说明 <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="form.description"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none placeholder:text-gray-400 resize-y min-h-[120px]"
                        placeholder="请输入寄样说明" required></textarea>
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
import { reactive, ref } from 'vue'
import request from '@/utils/request'
import FileUpload from '@/components/FileUpload.vue'
import { ElMessage } from 'element-plus'
import provincesData from 'china-division/dist/provinces.json';
import citiesData from 'china-division/dist/cities.json';
import districtsData from 'china-division/dist/areas.json';

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
    providerType: '个人',
    name: '',
    description: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    cover: '',
    petTypes: [],
    qualificationPhotos: [],
    environmentPhotos: []
})
const qualificationRef = ref<any>(null) //eslint-disable-line @typescript-eslint/no-explicit-any
const environmentRef = ref<any>(null) //eslint-disable-line @typescript-eslint/no-explicit-any

// 修复地址同步逻辑
interface Area {
    code: string;
    name: string;
}

interface City extends Area {
    provinceCode: string;
}

interface District extends Area {
    cityCode: string;
}

// 获取省份名称
const getProvinceName = (provinceCode: string) => {
    const province = (provincesData as Area[]).find(p => p.code === provinceCode)
    return province ? province.name : provinceCode
}

// 获取城市名称
const getCityName = (cityCode: string) => {
    const city = (citiesData as City[]).find(c => c.code === cityCode)
    return city ? city.name : cityCode
}

// 获取区县名称
const getDistrictName = (districtCode: string) => {
    const district = (districtsData as District[]).find(d => d.code === districtCode)
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
        { value: form.name, field: '家庭名称' },
        { value: form.petTypes.length > 0, field: '可接待宠物类型' },
        { value: form.province, field: '省份' },
        { value: form.city, field: '城市' },
        { value: form.district, field: '区域' },
        { value: form.detailAddress, field: '详细地址' },
        { value: form.description, field: '寄养说明' }
    ]

    for (const field of requiredFields) {
        if (!field.value) {

            ElMessage({
                message: `请填写${field.field}！`,
                type: 'error',
                duration: 3000
            })

            return false
        }
    }

    // 验证文件上传
    if (form.qualificationPhotos.length === 0) {
        ElMessage.error('请至少上传1张资质证书！')

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
        environmentPhotos: form.environmentPhotos.join(',')
    }
    try {
        const response = await request(
            '/server/api/foster/provider/add',
            'POST',
            submitData
        )
        console.log('提交成功', response)
        if (response.code === 0) {
            ElMessage({
                message: '提交成功！我们将在1-3个工作日内审核',
                type: 'success',
                duration: 3000
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