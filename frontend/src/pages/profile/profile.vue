<template>
  <view class="page-profile">
    <!-- ===== 顶部身份区 ===== -->
    <view class="identity-section">
      <!-- 已登录 -->
      <view v-if="userStore.isLoggedIn" class="identity-inner">
        <image
          class="identity-avatar"
          :src="userStore.avatarUrl"
          mode="aspectFill"
        />
        <view class="identity-info">
          <text class="identity-name">{{ userStore.nickname }}</text>
          <!-- 身份徽章 -->
          <view
            class="identity-badge"
            :class="userStore.isPremium ? 'badge-premium' : 'badge-normal'"
          >
            <text v-if="userStore.isPremium" class="badge-crown">👑</text>
            <text class="badge-text">{{ userStore.isPremium ? '会员' : '普通用户' }}</text>
          </view>
        </view>
      </view>

      <!-- 未登录 -->
      <view v-else class="identity-inner" @tap="handleLogin">
        <view class="identity-avatar identity-avatar-empty">
          <text class="avatar-placeholder">👤</text>
        </view>
        <view class="identity-info">
          <text class="identity-name">点击登录</text>
          <text class="identity-hint">登录后享受更多功能</text>
        </view>
      </view>
    </view>

    <!-- ===== 数据统计条（仅登录后） ===== -->
    <view v-if="userStore.isLoggedIn" class="stats-bar">
      <view class="stat-item">
        <view class="stat-icon stat-icon-download" />
        <text class="stat-value">{{ formattedStats.downloadCount }}</text>
        <text class="stat-label">下载</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <view class="stat-icon stat-icon-collection" />
        <text class="stat-value">{{ formattedStats.collectionCount }}</text>
        <text class="stat-label">收藏</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <view class="stat-icon stat-icon-material" />
        <text class="stat-value">{{ formattedStats.materialCount }}</text>
        <text class="stat-label">素材</text>
      </view>
    </view>

    <!-- ===== 双入口卡片 ===== -->
    <view class="entry-cards">
      <!-- 会员中心卡（非会员黑底白字反显） -->
      <view
        class="entry-card"
        :class="{ 'entry-card-premium': !userStore.isPremium }"
        @tap="handleGoPremium"
      >
        <view class="entry-card-content">
          <text class="entry-card-title">会员中心</text>
          <text class="entry-card-desc">{{ userStore.isPremium ? '管理你的会员权益' : '解锁高清素材 + 全部工具' }}</text>
        </view>
        <text class="entry-card-arrow">›</text>
      </view>

      <!-- 兑换会员卡 -->
      <view class="entry-card entry-card-redeem" @tap="handleGoRedeem">
        <view class="entry-card-content">
          <text class="entry-card-title">兑换会员</text>
          <text class="entry-card-desc">使用兑换码激活会员权益</text>
        </view>
        <text class="entry-card-arrow">›</text>
      </view>
    </view>

    <!-- ===== 底部设置列表 ===== -->
    <view class="settings-list">
      <view class="setting-item" @tap="handleSettingTap('settings')">
        <view class="setting-icon-round setting-icon-settings" />
        <text class="setting-text">设置</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @tap="handleSettingTap('materials')">
        <view class="setting-icon-round setting-icon-materials" />
        <text class="setting-text">素材管理</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @tap="handleSettingTap('about')">
        <view class="setting-icon-round setting-icon-about" />
        <text class="setting-text">关于</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @tap="handleSettingTap('feedback')">
        <view class="setting-icon-round setting-icon-feedback" />
        <text class="setting-text">反馈建议</text>
        <text class="setting-arrow">›</text>
      </view>
    </view>

    <!-- ===== 退出登录 ===== -->
    <view v-if="userStore.isLoggedIn" class="logout-section">
      <button class="logout-button" @tap="handleLogout">
        <text class="logout-text">退出登录</text>
      </button>
    </view>

    <!-- CustomToast -->
    <CustomToast ref="toastRef" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '../../stores/user'
import { getUserStats } from '../../api/user'
import CustomToast from '../../components/CustomToast.vue'

const userStore = useUserStore()
const toastRef = ref(null)

const stats = ref({
  downloadCount: 0,
  collectionCount: 0,
  materialCount: 0
})

const formattedStats = computed(() => ({
  downloadCount: stats.value.downloadCount || 0,
  collectionCount: stats.value.collectionCount || 0,
  materialCount: stats.value.materialCount || 0
}))

onShow(() => {
  if (userStore.isLoggedIn) {
    loadUserStats()
    userStore.refreshProfile()
  }
})

// 加载统计
const loadUserStats = async () => {
  try {
    const result = await getUserStats()
    stats.value = {
      downloadCount: result.downloadCount || 0,
      collectionCount: result.collectionCount || 0,
      materialCount: result.materialCount || (result.downloadCount || 0)
    }
  } catch (error) {
    console.error('加载统计失败:', error)
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

// 跳转会员中心
const handleGoPremium = () => {
  uni.navigateTo({ url: '/pages/premium/index' })
}

// 跳转兑换页
const handleGoRedeem = () => {
  uni.navigateTo({ url: '/pages/redeem/index' })
}

// 设置项点击
const handleSettingTap = (type) => {
  switch (type) {
    case 'settings':
      toastRef.value?.showToast('设置功能开发中', 'check')
      break
    case 'materials':
      toastRef.value?.showToast('素材管理开发中', 'check')
      break
    case 'about':
      uni.showModal({
        title: '关于',
        content: '手账素材小程序 v1.0\n\n为你提供精选手账素材，助你创作更美的手账作品。'
      })
      break
    case 'feedback':
      toastRef.value?.showToast('反馈建议已收到', 'check')
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
        stats.value = { downloadCount: 0, collectionCount: 0, materialCount: 0 }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-profile {
  min-height: 100vh;
  padding: 28rpx 24rpx 140rpx;
}

/* ===== 身份区 ===== */
.identity-section {
  margin-bottom: 24rpx;
}

.identity-inner {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.identity-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.identity-avatar-empty {
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder {
  font-size: 48rpx;
}

.identity-info {
  flex: 1;
}

.identity-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  display: block;
}

.identity-hint {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

/* 身份徽章 */
.identity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  margin-top: 12rpx;
}

.badge-normal {
  background: #f5f5f5;
  .badge-text { color: #999; }
}

.badge-premium {
  background: #000;
  .badge-text { color: #fff; }
  .badge-crown { font-size: 20rpx; }
}

.badge-text {
  font-size: 22rpx;
  font-weight: 500;
}

/* ===== 统计条 ===== */
.stats-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 16rpx;
  border: 1rpx solid #eee;
  padding: 24rpx 8rpx;
  margin-bottom: 20rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.stat-icon {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
}

.stat-icon-download { background: #333; }
.stat-icon-collection { background: #999; }
.stat-icon-material { background: #ccc; }

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}

.stat-divider {
  width: 1rpx;
  height: 48rpx;
  background: #eee;
}

/* ===== 双入口卡片 ===== */
.entry-cards {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1rpx solid #eee;
}

.entry-card-premium {
  background: #000;
  border-color: #000;

  .entry-card-title { color: #fff; }
  .entry-card-desc { color: rgba(255,255,255,0.7); }
  .entry-card-arrow { color: rgba(255,255,255,0.5); }
}

.entry-card-redeem {
  .entry-card-title { color: #333; }
  .entry-card-desc { color: #999; }
  .entry-card-arrow { color: #ccc; }
}

.entry-card-content {
  flex: 1;
}

.entry-card-title {
  font-size: 28rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 6rpx;
}

.entry-card-desc {
  font-size: 22rpx;
  display: block;
}

.entry-card-arrow {
  font-size: 36rpx;
  margin-left: 16rpx;
}

/* ===== 设置列表 ===== */
.settings-list {
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 16rpx;
  border: 1rpx solid #eee;
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: rgba(0,0,0,0.03);
  }
}

.setting-icon-round {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.setting-icon-settings { background: #333; }
.setting-icon-materials { background: #666; }
.setting-icon-about { background: #999; }
.setting-icon-feedback { background: #ccc; }

.setting-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.setting-arrow {
  font-size: 28rpx;
  color: #ccc;
}

/* ===== 退出 ===== */
.logout-section {
  padding: 40rpx 0;
}

.logout-button {
  width: 100%;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 80rpx;
  padding: 0;
  margin: 0;
}

.logout-button::after {
  border: none;
}

.logout-text {
  font-size: 26rpx;
  color: #999;
}
</style>
