<template>
  <div class="demo-login">
    <form class="layui-form demo-login-container">
      <div class="container">
        <img src="../assets/img/logo.png" alt="这是图标" class="logo" />

        <div class="title">
          <!-- 遍历字符数组，每个字符一个span，添加索引对应的延迟动画 -->
          <span
            v-for="(char, index) in titleLoginChars"
            :key="index"
            :style="{ animationDelay: `${index * 100}ms` }"
            class="char"
          >
            {{ char }}
          </span>
        </div>
      </div>

      <div class="myCenter">
        <div class="layui-form-item">
          <div class="layui-input-wrap">
            <div class="layui-input-prefix">
              <i class="layui-icon layui-icon-username"></i>
            </div>
            <input
              type="text"
              name="username"
              value=""
              lay-verify="required"
              placeholder="用户名"
              lay-reqtext="请填写用户名"
              autocomplete="off"
              class="layui-input"
              lay-affix="clear"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-input-wrap">
            <div class="layui-input-prefix">
              <i class="layui-icon layui-icon-password"></i>
            </div>
            <input
              type="password"
              name="password"
              value=""
              lay-verify="required"
              placeholder="密   码"
              lay-reqtext="请填写密码"
              autocomplete="off"
              class="layui-input"
              lay-affix="eye"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-row">
            <div class="layui-col-xs7">
              <div class="layui-input-wrap">
                <div class="layui-input-prefix">
                  <i class="layui-icon layui-icon-vercode"></i>
                </div>
                <input
                  type="text"
                  name="captcha"
                  value=""
                  lay-verify="required"
                  placeholder="验证码"
                  lay-reqtext="请填写验证码"
                  autocomplete="off"
                  class="layui-input"
                  lay-affix="clear"
                />
              </div>
            </div>
            <div class="layui-col-xs5">
              <div style="margin-left: 10px">
                <img
                  src="https://www.oschina.net/action/user/captcha"
                  onclick="this.src='https://www.oschina.net/action/user/captcha?t='+ new Date().getTime();"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <input type="checkbox" name="remember" lay-skin="primary" title="记住密码" />
          <a href="#forget" style="float: right; margin-top: 7px">忘记密码？</a>
        </div>
        <div class="layui-form-item">
          <button class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-login">登录</button>
        </div>
        <div class="layui-form-item demo-login-other">
          <label>社交账号登录</label>
          <span style="padding: 0 2px 0 6px">
            <a href="javascript:;"
              ><i class="layui-icon layui-icon-login-qq" style="color: #3492ed"></i
            ></a>
            <a href="javascript:;"
              ><i class="layui-icon layui-icon-login-wechat" style="color: #4daf29"></i
            ></a>
            <a href="javascript:;"
              ><i class="layui-icon layui-icon-login-weibo" style="color: #cf1900"></i
            ></a>
          </span>
          或 <span @click="toRegister" class="register">注册帐号</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// 静态文本（非响应式，适合不需要修改的数据）
const titleLoginChars = '欢迎登录 PetGo'.split('')

// 响应式状态管理
const isLogin = ref(true) // 登录/注册切换状态

// 定时器管理（避免内存泄漏）
let hideErrorTimer = null

/**
 * 初始化 Layui 组件（在组件挂载后执行）
 */
onMounted(() => {
  // 确保 Layui 已加载
  if (window.layui) {
    layui.use(['form', 'layer'], (form, layer) => {
      // 监听登录表单提交
      form.on('submit(demo-login)', (data) => {
        const formData = data.field
        layer.alert(JSON.stringify(formData, null, 2), {
          title: '登录表单数据',
        })
        // 实际场景：调用登录接口
        // loginApi(formData).then(res => {
        //   console.log('登录成功', res);
        // });
        return false // 阻止默认提交
      })
      form.render()
    })
  } else {
    console.error('Layui 未加载，请检查引入是否正确')
  }
})

/**
 * 组件卸载时清理资源（防止内存泄漏）
 */
onUnmounted(() => {
  if (hideErrorTimer) {
    clearTimeout(hideErrorTimer)
    hideErrorTimer = null
  }
})

const router = useRouter()
// 跳转到注册页
const toRegister = () => {
  router.push('/Register')
}
</script>

<style>
.demo-login-container {
  width: 320px;
  margin: 21px auto 0;
}
.demo-login-other .layui-icon {
  position: relative;
  display: inline-block;
  margin: 0 2px;
  top: 2px;
  font-size: 26px;
}

.demo-login {
  min-height: 100vh;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.demo-reg-container {
  width: 320px;
  margin: 21px auto 0;
}
.demo-reg-other .layui-icon {
  position: relative;
  display: inline-block;
  margin: 0 2px;
  top: 2px;
  font-size: 26px;
}
body {
  background-image: url('../assets/img/background1.png');
  background-repeat: no-repeat;
  background-size: cover;
}
.demo-login-container {
  width: 400px; /* 表单宽度 */
  padding: 30px;
  background-color: rgba(951, 588, 235, 0.6); /* 半透明白色背景 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影增强层次感 */
}
.container {
  display: flex; /* 开启 Flex 布局 */
  align-items: center; /* 垂直居中对齐（可选，让文字和图片在同一水平线上） */
  gap: 10px; /* 子元素之间的间距（可选） */
  margin: 20px; /* 顶部外边距 */
}

/* 可选：调整文字和图片样式 */
.container span {
  display: inline-block;
  margin: 0; /* 清除 p 标签默认的上下外边距，避免错位 */
  font-size: 24px; /* 示例：调整文字大小 */
}

.logo {
  margin-left: 20px;
  width: 60px; /* 示例：设置图片宽度 */
  height: auto; /* 保持图片比例 */
}

.layui-btn {
  background-color: rgb(253, 152, 96);
}
.layui-input:focus {
  border-color: rgb(253, 152, 96) !important;
  box-shadow: 0 0 3px 1px rgba(253, 152, 96, 0.3) !important;
}
.layui-checkbox:hover .layui-checkbox {
  border-color: rgb(253, 152, 96);
}
.layui-form-checked[lay-skin='primary'] i {
  background-color: rgb(253, 152, 96);
  border-color: rgb(253, 152, 96) !important;
  color: #fff;
}
.layui-form-checkbox[lay-skin='primary']:hover i {
  border-color: rgb(253, 152, 96);
}
.layui-form-checkbox[lay-skin='primary'] {
  border-color: rgb(253, 152, 96);
}
.layui-btn-primary:hover {
  border-color: rgb(253, 152, 96);
  color: #333;
}

.title {
  /* 容器样式（可选） */
  font-size: 24px;
  font-weight: bold;
}

.char {
  /* 每个字符的初始状态：透明且微小缩放 */
  opacity: 0;
  transform: scale(0.8);
  /* 动画：100ms 延迟后，0.3s 过渡到显示状态 */
  animation: fadeIn 0.3s ease-out forwards;
  /* 保持字符间距（避免动画时跳动） */
  display: inline-block;
  min-width: 0.5em; /* 对空格等字符生效，避免挤压 */
}

/* 动画关键帧：从隐藏到显示 */
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
span {
  cursor: pointer;
}
.agreement-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* 复选框样式 */
.agreement-checkbox {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #165dff;
}

/* 文本样式 */
.agreement-label {
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

/* 链接样式 */
.agreement-link {
  color: #165dff;
  text-decoration: none;
  margin: 0 3px;
}

.agreement-link:hover {
  text-decoration: underline;
}

/* 未勾选状态按钮样式 */
.agreement-checkbox:not(:checked) + .agreement-label + .register-btn {
  background-color: #cccccc;
  cursor: not-allowed;
}

.agreement-checkbox:not(:checked) + .agreement-label + .register-btn:hover {
  background-color: #cccccc;
}
.error-message {
  /* 间距控制：与上方元素保持距离 */
  margin-top: 0.5rem; /* mt-2的等价实现 */

  /* 文本样式 */
  font-size: 0.75rem; /* text-xs的等价实现 */
  color: #ef4444; /* text-red-500的等价实现 */

  /* 布局控制 */
  display: flex;
  align-items: center;
  line-height: 1; /* 紧凑显示 */
}

/* 错误图标样式 */
.error-icon {
  /* 图标与文字间距 */
  margin-right: 0.25rem;

  /* 图标大小调整 */
  font-size: 0.875rem;

  /* 确保图标垂直居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 脉冲动画效果（animate-pulse） */
.error-message {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 定义脉冲动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1; /* 完全显示 */
  }
  50% {
    opacity: 0.5; /* 半透明 */
  }
}

/* 隐藏状态（通过v-if已经移除元素，这里作为补充） */
.error-message.hidden {
  display: none;
}
/* 注册账号文字样式 */
.register {
  position: relative; /* 用于定位下划线伪元素 */
  cursor: pointer; /* 鼠标悬停时显示手型（提示可点击） */
  color: #333; /* 默认文字颜色 */
  padding-bottom: 2px; /* 预留下划线的空间（避免文字跳动） */
  transition: color 0.3s ease; /* 文字颜色过渡（可选） */
}

/* 下划线伪元素（初始隐藏状态） */
.register::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0; /* 初始宽度为 0（不显示） */
  height: 2px; /* 下划线高度 */
  background-color: #1677ff; /* 蓝色下划线（可自定义色值） */
  transition: width 0.4s ease; /* 宽度过渡动画：0.4秒缓慢展开 */
}

/* 鼠标 hover 时的效果 */
.register:hover {
  color: #1677ff; /* 文字同步变蓝（可选，增强交互感） */
}

.register:hover::after {
  width: 100%; /* 下划线宽度从 0 过渡到 100%（从左到右展开） */
}
</style>