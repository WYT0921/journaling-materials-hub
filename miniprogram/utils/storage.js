// utils/storage.js
// 本地存储工具函数

/**
 * 设置存储数据
 * @param {string} key - 存储键名
 * @param {*} value - 存储值
 */
const set = (key, value) => {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    console.error('存储数据失败:', e);
  }
};

/**
 * 获取存储数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储值
 */
const get = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key);
    return value || defaultValue;
  } catch (e) {
    console.error('获取数据失败:', e);
    return defaultValue;
  }
};

/**
 * 删除存储数据
 * @param {string} key - 存储键名
 */
const remove = (key) => {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    console.error('删除数据失败:', e);
  }
};

/**
 * 清空所有存储数据
 */
const clear = () => {
  try {
    wx.clearStorageSync();
  } catch (e) {
    console.error('清空数据失败:', e);
  }
};

/**
 * 获取存储信息
 * @returns {Object} 存储信息
 */
const getInfo = () => {
  try {
    return wx.getStorageInfoSync();
  } catch (e) {
    console.error('获取存储信息失败:', e);
    return {};
  }
};

/**
 * 设置带过期时间的存储数据
 * @param {string} key - 存储键名
 * @param {*} value - 存储值
 * @param {number} expire - 过期时间（毫秒）
 */
const setWithExpire = (key, value, expire) => {
  const data = {
    value: value,
    expire: Date.now() + expire
  };
  set(key, data);
};

/**
 * 获取带过期时间的存储数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储值
 */
const getWithExpire = (key, defaultValue = null) => {
  const data = get(key);
  if (!data) return defaultValue;

  // 检查是否过期
  if (data.expire && Date.now() > data.expire) {
    remove(key);
    return defaultValue;
  }

  return data.value;
};

/**
 * 缓存素材列表
 * @param {string} key - 缓存键名
 * @param {Array} list - 素材列表
 * @param {number} expire - 过期时间（默认5分钟）
 */
const cacheMaterialList = (key, list, expire = 5 * 60 * 1000) => {
  setWithExpire(`materials_${key}`, list, expire);
};

/**
 * 获取缓存的素材列表
 * @param {string} key - 缓存键名
 * @returns {Array} 素材列表
 */
const getCachedMaterialList = (key) => {
  return getWithExpire(`materials_${key}`, []);
};

/**
 * 缓存用户信息
 * @param {Object} userInfo - 用户信息
 */
const cacheUserInfo = (userInfo) => {
  set('userInfo', userInfo);
};

/**
 * 获取缓存的用户信息
 * @returns {Object} 用户信息
 */
const getCachedUserInfo = () => {
  return get('userInfo');
};

module.exports = {
  set,
  get,
  remove,
  clear,
  getInfo,
  setWithExpire,
  getWithExpire,
  cacheMaterialList,
  getCachedMaterialList,
  cacheUserInfo,
  getCachedUserInfo
};
