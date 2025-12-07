<template>
  <div class="user-info">
    <div class="layui-input-block avatar-upload">
      <div class="avatar-preview">
        <img :src="avatar" alt="用户头像" class="avatar-img" />
        <div class="avatar-upload-overlay">
          <i class="layui-icon layui-icon-camera"></i>
          <input type="file" accept="image/*" @change="handleUpload" class="avatar-file" />
        </div>
      </div>
    </div>
    <div class="user-details">
      <h2 class="nickname">{{ nickname }}</h2>
      <p class="user-id">邮箱: {{ email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, emit } from 'vue'
import { ElMessage } from 'element-plus'

// 接收父组件传递的props

defineProps({
  avatar: { type: String, required: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true }
})

// 定义事件（通知父组件头像修改）
const emit = defineEmits(['avatar-change'])

// 处理头像上传
const handleUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  // 验证文件
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件！')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB！')
    return
  }

  // 通知父组件处理上传
  emit('avatar-change', file)
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-upload {
  margin-left: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-preview:hover .avatar-img {
  transform: scale(1.05);
}

.avatar-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 24px;
}

.avatar-preview:hover .avatar-upload-overlay {
  opacity: 1;
}

.avatar-file {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.user-details {
  line-height: 1.5;
}

.nickname {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.user-id {
  color: #666;
  margin: 0;
}
</style>