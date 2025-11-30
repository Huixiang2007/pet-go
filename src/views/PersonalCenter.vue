<template>
  <div class="profile-container">
    <!-- 顶部用户核心信息 -->
    <header class="profile-header">
      <div class="user-info">
        <!-- <div class="avatar-container">
          <img 
            :src="userInfo.avatar" 
            alt="用户头像" 
            class="avatar"
            @click="isUploadingAvatar = true"
          >
          <input 
            type="file" 
            ref="avatarInput" 
            accept="image/*" 
            class="avatar-upload"
            @change="handleAvatarUpload"
          >
          <div v-if="isUploadingAvatar" class="avatar-overlay" @click.stop>
            <i class="layui-icon layui-icon-camera"></i>
            <span>更换头像</span>
          </div>
        </div> -->
        <!-- 头像设置区域 -->

  
  <div class="layui-input-block avatar-upload">
    <div class="avatar-preview">
      <img :src="userInfo.avatar" alt="用户头像" class="avatar-img" />
      <div class="avatar-upload-overlay">
        <i class="layui-icon layui-icon-camera"></i>
        <input type="file" accept="image/*" @change="handleAvatarUpload" class="avatar-file" />
      </div>
    </div>
  </div>

        <div class="user-details">
          <h2 class="nickname">{{ userInfo.nickname }}</h2>
          <p class="user-id">ID: {{ userInfo.userId }}</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="layui-btn layui-btn-primary" @click="logout">
          <i class="layui-icon layui-icon-logout"></i> 退出登录
        </button>
      </div>
    </header>

    <div class="profile-body">
      <!-- 侧边导航栏 -->
      <aside class="sidebar">
        <ul class="nav-list">
          <li 
            v-for="(item, index) in navItems" 
            :key="index"
            :class="{ active: currentTab === index }"
            @click="currentTab = index"
          >
            <i class="layui-icon" :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </aside>

      <!-- 内容展示区 -->
      <main class="content-area">
        <div class="content-header">
          <h1>{{ navItems[currentTab].name }}</h1>
        </div>

        <div class="content-wrapper">
          <!-- 基本信息表单 -->
          <form class="layui-form profile-form" v-if="currentTab === 0">
            <div class="layui-form-item">
              <label class="layui-form-label">昵称</label>
              <div class="layui-input-block">
                <input 
                  type="text" 
                  name="nickname" 
                  v-model="formData.nickname" 
                  lay-verify="required"
                  placeholder="请输入昵称" 
                  class="layui-input"
                >
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">性别</label>
              <div class="layui-input-block">
                <input type="radio" name="sex" value="1" v-model="formData.sex" title="男" >
                <input type="radio" name="sex" value="2" v-model="formData.sex" title="女" >
                <!-- <input type="radio" name="sex" value="secret" v-model="formData.sex" title="保密"> -->
                
              </div>
            </div>

              <div class="layui-form-item">
      <label class="layui-form-label">生日</label>
      <div class="layui-input-block">
        <input 
          type="date" 
          name="birthday" 
          v-model="formData.birthday" 
          placeholder="请选择生日日期" 
          class="layui-input"
          :max="maxBirthdayDate"
        >
      </div>
    </div>

              <div class="layui-form-item" >
              <label class="layui-form-label">手机号</label>
              <div class="layui-input-block">
                <input 
                  type="text" 
                  name="Phone"  
                  v-model="formData.phone"
                  lay-verify="required|phone"
                  placeholder="请输入手机号" 
                  class="layui-input"
                >
              </div>
            </div>     

            <div class="layui-form-item">
              <label class="layui-form-label">个性签名</label>
              <div class="layui-input-block">
                 <textarea 
        name="signature" 
        v-model="formData.signature" 
        placeholder="请输入个性签名" 
        class="layui-textarea"
        rows="3"
        @input="handleSignatureInput" 
        :maxlength="maxSignatureLength" 
      ></textarea>
      <!-- 字数提示 -->
      <p class="word-count">
        {{ formData.signature.length }}/{{ maxSignatureLength }} 字
      </p>
              </div>
            </div>

      

            <div class="layui-form-item">
              <div class="layui-input-block">
                <button class="layui-btn btn-save" lay-submit lay-filter="save-base-info">保存修改</button>
           <button class="layui-btn  delete-btn" @click="cancelEdit">取消修改</button>

              </div>
            </div>
          </form>

          <!-- 实名认证表单 -->
          <form class="layui-form profile-form" v-if="currentTab === 1">
            <div class="verify-status" v-if="realNameStatus !== 'unverified'">
              <div class="status-icon" :class="realNameStatus === 'verified' ? 'success' : 'pending'">
                <i class="layui-icon" :class="realNameStatus === 'verified' ? 'layui-icon-ok-circle' : 'layui-icon-clock'"></i>
              </div>
              <div class="status-text">
                <h3>{{ realNameStatus === 'verified' ? '已实名认证' : '实名认证审核中' }}</h3>
                <p>{{ realNameStatus === 'verified' ? '您已完成实名认证，不可修改' : '您的实名认证申请正在审核中，请耐心等待' }}</p>
              </div>
            </div>

            <div v-else>
              <div class="layui-form-item">
                <label class="layui-form-label">真实姓名</label>
                <div class="layui-input-block">
                  <input 
                    type="text" 
                    name="realName" 
                    v-model="realNameForm.realName" 
                    lay-verify="required"
                    placeholder="请输入真实姓名" 
                    class="layui-input"
                  >
                </div>
              </div>

              <div class="layui-form-item">
                <label class="layui-form-label">身份证号</label>
                <div class="layui-input-block">
                  <input 
                    type="text" 
                    name="idCard" 
                    v-model="realNameForm.idCard" 
                    lay-verify="required|idCard"
                    placeholder="请输入身份证号" 
                    class="layui-input"
                  >
                </div>
              </div>

              <div class="layui-form-item">
                <label class="layui-form-label">身份证照片</label>
                <div class="layui-input-block">
                  <button type="button" class="layui-btn" @click="selectIdCardPhoto('front')">
                    <i class="layui-icon layui-icon-upload"></i> 上传身份证正面
                  </button>
                  <p class="upload-hint" v-if="realNameForm.idCardFront">已上传正面照片</p>
                </div>
              </div>

              <div class="layui-form-item">
                <label class="layui-form-label"></label>
                <div class="layui-input-block">
                  <button type="button" class="layui-btn" @click="selectIdCardPhoto('back')">
                    <i class="layui-icon layui-icon-upload"></i> 上传身份证反面
                  </button>
                  <p class="upload-hint" v-if="realNameForm.idCardBack">已上传反面照片</p>
                </div>
              </div>

              <div class="layui-form-item">
                <div class="layui-input-block">
                  <button class="layui-btn btn-save" lay-submit lay-filter="submit-real-name">提交认证</button>
                </div>
              </div>
            </div>
          </form>

          <!-- 修改密码表单 -->
          <form class="layui-form profile-form" v-if="currentTab === 2">
            <div class="layui-form-item">
              <label class="layui-form-label">原密码</label>
              <div class="layui-input-block">
                <input 
                  type="password" 
                  name="oldPassword" 
                  v-model="passwordForm.oldPassword" 
                  lay-verify="required|password"
                  placeholder="请输入原密码" 
                  class="layui-input"
                >
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">新密码</label>
              <div class="layui-input-block">
                <input 
                  type="password" 
                  name="newPassword" 
                  v-model="passwordForm.newPassword" 
                  lay-verify="required|password"
                  placeholder="请输入新密码" 
                  class="layui-input"
                >
                <p class="password-rule">密码需8-20位，包含大小写字母、数字和特殊字符</p>
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">确认密码</label>
              <div class="layui-input-block">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  v-model="passwordForm.confirmPassword" 
                  lay-verify="required|confirmPassword"
                  placeholder="请确认新密码" 
                  class="layui-input"
                >
              </div>
            </div>

            <div class="layui-form-item">
              <div class="layui-input-block">
                <button class="layui-btn btn-save" lay-submit lay-filter="change-password">确认修改</button>
              </div>
            </div>
          </form>

<!-- 地址管理 -->
<div v-if="currentTab === 3">
  <button class="layui-btn btn-save" @click="() => { resetAddressForm(); showAddressForm = true }">
    <i class="layui-icon layui-icon-add-circle"></i> 添加新地址
  </button>

  <!-- 地址表单 -->
  <div v-if="showAddressForm" class="address-form-container">
    <form class="layui-form profile-form">
      <div class="layui-form-item">
        <label class="layui-form-label">收件人</label>
        <div class="layui-input-block">
          <input 
            type="text" 
            v-model="addressForm.recipient" 
            placeholder="请输入收件人姓名" 
            class="layui-input"
          >
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">联系电话</label>
        <div class="layui-input-block">
          <input 
            type="text" 
            v-model="addressForm.phone" 
            lay-verify="phone"
            placeholder="请输入联系电话" 
            class="layui-input"
          >
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">所在地区</label>
        <div class="layui-input-block">
          <select v-model="addressForm.province" placeholder="请选择省份">
            <option value="">请选择省份</option>
            <option value="北京市">北京市</option>
            <option value="上海市">上海市</option>
            <option value="广东省">广东省</option>
            <!-- 可根据需要添加更多省份 -->
          </select>
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">城市</label>
        <div class="layui-input-block">
          <select v-model="addressForm.city" placeholder="请选择城市">
            <option value="">请选择城市</option>
            <!-- 实际项目中可根据省份动态加载城市 -->
          </select>
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">区/县</label>
        <div class="layui-input-block">
          <select v-model="addressForm.district" placeholder="请选择区/县">
            <option value="">请选择区/县</option>
            <!-- 实际项目中可根据城市动态加载区县 -->
          </select>
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">详细地址</label>
        <div class="layui-input-block">
          <textarea 
            v-model="addressForm.detail" 
            placeholder="请输入详细地址" 
            class="layui-textarea"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">默认地址</label>
        <div class="layui-input-block">
          <input 
            type="checkbox" 
            v-model="addressForm.isDefault" 
            lay-skin="switch" 
            lay-text="是|否"
          >
        </div>
      </div>

      <div class="layui-form-item">
        <div class="layui-input-block">
          <button class="layui-btn btn-save" type="button" @click="saveAddress">保存地址</button>
          <button class="layui-btn delete-btn" type="button" @click="resetAddressForm">取消</button>
        </div>
      </div>
    </form>
  </div>

  <!-- 地址列表 -->
  <div class="address-list" v-if="!showAddressForm && addressList.length > 0">
    <div class="address-item" v-for="address in addressList" :key="address.id">
      <div class="address-header">
        <span class="recipient">{{ address.recipient }} {{ address.phone }}</span>
        <span class="default-tag" v-if="address.isDefault">默认地址</span>
      </div>
      <div class="address-content">
        {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
      </div>
      <div class="address-actions">
        <button class="layui-btn layui-btn-primary layui-btn-sm" @click="editAddress(address)">编辑</button>
        <button class="layui-btn layui-btn-primary layui-btn-sm" @click="deleteAddress(address.id)">删除</button>
        <button 
          class="layui-btn layui-btn-primary layui-btn-sm" 
          @click="setDefaultAddress(address.id)"
          v-if="!address.isDefault"
        >
          设为默认
        </button>
      </div>
    </div>
  </div>

  <!-- 空状态 -->
  <div class="empty-address" v-if="!showAddressForm && addressList.length === 0">
    <p>您还没有添加收货地址，点击"添加新地址"按钮添加</p>
  </div>
</div>
      
       
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick,watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
declare global {
  interface Window {
    layui: any
  }
}
// 导航项
const navItems = [
  { name: '基本信息', icon: 'layui-icon-user' },
  { name: '实名认证', icon: 'layui-icon-auz' },
  { name: '修改密码', icon: 'layui-icon-password' },
   { name: '我的地址', icon: 'layui-icon-home' }
]

// 状态管理
const maxSignatureLength = 100
const currentTab = ref(0)
const isUploadingAvatar = ref(false)
const isSendingCode = ref(false)
const countDown = ref(60)
const isChangingPhone = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const maxBirthdayDate = ref('')

// 用户信息
const userInfo = ref({
  avatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
  nickname: 'PetGo用户',
  userId: '100000',
  sex: 'male',
  phone:'',
  signature: '',
  birthday:'',
})

// 表单数据
const formData = ref({
  avatar: 'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
  nickname: '',
  sex: 'male',
  phone:'',
  signature: '',
   birthday: ''
})
// 地址数据类型定义
interface Address {
  id: string
  recipient: string // 收件人
  phone: string // 电话
  province: string // 省份
  city: string // 城市
  district: string // 区/县
  detail: string // 详细地址
  isDefault: boolean // 是否默认地址
}

// 地址表单数据
const addressForm = ref<Partial<Address>>({
  recipient: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

// 地址列表
const addressList = ref<Address[]>([])
// 当前编辑的地址ID
const editingAddressId = ref<string | null>(null)
// 控制地址表单显示状态
const showAddressForm = ref(false)

const realNameStatus = ref<'unverified' | 'pending' | 'verified'>('unverified')
const realNameForm = ref({
  realName: '',
  idCard: '',
  idCardFront: '',
  idCardBack: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})



const router = useRouter()

// 初始化
onMounted(() => {
   const today = new Date()
  // 格式化日期为YYYY-MM-DD格式
  maxBirthdayDate.value = today.toISOString().split('T')[0]
  // 模拟从接口获取用户信息
  setTimeout(() => {
    formData.value = { ...userInfo.value }
    // 初始化表单验证
    if (window.layui) {
      window.layui.use(['form', 'layer'], (form: any, layer: any) => {
        form.verify({
          password: function (value: string) {
            const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
            if (!passwordReg.test(value)) {
              return '密码需8-20位，包含大小写字母、数字和特殊字符'
            }
          },
          confirmPassword: function (value: string) {
            if (value !== passwordForm.value.newPassword) {
              return '两次输入的密码不一致'
            }
          },
          idCard: function (value: string) {
            // 简单的身份证验证正则
            const idCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if (!idCardReg.test(value)) {
              return '请输入正确的身份证号码'
            }
          },
          phone: function (value: string) {
            const phoneReg = /^1[3-9]\d{9}$/
            if (!phoneReg.test(value)) {
              return '请输入正确的手机号码'
            }
          }
        })

        // 表单提交事件
        form.on('submit(save-base-info)', () => {
          saveBaseInfo()
          return false
        })

        form.on('submit(submit-real-name)', () => {
          submitRealName()
          return false
        })

        form.on('submit(change-password)', () => {
          changePassword()
          return false
        })

      
          form.render()
        
      })
    }
  }, 500)

   watch(currentTab, () => {
    nextTick(() => {
      if (window.layui) {
        window.layui.use('form', (form: any) => {
        
          form.render()
        })
      }
    })
  })
    getAddressList()
})

// 获取地址列表
const getAddressList = async () => {
  try {
    // 模拟接口请求
    const response = await axios.get('/api/user/addresses')
    addressList.value = response.data.data || []
  } catch (error) {
    window.layui.layer.msg('获取地址失败，请稍后重试')
  }
}

// 新增/编辑地址
const saveAddress = async () => {
  // 表单验证
  if (!addressForm.value.recipient || !addressForm.value.phone) {
    window.layui.layer.msg('请填写收件人和联系电话')
    return
  }
  
  if (!addressForm.value.province || !addressForm.value.city || !addressForm.value.district || !addressForm.value.detail) {
    window.layui.layer.msg('请填写完整地址信息')
    return
  }

  try {
    if (editingAddressId.value) {
      // 编辑地址
      await axios.put(`/api/user/addresses/${editingAddressId.value}`, addressForm.value)
      window.layui.layer.msg('地址更新成功')
    } else {
      // 新增地址
      await axios.post('/api/user/addresses', addressForm.value)
      window.layui.layer.msg('地址添加成功')
    }
    
    // 重置表单并刷新列表
    resetAddressForm()
    getAddressList()
  } catch (error) {
    window.layui.layer.msg('保存地址失败，请稍后重试')
  }
}

// 编辑地址
const editAddress = (address: Address) => {
  addressForm.value = { ...address }
  editingAddressId.value = address.id
  showAddressForm.value = true
}

// 删除地址
const deleteAddress = (id: string) => {
  window.layui.layer.confirm('确定要删除这个地址吗？', {
    title: '提示'
  }, async (index: number) => {
    try {
      await axios.delete(`/api/user/addresses/${id}`)
      window.layui.layer.close(index)
      window.layui.layer.msg('地址已删除')
      getAddressList()
    } catch (error) {
      window.layui.layer.msg('删除失败，请稍后重试')
    }
  })
}

// 设为默认地址
const setDefaultAddress = async (id: string) => {
  try {
    await axios.patch(`/api/user/addresses/${id}/default`)
    window.layui.layer.msg('已设为默认地址')
    getAddressList()
  } catch (error) {
    window.layui.layer.msg('操作失败，请稍后重试')
  }
}

// 重置地址表单
const resetAddressForm = () => {
  addressForm.value = {
    recipient: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  }
  editingAddressId.value = null
  showAddressForm.value = false
}
// 取消编辑，恢复原始值
const cancelEdit = () => {
  formData.value = { ...userInfo.value }
  
  if (window.layui) {
    window.layui.use('form', (form: any) => {
      form.render()
    })
  }
  
  window.layui.layer.msg('已恢复原始值')
}




// 处理签名输入
const handleSignatureInput = () => {
  // 如果超过最大长度则截断
  if (formData.value.signature.length > maxSignatureLength) {
    formData.value.signature = formData.value.signature.substring(0, maxSignatureLength)
  }
}

// 头像上传相关
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

// 选择身份证照片
const selectIdCardPhoto = (type: 'front' | 'back') => {
  // 模拟上传
  setTimeout(() => {
    if (type === 'front') {
      realNameForm.value.idCardFront = 'uploaded'
    } else {
      realNameForm.value.idCardBack = 'uploaded'
    }
  }, 500)
}

// 发送验证码

// 保存基本信息
const saveBaseInfo = async () => {
  
  try {
    // 模拟接口请求
    await axios.post('/server/api/user/updateUserInfo', {},
      { 
        params:{
        userName:formData.value.nickname,
        phone:formData.value.phone,
        gender:formData.value.sex,
        birthday:formData.value.birthday
      }
        })
    userInfo.value.nickname = formData.value.nickname
    userInfo.value.sex = formData.value.sex
    userInfo.value.signature = formData.value.signature
    userInfo.value.phone = formData.value.phone
     userInfo.value.birthday = formData.value.birthday

    window.layui.layer.msg('保存成功')
  } catch (error) {
    window.layui.layer.msg('保存失败，请稍后重试')
  }
}

// 提交实名认证
const submitRealName = async () => {
  if (!realNameForm.value.realName || !realNameForm.value.idCard) {
    window.layui.layer.msg('请填写完整信息')
    return
  }

  if (!realNameForm.value.idCardFront || !realNameForm.value.idCardBack) {
    window.layui.layer.msg('请上传身份证照片')
    return
  }

  try {
    // 模拟接口请求
    await axios.post('/api/user/verify/realname', realNameForm.value)
    realNameStatus.value = 'pending'
    window.layui.layer.msg('提交成功，等待审核')
  } catch (error) {
    window.layui.layer.msg('提交失败，请稍后重试')
  }
}

// 修改密码
const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    window.layui.layer.msg('两次密码输入不一致')
    return
  }

  try {
    // 模拟接口请求
    await axios.post('/api/user/password/change', passwordForm.value)
    window.layui.layer.msg('密码修改成功，请重新登录')
    // 清空表单
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    // 实际项目中这里应该跳转到登录页
  } catch (error) {
    window.layui.layer.msg('密码修改失败，请检查原密码是否正确')
  }
}



// 退出登录
const logout = () => {
  window.layui.layer.confirm('确定要退出登录吗？', {
    title: '提示'
  }, (index: number) => {
    // 清除认证信息
  localStorage.removeItem('authToken')
  localStorage.removeItem('userId')

  
  // 清除记住密码相关数据
  // localStorage.removeItem('rememberedLoginId')
  // localStorage.removeItem('rememberedPassword')
  // localStorage.removeItem('rememberedLoginType')
  //   alert(localStorage.getItem('rememberedLoginId'))
     window.layui.layer.close(index);
    router.push('/login')
  })
}
</script>

<style scoped>

/* 地址管理样式 */
.address-form-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.address-list {
  margin-top: 1.5rem;
}

.address-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  position: relative;
}

.address-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.recipient {
  font-weight: 500;
}

.default-tag {
  background-color: #fd9860;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.address-content {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.empty-address {
  margin-top: 2rem;
  text-align: center;
  color: #999;
  padding: 2rem 0;
  background-color: #f9f9f9;
  border-radius: 8px;
}
 .layui-form-radioed>i {
     color: #fd9860 !important;
 }
.layui-form-radio:hover>*, .layui-form-radioed, .layui-form-radioed>i {
    color: #fd9860 !important;
}
.word-count {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.85rem;
  text-align: right;
}
.delete-btn{
  min-width: 120px;
  border-color: #d2d2d2;
    background: 0 0;
    color: #5f5f5f;
}
.delete-btn:hover{
 border-color: #fd9860;
    color: #fd9860;
}

.layui-btn-primary:hover {
    border-color: #fd9860;
    color: #fd9860;
}
.layui-input:focus, .layui-textarea:focus {
    border-color: #fd9860 !important;
    box-shadow: 0 0 0 3px #fd98600f;
}

.avatar-file::-webkit-file-upload-button {
  visibility: hidden;
}
.avatar-file::before {
  content: '';
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.profile-container {
  min-height: 100vh;
  background-image: url('../../assets/img/background6.png');
  background-repeat: no-repeat;
  background-size: cover;
  color: #333;
}

/* 顶部样式 */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 头像上传样式 */
.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.avatar-upload {
  margin-left: 4px;
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

.header-actions {
  display: flex;
  gap: 1rem;
}

/* 主体内容样式 */
.profile-body {
  display: flex;
  min-height: calc(100vh - 152px);
}

/* 侧边栏样式 */
.sidebar {
  width: 220px;
  background-color: rgba(255, 255, 255, 0.9);
  padding-top: 1.5rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.nav-list li:hover {
  background-color: rgba(253, 152, 96, 0.1);
  color: #fd9860;
}

.nav-list li.active {
  background-color: rgba(253, 152, 96, 0.2);
  color: #fd9860;
  border-left: 3px solid #fd9860;
}

.nav-list li .layui-icon {
  font-size: 1.2rem;
}

/* 内容区域样式 */
.content-area {
  height: 80vh;

  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.content-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.content-wrapper {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 表单样式 */
.profile-form {
  max-width: 600px;
}

.layui-form-item {
  margin-bottom: 1.5rem;
}

.layui-form-label {
  width: 100px;
  font-weight: 500;
}



.btn-save {
  background-color: #fd9860;
  border-color: #fd9860;
  min-width: 120px;
}

.btn-save:hover {
  background-color: #fc8747;
  border-color: #fc8747;
}

/* 实名认证状态样式 */
.verify-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  background-color: #f5f5f5;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.status-icon.success {
  background-color: #52c41a;
  color: white;
}

.status-icon.pending {
  background-color: #faad14;
  color: white;
}

.status-text h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.status-text p {
  margin: 0;
  color: #666;
}

/* 上传提示 */
.upload-hint {
  margin: 0.5rem 0 0 0;
  color: #52c41a;
  font-size: 0.9rem;
}

/* 密码规则提示 */
.password-rule {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* 验证码输入区 */
.code-input {
  display: flex;
  gap: 0.5rem;
}

.code-input .layui-input {
  flex: 1;
}

/* 未绑定状态样式 */
.unbound {
  color: #999;
  background-color: #f5f5f5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .profile-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 1rem 0;
  }

  .nav-list {
    display: flex;
    overflow-x: auto;
  }

  .nav-list li {
    flex: none;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .nav-list li.active {
    border-left: none;
    border-bottom: 3px solid #fd9860;
  }

  .layui-form-label {
    width: 80px;
  }


}
</style>