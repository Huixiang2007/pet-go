<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />
      <div class="flex-1 overflow-auto p-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="flex flex-row justify-between items-center border-b border-gray-200 px-4 py-3 mb-3">
            <div class="text-lg font-bold text-gray-800">优惠券管理</div>
            <div class="flex flex-row gap-3">
              <el-input
                placeholder="请输入优惠券名称/编号"
                v-model="searchInput"
                clearable
                style="width: 200px"
              >
                <template #prefix>
                  <i class="fas fa-search text-md text-gray-300"></i>
                </template>
              </el-input>
              <el-button size="default" type="primary">搜索</el-button>
              <el-button size="default" type="success" icon="Plus">
                新增优惠券
              </el-button>
            </div>
          </div>

          <el-table
            :data="couponList"
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
            <el-table-column prop="id" label="优惠券编号" width="120" />
            <el-table-column prop="name" label="优惠券名称" />
            <el-table-column prop="value" label="优惠金额" width="120">
              <template #default="scope">
                {{ scope.row.type === '满减券' ? `满${scope.row.condition}减${scope.row.value}` : `打${scope.row.value}折` }}
              </template>
            </el-table-column>
            <el-table-column prop="total" label="总发行量" width="100" />
            <el-table-column prop="used" label="已使用" width="100" />
            <el-table-column prop="startTime" label="开始时间" width="160" />
            <el-table-column prop="endTime" label="结束时间" width="160" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default>
                <div class="flex gap-2">
                  <el-button size="mini" type="text" class="text-blue-600">编辑</el-button>
                  <el-button size="mini" type="text" class="text-green-600">启用</el-button>
                  <el-button size="mini" type="text" class="text-red-600">禁用</el-button>
                </div>
              </template>
            </el-table-column>

            <template #empty>
              <div class="py-10 flex flex-col items-center justify-center text-gray-400">
                <i class="fas fa-ticket-alt text-4xl mb-3"></i>
                <div class="text-lg">暂无优惠券数据</div>
                <div class="text-sm mt-1">点击"新增优惠券"创建优惠活动</div>
              </div>
            </template>
          </el-table>

          <!-- 分页 -->
          <div class="px-4 py-3 border-t border-gray-200 flex justify-between items-center mt-3">
            <div class="text-sm text-gray-500">共 {{ couponList.length }} 张优惠券</div>
            <el-pagination
              layout="prev, pager, next"
              :total="100"
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

// 搜索输入
const searchInput = ref('')

// 优惠券数据类型
interface Coupon {
  id: string
  name: string
  value: string 
  condition: string
  total: string 
  used: string 
  startTime: string
  endTime: string
  status: '未开始' | '生效中' | '已过期' | '已禁用'
}

// 状态样式映射
const getStatusType = (status: string) => {
  switch (status) {
    case '生效中': return 'success'
    case '未开始': return 'info'
    case '已过期': return 'warning'
    case '已禁用': return 'danger'
    default: return ''
  }
}

// 模拟数据
const couponList: Coupon[] = [
  {
    id: 'CP2025001',
    name: '新人专享券',
    value: '20',
    condition: '100',
    total: '1000',
    used: '782',
    startTime: '2025-01-01',
    endTime: '2025-12-31',
    status: '生效中'
  },
  {
    id: 'CP2025002',
    name: '周末特惠折扣',
    value: '8.5',
    condition: '',
    total: '500',
    used: '129',
    startTime: '2025-06-01',
    endTime: '2025-06-30',
    status: '已过期'
  },
  {
    id: 'CP2025003',
    name: '会员专属满减',
    value: '50',
    condition: '200',
    total: '300',
    used: '0',
    startTime: '2025-11-01',
    endTime: '2025-11-30',
    status: '未开始'
  },
  {
    id: 'CP2025004',
    name: '清仓折扣券',
    value: '7',
    condition: '',
    total: '200',
    used: '56',
    startTime: '2025-09-01',
    endTime: '2025-09-15',
    status: '已禁用'
  }
]
</script>

<style scoped>
::v-deep .el-tag--success {
  background-color: #f0f9ff;
  color: #52c41a;
  border-color: #b7eb8f;
}
::v-deep .el-tag--info {
  background-color: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}
::v-deep .el-tag--warning {
  background-color: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}
::v-deep .el-tag--danger {
  background-color: #fff2f0;
  color: #f5222d;
  border-color: #ffccc7;
}
::v-deep .el-table__row--striped td {
  background-color: #fafafa !important;
}
</style>