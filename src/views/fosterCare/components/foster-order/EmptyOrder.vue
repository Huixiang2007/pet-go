<template>
    <div class="empty-order text-center py-12 bg-white rounded-xl shadow-sm">
        <el-icon class="text-gray-300 text-4xl mb-3">
            <DocumentEmpty />
        </el-icon>
        <p class="text-gray-500">
            {{ status === '' ? '暂无寄养订单' : `暂无${getStatusText(status)}订单` }}
        </p>
        <el-button type="primary" size="small" class="mt-4" @click="emit('go-foster-list')">
            去预约寄养
        </el-button>
    </div>
</template>

<script setup lang="ts">
// import { DocumentEmpty } from '@element-plus/icons-vue'

// Props
const props = defineProps<{
    status: string
}>()
console.log(props.status)
// Emits
const emit = defineEmits<{
    'go-foster-list': []
}>()

// 状态文本
const getStatusText = (status: string) => {
    switch (status) {
        case '0': return '待支付'
        case '1': return '已支付'
        case '2': return '已取消'
        case '3': return '已退款'
        default: return ''
    }
}
</script>

<style scoped lang="scss">
.empty-order {
    :deep(.el-button) {
        margin-top: 16px;
    }
}
</style>