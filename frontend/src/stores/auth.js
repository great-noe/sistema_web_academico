import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../servicios/api'

const normalizeRole = (role) => {
  if (!role) return null
  const lower = role.toLowerCase()
  if (lower === 'admin') return 'Administrador'
  if (lower === 'docente') return 'Docente'
  if (lower === 'estudiante') return 'Estudiante'
  return role
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userId = computed(() => user.value?.ci)

  async function login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        email: username,
        password
      })

      const { token: tokenData, user: userData } = response.data

      userData.role = normalizeRole(userData.role)

      token.value = tokenData
      user.value = userData

      localStorage.setItem('token', tokenData)
      localStorage.setItem('auth_user', JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al conectar con el servidor'
      return { success: false, message }
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('auth_user')
    router.push('/login')
  }

  function init() {
    const savedUser = localStorage.getItem('auth_user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      const parsed = JSON.parse(savedUser)
      parsed.role = normalizeRole(parsed.role)
      user.value = parsed
      token.value = savedToken
    }
  }

  async function updateProfile(data) {
    try {
      const response = await api.put('/auth/profile', data)
      const updatedUser = response.data.user

      user.value = {
        ci: updatedUser.ci,
        name: `${updatedUser.nombres} ${updatedUser.apellidos}`,
        role: normalizeRole(updatedUser.rol),
        email: updatedUser.email,
        avatar: updatedUser.rol === 'admin' ? '💼' : updatedUser.rol === 'docente' ? '👨‍🏫' : '👨‍🎓'
      }
      localStorage.setItem('auth_user', JSON.stringify(user.value))

      return { success: true, message: 'Perfil actualizado exitosamente' }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al actualizar el perfil' }
    }
  }

  async function updatePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/profile/password', { currentPassword, newPassword })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al cambiar la contraseña' }
    }
  }

  function hasRole(requiredRoles) {
    if (!user.value) return false
    return requiredRoles.includes(normalizeRole(user.value.role))
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    userId,
    login,
    logout,
    init,
    hasRole,
    updateProfile,
    updatePassword
  }
})
