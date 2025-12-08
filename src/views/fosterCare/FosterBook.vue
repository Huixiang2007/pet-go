<template>
  <div id="app">
    <NavBar />
    <div class="booking-process">
      <!-- 步骤条 -->
      <el-steps :active="currentStep" finish-status="success" class="booking-steps">
        <el-step title="填写基本信息" />
        <el-step title="选择寄养日期" />
        <el-step title="确认信息" />
        <el-step title="确认支付" />
        <el-step title="支付成功" />
      </el-steps>
      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 第一步：基本信息 -->
        <div v-if="currentStep === 1" class="step-basic-info">
          <el-card shadow="never" class="info-card">
            <template #header>
              <div class="card-header">
                <h3>填写宠物基本信息</h3>
              </div>
            </template>
            <!-- 选择宠物 -->
            <div class="flex flex-col gap-2">
              <div class="section-title">
                <i class="iconfont text-lg text-[#409eff]">&#xe90d;</i>
                <strong class="ml-2 text-lg">选择寄养宠物</strong>
              </div>
              <el-select v-model="selectedPetId" placeholder="选择宠物">
                <el-option v-for="item in myPets" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <!-- 填写特殊要求 -->
            <div class="section mt-6">
              <div class="section-title text-lg">
                <el-icon color="#409eff">
                  <ChatDotRound />
                </el-icon>
                <span>备注</span>
              </div>
              <el-input v-model="textarea" maxlength="100" show-word-limit style="width: 100%; min-width: 500px"
                type="textarea" resize="none" placeholder="请填写宠物的特殊要求，比如宠物的疾病、过敏史、特殊需求等" />
            </div>
            <!-- 上传疫苗本 -->
            <div class="section">
              <div class="section-title">
                <el-icon>
                  <Document />
                </el-icon>
                <span>上传疫苗本</span>
                <el-tooltip content="请上传宠物的疫苗接种记录" placement="top"> </el-tooltip>
              </div>

              <div class="upload-section">
                <el-upload class="vaccine-upload" drag :http-request="handleLocalUpload" :before-upload="beforeUpload"
                  :file-list="vaccineFiles" multiple accept=".jpg,.jpeg,.png,.pdf" :auto-upload="true"
                  :show-file-list="false">
                  <el-icon class="el-icon--upload">
                    <UploadFilled />
                  </el-icon>
                  <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
                  <template #tip>
                    <div class="el-upload__tip">支持 JPG、PNG、PDF 格式，单个文件不超过 5MB</div>
                  </template>
                </el-upload>

                <div v-if="vaccineFiles.length > 0" class="uploaded-files">
                  <div class="files-title">已上传文件：</div>
                  <div class="files-list">
                    <div v-for="(file, index) in vaccineFiles" :key="index" class="file-item">
                      <!-- 图片预览（仅图片文件） -->
                      <div v-if="isImageFile(file.file)" class="file-preview">
                        <img :src="file.previewUrl" alt="预览图" />
                      </div>
                      <!-- 文件图标（非图片文件） -->
                      <div v-else class="file-icon">
                        <el-icon>
                          <Document />
                        </el-icon>
                      </div>
                      <el-icon class="delete-icon" @click="removeFile(index)">
                        <Close />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 第二步：选择寄养日期 -->
        <div v-else-if="currentStep === 2">
          <el-card shadow="never" class="info-card">
            <template #header>
              <div class="card-header">
                <h3 class="header-title">选择寄养日期</h3>
                <span class="header-subtitle">最多可选择 {{ maxStayDays }} 天</span>
              </div>
            </template>
            <div class="date-preview">
              <div class="preview-header">
                <div class="preview-title">30天可用性预览</div>
                <div class="preview-legend">
                  <div class="legend-item">
                    <div class="legend-color available"></div>
                    <span class="legend-text">可预订</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color unavailable"></div>
                    <span class="legend-text">已满</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color selected"></div>
                    <span class="legend-text">已选择</span>
                  </div>
                </div>
              </div>

              <div class="preview-grid">
                <div v-for="(day, index) in previewDays" :key="index" class="preview-day" :class="{
                  available: day.spots > 0,
                  unavailable: day.spots === 0,
                  selected: isDaySelected(day.date),
                  today: isToday(day.date),
                }" @click="onPreviewDayClick(day)">
                  <div class="day-number">{{ day.displayDate }}</div>
                  <div class="day-spots" v-if="day.spots > 0">空位：{{ day.spots }}</div>
                  <div class="day-full" v-else>满</div>
                  <div class="day-today" v-if="isToday(day.date)">今</div>
                </div>
              </div>
              <div class="result-dates">
                <div class="result-label">寄养时间：</div>
                <div class="result-value" v-if="startDate && endDate">
                  {{ formatDisplayDateWithYear(startDate) }} 至
                  {{ formatDisplayDateWithYear(endDate) }}
                </div>
                <div class="result-value" v-else-if="startDate">
                  {{ formatDisplayDateWithYear(startDate) }}
                  <span class="result-hint">请选择结束日期</span>
                </div>
                <div class="result-placeholder" v-else>请选择寄养日期</div>
              </div>

              <div class="result-price">
                <div class="price-label">预计费用：</div>
                <div class="price-value">
                  <span class="price-number">{{ calculatedPrice }}</span>
                  <span class="price-unit">元</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 第三步：确认信息 -->
        <div v-else-if="currentStep === 3">
          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header">
                <h3>确认订单信息</h3>
              </div>
            </template>
            <div class="confirm-info">
              <div class="info-group">
                <h4>
                  <el-icon color="#409eff">
                    <User />
                  </el-icon>
                  宠物信息
                </h4>
                <div class="info-item">
                  <span class="label">宠物名称：</span>
                  <span class="value">{{myPets.find((p) => p.id === selectedPetId)?.name}}</span>
                </div>
                <div class="info-item">
                  <span class="label">特殊备注：</span>
                  <span class="value">{{ textarea || '无' }}</span>
                </div>
                <div class="info-item info-item-files">
                  <div class="flex justify-between">
                    <span class="label">疫苗文件：</span>
                    <span class="value">{{ vaccineFiles.length }} 个文件</span>
                  </div>

                  <div class="vaccineFilesList">
                    <div v-for="(file, index) in vaccineFiles" :key="index" class="file-item">
                      <img :src="file.previewUrl" alt="预览图" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-group">
                <h4>
                  <el-icon color="#409eff">
                    <Calendar />
                  </el-icon>
                  寄养信息
                </h4>
                <div class="info-item">
                  <span class="label">寄养时间：</span>
                  <span class="value">{{ formatDisplayDate(startDate) }} 至 {{ formatDisplayDate(endDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">寄养天数：</span>
                  <span class="value">{{ calculateStayDays() }} 晚</span>
                </div>
              </div>
              <div class="info-group">
                <h4>
                  <el-icon color="#409eff">
                    <Wallet />
                  </el-icon>
                  费用明细
                </h4>
                <div class="info-item">
                  <span class="label">基础费用：</span>
                  <span class="value">{{ selectedPackage?.basePrice || 0 }} × {{ calculateStayDays() }} =
                    {{ (selectedPackage?.basePrice || 0) * calculateStayDays() }} 元</span>
                </div>

                <div class="info-item total">
                  <span class="label">总计：</span>
                  <span class="value">{{ calculatedPrice }} 元</span>
                </div>
              </div>
            </div>
          </el-card>
          <!-- 所选套餐 -->
          <!-- 寄养的宠物信息和特殊要求 -->
          <!-- 寄养的时间 -->
          <!-- 寄养费用 -->
        </div>
        <!-- 第四步：确认支付 -->
        <div v-else-if="currentStep === 4">
          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header">
                <h3>确认支付</h3>
                <span class="step-subtitle">请核对信息并完成支付</span>
              </div>
            </template>

            <!-- 支付方式 -->
            <div class="payment-methods">
              <h4>
                <el-icon color="#409eff">
                  <CreditCard />
                </el-icon>
                选择支付方式
              </h4>
              <el-radio-group v-model="paymentMethod" class="payment-options">
                <el-radio label="wechat" border class="payment-radio">
                  <div class="payment-option">
                    <el-icon color="#67c23a">
                      <Wechat />
                    </el-icon>
                    <span>微信支付</span>
                  </div>
                </el-radio>
                <el-radio label="alipay" border class="payment-radio">
                  <div class="payment-option">
                    <el-icon color="#13c2c2">
                      <AliPay />
                    </el-icon>
                    <span>支付宝</span>
                  </div>
                </el-radio>
                <el-radio label="bank" border class="payment-radio">
                  <div class="payment-option">
                    <el-icon color="#409eff">
                      <CreditCard />
                    </el-icon>
                    <span>银行卡支付</span>
                  </div>
                </el-radio>
              </el-radio-group>
            </div>
            <!-- 服务协议 -->
            <div class="service-agreement">
              <el-checkbox v-model="agreedToTerms" :class="{ 'checkbox-error': !agreedToTerms && isStepValidated[4] }">
                我已阅读并同意
                <el-link type="primary" @click="showAgreement = true">《宠物寄养服务协议》</el-link>
              </el-checkbox>
            </div>
          </el-card>
        </div>
        <!-- 第五步：支付成功 -->
        <div v-if="currentStep === 5">
          <el-card shadow="hover" class="info-card">
            <div class="success-content">
              <el-icon class="success-icon">
                <CircleCheckFilled />
              </el-icon>
              <h2>支付成功！</h2>
              <p>您的寄养订单已提交，寄养家庭将尽快与您联系</p>
              <div class="order-info">
                <p>订单编号：<span></span></p>
                <p>
                  支付金额：<span>{{ calculatedPrice }} 元</span>
                </p>
              </div>
              <el-button type="primary" @click="goToHome">返回首页</el-button>
              <el-button @click="viewOrder">查看订单详情</el-button>
            </div>
          </el-card>
        </div>
      </div>
      <div class="step-actions">
        <el-button v-if="currentStep > 1 && currentStep < 5" @click="previousStep" :disabled="processing"
          class="prev-btn">
          <el-icon>
            <ArrowLeft />
          </el-icon>
          上一步
        </el-button>

        <el-button v-if="currentStep < 4" type="primary" @click="nextStep" :loading="processing" :disabled="!canProceed"
          class="next-btn">
          下一步
          <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>

        <el-button v-if="currentStep === 4" type="success" @click="confirmPayment" :loading="processing"
          :disabled="!canConfirmPayment" class="pay-btn">
          <el-icon>
            <Check />
          </el-icon>
          确认支付
        </el-button>
      </div>
      <!-- 协议弹窗 -->
      <el-dialog v-model="showAgreement" title="宠物寄养服务协议" width="600px">
        <div class="agreement-content">
          <div class="agreement-section">
            <h4>一、服务条款</h4>
            <p>
              1.1 寄养服务由提供方按照约定标准为用户宠物提供照料服务，包括饮食、住宿、日常护理等。
            </p>
            <p>1.2 用户需保证所提供的宠物信息真实有效，包括健康状况、疫苗接种情况等。</p>
          </div>
          <div class="agreement-section">
            <h4>二、双方责任</h4>
            <p>2.1 用户需按时支付寄养费用，逾期未支付视为放弃服务。</p>
            <p>
              2.2 提供方需尽到合理照料义务，因不可抗力或宠物自身原因导致的损失，提供方不承担责任。
            </p>
          </div>
          <div class="agreement-section">
            <h4>三、退款政策</h4>
            <p>3.1 寄养开始前24小时取消订单，可全额退款；24小时内取消，扣除50%费用。</p>
            <p>3.2 寄养期间取消订单，已产生的费用不予退还。</p>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useBookingStore } from '@/stores/booking'
import { useRoute, onBeforeRouteLeave, useRouter } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue';

const router = useRouter()
const currentStep = ref(1)
const processing = ref(false)
const isStepValidated = ref({ 1: false, 2: false, 3: false, 4: false })
const route = useRoute()
const bookingStore = useBookingStore()
// 从store中获取数据
const selectedPackage = computed(() => bookingStore.selectedPackage)
console.log('selectedPackage', selectedPackage.value)
const pathSegments = route.path.split('/').filter((segment) => segment)
const fosterId = pathSegments.find((segment) => /^\d+$/.test(segment)) || ''
if (!selectedPackage.value) {
  ElMessage.error('请先选择套餐！')

  router.push({
    name: 'fosterDetail',
    params: {
      id: fosterId,
    },
  })
}
//如果store中不存在数据，则从路由参数中获取数据
//离开页面清理数据
onBeforeRouteLeave((to, from, next) => {
  // 如果离开到非预约相关页面，清理数据
  if (!to.name?.toString().includes('booking')) {
    bookingStore.clearBookingData()
  }
  next()
})
const bookingForm = reactive({
  petId: null as number | null,
  startDate: '',
  endDate: '',
  note: '',
  vaccineFiles: [] as File[],
})
// 第一步：填写基本信息
const myPets = ref([
  { id: 1, name: '皮皮', breed: '柯基', age: '2岁' },
  { id: 2, name: '小黑', breed: '柴犬', age: '1岁' },
  { id: 3, name: '小黄', breed: '金毛', age: '3岁' },
])
const selectedPetId = ref<number | null>(null)
const textarea = ref('')

// 文件上传
// 定义文件信息的接口，明确包含的属性
interface UploadFileInfo {
  name: string // 文件名
  size: number // 文件大小（字节）
  type: string // 文件类型（如 image/jpeg）
  file: File // 原生File对象（用于提交）
  previewUrl: string // 预览图URL（图片文件）
}

const vaccineFiles = ref<UploadFileInfo[]>([])
// 判断是否为图片文件
const isImageFile = (file: File) => {
  return file.type.startsWith('image/')
}

// 上传前校验（大小+格式）
const beforeUpload = (file: File) => {
  const isLt5M = file.size / 1024 / 1024 < 5
  const isAllowedType = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'].includes(
    file.type,
  )

  if (!isAllowedType) {
    ElMessage.error('仅支持 JPG、PNG、PDF 格式！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB！')
    return false
  }
  return true
}
interface fileOptions {
  file: File
}
// 自定义本地处理文件
const handleLocalUpload = (options: fileOptions) => {
  const file = options.file as File
  // 生成图片预览URL
  const previewUrl = isImageFile(file) ? URL.createObjectURL(file) : ''

  // 将文件信息+预览URL存入数组
  vaccineFiles.value.push({
    name: file.name,
    size: file.size,
    type: file.type,
    file: file, // 保存原生File对象，用于最终提交
    previewUrl: previewUrl,
  })

  ElMessage.success(`${file.name} 已添加！`)
}

// 删除文件
const removeFile = (index: number) => {
  if (index >= 0 && index < vaccineFiles.value.length) {
    const fileInfo = vaccineFiles.value[index]
    // 释放预览URL（仅图片文件）
    if (fileInfo?.previewUrl) {
      URL.revokeObjectURL(fileInfo.previewUrl)
    }
    vaccineFiles.value.splice(index, 1)
  }
}
const realDaySpots = [
  0, // 第1天 - 当天
  0, // 第2天
  0, // 第3天
  2, // 第4天
  2, // 第5天
  1, // 第6天
  1, // 第7天 - 周末
  3, // 第8天
  3, // 第9天
  2, // 第10天
  2, // 第11天
  1, // 第12天
  1, // 第13天
  0, // 第14天 - 周末，已满
  3, // 第15天
  3, // 第16天
  2, // 第17天
  2, // 第18天
  1, // 第19天
  1, // 第20天
  0, // 第21天 - 周末，已满
  3, // 第22天
  2, // 第23天
  2, // 第24天
  1, // 第25天
  1, // 第26天
  0, // 第27天 - 周末，已满
  3, // 第28天
  3, // 第29天
  2, // 第30天
  1, // 第31天
]
// 日期相关
const startDate = ref('')
const endDate = ref('')
// 最大连续可预订天数
const maxStayDays = computed(() => {
  let maxDays = 0
  let currentDays = 0

  for (let i = 0; i < realDaySpots.length; i++) {
    const spot = realDaySpots[i]
    if (spot !== undefined && spot > 0) {
      currentDays++
      maxDays = Math.max(maxDays, currentDays)
    } else {
      currentDays = 0
    }
  }
  return Math.min(maxDays, 30)
})
interface previewDaysOptions {
  index: number
  date: string
  day: number
  spots: number
  month: number
  displayDate: string
}
// 预览天数
const previewDays = computed(() => {
  const days: previewDaysOptions[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const dateStr = formatDateToYYYYMMDD(date)
    const spots = realDaySpots[i]
    if (spots !== undefined) {
      console.log('spots', spots)
      days.push({
        index: i,
        date: dateStr,
        day: date.getDate(),
        month: date.getMonth() + 1,
        spots: spots,
        displayDate: `${date.getMonth() + 1}月${date.getDate()}日`,
      })
    }
  }

  return days
})
// 日期格式转换
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 显示格式
const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
const formatDisplayDateWithYear = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
// 获取日期索引
const getDateIndex = (dateStr: string): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(dateStr)
  targetDate.setHours(0, 0, 0, 0)

  const timeDiff = targetDate.getTime() - today.getTime()
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24))
}

// 检查是否是今天
const isToday = (dateStr: string): boolean => {
  const today = new Date()
  const date = new Date(dateStr)
  return today.toDateString() === date.toDateString()
}

// 检查日期是否被选择
const isDaySelected = (dateStr: string): boolean => {
  if (!startDate.value && !endDate.value) return false
  if (!endDate.value) return dateStr === startDate.value

  const date = new Date(dateStr)
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  return date >= start && date <= end
}

// 预览日期点击
const onPreviewDayClick = (day: previewDaysOptions) => {
  if (day.spots === 0) {
    ElMessage.warning(`${day.displayDate} 已无空位，请选择其他日期`)
    return
  }
  console.log(day.date)
  if (!startDate.value || (startDate.value && endDate.value)) {
    // 重新选择
    startDate.value = day.date
    endDate.value = ''
    validateDateRange(day.date, '')
  } else if (startDate.value && !endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(day.date)

    if (end < start) {
      // 如果选择的结束日期在开始日期之前，交换
      endDate.value = startDate.value
      startDate.value = day.date
    } else {
      endDate.value = day.date
    }
    validateDateRange(startDate.value, endDate.value)
  }
}

// 验证日期范围
const validateDateRange = (startStr: string, endStr: string) => {
  if (!startStr) {
    return
  }

  const startIndex = getDateIndex(startStr)
  const endIndex = getDateIndex(endStr)
  // 检查范围内的每一天都有空位
  let hasNoAvailability = false

  for (let i = startIndex; i <= endIndex; i++) {
    if (i >= realDaySpots.length || realDaySpots[i] === undefined) {
      hasNoAvailability = true
      break
    }
    if (realDaySpots[i] === 0) {
      hasNoAvailability = true
    }
  }

  if (hasNoAvailability) {
    // 自动调整结束日期
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const newEndDate = new Date(today)

    // 找到第一个空位为0的日期
    for (let i = startIndex; i <= endIndex; i++) {
      if (realDaySpots[i] == 0) {
        newEndDate.setDate(today.getDate() + Math.max(startIndex, i - 1))
        break
      }
    }
    console.log(newEndDate)
    setTimeout(() => {
      if (startDate.value === startStr && endDate.value === endStr) {
        endDate.value = formatDateToYYYYMMDD(newEndDate)
        ElMessage.info('已自动调整结束日期，避开不可预订日期')
      }
    }, 100)
  }
}

//计算费用
const calculatedPrice = computed(() => {
  const days = calculateStayDays()
  console.log('days', days)
  if (days === 0 || !selectedPackage.value) return 0
  return selectedPackage.value.basePrice * days
})

// 计算时间
const calculateStayDays = (): number => {
  console.log('startDate', startDate.value)
  console.log('endDate', endDate.value)
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  return Math.max(0, diff)
}

// 支付相关
const paymentMethod = ref('wechat')
const agreedToTerms = ref(false)
const showAgreement = ref(false)
// 步骤校验
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedPetId.value !== null && vaccineFiles.value.length > 0
    case 2:
      return startDate.value && endDate.value
    case 3:
      return true
    case 4:
      return agreedToTerms.value
    default:
      return true
  }
})
// 计算属性
// const selectedPet = computed(() => {
//   return pets.value.find(pet => pet.id === bookingForm.petId)
// })

const canConfirmPayment = computed(() => {
  return (
    agreedToTerms.value &&
    bookingForm.petId !== null &&
    bookingForm.startDate &&
    bookingForm.endDate
  )
})

// const formatDate = (dateStr: string): string => {
//     const date = new Date(dateStr)
//     return `${date.getMonth() + 1}月${date.getDate()}日`
// }

// 步骤控制
const nextStep = async () => {
  //   isStepValidated.value[currentStep.value] = true
  if (!canProceed.value) {
    if (currentStep.value === 1) {
      ElMessage.warning('请选择宠物并上传疫苗文件！')
    } else if (currentStep.value === 2) {
      ElMessage.warning('请选择完整的寄养日期！')
    }
    return
  }

  processing.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    currentStep.value++
  } catch (error) {
    console.error(error)
    ElMessage.error('操作失败，请重试')
  } finally {
    processing.value = false
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 支付确认
const confirmPayment = async () => {
  if (!canConfirmPayment.value) {
    ElMessage.warning('请完成所有必要信息并同意服务协议')
    return
  }

  processing.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    currentStep.value = 5
    ElMessage.success('支付成功！')
  } catch (error) {
    console.error(error)
    ElMessage.error('支付失败，请重试')
  } finally {
    processing.value = false
  }
}
const goToHome = () => {
  router.push('/')
}
const viewOrder = () => {
  router.push('/orders')
}

// ==================== 操作按钮处理 ====================
// const confirmSelection = async () => {
//     if (!isSelectionValid.value) {
//         ElMessage.error('请选择有效的日期范围')
//         return
//     }

//     confirmLoading.value = true

//     try {
//         const selection = {
//             package: selectedPackage.value,
//             startDate: startDate.value,
//             endDate: endDate.value,
//             price: calculatedPrice.value
//         }

//         // 模拟API调用
//         await new Promise(resolve => setTimeout(resolve, 1000))

//         ElMessage.success({
//             message: `预订成功！${formatDisplayDate(startDate.value)} 至 ${formatDisplayDate(endDate.value)}，共 ${stayNights.value} 晚`,
//             duration: 3000
//         })

//         // 触发父组件事件
//         emit('confirm', selection)

//     } catch (error) {
//         ElMessage.error('预订失败，请稍后重试')
//     } finally {
//         confirmLoading.value = false
//     }
// }

onMounted(() => {
  // // 初始化选择第一个可用的套餐
  // const availablePackage = packages.find(pkg => pkg.availableSpots > 0)
  // if (availablePackage) {
  //     selectedPackage.value = availablePackage.type
  // }
})
</script>

<style scoped lang="scss">
#app {
  border-top: 1px solid transparent;
}

// 全局样式
.booking-process {
  max-width: 1200px;
  margin: 5.3rem auto;
  padding: 30px 20px;
  min-height: 100vh;
}

// 步骤条
.booking-steps {
  margin-bottom: 40px;

  :deep(.el-step__title) {
    font-weight: 500;
  }
}

// 步骤内容
.step-content {
  min-height: 500px;
  margin-bottom: 40px;
}

// 卡片样式（蓝色主题）
.info-card {
  border: 2px solid #e8f4fc;
  border-radius: 12px;
  background-color: #fff;
  transition: all 0.3s ease;

  :deep(.el-card__header) {
    border-bottom: 1px solid #e8f4fc;
    background-color: #f0f9ff;
    padding: 16px 20px;
    border-radius: 12px 12px 0 0;
  }

  :deep(.el-card__body) {
    padding: 24px;
  }
}

// 卡片头部
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: #1f2937;
    font-size: 18px;
    font-weight: 600;
  }

  .step-subtitle {
    color: #64748b;
    font-size: 14px;
  }
}

// 章节标题
.section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-weight: 600;
    color: #1f2937;
    font-size: 16px;

    .tip-icon {
      margin-left: 8px;
      cursor: help;
    }
  }
}

// 输入框错误样式
.input-error {
  :deep(.el-input__wrapper) {
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }
}

.checkbox-error {
  :deep(.el-checkbox__input.is-error .el-checkbox__inner) {
    border-color: #ef4444;
  }
}

// 文件上传区域
.upload-section {
  margin-top: 16px;
}

.vaccine-upload {
  margin-bottom: 24px;

  :deep(.el-upload-dragger) {
    border: 2px dashed #409eff;
    background-color: #f0f9ff;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e6f7ff;
    }
  }

  :deep(.el-upload__tip) {
    font-size: 13px;
  }
}

.uploaded-files {
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;

  .files-title {
    font-weight: 500;
    color: #334155;
    margin-bottom: 12px;
    font-size: 14px;
  }

  .files-list {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .file-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
    padding: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .file-preview {
    width: 96px;
    height: 96px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
    background: #f1f5f9;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .file-icon {
    width: 96px;
    height: 96px;
    border-radius: 4px;
    background: #e0f2fe;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    font-size: 28px;
  }

  .file-info {
    text-align: center;
    width: 100%;
    margin-bottom: 8px;

    .file-name {
      display: block;
      font-size: 12px;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }

    .file-size {
      font-size: 11px;
      color: #64748b;
    }
  }

  .delete-icon {
    cursor: pointer;
    font-size: 16px;

    &:hover {
      color: #ef4444;
    }
  }
}

// 日期预览
.date-preview {
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .preview-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
    }

    .preview-legend {
      display: flex;
      gap: 16px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .available {
          background-color: #e0f2fe;
          border: 1px solid #409eff;
        }

        .unavailable {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
        }

        .selected {
          background-color: #409eff;
          border: 1px solid #2563eb;
        }

        .legend-text {
          font-size: 12px;
          color: #475569;
        }
      }
    }
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 24px;

    .preview-day {
      aspect-ratio: 1;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      padding: 8px;

      .day-number {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .day-spots {
        font-size: 12px;
        color: #16a34a;
      }

      .day-full {
        font-size: 12px;
        color: #ef4444;
      }

      .day-today {
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 10px;
        color: #fff;
        background: #16a34a;
        border-radius: 2px;
        padding: 0 3px;
      }

      &.available {
        background-color: #f0f9ff;
        border: 1px solid #94a3b8;

        &:hover {
          background-color: #e0f2fe;
          border-color: #409eff;
          transform: translateY(-2px);
        }
      }

      &.unavailable {
        background-color: #fef2f2;
        border: 1px solid #fecdd3;
        cursor: not-allowed;
        opacity: 0.7;
      }

      &.selected {
        background-color: #409eff;
        color: #fff;
        border-color: #2563eb;

        .day-spots {
          color: #dcfce7;
        }

        &:hover {
          background-color: #e0f2fe;
          color: #409eff;

          .day-spots {
            color: #409eff;
          }
        }
      }

      &.today {
        border-width: 2px;
      }
    }
  }

  .result-dates,
  .result-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f8fafc;
    border-radius: 8px;
    margin-bottom: 12px;

    .result-label,
    .price-label {
      font-size: 14px;
      color: #475569;
      font-weight: 500;
    }

    .result-value,
    .price-value {
      font-size: 15px;
      color: #1e293b;

      .result-nights {
        font-size: 14px;
        color: #64748b;
        margin-left: 8px;
      }

      .result-hint {
        font-size: 14px;
        color: #f59e0b;
        margin-left: 8px;
      }

      .price-number {
        font-size: 18px;
        font-weight: 600;
        color: #409eff;
        margin-right: 4px;
      }
    }

    .result-placeholder {
      font-size: 14px;
      color: #94a3b8;
      font-style: italic;
    }
  }
}

// 确认信息页
.confirm-info {
  .info-group {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e2e8f0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      color: #1f2937;
      font-size: 16px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;

      .label {
        color: #475569;
        font-size: 14px;
      }

      .value {
        color: #1e293b;
        font-size: 14px;
        font-weight: 500;

        &.total {
          color: #409eff;
          font-size: 16px;
        }
      }
    }
  }

  .info-item-files {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .vaccineFilesList {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 8px;

      .file-item {
        width: 130px;
        height: 130px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
        background: #f1f5f9;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}

// 支付方式
.payment-methods {
  margin-bottom: 24px;

  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px 0;
    color: #1f2937;
    font-size: 16px;
  }

  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .payment-radio {
      :deep(.el-radio__input.is-checked .el-radio__inner) {
        background-color: #409eff;
        border-color: #409eff;
      }

      :deep(.el-radio__inner) {
        width: 18px;
        height: 18px;
      }
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background-color: #f8fafc;
      border-radius: 8px;
      width: 100%;
      max-width: 300px;
      font-size: 15px;
      color: #1e293b;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f0f9ff;
      }
    }
  }
}

// 服务协议
.service-agreement {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  text-align: left;

  :deep(.el-checkbox) {
    font-size: 14px;
    color: #475569;
  }

  :deep(.el-link) {
    color: #409eff;

    &:hover {
      color: #2563eb;
    }
  }
}

// 支付成功页
.success-page {
  .success-content {
    text-align: center;
    padding: 40px 20px;

    .success-icon {
      font-size: 64px;
      color: #67c23a;
      margin-bottom: 20px;
    }

    h2 {
      color: #1f2937;
      margin: 0 0 12px 0;
      font-size: 24px;
    }

    p {
      color: #475569;
      font-size: 16px;
      margin: 0 0 24px 0;
    }

    .order-info {
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 32px;

      p {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        margin: 0;

        span {
          font-weight: 600;
          color: #409eff;
        }
      }
    }
  }
}

// 步骤按钮
.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 20px;

  .prev-btn {
    padding: 10px 24px;
    border-radius: 8px;
    background-color: #fff;
    color: #409eff;
    border-color: #409eff;

    &:hover {
      background-color: #f0f9ff;
      border-color: #2563eb;
      color: #2563eb;
    }
  }

  .next-btn,
  .pay-btn {
    padding: 10px 32px;
    border-radius: 8px;
    font-weight: 500;

    &:hover {
      opacity: 0.9;
    }
  }

  .next-btn {
    background-color: #409eff;
    border-color: #409eff;
  }

  .pay-btn {
    background-color: #67c23a;
    border-color: #67c23a;
    padding: 10px 40px;
  }
}

// 协议弹窗
.agreement-content {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;

  .agreement-section {
    margin-bottom: 20px;

    h4 {
      color: #1f2937;
      margin: 0 0 12px 0;
      font-size: 15px;
    }

    p {
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 8px 0;
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .booking-process {
    padding: 20px 16px;
  }

  .preview-grid {
    grid-template-columns: repeat(7, 1fr) !important;
  }

  .step-actions {
    flex-direction: column;

    .prev-btn,
    .next-btn,
    .pay-btn {
      width: 100%;
    }
  }
}
</style>
