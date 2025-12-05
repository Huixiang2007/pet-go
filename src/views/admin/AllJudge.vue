<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <template #header>
        <div class="clearfix">
          <span>评价筛选</span>
        </div>
      </template>
      <div class="filter-item">
        <el-input
          v-model="listQuery.keyword"
          placeholder="请输入关键词"
          style="width: 200px"
          prefix-icon="el-icon-search"
          clearable
        />
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </el-card>

    <el-card class="content-container" shadow="never">
      <template #header>
        <div class="clearfix">
          <span>评价列表</span>
        </div>
      </template>

      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="120"> </el-table-column>
        <el-table-column prop="content" label="评价内容"> </el-table-column>
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900"> </el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"> </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface ReviewItem {
  id: number
  username: string
  content: string
  rating: number
  createTime: string
}

const list = ref<ReviewItem[]>([])
const total = ref(0)

const listQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
})

const handleFilter = () => {
  // 搜索处理逻辑
}

const handleDelete = (index: number, row: ReviewItem) => {
  // 删除处理逻辑
  console.log(index, row)
}

const handleSizeChange = (val: number) => {
  listQuery.pageSize = val
  // 分页大小改变逻辑
}

const handleCurrentChange = (val: number) => {
  listQuery.pageNum = val
  // 当前页改变逻辑
}
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.content-container {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}
</style>
