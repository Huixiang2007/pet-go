<template>
  <div class="bg-white rounded-md p-2 px-5">
    <!-- 筛选栏 -->
    <div class="flex flex-row justify-between items-center border-b-[1px] px-8 py-2">
      <div class="text-md font-bold">评价管理</div>
    </div>

    <!-- 评价表格（精简核心信息） -->
    <el-table
      :data="commentData"
      style="width: 100%"
      stripe
      :loading="loading"
      :cell-style="{ padding: '12px 0' }"
      :header-cell-style="{
        background: '#fafafa',
        color: '#606266',
        fontWeight: '500',
      }"
    >
      <el-table-column prop="id" label="评价ID" width="140" />
      <el-table-column prop="orderItemId" label="订单号" width="120" />
      <el-table-column prop="productName" label="商品名称" min-width="180">
        <template #default="scope">
          <div class="text-ellipsis overflow-hidden" :title="scope.row.productName || '商品名称'">
            {{ scope.row.productName || '商品名称' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userNickname" label="买家昵称" width="110" />
      <el-table-column prop="productScore" label="商品评分" width="90">
        <template #default="scope">
          <el-rate v-model="scope.row.productScore" disabled size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评价内容" min-width="200">
        <template #default="scope">
          <div class="address-text" :title="scope.row.content">
            {{ scope.row.content }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="评价时间" width="170" />
      <el-table-column prop="replyStatus" label="回复状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.replyCount === 0 ? 'warning' : 'success'" size="small">
            {{ scope.row.replyCount === 0 ? '未回复' : '已回复' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="flex gap-2">
            <el-button
              size="mini"
              type="text"
              class="text-blue-600"
              @click="openCommentDetail(scope.row)"
            >
              查看详情
            </el-button>
            <el-button
              v-if="scope.row.replyCount === 0"
              size="mini"
              type="text"
              class="text-green-600"
              @click="openReplyCommentModal(scope.row)"
            >
              回复
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="px-6 py-3 border-t flex justify-between items-center">
      <div class="text-sm text-gray-500">
        共 {{ total }} 条记录，当前第 {{ pageNum }} / {{ totalPage }} 页
      </div>
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
        @size-change="getCommentList"
        @current-change="getCommentList"
      />
    </div>
  </div>

  <!-- 评价详情弹窗（完整展示所有后端返回字段） -->
  <el-dialog
    v-model="commentDetailVisible"
    title="评价详情"
    width="700px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div v-if="currentComment" class="space-y-4">
      <!-- 基础信息 -->
      <div class="flex justify-between items-center pb-2 border-b">
        <div class="font-bold">基础信息</div>
        <el-tag :type="currentComment.replyCount === 0 ? 'warning' : 'success'">
          {{ currentComment.replyCount === 0 ? '未回复' : '已回复' }}
        </el-tag>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <p class="text-sm text-gray-500">评价ID：{{ currentComment.id }}</p>
          <p class="text-sm text-gray-500">订单编号：{{ currentComment.orderItemId || '-' }}</p>
          <p class="text-sm text-gray-500">商品ID：{{ currentComment.productId || '-' }}</p>
          <p class="text-sm text-gray-500">买家ID：{{ currentComment.userId }}</p>
          <p class="text-sm text-gray-500">买家昵称：{{ currentComment.userNickname }}</p>
          <p class="text-sm text-gray-500">匿名状态：{{ currentComment.isAnonymous }}</p>
          <p class="text-sm text-gray-500">点赞数：{{ currentComment.likeCount }}</p>
          <p class="text-sm text-gray-500">回复数：{{ currentComment.replyCount }}</p>
        </div>
        <div class="space-y-2">
          <p class="text-sm text-gray-500">
            商品名称：{{ currentComment.productName || '商品名称' }}
          </p>
          <p class="text-sm text-gray-500">
            商品评分：<el-rate v-model="currentComment.productScore" disabled size="small" />
          </p>
          <p class="text-sm text-gray-500">
            物流评分：<el-rate v-model="currentComment.logisticsScore" disabled size="small" />
          </p>
          <p class="text-sm text-gray-500">
            服务评分：<el-rate v-model="currentComment.serviceScore" disabled size="small" />
          </p>
          <p class="text-sm text-gray-500">评价时间：{{ currentComment.createTime }}</p>
          <p class="text-sm text-gray-500">评价状态：{{ currentComment.status }}</p>
        </div>
      </div>

      <!-- 评价内容 -->
      <div class="pt-2 border-t">
        <h4 class="font-medium mb-2">评价内容</h4>
        <p class="text-sm bg-gray-50 p-3 rounded">{{ currentComment.content }}</p>
      </div>

      <!-- 评价图片 -->
      <div v-if="currentComment.imageUrls && currentComment.imageUrls.trim()" class="pt-2 border-t">
        <h4 class="font-medium mb-2">评价图片</h4>
        <div class="flex gap-2 flex-wrap">
          <el-image
            v-for="(img, index) in currentComment.imageUrls.split(',').filter((url) => url.trim())"
            :key="index"
            :src="img"
            fit="cover"
            style="width: 80px; height: 80px; border-radius: 4px"
            :preview-src-list="currentComment.imageUrls.split(',').filter((url) => url.trim())"
          />
        </div>
      </div>

      <!-- 评价视频 -->
      <div v-if="currentComment.videoUrl && currentComment.videoUrl.trim()" class="pt-2 border-t">
        <h4 class="font-medium mb-2">评价视频</h4>
        <video
          :src="currentComment.videoUrl"
          controls
          style="width: 100%; max-height: 300px; border-radius: 4px"
        ></video>
      </div>

      <!-- 追加评价 -->
      <div
        v-if="currentComment.appendContent && currentComment.appendContent.trim()"
        class="pt-2 border-t"
      >
        <h4 class="font-medium mb-2">追加评价（{{ currentComment.appendTime }}）</h4>
        <p class="text-sm bg-gray-50 p-3 rounded">{{ currentComment.appendContent }}</p>
        <!-- 追加图片 -->
        <div
          v-if="currentComment.appendImageUrls && currentComment.appendImageUrls.trim()"
          class="mt-2"
        >
          <div class="flex gap-2 flex-wrap">
            <el-image
              v-for="(img, index) in currentComment.appendImageUrls
                .split(',')
                .filter((url) => url.trim())"
              :key="index"
              :src="img"
              fit="cover"
              style="width: 80px; height: 80px; border-radius: 4px"
              :preview-src-list="
                currentComment.appendImageUrls.split(',').filter((url) => url.trim())
              "
            />
          </div>
        </div>
        <!-- 追加视频 -->
        <div
          v-if="currentComment.appendVideoUrl && currentComment.appendVideoUrl.trim()"
          class="mt-2"
        >
          <video
            :src="currentComment.appendVideoUrl"
            controls
            style="width: 100%; max-height: 300px; border-radius: 4px"
          ></video>
        </div>
      </div>

      <!-- 商家回复 -->
      <div v-if="currentComment.replyContent" class="pt-2 border-t">
        <h4 class="font-medium mb-2">商家回复</h4>
        <p class="text-sm bg-blue-50 p-3 rounded">
          {{ currentComment.replyContent }}
        </p>
      </div>
    </div>

    <template #footer>
      <el-button @click="commentDetailVisible = false">关闭</el-button>
      <el-button
        v-if="currentComment && currentComment.replyCount === 0"
        type="primary"
        @click="openReplyCommentModal(currentComment)"
      >
        回复评价
      </el-button>
    </template>
  </el-dialog>

  <!-- 回复评价弹窗 -->
  <el-dialog
    v-model="replyCommentVisible"
    title="回复评价"
    width="500px"
    :close-on-click-modal="false"
  >
    <div v-if="currentComment" class="space-y-4">
      <p class="text-sm">评价ID：{{ currentComment.id }}</p>
      <p class="text-sm">商品名称：{{ currentComment.productName || '商品名称' }}</p>
      <p class="text-sm text-gray-500 mb-2">评价内容：{{ currentComment.content }}</p>

      <el-form :model="replyForm" label-width="80px">
        <el-form-item label="回复内容" required>
          <el-input
            v-model="replyForm.content"
            type="textarea"
            rows="4"
            placeholder="请输入回复内容"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="replyCommentVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmReplyComment"> 确认回复 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getShopCommentList, replyComment } from '@/api/pet-shop/comment'

// 分页参数
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPage = computed(() => Math.ceil(total.value / pageSize.value))

// 加载状态
const loading = ref(false)

// 查询条件
const queryParams = reactive({
  keyword: '',
  score: '',
  sortType: 0,
})

// 弹窗状态
const commentDetailVisible = ref(false)
const replyCommentVisible = ref(false)
const currentComment = ref<any>(null)

// 回复表单
const replyForm = ref({
  content: '',
})

// 评价列表类型定义
interface CommentRow {
  // 基础信息
  id: string
  orderItemId: string
  productId: string
  productName: string
  userId: number
  userNickname: string
  userAvatar: string
  isAnonymous: string
  status: string
  // 评分相关
  star: number
  productScore: number
  logisticsScore: number
  serviceScore: number
  // 评价内容
  content: string
  imageUrls: string
  videoUrl: string
  // 追加评价
  appendContent: string
  appendImageUrls: string
  appendVideoUrl: string
  appendTime: string
  // 互动相关
  likeCount: number
  replyCount: number
  replyContent?: string
  // 时间
  createTime: string
}
const commentData = ref<CommentRow[]>([])

// 获取评论列表
const getCommentList = async () => {
  loading.value = true
  try {
    const res = await getShopCommentList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      keyword: queryParams.keyword,
      score: queryParams.score === '未回复' ? '' : queryParams.score,
      sortType: queryParams.sortType,
      searchCount: true,
    })
    console.log(res)
    const list = res.data?.list || res.list || []
    total.value = res.data?.total || res.total || 0

    // 处理未回复筛选
    if (queryParams.score === '未回复') {
      commentData.value = list.filter((item: CommentRow) => item.replyCount === 0)
      total.value = commentData.value.length
    } else {
      commentData.value = list
    }
  } catch (err) {
    ElMessage.error('获取评论列表失败，请重试')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 打开评价详情
const openCommentDetail = (row: CommentRow) => {
  currentComment.value = row
  commentDetailVisible.value = true
}

// 打开回复弹窗
const openReplyCommentModal = (row: CommentRow) => {
  currentComment.value = row
  replyForm.value.content = ''
  replyCommentVisible.value = true
  commentDetailVisible.value = false
}

// 提交回复
const confirmReplyComment = async () => {
  if (!replyForm.value.content.trim()) {
    ElMessage.warning('回复内容不能为空！')
    return
  }

  try {
    await ElMessageBox.confirm('确认回复该评价吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    })

    const res = await replyComment({
      commentId: currentComment.value.id,
      content: replyForm.value.content,
    })
    console.log(res)
    replyCommentVisible.value = false
    getCommentList()
    ElMessage.success('评价回复成功！')
  } catch {
    ElMessage.info('已取消回复')
  }
}

// 初始化加载
onMounted(() => {
  getCommentList()
})
</script>

<style scoped>
:deep(.el-input__inner) {
  border-radius: 4px;
}
:deep(.el-button) {
  border-radius: 4px;
}
:deep(.address-text) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.5;
  max-height: 3em;
}
.grid {
  display: grid;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.gap-4 {
  gap: 1rem;
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}
</style>
