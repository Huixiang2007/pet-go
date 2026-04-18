import { ref } from 'vue'
 import JSONbig from 'json-bigint'


export const systemNotices = ref<Array<{
  id: string; // 唯一标识
  type: string; // 通知类型
  title: string; // 通知标题
  content: string; // 通知正文内容
  time: string; // 通知接收时间
  date: string; // 通知日期
  publishTime: string; // 发布时间
  read: boolean; // 是否已读
  senderName: string; // 发送者姓名
  attach?: string; // 附件
}>>([])

// 加载状态
export const loadingSystemNotices = ref(false)
// 是否还有更多数据
export const hasMoreSystemNotices = ref(true)
// 当前页码
export const systemNoticesPageNum = ref(1)

export const systemNoticesPageSize = ref(10)

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date >= today) {
    return '今天'
  } else if (date >= yesterday) {
    return '昨天'
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

export const getSystemNotices = async (isLoadMore = false) => {
  try {
    loadingSystemNotices.value = true
    if (isLoadMore) {
      systemNoticesPageNum.value++
    } else {
      systemNoticesPageNum.value = 1
    }

    console.log('请求系统通知，页码:', systemNoticesPageNum.value)

    const rawRes = await fetch('/server/api/In-site/message/queryMyMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageNum: systemNoticesPageNum.value,
        pageSize: systemNoticesPageSize.value,
        sortItemList: [
          {
            isAsc: false,
            column: "publishTime"
          }
        ]
      })
    })

    if (!rawRes.ok) {
      throw new Error(`HTTP error! status: ${rawRes.status}`)
    }

    const rawData = await rawRes.text()
    const res = JSONbig({ storeAsString: true }).parse(rawData)
    if (res.data?.list && Array.isArray(res.data.list)) {
      const newNotices = res.data.list.map(item => ({
        id: item.messageId?.toString() || '',
        type: item.messageType || '系统通知',
        title: item.messageTitle || '',
        content: item.messageContent || '',
        time: item.sendTime ? new Date(item.sendTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '',
        date: item.sendTime ? formatDate(item.sendTime) : '',
        publishTime: item.sendTime || '',
        read: item.isRead === 1,
        senderName: item.senderName || '',
        attach: item.attach || ''
      }))

      // 加载更多
      if (isLoadMore) {
        systemNotices.value = [...systemNotices.value, ...newNotices]
      } else {
        systemNotices.value = newNotices
      }

    hasMoreSystemNotices.value = newNotices.length >= systemNoticesPageSize.value
      console.log('通知数据:', systemNotices.value)
      console.log('是否还有更多:', hasMoreSystemNotices.value)
    } else {
      if (!isLoadMore) {
        systemNotices.value = []
      }
      hasMoreSystemNotices.value = false
      console.log('没有通知数据')
    }
  } catch (error) {
    console.error('获取系统通知失败:', error)
    if (!isLoadMore) {
      systemNotices.value = []
    }
    hasMoreSystemNotices.value = false
  } finally {
    loadingSystemNotices.value = false
    console.log('加载完成')
  }
}
export const initSystemNotices = () => {
  getSystemNotices()
}

initSystemNotices()
