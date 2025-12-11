<template>
  <div class="active-manage-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><Stamp /></el-icon>
      <h2>运营活动管理 - 活动管理</h2>
    </div>

    <!-- 筛选与新增区 -->
    <div class="filter-add-bar">
      <el-card class="filter-card" shadow="hover">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-select
              v-model="activeStatus"
              placeholder="请选择活动状态"
              size="small"
              class="filter-select"
            >
              <el-option label="全部状态" value="" />
              <el-option label="未开始" value="pending" />
              <el-option label="进行中" value="ongoing" />
              <el-option label="已结束" value="ended" />
              <el-option label="已下架" value="offline" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索活动标题/ID"
              size="small"
              prefix-icon="Search"
              class="search-input"
            />
          </el-col>
          <el-col :span="10" class="btn-group">
            <el-button type="primary" size="small" class="add-btn">
              <el-icon><Plus /></el-icon> 新增活动
            </el-button>
            <el-button type="default" size="small" class="query-btn">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button type="default" size="small" class="reset-btn">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 活动列表区 -->
    <el-card class="list-card" shadow="hover">
      <el-table
        :data="activeList"
        border
        stripe
        class="active-table"
        :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
      >
        <el-table-column prop="id" label="活动ID" width="100" />
        <el-table-column prop="title" label="活动标题" min-width="180">
          <template #default="scope">
            <div class="active-title-item">
              <el-image
                :src="scope.row.coverImg"
                class="active-cover"
                fit="cover"
              />
              <span>{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="活动类型" width="120">
          <template #default="scope">
            <el-tag size="small" class="type-tag">
              {{
                scope.row.type === 'new_user_coupon'
                  ? '新人优惠券'
                  : scope.row.type === 'holiday_discount'
                  ? '节假日促销'
                  : scope.row.type === 'invite_reward'
                  ? '邀请有奖'
                  : '内容征集'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeRange" label="活动时间" width="220" />
        <el-table-column prop="status" label="活动状态" width="100">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status === 'pending'
                  ? 'info'
                  : scope.row.status === 'ongoing'
                  ? 'success'
                  : scope.row.status === 'ended'
                  ? 'warning'
                  : 'danger'
              "
              size="small"
              class="status-tag"
            >
              {{
                scope.row.status === 'pending'
                  ? '未开始'
                  : scope.row.status === 'ongoing'
                  ? '进行中'
                  : scope.row.status === 'ended'
                  ? '已结束'
                  : '已下架'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="participateCount" label="参与人数" width="100" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              class="view-btn"
              @click="handleView(scope.row)"
            >
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button
              type="warning"
              size="small"
              class="edit-btn"
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button
              :type="scope.row.status !== 'offline' ? 'danger' : 'success'"
              size="small"
              class="status-btn"
              @click="handleStatusChange(scope.row)"
            >
              <el-icon>
                 <Delete v-if="scope.row.status !== 'offline'" />
                <Check v-else />
              </el-icon>
              {{ scope.row.status !== 'offline' ? '下架' : '上架' }}
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
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="activeTotal"
          class="active-pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import {
 
//   Search,
//   Plus,
//   Refresh,
//   View,
//   Edit,

// } from '@element-plus/icons-vue'

// 筛选条件
const activeStatus = ref('')
const searchKeyword = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const activeTotal = ref(38)

// 模拟活动列表数据
const activeList = ref([
  {
    id: 'ACT2025001',
    title: '国庆长假宠物寄养8折优惠',
    type: 'holiday_discount',
    coverImg: '@/assets/img/addPic.png',
    timeRange: '2025-10-01 至 2025-10-07',
    status: 'pending',
    participateCount: 0
  },
  {
    id: 'ACT2025002',
    title: '新用户注册领50元优惠券',
    type: 'new_user_coupon',
    coverImg: '@/assets/img/addPic.png',
    timeRange: '2025-09-01 至 2025-09-30',
    status: 'ongoing',
    participateCount: 236
  },
  {
    id: 'ACT2025003',
    title: '邀请好友寄养得100积分',
    type: 'invite_reward',
    coverImg:'@/assets/img/addPic.png',
    timeRange: '2025-08-15 至 2025-08-31',
    status: 'ended',
    participateCount: 158
  },
  {
    id: 'ACT2025004',
    title: '分享遛狗趣事赢寄养礼包',
    type: 'content_collection',
    coverImg: '@/assets/img/addPic.png',
    timeRange: '2025-07-20 至 2025-07-30',
    status: 'offline',
    participateCount: 92
  },
  {
    id: 'ACT2025005',
    title: '中秋宠物陪伴套餐立减30元',
    type: 'holiday_discount',
    coverImg: '@/assets/img/addPic.png',
    timeRange: '2025-09-15 至 2025-09-20',
    status: 'ongoing',
    participateCount: 187
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
const handleView = (row: any) => { console.log('查看活动:', row) }
const handleEdit = (row: any) => { console.log('编辑活动:', row) }
const handleStatusChange = (row: any) => {
  console.log(`活动${row.status !== 'offline' ? '下架' : '上架'}:`, row)
}
</script>

<style scoped lang="scss">
// 全局容器
.active-manage-container {
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

// 筛选与新增区
.filter-add-bar {
  margin-bottom: 20px;

  .filter-card {
    border-radius: 12px;
    border: none;
    background-color: #fff9f2;
    padding: 15px;
  }

  .filter-select,
  .search-input {
    border-radius: 8px;
    border-color: #e8d6c4;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    .add-btn {
      background-color: #c3e6cb;
      border-color: #c3e6cb;
      color: #28a745;
      border-radius: 8px;
    }

    .query-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      border-radius: 8px;
    }

    .reset-btn {
      border-radius: 8px;
      border-color: #e8d6c4;
      color: #6b5b45;
    }
  }
}

// 活动列表区
.list-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;
  padding: 15px;
}

.active-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-row-bg-color: #fff9f2;
  border-radius: 8px;
  overflow: hidden;

  .active-title-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .active-cover {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #f0e6dc;
    }
  }

  .type-tag {
    background-color: #ffeaa7;
    color: #fd7e14;
    border-radius: 6px;
  }

  .status-tag {
    border-radius: 6px;
  }

  // 操作按钮
  .view-btn,
  .edit-btn,
  .status-btn {
    border-radius: 6px;
    margin: 0 2px;
  }

  .view-btn {
    background-color: #c3e6cb;
    border-color: #c3e6cb;
    color: #28a745;
  }

  .edit-btn {
    background-color: #ffeaa7;
    border-color: #ffeaa7;
    color: #fd7e14;
  }

  .status-btn {
    &.el-button--danger {
      background-color: #f8d7da;
      border-color: #f8d7da;
      color: #dc3545;
    }
    &.el-button--success {
      background-color: #d4edda;
      border-color: #d4edda;
      color: #155724;
    }
  }
}

// 分页
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .active-pagination {
    --el-pagination-button-bg-color: #fff;
    --el-pagination-button-border-color: #e8d6c4;
    --el-pagination-text-color: #6b5b45;
    --el-pagination-active-color: #e8a87c;
  }
}
</style>