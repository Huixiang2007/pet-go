<template>
    <div class="order-filter mt-4 flex flex-wrap gap-3">
        <el-button v-for="item in statusOptions" :key="item.value"
            :type="activeStatus === item.value ? 'primary' : 'default'" @click="handleClick(item.value)" size="small">
            {{ item.label }}
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
const props = defineProps<{
    activeStatus: string
}>()

// Emits
const emit = defineEmits<{
    'status-change': [status: string]
}>()

// 筛选选项（内聚）
const statusOptions = ref([
    { label: '全部', value: '' },
    { label: '待支付', value: '0' },
    { label: '已支付', value: '1' },
    { label: '已取消', value: '2' },
    { label: '已退款', value: '3' }
])

// 点击筛选
const handleClick = (status: string) => {
    emit('status-change', status)
}
</script>

<style scoped lang="scss">
.order-filter {
    :deep(.el-button) {
        border-radius: 6px;
    }
}
</style>