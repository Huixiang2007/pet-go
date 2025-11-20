<template>
     <footer class="bg-[#333333] text-white py-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center mb-4">
            <i class="fa fa-paw text-[#FF7043] text-2xl mr-2"></i>
            <h3 class="text-xl font-bold">萌宠之家</h3>
          </div>
          <p class="text-gray-400 text-sm">专注宠物健康生活，提供优质用品与服务</p>
        </div>

        <div>
          <h4 class="font-medium mb-4">快速链接</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-[#FF7043] transition-colors">首页</a></li>
            <li><a href="#" class="hover:text-[#FF7043] transition-colors">全部商品</a></li>
            <li><a href="#" class="hover:text-[#FF7043] transition-colors">优惠活动</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium mb-4">客户服务</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-[#FF7043] transition-colors">配送信息</a></li>
            <li><a href="#" class="hover:text-[#FF7043] transition-colors">退换政策</a></li>
            <li><a href="#" class="hover:text-[#FF7043] transition-colors">常见问题</a></li>
            <li><a href="#" class="hover:text-[#FF7043] transition-colors">联系我们</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium mb-4">联系我们</h4>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-center">
              <i class="fa fa-phone w-5 text-[#FF7043]"></i>
              <span>400-123-4567</span>
            </li>
            <li class="flex items-center">
              <i class="fa fa-envelope w-5 text-[#FF7043]"></i>
              <span>service@petshop.com</span>
            </li>
            <li class="flex items-center">
              <i class="fa fa-map-marker w-5 text-[#FF7043]"></i>
              <span>北京市朝阳区XX大厦</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
        <p>© 2023 萌宠之家 版权所有 | 京ICP备12345678号</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">

export default {
  name: 'ShopFoot',
}
</script>
<style>

</style>
