// AI 聊天接口（流式输出）
export const getAiChat = (memoryId: string, message: string): Promise<Response> => {
  // 构建查询参数
  const params = new URLSearchParams()
  params.append('memoryId', memoryId)
  params.append('message', message)
  const token = localStorage.getItem('authToken')
  // 使用原生 Fetch API
  return fetch(`/server/api/ai/chat/AiChatFlux?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ memoryId, message }),
  })
}
