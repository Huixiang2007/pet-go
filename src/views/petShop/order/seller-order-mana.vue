<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <!-- 头部和导航组件（保留你的原有引用） -->
    <SellerManHeader />
    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />

      <div class="flex-1 overflow-auto p-4">
        <!-- 标签切换 -->
        <div class="mb-4 border-b border-gray-200">
          <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="订单管理" name="order"></el-tab-pane>
            <el-tab-pane label="退款/售后" name="refund"></el-tab-pane>
            <el-tab-pane label="评价管理" name="comment"></el-tab-pane>
          </el-tabs>
        </div>

        <!-- 引入各模块 -->
        <OrderManage v-if="activeTab === 'order'" />
        <RefundManage v-if="activeTab === 'refund'" />
        <CommentManage v-if="activeTab === 'comment'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import OrderManage from './components/seller-man/OrderManage.vue'
import RefundManage from './components/seller-man/RefundManage.vue'
import CommentManage from './components/seller-man/CommentManage.vue'

const activeTab = ref('order')
</script>

<style scoped>
/* 仅保留全局样式，模块样式放在各自文件 */
:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border-bottom: none;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: 1px solid #e4e7ed;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border-bottom: 1px solid #fff;
}
</style>
