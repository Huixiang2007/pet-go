<template>
  <div class="active-dashboard-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><DataBoard /></el-icon>
      <h2>运营活动管理 - 数据看板</h2>
    </div>

    <!-- 筛选区 -->
    <div class="filter-bar">
      <el-card class="filter-card" shadow="hover">
        <el-row :gutter="15">
          <el-col :span="8">
            <el-select
              v-model="selectedActive"
              placeholder="选择活动（默认全部）"
              size="small"
              class="active-select"
            >
              <el-option label="全部活动" value="" />
              <el-option label="国庆长假宠物寄养8折优惠" value="ACT2025001" />
              <el-option label="新用户注册领50元优惠券" value="ACT2025002" />
              <el-option label="邀请好友寄养得100积分" value="ACT2025003" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              class="date-picker"
            />
          </el-col>
          <el-col :span="8" class="filter-btn">
            <el-button type="primary" size="small" class="query-btn">
              <el-icon><Search /></el-icon> 查看数据
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 核心指标卡片区 -->
    <div class="stats-card-group">
      <el-card class="stat-card card-pink" shadow="hover">
        <div class="stat-inner">
          <div class="stat-info">
            <div class="stat-label">总浏览次数</div>
            <div class="stat-value">{{ totalView }}</div>
            <div class="stat-trend">
              <el-icon><ArrowUp /></el-icon> 12.5% 环比增长
            </div>
          </div>
          <div class="stat-icon">
            <el-icon><View /></el-icon>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card card-orange" shadow="hover">
        <div class="stat-inner">
          <div class="stat-info">
            <div class="stat-label">总参与人数</div>
            <div class="stat-value">{{ totalParticipate }}</div>
            <div class="stat-trend">
              <el-icon><ArrowUp /></el-icon> 8.2% 环比增长
            </div>
          </div>
          <div class="stat-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card card-green" shadow="hover">
        <div class="stat-inner">
          <div class="stat-info">
            <div class="stat-label">订单转化率</div>
            <div class="stat-value">{{ conversionRate }}%</div>
            <div class="stat-trend">
              <el-icon><ArrowUp /></el-icon> 2.1% 环比增长
            </div>
          </div>
          <div class="stat-icon">
            <el-icon><ShoppingCart /></el-icon>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card card-yellow" shadow="hover">
        <div class="stat-inner">
          <div class="stat-info">
            <div class="stat-label">带动销售额</div>
            <div class="stat-value">¥{{ totalSales.toFixed(2) }}</div>
            <div class="stat-trend">
              <el-icon><ArrowUp /></el-icon> 15.8% 环比增长
            </div>
          </div>
          <div class="stat-icon">
            <el-icon><Money /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表展示区 -->
    <div class="chart-group">
      <el-card class="chart-card" shadow="hover">
        <div class="chart-header">
          <h3 class="chart-title">活动参与人数趋势（近30天）</h3>
        </div>
        <div class="chart-placeholder">
          <el-empty description="参与人数趋势图表（静态展示）" class="empty-chart" />
        </div>
      </el-card>

      <el-card class="chart-card" shadow="hover">
        <div class="chart-header">
          <h3 class="chart-title">各活动参与人数对比</h3>
        </div>
        <div class="chart-placeholder">
          <el-empty description="活动对比图表（静态展示）" class="empty-chart" />
        </div>
      </el-card>

      <el-card class="chart-card" shadow="hover">
        <div class="chart-header">
          <h3 class="chart-title">用户地域分布</h3>
        </div>
        <div class="chart-placeholder">
          <el-empty description="地域分布图表（静态展示）" class="empty-chart" />
        </div>
      </el-card>

      <el-card class="chart-card" shadow="hover">
        <div class="chart-header">
          <h3 class="chart-title">活动类型转化效果</h3>
        </div>
        <div class="chart-placeholder">
          <el-empty description="类型转化图表（静态展示）" class="empty-chart" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DataBoard,
  Search,
  View,
  UserFilled,
  ShoppingCart,
  Money,
  ArrowUp
} from '@element-plus/icons-vue'

// 筛选条件
const selectedActive = ref('')
const dateRange = ref([] as [Date?, Date?])

// 核心指标数据
const totalView = ref(12580) // 总浏览次数
const totalParticipate = ref(3260) // 总参与人数
const conversionRate = ref(18.7) // 订单转化率
const totalSales = ref(285600.5) // 带动销售额
</script>

<style scoped lang="scss">
// 全局容器
.active-dashboard-container {
  padding: 20px;
  background-color: #faf6f0;
  min-height: 100vh;
}

// 页面头部
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .header-icon {
    font-size: 26px;
    color: #e8a87c;
    margin-right: 10px;
  }

  h2 {
    margin: 0;
    color: #6b5b45;
    font-weight: 600;
  }
}

// 筛选区
.filter-bar {
  margin-bottom: 20px;

  .filter-card {
    border-radius: 12px;
    border: none;
    background-color: #fff9f2;
    padding: 15px;
  }

  .active-select,
  .date-picker {
    border-radius: 8px;
    border-color: #e8d6c4;
    width: 100%;
  }

  .query-btn {
    background-color: #e8a87c;
    border-color: #e8a87c;
    border-radius: 8px;
    width: 100%;
  }
}

// 指标卡片区
.stats-card-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  .stat-card {
    border-radius: 12px;
    border: none;
    padding: 15px;
    position: relative;
    overflow: hidden;
    height: 140px;
    display: flex;
    align-items: center;

    &.card-pink {
      background-color: #ffe4e1;
    }

    &.card-orange {
      background-color: #fff5ee;
    }

    &.card-green {
      background-color: #f0fff4;
    }

    &.card-yellow {
      background-color: #fff8dc;
    }

    .stat-inner {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      z-index: 1;

      .stat-info {
        .stat-label {
          font-size: 14px;
          color: #795548;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 26px;
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
        font-size: 36px;
        opacity: 0.15;
        color: #e8a87c;
      }
    }
  }
}

// 图表展示区
.chart-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  .chart-card {
    border-radius: 12px;
    border: none;
    background-color: #fff;
    padding: 15px;
    height: 300px;
    display: flex;
    flex-direction: column;

    .chart-header {
      margin-bottom: 15px;

      .chart-title {
        font-size: 16px;
        color: #6b5b45;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
          content: '';
          width: 4px;
          height: 16px;
          background-color: #e8a87c;
          border-radius: 2px;
        }
      }
    }

    .chart-placeholder {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff9f2;
      border-radius: 8px;

      .empty-chart {
        --el-empty-description-color: #9e7d66;
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .stats-card-group {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-card-group {
    grid-template-columns: 1fr;
  }
}
</style>