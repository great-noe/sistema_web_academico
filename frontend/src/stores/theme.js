import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const stored = localStorage.getItem('theme') || 'light'
  const theme = ref(stored)

  function applyTheme(val) {
    document.documentElement.setAttribute('data-theme', val)
    localStorage.setItem('theme', val)
  }

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function init() {
    applyTheme(theme.value)
  }

  watch(theme, applyTheme)

  return { theme, toggle, init }
})
