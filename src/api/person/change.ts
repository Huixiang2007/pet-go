import request from '@/utils/request';

// 修改密码参数类型
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 修改用户密码
 */
export function changePasswords(data: ChangePasswordParams) {
  return request('/server/api/user/changePassword', 'POST', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
