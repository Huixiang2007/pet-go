<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-8 relative overflow-hidden">
    <!-- 装饰元素 -->
    <div
      class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full filter blur-3xl opacity-40 -translate-x-32 -translate-y-32">
    </div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full filter blur-3xl opacity-40 translate-x-32 translate-y-32">
    </div>
    <div
      class="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full filter blur-2xl opacity-20 animate-pulse">
    </div>

    <div class="container mx-auto px-4 max-w-4xl relative z-10">
      <!-- 顶部导航 -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div class="flex items-center space-x-4">
          <div>
            <h1 class="text-3xl font-bold text-rose-800 flex items-center">
              <span
                class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl mr-3 shadow-md">
                <el-icon class="text-white text-xl cursor-pointer" @click="goBack">
                  <ArrowLeft />
                </el-icon>
              </span>
              {{ isEdit ? '编辑宠物信息' : '添加新宠物' }}
            </h1>
          </div>
        </div>
      </div>

      <!-- 表单区域 -->
      <el-card
        class="shadow-xl rounded-3xl border-none bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-2xl border border-rose-50">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300"></div>

        <el-form :model="petFormData" :rules="formRules" ref="formRef" label-width="140px" label-position="left"
          class="p-8" @submit.prevent="submitForm">
          <!-- 头像上传子组件 -->
          <PetAvatarUpload :avatar="petFormData.avatar" @upload-success="handleAvatarSuccess"
            @upload-fail="handleAvatarFail" />

          <!-- 基本信息子组件 -->
          <PetBasicInfo :basicInfo="petFormData" :animal-options="animalOptions" @update-basicInfo="updateBasicInfo" />

          <!-- 健康信息子组件 -->
          <PetHealthInfo :healthInfo="petFormData" :health-status-options="healthStatusOptions"
            @update-healthInfo="updateHealthInfo" />

          <!-- 性格标签子组件 -->
          <PetCharacterTags :characterTags="petFormData.characterTags" @update-tags="handleTagsUpdate"
            :default-tags="defaultTags" />

          <!-- 操作按钮 -->
          <div
            class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-rose-100">
            <el-button @click="resetForm" size="large"
              class="action-btn px-8 py-3 rounded-xl font-medium transition-all duration-300 border-2 reset-btn border-rose-200 text-rose-600 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700">
              <el-icon class="mr-2">
                <Refresh />
              </el-icon>
              重置表单
            </el-button>
            <el-button @click="goBack" size="large"
              class="action-btn px-8 py-3 rounded-xl font-medium transition-all duration-300 border-2 cancel-btn border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
              <el-icon class="mr-2">
                <Close />
              </el-icon>
              取消
            </el-button>
            <el-button type="primary" @click="submitForm" size="large"
              class="action-btn px-8 py-3 rounded-xl font-medium transition-all duration-300 border-2 submit-btn"
              :loading="loading" :disabled="loading">
              <template #loading>
                <el-icon class="is-loading animate-spin mr-2">
                  <Loading />
                </el-icon>
                {{ isEdit ? '编辑中' : '添加中' }}
              </template>
              <template v-if="!loading">
                <el-icon class="mr-2">
                  <Check />
                </el-icon>
                {{ isEdit ? '保存修改' : '添加宠物' }}
              </template>
            </el-button>
          </div>
        </el-form>
      </el-card>

      <!-- 进度提示 -->
      <transition name="slide-fade">
        <div v-if="showProgress"
          class="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-rose-200 shadow-lg">
          <div class="flex items-center mb-4">
            <div
              class="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <el-icon class="text-white">
                <Loading />
              </el-icon>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <span class="text-rose-800 font-medium">{{ isEdit ? '正在保存修改' : '正在添加宠物' }}</span>
                <span class="text-rose-600 font-bold">{{ progress }}%</span>
              </div>
              <el-progress :percentage="progress" :stroke-width="8" :show-text="false" class="custom-progress" />
              <div class="text-rose-500 text-xs mt-2">
                {{ progressMessages[Math.floor(progress / 25)] }}
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 成功弹窗 -->
    <transition name="modal-fade">
      <div v-if="showSuccess"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="success-modal bg-white rounded-3xl p-8 max-w-md w-full relative overflow-hidden animate-modal-in">
          <div
            class="w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <el-icon class="text-white text-5xl">
              <SuccessFilled />
            </el-icon>
          </div>
          <div class="success-content text-center">
            <h3 class="success-title text-3xl font-bold text-rose-800 mb-2">
              {{ isEdit ? '修改成功！' : '添加成功！' }}
            </h3>
            <p class="success-message text-rose-600 mb-8">
              {{ petFormData.name || '您的宠物' }} {{ isEdit ? '信息已更新' : '已加入家庭' }}
            </p>
            <div class="success-actions flex flex-col sm:flex-row gap-3 justify-center">
              <el-button @click="goToPetDetail"
                class="success-btn primary px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 sm:flex-none bg-gradient-to-r from-pink-400 to-rose-400 text-white border-none hover:shadow-lg">
                <el-icon class="mr-2">
                  <View />
                </el-icon>
                查看详情
              </el-button>
              <el-button @click="handleSuccessConfirm"
                class="success-btn secondary px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 sm:flex-none border-rose-200 text-rose-600 bg-white hover:bg-rose-50">
                <el-icon class="mr-2">
                  <Plus />
                </el-icon>
                {{ isEdit ? '返回列表' : '继续添加' }}
              </el-button>
            </div>
          </div>
          <div class="success-decoration absolute inset-0 pointer-events-none">
            <el-icon
              class="decoration-1 absolute text-rose-200 text-3xl top-4 left-4 animate-[float_3s_ease-in-out_infinite]">
              <Star />
            </el-icon>
            <el-icon
              class="decoration-2 absolute text-rose-200 text-2xl top-10 right-6 animate-[float_3s_ease-in-out_infinite_0.5s]">
              <Star />
            </el-icon>
            <el-icon
              class="decoration-3 absolute text-rose-200 text-xl bottom-8 left-10 animate-[float_3s_ease-in-out_infinite_1s]">
              <Star />
            </el-icon>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Refresh, Close, Loading, Check, SuccessFilled, View, Star } from '@element-plus/icons-vue'
import request from '@/utils/request'
// 导入子组件
import PetAvatarUpload from '@/views/myPets/components/pet-info/PetAvatarUpload.vue'
import PetBasicInfo from '@/views/myPets/components/pet-info/PetBasicInfo.vue'
import PetHealthInfo from '@/views/myPets/components/pet-info/PetHealthInfo.vue'
import PetCharacterTags from '@/views/myPets/components/pet-info/PetCharacterTags.vue'

// 类型定义
interface PetFormData {
  id?: number
  userId: number
  name: string
  type: string
  breed: string
  avatar: string
  gender: '公' | '母'
  birthday: string
  weight: number
  sterilization: '已绝育' | '未绝育'
  healthStatus: string
  characterTags: string[]
}

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const showSuccess = ref(false)
const showProgress = ref(false)
const progress = ref(0)
const isEdit = ref(false)


const animalOptions = [
  { value: 'cat', label: '猫' },
  { value: 'dog', label: '狗' },
  { value: 'fish', label: '鱼' },
  { value: 'bird', label: '鸟' },
  { value: 'rabbit', label: '兔' },
  { value: 'snake', label: '蛇' },
  { value: 'other', label: '其他' },
]
const progressMessages = ['正在准备数据...', '正在上传信息...', '正在保存记录...', '即将完成...']
const defaultTags = ['活泼', '温顺', '胆小', '粘人', '安静', '友好', '贪玩', '聪明', '忠诚', '好奇']
const healthStatusOptions = [
  { value: '健康', label: '健康', class: 'text-green-600', indicatorClass: 'bg-green-400' },
  { value: '良好', label: '良好', class: 'text-blue-600', indicatorClass: 'bg-blue-400' },
  { value: '注意', label: '注意', class: 'text-yellow-600', indicatorClass: 'bg-yellow-400' },
  { value: '生病', label: '生病', class: 'text-red-600', indicatorClass: 'bg-red-400' },
]


const userId = localStorage.getItem('userId')
const petFormData = reactive<PetFormData>({
  userId: Number(userId),

  name: '',
  breed: '',
  type: '',
  birthday: '',
  gender: '公',
  weight: 0,
  avatar: '',
  sterilization: '未绝育',
  healthStatus: '健康',
  characterTags: []
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入宠物昵称', trigger: 'blur' },
    { min: 1, max: 8, message: '昵称长度在 1 到 8 个字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择宠物类型', trigger: 'blur' }],
  breed: [{ required: true, message: '请输入宠物品种', trigger: 'blur' }],
  birthday: [{ required: true, message: '请选择宠物生日', trigger: 'change' }],
  weight: [
    { required: true, message: '请输入宠物体重', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 100, message: '体重应在 0.1-100kg 之间', trigger: 'blur' },
  ],

}

// 判断是否为编辑模式
onMounted(async () => {
  const petId = route.params.petId
  console.log(petId)
  petFormData.id = Number(petId)
  if (petId) {
    isEdit.value = true
    // 编辑模式：获取宠物详情并回显
    try {
      loading.value = true
      const res = await request(`/server/api/pet/getOne/${petId}`, 'GET')
      if (res.code === 0) {
        const petInfo = res.data
        console.log(petInfo)
        // 回显数据
        petFormData.name = petInfo.name
        petFormData.type = petInfo.type
        petFormData.breed = petInfo.breed
        petFormData.avatar = petInfo.avatar
        petFormData.gender = petInfo.gender
        petFormData.birthday = petInfo.birthday
        petFormData.weight = petInfo.weight
        petFormData.sterilization = petInfo.sterilization
        petFormData.healthStatus = petInfo.healthStatus
        petFormData.characterTags = petInfo.characterTags || []
        console.log(petFormData)
      } else {
        ElMessage.error('获取宠物信息失败')
        router.push('/my-pets')
      }
    } catch (err) {
      console.error('获取宠物详情失败:', err)
      ElMessage.error('服务器开小差儿了，待会再试吧~')
      router.push('/my-pets')
    } finally {
      loading.value = false
    }
  }
})

// 头像上传
const handleAvatarSuccess = (url: string) => {
  petFormData.avatar = url
  ElMessage.success('头像上传成功!')
}
const handleAvatarFail = () => {
  ElMessage.error('头像上传失败，请重试!')
}

// 模拟进度条
const simulateProgress = () => {
  showProgress.value = true
  progress.value = 0
  const interval = setInterval(() => {
    if (progress.value < 95) {
      progress.value += 5
    }
  }, 150)
  return interval
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const progressInterval = simulateProgress()
    let res
    if (isEdit.value) {
      // 编辑
      res = await request(`/server/api/pet/update`, 'PUT', petFormData)
      console.log(res)
      if (res.code === 0) {
        ElMessage.success('修改成功')
        // 显示成功弹窗
        setTimeout(() => {
          showSuccess.value = true
          showProgress.value = false
        }, 500)
      } else {
        ElMessage.error('修改失败')

      }
    } else {
      // 添加
      res = await request('/server/api/pet/add', 'POST', petFormData)
      console.log(res)
      if (res.code === 0) {
        ElMessage.success('添加成功')
        // 显示成功弹窗
        setTimeout(() => {
          showSuccess.value = true
          showProgress.value = false
        }, 500)
      } else {
        ElMessage.error('添加失败')
      }
    }

    clearInterval(progressInterval)
    progress.value = 100


  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('请完善表单信息!')
    showProgress.value = false
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    petFormData.characterTags = []
    ElMessage.info('表单已重置')
  }
}

// 成功弹窗确认处理
const handleSuccessConfirm = () => {
  showSuccess.value = false
  if (isEdit.value) {
    router.push('/my-pets')
  } else {

    resetForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 跳转到宠物详情
const goToPetDetail = () => {
  showSuccess.value = false
  router.push({ path: '/my-pets' })
}

// 返回上一页
const goBack = () => {
  router.push('/my-pets')
}
const updateBasicInfo = (newBasicInfo) => {
  console.log('收到基本信息子组件更新：', newBasicInfo)
  Object.assign(petFormData, newBasicInfo)
}
const updateHealthInfo = (newHealthInfo) => {
  console.log('收到子健康信息组件更新：', newHealthInfo)
  Object.assign(petFormData, newHealthInfo)
}
const handleTagsUpdate = (newTags) => {
  console.log('收到标签子组件更新：', newTags)
  petFormData.characterTags = newTags
  console.log(petFormData.characterTags)
}

</script>

<style lang="scss" scoped>
/* 基础动画 */
@keyframes modal-in {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 按钮样式 */
.action-btn {
  min-width: 140px;
}

.reset-btn {
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(244, 114, 182, 0.15);
  }
}

.submit-btn {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  border: none;
  color: white;
  box-shadow: 0 6px 20px rgba(244, 114, 182, 0.3);

  &:hover:not(.is-disabled) {
    background: linear-gradient(135deg, #ec4899, #db2777);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(244, 114, 182, 0.4);
  }

  &:active:not(.is-disabled) {
    transform: translateY(0);
  }
}

/* 进度条 */
.custom-progress:deep(.el-progress-bar__outer) {
  border-radius: 10px;
  background: #fdf2f8;
}

.custom-progress:deep(.el-progress-bar__inner) {
  border-radius: 10px;
  background: linear-gradient(90deg, #f472b6, #ec4899);
}

/* 成功弹窗 */
.success-modal {
  box-shadow: 0 25px 50px rgba(244, 114, 182, 0.2);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.decoration-1 {
  animation: float 3s ease-in-out infinite;
}

.decoration-2 {
  animation: float 3s ease-in-out infinite 0.5s;
}

.decoration-3 {
  animation: float 3s ease-in-out infinite 1s;
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #fdf2f8;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #fbcfe8, #f472b6);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #f472b6, #ec4899);
}

/* 响应式 */
@media (max-width: 768px) {
  .action-btn {
    min-width: 120px;
    padding: 0.75rem 1.5rem;
  }
}
</style>