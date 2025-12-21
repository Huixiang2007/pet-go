<template>
  <div ref="scrollContainer" class="infinite-scroll-container bg-gradient-to-b from-amber-50 to-orange-50">
    <!-- 内容插槽 -->
    <slot></slot>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-indicator text-center py-4 text-gray-500 bg-gradient-to-b from-amber-50 to-orange-50">
      <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
    </div>

    <!-- 无更多数据 -->
    <div v-else-if="!hasMore" class="no-more-data text-center py-4 text-gray-500 bg-gradient-to-b from-amber-50 to-orange-50">
      没有更多数据了
    </div>

    <!-- 回到顶部按钮 -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="back-to-top fixed bottom-8 right-8 w-12 h-12 hover:bg-[#6acbe7]/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-50"
      title="回到顶部"
    >
    <img src="../../../../../public/img/火箭.gif" alt="">
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 定义组件属性
interface Props {
  // 控制是否正在加载
  isLoading: boolean;
  // 是否还有更多数据
  hasMore: boolean;
  // 滚动距离底部多少像素触发
  threshold?: number;
  // 是否回到顶部
  enableBackToTop?: boolean;

  backToTopThreshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 100,
  enableBackToTop: true,
  backToTopThreshold: 300,
  isLoading: false,
  hasMore: true
});

// 定义事件
const emit = defineEmits<{
  // 触发加载更多
  (e: 'load-more'): void;
}>();

// 响应式数据
const showBackToTop = ref(false);
const scrollY = ref(0);

// 监听滚动位置
watch(scrollY, (newVal) => {
  if (props.enableBackToTop) {
    showBackToTop.value = newVal > props.backToTopThreshold;
  }
});

// 滚动
const handleScroll = () => {
  scrollY.value = window.scrollY;

  if (props.isLoading || !props.hasMore) return;

  const scrollTop = window.scrollY;
  const clientHeight = document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;

  if (scrollTop + clientHeight >= scrollHeight - props.threshold) {
    emit('load-more');
  }
};

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.infinite-scroll-container {
  position: relative;
}

.loading-indicator,
.no-more-data {
  margin: 0 0;
}

.back-to-top {
  transition: opacity 0.3s, transform 0.3s;
}

.back-to-top:hover {
  transform: translateY(-4px);
}
</style>
