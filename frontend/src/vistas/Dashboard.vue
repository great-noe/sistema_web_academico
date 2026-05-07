<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const role = computed(() => authStore.userRole)

const isEstudiante = computed(() => role.value === 'Estudiante')
const isDocente = computed(() => role.value === 'Docente')
const isAdmin = computed(() => role.value === 'Administrador')
</script>

<template>
  <div class="dashboard-view" v-if="user">
    <header class="view-header">
      <p class="eyebrow">Vista General</p>
      <h1>Hola, {{ user.name }}</h1>
      <p class="lead">
        <template v-if="isAdmin">Panel de control principal para la gestión académica institucional.</template>
        <template v-else-if="isDocente">Revisa tus cursos asignados y registra calificaciones.</template>
        <template v-else>Consulta tu información académica y descarga reportes de notas.</template>
      </p>
    </header>

    <!-- ADMINISTRADOR STATS -->
    <div v-if="isAdmin" class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon docs">👨‍🏫</div>
        <div class="stat-info">
          <h3>142</h3>
          <p>Docentes Activos</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon est">👨‍🎓</div>
        <div class="stat-info">
          <h3>3,245</h3>
          <p>Estudiantes Matriculados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon mat">📚</div>
        <div class="stat-info">
          <h3>86</h3>
          <p>Materias Disponibles</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon admin">💼</div>
        <div class="stat-info">
          <h3>24</h3>
          <p>Personal Administrativo</p>
        </div>
      </div>
    </div>

    <!-- DOCENTE STATS -->
    <div v-if="isDocente" class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon mat">📚</div>
        <div class="stat-info">
          <h3>4</h3>
          <p>Cursos Asignados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon est">👨‍🎓</div>
        <div class="stat-info">
          <h3>120</h3>
          <p>Alumnos Totales</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon docs">📝</div>
        <div class="stat-info">
          <h3>2</h3>
          <p>Actas Pendientes</p>
        </div>
      </div>
    </div>

    <!-- ESTUDIANTE STATS -->
    <div v-if="isEstudiante" class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon docs">📝</div>
        <div class="stat-info">
          <h3>5</h3>
          <p>Materias Inscritas</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon est">⭐</div>
        <div class="stat-info">
          <h3>85/100</h3>
          <p>Promedio Semestral</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon admin">📅</div>
        <div class="stat-info">
          <h3>Semestre 5</h3>
          <p>Periodo Actual</p>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <section class="panel recent-activity">
        <h2>Actividad Reciente</h2>
        <ul class="activity-list" v-if="isAdmin">
          <li>
            <div class="activity-icon">📝</div>
            <div class="activity-text">
              <strong>Nueva calificación registrada</strong>
              <span>Docente Carlos Ruiz evaluó "Base de Datos II"</span>
            </div>
            <span class="activity-time">Hace 2 horas</span>
          </li>
          <li>
            <div class="activity-icon">🎓</div>
            <div class="activity-text">
              <strong>Matriculación completada</strong>
              <span>María López se inscribió en el semestre actual</span>
            </div>
            <span class="activity-time">Hace 4 horas</span>
          </li>
        </ul>
        
        <ul class="activity-list" v-else-if="isDocente">
          <li>
            <div class="activity-icon">📝</div>
            <div class="activity-text">
              <strong>Calificación registrada</strong>
              <span>Evaluaste el Parcial 1 de "Base de Datos II"</span>
            </div>
            <span class="activity-time">Ayer</span>
          </li>
        </ul>

        <ul class="activity-list" v-else>
          <li>
            <div class="activity-icon">📄</div>
            <div class="activity-text">
              <strong>Reporte generado</strong>
              <span>Descargaste "Historial Académico"</span>
            </div>
            <span class="activity-time">Hace 1 día</span>
          </li>
          <li>
            <div class="activity-icon">⭐</div>
            <div class="activity-text">
              <strong>Nueva nota publicada</strong>
              <span>El docente de "Base de Datos II" publicó notas</span>
            </div>
            <span class="activity-time">Hace 3 días</span>
          </li>
        </ul>
      </section>

      <section class="panel quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <router-link to="/reportes" class="action-btn-large">
            <span class="icon">📊</span>
            <span>Descargar Reportes</span>
          </router-link>
          
          <button v-if="isAdmin || isDocente" class="action-btn-large">
            <span class="icon">📝</span>
            <span>{{ isAdmin ? 'Gestionar Notas' : 'Subir Calificaciones' }}</span>
          </button>
          
          <button v-if="isAdmin" class="action-btn-large">
            <span class="icon">➕</span>
            <span>Nuevo Curso/Usuario</span>
          </button>
          
          <button v-if="isEstudiante" class="action-btn-large">
            <span class="icon">📅</span>
            <span>Horarios</span>
          </button>
          
          <button v-if="isEstudiante" class="action-btn-large">
            <span class="icon">📚</span>
            <span>Inscripción</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.stat-icon.docs { background: #e0f2fe; }
.stat-icon.est { background: #dcfce7; }
.stat-icon.mat { background: #fef3c7; }
.stat-icon.admin { background: #f3e8ff; }

.stat-info h3 {
  margin: 0;
  font-size: 2rem;
  color: var(--heading);
  font-weight: 800;
}

.stat-info p {
  margin: 0;
  color: var(--muted);
  font-weight: 600;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background: white;
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
}

.panel h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 1.5rem;
  color: var(--heading);
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-list li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.activity-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-icon {
  width: 48px;
  height: 48px;
  background: var(--bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.activity-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-text strong {
  color: var(--heading);
  font-size: 1.1rem;
}

.activity-text span {
  color: var(--muted);
  font-size: 0.9rem;
}

.activity-time {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-btn-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px 16px;
  cursor: pointer;
  text-decoration: none;
  color: var(--heading);
  font-weight: 700;
  transition: all 0.3s ease;
  text-align: center;
}

.action-btn-large .icon {
  font-size: 2rem;
}

.action-btn-large:hover {
  background: var(--accent);
  color: white;
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
