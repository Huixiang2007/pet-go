<template>
  <div class="hidden md:flex items-center space-x-8 py-3 overflow-x-auto scrollbar-hide">
    <a
      v-for="category in categories"
      :key="category.id"
      :href="getCategoryLink(category.id)"
      @click.prevent="handleCategoryClick(category.id)"
      :class="[
        'whitespace-nowrap transition-colors',
        activeCategory === category.id
          ? 'text-[#FF7043] font-medium'
          : 'text-gray-600 hover:text-[#FF7043]'
      ]"
    >
      {{ category.name }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref,  watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义商品分类数据
interface Category {
  id: string
  name: string
  path: string
}

// 定义props
interface Props {
  modelValue?: string // 当前激活的分类ID
  categories?: Category[] // 分类列表
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'all',
  categories: () => [
    { id: 'all', name: '首页', path: '/shop' },
    { id: 'sale', name: '特价用品', path: '/products/sale' },
    { id: 'food', name: '宠物主粮', path: '/products/food' },
    { id: 'supples', name: '宠物配件', path: '/products/supples' },
    { id: 'toys', name: '宠物玩具', path: '/products/toys' },
    { id: 'supplies', name: '日常用品', path: '/products/supplies' },
    { id: 'cleaning', name: '洗护清洁', path: '/products/cleaning' },
    { id: 'care', name: '宠物护理', path: '/products/care' },
    { id: 'grooming', name: '沐浴美容', path: '/products/grooming' },
    { id: 'clothing', name: '宠物服饰', path: '/products/clothing' }
  ]
})

// 定义emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'categoryChange': [category: Category]
}>()

// 获取路由信息
const route = useRoute()
const router = useRouter()

// 当前激活的分类
const activeCategory = ref(props.modelValue)

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  activeCategory.value = newValue
})

// 监听路由变化，自动设置激活状态
watch(() => route.path, (newPath) => {
  const matchedCategory = props.categories.find(cat => newPath.includes(cat.path))
  if (matchedCategory && matchedCategory.id !== activeCategory.value) {
    activeCategory.value = matchedCategory.id
    emit('update:modelValue', matchedCategory.id)
  }
}, { immediate: true })

// 处理分类点击
const handleCategoryClick = (categoryId: string) => {
  activeCategory.value = categoryId
  emit('update:modelValue', categoryId)

  const category = props.categories.find(cat => cat.id === categoryId)
  if (category) {
    emit('categoryChange', category)

    // 路由跳转
    if (category.path !== route.path) {
      router.push(category.path)
    }
  }
}

// 生成分类链接
const getCategoryLink = (categoryId: string) => {
  const category = props.categories.find(cat => cat.id === categoryId)
  return category?.path || '#'
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
