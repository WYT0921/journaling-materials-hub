// src/middleware/notFoundHandler.js
// 404处理中间件

/**
 * 404处理中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: '请求的资源不存在',
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.url
    }
  });
};

module.exports = { notFoundHandler };
