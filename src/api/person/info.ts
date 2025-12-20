import request from '@/utils/request';

// 用户基本信息类型
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  gender: number;
  birthday: string;
  phone: string;
  email: string;
  createTime: string;
}

// 用户详细信息类型
export interface UserDetailInfo {
  userVO: UserInfo & {
    username: string;
  };
}

// 更新用户信息参数类型
export interface UpdateUserInfoParams {
  userName?: string;
  gender?: number;
  birthday?: string;
  phone?: string;
}
// 登出响应类型
export interface LogoutResponse {
  code: number;
  msg: string;
}

/**
 * 获取用户基本信息
 */
export function getUserInfo(userId: string) {
  return request<UserDetailInfo>('/server/api/user/getUserInfo/userId', 'GET', { userId });
}

/**
 * 更新用户基本信息
 */
export function updateUserInfo(data: UpdateUserInfoParams) {
  return request('/server/api/user/updateUserInfo', 'POST', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

/**
 * 上传头像
 */
export function uploadAvatar(file: FormData) {
  return request('/server/api/user/updateUserAvatar', 'POST', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 用户登出
 */
export function logout() {
  return request<LogoutResponse>('/server/api/user/logout', 'POST');
}