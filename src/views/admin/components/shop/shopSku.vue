<template>
  <div class="sku-audit-container">
    <div class="page-header">
      <el-icon class="icon"><Box /></el-icon>
      <h2>电商管理 - SKU 审核</h2>
    </div>

    <el-card shadow="hover" class="main-card">
      <el-tabs v-model="activeTab" class="cute-tabs">
        <el-tab-pane label="新增SKU审核" name="add">
          <el-table :data="addList" border class="data-table">
            <el-table-column label="申请ID" prop="applyId" />
            <el-table-column label="商品名称" prop="goodsName" />
            <el-table-column label="SKU名称" prop="skuName" />
            <el-table-column label="申请类型"><el-tag type="success">新增SKU</el-tag></el-table-column>
            <el-table-column label="状态"><el-tag type="warning">待审核</el-tag></el-table-column>
            <el-table-column label="操作">
              <el-button size="small" type="primary">查看</el-button>
              <el-button size="small" type="success">通过</el-button>
              <el-button size="small" type="danger">驳回</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="更新SKU审核" name="update">
          <el-table :data="updateList" border class="data-table">
            <el-table-column label="申请ID" prop="applyId" />
            <el-table-column label="商品名称" prop="goodsName" />
            <el-table-column label="SKU名称" prop="skuName" />
            <el-table-column label="申请类型"><el-tag type="warning">更新SKU</el-tag></el-table-column>
            <el-table-column label="状态"><el-tag type="warning">待审核</el-tag></el-table-column>
            <el-table-column label="操作">
              <el-button size="small" type="primary">查看</el-button>
              <el-button size="small" type="success">通过</el-button>
              <el-button size="small" type="danger">驳回</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Box } from '@element-plus/icons-vue'
const activeTab = ref('add')

const addList = ref([{ applyId: 'SKU_ADD_001', goodsName: '宠物零食', skuName: '鸡肉味' }])
const updateList = ref([{ applyId: 'SKU_UPDATE_001', goodsName: '宠物零食', skuName: '鸡肉味' }])
</script>

<style scoped lang="scss">
.sku-audit-container { padding: 20px; background: #faf6f0; min-height: 100vh; }
.page-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #6b5b45; }
.icon { color: #e8a87c; font-size: 24px; }
.main-card { border-radius: 12px; }
.cute-tabs { --el-tabs-active-color: #e8a87c; }
.data-table { --el-table-border-color: #e8d6c4; --el-table-hover-bg-color: #fff9f2; border-radius: 8px; }
</style>