// migrations/20260609-create-users.js
// 创建用户表

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      openid: {
        type: Sequelize.STRING(64),
        unique: true,
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(64),
        allowNull: true
      },
      avatar_url: {
        type: Sequelize.STRING(256),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      member_type: {
        type: Sequelize.ENUM('normal', 'monthly', 'yearly', 'permanent'),
        defaultValue: 'normal'
      },
      member_expire_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      download_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 添加索引
    await queryInterface.addIndex('users', ['openid'], {
      unique: true,
      name: 'idx_users_openid'
    });

    await queryInterface.addIndex('users', ['member_type'], {
      name: 'idx_users_member_type'
    });

    await queryInterface.addIndex('users', ['status'], {
      name: 'idx_users_status'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
