<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCursosStore } from '../stores/cursos'
import { useAuthStore } from '../stores/auth'
import api from '../servicios/api'

const cursosStore = useCursosStore()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.hasRole(['Administrador']))
const isDocente = computed(() => authStore.hasRole(['Docente']))
const isEstudiante = computed(() => authStore.hasRole(['Estudiante']))

const showModal = ref(false)
const showCalificacionesModal = ref(false)
const modalMode = ref('crear') // 'crear' | 'editar'
const currentCursoId = ref(null)
const docentesList = ref([])
const materiasList = ref([])
const calificacionesList = ref([])
const activeCurso = ref(null)

const formData = ref({
  codigo: '',
  nombre: '',
  periodo: '',
  gestion: new Date().getFullYear(),
  cupo: 40,
  docente_ci: '',
  materia_codigo: '',
  fecha_inicio: '',
  estado: 'activo'
})

const currentTab = ref('disponibles') // 'mis_cursos' | 'disponibles'

onMounted(async () => {
  // Configurar la pestaña por defecto para el estudiante
  if (!isEstudiante.value) {
    currentTab.value = 'mis_cursos'
  }
  
  loadCursos()
  
  if (isAdmin.value) {
    try {
      const [docResp, matResp] = await Promise.all([
        api.get('/usuarios/docentes'),
        api.get('/cursos/materias')
      ])
      docentesList.value = docResp.data
      materiasList.value = matResp.data
    } catch (e) {
      console.error('Error al cargar datos del formulario', e)
    }
  }
})

const loadCursos = () => {
  if (currentTab.value === 'mis_cursos') {
    cursosStore.fetchCursos()
  } else {
    cursosStore.fetchCursosDisponibles()
  }
}

const switchTab = (tab) => {
  currentTab.value = tab
  loadCursos()
}

const inscribirse = async (id) => {
  if (confirm('¿Deseas inscribirte en este curso?')) {
    const result = await cursosStore.inscribirCurso(id)
    alert(result.message)
    if (result.success) {
      loadCursos()
    }
  }
}

const openModal = (curso = null) => {
  if (curso) {
    modalMode.value = 'editar'
    currentCursoId.value = curso.id
    formData.value = { ...curso, docente_ci: curso.docente_ci || '' }
  } else {
    modalMode.value = 'crear'
    currentCursoId.value = null
    formData.value = {
      codigo: '',
      nombre: '',
      periodo: 'Semestre 1',
      gestion: new Date().getFullYear(),
      cupo: 40,
      docente_ci: '',
      materia_codigo: '',
      fecha_inicio: '',
      estado: 'activo'
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCurso = async () => {
  if (!formData.value.docente_ci) {
    alert('Debes asignar un docente al curso.')
    return
  }

  let result
  if (modalMode.value === 'crear') {
    result = await cursosStore.crearCurso(formData.value)
  } else {
    result = await cursosStore.editarCurso(currentCursoId.value, formData.value)
  }

  if (result.success) {
    closeModal()
  } else {
    alert(result.message)
  }
}

const deleteCurso = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
    const result = await cursosStore.eliminarCurso(id)
    if (!result.success) {
      alert(result.message)
    }
  }
}

const openCalificaciones = async (curso) => {
  activeCurso.value = curso
  calificacionesList.value = []
  
  const result = await cursosStore.getCalificaciones(curso.id)
  if (result.success) {
    calificacionesList.value = result.data.map(c => ({
      estudiante_ci: c.estudiante_ci,
      nombre: c.nombre,
      registro: c.registro,
      nota_final: c.nota_final || '',
      observaciones: c.observaciones || ''
    }))
    showCalificacionesModal.value = true
  } else {
    alert(result.message)
  }
}

watch(() => formData.value.materia_codigo, (newVal) => {
  if (!newVal || modalMode.value !== 'crear') return
  const materia = materiasList.value.find(m => m.codigo === newVal)
  if (materia) {
    formData.value.codigo = materia.codigo
    formData.value.nombre = materia.nombre
    formData.value.periodo = `Semestre ${materia.semestre}`
  }
})

const submitCalificaciones = async () => {
  const result = await cursosStore.saveCalificaciones(activeCurso.value.id, calificacionesList.value)
  if (result.success) {
    showCalificacionesModal.value = false
    alert(result.message)
  } else {
    alert(result.message)
  }
}
</script>

<template>
  <div class="cursos-view">
    <header class="view-header">
      <div class="header-content">
        <div>
          <p class="eyebrow">Gestión Académica</p>
          <h1>Gestión de Cursos</h1>
          <p class="lead">Administra los cursos, asignaciones y visualiza los detalles de la oferta académica.</p>
        </div>
        <button v-if="isAdmin" @click="openModal()" class="btn-primary new-btn">
          <span>+</span> Nuevo Curso
        </button>
      </div>
      
      <div v-if="isEstudiante" class="tabs-container">
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'mis_cursos' }" 
          @click="switchTab('mis_cursos')">
          Mis Cursos Inscritos
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'disponibles' }" 
          @click="switchTab('disponibles')">
          Cursos Disponibles
        </button>
      </div>
    </header>

    <div v-if="cursosStore.loading" class="loading-state">
      Cargando cursos...
    </div>

    <div v-else-if="cursosStore.error" class="error-state">
      {{ cursosStore.error }}
      <button @click="cursosStore.fetchCursos()" class="btn-secondary">Reintentar</button>
    </div>

    <div v-else-if="cursosStore.cursos.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <h2>No hay cursos disponibles</h2>
      <p>Aún no se han creado cursos en el sistema o no estás inscrito en ninguno.</p>
    </div>

    <div v-else class="cursos-grid">
      <article v-for="curso in cursosStore.cursos" :key="curso.id" class="curso-card">
        <header class="curso-header">
          <span class="curso-code">{{ curso.codigo }}</span>
          <span class="curso-id">#{{ curso.id }}</span>
          <span class="curso-status" :class="curso.estado.toLowerCase()">{{ curso.estado }}</span>
        </header>
        
        <h2>{{ curso.nombre }}</h2>
        
        <div class="curso-meta">
          <div class="meta-item">
            <span class="icon">📅</span>
            <span>{{ curso.periodo }} - {{ curso.gestion }}</span>
          </div>
          <div class="meta-item" v-if="curso.fecha_inicio">
            <span class="icon">📆</span>
            <span>{{ curso.fecha_inicio.slice(0,10) }} al {{ curso.fecha_fin?.slice(0,10) }}</span>
          </div>
          <div class="meta-item">
            <span class="icon">👨‍🏫</span>
            <span>{{ curso.docente_nombre || 'Docente sin asignar' }}</span>
          </div>
          <div class="meta-item" v-if="curso.inscritos !== undefined">
            <span class="icon">👥</span>
            <span>Cupos Disponibles: {{ curso.cupo - curso.inscritos }}</span>
          </div>
          <div class="meta-item" v-else>
            <span class="icon">👥</span>
            <span>Cupo Total: {{ curso.cupo }}</span>
          </div>
          <div class="meta-item" v-if="isEstudiante && currentTab === 'mis_cursos' && curso.nota_final !== undefined">
            <span class="icon">🎓</span>
            <strong>Nota Final: {{ curso.nota_final !== null ? curso.nota_final : 'Pendiente' }}</strong>
          </div>
        </div>

        <footer class="curso-footer" v-if="isAdmin || isDocente || (isEstudiante && currentTab === 'disponibles')">
          <template v-if="isAdmin">
            <button @click="openCalificaciones(curso)" class="btn-icon grades" title="Calificaciones">📝</button>
            <button @click="openModal(curso)" class="btn-icon edit" title="Editar">✏️</button>
            <button @click="deleteCurso(curso.id)" class="btn-icon delete" title="Eliminar">🗑️</button>
          </template>
          <template v-else-if="isDocente">
            <button @click="openCalificaciones(curso)" class="btn-icon grades" title="Calificaciones" style="width: auto; padding: 0 12px; font-size: 0.9rem;">📝 Calificar</button>
          </template>
          <template v-else-if="isEstudiante && currentTab === 'disponibles'">
            <button @click="inscribirse(curso.id)" class="btn-primary btn-full">
              Inscribirme
            </button>
          </template>
        </footer>
      </article>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>{{ modalMode === 'crear' ? 'Crear Nuevo Curso' : 'Editar Curso' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </header>
        <form @submit.prevent="saveCurso" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Código</label>
              <input v-model="formData.codigo" type="text" required placeholder="Ej: MAT-101" />
            </div>
            <div class="form-group">
              <label>Periodo</label>
              <input v-model="formData.periodo" type="text" required placeholder="Ej: Semestre 1" />
            </div>
          </div>
          
          <div class="form-group">
            <label>Nombre del Curso</label>
            <input v-model="formData.nombre" type="text" required placeholder="Ej: Cálculo I" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Gestión (Año)</label>
              <input v-model="formData.gestion" type="number" required />
            </div>
            <div class="form-group">
              <label>Cupo de estudiantes</label>
              <input v-model="formData.cupo" type="number" required min="1" max="200" />
            </div>
          </div>

          <div class="form-group">
            <label>Docente Asignado</label>
            <select v-model="formData.docente_ci" required>
              <option value="" disabled>Selecciona un docente</option>
              <option v-for="docente in docentesList" :key="docente.ci" :value="docente.ci">
                {{ docente.nombre }} ({{ docente.codigo_docente || 'Sin código' }})
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Fecha de Inicio</label>
              <input v-model="formData.fecha_inicio" type="date" required />
            </div>
            <div class="form-group" v-if="modalMode === 'crear'">
              <label>Materia</label>
              <select v-model="formData.materia_codigo">
                <option value="">Sin materia</option>
                <option v-for="m in materiasList" :key="m.codigo" :value="m.codigo">
                  {{ m.codigo }} - {{ m.nombre }} ({{ m.carrera }})
                </option>
              </select>
            </div>
          </div>

          <div class="form-group" v-if="modalMode === 'editar'">
            <label>Estado</label>
            <select v-model="formData.estado">
              <option value="activo">Activo</option>
              <option value="cerrado">Cerrado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <footer class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Curso</button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Modal Calificaciones -->
    <div v-if="showCalificacionesModal" class="modal-backdrop">
      <div class="modal modal-lg">
        <header class="modal-header">
          <div>
            <h2>Calificaciones: {{ activeCurso?.nombre }}</h2>
            <p style="margin:0; color:var(--muted); font-size: 0.9rem;">Código: {{ activeCurso?.codigo }}</p>
          </div>
          <button @click="showCalificacionesModal = false" class="close-btn">×</button>
        </header>
        <div class="modal-body">
          <div v-if="calificacionesList.length === 0" class="empty-state" style="padding: 24px;">
            <p>Aún no hay estudiantes inscritos en este curso.</p>
          </div>
          <form v-else @submit.prevent="submitCalificaciones" class="calificaciones-form">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Registro</th>
                  <th>Estudiante</th>
                  <th width="120">Nota Final</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="est in calificacionesList" :key="est.estudiante_ci">
                  <td class="mono">{{ est.registro || 'S/N' }}</td>
                  <td>{{ est.nombre }}</td>
                  <td>
                    <input type="number" v-model="est.nota_final" step="0.1" min="0" max="100" class="input-sm" placeholder="Ej: 85" />
                  </td>
                  <td>
                    <input type="text" v-model="est.observaciones" class="input-sm" placeholder="Observaciones opcionales..." />
                  </td>
                </tr>
              </tbody>
            </table>
            
            <footer class="modal-actions" style="margin-top: 24px;">
              <button type="button" @click="showCalificacionesModal = false" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar Calificaciones</button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursos-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.view-header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.view-header h1 {
  font-family: var(--sans);
  font-size: 2.5rem;
  color: var(--heading);
  margin: 8px 0;
  font-weight: 800;
  letter-spacing: -1px;
}

.new-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.new-btn span {
  font-size: 1.5rem;
  font-weight: normal;
}

.tabs-container {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 0;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--muted);
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--heading);
}

.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.loading-state, .error-state, .empty-state {
  background: var(--panel-strong);
  border-radius: var(--radius-lg);
  padding: 48px;
  text-align: center;
  border: 1px solid var(--line);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.curso-card {
  background: var(--panel-strong);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.curso-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: var(--shadow-hover);
}

.curso-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.curso-code {
  background: var(--bg);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-family: var(--mono);
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--accent-strong);
}

.curso-id {
  background: var(--accent-soft);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--accent-strong);
  margin-left: auto;
  margin-right: 8px;
}

.curso-status {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 999px;
}

.curso-status.activo { background: rgba(16, 185, 129, 0.12); color: var(--success); }
.curso-status.cerrado { background: rgba(245, 158, 11, 0.12); color: var(--warm); }
.curso-status.cancelado { background: rgba(239, 68, 68, 0.12); color: var(--danger); }

.curso-card h2 {
  font-size: 1.4rem;
  margin: 0 0 20px;
  line-height: 1.3;
}

.curso-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  flex: 1;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 0.95rem;
}

.curso-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.btn-icon {
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--bg);
  transform: translateY(-2px);
}

.btn-icon.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--danger);
}

.btn-full {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--panel-strong);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-hover);
  overflow: hidden;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--danger);
}

.modal-form {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--heading);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.modal-lg {
  max-width: 800px;
}

.modal-body {
  padding: 32px;
  max-height: 70vh;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px;
  background: var(--bg);
  color: var(--muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 700;
  border-bottom: 2px solid var(--line);
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.mono {
  font-family: var(--mono);
  font-size: 0.9rem;
}

.input-sm {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-family: var(--sans);
}
</style>
