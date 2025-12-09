<template>
  <div class="foster-comment-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><StarFilled /></el-icon>
      <h2>寄养服务管理 - 评价管理</h2>
    </div>

    <!-- 通用指标卡片（复用组件） -->
    <FosterStatsCard />

    <!-- 评价管理内容区 -->
    <el-card class="main-content-card" shadow="hover">
      <!-- 评价筛选区 -->
      <div class="filter-bar">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-select
              v-model="commentScore"
              placeholder="请选择评分"
              size="small"
              class="filter-select"
            >
              <el-option label="全部评分" value="" />
              <el-option label="5分" value="5" />
              <el-option label="4分" value="4" />
              <el-option label="3分及以下" value="3" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="commentKeyword"
              placeholder="搜索订单号/用户昵称"
              size="small"
              prefix-icon="Search"
              class="search-input"
            />
          </el-col>
          <el-col :span="10" class="filter-btn-group">
            <el-button type="primary" size="small" class="query-btn">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button size="small" class="reset-btn">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
            <el-button size="small" class="export-btn">
              <el-icon><Download /></el-icon> 导出评价
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 评价列表 -->
      <el-table
        :data="commentList"
        border
        stripe
        class="comment-table"
        :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
      >
        <el-table-column prop="commentId" label="评价ID" width="100" />
        <el-table-column prop="orderNo" label="关联订单" width="160" />
        <el-table-column prop="userName" label="用户昵称" min-width="100">
          <template #default="scope">
            <div class="user-name-item">
              <el-avatar :src="scope.row.userAvatar" class="user-avatar" />
              <span>{{ scope.row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="homeName" label="寄养家庭" width="120" />
        <el-table-column prop="commentScore" label="评分" width="100">
          <template #default="scope">
            <div class="score-star">
              <el-rate
                v-model="scope.row.commentScore"
                disabled
                size="small"
                color="#e8a87c"
                void-color="#f0e6dc"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="commentContent" label="评价内容" min-width="200">
          <template #default="scope">
            <div class="comment-content">
              {{ scope.row.commentContent }}
              <!-- <el-image
              
                :src="require('@/assets/img/addPic.png')"
                :preview-src-list="[require('@/assets/img/addPic.png')]"
                class="comment-img"
                fit="cover"
                preview-teleport="body"
                alt="评论图片"
              /> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="commentTime" label="评价时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              class="delete-btn"
              @click="handleDelete(scope.row)"
            >
              删除
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
          :total="commentTotal"
          class="foster-pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { StarFilled, Search, Refresh, Download } from '@element-plus/icons-vue'
// 导入通用指标卡片组件
import FosterStatsCard from './FosterCard.vue'

// 筛选条件
const commentScore = ref('')
const commentKeyword = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const commentTotal = ref(65)

// 模拟评价列表数据
const commentList = ref([
  {
    commentId: 'FC20250512001',
    orderNo: 'FO20250511001',
    userName: '欧阳修',
    userAvatar:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '萌宠寄养院',
    commentScore: 5,
    commentContent: '寄养家庭很负责，每天发照片，环境干净，推荐！',
    commentImg:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    commentTime: '2025-05-12 11:30:45',
  },
  {
    commentId: 'FC20250511001',
    orderNo: 'FO20250510001',
    userName: '诸葛暗',
    userAvatar:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '宠爱之家',
    commentScore: 4,
    commentContent: '整体不错，就是距离有点远，其他都满意',
    commentImg: '',
    commentTime: '2025-05-11 15:20:33',
  },
  {
    commentId: 'FC20250510001',
    orderNo: 'FO20250509001',
    userName: '开羽',
    userAvatar:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '毛孩子驿站',
    commentScore: 3,
    commentContent: '环境一般，宠物回来有点应激，希望改进',
    commentImg:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    commentTime: '2025-05-10 09:45:12',
  },
  {
    commentId: 'FC20250509001',
    orderNo: 'FO20250508001',
    userName: '罗小黑',
    userAvatar:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280g',
    homeName: '汪汪快乐屋',
    commentScore: 5,
    commentContent: '超级推荐！工作人员很有耐心，宠物玩得很开心',
    commentImg:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280g',
    commentTime: '2025-05-09 16:30:21',
  },
  {
    commentId: 'FC20250508001',
    orderNo: 'FO20250507001',
    userName: '张小飞',
    userAvatar:
      'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    homeName: '暖心宠物之家',
    commentScore: 4,
    commentContent: '服务很好，就是价格略高，性价比一般',
    commentImg: '',
    commentTime: '2025-05-08 14:15:30',
  },
])

// 分页事件（仅静态）
const handleSizeChange = (val: number) => {
  pageSize.value = val
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 操作事件（仅静态）
const handleDelete = (row: any) => {
  console.log('删除评价:', row)
}
</script>

<style scoped lang="scss">
// 全局容器（统一风格）
.foster-comment-container {
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

// 筛选区（统一风格）
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

// 评价列表（统一风格，新增评价图片/星级样式）
.main-content-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;
}

.comment-table {
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

  .score-star {
    display: flex;
    align-items: center;
    color: #e8a87c;
  }

  .comment-content {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: #6b5b45;
    line-height: 1.5;

    .comment-img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .delete-btn {
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #721c24;
    border-radius: 6px;
  }
}

// 分页（统一风格）
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
