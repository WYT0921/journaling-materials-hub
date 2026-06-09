// src/middleware/errorHandler.js
// 错误处理中间件

const { logger } = require('../utils/logger');

/**
 * 错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error('错误:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // 默认错误状态码
  let statusCode = err.statusCode || 500;
  let message = err.message || '服务器内部错误';

  // 处理特定类型的错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '请求参数验证失败';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = '未授权访问';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = '禁止访问';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = '资源不存在';
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = '数据库验证失败';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = '数据已存在';
  }

  // 构建错误响应
  const errorResponse = {
    success: false,
    error: {
      message: message,
      statusCode: statusCode,
      timestamp: new Date().toISOString()
    }
  };

  // 开发环境下添加错误堆栈
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // 发送错误响应
  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };
