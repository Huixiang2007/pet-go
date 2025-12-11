<template>
    <HealthRecordsTable :records="records" :columns="columns" @add-record="openAddDialog" @edit-record="openEditDialog"
        @delete-record="deleteRecord" />

    <!-- 添加驱虫记录弹窗 -->
    <el-dialog v-model="showAddDialog" title="🪱 添加驱虫记录" width="450px" class="cute-dialog">
        <el-form :model="newDewormingRecord" class="cute-input">
            <el-form-item label="驱虫药品" required>
                <el-input v-model="newDewormingRecord.medicine" placeholder="如：体内驱虫片、体外驱虫滴剂" />
            </el-form-item>
            <el-form-item label="驱虫时间" required>
                <el-date-picker v-model="newDewormingRecord.date" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择驱虫日期" />
            </el-form-item>
            <el-form-item label="下次提醒">
                <el-date-picker v-model="newDewormingRecord.nextReminderDate" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择下次驱虫提醒日期" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showAddDialog = false" class="cancel-btn">取消</el-button>
            <el-button type="primary" @click="confirmAdd" class="cute-btn">确认添加</el-button>
        </template>
    </el-dialog>

    <!-- 编辑驱虫记录弹窗 -->
    <el-dialog v-model="showEditDialog" title="✏️ 编辑驱虫记录" width="450px" class="cute-dialog">
        <el-form :model="editDewormingRecord" class="cute-input">
            <el-form-item label="驱虫药品" required>
                <el-input v-model="editDewormingRecord.medicine" placeholder="如：体内驱虫片、体外驱虫滴剂" />
            </el-form-item>
            <el-form-item label="驱虫时间" required>
                <el-date-picker v-model="editDewormingRecord.date" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择驱虫日期" />
            </el-form-item>
            <el-form-item label="下次提醒">
                <el-date-picker v-model="editDewormingRecord.nextReminderDate" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择下次驱虫提醒日期" />
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

// 日期类型定义
type DateString = `${number}-${number}-${number}`

// 驱虫记录接口
interface Deworming {
    id?: number
    recordType?: '驱虫'
    medicine: string
    date: DateString
    nextReminderDate?: DateString
}

interface TableColumn {
    prop: string
    label: string
}

// 接收父组件传递的属性
const props = defineProps<{
    records?: Deworming[]
    columns: TableColumn[]
}>()

// 定义事件（和疫苗/病历组件统一事件名）
const emit = defineEmits<{
    'add-records': [record: Deworming];
    'update-records': [record: Deworming];
    'delete-records': [id: number];
}>();

// 弹窗显隐控制
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentEditIndex = ref(-1)

// 添加驱虫记录的响应式数据
const newDewormingRecord = ref<Deworming>({
    recordType: '驱虫',
    medicine: '',
    date: '' as DateString,
    nextReminderDate: '' as DateString
})

// 编辑驱虫记录的响应式数据
const editDewormingRecord = ref<Deworming>({
    id: 0,
    recordType: '驱虫',
    medicine: '',
    date: '' as DateString,
    nextReminderDate: '' as DateString
})

// 打开添加弹窗
const openAddDialog = () => {
    newDewormingRecord.value = {
        recordType: '驱虫',
        medicine: '',
        date: '' as DateString,
        nextReminderDate: '' as DateString
    }
    showAddDialog.value = true
}

// 打开编辑弹窗
const openEditDialog = (index: number) => {

    if (!props.records || index < 0 || index >= props.records.length) {
        ElMessage.warning('编辑的驱虫记录不存在！')
        return
    }
    currentEditIndex.value = index

    editDewormingRecord.value = {
        recordType: '驱虫',
        ...props.records[index]
    }
    showEditDialog.value = true
}

// 确认添加（字段校验）
const confirmAdd = () => {
    if (!newDewormingRecord.value.medicine.trim() || !newDewormingRecord.value.date) {
        ElMessage.warning('请填写驱虫药品和驱虫时间！')
        return
    }

    // 触发新增事件
    emit('add-records', newDewormingRecord.value)
    ElMessage.success('驱虫记录添加成功！')
    showAddDialog.value = false
}

// 确认编辑
const confirmEdit = () => {
    if (!editDewormingRecord.value.medicine.trim() || !editDewormingRecord.value.date) {
        ElMessage.warning('请填写驱虫药品和驱虫时间！')
        return
    }

    // 触发更新事件
    emit('update-records', editDewormingRecord.value)
    ElMessage.success('驱虫记录修改成功！')
    showEditDialog.value = false
}

// 删除记录
const deleteRecord = (id: number) => {
    ElMessageBox.confirm(
        '确定要删除这条驱虫记录吗？',
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
        border: 2px solid #90caf9;
    }

    :deep(.el-dialog__header) {
        background: linear-gradient(135deg, #90caf9 0%, #2196f3 100%);
        border-radius: 20px 20px 0 0;
        margin: 0;
        padding: 15px 20px;
    }

    :deep(.el-dialog__title) {
        color: white;
        font-weight: bold;
    }

    :deep(.el-form-item__label) {
        color: #2196f3;
        font-weight: 600;
    }

    :deep(.cancel-btn) {
        background: #e0e0e0;
        color: #666;
        border: none;
    }

    :deep(.cute-btn) {
        background: linear-gradient(135deg, #90caf9 0%, #2196f3 100%);
        border: none;
        color: white;
    }
}
</style>