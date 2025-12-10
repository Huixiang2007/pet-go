<template>
  <div class="form-section">
    <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
      <i class="fa fa-th mr-2 text-yellow-500"></i>SKU配置
    </h3>

    <!-- 添加SKU按钮 -->
    <div class="mb-4">
      <button type="button"
        class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all">
        <i class="fa fa-plus mr-1"></i>添加SKU
      </button>
    </div>

    <!-- SKU列表 -->
    <div class="border border-yellow-200 rounded-lg p-4 mb-4">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-medium text-yellow-800">SKU </h4>
        <button type="button"  class="text-red-500 hover:text-red-600 transition-colors">
          <i class="fa fa-trash"></i> 删除
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- SKU编码 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            SKU编码 <span class="text-red-500">*</span>
          </label>
          <input type="text"  required
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="请输入SKU编码" />
        </div>

        <!-- 规格JSON -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            规格JSON <span class="text-red-500">*</span>
          </label>
          <input type="text"  required
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder='如{"颜色":"红色","尺码":"M"}' />
        </div>

        <!-- SKU价格 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            SKU价格 (¥) <span class="text-red-500">*</span>
          </label>
          <input type="number"  min="0" step="0.01" required
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.00" />
        </div>

        <!-- SKU市场价 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            SKU市场价 (¥)
          </label>
          <input type="number"  min="0" step="0.01"
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.00" />
        </div>

        <!-- SKU成本价 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            SKU成本价 (¥)
          </label>
          <input type="number"  min="0" step="0.01"
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.00" />
        </div>

        <!-- SKU库存 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            SKU库存 <span class="text-red-500">*</span>
          </label>
          <input type="number" min="0" required
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0" />
        </div>

        <!-- SKU图片 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            SKU图片
          </label>
          <div
            class="relative border-2 border-dashed border-yellow-200 rounded-lg p-3 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group">
            <input type="file" accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div class="space-y-1">
              <i class="fa fa-cloud-upload text-xl text-yellow-400 group-hover:text-yellow-600 transition-colors"></i>
              <p class="text-xs text-yellow-700">上传SKU图片</p>
            </div>
            <!-- <div v-else class="relative w-full h-full overflow-hidden rounded">
              <img :src="sku.imageUrl" alt="SKU图片预览" class="w-full h-full object-cover rounded" />
              <button type="button"
                class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-all">
                <i class="fa fa-times text-xs"></i>
              </button>
            </div> -->
          </div>
        </div>

        <!-- 重量 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            重量 (kg)
          </label>
          <input type="number"  min="0" step="0.01"
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.00" />
        </div>

        <!-- 体积 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-yellow-800 mb-1">
            体积 (m³)
          </label>
          <input type="number"  min="0" step="0.001"
            class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
            placeholder="0.000" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import {type  SkuItem } from '../AddProduct.vue'

// // 接收父组件的SKU列表
// const props = defineProps<{
//   skuList: SkuItem[]
// }>()

// const emit = defineEmits<{
//   (e: 'update:skuList', value: SkuItem[]): void
// }>()

// // 文件转Base64
// const readFileAsDataURL = (file: File, callback: (result: string) => void) => {
//   const reader = new FileReader()
//   reader.onload = (e) => {
//     if (typeof e.target?.result === 'string') callback(e.target.result)
//   }
//   reader.readAsDataURL(file)
// }

// // 添加SKU
// const addSku = () => {
//   const newSku: SkuItem = {
//     skuSn: '', specJson: '', price: 0, marketPrice: 0, costPrice: 0,
//     stock: 0, imageUrl: '', weight: 0, volume: 0
//   }
//   const newSkuList = [...props.skuList, newSku]
//   emit('update:skuList', newSkuList)
// }

// // 移除SKU
// const removeSku = (index: number) => {
//   if (props.skuList.length <= 1) {
//     alert('至少保留一个SKU')
//     return
//   }
//   const newSkuList = [...props.skuList]
//   newSkuList.splice(index, 1)
//   emit('update:skuList', newSkuList)
// }

// // SKU图片上传
// const handleSkuImageUpload = (e: Event, skuIndex: number) => {
//   const target = e.target as HTMLInputElement
//   const file = target.files?.[0]
//   if (file) {
//     readFileAsDataURL(file, (result) => {
//       const newSkuList = [...props.skuList]
//       newSkuList[skuIndex].imageUrl = result
//       emit('update:skuList', newSkuList)
//     })
//   }
//   target.value = ''
// }

// // 移除SKU图片
// const removeSkuImage = (skuIndex: number) => {
//   const newSkuList = [...props.skuList]
//   newSkuList[skuIndex].imageUrl = ''
//   emit('update:skuList', newSkuList)
// }
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
