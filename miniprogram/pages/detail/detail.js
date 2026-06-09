// pages/detail/detail.js
// 素材详情页逻辑

const api = require('../../utils/api');
const auth = require('../../utils/auth');

Page({
  data: {
    // 素材ID
    materialId: null,
    // 素材信息
    material: null,
    // 是否为会员
    isPremium: false,
    // 是否正在加载
    isLoading: true,
    // 是否显示兑换弹窗
    showRedeemModal: false,
    // 兑换码
    redeemCode: '',
    // 兑换码错误
    redeemError: false,
    // 是否显示Toast
    showToast: false,
    // Toast文本
    toastText: ''
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ materialId: id });
      this.loadMaterialDetail(id);
    }
  },

  onShow() {
    // 更新会员状态
    this.updatePremiumStatus();
  },

  /**
   * 更新会员状态
   */
  updatePremiumStatus() {
    const isPremium = auth.isPremium();
    this.setData({ isPremium });
  },

  /**
   * 加载素材详情
   * @param {number} id - 素材ID
   */
  async loadMaterialDetail(id) {
    this.setData({ isLoading: true });

    try {
      const material = await api.getMaterialDetail(id);
      this.setData({
        material: material,
        isLoading: false
      });
    } catch (err) {
      console.error('加载素材详情失败:', err);
      this.setData({ isLoading: false });
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 返回按钮点击事件
   */
  onBackTap() {
    wx.navigateBack();
  },

  /**
   * 图片预览事件
   */
  onImagePreview() {
    if (!this.data.isPremium && this.data.material.isPremium) {
      // 非会员，显示提示
      this.showToast('查看高清需开通会员');
      return;
    }

    // 预览图片
    wx.previewImage({
      urls: [this.data.material.imageUrl],
      current: this.data.material.imageUrl
    });
  },

  /**
   * 解锁会员点击事件
   */
  onUnlockTap() {
    this.setData({ showRedeemModal: true });
  },

  /**
   * 下载按钮点击事件
   */
  async onDownloadTap() {
    // 检查登录状态
    if (!auth.isLoggedIn()) {
      try {
        await auth.wxLogin();
      } catch (err) {
        this.showToast('登录失败，请重试');
        return;
      }
    }

    // 检查会员权限
    if (this.data.material.isPremium && !this.data.isPremium) {
      this.setData({ showRedeemModal: true });
      return;
    }

    // 执行下载
    this.downloadMaterial();
  },

  /**
   * 下载素材
   */
  async downloadMaterial() {
    wx.showLoading({ title: '正在下载...' });

    try {
      // 获取下载链接
      const downloadInfo = await api.downloadMaterial(this.data.materialId);

      // 下载文件
      const res = await new Promise((resolve, reject) => {
        wx.downloadFile({
          url: downloadInfo.url,
          success: resolve,
          fail: reject
        });
      });

      if (res.statusCode === 200) {
        // 保存到相册
        await new Promise((resolve, reject) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: resolve,
            fail: reject
          });
        });

        this.showToast('下载成功');
      } else {
        throw new Error('下载失败');
      }
    } catch (err) {
      console.error('下载失败:', err);
      if (err.errMsg && err.errMsg.includes('auth deny')) {
        this.showToast('请授权保存到相册');
      } else {
        this.showToast('下载失败，请重试');
      }
    } finally {
      wx.hideLoading();
    }
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
        auth.refreshPremiumStatus();

        // 关闭弹窗
        this.setData({
          showRedeemModal: false,
          redeemCode: '',
          redeemError: false
        });

        // 显示成功提示
        this.showToast('兑换成功！');

        // 重新加载素材详情
        this.loadMaterialDetail(this.data.materialId);
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
   * 弹窗关闭事件
   */
  onModalClose() {
    this.setData({
      showRedeemModal: false,
      redeemCode: '',
      redeemError: false
    });
  },

  /**
   * 弹窗内容点击事件（防止冒泡）
   */
  onModalContentTap() {
    // 阻止事件冒泡
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
