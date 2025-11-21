<template>
  <div 
    class="pet-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
    :class="{ 'pet-card-enter': animate }"
  >
    <!-- 宠物头像 -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="pet.avatar" 
        :alt="pet.nickname"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
      <!-- 性别标识 -->
      <div class="absolute top-3 right-3">
        <el-tag 
          :type="pet.gender === 'male' ? 'primary' : 'danger'" 
          class="rounded-full"
        >
          <el-icon class="mr-1">
            <Male v-if="pet.gender === 'male'" />
            <Female v-else />
          </el-icon>
          {{ pet.gender === 'male' ? '公' : '母' }}
        </el-tag>
      </div>
      <!-- 绝育标识 -->
      <div v-if="pet.neutered" class="absolute top-3 left-3">
        <el-tag type="success" class="rounded-full text-xs">
          已绝育
        </el-tag>
      </div>
    </div>

    <!-- 宠物信息 -->
    <div class="p-4">
      <h3 class="text-xl font-bold text-gray-800 mb-2 truncate">{{ pet.nickname }}</h3>
      <p class="text-gray-600 text-sm mb-2">{{ pet.breed }}</p>
      
      <div class="flex justify-between items-center text-sm text-gray-500 mb-3">
        <span>{{ calculateAge(pet.birthday) }}</span>
        <span>{{ pet.weight }}kg</span>
      </div>

      <!-- 健康状态 -->
      <div class="mb-3">
        <el-tag 
          :type="getHealthStatusType(pet.healthStatus)"
          class="w-full justify-center"
        >
          {{ pet.healthStatus }}
        </el-tag>
      </div>

      <!-- 性格标签 -->
      <div class="flex flex-wrap gap-1">
        <el-tag 
          v-for="tag in pet.personalityTags.slice(0, 2)" 
          :key="tag"
          size="small"
          class="bg-blue-50 text-blue-600 border-none"
        >
          {{ tag }}
        </el-tag>
        <el-tag v-if="pet.personalityTags.length > 2" size="small" class="bg-gray-100 text-gray-600">
          +{{ pet.personalityTags.length - 2 }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Male, Female } from '@element-plus/icons-vue';
import type { Pet } from '../types/pet';

interface Props {
  pet: Pet;
  animate?: boolean;
}

defineProps<Props>();

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

// 获取健康状态对应的标签类型
const getHealthStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    '健康': 'success',
    '良好': 'info',
    '注意': 'warning',
    '生病': 'danger'
  };
  return statusMap[status] || 'info';
};
</script>

<style scoped>
.pet-card {
  transition: all 0.3s ease;
}

.pet-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.pet-card-enter {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>