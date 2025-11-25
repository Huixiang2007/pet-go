<template>
  <div class="profile-page forPicture">
    <transition name="box-animation">
      <div class="layui-form profile-container" v-if="isLoaded">
        <div class="container">
          <img src="../../assets/img/logo.png" alt="这是图标" class="logo" />
          <div class="title">
            <span
              v-for="(char, index) in titleChars"
              :key="index"
              :style="{ animationDelay: `${index * 100}ms` }"
              class="char"
            >
              {{ char }}
            </span>
          </div>
        </div>

        <div class="profile-content">
          <!-- 头像设置区域 -->
          <div class="layui-form-item avatar-section">
            <label class="layui-form-label">头像</label>
            <div class="layui-input-block avatar-upload">
              <div class="avatar-preview">
                <img :src="userInfo.avatar" alt="用户头像" class="avatar-img" />
                <div class="avatar-upload-overlay">
                  <i class="layui-icon layui-icon-camera"></i>
                  <input type="file" accept="image/*" @change="handleAvatarUpload" class="avatar-file" />
                </div>
              </div>
              <p class="avatar-hint">点击上传或更换头像（建议尺寸 200x200px）</p>
            </div>
          </div>

          <!-- 昵称设置 -->
          <div class="layui-form-item">
            <label class="layui-form-label">昵称</label>
            <div class="layui-input-block">
              <input
                type="text"
                name="nickname"
                v-model="userInfo.nickname"
                lay-verify="required"
                placeholder="请输入昵称"
                class="layui-input"
              />
            </div>
          </div>

          <!-- 实名认证 -->
          <div class="layui-form-item">
            <label class="layui-form-label">实名认证</label>
            <div class="layui-input-block">
              <div v-if="userInfo.realNameVerified" class="verified-info">
                <span class="verified-text">{{ userInfo.realName }}</span>
                <span class="verified-badge">已认证</span>
              </div>
              <div v-else>
                <button class="layui-btn layui-btn-normal" @click="showRealNameDialog = true">
                  未认证，点击认证
                </button>
              </div>
            </div>
          </div>

          <!-- 绑定手机 -->
          <div class="layui-form-item">
            <label class="layui-form-label">手机号码</label>
            <div class="layui-input-block">
              <div v-if="userInfo.phone">
                <span class="phone-number">{{ "userInfo.phone | maskPhone" }}</span>
                <button class="layui-btn layui-btn-primary change-btn" @click="showPhoneDialog = true">
                  更换
                </button>
              </div>
              <div v-else>
                <button class="layui-btn layui-btn-normal" @click="showPhoneDialog = true">
                  未绑定，点击绑定
                </button>
              </div>
            </div>
          </div>

          <!-- 修改密码 -->
          <div class="layui-form-item">
            <label class="layui-form-label">密码管理</label>
            <div class="layui-input-block">
              <button class="layui-btn layui-btn-normal" @click="showPasswordDialog = true">
                修改密码
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="layui-form-item btn-group">
            <div class="layui-input-block">
              <button class="layui-btn btn-donate" lay-submit lay-filter="save-profile">保存修改</button>
              <button type="button" class="layui-btn layui-btn-primary" @click="goBack">返回</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 实名认证弹窗 -->
    <div v-if="showRealNameDialog" class="dialog-overlay">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3>实名认证</h3>
          <i class="layui-icon layui-icon-close" @click="showRealNameDialog = false"></i>
        </div>
        <div class="dialog-content">
          <div class="layui-form-item">
            <label class="layui-form-label">真实姓名</label>
            <div class="layui-input-block">
              <input
                type="text"
                v-model="realNameForm.name"
                lay-verify="required"
                placeholder="请输入真实姓名"
                class="layui-input"
              />
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">身份证号</label>
            <div class="layui-input-block">
              <input
                type="text"
                v-model="realNameForm.idCard"
                lay-verify="required|idCard"
                placeholder="请输入身份证号码"
                class="layui-input"
              />
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="layui-btn layui-btn-primary" @click="showRealNameDialog = false">取消</button>
          <button class="layui-btn btn-donate" @click="submitRealName">确认提交</button>
        </div>
      </div>
    </div>

    <!-- 绑定/更换手机弹窗 -->
    <div v-if="showPhoneDialog" class="dialog-overlay">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3>{{ userInfo.phone ? '更换手机号码' : '绑定手机号码' }}</h3>
          <i class="layui-icon layui-icon-close" @click="showPhoneDialog = false"></i>
        </div>
        <div class="dialog-content">
          <div class="layui-form-item">
            <label class="layui-form-label">手机号码</label>
            <div class="layui-input-block">
              <input
                type="text"
                v-model="phoneForm.phone"
                lay-verify="required|phone"
                placeholder="请输入手机号码"
                class="layui-input"
              />
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">验证码</label>
            <div class="layui-input-block">
              <div class="layui-row">
                <div class="layui-col-xs7">
                  <input
                    type="text"
                    v-model="phoneForm.code"
                    lay-verify="required"
                    placeholder="请输入验证码"
                    class="layui-input"
                  />
                </div>
                <div class="layui-col-xs5">
                  <button 
                    class="layui-btn layui-btn-primary" 
                    @click="sendCode"
                    :disabled="countdown > 0"
                  >
                    {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="layui-btn layui-btn-primary" @click="showPhoneDialog = false">取消</button>
          <button class="layui-btn btn-donate" @click="submitPhone">确认</button>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordDialog" class="dialog-overlay">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3>修改密码</h3>
          <i class="layui-icon layui-icon-close" @click="showPasswordDialog = false"></i>
        </div>
        <div class="dialog-content">
          <div class="layui-form-item">
            <label class="layui-form-label">原密码</label>
            <div class="layui-input-block">
              <input
                type="password"
                v-model="passwordForm.oldPassword"
                lay-verify="required"
                placeholder="请输入原密码"
                class="layui-input"
              />
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">新密码</label>
            <div class="layui-input-block">
              <input
                type="password"
                v-model="passwordForm.newPassword"
                lay-verify="required|password"
                placeholder="请输入新密码"
                class="layui-input"
              />
              <p class="password-hint">密码需8-20位，包含大小写字母、数字和特殊字符</p>
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">确认密码</label>
            <div class="layui-input-block">
              <input
                type="password"
                v-model="passwordForm.confirmPassword"
                lay-verify="required|confirmPassword"
                placeholder="请确认新密码"
                class="layui-input"
              />
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="layui-btn layui-btn-primary" @click="showPasswordDialog = false">取消</button>
          <button class="layui-btn btn-donate" @click="submitPassword">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 状态管理
const isLoaded = ref(false)
const titleChars = '个人信息管理'.split('')
const showRealNameDialog = ref(false)
const showPhoneDialog = ref(false)
const showPasswordDialog = ref(false)
const countdown = ref(0)

// 用户信息
const userInfo = ref({
  avatar: 'https://tva1.sinaimg.cn/crop.0.0.180.180.180/63d5b34jw8f0ks1d9l7jj20500500t0.jpg',
  nickname: 'PetGo用户',
  realNameVerified: false,
  realName: '',
  phone: ''
})

// 表单数据
const realNameForm = ref({
  name: '',
  idCard: ''
})

const phoneForm = ref({
  phone: '',
  code: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 路由
const router = useRouter()

// 工具函数 - 手机号脱敏过滤器
const maskPhone = (value: string) => {
  if (!value) return ''
  return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

// 挂载时初始化
onMounted(() => {
  // 模拟加载用户信息
  setTimeout(() => {
    // 实际项目中这里应该是接口请求
    isLoaded.value = true
    
    // 初始化layui表单验证
    if (window.layui) {
      window.layui.use(['form', 'layer'], (form: any, layer: any) => {
        form.verify({
          idCard: function(value: string) {
            const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if (!reg.test(value)) {
              return '请输入正确的身份证号码'
            }
          },
          phone: function(value: string) {
            const reg = /^1[3-9]\d{9}$/
            if (!reg.test(value)) {
              return '请输入正确的手机号码'
            }
          },
          password: function(value: string) {
            const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
            if (!reg.test(value)) {
              return '密码需8-20位，包含大小写字母、数字和特殊字符'
            }
          },
          confirmPassword: function(value: string) {
            if (value !== passwordForm.value.newPassword) {
              return '两次输入的密码不一致'
            }
          }
        })

        form.on('submit(save-profile)', () => {
          saveProfile()
          return false
        })
      })
    }
  }, 500)
})

// 头像上传处理
const handleAvatarUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    // 简单的文件类型和大小验证
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }
    
    // 预览图片
    const reader = new FileReader()
    reader.onload = (event) => {
      userInfo.value.avatar = event.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // 实际项目中这里应该有上传到服务器的逻辑
  }
}

// 发送验证码
const sendCode = () => {
  if (!phoneForm.value.phone) {
    alert('请输入手机号码')
    return
  }
  
  // 模拟发送验证码
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  // 实际项目中这里应该调用发送验证码的接口
}

// 提交实名认证
const submitRealName = () => {
  if (!realNameForm.value.name) {
    alert('请输入真实姓名')
    return
  }
  
  if (!realNameForm.value.idCard || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(realNameForm.value.idCard)) {
    alert('请输入正确的身份证号码')
    return
  }
  
  // 模拟提交
  userInfo.value.realName = realNameForm.value.name
  userInfo.value.realNameVerified = true
  showRealNameDialog.value = false
  
  // 实际项目中这里应该调用实名认证接口
}

// 提交手机号
const submitPhone = () => {
  if (!phoneForm.value.phone || !/^1[3-9]\d{9}$/.test(phoneForm.value.phone)) {
    alert('请输入正确的手机号码')
    return
  }
  
  if (!phoneForm.value.code) {
    alert('请输入验证码')
    return
  }
  
  // 模拟提交
  userInfo.value.phone = phoneForm.value.phone
  showPhoneDialog.value = false
  
  // 实际项目中这里应该调用绑定/更换手机接口
}

// 提交密码修改
const submitPassword = () => {
  if (!passwordForm.value.oldPassword) {
    alert('请输入原密码')
    return
  }
  
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
  if (!passwordForm.value.newPassword || !reg.test(passwordForm.value.newPassword)) {
    alert('密码需8-20位，包含大小写字母、数字和特殊字符')
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  // 模拟提交
  showPasswordDialog.value = false
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  // 实际项目中这里应该调用修改密码接口
}

// 保存个人信息
const saveProfile = () => {
  if (!userInfo.value.nickname) {
    alert('请输入昵称')
    return
  }
  
  // 模拟保存
  if (window.layui) {
    window.layui.use('layer', (layer: any) => {
      layer.msg('信息保存成功', { icon: 1 })
    })
  }
  
  // 实际项目中这里应该调用保存个人信息的接口
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.profile-container {
  width: 600px;
  padding: 30px;
  background-color: rgba(951, 588, 235, 0.6);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-content {
  margin-top: 20px;
}

/* 头像上传样式 */
.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-preview {
  position: relative;
  width: 120px;
  height: 120px;
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

.avatar-hint {
  margin-top: 10px;
  color: #666;
  font-size: 12px;
}

/* 表单样式调整 */
.layui-form-item {
  margin-bottom: 20px;
}

.layui-form-label {
  width: 100px;
  padding: 9px 15px;
  font-weight: 500;
}

.layui-input-block {
  margin-left: 130px;
}

/* 认证信息样式 */
.verified-info {
  display: flex;
  align-items: center;
  height: 38px;
}

.verified-text {
  font-size: 14px;
  margin-right: 10px;
}

.verified-badge {
  background-color: #52c41a;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

/* 手机号样式 */
.phone-number {
  line-height: 38px;
  margin-right: 10px;
}

.change-btn {
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}

/* 按钮组样式 */
.btn-group {
  margin-top: 30px;
}

.btn-group .layui-input-block {
  display: flex;
  gap: 10px;
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-container {
  width: 450px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.dialog-header .layui-icon {
  font-size: 20px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.dialog-header .layui-icon:hover {
  color: #333;
}

.dialog-content {
  padding: 20px;
}

.dialog-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 密码提示 */
.password-hint {
  margin-top: 5px;
  color: #999;
  font-size: 12px;
}

/* 动画效果 */
.title {
  font-size: 24px;
  font-weight: bold;
}

.char {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  animation: charPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  display: inline-block;
  min-width: 0.5em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@keyframes charPop {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 按钮样式 - 复用登录页的按钮样式 */
.btn-donate {
  --clr-font-main: hsla(0 0% 20% / 100);
  --btn-bg-1: hsla(165, 80%, 60%, 1);
  --btn-bg-2: hsla(217 100% 56% / 1);
  --btn-bg-color: hsla(360 100% 100% / 1);
  --radii: 0.5em;
  cursor: pointer;
  padding: 0.4em 1.4em;
  min-height: 44px;
  font-size: var(--size, 1rem);
  font-weight: 500;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(
    325deg,
    var(--btn-bg-2) 0%,
    var(--btn-bg-1) 55%,
    var(--btn-bg-2) 90%
  );
  border: none;
  border-radius: var(--radii);
  color: var(--btn-bg-color);
}

.btn-donate:hover {
  background-position: right top;
}

.btn-donate:is(:focus, :focus-visible, :active) {
  outline: none;
  box-shadow:
    0 0 0 3px var(--btn-bg-color),
    0 0 0 6px var(--btn-bg-2);
}

/* 其他复用样式 */
::v-deep .layui-input {
  height: 38px !important;
  line-height: 38px;
  font-size: 15px;
}

::v-deep .layui-input:focus {
  border-color: rgb(253, 152, 96) !important;
  box-shadow: 0 0 3px 1px rgba(253, 152, 96, 0.3) !important;
}

::v-deep .layui-btn {
  background-color: rgb(253, 152, 96);
}

::v-deep .layui-btn-primary:hover {
  border-color: rgb(253, 152, 96);
  color: #333;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .profile-container {
    width: 90%;
    padding: 20px;
  }
  
  .layui-form-label {
    width: 80px;
  }
  
  .layui-input-block {
    margin-left: 110px;
  }
  
  .dialog-container {
    width: 90%;
    max-width: 450px;
  }
}
</style>