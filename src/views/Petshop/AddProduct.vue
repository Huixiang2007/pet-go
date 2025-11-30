<template>
  <main class="bg-yellow-50 min-h-screen">
    <div class="p-8 px-16 flex-grow">
    <div class="mb-8">
      <h2 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-yellow-900 flex items-center">
        <i class="fa fa-cube mr-3 text-yellow-600"></i>
        添加新商品
      </h2>
      <p class="text-yellow-700/80 mt-1 ml-8">填写商品信息并保存，带 <span class="text-red-500">*</span> 为必填项</p>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 md:p-8 transition-all duration-300 hover:shadow-lg">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div class="form-section">
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
            <i class="fa fa-info-circle mr-2 text-yellow-500"></i>基本信息
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label for="productName" class="block text-sm font-medium text-yellow-800 mb-1">
                商品名称 <span class="text-red-500">*</span>
              </label>
              <input type="text" id="productName" v-model="form.productName" required
                class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg  focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                placeholder="请输入商品名称">
            </div>

              <label for="productCode" class="block text-sm font-medium text-yellow-800 mb-1">
                商品编码 <span class="text-red-500">*</span>
              </label>
              <input type="text" id="productCode" v-model="form.productCode" required
                class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg  focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                placeholder="请输入商品编码">
            </div>



            <div class="form-group pt-4 md:mt-0">
              <label for="category" class="block text-sm font-medium text-yellow-800 mb-1">
                商品分类 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select id="category" v-model="form.category" required
                  class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg appearance-none focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none bg-white"
                >
                  <option value="">请选择</option>
                  <option value="electronics">电子产品</option>
                  <option value="clothing">服装鞋帽</option>
                  <option value="food">食品饮料</option>
                  <option value="home">家居用品</option>
                  <option value="other">其他分类</option>
                </select>
              </div>
            </div>

            <div class="form-group pt-6 md:mt-0">
              <label for="brand" class="block text-sm font-medium text-yellow-800 mb-1">品牌</label>
              <input type="text" id="brand" v-model="form.brand"
                class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg  focus:ring-[1px] focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                placeholder="请输入品牌名称">
            </div>
          </div>


          <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
            <i class="fa fa-tags mr-2 text-yellow-500"></i>价格与库存
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="form-group">
              <label for="price" class="block text-sm font-medium text-yellow-800 mb-1">
                销售价 (¥) <span class="text-red-500">*</span>
              </label>
              <input type="number" id="price" v-model="form.price" min="0" step="0.01" required
                class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                placeholder="0.00">
            </div>


            <div class="form-group">
              <label for="originalPrice" class="block text-sm font-medium text-yellow-800 mb-1">原价 (¥)</label>
              <input type="number" id="originalPrice" v-model="form.originalPrice" min="0" step="0.01"
                class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                placeholder="0.00">
            </div>

            <div class="form-group">
              <label for="stock" class="block text-sm font-medium text-yellow-800 mb-1">
                库存数量 <span class="text-red-500">*</span>
              </label>
              <input type="number" id="stock" v-model="form.stock" min="0" required
                class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                placeholder="0">
            </div>  </div>

        <div class="form-section">
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
            <i class="fa fa-picture-o mr-2 text-yellow-500"></i>商品图片
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-yellow-800 mb-2">
                主图 <span class="text-red-500">*</span>
              </label>
              <div class="relative border-2 border-dashed border-yellow-200 rounded-lg p-4 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group">
                <input type="file" accept="image/*" @change="handleMainImageUpload"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                <div v-if="!form.mainImage" class="space-y-2">
                  <i class="fa fa-cloud-upload text-2xl text-yellow-400 group-hover:text-yellow-600 transition-colors"></i>


                  <p class="text-sm text-yellow-700">点击上传或拖放图片</p>
                  <p class="text-xs text-yellow-500/70">支持 JPG、PNG 格式</p>
                </div>
                <div v-else class="relative w-full h-full overflow-hidden rounded">
                  <img :src="form.mainImage" alt="主图预览" class="w-full h-full object-cover rounded transition-transform duration-500 hover:scale-105">
                  <button type="button" @click="removeMainImage"
                    class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all">
                    <i class="fa fa-times text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="col-span-3">
              <label class="block text-sm font-medium text-yellow-800 mb-2">多图上传</label>
              <div class="grid grid-cols-3 gap-4">
                <div v-for="(image, index) in form.images" :key="index"
                  class="relative border-2 border-dashed border-yellow-200 rounded-lg p-4 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 overflow-hidden">
                  <img :src="image" alt="图片预览" class="w-full h-full object-cover rounded transition-transform duration-500 hover:scale-105">
                  <button type="button" @click="removeImage(index)"
                    class="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all">
                    <i class="fa fa-times text-xs"></i>
                  </button>
                </div>

                <div v-if="form.images.length < 6"
                  class="relative border-2 border-dashed border-yellow-200 rounded-lg p-4 text-center hover:border-yellow-500 transition-all cursor-pointer bg-yellow-50 group">
                  <input type="file" accept="image/*" @change="handleImageUpload"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                  <div class="space-y-2">
                    <i class="fa fa-cloud-upload text-2xl text-yellow-400 group-hover:text-yellow-600 transition-colors"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
            <i class="fa fa-file-text-o mr-2 text-yellow-500"></i>商品描述
          </h3>
          <div class="form-group">
            <label for="description" class="block text-sm font-medium text-yellow-800 mb-1">详细描述</label>
            <textarea id="description" v-model="form.description" rows="6"
              class="w-full px-4 py-2.5 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none resize-none"
              placeholder="请输入商品详细描述信息..."></textarea>
          </div>
        </div>


        <div class="form-section">
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-yellow-100 text-yellow-800">
            <i class="fa fa-ellipsis-h mr-2 text-yellow-500"></i>其他信息
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div class="form-group">

              <div class="flex flex-wrap gap-3">
                <label class="inline-flex items-center cursor-pointer group bg-yellow-50 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors">
                  <input type="checkbox" value="new" v-model="form.tags"
                    class="form-checkbox h-4 w-4 text-yellow-500 focus:ring-yellow-500">
                  <span class="ml-2 text-sm text-yellow-800 group-hover:text-yellow-600 transition-colors">新品</span>
                </label>
                <label class="inline-flex items-center cursor-pointer group bg-yellow-50 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors">
                  <input type="checkbox" value="hot" v-model="form.tags"
                    class="form-checkbox h-4 w-4 text-yellow-500 focus:ring-yellow-500">
                  <span class="ml-2 text-sm text-yellow-800 group-hover:text-yellow-600 transition-colors">热销</span>
                </label>
                <label class="inline-flex items-center cursor-pointer group bg-yellow-50 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors">
                  <input type="checkbox" value="discount" v-model="form.tags"
                    class="form-checkbox h-4 w-4 text-yellow-500 focus:ring-yellow-500">
                  <span class="ml-2 text-sm text-yellow-800 group-hover:text-yellow-600 transition-colors">促销</span>
                </label>
                <label class="inline-flex items-center cursor-pointer group bg-yellow-50 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors">
                  <input type="checkbox" value="limited" v-model="form.tags"
                    class="form-checkbox h-4 w-4 text-yellow-500 focus:ring-yellow-500">
                  <span class="ml-2 text-sm text-yellow-800 group-hover:text-yellow-600 transition-colors">限量</span>
                </label>
              </div>
        </div>

        <div class="flex justify-end space-x-4 pt-6 border-t border-yellow-100">
          <el-button
            size="default"
            type="primary"
            @click="handleReset"
            class="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none"
          >
            <template #icon>
              <i class="fa fa-refresh mr-1"></i>
            </template>
            重置
          </el-button>

          <el-button
            size="default"
            type="primary"
            @click="handleSubmit"
            class="bg-amber-600 text-white hover:bg-yellow-700 border-none"

          >
            <template #icon>
              <i class="fa fa-check mr-1"></i>
            </template>
            确认提交
          </el-button>
        </div>
      </div>

    </div>
      </form>
  </div>

    </div>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const form = reactive({
  productName: '',
  productCode: '',
  category: '',
  brand: '',
  price: '',
  originalPrice: '',
  stock: '',
  mainImage: null as string | null,
  images: [] as string[],
  description: '',
  status: 'active',
  tags: [] as string[]
});
const showMessage = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const showToastMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg;
  messageType.value = type;
  showMessage.value = true;
  setTimeout(() => {
    showMessage.value = false;
  }, 3000);
};

const handleSubmit = () => {
  if (!validateForm()) return;
  console.log('提交商品数据:', form);
  showToastMessage('商品添加成功！');
};

const handleReset = () => {
  if(confirm('确定要重置表单吗？所有已填写内容将被清空。')) {
    Object.assign(form, {
      productName: '',
      productCode: '',
      category: '',
      brand: '',
      price: '',
      originalPrice: '',
      stock: '',
      mainImage: null,
      images: [],
      description: '',
      status: 'active',
      tags: []
    });
  }
};

const handleMainImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    readFileAsDataURL(file, (result) => {
      form.mainImage = result;
    });
  }
  target.value = '';
};

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && form.images.length < 3) {
    readFileAsDataURL(file, (result) => {
      form.images.push(result);
    });
  }
  target.value = '';
};

const removeMainImage = () => {
  form.mainImage = null;
};

const removeImage = (index: number) => {
  form.images.splice(index, 1);
};

const readFileAsDataURL = (file: File, callback: (result: string) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof e.target?.result === 'string') {
      callback(e.target.result);
    }
  };
  reader.readAsDataURL(file);
};

const validateForm = (): boolean => {
  if (!form.productName) {
    showToastMessage('请输入商品名称', 'error');
    return false;
  }

  if (!form.productCode) {
    showToastMessage('请输入商品编码', 'error');
    return false;
  }

  if (!form.category) {
    showToastMessage('请选择商品分类', 'error');
    return false;
  }

  if (!form.price) {
    showToastMessage('请输入销售价', 'error');
    return false;
  }

  if (!form.stock) {
    showToastMessage('请输入库存数量', 'error');
    return false;
  }

  if (!form.mainImage) {
    showToastMessage('请上传商品主图', 'error');
    return false;
  }

  return true;
};
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
:deep(.el-select .el-input .el-select__caret) {
  color: #f59e0b !important;
}

:deep(.el-button--primary) {
  transition: all 0.3s ease !important;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #fffbeb;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #fde68a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #fbbf24;
}
</style>
