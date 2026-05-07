<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../servicios/api'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const role = computed(() => authStore.userRole)

const isEstudiante = computed(() => role.value === 'Estudiante')
const isDocente = computed(() => role.value === 'Docente')
const isAdmin = computed(() => role.value === 'Administrador')

const stats = ref({
  docentes: 0,
  estudiantes: 0,
  materias: 0,
  cursos: 0,
  administrativos: 0,
  misCursos: 0,
  promedio: 0,
})
const loadingStats = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/dashboard/stats')
    stats.value = res.data
  } catch (e) {
    console.error('Error al cargar estadísticas', e)
  } finally {
    loadingStats.value = false
  }
})

const goTo = (path) => router.push(path)
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

    <div v-if="loadingStats" class="stats-grid">
      <div class="stat-card" v-for="n in 3" :key="n">
        <div class="stat-info"><h3>Cargando...</h3><p>&nbsp;</p></div>
      </div>
    </div>

    <!-- ADMINISTRADOR STATS -->
    <div v-else-if="isAdmin" class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon docs">👨‍🏫</div>
        <div class="stat-info">
          <h3>{{ stats.docentes }}</h3>
          <p>Docentes Activos</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon est">👨‍🎓</div>
        <div class="stat-info">
          <h3>{{ stats.estudiantes }}</h3>
          <p>Estudiantes Matriculados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon mat">📚</div>
        <div class="stat-info">
          <h3>{{ stats.materias }}</h3>
          <p>Materias Disponibles</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon admin">💼</div>
        <div class="stat-info">
          <h3>{{ stats.administrativos }}</h3>
          <p>Personal Administrativo</p>
        </div>
      </div>
    </div>

    <!-- DOCENTE STATS -->
    <div v-else-if="isDocente" class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon mat">📚</div>
        <div class="stat-info">
          <h3>{{ stats.cursos }}</h3>
          <p>Cursos Asignados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon est">👨‍🎓</div>
        <div class="stat-info">
          <h3>{{ stats.estudiantes }}</h3>
          <p>Alumnos Totales</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon docs">📝</div>
        <div class="stat-info">
          <h3>{{ stats.misCursos }}</h3>
          <p>Actas Pendientes</p>
        </div>
      </div>
    </div>

    <!-- ESTUDIANTE STATS -->
    <div v-else-if="isEstudiante" class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon docs">📝</div>
        <div class="stat-info">
          <h3>{{ stats.misCursos }}</h3>
          <p>Materias Inscritas</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon est">⭐</div>
        <div class="stat-info">
          <h3>{{ stats.promedio }}/100</h3>
          <p>Promedio Semestral</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon admin">📅</div>
        <div class="stat-info">
          <h3>Periodo Actual</h3>
          <p>Semestre en curso</p>
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
          
          <button v-if="isAdmin || isDocente" class="action-btn-large" @click="goTo('/cursos')">
            <span class="icon">📝</span>
            <span>{{ isAdmin ? 'Gestionar Notas' : 'Subir Calificaciones' }}</span>
          </button>
          
          <button v-if="isAdmin" class="action-btn-large" @click="goTo('/usuarios')">
            <span class="icon">➕</span>
            <span>Nuevo Curso/Usuario</span>
          </button>
          
          <button v-if="isEstudiante" class="action-btn-large" @click="goTo('/cursos')">
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
  background: var(--panel-strong);
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

.stat-icon.docs { background: rgba(56, 189, 248, 0.12); }
.stat-icon.est { background: rgba(52, 211, 153, 0.12); }
.stat-icon.mat { background: rgba(251, 191, 36, 0.12); }
.stat-icon.admin { background: rgba(129, 140, 248, 0.12); }

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
  background: var(--panel-strong);
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
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
