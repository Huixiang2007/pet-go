<template>
    <div class="service-package-wrapper">
        <div class="cute-card p-6 bg-white mb-6">
            <h2 class="text-xl font-bold text-blue-500 mb-4">服务套餐</h2>

            <!-- 套餐列表 -->
            <div v-if="loadingService" class="text-center py-8">
                <i class="el-icon-loading text-blue-500 text-2xl"></i>
                <p class="text-gray-500 mt-2">加载套餐中...</p>
            </div>
            <div v-else-if="serviceList.length === 0" class="text-center py-8 text-gray-500">
                暂无服务套餐
            </div>
            <div v-else class="grid grid-cols-1 gap-6 mb-6">
                <div v-for="packageItem in serviceList" :key="packageItem.id" class="package-card">
                    <!-- 基本信息 -->
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h4 class="font-semibold text-blue-500 text-lg">{{ packageItem.title }}</h4>
                            <p class="text-gray-600 text-sm mt-5">{{ packageItem.description }}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-blue-500">
                                {{ packageItem.basePrice }}<span class="text-base font-normal">元/天</span>
                            </div>
                            <div class="text-sm" :class="maxPets > 0 ? 'text-green-500' : 'text-red-500'">
                                {{ packageItem.available > 0 ? `剩余${packageItem.available}个名额` : '已满' }}
                            </div>
                        </div>
                    </div>

                    <!-- 套餐特色 -->
                    <div class="mb-4">
                        <div class="text-sm text-gray-600 mb-5  items-center">
                            <span class="little-title">套餐包含</span>
                        </div>
                        <!-- <div class="flex flex-wrap gap-2">
                            <span v-for="feature in packageItem.additionalServices" :key="feature.id"
                                class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs border border-blue-200 hover:bg-blue-100 transition-all">
                                {{ feature.title }}
                            </span>
                        </div> -->
                        <div v-if="!packageItem.additionalServices || packageItem.additionalServices.length === 0"
                            class="text-gray-400 text-xs italic">
                            暂无可选附加服务
                        </div>
                        <div v-else class="grid grid-cols-1 sm:grid-cols-1 gap-2">
                            <div v-for="service in packageItem.additionalServices" :key="service.id"
                                class="bg-white border border-gray-100 rounded-lg p-2 hover:border-blue-300 hover:bg-f0f8ff transition-all">
                                <div class="flex justify-between items-center fle">
                                    <span class="text-sm text-gray-700">{{ service.title }}</span>
                                    <span class="text-sm font-bold text-orange-500">¥{{ service.price }}/次</span>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- 附加服务 -->
                    <!-- <div class="mb-4">
                        <div class="text-sm text-gray-600 mb-2 flex items-center">
                            <i class="el-icon-plus mr-2 text-blue-400"></i>
                        </div>
                        
                    </div> -->

                    <!-- 服务详情 -->
                    <div class=" text-sm ">
                        <!-- <div class="flex items-center bg-gray-50 p-2 rounded-lg hover:bg-f5f9ff transition-all"> -->
                        <div class="text-sm text-gray-600 mb-2  items-center flex gap-3">
                            <span class="little-title">可接待宠物</span>
                            <span class="text-gray-600">{{ packageItem.petTypes.split(',').join('、') }}</span>

                        </div>



                    </div>

                    <!-- 立即预订 -->
                    <div class="mt-2 flex justify-end">
                        <button class="cute-btn px-8 py-2" :disabled="maxPets === 0" @click="goToBooking(packageItem)">
                            <i class="el-icon-date mr-2"></i>立即预订
                        </button>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FosterServiceItem, FosterServicePageData, AdditionalServicePageData } from '@/types/foster'
import type { ApiResponse } from '@/types/api'
import { packageItem } from '@/api/foster-care'
import { getAdditionalServices } from '@/api/foster-care/book'

// 定义Props
const props = defineProps<{
    providerId: number
    maxPets: number
}>()

// 定义事件
const emit = defineEmits<{
    'select-package': [packageItem: FosterServiceItem]

}>()

// 套餐相关状态
const serviceList = ref<FosterServiceItem[]>([])
const loadingService = ref<boolean>(false)

// 获取套餐列表
const fetchFosterServiceList = async () => {
    loadingService.value = true;
    try {
        const res: ApiResponse<FosterServicePageData> = await packageItem({
            providerId: Number(props.providerId),
            pageNum: 1,
            pageSize: 100 // 加载足够多的套餐，避免分页
        });
        if (res.code === 0) {
            serviceList.value = res.data.list;

            // 批量加载附加服务
            await Promise.all(
                serviceList.value.map(pkg => fetchPackageAdditionalServices(pkg))
            );
        } else {
            console.log(res.msg || '获取服务套餐失败');
        }
    } catch (error) {
        console.error('获取寄养服务列表失败：', error);
    } finally {
        loadingService.value = false;
    }
};

// 获取单个套餐的附加服务
const fetchPackageAdditionalServices = async (packageItem: FosterServiceItem) => {
    try {
        const res: ApiResponse<AdditionalServicePageData> = await getAdditionalServices(packageItem.id);
        if (res.code === 0) {
            packageItem.additionalServices = res.data.list;
        }
    } catch (error) {
        console.error(`加载套餐【${packageItem.title}】附加服务失败：`, error);
        packageItem.additionalServices = [];
    }
};



// 选择套餐
const goToBooking = (packageItem: FosterServiceItem) => {
    emit('select-package', packageItem);
};

// 监听providerId变化重新加载
watch(() => props.providerId, () => {
    fetchFosterServiceList();
}, { immediate: true });
</script>

<style scoped>
.service-package-wrapper {
    width: 100%;
}

/* 套餐卡片样式优化 */
.package-card {
    border: 2px solid #e8f4ff;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 16px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.08);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &:hover {
        transform: translateX(4px);
        box-shadow: 0 8px 20px rgba(74, 144, 226, 0.12);

        border-left: 6px solid #6bc4ff;

        /* ::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(135deg, #6bc4ff, #4a90e2);
            border-radius: 2px 0 0 2px;
            transition: all 0.3s ease;

        } */
    }


}

.little-title {
    padding: 5px 10px;
    background-color: #e1f3ff;
    border-radius: 4px;
}

/* 附加服务项样式 */
.bg-white.border-gray-100 {
    transition: all 0.2s ease;

    &:hover {
        background: #f0f8ff;
        transform: translateX(2px);
    }
}

/* 按钮优化 */
.cute-btn {
    background: linear-gradient(135deg, #4a90e2 0%, #6bc4ff 100%);
    border: none;
    border-radius: 50px;
    color: white;
    font-weight: 600;
    padding: 10px 24px;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 6px 15px rgba(74, 144, 226, 0.3);
        background: linear-gradient(135deg, #3a80d2 0%, #5bc3ff 100%);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        background: #e0e0e0;
    }
}

/* 套餐特色标签优化 */
.bg-blue-50 {
    transition: all 0.2s ease;

    &:hover {
        background-color: #e8f4ff;
        transform: scale(1.05);
    }
}

/* 服务详情项优化 */
.bg-gray-50 {
    transition: all 0.2s ease;

    &:hover {
        background-color: #f5f9ff;
    }
}
</style>