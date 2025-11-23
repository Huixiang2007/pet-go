// 声明 window 上的 layui 全局变量
export {}
declare interface Window {
  layui: any;
}

// 声明 layui 模块的类型（若需要更精确的类型，可进一步完善）
declare const layui: {
  use: (modules: string[], callback: (...modules: any[]) => void) => void;
  form: {
    on: (event: string, callback: (data: { field: Record<string, string> }) => void) => void;
  };
  layer: {
    alert: (content: any, options?: any) => void;
  };
};