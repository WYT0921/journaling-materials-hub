<template>
  <view class="page-detail">
    <!-- 加载中 -->
    <LoadingSpinner v-if="isLoading" />

    <!-- 素材详情 -->
    <view v-else-if="material" class="detail-content">
      <!-- 图片区域 -->
      <view class="image-wrapper">
        <image
          class="material-image"
          :src="material.imageUrl"
          mode="widthFix"
          @tap="handleImagePreview"
        />
        <!-- 模糊遮罩 -->
        <view v-if="material.isBlurred" class="blur-overlay">
          <view class="blur-content">
            <image class="lock-icon" src="/static/icons/lock.png" mode="aspectFit" />
            <text class="blur-text">开通会员查看高清原图</text>
            <button class="unlock-button" @tap="handleUnlock">
              <text class="unlock-text">立即开通</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 信息区域 -->
      <view class="info-section">
        <text class="material-title">{{ material.title }}</text>
        <view class="material-meta">
          <text class="meta-category">{{ material.category }}</text>
          <text class="meta-downloads">{{ material.downloadCount || 0 }} 次下载</text>
        </view>
        <text v-if="material.description" class="material-desc">{{ material.description }}</text>

        <!-- 标签 -->
        <view v-if="material.tags && material.tags.length" class="tags-wrapper">
          <view
            v-for="(tag, index) in material.tags"
            :key="index"
            class="tag-item"
          >
            <text class="tag-text">{{ tag }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-button preview-button" @tap="handleImagePreview">
          <text class="button-text">预览大图</text>
        </button>
        <button
          class="action-button download-button"
          :class="{ disabled: material.isPremium && !userStore.isPremium }"
          @tap="handleDownload"
        >
          <text class="button-text">下载素材</text>
        </button>
      </view>

      <!-- 兑换入口 -->
      <view v-if="!userStore.isPremium" class="redeem-entry" @tap="showRedeemModal = true">
        <text class="redeem-text">有兑换码？点击兑换会员</text>
        <text class="redeem-arrow">></text>
      </view>
    </view>

    <!-- 错误状态 -->
    <EmptyState v-else text="素材不存在" />

    <!-- 兑换弹窗 -->
    <RedeemModal
      v-model:visible="showRedeemModal"
      @success="handleRedeemSuccess"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '../../stores/user'
import { getMaterialDetail } from '../../api/material'
import { downloadMaterial } from '../../api/download'
import { requireLogin, requirePremium } from '../../utils/auth'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import EmptyState from '../../components/EmptyState.vue'
import RedeemModal from '../../components/RedeemModal.vue'

const userStore = useUserStore()

const materialId = ref(null)
const material = ref(null)
const isLoading = ref(true)
const showRedeemModal = ref(false)

// 页面加载
onLoad((options) => {
  if (options.id) {
    materialId.value = options.id
    loadMaterialDetail()
  }
})

// 加载素材详情
const loadMaterialDetail = async () => {
  try {
    isLoading.value = true
    const result = await getMaterialDetail(materialId.value)
    material.value = result

    // 设置页面标题
    uni.setNavigationBarTitle({
      title: result.title || '素材详情'
    })
  } catch (error) {
    console.error('加载素材详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

// 图片预览
const handleImagePreview = () => {
  if (!material.value) return

  // 如果是模糊图片，提示开通会员
  if (material.value.isBlurred) {
    handleUnlock()
    return
  }

  uni.previewImage({
    urls: [material.value.imageUrl],
    current: material.value.imageUrl
  })
}

// 解锁（开通会员）
const handleUnlock = () => {
  if (!requireLogin()) return
  showRedeemModal.value = true
}

// 下载素材
const handleDownload = async () => {
  if (!requireLogin()) return

  // 检查是否为付费素材
  if (material.value.isPremium && !userStore.isPremium) {
    uni.showModal({
      title: '会员专享',
      content: '此素材需要会员权限才能下载，是否开通会员？',
      success: (res) => {
        if (res.confirm) {
          showRedeemModal.value = true
        }
      }
    })
    return
  }

  try {
    uni.showLoading({ title: '下载中...' })

    const result = await downloadMaterial(materialId.value)

    // 下载文件
    const downloadRes = await new Promise((resolve, reject) => {
      uni.downloadFile({
        url: result.url,
        success: (res) => resolve(res),
        fail: (err) => reject(err)
      })
    })

    if (downloadRes.statusCode === 200) {
      // 保存到相册
      await new Promise((resolve, reject) => {
        uni.saveImageToPhotosAlbum({
          filePath: downloadRes.tempFilePath,
          success: () => resolve(),
          fail: (err) => reject(err)
        })
      })

      uni.showToast({
        title: '已保存到相册',
        icon: 'success'
      })
    } else {
      throw new Error('下载失败')
    }
  } catch (error) {
    console.error('下载失败:', error)
    uni.showToast({
      title: error.message || '下载失败',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}

// 兑换成功
const handleRedeemSuccess = () => {
  // 刷新素材详情（可能已解锁）
  loadMaterialDetail()
}
</script>

<style lang="scss" scoped>
.page-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.detail-content {
  padding-bottom: 40rpx;
}

.image-wrapper {
  position: relative;
  width: 100%;
  background: #ffffff;
}

.material-image {
  width: 100%;
  display: block;
}

.blur-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.blur-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.lock-icon {
  width: 80rpx;
  height: 80rpx;
  opacity: 0.6;
}

.blur-text {
  font-size: 28rpx;
  color: #666666;
}

.unlock-button {
  background: #333333;
  color: #ffffff;
  border-radius: 40rpx;
  padding: 16rpx 48rpx;
}

.unlock-text {
  font-size: 28rpx;
  font-weight: 500;
}

.info-section {
  background: #ffffff;
  padding: 32rpx;
  margin-top: 16rpx;
}

.material-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  line-height: 1.4;
}

.material-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 16rpx;
}

.meta-category {
  font-size: 24rpx;
  color: #ffffff;
  background: #333333;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
}

.meta-downloads {
  font-size: 24rpx;
  color: #999999;
}

.material-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-top: 24rpx;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 24rpx;
}

.tag-item {
  background: #f5f5f5;
  padding: 8rpx 20rpx;
  border-radius: 6rpx;
}

.tag-text {
  font-size: 24rpx;
  color: #666666;
}

.action-buttons {
  display: flex;
  gap: 24rpx;
  padding: 32rpx;
}

.action-button {
  flex: 1;
  height: 88rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-button {
  background: #ffffff;
  border: 2rpx solid #333333;

  .button-text {
    color: #333333;
  }
}

.download-button {
  background: #333333;

  &.disabled {
    background: #cccccc;
  }

  .button-text {
    color: #ffffff;
  }
}

.button-text {
  font-size: 28rpx;
  font-weight: 500;
}

.redeem-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 24rpx 32rpx;
  margin: 0 32rpx;
  border-radius: 12rpx;
}

.redeem-text {
  font-size: 28rpx;
  color: #666666;
}

.redeem-arrow {
  font-size: 28rpx;
  color: #999999;
}
</style>
