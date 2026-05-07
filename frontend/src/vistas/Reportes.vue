<script setup>
import ReportCard from '../components/ReportCard.vue'
import { apiBase, reportDefinitions } from '../servicios/reportes'
</script>

<template>
  <div class="reportes-view">
    <header class="view-header">
      <p class="eyebrow">Módulo de Reportes</p>
      <h1>Centro de reportes RF12</h1>
      <p class="lead">
        Esta interfaz deja listas las descargas directas en PDF y Excel para
        alumno, curso y docente, incluyendo el historial académico y los listados detallados.
      </p>
    </header>

    <div class="reports-container">
      <div class="reports-grid">
        <ReportCard
          v-for="report in reportDefinitions"
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
  background: white;
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
</style>
