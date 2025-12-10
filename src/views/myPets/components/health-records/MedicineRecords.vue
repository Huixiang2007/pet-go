<template>
    <HealthRecordsTable :records="records" :columns="columns" @add-record="openAddDialog" @edit-record="openEditDialog"
        @delete-record="deleteRecord" />
    <!-- 添加病历记录弹窗 -->
    <el-dialog v-model="showAddDialog" title="🏥 添加病历记录" width="450px" class="cute-dialog">
        <el-form :model="newMedicalRecord" class="cute-input">

            <el-form-item label="就诊医院" required>
                <el-input v-model="newMedicalRecord.hospital" placeholder="如：爱心宠物医院、瑞鹏宠物医院" />
            </el-form-item>
            <el-form-item label="诊断结果" required>
                <el-input v-model="newMedicalRecord.diagnosis" placeholder="如：轻微皮炎、肠胃炎" />
            </el-form-item>
            <el-form-item label="用药/治疗" required>
                <el-input v-model="newMedicalRecord.medicine" placeholder="如：皮肤药膏、消炎药" />
            </el-form-item>
            <el-form-item label="就诊时间" required>
                <el-date-picker v-model="newMedicalRecord.date" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择就诊日期" />
            </el-form-item>
            <el-form-item label="下次复诊提醒">
                <el-date-picker v-model="newMedicalRecord.nextReminderDate" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择下次复诊日期" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showAddDialog = false" class="cancel-btn">取消</el-button>
            <el-button type="primary" @click="confirmAdd" class="cute-btn">确认添加</el-button>
        </template>
    </el-dialog>
    <!-- 编辑病历记录弹窗 -->
    <el-dialog v-model="showEditDialog" title="✏️ 编辑病历记录" width="450px" class="cute-dialog">
        <el-form :model="editMedicalRecord" class="cute-input">
            <el-form-item label="就诊医院" required>
                <el-input v-model="editMedicalRecord.hospital" placeholder="如：爱心宠物医院、瑞鹏宠物医院" />
            </el-form-item>
            <el-form-item label="诊断结果" required>
                <el-input v-model="editMedicalRecord.diagnosis" placeholder="如：轻微皮炎、肠胃炎" />
            </el-form-item>
            <el-form-item label="用药/治疗" required>
                <el-input v-model="editMedicalRecord.medicine" placeholder="如：皮肤药膏、消炎药" />
            </el-form-item>
            <el-form-item label="就诊时间" required>
                <el-date-picker v-model="editMedicalRecord.date" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择就诊日期" />
            </el-form-item>
            <el-form-item label="下次复诊提醒">
                <el-date-picker v-model="editMedicalRecord.nextReminderDate" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择下次复诊日期" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showEditDialog = false" class="cancel-btn">取消</el-button>
            <el-button type="primary" @click="confirmEdit" class="cute-btn">确认修改</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import HealthRecordsTable from './HealthRecordsTable.vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 日期类型定义（和疫苗组件一致）
type DateString = `${number}-${number}-${number}`

// 病历记录接口（修正字段，匹配表单）
interface Medical {
    id?: number
    recordType?: '病历'
    hospital: string
    diagnosis: string
    medicine: string
    date: DateString
    nextReminderDate?: DateString
}

// 表格列接口
interface TableColumn {
    prop: string
    label: string
}

const props = defineProps<{
    records?: Medical[]
    columns: TableColumn[]
}>()

// 定义事件
const emit = defineEmits<{
    'add-records': [record: Medical];
    'update-records': [record: Medical];
    'delete-records': [id: number];
}>();

// 弹窗显隐控制
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentEditIndex = ref(-1)

// 添加病历记录的响应式数据
const newMedicalRecord = ref<Medical>({
    recordType: '病历',
    hospital: '',
    diagnosis: '',
    medicine: '',
    date: '' as DateString,
    nextReminderDate: '' as DateString
})

// 编辑病历记录的响应式数据
const editMedicalRecord = ref<Medical>({
    id: 0,
    recordType: '病历',
    hospital: '',
    diagnosis: '',
    medicine: '',
    date: '' as DateString,
    nextReminderDate: '' as DateString
})

// 打开添加弹窗
const openAddDialog = () => {
    newMedicalRecord.value = {
        recordType: '病历',
        hospital: '',
        diagnosis: '',
        medicine: '',
        date: '' as DateString,
        nextReminderDate: '' as DateString
    }
    showAddDialog.value = true
}

// 打开编辑弹窗
const openEditDialog = (index: number) => {

    if (!props.records || index < 0 || index >= props.records.length) {
        ElMessage.warning('编辑的病历记录不存在！')
        return
    }
    currentEditIndex.value = index

    editMedicalRecord.value = {
        recordType: '病历',
        ...props.records[index]
    }
    showEditDialog.value = true
}

// 确认添加
const confirmAdd = () => {

    if (
        !newMedicalRecord.value.hospital.trim() ||
        !newMedicalRecord.value.diagnosis.trim() ||
        !newMedicalRecord.value.medicine.trim() ||
        !newMedicalRecord.value.date
    ) {
        ElMessage.warning('请填写医院、诊断结果、用药/治疗和就诊时间！')
        return
    }

    // 触发新增事件
    emit('add-records', newMedicalRecord.value)
    ElMessage.success('病历记录添加成功！')
    showAddDialog.value = false
}

// 确认编辑
const confirmEdit = () => {
    if (
        !editMedicalRecord.value.hospital.trim() ||
        !editMedicalRecord.value.diagnosis.trim() ||
        !editMedicalRecord.value.medicine.trim() ||
        !editMedicalRecord.value.date
    ) {
        ElMessage.warning('请填写医院、诊断结果、用药/治疗和就诊时间！')
        return
    }

    emit('update-records', editMedicalRecord.value)
    ElMessage.success('病历记录修改成功！')
    showEditDialog.value = false
}

// 删除记录
const deleteRecord = (id: number) => {
    ElMessageBox.confirm(
        '确定要删除这条病历记录吗？',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        emit('delete-records', id)

    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}
</script>

<style lang="scss" scoped>
.cute-dialog {
    :deep(.el-dialog) {
        border-radius: 20px;
        border: 2px solid #81c784;
    }

    :deep(.el-dialog__header) {
        background: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
        border-radius: 20px 20px 0 0;
        margin: 0;
        padding: 15px 20px;
    }

    :deep(.el-dialog__title) {
        color: white;
        font-weight: bold;
    }

    :deep(.el-form-item__label) {
        color: #4caf50;
        font-weight: 600;
    }

    :deep(.cancel-btn) {
        background: #e0e0e0;
        color: #666;
        border: none;
    }

    :deep(.cute-btn) {
        background: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
        border: none;
        color: white;
    }
}
</style>