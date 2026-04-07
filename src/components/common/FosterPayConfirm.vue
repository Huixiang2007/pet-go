<template>
    <el-dialog v-model="showPayConfirmDialog" title="确认支付" class="custom-dialog" width="600px"
        :close-on-click-modal="false">
        <div class="pay-confirm-content">
            <div class="pay-info-item">
                <span class="info-label">订单编号：</span>
                <span class="info-value">{{ orderNo }}</span>
            </div>
            <div class="pay-info-item">
                <span class="info-label">应付金额：</span>
                <span class="info-value amount">{{ calculateTotalPrice }} 元</span>
            </div>
            <div class="pay-info-item">
                <span class="info-label">账户余额：</span>
                <span class="info-value" :class="{ 'text-red-500': userBalance < calculateTotalPrice }">
                    {{ userBalance }} 元
                    <span v-if="userBalance < calculateTotalPrice" class="balance-tip">（余额不足）</span>
                </span>
            </div>

            <!-- 疫苗图片预览 -->
            <div v-if="vaccineUrls && vaccineUrls.length > 0" class="vaccine-preview mt-4">
                <div class="preview-title">
                    <el-icon color="#409eff">
                        <Document />
                    </el-icon>
                    <span class="ml-2">疫苗本预览</span>
                </div>
                <div class="preview-list flex flex-wrap gap-3 mt-3">
                    <div v-for="(url, index) in vaccineUrls" :key="index"
                        class="preview-item relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                        <img :src="url" :alt="`疫苗本${index + 1}`"
                            class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            @click="previewImage(url)" />
                    </div>
                </div>
            </div>

            <div v-if="userBalance < calculateTotalPrice" class="recharge-tip">
                <el-icon class="tip-icon">
                    <Warning />
                </el-icon>
                <span>余额不足，是否前往充值？</span>
                <el-button type="primary" size="small" class="recharge-btn" @click="goToRecharge">立即充值</el-button>
            </div>
        </div>
        <template #footer>
            <el-button @click="showPayConfirmDialog = false">取消</el-button>
            <el-button type="primary" @click="handlePayConfirm" :disabled="userBalance < calculateTotalPrice">
                确认支付
            </el-button>
        </template>

        <!-- 图片预览弹窗 -->
        <el-dialog v-model="showImageDialog" title="疫苗本预览" width="80%" top="5vh">
            <img :src="previewImageUrl" class="w-full h-auto rounded-lg" />
        </el-dialog>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Document, Warning } from '@element-plus/icons-vue'

const props = defineProps<{
    orderNo: number,
    calculateTotalPrice: number
    userBalance: number
    modelValue: boolean
    vaccineUrls?: string[]
}>()

const emit = defineEmits<{
    'go-to-recharge': []
    'update:modelValue': [value: boolean],
    'pay-success': []
}>()

// 图片预览状态
const showImageDialog = ref(false)
const previewImageUrl = ref('')

const goToRecharge = () => {
    emit('go-to-recharge')
}

const showPayConfirmDialog = ref(props.modelValue)
watch(showPayConfirmDialog, (newVal) => {
    emit('update:modelValue', newVal)
})

const handlePayConfirm = () => {
    emit('pay-success')
}

// 预览图片
const previewImage = (url: string) => {
    previewImageUrl.value = url
    showImageDialog.value = true
}
</script>
<style scoped lang="scss">
// 支付确认弹窗
.pay-confirm-content {
    padding: 10px 0;

    :deep(.custom-dialog) {
        --el-dialog-margin-top: 22vh;

    }

    .pay-info-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
            border-bottom: none;
        }

        .info-label {
            font-size: 14px;
            color: #475569;
        }

        .info-value {
            font-size: 14px;
            font-weight: 500;

            &.amount {
                color: #409eff;
                font-size: 18px;
                font-weight: 600;
            }

            .balance-tip {
                margin-left: 8px;
                font-size: 12px;
                color: #ef4444;
            }
        }
    }

    // 疫苗图片预览
    .vaccine-preview {
        margin-top: 20px;
        padding: 16px;
        background-color: #f8fafc;
        border-radius: 8px;

        .preview-title {
            display: flex;
            align-items: center;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 12px;
        }

        .preview-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;

            .preview-item {
                width: 96px;
                height: 96px;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #e2e8f0;
                transition: all 0.2s ease;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    cursor: pointer;
                    transition: opacity 0.2s ease;

                    &:hover {
                        opacity: 0.9;
                    }
                }
            }
        }
    }

    .recharge-tip {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        padding: 12px;
        background-color: #fef2f2;
        border-radius: 8px;
        color: #ef4444;

        .tip-icon {
            font-size: 16px;
        }

        .recharge-btn {
            margin-left: auto;
        }
    }
}
</style>