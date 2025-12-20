import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

//初始化分片上传
export const initChunkUpload = (data: {
  fileHash: string
  fileName: string
  fileSize: number
  chunkCount: number
}) => {
  return request('/server/api/file/chunk/init', 'POST', data)
}
//确认分片上传成功
export const confirmChunkUpload = (data: {
  uploadId: string
  chunkIndex: number
  chunkETag: string
  success: boolean
}) => {
  return request('/server/api/file/chunk/confirm', 'POST', data)
}
//合并分片
export const mergeChunks = (data: { uploadId: string; objectName: string }) => {
  return request('/server/api/file/chunk/merge', 'PUT', data)
}
//普通上传文件
export const normalUploadApi = (file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData()
  formData.append('file', file)
  return request('/server/api/file/upload', 'POST', formData)
}
