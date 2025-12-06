<template>
  <div class="pet-showcase-app">
    <NavBar />
    <div class="scroll-container" :style="{
      transform: `translateY(-${scrollOffset}vh)`,
      marginTop: '5.5rem',
      transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }" @wheel="handleWheel">
      <!-- 轮播图 -->
      <div id="carousel-container" class="section">
        <FragmentCarousel />
      </div>
      <!-- 每个宠物的全屏卡片 -->
      <div v-for="(pet, index) in pets" :key="pet.id" class="pet-fullscreen-card section" :data-index="index">
        <!-- 宠物详情内容 -->
        <div class="pet-content">
          <!-- 顶部导航 -->
          <div class="top-nav">
            <div class="nav-left">
              <div class="pet-counter cute-counter">
                <span class="counter-icon">🐾</span>
                宠物 {{ currentScreen }} / {{ pets.length }}
              </div>
            </div>
            <div class="nav-right">
              <el-button type="danger" icon="Delete" @click="deletePet(pet.id)" class="delete-btn cute-btn"
                size="default">
                弃养
              </el-button>
            </div>
          </div>

          <div class="main-content">
            <!--基本信息 -->
            <div class="left-panel">
              <div class="pet-basic-info cute-card">
                <!-- 头像区域 -->
                <div class="avatar-section">
                  <div class="avatar-container">
                    <img :src="pet.avatar" :alt="pet.name" class="pet-avatar" />
                    <div class="avatar-frame"></div>
                    <div class="gender-tag cute-tag">
                      <el-tag :type="pet.gender === 1 ? 'primary' : 'danger'" size="small">
                        <el-icon class="mr-1">
                          <Male v-if="pet.gender === 1" />
                          <Female v-else />
                        </el-icon>
                        {{ pet.gender === 1 ? '小王子' : '小公主' }}
                      </el-tag>
                    </div>
                    <div v-if="pet.sterilization" class="neutered-tag cute-tag">
                      <el-tag type="success" size="small">🎗️ 已绝育</el-tag>
                    </div>
                  </div>
                </div>

                <!-- 基本信息 -->
                <div class="info-section">
                  <h1 class="pet-name cute-title" @wheel="handleWheel">{{ pet.name }}</h1>

                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-icon">🎂</div>
                      <div class="info-content">
                        <div class="info-label">生日</div>
                        <div class="info-value">{{ formatDate(pet.birthday) }}</div>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-icon">📅</div>
                      <div class="info-content">
                        <div class="info-label">品种</div>
                        <div class="info-value">{{ pet.breed }}</div>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-icon">⚖️</div>
                      <div class="info-content">
                        <div class="info-label">体重</div>
                        <div class="info-value">{{ pet.weight }} kg</div>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-icon">💖</div>
                      <div class="info-content">
                        <div class="info-label">健康状态</div>
                        <div class="info-value">
                          <el-tag :type="getHealthStatusType(pet.healthStatus)" class="cute-tag" size="small">
                            {{ pet.healthStatus }}
                          </el-tag>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 性格标签 -->
                  <div class="personality-section">
                    <h3 class="section-title">✨ 性格特点</h3>
                    <div class="tags-container">
                      <!-- <el-tag v-for="tag in pet.characterTags" :key="tag" class="personality-tag" size="small">
                        {{ tag }}
                      </el-tag> -->
                      <el-tag v-for="tag in pet.characterTags" :key="tag" :disable-transitions="false"
                        @close="handleCloseTag(pet.id, tag)" style="
                          background-color: #e3f2fd;
                          color: #2196f3;
                          padding: 0.5rem 0.9rem;
                          border-radius: 20px;
                          font-size: 0.9rem;
                          font-weight: bold;
                          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                          display: inline-block;
                          height: auto;
                          font-family:
                            ui-sans-serif,
                            system-ui,
                            sans-serif,
                            Apple Color Emoji,
                            Segoe UI Emoji,
                            Segoe UI Symbol,
                            Noto Color Emoji;
                          margin-bottom: 0.9rem;
                        ">
                        {{ tag }}
                      </el-tag>
                    </div>
                  </div>
                  <!-- 编辑按钮-->
                  <div class="edit-btn-container">
                    <el-button icon="Edit" size="small" class="edit-btn cute-btn" @click="openEditDialog(pet)">
                      编辑信息
                    </el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 健康档案和成长记录 -->
            <div class="right-panel">
              <div class="detail-tabs-container cute-card" @wheel="handleWheel">
                <el-tabs v-model="activeTabs[pet.id]" class="detail-tabs">
                  <!-- 健康档案 -->
                  <el-tab-pane label="🏥 健康档案" name="health">
                    <HealthRecords :pet="pet" />
                  </el-tab-pane>

                  <!-- 成长记录 -->
                  <el-tab-pane label="📸 成长记录" name="growth">
                    <GrowthAlbum :pet="pet" @add-record="openAddGrowthRecord(pet)" />
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航箭头 -->
    <div class="navigation-arrows">
      <el-button circle size="small" :disabled="currentScreen === 0" @click="scrollToPrevScreen"
        class="nav-arrow prev-arrow cute-btn">
        <el-icon>
          <ArrowUp />
        </el-icon>
      </el-button>

      <div class="nav-dots">
        <div v-for="(pet, index) in pets" :key="pet.id" class="nav-dot" :class="{ active: currentScreen === index + 1 }"
          @click="scrollToScreen(index + 1)">
          <span class="dot-emoji">{{ getPetEmoji(pet) }}</span>
        </div>
      </div>

      <el-button circle size="small" :disabled="currentScreen === pets.length" @click="scrollToNextScreen"
        class="nav-arrow next-arrow cute-btn">
        <el-icon>
          <ArrowDown />
        </el-icon>
      </el-button>
    </div>

    <!-- 添加宠物按钮 -->
    <el-button type="primary" circle size="small" @click="goToAddPet" class="add-pet-btn cute-btn">
      <el-icon>
        <Plus />
      </el-icon>
    </el-button>

    <!-- 添加成长记录对话框 -->
    <el-dialog v-model="showAddGrowthDialog" title="📸 添加成长记录" width="500px" class="cute-dialog">
      <el-form :model="newGrowthRecord" label-width="80px">
        <el-form-item label="年龄阶段">
          <el-input v-model="newGrowthRecord.age" placeholder="如：0-1岁、1-2岁" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddGrowthDialog = false">取消</el-button>
        <el-button type="primary" class="cute-btn">确认添加</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="✏️ 编辑宠物信息" width="500px" class="cute-dialog edit-dialog">
      <el-form :model="editForm" label-width="100px" class="edit-form" :rules="editRules" ref="editFormRef">
        <el-form-item label="宠物名称" prop="name">
          <el-input v-model="editForm.name" placeholder="输入宠物名字" class="cute-input" />
        </el-form-item>

        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择生日" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" class="cute-input" />
        </el-form-item>

        <el-form-item label="品种" prop="breed">
          <el-input v-model="editForm.breed" placeholder="输入品种" class="cute-input" />
        </el-form-item>

        <el-form-item label="体重 (kg)" prop="weight">
          <el-input v-model="editForm.weight" type="number" placeholder="输入体重" step="0.1" class="cute-input" />
        </el-form-item>

        <el-form-item label="健康状态" prop="healthStatus">
          <el-select v-model="editForm.healthStatus" placeholder="选择健康状态" class="cute-input">
            <el-option label="健康" value="健康" />
            <el-option label="良好" value="良好" />
            <el-option label="注意" value="注意" />
            <el-option label="生病" value="生病" />
          </el-select>
        </el-form-item>

        <el-form-item label="绝育状态">
          <el-switch v-model="editForm.sterilization" active-text="已绝育" inactive-text="未绝育" active-color="#FF69B4" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showEditDialog = false" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="confirmEdit" class="confirm-btn cute-btn">
          保存修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowUp, ArrowDown, Plus, Male, Female } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import HealthRecords from '@/views/myPets/components/HealthRecords.vue'
import GrowthAlbum from '@/views/myPets/components/GrowthAlbum.vue'
import FragmentCarousel from '@/views/myPets/components/FragmentCarousel.vue'
import NavBar from '@/components/NavBar.vue'
enum PetGender {
  Male = 1,
  Female = 0,
}
enum SterilizationStatus {
  Neutered = 1, // 已绝育
  NotNeutered = 0, // 未绝育
}
type DateString = `${number}-${number}-${number}`
interface HealthRecords {
  // 疫苗
  vaccine: Array<{
    type: string
    date: DateString
    nextReminder?: DateString
  }>
  // 驱虫
  deworming: Array<{
    medicine: string
    date: string
    nextReminder?: string
  }>
  //病历
  medical: Array<{
    hospital: string
    diagnosis: string //诊断
    medicine: string
    date: string
  }>
}
interface Photos {
  src: string
  description: string
  date: DateString
}
interface GrowthRecords {
  age: string
  photos: Array<Photos>
}
//定义Growth为GrowthRecord类型的数组
type Growth = GrowthRecords[]

interface Pet {
  id: number
  userId: number
  name: string
  type: string
  breed: string
  avatar: string
  gender: PetGender
  birthday: DateString
  age: string
  weight: number
  sterilization?: SterilizationStatus
  healthStatus?: string
  description?: string
  specialNotes?: string
  characterTags?: string[]
  healthRecords?: HealthRecords
  growthRecords?: Growth
}
const router = useRouter()

// 状态管理
//记录当前索引,-1表示轮播图区域
const currentScreen = ref(0)
const pets = ref<Pet[]>([])
const showAddGrowthDialog = ref(false)
const currentEditingPet = ref<Pet | null>(null)
//总屏幕数
const totalScreens = computed(() => 1 + pets.value.length)
//滚动偏移量(当前屏幕索引*100vh)
const scrollOffset = computed(() => currentScreen.value * 100)
//滚动到上一屏
const scrollToPrevScreen = () => {
  if (currentScreen.value > 0) {
    currentScreen.value--
  }
}
//滚动到下一屏
const scrollToNextScreen = () => {
  console.log(totalScreens.value, currentScreen.value)
  if (currentScreen.value < totalScreens.value - 1) {
    currentScreen.value++
  }
}
//滚动到指定屏幕
const scrollToScreen = (index: number) => {
  console.log(currentScreen.value)

  if (index >= 0 && index < totalScreens.value) {
    currentScreen.value = index
  }
}
//鼠标滚轮控制
const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    return
  }

  console.log('在外部')
  e.preventDefault()
  if (e.deltaY > 0) {
    scrollToNextScreen()
  } else {
    scrollToPrevScreen()
  }
}
//根据id寻找宠物对象
const getPetById = (id: number) => {
  return pets.value.find((pet) => pet.id === id)
}
// 删除一个性格标签
const handleCloseTag = (id: number, tag: string) => {
  const pet = getPetById(id)
  const characterTags = ref(pet?.characterTags)
  characterTags.value?.splice(characterTags.value.indexOf(tag), 1)
}
// 显示添加性格输入框
// const tagInputValue = ref('')//输入框绑定的值（新增标签里面的内容）
// const tagInputVisible = ref<Record<number, boolean>>({});
// const InputRef = ref<Record<number, InputInstance | null>>({});//获取 el-input 组件实例的 ref

// 设置输入框 ref 的辅助函数
// const setInputRef = (id: number) => {
//   return (el: any) => {
//     if (el) {
//       InputRef.value[id] = el as InputInstance
//     }
//   }
// }

// const showAddTagInput = (id: number) => {
//   tagInputVisible.value[id] = true
//   //确保输入框渲染后再聚焦
//   nextTick(() => {
//     const currentInput = InputRef.value[id]
//     if (currentInput) {
//       // 方法1: 尝试使用 Element Plus Input 组件的 focus 方法
//       if (typeof (currentInput as any).focus === 'function') {
//         (currentInput as any).focus()
//       } else {
//         // 方法2: 通过 $el 访问内部的 input 元素
//         const inputElement = currentInput.$el?.querySelector('.el-input__inner') as HTMLInputElement | null
//         if (inputElement) {
//           inputElement.focus()
//         } else {
//           console.error('未找到 .el-input__inner 元素')
//         }
//       }
//     }
//   })
// }
// //确认输入标签
// const handleInputConfirm = (id: number) => {
//   //过滤空值
//   if (!tagInputValue.value.trim()) {
//     tagInputVisible.value[id] = false
//     tagInputValue.value = ''
//     return;
//   }
//   const pet = getPetById(id)
//   if (pet) {
//     //防止undefined
//     if (!pet.characterTags) pet.characterTags = []
//     //避免添加重复的标签
//     if (!pet.characterTags?.includes(tagInputValue.value)) {
//       pet.characterTags.push(tagInputValue.value)
//     }

//   }
//   tagInputVisible.value[id] = false
//   tagInputValue.value = ''
// }
// 获取宠物对应的emoji
const getPetEmoji = (pet: Pet) => {
  if (pet.breed.includes('金毛')) return '🐕'
  if (pet.breed.includes('布偶')) return '🐱'
  if (pet.breed.includes('柯基')) return '🐶'
  return pet.gender === 1 ? '🐾' : '🌸'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 获取健康状态类型
const getHealthStatusType = (status: string | undefined) => {
  const statusMap: Record<string, string> = {
    健康: 'success',
    良好: 'info',
    注意: 'warning',
    生病: 'danger',
  }
  return statusMap[status || ''] || 'info'
}

// 添加宠物
const goToAddPet = () => {
  router.push('/add-pet')
}

// 删除宠物
const deletePet = async (petId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个可爱的宠物吗？这个操作不可恢复！', '删除确认', {
      confirmButtonText: '确定删除',
      cancelButtonText: '再想想',
      type: 'warning',
      center: true,
    })

    const index = pets.value.findIndex((pet) => pet.id === petId)
    if (index !== -1) {
      pets.value.splice(index, 1)
      ElMessage.success('宠物删除成功')

      // 如果删除的是当前显示的宠物，调整当前索引
      if (currentScreen.value >= pets.value.length) {
        currentScreen.value = Math.max(0, pets.value.length - 1)
      }
    }
  } catch {
    // 用户取消删除
  }
}
//添加新的成长记录
const newGrowthRecord = ref({
  age: '',
})
//添加成长记录对应的图片
// const addGrowthImg = ref({
//   photos: [] as Array<Photos>
// })

// 打开添加成长记录对话框
const openAddGrowthRecord = (pet: Pet) => {
  currentEditingPet.value = pet
  // 重置表单
  Object.assign(newGrowthRecord, {
    age: '',
    photos: [],
  })
  showAddGrowthDialog.value = true
}

// 确认添加成长记录
// const confirmAddGrowthRecord = () => {

//   if (currentEditingPet.value) {
//     const pet = pets.value.find(p => p.id === currentEditingPet.value!.id);
//     if (pet) {
//       pet.growthRecords?.push({
//         age: newGrowthRecord.value.age,
//         photos: [
//           {
//             date:'2025-11-20',
//             description: newGrowthRecord.description,
//             src: newGrowthRecord.photos
//           }
//         ]

//       });
//       ElMessage.success('成长记录添加成功！');
//       showAddGrowthDialog.value = false;
//     }
//   }
// };
// 编辑相关状态
const showEditDialog = ref(false)
const editFormRef = ref<FormInstance | null>(null)
const currentEditPet = ref<Pet | null>(null)
const editForm = ref({
  name: '',
  birthday: '',
  breed: '',
  weight: 0,
  healthStatus: '',
  sterilization: 0,
})

// 表单验证规则
const editRules = ref({
  name: [{ required: true, message: '请输入宠物名称', trigger: 'blur' }],
  breed: [{ required: true, message: '请输入品种', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }],
  healthStatus: [{ required: true, message: '请选择健康状态', trigger: 'change' }],
})

// 打开编辑弹窗
const openEditDialog = (pet: Pet) => {
  currentEditPet.value = pet
  // 初始化表单数据
  editForm.value = {
    name: pet.name,
    birthday: pet.birthday,
    breed: pet.breed,
    weight: pet.weight,
    healthStatus: pet.healthStatus || '',
    sterilization: pet.sterilization || 0,
  }
  showEditDialog.value = true
}

// 确认修改
const confirmEdit = async () => {
  showEditDialog.value = false
}
const activeTabs = reactive<Record<number, string>>({})

// 初始化
const initialize = () => {
  pets.value.forEach((pet) => {
    activeTabs[pet.id] = 'health'
  })
}

const loadPets = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  pets.value = [
    {
      id: 1,
      userId: 3,
      name: 'Lucky',
      type: 'DOG',
      age: '3',
      breed: '金毛寻回犬',
      birthday: '2020-05-15',
      gender: 1,
      weight: 32.5,
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
      characterTags: ['活泼', '友好', '粘人', '聪明', '贪吃'],
      sterilization: 1,
      healthStatus: '健康',
      healthRecords: {
        vaccine: [
          { type: '狂犬病疫苗', date: '2023-03-10', nextReminder: '2024-03-10' },
          { type: '六联疫苗', date: '2023-01-15', nextReminder: '2024-01-15' },
        ],
        deworming: [{ medicine: '体内驱虫片', date: '2023-05-20', nextReminder: '2023-08-20' }],
        medical: [
          {
            hospital: '爱心宠物医院',
            diagnosis: '轻微皮炎',
            medicine: '皮肤药膏',
            date: '2022-11-05',
          },
        ],
      },
      growthRecords: [
        {
          age: '0-1岁',
          photos: [
            {
              date: '2022-09-01',
              src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
              description: '第一次出门散步',
            },
          ],
        },
        {
          age: '1-2岁',
          photos: [
            {
              date: '2022-09-01',
              src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
              description: '第一次出门散步',
            },
            {
              date: '2022-09-01',
              src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
              description: '第一次出门散步',
            },
            {
              date: '2022-09-01',
              src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
              description: '第一次出门散步',
            },
            {
              date: '2022-09-01',
              src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
              description: '第一次出门散步',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      userId: 1,
      name: 'Momo',
      type: 'cat',
      breed: '布偶猫',
      age: '5个月',
      birthday: '2021-08-22',
      gender: 0,
      weight: 4.2,
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop',
      characterTags: ['安静', '优雅', '胆小', '爱干净'],
      sterilization: 1,
      healthStatus: '良好',
      healthRecords: {
        vaccine: [{ type: '猫三联', date: '2023-02-28', nextReminder: '2024-02-28' }],
        deworming: [{ medicine: '体外驱虫滴剂', date: '2023-06-05', nextReminder: '2023-09-05' }],
        medical: [],
      },
      growthRecords: [
        {
          age: '0-1岁',
          photos: [
            {
              date: '2022-09-01',
              src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
              description: '第一次出门散步',
            },
          ],
        },
      ],
    },
  ]
  initialize()
}

// 生命周期
onMounted(() => {
  loadPets()
  //   window.addEventListener('keydown', handleKeydown);
  //   window.addEventListener('wheel', handleWheel, { passive: false });
})

onUnmounted(() => {
  //   window.removeEventListener('keydown', handleKeydown);
  //   window.removeEventListener('wheel', handleWheel);
})
</script>

<style scoped lang="scss">
.pet-showcase-app {
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #ffe4e6 0%, #fbcfe8 50%, #ddd6fe 100%);
  font-family: 'Comic Sans MS', 'Yuanti SC', 'YouYuan', sans-serif;
}

.pet-fullscreen-card {
  height: 100vh;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 20px;
}

.pet-content {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%);
  border-bottom: 2px dashed rgba(255, 255, 255, 0.5);
}

.cute-btn {
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.cute-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.delete-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.cute-counter {
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
}

.counter-icon {
  margin-right: 6px;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 15px;
  padding: 15px;
  overflow: hidden;
  min-height: 0;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.cute-card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 182, 193, 0.3);
  height: 100%;
  overflow-y: auto;
}

.cute-card::-webkit-scrollbar {
  width: 5px;
}

.cute-card::-webkit-scrollbar-track {
  background: rgba(255, 182, 193, 0.1);
  border-radius: 3px;
}

.cute-card::-webkit-scrollbar-thumb {
  background: #ffb6c1;
  border-radius: 3px;
}

.cute-card::-webkit-scrollbar-thumb:hover {
  background: #ff69b4;
}

/* 头像区域 */
.avatar-section {
  text-align: center;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.pet-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffb6c1;
  box-shadow: 0 6px 15px rgba(255, 182, 193, 0.3);
}

.avatar-frame {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px dashed #ff69b4;
  border-radius: 50%;
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.gender-tag {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.neutered-tag {
  position: absolute;
  top: -8px;
  right: -8px;
}

.cute-tag {
  border-radius: 15px;
  border: none;
  font-weight: bold;
}

.cute-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff69b4;
  text-align: center;
  margin: 0 0 5px 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.cute-subtitle {
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin: 0 0 20px 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  border-left: 4px solid #ffb6c1;
}

.info-icon {
  font-size: 1.2rem;
  width: 30px;
  text-align: center;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 3px;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

/* 性格标签 */
.personality-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.1rem;
  color: #ff69b4;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.personality-tag {
  background: linear-gradient(135deg, #ffe4e6 0%, #ffb6c1 100%);
  color: #d63384;
  border: none;
  border-radius: 15px;
  padding: 6px 12px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(255, 182, 193, 0.3);
  font-size: 0.8rem;
}

/* 编辑按钮容器 */
.edit-btn-container {
  text-align: center;
  margin-top: 20px;
}

.edit-btn {
  background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%);
  padding: 8px 20px;
  opacity: 0.8;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.4);
  }
}

/* 编辑弹窗样式 */
.edit-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    background-color: #fff9fb;
  }

  :deep(.el-form-item) {
    margin-bottom: 15px;
  }

  :deep(.el-form-item__label) {
    color: #d63384;
    font-weight: 600;
  }
}

/* 可爱输入框样式 */
.cute-input {

  :deep(.el-input__inner),
  :deep(.el-select__inner) {
    border-radius: 15px;
    border: 2px solid #ffb6c1;
    padding: 10px 15px;
    transition: all 0.3s ease;

    &:focus {
      border-color: #ff69b4;
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
    }
  }

  :deep(.el-date-editor .el-input__inner) {
    padding: 8px 15px;
  }
}

/* 弹窗按钮样式 */
.cancel-btn {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #495057;
  border: none;
  border-radius: 15px;
  padding: 8px 20px;
  margin-right: 10px;
  transition: all 0.2s;

  &:hover {
    background-color: linear-gradient(135deg, #dee2e6 0%, #ced4da 100%);
  }
}

.confirm-btn {
  padding: 8px 25px;
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.detail-tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.detail-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    min-height: 0;
  }
}

/* 导航箭头 */
.navigation-arrows {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 1000;
}

.nav-arrow {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  color: white;
  font-size: 1rem;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(255, 105, 180, 0.5);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.nav-dots {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

  &.active {
    background: white;
    border-color: #ff69b4;
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
  }

  &:hover {
    transform: scale(1.03);
    background: white;
  }
}

.dot-emoji {
  font-size: 1rem;
}

/* 添加宠物按钮 */
.add-pet-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  font-size: 1.2rem;
  z-index: 1000;

  &:hover {
    transform: scale(1.05) rotate(90deg);
  }
}

/* 对话框样式 */
.cute-dialog {
  :deep(.el-dialog) {
    border-radius: 20px;
    border: 2px solid #ffb6c1;
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%);
    border-radius: 20px 20px 0 0;
    margin: 0;
    padding: 15px 20px;
  }

  :deep(.el-dialog__title) {
    color: white;
    font-weight: bold;
  }
}

.milestone-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.milestones-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.milestone-tag {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: none;
  border-radius: 12px;
  color: #1976d2;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 280px 1fr;
    gap: 12px;
    padding: 12px;
  }

  .pet-avatar {
    width: 130px;
    height: 130px;
  }

  .cute-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .left-panel {
    max-height: 300px;
  }

  .navigation-arrows {
    right: 10px;
  }

  .nav-arrow {
    width: 40px;
    height: 40px;
  }

  .nav-dot {
    width: 35px;
    height: 35px;
  }

  .add-pet-btn {
    width: 50px;
    height: 50px;
    right: 10px;
    bottom: 10px;
  }
}

// ::-webkit-scrollbar {
//   width: 0;
//   /* 垂直滚动条宽度设为0 */
//   height: 0;
//   /* 水平滚动条高度设为0 */
//   display: none;
//   /* 直接隐藏 */
// }</style>
