<!-- src/components/foster/BookingStep5Success.vue -->
<template>
  <el-card shadow="hover" class="info-card success-card">
    <div class="success-content">
      <el-icon class="success-icon">
        <CircleCheckFilled />
      </el-icon>
      <h2>支付成功！</h2>
      <p>您的寄养订单已提交，寄养家庭将尽快与您联系</p>
      <div class="order-info">
        <p>订单编号：<span>{{ orderNo }}</span></p>
        <p>
          支付金额：<span>¥{{ totalPrice }} 元</span>
        </p>
        <p>
          剩余余额：<span>¥{{ userBalance - totalPrice }} 元</span>
        </p>
      </div>
      <el-button type="primary" @click="goToHome">返回首页</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CircleCheckFilled } from '@element-plus/icons-vue'

// Props
const props = defineProps<{
  orderNo: number
  totalPrice: number
  userBalance: number
}>()
console.log(props)
// 路由
const router = useRouter()

// 返回首页
const goToHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.success-card {
  .success-content {
    text-align: center;
    padding: 40px 20px;

    .success-icon {
      font-size: 64px;
      color: #67c23a;
      margin-bottom: 20px;
    }

    h2 {
      color: #1f2937;
      margin: 0 0 12px 0;
      font-size: 24px;
    }

    p {
      color: #475569;
      font-size: 16px;
      margin: 0 0 24px 0;
    }

    .order-info {
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 32px;

      p {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        margin: 0;

        span {
          font-weight: 600;
          color: #409eff;
        }
      }
    }
  }
}
</style>