<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- 1. 顶部：评论状态筛选器 -->
    <div class="mb-4 flex items-center">
      <span class="text-gray-600 mr-3">查看状态：</span>
      <el-select
        v-model="currentStatus"
        placeholder="选择评价状态"
        style="width: 200px"
        @change="loadCommentList"
        class="mr-4"
      >
        <el-option label="已评价" value="3"></el-option>
        <el-option label="可追评" value="2"></el-option>
        <el-option label="待评价" value="1"></el-option>
      </el-select>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="py-20 text-center text-gray-400">
      <i class="fas fa-spinner fa-spin mr-2"></i>加载中...
    </div>

    <!-- 无数据 -->
    <div v-else-if="commentList.length === 0" class="py-20 text-center text-gray-400">
      <div v-if="currentStatus === '1'">暂无待评价订单</div>
      <div v-else-if="currentStatus === '2'">暂无可追评记录</div>
      <div v-else>暂无已评价记录</div>
    </div>

    <!-- 评论列表 -->
    <div v-else class="space-y-4">
      <div
        v-for="comment in commentList"
        :key="comment.orderItemId"
        class="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div class="p-5 grid grid-cols-12 gap-4 items-center">
          <!-- 商品图片 -->
          <div class="col-span-2">
            <img :src="comment.productImage" class="w-20 h-20 object-cover rounded-lg border" />
          </div>

          <!-- 商品信息 -->
          <div class="col-span-5">
            <div class="text-base font-medium text-gray-800 line-clamp-2">
              {{ comment.productName }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              店铺：{{ comment.shopName || '无店铺信息' }}
            </div>
            <div v-if="comment.specJson" class="text-xs text-gray-400 mt-1">
              规格：{{ parseSpec(comment.specJson) }}
            </div>
            <div class="text-xs text-gray-400 mt-1">订单号：{{ comment.orderSn }}</div>
          </div>

          <!-- 评价内容/状态提示 -->
          <div class="col-span-3">
            <div v-if="currentStatus !== '1'" class="text-sm text-gray-600">
              {{ comment.content || '未填写评价内容' }}
            </div>
            <div v-else class="text-sm text-orange-500 font-medium">待评价</div>

            <div class="text-xs text-gray-400 mt-1">
              {{ comment.createTime || '暂无时间' }}
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="col-span-2 flex flex-col gap-1">
            <button
              class="text-xs px-2 py-1 border rounded border-blue-400 text-blue-500 hover:bg-blue-50"
              @click="openDetail(comment)"
            >
              查看详情
            </button>

            <!-- 待评价：去评价 -->
            <button
              v-if="currentStatus === '1'"
              class="text-xs px-2 py-1 border rounded border-green-500 text-green-600 hover:bg-green-50"
              @click="goAddComment(comment)"
            >
              去评价
            </button>

            <!-- 可追评：去追评 -->
            <button
              v-if="currentStatus === '2'"
              class="text-xs px-2 py-1 border rounded border-green-400 text-green-500 hover:bg-green-50"
              @click="openAppend(comment)"
            >
              去追评
            </button>

            <!-- 修改评价 -->
            <button
              v-if="currentStatus === '2' || currentStatus === '3'"
              class="text-xs px-2 py-1 border rounded border-blue-400 text-blue-500 hover:bg-blue-50"
              @click="openEdit(comment)"
            >
              修改评价
            </button>
            <div
              v-if="currentStatus === '2' || currentStatus === '3'"
              class="text-[11px] text-gray-400"
            >
              7天内/无追评/无回复可修改1次
            </div>

            <!-- 删除评价 -->
            <button
              v-if="currentStatus === '2' || currentStatus === '3'"
              class="text-xs px-2 py-1 border rounded border-red-400 text-red-500 hover:bg-red-50"
              @click="handleDelete(comment.commentId)"
            >
              删除评价
            </button>
            <div
              v-if="currentStatus === '2' || currentStatus === '3'"
              class="text-[11px] text-gray-400"
            >
              2小时内/无追评/无回复可删除
            </div>
          </div>
        </div>

        <!-- 追评展示 -->
        <div
          v-if="currentStatus !== '1' && comment.appendContent"
          class="px-5 py-3 bg-yellow-50 border-t text-sm"
        >
          <span class="text-yellow-600 font-medium">追评：</span>
          {{ comment.appendContent }}
          <div class="text-xs text-gray-400 mt-1">
            {{ comment.appendTime }}
          </div>
        </div>
      </div>
    </div>

    <!-- 评价详情弹窗 -->
    <el-dialog v-model="detailVisible" title="评价详情" width="600px" top="10vh">
      <div class="space-y-4 text-sm">
        <div>
          <label class="text-gray-500 w-24 inline-block">订单ID：</label
          >{{ detailInfo.orderItemId }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">订单编号：</label>{{ detailInfo.orderSn }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">商品ID：</label>{{ detailInfo.productId }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">商品名称：</label
          >{{ detailInfo.productName }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">店铺名称：</label>{{ detailInfo.shopName }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">评价内容：</label
          >{{ detailInfo.content || '无' }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">创建时间：</label
          >{{ detailInfo.createTime || '无' }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">追评内容：</label
          >{{ detailInfo.appendContent || '无' }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">追评时间：</label
          >{{ detailInfo.appendTime || '无' }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">是否匿名：</label
          >{{ detailInfo.isAnonymous === 1 ? '是' : '否' }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">点赞数：</label
          >{{ detailInfo.likeCount || 0 }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">回复数：</label
          >{{ detailInfo.replyCount || 0 }}
        </div>
        <div>
          <label class="text-gray-500 w-24 inline-block">商品规格：</label>
          {{ parseSpec(detailInfo.specJson) || '无' }}
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button v-if="currentStatus === '2'" type="success" @click="openAppend(detailInfo)"
            >去追评</el-button
          >
          <el-button
            v-if="currentStatus === '2' || currentStatus === '3'"
            type="primary"
            @click="openEdit(detailInfo)"
          >
            修改评价
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增：发表评价弹窗（待评价使用） -->
    <el-dialog v-model="addVisible" title="发表评价" width="600px">
      <el-form :model="addForm" label-width="100px">
        <!-- 评分模块 -->
        <el-form-item label="商品评分">
          <el-rate v-model="addForm.productScore" :max="5" />
        </el-form-item>
        <el-form-item label="物流评分">
          <el-rate v-model="addForm.logisticsScore" :max="5" />
        </el-form-item>
        <el-form-item label="服务评分">
          <el-rate v-model="addForm.serviceScore" :max="5" />
        </el-form-item>

        <!-- 匿名选择 -->
        <el-form-item label="是否匿名">
          <el-radio-group v-model="addForm.isAnonymous">
            <el-radio label="1">公开</el-radio>
            <el-radio label="0">匿名</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 评价内容 -->
        <el-form-item label="评价内容">
          <el-input
            v-model="addForm.content"
            type="textarea"
            :rows="4"
            placeholder="请填写您的评价内容"
          />
        </el-form-item>

        <!-- 图片/视频（可选） -->
        <el-form-item label="评价图片">
          <FileUpload
            ref="imgUploadRef"
            :max-size-MB="5"
            :max-count="5"
            accept="image/*"
            accept-description="支持JPG、PNG、GIF"
            @upload-success="handleImageSuccess"
          />
        </el-form-item>

        <!-- 视频上传 -->
        <el-form-item label="评价视频">
          <FileUpload
            ref="videoUploadRef"
            :max-size-MB="20"
            :max-count="1"
            accept="video/*"
            accept-description="支持MP4、MOV"
            @upload-success="handleVideoSuccess"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddSubmit">提交评价</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改评价 -->
    <el-dialog v-model="editVisible" title="修改评价" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="评价内容">
          <el-input v-model="editForm.content" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdate">提交修改</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 追评 -->
    <el-dialog v-model="appendVisible" title="发表追评" width="500px">
      <el-form :model="appendForm" label-width="80px">
        <el-form-item label="追评内容">
          <el-input v-model="appendForm.appendContent" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="appendVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAppendSubmit">提交追评</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElRate,
  ElRadioGroup,
  ElRadio,
} from 'element-plus'
import {
  getMyViewCommentList,
  deleteMyComment,
  updateMyComment,
  appendMyComment,
  submitComment,
  type CommentParams,
  type AppendCommentParams,
} from '@/api/pet-shop/comment'
import FileUpload from '@/components/common/FileUpload.vue'
// 顶部加入
const props = defineProps({
  pageNum: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
})
const commentList = ref<any[]>([])
const loading = ref(false)
const currentStatus = ref<string>('3')
const emit = defineEmits(['page-change', 'update:total'])
const addVisible = ref(false)
const addForm = ref<CommentParams>({
  orderItemId: '',
  isAnonymous: 1 || 0,
  productScore: 5,
  logisticsScore: 5,
  serviceScore: 5,
  content: '',
  imageUrls: '',
  videoUrl: '',
})
watch(
  () => [props.pageNum, currentStatus.value],
  () => {
    loadCommentList()
  },
) // 打开评价弹窗
const goAddComment = (row: any) => {
  addForm.value = {
    orderItemId: row.orderItemId,
    isAnonymous: 0 || 1,
    productScore: 5,
    logisticsScore: 5,
    serviceScore: 5,
    content: '',
    imageUrls: '',
    videoUrl: '',
  }
  addVisible.value = true
}

// 提交评价
const handleAddSubmit = async () => {
  if (!addForm.value.content) return ElMessage.warning('请输入评价内容')
  if (!addForm.value.orderItemId) return ElMessage.warning('订单ID异常')

  try {
    await submitComment(addForm.value)
    ElMessage.success('评价提交成功')
    addVisible.value = false
    loadCommentList() // 刷新列表
  } catch (e) {
    console.error('提交评价', e)
    ElMessage.error('评价提交失败')
  }
}
//图+视频// 图片上传成功
const handleImageSuccess = (urls: string[]) => {
  addForm.value.imageUrls = urls.join(',')
}

// 视频上传
const handleVideoSuccess = (urls: string[]) => {
  if (urls.length > 0) {
    addForm.value.videoUrl = urls[0]
  }
}
// 加载列表
const loadCommentList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: props.pageNum, // 用父页面的
      pageSize: props.pageSize,
      commentStatus: currentStatus.value,
    }
    const res = await getMyViewCommentList(params)
    emit('update:total', res.total || 0)
    commentList.value = res.list || []
  } finally {
    loading.value = false
  }
}

// 解析规格
const parseSpec = (jsonStr: string) => {
  try {
    const spec = JSON.parse(jsonStr)
    return Object.values(spec).join(' / ')
  } catch {
    return jsonStr
  }
}

// 删除评价
const handleDelete = async (commentId: number) => {
  ElMessageBox.confirm('确定删除该评价？', '危险', { type: 'warning' })
    .then(async () => {
      await deleteMyComment(commentId)
      ElMessage.success('删除成功')
      loadCommentList()
    })
    .catch((error) => {
      console.error('删除', error)
    })
}

// 详情
const detailVisible = ref(false)
const detailInfo = ref<any>({})
const openDetail = (row: any) => {
  detailInfo.value = row
  detailVisible.value = true
}

// 修改
const editVisible = ref(false)
const editForm = ref<CommentParams>({})
const openEdit = (row: any) => {
  editForm.value = {
    commentId: row.commentId,
    orderItemId: row.orderItemId,
    content: row.content || '',
  }
  detailVisible.value = false
  editVisible.value = true
}
const handleUpdate = async () => {
  try {
    await updateMyComment(editForm.value)
    ElMessage.success('修改成功')
    editVisible.value = false
    loadCommentList()
  } catch (e) {
    console.error('修改', e)
    ElMessage.error('修改失败')
    editVisible.value = false
    loadCommentList()
  }
}

// 追评
const appendVisible = ref(false)
const appendForm = ref<AppendCommentParams>({
  commentId: '',
  appendContent: '',
  appendImageUrls: '',
  appendVideoUrl: '',
})
const openAppend = (row: any) => {
  appendForm.value.commentId = row.commentId + ''
  appendForm.value.appendContent = ''
  appendVisible.value = true
}
const handleAppendSubmit = async () => {
  if (!appendForm.value.appendContent) return ElMessage.warning('请输入追评内容')
  try {
    await appendMyComment(appendForm.value)
    ElMessage.success('追评成功')
    appendVisible.value = false
    loadCommentList()
  } catch (e) {
    console.error('追评', e)
    ElMessage.error('追评失败')
    appendVisible.value = false
    loadCommentList()
  }
}

onMounted(() => {
  loadCommentList()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
