import SparkMD5 from 'spark-md5';
import request from './request';
import {
  initChunkUpload,
  confirmChunkUpload,
  mergeChunks,
  normalUploadApi
} from '../api/file-upload/fileUpload';

// 分片配置
export const CHUNK_CONFIG = {
  chunkSize: 1024 * 1024 * 4, // 4MB/片
  concurrent: 3, // 并行上传数
};

// 定义上传的配置
export interface UploadConfig {
  uploadUrl: string;
  maxSizeMB: number;
  accept: string;
}

/**
 * 计算文件哈希（用于秒传/断点续传）
 * @param file 待上传的文件
 */
export const calculateHash = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer(); // 创建哈希计算对象
    const fileReader = new FileReader(); // 文件读取器
    // 兼容不同浏览器的分片方法
    const blobSlice = File.prototype.slice
    const totalChunks = Math.ceil(file.size / CHUNK_CONFIG.chunkSize); // 总分片数
    let currentChunk = 0; // 修正：变量名改为currentChunk，避免混淆

    // 分片读取文件
    const loadNextChunk = () => {
      const start = currentChunk * CHUNK_CONFIG.chunkSize; // 当前分片起始位置
      const end = Math.min(file.size, start + CHUNK_CONFIG.chunkSize); // 当前分片结束位置
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end)); // 读取分片
    };

    // 读取文件完成，追加分片哈希
    fileReader.onload = () => {
      spark.append(fileReader.result as ArrayBuffer); // 追加分片的哈希值
      currentChunk++; // 当前分片计数+1
      if (currentChunk >= totalChunks) {
        resolve(spark.end()); // 所有分片读取完成，返回最终哈希
      } else {
        loadNextChunk(); // 继续读取下一个分片
      }
    };

    fileReader.onerror = (err) => {
      reject(new Error(`计算文件哈希失败：${err}`));
    };

    loadNextChunk(); // 启动第一个分片读取
  });
};

/**
 * 分片上传核心函数
 * @param file 待上传的文件
 * @param config 上传配置
 * @returns 上传后的文件URL
 */
export const uploadWithChunk = async (
  file: File,
  config: UploadConfig
): Promise<string> => {
  try {
    if (file.size > config.maxSizeMB * 1024 * 1024) {
      throw new Error(`文件大小不能超过${config.maxSizeMB}MB`);
    }

    //  格式校验
    const acceptTypes = config.accept.split(',').map((t) => t.trim());
    const fileType = file.type.toLowerCase();  // 文件MIME类型（如：image/jpeg）
    const fileName = file.name.toLowerCase();

    const isValidType = acceptTypes.some((type) => {
      if (type === '*/*') return true;  // 允许所有文件
      if (type.endsWith('/*')) {  // 匹配「image/*」这类通配符
        return (
          fileType.startsWith(type.split('/')[0] + '/') ||
          fileName.endsWith(`.${type.split('/')[0]}`)
        );
      }
      // 匹配具体类型
      return fileType === type || fileName.endsWith(`.${type.split('/')[1]}`);
    });

    if (!isValidType) {
      throw new Error(`文件格式不支持，请上传${config.accept}格式`);
    }

    //小文件
    if (file.size <= CHUNK_CONFIG.chunkSize) {
      const res = await normalUploadApi(file);
      const finalUrl = res.data;
      if (!finalUrl) throw new Error('普通上传失败，未获取到文件URL');
      return finalUrl.length > 255 ? finalUrl.substring(0, 255) : finalUrl;
    }

    // 大文件
    const fileHash = await calculateHash(file);
    const chunkCount = Math.ceil(file.size / CHUNK_CONFIG.chunkSize); // 总分片数
console.log('分片数：',   fileHash,file.name,file.size,chunkCount);
    // 初始化分片上传
    const initRes = await initChunkUpload({
      fileHash,
      fileName: file.name,
      fileSize: file.size,
      chunkCount,
    });
    if (!initRes || !initRes.data) throw new Error('分片上传初始化失败');
    const { uploadId, chunkList = [] } = initRes.data;

    // 筛选需要上传的分片（排除已上传的)
    const needUploadChunks: number[] = [];
    for (let i = 0; i < chunkCount; i++) {
      if (!chunkList.includes(i)) {
        needUploadChunks.push(i);
      }
    }

    //  如果所有分片都已上传，直接合并
    if (needUploadChunks.length === 0) {
      const mergeRes = await mergeChunks({ uploadId, objectName: file.name });
      const finalUrl = mergeRes.data;
      if (!finalUrl) throw new Error('合并分片失败，未获取到文件URL');
      return finalUrl.length > 255 ? finalUrl.substring(0, 255) : finalUrl;
    }

    //并行上传分片
    let uploadIndex = 0; // 当前要上传的分片索引
    const uploadPromises: Promise<void>[] = []; // 上传Promise队列

    // 单个分片上传逻辑
    const uploadSingleChunk = async () => {
      if (uploadIndex >= needUploadChunks.length) return; // 所有分片上传完成，终止
      const chunkIndex = needUploadChunks[uploadIndex];
      uploadIndex++;

      // 切割分片
      const start = chunkIndex * CHUNK_CONFIG.chunkSize;
      const end = Math.min(start + CHUNK_CONFIG.chunkSize, file.size);
      const chunk = file.slice(start, end);

      // 构造分片上传的FormData
      const formData = new FormData();
      formData.append('uploadId', uploadId); // 本次上传唯一标识
      formData.append('fileHash', fileHash); // 文件哈希
      formData.append('chunkIndex', chunkIndex.toString());  // 当前分片索引
      formData.append('chunk', chunk); // 分片二进制数据

      // 上传当前分片
      const chunkRes = await request(`${config.uploadUrl}/chunk`, 'POST', formData);
      if (!chunkRes || !chunkRes.data) throw new Error(`分片${chunkIndex}上传失败`);
      const { chunkETag } = chunkRes.data;

      // 确认分片上传成功
      await confirmChunkUpload({
        uploadId,
        chunkIndex,
        chunkETag,
        success: true,
      });

      // 递归上传下一个分片
      await uploadSingleChunk();
    };

    // 并发上传
    for (let i = 0; i < Math.min(CHUNK_CONFIG.concurrent, needUploadChunks.length); i++) {
      uploadPromises.push(uploadSingleChunk());
    }
    await Promise.all(uploadPromises); // 等待所有分片上传完毕

    // 合并分片
    const mergeRes = await mergeChunks({ uploadId, objectName: file.name });
    if (!mergeRes || !mergeRes.data) throw new Error('合并分片失败');
    const finalUrl = mergeRes.data;

    //统一截断超长URL
    return finalUrl.length > 255 ? finalUrl.substring(0, 255) : finalUrl;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
};
