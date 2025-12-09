<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />
      <div class="flex-1 overflow-auto p-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div
            class="flex flex-row justify-between items-center border-b border-gray-200 px-4 py-3 mb-3"
          >
            <div class="text-lg font-bold text-gray-800">商品管理</div>
            <div class="flex flex-row gap-3">
              <el-input placeholder="请输入商品名/商品编号" clearable style="width: 200px">
                <template #prefix>
                  <i class="fas fa-search text-md text-gray-300"></i>
                </template>
              </el-input>
              <el-button size="default" type="primary">搜索</el-button>
              <el-button size="default" type="success" icon="Plus" @click="openAdd"> 上新商品 </el-button>
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            stripe
            :cell-style="{ padding: '14px 0', borderRight: '1px solid #f0f0f0' }"
            :header-cell-style="{
              background: '#f5f5f5',
              color: '#606266',
              fontWeight: '500',
              borderBottom: '1px solid #e0e0e0',
            }"
          >
            <el-table-column prop="id" label="商品编号" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="category" label="商品分类" />
            <el-table-column prop="price" label="商品价格" />
            <el-table-column prop="stock" label="库存数量" />

            <el-table-column prop="status" label="商品状态">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)" size="small">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template #default="scope">
                <div class="grid md:grid-cols-4 gap-2 ">
                  <el-button
                    size="mini"
                    type="text"
                    class="text-yellow-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    @click="openDetailDialog(scope.row)"
                  >详情</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    @click="openEditDialog(scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="openReplenishDialog(scope.row)"
                    class="text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors"
                  >补货</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    class="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                    @click="handleShelveOff(scope.row)"
                  >下架</el-button>
                </div>
              </template>
            </el-table-column>

            <template #empty>
              <div class="py-10 flex flex-col items-center justify-center text-gray-400">
                <i class="fas fa-box-open text-4xl mb-3"></i>
                <div class="text-lg">暂无商品数据</div>
                <div class="text-sm mt-1">请检查搜索条件或添加商品</div>
              </div>
            </template>
          </el-table>

          <div class="px-4 py-3 border-t border-gray-200 flex justify-between items-center mt-3">
            <div class="text-sm text-gray-500">共 {{ tableData.length }} 条记录</div>
            <el-pagination
              layout="prev, pager, next"
              :total="120"
              :page-size="10"
              :pager-count="5"
              style="margin: 0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 补货弹窗 -->
  <el-dialog
    v-model="replenishDialogVisible"
    title="商品补货"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form
      :model="replenishForm"
      :rules="replenishRules"
      ref="replenishFormRef"
      label-width="80px"
    >
      <el-form-item label="商品编号" prop="id">
        <el-input v-model="replenishForm.id" disabled />
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="replenishForm.name" disabled />
      </el-form-item>
      <el-form-item label="当前库存" prop="currentStock">
        <el-input v-model="replenishForm.currentStock" disabled />
      </el-form-item>
      <el-form-item label="补货数量" prop="addStock">
        <el-input
          v-model.number="replenishForm.addStock"
          type="number"
          min="1"
          placeholder="请输入补货数量"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="replenishDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitReplenish">确认补货</el-button>
    </template>
  </el-dialog>


  <DetailDialog
    :visible="detailDialogVisible"
    :product="currentProduct"
    @close="detailDialogVisible = false"
    @edit="handleDetailEdit"
  />

  <!-- 商品编辑弹窗组件 -->
  <EditDialog
    :visible="editDialogVisible"
    :product="currentEditProduct"
    @close="editDialogVisible = false"
    @update="handleEditUpdate"
  />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import DetailDialog from './components/DetailDialog.vue'
import EditDialog from './components/EditDialog.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const openAdd = () =>{
  router.push('/add-product')
}

interface TableRow {
  id: string
  name: string
  category: string
  price: string
  stock: string
  status: string
}

// 商品详情类型
interface ProductDetail extends TableRow {
  mainImage: string
  imageList: string[]
  shelfTime: string
  desc: string
  params: { name: string; value: string }[]
}

// 编辑表单类型定义
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

const tableData: TableRow[] = [
  {
    id: 'SP2025001',
    name: '夏季纯棉T恤',
    category: '服装/上衣',
    price: '99.00',
    stock: '120',
    status: '已上架',
  },
  {
    id: 'SP2025002',
    name: '无线蓝牙耳机',
    category: '数码/音频',
    price: '299.00',
    stock: '58',
    status: '已上架',
  },
  {
    id: 'SP2025003',
    name: '智能保温杯',
    category: '家居/日用品',
    price: '129.00',
    stock: '3',
    status: '库存不足',
  },
  {
    id: 'SP2025004',
    name: '机械键盘青轴',
    category: '数码/外设',
    price: '399.00',
    stock: '0',
    status: '已下架',
  },
  {
    id: 'SP2025005',
    name: '新款运动鞋',
    category: '鞋类/休闲',
    price: '499.00',
    stock: '80',
    status: '待审核',
  },
]

// 商品详情
const productDetailMap: Record<string, ProductDetail> = {
  'SP2025001': {
    id: 'SP2025001',
    name: '夏季纯棉T恤',
    category: '服装/上衣',
    price: '99.00',
    stock: '120',
    status: '已上架',
    mainImage: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a488jpeg.jpeg',
    imageList: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a488jpeg.jpeg',
      'https://cube.elemecdn.com/9/c2/f078c2e748559af4406c0f614c9548jpeg.jpeg',
      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    ],
    shelfTime: '2025-01-15',
    desc: '100%纯棉材质，亲肤透气，夏季穿着凉爽不闷热。多种颜色可选，宽松版型适合各种体型，领口加固设计不易变形，机洗不缩水。',
    params: [
      { name: '材质', value: '100%棉' },
      { name: '版型', value: '宽松' },
      { name: '颜色', value: '白色、黑色、蓝色、灰色' },
      { name: '尺码', value: 'M、L、XL、XXL' },
      { name: '洗涤方式', value: '可机洗' },
      { name: '产地', value: '广东' }
    ]
  },
  'SP2025002': {
    id: 'SP2025002',
    name: '无线蓝牙耳机',
    category: '数码/音频',
    price: '299.00',
    stock: '58',
    status: '已上架',
    mainImage: 'https://cube.elemecdn.com/3/28/bbf893f7920eca359837602823458jpeg.jpeg',
    imageList: [
      'https://cube.elemecdn.com/3/28/bbf893f7920eca359837602823458jpeg.jpeg',
      'https://cube.elemecdn.com/8/27/27386f497385c64006c75c51e5608jpeg.jpeg',
      'https://cube.elemecdn.com/c/cd/c164e05df79a3914609334a657108jpeg.jpeg'
    ],
    shelfTime: '2025-02-20',
    desc: '蓝牙5.3芯片，连接稳定无延迟，支持降噪功能，通话清晰。单次续航6小时，充电仓续航24小时，IPX4防水，适配安卓/iOS系统。',
    params: [
      { name: '蓝牙版本', value: '5.3' },
      { name: '降噪类型', value: '环境音降噪' },
      { name: '单次续航', value: '6小时' },
      { name: '总续航', value: '24小时' },
      { name: '防水等级', value: 'IPX4' },
      { name: '充电接口', value: 'Type-C' }
    ]
  },
  'SP2025003': {
    id: 'SP2025003',
    name: '智能保温杯',
    category: '家居/日用品',
    price: '129.00',
    stock: '3',
    status: '库存不足',
    mainImage: 'https://cube.elemecdn.com/7/24/76f93f7920eca359837602823458jpeg.jpeg',
    imageList: [
      'https://cube.elemecdn.com/7/24/76f93f7920eca359837602823458jpeg.jpeg',
      'https://cube.elemecdn.com/9/12/12386f497385c64006c75c51e5608jpeg.jpeg'
    ],
    shelfTime: '2025-03-10',
    desc: '316不锈钢内胆，智能数显温度，24小时保温保冷。500ml大容量，一键开盖设计，便携防漏，适合办公/户外使用。',
    params: [
      { name: '内胆材质', value: '316不锈钢' },
      { name: '容量', value: '500ml' },
      { name: '保温时长', value: '24小时' },
      { name: '显示方式', value: 'LED数显' },
      { name: '开盖方式', value: '一键开盖' },
      { name: '重量', value: '380g' }
    ]
  },
  'SP2025004': {
    id: 'SP2025004',
    name: '机械键盘青轴',
    category: '数码/外设',
    price: '399.00',
    stock: '0',
    status: '已下架',
    mainImage: 'https://cube.elemecdn.com/5/67/67f93f7920eca359837602823458jpeg.jpeg',
    imageList: [
      'https://cube.elemecdn.com/5/67/67f93f7920eca359837602823458jpeg.jpeg',
      'https://cube.elemecdn.com/8/90/90386f497385c64006c75c51e5608jpeg.jpeg'
    ],
    shelfTime: '2025-01-05',
    desc: '104键全尺寸布局，青轴机械轴体，段落感强，打字清脆。RGB背光，支持自定义灯光效果，有线/无线双模连接，兼容Windows/Mac系统。',
    params: [
      { name: '轴体类型', value: '青轴' },
      { name: '键位数量', value: '104键' },
      { name: '连接方式', value: '有线+无线2.4G' },
      { name: '背光', value: 'RGB幻彩' },
      { name: '键帽材质', value: 'ABS双色注塑' },
      { name: '续航', value: '无线模式续航30天' }
    ]
  },
  'SP2025005': {
    id: 'SP2025005',
    name: '新款运动鞋',
    category: '鞋类/休闲',
    price: '499.00',
    stock: '80',
    status: '待审核',
    mainImage: 'https://cube.elemecdn.com/8/76/76f93f7920eca359837602823458jpeg.jpeg',
    imageList: [
      'https://cube.elemecdn.com/8/76/76f93f7920eca359837602823458jpeg.jpeg',
      'https://cube.elemecdn.com/1/23/23386f497385c64006c75c51e5608jpeg.jpeg',
      'https://cube.elemecdn.com/4/56/56386f497385c64006c75c51e5608jpeg.jpeg'
    ],
    shelfTime: '2025-04-01',
    desc: '透气网面设计，轻便缓震中底，防滑橡胶大底。人体工学鞋楦，贴合脚型，走路不累脚，适合日常休闲、慢跑等场景。',
    params: [
      { name: '鞋面材质', value: '透气网布' },
      { name: '中底材质', value: 'EVA缓震材质' },
      { name: '大底材质', value: '橡胶' },
      { name: '闭合方式', value: '系带' },
      { name: '鞋码', value: '38-44码' },
      { name: '重量', value: '约420g/只' }
    ]
  }
}

// 补货弹窗
const replenishDialogVisible = ref(false)
const replenishFormRef = ref<FormInstance>()
const replenishForm = reactive({
  id: '',
  name: '',
  currentStock: '',
  addStock: 0,
})
// 补货表单验证
const replenishRules = reactive<FormRules>({
  addStock: [
    { required: true, message: '请输入补货数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '补货数量不能小于1', trigger: 'blur' },
  ],
})
// 打开补货弹窗
const openReplenishDialog = (row: TableRow) => {
  replenishForm.id = row.id
  replenishForm.name = row.name
  replenishForm.currentStock = row.stock
  replenishForm.addStock = 0
  replenishDialogVisible.value = true
}

// 提交补货
const submitReplenish = () => {
  replenishFormRef.value?.validate((valid) => {
    if (valid) {
      const newStock = Number(replenishForm.currentStock) + replenishForm.addStock
      const targetRow = tableData.find((item) => item.id === replenishForm.id)
      if (targetRow) {
        targetRow.stock = newStock.toString()
        if (targetRow.status === '库存不足' && newStock > 0) {
          targetRow.status = '已上架'
        } else if (targetRow.status === '已下架' && newStock > 0) {
          targetRow.status = '已上架'
        }

        // 更新详情映射中的库存
        if (productDetailMap[targetRow.id]) {
          productDetailMap[targetRow.id].stock = newStock.toString()
          productDetailMap[targetRow.id].status = targetRow.status
        }
      }
      replenishDialogVisible.value = false
      ElMessage.success('补货成功！')
    }
  })
}


// 商品详情弹窗相关
const detailDialogVisible = ref(false)
const currentProduct = reactive<ProductDetail>({
  id: '',
  name: '',
  category: '',
  price: '',
  stock: '',
  status: '',
  mainImage: '',
  imageList: [],
  shelfTime: '',
  desc: '',
  params: []
})

// 商品编辑弹窗相关
const editDialogVisible = ref(false)
const currentEditProduct = reactive<ProductDetail>({
  id: '',
  name: '',
  category: '',
  price: '',
  stock: '',
  status: '',
  mainImage: '',
  imageList: [],
  shelfTime: '',
  desc: '',
  params: []
})

// 获取状态
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
      return ''
  }
}


// 打开详情弹窗
const openDetailDialog = (row: TableRow) => {
  const detail = productDetailMap[row.id] || {
    ...row,
    mainImage: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a488jpeg.jpeg',
    imageList: [],
    shelfTime: '未知',
    desc: '暂无商品描述',
    params: []
  }
  Object.assign(currentProduct, detail)
  detailDialogVisible.value = true
}

// 处理详情弹窗中的编辑按钮
const handleDetailEdit = (product: ProductDetail) => {
  Object.assign(currentEditProduct, product)
  detailDialogVisible.value = false
  editDialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (row: TableRow | ProductDetail) => {
  const detail = productDetailMap[row.id] || {
    ...row,
    mainImage: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a488jpeg.jpeg',
    imageList: [],
    shelfTime: '未知',
    desc: '',
    params: []
  }
  Object.assign(currentEditProduct, detail)
  editDialogVisible.value = true
}

const handleEditUpdate = (updatedForm: EditForm) => {
  const targetRow = tableData.find((item) => item.id === updatedForm.id)
  if (targetRow) {
    targetRow.name = updatedForm.name
    targetRow.category = updatedForm.category
    targetRow.price = updatedForm.price.toFixed(2)
    targetRow.stock = updatedForm.stock.toString()
    targetRow.status = updatedForm.status
  }
  if (productDetailMap[updatedForm.id]) {
    productDetailMap[updatedForm.id].name = updatedForm.name
    productDetailMap[updatedForm.id].category = updatedForm.category
    productDetailMap[updatedForm.id].price = updatedForm.price.toFixed(2)
    productDetailMap[updatedForm.id].stock = updatedForm.stock.toString()
    productDetailMap[updatedForm.id].status = updatedForm.status
    productDetailMap[updatedForm.id].desc = updatedForm.desc
    productDetailMap[updatedForm.id].mainImage = updatedForm.mainImage
  }
  editDialogVisible.value = false
}

// 下架商品
const handleShelveOff = (row: TableRow) => {
  ElMessageBox.confirm(
    '确定要下架该商品吗？下架后商品将不再展示在前台',
    '确认下架',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const targetRow = tableData.find((item) => item.id === row.id)
    if (targetRow) {
      targetRow.status = '已下架'
      if (productDetailMap[row.id]) {
        productDetailMap[row.id].status = '已下架'
      }
    }
    ElMessage.success('商品已下架！')
  }).catch(() => {
    ElMessage.info('已取消下架操作')
  })
}
</script>

<style scoped>
:deep(.el-tag--success ) {
  background-color: #f0f9ff;
  color: #52c41a;
  border-color: #b7eb8f;
}
:deep(.el-tag--warning ) {
  background-color: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}
:deep(.el-tag--info) {
  background-color: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}
:deep(.el-tag--danger) {
  background-color: #fff2f0;
  color: #f5222d;
  border-color: #ffccc7;
}
:deep(.el-table__row--striped td) {
  background-color: #fafafa !important;
}
:deep(.el-pagination ){
  margin-top: 0;
}
:deep(.el-pager li) {
  margin: 0 2px;
}
</style>
