<template>
    <div class="health-records">
        <el-tabs v-model="activeHealthTab" type="border-card">
            <el-tab-pane label="💉 疫苗记录" name="vaccine">
                <!-- 向子组件传递数据records和列配置columes -->
                <RecordTable :records="pet.healthRecords?.vaccine" :columns="vaccineColumns"
                    @add-record="addRecord('vaccine')" @edit-record="editRecord()" />
            </el-tab-pane>

            <el-tab-pane label="🧼 驱虫记录" name="deworming">
                <RecordTable :records="pet.healthRecords?.deworming" :columns="dewormingColumns"
                    @add-record="addRecord('deworming')" @edit-record="editRecord()" />
            </el-tab-pane>

            <el-tab-pane label="🏥 病历记录" name="medical">
                <RecordTable :records="pet.healthRecords?.medical" :columns="medicalColumns"
                    @add-record="addRecord('medical')" @edit-record="editRecord()" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import RecordTable from './RecordTable.vue';
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
        date: string
    }>
}
interface Photos {
    src: string,
    description: string,
    date: DateString
}
interface GrowthRecords {
    age: string,
    photos: Array<Photos>
};
//定义Growth为GrowthRecord类型的数组
type Growth = GrowthRecords[]

interface Pet {
    id: number,
    userId: number,
    name: string,
    type: string,
    breed: string,
    avatar: string,
    gender: PetGender,
    birthday: DateString,
    age: string,
    weight: number,
    sterilization?: SterilizationStatus,
    healthStatus?: string,
    description?: string,
    specialNotes?: string,
    characterTags?: string[],
    healthRecords?: HealthRecords,
    growthRecords?: Growth
}
// 接收父组件传递过来的pet
const props = defineProps<{
    pet: Pet;
}>();
console.log(props.pet);
const activeHealthTab = ref('vaccine');

// 表格列定义
const vaccineColumns = [
    { prop: 'type', label: '疫苗类型' },
    { prop: 'date', label: '接种时间' },
    { prop: 'nextReminder', label: '下次提醒' }
];

const dewormingColumns = [
    { prop: 'medicine', label: '药品' },
    { prop: 'date', label: '时间' },
    { prop: 'nextReminder', label: '下次提醒' }
];

const medicalColumns = [
    { prop: 'hospital', label: '医院' },
    { prop: 'diagnosis', label: '诊断' },
    { prop: 'medicine', label: '用药' },
    { prop: 'date', label: '日期' }
];

// 添加记录
const addRecord = (type: string) => {
    ElMessage.info(`添加${type}记录功能开发中...`);
};

// 编辑记录
const editRecord = () => {

};
</script>