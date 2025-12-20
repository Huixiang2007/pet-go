<!-- src/components/foster/BookingStep4Pay.vue -->
<template>
    <el-card shadow="hover" class="info-card">
        <template #header>
            <div class="card-header">
                <h3>确认支付</h3>
                <span class="step-subtitle">请核对信息并完成支付</span>
            </div>
        </template>

        <!-- 订单信息摘要 -->
        <div class="payment-summary">
            <div class="summary-item">
                <span class="summary-label">订单编号：</span>
                <span class="summary-value">{{ orderNo }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">应付金额：</span>
                <span class="summary-value total-amount">¥{{ calculateTotalPrice }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">账户余额：</span>
                <span class="summary-value" :class="{ 'balance-warning': userBalance < calculateTotalPrice }">
                    ¥{{ userBalance }}
                    <el-tooltip v-if="userBalance < calculateTotalPrice" content="余额不足，请充值" placement="top">
                        <el-icon class="balance-icon">
                            <Warning />
                        </el-icon>
                    </el-tooltip>
                </span>
            </div>
        </div>

        <!-- 支付方式 -->
        <div class="payment-methods">
            <h4>
                <el-icon color="#409eff">
                    <Wallet />
                </el-icon>
                支付方式
            </h4>
            <div class="payment-option balance-payment">
                <el-icon color="#67c23a">
                    <Money />
                </el-icon>
                <span>余额支付</span>
                <span class="payment-tip">将从您的充值余额中扣除 ¥{{ calculateTotalPrice }}</span>
            </div>
        </div>

        <!-- 服务协议 -->
        <div class="service-agreement">
            <el-checkbox v-model="localAgreedToTerms"
                :class="{ 'checkbox-error': !localAgreedToTerms && isStepValidated }">
                我已阅读并同意
                <el-link type="primary" @click="changeShowAgreement">《宠物寄养服务协议》</el-link>
            </el-checkbox>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Wallet, Money, Warning } from '@element-plus/icons-vue'

// Props
const props = defineProps<{
    orderNo: number
    userBalance: number
    calculateTotalPrice: number
    isStepValidated: boolean
    showAgreement: boolean
    agreedToTerms: boolean
}>()
console.log(props)
const emit = defineEmits<{
    'update:showAgreement': [value: boolean]  // 更新弹窗显示状态
    'update:agreedToTerms': [value: boolean] // 更新协议勾选状态
}>()
const localAgreedToTerms = ref(props.agreedToTerms)
const changeShowAgreement = () => {
    const newShowAgreement = !props.showAgreement
    emit('update:showAgreement', newShowAgreement)
}
</script>

<style scoped lang="scss">
.payment-summary {
    margin-bottom: 24px;

    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
            border-bottom: none;
        }

        .summary-label {
            color: #475569;
            font-size: 14px;
        }

        .summary-value {
            color: #1e293b;
            font-size: 14px;
            font-weight: 500;

            &.total-amount {
                color: #409eff;
                font-size: 18px;
            }

            &.balance-warning {
                color: #ef4444;
            }

            .balance-icon {
                margin-left: 8px;
                font-size: 14px;
            }
        }
    }
}

.payment-methods {
    margin-bottom: 24px;

    h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px 0;
        color: #1f2937;
        font-size: 16px;
    }

    .payment-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background-color: #f8fafc;
        border-radius: 8px;
        width: 100%;
        max-width: 300px;
        font-size: 15px;
        color: #1e293b;
        transition: all 0.2s ease;

        &:hover {
            background-color: #f0f9ff;
        }

        .payment-tip {
            margin-left: 8px;
            font-size: 12px;
            color: #64748b;
        }
    }
}

.service-agreement {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
    text-align: left;

    :deep(.el-checkbox) {
        font-size: 14px;
        color: #475569;
    }

    :deep(.el-link) {
        color: #409eff;

        &:hover {
            color: #2563eb;
        }
    }

    .checkbox-error {
        :deep(.el-checkbox__input.is-error .el-checkbox__inner) {
            border-color: #ef4444;
        }
    }
}
</style>