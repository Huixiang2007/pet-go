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
            <el-select
              v-model="userType"
              placeholder="请选择用户类型"
              class="filter-select"
              size="default"
              @change="handleUserTypeChange"
            >
              <el-option label="已认证用户" value="verified" />
              <el-option label="待审核用户" value="unverified" />
              <el-option label="所有用户" value="all" />
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入用户名/邮箱搜索"
              size="default"
              prefix-icon="Search"
              class="search-input"
            />
          </el-col>
          <el-col :span="8" class="search-btn-group">
            <el-button type="primary" size="default" class="query-btn" @click="fetchUsers">
              <el-icon>
                <Search />
              </el-icon>
              搜索
            </el-button>
            <el-button size="default" class="reset-btn" @click="resetFilters">
              <el-icon>
                <Refresh />
              </el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <LoadingComponent v-if="loading" />
    <!-- 用户列表区 -->
    <div v-else class="user-list-wrapper">
      <el-card class="list-card" shadow="hover">
        <el-table
          :data="userList"
          border
          stripe
          class="user-table"
          :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
        >
          <el-table-column prop="account" label="账号" min-width="80" />
          <el-table-column prop="userName" label="用户名" min-width="80">
            <template #default="scope">
              <div class="user-name-item">
                <el-avatar :src="scope.row.avatar" class="user-avatar" loading="lazy" />
                <el-tooltip
                  :content="scope.row.userName"
                  placement="bottom-start"
                  effect="light"
                  :disabled="scope.row.userName.length <= 10"
                >
                  <span class="name-text">{{ scope.row.userName }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名" width="90">
            <template #default="scope">
              {{ scope.row.realName || '暂无' }}
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="100">
            <template #default="scope">
              {{ formatGender(scope.row.gender) }}
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="生日" width="130">
            <template #default="scope">
              {{ scope.row.birthday || '暂无' }}
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="100" />
          <!-- <el-table-column prop="address" label="地址" min-width="50" /> -->
          <el-table-column prop="status" label="认证状态" width="85">
            <template #default="scope">
              <el-tag :type="getAuthStatusType(scope.row)" size="small" class="auth-tag">
                {{ getAuthStatusText(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                icon="View"
                class="view-btn"
                @click="viewUser(scope.row)"
              >
                查看
              </el-button>

              <el-button
                type="danger"
                size="small"
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
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="user-pagination"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <UserDetailDialog
      v-model:visible="dialogVisible"
      :user-detail="currentUserDetail"
      :loading="detailLoading"
      @close="handleClose"
      @approve="() => handleApprove(currentUserDetail.id)"
      @reject="() => handleReject(currentUserDetail.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import {
  approveOrReject,
  getUnAuthUserList,
  getAuthUserList,
  getAllList,
  type UserInfo,
  searchDetail,
  getUserAuthDetail,
  type UserSearchDetail,
} from '@/api/admin/user'
import LoadingComponent from '@/components/common/LoadingStatus.vue'
import UserDetailDialog from '@/views/admin/components/user/DetailBox.vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const loading = ref(false)
const detailLoading = ref(false)
// 用户列表数据
const userList = ref<(UserInfo | UserSearchDetail)[]>([])

const userType = ref('all') // 初始化默认值，与resetFilters保持一致
const dialogVisible = ref(false)
const currentUserDetail = ref<any>(null)
const selectedUser = ref<any>(null)

// 格式化性别显示
const formatGender = (gender: number | undefined) => {
  if (gender === undefined || gender === null) return '暂无'
  if (gender === 1) return '男'
  if (gender === 2) return '女'
  return '暂无'
}
// 获取认证状态显示文本
const getAuthStatusText = (row: UserInfo | UserSearchDetail) => {
  if ('statusDesc' in row) {
    if (row.statusDesc === '审核通过') return '已认证'
    return row.statusDesc
  } else {
    if (row.status !== '待审核') {
      return '已认证'
    } else if (row.status === '待审核') {
      return '待审核'
    } else {
      return '未认证'
    }
  }
}

// 获取认证状态标签类型
const getAuthStatusType = (row: UserInfo | UserSearchDetail) => {
  // 搜索结果使用 statusDesc 字段
  if ('statusDesc' in row) {
    if (row.statusDesc === '审核通过') return 'success'
    else if (row.statusDesc === '待审核') return 'warning'
    else if (row.statusDesc === '未认证') return 'danger'
  }
  // 普通列表使用 status 字段
  else {
    return row.status !== '待审核' ? 'success' : 'warning'
  }
}

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
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    }
    let response: any
    // 如果有搜索关键词，添加到参数中
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
      response = await searchDetail(params)
      console.log('用户列表:', response)
      if (response.code === 0) {
        userList.value = response.data.list
        total.value = response.data.total || 0
      }
    } else {
      if (userType.value === 'unverified') {
        // 获取未认证用户列表
        response = await getUnAuthUserList(params)
      } else if (userType.value === 'verified') {
        response = await getAuthUserList(params)
      } else {
        // 获取所有用户列表
        response = await getAllList(params)
      }

      console.log('用户列表:', response)
      if (response.code === 0) {
        userList.value = response.data.list
        total.value = response.data.total || 0
      }
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
const viewUser = async (row: UserInfo|UserSearchDetail) => {
  selectedUser.value = row
  dialogVisible.value = true
  detailLoading.value = true
  try {
    const id='authRecordId' in row ? row.authRecordId : row.id;
    const response = await getUserAuthDetail(id)
    if (response.code === 0) {
      currentUserDetail.value = response.data || {
        id: 0,
        realName: '',
        idCard: '',
        address: '',
        birthday: '',
        gender: 1,
        pictureUrl: '',
        status: '',
      }
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
  } finally {
    detailLoading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  currentUserDetail.value = null
  selectedUser.value = null
}
// 处理认证通过
const handleApprove = async (id: number) => {
  try {
    const response = await approveOrReject(id, '通过')
    if (response.code === 0) {
      ElMessage.success('认证通过成功')
      handleClose()
      fetchUsers() // 刷新列表
    } else {
      ElMessage.error(response.msg || '认证通过失败')
    }
  } catch (error) {
    console.error('认证通过失败:', error)
  }
}

// 处理认证拒绝
const handleReject = async (id: number) => {
  try {
    const response = await approveOrReject(id, '拒绝')
    if (response.code === 0) {
      ElMessage.success('已标记为认证失败')
      handleClose()
      fetchUsers()
    } else {
      ElMessage.error(response.msg || '标记失败')
    }
  } catch (error) {
    console.error('标记失败:', error)
  }
}

const disableUser = (row: any) => {
  console.log('禁用用户:', row)
}
</script>

<style scoped lang="scss">
.user-name-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.user-avatar {
  width: 32px;
  height: 32px;
}

.name-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
/* 用户名容器：控制布局 + 省略 */
.user-name-item {
  display: flex; /* 让头像和用户名横向排列 */
  align-items: center; /* 垂直居中 */
  gap: 8px; /* 头像和用户名间距 */
  width: 100%; /* 占满单元格宽度 */
}

/* 用户名文本：超出省略 */
.user-name-item > span:last-child {
  flex: 1; /* 占满剩余空间 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出隐藏 */
  text-overflow: ellipsis; /* 超出显示省略号 */
  position: relative; /* 用于 hover 提示定位 */
  cursor: pointer; /* 鼠标悬浮提示可点击 */
}

/* hover 显示完整用户名（纯 CSS 实现） */
.user-name-item > span:last-child:hover::after {
  content: attr(title); /* 取 title 属性的内容（需在 HTML 中加 title） */
  position: absolute;
  top: 100%; /* 提示框在文本下方 */
  left: 0;
  min-width: max-content; /* 自适应宽度 */
  padding: 4px 8px;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999; /* 防止被遮挡 */
  white-space: nowrap; /* 保证完整显示 */
}
:deep(.el-table--border .el-table__inner-wrapper) {
  cursor: pointer;
}
:deep(.el-table .el-table__cell) {
  text-align: center;
}

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
        .del-btn {
          border-radius: 6px;
          margin: 2px 2px; // 统一按钮间距，删除冗余的 margin-top
        }

        .view-btn {
          background-color: #cce5ff;
          border-color: #cce5ff;
          color: #007bff;
        }

        .del-btn {
          background-color: #fff3cd;
          border-color: #fff3cd;
          color: #856404;
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
