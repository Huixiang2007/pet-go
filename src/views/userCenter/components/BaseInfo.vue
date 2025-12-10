<template>

  <form class="layui-form profile-form" @submit.prevent="handleSave">
    <div class="layui-form-item">
      <label class="layui-form-label">昵称</label>
      <div class="layui-input-block">
        <input type="text" name="nickname" v-model="localFormData.nickname" lay-verify="required" placeholder="请输入昵称"
          class="layui-input" />
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">性别</label>
      <div class="layui-input-block">
        <input type="radio" name="sex" value="1" v-model="localFormData.sex" title="男" />
        <input type="radio" name="sex" value="2" v-model="localFormData.sex" title="女" />
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">生日</label>
      <div class="layui-input-block">
        <el-date-picker class="custom-style" v-model="localFormData.birthday" type="date" name="birthday"
          lay-verify="required" placeholder="请选择生日日期" :max-date="new Date()" value-format="YYYY-MM-DD"
          style="width: 100%; height: 37px" :disabled-date="disabledDate" />
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">手机</label>
      <div class="layui-input-block">
        <input type="text" name="Phone" v-model="localFormData.phone" lay-verify="required|phone" placeholder="请输入手机号"
          class="layui-input" />
      </div>
    </div>

    <div class="layui-form-item">
      <label class="layui-form-label">邮箱</label>
      <div class="layui-input-block">
        <input type="text" name="email" v-model="localFormData.email" placeholder="请输入邮箱" class="layui-input"
          readonly />
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn btn-save" type="submit">保存修改</button>
        <button class="layui-btn delete-btn" type="button" @click="handleCancel">取消修改</button>
      </div>
    </div>
    <!-- <div class="show-photo">
      <img src="@/assets/img/do.png" alt="这是展示图片" />
    </div> -->
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 接收父组件的表单数据
const props = defineProps({
  formData: {
    type: Object as () => {
      nickname: string
      sex: number
      phone: string
      birthday: string
      email: string
    }, required: true
  },
  userInfo: { type: Object, required: true }
})

// 定义事件
const emit = defineEmits(['save', 'cancel'])
const localFormData = ref({ ...props.formData })

// 当props.formData变化时，更新本地副本
watch(() => props.formData, (newVal) => {
  localFormData.value = { ...newVal }
}, { deep: true })
// 禁用未来日期
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}


// 保存修改
const handleSave = (event: Event) => {
  event.preventDefault()
  if (!localFormData.value.nickname) {
    ElMessage.error('昵称不能为空')
    return
  }
  if (localFormData.value.nickname.length > 20) {
    ElMessage.error('昵称长度不能超过20个字符')
    return
  }
  if (!localFormData.value.sex) {
    ElMessage.error('请选择性别')
    return
  }
  if (!localFormData.value.birthday) {
    ElMessage.error('请选择生日')
    return
  }
  if (localFormData.value.birthday) {
    const birthdayDate = new Date(localFormData.value.birthday)
    const ageDiff = new Date().getFullYear() - birthdayDate.getFullYear()
    if (ageDiff > 150) {
      ElMessage.error('请输入合理的生日')
      return
    }
  }
  if (!localFormData.value.phone) {
    ElMessage.error('手机号不能为空')
    return
  }
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(localFormData.value.phone)) {
    ElMessage.error('请输入正确的手机号码')
    return
  }
  // 通知父组件保存
  emit('save', localFormData.value)
}

// 取消修改
const handleCancel = () => {
  localFormData.value = { ...props.formData }
  emit('cancel')
}
</script>

<style scoped>
:deep(.layui-form-radioed) {
  color: #fd9860;
}

:deep(.layui-form-radioed > i) {
  color: #fd9860;
}

.profile-form {
  max-width: 600px;
  position: relative;
}

.layui-form-item {
  margin-bottom: 1.5rem;
}

:deep(.layui-form-label) {
  width: 87px;
}

:deep(.layui-form-radio:hover>*, .layui-form-radioed, .layui-form-radioed>i) {
  color: #fd9860;
}

.btn-save {
  background-color: #fd9860;
  border-color: #fd9860;
  min-width: 120px;
}

.btn-save:hover {
  background-color: #fc8747;
  border-color: #fc8747;
}

.delete-btn {
  min-width: 120px;
  border-color: #d2d2d2;
  background: 0 0;
  color: #5f5f5f;
}

.delete-btn:hover {
  border-color: #fd9860;
  color: #fd9860;
}

.show-photo {
  position: absolute;
  width: 247px;
  height: 71%;
  bottom: -12%;
  left: 136%;
}

.layui-input:focus {
  border-color: #fd9860 !important;
  box-shadow: 0 0 0 3px #fd98600f;
}
</style>