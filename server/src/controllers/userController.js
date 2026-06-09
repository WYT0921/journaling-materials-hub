// src/controllers/userController.js
// 用户控制器

const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User, Download } = require('../models');
const { logger } = require('../utils/logger');

/**
 * 用户登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.login = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: {
          message: '缺少登录code',
          statusCode: 400
        }
      });
    }

    // 调用微信接口获取openid
    const wechatResult = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key } = wechatResult.data;

    if (!openid) {
      return res.status(400).json({
        success: false,
        error: {
          message: '微信登录失败',
          statusCode: 400
        }
      });
    }

    // 查找或创建用户
    const user = await User.findOrCreateByOpenid(openid);

    // 生成JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        openid: user.openid,
        isPremium: user.isPremium()
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 返回用户信息和token
    res.json({
      success: true,
      data: {
        token,
        userInfo: {
          id: user.id,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          memberType: user.memberType,
          memberExpireTime: user.memberExpireTime,
          points: user.points,
          downloadCount: user.downloadCount
        },
        isPremium: user.isPremium()
      }
    });
  } catch (err) {
    logger.error('用户登录失败:', err);
    next(err);
  }
};

/**
 * 获取用户信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

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

    res.json({
      success: true,
      data: {
        id: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        memberType: user.memberType,
        memberExpireTime: user.memberExpireTime,
        points: user.points,
        downloadCount: user.downloadCount
      }
    });
  } catch (err) {
    logger.error('获取用户信息失败:', err);
    next(err);
  }
};

/**
 * 更新用户信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { nickname, avatarUrl, phone } = req.body;

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

    // 更新用户信息
    if (nickname) user.nickname = nickname;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      data: {
        id: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        phone: user.phone
      }
    });
  } catch (err) {
    logger.error('更新用户信息失败:', err);
    next(err);
  }
};

/**
 * 获取会员状态
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getPremiumStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

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

    res.json({
      success: true,
      data: {
        isPremium: user.isPremium(),
        memberType: user.memberType,
        memberExpireTime: user.memberExpireTime,
        memberTypeText: user.getMemberTypeText()
      }
    });
  } catch (err) {
    logger.error('获取会员状态失败:', err);
    next(err);
  }
};

/**
 * 获取用户统计信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

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

    // 获取下载次数
    const downloadCount = await Download.count({
      where: { user_id: userId }
    });

    // 获取收藏次数（这里暂时用下载次数代替，实际应该有收藏表）
    const collectionCount = downloadCount;

    res.json({
      success: true,
      data: {
        points: user.points,
        downloadCount,
        collectionCount
      }
    });
  } catch (err) {
    logger.error('获取用户统计信息失败:', err);
    next(err);
  }
};
