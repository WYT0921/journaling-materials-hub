// pages/profile/profile.js
// 我的页面逻辑

const api = require('../../utils/api');
const auth = require('../../utils/auth');

Page({
  data: {
    // 用户信息
    userInfo: null,
    // 是否已登录
    isLoggedIn: false,
    // 是否为会员
    isPremium: false,
    // 会员类型文本
    memberTypeText: '',
    // 会员到期时间
    memberExpireTime: '',
    // 用户统计信息
    userStats: {
      points: 0,
      downloadCount: 0,
      collectionCount: 0
    },
    // 是否显示兑换弹窗
    showRedeemModal: false,
    // 兑换码
    redeemCode: '',
    // 兑换码错误
    redeemError: false,
    // 是否显示成功弹窗
    showSuccessModal: false,
    // 新会员到期时间
    newMemberExpireTime: '',
    // 是否显示Toast
    showToast: false,
    // Toast文本
    toastText: ''
  },

  onLoad() {
    // 页面加载时执行
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshUserData();
  },

  /**
   * 刷新用户数据
   */
  async refreshUserData() {
    // 检查登录状态
    const isLoggedIn = auth.isLoggedIn();
    this.setData({ isLoggedIn });

    if (isLoggedIn) {
      // 获取用户信息
      try {
        const userInfo = await auth.getUserInfo();
        this.setData({ userInfo });

        // 更新会员状态
        this.updateMemberStatus();

        // 获取用户统计信息
        this.loadUserStats();
      } catch (err) {
        console.error('获取用户信息失败:', err);
      }
    }
  },

  /**
   * 更新会员状态
   */
  updateMemberStatus() {
    const isPremium = auth.isPremium();
    this.setData({ isPremium });

    if (isPremium) {
      // 获取会员信息
      const userInfo = this.data.userInfo;
      if (userInfo) {
        this.setData({
          memberTypeText: this.getMemberTypeText(userInfo.memberType),
          memberExpireTime: this.formatExpireTime(userInfo.memberExpireTime)
        });
      }
    }
  },

  /**
   * 获取会员类型文本
   * @param {string} type - 会员类型
   * @returns {string} 会员类型文本
   */
  getMemberTypeText(type) {
    const typeMap = {
      'monthly': '月度会员',
      'yearly': '年度会员',
      'permanent': '永久会员'
    };
    return typeMap[type] || 'VIP会员';
  },

  /**
   * 格式化到期时间
   * @param {string} time - 到期时间
   * @returns {string} 格式化后的时间
   */
  formatExpireTime(time) {
    if (!time) return '永久';
    const date = new Date(time);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  /**
   * 加载用户统计信息
   */
  async loadUserStats() {
    try {
      // 这里应该调用API获取用户统计信息
      // const stats = await api.getUserStats();
      // this.setData({ userStats: stats });

      // 临时使用模拟数据
      this.setData({
        userStats: {
          points: 120,
          downloadCount: 15,
          collectionCount: 8
        }
      });
    } catch (err) {
      console.error('获取用户统计信息失败:', err);
    }
  },

  /**
   * 设置按钮点击事件
   */
  onSettingsTap() {
    // 跳转到设置页面
    this.showToast('功能开发中...');
  },

  /**
   * 续费会员点击事件
   */
  onRenewTap() {
    this.setData({ showRedeemModal: true });
  },

  /**
   * 兑换入口点击事件
   */
  onRedeemTap() {
    this.setData({ showRedeemModal: true });
  },

  /**
   * 菜单项点击事件
   */
  onMenuTap(e) {
    const type = e.currentTarget.dataset.type;

    switch (type) {
      case 'download':
        this.navigateToPage('下载记录');
        break;
      case 'collection':
        this.navigateToPage('我的收藏');
        break;
      case 'feedback':
        this.navigateToPage('意见反馈');
        break;
      case 'about':
        this.navigateToPage('关于我们');
        break;
      default:
        break;
    }
  },

  /**
   * 跳转到页面
   * @param {string} name - 页面名称
   */
  navigateToPage(name) {
    // 这里应该跳转到对应页面
    // 临时显示提示
    this.showToast(`${name}页面开发中...`);
  },

  /**
   * 退出登录点击事件
   */
  onLogoutTap() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 执行退出登录
          auth.logout();
          this.setData({
            userInfo: null,
            isLoggedIn: false,
            isPremium: false,
            userStats: {
              points: 0,
              downloadCount: 0,
              collectionCount: 0
            }
          });
          this.showToast('已退出登录');
        }
      }
    });
  },

  /**
   * 兑换码输入事件
   */
  onRedeemInput(e) {
    this.setData({
      redeemCode: e.detail.value,
      redeemError: false
    });
  },

  /**
   * 兑换确认事件
   */
  async onRedeemConfirm() {
    const { redeemCode } = this.data;

    if (!redeemCode.trim()) {
      this.setData({ redeemError: true });
      return;
    }

    wx.showLoading({ title: '验证中...' });

    try {
      // 验证兑换码
      const verifyResult = await api.verifyRedeemCode(redeemCode);

      if (verifyResult.valid) {
        // 激活会员
        const activateResult = await api.activatePremium(redeemCode);

        // 更新会员状态
        await auth.refreshPremiumStatus();

        // 关闭兑换弹窗
        this.setData({
          showRedeemModal: false,
          redeemCode: '',
          redeemError: false
        });

        // 显示成功弹窗
        this.setData({
          showSuccessModal: true,
          newMemberExpireTime: this.formatExpireTime(activateResult.expireTime)
        });

        // 刷新用户数据
        this.refreshUserData();
      } else {
        this.setData({ redeemError: true });
      }
    } catch (err) {
      console.error('兑换失败:', err);
      this.setData({ redeemError: true });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 兑换弹窗关闭事件
   */
  onModalClose() {
    this.setData({
      showRedeemModal: false,
      redeemCode: '',
      redeemError: false
    });
  },

  /**
   * 兑换弹窗内容点击事件（防止冒泡）
   */
  onModalContentTap() {
    // 阻止事件冒泡
  },

  /**
   * 成功弹窗关闭事件
   */
  onSuccessModalClose() {
    this.setData({ showSuccessModal: false });
  },

  /**
   * 成功弹窗内容点击事件（防止冒泡）
   */
  onSuccessModalContentTap() {
    // 阻止事件冒泡
  },

  /**
   * 开始下载点击事件
   */
  onStartDownloadTap() {
    this.setData({ showSuccessModal: false });
    // 跳转到首页
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  /**
   * 显示Toast提示
   * @param {string} text - 提示文本
   */
  showToast(text) {
    this.setData({
      showToast: true,
      toastText: text
    });

    setTimeout(() => {
      this.setData({ showToast: false });
    }, 2000);
  }
});
