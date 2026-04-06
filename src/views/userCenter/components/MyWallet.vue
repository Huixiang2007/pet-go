<template>
  <div class="recharge-container">
    <el-card class="main-card" shadow="hover">
      <h2 class="card-title">账户充值</h2>

      <!-- 余额展示：用父组件传的 props -->
      <div class="balance-info">
        <span>当前余额：</span>
        <span class="balance">¥{{ props.balance }}</span>
      </div>

      <!-- 充值金额输入 -->
      <el-input
        v-model.number="rechargeAmount"
        type="number"
        placeholder="请输入充值金额"
        class="input-item"
        :min="0.01"
        step="0.01"
      />

      <!-- 充值按钮 -->
      <el-button
        type="primary"
        round
        class="recharge-btn"
        @click="handleRecharge"
        :loading="isLoading"
      >
        确认充值
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { recharge } from '@/api/person/money'


const props = defineProps({
  balance: {
    type: Number,
    default: 0.00
  }
})

// 充值金额
const rechargeAmount = ref(0)
const isLoading = ref(false)

// 充值成功后通知父组件刷新余额
const emit = defineEmits(['refresh'])

const handleRecharge = async () => {
  if (!rechargeAmount.value || rechargeAmount.value <= 0) {
    ElMessage.warning('请输入有效的充值金额')
    return
  }

  isLoading.value = true
  try {
    const response = await recharge(rechargeAmount.value)
    if (response.code === 0) {
      ElMessage.success(`充值成功！`)
      rechargeAmount.value = 0
      emit('refresh')
    } else {
      ElMessage.error(response.msg || '充值失败')
    }
  } catch (error) {
    console.error('充值失败:', error)
    ElMessage.error('充值失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.recharge-container {
  padding: 20px;
  background: #faf6f0;
  display: flex;
  justify-content: center;
  padding-top: 60px;
}

.main-card {
  width: 480px;
  border-radius: 16px;
  border-color: #e8d6c4;
  padding: 30px;
  text-align: center;
}

.card-title {
  color: #6b5b45;
  margin: 0 0 30px 0;
}

.balance-info {
  font-size: 16px;
  color: #6b5b45;
  margin-bottom: 24px;

  .balance {
    font-size: 22px;
    font-weight: bold;
    color: rgb(253, 152, 96);
  }
}

.input-item {
  margin-bottom: 24px;
}

.recharge-btn {
  width: 100%;
  --el-button-bg-color: rgb(253, 152, 96);
  --el-button-border-color: #e8a87c;
}
</style>