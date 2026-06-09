// src/models/Download.js
// 下载记录模型

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

/**
 * 下载记录模型
 * 存储用户下载素材的记录
 */
const Download = sequelize.define('Download', {
  // 下载记录ID
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户ID
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'user_id',
    comment: '用户ID'
  },
  // 素材ID
  materialId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'material_id',
    comment: '素材ID'
  },
  // 下载时间
  downloadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'downloaded_at',
    comment: '下载时间'
  }
}, {
  // 表名
  tableName: 'downloads',
  // 时间戳
  timestamps: false,
  // 字段映射
  underscored: true,
  // 索引
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['material_id']
    },
    {
      fields: ['downloaded_at']
    },
    {
      unique: true,
      fields: ['user_id', 'material_id']
    }
  ]
});

/**
 * 类方法：记录下载
 * @param {number} userId - 用户ID
 * @param {number} materialId - 素材ID
 * @returns {Promise<Download>} 下载记录实例
 */
Download.record = async function(userId, materialId) {
  // 检查是否已下载过
  const existing = await this.findOne({
    where: {
      userId,
      materialId
    }
  });

  if (existing) {
    // 更新下载时间
    existing.downloadedAt = new Date();
    await existing.save();
    return existing;
  }

  // 创建新的下载记录
  return await this.create({
    userId,
    materialId,
    downloadedAt: new Date()
  });
};

/**
 * 类方法：获取用户下载记录
 * @param {number} userId - 用户ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 下载记录列表
 */
Download.getUserDownloads = async function(userId, options = {}) {
  const { page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;

  const { count, rows } = await this.findAndCountAll({
    where: { userId },
    include: [
      {
        model: sequelize.models.Material,
        as: 'material',
        attributes: ['id', 'title', 'thumbnailUrl', 'category']
      }
    ],
    order: [['downloaded_at', 'DESC']],
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
 * 类方法：检查用户是否下载过素材
 * @param {number} userId - 用户ID
 * @param {number} materialId - 素材ID
 * @returns {Promise<boolean>} 是否下载过
 */
Download.hasDownloaded = async function(userId, materialId) {
  const count = await this.count({
    where: {
      userId,
      materialId
    }
  });
  return count > 0;
};

/**
 * 类方法：获取素材下载次数
 * @param {number} materialId - 素材ID
 * @returns {Promise<number>} 下载次数
 */
Download.getDownloadCount = async function(materialId) {
  return await this.count({
    where: { materialId }
  });
};

module.exports = Download;
