<template>
  <view class="page-tools">
    <!-- 标题 -->
    <view class="page-header">
      <text class="page-title">推荐工具</text>
      <text class="page-subtitle">精选设计工具，提升创作效率</text>
    </view>

    <!-- 工具分类 -->
    <view class="tool-categories">
      <view
        v-for="(category, index) in toolCategories"
        :key="index"
        class="category-section"
      >
        <view class="category-header">
          <text class="category-title">{{ category.title }}</text>
          <text class="category-desc">{{ category.description }}</text>
        </view>

        <view class="tool-list">
          <view
            v-for="(tool, toolIndex) in category.tools"
            :key="toolIndex"
            class="tool-item"
            @tap="handleToolTap(tool)"
          >
            <view class="tool-icon-wrapper">
              <image
                class="tool-icon"
                :src="tool.icon"
                mode="aspectFit"
              />
            </view>
            <view class="tool-info">
              <text class="tool-name">{{ tool.name }}</text>
              <text class="tool-desc">{{ tool.description }}</text>
            </view>
            <view class="tool-action">
              <text class="action-text">复制链接</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 提交建议 -->
    <view class="suggestion-section">
      <view class="suggestion-card" @tap="handleSuggestion">
        <text class="suggestion-title">有好用的工具推荐？</text>
        <text class="suggestion-desc">点击提交你的工具建议</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 工具数据
const toolCategories = ref([
  {
    title: '布局工具',
    description: '提升手账排版效率',
    tools: [
      {
        name: 'Notion',
        description: '万能笔记和项目管理工具',
        icon: '/static/icons/notion.png',
        url: 'https://www.notion.so'
      },
      {
        name: 'Canva',
        description: '在线设计平台，海量模板',
        icon: '/static/icons/canva.png',
        url: 'https://www.canva.cn'
      }
    ]
  },
  {
    title: '配色工具',
    description: '找到完美的色彩搭配',
    tools: [
      {
        name: 'Color Hunt',
        description: '精选配色方案集合',
        icon: '/static/icons/color-hunt.png',
        url: 'https://colorhunt.co'
      },
      {
        name: 'Coolors',
        description: '快速生成配色方案',
        icon: '/static/icons/coolors.png',
        url: 'https://coolors.co'
      }
    ]
  },
  {
    title: '字体资源',
    description: '优质字体下载',
    tools: [
      {
        name: 'Google Fonts',
        description: '免费开源字体库',
        icon: '/static/icons/google-fonts.png',
        url: 'fonts.google.com'
      },
      {
        name: 'DaFont',
        description: '英文字体下载站',
        icon: '/static/icons/dafont.png',
        url: 'https://www.dafont.com'
      }
    ]
  },
  {
    title: '素材网站',
    description: '更多设计素材来源',
    tools: [
      {
        name: 'Freepik',
        description: '免费矢量图和PSD素材',
        icon: '/static/icons/freepik.png',
        url: 'https://www.freepik.com'
      },
      {
        name: 'Unsplash',
        description: '高质量免费图片',
        icon: '/static/icons/unsplash.png',
        url: 'https://unsplash.com'
      }
    ]
  }
])

// 工具点击（复制链接）
const handleToolTap = (tool) => {
  uni.setClipboardData({
    data: tool.url,
    success: () => {
      uni.showToast({
        title: '链接已复制',
        icon: 'success'
      })
    }
  })
}

// 提交建议
const handleSuggestion = () => {
  uni.showToast({
    title: '功能开发中...',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.page-tools {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.page-header {
  background: #ffffff;
  padding: 40rpx 32rpx;
  margin-bottom: 16rpx;
}

.page-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
  display: block;
}

.page-subtitle {
  font-size: 26rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.category-section {
  background: #ffffff;
  margin-bottom: 16rpx;
}

.category-header {
  padding: 24rpx 32rpx 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.category-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
}

.category-desc {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.tool-list {
  padding: 0 32rpx;
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.tool-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.tool-icon {
  width: 48rpx;
  height: 48rpx;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  display: block;
}

.tool-desc {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.tool-action {
  background: #f5f5f5;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666666;
}

.suggestion-section {
  padding: 32rpx;
}

.suggestion-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.suggestion-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  display: block;
}

.suggestion-desc {
  font-size: 24rpx;
  color: #999999;
  margin-top: 12rpx;
  display: block;
}
</style>
