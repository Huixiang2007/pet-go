<template>
  <!-- 商品编辑弹窗 -->
  <el-dialog
    v-model="visible"
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
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择商品分类">
            <el-option label="服装/上衣" value="服装/上衣" />
            <el-option label="数码/音频" value="数码/音频" />
            <el-option label="家居/日用品" value="家居/日用品" />
            <el-option label="数码/外设" value="数码/外设" />
            <el-option label="鞋类/休闲" value="鞋类/休闲" />
            <el-option label="其他" value="其他" />
          </el-select>
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
        <el-form-item label="商品描述" prop="desc">
          <el-input
            v-model="editForm.desc"
            type="textarea"
            :rows="5"
            placeholder="请输入商品详细描述"
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
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="primary" @click="submitEdit">保存修改</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios'

// 基础商品表格行类型
interface TableRow {
  id: string
  name: string
  category: string
  price: string
  stock: string
  status: string
}

// 扩展商品详情类型
interface ProductDetail extends TableRow {
  mainImage: string
  imageList: string[]
  shelfTime: string
  desc: string
  params: { name: string; value: string }[]
}

// 编辑表单类型
interface EditForm {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  desc: string
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
}>()

const editFormRef = ref<FormInstance>()
const editForm = reactive<EditForm>({
  id: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  status: '',
  desc: '',
  mainImage: '',
})

// 编辑表单验证规则
const editRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在2-50个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
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
  desc: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 10, message: '商品描述不能少于10个字符', trigger: 'blur' }
  ]
})


watch(() => props.product, (newProduct) => {
  editForm.id = newProduct.id
  editForm.name = newProduct.name
  editForm.category = newProduct.category
  editForm.price = Number(newProduct.price)
  editForm.stock = Number(newProduct.stock)
  editForm.status = newProduct.status
  editForm.desc = newProduct.desc
  editForm.mainImage = newProduct.mainImage
}, { deep: true })

// 提交编辑
const submitEdit = () => {
  editFormRef.value?.validate((valid) => {
    if (valid) {
      axios.request({
        url: '/petshop/product/update',
        method: 'put',
        data: editForm
      })
      .then(() => {
        ElMessage.success('商品编辑成功！')
        emit('update', editForm)
        emit('close')
      })
      .catch(() => {
        ElMessage.error('商品编辑失败！')
      })
    }
  })
}
const visible = ref(props.visible)
watch(() => props.visible, (newVal) => {
  visible.value = newVal
  if (newVal) {
    editFormRef.value?.resetFields()
  }
})
</script>

<style scoped>
.edit-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}
</style>
