<template>
    <div class="mb-10">
        <div class="flex items-center mb-8">
            <h3 class="text-2xl font-bold text-rose-800 flex items-center">
                <span
                    class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg mr-3">
                    <el-icon class="text-rose-500">
                        <MagicStick />
                    </el-icon>
                </span>
                性格特点
            </h3>
        </div>

        <el-form-item class="space-y-6">
            <div class="space-y-6">
                <!-- 已选择标签 -->
                <div>
                    <div class="flex items-center mb-4">
                        <span class="text-rose-700 font-medium">已选择标签（{{ tags.length }}/8）</span>
                    </div>
                    <div
                        class="selected-tags-container min-h-20 p-4 rounded-xl bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-rose-100">
                        <transition-group name="list" tag="div" class="flex flex-wrap gap-3">
                            <div v-for="(tag, index) in tags" :key="index"
                                class="selected-tag inline-flex items-center px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden group"
                                @click="removeTag(tag)">
                                <span class="text-rose-700 font-medium text-sm">{{ tag }}</span>
                                <el-icon class="ml-2 text-rose-600  text-xs opacity-100">
                                    <Close />
                                </el-icon>
                            </div>
                            <div v-if="tags.length === 0"
                                class="text-rose-300 italic flex items-center h-20 w-full justify-center">
                                <el-icon class="mr-2">
                                    <Plus />
                                </el-icon>
                                还没有添加性格标签哦
                            </div>
                        </transition-group>
                    </div>
                </div>

                <!-- 推荐标签 -->
                <div>
                    <div class="flex items-center mb-4">
                        <el-icon class="text-rose-400 mr-2">
                            <Star />
                        </el-icon>
                        <span class="text-rose-700 font-medium">推荐标签</span>
                    </div>
                    <div class="recommended-tags grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        <div v-for="tag in defaultTags" :key="tag"
                            class="recommended-tag px-4 py-3 rounded-xl text-center cursor-pointer transition-all duration-300 flex items-center justify-center"
                            :class="{ 'recommended-tag-active': tags.includes(tag) }" @click="toggleDefaultTag(tag)">
                            {{ tag }}
                            <el-icon v-if="tags.includes(tag)" class="ml-1 text-xs">
                                <Check />
                            </el-icon>
                        </div>
                    </div>
                </div>

                <!-- 自定义标签 -->
                <div>
                    <div class="flex items-center mb-4">
                        <el-icon class="text-rose-400 mr-2">
                            <Edit />
                        </el-icon>
                        <span class="text-rose-700 font-medium">自定义标签</span>
                    </div>
                    <div class="flex gap-3">
                        <div class="flex-1 relative">
                            <el-input v-model="newTag" placeholder="输入自定义标签，不超过5个字" size="large" @keyup.enter="addTag"
                                class="custom-input" :maxlength="5" />
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-300 text-sm">
                                {{ 5 - newTag.length }}/5
                            </div>
                        </div>
                        <el-button @click="addTag" size="large"
                            class="addCharacter px-6 bg-gradient-to-r from-pink-400 to-rose-400 border-none  rounded-xl hover:shadow-lg  transition-all duration-300"
                            :disabled="!newTag.trim()">
                            <el-icon class="mr-1">
                                <Plus />
                            </el-icon>
                            添加
                        </el-button>
                    </div>
                </div>
            </div>
        </el-form-item>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick, Star, Edit, Plus, Close, Check } from '@element-plus/icons-vue'

const props = defineProps<{
    characterTags: string[]
    defaultTags: string[]
}>()
console.log(props.characterTags)
const emit = defineEmits(['update-tags'])

const newTag = ref('')
const tags = ref<string[]>(Array.isArray(props.characterTags) ? [...props.characterTags] : [])
watch(() => props.characterTags, (newVal) => {
    tags.value = Array.isArray(newVal) ? [...newVal] : []
}, { immediate: true, deep: true })
const toggleDefaultTag = (tag: string) => {
    const currentTags = [...tags.value]
    console.log('当前标签：', currentTags)
    console.log('添加标签:', tag)

    const index = currentTags.indexOf(tag)
    console.log(index)

    if (index > -1) {
        currentTags.splice(index, 1)
        ElMessage.info(`已移除标签：${tag}`)
    } else {
        if (currentTags.length >= 8) {
            ElMessage.warning('最多只能添加8个标签')
            return
        }
        currentTags.push(tag)
        ElMessage.success(`已添加标签：${tag}`)

    }
    console.log('添加后的标签组：', currentTags)
    tags.value = currentTags
    emit('update-tags', currentTags)


}
const addTag = () => {
    const tag = newTag.value.trim()
    if (!tag) return

    if (tags.value.includes(tag)) {
        ElMessage.warning('该标签已存在')
        return
    }
    if (tags.value.length >= 8) {
        ElMessage.warning('最多只能添加8个标签')
        return
    }
    if (tag.length > 5) {
        ElMessage.warning('标签长度不能超过5个字符')
        return
    }
    const currentTags = [...tags.value]
    currentTags.push(tag)
    tags.value = currentTags
    console.log(tags.value)
    emit('update-tags', currentTags)

    newTag.value = ''
    ElMessage.success('标签添加成功！')
}

// 移除标签
const removeTag = (tag: string) => {
    const currentTags = tags.value.filter(t => t !== tag)
    tags.value = currentTags
    emit('update-tags', currentTags)

    ElMessage.info(`已移除标签：${tag}`)
}


// watch(() => props.modelValue, (newVal) => {
//     newTags.value = [...newVal]
// }, { immediate: true, deep: true })
</script>

<style lang="scss" scoped>
.selected-tags-container {
    min-height: 80px;
}

.selected-tag {
    background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
    border: 1px solid #fbcfe8;

    &:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, #fce7f3, #fee2e2);
        border-color: #f472b6;
        box-shadow: 0 4px 12px rgba(244, 114, 182, 0.15);
    }
}

.recommended-tag {
    background: linear-gradient(135deg, #ffffff, #fafafa);
    border: 1px solid #f3f4f6;
    color: #6b7280;

    &:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, #fdf2f8, #fce7f3);
        border-color: #fbcfe8;
        color: #f472b6;
    }
}

.recommended-tag-active {
    background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
    border-color: #f472b6;
    color: #ec4899;
    box-shadow: 0 4px 12px rgba(244, 114, 182, 0.15);
}

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

/* 过渡动画 */
.list-move {
    transition: transform 0.3s ease;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

// .addCharacter :hover {
//     color: white;
// }</style>