// src/models/index.js
// 模型索引文件

const sequelize = require('../utils/database');
const User = require('./User');
const Material = require('./Material');
const RedeemCode = require('./RedeemCode');
const Download = require('./Download');

// 定义模型关联关系

// 用户和下载记录的关系
User.hasMany(Download, {
  foreignKey: 'user_id',
  as: 'downloads'
});
Download.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// 素材和下载记录的关系
Material.hasMany(Download, {
  foreignKey: 'material_id',
  as: 'downloads'
});
Download.belongsTo(Material, {
  foreignKey: 'material_id',
  as: 'material'
});

// 用户和兑换码的关系
User.hasMany(RedeemCode, {
  foreignKey: 'user_id',
  as: 'redeemCodes'
});
RedeemCode.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// 导出所有模型
module.exports = {
  sequelize,
  User,
  Material,
  RedeemCode,
  Download
};
