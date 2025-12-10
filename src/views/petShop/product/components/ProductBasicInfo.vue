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
            v-model="localForm.productSn"
            @input="syncToParent"
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
            v-model="localForm.title"
            @input="syncToParent"
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
            v-model="localForm.subTitle"
            @input="syncToParent"
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入商品副标题"
          />
        </div>
        <div class="form-group">
          <label for="brandId" class="block text-sm font-medium text-yellow-800 mb-1"> 品牌 </label>
          <select
  id="brandId"
  v-model.number="localForm.brandId"
  @change="syncToParent"
  class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
>
  <option value="0">请选择品牌</option>
  <option v-for="brand in brands" :key="brand.id" :value="brand.id">
    {{ brand}}
  </option>
</select>
        </div>
        <div class="form-group">
          <label for="typeParent" class="block text-sm font-medium text-yellow-800 mb-1">
            父分类<span class="text-red-500">*</span>
          </label>
      <select
            id="typeParent"
            v-model.number="localForm.typeParent"
            @change="handleParentChange"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
          >
            <option value="">请选择父分类</option>
            <option v-for="(type, index) in parentsTypes" :key="index" :value="index">
              {{ type }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="typeChild" class="block text-sm font-medium text-yellow-800 mb-1">
            子分类<span class="text-red-500">*</span>
          </label>
          <select
            id="typeChild"
            v-model.number="localForm.typeChild"
            @change="syncToParent"
            required
            class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
          >
            <option value="">请选择子分类</option>
            <option v-for="category in sonTypes" :key="category.id" :value="category.id">
              {{ category }}
            </option>
          </select>
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
            v-model.number="localForm.currentPrice"
            @input="syncToParent"
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
            v-model.number="localForm.marketPrice"
            @input="syncToParent"
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
            v-model.number="localForm.costPrice"
            @input="syncToParent"
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
            v-model.number="localForm.stock"
            @input="syncToParent"
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
          v-model="localForm.detail"
          @input="syncToParent"
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
          v-model="localForm.warrantyTip"
          @input="syncToParent"
          class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
          placeholder="请输入售后保障提示"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'

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

interface Brand {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

const brands = ref<Brand[]>([])
const parentsTypes = ref<Category[]>([])
const sonTypes = ref<Category[]>([])
const authToken = localStorage.getItem('authToken')

const props = defineProps<{
  form: ProductForm
}>()

const emit = defineEmits<{
  (e: 'update:form', value: ProductForm): void
}>()

const localForm = ref<ProductForm>({
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
  detail: '',
  warrantyTip: ''
})

watch(
  () => props.form,
  (newForm) => {
    if (JSON.stringify(newForm) !== JSON.stringify(localForm.value)) {
      Object.assign(localForm.value, newForm)
    }
  },
  { immediate: true, deep: true }
)


// 更新父组件表单
const syncToParent = () => {
  const syncData = {
    ...localForm.value,
    brandId: localForm.value.brandId || 0,
    typeParent: localForm.value.typeParent || 0,
    typeChild: localForm.value.typeChild || 0,
    currentPrice: localForm.value.currentPrice || 0,
    marketPrice: localForm.value.marketPrice || 0,
    costPrice: localForm.value.costPrice || 0,
    stock: localForm.value.stock || 0
  }
  emit('update:form', syncData)
  console.log('子组件同步到父组件的数据：', syncData)
}

// 分类选择变化处理
const handleParentChange = () => {
  syncToParent()
  getSonTypes()
}

const getBrands = () => {
  axios
    .request({
      url: '/server/api/shop/product/add/brand',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res: any) => {
      if (res.data.code === 0) {
        brands.value = res.data.data
      } else {
        alert(res.data.msg)
      }
    })
    .catch((error) => {
      console.error('获取品牌失败:', error)
      brands.value = []
    })
}

const getParentsTypes = () => {
  axios
    .request({
      url: '/server/api/shop/product/add/parentType',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res: any) => {
      if (res.data.code === 0) {
        parentsTypes.value = res.data.data
      } else {
        alert(res.data.msg)
      }
    })
    .catch((error) => {
      console.error('获取父分类失败:', error)
      parentsTypes.value = []
    })
}

const getSonTypes = () => {
  if (!localForm.value.typeParent) {
    sonTypes.value = []
    return
  }
  axios
    .request({
      url: '/server/api/shop/product/add/childType',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        parentId: localForm.value.typeParent,
      },
    })
    .then((res: any) => {
      if (res.data.code === 0) {
        sonTypes.value = res.data.data
      } else {
        alert(res.data.msg)
      }
    })
    .catch((error) => {
      console.error('获取子分类失败:', error)
      sonTypes.value = []
    })
}

onMounted(() => {
  getBrands()
  getParentsTypes()
  if (props.form.typeParent && props.form.typeParent !== 0) {
    localForm.value.typeParent = props.form.typeParent
    getSonTypes()
  }
})
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
