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

const getSystemNotices = async () => {
  try {
    const rawRes = await fetch('/server/api/In-site/message/queryMyMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageNum: 1,
        pageSize: 20,
        sortItemList: [
          {
            isAsc: false,
            column: "publishTime"
          }
        ]
      })
    })
    const rawData = await rawRes.text()
    const res = JSONbig({ storeAsString: true }).parse(rawData)

    if (res.data.list && Array.isArray(res.data.list)) {
      systemNotices.value = res.data.list.map(item => ({
        id: item.messageId.toString(),
        type: item.messageType || '系统通知',
        title: item.messageTitle || '',
        content: item.messageContent || '',
        time: new Date(item.sendTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        date: formatDate(item.sendTime),
        publishTime: item.sendTime,
        read: item.isRead === 1 ,
        senderName: item.senderName || '',
        attach: item.attach || ''
      }))

    } else {
      systemNotices.value = []
    }
  } catch (error) {
    console.error('获取系统通知失败:', error)
    systemNotices.value = []
  }
}
getSystemNotices()
