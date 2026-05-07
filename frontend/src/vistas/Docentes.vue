<script setup>
import { ref, onMounted } from 'vue'
import api from '../servicios/api'

const docentes = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/usuarios/docentes')
    docentes.value = res.data
  } catch (e) {
    error.value = 'Error al cargar docentes'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="view">
    <header class="view-header">
      <p class="eyebrow">Módulo</p>
      <h1>Gestión de Docentes</h1>
      <p class="lead">Listado del personal docente registrado en el sistema.</p>
    </header>

    <div class="panel">
      <div v-if="loading" class="state-text">Cargando docentes...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>
      <div v-else-if="docentes.length === 0" class="state-text">No hay docentes registrados.</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Docente</th>
            <th>Código</th>
            <th>CI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in docentes" :key="d.ci">
            <td>{{ d.nombre }}</td>
            <td class="mono">{{ d.codigo_docente || '-' }}</td>
            <td class="mono">{{ d.ci }}</td>
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
