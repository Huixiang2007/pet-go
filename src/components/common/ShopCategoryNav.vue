<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-center items-center pt-[70px]">
      <div class="grid grid-cols-8 gap-x-4 gap-y-2">
        <div
          v-for="category in categories"
          :key="category.id"
          class="relative flex items-center justify-between whitespace-nowrap"
        >
          <div
            @click="handleCategoryClick(category.id)"
            class="flex items-center cursor-pointer transition-all duration-300 py-3 px-3 rounded-md"
            style="line-height: 1.2"
            :class="[
              // 高亮核心逻辑：父分类匹配 或 子分类归属当前父分类
              activeCategory === category.id ||
              (activeSubCategory && activeSubCategory.startsWith(`${category.id}-`))
                ? 'text-[#FF7043] font-bold'
                : 'text-gray-600 hover:text-[#FF7043] hover:bg-gray-50',
            ]"
          >
            <span class="text-[14px] relative">
              {{ category.name }}
              <span
                v-if="
                  activeCategory === category.id ||
                  (activeSubCategory && activeSubCategory.startsWith(`${category.id}-`))
                "
                class="absolute bottom-[-6px] left-0 w-full h-[2px] bg-gradient-to-r from-[#FF9E7D] to-[#FF7043] transition-all duration-300"
              ></span>
            </span>
            <svg
              v-if="category.children && category.children.length"
              class="ml-1 w-4 h-4 transition-transform"
              :class="isSubOpen[category.id] ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>

          <!-- 子分类下拉框 -->
          <div
            v-if="category.children && category.children.length && isSubOpen[category.id]"
            class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-2 z-50 w-28 transition-all duration-200 origin-top"
          >
            <a
              v-for="sub in category.children"
              :key="sub.id"
              :href="getSubCategoryLink(category.id, sub.id)"
              @click.stop="handleSubCategoryClick(category.id, sub)"
              class="block px-4 py-2 text-sm transition-all duration-200"
              :class="[
                activeSubCategory === `${category.id}-${sub.id}`
                  ? 'text-[#FF7043] font-medium bg-[#FFF3E0] border-l-2 border-[#FF7043]'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
            >
              {{ sub.name }}
            </a>
          </div>
        </div>
      </div>
      <router-link
        v-if="hasShopId"
        to="/seller-item-manager"
        class="border-[1px] border-orange-400 ml-12 rounded-full px-5 py-2 text-orange-700 font-medium flex bg-gradient-to-r from-[#FF9E7D]/0 to-[#FF7043]/30 items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group hidden xl:flex cursor-pointer"
      >
        <i class="fa fa-paw text-xl text-orange-500 animate-bounce"></i>
        <span class="relative">
          商店管理
          <span
            class="absolute bottom-[-2px] transform -translate-x-1/2 w-[20px] h-0.5 bg-orange-400 transition-all duration-500 group-hover:w-full"
            style="left: 50%"
          ></span>
        </span>
      </router-link>
    </div>
    <div class="flex flex-row justify-center items-center my-2">
      <div class="hidden md:flex justify-center items-center">
        <div class="relative w-[480px] group">
          <input
            id="search-input"
            type="text"
            placeholder="搜索宠物用品..."
            @keyup.enter="searchKey"
            class="w-full py-2.5 px-4 pl-10 pr-4 rounded-full border border-orange-200 bg-orange-50/50 focus:outline-none focus:border-[#FF7043] focus:ring-2 focus:ring-[#FF7043]/15 hover:border-orange-300 transition-all duration-300 text-sm text-gray-800 placeholder:text-gray-400"
          />
          <i
            @click="searchKey"
            class="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#FF7043] group-focus-within:text-[#FF7043] transition-colors duration-300 cursor-pointer hover:scale-110"
          ></i>
          <span class="absolute inset-0 rounded-full pointer-events-none"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductListId } from '../../api/pet-shop/shop'

// 类型定义
interface ApiCategory {
  id: string | number
  name: string
  children: ApiCategory[] | null
}
interface SubCategory {
  id: string
  name: string
  path: string
}
interface Category {
  id: string
  name: string
  path: string
  children?: SubCategory[]
}
interface Props {
  promotionValue?: string
  modelValue?: string
  subModelValue?: string
}

// Props和Emit
const props = withDefaults(defineProps<Props>(), {
  promotionValue: '',
  modelValue: '',
  subModelValue: '',
})
const emit = defineEmits<{
  'update:promotionValue': [value: string]
  'update:modelValue': [value: string]
  'update:subModelValue': [value: string]
  categoryChange: [category: Category]
  subCategoryChange: [mainId: string, sub: SubCategory]
}>()
// 路由实例
const route = useRoute()
const router = useRouter()

// 核心数据
const categories = ref<Category[]>([
  { id: 'all', name: '首页', path: '/shop', children: [] },
  { id: 'promotion', name: '促销', path: '/promotion', children: [] },
])
const activeCategory = ref(props.modelValue) // 选中的父分类ID
const activeSubCategory = ref(props.subModelValue) // 选中的子分类标识
const isSubOpen = ref<Record<string, boolean>>({}) // 下拉框展开状态
const categoriesLoaded = ref(false) // 分类数据加载完成标记

const formatApiCategory = (apiCat: ApiCategory): Category => {
  const category: Category = {
    id: String(apiCat.id),
    name: apiCat.name,
    path: `/products/${apiCat.id}`,
  }
  if (apiCat.children && apiCat.children.length > 0) {
    category.children = apiCat.children.map((child) => ({
      id: String(child.id), // 子分类ID也转字符串
      name: child.name,
      path: `/products/${child.id}`,
    }))
  }
  return category
}
// 初始化下拉框状态
const initDropdownStates = () => {
  categories.value.forEach((cat) => (isSubOpen.value[cat.id] = false))
}

import { computed } from 'vue'

const hasShopId = computed(() => {
  const shopId = Number(localStorage.getItem('shopId'))
  console.log('localStorage 真实值:', shopId, '类型:', typeof shopId)
  if (isNaN(shopId)) {
    return false
  } else {
    return true
  }
})
console.log('hasShopId:', hasShopId.value)
// 加载分类数据
const loadCategories = async () => {
  try {
    const res = await getProductListId()
    console.log('接口返回分类数据：', res)

    if (res && Array.isArray(res)) {
      const formatCats = res.map(formatApiCategory)
      categories.value = [...categories.value, ...formatCats]
      initDropdownStates()
      categoriesLoaded.value = true
      // 分类数据加载完成后执行匹配
      await matchRouteIdToCategory()
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 匹配路由ID到分类
const matchRouteIdToCategory = async () => {
  if (!categoriesLoaded.value) {
    console.log('分类数据尚未加载完成，暂不匹配')
    return
  }

  await nextTick()

  // 检查路由参数和查询参数
  const rawTypeIdFromParams = route.params.category

  let targetTypeId = ''
  if (rawTypeIdFromParams) {
    targetTypeId = Array.isArray(rawTypeIdFromParams)
      ? rawTypeIdFromParams[0]
      : String(rawTypeIdFromParams)
  }

  // 如果没有找到分类ID，根据当前路径匹配分类
  if (!targetTypeId || targetTypeId === '0') {
    // 检查当前路径是否为促销页面
    if (route.path === '/promotion') {
      targetTypeId = 'promotion'
    } else {
      targetTypeId = 'all'
    }
  }

  console.log('获取到的分类ID:', {
    fromParams: rawTypeIdFromParams,
    targetTypeId,
    currentPath: route.path,
  })

  // 如果仍然没有找到分类ID，默认显示"首页"
  if (!targetTypeId || targetTypeId === '0') {
    activeCategory.value = ''
    activeSubCategory.value = ''
    emit('update:modelValue', 'all')
    emit('update:subModelValue', '')
    return
  }

  let parentId = ''
  let subId = ''

  // 检查是否为子分类
  for (const parent of categories.value) {
    if (parent.children && parent.children.length > 0) {
      const matchedSub = parent.children.find((sub) => sub.id === targetTypeId)
      if (matchedSub) {
        parentId = parent.id
        subId = targetTypeId
        break
      }
    }
  }

  // 如果不是子分类，检查是否为父分类
  if (!parentId) {
    const matchedParent = categories.value.find((cat) => cat.id === targetTypeId)
    if (matchedParent) {
      parentId = targetTypeId
      subId = ''
    } else {
      parentId = ''
      subId = ''
    }
  }

  // 更新活跃分类状态
  activeCategory.value = parentId
  activeSubCategory.value = subId ? `${parentId}-${subId}` : ''

  // 通知父组件
  emit('update:modelValue', parentId)
  emit('update:subModelValue', activeSubCategory.value)

  console.log('匹配结果：', {
    targetTypeId,
    parentId,
    subId,
    activeCategory: activeCategory.value,
    activeSubCategory: activeSubCategory.value,
    categories: categories.value.map((cat) => ({
      id: cat.id,
      name: cat.name,
      hasChildren: !!cat.children?.length,
    })),
  })
}

// 监听路由变化（同时监听参数和路径）
watch(
  [() => route.query.typeId, () => route.params.category, () => route.path],
  () => {
    matchRouteIdToCategory()
  },
  { immediate: true, flush: 'post' },
)

// 监听父组件Props变化
watch(
  () => props.modelValue,
  (val) => {
    activeCategory.value = val
  },
)
watch(
  () => props.subModelValue,
  (val) => {
    activeSubCategory.value = val
  },
)

// 切换下拉框展开/关闭
const toggleSubCategory = (categoryId: string) => {
  Object.keys(isSubOpen.value).forEach((key) => {
    if (key !== categoryId) isSubOpen.value[key] = false
  })
  isSubOpen.value[categoryId] = !isSubOpen.value[categoryId]
}

// 处理父分类点击
const handleCategoryClick = (categoryId: string) => {
  const category = categories.value.find((cat) => cat.id === categoryId)
  if (!category) return

  if (category.children && category.children.length) {
    toggleSubCategory(categoryId)
  } else {
    activeCategory.value = categoryId
    activeSubCategory.value = ''
    emit('update:modelValue', categoryId)
    emit('update:subModelValue', '')
    emit('categoryChange', category)

    // 跳转页面，并携带typeId参数
    router.push({
      path: category.path,
      query: { typeId: categoryId, pageNum: 1, pageSize: 10 },
    })
  }
}

// 处理子分类点击
const handleSubCategoryClick = (mainId: string, sub: SubCategory) => {
  activeCategory.value = mainId
  const subKey = `${mainId}-${sub.id}`
  activeSubCategory.value = subKey

  emit('update:modelValue', mainId)
  emit('update:subModelValue', subKey)
  emit('subCategoryChange', mainId, sub)

  // 跳转页面，携带子分类对应的typeId
  router.push({
    path: sub.path,
    query: { typeId: sub.id, pageNum: 1, pageSize: 10 },
  })

  // 关闭下拉框
  isSubOpen.value[mainId] = false
}

// 生成子分类链接
const getSubCategoryLink = (mainId: string, subId: string) => {
  const mainCat = categories.value.find((cat) => cat.id === mainId)
  const subCat = mainCat?.children?.find((sub) => sub.id === subId)
  return subCat?.path || '#'
}

// 点击页面其他区域关闭下拉框
const handleClickOutside = (e: Event) => {
  const categoryEls = document.querySelectorAll('.relative.whitespace-nowrap')
  let isClickInside = false
  categoryEls.forEach((el) => {
    if (el.contains(e.target as Node)) isClickInside = true
  })
  if (!isClickInside) {
    Object.keys(isSubOpen.value).forEach((key) => (isSubOpen.value[key] = false))
  }
}

// 搜索功能
const searchKey = () => {
  const input = document.querySelector('#search-input') as HTMLInputElement
  const keyword = input.value.trim()
  if (keyword) {
    router.push({ path: '/search', query: { keyword } })
  }
}

// 生命周期
onMounted(async () => {
  await loadCategories()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 基础样式 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.relative {
  position: relative;
}
.z-50 {
  z-index: 50 !important;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
.origin-top {
  transform-origin: top;
}
.bg-orange-50 {
  background-color: #fff7f3;
}

.text-\[\#FF7043\] {
  color: #ff7043 !important;
}
.border-b-2 {
  border-bottom-width: 2px !important;
}
.border-\[\#FF7043\] {
  border-color: #ff7043 !important;
}
.font-bold {
  font-weight: 600 !important;
}
</style>
