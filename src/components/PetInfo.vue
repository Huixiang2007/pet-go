<template>
    <div class="pet-profile-app">


        <!-- 宠物档案主内容区 -->
        <main class="pet-profile-container">
            <div class="pet-profile-screen" v-for="(pet, index) in pets" :key="index"
                :class="{ active: currentPetIndex === index }">
                <!-- 宠物基本信息卡片 -->
                <section class="pet-basic-info">
                    <div class="pet-avatar-container">
                        <div class="avatar-frame">
                            <img :src="pet.avatar || defaultAvatar" :alt="pet.nickname" class="pet-avatar">
                        </div>
                        <div class="pet-badges">
                            <span class="badge" :class="pet.gender === 'male' ? 'male' : 'female'">
                                {{ pet.gender === 'male' ? '♂ 公' : '♀ 母' }}
                            </span>
                            <span class="badge neutered" :class="pet.neutered ? 'yes' : 'no'">
                                {{ pet.neutered ? '已绝育' : '未绝育' }}
                            </span>
                        </div>
                    </div>

                    <div class="pet-details">
                        <h1 class="pet-name">{{ pet.nickname }}</h1>
                        <div class="pet-main-info">
                            <div class="info-item">
                                <span class="label">品种</span>
                                <span class="value">{{ pet.breed }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">生日</span>
                                <span class="value">{{ formatDate(pet.birthday) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">体重</span>
                                <span class="value">{{ pet.weight }} kg</span>
                            </div>
                            <div class="info-item">
                                <span class="label">健康状态</span>
                                <span class="value">{{ pet.healthStatus }}</span>
                            </div>
                        </div>

                        <div class="pet-personality">
                            <span class="section-title">性格标签</span>
                            <div class="personality-tags">
                                <span class="tag" v-for="tag in pet.personalityTags" :key="tag">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 健康记录部分 -->
                <section class="health-records">
                    <div class="records-tabs">
                        <button class="tab-btn" :class="{ active: activeRecordTab === 'vaccine' }"
                            @click="activeRecordTab = 'vaccine'">
                            💉 疫苗记录
                        </button>
                        <button class="tab-btn" :class="{ active: activeRecordTab === 'deworming' }"
                            @click="activeRecordTab = 'deworming'">
                            🧼 驱虫记录
                        </button>
                        <button class="tab-btn" :class="{ active: activeRecordTab === 'medical' }"
                            @click="activeRecordTab = 'medical'">
                            🏥 病历记录
                        </button>
                        <!-- <button class="tab-btn" :class="{ active: activeRecordTab === 'growth' }"
                            @click="activeRecordTab = 'growth'">
                            🎂 成长记录
                        </button> -->
                    </div>

                    <div class="records-content">
                        <!-- 疫苗记录 -->
                        <div v-if="activeRecordTab === 'vaccine'" class="record-list">
                            <div class="record-item header">
                                <div class="record-field">疫苗类型</div>
                                <div class="record-field">接种时间</div>
                                <div class="record-field">下次提醒</div>
                                <div class="record-field">操作</div>
                            </div>
                            <div class="record-item" v-for="(record, idx) in pet.healthRecords.vaccine" :key="idx">
                                <div class="record-field">{{ record.type }}</div>
                                <div class="record-field">{{ formatDate(record.date) }}</div>
                                <div class="record-field">
                                    {{ record.nextReminder ? formatDate(record.nextReminder) : '无' }}
                                </div>
                                <div class="record-field">
                                    <button class="edit-btn">✏️</button>
                                </div>
                            </div>
                            <button class="add-record-btn" @click="addRecord('vaccine')">
                                + 添加疫苗记录
                            </button>
                        </div>

                        <!-- 驱虫记录 -->
                        <div v-if="activeRecordTab === 'deworming'" class="record-list">
                            <div class="record-item header">
                                <div class="record-field">药品</div>
                                <div class="record-field">时间</div>
                                <div class="record-field">下次提醒</div>
                                <div class="record-field">操作</div>
                            </div>
                            <div class="record-item" v-for="(record, idx) in pet.healthRecords.deworming" :key="idx">
                                <div class="record-field">{{ record.medicine }}</div>
                                <div class="record-field">{{ formatDate(record.date) }}</div>
                                <div class="record-field">
                                    {{ record.nextReminder ? formatDate(record.nextReminder) : '无' }}
                                </div>
                                <div class="record-field">
                                    <button class="edit-btn">✏️</button>
                                </div>
                            </div>
                            <button class="add-record-btn" @click="addRecord('deworming')">
                                + 添加驱虫记录
                            </button>
                        </div>

                        <!-- 病历记录 -->
                        <div v-if="activeRecordTab === 'medical'" class="record-list">
                            <div class="record-item header">
                                <div class="record-field">医院</div>
                                <div class="record-field">诊断</div>
                                <div class="record-field">用药</div>
                                <div class="record-field">操作</div>
                            </div>
                            <div class="record-item" v-for="(record, idx) in pet.healthRecords.medical" :key="idx">
                                <div class="record-field">{{ record.hospital }}</div>
                                <div class="record-field">{{ record.diagnosis }}</div>
                                <div class="record-field">{{ record.medicine }}</div>
                                <div class="record-field">
                                    <button class="edit-btn">✏️</button>
                                </div>
                            </div>
                            <button class="add-record-btn" @click="addRecord('medical')">
                                + 添加病历记录
                            </button>
                        </div>

                        <!-- 成长记录 -->
                        <div v-if="activeRecordTab === 'growth'" class="record-list">
                            <div class="record-item header">
                                <div class="record-field">事件</div>
                                <div class="record-field">日期</div>
                                <div class="record-field">备注</div>
                                <div class="record-field">操作</div>
                            </div>
                            <div class="record-item" v-for="(record, idx) in pet.healthRecords.growth" :key="idx">
                                <div class="record-field">{{ record.event }}</div>
                                <div class="record-field">{{ formatDate(record.date) }}</div>
                                <div class="record-field">{{ record.notes }}</div>
                                <div class="record-field">
                                    <button class="edit-btn">✏️</button>
                                </div>
                            </div>
                            <button class="add-record-btn" @click="addRecord('growth')">
                                + 添加成长记录
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>

        <!-- 底部导航 -->
        <!-- <footer class="app-footer">
            <div class="nav-buttons">
                <button class="nav-btn prev" @click="navigatePet(-1)" :disabled="currentPetIndex === 0">
                    ← 上一个宠物
                </button>
                <button class="nav-btn next" @click="navigatePet(1)" :disabled="currentPetIndex === pets.length - 1">
                    下一个宠物 →
                </button>
            </div>
            <div class="pet-count">
                宠物 {{ currentPetIndex + 1 }} / {{ pets.length }}
            </div>
        </footer> -->
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

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

// 初始数据
const defaultAvatar = 'https://picsum.photos/seed/pet1/200/200';

const pets = reactive<Pet[]>([
    {
        nickname: ' Lucky',
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

// 方法
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const handlePetChange = () => {
    // 切换宠物时重置记录标签
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

const addRecord = (type: 'vaccine' | 'deworming' | 'medical' | 'growth') => {
    const currentPet = pets[currentPetIndex.value];
    if (!currentPet) {
        console.error('当前宠物不存在');
        return;
    }
    const today = new Date().toISOString().split('T')[0];

    switch (type) {
        case 'vaccine':
            currentPet.healthRecords.vaccine.push({
                type: '新疫苗',
                date: today!
            });
            break;
        case 'deworming':
            currentPet.healthRecords.deworming.push({
                medicine: '新药品',
                date: today!
            });
            break;
        case 'medical':
            currentPet.healthRecords.medical.push({
                hospital: '未知医院',
                diagnosis: '无',
                medicine: '无',
                date: today
            });
            break;
        case 'growth':
            currentPet.healthRecords.growth.push({
                event: '新事件',
                date: today!
            });
            break;
    }
};
</script>

<style scoped>
/* 全局样式 */
.pet-profile-app {
    font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', sans-serif;
    color: #5a5a5a;
    background-color: #f9f5f0;
    min-height: 100vh;
    overflow-x: hidden;
}

/* 顶部导航 */
.app-header {
    background-color: #ff9eaa;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.pet-selector {
    display: flex;
    gap: 1rem;
    align-items: center;
}

select {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: none;
    background-color: white;
    font-size: 1rem;
    color: #5a5a5a;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.add-pet-btn {
    background-color: #4cd964;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.add-pet-btn:hover {
    background-color: #37c850;
    transform: translateY(-2px);
}

/* 主内容区 */
.pet-profile-container {
    height: calc(100vh - 130px);
    position: relative;
    overflow: hidden;
}

.pet-profile-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    overflow-y: auto;
    transition: transform 0.5s ease;
    transform: translateX(100%);
    opacity: 0;
}

.pet-profile-screen.active {
    transform: translateX(0);
    opacity: 1;
    z-index: 1;
}

/* 宠物基本信息 */
.pet-basic-info {
    display: flex;
    gap: 2rem;
    background-color: white;
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    flex-wrap: wrap;
}

.pet-avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.avatar-frame {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 8px solid #fce0e6;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.pet-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pet-badges {
    display: flex;
    gap: 0.5rem;
}

.badge {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
    color: white;
}

.badge.male {
    background-color: #64b5f6;
}

.badge.female {
    background-color: #ff80ab;
}

.badge.neutered.yes {
    background-color: #4cd964;
}

.badge.neutered.no {
    background-color: #ff9500;
}

.pet-details {
    flex: 1;
    min-width: 300px;
}

.pet-name {
    color: #ff6b8b;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.pet-main-info {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.info-item {
    background-color: #f8f4f0;
    padding: 0.8rem;
    border-radius: 12px;
}

.label {
    display: block;
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 0.3rem;
}

.value {
    font-size: 1.1rem;
    font-weight: bold;
    color: #5a5a5a;
}

.pet-personality {
    margin-top: 1rem;
}

.section-title {
    font-weight: bold;
    margin-bottom: 0.8rem;
    display: block;
    color: #5a5a5a;
    font-size: 1.1rem;
}

.personality-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.tag {
    background-color: #e3f2fd;
    color: #2196f3;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

/* 健康记录 */
.health-records {
    background-color: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.records-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
}

.tab-btn {
    background-color: #f0f0f0;
    border: none;
    border-radius: 20px;
    padding: 0.8rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.tab-btn.active {
    background-color: #b3e5fc;
    color: #0288d1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.record-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.record-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    align-items: center;
}

.record-item.header {
    background-color: #f0f7ff;
    font-weight: bold;
    color: #0277bd;
}

.record-item:not(.header) {
    background-color: #fafafa;
    border: 1px solid #f0f0f0;
}

.record-field {
    word-break: break-word;
}

.edit-btn {
    background: none;
    border: none;
    color: #ff9500;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s ease;
}

.edit-btn:hover {
    transform: scale(1.2);
}

.add-record-btn {
    margin-top: 1rem;
    background-color: #b2ebf2;
    color: #00897b;
    border: none;
    border-radius: 20px;
    padding: 0.8rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
}

.add-record-btn:hover {
    background-color: #80deea;
    transform: translateY(-2px);
}

/* 底部导航 */
.app-footer {
    background-color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    height: 60px;
}

.nav-buttons {
    display: flex;
    gap: 1rem;
}

.nav-btn {
    padding: 0.5rem 1.2rem;
    border-radius: 20px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nav-btn.prev {
    background-color: #f0f7ff;
    color: #0288d1;
}

.nav-btn.next {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.nav-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pet-count {
    font-weight: bold;
    color: #888;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .pet-basic-info {
        flex-direction: column;
        align-items: center;
    }

    .record-item {
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    .record-item.header .record-field:nth-child(n+3),
    .record-item:not(.header) .record-field:nth-child(n+3) {
        grid-column: span 2;
    }

    .pet-name {
        text-align: center;
    }
}
</style>