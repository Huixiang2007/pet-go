import { normalUploadApi } from '@/api/file-upload/fileUpload'
export const normalUpload = async (file: File): Promise<string> => {
  const res = await normalUploadApi(file)
  return res.data
}
//校验文件格式
export const validateFile = (
  file: File,
  accept: string = 'image/*',
  maxSizeMB: number = 5,
): { isValid: boolean; message: string } => {
  // 大小校验
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      message: `文件大小不能超过${maxSizeMB}MB`,
    }
  }
  // 类型校验
  const acceptTypes = accept.split(',').map((t) => t.trim())
  const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
  const fileType = file.type.toLowerCase()

  const isValid = acceptTypes.some((type) => {
    if (type === '*/*') return true
    if (type.endsWith('/*')) return fileType.startsWith(type.split('/')[0] + '/')
    return fileType === type || fileExt === type
  })

  if (!isValid) {
    return {
      isValid: false,
      message: `文件格式不支持，请上传${accept}格式文件`,
    }
  }

  return { isValid: true, message: '' }
}
