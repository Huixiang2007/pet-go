<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">

    <SellerManHeader />


<div class="flex flex-1 overflow-hidden">
      <SellerManNav />

      <div class="flex-1 overflow-auto p-4">
        <div class="bg-white rounded-md p-2 px-5">


        <div class="flex flex-row justify-between items-center border-b-[1px] px-8 py-2">
          <div class="text-md font-bold">订单管理</div>
          <div class="flex flex-row gap-2">
             <el-input
            placeholder="请输入内容"
            v-model="input"
            clearable>
            <template #prefix>
              <i class="fas fa-search text-md text-gray-300"></i>
            </template>
          </el-input>
              <el-button size="big" >搜索</el-button>
          </div>
        </div>

          <el-table
            :data="tableData"
            style="width: 100%"
            stripe
            :cell-style="{ padding: '12px 0' }"
            :header-cell-style="{
              background: '#fafafa',
              color: '#606266',
              fontWeight: '500'
            }"
          >
            <el-table-column prop="id" label="订单号" width="140" />
            <el-table-column prop="name" label="姓名" width="140" />
            <el-table-column prop="address" label="地址">
                <template #default="scope">
                <div class="address-text" :title="scope.row.address">
                  {{ scope.row.address }}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="phone" label="电话" width="140" />

            <el-table-column prop="status" label="订单状态" width="140">
              <template #default="scope">
                <el-tag
                  :type="getStatusTagType(scope.row.status)"
                  size="small"
                >
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          <el-table-column prop="time" label="日期" width="140" />
            <el-table-column prop="price" label="金额" width="100" />
            <el-table-column label="操作" width="160">
              <template #default>
                <div class="flex gap-2">
                  <el-button size="mini" type="text" class="text-blue-600">查看</el-button>
                  <el-button size="mini" type="text" class="text-orange-500">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="px-6 py-3 border-t flex justify-between items-center">
            <div class="text-sm text-gray-500">共 120 条记录</div>
            <el-pagination
              layout="prev, pager, next"
              :total="120"
              :page-size="10"
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
  id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  time:string;
  price: string;
  operation: string;
}


const getStatusTagType = (status: string) => {
  switch (status) {
    case '待付款': return 'warning'
    case '待发货': return 'info'
    case '待收货': return 'success'
    case '待评价': return 'primary'
    default: return ''
  }
}

const tableData: TableRow[] = [
  {
    id: '20160502',
    time:'2016-05-02',
    name: '王小虎',
    address: '上海',
    phone: '18888888888',
    status: '待付款',
    price: '500',
    operation: '查看详情'
  },
  {
    id: '20160504',
    time:'2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518上海市普陀区金沙江路 1518上海市普陀区金沙江路 1518上海市普陀区金沙江路 1518 ',
    phone: '18888888888',
    status: '待发货',
    price: '500',
    operation: '查看详情'
  },
  {
    id: '20160501',
    time:'2016-05-02',
    name: '王小虎',
    address: '上海',
    phone: '18888888888',
    status: '待收货',
    price: '500',
    operation: '查看详情'
  },
  {
    id: '20160503',
    time:'2016-05-02',
    name: '王小虎',
    address: '上海',
    phone: '18888888888',
    status: '待评价',
    price: '500',
    operation: '查看详情'
  }
]
</script>

<style scoped>
::v-deep .el-tag--primary {
  background-color: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}

::v-deep .el-table__row:hover > td {
  background-color: #f9fafb !important;
}

::v-deep .el-input__inner {
  border-radius: 4px;
}

::v-deep .el-button {
  border-radius: 4px;
}

::v-deep .address-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.5;
  max-height: 3em;
}
</style>
