<template>
   <div  class="loading-state">
    <i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i>
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
// 定义props
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...'
})
</script>

<style>
.loading-state {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.loading-state i {
  font-size: 30px;
  margin-bottom: 15px;
  color: #fd9860;
}
</style>