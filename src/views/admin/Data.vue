<template>
  <div class="dashboard-container">
    <!-- 指标卡片区域 -->
    <div class="card-group">
      <el-card shadow="hover" class="stat-card card-orange">
        <div class="stat-card-content">
          <div class="stat-title">今日订单数</div>
          <div class="stat-value">{{ todayOrderCount }}</div>
          <div class="stat-desc">
            <span class="trend-up">
              <i class="el-icon-arrow-up"></i> 12%
            </span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="el-icon-s-order"></i>
        </div>
      </el-card>

      <el-card shadow="hover" class="stat-card card-pink">
        <div class="stat-card-content">
          <div class="stat-title">平台总收入</div>
          <div class="stat-value">¥{{ todayIncome.toFixed(2) }}</div>
          <div class="stat-desc">
            <span class="trend-up">
              <i class="el-icon-arrow-up"></i> 8.5%
            </span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="el-icon-s-finance"></i>
        </div>
      </el-card>

      <el-card shadow="hover" class="stat-card card-yellow">
        <div class="stat-card-content">
          <div class="stat-title">活跃用户数</div>
          <div class="stat-value">{{ activeUserCount }}</div>
          <div class="stat-desc">
            <span class="trend-up">
              <i class="el-icon-arrow-up"></i> 5.2%
            </span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="el-icon-user"></i>
        </div>
      </el-card>

      <el-card shadow="hover" class="stat-card card-peach">
        <div class="stat-card-content">
          <div class="stat-title">服务上架总数</div>
          <div class="stat-value">{{ serviceCount }}</div>
          <div class="stat-desc">
            <span class="trend-up">
              <i class="el-icon-arrow-up"></i> 3.8%
            </span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="el-icon-s-shop"></i>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="chart-group">
      <el-card shadow="hover" class="chart-card">
        <div class="chart-header">
          <div class="chart-title">订单趋势（近30天）</div>
          <el-select
            v-model="chartType"
            placeholder="选择类型"
            size="small"
          >
            <el-option label="订单量" value="order"></el-option>
            <el-option label="收入" value="income"></el-option>
          </el-select>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-empty description="订单趋势图表" />
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="chart-card">
        <div class="chart-header">
          <div class="chart-title">热门寄养服务TOP10</div>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-empty description="热门服务图表" />
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="chart-card">
        <div class="chart-header">
          <div class="chart-title">用户地域分布</div>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-empty description="地域分布图表" />
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="chart-card">
        <div class="chart-header">
          <div class="chart-title">订单类型占比</div>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-empty description="订单类型图表" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快捷操作区 -->
    <div class="shortcut-area">
      <el-card shadow="hover" class="shortcut-card">
        <div class="shortcut-title">待处理事项</div>
        <div class="shortcut-list">
          <div class="shortcut-item item-orange">
            <div class="shortcut-icon">
              <i class="el-icon-s-check"></i>
            </div>
            <div class="shortcut-info">
              <div class="shortcut-name">待审核寄养服务</div>
              <div class="shortcut-count">{{ pendingAuditCount }}</div>
            </div>
          </div>
          <div class="shortcut-item item-pink">
            <div class="shortcut-icon">
              <i class="el-icon-s-return"></i>
            </div>
            <div class="shortcut-info">
              <div class="shortcut-name">待处理退款订单</div>
              <div class="shortcut-count">{{ pendingRefundCount }}</div>
            </div>
          </div>
          <div class="shortcut-item item-yellow">
            <div class="shortcut-icon">
              <i class="el-icon-s-warning"></i>
            </div>
            <div class="shortcut-info">
              <div class="shortcut-name">异常订单</div>
              <div class="shortcut-count">{{ abnormalOrderCount }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'

// 仅为样式展示的静态数据
const todayOrderCount = ref(128)
const todayIncome = ref(28560.50)
const activeUserCount = ref(3568)
const serviceCount = ref(892)
const pendingAuditCount = ref(12)
const pendingRefundCount = ref(5)
const abnormalOrderCount = ref(3)
const chartType = ref('order')
</script>
<script lang="ts">
export default {
  name: 'Dashboard'
}
</script>
<style scoped lang="scss">
// 暖色系主题变量
$primary-orange: #FF8A65;    // 主橙色（温暖活力）
$primary-pink: #FFAB91;      // 粉橙色（柔和温馨）
$primary-yellow: #FFCC80;    // 暖黄色（明亮活泼）
$primary-peach: #FFCDD2;     // 水蜜桃色（温柔清新）
$light-bg: #FFF8F5;          // 整体背景色（浅米白）
$card-shadow: 0 2px 12px rgba(255, 138, 101, 0.1); // 卡片阴影
$border-color: #FFE0D6;      // 边框色

.dashboard-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: $light-bg;
  padding: 20px;
}

/* 指标卡片样式 */
.card-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  height: 180px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  border: none;
  box-shadow: $card-shadow;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(255, 138, 101, 0.15);
  }
}

// 卡片颜色差异化
.card-orange {
  background-color: rgba(255, 138, 101, 0.08);
  .stat-icon i {
    color: rgba(255, 138, 101, 0.2);
  }
}
.card-pink {
  background-color: rgba(255, 171, 145, 0.08);
  .stat-icon i {
    color: rgba(255, 171, 145, 0.2);
  }
}
.card-yellow {
  background-color: rgba(255, 204, 128, 0.08);
  .stat-icon i {
    color: rgba(255, 204, 128, 0.2);
  }
}
.card-peach {
  background-color: rgba(255, 205, 210, 0.08);
  .stat-icon i {
    color: rgba(255, 205, 210, 0.2);
  }
}

.stat-card-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-title {
  font-size: 14px;
  color: #795548; // 深棕色文字（暖系搭配）
  margin-bottom: 8px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #3E2723; // 深褐色（比纯黑更温暖）
  margin-bottom: 8px;
}

.stat-desc {
  font-size: 12px;
}

.trend-up {
  color: #4CAF50; // 暖绿色（增长指标）
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.trend-down {
  color: #EF5350; // 暖红色（下降指标）
}

.trend-flat {
  color: #FF9800; // 橙色（持平指标）
}

.stat-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 36px;
}

/* 图表区域样式 */
.chart-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
}

.chart-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid $border-color;
  background-color: #fff;
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid $border-color;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: $primary-orange; // 主色调标题
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: '';
    width: 4px;
    height: 16px;
    background-color: $primary-orange;
    border-radius: 2px;
  }
}

// 下拉框样式优化
.el-select {
  .el-input__wrapper {
    border-color: $border-color;
    background-color: #fff;
    &:focus-within {
      box-shadow: 0 0 0 2px rgba(255, 138, 101, 0.2);
      border-color: $primary-orange;
    }
  }
}

.chart-container {
  flex: 1;
  padding: 16px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 138, 101, 0.03);
  border-radius: 8px;
}

/* 快捷操作区样式 */
.shortcut-area {
  margin-top: 20px;
}

.shortcut-card {
  padding: 16px;
  border: 1px solid $border-color;
  background-color: #fff;
  border-radius: 8px;
}

.shortcut-title {
  font-size: 16px;
  font-weight: 600;
  color: $primary-orange;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: '';
    width: 4px;
    height: 16px;
    background-color: $primary-orange;
    border-radius: 2px;
  }
}

.shortcut-list {
  display: flex;
  gap: 20px;
}

.shortcut-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

// 快捷项颜色差异化
.item-orange {
  background-color: rgba(255, 138, 101, 0.08);
  &:hover {
    background-color: rgba(255, 138, 101, 0.15);
  }
  .shortcut-icon {
    color: $primary-orange;
  }
}
.item-pink {
  background-color: rgba(255, 171, 145, 0.08);
  &:hover {
    background-color: rgba(255, 171, 145, 0.15);
  }
  .shortcut-icon {
    color: $primary-pink;
  }
}
.item-yellow {
  background-color: rgba(255, 204, 128, 0.08);
  &:hover {
    background-color: rgba(255, 204, 128, 0.15);
  }
  .shortcut-icon {
    color: $primary-yellow;
  }
}

.shortcut-icon {
  font-size: 24px;
  margin-right: 16px;
}

.shortcut-info {
  flex: 1;
}

.shortcut-name {
  font-size: 14px;
  color: #3E2723;
  margin-bottom: 8px;
}

.shortcut-count {
  font-size: 12px;
  color: #D32F2F; // 暖红色数字
  background-color: rgba(211, 47, 47, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .card-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .card-group {
    grid-template-columns: 1fr;
  }
  .chart-group {
    grid-template-columns: 1fr;
  }
  .shortcut-list {
    flex-direction: column;
  }
}
</style>