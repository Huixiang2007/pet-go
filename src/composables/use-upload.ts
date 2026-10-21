import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { normalUpload } from '@/utils/upload'
import { useChunkUpload } from '@/utils/chunk-upload'
import type { FileItem } from '@/types/upload'

/**
 * 统一上传入口（自动切换普通/分片上传）
 * @param options 上传配置
 * @returns 响应式状态 + 上传方法
 */
export const useUpload = (options: {
  accept: string
  maxSizeMB: number
  chunkThreshold?: number
}) => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const fileList = ref<FileItem[]>([])
  const uploadFile = async (file: File): Promise<any> => {
    if (isUploading.value) {
      ElMessage.warning('正在上传中，请勿重复点击')
      throw new Error('上传中,请稍后')
    }
    isUploading.value = true
    uploadProgress.value = 0
    try {
      const chunkThreshold = options.chunkThreshold || 1024 * 1024 * 5
      if (file.size <= chunkThreshold) {
        //普通上传
        uploadProgress.value = 50
        const url = await normalUpload(file)
        uploadProgress.value = 100
        return url
      } else {
        //分片上传
        uploadProgress.value = 10
        //计算文件hash
        // const fileHash=await calculateHash(file);
        // uploadProcess.value=30
        const url = await useChunkUpload(file)
        uploadProgress.value = 100
        return url
      }
    } catch (e) {
      console.error('文件上传失败:', e)
      ElMessage.error(e instanceof Error ? e.message : '文件上传失败，请稍后重试')
      throw e
    } finally {
      isUploading.value = false
    }
  }
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls: string[] = []
    for (const file of files) {
      const url = await uploadFile(file)
      urls.push(url)
      // 记录上传成功的文件
      fileList.value.push({
        name: file.name,
        url,
        file: file,
        size: file.size,
        type: file.type,
        isImage: file.type.startsWith('image/'),
      })
    }
    return urls
  }
  const removeFile = (index: number) => {
    fileList.value.splice(index, 1)
  }
  return {
    // 响应式状态
    isUploading,
    uploadProgress,
    fileList,
    // 方法
    uploadFile,
    uploadFiles,
    removeFile,
  }
}
