import { ref } from 'vue'

// 系统通知数据（接口请求：axios.get('/api/notices').then(res => systemNotices.value = res.data)）
export const systemNotices = ref([
  {
    id: 'notice1',
    type: '活动通知',
    title: '开学季宠物乐园计划',
    content: '想带你的狗狗出来散步游玩吗，快来参加活动吧，这里的服务超齐全',
    time: '10:05',
    date: '今天14:45',
    publishTime: '发布后立即生效',
    read: false
  },
  {
    id: 'notice2',
    type: '系统通知',
    title: '账户余额提醒',
    content: '账户余额不足，已自动暂停自动续费服务',
    time: '09:30',
    date: '今天14:45',
    publishTime: '2026-03-12 09:25',
    read: false
  },
  {
    id: 'notice3',
    type: '优惠通知',
    title: '新用户专享优惠券',
    content: '新用户专享优惠券已发放至您的账户，有效期7天',
    time: '昨天 18:20',
    date: '昨天',
    publishTime: '2026-03-11 18:00',
    read: true
  }
])
