<template>
  <div class="foster-management-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><House /></el-icon>
      <h2>寄养服务管理中心</h2>
    </div>

    <!-- 核心指标卡片区 -->
    <div class="stats-card-group">
      <el-card class="stat-card card-orange" shadow="hover">
        <div class="stat-content">
          <div class="stat-label">待审核服务</div>
          <div class="stat-value">{{ pendingAuditCount }}</div>
          <div class="stat-trend">
            <el-icon><ArrowUp /></el-icon> 3 个待处理
          </div>
        </div>
        <div class="stat-icon">
          <el-icon><Clock /></el-icon>
        </div>
      </el-card>

      <el-card class="stat-card card-pink" shadow="hover">
        <div class="stat-content">
          <div class="stat-label">今日寄养订单</div>
          <div class="stat-value">{{ todayOrderCount }}</div>
          <div class="stat-trend">
            <el-icon><ArrowUp /></el-icon> 12% 环比增长
          </div>
        </div>
        <div class="stat-icon">
          <el-icon><Ticket /></el-icon>
        </div>
      </el-card>

      <el-card class="stat-card card-yellow" shadow="hover">
        <div class="stat-content">
          <div class="stat-label">活跃寄养家庭</div>
          <div class="stat-value">{{ activeHomeCount }}</div>
          <div class="stat-trend">
            <el-icon><ArrowDown /></el-icon> 2 个昨日减少
          </div>
        </div>
        <div class="stat-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
      </el-card>

      <el-card class="stat-card card-green" shadow="hover">
        <div class="stat-content">
          <div class="stat-label">本月服务收入</div>
          <div class="stat-value">¥{{ monthIncome.toFixed(2) }}</div>
          <div class="stat-trend">
            <el-icon><ArrowUp /></el-icon> 8.5% 同比增长
          </div>
        </div>
        <div class="stat-icon">
          <el-icon><Money /></el-icon>
        </div>
      </el-card>
    </div>

    <!-- 功能标签页 -->
    <el-card class="main-content-card" shadow="hover">
      <el-tabs v-model="activeTab" type="border-card" class="foster-tabs">
        <!-- 服务审核标签页 -->
        <el-tab-pane label="服务审核" name="audit">
          <div class="tab-content-wrapper">
            <!-- 筛选区 -->
            <div class="filter-bar">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-select
                    v-model="auditStatus"
                    placeholder="请选择审核状态"
                    size="small"
                    class="filter-select"
                  >
                    <el-option label="全部状态" value="" />
                    <el-option label="待审核" value="pending" />
                    <el-option label="已通过" value="passed" />
                    <el-option label="已拒绝" value="rejected" />
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input
                    v-model="auditKeyword"
                    placeholder="搜索寄养家庭名称/联系人"
                    size="small"
                    prefix-icon="Search"
                    class="search-input"
                  />
                </el-col>
                <el-col :span="8" class="filter-btn-group">
                  <el-button type="primary" size="small" class="query-btn">
                    <el-icon><Search /></el-icon> 搜索
                  </el-button>
                  <el-button size="small" class="reset-btn">
                    <el-icon><Refresh /></el-icon> 重置
                  </el-button>
                  <el-button size="small" class="export-btn">
                    <el-icon><Download /></el-icon> 导出
                  </el-button>
                </el-col>
              </el-row>
            </div>

            <!-- 审核列表 -->
            <el-table
              :data="auditList"
              border
              stripe
              class="audit-table"
              :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
            >
              <el-table-column prop="id" label="审核编号" width="100" />
              <el-table-column prop="homeName" label="寄养家庭名称" min-width="120">
                <template #default="scope">
                  <div class="home-name-item">
                    <el-avatar :src="scope.row.avatar" class="home-avatar" />
                    <span>{{ scope.row.homeName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contactName" label="联系人" width="100" />
              <el-table-column prop="contactPhone" label="联系电话" width="120" />
              <el-table-column prop="serviceType" label="服务类型" width="120">
                <template #default="scope">
                  <el-tag size="small" class="type-tag">
                    {{ scope.row.serviceType === 'cat' ? '猫咪寄养' : '狗狗寄养' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="applyTime" label="申请时间" width="160" />
              <el-table-column prop="status" label="审核状态" width="100">
                <template #default="scope">
                  <el-tag
                    :type="
                      scope.row.status === 'pending'
                        ? 'warning'
                        : scope.row.status === 'passed'
                        ? 'success'
                        : 'danger'
                    "
                    size="small"
                    class="status-tag"
                  >
                    {{
                      scope.row.status === 'pending'
                        ? '待审核'
                        : scope.row.status === 'passed'
                        ? '已通过'
                        : '已拒绝'
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" fixed="right">
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
                    v-if="scope.row.status === 'pending'"
                    type="success"
                    size="small"
                    class="pass-btn"
                    @click="handlePass(scope.row)"
                  >
                    通过
                  </el-button>
                  <el-button
                    v-if="scope.row.status === 'pending'"
                    type="danger"
                    size="small"
                    class="reject-btn"
                    @click="handleReject(scope.row)"
                  >
                    拒绝
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
                :total="auditTotal"
                class="foster-pagination"
              />
            </div>
          </div>
        </el-tab-pane>

        <!-- 寄养订单管理 -->
        <el-tab-pane label="寄养订单管理" name="order">
          <div class="empty-page">
            <el-empty description="寄养订单管理列表（静态展示）" class="empty-content">
              <el-button type="primary" size="small" class="empty-btn">
                <el-icon><Search /></el-icon> 查看全部订单
              </el-button>
            </el-empty>
          </div>
        </el-tab-pane>

        <!-- 寄养家庭管理 -->
        <el-tab-pane label="寄养家庭管理" name="home">
          <div class="empty-page">
            <el-empty description="寄养家庭信息管理（静态展示）" class="empty-content">
              <el-button type="primary" size="small" class="empty-btn">
                <el-icon><User /></el-icon> 管理家庭信息
              </el-button>
            </el-empty>
          </div>
        </el-tab-pane>

        <!-- 评价管理 -->
        <el-tab-pane label="评价管理" name="comment">
          <div class="empty-page">
            <el-empty description="寄养服务评价审核（静态展示）" class="empty-content">
              <el-button type="primary" size="small" class="empty-btn">
                <el-icon><Star /></el-icon> 审核用户评价
              </el-button>
            </el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  House,
  Clock,
  Ticket,
  UserFilled,
  Money,
  ArrowUp,
  ArrowDown,
  Search,
  Refresh,
  Download,
  Star
} from '@element-plus/icons-vue'

// 核心指标数据
const pendingAuditCount = ref(8)
const todayOrderCount = ref(26)
const activeHomeCount = ref(42)
const monthIncome = ref(58620.35)

// 标签页状态
const activeTab = ref('audit')

// 审核列表筛选条件
const auditStatus = ref('')
const auditKeyword = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const auditTotal = ref(32)

// 模拟审核列表数据
const auditList = ref([
  {
    id: 'FS2025001',
    homeName: '暖心宠物之家',
    contactName: '张小飞',
    contactPhone: '187034078XX',
    serviceType: 'cat',
    applyTime: '2025-05-12 10:23:45',
    status: 'pending',
    avatar: 'http://8.13XXX/avatar2.png'
  },
  {
    id: 'FS2025002',
    homeName: '汪汪快乐屋',
    contactName: '罗小黑',
    contactPhone: '17821044XXX',
    serviceType: 'dog',
    applyTime: '2025-05-11 16:45:12',
    status: 'passed',
    avatar: 'http://8.13XXX/avatar1.png'
  },
  {
    id: 'FS2025003',
    homeName: '毛孩子驿站',
    contactName: '欧阳修',
    contactPhone: '19836248XXX',
    serviceType: 'cat',
    applyTime: '2025-05-10 09:12:33',
    status: 'rejected',
    avatar: 'http://8.13XXX/avatar3.png'
  },
  {
    id: 'FS2025004',
    homeName: '萌宠寄养院',
    contactName: '诸葛暗',
    contactPhone: '17702505XXX',
    serviceType: 'dog',
    applyTime: '2025-05-09 14:36:21',
    status: 'pending',
    avatar: 'http://8.13XXX/avatar4.png'
  },
  {
    id: 'FS2025005',
    homeName: '宠爱之家',
    contactName: '开羽',
    contactPhone: '156320145XX',
    serviceType: 'cat',
    applyTime: '2025-05-08 11:22:55',
    status: 'passed',
    avatar: 'http://8.13XXX/avatar5.png'
  }
])

// 分页事件
const handleSizeChange = (val: number) => {
  pageSize.value = val
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 操作事件（仅静态）
const handleView = (row: any) => {
  console.log('查看审核详情:', row)
}
const handlePass = (row: any) => {
  console.log('通过审核:', row)
}
const handleReject = (row: any) => {
  console.log('拒绝审核:', row)
}
</script>

<style scoped lang="scss">
// 全局容器
.foster-management-container {
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
        font-size: 24px;
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
}

// 主内容卡片
.main-content-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;

  .foster-tabs {
    --el-tabs-header-text-color: #6b5b45;
    --el-tabs-active-color: #e8a87c;
    --el-tabs-border-color: #e8d6c4;

    .el-tabs__content {
      padding: 20px 0;
    }
  }
}

// 筛选区
.filter-bar {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff9f2;
  border-radius: 8px;

  .filter-select,
  .search-input {
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

    .reset-btn,
    .export-btn {
      border-radius: 6px;
      border-color: #e8d6c4;
      color: #6b5b45;
    }
  }
}

// 审核列表
.audit-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-row-bg-color: #fff9f2;
  border-radius: 8px;
  overflow: hidden;

  .home-name-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .home-avatar {
      width: 30px;
      height: 30px;
      border: 1px solid #f0e6dc;
    }
  }

  .type-tag {
    background-color: #f0fff4;
    color: #28a745;
    border-radius: 6px;
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

  .pass-btn {
    background-color: #d4edda;
    border-color: #d4edda;
    color: #155724;
    border-radius: 6px;
  }

  .reject-btn {
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #721c24;
    border-radius: 6px;
  }
}

// 分页
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

// 空页面
.empty-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  .empty-content {
    .empty-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      margin-top: 15px;
      border-radius: 6px;
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .stats-card-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-card-group {
    grid-template-columns: 1fr;
  }
}
</style>