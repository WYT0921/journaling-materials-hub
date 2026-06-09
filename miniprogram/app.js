// app.js
App({
  onLaunch() {
    // 小程序启动时执行
    this.initUserStatus();
  },

  globalData: {
    userInfo: null,
    isPremium: false,
    baseUrl: 'https://your-api-domain.com/api' // 替换为实际API地址
  },

  /**
   * 初始化用户状态
   * 检查本地缓存中的用户信息和会员状态
   */
  initUserStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    const isPremium = wx.getStorageSync('isPremium');

    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isPremium = isPremium || false;
    }
  },

  /**
   * 设置用户信息
   * @param {Object} userInfo - 用户信息对象
   */
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  /**
   * 设置会员状态
   * @param {boolean} isPremium - 是否为会员
   */
  setPremiumStatus(isPremium) {
    this.globalData.isPremium = isPremium;
    wx.setStorageSync('isPremium', isPremium);
  },

  /**
   * 清除用户信息
   */
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.isPremium = false;
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('isPremium');
  }
});
