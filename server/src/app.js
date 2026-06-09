// src/app.js
// 后端服务主应用文件

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/notFoundHandler');

// 导入路由
const userRoutes = require('./routes/userRoutes');
const materialRoutes = require('./routes/materialRoutes');
const redeemRoutes = require('./routes/redeemRoutes');
const downloadRoutes = require('./routes/downloadRoutes');

// 创建Express应用
const app = express();

// 设置端口
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});
app.use('/api/', limiter);

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API路由
app.use('/api/user', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/redeem', redeemRoutes);
app.use('/api/download', downloadRoutes);

// 404处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  logger.info(`服务器已启动，端口: ${PORT}`);
  logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  logger.error('未捕获的异常:', err);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的Promise拒绝:', reason);
});

module.exports = app;
