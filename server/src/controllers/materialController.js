// src/controllers/materialController.js
// 素材控制器

const { Material } = require('../models');
const { logger } = require('../utils/logger');

/**
 * 获取素材列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getList = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category = '',
      keyword = ''
    } = req.query;

    // 检查用户是否为会员
    const isPremium = req.user ? req.user.isPremium : false;

    // 构建查询选项
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      keyword
    };

    // 获取素材列表
    const result = await Material.getList(options);

    // 处理素材数据，根据会员状态返回不同内容
    const processedData = result.data.map(material => {
      const materialData = material.toJSON();

      // 非会员看不到高清图
      if (materialData.isPremium && !isPremium) {
        materialData.imageUrl = materialData.thumbnailUrl || materialData.imageUrl;
        materialData.isBlurred = true;
      } else {
        materialData.isBlurred = false;
      }

      return materialData;
    });

    res.json({
      success: true,
      data: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        data: processedData
      }
    });
  } catch (err) {
    logger.error('获取素材列表失败:', err);
    next(err);
  }
};

/**
 * 获取素材详情
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 检查用户是否为会员
    const isPremium = req.user ? req.user.isPremium : false;

    // 获取素材详情
    const material = await Material.getDetail(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: '素材不存在',
          statusCode: 404
        }
      });
    }

    const materialData = material.toJSON();

    // 非会员看不到高清图
    if (materialData.isPremium && !isPremium) {
      materialData.imageUrl = materialData.thumbnailUrl || materialData.imageUrl;
      materialData.isBlurred = true;
    } else {
      materialData.isBlurred = false;
    }

    res.json({
      success: true,
      data: materialData
    });
  } catch (err) {
    logger.error('获取素材详情失败:', err);
    next(err);
  }
};

/**
 * 搜索素材
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.search = async (req, res, next) => {
  try {
    const {
      keyword = '',
      page = 1,
      limit = 20
    } = req.query;

    if (!keyword.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          message: '搜索关键词不能为空',
          statusCode: 400
        }
      });
    }

    // 检查用户是否为会员
    const isPremium = req.user ? req.user.isPremium : false;

    // 搜索素材
    const result = await Material.search(keyword, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // 处理素材数据
    const processedData = result.data.map(material => {
      const materialData = material.toJSON();

      if (materialData.isPremium && !isPremium) {
        materialData.imageUrl = materialData.thumbnailUrl || materialData.imageUrl;
        materialData.isBlurred = true;
      } else {
        materialData.isBlurred = false;
      }

      return materialData;
    });

    res.json({
      success: true,
      data: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        data: processedData
      }
    });
  } catch (err) {
    logger.error('搜索素材失败:', err);
    next(err);
  }
};

/**
 * 获取素材分类
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getCategories = async (req, res, next) => {
  try {
    // 从数据库获取所有分类
    const categories = await Material.findAll({
      attributes: [
        'category',
        [Material.sequelize.fn('COUNT', Material.sequelize.col('id')), 'count']
      ],
      where: { status: 1 },
      group: ['category'],
      order: [[Material.sequelize.fn('COUNT', Material.sequelize.col('id')), 'DESC']]
    });

    // 格式化分类数据
    const formattedCategories = categories.map(item => ({
      name: item.category,
      count: parseInt(item.getDataValue('count'))
    })).filter(item => item.name); // 过滤掉空分类

    res.json({
      success: true,
      data: formattedCategories
    });
  } catch (err) {
    logger.error('获取素材分类失败:', err);
    next(err);
  }
};
