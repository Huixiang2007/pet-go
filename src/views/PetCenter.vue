<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- 导航栏 -->

    <NavBar />
    <!-- 主横幅区域 -->
    <section class="relative bg-gray-100 py-16 md:py-24 overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <img
          src="https://picsum.photos/id/1025/1920/1080"
          alt="Background"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Where Pets Find Their People
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            Thousands of adoptable pets are looking for people like you. Find your perfect companion
            today.
          </p>
          <el-button
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-6 text-lg rounded-full"
          >
            Find Pet
          </el-button>
        </div>

        <!-- 宠物圆形展示区 -->
        <div class="relative">
          <!-- 黄色连接线 -->
          <div
            class="connection-line absolute top-1/2 left-0 w-full h-3 bg-yellow-500 -translate-y-1/2 z-0"
            @mouseenter="showAddButton = true"
            @mouseleave="showAddButton = false"
          ></div>

          <div
            id="petContainer"
            class="flex justify-center items-center gap-8 md:gap-12 relative z-10 transition-all duration-500 px-4"
            :class="{ 'move-pets': isLastCircleHovered }"
          >
            <!-- 宠物圆形将通过v-for渲染 -->
            <div
              v-for="(pet, index) in pets"
              :key="index"
              class="pet-circle flex flex-col items-center transition-all duration-500 ease-out"
              :style="{
                transform: isLastCircleHovered ? `translateX(-${index * 20}px)` : 'translateX(0)',
              }"
            >
              <div
                class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <img :src="pet.image" :alt="pet.name" class="w-full h-full object-cover" />
              </div>
              <div class="mt-4 text-center">
                <h3 class="font-bold text-gray-800">{{ pet.name }}</h3>
                <p class="text-sm text-gray-600">Breed: {{ pet.breed }}</p>
                <p class="text-sm text-gray-600">Age: {{ pet.age }}</p>
              </div>
            </div>

            <!-- 添加按钮 -->
            <div
              class="add-button-container flex items-center justify-center h-32 md:h-40 relative"
              @mouseenter="isLastCircleHovered = true"
              @mouseleave="isLastCircleHovered = false"
            >
              <div
                class="add-button transition-all duration-500 ease-out flex items-center justify-center cursor-pointer"
                :class="{
                  'w-32 h-32 md:w-40 md:h-40 rounded-full bg-yellow-500': showAddButton || isAdding,
                  'w-16 h-32 md:w-20 md:h-40 rounded-r-full bg-yellow-500':
                    !showAddButton && !isAdding,
                }"
                @click="startAddPet"
              >
                <div class="flex flex-col items-center justify-center text-white">
                  <el-icon class="text-2xl md:text-3xl mb-1">
                    <Plus />
                  </el-icon>
                  <span class="font-medium" v-if="showAddButton || isAdding">Add Pet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部波浪装饰 -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" class="w-full h-auto">
          <path
            fill="#ffffff"
            fill-opacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
          ></path>
        </svg>
      </div>
    </section>

    <!-- 宠物信息输入区域 -->
    <section
      id="petFormSection"
      class="container mx-auto px-4 py-12 transition-all duration-700 ease-out"
      :style="{
        opacity: isAdding ? 1 : 0,
        transform: isAdding ? 'translateY(0)' : 'translateY(20px)',
        height: isAdding ? 'auto' : '0',
        overflow: isAdding ? 'visible' : 'hidden',
      }"
    >
      <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <el-icon class="text-yellow-500 mr-2"><Pet /></el-icon>
          添加新宠物信息
        </h2>

        <el-form :model="newPet" ref="petFormRef" label-width="120px" class="space-y-6">
          <el-row :gutter="20">
            <el-col :span="24" :md="12">
              <el-form-item
                label="宠物名称"
                prop="name"
                :rules="[{ required: true, message: '请输入宠物名称', trigger: 'blur' }]"
              >
                <el-input v-model="newPet.name" placeholder="请输入宠物名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12">
              <el-form-item
                label="宠物品种"
                prop="breed"
                :rules="[{ required: true, message: '请输入宠物品种', trigger: 'blur' }]"
              >
                <el-input v-model="newPet.breed" placeholder="请输入宠物品种"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24" :md="12">
              <el-form-item
                label="宠物年龄"
                prop="age"
                :rules="[{ required: true, message: '请输入宠物年龄', trigger: 'blur' }]"
              >
                <el-input v-model="newPet.age" placeholder="例如：10 Months"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="12">
              <el-form-item label="宠物性别">
                <el-radio-group v-model="newPet.gender">
                  <el-radio label="male">公</el-radio>
                  <el-radio label="female">母</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="宠物描述">
            <el-input
              v-model="newPet.description"
              type="textarea"
              rows="4"
              placeholder="请描述宠物的性格、健康状况等信息"
            ></el-input>
          </el-form-item>

          <el-form-item label="上传照片">
            <el-upload
              action="#"
              list-type="picture"
              :on-change="handleImageUpload"
              :auto-upload="false"
              :show-file-list="true"
            >
              <el-button type="primary">选择图片</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item class="flex justify-end gap-3">
            <el-button type="default" @click="cancelAddPet">取消</el-button>
            <el-button type="primary" @click="confirmAddPet">确认添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-12 mt-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <p>&copy; 2023 Petito Animal Rescue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import NavBar from '../components/NavBar.vue'
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Phone, Search, Menu, Plus } from '@element-plus/icons-vue'
import type { UploadFile, FormInstance } from 'element-plus'
// 宠物数据类型
interface Pet {
  id: number
  name: string
  breed: string
  age: string
  image: string
  description?: string
  gender?: 'male' | 'female'
}
export default {
  name: 'PetCenter',

  setup() {
    // 状态管理
    const pets = ref<Pet[]>([
      {
        id: 1,
        name: 'Lucky',
        breed: 'Mixed',
        age: '10 Months',
        image: 'https://picsum.photos/id/1025/300/300',
      },
      {
        id: 2,
        name: 'Stefanie',
        breed: 'Maltese',
        age: '10 Months',
        image: 'https://picsum.photos/id/1062/300/300',
      },
      {
        id: 3,
        name: 'Sam',
        breed: 'Mixed',
        age: '1 Year',
        image: 'https://picsum.photos/id/40/300/300',
      },
    ])

    // 交互状态
    const showAddButton = ref(false)
    const isLastCircleHovered = ref(false)
    const isAdding = ref(false)
    const petFormRef = ref<FormInstance | null>(null)

    // 新宠物数据
    const newPet = reactive<Pet>({
      id: Date.now(),
      name: '',
      breed: '',
      age: '',
      image: 'https://picsum.photos/id/237/300/300', // 默认图片
    })

    // 处理图片上传
    const handleImageUpload = (uploadFile: UploadFile) => {
      // 在实际应用中，这里会处理图片上传逻辑
      // 这里简单处理为显示预览图
      const reader = new FileReader()
      reader.onload = (e) => {
        newPet.image = e.target?.result as string
      }
      reader.readAsDataURL(uploadFile.raw as Blob)
    }

    // 开始添加宠物
    const startAddPet = () => {
      isAdding.value = true
      showAddButton.value = true

      // 滚动到表单区域
      nextTick(() => {
        const formSection = document.getElementById('petFormSection')
        formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    // 取消添加宠物
    const cancelAddPet = () => {
      isAdding.value = false
      showAddButton.value = false
      isLastCircleHovered.value = false

      // 重置表单
      petFormRef.value?.resetFields()
    }

    // 确认添加宠物
    const confirmAddPet = () => {
      petFormRef.value?.validate((valid) => {
        if (valid) {
          // 添加新宠物到列表
          pets.value.push({
            ...newPet,
            id: Date.now(),
          })

          // 重置状态
          isAdding.value = false
          showAddButton.value = false
          isLastCircleHovered.value = false

          // 重置表单
          petFormRef.value?.resetFields()
          newPet.image = 'https://picsum.photos/id/237/300/300'

          ElMessage.success('宠物添加成功！')
        }
      })
    }

    // 页面加载完成后初始化
    onMounted(() => {
      // 可以在这里添加初始化逻辑
    })

    return {
      pets,
      showAddButton,
      isLastCircleHovered,
      isAdding,
      newPet,
      startAddPet,
      cancelAddPet,
      confirmAddPet,
      handleImageUpload,
    }
  },
}
</script>

<style scoped>
/* 自定义动画和过渡效果 */
.move-pets {
  transition: all 0.5s ease-out;
}

.pet-circle {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.add-button {
  box-shadow: 0 4px 12px rgba(250, 204, 21, 0.3);
}

.add-button:hover {
  background-color: #fbbf24;
  transform: scale(1.05);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>