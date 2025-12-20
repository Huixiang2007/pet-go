import request from '@/utils/request'
interface ApiResponse<T = any> {
  code: number;
  data?: T;
  msg?: string;
}
// 忘记密码表单数据类型
interface ForgetPasswordData {
  email: string
  code: string
  password: string
}

// 发送验证码数据类型
interface SendCodeData {
  email: string
}

// 验证邮箱验证码数据类型
interface ValidateCodeData {
  email: string
  code: string
}
/**
 * 忘记密码-重置密码
 */
export function resetPassword(data: ForgetPasswordData) {
  return request<ApiResponse>(
    '/server/api/user/resetPassword',
    'POST',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  )
}

/**
 * 发送验证码（忘记密码）
 */
export function sendForgetPasswordCode(data: SendCodeData) {
  return request<ApiResponse>(
    '/server/api/user/sendCode',
    'POST',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  )
}
/**
 * 验证邮箱验证码
 */
export function validateEmailCode(data: ValidateCodeData) {
  return request<ApiResponse>(
    '/server/api/user/codeValidate',
    'POST',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  )
}