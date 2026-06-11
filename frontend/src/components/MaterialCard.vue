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
      <!-- VIP 角标（黑底白字） -->
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
        <text class="card-downloads">{{ material.downloadCount || 0 }} 次</text>
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
  /* 半透明毛玻璃卡片 */
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 16rpx;
  overflow: hidden;
  /* 1px 极淡边框，零阴影 */
  border: 1rpx solid #EEEEEE;
  margin-bottom: 18rpx;
}

@supports not ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))) {
  .material-card {
    background: rgba(255, 255, 255, 0.95);
  }
}

.card-image-wrapper {
  position: relative;
  width: 100%;
}

.card-image {
  width: 100%;
  display: block;
}

/* VIP 角标：黑底白字（左上角） */
.vip-badge {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  background: #000;
  padding: 4rpx 14rpx;
  border-radius: 6rpx;
}

.vip-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: 600;
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
  color: #333;
  font-weight: bold;
}

.card-info {
  padding: 16rpx 14rpx 14rpx;
}

.card-title {
  font-size: 28rpx;
  color: #333;
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
  margin-top: 10rpx;
}

.card-category {
  font-size: 22rpx;
  color: #999;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.card-downloads {
  font-size: 22rpx;
  color: #999;
}
</style>
