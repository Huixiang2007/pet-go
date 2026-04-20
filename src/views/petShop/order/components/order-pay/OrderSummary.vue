<!-- 订单摘要组件 -->
<template>
  <div class="shadow-gary-300 rounded-xl pt-6 mt-6 mr-4">
    <div class="bg-white rounded-xl p-6 top-24">
      <h2 class="text-lg font-semibold mb-6">订单摘要</h2>

      <!-- 费用明细 -->
      <div class="space-y-3 mb-6">
        <div class="flex justify-between text-sm">
          <span class="text-light">商品总价</span>
          <span>¥{{ totalPrice }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-light">运费</span>
          <span>¥{{ props.shippingFee }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-light">优惠券折扣</span>
          <span class="text-green-500">-¥{{ props.discount }}</span>
        </div>
      </div>

      <hr class="my-4 border-gray-100" />

      <!-- 实付款 -->
      <div class="flex justify-between font-semibold text-lg mb-6">
        <span>实付款</span>
        <span>¥{{ actualPrice }}</span>
      </div>

      <!-- 支付方式 -->
      <div class="payment-methods">
        <h4 class="flex items-center gap-2">
          <i class="fa fa-wallet text-[#409eff]"></i>
          支付方式
        </h4>
        <div class="payment-option balance-payment flex items-center gap-2 py-3">
          <i class="fa fa-money text-[#67c23a]"></i>
          <span>余额支付</span>
          <span class="payment-tip text-xs text-gray-500 ml-2"
            >将从您的充值余额中扣除{{ actualPrice }}元</span
          >
        </div>
        <!-- 确认支付按钮 -->
        <el-button
          type="primary"
          class="w-full mt-4"
          v-model="dialogVisible"
          style="background-color: #f3ce48; border-color: #f3ce48; color: #333"
          @click="$emit('confirm-pay')"
        >
          确认支付
        </el-button>
        <div class="agreementAccepted">
          <input
            type="checkbox"
            key="agreement"
            v-model="agreementAccepted"
            @click="handleAgreement"
          />
          我已阅读并同意
          <span class="text-blue-500 cursor-pointer" @click="dialogVisible = true"
            >《电商订单服务协议》</span
          >
        </div>
        <!-- 服务协议弹窗 -->
        <el-dialog v-model="dialogVisible" title="电商订单服务协议" width="600px">
          <div
            class="agreement-content"
            style="max-height: 400px; overflow-y: auto; line-height: 1.8"
          >
            <h3 class="text-center mb-4">电商订单服务协议</h3>
            <p>
              1.
              甲方（用户）承诺提交订单时填写的收货地址、联系方式等信息真实有效，确保订单商品信息、数量及结算金额核对无误，自愿完成下单操作。
            </p>
            <p>
              2.
              乙方（平台/商家）需按照订单约定的商品规格、数量准时发货，保证商品质量符合国家质量标准及平台售卖规范，提供合规的售后服务。
            </p>
            <p>
              3.
              订单支付完成后生效，商家需在约定时效内完成发货、物流配送；若商品存在质量问题、错发漏发等情况，由乙方承担退换货、补发及相关运费损失。
            </p>
            <p>
              4.
              甲方需在订单确认后按时完成支付，逾期未支付的订单，乙方有权自动关闭订单、取消售卖；支付成功后无正当理由拒收、退货产生的额外费用，由甲方自行承担。
            </p>
            <p>
              5.
              本协议自订单支付成功之日起生效，涵盖商品发货、配送、签收及售后质保全流程，双方履约完毕后自动终止。
            </p>
            <p>
              6.
              若因不可抗力、物流异常等非双方过错导致订单延误、损失，双方协商处理；涉及优惠券、余额抵扣等优惠权益，需遵循平台专项规则执行。
            </p>
          </div>
          <template #footer>
            <el-button @click="dialogVisible = false">关闭</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { computed } from 'vue'

const agreementAccepted = ref(false)
const dialogVisible = ref(false)
const handleAgreement = () => {
  agreementAccepted.value = !agreementAccepted.value
  emit('update:agreementAccepted', agreementAccepted.value)
}
const emit = defineEmits(['confirm-pay', 'update:agreementAccepted'])

const props = defineProps<{
  goods: Array<{
    price: number
    quantity: number
  }>
  shippingFee: number
  discount: number
}>()

const totalPrice = computed(() => {
  if (!props.goods || !Array.isArray(props.goods)) {
    return 0
  }
  return props.goods.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const actualPrice = computed(() => {
  return totalPrice.value + (props.shippingFee || 0) - (props.discount || 0)
})
</script>

<style scoped lang="scss">
.payment-methods {
  h4 {
    color: #1f2937;
    font-size: 16px;
    margin-bottom: 16px;
  }

  .payment-option {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
  }
}

.agreementAccepted {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}
</style>
