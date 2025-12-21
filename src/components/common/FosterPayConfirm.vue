<template>
    <el-dialog v-model="showPayConfirmDialog" title="确认支付" class="custom-dialog" width="500px"
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
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{

    orderNo: number,
    calculateTotalPrice: number
    userBalance: number
    modelValue: boolean
}>()
console.log(props)
const emit = defineEmits<{
    'go-to-recharge': []
    'update:modelValue': [value: boolean],
    'pay-success': []

}>()
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