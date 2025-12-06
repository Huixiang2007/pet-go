<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />
      <div class="flex-1 overflow-auto p-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div
            class="flex flex-row justify-between items-center border-b border-gray-200 px-4 py-3 mb-3"
          >
            <div class="text-lg font-bold text-gray-800">用户管理</div>
            <div class="flex flex-row gap-3">
              <el-input
                placeholder="请输入用户名/电话"
                v-model="input"
                clearable
                style="width: 200px"
              >
                <template #prefix>
                  <i class="fas fa-search text-md text-gray-300"></i>
                </template>
              </el-input>
              <el-button size="default" type="primary">搜索</el-button>
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            stripe
            :cell-style="{ padding: '14px 0', borderRight: '1px solid #f0f0f0' }"
            :header-cell-style="{
              background: '#f5f5f5',
              color: '#606266',
              fontWeight: '500',
              borderBottom: '1px solid #e0e0e0',
            }"
          >
            <el-table-column prop="id" label="用户id" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phone" label="电话" />
            <el-table-column prop="count" label="下单次数" />

            <el-table-column prop="status" label="订单状态">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)" size="small">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default>
                <div class="flex gap-3">
                  <el-button
                    size="mini"
                    type="text"
                    class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    >查看</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    class="text-orange-500 hover:text-orange-700 hover:bg-orange-50 transition-colors"
                    >拉黑</el-button
                  >
                </div>
              </template>
            </el-table-column>

            <template #empty>
              <div class="py-10 flex flex-col items-center justify-center text-gray-400">
                <i class="fas fa-user-slash text-4xl mb-3"></i>
                <div class="text-lg">暂无用户数据</div>
                <div class="text-sm mt-1">请检查搜索条件或等待数据同步</div>
              </div>
            </template>
          </el-table>

          <div class="px-4 py-3 border-t border-gray-200 flex justify-between items-center mt-3">
            <div class="text-sm text-gray-500">共 {{ tableData.length }} 条记录</div>
            <!-- 动态显示实际数据量 -->
            <el-pagination
              layout="prev, pager, next"
              :total="120"
              :page-size="10"
              :pager-count="5"
              style="margin: 0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input = ref('')

interface TableRow {
  id: string
  name: string
  phone: string
  status: string
  count: string
  operation: string
}

const getStatusTagType = (status: string) => {
  switch (status) {
    case '正常':
      return 'warning'
    case '已拉黑':
      return 'danger'
    case '待收货':
      return 'info'
    default:
      return ''
  }
}

const tableData: TableRow[] = [
  {
    id: '20160502',
    name: '王小虎',
    phone: '18888888888',
    status: '正常',
    count: '5',
    operation: '查看详情',
  },
  {
    id: '20160502',
    name: '王小虎',
    phone: '18888888888',
    status: '正常',
    count: '5',
    operation: '查看详情',
  },
  {
    id: '20160501',
    name: '王小虎',
    phone: '18888888888',
    status: '待收货',
    count: '5',
    operation: '查看详情',
  },
  {
    id: '20160502',
    name: '王小虎',
    phone: '18888888888',
    status: '正常',
    count: '5',
    operation: '查看详情',
  },
]
</script>

<style scoped>
::v-deep .el-tag--warning {
  background-color: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}
::v-deep .el-tag--info {
  background-color: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}
::v-deep .el-tag--danger {
  background-color: #fff2f0;
  color: #f5222d;
  border-color: #ffccc7;
}

::v-deep .el-table__row--striped td {
  background-color: #fafafa !important;
}

::v-deep .el-pagination {
  margin-top: 0;
}
::v-deep .el-pager li {
  margin: 0 2px;
}
</style>
