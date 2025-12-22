import { ref } from 'vue';
/**
 * 节流函数（适配 Vue3 浏览器环境）
 * @param fn 要节流的函数
 * @param interval 间隔时间（毫秒）
 * @returns 节流函数 + 取消方法
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number = 300
) {
  let lastTime = 0;
  const timer = ref<number | null>(null);

  const throttledFn = (...args: Parameters<T>): ReturnType<T> | undefined => {
    let result: ReturnType<T> | undefined;
    const now = Date.now();

    if (now - lastTime >= interval) {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
      }
      result = fn(...args);
      lastTime = now;
    } else if (!timer.value) {
      timer.value = window.setTimeout(() => {
        result = fn(...args);
        lastTime = Date.now();
        timer.value = null;
      }, interval - (now - lastTime));
    }

    return result;
  };

  const cancelThrottle = () => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
    timer.value = null;
    lastTime = 0;
  };

  return { throttledFn, cancelThrottle };
}