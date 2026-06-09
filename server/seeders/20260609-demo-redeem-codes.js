// seeders/20260609-demo-redeem-codes.js
// 创建示例兑换码数据

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('redeem_codes', [
      {
        code: 'JM-X8K4-PQ2N',
        type: 'monthly',
        status: 0,
        user_id: null,
        used_time: null,
        expire_time: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JM-A9B7-CD3E',
        type: 'yearly',
        status: 0,
        user_id: null,
        used_time: null,
        expire_time: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JM-F5G6-HI7J',
        type: 'permanent',
        status: 0,
        user_id: null,
        used_time: null,
        expire_time: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JM-K8L9-MN0O',
        type: 'monthly',
        status: 1,
        user_id: null,
        used_time: new Date(),
        expire_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('redeem_codes', null, {});
  }
};
