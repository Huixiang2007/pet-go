import { ref } from 'vue';

/**
 * 防抖函数（适配 Vue3 浏览器环境）
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖函数 + 取消方法
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false
) {

  const timer = ref<number | null>(null);

  const debouncedFn = (...args: Parameters<T>): ReturnType<T> | undefined => {
    let result: ReturnType<T> | undefined;

    // 清除之前的定时器（ref 需要取 .value）
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }

    // 立即执行逻辑
    if (immediate && !timer.value) {
      result = fn(...args);
    }

    // 重置定时器，保存 ID 到 ref
    timer.value = window.setTimeout(() => {
      if (!immediate) {
        result = fn(...args);
      }
      timer.value = null;
    }, delay);

    return result;
  };

  // 取消防抖（组件卸载时调用）
  const cancelDebounce = () => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
    timer.value = null;
  };

  return { debouncedFn, cancelDebounce };
}
