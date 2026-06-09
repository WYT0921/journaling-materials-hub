// src/routes/redeemRoutes.js
// 兑换码路由

const express = require('express');
const router = express.Router();
const redeemController = require('../controllers/redeemController');
const { authenticate } = require('../middleware/auth');

/**
 * @route POST /api/redeem/verify
 * @desc 验证兑换码
 * @access Private
 */
router.post('/verify', authenticate, redeemController.verify);

/**
 * @route POST /api/redeem/activate
 * @desc 激活会员
 * @access Private
 */
router.post('/activate', authenticate, redeemController.activate);

module.exports = router;
