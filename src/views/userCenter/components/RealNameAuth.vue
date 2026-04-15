<template>
  <LoadingComponent v-if="props.loading" />
  <form class="layui-form profile-form" @submit.prevent="handleSubmit" v-else>
    <!--审核失败提示 -->
    <div v-if="showRejectedNotice" class="rejected-notice">
      <div class="notice-content">
        <div class="notice-icon">
          <i class="layui-icon layui-icon-close-fill"></i>
        </div>
        <div class="notice-text">
          <h2>实名认证审核未通过</h2>
          <p>
            很抱歉，您的实名认证申请未通过审核。请检查您提交的信息是否准确无误，特别是身份证照片是否清晰、信息是否完整。
          </p>
          <p>建议：</p>
          <ul>
            <li>确保身份证在有效期内</li>
            <li>确保上传的身份证照片清晰、完整，无遮挡</li>
            <li>确保填写的信息与身份证信息完全一致</li>
            <li>确保身份证正反面照片正确上传</li>
          </ul>
        </div>
      </div>
      <div class="notice-actions">
        <button
          type="button"
          class="layui-btn"
          @click="editAgain"
          style="background-color: #38c79ab3"
        >
          重新编辑
        </button>
        <button
          type="button"
          class="layui-btn"
          @click="acknowledgeRejection"
          style="background-color: #fd9860"
        >
          我已知晓
        </button>
      </div>
    </div>

    <!-- 审核中状态 -->
    <div v-if="localStatus === 'pending' && !showRejectedNotice">
      <div class="verify-status">
        <div class="status-icon pending">
          <i class="layui-icon layui-icon-log"></i>
        </div>
        <div class="status-text">
          <h3>实名认证审核中</h3>
          <p>您的实名认证申请正在审核中，请耐心等待</p>
        </div>
        <div class="view-materials-section">
          <button
            type="button"
            class="layui-btn layui-btn-primary"
            @click="showSubmittedMaterials = !showSubmittedMaterials"
          >
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
          <label class="layui-form-label" style="width: 114px">身份证信息面</label>
          <div class="layui-input-block">
            <img
              v-if="localInfo.idCardFront"
              :src="localInfo.idCardFront"
              class="id-card-img"
              alt="身份证信息面"
            />
            <span v-else>未上传</span>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label" style="width: 114px">身份证国徽面</label>
          <div class="layui-input-block">
            <img
              v-if="localInfo.idCardBack"
              :src="localInfo.idCardBack"
              class="id-card-img"
              alt="身份证国徽面"
            />
            <span v-else>未上传</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 已认证状态 -->
    <div v-if="localStatus === 'verified' && !showRejectedNotice">
      <div class="verify-status">
        <div class="status-icon success">
          <i class="layui-icon layui-icon-ok"></i>
        </div>
        <div class="status-text">
          <h3>已实名认证</h3>
          <p>您已完成实名认证，不可修改</p>
        </div>
        <div class="view-materials-section">
          <button
            type="button"
            class="layui-btn layui-btn-primary"
            @click="showSubmittedMaterials = !showSubmittedMaterials"
          >
            {{ showSubmittedMaterials ? '隐藏材料' : '查看认证材料' }}
          </button>
        </div>
      </div>
      <div class="submitted-materials" v-if="showSubmittedMaterials">
        <h4>认证材料信息：</h4>
        <div class="layui-form-item">
          <label class="layui-form-label specialLabel">真实姓名</label>
          <div class="layui-input-block info-display">
            {{ localInfo.realName || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label specialLabel">身份证号</label>
          <div class="layui-input-block info-display">
            {{ maskIdCard(localInfo.idCard) || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label specialLabel">用户性别</label>
          <div class="layui-input-block info-display">
            {{ localInfo.gender == 1 ? '男' : localInfo.gender == 2 ? '女' : '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label specialLabel">出生日期</label>
          <div class="layui-input-block info-display">
            {{ localInfo.birthday || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label specialLabel">用户地址</label>
          <div class="layui-input-block info-display">
            {{ localInfo.address || '未填写' }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label specialLabel">身份证信息面</label>
          <div class="layui-input-block">
            <img
              v-if="localInfo.idCardFront"
              :src="localInfo.idCardFront"
              class="id-card-img"
              alt="身份证信息面"
            />
            <span v-else>未上传</span>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label specialLabel">身份证国徽面</label>
          <div class="layui-input-block">
            <img
              v-if="localInfo.idCardBack"
              :src="localInfo.idCardBack"
              class="id-card-img"
              alt="身份证国徽面"
            />
            <span v-else>未上传</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 未认证状态 -->
    <div v-if="localStatus === 'unverified' && !showRejectedNotice">
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
          />
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
          />
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">性别</label>
        <div class="layui-input-block">
          <input
            type="radio"
            name="gender"
            value="1"
            v-model.number="realNameForm.gender"
            title="男"
          />
          <input
            type="radio"
            name="gender"
            value="2"
            v-model.number="realNameForm.gender"
            title="女"
          />
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">出生日期</label>
        <div class="layui-input-block">
          <el-date-picker
            class="custom-style"
            v-model="realNameForm.birthday"
            type="date"
            name="birthday"
            lay-verify="required"
            placeholder="请填入出生日期"
            :max-date="new Date()"
            value-format="YYYY-MM-DD"
            style="width: 100%; height: 37px"
            :disabled-date="disabledDate"
          />
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">用户地址</label>
        <div class="layui-input-block">
          <input
            type="text"
            name="address"
            v-model="realNameForm.address"
            placeholder="请输入用户地址"
            class="layui-input"
          />
        </div>
      </div>

      <div class="layui-form-item">
        <label class="layui-form-label">身份证照片</label>
        <div class="layui-input-block">
          <button
            type="button"
            class="layui-btn"
            @click="selectIdCardPhoto('front')"
            style="background-color: #59d4c8; display: block"
          >
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
          <button
            type="button"
            class="layui-btn"
            @click="selectIdCardPhoto('back')"
            style="background-color: #59d4c8; display: block"
          >
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
          <button class="layui-btn btn-save" type="submit">
            {{ wasRejected ? '重新提交认证' : '提交认证' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import LoadingComponent from '@/components/common/LoadingStatus.vue'


const wasRejected = ref(false)

// 接收父组件的状态和信息
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (v: string) => ['unverified', 'pending', 'verified'].includes(v),
  },
  info: { type: Object, required: true },
  isRejected: {
    // 修复：required 改为 false，default 生效
    type: Boolean,
    required: false,
    default: false,
  },
   loading: {
    type: Boolean,
    required: false,
    default: false,
  },
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

// 本地状态和信息
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
const showRejectedNotice = ref(false)

// 用户ID，用于存储是否已知晓的状态
const userId = localStorage.getItem('userId') || ''
const acknowledgedKey = `realname_rejected_acknowledged_${userId}`
const hasAcknowledged = ref(localStorage.getItem(acknowledgedKey) === 'true')
const checkRejectedNotice = () => {
  const shouldShow =
    localStatus.value === 'unverified' && props.isRejected && !hasAcknowledged.value

  showRejectedNotice.value = shouldShow
  wasRejected.value = props.isRejected
  console.log('弹窗触发校验:', {
    localStatus: localStatus.value,
    isRejected: props.isRejected,
    hasAcknowledged: hasAcknowledged.value,
    shouldShow,
  })
}
// 日期禁用逻辑
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

// 核心修改2：优化props.status监听逻辑（加类型校验+弹窗逻辑）
watch(
  () => props.status,
  (newStatus) => {
    console.log('父组件status变化:', newStatus)
    // 强制约束状态为合法值
    const validStatus = ['unverified', 'pending', 'verified'].includes(newStatus)
      ? newStatus
      : 'unverified'
    localStatus.value = validStatus as 'unverified' | 'pending' | 'verified'

    // 核心修改：弹窗触发条件 = 未认证 + 审核未通过 + 未确认

    checkRejectedNotice()
  },
  { immediate: true },
)

watch(
  () => props.isRejected,
  (newIsRejected) => {
    console.log('父组件isRejected变化:', newIsRejected)
    checkRejectedNotice()
  },
  { immediate: true },
)
// 核心修改3：监听props.info（深度监听+初始化同步）
watch(
  () => props.info,
  (newInfo) => {
    console.log('父组件info变化:', newInfo)
    // 同步父组件info到localInfo
    localInfo.value = {
      realName: newInfo.realName || '',
      idCard: newInfo.idCard || '',
      idCardFront: newInfo.idCardFront || '',
      idCardBack: newInfo.idCardBack || '',
      gender: newInfo.gender ?? 1,
      birthday: newInfo.birthday || '',
      address: newInfo.address || '',
    }
  },
  { immediate: true, deep: true },
)

// 核心修改4：移除子组件自身的getRealNameStatus函数（状态由父组件管理）

// 监听localStatus变化，重新渲染LayUI单选框
watch(localStatus, (newStatus) => {
  if (newStatus === 'unverified' && window.layui) {
    setTimeout(() => {
      window.layui.use('form', (form: any) => {
        form.render('radio')
      })
    }, 0)
  }
})

// 组件挂载
onMounted(() => {
  setTimeout(() => {
    if (window.layui) {
      window.layui.use('form', (form: any) => {
        form.verify({
          idCard: function (value: string) {
            const idCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if (!idCardReg.test(value)) {
              return '请输入正确的身份证号码'
            }
          },
        })
        form.on('submit(submit-real-name)', () => {
          handleSubmit()
          return false
        })
        form.render('radio') // 初始化渲染单选框
      })
    }
  }, 200)
})

// 身份证脱敏
const maskIdCard = (idCard: string) => {
  if (!idCard) return ''
  return idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2')
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
  emit('submit', realNameForm.value, wasRejected.value)
}

// 用户点击"我已知晓"
const acknowledgeRejection = () => {
  if (userId) {
    localStorage.setItem(acknowledgedKey, 'true')
    hasAcknowledged.value = true
  }
  showRejectedNotice.value = false
  setTimeout(() => {
    if (window.layui) {
      window.layui.use('form', (form: any) => {
        form.render('radio')
      })
    }
  }, 0)
}

// 重新编辑
const editAgain = () => {
  showRejectedNotice.value = false
  setTimeout(() => {
    if (window.layui) {
      window.layui.use('form', (form: any) => {
        form.render('radio')
      })
    }
  }, 0)
}
</script>

<style scoped>
:deep(.layui-form-radioed) {
  color: #fd9860;
}

:deep(.layui-form-radioed > i) {
  color: #fd9860;
}

:deep(.layui-form-radio:hover > *, .layui-form-radioed, .layui-form-radioed > i) {
  color: #fd9860;
}

.layui-input:focus {
  border-color: #fd9860 !important;
  box-shadow: 0 0 0 3px #fd98600f;
}

:deep(.specialLabel) {
  width: 114px !important;
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

.rejected-notice {
  border: 1px solid #ffccc7;
  border-radius: 8px;
  background-color: #fff2f0;
  padding: 20px;
  margin-bottom: 20px;
}

.notice-content {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.notice-icon {
  font-size: 6px;
  color: #ff4d4f;
  flex-shrink: 0;
}

.notice-text h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.notice-text p {
  margin: 0 0 10px 0;
  color: #666;
  line-height: 1.5;
}

.notice-text ul {
  margin: 10px 0;
  padding-left: 20px;
}

.notice-text li {
  margin-bottom: 5px;
  color: #666;
}

.notice-actions {
  text-align: right;
}

.notice-actions .layui-btn {
  margin-left: 10px;
}
</style>
