// src/models/User.js
// 用户模型

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

/**
 * 用户模型
 * 存储用户信息和会员状态
 */
const User = sequelize.define('User', {
  // 用户ID
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  // 微信openid
  openid: {
    type: DataTypes.STRING(64),
    unique: true,
    allowNull: false,
    comment: '微信openid'
  },
  // 用户昵称
  nickname: {
    type: DataTypes.STRING(64),
    allowNull: true,
    comment: '用户昵称'
  },
  // 用户头像URL
  avatarUrl: {
    type: DataTypes.STRING(256),
    allowNull: true,
    field: 'avatar_url',
    comment: '用户头像URL'
  },
  // 手机号
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '手机号'
  },
  // 会员类型
  memberType: {
    type: DataTypes.ENUM('normal', 'monthly', 'yearly', 'permanent'),
    defaultValue: 'normal',
    field: 'member_type',
    comment: '会员类型'
  },
  // 会员到期时间
  memberExpireTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'member_expire_time',
    comment: '会员到期时间'
  },
  // 积分
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '积分'
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
    comment: '状态：0-禁用，1-正常'
  }
}, {
  // 表名
  tableName: 'users',
  // 时间戳
  timestamps: true,
  // 字段映射
  underscored: true,
  // 索引
  indexes: [
    {
      unique: true,
      fields: ['openid']
    },
    {
      fields: ['member_type']
    },
    {
      fields: ['status']
    }
  ]
});

/**
 * 实例方法：检查是否为会员
 * @returns {boolean} 是否为会员
 */
User.prototype.isPremium = function() {
  if (this.memberType === 'permanent') {
    return true;
  }
  if (this.memberType === 'normal') {
    return false;
  }
  // 检查是否在有效期内
  return this.memberExpireTime && new Date() < this.memberExpireTime;
};

/**
 * 实例方法：获取会员类型文本
 * @returns {string} 会员类型文本
 */
User.prototype.getMemberTypeText = function() {
  const typeMap = {
    'normal': '普通用户',
    'monthly': '月度会员',
    'yearly': '年度会员',
    'permanent': '永久会员'
  };
  return typeMap[this.memberType] || '普通用户';
};

/**
 * 实例方法：激活会员
 * @param {string} type - 会员类型
 * @param {number} duration - 时长（天）
 */
User.prototype.activatePremium = async function(type, duration) {
  this.memberType = type;

  if (type !== 'permanent') {
    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + duration);
    this.memberExpireTime = expireTime;
  } else {
    this.memberExpireTime = null;
  }

  await this.save();
};

/**
 * 类方法：根据openid查找用户
 * @param {string} openid - 微信openid
 * @returns {Promise<User>} 用户实例
 */
User.findByOpenid = function(openid) {
  return this.findOne({ where: { openid } });
};

/**
 * 类方法：创建或更新用户
 * @param {string} openid - 微信openid
 * @param {Object} userInfo - 用户信息
 * @returns {Promise<User>} 用户实例
 */
User.findOrCreateByOpenid = async function(openid, userInfo = {}) {
  const [user, created] = await this.findOrCreate({
    where: { openid },
    defaults: {
      openid,
      nickname: userInfo.nickname || null,
      avatarUrl: userInfo.avatarUrl || null
    }
  });

  if (!created && userInfo) {
    // 更新用户信息
    if (userInfo.nickname) user.nickname = userInfo.nickname;
    if (userInfo.avatarUrl) user.avatarUrl = userInfo.avatarUrl;
    await user.save();
  }

  return user;
};

module.exports = User;
