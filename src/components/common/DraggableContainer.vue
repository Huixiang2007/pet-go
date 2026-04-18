<template>
    <div class="draggable-container"
        :style="{ position: 'fixed', top: `${position.y}px`, left: `${position.x}px`, ...containerStyle }"
        @mousedown="handleDragStart" @mouseup="handleDragEnd" @click="handleClick" v-bind="$attrs">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
const props = defineProps<{
    initialPosition: {
        x: number,
        y: number
    }

    containerStyle: Record<string, string>
    preventClickOnDrag: boolean

}>()
const emit = defineEmits<{ (e: 'click'): void }>()
//判断是否是图拽事件，防止拖拽时触发点击事件
const hasDragged = ref(false)
const handleClick = () => {
    console.log('点击事件触发:', !hasDragged.value)
    // 只有在没有拖拽过的情况下才触发点击事件
    if (!hasDragged.value || !props.preventClickOnDrag) {
        emit('click')
    }
}
//初始位置
const position = ref({ ...props.initialPosition })
//是否在拖拽
const isDragging = ref(false)
//鼠标相对于元素左上角的位置（拖拽偏移量）
const dragOffset = ref({ x: 0, y: 0 })
//初始化位置
const initPosition = () => {
    position.value = { ...props.initialPosition }
}
//开始拖拽
const handleDragStart = (e) => {

    isDragging.value = true;


    dragOffset.value = {
        x: e.offsetX,
        y: e.offsetY,
    }
}
//正在拖拽，同步元素的位置
const handleDrag = (e) => {
    if (isDragging.value) {
        console.log("正在拖拽")
        hasDragged.value = true;

        console.log(parseInt(props.containerStyle.width))
        position.value = {
            x: Math.min(Math.max(0, e.clientX - dragOffset.value.x), window.innerWidth - parseInt(props.containerStyle.width)),
            y: Math.min(Math.max(0, e.clientY - dragOffset.value.y), window.innerHeight - parseInt(props.containerStyle.height)),
        }
        console.log(position.value.x)
    }
}
//拖拽结束
const handleDragEnd = () => {
    isDragging.value = false;
    // 直接重置 hasDragged，确保点击事件能够正确判断
    hasDragged.value = false;
}
onMounted(() => {
    initPosition()
    document.addEventListener('mousemove', handleDrag)
})
</script>
<style scoped>
.draggable-container {
    z-index: 9999;
}
</style>
