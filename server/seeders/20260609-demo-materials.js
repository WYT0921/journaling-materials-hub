// seeders/20260609-demo-materials.js
// 创建示例素材数据

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('materials', [
      {
        title: '治愈系猫咪贴纸',
        description: '可爱的猫咪手账贴纸，适合日常记录',
        image_url: 'https://example.com/materials/cat-sticker-1.png',
        thumbnail_url: 'https://example.com/materials/cat-sticker-1-thumb.png',
        category: '治愈系',
        tags: JSON.stringify(['猫咪', '贴纸', '可爱']),
        is_premium: false,
        download_count: 156,
        status: 1,
        sort_order: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '极简风日程模板',
        description: '简洁的日程规划模板，提升效率',
        image_url: 'https://example.com/materials/minimal-schedule.png',
        thumbnail_url: 'https://example.com/materials/minimal-schedule-thumb.png',
        category: '极简风',
        tags: JSON.stringify(['日程', '模板', '极简']),
        is_premium: false,
        download_count: 234,
        status: 1,
        sort_order: 90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '复古花卉胶带',
        description: '复古风格的花卉图案胶带素材',
        image_url: 'https://example.com/materials/vintage-floral-tape.png',
        thumbnail_url: 'https://example.com/materials/vintage-floral-tape-thumb.png',
        category: '胶带',
        tags: JSON.stringify(['复古', '花卉', '胶带']),
        is_premium: true,
        download_count: 89,
        status: 1,
        sort_order: 80,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '透明PNG花朵素材',
        description: '高清透明背景的花朵PNG素材',
        image_url: 'https://example.com/materials/flower-png.png',
        thumbnail_url: 'https://example.com/materials/flower-png-thumb.png',
        category: 'PNG',
        tags: JSON.stringify(['花朵', 'PNG', '透明背景']),
        is_premium: true,
        download_count: 312,
        status: 1,
        sort_order: 70,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '可爱云朵贴纸',
        description: '软萌的云朵造型贴纸',
        image_url: 'https://example.com/materials/cute-cloud.png',
        thumbnail_url: 'https://example.com/materials/cute-cloud-thumb.png',
        category: '治愈系',
        tags: JSON.stringify(['云朵', '贴纸', '软萌']),
        is_premium: false,
        download_count: 178,
        status: 1,
        sort_order: 60,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '手写字体合集',
        description: '精选手写字体，适合手账标题',
        image_url: 'https://example.com/materials/handwriting-fonts.png',
        thumbnail_url: 'https://example.com/materials/handwriting-fonts-thumb.png',
        category: '极简风',
        tags: JSON.stringify(['字体', '手写', '标题']),
        is_premium: true,
        download_count: 267,
        status: 1,
        sort_order: 50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '和风胶带素材',
        description: '日式和风图案胶带',
        image_url: 'https://example.com/materials/japanese-tape.png',
        thumbnail_url: 'https://example.com/materials/japanese-tape-thumb.png',
        category: '胶带',
        tags: JSON.stringify(['和风', '日式', '胶带']),
        is_premium: false,
        download_count: 145,
        status: 1,
        sort_order: 40,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '星空PNG素材',
        description: '梦幻星空透明背景素材',
        image_url: 'https://example.com/materials/starry-sky.png',
        thumbnail_url: 'https://example.com/materials/starry-sky-thumb.png',
        category: 'PNG',
        tags: JSON.stringify(['星空', '梦幻', 'PNG']),
        is_premium: true,
        download_count: 198,
        status: 1,
        sort_order: 30,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('materials', null, {});
  }
};
