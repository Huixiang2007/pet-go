<template>
  <div class="space-y-8">
    <!-- 基础信息 -->
    <div class="form-section">
      <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
        <i class="fa fa-info-circle mr-2 text-yellow-500"></i>基本信息
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-group">
          <label for="productSn" class="block text-sm font-medium text-yellow-800 mb-1">
            商品编码 <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="productSn"
            v-model="form.productSn"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入商品编码"
          />
        </div>
        <div class="form-group">
          <label for="title" class="block text-sm font-medium text-yellow-800 mb-1">
            商品名称 <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            v-model="form.title"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入商品名称"
          />
        </div>
        <div class="form-group">
          <label for="subTitle" class="block text-sm font-medium text-yellow-800 mb-1">
            商品副标题
          </label>
          <input
            type="text"
            id="subTitle"
            v-model="form.subTitle"
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入商品副标题"
          />
        </div>
        <div class="form-group">
          <label for="brandId" class="block text-sm font-medium text-yellow-800 mb-1">
            品牌ID
          </label>
          <input
            type="number"
            id="brandId"
            v-model.number="form.brandId"
            min="0"
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入品牌ID"
          />
        </div>
        <div class="form-group">
          <label for="typeParent" class="block text-sm font-medium text-yellow-800 mb-1">
            父分类ID <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="typeParent"
            v-model.number="form.typeParent"
            min="0"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入父分类ID"
          />
        </div>
        <div class="form-group">
          <label for="typeChild" class="block text-sm font-medium text-yellow-800 mb-1">
            子分类ID <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="typeChild"
            v-model.number="form.typeChild"
            min="0"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入子分类ID"
          />
        </div>
      </div>
    </div>

    <!-- 价格与库存 -->
    <div class="form-section">
      <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
        <i class="fa fa-tags mr-2 text-yellow-500"></i>商品价格与库存
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="form-group">
          <label for="currentPrice" class="block text-sm font-medium text-yellow-800 mb-1">
            销售价 (¥) <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="currentPrice"
            v-model.number="form.currentPrice"
            min="0"
            step="0.01"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.00"
          />
        </div>
        <div class="form-group">
          <label for="marketPrice" class="block text-sm font-medium text-yellow-800 mb-1">
            市场价 (¥)
          </label>
          <input
            type="number"
            id="marketPrice"
            v-model.number="form.marketPrice"
            min="0"
            step="0.01"
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.00"
          />
        </div>
        <div class="form-group">
          <label for="costPrice" class="block text-sm font-medium text-yellow-800 mb-1">
            成本价 (¥)
          </label>
          <input
            type="number"
            id="costPrice"
            v-model.number="form.costPrice"
            min="0"
            step="0.01"
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.00"
          />
        </div>
        <div class="form-group">
          <label for="stock" class="block text-sm font-medium text-yellow-800 mb-1">
            总库存 <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            v-model.number="form.stock"
            min="0"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0"
          />
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="form-section">
      <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
        <i class="fa fa-file-text-o mr-2 text-yellow-500"></i>商品描述
      </h3>
      <div class="form-group">
        <label for="detail" class="block text-sm font-medium text-yellow-800 mb-1">
          详细描述 <span class="text-red-500">*</span>
        </label>
        <textarea
          id="detail"
          v-model="form.detail"
          rows="6"
          required
          class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none resize-none"
          placeholder="请输入商品详细描述信息..."
        ></textarea>
      </div>
      <div class="form-group mt-4">
        <label for="warrantyTip" class="block text-sm font-medium text-yellow-800 mb-1">
          售后保障提示
        </label>
        <input
          type="text"
          id="warrantyTip"
          v-model="form.warrantyTip"
          class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
          placeholder="请输入售后保障提示（如“7天无理由退换”）"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

// 接收父组件的表单数据
interface ProductForm {
  productSn: string
  title: string
  subTitle: string
  brandId: number
  typeParent: number
  typeChild: number
  currentPrice: number
  marketPrice: number
  costPrice: number
  stock: number
  detail: string
  warrantyTip: string
}

const props = defineProps<{
  form: ProductForm
}>()

const emit = defineEmits<{
  (e: 'update:form', value: ProductForm): void
}>()

// 监听表单变化，同步到父组件
const updateForm = (key: keyof ProductForm, value: any) => {
  emit('update:form', { ...props.form, [key]: value })
}
</script>

<style scoped>
.form-section {
  padding: 10px 0;
}
.form-group {
  transition: all 0.3s ease;
}
.form-group:focus-within {
  transform: translateY(-2px);
}
</style>
