// src/models/RedeemCode.js
// 兑换码模型

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

/**
 * 兑换码模型
 * 存储会员兑换码信息
 */
const RedeemCode = sequelize.define('RedeemCode', {
  // 兑换码ID
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  // 兑换码
  code: {
    type: DataTypes.STRING(32),
    unique: true,
    allowNull: false,
    comment: '兑换码'
  },
  // 会员类型
  type: {
    type: DataTypes.STRING(16),
    allowNull: false,
    comment: '会员类型：monthly, yearly, permanent'
  },
  // 状态
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '状态：0-未使用，1-已使用'
  },
  // 使用者ID
  userId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'user_id',
    comment: '使用者ID'
  },
  // 使用时间
  usedTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'used_time',
    comment: '使用时间'
  },
  // 到期时间
  expireTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expire_time',
    comment: '到期时间'
  }
}, {
  // 表名
  tableName: 'redeem_codes',
  // 时间戳
  timestamps: true,
  // 字段映射
  underscored: true,
  // 索引
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['status']
    },
    {
      fields: ['user_id']
    }
  ]
});

/**
 * 类方法：验证兑换码
 * @param {string} code - 兑换码
 * @returns {Promise<RedeemCode>} 兑换码实例
 */
RedeemCode.validate = async function(code) {
  const redeemCode = await this.findOne({
    where: {
      code,
      status: 0
    }
  });

  if (!redeemCode) {
    throw new Error('兑换码无效或已被使用');
  }

  return redeemCode;
};

/**
 * 类方法：使用兑换码
 * @param {string} code - 兑换码
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 使用结果
 */
RedeemCode.use = async function(code, userId) {
  const redeemCode = await this.validate(code);

  // 计算到期时间
  let expireTime = null;
  const now = new Date();

  switch (redeemCode.type) {
    case 'monthly':
      expireTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      break;
    case 'yearly':
      expireTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      break;
    case 'permanent':
      expireTime = null;
      break;
    default:
      throw new Error('未知的会员类型');
  }

  // 更新兑换码状态
  redeemCode.status = 1;
  redeemCode.userId = userId;
  redeemCode.usedTime = now;
  redeemCode.expireTime = expireTime;
  await redeemCode.save();

  return {
    type: redeemCode.type,
    expireTime,
    usedTime: now
  };
};

/**
 * 类方法：生成兑换码
 * @param {string} type - 会员类型
 * @param {number} count - 生成数量
 * @returns {Promise<Array>} 生成的兑换码列表
 */
RedeemCode.generate = async function(type, count = 1) {
  const codes = [];
  const prefix = 'JM'; // 手账美学官专属前缀

  for (let i = 0; i < count; i++) {
    // 生成随机码
    const randomPart = generateRandomCode(8);
    const code = `${prefix}-${randomPart.substring(0, 4)}-${randomPart.substring(4, 8)}`;

    const redeemCode = await this.create({
      code,
      type,
      status: 0
    });

    codes.push(redeemCode);
  }

  return codes;
};

/**
 * 生成随机码
 * @param {number} length - 长度
 * @returns {string} 随机码
 */
function generateRandomCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = RedeemCode;
