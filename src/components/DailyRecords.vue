<template>
  <div class="daily-records">
    <!-- 日常记录列表 -->
    <div class="daily-list">
      <div 
        v-for="record in pet.dailyRecords" 
        :key="record.id"
        class="daily-record cute-card"
      >
        <div class="record-header">
          <div class="record-date">
            <span class="date-icon">📅</span>
            {{ formatDate(record.date) }}
          </div>
          <el-button 
            type="danger" 
            icon="Delete" 
            size="small"
            @click="deleteDailyRecord(record.id)"
            class="cute-btn"
          >
            删除
          </el-button>
        </div>
        
        <div class="record-content">
          <div class="record-type">
            <span class="type-icon">{{ getTypeIcon(record.type) }}</span>
            {{ record.type }}
          </div>
          <p class="record-description">{{ record.description }}</p>
        </div>
      </div>
    </div>

    <!-- 没有记录时的提示 -->
    <div v-if="!pet.dailyRecords || pet.dailyRecords.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>还没有日常记录</h3>
      <p>记录宝贝的日常生活点滴</p>
    </div>

    <!-- 添加记录按钮 -->
    <div class="add-record-btn">
      <el-button 
        type="primary" 
        icon="Plus" 
        @click="$emit('add-record')"
        class="cute-btn"
      >
        添加日常记录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
import type { Pet } from '../types/pet';

interface Props {
  pet: Pet;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'add-record': [];
}>();

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
};

// 获取类型图标
const getTypeIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    '饮食': '🍖',
    '玩耍': '🎾',
    '散步': '🚶',
    '睡眠': '💤',
    '洗澡': '🛁',
    '喂药': '💊'
  };
  return iconMap[type] || '📝';
};

// 删除日常记录
const deleteDailyRecord = async (recordId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条日常记录吗？',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    if (props.pet.dailyRecords) {
      const index = props.pet.dailyRecords.findIndex(record => record.id === recordId);
      if (index !== -1) {
        props.pet.dailyRecords.splice(index, 1);
        ElMessage.success('日常记录删除成功');
      }
    }
  } catch {
    // 用户取消删除
  }
};
</script>

<style scoped>
.daily-records {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.daily-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 5px;
}

.daily-record {
  padding: 15px;
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
  border: 2px dashed #81C784;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2E7D32;
  font-weight: 600;
  font-size: 0.9rem;
}

.date-icon {
  font-size: 1rem;
}

.record-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-type {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #43A047;
  font-weight: 600;
  font-size: 0.9rem;
}

.type-icon {
  font-size: 1.1rem;
}

.record-description {
  color: #1B5E20;
  margin: 0;
  line-height: 1.4;
  font-size: 0.9rem;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #FF69B4;
}

.empty-state p {
  margin: 0;
  opacity: 0.7;
}

.add-record-btn {
  padding: 15px 0 5px 0;
  text-align: center;
}

/* 滚动条样式 */
.daily-list::-webkit-scrollbar {
  width: 6px;
}

.daily-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.daily-list::-webkit-scrollbar-thumb {
  background: #FFB6C1;
  border-radius: 3px;
}

.daily-list::-webkit-scrollbar-thumb:hover {
  background: #FF69B4;
}
</style>