<template>
  <div id="app">
    <NavBar />
    <div
      class="min-h-screen bg-gradient-to-b from-purple-50 to-white flex justify-center items-start py-8 px-4 pt-16 mt-6">
      <!-- 主容器 -->
      <div class="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden border border-purple-100">
        <!-- 顶部标题栏 -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-400 py-8 px-8 text-white">
          <h1 class="text-[32px] font-bold text-center">加入我们 · 成为合作伙伴</h1>
          <p class="text-purple-100 text-center mt-2">选择您的合作类型，完成入驻申请</p>
        </div>

        <!-- 选项卡切换 -->
        <div class="flex border-b border-purple-100 bg-purple-50">
          <button v-for="(item, index) in tabList" :key="index" :class="[
            'flex-1 py-4 px-4 text-center font-medium transition-all',
            activeTab === index
              ? 'text-purple-700 border-b-2 border-purple-500'
              : 'text-gray-500 hover:text-purple-600',
          ]" @click="switchTab(index)">
            <i class="fa mr-2" :class="item.icon"></i>
            {{ item.name }}
          </button>
        </div>

        <!-- 动态加载对应的组件 -->
        <div class="p-8">
          <keep-alive>
            <component :is="currentComponent" @submit-success="handleSubmitSuccess"
              @validation-error="handleValidationError" />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, type Component } from 'vue'
import BusinessEntry from '@/views/joinUs/components/BusinessEntry.vue'
import OrganizationEntry from '@/views/joinUs/components/OrganizationEntry.vue'
import FamilyEntry from '@/views/joinUs/components/FamilyEntry.vue'
import NavBar from '@/components/common/NavBar.vue';

interface TabItem {
  name: string
  icon: string
  component: Component
}
// 选项卡配置
const tabList: TabItem[] = [
  { name: '商家入驻', icon: 'fa-shopping-bag', component: BusinessEntry },
  { name: '寄养机构', icon: 'fa-building-o', component: OrganizationEntry },
  { name: '寄养家庭', icon: 'fa-home', component: FamilyEntry },
]

const activeTab = ref(0)

// 使用 shallowRef 防止不必要的深度响应式转换
const currentComponent = shallowRef<Component>(BusinessEntry)

// 切换选项卡
const switchTab = (index: number) => {
  activeTab.value = index
  currentComponent.value = tabList[index]!.component
}

// 处理子组件事件
const handleSubmitSuccess = (data: object) => {
  console.log('提交成功:', data)
  alert('申请提交成功！我们将尽快审核')
}

const handleValidationError = (message: string) => {
  alert(message)
}
</script>

<style scoped>
#app {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a5b4fc;
}

/* 选项卡样式优化 */
button:hover {
  background-color: #faf5ff;
}

/* 动画效果 */
.transition-all {
  transition: all 0.3s ease;
}
</style>
