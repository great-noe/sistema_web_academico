<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../servicios/api'

const authStore = useAuthStore()
const estudiantes = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/usuarios/estudiantes')
    estudiantes.value = res.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al cargar estudiantes'
    console.error('Error al cargar estudiantes:', e.response?.data || e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="view">
    <header class="view-header">
      <p class="eyebrow">Módulo</p>
      <h1>Gestión de Estudiantes</h1>
      <p class="lead">Listado de estudiantes registrados en el sistema.</p>
    </header>

    <div class="panel">
      <div v-if="loading" class="state-text">Cargando estudiantes...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>
      <div v-else-if="estudiantes.length === 0" class="state-text">No hay estudiantes registrados.</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>CI</th>
            <th>Registro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in estudiantes" :key="e.ci">
            <td>{{ e.nombres }}</td>
            <td>{{ e.apellidos }}</td>
            <td>{{ e.email }}</td>
            <td class="mono">{{ e.ci }}</td>
            <td>{{ e.registro || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.view { display: flex; flex-direction: column; gap: 32px; }
.view-header h1 { font-size: 2.5rem; color: var(--heading); margin: 8px 0; font-weight: 800; letter-spacing: -1px; }
.panel { background: var(--panel-strong); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow); border: 1px solid var(--line); }
.state-text { text-align: center; padding: 40px; color: var(--muted); }
.state-text.error { color: var(--danger); }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; padding: 12px; background: var(--bg); color: var(--muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 700; border-bottom: 2px solid var(--line); }
.table td { padding: 12px; border-bottom: 1px solid var(--line); }
.table tbody tr:hover { background: var(--bg); }
.mono { font-family: var(--mono); font-size: 0.9rem; }
</style>
