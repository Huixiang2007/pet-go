<template>
  <main class="bg-yellow-50 min-h-screen">
    <div class="p-8 px-16 flex-grow">
      <div class="mb-8">
        <h2 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-yellow-900 flex items-center">
          <i class="fa fa-cube mr-3 text-yellow-600"></i>
          添加新商品
        </h2>
        <p class="text-yellow-700/80 mt-1 ml-8">
          填写商品信息并保存，带 <span class="text-red-500">*</span> 为必填项
        </p>
      </div>

      <div
        class="bg-white rounded-xl shadow-md p-6 md:p-8 transition-all duration-300 hover:shadow-lg"
      >
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- 基本信息组件 -->
          <ProductBasicInfo
            v-model:form="productForm"
          />

          <!-- 图片上传组件 -->
          <ProductImageUpload
            v-model:mainImage="productForm.mainImage"
            v-model:imagesList="productForm.imagesList"
            v-model:videoUrl="productForm.videoUrl"
          />

          <!-- SKU配置组件 -->
          <ProductSkuConfig
            v-model:skuList="skuList"
          />

          <div class="flex justify-end space-x-4 pt-6 border-t border-yellow-100">
            <el-button
              size="default"
              type="primary"
              @click="handleReset"
              class="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none"
            >
              <template #icon>
                <i class="fa fa-refresh mr-1"></i>
              </template>
              重置
            </el-button>

            <el-button
              size="default"
              type="primary"
              @click="handleSubmit"
              class="bg-amber-600 text-white hover:bg-yellow-700 border-none"
              :loading="isSubmitting"
            >
              <template #icon>
                <i class="fa fa-check mr-1"></i>
              </template>
              确认提交
            </el-button>
          </div>
        </form>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showMessage"
        :class="['fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300', messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']"
      >
        <p class="flex items-center">
          <i :class="messageType === 'success' ? 'fa fa-check-circle mr-2' : 'fa fa-exclamation-circle mr-2'"></i>
          {{ message }}
        </p>
      </div>
    </teleport>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import ProductBasicInfo from './components/ProductBasicInfo.vue'
import ProductImageUpload from './components/ProductImageUpload.vue'
import ProductSkuConfig from './components/ProductSkuConfig.vue'

// 商品表单接口
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
  mainImage: string
  imagesList: string[]
  videoUrl: string
  detail: string
  warrantyTip: string
}

// SKU项接口
export interface SkuItem {
  skuSn: string
  specJson: string
  price: number
  marketPrice: number
  costPrice: number
  stock: number
  imageUrl: string
  weight: number
  volume: number
}

// 商品表单数据
const productForm = reactive<ProductForm>({
  productSn: '',
  title: '',
  subTitle: '',
  brandId: 0,
  typeParent: 0,
  typeChild: 0,
  currentPrice: 0,
  marketPrice: 0,
  costPrice: 0,
  stock: 0,
  mainImage: '',
  imagesList: [],
  videoUrl: '',
  detail: '',
  warrantyTip: ''
})

// SKU列表
const skuList = ref<SkuItem[]>([
  {
    skuSn: '',
    specJson: '',
    price: 0,
    marketPrice: 0,
    costPrice: 0,
    stock: 0,
    imageUrl: '',
    weight: 0,
    volume: 0
  }
])

// 提交状态
const isSubmitting = ref(false)
// 消息显示状态
const showMessage = ref(false)
// 消息内容
const message = ref('')
// 消息类型
const messageType = ref<'success' | 'error'>('success')

// 显示消息提示
const showToastMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  messageType.value = type
  showMessage.value = true
  setTimeout(() => showMessage.value = false, 3000)
}

// 表单验证
const validateForm = (): boolean => {
  if (!productForm.productSn) { showToastMessage('请输入商品编码', 'error'); return false }
  if (!productForm.title) { showToastMessage('请输入商品名称', 'error'); return false }
  if (productForm.typeParent === 0) { showToastMessage('请输入父分类ID', 'error'); return false }
  if (productForm.typeChild === 0) { showToastMessage('请输入子分类ID', 'error'); return false }
  if (productForm.currentPrice <= 0) { showToastMessage('请输入有效的销售价', 'error'); return false }
  if (productForm.stock < 0) { showToastMessage('请输入有效的库存数量', 'error'); return false }
  if (!productForm.mainImage) { showToastMessage('请上传商品主图', 'error'); return false }
  if (!productForm.detail) { showToastMessage('请输入商品详细描述', 'error'); return false }

  for (const [index, sku] of skuList.value.entries()) {
    if (!sku.skuSn) { showToastMessage(`第${index + 1}个SKU请输入编码`, 'error'); return false }
    if (!sku.specJson) { showToastMessage(`第${index + 1}个SKU请输入规格JSON`, 'error'); return false }
    if (sku.price <= 0) { showToastMessage(`第${index + 1}个SKU请输入有效的价格`, 'error'); return false }
    if (sku.stock < 0) { showToastMessage(`第${index + 1}个SKU请输入有效的库存`, 'error'); return false }
  }
  return true
}

// 提交表单
const handleSubmit = () => {
  if (!validateForm() || isSubmitting.value) return
  isSubmitting.value = true
    const submitData = {
      ...productForm,
      images: productForm.imagesList.join(','),
      skus: skuList.value
    }

  axios.request({
      url: '/server/api/product/add',
      method: 'POST',
      data: submitData
    })
.then(response => {
      showToastMessage('商品添加成功！')
      console.log('商品添加成功:', response.data)
      handleReset()
})
.catch(error => {
      console.log('提交失败:', error.response?.data)
      showToastMessage('提交失败，请稍后重试。', 'error')

  })
}

// 重置表单
const handleReset = () => {
  if (confirm('确定要重置表单吗？所有已填写内容将被清空。')) {
    // 重置商品主信息
    Object.assign(productForm, {
      productSn: '', title: '', subTitle: '', brandId: 0, typeParent: 0, typeChild: 0,
      currentPrice: 0, marketPrice: 0, costPrice: 0, stock: 0, mainImage: '',
      imagesList: [], videoUrl: '', detail: '', warrantyTip: ''
    })
    // 重置SKU
    skuList.value = [{
      skuSn: '', specJson: '', price: 0, marketPrice: 0, costPrice: 0,
      stock: 0, imageUrl: '', weight: 0, volume: 0
    }]
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #fffbeb;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #fde68a;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #fbbf24;
}
</style>
