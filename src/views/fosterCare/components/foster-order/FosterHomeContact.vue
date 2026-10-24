<template>
    <el-dialog v-model="visible" title="联系寄养家庭" width="350px">
        <div v-if="fosterHome" class="contact-info">
            <div class="flex items-center justify-center mb-6">
                <img :src="fosterHome.avatar || defaultAvatar" alt="头像" class="w-20 h-20 rounded-full">
            </div>
            <div class="text-center mb-4">
                <h3 class="font-bold text-lg">{{ fosterHome.name }}</h3>
                <p class="text-gray-500 text-sm">{{ fosterHome.address }}</p>
            </div>
            <div class="contact-methods space-y-4">
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span class="text-gray-700">联系电话</span>
                    <el-button type="text" icon="el-icon-phone" class="text-blue-500"
                        @click="callPhone(fosterHome.phone)">
                        {{ fosterHome.phone }}
                    </el-button>
                </div>
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span class="text-gray-700">在线咨询</span>
                    <el-button type="primary" size="small" @click="goToChat(fosterHome.id)">
                        立即沟通
                    </el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

interface FosterHomeContactInfo {
    id: number
    name: string
    avatar?: string
    address: string
    phone: string
}

// Props
const props = defineProps<{
    modelValue: boolean
    fosterHome?: FosterHomeContactInfo | null
}>()

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

// 路由实例
const router = useRouter()
// 弹窗显隐
const visible = ref(props.modelValue)
// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

// 监听v-model变化
watch(() => props.modelValue, (val) => {
    visible.value = val
})

// 拨打电话
const callPhone = (phone: string) => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = `tel:${phone}`
    } else {
        navigator.clipboard.writeText(phone).then(() => {
            ElMessage.success(`已复制号码：${phone}`)
        })
        ElMessageBox.alert(`请拨打号码：${phone}`, '联系电话')
    }
}

// 在线咨询
const goToChat = (fosterHomeId: number) => {
    router.push({ name: 'chat', params: { id: fosterHomeId } })
    emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.contact-info {
    .contact-methods {
        div {
            transition: all 0.2s ease;

            &:hover {
                background-color: #e0f2fe;
            }
        }
    }
}
</style>
