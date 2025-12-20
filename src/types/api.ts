export interface ApiResponse<T = any> {
  code: number
  level: string
  msg: string
  ok: boolean
  data: T
}
