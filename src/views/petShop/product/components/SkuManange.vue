<template>
  <el-dialog v-model="isVisible" :title="props.productName" width="800px" destroy-on-close>
    <!-- 新增/编辑SKU表单 -->
    <el-form ref="skuFormRef" :model="skuForm" :rules="skuRules" label-width="100px" class="mb-4">
      <!-- SKU编号 -->
      <el-form-item label="SKU编号" prop="skuSn">
        <el-input v-model="skuForm.skuSn" placeholder="如：SP2025001-WH-XXL" />
      </el-form-item>

      <!-- SKU规格组合 -->
      <el-form-item label="规格组合" prop="specJson">
        <div class="spec-group">
          <div v-for="(item, index) in specItems" :key="index" class="spec-row mb-2">
            <el-input
              v-model="item.key"
              placeholder="规格名（如：颜色/尺码）"
              style="width: 150px; margin-right: 10px"
            />
            <el-input
              v-model="item.value"
              placeholder="规格值（如：白色/XXL）"
              style="width: 200px; margin-right: 10px"
            />
            <el-button
              icon="CircleClose"
              size="small"
              type="text"
              @click="removeSpecItem(index)"
              class="text-danger"
            />
          </div>
          <!-- 添加规格按钮 -->
          <el-button icon="Plus" size="small" type="text" @click="addSpecItem" class="mt-1">
            添加规格
          </el-button>
        </div>
      </el-form-item>

      <!-- SKU销售价格 -->
      <el-form-item label="销售价格" prop="price">
        <el-input
          v-model.number="skuForm.price"
          placeholder="如：99.00"
          step="0.01"
          type="number"
        />
      </el-form-item>

      <!-- 市场价/划线价 -->
      <el-form-item label="市场价" prop="marketPrice">
        <el-input
          v-model.number="skuForm.marketPrice"
          placeholder="如：129.00"
          step="0.01"
          type="number"
        />
      </el-form-item>

      <!--成本价 -->
      <el-form-item label="成本价" prop="costPrice">
        <el-input
          v-model.number="skuForm.costPrice"
          placeholder="如：50.00"
          step="0.01"
          type="number"
        />
      </el-form-item>

      <!-- SKU库存 -->
      <el-form-item label="库存数量" prop="stock">
        <el-input v-model.number="skuForm.stock" placeholder="如：100" step="1" type="number" />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" v-if="!isEdit" @click="addSku">添加SKU</el-button>
        <el-button type="primary" v-if="isEdit" @click="submitEdit">更新SKU</el-button>
        <el-button @click="resetSkuForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 已有SKU列表 -->
    <div class="sku-list">
      <el-table :data="skuList" size="small" stripe>
        <el-table-column prop="skuSn" label="SKU编号" width="180" />
        <el-table-column label="规格组合" width="200" prop="specText" />
        <el-table-column prop="sales" label="销售价(元)" width="120" />
      <el-table-column prop="price" label="市场价(元)" width="120" />
        <el-table-column prop="stock" label="库存" width="100" />
        <!-- 新增：上下架状态列 -->
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '上架' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <!-- 加宽列宽容纳新按钮 -->
          <template #default="scope">
            <!-- 新增：查看详情按钮 -->
            <el-button
              size="mini"
              type="text"
              icon="View"
              @click="viewSkuDetail(scope.row)"
              class="text-primary"
            >
              详情
            </el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row)" class="text-primary">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              :class="scope.row.status === '上架' ? 'text-warning' : 'text-success'"
              @click="toggleSkuStatus(scope.row)"
            >
              {{ scope.row.status === '上架' ? '下架' : '上架' }}
            </el-button>
            <el-button size="mini" type="text" @click="deleteSku(scope.row)" class="text-danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- SKU详情弹窗 -->
    <el-dialog v-model="detailVisible" title="SKU详情" width="600px">
      <div v-if="currentSku" class="sku-detail">
        <el-descriptions :column="2">
          <el-descriptions-item label="SKU编号">{{ currentSku.skuSn }}</el-descriptions-item>
          <el-descriptions-item label="SKU ID">{{ currentSku.skuId }}</el-descriptions-item>
          <el-descriptions-item label="规格组合">
            {{ currentSku.specText || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="销售价格">{{ currentSku.price }} 元</el-descriptions-item>
          <el-descriptions-item label="市场价"
            >{{ currentSku.marketPrice || 0 }} 元</el-descriptions-item
          >
          <el-descriptions-item label="成本价"
            >{{ currentSku.costPrice || 0 }} 元</el-descriptions-item
          >
          <el-descriptions-item label="库存数量">{{ currentSku.stock }} 件</el-descriptions-item>
          <el-descriptions-item label="库存状态">{{
            currentSku.stockStatus || '正常'
          }}</el-descriptions-item>
          <el-descriptions-item label="发布时间·">{{
            currentSku.publishTime || '无'
          }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentSku.status === '上架' ? 'success' : 'danger'">
              {{ currentSku.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="销量" :span="2"
            >{{ currentSku.sales || 0 }} 件</el-descriptions-item
          >
        </el-descriptions>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { skuListApi, skuStatusApi, skuDetailApi } from '@/api/pet-shop/product'

// 新增：详情弹窗控制 + 当前选中SKU
const detailVisible = ref(false)
const currentSku = ref<Sku | null>(null)

interface Sku {
  skuSn?: string // SKU编号
  specJson: object
  specText?: string // 规格组合（接口返回的"key:{1=1}"格式）
  price: number // 销售价格
  marketPrice?: number // 市场价
  costPrice?: number // 成本价
  stock: number // 库存
  productId: string // 关联商品
  skuId?: string | bigint // SKU ID
  status?: string // 状态：ONLINE(上架)/OFFLINE(下架)
  sales?: number // 销量
  stockStatus?: string // 库存状态：NORMAL(正常)/LOW_STOCK(低库存)/OUT_OF_STOCK(缺货)
  publishTime?: string // 发布时间
}

interface RuleItem {
  required?: boolean
  message: string
  trigger?: string | string[]
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'object'
    | 'enum'
    | 'date'
    | 'url'
    | 'email'
    | 'hex'
    | 'integer'
  max?: number
  min?: number
  len?: number
  enum?: any[]
  whitespace?: boolean
  pattern?: RegExp
  transform?: (value: any) => any
  validator?: (rule: any, value: any, callback: (error?: Error) => void) => Promise<void> | void
  fields?: Record<string, RuleItem[]>
  defaultField?: RuleItem
}

interface SpecItem {
  key: string
  value: string
}

// Props
const props = defineProps<{
  visible: boolean
  productId: string
  productName: string
}>()

// Emits
const emit = defineEmits<{
  close: []
  update: [skuList: Sku[]]
  addSku: [sku: Sku]
  delete: [skuId: bigint | string]
}>()

// 监听弹窗显示
const isVisible = ref(props.visible)
watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal
    if (newVal) {
      loadSkuData()
      resetSkuForm()
    }
  },
)

// 监听弹窗关闭
watch(isVisible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

const skuFormRef = ref<FormInstance>()
const isEdit = ref(false)
const editIndex = ref(-1)

const specItems = ref<SpecItem[]>([{ key: '', value: '' }])

// SKU表单数据
const skuForm = reactive<Sku>({
  skuSn: '',
  specJson: {},
  price: 0,
  marketPrice: 0,
  costPrice: 0,
  stock: 0,
  productId: props.productId,
  status: '',
})

// 监听商品ID变化
watch(
  () => props.productId,
  (newVal) => {
    skuForm.productId = newVal
  },
)

// SKU验证规则
const skuRules = reactive<Record<string, RuleItem[]>>({
  skuSn: [
    { required: true, message: '请输入SKU编号', trigger: 'blur' },
    { min: 2, max: 50, message: 'SKU编号长度为2-50字符', trigger: 'blur' },
  ],
  specJson: [
    {
      message: '请填写规格组合',
      validator: (rule, value, callback) => {
        const hasValidSpec = specItems.value.some(
          (item) => item.key.trim() !== '' && item.value.trim() !== '',
        )
        if (!hasValidSpec) {
          callback(new Error('请填写至少一组规格名称和值'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  price: [
    { required: true, message: '请输入销售价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格不能小于0.01元', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' },
  ],
})

const skuList = ref<Sku[]>([])

// 加载SKU数据
const loadSkuData = async () => {
  try {
    const response = await skuListApi(props.productId, 1, 100)
    console.log('skuList:', response)
    if (response) {
skuList.value = response.list.map((sku) => ({
  ...sku,
  skuId: sku.skuId ? (typeof sku.skuId === 'string' ? sku.skuId : BigInt(sku.skuId)) : '',
  status: sku.status || ' ',
  price: sku.sellPrice || 0,
  sales: sku.sales || 0,
  stock: sku.stock || 0,
}))
    } else {
      skuList.value = []
      ElMessage.error('该商品的Sku数据为空')
    }
  } catch (error) {
    console.error('获取SKU数据失败:', error)
    ElMessage.error('获取SKU数据失败')
  }
}

// 添加规格项
const addSpecItem = () => {
  if (specItems.value.length >= 5) {
    ElMessage.warning('最多添加5组规格')
    return
  }
  specItems.value.push({ key: '', value: '' })
}

// 移除规格项
const removeSpecItem = (index: number) => {
  if (specItems.value.length <= 1) {
    ElMessage.warning('至少保留1组规格')
    return
  }
  specItems.value.splice(index, 1)
}

// 新增SKU
const addSku = async () => {
  if (!skuFormRef.value) return

  try {
    await skuFormRef.value.validate()

    // 组装规格文本
    const specJson = specItems.value.reduce(
      (acc, item) => {
        const key = item.key.trim()
        const value = item.value.trim()
        if (key && value) acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )

    if (Object.keys(specJson).length === 0) {
      ElMessage.warning('请填写有效的规格组合')
      return
    }

    const newSku: Sku = {
      specJson: specJson,
      skuSn: skuForm.skuSn,
      price: skuForm.price || 0.01,
      marketPrice: skuForm.marketPrice || 0,
      costPrice: skuForm.costPrice || 0,
      stock: skuForm.stock || 0,
      productId: props.productId,
      status: skuForm.status,
      sales: 0,
    }

    emit('addSku', newSku)
    loadSkuData()
    resetSkuForm()
  } catch (error) {
    ElMessage.error('添加SKU失败：' + (error as Error).message)
    console.error('添加SKU失败:', error)
  }
}

// 重置表单
const resetSkuForm = () => {
  skuFormRef.value?.resetFields()
  Object.assign(skuForm, {
    skuSn: '',
    specJson: '',
    price: 0,
    sellPrice: 0,
    costPrice: 0,
    stock: 0,
    productId: props.productId,
    status: '',
  })
  specItems.value = [{ key: '', value: '' }]
  isEdit.value = false
  editIndex.value = -1
}

// 编辑回显逻辑
const handleEdit = async (row: Sku) => {
  if (!row.skuId) {
    ElMessage.error('SKU ID无效，无法编辑')
    return
  }

  // 开启编辑状态
  isEdit.value = true
  editIndex.value = skuList.value.findIndex((sku) => sku.skuId === row.skuId)

  const response = await skuDetailApi(row.skuId)
    const editSku = response|| {}

  skuForm.skuSn = editSku.skuSn || ''
  skuForm.stock = editSku.stock || 0
  skuForm.price = editSku.price || 0
  skuForm.costPrice = editSku.costPrice || 0
  skuForm.marketPrice = editSku.marketPrice || 0

  const specText = editSku.specText || ''
  const tempSpecItems: Array<{ key: string; value: string }> = []

  // 拆分规格文本（如："重量:2kg | 口味:草莓味" → 拆成键值对）
  specText.split(' | ').forEach((itemStr) => {
    const [key, value] = itemStr.split(':')
    if (key && value) {
      tempSpecItems.push({
        key: key.trim(),
        value: value.trim(),
      })
    }
  })
  specItems.value = tempSpecItems.length > 0 ? tempSpecItems : [{ key: '', value: '' }]
}

const submitEdit = async () => {
  if (!skuFormRef.value) return
  try {
    await skuFormRef.value.validate()

    // 组装规格文本
    const specJson = specItems.value.reduce(
      (acc, item) => {
        const key = item.key.trim()
        const value = item.value.trim()
        if (key && value) acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )

    if (Object.keys(specJson).length === 0) {
      ElMessage.warning('请填写有效的规格组合')
      return
    }

    // 更新列表数据
skuList[editIndex.value] = {
  skuId: skuList.value[editIndex.value].skuId,
  price: skuForm.price || 0.01,
  marketPrice: skuForm.marketPrice || 0,
  costPrice: skuForm.costPrice,
  stock: skuForm.stock,
  specJson: specJson
};
const newSku = {
  skuId: skuList.value[editIndex.value].skuId,
  price: skuForm.price || 0.01,
   skuSn:'',
  marketPrice: skuForm.marketPrice || 0.01,
  costPrice: skuForm.costPrice,
  stock: skuForm.stock,
  specJson: specJson
};
console.log('skuListss:', skuList.value)
console.log('newSku:', newSku)

    emit('update', [newSku as any])
    loadSkuData()
    resetSkuForm()
  } catch (error) {
    console.error('更新SKU失败:', error)
  }
}

// 删除SKU
const deleteSku = async (row: Sku) => {
  try {
    if (!row.skuId || row.skuId === 'undefined' || row.skuId === 'null') {
      ElMessage.error('SKU ID无效，无法删除')
      return
    }
      emit('delete', row.skuId)

  } catch (error: any) {
    console.log('已取消删除', error)
  }
}

// 查看SKU详情
const viewSkuDetail = async (row: Sku) => {
  if (!row.skuId) {
    ElMessage.error('SKU ID无效，无法查看详情')
    return
  }

  try {
    const response = await skuDetailApi(row.skuId)
    currentSku.value = response
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('获取SKU详情失败：' + (error as Error).message)
    console.error('获取SKU详情失败:', error)
  }
}

// 切换SKU上下架状态
const toggleSkuStatus = async (row: Sku) => {
  if (!row.skuId) {
    ElMessage.error('SKU ID无效，无法修改状态')
    return
  }

  const newStatus = row.status === '上架' ? 0 : 1
  const statusText = newStatus === 0 ? '下架' : '上架'

  try {
    const res = await skuStatusApi(row.skuId, newStatus)
    console.log('res:', res)
    const targetIndex = skuList.value.findIndex((sku) => sku.skuId === row.skuId)
    if (targetIndex > -1) {
      skuList.value[targetIndex].status = newStatus === 0 ? '下架' : '上架'
    }
    ElMessage.success(`SKU${statusText}成功`)
  } catch (error) {
    ElMessage.error(`SKU${statusText}失败：` + (error as Error).message)
    console.error(`SKU${statusText}失败:`, error)
  }
}
</script>

<style scoped>
.spec-group {
  border: 1px dashed #ccc;
  padding: 10px;
  border-radius: 4px;
}
.spec-row {
  display: flex;
  align-items: center;
}
.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
}
.text-primary {
  color: #409eff;
}
.text-danger {
  color: #f56c6c;
}
.text-success {
  color: #67c23a;
}
.text-warning {
  color: #e6a23c;
}
.sku-detail {
  padding: 10px 0;
}
/* 隐藏无用的SKU ID列样式 */
:deep(.el-table-column--width-0) {
  display: none !important;
}
</style>
