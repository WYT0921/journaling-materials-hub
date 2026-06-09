// migrations/20260609-create-materials.js
// 创建素材表

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('materials', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      thumbnail_url: {
        type: Sequelize.STRING(256),
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(32),
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true
      },
      is_premium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      download_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.addIndex('materials', ['category'], {
      name: 'idx_materials_category'
    });

    await queryInterface.addIndex('materials', ['is_premium'], {
      name: 'idx_materials_is_premium'
    });

    await queryInterface.addIndex('materials', ['status'], {
      name: 'idx_materials_status'
    });

    await queryInterface.addIndex('materials', ['sort_order'], {
      name: 'idx_materials_sort_order'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('materials');
  }
};
