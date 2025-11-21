<template>
    <div class="pet-profile-container m-0 p-0">
        <div class="pet-profile-screen mt-10 w-screen h-screen p-10 bg-red-100 overflow-hidden" v-for="pet in pets"
            :key="pet.id">
            <div class="profile-top h-full ">
                <!-- 宠物基本信息 -->
                <section class="bg-white rounded-3xl flex  gap-10 p-9">
                    <!-- 头像部分 -->
                    <div class="flex flex-col gap-7">
                        <div>
                            <img :src="pet.avatar || defaultAvatar" alt="pet.name"
                                class="w-[170px] h-[170px] rounded-full"></img>
                        </div>
                        <div class="flex justify-center gap-4">
                            <span class="bg-sky-400 py-1 px-3 rounded-full text-white font-semibold cursor-pointer"
                                @click="changeGender(pet.id)">{{
                                    pet.gender
                                        === 1 ? '公'
                                        :
                                        '母'
                                }}</span>
                            <span class="bg-green-400 py-1 px-3 rounded-full text-white font-semibold cursor-pointer"
                                @click="changeSterilizationStatus(pet.id)">{{
                                    pet.sterilization
                                        === 1 ? '已绝育'
                                        :
                                        '未绝育'
                                }}</span>
                        </div>
                    </div>

                    <!-- 详情部分 -->
                    <div class="flex-1">
                        <div class="text-4xl text-red-400 mb-4">{{ pet.name }}</div>

                        <div class="info-cards">
                            <div class="info-box-card">
                                <span class="info-card-title">品种</span>
                                <span class="info-card-value">{{ pet.breed }}</span>
                            </div>
                            <div class="info-box-card">
                                <span class="info-card-title">生日</span>
                                <span class="info-card-value">{{ pet.birthday }}</span>
                            </div>
                            <div class="info-box-card">
                                <span class="info-card-title">体重</span>
                                <span class="info-card-value">{{ pet.weight }}</span>
                            </div>
                            <div class="info-box-card">
                                <span class="info-card-title">健康状态</span>
                                <span class="info-card-value">{{ pet.healthStatus }}</span>

                            </div>
                        </div>
                        <div class="info-character">
                            <div class="character-title">
                                <span>性格标签</span>
                            </div>
                            <div class="flex gap-4 flex-wrap">
                                <el-tag v-for="tag in pet.characterTags" :key="tag" closable
                                    :disable-transitions="false" @close="handleCloseTag(pet.id, tag)" style=" background-color: #e3f2fd;
    color: #2196f3;
    padding: 0.5rem 0.9rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    display:inline-block;
    height:auto;
    /* margin-right: 0.9rem; */
    margin-bottom:0.9rem;
    ">
                                    {{ tag }}
                                </el-tag>
                                <el-input v-if="tagInputVisible[pet.id]" v-model="tagInputValue" class="w-20"
                                    size="default" @keyup.enter="handleInputConfirm(pet.id)"
                                    @blur="handleInputConfirm(pet.id)" style="width:200px;height: 33px" />
                                <el-button v-else class="button-new-tag" size="default"
                                    @click="showAddTagInput(pet.id)">
                                    点击添加
                                </el-button>
                            </div>

                        </div>

                    </div>

                </section>
                <!-- 健康记录部分 -->
                <section>
                    <div>
                        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                            <el-tab-pane label="疫苗记录" name="first">
                                <el-table :data="pet.healthRecords?.vaccine" height="250" style="width: 100%">
                                    <el-table-column prop="vaccineTypes" label="疫苗类型" width="180" />
                                    <el-table-column prop="vaccinationTime" label="接种时间" width="180" />
                                    <el-table-column prop="remindMe" label="下次提醒" />

                                    <el-table-column prop="remindMe" label="操作">
                                        <template #default>
                                            <el-button link type="primary" size="small" @click="handleClick">
                                                编辑
                                            </el-button>
                                            <el-button link type="primary" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="驱虫记录" name="second">
                                <el-table :data="pet.healthRecords?.deworming" height="250" style="width: 100%">
                                    <el-table-column prop="medicines" label="药品" width="180" />
                                    <el-table-column prop="time" label="时间" width="180" />
                                    <el-table-column prop="remindMe" label="下次提醒" />
                                    <el-table-column prop="remindMe" label="操作">
                                        <template #default>
                                            <el-button link type="primary" size="small" @click="handleClick">
                                                编辑
                                            </el-button>
                                            <el-button link type="primary" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="病历记录" name="third">
                                <el-table :data="pet.healthRecords?.medical" height="250" style="width: 100%">
                                    <el-table-column prop="hospital" label="医院" width="180" />
                                    <el-table-column prop="diagnosis" label="诊断" width="180" />
                                    <el-table-column prop="medicationUse" label="用药" />
                                    <el-table-column prop="remindMe" label="操作">
                                        <template #default>
                                            <el-button link type="primary" size="small" @click="handleClick">
                                                编辑
                                            </el-button>
                                            <el-button link type="primary" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>

                        </el-tabs>

                    </div>
                </section>
            </div>
            <!-- 宠物的成长记录 -->
            <div v-if="pet.growthRecords" class="profile-right">
                <section v-for="(item, index) in pet.growthRecords" :key="`growth-${index}-${item.age}`"
                    class="growth-records-container">
                    {{ item.age }}
                    <el-scrollbar>
                        <div class="scrollbar-flex-content">
                            <div v-for="(photo, index) in item.photos" :key="photo.src" class="scrollbar-demo-item">
                                <img :src="photo.src" :alt="photo.description"></img>
                            </div>
                        </div>
                    </el-scrollbar>
                </section>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import type { Ref } from 'vue';
import type { InputInstance, TabsPaneContext } from 'element-plus';
enum PetGender {
    Male = 1,
    Female = 0,
};
enum SterilizationStatus {
    Neutered = 1, // 已绝育
    NotNeutered = 0, // 未绝育
}
type DateString = `${number}-${number}-${number}`;
interface HealthRecords {
    // 疫苗
    vaccine: Array<{
        type: string,
        date: DateString,
        nextReminder?: DateString
    }>;
    // 驱虫
    deworming: Array<{
        medicine: string,
        date: string,
        nextReminder?: string
    }>
    //病历
    medical: Array<{
        hospital: string,
        diagnosis: string,//诊断
        medicine: string,
        date?: string
    }>
}
interface Photos {
    src: string,
    description: string,
    date: DateString
}
interface GrowthRecords {
    age: string
    photos: Array<Photos>
};
//定义Growth为GrowthRecord类型的数组
type Growth = GrowthRecords[]

interface Pet {
    id: number,
    userId: number,
    name: string,
    type: string,
    breed?: string,
    avatar?: string,
    gender: PetGender,
    birthday?: DateString,
    age: string,
    weight?: number,
    sterilization?: SterilizationStatus,
    healthStatus?: string,
    description?: string,
    specialNotes?: string,
    characterTags?: string[],
    healthRecords?: HealthRecords,
    growthRecords?: Growth
}
const defaultAvatar = 'https://picsum.photos/seed/pet1/200/200';
const getImageUrl = (name: string) => {
    return new URL(`../assets/${name}`, import.meta.url).href
}
const pets = reactive<Pet[]>([
    {
        "id": 12,
        "userId": 5,
        "name": "皮皮",
        "type": "猫",
        "breed": "英国长毛猫",
        "avatar": getImageUrl('image4.jpg'),
        "gender": 1,
        "birthday": "2012-03-23",
        "age": "13",
        "weight": 2,
        "sterilization": 0,
        "healthStatus": "很胖",
        "description": "爵士好猫",
        "specialNotes": "爱喝洗脚水",
        "characterTags": [
            '活泼', '友好', '粘人'
        ],
        "healthRecords": {
            vaccine: [
                { type: '狂犬病疫苗', date: '2023-03-10', nextReminder: '2024-03-10' },
                { type: '六联疫苗', date: '2023-01-15', nextReminder: '2024-01-15' }
            ],
            deworming: [
                { medicine: '体内驱虫片', date: '2023-05-20', nextReminder: '2023-08-20' }
            ],
            medical: [
                { hospital: '爱心宠物医院', diagnosis: '轻微皮炎', medicine: '皮肤药膏', date: '2022-11-05' }
            ],
        },
        "growthRecords": [
            {
                "age": "1个月",
                "photos": [
                    {
                        "description": "吃掉小球",
                        "date": "2023-05-20",
                        "src": getImageUrl('image1.jpg'),
                    },
                    {
                        "description": "吐出小球",
                        "date": "2023-05-21",
                        "src": getImageUrl('image2.jpg'),
                    },
                    {
                        "description": "吐出小球",
                        "date": "2023-05-21",
                        "src": getImageUrl('image3.jpg'),
                    },
                    {
                        "description": "吐出小球",
                        "date": "2023-05-21",
                        "src": getImageUrl('image4.jpg'),
                    },
                    {
                        "description": "吐出小球",
                        "date": "2023-05-21",
                        "src": getImageUrl('image5.jpg'),
                    },
                    {
                        "description": "吐出小球",
                        "date": "2023-05-21",
                        "src": getImageUrl('image6.jpg'),
                    },
                    {
                        "description": "吐出小球",
                        "date": "2023-05-21",
                        "src": getImageUrl('image7.jpg'),
                    }
                ]

            },
            {
                "age": "2个月",
                "photos": [
                    {
                        "description": "钻沙发",
                        "date": "2023-06-21",
                        "src": getImageUrl('image7.jpg'),

                    }
                ]

            }
        ]
    },
    {
        "id": 13,
        "userId": 5,
        "name": "球球",
        "type": "猫",
        "breed": "蓝白",
        "avatar": "https://picsum.photos/seed/ragdoll/200/200",
        "gender": 1,
        "birthday": "2012-03-23",
        "age": "13",
        "weight": 2,
        "sterilization": 0,
        "healthStatus": "很胖",
        "description": "",
        "specialNotes": "",
        "characterTags": [
            "繁忙",
            "可爱"
        ],
        "growthRecords": [
            {
                "age": "1个月",
                "photos": [
                    {
                        "description": "吃掉小球",
                        "date": "2023-05-20",
                        "src": "https://picsum.photos/200/300",
                    },
                    {
                        "description": "吐出小球",
                        "date": "2023-05-21",
                        "src": "https://picsum.photos/200/400",
                    }
                ]

            },
            {
                "age": "2个月",
                "photos": [
                    {
                        "description": "钻沙发",
                        "date": "2023-06-21",
                        "src": "https://picsum.photos/200/400",
                    }
                ]

            }
        ]
    },
])
//根据id寻找宠物对象
const getPetById = (id: number) => {
    return pets.find(pet => pet.id === id)
}
function changeGender(id: number) {
    const pet = getPetById(id)
    if (pet) {
        pet.gender = pet.gender === 1 ? 0 : 1

    } else {
        console.warn("没有找到该宠物")
    }
}
function changeSterilizationStatus(id: number) {
    const pet = getPetById(id)
    if (pet) {
        pet.sterilization = pet.sterilization === 1 ? 0 : 1

    } else {
        console.warn("没有找到该宠物")
    }
}
// 删除一个性格标签
const handleCloseTag = (id: number, tag: string) => {
    const pet = getPetById(id)
    const characterTags = ref(pet?.characterTags)
    characterTags.value?.splice(characterTags.value.indexOf(tag), 1)
}
// 显示添加性格输入框
const tagInputValue = ref('')//输入框绑定的值（新增标签里面的内容）
const tagInputVisible = ref<Record<number, boolean>>({});
const InputRef = ref<Record<number, InputInstance | null>>({});//获取 el-input 组件实例的 ref
const showAddTagInput = (id: number) => {
    tagInputVisible.value[id] = true
    //确保输入框渲染后再聚焦
    nextTick(() => {
        const currentInput = InputRef.value[id]
        const inputElement = currentInput?.$el?.querySelector<HTMLInputElement>('.el-input__inner');
        if (inputElement) {
            inputElement.focus();
        } else {
            console.error('未找到 .el-input__inner 元素');
        }
    })
}
//确认输入标签
const handleInputConfirm = (id: number) => {
    //过滤空值
    if (!tagInputValue.value.trim()) {
        tagInputVisible.value[id] = false
        tagInputValue.value = ''
        return;
    }
    const pet = getPetById(id)
    if (pet) {
        //防止undefined
        if (!pet.characterTags) pet.characterTags = []
        //避免添加重复的标签
        if (!pet.characterTags?.includes(tagInputValue.value)) {
            pet.characterTags.push(tagInputValue.value)
        }

    }
    tagInputVisible.value[id] = false
    tagInputValue.value = ''
}
//表格切换
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}
//成长记录


</script>
<style scoped>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.scrollbar-flex-content {
    display: flex;
    width: fit-content;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 150px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
}

.info-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.info-box-card {
    width: 15.6rem;
    border-radius: 12px;
    padding: 1.2rem;
    background-color: #f8f4f0;
}

.info-card-title {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    color: grey;
}

.info-card-value {
    font-size: 1.1rem;
    font-weight: bold;
    color: #5a5a5a;
}

.character-title {
    margin: 0.8rem 0;
    color: #5a5a5a;
    font-size: 1.1rem;
}
</style>