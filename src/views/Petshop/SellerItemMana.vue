<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />
      <div class="flex-1 overflow-auto p-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="flex flex-row justify-between items-center border-b border-gray-200 px-4 py-3 mb-3">

            <div class="text-lg font-bold text-gray-800">商品管理</div>
            <div class="flex flex-row gap-3">
              <el-input
                placeholder="请输入商品名/商品编号"
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
              borderBottom: '1px solid #e0e0e0'
            }"
          >

            <el-table-column prop="id" label="商品编号" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="category" label="商品分类" />
            <el-table-column prop="price" label="商品价格" />
            <el-table-column prop="stock" label="库存数量" />


            <el-table-column prop="status" label="商品状态">
              <template #default="scope">
                <el-tag
                  :type="getStatusTagType(scope.row.status)"
                  size="small"
                >
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template #default>
                <div class="flex gap-3">
                  <el-button size="mini" type="text" class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors">编辑</el-button>
                  <el-button size="mini" type="text" class="text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors">上架</el-button>
                  <el-button size="mini" type="text" class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors">下架</el-button>
                </div>
              </template>
            </el-table-column>

            <template #empty>
              <div class="py-10 flex flex-col items-center justify-center text-gray-400">
                <i class="fas fa-box-open text-4xl mb-3"></i>
                <div class="text-lg">暂无商品数据</div>
                <div class="text-sm mt-1">请检查搜索条件或添加商品</div>
              </div>
            </template>
          </el-table>

    
          <div class="px-4 py-3 border-t border-gray-200 flex justify-between items-center mt-3">
            <div class="text-sm text-gray-500">共 {{ tableData.length }} 条记录</div>
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

// 重新定义商品数据接口
interface TableRow {
  id: string;         
  name: string;     
  category: string;   
  price: string;     
  stock: string;      
  status: string;  
}

// 商品状态标签类型逻辑（适配商品状态）
const getStatusTagType = (status: string) => {
  switch (status) {
    case '已上架': return 'success'  
    case '已下架': return 'danger'   
    case '库存不足': return 'warning'
    case '待审核': return 'info'     
    default: return ''
  }
}

// 商品模拟数据
const tableData: TableRow[] = [
  {
    id: 'SP2025001',
    name: '夏季纯棉T恤',
    category: '服装/上衣',
    price: '99.00',
    stock: '120',
    status: '已上架'
  },
  {
    id: 'SP2025002',
    name: '无线蓝牙耳机',
    category: '数码/音频',
    price: '299.00',
    stock: '58',
    status: '已上架'
  },
  {
    id: 'SP2025003',
    name: '智能保温杯',
    category: '家居/日用品',
    price: '129.00',
    stock: '3',
    status: '库存不足'
  },
  {
    id: 'SP2025004',
    name: '机械键盘青轴',
    category: '数码/外设',
    price: '399.00',
    stock: '0',
    status: '已下架'
  },
  {
    id: 'SP2025005',
    name: '新款运动鞋',
    category: '鞋类/休闲',
    price: '499.00',
    stock: '80',
    status: '待审核'
  }
]
</script>

<style scoped>
::v-deep .el-tag--success {
  background-color: #f0f9ff;
  color: #52c41a;
  border-color: #b7eb8f;
}
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
