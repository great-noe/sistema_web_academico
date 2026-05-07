import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api/usuarios'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getConfig = () => {
    const token = localStorage.getItem('token')
    return {
      headers: { Authorization: `Bearer ${token}` }
    }
  }

  const fetchUsuarios = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(API_URL, getConfig())
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
      const response = await axios.post(API_URL, userData, getConfig())
      return { success: true, message: 'Usuario creado exitosamente', data: response.data.user }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.response?.data?.message || 'Error al crear usuario' }
    }
  }

  const editarUsuario = async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData, getConfig())
      return { success: true, message: 'Usuario actualizado exitosamente', data: response.data.user }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.response?.data?.message || 'Error al actualizar usuario' }
    }
  }

  const eliminarUsuario = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig())
      usuarios.value = usuarios.value.filter(u => u.id !== id)
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
