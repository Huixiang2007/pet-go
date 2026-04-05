<template>
  <div class="stats-card-group">
    <el-card class="stat-card card-orange" shadow="hover">
      <div class="stat-content">
        <div class="stat-label">待审核机构</div>
        <div class="stat-value">{{ cardData.auditCount}}</div>
       
      </div>
      <div class="stat-icon">
        <el-icon><Clock /></el-icon>
      </div>
    </el-card>
    <el-card class="stat-card card-green" shadow="hover">
      <div class="stat-content">
        <div class="stat-label">已入驻机构</div>
        <div class="stat-value">{{ cardData.stayCount }}</div>
     
      </div>
        <div class="stat-icon">
       <el-icon><Flag /></el-icon>
        </div>
    </el-card>

    <el-card class="stat-card card-pink" shadow="hover">
      <div class="stat-content">
        <div class="stat-label">今日寄养订单</div>
        <div class="stat-value">{{ cardData.todayOrderCount }}</div>
        <div class="stat-trend">
          <el-icon><ArrowUp /></el-icon> {{ cardData.chainGrowth=='NaN'?'--':cardData.chainGrowth }} 环比增长
        </div>
      </div>
      <div class="stat-icon">
        <el-icon><Ticket /></el-icon>
      </div>
    </el-card>

    <el-card class="stat-card card-yellow" shadow="hover">
      <div class="stat-content">
        <div class="stat-label">人气寄养机构</div>
        <div class="stat-value">{{ cardData.popularFosterProvider }}</div>
        <div class="stat-icon">
   <el-icon><TrophyBase /></el-icon>
      </div>
        <div class="stat-trend">
         
        <el-icon><GoldMedal /></el-icon>
        </div>
      </div>
      <!-- <div class="stat-icon">
        <el-icon><UserFilled /></el-icon>
      </div> -->
    </el-card>

    
  </div>
</template>

<script setup lang="ts">
import type { fourCard } from '@/api/admin/foster'



// 定义Props，允许父组件传递动态数据（静态阶段用默认值）
defineProps<{
  cardData: fourCard
}>()
</script>


<style scoped lang="scss">
.stats-card-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  padding: 15px;
  position: relative;
  overflow: hidden;
  height: 120px;
  display: flex;
  align-items: center;

  &.card-orange {
    background-color: #fff5ee;
  }

  &.card-pink {
    background-color: #ffe4e1;
  }

  &.card-yellow {
    background-color: #fff8dc;
  }

  &.card-green {
    background-color: #f0fff4;
  }

  .stat-content {
    z-index: 1;

    .stat-label {
      font-size: 14px;
      color: #795548;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #3e2723;
      margin-bottom: 5px;
    }

    .stat-trend {
      font-size: 12px;
      color: #4caf50;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .stat-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 36px;
    opacity: 0.15;
    color: #e8a87c;
  }
}
</style>