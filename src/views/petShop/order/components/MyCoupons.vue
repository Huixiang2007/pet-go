<template>
  <div class="my-coupons min-h-screen bg-[#fffbeb] p-5 mt-[-31px];">
    <!-- 搜索框 -->
    <div class="search-section mb-5">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索优惠券名称"
        clearable
        @keyup.enter="handleSearch"
        class="search-input max-w-md rounded-lg shadow-sm"
      >
        <template #append>
          <el-button
            @click="handleSearch"
            type="primary"
            class="bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600"
          >
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 筛选标签 -->
    <div class="flex gap-3 mb-5">
      <button
        @click="activeFilter = 'all'"
        :class="activeFilter === 'all' ? 'btn-filter-active' : 'btn-filter'"
      >
        全部
      </button>
      <button
        @click="activeFilter = 'unused'"
        :class="activeFilter === 'unused' ? 'btn-filter-active' : 'btn-filter'"
      >
        未使用
      </button>
      <button
        @click="activeFilter = 'used'"
        :class="activeFilter === 'used' ? 'btn-filter-active' : 'btn-filter'"
      >
        已使用
      </button>
      <button
        @click="activeFilter = 'expired'"
        :class="activeFilter === 'expired' ? 'btn-filter-active' : 'btn-filter'"
      >
        已过期
      </button>
    </div>

    <!-- 优惠券列表 -->
    <div v-if="showList.length > 0" class="coupon-list space-y-4">
      <div
        v-for="coupon in showList"
        :key="coupon.id"
        class="coupon-item flex justify-between items-center p-5 bg-white rounded-xl border border-amber-100 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
        @click="handleViewDetail(coupon)"
      >
        <div class="coupon-content flex items-center flex-1">
          <div class="coupon-value text-3xl font-bold text-amber-500 mr-6 min-w-[90px] text-center">
            {{ coupon.discountType === '满减' ? '¥' : '' }}{{ coupon.discount }}
            {{ coupon.discountType === '折扣' ? '折' : '' }}
          </div>
          <div class="coupon-info flex-1">
            <h4 class="text-lg font-semibold text-gray-800 mb-1">{{ coupon.couponName }}</h4>
            <p v-if="coupon.minAmount > 0" class="text-amber-600 text-sm font-medium">
              满{{ coupon.minAmount }}元可用
            </p>
            <p class="text-xs text-gray-400 mt-1">适用店铺：{{ coupon.usedToShopName }}</p>
            <p class="text-xs text-gray-400 mt-1">适用商品：{{ coupon.usedToProductTypeName }}</p>
          </div>

          <!-- 状态标签 -->
          <div class="ml-4">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-medium"
              :class="[
                coupon.status === 'unused'
                  ? 'bg-green-50 text-green-600'
                  : coupon.status === 'used'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-50 text-gray-500',
              ]"
            >
              {{
                coupon.status === 'unused'
                  ? '未使用'
                  : coupon.status === 'used'
                    ? '已使用'
                    : '已过期'
              }}
            </span>
          </div>
        </div>
        <!-- 删除按钮 -->
        <div class="coupon-actions ml-4">
          <el-button
            type="text"
            @click.stop="handleDeleteCoupon(coupon.userCouponId)"
            class="text-gray-400 hover:text-red-500"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="py-16 text-center bg-white rounded-xl shadow-sm">
      <el-empty description="暂无优惠券" :image-size="120" />
      <el-button
        type="primary"
        @click="goToCouponCenter"
        class="mt-4 bg-amber-500 border-amber-500 hover:bg-amber-600"
      >
        去领券中心
      </el-button>
    </div>

    <!-- 分页组件 -->
    <div v-if="allCoupons.length > 0" class="mt-8 flex justify-center">
      <el-pagination
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        :total="allCoupons.length"
        :page-sizes="[10, 20, 30]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
        class="custom-pagination"
      />
    </div>

    <!-- 详情弹窗 -->
    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="优惠券详情" width="500px" destroy-on-close>
      <div v-if="currentCoupon" class="py-2">
        <div class="flex justify-between items-center mb-5 pb-4 border-b">
          <h3 class="text-lg font-semibold">{{ currentCoupon.couponName }}</h3>
          <div class="text-3xl font-bold text-amber-500">
            {{ currentCoupon.discountType === '满减' ? '¥' : '' }}{{ currentCoupon.discount }}
            {{ currentCoupon.discountType === '折扣' ? '折' : '' }}
          </div>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex">
            <span class="w-20 text-gray-500">类型：</span>
            <span class="text-gray-800">{{
              currentCoupon.discountType === '满减' ? '满减券' : '折扣券'
            }}</span>
          </div>
          <div class="flex" v-if="currentCoupon.minAmount > 0">
            <span class="w-20 text-gray-500">使用条件：</span>
            <span class="text-gray-800">满{{ currentCoupon.minAmount }}元可用</span>
          </div>
          <div class="flex">
            <span class="w-20 text-gray-500">有效期：</span>
            <span class="text-gray-800"
              >{{ formatDate(currentCoupon.startTime) }} ~
              {{ formatDate(currentCoupon.endTime) }}</span
            >
          </div>
          <div class="flex">
            <span class="w-20 text-gray-500">适用店铺：</span>
            <span class="text-gray-800">{{ currentCoupon.usedToShopName }}</span>
          </div>
          <div class="flex">
            <span class="w-20 text-gray-500">适用商品：</span>
            <span class="text-gray-800">{{ currentCoupon.usedToProductTypeName }}</span>
          </div>
          <div class="flex">
            <span class="w-20 text-gray-500">状态：</span>
            <span class="text-gray-800">{{ currentCoupon.status }}</span>
          </div>
          <div class="flex flex-col">
            <span class="w-20 text-gray-500 mb-1">说明：</span>
            <span class="text-gray-800">{{ currentCoupon.description || '暂无说明' }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getReceiveCouponList, deleteMyCoupon, getCouponDetail } from '@/api/pet-shop/coupos'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const allCoupons = ref([])
const searchKeyword = ref('')
const detailDialogVisible = ref(false)
const currentCoupon = ref(null)

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选状态
const activeFilter = ref('all')

const showList = computed(() => {
  let list = Array.isArray(allCoupons.value) ? [...allCoupons.value] : []

  if (searchKeyword.value) {
    const key = searchKeyword.value.toLowerCase()
    list = list.filter((item) => item.couponName?.toLowerCase().includes(key))
  }

  if (activeFilter.value !== 'all') {
    list = list.filter((item) => item.status === activeFilter.value)
  }

  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return list.slice(startIndex, endIndex)
})

// 格式化时间
const formatDate = (str) => {
  if (!str) return ''
  return new Date(str).toLocaleString('zh-CN')
}

// 加载优惠券列表
const loadUserCoupons = async () => {
  try {
    const params = {
      searchCount: true,
      pageNum: 1,
      pageSize: 30,
      current: 1,
      sortItemList: [{ isAsc: true, column: 'createTime' }],
    }
    const res = await getReceiveCouponList(params)
    if (res.ok) {
      console.log('优惠券列表接口返回:', res.data)
      allCoupons.value = res.data?.list || []
    }
  } catch (e) {
    console.error('加载失败:', e)
    ElMessage.error('加载失败')
    allCoupons.value = []
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

// 查看详情
const handleViewDetail = async (coupon) => {
  try {
    currentCoupon.value = null
    detailDialogVisible.value = true

    const res = await getCouponDetail(coupon.id)
    if (res.ok) {
      console.log('优惠券详情接口返回:', res.data)
      currentCoupon.value = res.data
    }
  } catch (e) {
    console.error('获取详情失败:', e)
    detailDialogVisible.value = false
  }
}

// 删除
const handleDeleteCoupon = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除？')
    const res = await deleteMyCoupon([id])
    console.log('删除优惠券接口返回:', res)
    if (res.ok) {
      ElMessage.success('删除成功')
      loadUserCoupons()
    }
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

// 去领券
const goToCouponCenter = () => router.push('/shop/coupon-center')

onMounted(() => loadUserCoupons())
</script>

<style scoped>
.btn-filter {
  @apply px-4 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-gray-600 cursor-pointer transition-all;
}
.btn-filter-active {
  @apply px-4 py-1.5 rounded-full text-sm bg-amber-500 text-white border border-amber-500 cursor-pointer;
}

/* 分页组件美化 */
:deep(.custom-pagination .el-pagination) {
  @apply flex justify-center items-center gap-2;
}
:deep(.custom-pagination .el-pager li) {
  @apply bg-white border border-gray-200 rounded-lg;
}
:deep(.custom-pagination .el-pager li.active) {
  @apply bg-amber-500 border-amber-500 text-white;
}
:deep(.custom-pagination .el-select__wrapper) {
  @apply bg-white rounded-lg;
}
</style>
