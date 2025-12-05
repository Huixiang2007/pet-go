<template>
  <div class="flex flex-row justify-center items-center pt-[70px]">
    <div class="grid grid-cols-7 gap-x-4 gap-y-2">
      <div
        v-for="category in categories"
        :key="category.id"
        class="relative flex items-center justify-between whitespace-nowrap"
      >
        <div
          @click="handleCategoryClick(category.id)"
          class="flex items-center cursor-pointer transition-colors py-3 px-2"
          style="line-height: 1.2"
          :class="[
            activeCategory === category.id ||
            (activeSubCategory && activeSubCategory.includes(category.id))
              ? 'text-[#FF7043] font-bold'
              : 'text-gray-600 hover:text-[#FF7043]',
          ]"
        >
          <span class="text-[14px]">{{ category.name }}</span>
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

        <!-- 下拉框 -->
        <div
          v-if="category.children && category.children.length && isSubOpen[category.id]"
          class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-2 z-50 w-28 transition-all duration-200 origin-top"
        >
          <a
            v-for="sub in category.children"
            :key="sub.id"
            :href="getSubCategoryLink(category.id, sub.id)"
            @click.stop="handleSubCategoryClick(category.id, sub)"
            class="block px-4 py-2 text-sm transition-colors"
            :class="
              activeSubCategory === `${category.id}-${sub.id}`
                ? 'text-[#FF7043] bg-orange-50'
                : 'text-gray-600 hover:bg-gray-50'
            "
          >
            {{ sub.name }}
          </a>
        </div>
      </div>
    </div>
    <!-- 搜索框 -->
    <div class="hidden md:flex justify-center items-center">
      <div class="relative w-[200px] ml-[40px]">
        <input
          id="search-input"
          type="text"
          placeholder="搜索宠物用品..."
          @keyup.enter="searchKey"
          class="outline-none w-full py-2 pl-10 pr-4 rounded-full border border-[#f5a623]"
        />
        <i
          @click="searchKey"
          class="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></i>
      </div>
    </div>
    <router-link
      to="/seller-item-manager"
      class="border-[1px] border-orange-400 ml-12 rounded-full px-5 py-2 text-orange-700 font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group hidden xl:flex cursor-pointer"
    >
      <i class="fa fa-paw text-xl text-orange-500 animate-bounce"></i>
      <span class="relative">
        我的商店管理
        <span
          class="absolute bottom-[-2px] transform -translate-x-1/2 w-[20px] h-0.5 bg-orange-400 transition-all duration-500 group-hover:w-full"
          style="left: 50%"
        ></span>
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义子分类接口
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
  modelValue?: string
  subModelValue?: string
  categories?: Category[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'all',
  subModelValue: '',
  categories: () => [
    {
      id: 'all',
      name: '首页',
      path: '/shop',
      children: [],
    },
    {
      id: 'sale',
      name: '特价用品',
      path: '/products/sale',
      children: [
        { id: 'limited', name: '限时折扣', path: '/products/sale?type=limited' },
        { id: 'clearance', name: '清仓商品', path: '/products/sale?type=clearance' },
      ],
    },
    {
      id: 'food',
      name: '宠物主粮',
      path: '/products/food',
      children: [
        { id: 'cat', name: '猫粮', path: '/products/food?pet=cat' },
        { id: 'dog', name: '狗粮', path: '/products/food?pet=dog' },
        { id: 'small', name: '小宠粮食', path: '/products/food?pet=small' },
      ],
    },
    {
      id: 'snacks',
      name: '宠物零食',
      path: '/products/snacks',
      children: [
        { id: 'freeze', name: '冻干零食', path: '/products/snacks?type=freeze' },
        { id: 'canned', name: '罐头食品', path: '/products/snacks?type=canned' },
        { id: 'chew', name: '咬胶零食', path: '/products/snacks?type=chew' },
      ],
    },
    {
      id: 'supplies',
      name: '日常用品',
      path: '/products/supplies',
      children: [
        { id: 'collar', name: '项圈牵引', path: '/products/supplies?type=collar' },
        { id: 'bed', name: '宠物窝垫', path: '/products/supplies?type=bed' },
        { id: 'bowl', name: '食盆水盆', path: '/products/supplies?type=bowl' },
      ],
    },
    {
      id: 'toys',
      name: '宠物玩具',
      path: '/products/toys',
      children: [
        { id: 'chew', name: '咬胶玩具', path: '/products/toys?type=chew' },
        { id: 'interactive', name: '互动玩具', path: '/products/toys?type=interactive' },
        { id: 'catnip', name: '猫薄荷玩具', path: '/products/toys?type=catnip' },
      ],
    },
    {
      id: 'cleaning',
      name: '洗护清洁',
      path: '/products/cleaning',
      children: [
        { id: 'shampoo', name: '宠物香波', path: '/products/cleaning?type=shampoo' },
        { id: 'deodorant', name: '除臭用品', path: '/products/cleaning?type=deodorant' },
        { id: 'litter', name: '猫砂用品', path: '/products/cleaning?type=litter' },
      ],
    },
    {
      id: 'care',
      name: '宠物护理',
      path: '/products/care',
      children: [
        { id: 'nail', name: '指甲护理', path: '/products/care?type=nail' },
        { id: 'comb', name: '梳毛工具', path: '/products/care?type=comb' },
        { id: 'ear', name: '耳道清洁', path: '/products/care?type=ear' },
      ],
    },
    {
      id: 'grooming',
      name: '美容工具',
      path: '/products/grooming',
      children: [
        { id: 'dryer', name: '宠物吹风机', path: '/products/grooming?type=dryer' },
        { id: 'scissors', name: '美容剪刀', path: '/products/grooming?type=scissors' },
        { id: 'clipper', name: '电推剪', path: '/products/grooming?type=clipper' },
      ],
    },
    {
      id: 'clothing',
      name: '宠物服饰',
      path: '/products/clothing',
      children: [
        { id: 'coat', name: '冬季外套', path: '/products/clothing?type=coat' },
        { id: 'raincoat', name: '宠物雨衣', path: '/products/clothing?type=raincoat' },
        { id: 'costume', name: '节日服装', path: '/products/clothing?type=costume' },
      ],
    },
    {
      id: 'health',
      name: '健康保健',
      path: '/products/health',
      children: [
        { id: 'vitamin', name: '维生素', path: '/products/health?type=vitamin' },
        { id: 'joint', name: '关节保健', path: '/products/health?type=joint' },
        { id: 'digestive', name: '肠胃调理', path: '/products/health?type=digestive' },
      ],
    },
    {
      id: 'training',
      name: '训练用品',
      path: '/products/training',
      children: [
        { id: 'clicker', name: '响片训练', path: '/products/training?type=clicker' },
        { id: 'pad', name: '尿垫', path: '/products/training?type=pad' },
        { id: 'crate', name: '航空箱', path: '/products/training?type=crate' },
      ],
    },
    {
      id: 'travel',
      name: '宠物出行',
      path: '/products/travel',
      children: [
        { id: 'carrier', name: '宠物背包', path: '/products/travel?type=carrier' },
        { id: 'seatbelt', name: '车载安全带', path: '/products/travel?type=seatbelt' },
        { id: 'portable', name: '便携用品', path: '/products/travel?type=portable' },
      ],
    },
    {
      id: 'aquatic',
      name: '水族用品',
      path: '/products/aquatic',
      children: [
        { id: 'tank', name: '鱼缸设备', path: '/products/aquatic?type=tank' },
        { id: 'filter', name: '过滤设备', path: '/products/aquatic?type=filter' },
        { id: 'food', name: '观赏鱼粮', path: '/products/aquatic?type=food' },
      ],
    },
  ],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:subModelValue': [value: string]
  categoryChange: [category: Category]
  subCategoryChange: [mainId: string, sub: SubCategory]
}>()

// 路由相关
const route = useRoute()
const router = useRouter()

const activeCategory = ref(props.modelValue)
const activeSubCategory = ref(props.subModelValue)
const isSubOpen = ref<Record<string, boolean>>({})

// 所有下拉框默认关闭
const initDropdownStates = () => {
  props.categories.forEach((cat) => {
    isSubOpen.value[cat.id] = false
  })
}

// 初始化
initDropdownStates()

watch(
  () => props.modelValue,
  (newValue) => {
    activeCategory.value = newValue
  },
)

watch(
  () => props.subModelValue,
  (newValue) => {
    activeSubCategory.value = newValue
  },
)

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    // 匹配主分类
    const matchedCategory = props.categories.find((cat) => newPath.includes(cat.path))
    if (matchedCategory && matchedCategory.id !== activeCategory.value) {
      activeCategory.value = matchedCategory.id
      emit('update:modelValue', matchedCategory.id)
    }

    // 匹配子分类
    if (matchedCategory?.children && matchedCategory.children.length) {
      const matchedSub = matchedCategory.children.find((sub) => newPath.includes(sub.path))
      if (matchedSub) {
        const subKey = `${matchedCategory.id}-${matchedSub.id}`
        if (subKey !== activeSubCategory.value) {
          activeSubCategory.value = subKey
          emit('update:subModelValue', subKey)
        }
      }
    }
  },
  { immediate: true },
)

const toggleSubCategory = (categoryId: string) => {
  Object.keys(isSubOpen.value).forEach((key) => {
    if (key !== categoryId) {
      isSubOpen.value[key] = false
    }
  })
  // 切换当前下拉框状态
  isSubOpen.value[categoryId] = !isSubOpen.value[categoryId]
}

// 处理主分类点击
const handleCategoryClick = (categoryId: string) => {
  const category = props.categories.find((cat) => cat.id === categoryId)
  if (!category) return

  // 如果有子分类，展开下拉框；无子类则跳转
  if (category.children && category.children.length) {
    toggleSubCategory(categoryId)
  } else {
    activeCategory.value = categoryId
    activeSubCategory.value = ''
    emit('update:modelValue', categoryId)
    emit('update:subModelValue', '')
    emit('categoryChange', category)

    if (category.path !== route.path) {
      router.push(category.path)
    }
  }
}

// 处理子分类点击
const handleSubCategoryClick = (mainId: string, sub: SubCategory) => {
  activeCategory.value = mainId
  const subKey = `${mainId}-${sub.id}`
  activeSubCategory.value = subKey

  // 触发事件
  emit('update:modelValue', mainId)
  emit('update:subModelValue', subKey)
  emit('subCategoryChange', mainId, sub)

  // 跳转路由
  if (sub.path !== route.path) {
    router.push(sub.path)
  }
  // 跳转后关闭下拉框
  isSubOpen.value[mainId] = false
}

// 生成子分类链接
const getSubCategoryLink = (mainId: string, subId: string) => {
  const mainCategory = props.categories.find((cat) => cat.id === mainId)
  const subCategory = mainCategory?.children?.find((sub) => sub.id === subId)
  return subCategory?.path || '#'
}

// 点击页面其他区域关闭下拉框
const handleClickOutside = (e: Event) => {
  const categoryEls = document.querySelectorAll('.relative.whitespace-nowrap')
  let isClickInside = false
  categoryEls.forEach((el) => {
    if (el.contains(e.target as Node)) {
      isClickInside = true
    }
  })
  if (!isClickInside) {
    Object.keys(isSubOpen.value).forEach((key) => {
      isSubOpen.value[key] = false
    })
  }
}
//搜索
const searchKey = () => {
  const title = document.querySelector('#search-input') as HTMLInputElement
  const searchValue = title.value.trim()
  if (searchValue) {
    router.push({
      path: '/search',
      query: {
        keyword: searchValue,
      },
    })
  }
}
document.addEventListener('click', handleClickOutside)

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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
</style>
