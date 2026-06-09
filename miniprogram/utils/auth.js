// utils/auth.js
// 认证相关工具函数

const api = require('./api');
const app = getApp();

/**
 * 微信登录
 * @returns {Promise} 返回登录结果
 */
const wxLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送code到后端换取token
          api.login(res.code)
            .then((data) => {
              // 保存token
              wx.setStorageSync('token', data.token);
              // 保存用户信息
              app.setUserInfo(data.userInfo);
              // 保存会员状态
              app.setPremiumStatus(data.isPremium);
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(new Error('微信登录失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 检查登录状态
 * @returns {boolean} 是否已登录
 */
const isLoggedIn = () => {
  const token = wx.getStorageSync('token');
  const userInfo = app.globalData.userInfo;
  return !!(token && userInfo);
};

/**
 * 检查会员状态
 * @returns {boolean} 是否为会员
 */
const isPremium = () => {
  return app.globalData.isPremium || false;
};

/**
 * 确保已登录
 * 如果未登录则执行登录
 * @returns {Promise} 返回登录结果
 */
const ensureLogin = () => {
  return new Promise((resolve, reject) => {
    if (isLoggedIn()) {
      resolve(app.globalData.userInfo);
    } else {
      wxLogin()
        .then((data) => {
          resolve(data.userInfo);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    if (app.globalData.userInfo) {
      resolve(app.globalData.userInfo);
    } else {
      api.getUserProfile()
        .then((data) => {
          app.setUserInfo(data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

/**
 * 刷新会员状态
 * @returns {Promise} 返回会员状态
 */
const refreshPremiumStatus = () => {
  return new Promise((resolve, reject) => {
    api.getPremiumStatus()
      .then((data) => {
        app.setPremiumStatus(data.isPremium);
        resolve(data.isPremium);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 退出登录
 */
const logout = () => {
  wx.removeStorageSync('token');
  app.clearUserInfo();
};

module.exports = {
  wxLogin,
  isLoggedIn,
  isPremium,
  ensureLogin,
  getUserInfo,
  refreshPremiumStatus,
  logout
};
