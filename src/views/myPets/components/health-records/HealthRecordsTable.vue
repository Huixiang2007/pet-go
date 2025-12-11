<template>
    <div class="w-full">
        <el-table :data="records" border class="mb-4" :header-cell-style="{
            'background-color': '#f0f7ff',
            'color': '#0277bd',
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
                    <el-button size="small" icon="Edit" type="primary" @click="handleEdit(scope.$index)" />
                    <el-button size="small" icon="Delete" type="danger" @click="handleDelete(scope.row.id)" />
                </template>
            </el-table-column>
        </el-table>

        <el-button type="success" icon="Plus" @click="handleAdd" class="mt-2">
            添加记录
        </el-button>
    </div>
</template>
<script setup lang="ts">
interface TableColumn {
    prop: string
    label: string
}

// 接收父组件传递的差异化配置
const props = defineProps<{
    records: Record<string, any>[]
    columns: TableColumn[]
}>()
console.log(props.records)
// 定义通用事件
const emit = defineEmits<{
    'add-record': [];
    'edit-record': [index: number];
    'delete-record': [id: number];
}>();

// 通用添加/编辑逻辑（仅转发事件）
const handleAdd = () => {
    emit('add-record')
}
const handleEdit = (index: number) => {
    emit('edit-record', index)
}
const handleDelete = (id: number) => {
    emit('delete-record', id)
}
</script>
