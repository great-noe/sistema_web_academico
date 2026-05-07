<script setup>
import { computed } from 'vue'
import ReportCard from '../components/ReportCard.vue'
import { reportDefinitions } from '../servicios/reportes'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const isAdmin = computed(() => authStore.hasRole(['Administrador']))
const isDocente = computed(() => authStore.hasRole(['Docente']))
const isEstudiante = computed(() => authStore.hasRole(['Estudiante']))

const userRole = computed(() => authStore.userRole)

const filteredReports = computed(() => {
  return reportDefinitions.filter((r) => {
    return r.roles && r.roles.includes(userRole.value)
  })
})
</script>

<template>
  <div class="reportes-view">
    <header class="view-header">
      <p class="eyebrow">Módulo de Reportes</p>
      <h1>Centro de reportes</h1>
      <p class="lead">
        <template v-if="isAdmin">Acceso a todos los reportes del sistema: alumnos, cursos y docentes.</template>
        <template v-else-if="isDocente">Reportes de los cursos que impartes: notas y listado de alumnos.</template>
        <template v-else>Consulta tus notas, cursos inscritos e historial académico.</template>
      </p>
    </header>

    <div class="reports-container">
      <div v-if="filteredReports.length === 0" class="empty-state">
        <p>No hay reportes disponibles para tu rol.</p>
      </div>
      <div v-else class="reports-grid">
        <ReportCard
          v-for="report in filteredReports"
          :key="report.id"
          :definition="report"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.reportes-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.view-header h1 {
  font-family: var(--sans);
  font-size: 2.5rem;
  color: var(--heading);
  margin: 8px 0;
  font-weight: 800;
  letter-spacing: -1px;
}

.reports-container {
  background: var(--panel-strong);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: var(--muted);
}
</style>