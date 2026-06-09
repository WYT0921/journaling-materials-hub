// src/utils/database.js
// 数据库连接工具

const { Sequelize } = require('sequelize');
const config = require('../../config/database');
const { logger } = require('./logger');

// 获取环境配置
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// 创建Sequelize实例
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ? (msg) => logger.debug(msg) : false,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {},
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

/**
 * 测试数据库连接
 * @returns {Promise<boolean>} 连接是否成功
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    return true;
  } catch (err) {
    logger.error('数据库连接失败:', err);
    return false;
  }
};

/**
 * 同步数据库模型
 * @param {boolean} force - 是否强制同步（删除重建）
 * @returns {Promise<void>}
 */
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    logger.info('数据库模型同步成功');
  } catch (err) {
    logger.error('数据库模型同步失败:', err);
    throw err;
  }
};

/**
 * 关闭数据库连接
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('数据库连接已关闭');
  } catch (err) {
    logger.error('关闭数据库连接失败:', err);
    throw err;
  }
};

// 导出Sequelize实例和工具函数
module.exports = sequelize;
module.exports.testConnection = testConnection;
module.exports.syncModels = syncModels;
module.exports.closeConnection = closeConnection;
