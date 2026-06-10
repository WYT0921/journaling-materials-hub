<template>
  <view v-if="visible" class="modal-overlay" @tap="handleClose">
    <view class="modal-content" @tap.stop>
      <!-- 标题 -->
      <view class="modal-header">
        <text class="modal-title">兑换会员</text>
        <view class="modal-close" @tap="handleClose">
          <text class="close-icon">×</text>
        </view>
      </view>

      <!-- 兑换码输入 -->
      <view class="modal-body">
        <view class="input-wrapper">
          <input
            class="redeem-input"
            v-model="redeemCode"
            placeholder="请输入兑换码 (JM-XXXX-XXXX)"
            maxlength="14"
            @input="handleInput"
          />
        </view>

        <!-- 错误提示 -->
        <view v-if="errorMessage" class="error-message">
          <text class="error-text">{{ errorMessage }}</text>
        </view>

        <!-- 兑换按钮 -->
        <button
          class="redeem-button"
          :class="{ disabled: !isValidCode || isLoading }"
          :disabled="!isValidCode || isLoading"
          @tap="handleRedeem"
        >
          <text v-if="isLoading" class="button-text">兑换中...</text>
          <text v-else class="button-text">立即兑换</text>
        </button>

        <!-- 提示信息 -->
        <view class="tips">
          <text class="tips-text">兑换码格式为 JM-XXXX-XXXX</text>
          <text class="tips-text">每个兑换码只能使用一次</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as redeemApi from '../api/redeem'
import { useUserStore } from '../stores/user'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'success'])

const userStore = useUserStore()
const redeemCode = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// 验证兑换码格式
const isValidCode = computed(() => {
  const code = redeemCode.value.trim()
  return /^JM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)
})

// 处理输入（自动格式化）
const handleInput = (e) => {
  let value = e.detail.value.toUpperCase()

  // 自动添加分隔符
  if (value.length === 2 && !value.includes('-')) {
    value = value + '-'
  }
  if (value.length === 7 && value.charAt(6) !== '-') {
    value = value.substring(0, 6) + '-' + value.substring(6)
  }

  redeemCode.value = value
  errorMessage.value = ''
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  redeemCode.value = ''
  errorMessage.value = ''
}

// 兑换
const handleRedeem = async () => {
  if (!isValidCode.value || isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''

    const result = await redeemApi.activatePremium(redeemCode.value.trim())

    // 更新用户状态
    await userStore.refreshPremiumStatus()
    await userStore.refreshProfile()

    // 成功提示
    uni.showToast({
      title: '兑换成功！',
      icon: 'success'
    })

    // 触发成功事件
    emit('success', result)

    // 关闭弹窗
    setTimeout(() => {
      handleClose()
    }, 1500)
  } catch (error) {
    console.error('兑换失败:', error)
    errorMessage.value = error.message || '兑换失败，请检查兑换码'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 80%;
  max-width: 600rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.modal-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 40rpx;
  color: #999999;
}

.modal-body {
  padding: 32rpx;
}

.input-wrapper {
  margin-bottom: 24rpx;
}

.redeem-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333333;
}

.redeem-input:focus {
  border-color: #333333;
}

.error-message {
  margin-bottom: 24rpx;
}

.error-text {
  font-size: 24rpx;
  color: #ff4d4f;
}

.redeem-button {
  width: 100%;
  height: 88rpx;
  background: #333333;
  color: #ffffff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.redeem-button.disabled {
  background: #cccccc;
}

.button-text {
  font-size: 30rpx;
  font-weight: 500;
}

.tips {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.tips-text {
  font-size: 24rpx;
  color: #999999;
}
</style>
