// src/models/Material.js
// 素材模型

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

/**
 * 素材模型
 * 存储手账素材信息
 */
const Material = sequelize.define('Material', {
  // 素材ID
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  // 素材标题
  title: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '素材标题'
  },
  // 素材描述
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '素材描述'
  },
  // 原图URL
  imageUrl: {
    type: DataTypes.STRING(256),
    allowNull: false,
    field: 'image_url',
    comment: '原图URL'
  },
  // 缩略图URL
  thumbnailUrl: {
    type: DataTypes.STRING(256),
    allowNull: true,
    field: 'thumbnail_url',
    comment: '缩略图URL'
  },
  // 分类
  category: {
    type: DataTypes.STRING(32),
    allowNull: true,
    comment: '分类'
  },
  // 标签
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '标签'
  },
  // 是否为会员素材
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_premium',
    comment: '是否为会员素材'
  },
  // 下载次数
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'download_count',
    comment: '下载次数'
  },
  // 状态
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：0-下架，1-正常'
  },
  // 排序权重
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'sort_order',
    comment: '排序权重'
  }
}, {
  // 表名
  tableName: 'materials',
  // 时间戳
  timestamps: true,
  // 字段映射
  underscored: true,
  // 索引
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['is_premium']
    },
    {
      fields: ['status']
    },
    {
      fields: ['sort_order']
    }
  ]
});

/**
 * 类方法：获取素材列表
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 素材列表
 */
Material.getList = async function(options = {}) {
  const {
    page = 1,
    limit = 20,
    category = '',
    keyword = '',
    isPremium = null,
    status = 1
  } = options;

  const where = { status };

  // 分类筛选
  if (category) {
    where.category = category;
  }

  // 会员素材筛选
  if (isPremium !== null) {
    where.isPremium = isPremium;
  }

  // 关键词搜索
  if (keyword) {
    const { Op } = require('sequelize');
    where[Op.or] = [
      { title: { [Op.like]: `%${keyword}%` } },
      { description: { [Op.like]: `%${keyword}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await this.findAndCountAll({
    where,
    order: [['sort_order', 'DESC'], ['created_at', 'DESC']],
    limit,
    offset
  });

  return {
    total: count,
    page,
    limit,
    data: rows
  };
};

/**
 * 类方法：获取素材详情
 * @param {number} id - 素材ID
 * @returns {Promise<Material>} 素材实例
 */
Material.getDetail = async function(id) {
  const material = await this.findByPk(id);
  if (!material) {
    throw new Error('素材不存在');
  }
  return material;
};

/**
 * 类方法：搜索素材
 * @param {string} keyword - 搜索关键词
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 素材列表
 */
Material.search = async function(keyword, options = {}) {
  const { page = 1, limit = 20 } = options;

  const { Op } = require('sequelize');
  const where = {
    status: 1,
    [Op.or]: [
      { title: { [Op.like]: `%${keyword}%` } },
      { description: { [Op.like]: `%${keyword}%` } }
    ]
  };

  const offset = (page - 1) * limit;

  const { count, rows } = await this.findAndCountAll({
    where,
    order: [['download_count', 'DESC'], ['created_at', 'DESC']],
    limit,
    offset
  });

  return {
    total: count,
    page,
    limit,
    data: rows
  };
};

/**
 * 实例方法：增加下载次数
 */
Material.prototype.incrementDownloadCount = async function() {
  this.downloadCount += 1;
  await this.save();
};

module.exports = Material;
