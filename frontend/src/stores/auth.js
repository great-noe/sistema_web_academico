import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)

  async function login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: username,
        password
      })

      const { token: tokenData, user: userData } = response.data
      
      // Normalizar el rol para que coincida en todo el frontend
      if (userData.role === 'Admin' || userData.role === 'admin') userData.role = 'Administrador'
      else if (userData.role === 'Docente' || userData.role === 'docente') userData.role = 'Docente'
      else if (userData.role === 'Estudiante' || userData.role === 'estudiante') userData.role = 'Estudiante'

      token.value = tokenData
      user.value = userData
      
      localStorage.setItem('token', tokenData)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`
      
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
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }

  function init() {
    const savedUser = localStorage.getItem('auth_user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
  }

  async function updateProfile(data) {
    try {
      const response = await axios.put(`${API_URL}/profile`, data)
      const updatedUser = response.data.user
      
      const roleName = updatedUser.rol.charAt(0).toUpperCase() + updatedUser.rol.slice(1);
      const avatar = updatedUser.rol === 'admin' ? '💼' : updatedUser.rol === 'docente' ? '👨‍🏫' : '👨‍🎓';

      user.value = {
        id: updatedUser.id,
        name: `${updatedUser.nombres} ${updatedUser.apellidos}`,
        role: roleName,
        email: updatedUser.email,
        avatar
      }
      localStorage.setItem('auth_user', JSON.stringify(user.value))
      
      return { success: true, message: 'Perfil actualizado exitosamente' }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al actualizar el perfil' }
    }
  }

  async function updatePassword(currentPassword, newPassword) {
    try {
      const response = await axios.put(`${API_URL}/profile/password`, { currentPassword, newPassword })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al cambiar la contraseña' }
    }
  }

  function hasRole(requiredRoles) {
    if (!user.value) return false
    
    // Normalize role string to match requirements ('Admin' -> 'Administrador')
    let normalizedRole = user.value.role
    if (normalizedRole === 'Admin' || normalizedRole === 'admin') normalizedRole = 'Administrador'
    else if (normalizedRole === 'Docente' || normalizedRole === 'docente') normalizedRole = 'Docente'
    else if (normalizedRole === 'Estudiante' || normalizedRole === 'estudiante') normalizedRole = 'Estudiante'
    
    return requiredRoles.includes(normalizedRole)
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    logout,
    init,
    hasRole,
    updateProfile,
    updatePassword
  }
})
