<template>
    <div class="file-upload-container border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer"
        :class="{ 'has-preview': hasPreview }" @dragover.prevent="handleDragOver"
        @dragleave.prevent="isDragOver = false" @drop.prevent="handleDrop">
        <input type="file" :id="inputId" class="hidden" :accept="accept" :multiple="multiple" @change="handleFileInput"
            ref="fileInput" />

        <label :for="inputId" class="cursor-pointer flex flex-col items-center justify-center">
            <div v-if="hasPreview" class="preview-container mb-3">
                <img v-if="isImage" :src="previewUrl" :alt="fileName"
                    class="max-w-full max-h-44 object-contain rounded-lg shadow-sm" />
                <div v-else class="file-preview bg-purple-100 p-4 rounded-lg">
                    <i class="fa fa-file text-3xl text-purple-500 mb-2"></i>
                    <p class="text-sm text-gray-700 truncate">{{ fileName }}</p>
                </div>
                <div class="preview-actions mt-2">
                    <!-- <button type="button" class="text-xs text-purple-600 hover:text-purple-800 mr-3"
                        @click.stop="$refs.fileInput.click()">
                        更换
                    </button> -->
                    <button type="button" class="text-xs text-red-500 hover:text-red-700" @click.stop="removeFile">
                        删除
                    </button>
                </div>
            </div>

            <div v-else class="upload-placeholder">
                <slot name="default">
                    <i class="fa fa-cloud-upload text-4xl text-purple-500 mb-2"></i>
                    <span class="text-gray-600">点击上传或拖拽文件到此处</span>
                    <p class="text-xs text-gray-400 mt-1">
                        支持{{ acceptDescription || 'JPG、PNG格式' }}，大小不超过{{ maxSizeMB }}MB
                    </p>
                </slot>
            </div>
        </label>

        <!-- 拖拽提示 -->
        <div v-if="isDragOver"
            class="drag-overlay absolute inset-0 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center">
            <div class="text-white text-center">
                <i class="fa fa-cloud-upload text-3xl mb-2"></i>
                <p>松开上传文件</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
    accept?: string // 接受的文件类型，如 "image/*"
    maxSizeMB?: number // 最大文件大小（MB）
    multiple?: boolean // 是否允许多选
    previewImage?: string // 外部传入的预览图片（base64或URL）
    fileName?: string // 文件名
    acceptDescription?: string // 格式描述文本
    modelValue?: File | File[] | null // v-model支持
}

const props = withDefaults(defineProps<Props>(), {
    accept: 'image/*',
    maxSizeMB: 5,
    multiple: false,
    previewImage: '',
    fileName: '',
    acceptDescription: '',
    modelValue: null
})

const emit = defineEmits<{
    'file-change': [dataUrl: string, file: File]
    'file-remove': []
    'update:modelValue': [file: File | File[] | null]
}>()

// 响应式数据
const isDragOver = ref(false)
const internalPreviewUrl = ref('')
const internalFileName = ref('')
const fileInput = ref<HTMLInputElement>()
const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`

// 计算属性
const hasPreview = computed(() => {
    return !!props.previewImage || !!internalPreviewUrl.value
})

const previewUrl = computed(() => {
    return props.previewImage || internalPreviewUrl.value
})

const isImage = computed(() => {
    return props.accept.includes('image') || previewUrl.value?.startsWith('data:image')
})

// 方法
const handleDragOver = () => {
    isDragOver.value = true
}

const handleDrop = (event: DragEvent) => {
    isDragOver.value = false
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
        processFile(files[0]!)
    }
}

const handleFileInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        const file = props.multiple ? Array.from(input.files) : input.files[0]
        if (Array.isArray(file)) {
            // 处理多个文件
            const validFiles = file.filter(f => validateFile(f))
            if (validFiles.length > 0) {
                emit('update:modelValue', validFiles)
                // 只预览第一个文件
                processFile(validFiles[0]!)
            }
        } else {
            // if (validateFile(file)) {
            //     emit('update:modelValue', file)
            //     processFile(file)
            // }
        }
        input.value = '' // 重置input，允许重新选择相同文件
    }
}

const validateFile = (file: File): boolean => {
    // 大小验证
    if (file.size > props.maxSizeMB * 1024 * 1024) {
        alert(`文件大小不能超过${props.maxSizeMB}MB`)
        return false
    }

    // 类型验证
    if (props.accept !== '*/*') {
        const acceptTypes = props.accept.split(',').map(type => type.trim())
        const fileType = file.type.toLowerCase()
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

        const isValid = acceptTypes.some(type => {
            if (type === '*/*') return true
            if (type.endsWith('/*')) {
                const category = type.split('/')[0]
                return fileType.startsWith(category + '/')
            }
            return fileType === type || fileExtension === type
        })

        if (!isValid) {
            alert(`请上传${props.acceptDescription || '指定格式'}的文件`)
            return false
        }
    }

    return true
}

const processFile = (file: File) => {
    internalFileName.value = file.name

    // 如果是图片，生成预览
    if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
            internalPreviewUrl.value = e.target?.result as string
            emit('file-change', internalPreviewUrl.value, file)
        }
        reader.readAsDataURL(file)
    } else {
        // 非图片文件
        emit('file-change', '', file)
    }
}

const removeFile = () => {
    internalPreviewUrl.value = ''
    internalFileName.value = ''
    emit('file-remove')
    emit('update:modelValue', null)

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// 监听外部传入的预览图片
watch(() => props.previewImage, (newVal) => {
    if (newVal) {
        internalPreviewUrl.value = newVal
    }
})

// 初始化
onMounted(() => {
    if (props.previewImage) {
        internalPreviewUrl.value = props.previewImage
    }
    if (props.fileName) {
        internalFileName.value = props.fileName
    }
})
</script>

<style scoped>
.file-upload-container {
    position: relative;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-upload-container.has-preview {
    min-height: auto;
}

.drag-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        background-color: rgba(139, 92, 246, 0.2);
    }

    50% {
        background-color: rgba(139, 92, 246, 0.3);
    }
}

.preview-actions {
    opacity: 0;
    transition: opacity 0.2s;
}

.file-upload-container:hover .preview-actions {
    opacity: 1;
}

.file-preview {
    max-width: 200px;
    margin: 0 auto;
}
</style>