import request from '@/utils/request';



// 接口响应通用类型（仅定义基础结构，不做业务处理）
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

// 实名认证提交/重新提交参数类型
export interface RealNameAuthParams {
  realName: string;
  idCard: string;
  gender: number;
  birthday: string;
  address: string;
  idCardFront?: string;
  idCardBack?: string;


}
export interface RealNameInfoData {
  id: number;
  status: string;      
  pictureUrl: string;   
  realName: string;     
  idCard: string;       
  gender: number;       
  birthday: string;     
  address: string;      

}
/**
 * 获取实名认证状态（仅基础请求封装，无业务逻辑）
 */
export const getRealNameInfo=(): Promise<ApiResponse<RealNameInfoData>>=> {
  return request('/server/api/user/getUserAuth', 'GET');

}


/**
 * 提交实名认证申请（仅基础请求封装）
 */
// export function submitRealNameAuth(data: RealNameAuthParams) {
//   return request<ApiResponse<RealNameInfoData>>(
//     '/server/api/user/userAuth',
//     'POST',
//     data,
//     {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     }
//   );
// }

// 提交实名认证申请

export const submitRealNameAuth=(data: FormData)=> {
  return request<ApiResponse<RealNameInfoData>>(
    '/server/api/user/userAuth',
    'POST',
    data,
  
  );
}

// 失败后提交申请
export const submitAgain=(data: FormData)=> {
  return request<ApiResponse<RealNameInfoData>>(
    '/server/api/user/updateUserAuth',
    'POST',
    data,
    
  );
}