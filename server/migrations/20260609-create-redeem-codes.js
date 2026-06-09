// migrations/20260609-create-redeem-codes.js
// 创建兑换码表

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('redeem_codes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: Sequelize.STRING(32),
        unique: true,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(16),
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      used_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      expire_time: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.addIndex('redeem_codes', ['code'], {
      unique: true,
      name: 'idx_redeem_codes_code'
    });

    await queryInterface.addIndex('redeem_codes', ['status'], {
      name: 'idx_redeem_codes_status'
    });

    await queryInterface.addIndex('redeem_codes', ['user_id'], {
      name: 'idx_redeem_codes_user_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('redeem_codes');
  }
};
