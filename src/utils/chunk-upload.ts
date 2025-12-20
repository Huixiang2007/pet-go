import SparkMD5 from 'spark-md5'

import {
  initChunkUpload,
  confirmChunkUpload,
  mergeChunks,
  normalUploadApi,
} from '@/api/file-upload/fileUpload'
const CHUNK_SIZE = 1024 * 1024
// const fileHash = ref<string>('')
// const fileName = ref<string>('')
//切割文件为分片
export const createChunks = (file: File) => {
  let cur = 0
  const chunks: Blob[] = []
  while (cur < file.size) {
    const blob = file.slice(cur, cur + CHUNK_SIZE)
    chunks.push(blob)
    cur += CHUNK_SIZE
  }
  return chunks
}
//计算文件hash值
export const calculateHash = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const chunks = createChunks(file)
    const targets: Blob[] = [] //存储所有参与计算的切片
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    chunks.forEach((chunk, index) => {
      //第一个和最后一个切片全部参与计算
      if (index == 0 || index == chunks.length - 1) {
        targets.push(chunk)
      } else {
        targets.push(chunk.slice(0, 2))
        targets.push(chunk.slice(CHUNK_SIZE / 2, CHUNK_SIZE / 2 + 2)) //中间2个字节
        targets.push(chunk.slice(CHUNK_SIZE - 2, CHUNK_SIZE)) //最后两个字节
      }
    })
    fileReader.readAsArrayBuffer(new Blob(targets))
    //onload是异步的，但是我们希望同步获取hsash值，所以放到Promise里
    fileReader.onload = (e) => {
      spark.append((e.target as FileReader).result as ArrayBuffer)
      resolve(spark.end())
    }
  })
}
// 计算分片指纹
export const calculateChunkETag = async (chunk: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(chunk)
    fileReader.onload = (e) => {
      spark.append((e.target as FileReader).result as ArrayBuffer)
      resolve(spark.end()) // 分片Hash直接作为ETag
    }
  })
}

/**
 * 初始化分片上传
 * @param fileHash 文件Hash
 * @param fileName 文件名
 * @param fileSize 文件大小
 * @param chunkCount 分片数量
 */
export const useChunkUpload = async (file: File, threshold: number = 1024 * 1024 * 5) => {
  if (file.size <= threshold) {
    const res = await normalUploadApi(file)
    return res.data
  }
  try {
    //文件分片
    const chunks = createChunks(file)
    const chunkCount = chunks.length
    console.log('文件以分片，开始计算hash')
    //计算hash
    const fileHash = await calculateHash(file)
    console.log('hash计算结果：', chunkCount)
    //初始化分片上传
    const initRes: any = await initChunkUpload({
      fileHash,
      fileName: file.name,
      fileSize: file.size,
      chunkCount,
    })
    console.log('分片上传初始化结果：', initRes)
    const { uploadId, objectName, exist, src, chunkList } = initRes.data
    if (exist && src) {
      return src
    }
    const uploadedChunkIndexes = chunkList.map((item: any) => item.chunkIndex)
    const needUploadChunks = chunks
      .map((chunk, index) => ({ chunk, index }))
      .filter((item) => !uploadedChunkIndexes.includes(item.index))

    if (needUploadChunks.length === 0) {
      console.log('所有分片已上传')
    } else {
      console.log(`还需要上传${needUploadChunks.length} 个分片`)
      //上传分片
      const index: number = 0

      while (index < needUploadChunks.length) {
        const { chunk, index: chunkIndex } = needUploadChunks[index]
        const chunkETag = await calculateChunkETag(chunk)
        const confirmRes = await confirmChunkUpload({
          uploadId,
          chunkIndex,
          chunkETag,
          success: false,
        })
        if (confirmRes.data === true) {
          console.log('分片上传成功')
          return confirmRes
        }
      }
      const mergeRes = await mergeChunks({
        uploadId,
        objectName,
      })
      if (mergeRes.code === 0) console.log('分片上传合并成功')
      return mergeRes.data
    }
  } catch (err) {
    console.log('分片上传初始化失败：', err)
  }
}
