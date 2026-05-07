import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../servicios/api'

export const useCursosStore = defineStore('cursos', () => {
  const cursos = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCursos() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/cursos')
      cursos.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar los cursos'
    } finally {
      loading.value = false
    }
  }

  async function crearCurso(cursoData) {
    try {
      const response = await api.post('/cursos', cursoData)
      cursos.value.unshift(response.data.curso)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al crear curso' }
    }
  }

  async function editarCurso(id, cursoData) {
    try {
      const response = await api.put(`/cursos/${id}`, cursoData)
      const index = cursos.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cursos.value[index] = response.data.curso
      }
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al actualizar curso' }
    }
  }

  async function fetchCursosDisponibles() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/cursos/disponibles')
      cursos.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar los cursos disponibles'
    } finally {
      loading.value = false
    }
  }

  async function inscribirCurso(id) {
    try {
      const response = await api.post(`/cursos/${id}/inscribir`)
      cursos.value = cursos.value.filter(c => c.id !== id)
      return { success: true, message: response.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al inscribirse' }
    }
  }

  async function eliminarCurso(id) {
    try {
      await api.delete(`/cursos/${id}`)
      cursos.value = cursos.value.filter(c => c.id !== id)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al eliminar curso' }
    }
  }

  async function getCalificaciones(cursoId) {
    try {
      const response = await api.get(`/cursos/${cursoId}/calificaciones`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al cargar calificaciones' }
    }
  }

  async function saveCalificaciones(cursoId, calificaciones) {
    try {
      const response = await api.put(`/cursos/${cursoId}/calificaciones`, { calificaciones })
      return { success: true, message: response.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al guardar calificaciones' }
    }
  }

  return {
    cursos,
    loading,
    error,
    fetchCursos,
    fetchCursosDisponibles,
    inscribirCurso,
    crearCurso,
    editarCurso,
    eliminarCurso,
    getCalificaciones,
    saveCalificaciones
  }
})