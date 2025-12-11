<template>
    <div class="mb-10">
        <!-- <div class="flex items-center mb-8">
            <h3 class="text-2xl font-bold text-rose-800 flex items-center">
                <span
                    class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg mr-3">
                    <el-icon class="text-rose-500">
                        <Heart />
                    </el-icon>
                </span>
                健康信息
            </h3>
        </div> -->

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <el-form-item label="健康状态" prop="healthStatus">
                <el-select v-model="formData.healthStatus" placeholder="选择健康状态" size="large"
                    class="w-full health-select" :teleported="false" :popper-append-to-body="false">
                    <el-option v-for="status in healthStatusOptions" :key="status.value" :label="status.label"
                        :value="status.value" :class="status.class">
                        <span class="flex items-center">
                            <span class="w-2 h-2 rounded-full mr-3" :class="status.indicatorClass"></span>
                            {{ status.label }}
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="绝育状态" prop="sterilization">
                <div class="flex items-center space-x-4">
                    <el-switch v-model="isSterilized" :active-text="isSterilized ? '已绝育' : '未绝育'" size="large"
                        class="custom-switch" :active-color="activeColor" inline-prompt :active-icon="Check"
                        :inactive-icon="Close" style="--el-switch-on-color: #f472b6" />
                </div>
            </el-form-item>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'

// 类型定义
interface PetHealthForm {
    healthStatus: string
    sterilization: string
    [key: string]: any
}
interface HealthType {
    label: string
    value: string
    class: string
    indicatorClass: string
}
const props = defineProps<{
    healthInfo: PetHealthForm
    healthStatusOptions: HealthType[]
}>()

const emit = defineEmits(['update-healthInfo'])

const formData = reactive({ ...props.healthInfo })
const activeColor = '#f472b6'
const isSterilized = computed({
    get: () => formData.sterilization === '已绝育',
    set: (val) => {
        formData.sterilization = val ? '已绝育' : '未绝育'
    }
})

watch(formData, (newVal) => {
    emit('update-healthInfo', newVal)
}, { deep: true })
watch(() => props.healthInfo, (newVal) => {
    console.log(newVal)
    // Object.keys(formData).forEach(key => delete formData[key])
    Object.assign(formData, newVal)
    console.log(formData)
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped>
/* 健康状态下拉框 */
.health-select:deep(.el-select__wrapper) {
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    background: #ffffff;
}

.health-select:deep(.el-select__popper) {
    border-radius: 12px;
    border: 1px solid #fbcfe8;
    box-shadow: 0 10px 40px rgba(244, 114, 182, 0.15);
}

.health-select:deep(.el-select-dropdown__item) {
    border-radius: 8px;
    margin: 4px;

    &:hover {
        background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
    }
}

/* 开关样式 */
.custom-switch:deep(.el-switch__core) {
    border-radius: 12px;
    height: 28px;
}
</style>