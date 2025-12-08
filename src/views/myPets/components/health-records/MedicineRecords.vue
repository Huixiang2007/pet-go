<template>
    <HealthRecordsTable :records="records" :columns="columns" @add-record="$emit('add-record')"
        @edit-record="$emit('edit-record', $event)" />
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import HealthRecordsTable from './HealthRecordsTable.vue'

interface Medical {
    hospital: string
    diagnosis: string //诊断
    medicine: string
    date: string,
    nextReminder?: string
}
interface TableColumn {
    prop: string
    label: string
}
//子组件通过definProps接受父组件传递的两个属性:records和columns
const props = defineProps<{
    records?: Medical[]
    columns: TableColumn[]
}>()

const emit = defineEmits<{
    'add-record': [];
    'edit-record': [index: number];
}>();
console.log(props, emit)


</script>
