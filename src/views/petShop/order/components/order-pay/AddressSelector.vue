<!-- 地址选择组件 -->
<template>
  <section class="bg-white rounded-xl p-6 card-shadow">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold">收货地址</h2>
      <!-- 新增地址改为跳转 -->
      <button
        class="text-[#f3ce48] hover:text-[#f3ce48]/80 text-sm flex items-center transition-base"
        @click="$emit('jump-to-address')"
      >
        <i class="fa fa-plus-circle mr-1"></i> 地址管理
      </button>
    </div>

    <!-- 地址列表（仅展示+选择默认，移除编辑/删除） -->
    <div
      v-for="addr in addressList"
      :key="addr.id"
      class="border-2 rounded-lg p-4 relative mt-3 cursor-pointer"
      :class="{
        'border-[#f3ce48] bg-[#f3ce48]/5': addr.isDefault,
        'hover:border-[#f3ce48] bg-[#f3ce48]/5': true,
      }"
      @click="$emit('set-default', addr.id)"
    >
      <div
        v-if="addr.isDefault"
        class="absolute top-3 right-3 bg-[#f3ce48] text-white text-xs px-2 py-1 rounded"
      >
        默认
      </div>
      <div class="font-medium mb-2">{{ addr.name }}</div>
      <div class="text-sm text-gray-600 mb-1">{{ addr.phone }}</div>
      <div class="text-sm text-gray-600">{{ addr.address }} {{ addr.addressDetail }}</div>
      <!-- 移除编辑/删除按钮，如需编辑/删除，引导至地址管理页 -->
      <div class="text-xs text-gray-400 mt-2">
        <span @click.stop="$emit('jump-to-address')" class="hover:text-[#f3ce48] cursor-pointer">
          编辑/删除请至地址管理页
        </span>
      </div>
    </div>

    <!-- 无地址时引导跳转 -->
    <div v-if="addressList.length === 0" class="text-center py-8 text-gray-500">
      <p>暂无收货地址，请前往地址管理页添加</p>
      <button
        class="mt-3 text-[#f3ce48] hover:text-[#f3ce48]/80 text-sm"
        @click="$emit('jump-to-address')"
      >
        前往添加
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Address {
  id: number
  name: string
  phone: string
  address: string
  addressDetail?: string
  isDefault: boolean
}
defineProps<{
  addressList: Address[]
}>()

// 定义事件
defineEmits(['set-default', 'jump-to-address'])
</script>

<style scoped lang="scss">
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
