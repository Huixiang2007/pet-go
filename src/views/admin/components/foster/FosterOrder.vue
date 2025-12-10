<template>
  <div class="foster-order-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><Ticket /></el-icon>
      <h2>寄养服务管理 - 订单管理</h2>
    </div>

    <!-- 通用指标卡片（复用组件） -->
    <FosterStatsCard />

    <!-- 订单管理内容区 -->
    <el-card class="main-content-card" shadow="hover">
      <!-- 订单筛选区 -->
      <div class="filter-bar">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-select
              v-model="orderStatus"
              placeholder="请选择订单状态"
              size="small"
              class="filter-select"
            >
              <el-option label="全部状态" value="" />
              <el-option label="待支付" value="pendingPay" />
              <el-option label="进行中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="orderDate"
              type="date"
              placeholder="选择订单日期"
              size="small"
              class="date-picker"
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="orderKeyword"
              placeholder="搜索订单号/用户昵称"
              size="small"
              prefix-icon="Search"
              class="search-input"
            />
          </el-col>
          <el-col :span="4" class="filter-btn-group">
            <el-button type="primary" size="small" class="query-btn">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button size="small" class="reset-btn">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 订单列表 -->
      <el-table
        :data="orderList"
        border
        stripe
        class="order-table"
        :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
      >
        <el-table-column prop="orderNo" label="订单编号" width="160" />
        <el-table-column prop="userName" label="用户昵称" min-width="100">
          <template #default="scope">
            <div class="user-name-item">
              <el-avatar :src="scope.row.userAvatar" class="user-avatar" />
              <span>{{ scope.row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="homeName" label="寄养家庭" width="120" />
        <el-table-column prop="petName" label="宠物名称" width="100">
          <template #default="scope">
            <el-tag size="small" class="pet-tag">{{ scope.row.petName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" width="120">
          <template #default="scope">
            <span class="amount-text">¥{{ scope.row.orderAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="120">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.orderStatus === 'pendingPay'
                  ? 'warning'
                  : scope.row.orderStatus === 'processing'
                  ? 'primary'
                  : scope.row.orderStatus === 'completed'
                  ? 'success'
                  : 'danger'
              "
              size="small"
              class="status-tag"
            >
              {{
                scope.row.orderStatus === 'pendingPay'
                  ? '待支付'
                  : scope.row.orderStatus === 'processing'
                  ? '进行中'
                  : scope.row.orderStatus === 'completed'
                  ? '已完成'
                  : '已取消'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="View"
              class="view-btn"
              @click="handleView(scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-if="scope.row.orderStatus === 'pendingPay'"
              type="danger"
              size="small"
              class="cancel-btn"
              @click="handleCancel(scope.row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orderTotal"
          class="foster-pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Ticket, Search, Refresh } from '@element-plus/icons-vue'
// 导入通用指标卡片组件
import FosterStatsCard from './FosterCard.vue'

// 筛选条件
const orderStatus = ref('')
const orderDate = ref('')
const orderKeyword = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const orderTotal = ref(48)

// 模拟订单列表数据
const orderList = ref([
  {
    orderNo: 'FO20250512001',
    userName: '罗小黑',
    userAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '汪汪快乐屋',
    petName: '煤球',
    orderAmount: 360,
    orderStatus: 'processing',
    createTime: '2025-05-12 09:15:30'
  },
  {
    orderNo: 'FO20250512002',
    userName: '张小飞',
    userAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '暖心宠物之家',
    petName: '小白',
    orderAmount: 480,
    orderStatus: 'pendingPay',
    createTime: '2025-05-12 10:23:45'
  },
  {
    orderNo: 'FO20250511001',
    userName: '欧阳修',
    userAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '萌宠寄养院',
    petName: '胖橘',
    orderAmount: 240,
    orderStatus: 'completed',
    createTime: '2025-05-11 14:30:21'
  },
  {
    orderNo: 'FO20250510001',
    userName: '诸葛暗',
    userAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '宠爱之家',
    petName: '阿柴',
    orderAmount: 600,
    orderStatus: 'cancelled',
    createTime: '2025-05-10 16:45:12'
  },
  {
    orderNo: 'FO20250509001',
    userName: '开羽',
    userAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '毛孩子驿站',
    petName: '布丁',
    orderAmount: 320,
    orderStatus: 'processing',
    createTime: '2025-05-09 08:12:33'
  }
])

// 分页事件（仅静态）
const handleSizeChange = (val: number) => {
  pageSize.value = val
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 操作事件（仅静态）
const handleView = (row: any) => { console.log('查看订单详情:', row) }
const handleCancel = (row: any) => { console.log('取消订单:', row) }
</script>

<style scoped lang="scss">
// 全局容器（与审核组件风格统一）
.foster-order-container {
  padding: 20px;
  background-color: #faf6f0;
  min-height: 100vh;
}

// 页面头部（统一风格）
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

// 筛选区（统一风格，新增日期选择器样式）
.filter-bar {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff9f2;
  border-radius: 8px;

  .filter-select,
  .search-input,
  .date-picker {
    border-radius: 6px;
    border-color: #e8d6c4;
  }

  .filter-btn-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    .query-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      border-radius: 6px;
    }

    .reset-btn {
      border-radius: 6px;
      border-color: #e8d6c4;
      color: #6b5b45;
    }
  }
}

// 订单列表（统一风格，新增专属标签样式）
.main-content-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;
}

.order-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-row-bg-color: #fff9f2;
  border-radius: 8px;
  overflow: hidden;

  .user-name-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .user-avatar {
      width: 30px;
      height: 30px;
      border: 1px solid #f0e6dc;
    }
  }

  .pet-tag {
    background-color: #ffeaa7;
    color: #fd7e14;
    border-radius: 6px;
  }

  .amount-text {
    color: #e8a87c;
    font-weight: 600;
  }

  .status-tag {
    border-radius: 6px;
  }

  .view-btn {
    background-color: #c3e6cb;
    border-color: #c3e6cb;
    color: #28a745;
    border-radius: 6px;
  }

  .cancel-btn {
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #721c24;
    border-radius: 6px;
  }
}

// 分页（与审核组件统一）
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .foster-pagination {
    --el-pagination-button-bg-color: #fff;
    --el-pagination-button-border-color: #e8d6c4;
    --el-pagination-text-color: #6b5b45;
    --el-pagination-active-color: #e8a87c;
  }
}
</style>