
import request from '@/utils/request'
//我的评论列表
export async function getMyViewCommentList(params: any) {
  const res = await request(
    '/server/api/shop/product/comment/my-view-comment-list',
    'POST',
    params
  );
  return res.data;
}
//删除我的评论
export async function deleteMyComment(commentId: number) {
  const res = await request(
    `/server/api/shop/product/comment/user-delete-comment/${commentId}`,
    'POST'
  );
  return res.data;
}
//修改我的评论
export interface CommentParams {
  commentId?: number;
  orderItemId?: string;
  isAnonymous?: 0 | 1; // 是否匿名，可选，
  productScore?: number;      // 商品评分（1-5分）
  logisticsScore?: number;   // 物流评分（1-5分）
  serviceScore?: number;     // 服务评分（1-5分）
  content?: string;          // 评价内容（可选）
  imageUrls?: string;        // 图片URL（多个用逗号分隔）
  videoUrl?: string;         // 视频URL（可选）
  parentId?: number;
    toUid?: number      // 父评论ID（可选）
}

export async function updateMyComment(params: CommentParams) {
  const res = await request(
    '/server/api/shop/product/comment/user-update-comment',
    'POST',
    params
  );
  return res.data;
}


//提交追评
export interface AppendCommentParams {
  commentId: string,
  appendContent: string,
  appendImageUrls: string,
  appendVideoUrl: string
}

export async function appendMyComment(params: AppendCommentParams) {
  const res = await request(
    '/server/api/shop/product/comment/user-submit-comment2',
    'POST',
    params
  )
  return res.data;
    }
    //提交评论
export const submitComment = async (params: CommentParams) => {
  const res = await request(
    '/server/api/shop/product/comment/user-submit-comment',
    'POST',
    params
  )
  return res.data;
    }
//查看商品评价列表
export const getProductCommentList = async (params: any) => {
  const res = await request(
      '/server/api/shop/product/comment/user-view-comment-list',
      'POST',
      params
  )
  return res.data;
  }
  //点赞
  export async function likeComment(dataId: string | number, likeType: 2 | 1) {
  const res = await request(
    `/server/api/shop/product/comment/user-like-comment/${dataId}?likeType=${likeType}`,
    'POST'
  );
  return res.data;
}
//取消点赞
export async function cancelLikeComment(dataId: string | number, likeType:  1|2) {
  const res = await request(
    `/server/api/shop/product/comment/user-cancel-like-comment/${dataId}?likeType=${likeType}`,
    'POST'
  );
  return res.data;
  }

//评价回复
export const replyComment = async (params: any) => {
  const res = await request(
    '/server/api/shop/product/comment/reply-comment',
    'POST',
    params
  )
  return res.data;
}




//======问大家
export  interface MessageBoard{
  productId: string,
  content: string,
  imageUrls: string
}
//发布留言
export const submitMessage = async (params: any) => {
  const res = await request(
    '/server/api/shop/product/message/user-submit-message',
    'POST',
    params
  )
  return res.data;
}
//查看留言列表
export const getMessageList = async (params: any) => {
  const res = await request(
    '/server/api/shop/product/message/user-view-message-list',
    'POST',
    params
  )
  return res.data;
}
//删除留言
export const deleteMessage = async (messageId: number) => {
  const res = await request(
    `/server/api/shop/product/message/user-delete-message/${messageId}`,
    'POST'
  )
  return res;
}
//回复留言
export const replyMessage = async (params: CommentParams ) => {
  const res = await request(
    '/server/api/shop/product/message/user-reply-message',
    'POST',
    params
  )
  return res.data;
}
//判断是否点过赞
export const isLikeComment = async (dataId: string , likeType: 1 | 2) => {
  const res = await request(
    `/server/api/shop/product/comment/user-is-like/${dataId}?likeType=${likeType}`,
    'POST'
  )
  return res.data;
}
