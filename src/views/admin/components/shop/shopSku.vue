<template>
  <div class="sku-audit-container">
    <div class="page-header">
      <el-icon class="icon"><Box /></el-icon>
      <h2>电商管理 - SKU 审核</h2>
    </div>

    <el-card shadow="hover" class="main-card">
      <el-tabs v-model="activeTab" class="cute-tabs"  @tab-change="handleTabChange">
        <el-tab-pane label="SKU列表" name="add">
          <el-table :data="addList" border class="data-table">
            <el-table-column label="Sku编号" prop="skuSn" />
            <el-table-column label="Sku规格" prop="specText" />
            <el-table-column label="Sku价格" prop="price" />
            <el-table-column label="Sku成本价" prop="costPrice" />
            <el-table-column label="库存" prop="stock" />
            <el-table-column label="累计销量" prop="sales" />
             <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="getStatusTag(scope.row.status)">
                  {{ getDisplayStatus(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  v-if="scope.row.status !== '下架'"

                  type="primary"
                  size="small"
                  icon="View"
                  class="view-btn"
                  @click="goToDetail(scope.row.skuId)"
                >
                  查看
                </el-button>
              </template>

             
            </el-table-column>
          </el-table>
           <el-pagination
              class="pagination-wrapper"
              v-model:current-page="pageParams.pageNum"
              v-model:page-size="pageParams.pageSize"
              :total="totalNum"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              style="text-align: right; margin-top: 50px"
            />
        </el-tab-pane>

        <el-tab-pane label="SKU审核" name="update">
          <el-table :data="updateList" border class="data-table">
            <el-table-column label="SkuID" prop="skuId" />
            <el-table-column label="Sku规格" prop="specText" />
             <el-table-column label="Sku价格" prop="price" />
            <el-table-column label="Sku成本价" prop="costPrice" />
             <el-table-column label="库存" prop="stock" /> 
            <el-table-column label="创建时间" prop="createTime" />
 <el-table-column label="申请类型">
              <template #default="scope">
                <el-tag :type="getAuditTypeTag(scope.row.auditType)">
                  {{ scope.row.auditType  }}</el-tag
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
                <el-button
                  type="primary"
                  size="small"
                  icon="View"
                  class="view-btn"
                  @click="goToAuditDetail(scope.row.id)"
                >
                  查看
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
            style="text-align: right; margin-top: 20px"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref ,onMounted} from 'vue'
import { getSkuList,getSkuAuditList } from '@/api/admin/shop'
import type { PageParams } from '@/api/admin'
import { useRouter } from 'vue-router'
const router = useRouter()
const goToDetail = (skuId: string) => {
  router.push(`/admin/shop/style?id=${skuId}`)
}

const goToAuditDetail = (id: string) => {
  router.push(`/admin/shop/specific?id=${id}`)
}
const activeTab = ref('add')

const addList = ref([])
// 分页参数
const pageParams = ref<PageParams>({
  pageNum: 1,
  pageSize: 10,
})

// 总条数
const totalNum = ref(0)
const updateList = ref([])

const auditPageParams = ref<PageParams>({
  pageNum: 1,
  pageSize: 10,
})
const auditTotal = ref(0)
// 获取sku列表
async function loadSkuList() {
  try {
    const res = await getSkuList(pageParams.value)
    const { list, total } = res.data as any; 
    addList.value = list || []
    totalNum.value = total || 0
  } catch (err) {
    console.error('获取商铺列表失败', err)
  }
}
//获取sku审批列表
async function auditSkuList() {
  try {
    const res = await getSkuAuditList(pageParams.value)
    const { list, total } = res.data as any; 
    updateList.value = list
    auditTotal.value = total
  } catch (error) {
    console.log(error)
  }
}


onMounted(()=>{
  loadSkuList()
})
function handleTabChange() {
  if (activeTab.value === 'update') {
    auditSkuList()
  }
}
function getStatusTag(status: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
    待审核: 'warning',
    上架: 'success',
    审核通过: 'primary',
    审核失败: 'danger',
    下架: 'info',
    缺货:'info'
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
function getDisplayStatus(status: string): string {
  if (status === '上架') {
    return '已上架'
  } else if (status === '下架') {
    return '已下架'
  }
  return status
}
function getAuditTypeTag(status: string): 'success' | 'primary' {
  const statusMap: Record<string, 'success' | 'primary'> = {
    添加审核: 'primary',
    更新审核: 'success',
  }
  return statusMap[status] || 'success'
}
// 分页改变时重新请求
function handlePageChange(page: number) {
  pageParams.value.pageNum = page
  loadSkuList()
}

// 每页条数改变
function handleSizeChange(size: number) {
  pageParams.value.pageSize = size
  loadSkuList()
}
// 审核列表分页改变
function handleAuditPageChange(page: number) {
  auditPageParams.value.pageNum = page
  auditSkuList()
}

// 审核列表每页条数改变
function handleAuditSizeChange(size: number) {
  auditPageParams.value.pageSize = size
  auditSkuList()
}

</script>

<style scoped lang="scss">
.sku-audit-container { padding: 20px; background: #faf6f0; min-height: 100vh; }
.page-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #6b5b45; }
.icon { color: #e8a87c; font-size: 24px; }
.main-card { border-radius: 12px; }
.cute-tabs { --el-tabs-active-color: #e8a87c; }
.data-table { --el-table-border-color: #e8d6c4; --el-table-hover-bg-color: #fff9f2; border-radius: 8px; }
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.view-btn {
  border-radius: 6px;
  margin: 2px 2px; // 统一按钮间距，删除冗余的 margin-top
}

.view-btn {
  background-color: #cce5ff;
  border-color: #cce5ff;
  color: #007bff;
}
</style>