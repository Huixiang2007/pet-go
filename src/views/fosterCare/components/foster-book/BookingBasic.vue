<template>
    <div class="step-basic-info">
        <el-card shadow="never" class="info-card">
            <template #header>
                <div class="card-header">
                    <h3>填写宠物基本信息</h3>
                </div>
            </template>
            <!-- 选择宠物 -->
            <div class="flex flex-col gap-2">
                <div class="section-title">
                    <i class="iconfont text-lg text-[#409eff]">&#xe90d;</i>
                    <strong class="ml-2 text-lg">选择寄养宠物</strong>
                </div>
                <el-select v-model="bookingForm.petName" placeholder="选择宠物" @change="onPetChange">
                    <el-option v-for="item in myPets" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
            </div>
            <!-- 选择种类 -->
            <div class="flex flex-col gap-2 mt-5">
                <div class="section-title">
                    <i class="iconfont text-lg text-[#409eff]">&#xe90d;</i>
                    <strong class="ml-2 text-lg">选择宠物类别</strong>
                </div>
                <el-select v-model="bookingForm.petType" placeholder="选择宠物类别">
                    <el-option v-for="item in petTypeOptions" :key="item.id" :label="item.type" :value="item.type" />
                </el-select>
            </div>
            <!-- 附加服务选择 -->
            <div class="section mt-6">
                <div class="section-title text-lg">
                    <el-icon color="#409eff">
                        <Service />
                    </el-icon>
                    <span>选择附加服务</span>
                </div>
                <div v-if="bookingForm.additionalServices == null" class="text-center py-4 text-gray-500">
                    暂无可用附加服务
                </div>

                <div v-else class="additional-services-list">
                    <el-checkbox-group v-model="bookingForm.additionalServiceId" @change="handleServiceChange">
                        <div v-for="service in bookingForm.additionalServices" :key="service.id" class="service-item">
                            <el-checkbox :label="service.id" class="service-checkbox">
                                <div class="service-info">
                                    <span class="service-title">{{ service.title }}</span>
                                    <span class="service-price">¥{{ service.price }}</span>
                                </div>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>

                    <!-- 附加服务费用预览 -->
                    <div class="additional-fee-preview mt-4">
                        <span class="preview-label">附加服务费用：</span>
                        <span class="preview-value">¥{{ additionalServiceTotalFee }}（总计）</span>
                    </div>
                </div>
            </div>
            <!-- 填写特殊要求 -->
            <div class="section mt-6">
                <div class="section-title text-lg">
                    <el-icon color="#409eff">
                        <ChatDotRound />
                    </el-icon>
                    <span>备注</span>
                </div>
                <el-input v-model="bookingForm.specialRequirements" maxlength="100" show-word-limit
                    style="width: 100%; min-width: 500px" type="textarea" resize="none"
                    placeholder="请填写宠物的特殊要求，比如宠物的疾病、过敏史、特殊需求等" />
            </div>
            <!-- 联系电话 -->
            <div class="section mt-6">
                <div class="section-title text-lg">
                    <i class="iconfont">&#xe64d;</i>
                    <span>联系电话</span>
                </div>
                <el-input v-model="bookingForm.emergencyPhone" maxlength="11" show-word-limit style="width: 100%;"
                    resize="none" placeholder="请填写联系电话，方便沟通"
                    :class="{ 'input-error': !isPhoneValid && bookingForm.emergencyPhone }" />
                <div v-if="!isPhoneValid && bookingForm.emergencyPhone" class="text-red-500 text-sm mt-1">
                    请填写有效的11位手机号码
                </div>
            </div>
            <!-- 上传疫苗本 -->
            <div class="section">
                <div class="section-title">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>上传疫苗本</span>
                    <el-tooltip content="请上传宠物的疫苗接种记录" placement="top"> </el-tooltip>
                </div>
                <el-form-item prop="vaccineFiles">
                    <FileUpload ref="vaccineUploadRef" :accept="'.jpg,.jpeg,.png,.pdf'" :max-size-mb=5
                        :chunk-threshold=5 accept-description="JPG、PNG、PDF格式" @file-change="handleVaccineChange"
                        class="w-full" />

                </el-form-item>

            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { computed, } from 'vue'
import { Service, ChatDotRound, Document } from '@element-plus/icons-vue'
import FileUpload from '@/components/common/FileUpload.vue'
// import { ElMessage } from 'element-plus'

import { useBookingForm } from '@/composables/foster/use-booking-form'
import { usePriceCalculator } from '@/composables/foster/use-price-cal'
import { useBookingPackageStore, useBookingFormStore } from '@/stores/booking'
import type { FileItem } from '@/types/upload'

const bookingStore = useBookingPackageStore()
const bookingFormStore = useBookingFormStore()
const bookingForm = bookingFormStore.bookingForm
const selectedPackage = computed(() => bookingStore.selectedPackage)
const {
    myPets,
    petTypeOptions,
    isPhoneValid,
    onPetChange } = useBookingForm()
const calculateStayDays = () => 0
const {
    additionalServiceTotalFee
} = usePriceCalculator(selectedPackage, calculateStayDays)

const handleServiceChange = (ids: number[]) => {
    bookingForm.additionalServiceId = ids
}

const handleVaccineChange = (files: FileItem[]) => {
    // 存储文件对象用于上传
    bookingForm.pictureUrlList = files.map(item => item.file as File)
    // 同时存储 URL 用于预览
    bookingForm.vaccineUrls = files.map(item => item.url)
    console.log('疫苗文件已存入 bookingForm：', bookingForm.pictureUrlList)
    console.log('疫苗文件 URL 已存入 bookingForm：', bookingForm.vaccineUrls)

}


</script>
<style scoped lang="scss">
.step-basic-info {
    .section {
        margin-bottom: 32px;

        &:last-child {
            margin-bottom: 0;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            font-weight: 600;
            color: #1f2937;
            font-size: 16px;

            i {
                color: #409EFF;
            }
        }
    }

    .input-error {
        :deep(.el-input__wrapper) {
            border-color: #ef4444;
            box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
        }
    }

    .additional-services-list {
        .service-item {
            margin-bottom: 12px;
        }

        .service-info {
            display: flex;
            justify-content: space-between;
            width: 100%;
            gap: 5px;
        }

        .service-title {
            font-size: 14px;
        }

        .service-price {
            color: #409eff;
            font-weight: 500;
        }
    }

    .additional-fee-preview {
        padding: 8px 12px;
        background: #f0f9ff;
        border-radius: 4px;
        margin-top: 16px;

        .preview-label {
            color: #475569;
        }

        .preview-value {
            color: #409eff;
            font-weight: 500;
            margin-left: 8px;
        }
    }
}
</style>