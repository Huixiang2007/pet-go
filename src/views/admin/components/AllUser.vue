<template>
  <div class="user-management-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><User /></el-icon>
      <h2>用户管理中心</h2>
    </div>

    <!-- 筛选与搜索区 -->
    <div class="search-filter-wrapper">
      <el-card class="filter-card" shadow="hover">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-select
              v-model="userType"
              placeholder="请选择用户类型"
              class="filter-select"
              size="small"
            >
              <el-option label="全部用户" value="" />
              <el-option label="普通用户" value="normal" />
              <el-option label="寄养商家" value="foster" />
              <el-option label="电商卖家" value="seller" />
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入用户名/手机号/邮箱搜索"
              size="small"
              prefix-icon="Search"
              class="search-input"
            />
          </el-col>
          <el-col :span="8" class="search-btn-group">
            <el-button type="primary" size="small" class="query-btn">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button size="small" class="reset-btn">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 用户列表区 -->
    <div class="user-list-wrapper">
      <el-card class="list-card" shadow="hover">
        <el-table
          :data="userList"
          border
          stripe
          class="user-table"
          :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
        >
          <el-table-column prop="id" label="用户ID" width="80" />
          <el-table-column prop="username" label="用户名" min-width="100">
            <template #default="scope">
              <div class="user-name-item">
                <el-avatar :src="scope.row.avatar" class="user-avatar" />
                <span>{{ scope.row.username }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名" width="100" />
          <el-table-column prop="phone" label="手机号" width="120" />
          <el-table-column prop="email" label="邮箱" min-width="150" />
          <el-table-column prop="userType" label="用户类型" width="100">
            <template #default="scope">
              <el-tag
                :type="
                  scope.row.userType === 'normal'
                    ? 'info'
                    : scope.row.userType === 'foster'
                    ? 'success'
                    : 'warning'
                "
                size="small"
                class="type-tag"
              >
                {{
                  scope.row.userType === 'normal'
                    ? '普通用户'
                    : scope.row.userType === 'foster'
                    ? '寄养商家'
                    : '电商卖家'
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="authStatus" label="认证状态" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.authStatus ? 'success' : 'danger'"
                size="small"
                class="auth-tag"
              >
                {{ scope.row.authStatus ? '已认证' : '未认证' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                size="samll"
                icon="View"
                class="view-btn"
                 @click="viewUser(scope.row)"
              >
                查看
              </el-button>
              <el-button
                type="warning"
                size="samll"
                icon="Edit"
                class="edit-btn"
                @click="editUser(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="samll"
                icon="Delete"
                class="del-btn"
                
                @click="disableUser(scope.row)"
            
              >
                禁用
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-wrapper">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="user-pagination"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Search, Refresh} from '@element-plus/icons-vue'

// 筛选条件
const userType = ref('')
const searchKeyword = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 模拟用户列表数据
const userList = ref([
  {
    id: 'a20250001',
    username: '罗小黑',
    realName: '罗小黑',
    phone: '17821044XXX',
    email: '352173371@qq.com',
    avatar: 'http://8.13XXX/avatar1.png',
    userType: 'normal',
    authStatus: true
  },
  {
    id: 'a20250002',
    username: '张小飞',
    realName: '张小飞',
    phone: '187034078XX',
    email: '2711918392@qq.com',
    avatar: 'http://8.13XXX/avatar2.png',
    userType: 'foster',
    authStatus: true
  },
  {
    id: 'a20250003',
    username: '欧阳修',
    realName: '欧阳修',
    phone: '19836248XXX',
    email: '2711918393@qq.com',
    avatar: 'http://8.13XXX/avatar3.png',
    userType: 'seller',
    authStatus: false
  },
  {
    id: 'a20250004',
    username: '诸葛暗',
    realName: '诸葛暗',
    phone: '17702505XXX',
    email: '2713318393@qq.com',
    avatar: 'http://8.13XXX/avatar4.png',
    userType: 'normal',
    authStatus: true
  },
  {
    id: 'a20250005',
    username: '开羽',
    realName: '开羽',
    phone: '156320145XX',
    email: '2713317393@qq.com',
    avatar: 'http://8.13XXX/avatar5.png',
    userType: 'foster',
    authStatus: false
  }
])

// 分页事件
const handleSizeChange = (val: number) => {
  pageSize.value = val
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}
// 操作按钮事件
const viewUser = (row: any) => {
  console.log('查看用户:', row)
}

const editUser = (row: any) => {
  console.log('编辑用户:', row)
}

const disableUser = (row: any) => {
  console.log('禁用用户:', row)
}
</script>

<style scoped lang="scss">
// 全局容器
.user-management-container {
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
    font-size: 24px;
    color: #e8a87c;
    margin-right: 10px;
  }
  h2 {
    margin: 0;
    color: #6b5b45;
    font-weight: 600;
  }
}

// 筛选搜索区
.search-filter-wrapper {
  margin-bottom: 20px;
  .filter-card {
    border-radius: 12px;
    border: none;
    background-color: #fff9f2;
    .filter-select,
    .search-input {
      border-radius: 8px;
      border-color: #e8d6c4;
    }
    .search-btn-group {
      display: flex;
      gap: 10px;
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
}

// 用户列表区
.user-list-wrapper {
  .list-card {
    border-radius: 12px;
    border: none;
    background-color: #fff;
    // 表格样式
    .user-table {
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

      .type-tag {
        border-radius: 6px;
      }

      .auth-tag {
        border-radius: 6px;
      }

      .view-btn {
        background-color: #c3e6cb;
        border-color: #c3e6cb;
        color: #28a745;
        border-radius: 6px;
      }

      .edit-btn {
        background-color: #ffeaa7;
        border-color: #ffeaa7;
        color: #fd7e14;
        border-radius: 6px;
      }

      .del-btn {
        background-color: #f8d7da;
        border-color: #f8d7da;
        color: #dc3545;
        border-radius: 6px;
      }
    }

    // 分页样式
    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      .user-pagination {
        --el-pagination-button-bg-color: #fff;
        --el-pagination-button-border-color: #e8d6c4;
        --el-pagination-text-color: #6b5b45;
        --el-pagination-active-color: #e8a87c;
      }
    }
  }
}
</style>