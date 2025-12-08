<template>
    <HealthRecordsTable :records="records" :columns="columns" @add-record="openAddDialog"
        @edit-record="openEditDialog" />
    <el-dialog v-model="showAddDialog" title="💉 添加疫苗记录" width="450px" class="cute-dialog">
        <el-form :model="newVaccineRecord" label-width="80px" class="cute-input">
            <el-form-item label="疫苗类型" required>
                <el-input v-model="newVaccineRecord.vaccineType" placeholder="如：狂犬病疫苗、六联疫苗" />
            </el-form-item>
            <el-form-item label="接种时间" required>
                <el-date-picker v-model="newVaccineRecord.date" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择接种日期" />
            </el-form-item>
            <el-form-item label="下次提醒">
                <el-date-picker v-model="newVaccineRecord.nextReminderDate" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择下次提醒日期" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showAddDialog = false" class="cancel-btn">取消</el-button>
            <el-button type="primary" @click="confirmAdd" class="cute-btn">确认添加</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="✏️ 编辑疫苗记录" width="450px" class="cute-dialog">
        <el-form :model="editVaccineRecord" label-width="80px" class="cute-input">
            <el-form-item label="疫苗类型" required>
                <el-input v-model="editVaccineRecord.vaccineType" placeholder="如：狂犬病疫苗、六联疫苗" />
            </el-form-item>
            <el-form-item label="接种时间" required>
                <el-date-picker v-model="editVaccineRecord.date" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择接种日期" />
            </el-form-item>
            <el-form-item label="下次提醒">
                <el-date-picker v-model="editVaccineRecord.nextReminderDate" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" placeholder="选择下次提醒日期" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showEditDialog = false" class="cancel-btn">取消</el-button>
            <el-button type="primary" @click="confirmEdit" class="cute-btn">确认修改</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import HealthRecordsTable from './HealthRecordsTable.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
type DateString = `${number}-${number}-${number}`
interface Vaccine {
    id?: number
    vaccineType: string
    date: DateString
    nextReminderDate?: DateString
}
interface TableColumn {
    prop: string
    label: string
}
//子组件通过definProps接受父组件传递的两个属性:records和columns
const props = defineProps<{
    records?: Vaccine[]
    columns: TableColumn[]
}>()

const emit = defineEmits<{
    'add-records': [record: Vaccine];
    'update-records': [records: Vaccine];
}>();
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentEditIndex = ref(-1)
//添加疫苗记录
const newVaccineRecord = ref<Vaccine>({
    vaccineType: '',
    date: '' as DateString,
    nextReminderDate: '' as DateString

})
//编辑疫苗记录
const editVaccineRecord = ref<Vaccine>({
    id: 0,
    vaccineType: '',
    date: '' as DateString,
    nextReminderDate: '' as DateString
})
//打开添加弹窗
const openAddDialog = () => {
    //重置
    newVaccineRecord.value = {
        vaccineType: '',
        date: '' as DateString,
        nextReminderDate: '' as DateString
    }
    showAddDialog.value = true
}
//打开编辑弹窗
const openEditDialog = (index: number) => {
    // 拷贝数据
    currentEditIndex.value = index
    editVaccineRecord.value = props.records[index]
    showEditDialog.value = true
}
//确认添加
const confirmAdd = () => {
    if (!newVaccineRecord.value.vaccineType || !newVaccineRecord.value.date) {
        ElMessage.warning('请填写必填项！')
        return
    }

    emit('add-records', newVaccineRecord.value)
    ElMessage.success('疫苗记录添加成功！')
    showAddDialog.value = false

}
//确认编辑
const confirmEdit = () => {
    if (!editVaccineRecord.value.vaccineType || !editVaccineRecord.value.date) {
        ElMessage.warning('请填写必填项！')
        return
    }

    const newRecords = editVaccineRecord.value
    console.log('newRecords', newRecords)
    emit('update-records', newRecords) // 通知父组件更新
    showEditDialog.value = false
}
console.log(props, emit)
</script>
<style lang="scss" scoped>
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

    :deep(.el-form-item__label) {
        color: #ff69b4;
        font-weight: 600;
    }
}
</style>