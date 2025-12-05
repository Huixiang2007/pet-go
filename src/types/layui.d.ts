// 声明 window 上的 layui 全局变量
export { Window }
declare interface Window {
  layui: any //eslint-disable-line @typescript-eslint/no-explicit-any
}

// 声明 layui 全局变量的类型
declare global {
  const layui: {
    use: (
      modules: string[],
      callback: (
        ...modules: any[] //eslint-disable-line @typescript-eslint/no-explicit-any
      ) => void,
    ) => void
    form: {
      on: (event: string, callback: (data: { field: Record<string, string> }) => void) => void
    }
    layer: {
      alert: (
        content: any, //eslint-disable-line @typescript-eslint/no-explicit-any
        options?: any, //eslint-disable-line @typescript-eslint/no-explicit-any
      ) => void
    }
  }
}
