<template>
  <div class="shop-management">
    <!-- 简洁的店铺管理头部 -->
    <div class="dashboard-header">
      <div class="header-left">

        <h2 class="page-title">
          <span
            class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl mr-3 shadow-md">
            <el-icon class="text-white text-xl cursor-pointer" @click="goBack">
              <ArrowLeft />
            </el-icon>
          </span>店铺管理中心
        </h2>
        <p class="page-subtitle">管理您的宠物寄养服务与经营数据</p>
      </div>

    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧功能区 -->
      <div class="left-panel">
        <!-- 经营概览卡片 -->
        <el-card class="overview-card" shadow="never">
          <template #header>
            <div class="card-header">
              <i class="header-icon el-icon-data-line"></i>
              <span>经营概览</span>
              <span class="time-range">本月数据</span>
            </div>
          </template>

          <div class="overview-content">
            <!-- 主要指标 -->
            <div class="main-metrics">
              <div class="metric-item">
                <div class="metric-label">总收入</div>
                <div class="metric-value">¥{{ formatNumber(totalIncome) }}</div>

              </div>
              <div class="metric-item">
                <div class="metric-label">总订单</div>
                <div class="metric-value">{{ totalOrders }}</div>

              </div>
              <div class="metric-item">
                <div class="metric-label">完成率</div>
                <div class="metric-value">{{ completionRate }}</div>

              </div>
            </div>

            <!-- 图表区域 -->
            <div class="chart-area">
              <div class="chart-header">
                <span>近7天收入趋势</span>
              </div>
              <div class="chart-container">
                <!-- 这里可以放置图表组件，暂时用模拟数据展示 -->
                <div v-if="incomeData.length === 0" class="empty-chart">
                  <i class="fas fa-chart-line text-4xl text-gray-300 mb-3"></i>
                  <p class="text-gray-500 text-sm">暂无收入数据</p>
                  <p class="text-gray-400 text-xs mt-1">开始接单后即可查看收入趋势</p>
                </div>
                <div v-else class="simple-chart">
                  <div class="chart-bars">
                    <div v-for="(item, index) in incomeData" :key="index" class="chart-bar">
                      <div class="bar-value">{{ item.value }}</div>
                      <div class="bar" :style="{ height: item.height + '%' }" :class="{ 'active-bar': item.active }">
                      </div>
                      <div class="bar-label">{{ item.label }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>


        <!-- 最近活动 -->
        <el-card class="recent-activity" shadow="never">
          <template #header>
            <div class="card-header">
              <!-- <i class="header-icon el-icon-alarm-clock"></i> -->
              <span>最近订单</span>
            </div>
          </template>
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <el-tag size="small" :type="activity.tagType">{{ activity.tag }}</el-tag>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧套餐管理 -->
      <div class="right-panel">
        <!-- 套餐管理卡片 -->
        <el-card class="packages-card" shadow="never">
          <template #header>
            <div class="card-header-with-actions">
              <div class="header-left">
                <i class="header-icon el-icon-s-goods"></i>
                <span>服务套餐管理</span>
                <el-tag size="small" class="count-tag">{{ packages.length }}个套餐</el-tag>
              </div>
              <div class="header-right">
                <el-button type="primary" size=“default” color="#F0EBFF" text-color="#ffffff"
                  @click="showAddPackageDialog">
                  <i class="el-icon-circle-plus"></i>新增套餐
                </el-button>
              </div>
            </div>
          </template>

          <!-- 套餐列表 -->
          <div v-if="packages.length === 0" class="flex flex-col items-center justify-center py-16">
            <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg">暂无服务套餐</p>
            <p class="text-gray-400 text-sm mt-2">您还没有创建任何服务套餐</p>
            <el-button type="primary" class="mt-4" @click="showAddPackageDialog">
              <i class="el-icon-circle-plus"></i>立即创建
            </el-button>
          </div>
          <div v-else class="packages-grid">
            <el-card v-for="pkg in packages" :key="pkg.id" class="package-card" shadow="hover">
              <!-- 套餐状态标签 -->
              <!-- <div class="package-status">
                
                <div class="package-actions">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <el-icon>
                        <MoreFilled />
                      </el-icon>
                    </span>

                  </el-dropdown>
                </div>
              </div> -->

              <div class="package-header">
                <div class="package-title-section">
                  <h3 class="package-title">{{ pkg.title }}</h3>

                </div>
              </div>
              <p class="package-desc">{{ pkg.description }}</p>

              <!-- 宠物类型标签 -->
              <div class="package-tags">
                <el-tag v-for="pet in pkg.petTypes" :key="pet" size="small" class="pet-tag">
                  {{ pet }}
                </el-tag>
              </div>

              <!-- 套餐特色 -->
              <div class="package-features">
                <div class="features-title">附加服务：</div>
                <ul class="features-list">
                  <li v-for="(feature, index) in pkg.features" :key="index" class="feature-item-with-price">
                    <el-icon>
                      <Check />
                    </el-icon>
                    <span class="feature-name">{{ feature.title }}</span>
                    <span v-if="typeof feature !== 'string' && feature.price > 0" class="feature-price">+¥{{
                      feature.price
                      }}</span>
                  </li>
                </ul>
              </div>

              <!-- 套餐信息 -->
              <div class="package-info">

                <div class="info-item">
                  <i class="el-icon-sold-out"></i>
                  <span>已售{{ pkg.soldCount }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-user"></i>
                  <span>剩余{{ pkg.quota }}名额</span>
                </div>
              </div>

              <!-- 价格和操作 -->
              <div class="package-footer">
                <div class="price-section">
                  <div class="price-main">¥{{ pkg.basePrice }}/天</div>

                </div>
                <div class="action-buttons">
                  <!-- <el-button size="small" @click="viewPackageDetails(pkg)" class="detail-btn">
                    查看详情
                  </el-button> -->
                  <el-button type="primary" size="small" @click="editPackage(pkg)" class="edit-btn">
                    <el-icon>
                      <Edit />
                    </el-icon>编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deletePackage(pkg.id)" class="delete-btn">
                    <el-icon>
                      <Delete />
                    </el-icon>删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 添加/编辑套餐对话框 -->
    <el-dialog :title="dialogTitle" v-model="packageDialogVisible" width="600px" class="package-dialog">
      <el-form :model="packageForm" :rules="packageRules" ref="packageFormRef" label-width="100px">
        <el-tabs v-model="activeTab">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-form-item label="套餐名称" prop="title">
              <el-input v-model="packageForm.title" placeholder="请输入套餐名称，如：基础营养套餐" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="套餐描述" prop="description">
              <el-input v-model="packageForm.description" type="textarea" :rows="2" placeholder="简要描述套餐特点"
                maxlength="100" show-word-limit />
            </el-form-item>

            <el-form-item label="宠物类型" prop="petTypes">
              <el-select v-model="packageForm.petTypes" multiple placeholder="请选择适合的宠物类型" style="width: 100%">
                <el-option v-for="item in petTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="基础价格" prop="basePrice">
              <el-input v-model="packageForm.basePrice" type="number" placeholder="请输入基础价格：元/天" maxlength="10"
                show-word-limit @input="handleBasePriceInput" />
            </el-form-item>

            <el-form-item label="宠物数量" prop="maxPets">
              <el-input-number v-model="packageForm.maxPets" :min="1" :max="100" placeholder="最大宠物数量" />
            </el-form-item>

            <el-form-item label="最大体重" prop="maxWeight">
              <el-input-number v-model="packageForm.maxWeight" :min="1" :max="200" placeholder="最大体重（斤）" />
            </el-form-item>
          </el-tab-pane>
          <!-- 附加服务 -->
          <el-tab-pane label="附加服务" name="features">
            <el-form-item label="附加服务" prop="features">
              <div class="features-editor">
                <div v-if="isEditing" style="color: #909399; padding: 10px; margin-bottom: 10px;">
                  <i class="el-icon-info" style="margin-right: 5px;"></i>附加服务不可编辑，仅可查看
                </div>
                <div class="features-list">
                  <div v-for="(feature, index) in packageForm.features" :key="index" class="feature-item">
                    <div class="feature-content">
                      <el-input v-model="feature.title" placeholder="请输入服务名称" style="width: 60%; margin-right: 10px"
                        :disabled="isEditing" />
                      <el-input-number v-model="feature.price" :min="0" :precision="0" :step="5" placeholder="价格"
                        style="width: 120px; margin-right: 10px" :disabled="isEditing" />
                      <el-button type="danger" size="small" circle @click="removeFeature(index)" :disabled="true"
                        class="delete-btn">
                        <el-icon>
                          <Delete />
                        </el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
                <el-button v-if="!isEditing" type="primary" plain @click="addFeature" class="add-feature-btn">
                  <i class="el-icon-plus"></i>添加服务项
                </el-button>
              </div>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="packageDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePackage" class="save-btn" :loading="saving">
            {{ isEditing ? '保存修改' : '创建套餐' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑店铺信息对话框 -->
    <el-dialog title="店铺信息设置" v-model="shopDialogVisible" width="500px" class="shop-dialog">
      <el-form :model="shopForm" :rules="shopRules" ref="shopFormRef" label-width="100px">
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="shopForm.name" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="店铺描述" prop="description">
          <el-input v-model="shopForm.description" type="textarea" :rows="3" placeholder="简要描述您的店铺特色" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="shopForm.contact" placeholder="请输入联系电话或微信" />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-time-picker v-model="shopForm.businessHours" is-range range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" placeholder="选择营业时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="服务地址" prop="address">
          <el-input v-model="shopForm.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="店铺封面">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :on-change="handleAvatarChange"
            :auto-upload="false">
            <img v-if="shopForm.coverImage" :src="shopForm.coverImage" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shopDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveShopInfo" :loading="savingShop">保存设置</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { getFosterService, getAddService, addFosterService, addAdditionalService, updateFosterService, deleteFosterService, getFosterOrderData } from '@/api/foster-care/manage'


// 经营数据
const totalIncome = ref(0)
const totalOrders = ref(0)
const completionRate = ref('0%')
const incomeData = ref<any[]>([])

// 套餐相关
const hasPackages = ref(false)
const provider = localStorage.getItem('fosterProviderIds')
console.log('provider:', provider)
// 获取订单数据
const fetchOrderData = async () => {

  try {
    const res = await getFosterOrderData({ providerId: Number(provider) })
    if (res.code === 0 && res.data) {
      const data = res.data
      totalIncome.value = data.totalAmount
      totalOrders.value = data.totalOrders
      completionRate.value = data.finished

      // 处理收入数据
      const incomeList = data.incomeList || []
      const dateList = data.dateList || []
      const maxIncome = Math.max(...incomeList, 1)

      incomeData.value = incomeList.map((value: number, index: number) => {
        const date = dateList[index] || ''
        const height = (value / maxIncome) * 100
        return {
          label: date.substring(5), // 只显示月-日
          value: `¥${value}`,
          height: height,
          active: false
        }
      })
    } else {
      ElMessage.error(res.msg || '获取订单数据失败')
    }
  } catch (error) {
    console.error('获取订单数据失败:', error)
    ElMessage.error('网络错误，请稍后重试')
  }
}

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'order',
    icon: 'el-icon-s-order',
    text: '新订单：张小姐预订了基础营养套餐',
    time: '10分钟前',
    tag: '待确认',
    tagType: 'warning',
  },
  {
    id: 2,
    type: 'review',
    icon: 'el-icon-chat-line-round',
    text: '收到新评价：★★★★★',
    time: '30分钟前',
    tag: '已回复',
    tagType: 'success',
  },
  {
    id: 3,
    type: 'package',
    icon: 'el-icon-s-goods',
    text: '豪华呵护套餐售出1单',
    time: '1小时前',
    tag: '已完成',
    tagType: 'success',
  },
  {
    id: 4,
    type: 'message',
    icon: 'el-icon-message',
    text: '新咨询：关于宠物特殊饮食需求',
    time: '2小时前',
    tag: '待回复',
    tagType: 'warning',
  },
])

// 宠物类型选项
const petTypeOptions = [
  { value: '猫', label: '猫' },
  { value: '狗', label: '狗' },
  { value: '鱼', label: '鱼' },
  { value: '鸟', label: '鸟' },
  { value: '兔', label: '兔' },
  { value: '蛇', label: '蛇' },
  { value: '其他', label: '其他' },
]

// 套餐类型定义
interface PackageItem {
  id: number
  title: string
  description: string
  features: Array<{ id: number; serviceId: number; title: string; price: number }>
  petTypes: string[]
  basePrice: number
  quota: number
  soldCount: number

}

const packages = ref<PackageItem[]>([])


// 获取套餐数据
const fetchFosterService = async (showLoading: boolean = true) => {


  let loading: any = null
  if (showLoading) {
    loading = ElLoading.service({ text: '加载套餐中...' })
  }

  try {
    const res = await getFosterService({ providerId: Number(provider) })
    if (res.code === 0 && res.data) {
      // 转换数据格式
      const packageList = res.data.list || []
      packages.value = packageList.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        features: [], // 暂时为空，后续通过fetchAddService获取
        petTypes: item.petTypes?.split(',') || [],
        basePrice: item.basePrice,
        quota: item.quota || 5,
        soldCount: item.soldCount || 0,

      }))

      // 为每个套餐获取附加服务
      for (const pkg of packages.value) {
        await fetchAddService(pkg.id, pkg)
      }

      hasPackages.value = packages.value.length > 0
    } else {
      ElMessage.error(res.msg || '获取套餐失败')
      hasPackages.value = false
    }
  } catch (error) {
    console.error('获取套餐失败:', error)
    ElMessage.error('网络错误，请稍后重试')
    hasPackages.value = false
  } finally {
    if (loading) {
      loading.close()
    }
  }
}

// 获取附加服务
const fetchAddService = async (serviceId: number, packageItem: PackageItem) => {
  try {
    const res = await getAddService(serviceId)
    if (res.code === 0 && res.data) {
      // 转换附加服务格式
      const additionalServices = res.data.list || []
      packageItem.features = additionalServices.map((service: any) => ({
        id: service.id,
        serviceId: service.serviceId,
        title: service.title,
        price: service.price,
      }))
    }
  } catch (error) {
    console.error('获取附加服务失败:', error)
  }
}

// 套餐对话框
const packageDialogVisible = ref(false)
const isEditing = ref(false)
const editingPackageId = ref<number | null>(null)
const activeTab = ref('basic')
const saving = ref(false)
const packageFormRef = ref()

const dialogTitle = computed(() => (isEditing.value ? '编辑套餐' : '添加新套餐'))

const packageForm = reactive({
  title: '',
  description: '',
  basePrice: 0, // 基础价格
  petTypes: [] as string[],
  maxPets: 5, // 最大宠物数量
  maxWeight: 60, // 最大体重
  features: [],
  status: 'active',
  quota: 5,
})

const packageRules = {
  title: [
    { required: true, message: '请输入套餐名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入套餐描述', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' },
  ],

  petTypes: [{ required: true, message: '请至少选择一种宠物类型', trigger: 'change' }],
  basePrice: [
    { required: true, message: '请设置价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' },
  ],
  maxPets: [
    { required: true, message: '请设置最大宠物数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '最大宠物数量在1-100之间', trigger: 'blur' },
  ],
  maxWeight: [
    { required: true, message: '请设置最大体重', trigger: 'blur' },
    { type: 'number', min: 1, max: 200, message: '最大体重在1-200之间', trigger: 'blur' },
  ],
}

// 店铺对话框
const shopDialogVisible = ref(false)
const savingShop = ref(false)
const shopFormRef = ref()

const shopForm = reactive({
  name: '温馨宠物寄养',
  description: '提供专业、贴心的宠物寄养服务，让您的爱宠享受家的温暖',
  contact: '13800138000',
  businessHours: [new Date(2024, 0, 1, 8, 0, 0), new Date(2024, 0, 1, 22, 0, 0)],
  address: 'XX市XX区XX街道XX号',
  coverImage: '',
  tags: ['24小时照顾', '环境优美', '经验丰富'],
})

const shopRules = {
  name: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  description: [{ required: true, message: '请输入店铺描述', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  businessHours: [{ required: true, message: '请选择营业时间', trigger: 'change' }],
  address: [{ required: true, message: '请输入服务地址', trigger: 'blur' }],
}

// 显示添加套餐对话框
const showAddPackageDialog = () => {
  isEditing.value = false
  editingPackageId.value = null
  activeTab.value = 'basic'
  resetPackageForm()
  //清除表单验证状态
  if (packageFormRef.value) {
    packageFormRef.value.clearValidate()
  }

  packageDialogVisible.value = true
}

// 编辑套餐
const editPackage = (pkg: PackageItem) => {
  isEditing.value = true
  editingPackageId.value = pkg.id
  activeTab.value = 'basic'

  // 使用正确的字段名称回显数据
  packageForm.title = pkg.title
  packageForm.description = pkg.description
  packageForm.basePrice = pkg.basePrice
  packageForm.maxPets = pkg.quota  // 使用quota作为maxPets
  packageForm.maxWeight = 60  // 默认值，因为接口返回的数据中没有这个字段
  packageForm.petTypes = [...pkg.petTypes]
  // 回显附加服务（只读）
  packageForm.features = pkg.features.map(f => ({
    title: f.title,
    price: f.price
  }))

  if (packageFormRef.value) {
    packageFormRef.value.clearValidate()
  }

  packageDialogVisible.value = true
}

// 删除套餐
const deletePackage = (id: number) => {
  ElMessageBox.confirm('确定要删除这个套餐吗？删除后不可恢复。', '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
    .then(() => {
      // 调用删除接口
      deleteFosterService({ id }).then(res => {
        if (res.code === 0) {
          packages.value = packages.value.filter((pkg) => pkg.id !== id)
          ElMessage.success('套餐删除成功')
        } else {
          ElMessage.error(res.msg || '删除失败')
        }
      })
    })
    .catch(() => {
      // 用户取消删除
    })
}



// 重置套餐表单
const resetPackageForm = () => {
  packageForm.title = ''
  packageForm.description = ''
  packageForm.basePrice = 0
  packageForm.quota = 0
  packageForm.petTypes = []
  packageForm.features = [
    { title: '', price: 0 }
  ]
  packageForm.status = 'active'
}

// 添加服务项
const addFeature = () => {
  packageForm.features.push({ title: '', price: 0 })
}

// 删除服务项
const removeFeature = (index: number) => {
  if (packageForm.features.length > 1) {
    packageForm.features.splice(index, 1)
  }
}

// 保存套餐
const savePackage = async () => {
  console.log("点击添加套餐")
  if (!packageFormRef.value) return
  const features = packageForm.features.filter((f) => f.title.trim())
  console.log(features)
  if (features.length == 0) {
    ElMessage.error('请添加附加服务')
    return;
  }
  try {
    await packageFormRef.value.validate()
    saving.value = true

    // 将basePrice转换为数字类型
    const basePriceNum = Number(packageForm.basePrice)

    if (isEditing.value) {
      // 编辑操作：调用更新接口
      const updateData = {
        title: packageForm.title,
        description: packageForm.description,
        serviceType: 1,
        basePrice: basePriceNum,
        petTypes: packageForm.petTypes.join(','),
        maxPets: packageForm.maxPets,
        maxWeight: packageForm.maxWeight
      }

      const updateRes = await updateFosterService(editingPackageId.value, updateData)
      console.log("更新套餐数据：", updateRes)
      if (updateRes.code === 0) {
        // 更新本地数据
        const index = packages.value.findIndex(pkg => pkg.id === editingPackageId.value)
        if (index !== -1) {
          packages.value[index] = {
            ...packages.value[index],
            title: packageForm.title,
            description: packageForm.description,
            basePrice: basePriceNum,
            petTypes: packageForm.petTypes,
            quota: packageForm.maxPets,
          }
        }

        packageDialogVisible.value = false
        ElMessage.success('套餐修改成功')
        saving.value = false
      } else {
        ElMessage.error(updateRes.msg || '修改套餐失败')
        saving.value = false
      }
    } else {
      // 创建操作：调用添加接口
      const serviceData = {
        title: packageForm.title,
        description: packageForm.description,
        basePrice: basePriceNum,
        petTypes: packageForm.petTypes.join(','),
        maxPets: packageForm.maxPets,
        maxWeight: packageForm.maxWeight,
        serviceType: 1
      }

      const serviceRes = await addFosterService(serviceData)
      if (serviceRes.code === 0) {
        const serviceId = serviceRes.data.serviceId

        // 处理附加服务

        // 为每个附加服务调用接口
        for (const feature of features) {
          const additionalServiceData = {
            serviceId: serviceId,
            title: feature.title,
            price: feature.price
          }
          await addAdditionalService(additionalServiceData)
        }


        // 添加到本地数据
        const newPackage: PackageItem = {
          id: serviceId,
          title: packageForm.title,
          description: packageForm.description,
          features: packageForm.features.filter((f) => f.title.trim()),
          petTypes: packageForm.petTypes,
          basePrice: packageForm.basePrice,
          quota: packageForm.maxPets,
          soldCount: 0,


        }
        packages.value.push(newPackage)
        hasPackages.value = true

        packageDialogVisible.value = false
        ElMessage.success('套餐创建成功')
        saving.value = false
      } else {
        ElMessage.error(serviceRes.msg || '创建套餐失败')
        saving.value = false
      }
    }
  } catch (error) {
    console.error(error)
    saving.value = false
  }
}

// 显示编辑店铺对话框
// const showEditShopDialog = () => {
//   shopDialogVisible.value = true
// }

// 处理封面图片上传
const handleAvatarChange = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    shopForm.coverImage = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

// 保存店铺信息
const saveShopInfo = async () => {
  if (!shopFormRef.value) return

  try {
    await shopFormRef.value.validate()
    savingShop.value = true

    // 模拟保存操作
    setTimeout(() => {
      ElMessage.success('店铺信息保存成功')
      shopDialogVisible.value = false
      savingShop.value = false
    }, 500)
  } catch (error) {
    console.error(error)
    savingShop.value = false
  }
}



// 处理基础价格输入，确保转换为数字类型
const handleBasePriceInput = () => {
  // 确保basePrice是数字类型
  packageForm.basePrice = Number(packageForm.basePrice) || 0
}

// 工具函数
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 返回上一页
const goBack = () => {
  window.history.back()
}

onMounted(() => {
  // 初始化数据
  console.log('店铺管理页面加载完成')
  // 获取套餐数据
  fetchFosterService()
  // 获取订单数据
  fetchOrderData()
})
</script>

<style lang="scss" scoped>
.shop-management {
  padding: 20px;
  background: linear-gradient(135deg, #f9f7ff 0%, #f0ebff 100%);
  min-height: 100vh;
}

// 简洁头部样式
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 0 8px;

  .header-left {
    .page-title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: #5a4fcf;
    }

    .page-subtitle {
      margin: 0;
      font-size: 14px;
      color: #8a7fd9;
    }
  }

  .header-right {
    .quick-stats {
      display: flex;
      gap: 16px;

      .stat-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e8e4ff;
        box-shadow: 0 2px 8px rgba(123, 95, 255, 0.1);

        i {
          color: #7b5fff;
          font-size: 16px;
        }

        .stat-text {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }
      }
    }
  }
}

// 主要内容区域
.main-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

// 卡片通用样式
.el-card {
  border: none;
  border-radius: 12px;
  margin-bottom: 20px;
  background: white;

  :deep(.el-card__header) {
    border-bottom: 1px solid #f0f0ff;
    padding: 16px 20px;
    background: transparent;
  }

  .card-header {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #5a4fcf;

    .header-icon {
      margin-right: 10px;
      font-size: 18px;
      color: #7b5fff;
    }

    .time-range {
      margin-left: auto;
      font-size: 12px;
      color: #a99eff;
      font-weight: normal;
    }
  }

  .card-header-with-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;

      .count-tag {
        background: #f0ebff;
        border-color: #d9d1ff;
        color: #7b5fff;
      }
    }
  }
}

// 经营概览卡片
.overview-card {
  .overview-content {
    .main-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;

      .metric-item {
        padding: 20px;
        background: linear-gradient(135deg, #f5f3ff 0%, #e8e4ff 100%);
        border-radius: 10px;
        text-align: center;

        .metric-label {
          font-size: 14px;
          color: #8a7fd9;
          margin-bottom: 8px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          color: #5a4fcf;
          margin-bottom: 8px;
        }

        .metric-change {
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;

          &.positive {
            color: #52c41a;
          }

          i {
            font-size: 10px;
          }
        }
      }
    }

    .chart-area {
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f0ff;

        span {
          font-weight: 600;
          color: #5a4fcf;
        }
      }

      .chart-container {
        height: 200px;

        .empty-chart {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #a99eff;
        }

        .simple-chart {
          height: 100%;
          padding: 20px 0;

          .chart-bars {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 100%;

            .chart-bar {
              text-align: center;
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-end;
              height: 100%;

              .bar-value {
                font-size: 12px;
                color: #8a7fd9;
                margin-bottom: 8px;
              }

              .bar {
                width: 30px;
                background: linear-gradient(to top, #9b7bff 0%, #c9bfff 100%);
                border-radius: 4px 4px 0 0;
                transition: height 0.3s ease;

                &.active-bar {
                  background: linear-gradient(to top, #7b5fff 0%, #a99eff 100%);
                }
              }

              .bar-label {
                margin-top: 8px;
                font-size: 12px;
                color: #a99eff;
              }
            }
          }
        }
      }
    }
  }
}

// 快捷操作卡片
.quick-actions-card {
  .action-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background: #f9f7ff;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, #9b7bff 0%, #7b5fff 100%);
        box-shadow: 0 4px 12px rgba(123, 95, 255, 0.2);

        .action-icon {
          background: white;

          i {
            color: #7b5fff;
          }
        }

        .action-text {
          color: white;
        }
      }

      .action-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        font-size: 24px;

        &.add {
          background: #e6f7ff;

          i {
            color: #1890ff;
          }
        }

        &.edit {
          background: #f6ffed;

          i {
            color: #52c41a;
          }
        }

        &.calendar {
          background: #fff7e6;

          i {
            color: #fa8c16;
          }
        }

        &.message {
          background: #f9f0ff;

          i {
            color: #722ed1;
          }
        }

        &.export {
          background: #e6fffb;

          i {
            color: #13c2c2;
          }
        }

        &.analytics {
          background: #fff0f6;

          i {
            color: #eb2f96;
          }
        }
      }

      .action-text {
        font-size: 14px;
        font-weight: 500;
        color: #5a4fcf;
      }
    }
  }
}

// 最近活动
.recent-activity {
  .activity-list {
    .activity-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0ff;

      &:last-child {
        border-bottom: none;
      }

      .activity-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 16px;

        &.order {
          background: #e6f7ff;
          color: #1890ff;
        }

        &.review {
          background: #f6ffed;
          color: #52c41a;
        }

        &.package {
          background: #fff7e6;
          color: #fa8c16;
        }

        &.message {
          background: #f9f0ff;
          color: #722ed1;
        }
      }

      .activity-content {
        flex: 1;

        .activity-text {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: #a99eff;
        }
      }
    }
  }
}

// 套餐卡片
.packages-card {
  .packages-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .package-card {
    position: relative;
    border: 1px solid #e8e4ff;
    transition: all 0.3s ease;
    background: white;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(123, 95, 255, 0.15);
      border-color: #c9bfff;
    }

    :deep(.el-card__body) {
      padding: 20px;
    }

    .package-status {
      position: absolute;
      top: 14px;
      right: 12px;
      display: flex;
      gap: 5px;
      justify-content: center;
      align-items: center;
      color: #8a7fd9;
      font-size: 12px;

      &.status-active {
        background: #f6ffed;
        color: #52c41a;
        padding: 2px 8px;
        border-radius: 4px;

      }
    }

    .package-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;

      .package-title-section {
        flex: 1;

        .package-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #5a4fcf;
        }
      }

      .package-actions {
        .el-dropdown-link {
          cursor: pointer;
          color: #a99eff;
          font-size: 18px;

          &:hover {
            color: #7b5fff;
          }
        }
      }
    }

    .package-desc {
      margin: 0 0 16px 0;
      color: #8a7fd9;
      font-size: 14px;
      line-height: 1.5;
    }

    .package-tags {
      margin-bottom: 16px;

      .pet-tag {
        margin-right: 8px;
        margin-bottom: 8px;
        background: #f0ebff;
        border-color: #d9d1ff;
        color: #7b5fff;

        i {
          margin-right: 4px;
          font-size: 12px;
        }
      }
    }

    .package-features {
      margin-bottom: 20px;

      .features-title {
        font-size: 14px;
        color: #5a4fcf;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .features-list {
        margin: 0;
        padding-left: 20px;

        li {
          font-size: 13px;
          color: #666;
          margin-bottom: 6px;
          line-height: 1.5;
          display: flex;
          align-items: center;
          justify-content: space-between;

          i {
            color: #7b5fff;
            margin-right: 6px;
            font-size: 12px;
          }

          &.feature-item-with-price {
            .feature-name {
              flex: 1;
            }

            .feature-price {
              font-size: 12px;
              color: #ff6b9d;
              font-weight: 500;
              margin-left: 10px;
              padding: 2px 6px;
              background: #fff0f6;
              border-radius: 4px;
            }
          }
        }
      }
    }

    .package-info {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-top: 1px solid #f0f0ff;
      border-bottom: 1px solid #f0f0ff;
      margin-bottom: 16px;

      .info-item {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #a99eff;

        i {
          margin-right: 4px;
          font-size: 12px;
        }
      }
    }

    .package-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price-section {
        .price-main {
          font-size: 24px;
          font-weight: 700;
          color: #ff6b9d;
        }

        // .price-original {
        //   font-size: 14px;
        //   color: #a99eff;
        //   text-decoration: line-through;
        // }
      }

      .action-buttons {
        display: flex;
        gap: 8px;

        .detail-btn {
          border-color: #e8e4ff;
          color: #5a4fcf;
        }

        .edit-btn {
          background: linear-gradient(135deg, #9b7bff 0%, #7b5fff 100%);
          border: none;
          color: white;


        }

        i {
          margin-right: 5px;
        }
      }
    }
  }
}

// 对话框样式
.package-dialog,
.shop-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #f9f7ff 0%, #e8e4ff 100%);
    border-radius: 12px 12px 0 0;
    padding: 20px;

    .el-dialog__title {
      color: #5a4fcf;
      font-weight: 600;
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }

  :deep(.el-tabs__item) {
    color: #8a7fd9;

    &.is-active {
      color: #7b5fff;
    }
  }

  :deep(.el-tabs__active-bar) {
    background-color: #7b5fff;
  }

  :deep(.el-form-item__label) {
    color: #5a4fcf;
    font-weight: 500;
  }

  .form-tip {
    margin-left: 12px;
    font-size: 12px;
    color: #a99eff;
  }

  .features-editor {
    .features-list {
      margin-bottom: 16px;

      .feature-item {
        margin-bottom: 12px;
        border: 1px solid #f0f0ff;
        border-radius: 8px;
        padding: 12px;
        background: #f9f7ff;
        transition: all 0.3s ease;

        &:hover {
          border-color: #d9d1ff;
          background: #f0ebff;
        }

        .feature-content {
          display: flex;
          align-items: center;
          gap: 12px;

          .el-input {
            flex: 1;
          }

          .el-input-number {
            width: 120px;
          }

          .delete-btn {
            transition: all 0.3s ease;

            &:hover {
              transform: scale(1.1);
              box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
            }
          }
        }
      }
    }

    .add-feature-btn {
      width: 100%;
      border: 1px dashed #d9d1ff;
      color: #7b5fff;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        border-color: #7b5fff;
        background: #f9f7ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(123, 95, 255, 0.15);
      }
    }
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d1ff;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s ease;

      &:hover {
        border-color: #7b5fff;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c8c8c;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
  }

  .save-btn {
    background: linear-gradient(135deg, #9b7bff 0%, #7b5fff 100%);
    border: none;

    &:hover {
      opacity: 0.9;
    }
  }
}

// 下拉菜单样式
:deep(.el-dropdown-menu) {
  border: 1px solid #e8e4ff;
  box-shadow: 0 4px 12px rgba(123, 95, 255, 0.15);

  .el-dropdown-menu__item {
    color: #5a4fcf;

    &:hover {
      background-color: #f9f7ff;
    }

    &.warning-text {
      color: #fa8c16;
    }

    &.danger-text {
      color: #ff4d4f;
    }

    i {
      margin-right: 8px;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .packages-card .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;

    .quick-stats {
      width: 100%;
      flex-wrap: wrap;
    }
  }

  .overview-card .overview-content .main-metrics {
    grid-template-columns: 1fr;
  }

  .quick-actions-card .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .packages-card .packages-grid {
    grid-template-columns: 1fr;
  }

  .package-card .package-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}
</style>
