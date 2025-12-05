<template>
  <div class="profile-container">
    <!-- 顶部用户核心信息 -->
    <header class="profile-header">
      <div class="user-info">
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
          <p class="user-id">邮箱: {{ userInfo.email }}</p>
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
          <li v-for="(item, index) in navItems" :key="index" :class="{ active: currentTab === index }"
            @click="currentTab = index">
            <i class="layui-icon" :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </li>
        </ul>
         <div class="show-photos">
              <img src="@/assets/img/catPicture.png" alt="这是展示图片">
              </div>
      </aside>

      <!-- 内容展示区 -->
      <main class="content-area">
        <div class="content-header">
          <h1>{{ navItems[currentTab]?.name }}</h1>
        </div>

        <div class="content-wrapper">
          <!-- 基本信息表单 -->
          <form class="layui-form profile-form" v-if="currentTab === 0">
            <div class="layui-form-item">
              <label class="layui-form-label">昵称</label>
              <div class="layui-input-block">
                <input type="text" name="nickname" v-model="formData.nickname" lay-verify="required" placeholder="请输入昵称"
                  class="layui-input" />
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">性别</label>
              <div class="layui-input-block">
                <input type="radio" name="sex" value="1" v-model="formData.sex" title="男" />
                <input type="radio" name="sex" value="2" v-model="formData.sex" title="女" />
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">生日</label>
              <div class="layui-input-block">
                <el-date-picker class="custom-style" v-model="formData.birthday" type="date" name="birthday"
                  placeholder="请选择生日日期" :max-date="new Date(maxBirthdayDate)" value-format="YYYY-MM-DD"
                  style="width: 100%; height:37px;" :disabled-date="disabledDate" />
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">手机</label>
              <div class="layui-input-block">
                <input type="text" name="Phone" v-model="formData.phone" lay-verify="required|phone"
                  placeholder="请输入手机号" class="layui-input" />
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">邮箱</label>
              <div class="layui-input-block">
                <input type="text" name="email" v-model="formData.email" placeholder="请输入邮箱" class="layui-input"
                  readonly />
              </div>
            </div>

            <div class="layui-form-item">
              <div class="layui-input-block">
                <button class="layui-btn btn-save" lay-submit lay-filter="save-base-info">
                  保存修改
                </button>
                <button class="layui-btn delete-btn" type="button" @click="cancelEdit">取消修改</button>
              </div>
            </div>
            <div class="show-photo">
              <img src="@/assets/img/catPicture3.png" alt="这是展示图片">
              </div>
          </form>

          <!-- 实名认证表单 -->
        <!-- 实名认证表单 -->
<form class="layui-form profile-form" v-if="currentTab === 1">
  <!-- 审核中状态 -->
  <div v-if="realNameStatus === 'pending'">
    <div  class="verify-status">
    <div class="status-icon pending">
      <i class="layui-icon layui-icon-log"></i>
    </div>
    <div class="status-text">
      <h3>实名认证审核中</h3>
      <p>您的实名认证申请正在审核中，请耐心等待</p>
    </div>
    
    <!-- 查看材料按钮 -->
    <div class="view-materials-section">
      <button type="button" class="layui-btn layui-btn-primary" @click="showSubmittedMaterials = !showSubmittedMaterials">
        {{ showSubmittedMaterials ? '隐藏材料' : '查看已提交材料' }}
      </button>
    </div>
    
   
    </div>
     <!-- 审核中显示已提交材料（默认隐藏） -->
    <div class="submitted-materials" v-if="showSubmittedMaterials">
      <h4>已提交的认证材料：</h4>
      <div class="layui-form-item">
        <label class="layui-form-label" >真实姓名</label>
        <div class="layui-input-block info-display">{{ realNameInfo.realName || '未填写' }}</div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label" >身份证号</label>
        <div class="layui-input-block info-display">{{ maskIdCard(realNameInfo.idCard) || '未填写' }}</div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label" style="width: 114px;">身份证信息面</label>
        <div class="layui-input-block">
          <img v-if="realNameInfo.idCardFront" :src="realNameInfo.idCardFront" class="id-card-img" alt="身份证信息面">
          <span v-else>未上传</span>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label" style="width: 114px;">身份证国徽面</label>
        <div class="layui-input-block">
          <img v-if="realNameInfo.idCardBack" :src="realNameInfo.idCardBack" class="id-card-img" alt="身份证国徽面">
          <span v-else>未上传</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 已认证状态 -->
  <div v-if="realNameStatus === 'verified'">
    <div class="verify-status">   
    <div class="status-icon success">
      <i class="layui-icon layui-icon-ok"></i>
    </div>
    <div class="status-text">
      <h3>已实名认证</h3>
      <p>您已完成实名认证，不可修改</p>
    </div>
    
    <!-- 查看材料按钮 -->
    <div class="view-materials-section">
      <button type="button" class="layui-btn layui-btn-primary" @click="showSubmittedMaterials = !showSubmittedMaterials">
        {{ showSubmittedMaterials ? '隐藏材料' : '查看认证材料' }}
      </button>
    </div>
    </div>
    <!-- 已认证显示已提交材料（默认隐藏） -->
    <div class="submitted-materials" v-if="showSubmittedMaterials">
      <h4>认证材料信息：</h4>
      <div class="layui-form-item">
        <label class="layui-form-label">真实姓名</label>
        <div class="layui-input-block info-display">{{ realNameInfo.realName || '未填写' }}</div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">身份证号</label>
        <div class="layui-input-block info-display">{{ maskIdCard(realNameInfo.idCard) || '未填写' }}</div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">身份证信息面</label>
        <div class="layui-input-block">
          <img v-if="realNameInfo.idCardFront" :src="realNameInfo.idCardFront" class="id-card-img" alt="身份证信息面">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">身份证国徽面</label>
        <div class="layui-input-block">
          <img v-if="realNameInfo.idCardBack" :src="realNameInfo.idCardBack" class="id-card-img" alt="身份证国徽面">
        </div>
      </div>
    </div>
  </div>

  <!-- 未认证状态 -->
  <div v-if="realNameStatus === 'unverified'">
    <div class="layui-form-item">
      <label class="layui-form-label">真实姓名</label>
      <div class="layui-input-block">
        <input type="text" name="realName" v-model="realNameForm.realName" lay-verify="required"
          placeholder="请输入真实姓名" class="layui-input" />
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">身份证号</label>
      <div class="layui-input-block">
        <input type="text" name="idCard" v-model="realNameForm.idCard" lay-verify="required|idCard"
          placeholder="请输入身份证号" class="layui-input" />
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">身份证照片</label>
      <div class="layui-input-block">
        <button type="button" class="layui-btn" @click="selectIdCardPhoto('front')"
          style="background-color: #59d4c8; display: block">
          <i class="layui-icon layui-icon-upload"></i> 上传身份证信息面
        </button>
        <div v-if="realNameForm.idCardFront" class="id-card-preview">
          <img :src="realNameForm.idCardFront" alt="身份证个人信息面" class="id-card-img" />
          <p class="preview-label">身份证信息面预览</p>
        </div>
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label"></label>
      <div class="layui-input-block">
        <button type="button" class="layui-btn" @click="selectIdCardPhoto('back')"
          style="background-color: #59d4c8; display: block">
          <i class="layui-icon layui-icon-upload"></i> 上传身份证国徽面
        </button>
        <div v-if="realNameForm.idCardBack" class="id-card-preview">
          <img :src="realNameForm.idCardBack" alt="身份证国徽面" class="id-card-img" />
          <p class="preview-label">身份证国徽面预览</p>
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn btn-save" lay-submit lay-filter="submit-real-name">
          提交认证
        </button>
      </div>
    </div>
  </div>
</form>

          <!-- 修改密码表单 -->
          <form class="layui-form profile-form" v-if="currentTab === 2">
            <div class="layui-form-item">
              <label class="layui-form-label">原密码</label>
              <div class="layui-input-block">
                <input type="password" name="oldPassword" v-model="passwordForm.oldPassword"
                  lay-verify="required|password" placeholder="请输入原密码" class="layui-input" />
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">新密码</label>
              <div class="layui-input-block">
                <input type="password" name="newPassword" v-model="passwordForm.newPassword"
                  lay-verify="required|password" placeholder="请输入新密码" class="layui-input" />
                <p class="password-rule">密码需8-20位，包含大小写字母、数字和特殊字符</p>
                <p v-if="isSamePassword" class="password-same-warning" style="color: #e6a23c; margin-top: 5px">
                  <i class="layui-icon layui-icon-tips"></i> 新密码不能与原密码相同
                </p>
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">确认密码</label>
              <div class="layui-input-block">
                <input type="password" name="confirmPassword" v-model="passwordForm.confirmPassword"
                  lay-verify="required|confirmPassword" placeholder="请确认新密码" class="layui-input" />
              </div>
            </div>
            <!-- 添加邮箱和验证码 -->
            <div class="layui-form-item">
              <label class="layui-form-label">邮箱</label>
              <div class="layui-input-block">
                <input v-model="passwordForm.email" type="text" name="email" placeholder="绑定的邮箱" class="layui-input"
                  readonly />
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">验证码</label>
              <div class="layui-input-block code-input">
                <input type="text" name="verificationCode" lay-verify="required" v-model="passwordForm.code"
                  placeholder="请输入邮箱验证码" class="layui-input" />
                <button style="background-color: #fd9860" type="button" class="layui-btn"
                  :class="{ 'layui-btn-disabled': isSendingCode }" @click="sendVerificationCode"
                  :disabled="isSendingCode">
                  {{ isSendingCode ? `${countDown}s后重新发送` : '获取验证码' }}
                </button>
              </div>
            </div>

            <div class="layui-form-item">
              <div class="layui-input-block">
                <button class="layui-btn btn-save" lay-submit lay-filter="change-password">
                  确认修改
                </button>
                <button class="layui-btn delete-btn" type="button" @click="cancelWord">取消修改</button>

              </div>
            </div>
            
          </form>

          <!-- 地址管理 -->
          <div v-if="currentTab === 3">
            <button class="layui-btn btn-save" @click="
              () => {
                resetAddressForm()
                showAddressForm = true
              }
            ">
              <i class="layui-icon layui-icon-add-circle"></i> 添加新地址
            </button>

            <!-- 地址表单 -->
            <div v-if="showAddressForm" class="address-form-container">
              <form class="layui-form profile-form">
                <div class="layui-form-item">
                  <label class="layui-form-label">收件人</label>
                  <div class="layui-input-block">
                    <input type="text" v-model="addressForm.consignee" placeholder="请输入收件人姓名" class="layui-input" />
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">联系电话</label>
                  <div class="layui-input-block">
                    <input type="text" v-model="addressForm.phone" lay-verify="phone" placeholder="请输入联系电话"
                      class="layui-input" />
                  </div>
                </div>

                <!-- <div class="layui-form-item">
                  <label class="layui-form-label">所在地区</label>
                  <div class="layui-input-block"> -->
                <AddressSelect v-model="selectedAddress" />

                <div class="layui-form-item">
                  <label class="layui-form-label">详细地址</label>
                  <div class="layui-input-block">
                    <textarea v-model="addressForm.detailAddress" placeholder="请输入详细地址" class="layui-textarea"
                      rows="3"></textarea>
                  </div>
                </div>

                <div class="layui-form-item">
                  <label class="layui-form-label">默认地址</label>
                  <div class="layui-input-block">
                    <el-switch style="height: 39px; line-height: 21px" v-model="addressForm.isDefault" active-text="是"
                      inactive-text="否" active-color="#fd9860" />
                  </div>
                </div>

                <div class="layui-form-item">
                  <div class="layui-input-block">
                    <button class="layui-btn btn-save" type="button" @click="saveAddress">
                      保存地址
                    </button>
                    <button class="layui-btn delete-btn" type="button" @click="resetAddressForm">
                      取消
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- 地址列表 -->
            <div class="address-list" v-if="!showAddressForm && addressList.length > 0">
              <div class="address-item" v-for="address in addressList" :key="address.id">
                <div class="address-header">
                  <span class="recipient">{{ address.consignee }} {{ address.phone }}</span>
                  <span class="default-tag" v-if="!address.isDefault">默认地址</span>
                </div>
                <div class="address-content">
                  {{ getProvinceName(address.province) }} {{ getCityName(address.city) }} {{
                    getDistrictName(address.district) }}
                  {{ address.detailAddress }}
                </div>
                <div class="address-actions">
                  <button class="layui-btn btn-edit layui-btn-sm" @click="editAddress(address)">
                    编辑
                  </button>
                  <button class="layui-btn btn-delete layui-btn-sm" @click="deleteAddress(address.id)">
                    删除
                  </button>
                  <button class="layui-btn layui-btn-primary layui-btn-sm" @click="setDefaultAddress(address.id)"
                    v-if="address.isDefault">
                    设为默认
                  </button>
                </div>
              </div>
              <div class="pagination-container">
                <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange"
                  :page-sizes="[3, 5, 8, 10]" :current-page="addressPagination.currentPage"
                  :page-size="addressPagination.pageSize" :total="addressPagination.total"
                  layout="sizes,prev, pager, next, jumper, ->, total" background />
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
import { ref, onMounted, nextTick, watch, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// import axios from 'axios'
import request from '@/utils/request'
import AddressSelect from '@/components/common/CaptchaLoad.vue'
import provincesData from 'china-division/dist/provinces.json';
import citiesData from 'china-division/dist/cities.json';
import districtsData from 'china-division/dist/areas.json';
declare global {
  interface Window {
    layui: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

// 导航项
const navItems = [
  { name: '基本信息', icon: 'layui-icon-user' },
  { name: '实名认证', icon: 'layui-icon-auz' },
  { name: '修改密码', icon: 'layui-icon-password' },
  { name: '我的地址', icon: 'layui-icon-home' },
]

// 状态管理

const currentTab = ref(0)
const isSendingCode = ref(false)
const countDown = ref(60)
const maxBirthdayDate = ref('')
const showSubmittedMaterials = ref(false) 

const realNameInfo = ref({
  realName: '',
  idCard: '',
  idCardFront: '',
  idCardBack: ''
})
const isMessageShowing = ref(false)
const currentMessageInstance = ref<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
// 身份证号脱敏处理
const maskIdCard = (idCard: string) => {
  if (!idCard) return ''
  return idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2')
}
const showMessage = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  // 如果已经有消息在显示，先关闭它
  if (isMessageShowing.value && currentMessageInstance.value) {
    currentMessageInstance.value.close()
  }
  
  // 显示新消息
  currentMessageInstance.value = ElMessage({
    type,
    message,
    onClose: () => {
      isMessageShowing.value = false
      currentMessageInstance.value = null
    }
  })
  
  isMessageShowing.value = true
  return currentMessageInstance.value
}

// 用户信息
const userInfo = ref({
  avatar:
    'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
  nickname: 'PetGo用户',
  sex: '1',
  phone: '',
  birthday: '',
  email: '',
})

// 表单数据
const formData = ref({
  avatar:
    'https://b0.bdstatic.com/ugc/jZ_JPWxjeOnpN8_yzjld7gf29909a77394189861852249c96da6c5.jpg@h_1280',
  nickname: '',
  sex: '',
  phone: '',
  birthday: '',
  email: '',
})
// 地址数据类型定义

interface Address {
  id: string
  consignee: string // 收件人
  phone: string // 电话
  province: string // 省份
  city: string // 城市
  district: string // 区/县
  detailAddress: string // 详细地址
  isDefault: boolean // 是否默认地址
}
// 地址名称映射
interface Area {
  code: string
  name: string
}

interface City extends Area {
  provinceCode: string
}

interface District extends Area {
  cityCode: string
}
// 获取省份名称
const getProvinceName = (provinceCode: string) => {
  const province = (provincesData as Area[]).find(p => p.code === provinceCode)
  return province ? province.name : provinceCode
}

// 获取城市名称
const getCityName = (cityCode: string) => {
  const city = (citiesData as City[]).find(c => c.code === cityCode)
  return city ? city.name : cityCode
}

// 获取区县名称
const getDistrictName = (districtCode: string) => {
  const district = (districtsData as District[]).find(d => d.code === districtCode)
  return district ? district.name : districtCode
}
// 分页信息
const addressPagination = ref({
  currentPage: 1,
  pageSize: 5,
  total: 0,
  pages: 1,
})
const selectedAddress = ref({
  province: '',
  city: '',
  district: '',
})
const handlePageChange = (page: number) => {
  console.log('切换到第', page, '页')
  addressPagination.value.currentPage = page
  getAddressList()
}

const handleSizeChange = (size: number) => {
  console.log('每页条数变更为', size)
  addressPagination.value.pageSize = size
  addressPagination.value.currentPage = 1 // 重置到第一页
  getAddressList()
}

// 地址表单数据
const addressForm = ref<Partial<Address>>({
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
})

// 地址列表
const addressList = ref<Address[]>([])
// 当前编辑的地址ID
const editingAddressId = ref<string | null>(null)
// 控制地址表单显示状态
const showAddressForm = ref(false)

const realNameStatus = ref<'unverified' | 'pending' | 'verified'>('unverified')

const isFetching = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  code: '',
  email: '',
  confirmPassword: '',
})
const isSamePassword = computed(() => {
  return (
    passwordForm.value.oldPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.oldPassword === passwordForm.value.newPassword
  )
})
// let timer: NodeJS.Timeout | null = null

const router = useRouter()
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
// 初始化
onMounted(() => {
  getUserInfo()
  // const today = new Date()
  // // 格式化日期为YYYY-MM-DD格式
  // maxBirthdayDate.value = today.toISOString().split('T')[0]
  passwordForm.value.email = userInfo.value.email
  setTimeout(() => {
    formData.value = { ...userInfo.value }
    passwordForm.value.email = userInfo.value.email
    // 初始化表单验证
    if (window.layui) {
      window.layui.use(['form', 'layer'], (form: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
        form.verify({
          password: function (value: string) {
            const passwordReg =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/
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
          },
          verificationCode: function (value: string) {
            if (!value) {
              return '请输入验证码'
            }
            if (value.length !== 6) {
              return '验证码长度应为6位'
            }
          },
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
          form.validate((valid: boolean) => {
            if (valid) {
              // 验证通过，执行实际的修改密码逻辑
              changePassword()
            } else {
              // 验证失败，不执行修改密码逻辑
              return false
            }
          })
          return false
        })

        form.render()
      })
    }
  }, 500)

  watch(currentTab, () => {
    nextTick(() => {
      if (window.layui) {
        window.layui.use('form', (form: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
          form.render()
        })
      }
      if (currentTab.value === 3) {
        // 重置到第一页
        addressPagination.value.currentPage = 1
        getAddressList()
      }
      if (currentTab.value === 1) {
        getUserInfo()
      }
    })
  })
  watch(realNameStatus,()=>{
    showSubmittedMaterials.value = false
  })
})

onUnmounted(() => {
  // if (timer) {
  //   clearInterval(timer)
  // }
})



//发送验证码
const sendVerificationCode = async () => {
  if (isSendingCode.value || countDown.value < 60) return

  if (!userInfo.value.email) {
    ElMessage.warning('未绑定邮箱，请先绑定邮箱')
    return
  }

  try {
    isSendingCode.value = true
    // 模拟发送验证码接口
    const response = await request(
      '/server/api/user/sendCode',
      'POST',
      {
        email: userInfo.value.email,
      },
      {
        headers: {
          // 明确告诉后端参数格式是 x-www-form-urlencoded
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    console.log('发送验证码:', response)
    if (response.code === 0) {
      ElMessage.success('验证码已发送至您的邮箱')
      // 开始倒计时
      startCountDown()
    } else {
      ElMessage.error(response.msg || '发送验证码失败，请稍后重试')
      isSendingCode.value = false
    }
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    ElMessage.error('发送验证码失败，请稍后重试')
    isSendingCode.value = false
    console.log(error)
    if (countDown.value < 60) {
      stopCountDown()
    }
  }
}


// 开始倒计时
const startCountDown = () => {
  countDown.value = 60
  // timer = setInterval(() => {
  //   countDown.value--
  //   if (countDown.value <= 0) {
  //     stopCountDown()
  //   }
  // }, 1000)
}

// 停止倒计时
const stopCountDown = () => {
  // if (timer) {
  //   clearInterval(timer)
  //   timer = null
  // }
  isSendingCode.value = false
}

// 获取用户信息
const getUserInfo = async () => {
  if (isFetching.value) return
  isFetching.value = true
  try {

    const userId = localStorage.getItem('userId') || ''
  

    if (!userId) {
      window.layui?.layer.msg('用户未登录')
      router.push('/login')
    }
    const response = await request('/server/api/user/getUserInfo/userId', 'GET', {
      userId: userId,
    })

    if (response.code == 0) {
      const userData = response.data.userVO
      console.log('获取用户信息成功:', userData)
      // 更新用户信息
      userInfo.value = {
        ...userInfo.value,
        nickname: userData.username,
        sex: userData.gender,
        phone: userData.phone,
        birthday: userData.birthday,
        avatar: userData.avatar,
        email: userData.email,
      }
       if (userData.status) {
      console.log('实名认证状态:', userData.status)
        realNameInfo.value = {
          realName: userData.realName,
          idCard: userData.idCard,
          idCardFront: userData.idCardFront,
          idCardBack: userData.idCardBack
        }
      } 

      // 同步更新表单数据
      formData.value = { ...userInfo.value }
      // 设置实名认证状态
      if (userData.status) {
        // 根据后端返回的状态设置 realNameStatus
        // 假设后端返回的 status 值含义：
        // 0: 未认证, 1: 审核中, 2: 已认证
        switch (userData.status) {
          case 0:
            realNameStatus.value = 'unverified'
            break
          case 1:
            realNameStatus.value = 'pending'
            break
          case 2:
            realNameStatus.value = 'verified'
            break
          default:
            realNameStatus.value = 'unverified'
        }
      
      }
      // 重新渲染表单
      if (window.layui) {
        window.layui.use('form', (form: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
          form.render()
        })
      }
    } else {
      ElMessage.primary('请完善用户信息')
    }
  } catch (error) {
    console.log('获取用户信息失败:', error)
    // window.layui?.layer.msg('获取用户信息失败')
  } finally {
    isFetching.value = false // 请求完成后释放锁
  }
}

// 获取地址列表
const getAddressList = async () => {
  try {
    const userId = localStorage.getItem('userId') || ''
    if (!userId) {
      ElMessage.warning('用户未登录或会话已过期，请重新登录')
      addressList.value = []
      return
    }
    const response = await request(
      '/server/api/user/getUserAddresses',
      'GET',
      {
        pageNum: addressPagination.value.currentPage,
        pageSize: addressPagination.value.pageSize,
      },

    )
    console.log('获取地址列表成功:', response.data)
    addressList.value = response.data.list || []
    addressPagination.value.total = response.data.total || 0
    addressPagination.value.pages = response.data.pages || 1
    // 如果是第一页且没有地址，则显示添加地址表单
    if (addressPagination.value.currentPage === 1 && addressList.value.length === 0) {
      showAddressForm.value = true
    }
  } catch (error) {
    console.log('获取地址列表:', error)

    ElMessage.error('获取地址失败，请稍后重试')
  }
}

// 新增/编辑地址
const saveAddress = async () => {
  // 表单验证
  if (!addressForm.value.consignee) {
    ElMessage.error('请填写收件人')
    return
  }

  if (!addressForm.value.phone) {
    ElMessage.error('请填写联系电话')
    return
  }

  // 验证电话号码格式
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(addressForm.value.phone)) {
    ElMessage.error('请输入正确的手机号码')
    return
  }
  // 使用 AddressSelect 组件的数据
  addressForm.value.province = selectedAddress.value.province
  addressForm.value.city = selectedAddress.value.city
  addressForm.value.district = selectedAddress.value.district
  if (
    !addressForm.value.province ||
    !addressForm.value.city ||
    !addressForm.value.district ||
    !addressForm.value.detailAddress
  ) {
    ElMessage.error('请填写完整地址信息')
    return
  }

  try {

    const addressAdd = {
      consignee: addressForm.value.consignee,
      phone: addressForm.value.phone,
      province: addressForm.value.province,
      city: addressForm.value.city,
      district: addressForm.value.district,
      detailAddress: addressForm.value.detailAddress,
      isDefault: addressForm.value.isDefault ? 0 : 1,
    }
    const addressAddId = {
      id: editingAddressId.value, // 单独的id
      consignee: addressForm.value.consignee,
      phone: addressForm.value.phone,
      province: addressForm.value.province,
      city: addressForm.value.city,
      district: addressForm.value.district,
      detailAddress: addressForm.value.detailAddress,
      isDefault: addressForm.value.isDefault ? 0 : 1,
    }
    let response: any // eslint-disable-line @typescript-eslint/no-explicit-any
    if (editingAddressId.value) {
      // 编辑地址  

      response = await request(`/server/api/user/updateUserAddress?id=${editingAddressId.value}`, 'POST', addressAddId)
      console.log('编辑地址返回:', response)
      if (response.code === 0) {
        ElMessage.success('地址更新成功')
      } else {
        ElMessage.error(response.msg || '地址更新失败')
        return
      }
    } else {
      console.log('新增地址数据:', addressForm)
      // 新增地址
      response = await request('/server/api/user/addUserAddress', 'POST', addressAdd)
      if (response.code === 0) {
        console.log('新增地址返回:', response)
        ElMessage.success('地址添加成功')

      } else {
        console.log('新增地址失败:', response)
        return
      }
    }
    resetAddressForm()
    getAddressList()
  } catch (error) {
    // ElMessage.error('保存地址失败，请稍后重试')
    console.error('保存地址失败:', error)
  }
}

// 获取地址详细信息
const editAddress = async (address: Address) => {
  try {
    // 调用后端接口获取地址详情
    const response = await request(
      '/server/api/user/UserAddressDetail',
      'GET',
      { id: address.id }
    )

    if (response.code === 0 && response.data) {
      console.log('获取地址详情成功:', response.data)
      // 成功获取地址详情后填充表单
      const addressDetail = response.data
      addressForm.value = {
        consignee: addressDetail.consignee,
        phone: addressDetail.phone,
        province: addressDetail.province,
        city: addressDetail.city,
        district: addressDetail.district,
        detailAddress: addressDetail.detailAddress,
        isDefault: addressDetail.isDefault === 0 // 根据后端返回值调整
      }

      editingAddressId.value = addressDetail.id
      showAddressForm.value = true

//  const codes = getAddressCodeByName(
//           addressDetail.province, 
//           addressDetail.city, 
//           addressDetail.district
//         )
        
        // 回显地址选择器数据（使用编码）
        selectedAddress.value = {
          province: addressDetail.province,
          city: addressDetail.city,
          district: addressDetail.district,
        }
    } else {
      ElMessage.error(response.msg || '获取地址详情失败')
    }
  } catch (error) {
    console.error('获取地址详情失败:', error)
    ElMessage.error('获取地址详情失败，请稍后重试')
  }
}

// 删除地址
const deleteAddress = (id: string) => {
  window.layui.layer.confirm(
    '确定要删除这个地址吗？',
    {
      title: '提示',
    },
    async (index: number) => {
      try {
       const response = await request(
      '/server/api/user/deleteUserAddress',
      'POST',
      {
        id: id,
      },
      {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      console.log('删除成功:', response)
    if (response.code === 0) {
      window.layui.layer.close(index)
    ElMessage.success('地址删除成功!')
        getAddressList()
    }      
      } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
        console.error('删除失败:', error)
        ElMessage.error('删除失败，请稍后重试')
      }finally{
        window.layui.layer.close(index) 
      }
    },
  )
}

// 设为默认地址
const setDefaultAddress = async (id: string) => {
  try {
     const response = await request(
      '/server/api/user/setDefaultUserAddress',
      'POST',
      {
        id: id,
      },
      {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      console.log('设置默认地址成功:', response)
    if (response.code === 0) {
       ElMessage.success('默认地址更改成功')
    getAddressList()
    }
    else{
      ElMessage.error('设置默认地址失败')
    } 
  } catch (error) {

    console.error('操作失败:', error)
  }
}

// 重置地址表单
const resetAddressForm = () => {
  addressForm.value = {
    consignee: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false,
  }
  editingAddressId.value = ''
  showAddressForm.value = false

  // 重置地址选择器
  selectedAddress.value = {
    province: '',
    city: '',
    district: '',
  }
}

// 取消编辑，恢复原始值
const cancelEdit = () => {
  const isBaseInfoModified =
    formData.value.nickname !== userInfo.value.nickname ||
    formData.value.sex !== userInfo.value.sex ||
    formData.value.phone !== userInfo.value.phone ||
    formData.value.birthday !== userInfo.value.birthday ||
    formData.value.email !== userInfo.value.email;

  // 如果没有修改，则直接返回，不执行后续操作
  if (!isBaseInfoModified) {
    ElMessage.info('您还没有进行任何修改')
    return
  }

  // 如果有修改，则执行重置操作
  formData.value = { ...userInfo.value }

  if (window.layui) {
    window.layui.use('form', (form: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
      form.render()
    })
  }

  ElMessage.success('已恢复原始值')
}
const cancelWord = () => {
  // 判断密码表单是否有修改
  const isPasswordFormModified =
    passwordForm.value.oldPassword !== '' ||
    passwordForm.value.newPassword !== '' ||
    passwordForm.value.code !== '' ||
    passwordForm.value.confirmPassword !== '';

  // 如果没有修改，则直接返回，不执行后续操作
  if (!isPasswordFormModified) {
    ElMessage.info('您还没有进行任何修改')
    return
  }

  // 如果有修改，则执行重置操作
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    email: userInfo.value.email,
    code: '',
    confirmPassword: '',
  }

  if (window.layui) {
    window.layui.use('form', (form: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      form.render()
    })
  }

  ElMessage.success('已恢复原始值')
}

// 处理签名输入

// 头像上传相关


const handleAvatarUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    // 文件类型和大小验证
    if (!file.type.startsWith('image/')) {
      window.layui?.layer.msg('请上传图片文件')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      window.layui?.layer.msg('图片大小不能超过5MB')
      return
    }

    try {
      // 创建 FormData 对象用于上传文件
      const avatarData = new FormData()
      avatarData.append('avatarUrl', file) // 注意参数名是 avatarUrl

      // 调用后端接口上传头像
      const response = await request('/server/api/user/updateUserAvatar', 'POST', avatarData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('头像上传返回:', response, response.code)
      if (response.code == 0) {
        // 更新用户信息中的头像URL
        userInfo.value.avatar = URL.createObjectURL(file)
        formData.value.avatar = URL.createObjectURL(file)

        ElMessage.success('头像上传成功！')
      } else {
        // ElMessage.error('头像上传失败！')
      }
    } catch (error) {
      console.error('头像上传失败:', error)
      // ElMessage.error('头像上传失败，请稍后重试')
    }
  }
}
const realNameForm = ref({
  realName: '',
  idCard: '',
  idCardFront: '',
  idCardBack: '',
  idCardFrontFile: null as File | null,
  idCardBackFile: null as File | null,
})

// 选择身份证照片
const selectIdCardPhoto = (type: 'front' | 'back') => {
  // 创建文件输入元素
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.style.display = 'none'

  fileInput.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      // 文件类型和大小验证
      if (!file.type.startsWith('image/')) {
        ElMessage.error('请上传图片文件')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过5MB')
        return
      }

      // 创建预览URL并保存文件
      const previewUrl = URL.createObjectURL(file)

      if (type === 'front') {
        // 保存正面照片文件和预览URL
        realNameForm.value.idCardFrontFile = file
        realNameForm.value.idCardFront = previewUrl
        ElMessage.success('身份证个人信息面已上传')
      } else {
        // 保存反面照片文件和预览URL
        realNameForm.value.idCardBackFile = file
        realNameForm.value.idCardBack = previewUrl
        ElMessage.success('身份证国徽面已上传')
      }
    }
  }

  // 触发文件选择
  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
}


const isUPing = ref(false)
// 保存修改的基本信息
const saveBaseInfo = async () => {
  if (isUPing.value) return
  isUPing.value = true

  if (formData.value.nickname.length > 20) {
    ElMessage.error('昵称长度不能超过20个字符')
    return
  }
  if (formData.value.birthday) {
    const birthdayDate = new Date(formData.value.birthday)
    const today = new Date()

    // 检查年龄是否合理（不超过150岁）
    const ageDiff = today.getFullYear() - birthdayDate.getFullYear()
    if (ageDiff > 150) {
      ElMessage.error('请输入合理的生日')
      return
    }
  }
  isUPing.value = true

  try {
    const response = await request(
      '/server/api/user/updateUserInfo',
      'POST',
      {
        userName: formData.value.nickname,
        phone: formData.value.phone,
        gender: formData.value.sex,
        birthday: formData.value.birthday,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    if (response.code == 0) {
      console.log('保存基本信息:', response)

      showMessage( 'success','保存信息成功！')
      // 更新用户信息
      userInfo.value.nickname = formData.value.nickname
      userInfo.value.sex = formData.value.sex
      userInfo.value.phone = formData.value.phone
      userInfo.value.birthday = formData.value.birthday
    } else {
      ElMessage.error(response.msg || '保存失败，请稍后重试')
    }
  } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
    showMessage( 'error',error.message || '保存失败，请稍后重试')
  } finally {
    isUPing.value = false
  }
}

// 提交实名认证
const submitRealName = async () => {
  if (!realNameForm.value.realName || !realNameForm.value.idCard) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (!realNameForm.value.idCardFront || !realNameForm.value.idCardBack) {
    ElMessage.warning('请上传身份证照片')
    return
  }
  if (!realNameForm.value.idCardFrontFile || !realNameForm.value.idCardBackFile) {
    ElMessage.warning('身份证照片文件缺失，请重新上传')
    return
  }

  try {
    // 创建 FormData 对象用于上传文件和文本数据
    const formData = new FormData()
    formData.append('realName', realNameForm.value.realName)
    formData.append('idCard', realNameForm.value.idCard)
    // 将正反面照片都添加到 otherFiles 数组中
    formData.append('otherFiles', realNameForm.value.idCardFrontFile)
    formData.append('otherFiles', realNameForm.value.idCardBackFile)
    console.log('formData', formData)
    // 调用后端接口提交实名认证信息
    const response = await request('/server/api/user/userAuth', 'POST', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.code === 0) {
      realNameStatus.value = 'pending'
        realNameInfo.value = {
        realName: realNameForm.value.realName,
        idCard: realNameForm.value.idCard,
        idCardFront: realNameForm.value.idCardFront,
        idCardBack: realNameForm.value.idCardBack
      }
      ElMessage.success('实名认证提交成功，等待审核')
    } else {
      ElMessage.error(response.msg || '提交失败，请稍后重试')
    }
  } catch (error) {
    console.error('实名认证提交失败:', error)
    ElMessage.error('提交失败，请稍后重试')
  }
}
const changing = ref(false)
// 修改密码
const changePassword = async () => {
  if (changing.value) return
  changing.value = true

  if (
    passwordForm.value.oldPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.oldPassword === passwordForm.value.newPassword
  ) {
    ElMessage.warning('新密码不能与原密码相同！')
    return
  }
  const requestData = {
    oldPassword: passwordForm.value.oldPassword,
    newPassword: passwordForm.value.newPassword,
    code: passwordForm.value.code,
    email: passwordForm.value.email,
  }
  try {
    const response = await request('/server/api/user/changePassword', 'POST', requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    console.log('修改密码返回:', response)
    if (response.code == 0) {
      ElMessage.success('密码修改成功，请重新登录')
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        email: '',
        code: '',
        confirmPassword: '',
      }

      router.push('/login')
    } else {
      console.log('修改密码返回:', response)
    }
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally {
    changing.value = false
  }
}

// 退出登录
const logout = () => {
  window.layui.layer.confirm(
    '确定要退出登录吗？',
    {
      title: '提示',
    },
    (index: number) => {
      // 清除认证信息
      localStorage.removeItem('authToken')
      localStorage.removeItem('userId')
      window.layui.layer.close(index)
      router.push('/login')
    },
  )
}
</script>


<style scoped>
/* 添加查看材料按钮样式 */
.view-materials-section {
  margin-left: 60px;
  margin-top: 15px;
  text-align: center;
}

.view-materials-section .layui-btn {
  background-color: #fff;
  border: 1px solid #fd9860;
  color: #fd9860;
}

.view-materials-section .layui-btn:hover {
  background-color: #fdf4ef;
}



.info-display {
  height: 38px;
  line-height: 38px;
  padding: 0 10px;
  background-color: #f5f5f5;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  color: #333;
}

.id-card-img {
  max-width: 300px;
  max-height: 200px;
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}


.submitted-materials {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #eee;
}

.submitted-materials h4 {
  margin-bottom: 15px;
  color: #666;
  font-size: 16px;
}

.info-display {
  height: 38px;
  line-height: 38px;
  padding: 0 10px;
  background-color: #f5f5f5;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  color: #333;
}


.id-card-img {
  max-width: 300px;
  max-height: 200px;
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.show-photos{
position: absolute;
    width: 72%;
    height: 70%;
    bottom: -29%;
    right: 17%;
}

.show-photo{
 position: absolute;
    width: 67%;
    height: 71%;
    bottom: 8%;
    right: -89%;
}
.show-photo img{
  max-width: 100%;
  max-height: 300px;
}
.show-photo-btn{
  position: absolute;
    width: 20%;
    height: 20%;
    bottom: 10%;
    right: 10%;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.show-photo-btn img{
  width: 30%;
  height: 30%;
}
.show-photo-btn:hover{
  background-color: #f5f5f5;
}
.show-photo-btn:active{
  background-color: #eee;
}
.show-photo-btn:focus{
  outline: none;
}
.show-photo-btn:disabled{
  cursor: not-allowed;
}

:deep(.layui-form-radio:hover>*, .layui-form-radioed, .layui-form-radioed>i) {
  color: #fd9860;
}

:deep(.layui-form-radioed) {
  color: #fd9860;
}

:deep(.layui-form-radioed>i) {
  color: #fd9860;
}

.address-content {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.empty-address {
  margin-top: 2rem;
  text-align: center;
  color: #999;
  padding: 2rem 0;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.id-card-preview {
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  display: inline-block;
  background-color: #f9f9f9;
  text-align: center;
}

.id-card-img {
  max-width: 300px;
  max-height: 200px;
  display: block;
  margin: 0 auto;
}

.preview-label {
  margin: 5px 0 0;
  font-size: 0.85rem;
  color: #666;
}

.el-switch.is-checked .el-switch__core {
  color: #fd9860 !important;
  background-color: #fd9860 !important;
  border-color: #fd9860 !important;
}

:deep(.el-switch.is-checked .el-switch__core) {
  color: #fd9860 !important;

  background-color: #fd9860 !important;
  border-color: #fd9860 !important;
}

.el-switch__label.is-active {
  color: #fd9860;
}

:deep(.el-switch__label.is-active) {
  color: #fd9860;
}

.layui-btn-disabled {
  background-color: #f5f5f5 !important;
  border-color: #ddd !important;
  color: #999 !important;
  cursor: not-allowed !important;
}

.layui-input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

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
  border-radius: 2px;
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

.word-count {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.85rem;
  text-align: right;
}

.delete-btn {
  min-width: 120px;
  border-color: #d2d2d2;
  background: 0 0;
  color: #5f5f5f;
}

.delete-btn:hover {
  border-color: #fd9860;
  color: #fd9860;
}

.btn-edit {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
  min-width: 60px;
}

.btn-edit:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* 删除按钮样式 */
.btn-delete {
  background-color: #f44b4b;
  border-color: #f44b4b;
  color: white;
  min-width: 60px;
}

.btn-delete:hover {
  background-color: #fb7b7b;
  border-color: #fb7b7b;
}

.layui-btn-primary:hover {
  border-color: #fd9860;
  color: #fd9860;
}

.layui-input:focus,
.layui-textarea:focus {
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

.header-actions {
  display: flex;
  gap: 1rem;
}

/* 主体内容样式 */
.profile-body {
  display: flex;
  min-height: calc(100vh - 133px);
}

/* 侧边栏样式 */
.sidebar {
  position: relative;
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
  position: relative;
}

.layui-form-item {
  margin-bottom: 1.5rem;
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
:deep(.layui-form-label) {
    width: 101px !important;
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


}
</style>
