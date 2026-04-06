
const formatTime = (time: string) => {
  if (!time) {
    const now = new Date()
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    return `${hour}:${minute}`
  }

  try {
    let date: Date
    const isoRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    const match = time.match(isoRegex)

    if (match) {
      date = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6]),
      )
    } else {
      // 兜底解析其他格式
      date = new Date(time)
    }

    // 检测无效日期
    if (isNaN(date.getTime())) {
      return '未知时间'
    }

    // 获取当前时间 + 时间差计算
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // 今天0点
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1) // 昨天0点
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7) // 一周前0点
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()) // 目标时间的0点

    // 时间维度格式化
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    if (targetDate.getTime() === today.getTime()) {
      // 今天：显示 HH:mm
      return `${hour}:${minute}`
    } else if (targetDate.getTime() === yesterday.getTime()) {
      // 昨天：显示 昨天 HH:mm
      return `昨天 ${hour}:${minute}`
    } else if (targetDate.getTime() > oneWeekAgo.getTime()) {
      // 近7天（非今天/昨天）：显示 周X HH:mm
      const weekDay = weekDays[date.getDay()]
      return `${weekDay} ${hour}:${minute}`
    } else {
      // 更早时间：显示 MM-DD HH:mm（跨年则显示 YYYY-MM-DD HH:mm）
      if (date.getFullYear() !== now.getFullYear()) {
        const year = date.getFullYear()
        return `${year}-${month}-${day} ${hour}:${minute}`
      } else {
        return `${month}-${day} ${hour}:${minute}`
      }
    }
  } catch (e) {
    console.error('格式化店铺时间失败：', e)
    return '未知时间'
  }
}
export default formatTime
