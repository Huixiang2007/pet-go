<template>
  <div class="notice-publish-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><Bell /></el-icon>
      <h2>系统管理 - 通知发布</h2>
    </div>

    <!-- 主内容卡片 -->
    <el-card class="main-card" shadow="hover">
      <el-tabs v-model="activeTab" type="border-card" class="notice-tabs">
        <!-- 发布新通知标签页 -->
        <el-tab-pane label="发布新通知" name="publish">
          <div class="tab-content">
            <el-form
              :model="noticeForm"
              label-width="100px"
              class="notice-form"
            >
              <!-- 通知基本信息 -->
              <div class="form-section">
                <h3 class="section-title">
                  <el-icon class="section-icon"><EditPen /></el-icon> 通知基本信息
                </h3>
              </div>

              <el-form-item label="通知标题" prop="title">
                <el-input
                  v-model="noticeForm.title"
                  placeholder="输入通知标题（如：国庆寄养活动延期通知）"
                  maxlength="30"
                  show-word-limit
                  class="form-input"
                />
              </el-form-item>

              <el-form-item label="通知类型" prop="type">
                <el-select
                  v-model="noticeForm.type"
                  placeholder="选择通知类型"
                  class="form-select"
                >
                  <el-option label="系统公告" value="system" />
                  <el-option label="活动通知" value="activity" />
                  <el-option label="温馨提示" value="reminder" />
                  <el-option label="紧急通知" value="urgent" />
                </el-select>
              </el-form-item>

              <el-form-item label="发布范围" prop="range">
                <el-radio-group v-model="noticeForm.range" class="range-group">
                  <el-radio label="全体用户" border class="range-radio" />
                  <el-radio label="普通用户" border class="range-radio" />
                  <el-radio label="寄养商家" border class="range-radio" />
                  <el-radio label="电商卖家" border class="range-radio" />
                </el-radio-group>
              </el-form-item>

              <el-form-item label="发布时间" prop="publishTime">
                <el-radio-group v-model="noticeForm.timeType" class="time-group">
                  <el-radio label="立即发布" border class="time-radio" />
                  <el-radio label="定时发布" border class="time-radio" />
                </el-radio-group>
                <el-date-picker
                  v-if="noticeForm.timeType === '定时发布'"
                  v-model="noticeForm.publishTime"
                  type="datetime"
                  placeholder="选择定时发布时间"
                  class="time-picker"
                />
              </el-form-item>

              <!-- 通知内容编辑 -->
              <div class="form-section">
                <h3 class="section-title">
                  <el-icon class="section-icon"><Document /></el-icon> 通知内容编辑
                </h3>
              </div>

              <el-form-item label="通知内容" prop="content">
                <el-input
                  v-model="noticeForm.content"
                  type="textarea"
                  :rows="8"
                  placeholder="输入通知详细内容（支持换行，可填写活动规则/系统变更/温馨提示等）"
                  class="form-textarea"
                />
              </el-form-item>

              <el-form-item label="弹窗提醒">
                <el-switch
                  v-model="noticeForm.isPopup"
                  active-text="开启"
                  inactive-text="关闭"
                  active-color="#e8a87c"
                  inactive-color="#e8d6c4"
                />
                <span class="switch-tip">开启后用户登录时将弹窗展示该通知</span>
              </el-form-item>

              <!-- 通知预览 -->
              <div class="form-section">
                <h3 class="section-title">
                  <el-icon class="section-icon"><View /></el-icon> 通知预览
                </h3>
              </div>

              <el-card class="preview-card" shadow="hover">
                <div class="preview-header">
                  <el-tag
                    :type="getTagType()"
                    class="preview-tag"
                  >
                    {{ getTypeName() }}
                  </el-tag>
                  <h4 class="preview-title">{{ noticeForm.title || '【请输入通知标题】' }}</h4>
                </div>
                <div class="preview-content">
                  {{ noticeForm.content || '这里将实时预览你编辑的通知内容...' }}
                </div>
                <div class="preview-footer">
                  <span class="preview-time">
                    发布时间：{{ noticeForm.timeType === '立即发布' ? '发布后立即生效' : noticeForm.publishTime || '【请选择定时时间】' }}
                  </span>
                  <span class="preview-range">
                    发布范围：{{ noticeForm.range }}
                  </span>
                </div>
              </el-card>

              <!-- 提交按钮组 -->
              <el-form-item class="form-btn-group">
                <el-button type="primary" class="publish-btn">
               <el-icon><UploadFilled /></el-icon> 确认发布
                </el-button>
                <el-button type="default" class="save-btn">
                <el-icon><List /></el-icon> 保存草稿
                </el-button>
                <el-button type="default" class="reset-btn">
                  <el-icon><Refresh /></el-icon> 重置表单
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 历史通知管理标签页 -->
        <el-tab-pane label="历史通知管理" name="history">
          <div class="tab-content">
            <!-- 筛选区 -->
            <div class="filter-bar">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-select
                    v-model="historyType"
                    placeholder="选择通知类型"
                    size="small"
                    class="filter-select"
                  >
                    <el-option label="全部类型" value="" />
                    <el-option label="系统公告" value="system" />
                    <el-option label="活动通知" value="activity" />
                    <el-option label="温馨提示" value="reminder" />
                    <el-option label="紧急通知" value="urgent" />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="historyKeyword"
                    placeholder="搜索通知标题"
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
                    <el-icon><Download /></el-icon> 导出记录
                  </el-button>
                </el-col>
              </el-row>
            </div>

            <!-- 历史通知列表 -->
            <el-table
              :data="historyList"
              border
              stripe
              class="history-table"
              :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
            >
              <el-table-column prop="id" label="通知ID" width="100" />
              <el-table-column prop="title" label="通知标题" min-width="180">
                <template #default="scope">
                  <div class="history-title-item">
                    <el-tag
                      :type="getHistoryTagType(scope.row.type)"
                      size="small"
                      class="history-type-tag"
                    >
                      {{ getHistoryTypeName(scope.row.type) }}
                    </el-tag>
                    <span>{{ scope.row.title }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="range" label="发布范围" width="120" />
              <el-table-column prop="publishTime" label="发布时间" width="180" />
              <el-table-column prop="status" label="通知状态" width="120">
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
                    type="primary"
                    size="small"
                    class="view-btn"
                    @click="handleViewHistory(scope.row)"
                  >
                    <el-icon><View /></el-icon> 查看
                  </el-button>
                  <el-button
                    type="warning"
                    size="small"
                    class="edit-btn"
                    @click="handleEditHistory(scope.row)"
                  >
                    <el-icon><Edit /></el-icon> 编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    class="cancel-btn"
                    @click="handleCancelNotice(scope.row)"
                  >
                    <el-icon><Delete /></el-icon> 撤回
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
                :total="historyTotal"
                class="history-pagination"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 发布确认弹窗 -->
    <el-dialog
      v-model="publishDialogVisible"
      title="确认发布通知"
      width="500px"
      class="publish-dialog"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <p class="dialog-tip">你即将发布以下通知，确认发布后将推送至对应用户群体：</p>
        <div class="dialog-preview">
          <h4 class="dialog-title">{{ noticeForm.title }}</h4>
          <p class="dialog-type">通知类型：{{ getTypeName() }}</p>
          <p class="dialog-range">发布范围：{{ noticeForm.range }}</p>
          <p class="dialog-time">发布时间：{{ noticeForm.timeType === '立即发布' ? '立即生效' : noticeForm.publishTime }}</p>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button @click="publishDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPublish">确认发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'


// 标签页状态
const activeTab = ref('publish')

// 发布表单数据
const noticeForm = reactive({
  title: '',
  type: '',
  range: '全体用户',
  timeType: '立即发布',
  publishTime: '' as Date | '',
  content: '',
  isPopup: false
})

// 发布确认弹窗
const publishDialogVisible = ref(false)

// 历史通知筛选条件
const historyType = ref('')
const historyKeyword = ref('')

// 历史通知分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const historyTotal = ref(26)

// 历史通知模拟数据
const historyList = ref([
  {
    id: 'NOT2025001',
    title: '国庆长假宠物寄养8折活动开启',
    type: 'activity',
    range: '全体用户',
    publishTime: '2025-09-25 10:30:45',
    status: 'active'
  },
  {
    id: 'NOT2025002',
    title: '系统将于10月1日凌晨进行维护升级',
    type: 'system',
    range: '全体用户',
    publishTime: '2025-09-28 16:20:33',
    status: 'active'
  },
  {
    id: 'NOT2025003',
    title: '秋季宠物驱虫温馨提示',
    type: 'reminder',
    range: '普通用户',
    publishTime: '2025-09-20 09:45:12',
    status: 'expired'
  },
  {
    id: 'NOT2025004',
    title: '紧急通知：部分寄养家庭资质审核延期',
    type: 'urgent',
    range: '寄养商家',
    publishTime: '2025-09-15 14:15:30',
    status: 'expired'
  },
  {
    id: 'NOT2025005',
    title: '宠物电商新品上架通知',
    type: 'activity',
    range: '电商卖家',
    publishTime: '2025-09-10 11:22:55',
    status: 'active'
  }
])

// 获取通知类型对应的标签样式
const getTagType = () => {
  switch (noticeForm.type) {
    case 'system': return 'primary'
    case 'activity': return 'success'
    case 'reminder': return 'warning'
    case 'urgent': return 'danger'
    default: return 'info'
  }
}

// 获取通知类型名称
const getTypeName = () => {
  switch (noticeForm.type) {
    case 'system': return '系统公告'
    case 'activity': return '活动通知'
    case 'reminder': return '温馨提示'
    case 'urgent': return '紧急通知'
    default: return '未分类通知'
  }
}

// 历史通知标签样式
const getHistoryTagType = (type: string) => {
  switch (type) {
    case 'system': return 'primary'
    case 'activity': return 'success'
    case 'reminder': return 'warning'
    case 'urgent': return 'danger'
    default: return 'info'
  }
}

// 历史通知类型名称
const getHistoryTypeName = (type: string) => {
  switch (type) {
    case 'system': return '系统公告'
    case 'activity': return '活动通知'
    case 'reminder': return '温馨提示'
    case 'urgent': return '紧急通知'
    default: return '未分类'
  }
}

// 分页事件
const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }

// 发布相关事件
const confirmPublish = () => {
  console.log('发布通知:', noticeForm)
  publishDialogVisible.value = false
  // 重置表单
  Object.assign(noticeForm, {
    title: '',
    type: '',
    range: '全体用户',
    timeType: '立即发布',
    publishTime: '',
    content: '',
    isPopup: false
  })
}

// 历史通知操作事件
const handleViewHistory = (row: any) => { console.log('查看历史通知:', row) }
const handleEditHistory = (row: any) => { console.log('编辑历史通知:', row) }
const handleCancelNotice = (row: any) => { console.log('撤回通知:', row) }
</script>

<style scoped lang="scss">
// 全局容器
.notice-publish-container {
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

  .notice-tabs {
    --el-tabs-header-text-color: #6b5b45;
    --el-tabs-active-color: #e8a87c;
    --el-tabs-border-color: #e8d6c4;

    .el-tabs__content {
      padding: 20px 0;
    }
  }
}

// 表单分区标题
.form-section {
  margin: 15px 0;

  .section-title {
    display: flex;
    align-items: center;
    color: #e8a87c;
    font-size: 16px;
    font-weight: 500;
    margin: 0;

    .section-icon {
      margin-right: 8px;
      font-size: 18px;
    }
  }
}

// 发布表单样式
.notice-form {
  .form-input,
  .form-select,
  .form-textarea,
  .time-picker {
    border-radius: 8px;
    border-color: #e8d6c4;
    &:focus-within {
      border-color: #e8a87c;
      box-shadow: 0 0 0 2px rgba(232, 168, 124, 0.1);
    }
  }

  // 单选组样式
  .range-group, .time-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;

    .range-radio, .time-radio {
      border-radius: 8px;
      border-color: #e8d6c4;
      background-color: #fff9f2;
      --el-radio-input-checked-color: #e8a87c;
    }
  }

  // 开关提示
  .switch-tip {
    font-size: 12px;
    color: #9e7d66;
    margin-left: 10px;
  }

  // 预览卡片
  .preview-card {
    border-radius: 8px;
    border-color: #e8d6c4;
    background-color: #fff9f2;
    padding: 15px;
    margin-top: 10px;

    .preview-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #e8d6c4;

      .preview-tag {
        border-radius: 6px;
      }

      .preview-title {
        margin: 0;
        color: #3e2723;
      }
    }

    .preview-content {
      line-height: 1.6;
      color: #6b5b45;
      margin-bottom: 10px;
      min-height: 80px;
    }

    .preview-footer {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #9e7d66;
    }
  }

  // 按钮组
  .form-btn-group {
    display: flex;
    gap: 15px;
    margin-top: 20px;

    .publish-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      border-radius: 8px;
      padding: 8px 20px;
    }

    .save-btn, .reset-btn {
      border-radius: 8px;
      border-color: #e8d6c4;
      color: #6b5b45;
      padding: 8px 20px;
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
    border-radius: 8px;
    border-color: #e8d6c4;
  }

  .filter-btn-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    .query-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      border-radius: 8px;
    }

    .reset-btn, .export-btn {
      border-radius: 8px;
      border-color: #e8d6c4;
      color: #6b5b45;
    }
  }
}

// 历史通知列表
.history-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-row-bg-color: #fff9f2;
  border-radius: 8px;
  overflow: hidden;

  .history-title-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .history-type-tag {
      border-radius: 6px;
    }
  }

  .status-tag {
    border-radius: 6px;
  }

  // 操作按钮
  .view-btn, .edit-btn, .cancel-btn {
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

  .cancel-btn {
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #dc3545;
  }
}

// 分页
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .history-pagination {
    --el-pagination-button-bg-color: #fff;
    --el-pagination-button-border-color: #e8d6c4;
    --el-pagination-text-color: #6b5b45;
    --el-pagination-active-color: #e8a87c;
  }
}

// 发布确认弹窗
.publish-dialog {
  --el-dialog-border-radius: 12px;
  --el-dialog-title-color: #6b5b45;

  .dialog-content {
    .dialog-tip {
      color: #6b5b45;
      margin-bottom: 15px;
    }

    .dialog-preview {
      background-color: #fff9f2;
      padding: 15px;
      border-radius: 8px;

      .dialog-title {
        margin: 0 0 10px 0;
        color: #3e2723;
      }

      .dialog-type, .dialog-range, .dialog-time {
        font-size: 14px;
        color: #6b5b45;
        margin: 5px 0;
      }
    }
  }

  .dialog-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .notice-publish-container {
    padding: 10px;
  }

  .range-group, .time-group {
    flex-direction: column;
  }

  .form-btn-group {
    flex-wrap: wrap;
  }
}
</style>