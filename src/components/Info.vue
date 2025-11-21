<template>
    <div class="pet-profile-container">
        <div class="pet-profile-screen " v-for="pet in pets" :key="pet.id">
            <div class="profile-left">
                <!-- 宠物基本信息 -->
                <section class="flex">
                    <!-- 头像部分 -->
                    <div>
                        <div>
                            <img :src="pet.avatar || defaultAvatar" alt="pet.name" class="rounded-full"></img>
                        </div>
                        <div>
                            <span @click="changeGender(pet.id)">{{ pet.gender === 1 ? '公' : '母' }}</span>
                            <el-switch v-model="pet.sterilization" class="ml-2" inline-prompt style="--el-switch-on-color: #13ce66; 
                        " active-text="已绝育" inactive-text="未绝育" />
                        </div>
                    </div>

                    <!-- 详情部分 -->
                    <div>
                        <div>{{ pet.name }}</div>
                        <div>
                            <el-space wrap>
                                <el-card class="box-card" style="width: 250px">
                                    <div>品种</div>
                                    <div>{{ pet.breed }}</div>
                                </el-card>
                                <el-card class="box-card" style="width: 250px">
                                    <div>生日</div>
                                    <div>{{ pet.birthday }}</div>
                                </el-card>
                                <el-card class="box-card" style="width: 250px">
                                    <div>体重</div>
                                    <div>{{ pet.weight }}</div>
                                </el-card>
                                <el-card class="box-card" style="width: 250px">
                                    <div>健康状态</div>
                                    <div>{{ pet.healthStatus }}</div>
                                </el-card>
                            </el-space>
                        </div>
                        <div>
                            <div>
                                <span>性格</span>

                            </div>
                            <el-tag v-for="tag in pet.characterTags" :key="tag" closable :disable-transitions="false"
                                @close="handleCloseTag(pet.id, tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input v-if="tagInputVisible" ref="InputRef" v-model="tagInputValue" class="w-20"
                                size="default" @keyup.enter="handleInputConfirm(pet.id)"
                                @blur="handleInputConfirm(pet.id)" />
                            <el-button v-else class="button-new-tag" size="default" @click="showAddTagInput">
                                点击添加
                            </el-button>
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
import type { InputInstance, TabsPaneContext } from 'element-plus'
enum PetGender {
    Male = 1,
    Female = 0,
}
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
    // 注意：路径是相对于当前文件的相对路径（假设当前组件在 src/components 下）
    return new URL(`../assets/${name}`, import.meta.url).href
}
const pets = reactive<Pet[]>([
    {
        "id": 12,
        "userId": 5,
        "name": "哈哈哈",
        "type": "猫",
        "breed": "英短",
        "avatar": "https://picsum.photos/seed/golden/200/200",
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
        "name": "哈哈哈",
        "type": "猫",
        "breed": "英短",
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
// 删除一个性格标签
const handleCloseTag = (id: number, tag: string) => {
    const pet = getPetById(id)
    const characterTags = ref(pet?.characterTags)
    characterTags.value?.splice(characterTags.value.indexOf(tag), 1)
}
// 显示添加性格输入框
const tagInputValue = ref('')//输入框绑定的值（新增标签里面的内容）
const tagInputVisible = ref(false)
const InputRef = ref<InputInstance>()//获取 el-input 组件实例的 ref
const showAddTagInput = () => {
    tagInputVisible.value = true
    //确保输入框渲染后再聚焦
    nextTick(() => {
        InputRef.value?.focus()
    })
}
//确认输入标签
const handleInputConfirm = (id: number) => {
    //过滤空值
    if (!tagInputValue.value.trim()) {
        tagInputVisible.value = false
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
    tagInputVisible.value = false
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
.pet-profile-container {
    width: 100%;
    height: 500px;
    /* background-color: red; */

}

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
</style>