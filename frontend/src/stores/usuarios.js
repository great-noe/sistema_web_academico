import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../servicios/api'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsuarios = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/usuarios')
      usuarios.value = response.data
    } catch (err) {
      error.value = 'Error al cargar usuarios'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const crearUsuario = async (userData) => {
    try {
      const response = await api.post('/usuarios', userData)
      return { success: true, message: 'Usuario creado exitosamente', data: response.data.user }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.response?.data?.message || 'Error al crear usuario' }
    }
  }

  const editarUsuario = async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData)
      return { success: true, message: 'Usuario actualizado exitosamente', data: response.data.user }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.response?.data?.message || 'Error al actualizar usuario' }
    }
  }

  const eliminarUsuario = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`)
      usuarios.value = usuarios.value.filter(u => u.ci !== id)
      return { success: true, message: 'Usuario eliminado' }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.response?.data?.message || 'Error al eliminar usuario' }
    }
  }

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
  }
})