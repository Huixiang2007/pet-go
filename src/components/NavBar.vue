<template>
    <div class="fixed z-10 w-[100%] h-16 bg-white rounded-b-lg shadow-md m-auto flex items-center justify-center">

        <!-- 导航容器 -->
        <div class="flex items-center justify-center h-14 w ml-10 relative">
            <div v-for="(item, index) in navItems" :key="item.text"
                :class="['item relative z-10 w-[92px] h-[48px] rounded-full flex justify-center items-center mx-[15px] cursor-pointer transition-all duration-500 text-base', { active: activeIndex === index }]"
                @click="setActive(index, item.bgColor)">
                {{ item.text }}
                <i class="iconfont" :class="item.color" v-text="item.unicode"></i>
            </div>
            <div class="active-circle absolute z-0 top-[12px] transition-all duration-400 ease-in-out" :style="{
                left: `${activeIndex * 125}px`,
                backgroundColor: activeBgColor,
                animation: isAnimating ? 'jello 0.5s' : 'none'
            }"></div>
        </div>
        <div>
            <el-button type="warning" plain size="default" class="ml-1">登录</el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
interface NavItem {
    text: string;
    color: string;
    bgColor: string;
    unicode: string;
}

const navItems = ref<NavItem[]>([
    {
        text: '优宠托管',
        color: 'text-[rgb(156,156,224)]',
        bgColor: 'rgb(219,219,254)',
        unicode: '\ue669'
    },
    {
        text: '宠品甄选',
        color: 'text-[rgb(229 163 37)]',
        bgColor: 'rgb(249 226 182)',
        unicode: '\ue736'
    },
    {
        text: '宠行天下',
        color: 'text-[rgb(22 209 22)]',
        bgColor: 'rgb(223,254,223)',
        unicode: '\ue602'
    },
    {
        text: '我的宠物',
        color: 'text-[#f9526f]',
        bgColor: 'pink',
        unicode: '\ue6d7'
    },
    {
        text: '我的订单',
        color: 'text-[rgb(229 163 37)]',
        bgColor: 'rgb(249 226 182)',
        unicode: '\ue737'

    },
    {
        text: '购物车',
        color: 'text-[rgb(100,149,237)]',
        bgColor: 'rgb(202 234 244)',
        unicode: '\ue655'
    },
    {
        text: '旅游足迹',
        color: 'text-[rgb(255,105,180)]',
        bgColor: 'rgb(255,192,203)',
        unicode: '\ue60a'
    },
    {
        text: '我的消息',
        color: 'text-[rgb(156,156,224)]',
        bgColor: 'rgb(219,219,254)',
        unicode: '\ue65d'

    },
    {
        text: '加入我们',
        color: 'text-[rgb(123,31,162)]',
        bgColor: 'rgb(225,204,254)',
        unicode: '\ue612'
    }

])
// 活跃状态管理
const activeIndex = ref(0);
const activeBgColor = ref(navItems.value[0]?.bgColor);
const isAnimating = ref(false);
const navContainer = ref<HTMLElement | null>(null);
// 设置活跃项
const setActive = (index: number, bgColor: string) => {
    activeIndex.value = index;
    activeBgColor.value = bgColor;
    // 触发动画
    isAnimating.value = true;
    setTimeout(() => {
        isAnimating.value = false;
    }, 500);
    // if (navContainer.value) {
    //     navContainer.value.style.backgroundColor = bgColor;
    // }
};
watch(activeIndex, (newVal) => {
    activeBgColor.value = navItems.value[newVal]?.bgColor;

});

</script>
<style scoped>
.active-circle {
    width: 114px;
    height: 35px;
    border-radius: 50px;
}

/* 活跃项的颜色样式（和原始一致） */
.item.active:nth-child(1) {
    color: rgb(65 65 255) !important;
}

.item.active:nth-child(2) {
    color: rgb(229 163 37) !important;
}

.item.active:nth-child(3) {
    color: rgb(22 209 22) !important;
}

.item.active:nth-child(4) {
    color: #f9526f !important;
}

.item.active:nth-child(4) i {
    font-size: 20px !important;
    margin-left: 7px !important;
}

.item.active:nth-child(4)~.active-circle {
    left: 369px !important;
}

.item.active:nth-child(5) {
    color: rgb(229 163 37) !important;
}

.item.active:nth-child(5)~.active-circle {
    left: 492px !important;
}


.item.active:nth-child(6) {
    color: rgb(100, 149, 237) !important;
}

.item.active:nth-child(6)~.active-circle {
    left: 616px !important;
}

.item.active:nth-child(7) {
    color: rgb(255 35 145) !important;
}

.item.active:nth-child(7)~.active-circle {
    left: 738px !important;
}

.item.active:nth-child(8) {
    color: rgb(65 65 255) !important;
}

.item.active:nth-child(8)~.active-circle {
    left: 860px !important;
}

.item.active:nth-child(9) {
    color: rgb(123, 31, 162) !important;
}

.item.active:nth-child(9)~.active-circle {
    left: 977px !important;
}

/* 果冻动画（和原始一致） */
@keyframes jello {
    0% {
        transform: scale(1, 1);
    }

    30% {
        transform: scale(1.25, 0.75);
    }

    40% {
        transform: scale(0.75, 1.25);
    }

    50% {
        transform: scale(1.15, 0.85);
    }

    65% {
        transform: scale(0.95, 1.05);
    }

    75% {
        transform: scale(1.05, 0.95);
    }

    100% {
        transform: scale(1, 1);
    }
}

/* 解决TailwindCSS样式优先级问题 */
:deep(.item) {
    transition: color 0.5s ease, transform 0.5s ease !important;
}

:deep(.item.active) {
    font-weight: bold !important;
}

:deep(.nav-container) {
    transition: background-color 0.5s ease;
    /* 添加背景色过渡动画 */
}

/* 确保图标和文字垂直居中 */
:deep(.iconfont) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    margin-top: 2px;

}
</style>