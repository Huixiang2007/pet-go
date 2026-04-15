<template>
  <div class="notice-publish-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon">
        <Bell />
      </el-icon>
      <h2>系统管理 - 通知发布</h2>
    </div>

    <!-- 主内容卡片 -->
    <el-card class="main-card" shadow="hover">
      <el-tabs v-model="activeTab" type="border-card" class="notice-tabs">
        <!-- 发布新通知标签页 -->
        <el-tab-pane label="发布新通知" name="publish">
          <div class="tab-content">
            <el-form :model="noticeForm" label-width="100px" class="notice-form">
              <!-- 通知基本信息 -->
              <div class="form-section">
                <h3 class="section-title">
                  <el-icon class="section-icon">
                    <EditPen />
                  </el-icon> 通知基本信息
                </h3>
              </div>

              <el-form-item label="通知标题" prop="title">
                <el-input v-model="noticeForm.title" placeholder="输入通知标题（如：国庆寄养活动延期通知）" maxlength="30" show-word-limit
                  class="form-input" />
              </el-form-item>

              <el-form-item label="通知类型" prop="type">
                <el-select v-model="noticeForm.type" placeholder="选择通知类型" class="form-select">
                  <el-option label="系统通知" value="系统通知" />
                  <el-option label="活动通知" value="活动通知" />
                  <el-option label="个人通知" value="个人通知" />
                  <el-option label="其他通知" value="其他通知" />
                </el-select>
              </el-form-item>

              <!-- 发布范围：全体 / 个人 -->
              <el-form-item label="发布范围" prop="range">
                <el-radio-group v-model="noticeForm.range" class="range-group">
                  <el-radio label="全体用户" border class="range-radio" />
                  <el-radio label="个人用户" border class="range-radio" />
                </el-radio-group>

                <!-- 选择个人时显示用户ID输入框 -->
                <el-input v-if="noticeForm.range === '个人用户'" v-model="noticeForm.userId" placeholder="请输入接收用户ID（数字）"
                  style="width: 200px; margin-left: 10px; position: absolute; left:253px;" type="number" />
              </el-form-item>
              <!-- 
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
                  style="width: 200px; margin-left: 10px; position: absolute; left:253px;"
                  class="time-picker"
                />
              </el-form-item> -->
              <!-- 通知内容编辑 -->
              <div class="form-section">
                <h3 class="section-title">
                  <el-icon class="section-icon">
                    <Document />
                  </el-icon> 通知内容编辑
                </h3>
              </div>

              <el-form-item label="通知内容" prop="content">
                <el-input v-model="noticeForm.content" type="textarea" :rows="8"
                  placeholder="输入通知详细内容（支持换行，可填写活动规则/系统变更/温馨提示等）" class="form-textarea" />
              </el-form-item>

              <!-- <el-form-item label="弹窗提醒">
                <el-switch
                  v-model="noticeForm.isPopup"
                  active-text="开启"
                  inactive-text="关闭"
                  active-color="#e8a87c"
                  inactive-color="#e8d6c4"
                />
                <span class="switch-tip">开启后用户登录时将弹窗展示该通知</span>
              </el-form-item> -->

              <!-- 通知预览 -->
              <div class="form-section">
                <h3 class="section-title">
                  <el-icon class="section-icon">
                    <View />
                  </el-icon> 通知预览
                </h3>
              </div>

              <el-card class="preview-card" shadow="hover">
                <div class="preview-header">
                  <el-tag :type="getTagType()" class="preview-tag">
                    {{ noticeForm.type || '【请选择通知类型】' }}
                  </el-tag>
                  <h4 class="preview-title">{{ noticeForm.title || '【请输入通知标题】' }}</h4>
                </div>
                <div class="preview-content">
                  {{ noticeForm.content || '这里将实时预览你编辑的通知内容...' }}
                </div>
                <!-- <div class="preview-footer">
                  <span class="preview-time">
                    发布时间：{{ noticeForm.timeType === '立即发布' ? '发布后立即生效' : noticeForm.publishTime || '【请选择定时时间】' }}
                  </span>
                  <span class="preview-range">
                    发布范围：{{ noticeForm.range }}
                  </span>
                </div> -->
              </el-card>

              <!-- 提交按钮组 -->
              <el-form-item class="form-btn-group">
                <el-button type="primary" class="publish-btn" @click="handlePublish">
                  <el-icon>
                    <UploadFilled />
                  </el-icon> 确认发布
                </el-button>
                <el-button type="default" class="save-btn" @click="resetForm">
                  <el-icon>
                    <Refresh />
                  </el-icon> 重置表单
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 发布确认弹窗 -->
    <el-dialog v-model="publishDialogVisible" title="确认发布通知" width="500px" class="publish-dialog"
      :close-on-click-modal="false">
      <div class="dialog-content">
        <p class="dialog-tip">你即将发布以下通知，确认发布后将推送至对应用户群体：</p>
        <div class="dialog-preview">
          <h4 class="dialog-title">{{ noticeForm.title }}</h4>
          <p class="dialog-type">通知类型：{{ noticeForm.type }}</p>
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
import { ElMessage } from 'element-plus'
import { Bell, EditPen, Document, View, UploadFilled, Refresh } from '@element-plus/icons-vue'
import type { NewsInfo } from '@/api/admin/news'
import { sendBroadcastMessage, sendPrivateMessage } from '@/api/admin/news'

// 标签页状态
const activeTab = ref('publish')

// 发布表单数据
const noticeForm = reactive({
  title: '',
  type: '',
  range: '全体用户',
  timeType: '立即发布',
  publishTime: '' as Date | string,
  content: '',
  isPopup: false,
  userId: 0
})

// 发布确认弹窗
const publishDialogVisible = ref(false)

// 打开发布确认弹窗
const handlePublish = () => {
  if (!noticeForm.title) {
    ElMessage.warning('请输入通知标题')
    return
  }
  if (!noticeForm.type) {
    ElMessage.warning('请选择通知类型')
    return
  }
  if (!noticeForm.content) {
    ElMessage.warning('请输入通知内容')
    return
  }
  publishDialogVisible.value = true
}

// 获取通知类型对应的标签样式
const getTagType = () => {
  switch (noticeForm.type) {
    case '系统通知': return 'danger'
    case '活动通知': return 'success'
    case '个人通知': return 'warning'
    case '其他通知': return 'primary'
    default: return 'info'
  }
}



// 确认发布（调用广播接口）
const confirmPublish = async () => {
  try {
    const params: NewsInfo = {
      messageType: noticeForm.type,
      receiverId: 0,
      messageTitle: noticeForm.title,
      messageContent: noticeForm.content,
      priority: 1,
      attachment: '',
      dataId: ''
    }
    if (noticeForm.range === '个人用户') {
      params.receiverId = Number(noticeForm.userId)
      const res = await sendPrivateMessage(params)
      if (res.code === 0) {
        ElMessage.success('公告发布成功，已推送给个人用户！')
        publishDialogVisible.value = false
        resetForm()
      }

    }

    else {
      const res = await sendBroadcastMessage(params)
      if (res.code === 0) {
        ElMessage.success('公告发布成功，已推送给全体用户！')
        publishDialogVisible.value = false
        resetForm()
      }

    }
  } catch (err) {
    ElMessage.error('发布失败：' + err)
  }
}

// 重置表单
const resetForm = () => {
  noticeForm.title = ''
  noticeForm.type = ''
  noticeForm.range = '全体用户'
  noticeForm.timeType = '立即发布'
  noticeForm.publishTime = ''
  noticeForm.content = ''
  noticeForm.isPopup = false
}
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
  .range-group,
  .time-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;

    .range-radio,
    .time-radio {
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

    .save-btn,
    .reset-btn {
      border-radius: 8px;
      border-color: #e8d6c4;
      color: #6b5b45;
      padding: 8px 20px;
    }
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

      .dialog-type,
      .dialog-range,
      .dialog-time {
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

  .range-group,
  .time-group {
    flex-direction: column;
  }

  .form-btn-group {
    flex-wrap: wrap;
  }
}
</style>