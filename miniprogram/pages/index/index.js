// pages/index/index.js
// 首页逻辑

const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

Page({
  data: {
    // 搜索关键词
    keyword: '',
    // 当前选中的分类
    activeCategory: '',
    // 素材列表
    materials: [],
    // 左列素材
    leftColumnMaterials: [],
    // 右列素材
    rightColumnMaterials: [],
    // 当前页码
    page: 1,
    // 每页数量
    limit: 20,
    // 是否还有更多数据
    hasMore: true,
    // 是否正在加载
    isLoading: false,
    // 是否正在刷新
    isRefreshing: false,
    // 是否为会员
    isPremium: false
  },

  onLoad() {
    // 检查登录状态
    this.checkLoginStatus();
    // 加载素材列表
    this.loadMaterials();
  },

  onShow() {
    // 更新会员状态
    this.updatePremiumStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    if (!auth.isLoggedIn()) {
      // 未登录，执行静默登录
      auth.wxLogin().catch(err => {
        console.error('登录失败:', err);
      });
    }
  },

  /**
   * 更新会员状态
   */
  updatePremiumStatus() {
    const isPremium = auth.isPremium();
    this.setData({ isPremium });
  },

  /**
   * 加载素材列表
   * @param {boolean} isRefresh - 是否为刷新操作
   */
  async loadMaterials(isRefresh = false) {
    if (this.data.isLoading) return;

    this.setData({ isLoading: true });

    try {
      // 计算页码
      const page = isRefresh ? 1 : this.data.page;

      // 尝试从缓存获取数据
      const cacheKey = `${this.data.activeCategory}_${this.data.keyword}_${page}`;
      let materials = storage.getCachedMaterialList(cacheKey);

      if (materials.length === 0) {
        // 缓存未命中，从API获取
        const res = await api.getMaterials(
          page,
          this.data.limit,
          this.data.activeCategory,
          this.data.keyword
        );
        materials = res.data || [];

        // 缓存数据
        storage.cacheMaterialList(cacheKey, materials);
      }

      // 更新数据
      const allMaterials = isRefresh ? materials : [...this.data.materials, ...materials];
      const hasMore = materials.length >= this.data.limit;

      // 分配到左右两列
      const { leftColumn, rightColumn } = this.splitMaterialsToColumns(allMaterials);

      this.setData({
        materials: allMaterials,
        leftColumnMaterials: leftColumn,
        rightColumnMaterials: rightColumn,
        page: page + 1,
        hasMore,
        isLoading: false,
        isRefreshing: false
      });
    } catch (err) {
      console.error('加载素材失败:', err);
      this.setData({ isLoading: false, isRefreshing: false });
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 将素材分配到左右两列
   * @param {Array} materials - 素材列表
   * @returns {Object} 左右两列素材
   */
  splitMaterialsToColumns(materials) {
    const leftColumn = [];
    const rightColumn = [];

    materials.forEach((material, index) => {
      if (index % 2 === 0) {
        leftColumn.push(material);
      } else {
        rightColumn.push(material);
      }
    });

    return { leftColumn, rightColumn };
  },

  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  /**
   * 搜索确认事件
   */
  onSearchConfirm() {
    this.resetAndLoad();
  },

  /**
   * 分类点击事件
   */
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ activeCategory: category });
    this.resetAndLoad();
  },

  /**
   * 重置并重新加载
   */
  resetAndLoad() {
    this.setData({
      materials: [],
      leftColumnMaterials: [],
      rightColumnMaterials: [],
      page: 1,
      hasMore: true
    });
    this.loadMaterials(true);
  },

  /**
   * 滚动到底部事件
   */
  onScrollToLower() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadMaterials();
    }
  },

  /**
   * 下拉刷新事件
   */
  onRefresh() {
    this.setData({ isRefreshing: true });
    this.resetAndLoad();
  },

  /**
   * 素材点击事件
   */
  onMaterialTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
});
