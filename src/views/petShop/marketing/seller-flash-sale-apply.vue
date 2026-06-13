<template>
  <SellerManHeader />
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-3xl mx-auto">
      <!-- 申请表单 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <i class="fa fa-plus-circle text-orange-500 mr-2"></i>
          申请参与秒杀活动
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 商品信息 -->
          <div v-if="selectedProduct" class="p-4 bg-orange-50 rounded-xl">
            <div class="flex items-center">
              <img
                :src="selectedProduct.image"
                :alt="selectedProduct.name"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="ml-4">
                <h3 class="font-medium text-gray-800">{{ selectedProduct.name }}</h3>
                <p class="text-sm text-gray-500">原价: ¥{{ selectedProduct.price }}</p>
              </div>
            </div>
          </div>

          <!-- SKU选择 -->
          <div v-if="selectedProduct && skus.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              选择SKU <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label
                v-for="sku in skus"
                :key="sku.id"
                class="flex flex-col p-3 border-2 rounded-xl cursor-pointer transition-all"
                :class="[
                  form.skuId === sku.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300',
                ]"
              >
                <input v-model="form.skuId" type="radio" :value="sku.id" class="sr-only" />
                <span class="font-medium text-gray-800">{{ sku.name }}</span>
                <span class="text-sm text-gray-500">库存: {{ sku.stock }}</span>
              </label>
            </div>
          </div>
          <!-- 秒杀价格 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              秒杀价格（元） <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
              <input
                v-model.number="form.seckillPrice"
                type="number"
                min="0.01"
                step="0.01"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="请输入秒杀价格"
                required
              />
            </div>
            <p class="text-sm text-gray-500 mt-1">秒杀价格需低于商品原价</p>
            <p v-if="selectedProduct" class="text-sm text-orange-600 mt-1">
              建议价格: ¥{{ (selectedProduct.price * 0.8).toFixed(2) }} 以下
            </p>
          </div>

          <!-- 秒杀库存 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              秒杀库存 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              min="1"
              :max="selectedSku?.stock || 9999"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="请输入秒杀库存数量"
              required
            />
            <p v-if="selectedSku" class="text-sm text-gray-500 mt-1">
              最大可设置: {{ selectedSku.stock }} 件
            </p>
          </div>

          <!-- 每人限购 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              每人限购数量 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.limitPerUser"
              type="number"
              min="1"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="请输入每人限购数量"
              required
            />
          </div>

          <!-- 申请理由 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              申请理由 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.applyReason"
              rows="3"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="请描述商品优势或申请理由"
              required
            ></textarea>
          </div>

          <!-- 备注 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              v-model="form.remark"
              rows="2"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="其他备注信息（选填）"
            ></textarea>
          </div>

          <!-- 提交按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i class="fa fa-spinner fa-spin mr-2" v-if="loading"></i>
            {{ loading ? '提交中...' : '提交申请' }}
          </button>
        </form>
      </div>

      <!-- 申请须知 -->
      <div class="bg-blue-50 rounded-xl p-4">
        <h3 class="font-medium text-blue-800 mb-2 flex items-center">
          <i class="fa fa-info-circle mr-2"></i>
          申请须知
        </h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>• 秒杀价格需低于商品原价，否则申请将被驳回</li>
          <li>• 秒杀库存需大于0，且不超过所选SKU的总库存</li>
          <li>• 每人限购数量需大于0</li>
          <li>• 申请提交后需等待平台审核，审核通过后商品将参与秒杀</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { applyFlashSale } from '../../../api/pet-shop/flash'
import { Detail, skuListApi } from '../../../api/pet-shop/product'

interface Product {
  id: string | number
  name: string
  price: number
  image: string
}

interface Sku {
  id: number
  name: string
  stock: number
  price: number
}

// 表单数据
const form = ref({
  productId: 0,
  skuId: 0,
  seckillPrice: 0,
  stock: 0,
  limitPerUser: 0,
  applyReason: '',
  remark: '',
})

const selectedProduct = ref<Product | null>(null)
const skus = ref<Sku[]>([])
const loading = ref(false)

// 当前选中的SKU
const selectedSku = computed(() => {
  return skus.value.find((sku) => sku.id === form.value.skuId)
})

// 解析URL参数
const parseUrlParams = () => {
  const params = new URLSearchParams(window.location.search)
  const productId = params.get('productId')
  if (productId) {
    form.value.productId = Number(productId)
    return true
  }
  ElMessage.warning('未获取到商品ID')
  return false
}

// 加载商品信息 + SKU列表
const loadData = async () => {
  const productId = form.value.productId
  if (!productId) return

  try {
    //加载商品详情
    const productDetail = await Detail(productId)
    if (productDetail) {
      selectedProduct.value = {
        id: productDetail.id,
        name: productDetail.title || productDetail.name,
        price: (productDetail as any).marketPrice,
        image: productDetail.mainImage || 'https://via.placeholder.com/100',
      }
    }

    const skuResult = await skuListApi(productId, 1, 100)
    console.log('skuResult:', skuResult)
    if (skuResult?.list) {
      skus.value = skuResult.list.map((sku: any) => ({
        id: sku.skuId,
        name: sku.specText || '默认规格',
        stock: sku.stock || 0,
        price: sku.sellPrice || 0,
      }))
    }

    // 默认选中第一个SKU
    if (skus.value.length > 0) {
      form.value.skuId = skus.value[0].id
      form.value.stock = 0
      form.value.limitPerUser = 0
    }
  } catch (error) {
    console.error('加载数据失败：', error)
    ElMessage.error('加载商品信息失败')
  }
}

// 提交
const handleSubmit = async () => {
  if (!selectedSku.value) {
    ElMessage.warning('请选择商品SKU')
    return
  }
  if (form.value.seckillPrice <= 0) {
    ElMessage.warning('请输入有效的秒杀价格')
    return
  }
  if (selectedProduct.value && form.value.seckillPrice >= selectedProduct.value.price) {
    ElMessage.warning('秒杀价格必须低于商品原价')
    return
  }
  if (form.value.stock <= 0 || (selectedSku.value && form.value.stock > selectedSku.value.stock)) {
    ElMessage.warning('秒杀库存输入不合法')
    return
  }
  if (form.value.limitPerUser <= 0) {
    ElMessage.warning('请输入有效的限购数量')
    return
  }
  if (!form.value.applyReason.trim()) {
    ElMessage.warning('请输入申请理由')
    return
  }

  loading.value = true
  try {
    const res = await applyFlashSale(form.value)
    console.log('resqq:', res)
    if (res.ok === true) {
      form.value = {
        productId: 0,
        skuId: 0,
        seckillPrice: 0,
        stock: 0,
        limitPerUser: 0,
        applyReason: '',
        remark: '',
      }
      selectedProduct.value = null
      skus.value = []
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
      console.log('res:', res)
    }
  } catch (err: any) {
    console.log('提交失败：', err)
    ElMessage.error(err.response?.data?.msg || err.message)
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(async () => {
  const hasProductId = parseUrlParams()
  if (hasProductId) {
    await loadData()
  }
})
</script>

<style scoped>
textarea::-webkit-scrollbar {
  width: 4px;
}
textarea::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}
</style>
