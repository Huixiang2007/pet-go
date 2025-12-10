<template>
  <el-dialog
     v-model="isVisible"
    title="商品详情"
    width="90%"
    max-width="1200px"
    top="20px"
    close-on-click-modal
  >
    <div class="product-detail-container flex flex-col md:flex-row gap-6">
      <div class="w-full md:w-1/3">
        <el-image
          :src="props.product.mainImage"
          :preview-src-list="props.product.imageList"
          fit="contain"
          class="w-full h-64 md:h-80 rounded-lg border border-gray-100"
          preview-teleported
        />
        <!-- 缩略图 -->
        <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
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
      </div>

      <!-- 右侧商品信息区域 -->
      <div class="w-full md:w-2/3">
        <!-- 基础信息 -->
        <div class="border-b border-gray-200 pb-4 mb-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ props.product.name }}</h3>
          <div class="flex flex-col gap-2 text-sm text-gray-600">
            <div class="flex items-center">
              <span class="w-24 text-gray-500">商品编号：</span>
              <span>{{ props.product.id }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-gray-500">商品分类：</span>
              <span>{{ props.product.category }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-gray-500">销售价格：</span>
              <span class="text-red-600 font-bold text-lg">¥{{ props.product.price }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-gray-500">库存数量：</span>
              <span :class="Number(props.product.stock) <= 0 ? 'text-red-600' : 'text-green-600'">
                {{ props.product.stock }} 件
              </span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-gray-500">商品状态：</span>
              <el-tag :type="getStatusTagType(props.product.status)" size="small">
                {{ props.product.status }}
              </el-tag>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-gray-500">上架时间：</span>
              <span>{{ props.product.shelfTime }}</span>
            </div>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="border-b border-gray-200 pb-4 mb-4">
          <h4 class="font-semibold text-gray-700 mb-2">商品描述</h4>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ props.product.desc }}
          </p>
        </div>

        <!-- 商品参数 -->
        <div>
          <h4 class="font-semibold text-gray-700 mb-2">商品参数</h4>
          <el-table :data="props.product.params" stripe size="small" class="mt-2">
            <el-table-column prop="name" label="参数名称" width="120" />
            <el-table-column prop="value" label="参数值" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <el-button @click="emit('close')">关闭</el-button>
      <el-button type="primary" @click="emit('edit', props.product)">编辑商品</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch} from 'vue'
import { ElTag } from 'element-plus'


interface TableRow {
  id: string
  name: string
  category: string
  price: string
  stock: string
  status: string
}

interface ProductDetail extends TableRow {
  mainImage: string
  imageList: string[]
  shelfTime: string
  desc: string
  params: { name: string; value: string }[]
}

// Props
const props = defineProps<{
  visible: boolean
  product: ProductDetail
}>()

// Emits
const emit = defineEmits<{
  close: []
  edit: [product: ProductDetail]
}>()

const activeImgIndex = ref(0)
const isVisible = ref(props.visible)

// 监听props变化
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
})

// 获取状态标签类型
const getStatusTagType = (status: string) => {
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
      return
  }
}
</script>

<style scoped>
.product-detail-container {
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.el-image__preview) {
  z-index: 9999 !important;
}
</style>
