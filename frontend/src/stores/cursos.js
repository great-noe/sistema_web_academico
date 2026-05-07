import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api/cursos'

export const useCursosStore = defineStore('cursos', () => {
  const cursos = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCursos() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(API_URL)
      cursos.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar los cursos'
    } finally {
      loading.value = false
    }
  }

  async function crearCurso(cursoData) {
    try {
      const response = await axios.post(API_URL, cursoData)
      cursos.value.unshift(response.data.curso)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al crear curso' }
    }
  }

  async function editarCurso(id, cursoData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, cursoData)
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
      const response = await axios.get(`${API_URL}/disponibles`)
      cursos.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar los cursos disponibles'
    } finally {
      loading.value = false
    }
  }

  async function inscribirCurso(id) {
    try {
      const response = await axios.post(`${API_URL}/${id}/inscribir`)
      // Remover curso de la lista si estábamos en la vista de 'disponibles'
      cursos.value = cursos.value.filter(c => c.id !== id)
      return { success: true, message: response.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al inscribirse' }
    }
  }

  async function eliminarCurso(id) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      cursos.value = cursos.value.filter(c => c.id !== id)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al eliminar curso' }
    }
  }

  async function getCalificaciones(cursoId) {
    try {
      const response = await axios.get(`${API_URL}/${cursoId}/calificaciones`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al cargar calificaciones' }
    }
  }

  async function saveCalificaciones(cursoId, calificaciones) {
    try {
      const response = await axios.put(`${API_URL}/${cursoId}/calificaciones`, { calificaciones })
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
