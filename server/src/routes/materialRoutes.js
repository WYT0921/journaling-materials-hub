// src/routes/materialRoutes.js
// 素材路由

const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { authenticate, optionalAuth } = require('../middleware/auth');

/**
 * @route GET /api/materials
 * @desc 获取素材列表
 * @access Public
 */
router.get('/', optionalAuth, materialController.getList);

/**
 * @route GET /api/materials/search
 * @desc 搜索素材
 * @access Public
 */
router.get('/search', optionalAuth, materialController.search);

/**
 * @route GET /api/materials/categories
 * @desc 获取素材分类
 * @access Public
 */
router.get('/categories', materialController.getCategories);

/**
 * @route GET /api/materials/:id
 * @desc 获取素材详情
 * @access Public
 */
router.get('/:id', optionalAuth, materialController.getDetail);

module.exports = router;
