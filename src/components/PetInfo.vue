<template>
    <div class="pet-profile-app min-h-screen bg-[#f9f5f0] text-[#5a5a5a] font-sans">
        <!-- 顶部导航 -->
        <el-header class="bg-[#ff9eaa] shadow-md py-4 px-6">
            <div class="flex justify-between items-center">
                <div class="text-white text-2xl font-bold text-shadow-md">宠物档案管理</div>

                <div class="flex items-center gap-4">
                    <el-select v-model="currentPetIndex" @change="handlePetChange" class="w-40" placeholder="选择宠物">
                        <el-option v-for="(pet, idx) in pets" :key="idx" :label="pet.nickname" :value="idx" />
                    </el-select>

                    <el-button type="success" icon="Plus" @click="addNewPet"
                        class="rounded-full bg-[#4cd964] hover:bg-[#37c850] text-white">
                        添加宠物
                    </el-button>
                </div>
            </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="p-6 bg-[#f9f5f0] min-h-[calc(100vh-130px)]">
            <div class="pet-profile-screen transition-all duration-500 ease-in-out" v-for="(pet, index) in pets"
                :key="index" :class="{
                    'opacity-100 translate-x-0 z-10': currentPetIndex === index,
                    'opacity-0 translate-x-full absolute top-0 left-0': currentPetIndex !== index
                }">
                <!-- 宠物基本信息卡片 -->
                <el-card class="mb-6 rounded-2xl shadow-md border-none bg-white overflow-hidden">
                    <div class="flex flex-wrap gap-6 p-6">
                        <!-- 头像部分 -->
                        <div class="flex flex-col items-center gap-4">
                            <div class="w-48 h-48 rounded-full border-4 border-[#fce0e6] overflow-hidden shadow-lg">
                                <img :src="pet.avatar || defaultAvatar" :alt="pet.nickname"
                                    class="w-full h-full object-cover">
                            </div>

                            <div class="flex gap-2">
                                <el-tag :type="pet.gender === 'male' ? 'info' : 'danger'"
                                    class="text-white font-bold px-4 py-1">
                                    {{ pet.gender === 'male' ? '♂ 公' : '♀ 母' }}
                                </el-tag>
                                <el-tag :type="pet.neutered ? 'success' : 'warning'" class="font-bold px-4 py-1">
                                    {{ pet.neutered ? '已绝育' : '未绝育' }}
                                </el-tag>
                            </div>
                        </div>

                        <!-- 详情部分 -->
                        <div class="flex-1 min-w-[300px]">
                            <h1 class="text-[#ff6b8b] text-3xl font-bold mb-6 text-shadow-sm">
                                {{ pet.nickname }}
                            </h1>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <el-card class="bg-[#f8f4f0] border-none">
                                    <div class="text-sm text-gray-500 mb-1">品种</div>
                                    <div class="font-bold">{{ pet.breed }}</div>
                                </el-card>
                                <el-card class="bg-[#f8f4f0] border-none">
                                    <div class="text-sm text-gray-500 mb-1">生日</div>
                                    <div class="font-bold">{{ formatDate(pet.birthday) }}</div>
                                </el-card>
                                <el-card class="bg-[#f8f4f0] border-none">
                                    <div class="text-sm text-gray-500 mb-1">体重</div>
                                    <div class="font-bold">{{ pet.weight }} kg</div>
                                </el-card>
                                <el-card class="bg-[#f8f4f0] border-none">
                                    <div class="text-sm text-gray-500 mb-1">健康状态</div>
                                    <div class="font-bold">{{ pet.healthStatus }}</div>
                                </el-card>
                            </div>

                            <div>
                                <div class="font-bold text-lg mb-3">性格标签</div>
                                <div class="flex flex-wrap gap-2">
                                    <el-tag v-for="tag in pet.personalityTags" :key="tag"
                                        class="bg-[#e3f2fd] text-[#2196f3] border-none font-bold px-4 py-1">
                                        {{ tag }}
                                    </el-tag>
                                    <el-button size="small" icon="Plus"
                                        class="bg-transparent text-[#2196f3] hover:bg-[#e3f2fd]"
                                        @click="addPersonalityTag(index)">
                                        添加标签
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>

                <!-- 健康记录部分 -->
                <el-card class="rounded-2xl shadow-md border-none bg-white">
                    <el-tabs v-model="activeRecordTab" class="w-full" tab-position="top">
                        <el-tab-pane label="💉 疫苗记录" name="vaccine" class="py-4">
                            <record-table :records="pets[currentPetIndex].healthRecords.vaccine"
                                :columns="vaccineColumns" @add-record="addRecord('vaccine')"
                                @edit-record="editRecord('vaccine', $event)" />
                        </el-tab-pane>

                        <el-tab-pane label="🧼 驱虫记录" name="deworming" class="py-4">
                            <record-table :records="pets[currentPetIndex].healthRecords.deworming"
                                :columns="dewormingColumns" @add-record="addRecord('deworming')"
                                @edit-record="editRecord('deworming', $event)" />
                        </el-tab-pane>

                        <el-tab-pane label="🏥 病历记录" name="medical" class="py-4">
                            <record-table :records="pets[currentPetIndex].healthRecords.medical"
                                :columns="medicalColumns" @add-record="addRecord('medical')"
                                @edit-record="editRecord('medical', $event)" />
                        </el-tab-pane>

                        <el-tab-pane label="🎂 成长记录" name="growth" class="py-4">
                            <record-table :records="pets[currentPetIndex].healthRecords.growth" :columns="growthColumns"
                                @add-record="addRecord('growth')" @edit-record="editRecord('growth', $event)" />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>
        </el-main>

        <!-- 底部导航 -->
        <el-footer class="bg-white shadow-inner py-3 px-6 flex justify-between items-center h-16">
            <el-button @click="navigatePet(-1)" :disabled="currentPetIndex === 0" icon="ArrowLeft"
                class="rounded-full bg-[#f0f7ff] text-[#0288d1] hover:bg-[#e1f5fe]">
                上一个宠物
            </el-button>

            <div class="font-bold text-gray-500">
                宠物 {{ currentPetIndex + 1 }} / {{ pets.length }}
            </div>

            <el-button @click="navigatePet(1)" :disabled="currentPetIndex === pets.length - 1" icon="ArrowRight"
                class="rounded-full bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9]">
                下一个宠物
            </el-button>
        </el-footer>

        <!-- 添加标签对话框 -->
        <el-dialog v-model="tagDialogVisible" title="添加性格标签" :width="300">
            <el-input v-model="newTagValue" placeholder="请输入标签内容" @keyup.enter="confirmAddTag" />
            <template #footer>
                <el-button @click="tagDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmAddTag">确认</el-button>
            </template>
        </el-dialog>

        <!-- 编辑记录对话框 -->
        <el-dialog v-model="recordDialogVisible" :title="`${isEditMode ? '编辑' : '添加'}${getRecordTypeName()}`"
            :width="500">
            <el-form :model="formData" :rules="formRules" ref="recordFormRef" label-width="100px">
                <el-form-item v-for="(field, key) in currentRecordFields" :key="key" :label="field.label" :prop="key">
                    <el-input v-model="formData[key]" :placeholder="`请输入${field.label}`" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="recordDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmRecord">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import type { ElForm } from 'element-plus';
import RecordTable from './RecordTable.vue'; // 引入记录表格组件

// 类型定义
interface HealthRecords {
    vaccine: Array<{
        type: string;
        date: string;
        nextReminder?: string;
    }>;
    deworming: Array<{
        medicine: string;
        date: string;
        nextReminder?: string;
    }>;
    medical: Array<{
        hospital: string;
        diagnosis: string;
        medicine: string;
        date?: string;
    }>;
    growth: Array<{
        event: string;
        date: string;
        notes?: string;
    }>;
}

interface Pet {
    nickname: string;
    breed: string;
    birthday: string;
    gender: 'male' | 'female';
    weight: number;
    avatar?: string;
    personalityTags: string[];
    neutered: boolean;
    healthStatus: string;
    healthRecords: HealthRecords;
}

// 表格列定义类型
interface TableColumn {
    prop: string;
    label: string;
}

// 初始数据
const defaultAvatar = 'https://picsum.photos/seed/pet1/200/200';

const pets = reactive<Pet[]>([
    {
        nickname: 'Lucky',
        breed: '金毛寻回犬',
        birthday: '2020-05-15',
        gender: 'male',
        weight: 32.5,
        avatar: 'https://picsum.photos/seed/golden/200/200',
        personalityTags: ['活泼', '友好', '粘人'],
        neutered: true,
        healthStatus: '健康',
        healthRecords: {
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
            growth: [
                { event: '3岁生日', date: '2023-05-15', notes: '体重32.5kg' },
                { event: '学会握手', date: '2021-02-10', notes: '训练3天后学会' }
            ]
        }
    },
    {
        nickname: 'Momo',
        breed: '布偶猫',
        birthday: '2021-08-22',
        gender: 'female',
        weight: 4.2,
        avatar: 'https://picsum.photos/seed/ragdoll/200/200',
        personalityTags: ['安静', '胆小', '优雅'],
        neutered: true,
        healthStatus: '健康',
        healthRecords: {
            vaccine: [
                { type: '猫三联', date: '2023-02-28', nextReminder: '2024-02-28' },
                { type: '狂犬病疫苗', date: '2023-03-15', nextReminder: '2024-03-15' }
            ],
            deworming: [
                { medicine: '体外驱虫滴剂', date: '2023-06-05', nextReminder: '2023-09-05' }
            ],
            medical: [],
            growth: [
                { event: '2岁生日', date: '2023-08-22', notes: '体重4.2kg' },
                { event: '第一次洗澡', date: '2021-10-10', notes: '有点害怕但很乖' }
            ]
        }
    }
]);

// 状态管理
const currentPetIndex = ref(0);
const activeRecordTab = ref<'vaccine' | 'deworming' | 'medical' | 'growth'>('vaccine');
const tagDialogVisible = ref(false);
const newTagValue = ref('');
const recordDialogVisible = ref(false);
const isEditMode = ref(false);
const currentEditIndex = ref(-1);
const currentEditType = ref<'vaccine' | 'deworming' | 'medical' | 'growth'>('vaccine');
const recordFormRef = ref<InstanceType<typeof ElForm>>();

// 表格列定义
const vaccineColumns: TableColumn[] = [
    { prop: 'type', label: '疫苗类型' },
    { prop: 'date', label: '接种时间' },
    { prop: 'nextReminder', label: '下次提醒' }
];

const dewormingColumns: TableColumn[] = [
    { prop: 'medicine', label: '药品' },
    { prop: 'date', label: '时间' },
    { prop: 'nextReminder', label: '下次提醒' }
];

const medicalColumns: TableColumn[] = [
    { prop: 'hospital', label: '医院' },
    { prop: 'diagnosis', label: '诊断' },
    { prop: 'medicine', label: '用药' }
];

const growthColumns: TableColumn[] = [
    { prop: 'event', label: '事件' },
    { prop: 'date', label: '日期' },
    { prop: 'notes', label: '备注' }
];

// 记录表单字段配置
const recordFields = {
    vaccine: {
        type: { label: '疫苗类型', required: true },
        date: { label: '接种时间', required: true },
        nextReminder: { label: '下次提醒', required: false }
    },
    deworming: {
        medicine: { label: '药品', required: true },
        date: { label: '时间', required: true },
        nextReminder: { label: '下次提醒', required: false }
    },
    medical: {
        hospital: { label: '医院', required: true },
        diagnosis: { label: '诊断', required: true },
        medicine: { label: '用药', required: true },
        date: { label: '日期', required: false }
    },
    growth: {
        event: { label: '事件', required: true },
        date: { label: '日期', required: true },
        notes: { label: '备注', required: false }
    }
};

// 表单数据和规则
const formData = ref<Record<string, string>>({});
const formRules = computed(() => {
    const rules: Record<string, any> = {};
    Object.entries(currentRecordFields.value).forEach(([key, field]) => {
        if (field.required) {
            rules[key] = [{ required: true, message: `请输入${field.label}`, trigger: 'blur' }];
        }
    });
    return rules;
});

const currentRecordFields = computed(() => {
    return recordFields[currentEditType.value];
});

// 方法
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const handlePetChange = () => {
    activeRecordTab.value = 'vaccine';
};

const navigatePet = (direction: number) => {
    const newIndex = currentPetIndex.value + direction;
    if (newIndex >= 0 && newIndex < pets.length) {
        currentPetIndex.value = newIndex;
        activeRecordTab.value = 'vaccine';
    }
};

const addNewPet = () => {
    const newPet: Pet = {
        nickname: '新宠物',
        breed: '未知',
        birthday: new Date().toISOString().split('T')[0]!,
        gender: 'male',
        weight: 0,
        personalityTags: [],
        neutered: false,
        healthStatus: '健康',
        healthRecords: {
            vaccine: [],
            deworming: [],
            medical: [],
            growth: []
        }
    };
    pets.push(newPet);
    currentPetIndex.value = pets.length - 1;
    activeRecordTab.value = 'vaccine';
};

const addPersonalityTag = (petIndex: number) => {
    newTagValue.value = '';
    tagDialogVisible.value = true;
};

const confirmAddTag = () => {
    if (!newTagValue.value.trim()) return;

    const pet = pets[currentPetIndex.value];
    if (pet) {
        if (!pet.personalityTags.includes(newTagValue.value)) {
            pet.personalityTags.push(newTagValue.value);
        }
        tagDialogVisible.value = false;
        newTagValue.value = '';
    }
};

const addRecord = (type: 'vaccine' | 'deworming' | 'medical' | 'growth') => {
    isEditMode.value = false;
    currentEditType.value = type;
    currentEditIndex.value = -1;
    recordDialogVisible.value = true;

    // 初始化表单数据
    formData.value = {};
    Object.keys(recordFields[type]).forEach(key => {
        formData.value[key] = key === 'date' ? new Date().toISOString().split('T')[0]! : '';
    });

    // 重置表单验证
    nextTick(() => {
        recordFormRef.value?.clearValidate();
    });
};

const editRecord = (type: 'vaccine' | 'deworming' | 'medical' | 'growth', index: number) => {
    isEditMode.value = true;
    currentEditType.value = type;
    currentEditIndex.value = index;
    recordDialogVisible.value = true;

    // 填充表单数据
    const record = pets[currentPetIndex.value].healthRecords[type][index];
    formData.value = { ...record };

    // 重置表单验证
    nextTick(() => {
        recordFormRef.value?.clearValidate();
    });
};

const confirmRecord = () => {
    recordFormRef.value?.validate(async (valid) => {
        if (valid) {
            const currentPet = pets[currentPetIndex.value];

            if (isEditMode.value && currentEditIndex.value !== -1) {
                // 编辑记录
                currentPet.healthRecords[currentEditType.value][currentEditIndex.value] = {
                    ...formData.value
                };
            } else {
                // 添加新记录
                currentPet.healthRecords[currentEditType.value].push({
                    ...formData.value
                });
            }

            recordDialogVisible.value = false;
            // 重置表单
            formData.value = {};
        }
    });
};

const getRecordTypeName = () => {
    const typeNames = {
        vaccine: '疫苗记录',
        deworming: '驱虫记录',
        medical: '病历记录',
        growth: '成长记录'
    };
    return typeNames[currentEditType.value];
};
</script>

<style scoped>
.text-shadow-md {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.text-shadow-sm {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.pet-profile-screen {
    width: 100%;
    min-height: 100%;
}
</style>