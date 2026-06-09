// src/middleware/auth.js
// 认证中间件

const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

/**
 * 认证中间件
 * 验证JWT token
 */
const authenticate = (req, res, next) => {
  try {
    // 获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: '未提供认证token',
          statusCode: 401
        }
      });
    }

    const token = authHeader.split(' ')[1];

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 将用户信息添加到请求对象
    req.user = decoded;

    next();
  } catch (err) {
    logger.error('认证失败:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'token已过期',
          statusCode: 401
        }
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          message: '无效的token',
          statusCode: 401
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: '认证失败',
        statusCode: 500
      }
    });
  }
};

/**
 * 可选认证中间件
 * 如果有token则验证，没有则继续
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    next();
  } catch (err) {
    // 忽略认证错误，继续处理请求
    next();
  }
};

/**
 * 会员权限中间件
 * 验证用户是否为会员
 */
const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        message: '未认证',
        statusCode: 401
      }
    });
  }

  if (!req.user.isPremium) {
    return res.status(403).json({
      success: false,
      error: {
        message: '需要会员权限',
        statusCode: 403
      }
    });
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requirePremium
};
