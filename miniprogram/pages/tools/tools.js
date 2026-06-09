// pages/tools/tools.js
// 工具页逻辑

Page({
  data: {
    // 推荐资源列表
    recommendResources: [
      {
        id: 1,
        name: 'Notion手账模板',
        description: '精心设计的手账规划模板，支持多种视图',
        url: 'https://notion.so/templates/journal'
      },
      {
        id: 2,
        name: 'Canva排版工具',
        description: '在线设计平台，海量手账模板',
        url: 'https://canva.com'
      },
      {
        id: 3,
        name: 'Color Hunt配色',
        description: '精选配色方案，灵感无限',
        url: 'https://colorhunt.co'
      },
      {
        id: 4,
        name: 'Google Fonts字体',
        description: '免费开源字体库，手写风格丰富',
        url: 'https://fonts.google.com'
      }
    ],
    // 是否显示Toast
    showToast: false,
    // Toast文本
    toastText: ''
  },

  onLoad() {
    // 页面加载时执行
  },

  /**
   * 工具点击事件
   * @param {Object} e - 事件对象
   */
  onToolTap(e) {
    const type = e.currentTarget.dataset.type;

    // 根据工具类型执行不同操作
    switch (type) {
      case 'layout':
        this.navigateToTool('排版工具', 'https://example.com/layout');
        break;
      case 'color':
        this.navigateToTool('配色工具', 'https://example.com/color');
        break;
      case 'font':
        this.navigateToTool('字体资源', 'https://example.com/font');
        break;
      case 'png':
        this.navigateToTool('PNG素材站', 'https://example.com/png');
        break;
      case 'tape':
        this.navigateToTool('胶带参考', 'https://example.com/tape');
        break;
      case 'notion':
        this.navigateToTool('Notion模板', 'https://notion.so/templates/journal');
        break;
      default:
        break;
    }
  },

  /**
   * 跳转到工具页面
   * @param {string} name - 工具名称
   * @param {string} url - 工具链接
   */
  navigateToTool(name, url) {
    // 复制链接到剪贴板
    wx.setClipboardData({
      data: url,
      success: () => {
        this.showToast(`✓ ${name}链接已复制`);
      },
      fail: () => {
        this.showToast('复制失败，请重试');
      }
    });
  },

  /**
   * 推荐资源点击事件
   * @param {Object} e - 事件对象
   */
  onRecommendTap(e) {
    const index = e.currentTarget.dataset.index;
    const resource = this.data.recommendResources[index];

    // 复制链接到剪贴板
    wx.setClipboardData({
      data: resource.url,
      success: () => {
        this.showToast('✓ Link Copied');
      },
      fail: () => {
        this.showToast('复制失败，请重试');
      }
    });
  },

  /**
   * FAB按钮点击事件
   */
  onFabTap() {
    // 显示操作菜单
    wx.showActionSheet({
      itemList: ['提交工具建议', '反馈问题'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.submitToolSuggestion();
            break;
          case 1:
            this.reportProblem();
            break;
          default:
            break;
        }
      }
    });
  },

  /**
   * 提交工具建议
   */
  submitToolSuggestion() {
    // 这里可以跳转到建议页面或弹窗
    this.showToast('功能开发中...');
  },

  /**
   * 反馈问题
   */
  reportProblem() {
    // 这里可以跳转到反馈页面或弹窗
    this.showToast('功能开发中...');
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
