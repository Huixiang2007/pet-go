import { defineStore } from 'pinia'

// 定义表单数据的类型接口（TypeScript 类型约束）
interface RegisterForm {
  email: string
  vercode: string
  password: string
  confirm: string
  name: string
}

// 定义并导出 Pinia Store（使用 TypeScript）
export const useRegisterStore = defineStore('register', {
  // 状态：指定类型为 RegisterForm，初始化空值
  state: (): { form: RegisterForm } => ({
    form: {
      email: '',
      vercode: '',
      password: '',
      confirm: '', 
      name: '',
    },
  }),

  actions: {
    // 更新单个字段：指定 key 为表单字段的键，value 为对应类型（string）
    setField(key: keyof RegisterForm, value: string) {
      this.form[key] = value
    },

    // 清空表单：重置为初始状态
    clearForm() {
      this.form = {
        email: '',
        vercode: '',
        password: '',
        confirm: '', 
        name: '',
      }
    },
  },
})
