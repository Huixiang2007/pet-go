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

      <div class="bg-white rounded-xl shadow-md p-6 md:p-8 transition-all duration-300 hover:shadow-lg">
        <form @submit.prevent="handleSubmit" class="space-y-8">

<ProductBasicInfo
  :form="productForm"
  @update:form="handleFormUpdate"
/>

          <ProductImageUpload v-model:mainImage="productForm.mainImage"
          v-model:imagesList="productForm.imagesList"
            v-model:videoUrl="productForm.videoUrl" />
          <div class="flex justify-end space-x-4 pt-6 border-t border-yellow-100">
            <el-button size="default" type="primary" @click="handleReset"
              class="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">
              <template #icon>
                <i class="fa fa-refresh mr-1"></i>
              </template>
              重置
            </el-button>

            <el-button size="default" type="primary" @click="handleSubmit"
              class="bg-amber-600 text-white hover:bg-yellow-700 border-none" :loading="isSubmitting">
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
      <div v-if="message"
        :class="['fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300', messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
        <p class="flex items-center">
          <i :class="messageType === 'success' ? 'fa fa-check-circle mr-2' : 'fa fa-exclamation-circle mr-2'"></i>
          {{ message }}
        </p>
      </div>
    </teleport>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref ,watch} from 'vue'
import axios from 'axios'
import ProductBasicInfo  from './components/ProductBasicInfo.vue'
import ProductImageUpload from './components/ProductImageUpload.vue'

interface ProductImage {
  name: string
  url: string
  isImage: boolean
}

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
  imagesList: ProductImage[]
  videoUrl: string
  detail: string
  warrantyTip: string
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
const isSubmitting = ref(false)
const showMessage = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

//提示框方法
const showToastMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  messageType.value = type
  showMessage.value = true
  setTimeout(() => showMessage.value = false, 3000)
}
watch(
  () => productForm,
  (newVal) => {
    console.log('父组件productForm最新值：', newVal) // 调试用
  },
  { deep: true, immediate: true }
)
interface BasicProductForm {
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

const handleFormUpdate = (newForm: BasicProductForm) => {
  Object.assign(productForm, newForm) // 如果 productForm 是 reactive

}

// 提交表单
const handleSubmit = () => {

  if (isSubmitting.value) return
  isSubmitting.value = true

  const submitData = {
    ...productForm,
    images: productForm.imagesList.join(',')
  }

  console.log('最终提交的数据：', submitData) // 调试用

  axios.request({
    url: '/server/api/shop/product/add',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}` // 添加token
    },
    data: submitData
  })
  .then(response => {
      isSubmitting.value = false
    showToastMessage('商品添加成功！')
    console.log('商品添加成功:', response.data)
    handleReset()
  })
  .catch(error => {
      isSubmitting.value = false
    console.error('提交失败:', error.response?.data || error.message)
    showToastMessage(error.response?.data?.msg || '提交失败，请稍后重试。', 'error')
  })


}

// 重置表单
const handleReset = () => {
    Object.assign(productForm, {
      productSn: '', title: '', subTitle: '', brandId: 0, typeParent: 0, typeChild: 0,
      currentPrice: 0, marketPrice: 0, costPrice: 0, stock: 0, mainImage: '',
      imagesList: [], videoUrl: '', detail: '', warrantyTip: ''
    })
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
