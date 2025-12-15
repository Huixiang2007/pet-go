<template>
  <div class="bg-yellow-50 min-h-screen flex flex-col">
    <SellerManHeader @logout="handleLogout" />

    <div class="flex flex-1 overflow-hidden">
      <SellerManNav />
      <div class="flex-1 overflow-auto p-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div
            class="flex flex-row justify-between items-center border-b border-gray-200 px-4 py-3 mb-3"
          >
            <div class="text-lg font-bold text-gray-800">商品管理</div>
            <div class="flex flex-row gap-2">
              <el-input placeholder="请输入商品名/商品编号" clearable style="width: 200px">
                <template #prefix>
                  <i class="fas fa-search text-md text-gray-300"></i>
                </template>
              </el-input>
              <el-button size="default" type="primary">搜索</el-button>
              <el-button size="default" type="success" icon="Plus" @click="openAdd">
                上新商品
              </el-button>
              <el-button size="default" type="danger" @click="handleBatchRemove">
                批量移除
              </el-button>
              <el-button size="default" type="warning" @click="handleBatchShelveOn">
                批量上架
              </el-button>
              <el-button size="default" type="default" @click="handleBatchShelveOff">
                批量下架
              </el-button>
            </div>
          </div>
          <el-table
           ref="productTable"
  :data="tableData"
  @selection-change="onSelectionChange"
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
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="商品编号" min-width="80" show-overflow-tooltip />
            <el-table-column
              prop="productName"
              label="商品名称"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="productType"
              label="商品分类"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="productSn"
              label="商品货号"
              min-width="100"
              show-overflow-tooltip
            />
            <el-table-column prop="price" label="商品价格" min-width="100" show-overflow-tooltip />
            <el-table-column prop="stock" label="库存数量" min-width="80" show-overflow-tooltip />
            <el-table-column
              prop="stockStatus"
              label="库存状态"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="scope">
                <el-tag :type="getStockStatusTagType(scope.row.stockStatus)" size="small">
                  {{ scope.row.stockStatus }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="商品状态" min-width="80">
              <template #default="scope">
                <el-tag
                  :type="getStatusTagType(scope.row.status)"
                  size="small"
                  style="
                    line-height: 1.4;
                    display: inline-block;
                    width: 80px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                  "
                >
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" min-width="130">
              <template #default="scope">
                <div class="">
                  <el-button
                    size="mini"
                    type="text"
                    class="text-yellow-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    @click="openDetailDialog(scope.row)"
                    >详情</el-button
                  >

                  <el-button
                    size="mini"
                    type="text"
                    class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    @click="openEditDialog(scope.row)"
                    >编辑</el-button
                  >

                  <el-dropdown size="mini" placement="bottom">
                    <el-button
                      size="mini"
                      type="text"
                      class="text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors ml-[12px]"
                    >
                      更多 <el-icon class="ml-1"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="openReplenishDialog(scope.row)">
                          补货
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click="handleToggleShelve(scope.row)"
                          :class="scope.row.status === '已下架' ? '' : 'text-red-600'"
                        >
                          {{ scope.row.status === '已下架' ? '上架' : '下架' }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="handleRemove(scope.row)" class="text-red-600">
                          移除
                        </el-dropdown-item>
                        <el-dropdown-item @click="openSkuManageDialog(scope.row)">
                          SKU管理
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
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

          <div class="px-4 py-2 border-t border-gray-200 flex justify-between items-center">
            <div class="text-sm text-gray-500">共 {{ tableData.length }} 条记录</div>
            <el-pagination
              layout="prev, pager, next,total"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
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
  @update:visible="detailDialogVisible = $event"
/>

  <!-- 商品编辑弹窗组件 -->
<EditDialog
  v-model:visible="editDialogVisible"
  :product="currentEditProduct"
  @close="editDialogVisible = false"
  @update="handleEditUpdate"
/>
  <!-- sku弹窗组件 -->
  <SkuManange
    :visible="skuDialogVisible"
    :product-id="currentSkuProductId"
    :product-name="currentSkuProductName"
    @close="skuDialogVisible = false"
    @update="handleSkuUpdate"
    @delete="handleSkuDelete"
    @addSku="handleSkuAdd"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch} from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import DetailDialog from './components/DetailDialog.vue'
import EditDialog from './components/EditDialog.vue'
import SkuManange from './components/SkuManange.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

const openAdd = () => {
  router.push('/add-product')
}

interface TableRow {
  id: string
  productName: string
  productType: string
  productSn: string
  price: number;
  stock: number;
  status: string
  stockStatus: string
}

const tableData = ref<TableRow[]>([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)
console.log(localStorage.getItem('authToken'))
const authToken = localStorage.getItem('authToken')
// 获取商品
const getItem = () => {
  axios
    .request({
      url: '/server/api/shop/shops/list',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
      data: {
        pageSize: pageSize.value,
        pageNum: currentPage.value,
      },
    })
    .then((res: any) => {
      console.log(res)
      if (res.data?.data) {
        tableData.value = res.data.data.list
        total.value = res.data.data.total
      }
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('获取商品列表失败！')
      console.log('服务器返回的错误详情：', err.response?.data)
      console.log('请求URL：', err.config?.url)
      console.log('请求参数：', err.config?.data)
    })
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getItem()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  getItem()
}
  const selectedRows = ref<TableRow[]>([])
function onSelectionChange(rows: TableRow[]) {
  selectedRows.value = rows || []
}
//挂载
onMounted(() => {
  getItem()
})
// 获取状态
const getStatusTagType = (status: string) => {
  switch (status) {
    case '上架':
      return 'success'
    case '下架':
      return 'danger'
    case '审核中':
      return 'info'
    default:
      return ''
  }
}
//获取库存状态
const getStockStatusTagType = (stockStatus: string) => {
  switch (stockStatus) {
    case '库存充足':
      return 'success'
    case '库存不足':
      return 'danger'
    case '已售罄':
      return 'danger'
    default:
      return ''
  }
}

//移除商品
const handleRemove = (row: TableRow) => {
  ElMessageBox.confirm('确认移除该商品？').then(() => {
    axios
      .request({
        url: `/server/api/shop/product/remove/` + row.id,
        method: 'POST',
      })
      .then((res: any) => {
        if (row.status === '已下架') {
          console.log(res)
          console.log(row.id)
          ElMessage.success('商品移除成功！')
        } else {
          ElMessage.error('商品下架后才能移除！')
        }
      })
      .catch((error) => {
        console.log(error)
        ElMessage.error('商品移除失败！')
      })
  })
}
//批量移除商品
const handleBatchRemove = () => {
  const selectedRows = tableData.value.filter((item) => item) // 过滤掉未选中的行
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择要移除的商品！')
    return
  }
  ElMessageBox.confirm('确认移除选中的商品？').then(() => {
    axios
      .request({
        url: `/server/api/shop/product/remove/batch`,
        method: 'POST',
        data: selectedRows.map((item) => item.id),
      })
      .then((res: any) => {
        if (selectedRows.map((item) => item.status).every((status) => status === '已下架')) {
          console.log(res)
          ElMessage.success('商品移除成功！')
          getItem()
        } else {
          ElMessage.error('商品下架后才能移除！')
        }
      })
      .catch((error) => {
        console.log(error)
        ElMessage.error('商品移除失败！')
      })
  })
}

//注销
const shopId = localStorage.getItem('userId')
console.log(shopId)
const handleLogout = () => {
  ElMessageBox.confirm('确认注销登录？').then(() => {
    axios
      .request({
        url: `/server/api/shop/shops/delete/` + shopId,
        method: 'POST',
      })
      .then(() => {
        router.push('/shop')
        ElMessage.success('注销成功！')
      })
      .catch((error) => {
        console.log(error)
        ElMessage.error('注销失败！')
      })
  })
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
  replenishForm.name = row.productName
  replenishForm.currentStock = row.stock.toString()
  replenishForm.addStock = 0
  replenishDialogVisible.value = true
}
// 提交补货
const submitReplenish = () => {
  replenishFormRef.value?.validate((valid) => {
    if (valid) {
      const newStock = Number(replenishForm.currentStock) + replenishForm.addStock
      const targetRow = tableData.value.find((item) => item.id === replenishForm.id)
      if (targetRow) {
        targetRow.stock = Number(newStock.toString())
        if (targetRow.status === '库存不足' && newStock > 0) {
          targetRow.status = '已上架'
        } else if (targetRow.status === '已下架' && newStock > 0) {
          targetRow.status = '已上架'
        }

        // 更新详情映射中的库存
        if (productDetailMap[targetRow.id]) {
          productDetailMap[targetRow.id].stock = Number(newStock.toString())
          productDetailMap[targetRow.id].status = targetRow.status
        }
      }
      replenishDialogVisible.value = false
      ElMessage.success('补货成功！')
    }
  })
}


interface ProductDetail extends TableRow {
  shelfTime: string
  mainImage: string
  images: string[]
  imageList: string[]
  params: { name: string; value: string }[]
  currentPrice: number
  stockStatus: string
  brandName: string
  marketPrice: number
  productWeight: number
  sales: number
  reviewCount: number
  productScore: number
  warrantyTip: string
  detail: string
  subTitle: string
}
// 商品详情
const productDetailMap: Record<string, ProductDetail> = {}
const detailDialogVisible = ref(false)
const currentProduct = reactive<ProductDetail>({
  // TableRow 基础字段
  id: '',
  productName: '',
  productType: '',
  productSn: '',
  price: 0,
  stock: 0,
  status: '',
  stockStatus: '',

  shelfTime: '',
  mainImage: '',
  images: [],
  imageList: [],
  params: [],
  currentPrice: 0,
  brandName: '',
  marketPrice: 0,
  productWeight: 0,
  sales: 0,
  reviewCount: 0,
  productScore: 0,
  warrantyTip: '',
  detail: '',
  subTitle: ''
})

let detailRequestCancel: (() => void) | null = null

const openDetailDialog = (row: TableRow) => {
  if (detailRequestCancel) {
    detailRequestCancel()
    detailRequestCancel = null
  }

    detailDialogVisible.value = true
  Object.assign(currentProduct, {
    ...row,
    shelfTime: '',
    mainImage: '',
    images: [],
    imageList: [], // 初始化
    params: [],
    currentPrice: 0,
    brandName: '',
    marketPrice: 0,
    productWeight: 0,
    sales: 0,
    reviewCount: 0,
    productScore: 0,
    warrantyTip: '',
    detail: '',
    subTitle: ''
  })

  axios.request({
    url: '/server/api/shop/shops/list/' + row.id,
    method: 'GET',
    headers: { Authorization: 'Bearer ' + authToken },
  })
  .then((res: any) => {
    console.log('接口返回数据：', res.data.data)
    const apiData = res.data.data || {}


    currentProduct.brandName = apiData.brandName || ''
    currentProduct.currentPrice = apiData.currentPrice || 0
    currentProduct.price = (apiData.currentPrice || 0).toFixed(2)
    currentProduct.detail = apiData.detail || '暂无描述'
    currentProduct.mainImage = apiData.mainImage || ''
    currentProduct.marketPrice = apiData.marketPrice || 0
    currentProduct.productScore = apiData.productScore || 0
    currentProduct.productWeight = apiData.productWeight || 0
    currentProduct.shelfTime = apiData.shelfTime || '暂无上架时间'
    currentProduct.reviewCount = apiData.reviewCount || 0
    currentProduct.sales = apiData.sales || 0
    currentProduct.subTitle = apiData.subTitle || apiData.subtitle || ''
    currentProduct.warrantyTip = apiData.warrantyTip || ''
    currentProduct.stockStatus = apiData.stockStatus || row.stockStatus


    currentProduct.images = apiData.images ? apiData.images.split(',').filter(Boolean) : []
    currentProduct.imageList = [...currentProduct.images]

    currentProduct.params = Array.isArray(apiData.params) ? apiData.params : []


    productDetailMap[row.id] = { ...currentProduct }
  })
  .catch((err) => {
    console.error('接口请求失败：', err)
    ElMessage.error('获取商品详情失败！')
  })
}
watch(detailDialogVisible, (newVal) => {
  if (!newVal && detailRequestCancel) {
    detailRequestCancel()
    detailRequestCancel = null
  }
})
// 编辑弹窗显示
const editDialogVisible = ref(false)
// 添加Type接口
export interface Type {
  id: number;
  name: string;
}

// 编辑弹窗显示
interface ProductEdit extends TableRow {
  id: string;
  productName: string;
  productSn: string;
  brandId: number;
  typeParent: Type;
  typeChild: Type;
  currentPrice: number;
  marketPrice: number;
  costPrice: number;
  stock: number;
  status: string;
  detail: string;
  warrantyTip: string;
  mainImage: string;
}

const currentEditProduct = reactive<ProductEdit>({
  id: '',
  productName: '',
  productType: '',
  productSn: '',
  price: 0,
  stock: 0,
  status: '',
  stockStatus: '',

  brandId: 0,
  typeParent: { id: 0, name: '' },
  typeChild: { id: 0, name: '' },
  currentPrice: 0,
  marketPrice: 0,
  costPrice: 0,
  detail: '',
  warrantyTip: '',
  mainImage: ''
})
// 打开编辑弹窗
const openEditDialog = (row: TableRow | ProductEdit) => {
  const detail = productDetailMap[row.id] ? JSON.parse(JSON.stringify(productDetailMap[row.id])) : JSON.parse(JSON.stringify(row))


  const defaultDetail = {
    mainImage: '',
    images: [],
    imageList: [],
    shelfTime: '未知',
    detail: '',
    params: [],
    currentPrice: 0,
    brandName: '',
    marketPrice: 0,
    productWeight: 0,
    sales: 0,
    reviewCount: 0,
    productScore: 0,
    warrantyTip: '',
    subTitle: ''
  }
  Object.assign(currentEditProduct, defaultDetail, detail)

  editDialogVisible.value = true
}

const handleEditUpdate = (updatedForm: any) => {
  console.log('handleEditUpdate被调用，参数：', updatedForm)

  if (!updatedForm.id) {
    ElMessage.warning('商品ID不能为空！')
    return
  }
  const priceValue = updatedForm.currentPrice || updatedForm.price
  if (typeof priceValue === 'number') {
    const priceStr = priceValue.toFixed(2)

    const targetRow = tableData.value.find((item) => item.id === updatedForm.id)
    console.log('找到的目标行：', targetRow)

    if (targetRow) {
      targetRow.productName = updatedForm.productName
      targetRow.productType = updatedForm.productType
      targetRow.productSn = updatedForm.productSn
      targetRow.price =Number(priceStr)
      targetRow.stock = updatedForm.stock
      targetRow.status = updatedForm.status
    }
    if (productDetailMap[updatedForm.id]) {
      productDetailMap[updatedForm.id] = {
        ...productDetailMap[updatedForm.id],
        productName: updatedForm.productName,
        productType: updatedForm.productType,
        productSn: updatedForm.productSn,
        price: Number(priceStr),
        stock: updatedForm.stock,
        status: updatedForm.status,
        mainImage: updatedForm.mainImage,
        detail: updatedForm.detail,
        currentPrice: priceValue
      }
    }

    axios.request({
      url: '/server/api/shop/product/update/' + updatedForm.id,
      method: 'post',
      headers: { Authorization: 'Bearer ' + authToken },
      data: {
        id: updatedForm.id,
        productName: updatedForm.productName,
        productType: updatedForm.productType,
        productSn: updatedForm.productSn,
        price: priceStr,
        stock: updatedForm.stock,
        status: updatedForm.status,
        mainImage: updatedForm.mainImage,
        detail: updatedForm.detail
      }
    })
    .then((res) => {
      console.log('商品编辑成功', res)
        ElMessage.success(res.data.msg)
        getItem()
    })
    .catch((err) => {
      ElMessage.error('商品编辑失败！')
      console.log('商品编辑失败：', err)
    })
  } else {
    ElMessage.error('商品价格格式不正确！')
    return
  }

  editDialogVisible.value = false
}

// SKU管理弹窗
const skuDialogVisible = ref(false)
const currentSkuProductId = ref('')
const currentSkuProductName = ref('')

// 打开SKU管理弹窗
const openSkuManageDialog = (row: TableRow) => {
  currentSkuProductId.value = row.id
  console.log(row.id)
  currentSkuProductName.value =  row.productName
  console.log(row.productName)
  skuDialogVisible.value = true
}

// 处理SKU更新
const handleSkuUpdate = (skuList: any[]) => {
  console.log('SKU列表更新:', skuList)
  if (productDetailMap.value && currentSkuProductId.value) {
    const productDetail = productDetailMap.productDetailMap[currentSkuProductId.value] || {}
    productDetail.skuList = skuList
    productDetailMap.productDetailMap[currentSkuProductId.value] = productDetail
  }

  // 更新表格中的库存信息
  const totalStock = skuList.reduce((sum, sku) => sum + sku.stock, 0)
  const productIndex = tableData.value.findIndex((item) => item.id === currentSkuProductId.value)
  if (productIndex !== -1) {
    tableData.value[productIndex].stock = totalStock.toString()
  }

  axios
    .request({
      url: `/server/api/shop/sku/update/sku/${currentSkuProductId.value}`,
      method: 'post',
      data: skuList,
    })
    .then((res) => {
      console.log('SKU列表更新成功！')
      console.log(res)
    })
    .catch(() => {
      console.log('SKU列表更新失败！')
    })
}
// 处理SKU删除
const handleSkuDelete = (skuId: string) => {
  ElMessageBox.confirm('确定删除该SKU吗？', '删除确认', { type: 'warning' })
  axios
    .request({
      url: '/server/api/shop/sku/delete/{skuId}',
      method: 'delete',
      data: { skuId },
    })
    .then(() => {
      ElMessage.success('SKU删除成功！')
    })
    .catch(() => {
      ElMessage.error('SKU删除失败！')
    })
}
// 处理SKU新增
const handleSkuAdd = (sku: any) => { // 参数改为单个SKU对象
  console.log('待新增的SKU:', sku);
  if (!sku) {
    ElMessage.warning('SKU数据为空，无法新增')
    return
  }
  const skuArray = [sku];
  axios.request({
    url: '/server/api/shop/sku/add',
    method: 'post',
    params: { productId: currentSkuProductId.value },
    data: skuArray,
    headers: {
      Authorization: 'Bearer ' + authToken,
    }
  })
  .then((res) => {
    console.log('新增成功:', res);
    ElMessage.success('SKU新增成功！');
  })
  .catch((err) => {
    console.error('新增失败详情:', err);
    console.error('实际传递的请求体:', skuArray);
    ElMessage.error('SKU新增失败！');
  });
};


// 上/下架商品
const handleToggleShelve = (row: TableRow) => {
  const isCurrentlyOff = row.status === '已下架'
  const desiredStatusCode = isCurrentlyOff ? 1 : 2
  const confirmText = isCurrentlyOff ? '确认要上架该商品吗？' : '确定要下架该商品吗？'

  if (isCurrentlyOff && Number(row.stock) <= 0) {
    ElMessage.warning('库存为0,不能上架,请先补货。')
    return
  }

  ElMessageBox.confirm(confirmText, '操作确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    axios
      .request({
        url: '/server/api/shop/shops/product-status',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
        params: {
          status: desiredStatusCode,
          productId: row.id,
        },
      })
      .then((res: any) => {
        console.log(res)
        const targetRow = tableData.value.find((item) => item.id === row.id)
        if (targetRow) {
          targetRow.status = isCurrentlyOff ? '已上架' : '已下架'
          if (productDetailMap[row.id]) {
            productDetailMap[row.id].status = targetRow.status
          }
        }
        ElMessage.success(isCurrentlyOff ? '商品已上架！' : '商品已下架！')
      })
      .catch((err) => {
        console.error('切换上下架失败：', err)
        ElMessage.error('操作失败，请稍后重试')
      })
  })
}
// 批量上架
const handleBatchShelveOn = () => {
  if (!selectedRows.value || selectedRows.value.length === 0) {
    ElMessage.warning('请先勾选要上架的商品')
    return
  }
  const toOn = selectedRows.value.filter((r) => r.status !== '上架')
  if (toOn.length === 0) {
    ElMessage.info('所选商品均已上架')
    return
  }

  ElMessageBox.confirm(`确认要将 ${toOn.length} 件商品批量上架吗？`, '确认', { type: 'warning' })
    .then(() => {
      axios
        .request({
          url: '/server/api/shop/shops/product-status/batch',
          method: 'POST',
          headers: { Authorization: 'Bearer ' + authToken },
          params: { status: 1 },
          data: toOn.map((r) => r.id),
        })
        .then((res: any) => {
          console.log(res)
          ElMessage.success('批量上架成功')
          getItem()
        })
        .catch((err) => {
          console.error('批量上架失败', err)
          ElMessage.error('批量上架失败，请重试')
        })
    })
    .catch(() => {
      ElMessage.info('操作已取消')
    })
}

// 批量上架

const handleBatchShelveOff = () => {
  if (!selectedRows.value || selectedRows.value.length === 0) {
    ElMessage.warning('请先勾选要下架的商品')
    return
  }
  const toOn = selectedRows.value.filter((r) => r.status !== '下架')
  if (toOn.length === 0) {
    ElMessage.info('所选商品均已下架')
    return
  }

  ElMessageBox.confirm(`确认要将 ${toOn.length} 件商品批量下架吗？`, '确认', { type: 'warning' })
    .then(() => {
      axios
        .request({
          url: '/server/api/shop/shops/product-status/batch',
          method: 'POST',
          headers: { Authorization: 'Bearer ' + authToken },
          params: { status: 2 },
          data: toOn.map((r) => r.id),
        })
        .then((res: any) => {
          console.log(res)
          ElMessage.success('批量下架成功')
          getItem()
        })
        .catch((err) => {
          console.error('批量下架失败', err)
          ElMessage.error('批量下架失败，请重试')
        })
    })
    .catch(() => {
      ElMessage.info('操作已取消')
    })
}
</script>

<style scoped>
:deep(.el-tag--success) {
  background-color: #f0f9ff;
  color: #52c41a;
  border-color: #b7eb8f;
}
:deep(.el-tag--warning) {
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
:deep(.el-pagination) {
  margin-top: 0;
}
:deep(.el-pager li) {
  margin: 0 2px;
}
:deep(el-table-column) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: inherit;
}
</style>
