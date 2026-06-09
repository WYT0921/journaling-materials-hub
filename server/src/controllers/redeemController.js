// src/controllers/redeemController.js
// 兑换码控制器

const { RedeemCode, User } = require('../models');
const { logger } = require('../utils/logger');

/**
 * 验证兑换码
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.verify = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: {
          message: '请输入兑换码',
          statusCode: 400
        }
      });
    }

    // 验证兑换码
    const redeemCode = await RedeemCode.findOne({
      where: {
        code: code.trim().toUpperCase(),
        status: 0
      }
    });

    if (!redeemCode) {
      return res.json({
        success: true,
        data: {
          valid: false,
          message: '该兑换码已被使用或不存在'
        }
      });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        type: redeemCode.type,
        message: '兑换码有效'
      }
    });
  } catch (err) {
    logger.error('验证兑换码失败:', err);
    next(err);
  }
};

/**
 * 激活会员
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.activate = async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user.userId;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: {
          message: '请输入兑换码',
          statusCode: 400
        }
      });
    }

    // 获取用户
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: '用户不存在',
          statusCode: 404
        }
      });
    }

    // 使用兑换码
    const result = await RedeemCode.use(code.trim().toUpperCase(), userId);

    // 激活会员
    await user.activatePremium(result.type, getDurationByType(result.type));

    // 重新生成token（包含新的会员状态）
    const jwt = require('jsonwebtoken');
    const newToken = jwt.sign(
      {
        userId: user.id,
        openid: user.openid,
        isPremium: true
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        token: newToken,
        userInfo: {
          id: user.id,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          memberType: user.memberType,
          memberExpireTime: user.memberExpireTime,
          points: user.points,
          downloadCount: user.downloadCount
        },
        isPremium: true,
        expireTime: result.expireTime,
        message: '会员激活成功'
      }
    });
  } catch (err) {
    logger.error('激活会员失败:', err);

    // 处理特定错误
    if (err.message === '兑换码无效或已被使用') {
      return res.status(400).json({
        success: false,
        error: {
          message: err.message,
          statusCode: 400
        }
      });
    }

    next(err);
  }
};

/**
 * 根据会员类型获取时长（天）
 * @param {string} type - 会员类型
 * @returns {number} 时长（天）
 */
function getDurationByType(type) {
  const durationMap = {
    'monthly': 30,
    'yearly': 365,
    'permanent': 0
  };
  return durationMap[type] || 0;
}
