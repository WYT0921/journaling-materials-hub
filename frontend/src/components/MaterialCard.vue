<template>
  <view class="material-card" @tap="handleTap">
    <!-- 图片区域 -->
    <view class="card-image-wrapper">
      <image
        class="card-image"
        :src="material.imageUrl || material.thumbnailUrl"
        mode="widthFix"
        lazy-load
      />
      <!-- VIP 标识 -->
      <view v-if="material.isPremium" class="vip-badge">
        <text class="vip-text">VIP</text>
      </view>
      <!-- 模糊遮罩 -->
      <view v-if="isBlurred" class="blur-overlay">
        <text class="blur-text">会员专享</text>
      </view>
    </view>

    <!-- 信息区域 -->
    <view class="card-info">
      <text class="card-title">{{ material.title }}</text>
      <view class="card-meta">
        <text class="card-category">{{ material.category }}</text>
        <text class="card-downloads">{{ material.downloadCount || 0 }} 次下载</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  material: {
    type: Object,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['tap'])

// 是否需要模糊化
const isBlurred = computed(() => {
  return props.material.isPremium && !props.isPremium
})

const handleTap = () => {
  emit('tap', props.material)
}
</script>

<style lang="scss" scoped>
.material-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 20rpx;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
}

.card-image {
  width: 100%;
  display: block;
}

.vip-badge {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.vip-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: bold;
}

.blur-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.blur-text {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
}

.card-info {
  padding: 16rpx;
}

.card-title {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}

.card-category {
  font-size: 22rpx;
  color: #999999;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.card-downloads {
  font-size: 22rpx;
  color: #999999;
}
</style>
