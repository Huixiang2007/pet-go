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
        <el-form-item label="商品分类" prop="productType">
          <el-select v-model="editForm.productType" placeholder="请选择商品分类">
            <el-option label="服装/上衣" value="服装/上衣" />
            <el-option label="数码/音频" value="数码/音频" />
            <el-option label="家居/日用品" value="家居/日用品" />
            <el-option label="数码/外设" value="数码/外设" />
            <el-option label="鞋类/休闲" value="鞋类/休闲" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品货号" prop="productSn">
          <el-input v-model="editForm.productSn" placeholder="请输入商品货号" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input
            v-model.number="editForm.price"
            type="number"
            placeholder="请输入商品价格"
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
        <el-form-item label="商品描述" prop="detail">
          <el-input
            v-model="editForm.detail"
            type="textarea"
            :rows="5"
            placeholder="请输入商品详细描述（至少10个字符）"
          />
        </el-form-item>
      </div>

      <!-- 商品图片 -->
      <div>
        <h4 class="font-semibold text-gray-700 mb-3">商品图片</h4>
        <el-form-item label="主图链接">
          <el-input
            v-model="editForm.mainImage"
            placeholder="请输入商品主图URL"
            suffix-icon="Picture"
          />
        </el-form-item>
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
import { ref, reactive, watch, nextTick, onUnmounted } from 'vue'
import { type FormInstance, ElMessage } from 'element-plus'

// 精简类型定义（只保留表单需要的字段）
interface ProductDetail {
  id: string
  productName: string
  productType: string
  productSn: string
  price: string // 父组件传入的是字符串
  stock: number
  status: string
  detail: string
  mainImage: string
  // 其他扩展字段
  stockStatus?: string
  brandName?: string
  currentPrice?: number
}

// 编辑表单类型
interface EditForm {
  id: string
  productName: string
  productType: string
  productSn: string
  price: number
  stock: number
  status: string
  detail: string
  mainImage: string
}

// Props
const props = defineProps<{
  visible: boolean
  product: ProductDetail
}>()

// Emits）
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
  productType: '',
  productSn: '',
  price: 0,
  stock: 0,
  status: '',
  detail: '',
  mainImage: ''
})

// 表单校验规则）
const editRules = reactive({
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在2-50个字符之间', trigger: 'blur' }
  ],
  productType: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  productSn: [
    { required: true, message: '请输入商品货号', trigger: 'blur' },
    { min: 1, max: 30, message: '商品货号长度在1-30个字符之间', trigger: 'blur' }
  ],
  price: [
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

      const submitData = JSON.parse(JSON.stringify(editForm))
      emit('update', submitData)
    } else {
      ElMessage.error('表单验证失败，请检查必填项！')
    }
  })
}


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


const setFormData = (product: ProductDetail) => {
  if (!product) return

  const data = JSON.parse(JSON.stringify(product))

  editForm.id = data.id || ''
  editForm.productName = data.productName || ''
  editForm.productType = data.productType || ''
  editForm.productSn = data.productSn || ''
  editForm.price = data.price ? Number(data.price) : 0
  editForm.stock = data.stock || 0
  editForm.status = data.status || ''
  editForm.detail = data.detail || ''
  editForm.mainImage = data.mainImage || ''
}

watch(() => props.product.id, () => {
  setFormData(props.product)
}, { deep: true })


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
