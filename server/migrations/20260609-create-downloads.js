// migrations/20260609-create-downloads.js
// 创建下载记录表

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('downloads', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      material_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'materials',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      downloaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 添加索引
    await queryInterface.addIndex('downloads', ['user_id'], {
      name: 'idx_downloads_user_id'
    });

    await queryInterface.addIndex('downloads', ['material_id'], {
      name: 'idx_downloads_material_id'
    });

    await queryInterface.addIndex('downloads', ['downloaded_at'], {
      name: 'idx_downloads_downloaded_at'
    });

    // 添加唯一索引，防止重复下载记录
    await queryInterface.addIndex('downloads', ['user_id', 'material_id'], {
      unique: true,
      name: 'idx_downloads_user_material'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('downloads');
  }
};
