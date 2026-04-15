<template>
    <div class="basic-info-wrapper">
        <!-- 基本信息卡片 -->
        <div class="cute-card p-6 bg-white mb-6">
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-6">
                        <h1 class="text-2xl font-bold text-blue-500">{{ fosterHome.name }}</h1>
                        <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            {{ fosterHome.providerType }}
                        </span>
                    </div>

                    <!-- 地址 -->
                    <div class="flex items-center mb-6 text-gray-600 p-4 bg-blue-50 rounded-lg">
                        <i class="el-icon-location mr-3 text-blue-500 text-xl"></i>
                        <span class="flex-1">{{ fosterHome.province }} {{ fosterHome.city }} {{ fosterHome.district }}
                            {{ fosterHome.detailAddress }}</span>
                    </div>

                    <!-- 简介和联系方式 -->
                    <div class="mt-6">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-blue-500 mb-3 flex items-center">
                                <i class="el-icon-info mr-2 text-blue-400"></i>家庭简介
                            </h3>
                            <p class="text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg">
                                {{ fosterHome.description }}
                            </p>
                        </div>

                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-blue-500 mb-3 flex items-center">
                                <i class="el-icon-phone mr-2 text-blue-400"></i>联系方式
                            </h3>
                            <div class="p-4 bg-gray-50 rounded-lg space-y-2">
                                <p class="text-gray-700 leading-relaxed flex items-center">
                                    <i class="el-icon-user mr-3 text-blue-400"></i>{{ fosterHome.contactName }}
                                </p>
                                <p class="text-gray-700 leading-relaxed flex items-center">
                                    <i class="el-icon-mobile mr-3 text-blue-400"></i>{{ fosterHome.contactPhone }}
                                </p>
                            </div>
                        </div>

                        <router-link :to="`/customer-service?id=${fosterHome.userId}&type=foster`"
                            class="inline-block w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium transition-all duration-300 hover:bg-blue-600 hover:shadow-lg flex items-center justify-center">
                            <i class="el-icon-chat-dot-round mr-2"></i>点击咨询
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- 环境图片展示 -->
        <div class="cute-card p-6 bg-white mb-6">
            <h2 class="text-xl font-bold text-blue-500 mb-6 flex items-center">
                <i class="el-icon-picture mr-2 text-blue-400"></i>环境展示
            </h2>
            <div v-if="!fosterHome.environmentPhotos || fosterHome.environmentPhotos.length === 0"
                class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                <i class="el-icon-picture-outline text-4xl mb-3 text-gray-400"></i>
                <p>暂无环境照片</p>
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="(image, index) in fosterHome.environmentPhotos" :key="index"
                    class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
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
