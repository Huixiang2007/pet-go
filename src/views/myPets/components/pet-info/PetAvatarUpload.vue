<template>
    <div class="flex items-center mb-8">
        <h3 class="text-2xl font-bold text-rose-800 flex items-center">
            <span
                class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg mr-3">
                <el-icon class="text-rose-500">
                    <User />
                </el-icon>
            </span>
            基本信息
        </h3>
    </div>
    <el-form-item label="宠物头像" prop="avatar" class="lg:col-span-2">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
            <el-upload class="avatar-uploader rounded-full" :show-file-list="false" :before-upload="beforeAvatarUpload"
                :http-request="handleAvatarUpload" @mouseenter="showUploadTip = true"
                @mouseleave="showUploadTip = false" :disabled="uploadLoading">
                <div class="relative group">
                    <div v-if="avatar"
                        class="relative w-[168px] h-[169px] border-4 rounded-full border-pink-100 group-hover:border-pink-300 transition-all duration-400 shadow-lg">
                        <img :src="avatar" class="avatar" />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 duration-300 flex items-end justify-center pb-4">
                            <span class="text-white text-sm bg-black/40 px-3 py-1 rounded-full">更换头像</span>
                        </div>
                    </div>
                    <div v-else class="avatar-uploader-placeholder transition-all duration-400 shadow-md">
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                        <div class="mt-3 text-sm text-rose-500 font-medium">
                            {{ uploadLoading ? '上传中...' : '点击上传' }}
                        </div>
                        <div class="mt-1 text-xs text-rose-400">支持 JPG/PNG</div>
                    </div>
                </div>
            </el-upload>
            <transition name="slide-fade">
                <div v-if="showUploadTip"
                    class="bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-rose-300 rounded-r-lg p-5 max-w-md shadow-sm">
                    <div class="flex items-start space-x-3">
                        <div>
                            <p class="text-rose-700 font-medium mb-1">上传建议</p>
                            <p class="text-rose-600 text-sm leading-relaxed">
                                建议上传清晰的宠物照片，JPG或PNG格式，
                                文件大小不超过5MB，展现宠物最可爱的一面！
                            </p>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </el-form-item>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, User } from '@element-plus/icons-vue'
import request from '@/utils/request'

const props = defineProps<{
    avatar: string

}>()
console.log(props.avatar, props)
const emit = defineEmits([
    'upload-success',
    'upload-fail'
])

// 状态
const showUploadTip = ref(false)
const uploadLoading = ref(false)

// 上传前校验
const beforeAvatarUpload = (file: File) => {
    const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isJPGOrPNG) {
        ElMessage.error('头像必须是 JPG、PNG 或 GIF 格式!')
        return false
    }
    if (!isLt5M) {
        ElMessage.error('头像大小不能超过 5MB!')
        return false
    }
    return true
}

// 处理文件上传
interface FileOptions { file: File }
const handleAvatarUpload = async (options: FileOptions) => {
    const file = options.file
    uploadLoading.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await request('/server/api/file/upload', 'POST', formData)
        if (response.code === 0) {
            emit('upload-success', response.data)
        } else {
            emit('upload-fail')
        }
    } catch (error) {
        console.error(error)
        emit('upload-fail')
    } finally {
        uploadLoading.value = false
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader :deep(.el-upload) {
    border-radius: 20px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-uploader-placeholder {
    width: 160px;
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
    border-radius: 50%;
    border: 2px dashed #fbcfe8;
    transition: all 0.4s;

    &:hover {
        background: linear-gradient(135deg, #fce7f3, #fee2e2);
        border-color: #f472b6;
    }
}

.avatar-uploader-icon {
    font-size: 48px;
    color: #f472b6;
    margin-bottom: 12px;
}

.avatar {
    width: 160px;
    height: 160px;
    display: block;
    object-fit: cover;
    border-radius: 50%;
}

/* 过渡动画 */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {

    .avatar-uploader-placeholder,
    .avatar {
        width: 140px;
        height: 140px;
    }
}
</style>