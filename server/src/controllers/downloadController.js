// src/controllers/downloadController.js
// 下载控制器

const { Material, Download, User } = require('../models');
const { logger } = require('../utils/logger');

/**
 * 下载素材
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.download = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const userId = req.user.userId;

    // 获取素材信息
    const material = await Material.findByPk(materialId);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: '素材不存在',
          statusCode: 404
        }
      });
    }

    // 检查会员权限
    if (material.isPremium) {
      const user = await User.findByPk(userId);

      if (!user || !user.isPremium()) {
        return res.status(403).json({
          success: false,
          error: {
            message: '需要会员权限才能下载此素材',
            statusCode: 403
          }
        });
      }
    }

    // 记录下载
    await Download.record(userId, materialId);

    // 增加素材下载次数
    await material.incrementDownloadCount();

    // 增加用户下载次数
    const user = await User.findByPk(userId);
    if (user) {
      user.downloadCount += 1;
      await user.save();
    }

    // 返回下载链接
    res.json({
      success: true,
      data: {
        url: material.imageUrl,
        filename: `${material.title}.png`,
        message: '下载成功'
      }
    });
  } catch (err) {
    logger.error('下载素材失败:', err);
    next(err);
  }
};

/**
 * 获取下载记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getDownloadRecords = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    // 获取下载记录
    const result = await Download.getUserDownloads(userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    logger.error('获取下载记录失败:', err);
    next(err);
  }
};
