/**
 * 请求封装
 * 统一处理请求拦截、响应拦截、错误处理
 */

// API 基础地址
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Mock 模式
const IS_MOCK = import.meta.env.VITE_API_MODE === 'mock'

/**
 * 封装 uni.request
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // Mock 模式处理
    if (IS_MOCK) {
      return handleMockRequest(options, resolve, reject)
    }

    // 获取 token
    const token = uni.getStorageSync('token')

    // 构建请求头
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }

    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    // 发起请求
    uni.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
      success: (res) => {
        // 处理响应
        if (res.statusCode === 200) {
          const data = res.data
          if (data.success) {
            resolve(data.data)
          } else {
            // 业务错误
            const errorMsg = data.error?.message || '请求失败'
            const errorCode = data.error?.statusCode
            reject({ message: errorMsg, code: errorCode })
          }
        } else if (res.statusCode === 401) {
          // Token 过期或无效，清除登录状态
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          // 跳转到登录或首页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/profile/profile'
            })
          }, 1500)
          reject({ message: '未授权', code: 401 })
        } else {
          // 其他 HTTP 错误
          const errorMsg = res.data?.error?.message || `请求失败 (${res.statusCode})`
          reject({ message: errorMsg, code: res.statusCode })
        }
      },
      fail: (err) => {
        // 网络错误
        console.error('请求失败:', err)
        uni.showToast({
          title: '网络连接失败，请检查网络',
          icon: 'none'
        })
        reject({ message: '网络连接失败', code: -1 })
      }
    })
  })
}

/**
 * Mock 请求处理
 */
const handleMockRequest = (options, resolve, reject) => {
  // 模拟网络延迟
  setTimeout(() => {
    const url = options.url
    let mockData = null

    // 根据 URL 匹配 Mock 数据
    if (url.includes('/user/login')) {
      mockData = require('../../mock/user-login.json')
    } else if (url.includes('/user/profile')) {
      mockData = require('../../mock/user-profile.json')
    } else if (url.includes('/user/stats')) {
      mockData = require('../../mock/user-stats.json')
    } else if (url.includes('/materials/categories')) {
      mockData = require('../../mock/materials-categories.json')
    } else if (url.includes('/materials/search')) {
      mockData = require('../../mock/materials-list.json')
    } else if (url.includes('/materials/')) {
      mockData = require('../../mock/material-detail.json')
    } else if (url.includes('/materials')) {
      mockData = require('../../mock/materials-list.json')
    } else if (url.includes('/redeem/verify')) {
      mockData = require('../../mock/redeem-verify.json')
    } else if (url.includes('/redeem/activate')) {
      mockData = require('../../mock/redeem-activate.json')
    } else if (url.includes('/download/records')) {
      mockData = require('../../mock/download-record.json')
    }

    if (mockData) {
      resolve(mockData.data)
    } else {
      reject({ message: 'Mock 数据不存在', code: 404 })
    }
  }, 300)
}

/**
 * GET 请求
 */
export const get = (url, data) => {
  return request({ url, method: 'GET', data })
}

/**
 * POST 请求
 */
export const post = (url, data) => {
  return request({ url, method: 'POST', data })
}

/**
 * PUT 请求
 */
export const put = (url, data) => {
  return request({ url, method: 'PUT', data })
}

/**
 * DELETE 请求
 */
export const del = (url, data) => {
  return request({ url, method: 'DELETE', data })
}

export default request
