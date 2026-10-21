<template>
    <el-dialog v-model="visible" title="申请退款" width="400px" :before-close="handleClose">
        <div v-if="order" class="refund-form">
            <p class="text-gray-700 mb-4">
                您正在申请订单 <span class="font-medium text-blue-500">{{ order.orderNo }}</span> 的退款，
                退款金额：¥{{ order.totalAmount }}
            </p>
            <el-form :model="refundForm" label-width="80px" ref="formRef">
                <el-form-item label="退款原因" prop="reason" :rules="[{ required: true, message: '请选择退款原因' }]">
                    <el-select v-model="refundForm.reason" placeholder="请选择退款原因">
                        <el-option label="行程变更" value="行程变更"></el-option>
                        <el-option label="找到其他寄养家庭" value="找到其他寄养家庭"></el-option>
                        <el-option label="宠物健康问题" value="宠物健康问题"></el-option>
                        <el-option label="其他原因" value="其他原因"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="refundForm.remark" type="textarea" rows="3" placeholder="请填写详细说明（选填）"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="loading">
                提交申请
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FosterOrder } from '@/types/foster'

// Props（v-model 语法糖）
const props = defineProps<{
    modelValue: boolean
    order: FosterOrder | null
}>()

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'submit-refund': [refundForm: { reason: string; remark: string }]
}>()

// 弹窗显隐（v-model 适配）
const visible = ref(props.modelValue)
// 表单Ref
const formRef = ref<FormInstance>()
// 加载状态
const loading = ref(false)
// 退款表单
const refundForm = reactive({
    reason: '',
    remark: ''
})

// 监听v-model变化
watch(() => props.modelValue, (val) => {
    visible.value = val
    // 重置表单
    if (!val) {
        refundForm.reason = ''
        refundForm.remark = ''
        formRef.value?.resetFields()
    }
})

// 关闭弹窗
const handleClose = () => {
    emit('update:modelValue', false)
}

// 提交退款
const handleSubmit = () => {
    if (!formRef.value) return
    // 表单校验
    formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true
            // 触发父组件提交逻辑
            emit('submit-refund', { ...refundForm })
            loading.value = false
        }
    })
}
</script>

<style scoped lang="scss">
.refund-form {
    p {
        line-height: 1.6;
    }

    :deep(.el-form-item) {
        margin-bottom: 16px;
    }
}
</style>