<template>
  <el-dialog
    :model-value="props.visible"
    @update:model-value="emit('update:visible', $event)"
    title="商品详情"
    width="90%"
    max-width="1200px"
    top="20px"
    close-on-click-modal
  >
    <div class="product-detail-container flex flex-col md:flex-row gap-6">
      <!-- 左侧图片区域 -->
      <div class="w-full md:w-1/3">
        <el-image
          :src="props.product.mainImage"
          :preview-src-list="props.product.imageList"
          fit="contain"
          class="w-full h-64 md:h-80 rounded-lg border border-gray-100"
          preview-teleported
        />
        <!-- 缩略图 -->
        <div class="flex gap-2 mt-4 overflow-x-auto pb-2" v-if="props.product.imageList.length">
          <div
            v-for="(img, index) in props.product.imageList"
            :key="index"
            class="w-16 h-16 rounded-md border border-gray-200 cursor-pointer"
            :class="{ 'border-blue-500': index === activeImgIndex }"
            @click="activeImgIndex = index"
          >
            <el-image :src="img" fit="cover" class="w-full h-full rounded-md" />
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 mt-4">暂无商品图片</div>
      </div>

      <!-- 右侧信息区域 -->
      <div class="w-full md:w-2/3">
        <!-- 商品标题 + 品牌 -->
        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-800">
            {{ props.product.productName || '暂无商品名称' }}
          </h3>
            <div class="text-gray-500 text-xs my-2">
            {{ props.product.subTitle || '' }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            品牌：{{ props.product.brandName || '暂无品牌' }}
          </div>
        </div>

        <!-- 价格区域（突出显示） -->
        <div class="bg-orange-50 p-4 rounded-lg mb-4">
          <div class="flex items-baseline gap-3">
            <span class="text-sm text-gray-500">销售价：</span>
            <span class="text-red-600 font-bold text-2xl">¥{{ props.product.currentPrice || props.product.price || 0 }}</span>
            <span class="text-sm text-gray-500 line-through">市场价：¥{{ props.product.marketPrice || 0 }}</span>
          </div>
        </div>

        <!-- 基础信息（分两列布局） -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-4 mb-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-center">
              <span class="w-28 text-gray-500">商品编号：</span>
              <span>{{ props.product.id || '暂无' }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-28 text-gray-500">商品分类：</span>
              <span>{{ props.product.productType || '暂无' }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-28 text-gray-500">商品货号：</span>
              <span>{{ props.product.productSn || '暂无' }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-28 text-gray-500">商品重量：</span>
              <span>{{ props.product.productWeight || 0 }} kg</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center">
              <span class="w-28 text-gray-500">库存数量：</span>
              <span :class="Number(props.product.stock) <= 0 ? 'text-red-600' : 'text-green-600'">
                {{ props.product.stock }} 件
              </span>
            </div>
            <div class="flex items-center">
              <span class="w-28 text-gray-500">库存状态：</span>
              <span :class="Number(props.product.stock) <= 0 ? 'text-red-600' : 'text-green-600'">
                {{ props.product.stockStatus || '未知' }}
              </span>
            </div>
            <div class="flex items-center">
              <span class="w-28 text-gray-500">商品状态：</span>
              <el-tag :type="getStatusTagType(props.product.status)" size="small">
                {{ props.product.status || '未知' }}
              </el-tag>
            </div>
            <div class="flex items-center">
              <span class="w-28 text-gray-500">上架时间：</span>
              <span>{{ props.product.shelfTime || '暂无' }}</span>
            </div>
          </div>
        </div>

        <!-- 销量/评价数据 -->
        <div class="flex gap-6 mb-4">
          <div class="text-center">
            <div class="text-gray-500 text-sm">销量</div>
            <div class="text-lg font-semibold">{{ props.product.sales || 0 }}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500 text-sm">评价数</div>
            <div class="text-lg font-semibold">{{ props.product.reviewCount || 0 }}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500 text-sm">商品评分</div>
            <div class="text-lg font-semibold text-orange-500">{{ props.product.productScore || 0 }}分</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500 text-sm">售后保障</div>
            <div class="text-lg font-semibold text-green-600">{{ props.product.warrantyTip || '暂无' }}</div>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="border-b border-gray-200 pb-4 mb-4">
          <h4 class="font-semibold text-gray-700 mb-2">商品描述</h4>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ props.product.detail || '暂无商品描述' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTag } from 'element-plus'

// 子组件 ProductDetail 类型
interface ProductDetail {
  id: string
  productName: string
  productType: string
  productSn: string
  price: string
  stock: number
  status: string
  shelfTime: string
  mainImage: string
  imageList: string[]
  params: { name: string; value: string }[]
  currentPrice: number
  stockStatus: string
  brandName: string
  marketPrice: number
  productWeight: number
  sales: number
  reviewCount: number
  productScore: number
  warrantyTip: string
  detail: string
  subTitle: string
}
// Props
const props = defineProps<{
  visible: boolean
  product: ProductDetail
}>()

const emit = defineEmits<{
  close: []
  edit: [product: ProductDetail]
  'update:visible': [value: boolean]
}>()

const activeImgIndex = ref(0)

// 简化的关闭处理
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 其他方法保持不变
const getStatusTagType = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  switch (status) {
    case '已上架':
      return 'success'
    case '已下架':
      return 'danger'
    case '库存不足':
      return 'warning'
    case '待审核':
      return 'info'
    default:
      return 'primary'
  }
}
</script>

<style scoped>
.product-detail-container {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

:deep(.el-image__preview) {
  z-index: 9999 !important;
}

.product-detail-container::-webkit-scrollbar {
  width: 6px;
}
.product-detail-container::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}
</style>
