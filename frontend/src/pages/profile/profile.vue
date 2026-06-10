<template>
  <view class="page-profile">
    <!-- 用户信息区域 -->
    <view class="user-section">
      <!-- 已登录 -->
      <view v-if="userStore.isLoggedIn" class="user-info">
        <image
          class="user-avatar"
          :src="userStore.avatarUrl"
          mode="aspectFill"
        />
        <view class="user-details">
          <text class="user-name">{{ userStore.nickname }}</text>
          <view class="member-badge" v-if="userStore.isPremium">
            <text class="member-text">{{ userStore.memberTypeText }}</text>
          </view>
          <text class="member-expire" v-if="userStore.userInfo?.memberExpireTime">
            有效期至: {{ userStore.userInfo.memberExpireTime }}
          </text>
        </view>
      </view>

      <!-- 未登录 -->
      <view v-else class="login-prompt" @tap="handleLogin">
        <image
          class="default-avatar"
          src="/static/images/default-avatar.png"
          mode="aspectFill"
        />
        <view class="login-info">
          <text class="login-text">点击登录</text>
          <text class="login-desc">登录后享受更多功能</text>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view v-if="userStore.isLoggedIn" class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ stats.points || 0 }}</text>
        <text class="stat-label">积分</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.downloadCount || 0 }}</text>
        <text class="stat-label">下载</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.collectionCount || 0 }}</text>
        <text class="stat-label">收藏</text>
      </view>
    </view>

    <!-- 会员中心 -->
    <view v-if="userStore.isLoggedIn && !userStore.isPremium" class="premium-section" @tap="showRedeemModal = true">
      <view class="premium-content">
        <text class="premium-title">开通会员</text>
        <text class="premium-desc">解锁全部高清素材</text>
      </view>
      <text class="premium-arrow">></text>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @tap="handleMenuTap('downloads')">
        <view class="menu-icon-wrapper">
          <image class="menu-icon" src="/static/icons/download.png" mode="aspectFit" />
        </view>
        <text class="menu-text">下载记录</text>
        <text class="menu-arrow">></text>
      </view>

      <view class="menu-item" @tap="handleMenuTap('favorites')">
        <view class="menu-icon-wrapper">
          <image class="menu-icon" src="/static/icons/favorite.png" mode="aspectFit" />
        </view>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">></text>
      </view>

      <view class="menu-item" @tap="handleMenuTap('feedback')">
        <view class="menu-icon-wrapper">
          <image class="menu-icon" src="/static/icons/feedback.png" mode="aspectFit" />
        </view>
        <text class="menu-text">意见反馈</text>
        <text class="menu-arrow">></text>
      </view>

      <view class="menu-item" @tap="handleMenuTap('about')">
        <view class="menu-icon-wrapper">
          <image class="menu-icon" src="/static/icons/about.png" mode="aspectFit" />
        </view>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="userStore.isLoggedIn" class="logout-section">
      <button class="logout-button" @tap="handleLogout">
        <text class="logout-text">退出登录</text>
      </button>
    </view>

    <!-- 兑换弹窗 -->
    <RedeemModal
      v-model:visible="showRedeemModal"
      @success="handleRedeemSuccess"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '../../stores/user'
import { getUserStats } from '../../api/user'
import RedeemModal from '../../components/RedeemModal.vue'

const userStore = useUserStore()

const stats = ref({
  points: 0,
  downloadCount: 0,
  collectionCount: 0
})

const showRedeemModal = ref(false)

// 页面显示时刷新数据
onShow(() => {
  if (userStore.isLoggedIn) {
    loadUserStats()
    userStore.refreshProfile()
  }
})

// 加载用户统计
const loadUserStats = async () => {
  try {
    const result = await getUserStats()
    stats.value = result
  } catch (error) {
    console.error('加载用户统计失败:', error)
  }
}

// 登录
const handleLogin = async () => {
  try {
    await userStore.login()
    loadUserStats()
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 菜单点击
const handleMenuTap = (type) => {
  if (!userStore.isLoggedIn) {
    handleLogin()
    return
  }

  switch (type) {
    case 'downloads':
      // TODO: 跳转到下载记录页面
      uni.showToast({
        title: '功能开发中...',
        icon: 'none'
      })
      break
    case 'favorites':
      // TODO: 跳转到收藏页面
      uni.showToast({
        title: '功能开发中...',
        icon: 'none'
      })
      break
    case 'feedback':
      uni.showToast({
        title: '功能开发中...',
        icon: 'none'
      })
      break
    case 'about':
      uni.showToast({
        title: '功能开发中...',
        icon: 'none'
      })
      break
  }
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        stats.value = {
          points: 0,
          downloadCount: 0,
          collectionCount: 0
        }
      }
    }
  })
}

// 兑换成功
const handleRedeemSuccess = () => {
  loadUserStats()
  userStore.refreshPremiumStatus()
}
</script>

<style lang="scss" scoped>
.page-profile {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-section {
  background: #ffffff;
  padding: 40rpx 32rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  display: block;
}

.member-badge {
  display: inline-block;
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  margin-top: 12rpx;
}

.member-text {
  font-size: 22rpx;
  color: #ffffff;
  font-weight: bold;
}

.member-expire {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.login-prompt {
  display: flex;
  align-items: center;
}

.default-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  background: #f0f0f0;
}

.login-info {
  flex: 1;
}

.login-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  display: block;
}

.login-desc {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.stats-section {
  display: flex;
  align-items: center;
  background: #ffffff;
  margin-top: 16rpx;
  padding: 32rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
}

.stat-label {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background: #f0f0f0;
}

.premium-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #333333, #666666);
  margin: 16rpx 32rpx;
  padding: 32rpx;
  border-radius: 16rpx;
}

.premium-content {
  flex: 1;
}

.premium-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
}

.premium-desc {
  font-size: 24rpx;
  color: #cccccc;
  margin-top: 8rpx;
  display: block;
}

.premium-arrow {
  font-size: 32rpx;
  color: #ffffff;
}

.menu-section {
  background: #ffffff;
  margin-top: 16rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.menu-icon-wrapper {
  width: 48rpx;
  height: 48rpx;
  margin-right: 24rpx;
}

.menu-icon {
  width: 48rpx;
  height: 48rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #999999;
}

.logout-section {
  padding: 48rpx 32rpx;
}

.logout-button {
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  border: 2rpx solid #ff4d4f;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-text {
  font-size: 28rpx;
  color: #ff4d4f;
}
</style>
