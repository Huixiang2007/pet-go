<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div class="container mx-auto px-4 max-w-4xl">
            <!-- 顶部导航 -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-4">
                    <el-button icon="ArrowLeft" @click="goBack" class="border-none text-gray-600">
                        返回
                    </el-button>
                    <h1 class="text-3xl font-bold text-gray-800">添加新宠物</h1>
                </div>
            </div>

            <!-- 表单区域 -->
            <el-card class="shadow-xl rounded-2xl border-none">
                <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px" label-position="left"
                    class="p-6">
                    <!-- 基本信息 -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">基本信息</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- 头像上传 -->
                            <el-form-item label="宠物头像" prop="avatar" class="md:col-span-2">
                                <el-upload class="avatar-uploader" action="#" :show-file-list="false"
                                    :before-upload="beforeAvatarUpload" :http-request="handleAvatarUpload">
                                    <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </el-form-item>

                            <el-form-item label="昵称" prop="nickname">
                                <el-input v-model="formData.nickname" placeholder="请输入宠物昵称" size="large" />
                            </el-form-item>

                            <el-form-item label="品种" prop="breed">
                                <el-input v-model="formData.breed" placeholder="请输入宠物品种" size="large" />
                            </el-form-item>

                            <el-form-item label="生日" prop="birthday">
                                <el-date-picker v-model="formData.birthday" type="date" placeholder="选择生日" size="large"
                                    class="w-full" />
                            </el-form-item>

                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="formData.gender" size="large">
                                    <el-radio-button value="male">♂ 公</el-radio-button>
                                    <el-radio-button value="female">♀ 母</el-radio-button>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="体重" prop="weight">
                                <el-input-number v-model="formData.weight" :min="0" :max="100" :step="0.1"
                                    controls-position="right" size="large" class="w-full" />
                                <template #append>kg</template>
                            </el-form-item>

                            <el-form-item label="健康状态" prop="healthStatus">
                                <el-select v-model="formData.healthStatus" placeholder="请选择健康状态" size="large"
                                    class="w-full">
                                    <el-option label="健康" value="健康" />
                                    <el-option label="良好" value="良好" />
                                    <el-option label="注意" value="注意" />
                                    <el-option label="生病" value="生病" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="绝育状态" prop="neutered">
                                <el-switch v-model="formData.neutered" active-text="已绝育" inactive-text="未绝育"
                                    size="large" />
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 性格标签 -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">性格特点</h3>

                        <el-form-item label="性格标签">
                            <div class="flex flex-wrap gap-2 mb-4">
                                <el-tag v-for="tag in formData.personalityTags" :key="tag" closable
                                    @close="removeTag(tag)"
                                    class="bg-blue-50 text-blue-600 border-none rounded-full px-3 py-1">
                                    {{ tag }}
                                </el-tag>
                            </div>
                            <div class="flex gap-2">
                                <el-input v-model="newTag" placeholder="输入性格标签" size="large" @keyup.enter="addTag"
                                    class="flex-1" />
                                <el-button @click="addTag" size="large">添加</el-button>
                            </div>
                        </el-form-item>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="flex justify-center space-x-4 pt-6">
                        <el-button @click="goBack" size="large" class="px-8">
                            取消
                        </el-button>
                        <el-button type="primary" @click="submitForm" size="large"
                            class="px-8 bg-gradient-to-r from-blue-500 to-purple-500 border-none" :loading="loading">
                            添加宠物
                        </el-button>
                    </div>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ArrowLeft, Plus } from '@element-plus/icons-vue';
// import type { PetFormData } from '../types/pet';
interface PetFormData {
    nickname: string;
    breed: string;
    birthday: string;
    gender: 'male' | 'female';
    weight: number;
    avatar: string;
    personalityTags: string[];
    neutered: boolean;
    healthStatus: string;
}
const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const newTag = ref('');

// 表单数据
const formData = reactive<PetFormData>({
    nickname: '',
    breed: '',
    birthday: '',
    gender: 'male',
    weight: 0,
    avatar: '',
    personalityTags: [],
    neutered: false,
    healthStatus: '健康'
});

// 表单验证规则
const formRules: FormRules = {
    nickname: [
        { required: true, message: '请输入宠物昵称', trigger: 'blur' }
    ],
    breed: [
        { required: true, message: '请输入宠物品种', trigger: 'blur' }
    ],
    birthday: [
        { required: true, message: '请选择宠物生日', trigger: 'change' }
    ],
    weight: [
        { required: true, message: '请输入宠物体重', trigger: 'blur' }
    ]
};

// 添加标签
const addTag = () => {
    if (newTag.value.trim() && !formData.personalityTags.includes(newTag.value.trim())) {
        formData.personalityTags.push(newTag.value.trim());
        newTag.value = '';
    }
};

// 移除标签
const removeTag = (tag: string) => {
    const index = formData.personalityTags.indexOf(tag);
    if (index > -1) {
        formData.personalityTags.splice(index, 1);
    }
};

// 头像上传处理
const beforeAvatarUpload = (file: File) => {
    const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPGOrPNG) {
        ElMessage.error('头像必须是 JPG 或 PNG 格式!');
    }
    if (!isLt2M) {
        ElMessage.error('头像大小不能超过 2MB!');
    }
    return isJPGOrPNG && isLt2M;
};

const handleAvatarUpload = (options: any) => {
    // 模拟上传过程
    const file = options.file;
    const reader = new FileReader();
    reader.onload = (e) => {
        formData.avatar = e.target?.result as string;
        ElMessage.success('头像上传成功!');
    };
    reader.readAsDataURL(file);
};

// 提交表单
const submitForm = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();
        loading.value = true;

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 生成新宠物ID
        const newPetId = Date.now().toString();

        // 这里应该调用API保存数据
        ElMessage.success('宠物添加成功!');

        // 跳转到新宠物的详情页
        router.push(`/pet/${newPetId}`);
    } catch (error) {
        ElMessage.error('请完善表单信息!');
    } finally {
        loading.value = false;
    }
};

// 返回上一页
const goBack = () => {
    router.push('/');
};
</script>

<style scoped>
.avatar-uploader :deep(.el-upload) {
        border: 2px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.3s;

      
    }


.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
}

.avatar {
    width: 120px;
    height: 120px;
    display: block;
    object-fit: cover;
}
</style>