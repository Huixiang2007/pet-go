# PetGo -宠物之家

基于 Vue3 + TypeScript + Element Plus + Tailwind CSS 开发的宠物综合服务平台，聚焦 “宠物寄养”“宠物电商”“宠物旅游” 三大核心板块，提供响应式交互体验与高效的宠物服务管理功能。

# 快速开始

环境要求
Node.js ≥ 16.x
npm ≥ 7.x 或 pnpm ≥ 6.x
浏览器支持：Chrome ≥ 88、Edge ≥ 88、Safari ≥ 15、Firefox ≥ 85

# 安装与运行

bash

# 克隆仓库

git clone https://codeup.aliyun.com/6906a8a3876b90de1aac0b9e/pet-go-web.git

# 进入项目目录

cd pet-go-web

# 安装依赖（推荐pnpm，速度更快）

npm install

# 或 pnpm install

# 或 yarn install

# 本地开发环境（默认端口：3000）

npm run dev

# 构建生产环境（输出到dist目录）

npm run build

# 预览生产构建结果

npm run preview

# 技术栈

核心框架：Vue3 + TypeScript
UI 组件库：Element Plus
样式解决方案：Tailwind CSS
构建工具：Vite
图标支持：Element Plus Icons

# 提交规范

1. Type（提交类型）
   feat：新功能（如：feat (mall): 新增宠物商品列表组件）
   fix：修复 bug（如：fix (form): 修复宠物信息提交验证失效问题）
   docs：文档更新（如：docs (readme): 补充分支命名规范）
   style：代码格式调整（不影响功能，如：style (navbar): 优化导航栏样式）
   refactor：代码重构（不新增功能也不修复 bug，如：refactor (pet-card): 重构宠物卡片组件逻辑）
   test：添加 / 修改测试用例（如：test (pet-form): 补充表单验证测试）
   chore：构建流程 / 依赖管理调整（如：chore (deps): 更新 Element Plus 到 2.4.0 版本）
2. Scope（影响范围）
   可选，指定提交影响的模块，如：navbar、pet-form、mall、travel 等
