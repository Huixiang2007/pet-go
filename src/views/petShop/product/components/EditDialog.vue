<template>
  <!-- 商品编辑弹窗（v-model双向绑定状态） -->
  <el-dialog
    v-model="isVisible"
    title="编辑商品"
    width="80%"
    max-width="800px"
    top="20px"
    :close-on-click-modal="false"
  >
    <el-form
      :model="editForm"
      :rules="editRules"
      ref="editFormRef"
      label-width="100px"
      class="edit-form"
    >
      <!-- 基础信息 -->
      <div class="border-b border-gray-200 pb-4 mb-4">
        <h4 class="font-semibold text-gray-700 mb-3">基础信息</h4>
        <el-form-item label="商品编号" prop="id">
          <el-input v-model="editForm.id" disabled placeholder="自动生成" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="editForm.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编码" prop="productSn">
          <el-input v-model="editForm.productSn" placeholder="请输入商品编码" />
        </el-form-item>
<el-form-item label="品牌" prop="brandId">
  <el-select v-model.number="editForm.brandId" placeholder="请选择品牌">
    <el-option label="请选择品牌" :value="0" />
    <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id" />
  </el-select>
</el-form-item>
        <el-form-item label="父分类" prop="typeParent">
          <el-select v-model.number="editForm.typeParent" placeholder="请选择父分类" @change="handleParentChange">
            <el-option label="请选择父分类" :value="0"  />
          <el-option v-for="type in parentsTypes" :key="type.id" :label="type.name" :value="type.id" />
          </el-select>
        </el-form-item>
<el-form-item label="子分类" prop="typeChild">
  <el-select v-model.number="editForm.typeChild" placeholder="请选择子分类">
    <el-option label="请选择子分类" :value="0" />
    <el-option v-for="category in sonTypes" :key="category.id" :label="category.name" :value="category.id" />
  </el-select>
</el-form-item>
      </div>

      <!-- 价格与库存 -->
      <div class="border-b border-gray-200 pb-4 mb-4">
        <h4 class="font-semibold text-gray-700 mb-3">价格与库存</h4>
        <el-form-item label="销售价" prop="currentPrice">
          <el-input
            v-model.number="editForm.currentPrice"
            type="number"
            placeholder="请输入销售价"
            prefix="¥"
            min="0.01"
            step="0.01"
          />
        </el-form-item>
        <el-form-item label="市场价" prop="marketPrice">
          <el-input
            v-model.number="editForm.marketPrice"
            type="number"
            placeholder="请输入市场价"
            prefix="¥"
            min="0.01"
            step="0.01"
          />
        </el-form-item>
        <el-form-item label="成本价" prop="costPrice">
          <el-input
            v-model.number="editForm.costPrice"
            type="number"
            placeholder="请输入成本价"
            prefix="¥"
            min="0.01"
            step="0.01"
          />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input
            v-model.number="editForm.stock"
            type="number"
            placeholder="请输入库存数量"
            min="0"
            step="1"
          />
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择商品状态">
            <el-option label="已上架" value="已上架" />
            <el-option label="已下架" value="已下架" />
            <el-option label="待审核" value="待审核" />
          </el-select>
        </el-form-item>
      </div>

      <!-- 商品描述 -->
      <div class="border-b border-gray-200 pb-4 mb-4">
        <h4 class="font-semibold text-gray-700 mb-3">商品描述</h4>
        <el-form-item label="详细描述" prop="detail">
          <el-input
            v-model="editForm.detail"
            type="textarea"
            :rows="5"
            placeholder="请输入商品详细描述（至少10个字符）"
          />
        </el-form-item>
        <el-form-item label="售后保障提示" prop="warrantyTip">
          <el-input v-model="editForm.warrantyTip" placeholder="请输入售后保障提示" />
        </el-form-item>
      </div>

      <!-- 商品图片 -->
        <div class="border-b border-gray-200 pb-4 mb-4">
        <ProductImageUpload
          :mainImage="mainImageUrl"
          :imagesList="detailImages"
          :videoUrl="videoUrl"
          @update:mainImage="mainImageUrl = $event"
          @update:imagesList="detailImages = $event"
          @update:videoUrl="videoUrl = $event"
        />
      </div>
    </el-form>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitEdit">保存修改</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onUnmounted, onMounted } from 'vue'
import { type FormInstance, ElMessage } from 'element-plus'
import axios from 'axios'
import ProductImageUpload from './ProductImageUpload.vue'


// 品牌和分类接口
interface Brand {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}
interface Type {
  id: number
  name: string
}
// 商品详情接口
interface ProductDetail {
  id: string
  productName: string
  productType: string
  productSn: string
  price: number
  stock: number
  status: string
  detail: string
  mainImage: string
  stockStatus?: string
  brandName?: Type
  currentPrice?: number
  brandId?: number
  typeParent?: Type
  typeChild?: Type
  marketPrice?: number
  costPrice?: number
  warrantyTip?: string
  imagesList?: { name: string; url: string; isImage: boolean }[]
  videoUrl?: string
}

// 编辑表单类型
interface EditForm {
  id: string
  productName: string
  productSn: string
  brandId: number
  typeParent: number
  typeChild: number
  currentPrice: number
  marketPrice: number
  costPrice: number
  stock: number
  status: string
  detail: string
  warrantyTip: string
  mainImage: string
}

// Props
const props = defineProps<{
  visible: boolean
  product: ProductDetail
}>()

// Emits
const emit = defineEmits<{
  close: []
  update: [product: EditForm]
  'update:visible': [value: boolean]
}>()

// 表单引用
const editFormRef = ref<FormInstance>()

// 编辑表单
const editForm = reactive<EditForm>({
  id: '',
  productName: '',
  productSn: '',
  brandId: 0,
  typeParent: 0,
  typeChild: 0,
  currentPrice: 0,
  marketPrice: 0,
  costPrice: 0,
  stock: 0,
  status: '',
  detail: '',
  warrantyTip: '',
  mainImage: ''
})

// 品牌和分类数据
const brands = ref<Brand[]>([])
const parentsTypes = ref<Category[]>([])
const sonTypes = ref<Category[]>([])
const authToken = localStorage.getItem('authToken')

// 图片上传相关
const mainImageUrl = ref('')
const detailImages = ref<{ name: string; url: string; isImage: boolean }[]>([])
const videoUrl = ref('')

// 表单校验规则
const editRules = reactive({
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在2-50个字符之间', trigger: 'blur' }
  ],
  productSn: [
    { required: true, message: '请输入商品货号', trigger: 'blur' },
    { min: 1, max: 30, message: '商品货号长度在1-30个字符之间', trigger: 'blur' }
  ],
  typeParent: [
    { required: true, message: '请选择父分类', trigger: 'change' }
  ],
  typeChild: [
    { required: true, message: '请选择子分类', trigger: 'change' }
  ],
  currentPrice: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '商品价格不能小于0.01元', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量不能小于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ],
  detail: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 10, message: '商品描述不能少于10个字符', trigger: 'blur' }
  ]
})

// 提交编辑
const submitEdit = () => {
  editFormRef.value?.validate((valid) => {
    if (valid) {
      console.log('表单验证通过')
      console.log('editForm', editForm)
      editForm.mainImage = mainImageUrl.value
      const imagesStr = detailImages.value.map(img => img.url).join(',')
      const videoUrlStr = videoUrl.value

      const submitData = {
        ...JSON.parse(JSON.stringify(editForm)),
        price: editForm.currentPrice.toFixed(2),
        images: imagesStr,
        videoUrl: videoUrlStr,
        typeParent: editForm.typeParent,
        typeChild: editForm.typeChild,
        brandId: editForm.brandId
      }

      console.log('最终提交数据：', submitData)
      emit('update', submitData)
    } else {
      ElMessage.error('表单验证失败，请检查必填项！')
    }
  })
}

// 关闭弹窗
const handleClose = () => {
  isVisible.value = false
  emit('close')
  emit('update:visible', false)
  nextTick(() => {
    editFormRef.value?.resetFields()
  })
}

// 弹窗状态管理
const isVisible = ref(props.visible)
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    nextTick(() => {
      editFormRef.value?.clearValidate()
      setFormData(props.product)
    })
  } else {
    nextTick(() => {
      editFormRef.value?.resetFields()
    })
  }
}, { immediate: true })

watch(isVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 设置表单数据
const setFormData = (product: ProductDetail) => {
  if (!product) return
  const data = JSON.parse(JSON.stringify(product))

  editForm.id = data.id || ''
  editForm.productName = data.productName || ''
  editForm.productSn = data.productSn || ''
  editForm.brandId = data.brandId || (data.brandName?.id || 0)
  editForm.typeParent = data.typeParent?.id || 0
  editForm.typeChild = data.typeChild?.id || 0
  editForm.currentPrice = data.currentPrice || (data.price ? Number(data.price) : 0)
  editForm.marketPrice = data.marketPrice || 0
  editForm.costPrice = data.costPrice || 0
  editForm.stock = data.stock || 0
  editForm.status = data.status || ''
  editForm.detail = data.detail || ''
  editForm.warrantyTip = data.warrantyTip || ''
  editForm.mainImage = data.mainImage || ''

  mainImageUrl.value = data.mainImage || ''
  detailImages.value = Array.isArray(data.images)
    ? data.images.map(url => ({ name: url.split('/').pop() || '', url, isImage: true }))
    : (data.imagesList || [])
  videoUrl.value = data.videoUrl || ''
}


watch(() => props.product.id, () => {
  setFormData(props.product)
}, { deep: true })

// 获取品牌列表
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
          const brandsObj = res.data.data;
        console.log('获取品牌成功:', res.data.data)
          brands.value = Object.entries(brandsObj).map(([id, name]) => ({
          id: Number(id),
          name: name as string
        }));
      } else {
        ElMessage.error(res.data.msg)
      }
    })
    .catch((error) => {
      console.error('获取品牌失败:', error)
      ElMessage.error('获取品牌失败')
    })
}

// 获取父分类
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
        const parentTypeObj = res.data.data;
        console.log('获取父分类成功:', res.data.data)
         parentsTypes.value = Object.entries(parentTypeObj).map(([id, name]) => ({
          id: Number(id),
          name: name as string
        }));

      } else {
        ElMessage.error(res.data.msg)
      }
    })
    .catch((error) => {
      console.error('获取父分类失败:', error)
      ElMessage.error('获取父分类失败')
    })
}

// 获取子分类
const getSonTypes = () => {
  if (!editForm.typeParent) {
    sonTypes.value = []
    return
  }
  console.log('editForm.typeParent', editForm.typeParent)
  axios
    .request({
      url: '/server/api/shop/product/add/childType',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        parentId: editForm.typeParent,
      },
    })
    .then((res: any) => {
      if (res.data.code === 0) {
          const childTypeObj = res.data.data;
        console.log('获取子分类成功:', res.data.data)
        sonTypes.value = Object.entries(childTypeObj).map(([id, name]) => ({
          id: Number(id),
          name: String(name)
        }))
      } else {
        ElMessage.error(res.data.msg)
      }
    })
    .catch((error) => {
      console.error('获取子分类失败:', error)
      ElMessage.error('获取子分类失败')
    })
}

// 父分类变化处理
const handleParentChange = () => {
  getSonTypes()
}



// 组件挂载时加载数据
onMounted(() => {
  getBrands()
  getParentsTypes()
  if (props.product.typeParent && props.product.typeParent.id!== 0) {
    editForm.typeParent = props.product.typeParent.id
    getSonTypes()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  isVisible.value = false
  emit('update:visible', false)
})
</script>

<style scoped>
.edit-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.edit-form::-webkit-scrollbar {
  width: 6px;
}

.edit-form::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.border-b {
  border-bottom: 1px solid #e5e7eb;
}

.pb-4 {
  padding-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-700 {
  color: #374151;
}

.mb-3 {
  margin-bottom: 0.75rem;
}
</style>
