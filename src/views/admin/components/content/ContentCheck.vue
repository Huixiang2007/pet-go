<template>
  <div class="content-audit-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><EditPen /></el-icon>
      <h2>内容管理 - 内容审核</h2>
    </div>

    <!-- 功能标签页 -->
    <el-card class="main-card" shadow="hover">
      <el-tabs v-model="activeTab" type="border-card" class="content-tabs">
        <!-- 内容审核标签页 -->
        <el-tab-pane label="内容审核" name="audit">
          <div class="tab-content">
            <!-- 审核筛选区 -->
            <div class="filter-bar">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-select
                    v-model="contentType"
                    placeholder="选择内容类型"
                    size="small"
                    class="filter-select"
                  >
                    <el-option label="全部类型" value="" />
                    <el-option label="宠物攻略" value="strategy" />
                    <el-option label="日常动态" value="dynamic" />
                    <el-option label="旅行游记" value="travel" />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select
                    v-model="auditStatus"
                    placeholder="选择审核状态"
                    size="small"
                    class="filter-select"
                  >
                    <el-option label="全部状态" value="" />
                    <el-option label="待审核" value="pending" />
                    <el-option label="已通过" value="passed" />
                    <el-option label="已打回" value="rejected" />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="searchKeyword"
                    placeholder="搜索内容标题/用户昵称"
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

            <!-- 审核列表 -->
            <el-table
              :data="auditList"
              border
              stripe
              class="audit-table"
              :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
            >
              <el-table-column prop="id" label="内容ID" width="100" />
              <el-table-column prop="title" label="内容标题" min-width="200">
                <template #default="scope">
                  <div class="content-title-item">
                    <el-image
                      :src="scope.row.coverImg"
                      class="content-cover"
                      fit="cover"
                    />
                    <span class="title-text">{{ scope.row.title }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="author" label="发布者" width="120">
                <template #default="scope">
                  <div class="author-item">
                    <el-avatar :src="scope.row.authorAvatar" class="author-avatar" />
                    <span>{{ scope.row.author }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="内容类型" width="120">
                <template #default="scope">
                  <el-tag size="small" class="type-tag">
                    {{
                      scope.row.type === 'strategy' ? '宠物攻略' :
                      scope.row.type === 'dynamic' ? '日常动态' : '旅行游记'
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="publishTime" label="发布时间" width="180" />
              <el-table-column prop="status" label="审核状态" width="120">
                <template #default="scope">
                  <el-tag
                    :type="
                      scope.row.status === 'pending' ? 'warning' :
                      scope.row.status === 'passed' ? 'success' : 'danger'
                    "
                    size="small"
                    class="status-tag"
                  >
                    {{
                      scope.row.status === 'pending' ? '待审核' :
                      scope.row.status === 'passed' ? '已通过' : '已打回'
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="240" fixed="right">
                <template #default="scope">
                  <el-button
                    type="primary"
                    size="small"
                    class="view-btn"
                    @click="handleViewDetail(scope.row)"
                  >
                    <el-icon><View /></el-icon> 详情
                  </el-button>
                  <el-button
                    v-if="scope.row.status === 'pending'"
                    type="success"
                    size="small"
                    class="pass-btn"
                    @click="handlePass(scope.row)"
                  >
                    <el-icon><Check /></el-icon> 通过
                  </el-button>
                  <el-button
                    v-if="scope.row.status === 'pending'"
                    type="danger"
                    size="small"
                    class="reject-btn"
                    @click="handleReject(scope.row)"
                  >
                    <el-icon><Close /></el-icon> 打回
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
                :total="auditTotal"
                class="content-pagination"
              />
            </div>
          </div>
        </el-tab-pane>

        <!-- 内容推荐标签页 -->
        <el-tab-pane label="内容推荐" name="recommend">
          <div class="tab-content">
            <!-- 推荐操作区 -->
            <div class="recommend-operate-bar">
              <el-button type="primary" class="add-recommend-btn">
                <el-icon><Star /></el-icon> 新增推荐内容
              </el-button>
            </div>

            <!-- 推荐列表 -->
            <el-table
              :data="recommendList"
              border
              stripe
              class="recommend-table"
              :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
            >
              <el-table-column prop="id" label="推荐ID" width="100" />
              <el-table-column prop="contentTitle" label="内容标题" min-width="200">
                <template #default="scope">
                  <div class="content-title-item">
                    <el-image
                      :src="scope.row.contentCover"
                      class="content-cover"
                      fit="cover"
                    />
                    <span class="title-text">{{ scope.row.contentTitle }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="recommendType" label="推荐位置" width="120">
                <template #default="scope">
                  <el-tag size="small" class="recommend-tag">
                    {{
                      scope.row.recommendType === 'home_top' ? '首页置顶' :
                      scope.row.recommendType === 'home_hot' ? '首页热门' : '社区精选'
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="recommendTime" label="推荐时间" width="180" />
              <el-table-column prop="expireTime" label="到期时间" width="180" />
              <el-table-column prop="status" label="推荐状态" width="120">
                <template #default="scope">
                  <el-tag
                    :type="scope.row.status === 'active' ? 'success' : 'warning'"
                    size="small"
                    class="status-tag"
                  >
                    {{ scope.row.status === 'active' ? '生效中' : '已过期' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button
                    type="warning"
                    size="small"
                    class="edit-btn"
                    @click="handleEditRecommend(scope.row)"
                  >
                    <el-icon><Edit /></el-icon> 编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    class="cancel-btn"
                    @click="handleCancelRecommend(scope.row)"
                  >
                    <el-icon><Delete /></el-icon> 取消
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-wrapper">
              <el-pagination
                @size-change="handleRecommendSizeChange"
                @current-change="handleRecommendCurrentChange"
                :current-page="recommendCurrentPage"
                :page-sizes="[10, 20, 50]"
                :page-size="recommendPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="recommendTotal"
                class="content-pagination"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 审核详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="内容审核详情"
      width="800px"
      class="detail-dialog"
      :close-on-click-modal="false"
    >
      <div class="detail-content">
        <div class="detail-header">
          <el-image :src="currentContent.coverImg" class="detail-cover" fit="cover" />
          <div class="detail-header-info">
            <h3 class="detail-title">{{ currentContent.title }}</h3>
            <div class="detail-meta">
              <span class="detail-author">
                <el-avatar :src="currentContent.authorAvatar" class="detail-author-avatar" />
                {{ currentContent.author }}
              </span>
              <span class="detail-type">
                <el-tag size="small">{{
                  currentContent.type === 'strategy' ? '宠物攻略' :
                  currentContent.type === 'dynamic' ? '日常动态' : '旅行游记'
                }}</el-tag>
              </span>
              <span class="detail-time">{{ currentContent.publishTime }}</span>
            </div>
          </div>
        </div>
        <div class="detail-body">
          <div class="detail-content-text">{{ currentContent.content }}</div>
          <div class="detail-img-group" v-if="currentContent.contentImgs.length">
            <el-image
              v-for="(img, idx) in currentContent.contentImgs"
              :key="idx"
              :src="img"
              class="detail-content-img"
              preview-src-list="currentContent.contentImgs"
              fit="cover"
            />
          </div>
        </div>
      </div>
      <div class="detail-footer">
        <el-input
          v-model="auditRemark"
          type="textarea"
          rows="3"
          placeholder="输入审核备注（打回时必填）"
          class="audit-remark-input"
        />
        <div class="detail-btn-group">
          <el-button @click="detailDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleRejectConfirm">打回</el-button>
          <el-button type="success" @click="handlePassConfirm">通过</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'


// 标签页状态
const activeTab = ref('audit')

// 审核筛选条件
const contentType = ref('')
const auditStatus = ref('')
const searchKeyword = ref('')

// 审核列表分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const auditTotal = ref(45)

// 推荐列表分页参数
const recommendCurrentPage = ref(1)
const recommendPageSize = ref(10)
const recommendTotal = ref(18)
import addPicImage from '@/assets/img/addPic.png'
// 审核列表模拟数据
const auditList = ref([
  {
    id: 'CONT2025001',
    title: '新手养猫必备攻略：疫苗与驱虫全指南',
    coverImg: addPicImage,
    author: '罗小黑',
    authorAvatar: addPicImage,
    type: 'strategy',
    publishTime: '2025-05-12 10:23:45',
    status: 'pending'
  },
  {
    id: 'CONT2025002',
    title: '我家柴犬的日常拆家瞬间',
    coverImg: addPicImage,
    author: '张小飞',
    authorAvatar: addPicImage,
    type: 'dynamic',
    publishTime: '2025-05-11 16:45:12',
    status: 'pending'
  },
  {
    id: 'CONT2025003',
    title: '带猫咪去云南旅行的宠物友好路线',
    coverImg: addPicImage,
    author: '欧阳修',
    authorAvatar: addPicImage,
    type: 'travel',
    publishTime: '2025-05-10 09:12:33',
    status: 'passed'
  },
  {
    id: 'CONT2025004',
    title: '狗狗挑食怎么办？教你3招解决',
    coverImg: addPicImage,
    author: '诸葛暗',
    authorAvatar: addPicImage,
    type: 'strategy',
    publishTime: '2025-05-09 14:36:21',
    status: 'rejected'
  },
  {
    id: 'CONT2025005',
    title: '猫咪和狗狗的和谐相处日常',
    coverImg:addPicImage,
    author: '开羽',
    authorAvatar: addPicImage,
    type: 'dynamic',
    publishTime: '2025-05-08 11:22:55',
    status: 'passed'
  }
])

// 推荐列表模拟数据
const recommendList = ref([
  {
    id: 'REC2025001',
    contentTitle: '新手养猫必备攻略：疫苗与驱虫全指南',
    contentCover: addPicImage,
    recommendType: 'home_top',
    recommendTime: '2025-05-12 11:30:45',
    expireTime: '2025-05-19 11:30:45',
    status: 'active'
  },
  {
    id: 'REC2025002',
    contentTitle: '带猫咪去云南旅行的宠物友好路线',
    contentCover: addPicImage,
    recommendType: 'home_hot',
    recommendTime: '2025-05-11 15:20:33',
    expireTime: '2025-05-18 15:20:33',
    status: 'active'
  },
  {
    id: 'REC2025003',
    contentTitle: '猫咪和狗狗的和谐相处日常',
    contentCover:addPicImage,
    recommendType: 'community_hot',
    recommendTime: '2025-05-10 09:45:12',
    expireTime: '2025-05-17 09:45:12',
    status: 'expired'
  }
])

// 审核详情弹窗
const detailDialogVisible = ref(false)
const auditRemark = ref('')
const currentContent = reactive({
  title: '',
  coverImg: '',
  author: '',
  authorAvatar: '',
  type: '',
  publishTime: '',
  content: '',
  contentImgs: [] as string[]
})

// 分页事件
const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }
const handleRecommendSizeChange = (val: number) => { recommendPageSize.value = val }
const handleRecommendCurrentChange = (val: number) => { recommendCurrentPage.value = val }

// 审核操作事件
const handleViewDetail = (row: any) => {
  Object.assign(currentContent, {
    ...row,
    content: '这里是内容详情，包含宠物攻略的具体内容、日常动态的趣事描述或旅行游记的详细行程。可以是很长的富文本内容，支持图片、文字等混合排版。',
    contentImgs: [addPicImage, addPicImage]
  })
  detailDialogVisible.value = true
}
const handlePass = (row: any) => { console.log('通过审核:', row) }
const handleReject = (row: any) => {
  handleViewDetail(row)
}
const handlePassConfirm = () => {
  console.log('确认通过，备注:', auditRemark.value)
  detailDialogVisible.value = false
  auditRemark.value = ''
}
const handleRejectConfirm = () => {
  if (!auditRemark.value) {
    alert('打回需填写备注')
    return
  }
  console.log('确认打回，备注:', auditRemark.value)
  detailDialogVisible.value = false
  auditRemark.value = ''
}

// 推荐操作事件
const handleEditRecommend = (row: any) => { console.log('编辑推荐:', row) }
const handleCancelRecommend = (row: any) => { console.log('取消推荐:', row) }
</script>

<style scoped lang="scss">
// 全局容器
.content-audit-container {
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

// 主卡片
.main-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;

  .content-tabs {
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

    .reset-btn {
      border-radius: 6px;
      border-color: #e8d6c4;
      color: #6b5b45;
    }
  }
}

// 审核列表
.audit-table, .recommend-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-row-bg-color: #fff9f2;
  border-radius: 8px;
  overflow: hidden;

  .content-title-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .content-cover {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #f0e6dc;
    }

    .title-text {
      color: #6b5b45;
      line-height: 1.2;
    }
  }

  .author-item, .detail-author {
    display: flex;
    align-items: center;
    gap: 6px;

    .author-avatar, .detail-author-avatar {
      width: 24px;
      height: 24px;
      border: 1px solid #f0e6dc;
      border-radius: 50%;
    }
  }

  .type-tag {
    background-color: #ffeaa7;
    color: #fd7e14;
    border-radius: 6px;
  }

  .recommend-tag {
    background-color: #c3e6cb;
    color: #28a745;
    border-radius: 6px;
  }

  .status-tag {
    border-radius: 6px;
  }

  // 操作按钮
  .view-btn, .pass-btn, .reject-btn, .edit-btn, .cancel-btn {
    border-radius: 6px;
    margin: 0 2px;
  }

  .view-btn {
    background-color: #c3e6cb;
    border-color: #c3e6cb;
    color: #28a745;
  }

  .pass-btn {
    background-color: #d4edda;
    border-color: #d4edda;
    color: #155724;
  }

  .reject-btn {
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #721c24;
  }

  .edit-btn {
    background-color: #ffeaa7;
    border-color: #ffeaa7;
    color: #fd7e14;
  }

  .cancel-btn {
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #dc3545;
  }
}

// 推荐操作区
.recommend-operate-bar {
  margin-bottom: 15px;
  text-align: right;

  .add-recommend-btn {
    background-color: #e8a87c;
    border-color: #e8a87c;
    border-radius: 8px;
    padding: 8px 20px;
  }
}

// 分页
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .content-pagination {
    --el-pagination-button-bg-color: #fff;
    --el-pagination-button-border-color: #e8d6c4;
    --el-pagination-text-color: #6b5b45;
    --el-pagination-active-color: #e8a87c;
  }
}

// 详情弹窗
.detail-dialog {
  --el-dialog-border-radius: 12px;
  --el-dialog-title-color: #6b5b45;

  .detail-content {
    .detail-header {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e8d6c4;

      .detail-cover {
        width: 120px;
        height: 80px;
        border-radius: 8px;
      }

      .detail-header-info {
        flex: 1;

        .detail-title {
          margin: 0 0 10px 0;
          color: #3e2723;
          font-size: 16px;
        }

        .detail-meta {
          display: flex;
          gap: 15px;
          align-items: center;
          font-size: 12px;
          color: #9e7d66;
        }
      }
    }

    .detail-body {
      .detail-content-text {
        line-height: 1.6;
        color: #6b5b45;
        margin-bottom: 15px;
      }

      .detail-img-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        .detail-content-img {
          width: 120px;
          height: 120px;
          border-radius: 6px;
        }
      }
    }
  }

  .audit-remark-input {
    border-radius: 8px;
    border-color: #e8d6c4;
    margin-bottom: 15px;
  }

  .detail-btn-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .content-audit-container {
    padding: 10px;
  }

  .filter-bar {
    .filter-btn-group {
      flex-wrap: wrap;
    }
  }

  .detail-dialog {
    width: 95% !important;

    .detail-header {
      flex-direction: column;
    }
  }
}
</style>