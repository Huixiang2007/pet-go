<template>
    <div class="w-full">
        <el-table :data="records" border class="mb-4" :header-cell-style="{
            'background-color': '#f0f7ff',
            color: '#0277bd',
            'font-weight': 'bold',
        }">
            <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label"
                align="center">
                <template #default="scope">
                    {{ scope.row[column.prop] || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button size="small" icon="Edit" type="primary" @click="$emit('edit-record', scope.$index)" />
                </template>
            </el-table-column>
        </el-table>

        <el-button type="success" icon="Plus" @click="$emit('add-record')" class="mt-2">
            添加记录
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
        date: string,
        nextReminder: string
    }>
}
interface TableColumn {
    prop: string
    label: string
}
//子组件通过definProps接受父组件传递的两个属性:records和columns
const props = defineProps<{
    records?: HealthRecords[]
    columns: TableColumn[]
}>()

// const emit = defineEmits<{
//     'add-record': [];
//     'edit-record': [index: number];
// }>();
console.log('records', props.records)
console.log('columns', props.columns)
const formattedRecords = computed(() => {
    return props.records?.map((record) => {
        console.log(record)
        if (typeof record === 'object' && record !== null && !Array.isArray(record)) {
            const formatted: Record<string, string> = {}
            Object.entries(record).forEach(([key, value]) => {
                // 格式化日期
                if ((key.includes('date') || key.includes('Reminder')) && value) {
                    try {
                        const date = new Date(value as string)
                        if (!isNaN(date.getTime())) {
                            formatted[key] = date.toLocaleDateString('zh-CN')
                        } else {
                            formatted[key] = value as string
                        }
                    } catch {
                        formatted[key] = value as string
                    }
                } else {
                    formatted[key] = (value as string) || '-'
                }
            })
            return formatted
        }

    })
})
console.log(formattedRecords.value)
</script>
