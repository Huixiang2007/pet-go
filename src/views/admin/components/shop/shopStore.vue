<template>
  <div class="shop-audit-container">
    <div class="page-header">
      <el-icon class="icon"><Shop /></el-icon>
      <h2>电商管理 - 商铺审核</h2>
    </div>

    <el-card shadow="hover" class="main-card">
      <el-tabs v-model="activeTab" class="cute-tabs" @tab-change="handleTabChange">
        <!-- 商铺总览 -->
        <el-tab-pane label="商铺总览" name="add">
          <div class="filter-bar">
            <el-input v-model="keyword" placeholder="搜索商铺名" class="w240" />
            <el-button type="primary"><Search /> 搜索</el-button>
          </div>

          <el-table :data="addList" border class="data-table">
            <el-table-column label="商铺ID" prop="id" />
            <el-table-column label="商铺名称" prop="shopName" />
            <el-table-column label="商铺类型">
              <template #default="scope">
                <el-tag :type="getShopTypeTag(scope.row.shopType)">{{ scope.row.shopType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="商铺简介" prop="description" />
            <el-table-column label="联系人" prop="contactName" />
            <el-table-column label="联系电话" prop="contactPhone" />
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="getShopStatusTag(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" type="primary" @click="goToDetail(scope.row.id)"
                  >查看</el-button
                >
                <!-- <el-button size="small" type="success">通过</el-button>
      <el-button size="small" type="danger">驳回</el-button> -->
              </template>
            </el-table-column>
           
          </el-table>
           <!-- 分页 -->
            <el-pagination
              class="pagination-wrapper"
              v-model:current-page="pageParams.pageNum"
              v-model:page-size="pageParams.pageSize"
              :total="total"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              style="text-align: right; margin-top: 50px"
            />
        </el-tab-pane>

        <!-- 更新商铺审核 -->
        <el-tab-pane label="商铺审核" name="update">
        
          <el-table :data="updateList" border class="data-table">
            <el-table-column label="商铺 ID" prop="id" />
            <el-table-column label="商铺名称" prop="shopName" />
            <el-table-column label="申请人" prop="contactName" />
            <el-table-column label="申请类型">
              <template #default="scope">
                <el-tag :type="getAuditTypeTag(scope.row.auditType)">
                  {{ scope.row.auditType == '添加审核' ? '新增商铺' : '更新商铺' }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="店铺类型" prop="shopType" />
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="getAuditStatusTag(scope.row.auditResult)">
                  {{ scope.row.auditResult }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" type="primary" @click="goToUpdateDetail(scope.row.id)"
                  >查看</el-button
                >
                <el-button
                  v-if="scope.row.auditStatus === 'pending'"
                  size="small"
                  type="success"
                  @click="handleAudit(scope.row.applyId, 'pass')"
                >
                  通过
                </el-button>
                <el-button
                  v-if="scope.row.auditStatus === 'pending'"
                  size="small"
                  type="danger"
                  @click="handleAudit(scope.row.applyId, 'reject')"
                >
                  驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pagination-wrapper"
            v-model:current-page="auditPageParams.pageNum"
            v-model:page-size="auditPageParams.pageSize"
            :total="auditTotal"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleAuditSizeChange"
            @current-change="handleAuditPageChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getShopPageList, getShopAuditList } from '@/api/admin/shop'
import { useRouter } from 'vue-router'
import type { PageParams } from '@/api/admin'
const activeTab = ref('add')

const keyword = ref('')
const router = useRouter()

const goToDetail = (id: string) => {
  router.push(`/admin/shop/detail?id=${id}`)
}
const goToUpdateDetail = (id: string) => { 
  router.push(`/admin/shop/audit?id=${id}`)
}

const addList = ref([])

// 分页参数
const pageParams = ref<PageParams>({
  pageNum: 1,
  pageSize: 10,
})

// 总条数
const total = ref(0)

// 更新商铺审核相关数据
const updateList = ref([])

const auditPageParams = ref<PageParams>({
  pageNum: 1,
  pageSize: 10,
})
const auditTotal = ref(0)
// 获取商铺列表
async function loadShopList() {
  try {
    const res = await getShopPageList(pageParams.value)
    addList.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (err) {
    console.error('获取商铺列表失败', err)
  }
}

// 获取商铺审核列表
async function loadAuditList() {
  try {
    const res = await getShopAuditList(auditPageParams.value)
    updateList.value = res.data.list || []
    auditTotal.value = res.data.total || 0

    // 处理状态文本映射
    updateList.value.forEach((item: any) => {
      if (item.auditStatus === '待审核') {
        item.auditStatusText = '待审核'
      } else if (item.auditStatus === '审核通过') {
        item.auditStatusText = '已通过'
      } else if (item.auditStatus === '审核不通过') {
        item.auditStatusText = '已驳回'
      }
    })
  } catch (err) {
    console.error('获取商铺审核列表失败', err)
    ElMessage.error('获取商铺审核列表失败')
  }
}

// 页面一加载就请求
onMounted(() => {
  loadShopList()
})
function handleTabChange() {
  if (activeTab.value === 'update') {
    loadAuditList()
  }
}

// 分页改变时重新请求
function handlePageChange(page: number) {
  pageParams.value.pageNum = page
  loadShopList()
}

// 每页条数改变
function handleSizeChange(size: number) {
  pageParams.value.pageSize = size
  loadShopList()
}
// 审核列表分页改变
function handleAuditPageChange(page: number) {
  auditPageParams.value.pageNum = page
  loadAuditList()
}

// 审核列表每页条数改变
function handleAuditSizeChange(size: number) {
  auditPageParams.value.pageSize = size
  loadAuditList()
}
// 获取商铺类型对应的标签颜色
function getShopTypeTag(type: string): 'success' | 'warning' | 'danger' | 'primary' {
  const typeMap: Record<string, 'success' | 'warning' | 'danger' | 'primary'> = {
    旗舰店: 'danger',
    专卖店: 'warning',
    企业店: 'success',
    个人店: 'primary',
  }
  return typeMap[type] || 'primary'
}

function getShopStatusTag(status: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
    未开业: 'primary', // 未开业 - 信息色
    正常营业: 'success', // 正常营业 - 成功色
    暂停营业: 'warning', // 暂停营业 - 警告色
    违规冻结: 'danger', // 违规冻结 - 危险色
    已注销: 'info', // 已注销 - 危险色
  }
  return statusMap[status] || 'info'
}
function getAuditStatusTag(status: string): 'success' | 'warning' | 'danger' | 'info' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    待审核: 'warning',
    审核通过: 'success',
    审核不通过: 'danger',
  }
  return statusMap[status] || 'info'
}
function getAuditTypeTag(status: string): 'success' | 'warning' {
  const statusMap: Record<string, 'success' | 'warning'> = {
    添加审核: 'warning',
    更新审核: 'success',
  }
  return statusMap[status] || 'success'
}
</script>

<style scoped lang="scss">
.shop-audit-container {
  padding: 20px;
  background: #faf6f0;
  min-height: 100vh;
}
.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #6b5b45;
}
.icon {
  color: #e8a87c;
  font-size: 24px;
}
.main-card {
  border-radius: 12px;
}
.cute-tabs {
  --el-tabs-active-color: #e8a87c;
}
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.data-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-bg-color: #fff9f2;
  border-radius: 8px;
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.data-table {
  --el-table-border-color: #e8d6c4;
  --el-table-header-text-color: rgb(107, 91, 69); /* 表头文字白色 */
  --el-table-header-bg-color: rgb(249, 247, 243); /* 表头暖橙色（加深） */
  // --el-table-row-hover-bg-color: #fff9f2;
  border-radius: 8px;
  overflow: hidden;
}

.data-table :deep(.el-table__cell) {
  text-align: center;
}
</style>
