<template>
  <div class="foster-home-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><HomeFilled /></el-icon>
      <h2>寄养服务管理 - 家庭管理</h2>
    </div>

    <!-- 通用指标卡片（复用组件） -->
    <FosterStatsCard />

    <!-- 家庭管理内容区 -->
    <el-card class="main-content-card" shadow="hover">
      <!-- 家庭筛选区 -->
      <div class="filter-bar">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-select
              v-model="homeType"
              placeholder="请选择家庭类型"
              size="small"
              class="filter-select"
            >
              <el-option label="全部类型" value="" />
              <el-option label="个人家庭" value="personal" />
              <el-option label="机构家庭" value="institution" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="homeStatus"
              placeholder="请选择家庭状态"
              size="small"
              class="filter-select"
            >
              <el-option label="全部状态" value="" />
              <el-option label="正常营业" value="normal" />
              <el-option label="暂停营业" value="paused" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="homeKeyword"
              placeholder="搜索家庭名称/联系人"
              size="small"
              prefix-icon="Search"
              class="search-input"
            />
          </el-col>
          <el-col :span="4" class="filter-btn-group">
            <el-button type="primary" size="small" class="add-btn">
              <el-icon><Plus /></el-icon> 新增
            </el-button>
            <el-button type="primary" size="small" class="query-btn">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 家庭列表 -->
      <el-table
        :data="homeList"
        border
        stripe
        class="home-table"
        :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
      >
        <el-table-column prop="homeId" label="家庭ID" width="100" />
        <el-table-column prop="homeName" label="家庭名称" min-width="120">
          <template #default="scope">
            <div class="home-name-item">
              <el-avatar :src="scope.row.homeAvatar" class="home-avatar" />
              <span>{{ scope.row.homeName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactName" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="homeType" label="家庭类型" width="120">
          <template #default="scope">
            <el-tag size="small" class="type-tag">
              {{ scope.row.homeType === 'personal' ? '个人家庭' : '机构家庭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maxPetCount" label="最大接待数" width="120">
          <template #default="scope">
            <span class="count-text">{{ scope.row.maxPetCount }} 只</span>
          </template>
        </el-table-column>
        <el-table-column prop="homeStatus" label="营业状态" width="120">
          <template #default="scope">
            <el-tag
              :type="scope.row.homeStatus === 'normal' ? 'success' : 'warning'"
              size="small"
              class="status-tag"
            >
              {{ scope.row.homeStatus === 'normal' ? '正常营业' : '暂停营业' }}
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
              :type="scope.row.homeStatus === 'normal' ? 'danger' : 'success'"
              size="small"
              class="status-btn"
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.homeStatus === 'normal' ? '暂停' : '启用' }}
            </el-button>
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              class="edit-btn"
              @click="handleEdit(scope.row)"
            >
              编辑
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
          :total="homeTotal"
          class="foster-pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HomeFilled, Search, Plus } from '@element-plus/icons-vue'
// 导入通用指标卡片组件
import FosterStatsCard from './FosterCard.vue'

// 筛选条件
const homeType = ref('')
const homeStatus = ref('')
const homeKeyword = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const homeTotal = ref(42)

// 模拟家庭列表数据
const homeList = ref([
  {
    homeId: 'FH2025001',
    homeName: '暖心宠物之家',
    homeAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    contactName: '张小飞',
    contactPhone: '187034078XX',
    homeType: 'personal',
    maxPetCount: 5,
    homeStatus: 'normal'
  },
  {
    homeId: 'FH2025002',
    homeName: '汪汪快乐屋',
    homeAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    contactName: '罗小黑',
    contactPhone: '17821044XXX',
    homeType: 'institution',
    maxPetCount: 10,
    homeStatus: 'normal'
  },
  {
    homeId: 'FH2025003',
    homeName: '毛孩子驿站',
    homeAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    contactName: '欧阳修',
    contactPhone: '19836248XXX',
    homeType: 'personal',
    maxPetCount: 3,
    homeStatus: 'paused'
  },
  {
    homeId: 'FH2025004',
    homeName: '萌宠寄养院',
    homeAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    contactName: '诸葛暗',
    contactPhone: '17702505XXX',
    homeType: 'institution',
    maxPetCount: 15,
    homeStatus: 'normal'
  },
  {
    homeId: 'FH2025005',
    homeName: '宠爱之家',
    homeAvatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
    contactName: '开羽',
    contactPhone: '156320145XX',
    homeType: 'personal',
    maxPetCount: 4,
    homeStatus: 'paused'
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
const handleView = (row: any) => { console.log('查看家庭详情:', row) }
const handleEdit = (row: any) => { console.log('编辑家庭信息:', row) }
const handleStatusChange = (row: any) => {
  console.log(`切换状态: ${row.homeStatus === 'normal' ? '暂停' : '启用'}`, row)
}
</script>

<style scoped lang="scss">

// 全局容器（统一风格）
.foster-home-container {
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

// 筛选区（统一风格，新增按钮样式）
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

    .add-btn {
      background-color: #c3e6cb;
      border-color: #c3e6cb;
      color: #28a745;
      border-radius: 6px;
    }

    .query-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      border-radius: 6px;
    }
  }
}

// 家庭列表（统一风格）
.main-content-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;
}

.home-table {
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
    background-color: #ffeaa7;
    color: #fd7e14;
    border-radius: 6px;
  }

  .count-text {
    color: #6b5b45;
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

  .edit-btn {
    margin-left:0px;
    margin-top: 10px;
    background-color: #ffeaa7;
    border-color: #ffeaa7;
    color: #fd7e14;
    border-radius: 6px;
  }

  .status-btn {
   
    border-radius: 6px;
    margin-left: 10px;
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