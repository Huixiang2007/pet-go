<template>
  <div class="foster-audit-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-icon class="header-icon"><House /></el-icon>
      <h2>寄养服务管理 - 服务审核</h2>
    </div>

    <!-- 通用指标卡片（复用组件） -->
    <FosterStatsCard :cardData="cardData" />

    <!-- 服务审核内容区 -->
    <el-card class="main-content-card" shadow="hover">
      <!-- 筛选区 -->
      <div class="filter-bar">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-select
              v-model="auditStatus"
              placeholder="请选择审核状态"
              size="default"
              class="filter-select"
            >
              <el-option label="全部状态" value="all" />
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="passed" />
       
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="auditKeyword"
              placeholder="搜索寄养机构名称/联系人"
              size="default"
              prefix-icon="el-icon-search"
              class="search-input"
            />
          </el-col>
          <el-col :span="8" class="filter-btn-group">
            <el-button type="primary" size="default" class="query-btn" @click="fetchAuditList">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button size="default" class="reset-btn" @click="resetFilter">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
            <el-button size="default" class="export-btn" @click="exportData">
              <el-icon><Download /></el-icon> 导出
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 审核列表 -->
      <el-table
        :data="auditList"
        border
        stripe
        class="audit-table"
        :header-cell-style="{ background: '#f9f7f3', color: '#6b5b45' }"
        v-loading="loading"
      >
        <el-table-column prop="homeName" label="机构名称名称" min-width="120" />
        <el-table-column prop="contactName" label="联系人" width="140" />
        <el-table-column prop="contactPhone" label="联系电话" width="120">
          <template #default="scope">
            {{ scope.row.contactPhone || '暂无' }}
          </template>
        </el-table-column>

        <el-table-column prop="serviceType" label="类型" width="120" />
        <el-table-column prop="petTypes" label="服务类型" width="120">
          <template #default="scope">
            <el-tag 
              v-for="type in scope.row.petTypes" 
              :key="type" 
              size="small" 
              :class="getPetTypeClass(type)"
              style="margin-right: 5px; margin-top: 5px;"
            >
              {{ type === '猫' ? '猫咪寄养' : type === '狗' ? '狗狗寄养' :type === '魚' ? '鱼类寄养' 
              :type === '鸟' ? '鸟类寄养' :type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column prop="status" label="审核状态" width="100">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status === 'pending'
                  ? 'warning'
                  : scope.row.status === 'passed'
                    ? 'success'
                    : 'danger'
              "
              size="small"
              class="status-tag"
            >
              {{
                scope.row.status === 'pending'
                  ? '待审核'
                  : scope.row.status === 'passed'
                    ? '已通过'
                    : '已拒绝'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <!-- <el-button
              v-if="scope.row.status === 'pending'"
              type="success"
              size="small"
              class="pass-btn"
              @click="handlePass(scope.row)"
            >
              通过
            </el-button>
             <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              size="small"
              class="reject-btn"
              @click="handleReject(scope.row)"
            >
              拒绝
            </el-button> -->
            <el-button
              type="primary"
              size="small"
              icon="View"
              class="view-btn"
              @click="handleView(scope.row)"
            >
              详情
            </el-button>
           
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="auditTotal"
          class="foster-pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// 导入通用指标卡片组件
import FosterStatsCard from './FosterCard.vue'
import { getFosterListByCondition, getCardData } from '@/api/admin/foster'
import type { FosterInfo, fourCard } from '@/api/admin/foster'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 筛选条件
const auditStatus = ref('all')
const auditKeyword = ref('')
const loading = ref(false)
// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const auditTotal = ref(0)
const auditList = ref<FosterInfo[]>([])
const exportLoading = ref(false)

// 卡片数据
const cardData = ref<fourCard>({
  auditCount: 0,
  stayCount: 0,
  todayOrderCount: 0,
  chainGrowth: '',
  popularFosterProvider: '',
})
// 根据宠物类型获取对应的CSS类名
const getPetTypeClass = (type: string) => {
  if (type === '猫') {
    return 'cat-type-tag'
  } else if (type === '狗') {
    return 'dog-type-tag'
  }else if (type === '鸟') {
    return 'bird-type-tag'
  }else if (type === '魚') {
    return 'fish-type-tag'
  } else {
    return 'type-tag'
  }
}
const fetchAuditList = async () => {
  loading.value = true
  try {
    // 构造请求参数
    const params: any = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    }

    if (auditStatus.value === 'pending') {
      params.status = 0
    } else if (auditStatus.value === 'passed') {
      params.status = 1
    }

    // 如果有关键词搜索
    if (auditKeyword.value) {
      params.keyword = auditKeyword.value
    }

    const res = await getFosterListByCondition(params)
    console.log('获取审核列表成功:', res)
    if (res.code === 0 && res.data) {
      // 正确处理分页数据
      const records =  res.data.list || []
      auditList.value = records.map((item) => ({
        ...item,
        status: item.status === '待审核' ? 'pending' : item.status === '已审核' ? 'passed' : 'rejected',
        homeName: item.name,
        applyTime: item.createTime,
        serviceType: item.providerType,
        petTypes: Array.isArray(item.petTypes) 
          ? item.petTypes 
          : typeof item.petTypes === 'string' 
            ? (item.petTypes as string).split(',') 
            : []
      }))
      auditTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取审核列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取卡片数据
const fetchCardData = async () => {
  try {
    const res = await getCardData()
    console.log('获取卡片数据成功:', res)
    if (res.code === 0 && res.data) {
      cardData.value = {
        auditCount: res.data.auditCount || 0,
        stayCount: res.data.stayCount || 0,
        todayOrderCount: res.data.todayOrderCount || 0,
        chainGrowth: res.data.chainGrowth || '',
        popularFosterProvider: res.data.popularFosterProvider || ''
      }
    }
  } catch (error) {
    console.error('获取卡片数据失败:', error)
  }
}
// 重置搜索条件
const resetFilter = () => {
  auditStatus.value = ''
  auditKeyword.value = ''
  currentPage.value = 1
  fetchAuditList()
}

// 分页事件
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchAuditList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchAuditList()
}


// 初始化路由实例
const router = useRouter()


const handleView = (row: FosterInfo) => {
  // 1. 校验ID是否存在（避免无效跳转）
  if (!row.id) {
    ElMessage.warning('寄养方ID无效，无法查看详情')
    return
  }

  // 2. 跳转到详情页，并传递ID参数（关键：和详情页的 route.params.id 对应）
  router.push({
    path: '/foster/detail/' + row.id, // 方式1：路径拼接ID（推荐）
    
  })
}

watch([auditStatus, auditKeyword], () => {
  currentPage.value = 1
  fetchAuditList()
})

// 组件挂载时获取数据
onMounted(() => {
  fetchCardData()
  fetchAuditList()
})
const exportData = async () => {
  exportLoading.value = true
  try {
    // 显示导出加载状态
   
    
    // 获取当前筛选条件下的所有数据
    const params: any = {
      pageNum: 1,
      pageSize: 9999, // 获取所有数据
    }

    if (auditStatus.value === 'pending') {
      params.status = 0
    } else if (auditStatus.value === 'passed') {
      params.status = 1
    }

    // 如果有关键词搜索
    if (auditKeyword.value) {
      params.keyword = auditKeyword.value
    }

    const res = await getFosterListByCondition(params)
    
    if (res.code === 0 && res.data) {
      const records = res.data.list || []
      const exportList = records.map((item: any) => ({
        ...item,
        status: item.status === '待审核' ? '待审核' : item.status === '已审核' ? '已通过' : '已拒绝',
        homeName: item.name,
        applyTime: item.createTime,
        serviceType: item.providerType,
        petTypes: Array.isArray(item.petTypes) 
          ? item.petTypes.join(', ')
          : typeof item.petTypes === 'string' 
            ? item.petTypes
            : ''
      }))
      
      // 创建 CSV 内容
      const csvContent = convertToCSV(exportList);
      
      // 下载 CSV 文件
      downloadCSV(csvContent, '寄养服务机构审核列表.csv');
      
      ElMessage.success('导出成功');
    } else {
      throw new Error('数据获取失败');
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请重试');
  } finally {
    // 恢复按钮状态
   exportLoading.value = false;
  }
};

// 将数据转换为 CSV 格式
const convertToCSV = (data: any[]) => {
  if (!data.length) return '';
  
  // 定义表头
  const headers = ['机构名称', '联系人', '联系电话', '类型', '服务类型', '申请时间', '审核状态'];
  
  // 添加表头
  const csvRows = [
    headers.join(',')
  ];
  
  // 添加数据行
  for (const row of data) {
    const values = [
      `"${row.homeName || ''}"`,
      `"${row.contactName || ''}"`,
      `"${row.contactPhone || ''}"`,
      `"${row.serviceType || ''}"`,
      `"${row.petTypes || ''}"`,
      `"${row.applyTime || ''}"`,
      `"${row.status || ''}"`
    ];
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// 下载 CSV 文件
const downloadCSV = (csvContent: string, filename: string) => {
  // 添加 BOM 以支持中文
  const BOM = '\uFEFF';
  const csvBlob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(csvBlob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

</script>

<style scoped lang="scss">
:deep(.el-table .el-table__cell) {
  text-align: center;
}
.foster-audit-container {
  padding: 20px;
  background-color: #faf6f0;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .header-icon {
    font-size: 26px;
    color: #e8a87c;
    margin-right: 10px;
  }

  h2 {
    margin: 0;
    color: #6b5b45;
    font-weight: 600;
  }
}

.filter-bar {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff9f2;
  border-radius: 8px;

  .filter-select,
  .search-input {
    border-radius: 6px;
    border-color: #e8d6c4;
  }

  .filter-btn-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    .query-btn {
      background-color: #e8a87c;
      border-color: #e8a87c;
      border-radius: 6px;
    }

    .reset-btn,
    .export-btn {
      border-radius: 6px;
      border-color: #e8d6c4;
      color: #6b5b45;
    }
  }
}

.main-content-card {
  border-radius: 12px;
  border: none;
  background-color: #fff;
}

.audit-table {
  --el-table-border-color: #e8d6c4;
  --el-table-hover-row-bg-color: #fff9f2;
  border-radius: 8px;
  overflow: hidden;

  .home-name-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .home-avatar {
      width: 30px;
      height: 30px;
      border: 1px solid #f0e6dc;
    }
  }

  .type-tag {
    background-color: #f0fff4;
    color: #28a745;
    border-radius: 6px;
  }
  .cat-type-tag {
    background-color: #fff0f5; /* 粉红色背景 */
    color: #ff69b4; /* 粉色文字 */
    border-radius: 6px;
    border-color: #fbd1e6;
  }
   .bird-type-tag {
  background-color: #bdc4f34a;
    color: #655ae6de;
    border-radius: 6px;
    border-color: #c2c9ec;

  }
  .fish-type-tag {
    background-color: #f6dcb652; 
    color: #ec895f; /* 粉色文字 */
    border-radius: 6px;
    border-color: #f4c682;
  }

  .dog-type-tag {
    background-color: #f0f8ff; /* 淡蓝色背景 */
    color: #1e90ff; /* 蓝色文字 */
    border-radius: 6px;
  }
  .status-tag {
    border-radius: 6px;
  }

  .view-btn {
    background-color: #c3e6cb;
    border-color: #c3e6cb;
    color: #28a745;
    border-radius: 6px;
  }

  .pass-btn {
    background-color: #d4edda;
    border-color: #d4edda;
    color: #155724;
    border-radius: 6px;
  }

  .reject-btn {
    margin-top: 10px;
    margin-left: 0px;
    background-color: #f8d7da;
    border-color: #f8d7da;
    color: #721c24;
    border-radius: 6px;
  }
}

// 分页（与原风格统一）
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .foster-pagination {
    --el-pagination-button-bg-color: #fff;
    --el-pagination-button-border-color: #e8d6c4;
    --el-pagination-text-color: #6b5b45;
    --el-pagination-active-color: #e8a87c;
  }
}
</style>
