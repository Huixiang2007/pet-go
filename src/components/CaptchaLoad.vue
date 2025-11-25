<template>
  <div class="captcha-container">
    <canvas 
      ref="captchaCanvasRef"
      :width="width" 
      :height="height" 
      @click="refreshCaptcha"
      class="captcha-canvas"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'Captcha',
  props: {
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 38
    }
  },
  setup(props) {
    const captchaCanvasRef = ref<HTMLCanvasElement | null>(null)
    let correctCode = ''

    // 生成随机字符（4位字母数字）
    const getRandomCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789'
      let code = ''
      for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
      }
      return code
    }

    // 绘制验证码到Canvas
    const drawCode = () => {
      if (!captchaCanvasRef.value) return
      
      const canvas = captchaCanvasRef.value
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 随机背景色
      ctx.fillStyle = `rgb(${Math.floor(Math.random()*50+200)}, ${Math.floor(Math.random()*50+200)}, ${Math.floor(Math.random()*50+200)})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 生成并绘制验证码
      correctCode = getRandomCode()
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 每个字符随机颜色和位置
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = `rgb(${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*100)})`
        ctx.save()
        ctx.translate((canvas.width / 4) * i + (canvas.width / 8), canvas.height / 2)
        ctx.rotate((Math.random() - 0.5) * 0.4)
        ctx.fillText(correctCode[i], 0, 0)
        ctx.restore()
      }
      
      // 绘制干扰线
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgb(${Math.floor(Math.random()*150)}, ${Math.floor(Math.random()*150)}, ${Math.floor(Math.random()*150)})`
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.stroke()
      }
      
      // 绘制干扰点
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgb(${Math.floor(Math.random()*200)}, ${Math.floor(Math.random()*200)}, ${Math.floor(Math.random()*200)})`
        ctx.beginPath()
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 2,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    }

    // 刷新验证码
    const refreshCaptcha = () => {
      drawCode()
    }

    // 验证用户输入的验证码
    const validateCaptcha = (input: string): boolean => {
      return input.toLowerCase() === correctCode.toLowerCase()
    }

    // 获取当前验证码（仅用于开发调试）
    const getCurrentCode = () => {
      return correctCode
    }

    onMounted(() => {
      drawCode()
    })

    return {
      captchaCanvasRef,
      refreshCaptcha,
      validateCaptcha,
      getCurrentCode
    }
  }
})
</script>

<style scoped>
.captcha-container {
  display: inline-block;
}

.captcha-canvas {
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  width: v-bind('width + "px"');
  height: v-bind('height + "px"');
}

.captcha-canvas:hover {
  opacity: 0.8;
}
</style>
