<template>
  <div v-if="isLoading" class="loading-state">
    <i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i>
    <p>加载中...</p>
  </div>
  <form class="layui-form profile-form" @submit.prevent="handleSubmit" v-else>
    <!-- 审核中状态 -->
    <div v-if="localStatus === 'pending'">
      <div class="verify-status">
        <div class="status-icon pending">
          <i class="layui-icon layui-icon-log"></i>
        </div>
        <div class="status-text">
          <h3>实名认证审核中</h3>
          <p>您的实名认证申请正在审核中，请耐心等待</p>
        </div>
        <div class="view-materials-section">
          <button type="button" class="layui-btn layui-btn-primary"
            @click="showSubmittedMaterials = !showSubmittedMaterials">
            {{ showSubmittedMaterials ? '隐藏材料' : '查看已提交材料' }}
          </button>
        </div>
      </div>
      <div class="submitted-materials" v-if="showSubmittedMaterials">
        <h4>已提交的认证材料：</h4>
        <div class="layui-form-item">
          <label class="layui-form-label">真实姓名</label>
          <div class="layui-input-block info-display">
            {{ localInfo.realName || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">身份证号</label>
          <div class="layui-input-block info-display">
            {{ maskIdCard(localInfo.idCard) || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">用户性别</label>
          <div class="layui-input-block info-display">
            {{ localInfo.gender === 1 ? '男' : localInfo.gender === 2 ? '女' : '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">出生日期</label>
          <div class="layui-input-block info-display">
            {{ localInfo.birthday || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">用户地址</label>
          <div class="layui-input-block info-display">
            {{ localInfo.address || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label" style="width: 114px">身份证信息面</label>
          <div class="layui-input-block">
            <img v-if="localInfo.idCardFront" :src="localInfo.idCardFront" class="id-card-img" alt="身份证信息面" />
            <span v-else>未上传</span>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label" style="width: 114px">身份证国徽面</label>
          <div class="layui-input-block">
            <img v-if="localInfo.idCardBack" :src="localInfo.idCardBack" class="id-card-img" alt="身份证国徽面" />
            <span v-else>未上传</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 已认证状态 -->
    <div v-if="localStatus === 'verified'">
      <div class="verify-status">
        <div class="status-icon success">
          <i class="layui-icon layui-icon-ok"></i>
        </div>
        <div class="status-text">
          <h3>已实名认证</h3>
          <p>您已完成实名认证，不可修改</p>
        </div>
        <div class="view-materials-section">
          <button type="button" class="layui-btn layui-btn-primary"
            @click="showSubmittedMaterials = !showSubmittedMaterials">
            {{ showSubmittedMaterials ? '隐藏材料' : '查看认证材料' }}
          </button>
        </div>
      </div>
      <div class="submitted-materials" v-if="showSubmittedMaterials">
        <h4>认证材料信息：</h4>
        <div class="layui-form-item">
          <label class="layui-form-label">真实姓名</label>
          <div class="layui-input-block info-display">
            {{ localInfo.realName || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">身份证号</label>
          <div class="layui-input-block info-display">
            {{ maskIdCard(localInfo.idCard) || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">用户性别</label>
          <div class="layui-input-block info-display">
            {{ localInfo.gender == 1 ? '男' : localInfo.gender == 2 ? '女' : '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">出生日期</label>
          <div class="layui-input-block info-display">
            {{ localInfo.birthday || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">用户地址</label>
          <div class="layui-input-block info-display">
            {{ localInfo.address || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">身份证信息面</label>
          <div class="layui-input-block">
            <img v-if="localInfo.idCardFront" :src="localInfo.idCardFront" class="id-card-img" alt="身份证信息面" />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">身份证国徽面</label>
          <div class="layui-input-block">
            <img v-if="localInfo.idCardBack" :src="localInfo.idCardBack" class="id-card-img" alt="身份证国徽面" />
          </div>
        </div>
      </div>
    </div>

    <!-- 未认证状态 -->
    <div v-if="localStatus === 'unverified'">
      <div class="layui-form-item">
        <label class="layui-form-label">真实姓名</label>
        <div class="layui-input-block">
          <input type="text" name="realName" v-model="realNameForm.realName" lay-verify="required" placeholder="请输入真实姓名"
            class="layui-input" />
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
        <label class="layui-form-label">用户性别</label>
        <div class="layui-input-block">
          <input type="radio" name="gender" value=1 title="男" v-model="realNameForm.gender" />
          <input type="radio" name="gender" value=2 title="女" v-model="realNameForm.gender" />
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">出生日期</label>
        <div class="layui-input-block">
          <input type="date" name="birthday" v-model="realNameForm.birthday" class="layui-input" />
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">用户地址</label>
        <div class="layui-input-block">
          <input type="text" name="address" v-model="realNameForm.address" placeholder="请输入用户地址" class="layui-input" />
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
          <button class="layui-btn btn-save" type="submit">提交认证</button>
        </div>
      </div>
    </div>
  </form>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
const isLoading = ref(true)
// 接收父组件的状态和信息
defineProps({
  status: {
    type: String,
    required: true,
    validator: (v: string) => ['unverified', 'pending', 'verified'].includes(v)
  },
  info: { type: Object, required: true }
})

// 定义事件
const emit = defineEmits(['submit', 'refresh'])

// 本地状态
const showSubmittedMaterials = ref(false)
const realNameForm = ref({
  realName: '',
  idCard: '',
  gender: 1, 
  birthday: '',
  address: '',
  idCardFront: '',
  idCardBack: '',
  idCardFrontFile: null as File | null,
  idCardBackFile: null as File | null,
})


// 本地状态和信息，用于替代从父组件接收的状态
const localStatus = ref<'unverified' | 'pending' | 'verified'>('unverified')
const localInfo = ref({
  realName: '',
  idCard: '',
  idCardFront: '',
  idCardBack: '',
  gender: 1,
  birthday: '',
  address: '',
})

// 组件挂载时获取实名认证状态
onMounted(() => {
  getRealNameStatus()
})

// 获取实名认证状态的函数
const getRealNameStatus = async () => {
  try {
    isLoading.value = true  // 开始加载
    const userId = localStorage.getItem('userId') || ''
    if (!userId) {
      ElMessage.error('用户未登录')
      return
    }

    const response = await request('/server/api/user/getUserAuth', 'GET')
    console.log('实名认证状态:', response)
    if (response.code === 0) {
      // 根据后端返回的状态设置 localStatus
      if (response.data == 'null') {
        localStatus.value = 'unverified'
        return
      }
      switch (response.data.status) {
        case '待审核':
          localStatus.value = 'pending'
          const pictureUrlArr = JSON.parse(response.data.pictureUrl || '[]');
          // 填充已提交的信息
          localInfo.value = {
            realName: response.data.realName || '',
            idCard: response.data.idCard || '',
            gender: response.data.gender ?? '',
            birthday: response.data.birthday || '',
            address: response.data.address || '',
            idCardFront: pictureUrlArr[0] || '',
            idCardBack: pictureUrlArr[1] || ''
          }
          break
        case '审核通过':
          localStatus.value = 'verified'
          localInfo.value = {
            realName: response.data.realName || '',
            idCard: response.data.idCard || '',
            gender: response.data.gender ?? '',
            birthday: response.data.birthday || '',
            address: response.data.address || '',
            idCardFront: response.data.idCardFront || '',
            idCardBack: response.data.idCardBack || ''
          }
          break
        case '审核未通过':
          localStatus.value = 'unverified'
          // 填充认证信息
          break
        default:
          localStatus.value = 'unverified'
      }
    }
  } catch (error) {
    console.error('获取实名认证状态异常:', error)
  } finally {
    isLoading.value = false  // 无论成功失败都结束加载
  }
}
// 身份证脱敏
const maskIdCard = (idCard: string) => {
  if (!idCard) return ''
  return idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2')
}


// 初始化layui验证
if (window.layui) {
  window.layui.use('form', (form: any) => {
    form.verify({
      idCard: function (value: string) {
        const idCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!idCardReg.test(value)) {
          return '请输入正确的身份证号码'
        }
      }
    })
    form.on('submit(submit-real-name)', () => {
      handleSubmit()
      return false
    })
  })
}

// 选择身份证照片
const selectIdCardPhoto = (type: 'front' | 'back') => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.style.display = 'none'

  fileInput.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请上传图片文件！')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过5MB！')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    if (type === 'front') {
      realNameForm.value.idCardFrontFile = file
      realNameForm.value.idCardFront = previewUrl
      ElMessage.success('身份证个人信息面已上传')
    } else {
      realNameForm.value.idCardBackFile = file
      realNameForm.value.idCardBack = previewUrl
      ElMessage.success('身份证国徽面已上传')
    }
  }

  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
}

// 提交实名认证
const handleSubmit = () => {
  if (!realNameForm.value.realName) {
    ElMessage.warning('请输入真实姓名！')
    return
  }

  // 验证身份证号
  if (!realNameForm.value.idCard) {
    ElMessage.warning('请输入身份证号！')
    return
  }

  // 验证身份证号格式
  const idCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!idCardReg.test(realNameForm.value.idCard)) {
    ElMessage.warning('请输入正确的身份证号码！')
    return
  }

  // 验证性别
  if (!realNameForm.value.gender) {
    ElMessage.warning('请选择性别！')
    return
  }

  // 验证出生日期
  if (!realNameForm.value.birthday) {
    ElMessage.warning('请选择出生日期！')
    return
  }

  // 验证用户地址
  if (!realNameForm.value.address) {
    ElMessage.warning('请输入用户地址！')
    return
  }

  // 验证身份证照片
  if (!realNameForm.value.idCardFront || !realNameForm.value.idCardBack) {
    ElMessage.warning('请上传身份证正反面照片！')
    return
  }

  if (!realNameForm.value.idCardFrontFile || !realNameForm.value.idCardBackFile) {
    ElMessage.warning('身份证照片文件缺失，请重新上传！')
    return
  }

  // 通知父组件提交
  emit('submit', realNameForm.value)
}
</script>

<style scoped>
.loading-state {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.loading-state i {
  font-size: 30px;
  margin-bottom: 15px;
  color: #fd9860;
}

:deep(.layui-form-radioed) {
  color: #fd9860;
}

:deep(.layui-form-radioed > i) {
  color: #fd9860;
}

.layui-input:focus {
  border-color: #fd9860 !important;
  box-shadow: 0 0 0 3px #fd98600f;
}

:deep(.layui-form-label) {
  width: 110px;
}

.profile-form {
  max-width: 600px;
}

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

.id-card-preview {
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  display: inline-block;
  background-color: #f9f9f9;
  text-align: center;
}

.preview-label {
  margin: 5px 0 0;
  font-size: 0.85rem;
  color: #666;
}

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

.btn-save {
  background-color: #fd9860;
  border-color: #fd9860;
  min-width: 120px;
}

.btn-save:hover {
  background-color: #fc8747;
  border-color: #fc8747;
}
</style>