import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'custom_tools'

// 默认工具（8 个）
const DEFAULT_TOOLS = [
  { id: 'default-1', name: 'Notion', description: '万能笔记和项目管理工具', icon: '📝', url: 'https://www.notion.so', isDefault: true },
  { id: 'default-2', name: 'Canva', description: '在线设计平台，海量模板', icon: '🎨', url: 'https://www.canva.cn', isDefault: true },
  { id: 'default-3', name: 'Color Hunt', description: '精选配色方案集合', icon: '🎯', url: 'https://colorhunt.co', isDefault: true },
  { id: 'default-4', name: 'Coolors', description: '快速生成配色方案', icon: '🌈', url: 'https://coolors.co', isDefault: true },
  { id: 'default-5', name: 'Google Fonts', description: '免费开源字体库', icon: '🔤', url: 'https://fonts.google.com', isDefault: true },
  { id: 'default-6', name: 'DaFont', description: '英文字体下载站', icon: '✒️', url: 'https://www.dafont.com', isDefault: true },
  { id: 'default-7', name: 'Freepik', description: '免费矢量图和 PSD 素材', icon: '🖼️', url: 'https://www.freepik.com', isDefault: true },
  { id: 'default-8', name: 'Unsplash', description: '高质量免费图片', icon: '📷', url: 'https://unsplash.com', isDefault: true }
]

export const useToolsStore = defineStore('tools', () => {
  // 自定义工具列表
  const customTools = ref([])

  // 所有工具（默认 + 自定义）
  const allTools = computed(() => [...DEFAULT_TOOLS, ...customTools.value])

  // 是否有自定义工具
  const hasCustomTools = computed(() => customTools.value.length > 0)

  // 加载本地存储的自定义工具
  function loadCustomTools() {
    try {
      const stored = uni.getStorageSync(STORAGE_KEY)
      if (stored) {
        customTools.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('加载自定义工具失败:', e)
      customTools.value = []
    }
  }

  // 保存到本地存储
  function saveToStorage() {
    try {
      uni.setStorageSync(STORAGE_KEY, JSON.stringify(customTools.value))
    } catch (e) {
      console.error('保存自定义工具失败:', e)
    }
  }

  // 添加自定义工具
  function addTool(tool) {
    const newTool = {
      id: 'custom-' + Date.now(),
      name: tool.name,
      description: tool.description,
      icon: tool.icon || '🔧',
      url: tool.url,
      isDefault: false
    }
    customTools.value.push(newTool)
    saveToStorage()
    return newTool
  }

  // 删除自定义工具
  function removeTool(toolId) {
    customTools.value = customTools.value.filter(t => t.id !== toolId)
    saveToStorage()
  }

  return {
    customTools,
    allTools,
    hasCustomTools,
    loadCustomTools,
    addTool,
    removeTool
  }
})
