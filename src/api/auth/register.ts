import request from '@/utils/request'

// 注册表单数据类型
interface RegisterData {
  account: string
  email: string
  password: string
  code: string
}

// 注册响应数据类型
interface RegisterResponse {
  token: string
  userId: string
}

// 发送验证码数据类型
interface SendCodeData {
  email: string
}

/**
 * 用户注册
 */
export function register(data: RegisterData) {
  return request<RegisterResponse>(
    '/server/api/user/register',
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
 * 发送验证码
 */
export function sendVerificationCode(data: SendCodeData) {
  return request(
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