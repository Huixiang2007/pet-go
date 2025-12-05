<template>
    <div class="container">
        <div class="carousel-container">
            <div class="carousel" ref="carouselRef">
                <!-- 轮播图片 -->
                <div v-for="(image, index) in config.images" :key="index"
                    :class="['slide', { active: currentSlide === index }]">
                    <img :src="image.src" :alt="image.alt" @load="onImageLoad" />
                </div>

                <!-- 碎片元素 -->
                <div v-for="fragment in fragments" :key="fragment.id" class="fragment" :style="fragment.style"></div>
            </div>

            <!-- 导航按钮 -->
            <button class="nav-btn prev" @click="goToPrevSlide">
                <span>‹</span>
            </button>
            <button class="nav-btn next" @click="goToNextSlide">
                <span>›</span>
            </button>

            <!-- 指示器 -->
            <div class="indicators">
                <button v-for="(image, index) in config.images" :key="index"
                    :class="['dot', { active: currentSlide === index }]" @click="goToSlide(index)"></button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 类型定义
interface ImageConfig {
    src: string
    alt: string
}

interface FragmentConfig {
    rows: number
    cols: number
    maxDisplacement: number
    maxRotation: number
    minScale: number
}

interface CarouselConfig {
    images: ImageConfig[]
    fragmentConfig: FragmentConfig
    autoplay: boolean
    autoplaySpeed: number
    transitionDuration: number
}

interface Fragment {
    id: string
    style: {
        left: string
        top: string
        width: string
        height: string
        backgroundImage: string
        backgroundSize: string
        backgroundPosition: string
        opacity: string
        transform: string
    }
}

// 配置
const getImageUrl = (name: string) => {
    return new URL(`../assets/${name}`, import.meta.url).href
}
const config = reactive<CarouselConfig>({
    images: [
        { src: getImageUrl('image1.jpg'), alt: '图片一' },
        { src: getImageUrl('image2.jpg'), alt: '图片二' },
        { src: getImageUrl('image3.jpg'), alt: '图片三' },
        { src: getImageUrl('image4.jpg'), alt: '图片四' },
        { src: getImageUrl('image5.jpg'), alt: '图片五' },
        { src: getImageUrl('image6.jpg'), alt: '图片五' },
        { src: getImageUrl('image7.jpg'), alt: '图片五' },
        { src: getImageUrl('image8.jpg'), alt: '图片五' },

    ],
    fragmentConfig: {
        rows: 10,
        cols: 15,
        maxDisplacement: 400,
        maxRotation: 180,
        minScale: 0.3,
    },
    autoplay: true,
    autoplaySpeed: 3000,
    transitionDuration: 800,
})

// 响应式数据
const currentSlide = ref(0)
const isTransitioning = ref(false)
const fragments = ref<Fragment[]>([])
const carouselRef = ref<HTMLElement | null>(null)
const autoplayInterval = ref<number | null>(null)

// 方法
const goToSlide = async (index: number): Promise<void> => {
    if (index === currentSlide.value || isTransitioning.value) return

    isTransitioning.value = true
    const prevSlide = currentSlide.value
    currentSlide.value = index

    // 等待DOM更新
    await nextTick()

    // 对前一张图片进行碎片化
    const prevImg = carouselRef.value?.querySelectorAll('.slide')[prevSlide]?.querySelector('img')
    if (prevImg) {
        fragmentImage(prevImg, () => {
            isTransitioning.value = false
        })
    } else {
        isTransitioning.value = false
    }
}

const goToPrevSlide = (): void => {
    const newIndex = (currentSlide.value - 1 + config.images.length) % config.images.length
    goToSlide(newIndex)
}

const goToNextSlide = (): void => {
    const newIndex = (currentSlide.value + 1) % config.images.length
    goToSlide(newIndex)
}

const fragmentImage = (img: HTMLImageElement, callback?: () => void): void => {
    if (!img.complete) {
        callback?.()
        return
    }

    // 清空之前的碎片
    fragments.value = []

    // 获取图片和容器尺寸
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight
    const containerWidth = carouselRef.value?.offsetWidth || 0
    const containerHeight = carouselRef.value?.offsetHeight || 0

    // 计算容器和图片的宽高比
    const containerRatio = containerWidth / containerHeight
    const imgRatio = imgWidth / imgHeight

    // 计算实际显示的图片尺寸
    let displayWidth: number, displayHeight: number
    if (imgRatio > containerRatio) {
        displayHeight = containerHeight
        displayWidth = displayHeight * imgRatio
    } else {
        displayWidth = containerWidth
        displayHeight = displayWidth / imgRatio
    }

    // 计算图片在容器中的偏移
    const offsetX = (displayWidth - containerWidth) / 2
    const offsetY = (displayHeight - containerHeight) / 2

    // 设置碎片参数
    const { rows, cols, maxDisplacement, maxRotation, minScale } = config.fragmentConfig
    const fragmentWidth = displayWidth / cols
    const fragmentHeight = displayHeight / rows

    // 创建碎片
    const newFragments: Fragment[] = []
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const fragmentId = `${i}-${j}`

            // 初始样式
            const initialStyle = {
                left: `${j * fragmentWidth - offsetX}px`,
                top: `${i * fragmentHeight - offsetY}px`,
                width: `${fragmentWidth}px`,
                height: `${fragmentHeight}px`,
                backgroundImage: `url(${img.src})`,
                backgroundSize: `${displayWidth}px ${displayHeight}px`,
                backgroundPosition: `-${j * fragmentWidth}px -${i * fragmentHeight}px`,
                opacity: '1',
                transform: 'translate(0,0) rotate(0) scale(1)',
            }

            newFragments.push({
                id: fragmentId,
                style: initialStyle
            })
        }
    }

    fragments.value = newFragments

    // 延迟启动碎片动画
    setTimeout(() => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const fragmentId = `${i}-${j}`
                const fragmentIndex = i * cols + j

                setTimeout(() => {
                    // 计算随机位移、旋转和不透明度
                    const randomX = (Math.random() - 0.5) * maxDisplacement
                    const randomY = (Math.random() - 0.5) * maxDisplacement
                    const randomRotation = (Math.random() - 0.5) * maxRotation
                    const randomScale = minScale + Math.random() * (1 - minScale)

                    // 更新碎片样式
                    const fragment = fragments.value.find(f => f.id === fragmentId)
                    if (fragment) {
                        fragment.style = {
                            ...fragment.style,
                            transform: `translate(${randomX}px,${randomY}px) rotate(${randomRotation}deg) scale(${randomScale})`,
                            opacity: '0',
                        }
                    }
                }, fragmentIndex * 10)
            }
        }

        // 动画结束后移除碎片
        const totalDuration = config.transitionDuration + rows * cols * 10
        setTimeout(() => {
            fragments.value = []
            callback?.()
        }, totalDuration)
    }, 50)
}

const startAutoplay = (): void => {
    if (autoplayInterval.value) {
        window.clearInterval(autoplayInterval.value)
    }

    autoplayInterval.value = window.setInterval(() => {
        if (!isTransitioning.value) {
            goToNextSlide()
        }
    }, config.autoplaySpeed)
}

const stopAutoplay = (): void => {
    if (autoplayInterval.value) {
        window.clearInterval(autoplayInterval.value)
        autoplayInterval.value = null
    }
}

const onImageLoad = (): void => {
    // 图片加载完成后的处理
}

// 生命周期
onMounted(() => {
    if (config.autoplay) {
        startAutoplay()
    }
})

onUnmounted(() => {
    stopAutoplay()
})

// 监听配置变化
watch(() => config.autoplay, (newVal) => {
    if (newVal) {
        startAutoplay()
    } else {
        stopAutoplay()
    }
})
</script>

<style scoped>
:root {
    --primary: #4c6ef5;
    --secondary: #339af0;
    --dark: #1a1a2e;
    --light: #f8f9fa;
    --image-width: 60%;
    --image-height: 60%;
}

/* 
body {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    overflow: hidden;
    background-color: var(--dark);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
} */

.container {
    width: 74%;
    height: calc(100vh - 7.4rem);
    margin: 2.825rem auto;
    margin-top: 4rem;
}

.carousel-container {
    position: relative;
    border-radius: 0.8rem;
    overflow: hidden;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
}

.carousel {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
}

.slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 300ms;
}

.slide.active {
    opacity: 1;
}

.slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    color: white;
    transition: all 300ms;
    cursor: pointer;
    border: none;
    outline: none;
    z-index: 10;
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-btn:hover {
    background: rgba(232, 168, 193, 0.8);
    transform: translateY(-50%) scale(1.1);
}

.nav-btn.prev {
    left: 1rem;
}

.nav-btn.next {
    right: 1rem;
}

.indicators {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 10;
}

.dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    transition: all 300ms;
    cursor: pointer;
    border: none;
    outline: none;
}

.dot.active {
    width: 2rem;
    border-radius: 0.375rem;
    background: rgba(232, 168, 193, 0.8);
}

.fragment {
    position: absolute;
    pointer-events: none;
    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 5;
}
</style>