<template>
    <div class="mb-10">


        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 第一列 -->
            <div class="space-y-6">
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入宠物昵称" size="large" class="custom-input" />
                </el-form-item>
                <el-form-item label="种类" prop="type">
                    <el-select v-model="formData.type" placeholder="选择种类" class="custom-input">
                        <el-option v-for="animal in animalOptions" :key="animal.value" :label="animal.label"
                            :value="animal.label" />
                    </el-select>
                </el-form-item>
                <el-form-item label="品种" prop="breed">
                    <el-input v-model="formData.breed" placeholder="例如：布偶猫、金毛犬" size="large" class="custom-input" />
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker v-model="formData.birthday" type="date" placeholder="选择宠物的生日" size="large"
                        class="w-full custom-input" format="YYYY年MM月DD日" value-format="YYYY-MM-DD" placement="bottom"
                        force-popup-direction />
                </el-form-item>
            </div>

            <!-- 第二列 -->
            <div class="space-y-6">
                <el-form-item label="性别" prop="gender">
                    <div class="flex space-x-4">
                        <div class="flex-1" @click="formData.gender = '公'">
                            <div class="gender-card cursor-pointer rounded-2xl p-2 transition-all duration-300 border-2 border-transparent w-20"
                                :class="{ 'gender-card-male-active': formData.gender === '公' }">
                                <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300"
                                    :class="{
                                        'bg-gradient-to-br from-blue-400 to-cyan-400': formData.gender === '公',
                                        'bg-gradient-to-br from-blue-100 to-cyan-100': formData.gender !== '公',
                                    }">
                                    <el-icon class="text-white text-xl">
                                        <Male />
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1" @click="formData.gender = '母'">
                            <div class="gender-card cursor-pointer rounded-2xl p-2 transition-all duration-300 border-2 border-transparent w-20"
                                :class="{ 'gender-card-active': formData.gender === '母' }">
                                <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300"
                                    :class="{
                                        'bg-gradient-to-br from-pink-400 to-rose-400': formData.gender === '母',
                                        'bg-gradient-to-br from-pink-100 to-rose-100': formData.gender !== '母',
                                    }">
                                    <el-icon class="text-white text-xl">
                                        <Female />
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="体重" prop="weight">
                    <div class="flex items-center space-x-3">
                        <el-input-number v-model="formData.weight" :min="0" :max="100" :step="0.1"
                            controls-position="right" size="large" class="flex-1 custom-number" />
                        <span class="text-rose-600 font-medium min-w-[40px]">kg</span>
                    </div>
                </el-form-item>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Male, Female } from '@element-plus/icons-vue'

// 类型定义
interface PetBasicForm {
    name: string
    type: string
    breed: string
    gender: '公' | '母'
    birthday: string
    weight: number
    [key: string]: any
}

const props = defineProps<{
    basicInfo: PetBasicForm
    animalOptions: Array<{ label: string; value: string }>,

}>()


const emit = defineEmits(['update-basicInfo'])
console.log(props.basicInfo)
const formData = reactive({ ...props.basicInfo })
console.log(formData)
watch(formData, (newVal) => {
    emit('update-basicInfo', newVal)
}, { deep: true })

watch(() => props.basicInfo, (newVal) => {
    console.log(newVal)
    // Object.keys(formData).forEach(key => delete formData[key])
    Object.assign(formData, newVal)
    console.log(formData)
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped>
/* 性别卡片样式 */
.gender-card {
    background: linear-gradient(135deg, #ffffff, #fdf2f8);
    box-shadow: 0 4px 12px rgba(244, 114, 182, 0.08);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(244, 114, 182, 0.15);
    }
}

.gender-card-active {
    border-color: #f472b6;
    background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
    box-shadow: 0 8px 24px rgba(244, 114, 182, 0.2);
}

.gender-card-male-active {
    border-color: #7295f4;
    background: linear-gradient(135deg, #f2f6fd, #e4e6ff);
    box-shadow: 0 8px 24px rgba(114, 168, 244, 0.2);
}

/* 自定义输入框 */
.custom-input {
    border-radius: 12px;
    transition: all 0.3s;

    &:deep(.el-input__wrapper) {
        border-radius: 12px;
        border: 1px solid #f3f4f6;
        background: #ffffff;
        box-shadow: 0 2px 8px rgba(244, 114, 182, 0.05);
        transition: all 0.3s;

        &:hover,
        &.is-focus {
            border-color: #f472b6;
            box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1), 0 2px 12px rgba(244, 114, 182, 0.15);
        }
    }
}

.custom-number:deep(.el-input-number__decrease),
.custom-number:deep(.el-input-number__increase) {
    border-radius: 10px;
    background: #fdf2f8;
    border-color: #fbcfe8;
    color: #f472b6;
}

.custom-number:deep(.el-input__wrapper) {
    border-radius: 12px 0 0 12px;
}

/* 响应式 */
@media (max-width: 768px) {
    .gender-card {
        padding: 3rem 1rem;
    }
}
</style>