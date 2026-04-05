<template>
  <div class="edit-history">
    <el-button v-if="historyList.length > 0" type="warning" size="small" @click="open = true">
      查看修改历史
    </el-button>

    <el-dialog v-model="open" title="修改历史记录" width="700px" append-to-body>
      <div class="timeline" v-if="historyList.length">
        <div v-for="(item, idx) in historyList" :key="idx" class="timeline-item">
          <div class="time">
            {{ formatTime(item.saveAt) }}
            <el-button type="primary" size="mini" @click="rollbackTo(item)">
              回滚到此版本
            </el-button>
          </div>
          <div class="content-box">{{ item.content }}</div>
        </div>
      </div>
      <div v-else class="text-center text-sm text-gray-400 py-4">暂无修改记录</div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  // 唯一标识（比如 userId、addressId、commentId、orderId 等）
  id: {
    type: [String, Number],
    required: true,
  },
  // 当前内容
  value: {
    type: String,
    default: '',
  },
})

// 回滚成功后通知父组件刷新
const emit = defineEmits(['rollbackSuccess'])

const open = ref(false)
const STORAGE_KEY = `edit_history_${props.id}`

// 历史列表
const historyList = ref([])

// 加载历史
function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    historyList.value = data ? JSON.parse(data) : []
  } catch (e) {
    console.error('加载历史记录失败', e)
    historyList.value = []
  }
}
loadHistory()

// 保存快照（外部调用）
function saveSnapshot(content) {
  if (!content || content === props.value) return

  const newItem = {
    content: content,
    saveAt: Date.now(),
  }

  const list = [newItem, ...historyList.value]
  historyList.value = list.slice(0, 10) // 最多存10条
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historyList.value))
}

// 回滚
async function rollbackTo(item) {
  try {
    await ElMessageBox.confirm('确定要恢复到此版本吗？', '提示')

    // 关键：把旧内容抛给父组件，父组件自己调用接口
    emit('rollbackSuccess', item.content)
    ElMessage.success('已恢复')
    open.value = false
  } catch (e) {
    console.error('回滚操作失败', e)
    ElMessage.error('操作取消或失败')
  }
}

// 时间格式化
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString()
}

// 暴露方法
defineExpose({
  saveSnapshot,
  loadHistory,
})
</script>

<style scoped>
.timeline {
  max-height: 400px;
  overflow-y: auto;
}
.timeline-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 14px;
  border-left: 2px solid #eee;
}
.time {
  font-size: 12px;
  color: #999;
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.content-box {
  background: #f7f8fa;
  padding: 8px 12px;
  border-radius: 4px;
  line-height: 1.5;
  font-size: 14px;
}
</style>
