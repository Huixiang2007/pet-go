<template>
  <div class="bg-white rounded-md p-2 px-5">
    <!-- 筛选栏 -->
    <div class="flex flex-row justify-between items-center border-b-[1px] px-8 py-2">
      <div class="text-md font-bold">评价管理</div>
      <div class="flex flex-row gap-2">
        <el-select v-model="commentFilter" placeholder="全部评价" clearable size="small">
          <el-option label="全部评价" value=""></el-option>
          <el-option label="好评" value="好评"></el-option>
          <el-option label="中评" value="中评"></el-option>
          <el-option label="差评" value="差评"></el-option>
          <el-option label="未回复" value="未回复"></el-option>
        </el-select>
        <el-input placeholder="商品名称/订单号" v-model="commentSearchInput" clearable size="small">
          <template #prefix>
            <i class="fas fa-search text-md text-gray-300"></i>
          </template>
        </el-input>
        <el-button size="small" @click="searchComment">搜索</el-button>
      </div>
    </div>

    <!-- 评价表格 -->
    <el-table
      :data="commentData"
      style="width: 100%"
      stripe
      :cell-style="{ padding: '12px 0' }"
      :header-cell-style="{
        background: '#fafafa',
        color: '#606266',
        fontWeight: '500',
      }"
    >
      <el-table-column prop="commentId" label="评价ID" width="100" />
      <el-table-column prop="orderId" label="订单号" width="140" />
      <el-table-column prop="productName" label="商品名称" width="200">
        <template #default="scope">
          <div class="text-ellipsis overflow-hidden" :title="scope.row.productName">
            {{ scope.row.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="买家昵称" width="100" />
      <el-table-column prop="star" label="评分" width="80">
        <template #default="scope">
          <el-rate v-model="scope.row.star" disabled size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评价内容" min-width="200">
        <template #default="scope">
          <div class="address-text" :title="scope.row.content">
            {{ scope.row.content }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="commentTime" label="评价时间" width="160" />
      <el-table-column prop="replyStatus" label="回复状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.replyStatus === '已回复' ? 'success' : 'warning'" size="small">
            {{ scope.row.replyStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <div class="flex gap-2">
            <el-button
              size="mini"
              type="text"
              class="text-blue-600"
              @click="openCommentDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              v-if="scope.row.replyStatus === '未回复'"
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
      <div class="text-sm text-gray-500">共 {{ commentData.length }} 条记录</div>
      <el-pagination layout="prev, pager, next" :total="commentData.length" :page-size="10" />
    </div>
  </div>

  <!-- 评价详情弹窗 -->
  <el-dialog
    v-model="commentDetailVisible"
    title="评价详情"
    width="600px"
    :close-on-click-modal="false"
  >
    <div v-if="currentComment" class="space-y-4">
      <div class="flex justify-between items-center pb-2 border-b">
        <div class="font-bold">评价信息</div>
        <el-tag :type="currentComment.replyStatus === '已回复' ? 'success' : 'warning'">
          {{ currentComment.replyStatus }}
        </el-tag>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">评价ID：{{ currentComment.commentId }}</p>
          <p class="text-sm text-gray-500">订单编号：{{ currentComment.orderId }}</p>
          <p class="text-sm text-gray-500">买家昵称：{{ currentComment.userName }}</p>
          <p class="text-sm text-gray-500">评价时间：{{ currentComment.commentTime }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">商品名称：{{ currentComment.productName }}</p>
          <p class="text-sm text-gray-500">
            评分：<el-rate v-model="currentComment.star" disabled size="small" />
          </p>
        </div>
      </div>

      <div class="pt-2 border-t">
        <h4 class="font-medium mb-2">评价内容</h4>
        <p class="text-sm bg-gray-50 p-3 rounded">{{ currentComment.content }}</p>
      </div>

      <div v-if="currentComment.replyContent" class="pt-2 border-t">
        <h4 class="font-medium mb-2">商家回复</h4>
        <p class="text-sm bg-blue-50 p-3 rounded">{{ currentComment.replyContent }}</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="commentDetailVisible = false">关闭</el-button>
      <el-button
        v-if="currentComment && currentComment.replyStatus === '未回复'"
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
      <p class="text-sm">评价ID：{{ currentComment.commentId }}</p>
      <p class="text-sm">商品名称：{{ currentComment.productName }}</p>
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
      <el-button type="primfary" @click="confirmReplyComment">确认回复</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 基础数据
const commentSearchInput = ref('')
const commentFilter = ref('')
const commentDetailVisible = ref(false)
const replyCommentVisible = ref(false)
const currentComment = ref<any>(null)

// 回复评价表单
const replyForm = ref({
  content: '',
})

// 评价数据
interface CommentRow {
  commentId: string
  orderId: string
  productName: string
  userName: string
  star: number
  content: string
  commentTime: string
  replyStatus: string
  replyContent?: string
}

const commentData = ref<CommentRow[]>([
  {
    commentId: 'CM2016050401',
    orderId: '20160504',
    productName: '进口宠物冻干零食-三文鱼味',
    userName: '小虎同学',
    star: 5,
    content: '味道很好，狗狗很爱吃，性价比超高！',
    commentTime: '2016-05-05 10:20:30',
    replyStatus: '已回复',
    replyContent: '感谢您的好评！我们会继续努力提供更好的产品和服务～',
  },
  {
    commentId: 'CM2016050201',
    orderId: '20160502',
    productName: '宠物零食大礼包-鸡肉味',
    userName: '小虎同学',
    star: 3,
    content: '还可以，就是分量有点少，希望商家改进。',
    commentTime: '2016-05-04 14:30:20',
    replyStatus: '未回复',
  },
  {
    commentId: 'CM2016050101',
    orderId: '20160501',
    productName: '宠物主食罐-牛肉味',
    userName: '小虎同学',
    star: 1,
    content: '太难吃了，狗狗一点都不吃，差评！',
    commentTime: '2016-05-03 09:15:45',
    replyStatus: '未回复',
  },
])

// 核心方法
const searchComment = () => {
  console.log('搜索评价:', commentSearchInput.value, commentFilter.value)
}

const openCommentDetail = (row: CommentRow) => {
  currentComment.value = row
  commentDetailVisible.value = true
}

const openReplyCommentModal = (row: CommentRow) => {
  currentComment.value = row
  replyForm.value = { content: '' }
  replyCommentVisible.value = true
}

const confirmReplyComment = () => {
  if (!replyForm.value.content.trim()) {
    ElMessage.warning('回复内容不能为空！')
    return
  }

  ElMessageBox.confirm('确认回复该评价吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    currentComment.value.replyStatus = '已回复'
    currentComment.value.replyContent = replyForm.value.content
    replyCommentVisible.value = false
    commentDetailVisible.value = false
    ElMessage.success('评价回复成功！')
  })
}
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
