import request from '@/utils/request'
interface ApiResponse<T = any> {
  code: number;
  data?: T;
  msg?: string;
}
// 忘记密码表单数据类型
interface ForgetPasswordData {
  password: string
  againPassword: string
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
 * 重置密码流程专用的令牌
 * 后端 codeValidate 会把 userId 以该 token 为 key 写入 Redis，
 * forgetPassword 再用同一个 token 取回 userId，因此两步必须使用同一个值。
 */
const RESET_TOKEN_KEY = 'reset-pwd-token'

export function getResetToken(): string {
  let token = sessionStorage.getItem(RESET_TOKEN_KEY)
  if (!token) {
    token = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem(RESET_TOKEN_KEY, token)
  }
  return token
}

export function clearResetToken() {
  sessionStorage.removeItem(RESET_TOKEN_KEY)
}

/**
 * 忘记密码-重置密码
 * 后端接口：POST /api/user/forgetPassword?password=&againPassword=
 * 需要 Authorization 头携带 codeValidate 阶段的同一个 token
 */
export function resetPassword(data: ForgetPasswordData) {
  return request<ApiResponse>(
    '/server/api/user/forgetPassword',
    'POST',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: getResetToken(),
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
 * 后端接口：POST /api/user/codeValidate?email=&code=
 * 必须带 Authorization 头，否则后端 @RequestHeader("Authorization") 解析失败直接 500
 */
export function validateEmailCode(data: ValidateCodeData) {
  return request<ApiResponse>(
    '/server/api/user/codeValidate',
    'POST',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: getResetToken(),
      }
    }
  )
}
