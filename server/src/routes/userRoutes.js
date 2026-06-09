// src/routes/userRoutes.js
// 用户路由

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

/**
 * @route POST /api/user/login
 * @desc 用户登录
 * @access Public
 */
router.post('/login', userController.login);

/**
 * @route GET /api/user/profile
 * @desc 获取用户信息
 * @access Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route PUT /api/user/profile
 * @desc 更新用户信息
 * @access Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route GET /api/user/premium-status
 * @desc 获取会员状态
 * @access Private
 */
router.get('/premium-status', authenticate, userController.getPremiumStatus);

/**
 * @route GET /api/user/stats
 * @desc 获取用户统计信息
 * @access Private
 */
router.get('/stats', authenticate, userController.getUserStats);

module.exports = router;
