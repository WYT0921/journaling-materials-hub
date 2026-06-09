// src/routes/downloadRoutes.js
// 下载路由

const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const { authenticate } = require('../middleware/auth');

/**
 * @route GET /api/download/:materialId
 * @desc 下载素材
 * @access Private
 */
router.get('/:materialId', authenticate, downloadController.download);

/**
 * @route GET /api/download/records
 * @desc 获取下载记录
 * @access Private
 */
router.get('/records', authenticate, downloadController.getDownloadRecords);

module.exports = router;
