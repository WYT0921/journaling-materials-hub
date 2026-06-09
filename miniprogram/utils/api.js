// utils/api.js
// API请求封装

const app = getApp();

/**
 * 发起网络请求
 * @param {string} url - 请求路径
 * @param {string} method - 请求方法
 * @param {Object} data - 请求数据
 * @returns {Promise} 返回Promise对象
 */
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    const baseUrl = app.globalData.baseUrl;
    const fullUrl = `${baseUrl}${url}`;

    // 获取token
    const token = wx.getStorageSync('token');

    wx.request({
      url: fullUrl,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // token过期，清除用户信息
          app.clearUserInfo();
          reject(new Error('登录已过期，请重新登录'));
        } else {
          reject(new Error(res.data.message || '请求失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 用户登录
 * @param {string} code - 微信登录code
 * @returns {Promise} 返回用户信息和token
 */
const login = (code) => {
  return request('/user/login', 'POST', { code });
};

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
const getUserProfile = () => {
  return request('/user/profile');
};

/**
 * 获取会员状态
 * @returns {Promise} 返回会员状态
 */
const getPremiumStatus = () => {
  return request('/user/premium-status');
};

/**
 * 获取素材列表
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @param {string} category - 分类筛选
 * @param {string} keyword - 搜索关键词
 * @returns {Promise} 返回素材列表
 */
const getMaterials = (page = 1, limit = 20, category = '', keyword = '') => {
  const params = { page, limit };
  if (category) params.category = category;
  if (keyword) params.keyword = keyword;
  return request('/materials', 'GET', params);
};

/**
 * 获取素材详情
 * @param {number} id - 素材ID
 * @returns {Promise} 返回素材详情
 */
const getMaterialDetail = (id) => {
  return request(`/materials/${id}`);
};

/**
 * 搜索素材
 * @param {string} keyword - 搜索关键词
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Promise} 返回搜索结果
 */
const searchMaterials = (keyword, page = 1, limit = 20) => {
  return request('/materials/search', 'GET', { keyword, page, limit });
};

/**
 * 验证兑换码
 * @param {string} code - 兑换码
 * @returns {Promise} 返回验证结果
 */
const verifyRedeemCode = (code) => {
  return request('/redeem/verify', 'POST', { code });
};

/**
 * 激活会员
 * @param {string} code - 兑换码
 * @returns {Promise} 返回激活结果
 */
const activatePremium = (code) => {
  return request('/redeem/activate', 'POST', { code });
};

/**
 * 下载素材
 * @param {number} materialId - 素材ID
 * @returns {Promise} 返回下载信息
 */
const downloadMaterial = (materialId) => {
  return request(`/download/${materialId}`);
};

module.exports = {
  request,
  login,
  getUserProfile,
  getPremiumStatus,
  getMaterials,
  getMaterialDetail,
  searchMaterials,
  verifyRedeemCode,
  activatePremium,
  downloadMaterial
};
