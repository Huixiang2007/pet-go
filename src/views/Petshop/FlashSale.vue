<template>
  <NavBar />
  <div class="bg-gradient-to-b from-orange-50 to-yellow-50 min-h-screen pt-16">
    <header class="relative overflow-hidden">
      <div class="bg-gradient-to-r from-orange-500 to-red-500 py-5 shadow-lg">
        <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">

          <div class="flex items-center mb-3 md:mb-0">
            <i class="fa fa-bolt-lightning text-white text-2xl mr-3 animate-pulse"></i>
            <h1 class="text-2xl md:text-3xl font-bold text-white">限时秒杀</h1>
            <span class="ml-3 bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              低至3折
            </span>
          </div>

          <!-- 倒计时 -->
          <div class="flex flex-col items-center md:items-end">
            <p class="text-white text-sm md:text-base mb-1 flex items-center">
              <i class="fa fa-clock-o mr-1"></i> 活动结束倒计时
            </p>
            <div class="flex gap-2 items-center">
              <div class="countdown-item">00</div>
              <span class="text-white text-lg font-bold">:</span>
              <div class="countdown-item">00</div>
              <span class="text-white text-lg font-bold">:</span>
              <div class="countdown-item">00</div>
              <span class="text-white text-lg font-bold">:</span>
              <div class="countdown-item">00</div>
            </div>
          </div>

        </div>
      </div>
      <div class="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400"></div>
    </header>

    <main class="mx-auto px-12 py-8">
      <div class="mb-4 text-center md:text-left">
        <h2 class="text-2xl md:text-2.5xl font-bold text-gray-800 flex items-center justify-center md:justify-start">
          <span class="inline-block w-3 h-8 bg-red-500 rounded-full mr-3"></span>
          热门秒杀商品
        </h2>
        <p class="text-sm text-gray-500 mt-2 flex items-center justify-center md:justify-start">
          机不可失，时不再来！冲啊！
          <i class="fa fa-hourglass-half text-red-500 ml-1 animate-pulse"></i>
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-4 md:p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        <FlashSaleProduct />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}
.countdown-item {
  display: inline-block;
  width: 24px;
  height: 24px;
  font-weight: bold;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background-color: #fff;
  color: #333;
  font-size: 12px;
  margin-right: 2px;
}
</style>
