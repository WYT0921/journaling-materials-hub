# 使用 Node.js 16 镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install --production

# 复制项目文件
COPY . .

# 创建日志目录
RUN mkdir -p logs

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "src/app.js"]
