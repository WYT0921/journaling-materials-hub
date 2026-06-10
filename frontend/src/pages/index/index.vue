<template>
  <view class="page-index">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <image class="search-icon" src="/static/icons/search.png" mode="aspectFit" />
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索素材"
          confirm-type="search"
          @confirm="handleSearch"
          @input="handleSearchInput"
        />
        <view
          v-if="searchKeyword"
          class="clear-button"
          @tap="clearSearch"
        >
          <text class="clear-icon">×</text>
        </view>
      </view>
    </view>

    <!-- 分类筛选 -->
    <scroll-view class="category-scroll" scroll-x enable-flex>
      <view class="category-list">
        <view
          class="category-item"
          :class="{ active: !materialStore.activeCategory }"
          @tap="handleCategoryTap('')"
        >
          <text class="category-text">全部</text>
        </view>
        <view
          v-for="item in materialStore.categories"
          :key="item.category"
          class="category-item"
          :class="{ active: materialStore.activeCategory === item.category }"
          @tap="handleCategoryTap(item.category)"
        >
          <text class="category-text">{{ item.category }}</text>
          <text class="category-count">({{ item.count }})</text>
        </view>
      </view>
    </scroll-view>

    <!-- 素材列表 -->
    <scroll-view
      class="material-list"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="handleRefresh"
      @scrolltolower="handleLoadMore"
    >
      <!-- 加载中 -->
      <LoadingSpinner v-if="materialStore.isLoading && materialStore.isEmpty" />

      <!-- 空状态 -->
      <EmptyState
        v-else-if="materialStore.isEmpty"
        text="暂无素材"
        :show-retry="true"
        @retry="handleRefresh"
      />

      <!-- 瀑布流布局 -->
      <view v-else class="waterfall">
        <view class="waterfall-column">
          <MaterialCard
            v-for="item in materialStore.leftColumn"
            :key="item.id"
            :material="item"
            :is-premium="userStore.isPremium"
            @tap="handleMaterialTap"
          />
        </view>
        <view class="waterfall-column">
          <MaterialCard
            v-for="item in materialStore.rightColumn"
            :key="item.id"
            :material="item"
            :is-premium="userStore.isPremium"
            @tap="handleMaterialTap"
          />
        </view>
      </view>

      <!-- 加载更多 -->
      <LoadingSpinner
        v-if="materialStore.isLoading && !materialStore.isEmpty"
        text="加载更多..."
      />

      <!-- 没有更多 -->
      <view v-if="!materialStore.hasMore && !materialStore.isEmpty" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { useMaterialStore } from '../../stores/material'
import { useUserStore } from '../../stores/user'
import MaterialCard from '../../components/MaterialCard.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import EmptyState from '../../components/EmptyState.vue'

const materialStore = useMaterialStore()
const userStore = useUserStore()

const searchKeyword = ref('')
const isRefreshing = ref(false)

// 页面加载
onMounted(() => {
  initData()
})

// 页面显示
onShow(() => {
  // 如果是从其他页面返回，可能需要刷新
})

// 初始化数据
const initData = async () => {
  await Promise.all([
    materialStore.loadCategories(),
    materialStore.loadMaterials(true)
  ])
}

// 搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    materialStore.searchMaterials(searchKeyword.value.trim())
  }
}

// 搜索输入
const handleSearchInput = (e) => {
  searchKeyword.value = e.detail.value
  // 实时搜索（防抖）
  if (!searchKeyword.value.trim()) {
    materialStore.searchMaterials('')
  }
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  materialStore.searchMaterials('')
}

// 分类点击
const handleCategoryTap = (category) => {
  materialStore.switchCategory(category)
}

// 下拉刷新
const handleRefresh = async () => {
  isRefreshing.value = true
  await materialStore.refresh()
  isRefreshing.value = false
}

// 加载更多
const handleLoadMore = () => {
  materialStore.loadMore()
}

// 素材点击
const handleMaterialTap = (material) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${material.id}`
  })
}

// 下拉刷新（uni-app 生命周期）
onPullDownRefresh(() => {
  handleRefresh()
  uni.stopPullDownRefresh()
})
</script>

<style lang="scss" scoped>
.page-index {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background: #ffffff;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 24rpx;
  height: 72rpx;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
  color: #333333;
}

.clear-button {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  font-size: 32rpx;
  color: #999999;
}

.category-scroll {
  background: #ffffff;
  white-space: nowrap;
  border-bottom: 1rpx solid #f0f0f0;
}

.category-list {
  display: inline-flex;
  padding: 16rpx 20rpx;
  gap: 16rpx;
}

.category-item {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 32rpx;
  white-space: nowrap;

  &.active {
    background: #333333;

    .category-text,
    .category-count {
      color: #ffffff;
    }
  }
}

.category-text {
  font-size: 24rpx;
  color: #666666;
}

.category-count {
  font-size: 20rpx;
  color: #999999;
  margin-left: 4rpx;
}

.material-list {
  flex: 1;
  height: 0;
}

.waterfall {
  display: flex;
  padding: 16rpx;
  gap: 16rpx;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.no-more {
  padding: 32rpx;
  text-align: center;
}

.no-more-text {
  font-size: 24rpx;
  color: #999999;
}
</style>
