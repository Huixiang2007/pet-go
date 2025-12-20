<template>
    <div class="basic-info-wrapper">
        <!-- 基本信息卡片 -->
        <div class="cute-card p-6 bg-white mb-6">
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-4">
                        <h1 class="text-2xl font-bold text-blue-500">{{ fosterHome.name }}</h1>
                        <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            {{ fosterHome.providerType }}
                        </span>
                    </div>

                    <!-- 地址 -->
                    <div class="flex items-center mb-4 text-gray-600">
                        <i class="el-icon-location mr-2 text-blue-400"></i>
                        <span>{{ fosterHome.province }} {{ fosterHome.city }} {{ fosterHome.district }} {{
                            fosterHome.detailAddress }}</span>
                    </div>

                    <!-- 简介和联系方式 -->
                    <div class="mt-4">
                        <h3 class="text-lg font-semibold text-blue-500 mb-3">家庭简介</h3>
                        <p class="text-gray-700 leading-relaxed">{{ fosterHome.description }}</p>

                        <h3 class="text-lg font-semibold text-blue-500 mt-4 mb-3">联系方式</h3>
                        <p class="text-gray-700 leading-relaxed">{{ fosterHome.contactName }}</p>
                        <p class="text-gray-700 leading-relaxed">{{ fosterHome.contactPhone }}</p>

                        <button class="cute-btn bg-white text-blue-500 border border-blue-300 w-full mt-4">
                            <i class="el-icon-chat-dot-round mr-1"></i>在线咨询
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 环境图片展示 -->
        <div class="cute-card p-6 bg-white mb-6">
            <h2 class="text-xl font-bold text-blue-500 mb-4">环境展示</h2>
            <div v-if="!fosterHome.environmentPhotos || fosterHome.environmentPhotos.length === 0"
                class="text-center py-8 text-gray-500">
                暂无环境照片
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="(image, index) in fosterHome.environmentPhotos" :key="index"
                    class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all">
                    <img :src="image" :alt="`环境照片${index + 1}`"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        @click="showImagePreview(image)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FosterHomeDetail } from '@/types/foster'

// 定义Props
const props = defineProps<{
    fosterHome: FosterHomeDetail
}>()
console.log(props.fosterHome)
// 定义事件（图片预览）
const emit = defineEmits<{
    'preview-image': [image: string]
}>()

// 图片预览触发
const showImagePreview = (image: string) => {
    emit('preview-image', image)
}
</script>

<style scoped>
.basic-info-wrapper {
    width: 100%;
}
</style>