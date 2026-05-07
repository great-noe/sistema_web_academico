<script setup>
import { ref, onMounted } from 'vue'
import api from '../servicios/api'

const carreras = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadCarreras()
})

async function loadCarreras() {
  loading.value = true
  try {
    const res = await api.get('/carreras')
    carreras.value = res.data
  } catch (e) {
    console.error('Error al cargar carreras', e)
  } finally {
    loading.value = false
  }
}

async function toggleCarrera(codigo) {
  try {
    await api.patch(`/carreras/${codigo}/toggle`)
    await loadCarreras()
  } catch (e) {
    console.error('Error al cambiar estado', e)
  }
}

async function toggleMateria(codigo) {
  try {
    await api.patch(`/carreras/materias/${codigo}/toggle`)
    await loadCarreras()
  } catch (e) {
    console.error('Error al cambiar estado', e)
  }
}
</script>

<template>
  <div class="carreras-view">
    <header class="view-header">
      <p class="eyebrow">Gestión Académica</p>
      <h1>Carreras y Materias</h1>
      <p class="lead">Administra las carreras y sus materias. Puedes habilitar o deshabilitar cada una.</p>
    </header>

    <div v-if="loading" class="loading-state">Cargando carreras...</div>

    <div v-else-if="carreras.length === 0" class="empty-state">
      <p>No hay carreras registradas.</p>
    </div>

    <div v-else class="carreras-list">
      <article v-for="carrera in carreras" :key="carrera.codigo" class="carrera-card" :class="{ disabled: !carrera.activo }">
        <header class="carrera-header">
          <div>
            <h2>{{ carrera.nombre }}</h2>
            <span class="carrera-code">{{ carrera.codigo }}</span>
            <span class="carrera-semestres">{{ carrera.semestres }} semestres</span>
          </div>
          <button @click="toggleCarrera(carrera.codigo)" class="toggle-btn" :class="carrera.activo ? 'on' : 'off'">
            {{ carrera.activo ? 'Habilitada' : 'Deshabilitada' }}
          </button>
        </header>

        <div class="materias-grid">
          <div v-for="materia in carrera.materias" :key="materia.codigo"
            class="materia-item" :class="{ disabled: !materia.activo }">
            <div class="materia-info">
              <span class="materia-codigo">{{ materia.codigo }}</span>
              <span class="materia-nombre">{{ materia.nombre }}</span>
              <span class="materia-semestre">Sem {{ materia.semestre }}</span>
              <span class="materia-creditos">{{ materia.creditos }} {{ materia.tipo_valor }}</span>
            </div>
            <button @click="toggleMateria(materia.codigo)" class="toggle-sm" :class="materia.activo ? 'on' : 'off'">
              {{ materia.activo ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.carreras-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.carreras-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.carrera-card {
  background: var(--panel-strong);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
}

.carrera-card.disabled {
  opacity: 0.6;
}

.carrera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.carrera-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.carrera-code {
  font-family: var(--mono);
  font-size: 0.85rem;
  background: var(--bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  margin-right: 8px;
}

.carrera-semestres {
  color: var(--muted);
  font-size: 0.85rem;
}

.toggle-btn {
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
}

.toggle-btn.on { background: rgba(52, 211, 153, 0.15); color: var(--success); }
.toggle-btn.off { background: rgba(239, 68, 68, 0.15); color: var(--danger); }

.materias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 8px;
}

.materia-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg);
  gap: 12px;
}

.materia-item.disabled {
  opacity: 0.5;
}

.materia-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.materia-codigo {
  font-family: var(--mono);
  font-size: 0.8rem;
  background: var(--accent-soft);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent-strong);
}

.materia-nombre {
  font-weight: 600;
  font-size: 0.95rem;
}

.materia-semestre {
  font-size: 0.8rem;
  color: var(--muted);
}

.materia-creditos {
  font-size: 0.8rem;
  background: rgba(251, 191, 36, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--warm);
}

.toggle-sm {
  padding: 4px 10px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.toggle-sm.on { background: rgba(52, 211, 153, 0.15); color: var(--success); }
.toggle-sm.off { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
</style>
