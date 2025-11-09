<template>
  <div class="demo-container p-4">
    <!-- 按钮组件 -->
    <el-button type="primary">
      <Search />
      <!-- 图标组件（已全局注册） -->
      搜索宠物
    </el-button>

    <!-- 输入框组件 -->
    <el-input placeholder="请输入宠物名称" class="mt-3 w-64" />

    <!-- 下拉选择组件 -->
    <el-select placeholder="选择宠物类型" class="mt-3 w-64">
      <el-option label="狗狗" value="dog" />
      <el-option label="猫咪" value="cat" />
      <el-option label="其他" value="other" />
    </el-select>
  </div>
</template>

<script  lang="ts">
import { ref } from 'vue'
// 按需引入图标（如果全局注册了可省略）
import { Search } from '@element-plus/icons-vue'
// 按需引入工具函数（如消息提示，按需引入时由插件自动导入）
// import { ElMessage } from 'element-plus'
export default {
  name: 'ElementPlus',
  setup() {
    return {
      Search,
    }
  },
}
</script>

<style scoped>
</style>