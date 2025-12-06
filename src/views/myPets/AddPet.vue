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
              添加新宠物
            </h1>
          </div>
        </div>
      </div>

      <!-- 表单区域 -->
      <el-card
        class="shadow-xl rounded-3xl border-none bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-2xl border border-rose-50">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300"></div>

        <el-form :model="addPetFormData" :rules="formRules" ref="formRef" label-width="140px" label-position="left"
          class="p-8" @submit.prevent="submitForm">
          <!-- 基本信息 -->
          <div class="mb-10">
            <div class="flex items-center mb-8">
              <!-- <div class="w-3 h-10 bg-gradient-to-b from-pink-400 to-rose-400 rounded-r-lg mr-4"></div> -->
              <h3 class="text-2xl font-bold text-rose-800 flex items-center">
                <span
                  class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg mr-3">
                  <el-icon class="text-rose-500">
                    <User />
                  </el-icon>
                </span>
                基本信息
              </h3>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- 头像上传 -->
              <el-form-item label="宠物头像" prop="avatar" class="lg:col-span-2">
                <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
                  <el-upload class="avatar-uploader rounded-full" :show-file-list="false"
                    :before-upload="beforeAvatarUpload" :http-request="handleAvatarUpload"
                    @mouseenter="showUploadTip = true" @mouseleave="showUploadTip = false"
                    :disabled="avatarUploadLoading">
                    <div class="relative group">
                      <div v-if="addPetFormData.avatar"
                        class="relative border-4 border-pink-100 group-hover:border-pink-300 transition-all duration-400 shadow-lg">
                        <img :src="addPetFormData.avatar" class="avatar" />
                        <div
                          class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 duration-300 flex items-end justify-center pb-4">
                          <span class="text-white text-sm bg-black/40 px-3 py-1 rounded-full">更换头像</span>
                        </div>
                      </div>
                      <div v-else class="avatar-uploader-placeholder transition-all duration-400 shadow-md">
                        <el-icon class="avatar-uploader-icon">
                          <Plus />
                        </el-icon>
                        <div class="mt-3 text-sm text-rose-500 font-medium">
                          {{ avatarUploadLoading ? '上传中...' : '点击上传' }}
                        </div>
                        <div class="mt-1 text-xs text-rose-400">支持 JPG/PNG</div>
                      </div>
                    </div>
                  </el-upload>
                  <transition name="slide-fade">
                    <div v-if="showUploadTip"
                      class="bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-rose-300 rounded-r-lg p-5 max-w-md shadow-sm">
                      <div class="flex items-start space-x-3">
                        <div>
                          <p class="text-rose-700 font-medium mb-1">上传建议</p>
                          <p class="text-rose-600 text-sm leading-relaxed">
                            建议上传清晰的宠物照片，JPG或PNG格式，
                            文件大小不超过5MB，展现宠物最可爱的一面！
                          </p>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </el-form-item>

              <!-- 第一列 -->
              <div class="space-y-6">
                <el-form-item label="昵称" prop="name">
                  <el-input v-model="addPetFormData.name" placeholder="请输入宠物昵称" size="large"
                    class="custom-input focus-within:shadow-pink-200/50" />
                </el-form-item>
                <el-form-item label="种类" prop="type">
                  <el-select v-model="addPetFormData.type" placeholder="选择种类" class="focus-within:shadow-pink-200/50">
                    <el-option v-for="animal in animalOptions" :key="animal.value" :label="animal.label"
                      :value="animal.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="品种" prop="breed">
                  <el-input v-model="addPetFormData.breed" placeholder="例如：布偶猫、金毛犬" size="large"
                    class="custom-input focus-within:shadow-pink-200/50" />
                </el-form-item>

                <el-form-item label="生日" prop="birthday">
                  <el-date-picker v-model="addPetFormData.birthday" type="date" placeholder="选择宠物的生日" size="large"
                    class="w-full custom-datepicker" format="YYYY年MM月DD日" value-format="YYYY-MM-DD" placement="bottom"
                    force-popup-direction />
                </el-form-item>
              </div>

              <!-- 第二列 -->
              <div class="space-y-6">
                <el-form-item label="性别" prop="gender">
                  <div class="flex space-x-4">
                    <div class="flex-1" @click="addPetFormData.gender = 1">
                      <div
                        class="gender-card cursor-pointer rounded-2xl p-2 transition-all duration-300 border-2 border-transparent w-20"
                        :class="{ 'gender-card-male-active': addPetFormData.gender === 1 }">
                        <div
                          class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300"
                          :class="{
                            'bg-gradient-to-br from-blue-400 to-cyan-400':
                              addPetFormData.gender === 1,
                            'bg-gradient-to-br from-blue-100 to-cyan-100':
                              addPetFormData.gender !== 1,
                          }">
                          <el-icon class="text-white text-xl">
                            <Male />
                          </el-icon>
                        </div>
                      </div>
                    </div>
                    <div class="flex-1" @click="addPetFormData.gender = 1">
                      <div
                        class="gender-card cursor-pointer rounded-2xl p-2 transition-all duration-300 border-2 border-transparent w-20"
                        :class="{ 'gender-card-active': addPetFormData.gender === 1 }">
                        <div
                          class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300"
                          :class="{
                            'bg-gradient-to-br from-pink-400 to-rose-400':
                              addPetFormData.gender === 1,
                            'bg-gradient-to-br from-pink-100 to-rose-100':
                              addPetFormData.gender !== 1,
                          }">
                          <el-icon class="text-white text-xl">
                            <Female />
                          </el-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item label="体重" prop="weight">
                  <div class="flex items-center space-x-3">
                    <el-input-number v-model="addPetFormData.weight" :min="0" :max="100" :step="0.1"
                      controls-position="right" size="large" class="flex-1 custom-number" />
                    <span class="text-rose-600 font-medium min-w-[40px]">kg</span>
                  </div>
                </el-form-item>

                <!-- 健康状态  -->
                <el-form-item label="健康状态" prop="healthStatus">
                  <el-select v-model="addPetFormData.healthStatus" placeholder="选择健康状态" size="large"
                    class="w-full health-select" :teleported="false" :popper-append-to-body="false">
                    <el-option v-for="status in healthStatusOptions" :key="status.value" :label="status.label"
                      :value="status.value" :class="status.class">
                      <span class="flex items-center">
                        <span class="w-2 h-2 rounded-full mr-3" :class="status.indicatorClass"></span>
                        {{ status.label }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="绝育状态" prop="neutered">
                  <div class="flex items-center space-x-4">
                    <el-switch v-model="addPetFormData.sterilization"
                      :active-text="addPetFormData.sterilization ? '已绝育' : '未绝育'" size="large" class="custom-switch"
                      :active-color="addPetFormData.sterilization ? '#f472b6' : '#e5e7eb'" inline-prompt
                      :active-icon="Check" :inactive-icon="Close" style="--el-switch-on-color: #f472b6" />
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- 性格特点 -->
          <div class="mb-10">
            <div class="flex items-center mb-8">
              <h3 class="text-2xl font-bold text-rose-800 flex items-center">
                <span
                  class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg mr-3">
                  <el-icon class="text-rose-500">
                    <MagicStick />
                  </el-icon>
                </span>
                性格特点
              </h3>
            </div>

            <el-form-item class="space-y-6">
              <div class="space-y-6">
                <!-- 已选择标签 -->
                <div>
                  <div class="flex items-center mb-4">
                    <span class="text-rose-700 font-medium">已选择标签（{{ addPetFormData.characterTags.length }}/8）</span>
                  </div>
                  <div
                    class="selected-tags-container min-h-20 p-4 rounded-xl bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-rose-100">
                    <transition-group name="list" tag="div" class="flex flex-wrap gap-3">
                      <div v-for="tag in addPetFormData.characterTags" :key="tag"
                        class="selected-tag inline-flex items-center px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden group"
                        @click="removeTag(tag)">
                        <span class="text-rose-700 font-medium text-sm">{{ tag }}</span>
                        <el-icon
                          class="ml-2 text-rose-400 hover:text-rose-600 transition-colors duration-200 text-xs opacity-0 group-hover:opacity-100">
                          <Close />
                        </el-icon>
                      </div>
                      <div v-if="addPetFormData.characterTags.length === 0"
                        class="text-rose-300 italic flex items-center h-20 w-full justify-center">
                        <el-icon class="mr-2">
                          <Plus />
                        </el-icon>
                        还没有添加性格标签哦
                      </div>
                    </transition-group>
                  </div>
                </div>

                <!-- 推荐标签 -->
                <div>
                  <div class="flex items-center mb-4">
                    <el-icon class="text-rose-400 mr-2">
                      <Star />
                    </el-icon>
                    <span class="text-rose-700 font-medium">推荐标签</span>
                  </div>
                  <div class="recommended-tags grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <div v-for="tag in defaultTags" :key="tag"
                      class="recommended-tag px-4 py-3 rounded-xl text-center cursor-pointer transition-all duration-300 flex items-center justify-center"
                      :class="{
                        'recommended-tag-active': addPetFormData.characterTags.includes(tag),
                      }" @click="toggleDefaultTag(tag)">
                      {{ tag }}
                      <el-icon v-if="addPetFormData.characterTags.includes(tag)" class="ml-1 text-xs">
                        <Check />
                      </el-icon>
                    </div>
                  </div>
                </div>

                <!-- 自定义标签 -->
                <div>
                  <div class="flex items-center mb-4">
                    <el-icon class="text-rose-400 mr-2">
                      <Edit />
                    </el-icon>
                    <span class="text-rose-700 font-medium">自定义标签</span>
                  </div>
                  <div class="flex gap-3">
                    <div class="flex-1 relative">
                      <el-input v-model="newTag" placeholder="输入自定义标签，不超过5个字" size="large" @keyup.enter="addTag"
                        class="custom-input" :maxlength="5" />
                      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-300 text-sm">
                        {{ 5 - newTag.length }}/5
                      </div>
                    </div>
                    <el-button @click="addTag" size="large"
                      class="px-6 bg-gradient-to-r from-pink-400 to-rose-400 border-none text-white rounded-xl hover:shadow-lg transition-all duration-300"
                      :disabled="!newTag.trim()">
                      <el-icon class="mr-1">
                        <Plus />
                      </el-icon>
                      添加
                    </el-button>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>

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
                添加中
              </template>
              <template v-if="!loading">
                <el-icon class="mr-2">
                  <Check />
                </el-icon>
                添加宠物
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
                <span class="text-rose-800 font-medium">正在添加宠物</span>
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
            <h3 class="success-title text-3xl font-bold text-rose-800 mb-2">添加成功！</h3>
            <p class="success-message text-rose-600 mb-8">
              {{ addPetFormData.name || '您的宠物' }} 已加入家庭
            </p>
            <div class="success-actions flex flex-col sm:flex-row gap-3 justify-center">
              <el-button @click="goToPetDetail"
                class="success-btn primary px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 sm:flex-none bg-gradient-to-r from-pink-400 to-rose-400 text-white border-none hover:shadow-lg">
                <el-icon class="mr-2">
                  <View />
                </el-icon>
                查看详情
              </el-button>
              <el-button @click="addAnother"
                class="success-btn secondary px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 sm:flex-none border-rose-200 text-rose-600 bg-white hover:bg-rose-50">
                <el-icon class="mr-2">
                  <Plus />
                </el-icon>
                继续添加
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  ArrowLeft,
  Plus,
  Star,
  User,
  Male,
  Female,
  MagicStick,
  Check,
  Close,
  Refresh,
  SuccessFilled,
  Loading,
  View,
  Edit,
} from '@element-plus/icons-vue'
import request from '@/utils/request'
// import { fi } from 'element-plus/es/locales.mjs';
interface PetFormData {
  userId: number
  name: string
  type: string
  breed: string
  avatar: string
  gender: 1 | 2
  birthday: string
  weight: number
  sterilization: 0 | 1
  healthStatus: string
  description: string
  specialNotes: string
  characterTags: string
}

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const newTag = ref('')
const showUploadTip = ref(false)
const showSuccess = ref(false)
const showProgress = ref(false)
const progress = ref(0)
const animalOptions = [
  {
    value: 'cat',
    label: '猫',
  },
  {
    value: 'dog',
    label: '狗',
  },
  {
    value: 'fish',
    label: '鱼',
  },
  {
    value: 'bird',
    label: '鸟',
  },
  {
    value: 'rabbit',
    label: '兔',
  },
  {
    value: 'snake',
    label: '蛇',
  },
  {
    value: 'other',
    label: '其他',
  },
]
const progressMessages = ['正在准备数据...', '正在上传信息...', '正在保存记录...', '即将完成...']

const defaultTags = ['活泼', '温顺', '胆小', '粘人', '安静', '友好', '贪玩', '聪明', '忠诚', '好奇']

const healthStatusOptions = [
  { value: '健康', label: '健康', class: 'text-green-600', indicatorClass: 'bg-green-400' },
  { value: '良好', label: '良好', class: 'text-blue-600', indicatorClass: 'bg-blue-400' },
  { value: '注意', label: '注意', class: 'text-yellow-600', indicatorClass: 'bg-yellow-400' },
  { value: '生病', label: '生病', class: 'text-red-600', indicatorClass: 'bg-red-400' },
]

// 表单数据
const userId = localStorage.getItem('userId')
console.log('AddPet userId:', userId)
const addPetFormData = reactive<PetFormData>({
  userId: Number(userId),
  name: '',
  breed: '',
  type: '',
  birthday: '',
  gender: 1,
  weight: 0,
  avatar: '',
  characterTags: "",
  description: "",
  specialNotes: "",
  sterilization: 0,
  healthStatus: '健康',
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
  desscription: [{ required: true, message: '请输入宠物描述', trigger: 'blur' }],
  specialNotes: [{ required: true, message: '请输入特殊说明', trigger: 'blur' }],
}

// 切换标签
const toggleDefaultTag = (tag: string) => {
  const index = addPetFormData.characterTags.split(',').indexOf(tag)
  if (index > -1) {
    addPetFormData.characterTags.split(',')
    ElMessage.info(`已移除标签：${tag}`)
  } else {
    if (addPetFormData.characterTags.split(',').length >= 8) {
      ElMessage.warning('最多只能添加8个标签')
      return
    }
    addPetFormData.characterTags.split(',').push(tag)
    ElMessage.success(`已添加标签：${tag}`)
  }
}

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !addPetFormData.characterTags.includes(tag)) {
    if (addPetFormData.characterTags.length >= 8) {
      ElMessage.warning('最多只能添加8个标签')
      return
    }
    if (tag.length > 5) {
      ElMessage.warning('标签长度不能超过5个字符')
      return
    }
    addPetFormData.characterTags.split(',').push(tag)
    newTag.value = ''
    ElMessage.success('标签添加成功！')
  }
}

// 移除标签
const removeTag = (tag: string) => {
  const index = addPetFormData.characterTags.indexOf(tag)
  if (index > -1) {
    addPetFormData.characterTags.split(',').splice(index, 1)
    ElMessage.info(`已移除标签：${tag}`)
  }
}
const avatarUploadLoading = ref(false)
// 头像上传处理
const beforeAvatarUpload = (file: File) => {
  const isJPGOrPNG =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isJPGOrPNG) {
    ElMessage.error('头像必须是 JPG、PNG 或 GIF 格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('头像大小不能超过 5MB!')
    return false
  }
  return true
}
interface fileOptions {
  file: File
}
const handleAvatarUpload = async (options: fileOptions) => {
  const file = options.file

  // ElMessage.info('正在上传头像...');
  avatarUploadLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await request('/server/api/file/upload', 'POST', formData)
    console.log(response.data)
    if (response.code === 0) {
      ElMessage.success('头像上传成功!')
      addPetFormData.avatar = response.data.url
    } else {
      ElMessage.error('头像上传失败，请重试!')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('头像上传失败，请重试!')
  } finally {
    avatarUploadLoading.value = false
  }
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

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const progressInterval = simulateProgress()
    const response = await request('/server/api/pet/add', 'POST', addPetFormData)
    console.log('AddPet response:', response)
    clearInterval(progressInterval)
    progress.value = 100

    // 显示成功弹窗
    setTimeout(() => {
      showSuccess.value = true
      showProgress.value = false
    }, 500)
  } catch (error) {
    console.error('AddPet error:', error)
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
    addPetFormData.characterTags = '活泼'
    ElMessage.info('表单已重置')
  }
}

// 跳转到宠物详情
const goToPetDetail = () => {
  showSuccess.value = false
  router.push({ path: 'my-pets' })
}

// 继续添加
const addAnother = () => {
  showSuccess.value = false
  resetForm()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 返回上一页
const goBack = () => {
  router.push('my-pets')
}
</script>

<style lang="scss" scoped>
/* 动画效果 */
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

/* 性别卡片样式 */
.gender-card {
  background: linear-gradient(135deg, #ffffff, #fdf2f8);
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.08);
}

.gender-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(244, 114, 182, 0.15);
}

.gender-card-active {
  border-color: #f472b6;
  background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
  box-shadow: 0 8px 24px rgba(244, 114, 182, 0.2);
}

.gender-card-male-active {
  border-color: #7295f4;
  background: linear-gradient(135deg, #f2f6fd, #e4e6ff);
  box-shadow: 0 8px 24px rgba(114, 168, 244, 0.2);
}

/* 头像上传器样式 */
.avatar-uploader :deep(.el-upload) {
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* .avatar-uploader :deep(.el-upload):hover {
    transform: scale(1.02);
} */

.avatar-uploader-placeholder {
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
  border-radius: 50%;
  border: 2px dashed #fbcfe8;
  transition: all 0.4s;
}

.avatar-uploader-placeholder:hover {
  background: linear-gradient(135deg, #fce7f3, #fee2e2);
  border-color: #f472b6;
}

.avatar-uploader-icon {
  font-size: 48px;
  color: #f472b6;
  margin-bottom: 12px;
}

.avatar {
  width: 160px;
  height: 160px;
  display: block;
  object-fit: cover;
  border-radius: 50%;
}

/* 性格标签样式 */

.selected-tags-container {
  min-height: 80px;
}

.selected-tag {
  background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
  border: 1px solid #fbcfe8;
}

.selected-tag:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #fce7f3, #fee2e2);
  border-color: #f472b6;
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.15);
}

.recommended-tag {
  background: linear-gradient(135deg, #ffffff, #fafafa);
  border: 1px solid #f3f4f6;
  color: #6b7280;
}

.recommended-tag:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #fdf2f8, #fce7f3);
  border-color: #fbcfe8;
  color: #f472b6;
}

.recommended-tag-active {
  background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
  border-color: #f472b6;
  color: #ec4899;
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.15);
}

/* 自定义输入框样式 */
.custom-input {
  border-radius: 12px;
  transition: all 0.3s;
}

.custom-input:deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(244, 114, 182, 0.05);
  transition: all 0.3s;
}

.custom-input:deep(.el-input__wrapper:hover),
.custom-input:deep(.el-input__wrapper.is-focus) {
  border-color: #f472b6;
  box-shadow:
    0 0 0 3px rgba(244, 114, 182, 0.1),
    0 2px 12px rgba(244, 114, 182, 0.15);
}

.custom-number:deep(.el-input-number__decrease),
.custom-number:deep(.el-input-number__increase) {
  border-radius: 10px;
  background: #fdf2f8;
  border-color: #fbcfe8;
  color: #f472b6;
}

.custom-number:deep(.el-input__wrapper) {
  border-radius: 12px 0 0 12px;
}

/* 健康状态下拉框 */
.health-select:deep(.el-select__wrapper) {
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  background: #ffffff;
}

.health-select:deep(.el-select__popper) {
  border-radius: 12px;
  border: 1px solid #fbcfe8;
  box-shadow: 0 10px 40px rgba(244, 114, 182, 0.15);
}

.health-select:deep(.el-select-dropdown__item) {
  border-radius: 8px;
  margin: 4px;
}

.health-select:deep(.el-select-dropdown__item:hover) {
  background: linear-gradient(135deg, #fdf2f8, #ffe4e6);
}

/* 开关样式 */
.custom-switch:deep(.el-switch__core) {
  border-radius: 12px;
  height: 28px;
}

/* 按钮样式 */
.action-btn {
  min-width: 140px;
}

.reset-btn {
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.08);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 114, 182, 0.15);
}

.submit-btn {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  border: none;
  color: white;
  box-shadow: 0 6px 20px rgba(244, 114, 182, 0.3);
}

.submit-btn:hover:not(.is-disabled) {
  background: linear-gradient(135deg, #ec4899, #db2777);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(244, 114, 182, 0.4);
}

.submit-btn:active:not(.is-disabled) {
  transform: translateY(0);
}

.add-tag-btn:hover:not(.is-disabled) {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  transform: translateY(-2px);
}

.add-tag-btn.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.decoration-1 {
  animation: float 3s ease-in-out infinite;
}

.decoration-2 {
  animation: float 3s ease-in-out infinite 0.5s;
}

.decoration-3 {
  animation: float 3s ease-in-out infinite 1s;
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

.list-move {
  transition: transform 0.3s ease;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

/* 响应式调整 */
@media (max-width: 768px) {
  .gender-card {
    padding: 3rem 1rem;
  }

  .avatar-uploader-placeholder,
  .avatar {
    width: 140px;
    height: 140px;
  }

  .action-btn {
    min-width: 120px;
    padding: 0.75rem 1.5rem;
  }
}
</style>
