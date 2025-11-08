# === 第一阶段：构建阶段（仅用于打包，最终不保留）===
#FROM registry.cn-hangzhou.aliyuncs.com/aliyun/node:22-alpine
FROM crpi-jparwx1rfzb928mh.cn-beijing.personal.cr.aliyuncs.com/pt-life-1/node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY public ./public
RUN npm ci
RUN npm run build  # 生成dist目录

# === 第二阶段：运行阶段（仅保留运行所需资源）===
FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app

 # 仅复制构建好的dist目录
COPY --from=builder /app/dist ./dist 
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard"]