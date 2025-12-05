<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <template #header>
        <div class="clearfix">
          <span>订单筛选</span>
        </div>
      </template>
      <div class="filter-item">
        <el-input 
          v-model="listQuery.keyword" 
          placeholder="请输入订单号/用户名" 
          style="width: 200px;" 
          prefix-icon="el-icon-search"
          clearable
        />
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </el-card>

    <el-card class="content-container" shadow="never">
      <template #header>
        <div class="clearfix">
          <span>订单列表</span>
        </div>
      </template>
      
      <el-table
        :data="orderList"
        border
        style="width: 100%">
        <el-table-column label="订单号" prop="id" align="center"></el-table-column>
        <el-table-column label="用户" prop="username" align="center"></el-table-column>
        <el-table-column label="金额" prop="amount" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Order {
  id: string
  username: string
  amount: number
  createTime: string
  status: string
}

const listQuery = ref({
  keyword: ''
})

const orderList = ref<Order[]>([
  {
    id: '20210901001',
    username: '张三',
    amount: 299.00,
    createTime: '2021-09-01 12:30:00',
    status: '已完成'
  }
])

const handleFilter = () => {
  console.log('执行搜索:', listQuery.value.keyword)
}

const handleView = (index: number, row: Order) => {
  console.log('查看订单:', row)
}
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.filter-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.content-container {
  margin-top: 20px;
}
</style>

<script setup lang="ts">
</script>

<style scoped lang="scss">
</style>