FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./

RUN npm ci

COPY . .

RUN npm run build

# 安装并使用 serve
RUN npm install -g serve

EXPOSE 3000

# 使用 serve 运行，明确指定主机
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard"]