<template>
  <el-dialog
    v-model="isVisible"
    title="管理SKU - {{ props.productName }}"
    width="800px"
    destroy-on-close
  >
    <!-- 新增/编辑SKU表单 -->
    <el-form
      ref="skuFormRef"
      :model="skuForm"
      :rules="skuRules"
      label-width="100px"
      class="mb-4"
    >
      <!-- SKU编号 -->
      <el-form-item label="SKU编号" prop="skuSn">
        <el-input v-model="skuForm.skuSn" placeholder="如：SP2025001-WH-XXL" />
      </el-form-item>

      <!-- SKU规格组合 -->
      <el-form-item label="规格组合" prop="specJson">
        <div class="spec-group">
          <div
            v-for="(item, index) in specItems"
            :key="index"
            class="spec-row mb-2"
          >
            <el-input
              v-model="item.key"
              placeholder="规格名（如：颜色/尺码）"
              style="width: 150px; margin-right: 10px;"
            />
            <el-input
              v-model="item.value"
              placeholder="规格值（如：白色/XXL）"
              style="width: 200px; margin-right: 10px;"
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
          <el-button
            icon="Plus"
            size="small"
            type="text"
            @click="addSpecItem"
            class="mt-1"
          >
            添加规格
          </el-button>
        </div>
      </el-form-item>

      <!-- SKU销售价格 -->
      <el-form-item label="销售价格(元)" prop="price">
        <el-input
          v-model.number="skuForm.price"
          placeholder="如：99.00"
          step="0.01"
          type="number"
        />
      </el-form-item>

      <!-- 市场价/划线价 -->
      <el-form-item label="市场价(元)" prop="marketPrice">
        <el-input
          v-model.number="skuForm.marketPrice"
          placeholder="如：129.00"
          step="0.01"
          type="number"
        />
      </el-form-item>

      <!--成本价 -->
      <el-form-item label="成本价(元)" prop="costPrice">
        <el-input
          v-model.number="skuForm.costPrice"
          placeholder="如：50.00"
          step="0.01"
          type="number"
        />
      </el-form-item>

      <!-- SKU库存 -->
      <el-form-item label="库存数量" prop="stock">
        <el-input
          v-model.number="skuForm.stock"
          placeholder="如：100"
          step="1"
          type="number"
        />
      </el-form-item>

      <!-- SKU图片 -->
      <el-form-item label="SKU图片">
        <el-input
          v-model="skuForm.imageUrl"
          placeholder="输入图片URL（如不同颜色图）"
        />
      </el-form-item>

      <!--商品重量(kg) -->
      <el-form-item label="商品重量(kg)">
        <el-input
          v-model.number="skuForm.weight"
          placeholder="如：0.2"
          step="0.01"
          type="number"
        />
      </el-form-item>

      <!--商品体积-->
      <el-form-item label="商品体积(m³)">
        <el-input
          v-model.number="skuForm.volume"
          placeholder="如：0.01"
          step="0.001"
          type="number"
        />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitSku">
          {{ isEdit ? '更新SKU' : '添加SKU' }}
        </el-button>
        <el-button @click="resetSkuForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 已有SKU列表 -->
    <div class="sku-list">
      <el-table :data="skuList" size="small" stripe>
        <el-table-column prop="skuSn" label="SKU编号" width="180" />
        <el-table-column
          label="规格组合"
          width="200"
          :formatter="(row) => JSON.stringify(row.specJson)"
        />
        <el-table-column prop="price" label="销售价(元)" width="120" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="editSku(scope.row)"
              class="text-primary"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="deleteSku(scope.row)"
              class="text-danger"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="skuList.length === 0" class="empty-tip">
        暂无SKU数据，可点击上方添加
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance} from 'element-plus'



interface Sku {
  skuSn: string;          // SKU编号
  specJson: Record<string, string>;
  price: number;           // 销售价格
  marketPrice?: number;    //市场价
  costPrice?: number;      // 成本价
  stock: number;           // 库存
  imageUrl?: string;       // SKU图片
  weight?: number;         // 重量(kg)
  volume?: number;         // 体积
  productId: string;       // 关联商品ID
}
interface RuleItem {
  required?: boolean;
  message: string;
  trigger?: string | string[];
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'email' | 'hex' | 'integer'; // 验证的数据类型
  max?: number;
  min?: number;
  len?: number;
  enum?: any[];
  whitespace?: boolean;
  pattern?: RegExp;
  transform?: (value: any) => any;
  validator?: (rule: any, value: any, callback: (error?: Error) => void) => Promise<void> | void; // 自定义验证函数
  fields?: Record<string, RuleItem[]>;
  defaultField?: RuleItem;
}

interface SpecItem {
  key: string;
  value: string;
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
  add: [sku: Sku]
  delete: [skuSn: string]
}>()
//监听弹窗显示
const isVisible = ref(props.visible)
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    loadSkuData()
    resetSkuForm()
  }
})

// 监听弹窗关闭
watch(isVisible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

const skuFormRef = ref<FormInstance>()
const isEdit = ref(false)
const editIndex = ref(-1)

// 动态规格项（用于放specJson）
const specItems = ref<SpecItem[]>([{ key: '', value: '' }])

// SKU数据
const skuForm = reactive<Sku>({
  skuSn: '',
  specJson: {},
  price: 0,
  stock: 0,
  productId: props.productId
})

// 监听productId变化，更新表单中的productId
watch(() => props.productId, (newVal) => {
  skuForm.productId = newVal
})

// SKU验证
const skuRules = reactive<Record<string, RuleItem[]>>({
  skuSn: [
    { required: true, message: '请输入SKU编号', trigger: 'blur' },
    { min: 2, max: 50, message: 'SKU编号长度为2-50字符', trigger: 'blur' }
  ],
  specJson: [
    {
      type: 'object',
      required: true,
      message: '请选择规格组合',
    }
  ],
  price: [
    { required: true, message: '请输入销售价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格不能小于0.01元', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
  ]
})

const skuList = ref<Sku[]>([])

// 加载SKU数据
const loadSkuData = () => {
  skuList.value = [
    {
      skuSn: `${props.productId}-WH-M`,
      specJson: { "颜色": "白色", "尺码": "M" },
      price: 99.00,
      stock: 50,
      productId: props.productId
    },
    {
      skuSn: `${props.productId}-BK-L`,
      specJson: { "颜色": "黑色", "尺码": "L" },
      price: 109.00,
      stock: 30,
      productId: props.productId
    }
  ]
}

// 添加
const addSpecItem = () => {
  if (specItems.value.length >= 5) {
    ElMessage.warning('最多添加5组规格')
    return
  }
  specItems.value.push({ key: '', value: '' })
}

// 移除
const removeSpecItem = (index: number) => {
  if (specItems.value.length <= 1) {
    ElMessage.warning('至少保留1组规格')
    return
  }
  specItems.value.splice(index, 1)
}

// 重置
const resetSkuForm = () => {
  skuFormRef.value?.resetFields() // 重置表单字段值
  Object.assign(skuForm, {
    skuSn: '',
    specJson: {},
    price: 0,
    stock: 0,
    productId: props.productId
  })
  // 重置
  specItems.value = [{ key: '', value: '' }]
  isEdit.value = false
  editIndex.value = -1
}

// 编辑SKU
const editSku = (row: Sku) => {
  isEdit.value = true
  editIndex.value = skuList.value.findIndex(
    sku => sku.skuSn === row.skuSn && sku.productId === row.productId
  )
  // 回显
  Object.assign(skuForm, { ...row })

  specItems.value = Object.entries(row.specJson).map(([key, value]) => ({ key, value }))
  if (specItems.value.length === 0) {
    specItems.value = [{ key: '', value: '' }]
  }
}

// 提交SKU
const submitSku = () => {
  skuFormRef.value?.validate(async (valid) => {
    if (!valid) return

    try {
      // 组装specJson
      skuForm.specJson = specItems.value.reduce((obj, item) => {
        if (item.key && item.value) obj[item.key] = item.value
        return obj
      }, {} as Record<string, string>)

      if (isEdit.value) {
        skuList.value[editIndex.value] = { ...skuForm }
        ElMessage.success('SKU更新成功！')
      } else {
        skuList.value.push({ ...skuForm })
               emit('add', skuForm)
      }
      emit('update', skuList.value)
      resetSkuForm()
    } catch (error) {
      ElMessage.error(isEdit.value ? 'SKU更新失败！' : 'SKU添加失败！')
      console.error('SKU操作失败：', error)
    }
  })
}


// 删除SKU
const deleteSku = (row: Sku) => {
      skuList.value = skuList.value.filter(
        sku => !(sku.skuSn === row.skuSn && sku.productId === row.productId)
      ) // 过滤掉要删除的SKU
      emit('delete', row.skuSn)
      emit('update', skuList.value)
      ElMessage.success('SKU删除成功！')
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
</style>
