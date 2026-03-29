export const createSSE = (userId: number) => {
   const url = `/server/api/In-site/message/sse/connect?userId=${userId}`;

  // 创建 SSE 实例
  const sse = new EventSource(url);
    //打开 SSE 连接
  sse.onopen = () => {
    console.log('SSE 连接已成功建立！');
  };
  // 接收消息
  sse.onmessage = (event) => {
    console.log('SSE 收到消息:', event.data);
  };

  // 错误/断开提示
  sse.onerror = (err) => {
    console.error('SSE 错误/断开:', err);
    if (sse.readyState === EventSource.CLOSED) {
      sse.close();
    }
  };
  return sse;
};

// 关闭 SSE
export const closeSSE = (sse: EventSource) => {
  if (sse) {
    sse.close();
    console.log('SSE 已关闭');
  }
};
