<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部导航 -->
        <div class="bg-white shadow-sm border-b">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <el-button icon="ArrowLeft" @click="goBack" class="border-none text-gray-600">
                            返回
                        </el-button>
                        <h1 class="text-2xl font-bold text-gray-800">{{ currentPet?.nickname }}的档案</h1>
                    </div>
                    <el-button type="primary" @click="editPet">
                        <el-icon class="mr-1">
                            <Edit />
                        </el-icon>
                        编辑信息
                    </el-button>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 py-8" v-if="currentPet">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- 左侧基本信息 -->
                <div class="lg:col-span-1">
                    <el-card class="shadow-lg rounded-2xl">
                        <!-- 头像和基础信息 -->
                        <div class="text-center mb-6">
                            <div class="relative inline-block">
                                <img :src="currentPet.avatar" :alt="currentPet.nickname"
                                    class="w-32 h-32 rounded-full object-cover border-4 border-pink-200 mx-auto" />
                                <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                    <el-tag :type="currentPet.gender === 'male' ? 'primary' : 'danger'"
                                        class="rounded-full">
                                        {{ currentPet.gender === 'male' ? '♂ 公' : '♀ 母' }}
                                    </el-tag>
                                </div>
                            </div>
                            <h2 class="text-2xl font-bold mt-6 text-gray-800">{{ currentPet.nickname }}</h2>
                            <p class="text-gray-600 mt-1">{{ currentPet.breed }}</p>
                        </div>

                        <!-- 详细信息 -->
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div class="bg-gray-50 rounded-lg p-3">
                                    <div class="text-gray-500">生日</div>
                                    <div class="font-semibold">{{ formatDate(currentPet.birthday) }}</div>
                                </div>
                                <div class="bg-gray-50 rounded-lg p-3">
                                    <div class="text-gray-500">年龄</div>
                                    <div class="font-semibold">{{ calculateAge(currentPet.birthday) }}</div>
                                </div>
                                <div class="bg-gray-50 rounded-lg p-3">
                                    <div class="text-gray-500">体重</div>
                                    <div class="font-semibold">{{ currentPet.weight }} kg</div>
                                </div>
                                <div class="bg-gray-50 rounded-lg p-3">
                                    <div class="text-gray-500">绝育状态</div>
                                    <div class="font-semibold">{{ currentPet.neutered ? '已绝育' : '未绝育' }}</div>
                                </div>
                            </div>

                            <!-- 健康状态 -->
                            <div
                                class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                <div class="flex items-center justify-between">
                                    <span class="text-green-800 font-semibold">健康状态</span>
                                    <el-tag :type="getHealthStatusType(currentPet.healthStatus)" class="font-bold">
                                        {{ currentPet.healthStatus }}
                                    </el-tag>
                                </div>
                            </div>

                            <!-- 性格标签 -->
                            <div>
                                <h3 class="text-lg font-semibold mb-3 text-gray-700">性格标签</h3>
                                <div class="flex flex-wrap gap-2">
                                    <el-tag v-for="tag in currentPet.personalityTags" :key="tag"
                                        class="bg-blue-50 text-blue-600 border-none rounded-full px-3">
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>

                <!-- 右侧内容区域 -->
                <div class="lg:col-span-2">
                    <el-tabs v-model="activeTab" type="card" class="pet-detail-tabs">
                        <!-- 健康档案 -->
                        <el-tab-pane label="🏥 健康档案" name="health">
                            <HealthRecords :pet="currentPet" />
                        </el-tab-pane>

                        <!-- 成长记录 -->
                        <el-tab-pane label="📸 成长记录" name="growth">
                            <GrowthAlbum :pet="currentPet" />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-else class="flex justify-center items-center h-64">
            <el-skeleton :rows="5" animated />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Edit } from '@element-plus/icons-vue';
// import type { Pet } from '../types/pet';
import HealthRecords from '@/components/HealthRecords.vue';
import GrowthAlbum from '@/components/GrowthAlbum.vue';
 interface HealthRecord {
  type: string;
  date: string;
  nextReminder?: string;
}

interface GrowthRecord {
  age: string; // 年龄阶段，如：0-1岁，1-2岁
  photos: string[];
  description?: string;
  milestones?: string[]; // 里程碑事件
}

interface Pet {
  id: string;
  nickname: string;
  breed: string;
  birthday: string;
  gender: 'male' | 'female';
  weight: number;
  avatar: string;
  personalityTags: string[];
  neutered: boolean;
  healthStatus: string;
  healthRecords: {
    vaccine: HealthRecord[];
    deworming: HealthRecord[];
    medical: HealthRecord[];
  };
  growthRecords: GrowthRecord[];
}

const route = useRoute();
const router = useRouter();

const activeTab = ref('health');
const pets = ref<Pet[]>([]);
const currentPet = computed(() =>
    pets.value.find(pet => pet.id === route.params.id)
);

// 格式化日期
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
};

// 计算年龄
const calculateAge = (birthday: string): string => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years === 0) {
        return `${months}个月`;
    }
    return `${years}岁${months}个月`;
};

// 获取健康状态类型
const getHealthStatusType = (status: string) => {
    const statusMap: Record<string, any> = {
        '健康': 'success',
        '良好': 'info',
        '注意': 'warning',
        '生病': 'danger'
    };
    return statusMap[status] || 'info';
};

// 返回上一页
const goBack = () => {
    router.push('/');
};

// 编辑宠物信息
const editPet = () => {
    ElMessage.info('编辑功能开发中...');
};

// 加载数据
onMounted(() => {
    // 模拟加载数据
    pets.value = [
        {
            id: '1',
            nickname: 'Lucky',
            breed: '金毛寻回犬',
            birthday: '2020-05-15',
            gender: 'male',
            weight: 32.5,
            avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
            personalityTags: ['活泼', '友好', '粘人', '聪明', '贪吃'],
            neutered: true,
            healthStatus: '健康',
            healthRecords: {
                vaccine: [
                    { type: '狂犬病疫苗', date: '2023-03-10', nextReminder: '2024-03-10' },
                    { type: '六联疫苗', date: '2023-01-15', nextReminder: '2024-01-15' }
                ],
                deworming: [
                    { medicine: '体内驱虫片', date: '2023-05-20', nextReminder: '2023-08-20' }
                ],
                medical: [
                    { hospital: '爱心宠物医院', diagnosis: '轻微皮炎', medicine: '皮肤药膏', date: '2022-11-05' }
                ]
            },
            growthRecords: [
                {
                    age: '0-1岁',
                    photos: [
                        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop'
                    ],
                    description: '幼犬时期，非常活泼可爱',
                    milestones: ['学会坐下', '第一次出门散步']
                },
                {
                    age: '1-2岁',
                    photos: [
                        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'
                    ],
                    description: '青少年期，成长迅速',
                    milestones: ['学会握手', '体重达到25kg']
                }
            ]
        }
    ];
});
</script>

<style scoped>
.pet-detail-tabs {
    :deep(.el-tabs__header) {
        @apply mb-6;
    }

    :deep(.el-tabs__item) {
        @apply text-lg font-semibold;
    }
}
</style>