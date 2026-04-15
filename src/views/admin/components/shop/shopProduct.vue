<template>
  <div class="goods-audit-container">
    <div class="page-header">
      <el-icon class="icon"><Goods /></el-icon>
      <h2>电商管理 - 商品审核</h2>
    </div>

    <el-card shadow="hover" class="main-card" >
      <el-tabs v-model="activeTab" class="cute-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="商品列表" name="add">
          <el-table :data="addList" border class="data-table">
            <el-table-column label="商品ID" prop="id" />
            <el-table-column label="商品标题" prop="title" />
            <el-table-column label="商品副标题" prop="subTitle" />
            <el-table-column label="商品分类" prop="brandId" />
            <el-table-column label="市场价(元)" prop="marketPrice" />
            <el-table-column label="累计销量" prop="sales" />
            <el-table-column label="商品评分" prop="productScore" />
            <el-table-column label="商品状态">
              <template #default="scope">
                <el-tag :type="getStatusTag(scope.row.status)">
                 {{ getDisplayStatus(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="scope">
                <el-button
                  v-if="scope.row.status !== '下架(审核不通过或主动下架)'"

                  type="primary"
                  size="small"
                  icon="View"
                  class="view-btn"
                  @click="toProductDetail(scope.row.id)"
                >
                  查看
                </el-button>

                <el-button
                  v-if="scope.row.status !== '下架(审核不通过或主动下架)'"
                  type="danger"
                  size="small"
                  icon="Delete"
                  class="del-btn"
                  @click="deleteGoods(scope.row.id)"
                >
                  下架
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            class="pagination-wrapper"
            v-model:current-page="pageParams.pageNum"
            v-model:page-size="pageParams.pageSize"
            :total="totalNum"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            style="text-align: right; margin-top: 20px"
          />
        </el-tab-pane>

        <el-tab-pane label="商品审核" name="update">
          <el-table :data="updateList" border class="data-table">
            <el-table-column label="商品ID" prop="productId" />
           <el-table-column label="商品标题" prop="title" />
            <el-table-column label="商品副标题" prop="subTitle" />
             <el-table-column label="成本价(元)" prop="costPrice" />
              <el-table-column label="销售价(元)" prop="currentPrice" />
            <el-table-column label="申请类型">
              <template #default="scope">
                <el-tag :type="getAuditTypeTag(scope.row.auditType)">
                  {{ scope.row.auditType == '添加审核' ? '新增商品' : '更新商品' }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="getAuditStatusTag(scope.row.auditResult)">
                  {{ scope.row.auditResult }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">

              <el-button size="small" type="primary"  @click="goToProductDetail(scope.row.id)">查看</el-button>
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
            style="text-align: right; margin-top: 20px"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProductList,deleteProduct,getProductAuditList } from '@/api/admin/shop'
import type { ProductInfo, ProductAudit} from '@/api/admin/shop'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { PageParams } from '@/api/admin'
import { useRouter } from 'vue-router'
const addList =ref<ProductInfo[]>([])
const activeTab = ref('add')
const router = useRouter()
// 分页参数
const pageParams = ref<PageParams>({
  pageNum: 1,
  pageSize: 10,
})
const updateList = ref<ProductAudit[]>([])

const auditPageParams = ref<PageParams>({
  pageNum: 1,
  pageSize: 10,
})
const auditTotal = ref(0)

// 总条数
const totalNum = ref(0)
//获取商品列表
async function loadProductList() {
  try {
    const res = await getProductList(pageParams.value)

    
     const { list, total } = res.data as any;

    addList.value = list;
    totalNum.value = total;
  } catch (error) {
    console.log(error)
  }
}

//获取商品审批列表
async function auditProductList() {
  try {
    const res = await getProductAuditList(auditPageParams.value)
    const { list, total } = res.data as any; 
    updateList.value = list
    auditTotal.value = total
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  loadProductList()
})
function handleTabChange() {
  if (activeTab.value === 'update') {
    auditProductList()
  }
}
//删除商品
const deleteGoods = (id: string) => {
   ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteProduct(id).then(() => {
      ElMessage.success('删除成功')
      loadProductList()
    })
  })
}
// 分页改变时重新请求
function handlePageChange(page: number) {
  pageParams.value.pageNum = page
  loadProductList()
}

// 每页条数改变
function handleSizeChange(size: number) {
  pageParams.value.pageSize = size
  loadProductList()
}
// 审核列表分页改变
function handleAuditPageChange(page: number) {
  auditPageParams.value.pageNum = page
  auditProductList()
}

// 审核列表每页条数改变
function handleAuditSizeChange(size: number) {
  auditPageParams.value.pageSize = size
  auditProductList()
}
function getStatusTag(status: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
    待审核: 'warning',
    上架: 'success',
    审核通过: 'primary',
    审核失败: 'danger',
    下架: 'info',
  }
  return statusMap[status] || 'info'
}
function getDisplayStatus(status: string): string {
  if (status === '上架') {
    return '已上架'
  } else if (status === '下架(审核不通过或主动下架)') {
    return '已下架'
  }
  return status
}
function getAuditTypeTag(status: string): 'success' | 'warning' {
  const statusMap: Record<string, 'success' | 'warning'> = {
    添加审核: 'warning',
    更新审核: 'success',
  }
  return statusMap[status] || 'success'
}
function getAuditStatusTag(status: string): 'success' | 'warning' | 'danger' | 'info' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    待审核: 'warning',
    审核通过: 'success',
    审核不通过: 'danger',
  }
  return statusMap[status] || 'info'
}

const toProductDetail = (id: string) => {
  router.push(`/admin/shop/goods?id=${id}`)
}

const goToProductDetail = (id: string) => { 
  router.push(`/admin/shop/update?id=${id}`)
}
</script>

<style scoped lang="scss">
.goods-audit-container {
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
.data-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-bg-color: #fff9f2;
  border-radius: 8px;
}
// 按钮样式统一
.view-btn,
.del-btn {
  border-radius: 6px;
  margin: 2px 2px; // 统一按钮间距，删除冗余的 margin-top
}

.view-btn {
  background-color: #cce5ff;
  border-color: #cce5ff;
  color: #007bff;
}

.del-btn {
  background-color: #fff3cd;
  border-color: #fff3cd;
  color: #856404;
}
.pagination-wrapper {
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
