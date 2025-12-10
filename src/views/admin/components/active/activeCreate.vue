<template>
  <div class="active-create-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><DocumentAdd /></el-icon>
      <h2>运营活动管理 - 活动创建</h2>
    </div>

    <!-- 活动创建表单卡片 -->
    <el-card class="create-card" shadow="hover">
      <el-form
        :model="activeForm"
        label-width="120px"
        class="active-form"
        :rules="activeRules"
      >
        <!-- 活动基本信息 -->
        <div class="form-section">
          <h3 class="section-title">
            <el-icon class="section-icon"><Ticket /></el-icon> 活动基本信息
          </h3>
        </div>

        <el-form-item label="活动标题" prop="title">
          <el-input
            v-model="activeForm.title"
            placeholder="输入活动标题（如：国庆寄养8折优惠）"
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="活动类型" prop="type">
          <el-select
            v-model="activeForm.type"
            placeholder="选择活动类型"
            class="form-select"
          >
            <el-option label="新人优惠券" value="new_user_coupon" />
            <el-option label="节假日促销" value="holiday_discount" />
            <el-option label="邀请有奖" value="invite_reward" />
            <el-option label="内容征集" value="content_collection" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="activeForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="form-date"
          />
        </el-form-item>

        <!-- 活动规则设置 -->
        <div class="form-section">
          <h3 class="section-title">
            <el-icon class="section-icon"><Document /></el-icon> 活动规则设置
          </h3>
        </div>

        <el-form-item label="活动头图" prop="coverImg">
          <el-upload
            class="upload-cover"
            action="#"
            :file-list="coverFileList"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus upload-plus"></i>
          </el-upload>
          <div class="upload-tip">支持JPG/PNG格式，建议尺寸1200*400px</div>
        </el-form-item>

        <el-form-item label="活动规则" prop="rule">
          <el-input
            v-model="activeForm.rule"
            type="textarea"
            :rows="4"
            placeholder="输入活动规则（如：优惠券满200减50，有效期7天）"
            class="form-textarea"
          />
        </el-form-item>

        <el-form-item label="活动描述" prop="desc">
          <el-input
            v-model="activeForm.desc"
            type="textarea"
            :rows="6"
            placeholder="输入活动详情（支持富文本，如活动背景、参与方式）"
            class="form-textarea"
          />
        </el-form-item>

        <!-- 提交按钮区 -->
        <el-form-item class="form-btn-group">
          <el-button type="primary" class="submit-btn">
            <el-icon><Check /></el-icon> 保存活动
          </el-button>
          <el-button type="default" class="cancel-btn">
            <el-icon><Close /></el-icon> 取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {

  Ticket,
  Document,
  Check,
  Close,

} from '@element-plus/icons-vue'
import type { UploadFile, UploadProps } from 'element-plus'

// 活动表单数据
const activeForm = reactive({
  title: '',
  type: '',
  timeRange: [] as [Date?, Date?],
  coverImg: '',
  rule: '',
  desc: ''
})

// 表单校验规则
const activeRules = reactive({
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  timeRange: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  rule: [{ required: true, message: '请输入活动规则', trigger: 'blur' }]
})

// 头图上传相关
const coverFileList = ref<UploadFile[]>([])
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  coverFileList.value = uploadFiles
}
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log('预览头图:', uploadFile)
}
</script>

<style scoped lang="scss">
// 全局容器
.active-create-container {
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

// 创建表单卡片
.create-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;
  padding: 25px;
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

    .section-icon {
      margin-right: 8px;
      font-size: 18px;
    }
  }
}

// 表单元素样式
.active-form {
  .form-input,
  .form-select,
  .form-date,
  .form-textarea {
    border-radius: 8px;
    border-color: #e8d6c4;
    &:focus-within {
      border-color: #e8a87c;
      box-shadow: 0 0 0 2px rgba(232, 168, 124, 0.1);
    }
  }

  // 上传组件
  .upload-cover {
    margin-bottom: 10px;

    .upload-plus {
      color: #e8a87c;
      background-color: #fff9f2;
      border-color: #e8d6c4;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #9e7d66;
    margin-left: 120px;
  }

  // 按钮组
  .form-btn-group {
    display: flex;
    gap: 15px;
    margin-top: 20px;

    .submit-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      border-radius: 8px;
      padding: 8px 20px;
    }

    .cancel-btn {
      border-radius: 8px;
      border-color: #e8d6c4;
      color: #6b5b45;
      padding: 8px 20px;
    }
  }
}
</style>