/**
 * 用户相关 API
 */
import { get, post, put } from './request'

/**
 * 微信登录
 */
export const login = (code) => {
  return post('/user/login', { code })
}

/**
 * 获取用户资料
 */
export const getProfile = () => {
  return get('/user/profile')
}

/**
 * 更新用户资料
 */
export const updateProfile = (data) => {
  return put('/user/profile', data)
}

/**
 * 获取会员状态
 */
export const getPremiumStatus = () => {
  return get('/user/premium-status')
}

/**
 * 获取用户统计信息
 */
export const getUserStats = () => {
  return get('/user/stats')
}
