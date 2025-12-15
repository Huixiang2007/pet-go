<template>
  <div class="user-management-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon">
        <User />
      </el-icon>
      <h2>用户管理中心</h2>
    </div>

    <!-- 筛选与搜索区 -->
    <div class="search-filter-wrapper">
      <el-card class="filter-card" shadow="hover">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-select v-model="userType" placeholder="请选择用户类型" class="filter-select" size="large" @change="handleUserTypeChange">
              <el-option label="已认证用户" value="verified" />
              <el-option label="待审核用户" value="unverified" />

            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input v-model="searchKeyword" placeholder="请输入用户名/手机号/邮箱搜索" size="large" prefix-icon="Search"
              class="search-input" />
          </el-col>
          <el-col :span="8" class="search-btn-group">
            <el-button type="primary" size="large" class="query-btn" @click="fetchUsers">
              <el-icon>
                <Search />
              </el-icon> 搜索
            </el-button>
            <el-button size="large" class="reset-btn" @click="resetFilters">
              <el-icon>
                <Refresh />
              </el-icon> 重置
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 用户列表区 -->
    <div class="user-list-wrapper">
      <el-card class="list-card" shadow="hover">
        <el-table :data="userList" border stripe class="user-table"
          :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }">
          <el-table-column prop="account" label="账号" min-width="80" />
          <el-table-column prop="userName" label="用户名" min-width="80">
            <template #default="scope">
              <div class="user-name-item">
                <el-avatar :src="scope.row.avatar" class="user-avatar" />
                <span>{{ scope.row.userName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名" width="130" />
          <el-table-column prop="gender" label="性别" width="100" >
             <template #default="scope">
              {{ formatGender(scope.row.gender) }}
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="生日" width="130" />
          <el-table-column prop="email" label="邮箱" min-width="100" />
          <el-table-column prop="address" label="所在省份" min-width="50" />
          <el-table-column prop="status" label="认证状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status!='待审核' ? 'success' : 'danger'" size="small" class="auth-tag">
                {{ scope.row.status!= '待审核' ? '已认证' : '未认证' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="View" class="view-btn" @click="viewUser(scope.row)">
                查看
              </el-button>
              <el-button type="warning" size="small" icon="Edit" class="edit-btn" @click="editUser(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" icon="Delete" class="del-btn" @click="disableUser(scope.row)">
                禁用
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-wrapper">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" class="user-pagination">
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { User, Search, Refresh } from '@element-plus/icons-vue'
import request from '@/utils/request'

const loading = ref(false)

// 用户列表数据
const userList = ref([])
// 筛选条件

const searchKeyword = ref('')
const userType = ref('unverified')
// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 格式化性别显示
const formatGender = (gender: number | undefined) => {
  if (gender === undefined || gender === null) return '未知';
  if (gender === 1) return '男';
  if (gender === 2) return '女';
  return '未知';
};


// 页面加载完成时，请求用户列表数据
onMounted(() => {
  fetchUsers()
})

// 分页事件
const handleSizeChange = (val: number) => {
  pageSize.value = val
    fetchUsers()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
    fetchUsers()
}
// 用户类型变化时的处理函数
const handleUserTypeChange = () => {
  currentPage.value = 1 // 重置到第一页
  fetchUsers()
}
// 重置筛选条件
const resetFilters = () => {
  searchKeyword.value = ''
  userType.value = 'unverified'
  currentPage.value = 1
  fetchUsers()
}
const fetchUsers = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 如果有搜索关键词，添加到参数中
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    let response
    // 根据用户类型选择不同的接口
    if (userType.value === 'unverified') {
      // 获取未认证用户列表
      response = await request('/server/api/user/getUnAuthUserList', 'GET', params)
    } else {
      response = await request('/server/api/user/getAuthUserList', 'GET', params)
    }
    console.log('用户列表:', response)
    if (response.code === 0) {
      userList.value = response.data.list
      total.value = response.data.total ||  0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    // 出错时清空列表
    userList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
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
.el-table .cell {
    font-size: 17px;
    box-sizing: border-box;
    line-height: 63px;
    overflow: hidden;
    overflow-wrap: break-word;
    padding: 0 12px;
    text-overflow: ellipsis;
    white-space: normal;
}
// 全局容器
.user-management-container {
  padding: 20px;
  background-color: #faf6f0;
  min-height: 100vh;

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
      padding: 15px; // 补充内边距，避免筛选内容贴边

      .filter-select,
      .search-input {
        border-radius: 8px;
        border-color: #e8d6c4;
        width: 100%; // 补充宽度，适配布局
      }

      .search-btn-group {
        display: flex;
        gap: 10px;
        justify-content: flex-end; // 补充右对齐，符合筛选按钮习惯

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
      padding: 15px; // 补充内边距

      // 表格样式 - 修正 Element 变量写法
      .user-table {
        border-radius: 8px;
        overflow: hidden;

        // 把 CSS 自定义属性移到单独的 &::v-deep 或直接用内联样式（避免 SCSS 编译冲突）
        :deep(.el-table) {
          --el-table-border-color: #e8d6c4;
          --el-table-hover-row-bg-color: #fff9f2;
        }

        .user-name-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .user-avatar {
            width: 30px;
            height: 30px;
            border: 1px solid #f0e6dc;
            border-radius: 50%; // 补充圆形头像，贴合治愈风格
          }
        }

        .type-tag,
        .auth-tag {
          border-radius: 6px;
        }

        // 按钮样式统一
        .view-btn,
        .edit-btn,
        .del-btn {
          border-radius: 6px;
          margin: 0 2px; // 统一按钮间距，删除冗余的 margin-top
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

        .del-btn {
          background-color: #f8d7da;
          border-color: #f8d7da;
          color: #dc3545;
        }
      }

      // 分页样式
      .pagination-wrapper {
        margin-top: 20px;
        display: flex;
        justify-content: center;


        :deep(.user-pagination) {
          --el-pagination-button-bg-color: #fff;
          --el-pagination-button-border-color: #e8d6c4;
          --el-pagination-text-color: #6b5b45;
          --el-pagination-active-color: #e8a87c;
        }
      }
    }
  }

  // 响应式适配（补充，避免小屏布局错乱）
  @media (max-width: 768px) {
    padding: 10px;

    .search-filter-wrapper .filter-card .search-btn-group {
      flex-wrap: wrap;
    }

    .user-table {
      font-size: 12px;
    }
  }
}
</style>