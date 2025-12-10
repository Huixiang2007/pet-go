<template>
  <div class="foster-audit-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><House /></el-icon>
      <h2>寄养服务管理 - 服务审核</h2>
    </div>

    <!-- 通用指标卡片（复用组件） -->
    <FosterStatsCard />

    <!-- 服务审核内容区 -->
    <el-card class="main-content-card" shadow="hover">
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
              v-if="scope.row.status === 'pending'"
              type="success"
              size="small"
              class="pass-btn"
              @click="handlePass(scope.row)"
            >
              通过
            </el-button>
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { House, Search, Refresh, Download} from '@element-plus/icons-vue'
// 导入通用指标卡片组件
import FosterStatsCard from './FosterCard.vue'

// 筛选条件
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
    avatar: ''
  },
  {
    id: 'FS2025002',
    homeName: '汪汪快乐屋',
    contactName: '罗小黑',
    contactPhone: '17821044XXX',
    serviceType: 'dog',
    applyTime: '2025-05-11 16:45:12',
    status: 'passed',
    avatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280'
  },
  {
    id: 'FS2025003',
    homeName: '毛孩子驿站',
    contactName: '欧阳修',
    contactPhone: '19836248XXX',
    serviceType: 'cat',
    applyTime: '2025-05-10 09:12:33',
    status: 'rejected',
    avatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280'
  },
  {
    id: 'FS2025004',
    homeName: '萌宠寄养院',
    contactName: '诸葛暗',
    contactPhone: '17702505XXX',
    serviceType: 'dog',
    applyTime: '2025-05-09 14:36:21',
    status: 'pending',
    avatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280'
  },
  {
    id: 'FS2025005',
    homeName: '宠爱之家',
    contactName: '开羽',
    contactPhone: '156320145XX',
    serviceType: 'cat',
    applyTime: '2025-05-08 11:22:55',
    status: 'passed',
    avatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280'
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
const handleView = (row: any) => { console.log('查看审核详情:', row) }
const handlePass = (row: any) => { console.log('通过审核:', row) }
const handleReject = (row: any) => { console.log('拒绝审核:', row) }
</script>

<style scoped lang="scss">
// 全局容器
.foster-audit-container {
  padding: 20px;
  background-color: #faf6f0;
  min-height: 100vh;
}

// 页面头部（与原风格统一）
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

// 筛选区（与原风格统一）
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

// 审核列表（与原风格统一）
.main-content-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;
}

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
    margin-top:10px;
    margin-left:0px;
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #721c24;
    border-radius: 6px;
  }
}

// 分页（与原风格统一）
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