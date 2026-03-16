import request from '@/utils/request'

// 账号登录数据类型
interface AccountLoginData {
  account: string
  password: string
}

// 邮箱登录数据类型
interface EmailLoginData {
  email: string
  password: string
}

// 登录响应数据类型
interface LoginResponse {
  code: number;
  level: null;
  msg: string;
  ok: boolean;
  data: {
    userInfo: {
      userId: string;
      userRole: string;
    };
    shopInfo: {
      shopId: string;
      shopName: string;
      shopStatus: string;
    };
    token: string;
  };
}

/**
 * 账号密码登录
 */
export function loginByAccount(data: AccountLoginData) {
  return request<LoginResponse>(
    '/server/api/user/login/account',
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
 * 邮箱密码登录
 */
export function loginByEmail(data: EmailLoginData) {
  return request<LoginResponse>(
    '/server/api/user/login/email',
    'POST',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  )
}
