<script setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import { buildReportUrl } from '../servicios/reportes'
import { useAuthStore } from '../stores/auth'
import api, { API_BASE } from '../servicios/api'

const authStore = useAuthStore()

const props = defineProps({
  definition: { type: Object, required: true },
})

const userRole = computed(() => authStore.userRole)
const userId = computed(() => authStore.user?.ci)

const form = reactive({})
for (const field of props.definition.fields) {
  form[field.key] = field.defaultValue ?? ''
}

watchEffect(() => {
  const uid = userId.value
  for (const field of props.definition.fields) {
    if (field.autoFillRole && userRole.value === field.autoFillRole && uid) {
      if (form[field.key] !== uid) {
        form[field.key] = uid
      }
    }
  }
})

const requiredFields = computed(() =>
  props.definition.fields.filter((f) => f.required && f.autoFillRole !== userRole.value),
)

const isReady = computed(() => {
  const manual = requiredFields.value
  return manual.length === 0 || manual.every((f) => String(form[f.key] ?? '').trim() !== '')
})

const isAutoFilled = computed(() =>
  props.definition.fields.some((f) => f.autoFillRole === userRole.value),
)

const previewData = ref(null)
const previewLoading = ref(false)
const previewError = ref(null)

const downloadFormat = ref('pdf')

const courses = ref([])

const hasCourseField = computed(() => props.definition.fields.some((f) => f.key === 'courseId'))

if (hasCourseField.value) {
  api.get('/cursos')
    .then((r) => { courses.value = r.data })
    .catch(() => {})
}

function paramsResolved(url) {
  return !url.includes(':studentCi') && !url.includes(':courseId') && !url.includes(':teacherCi')
}

async function loadPreview() {
  if (!isReady.value) return
  const url = buildReportUrl(props.definition, form, 'json')
  if (!paramsResolved(url)) {
    previewError.value = 'Completa todos los campos requeridos.'
    return
  }
  previewLoading.value = true
  previewError.value = null
  try {
    const res = await api.get(url.replace(API_BASE, ''))
    previewData.value = res.data
  } catch (err) {
    previewError.value = err.response?.data?.message || 'Error al cargar datos'
    previewData.value = null
  } finally {
    previewLoading.value = false
  }
}

watchEffect(() => {
  if (isReady.value && isAutoFilled.value && paramsResolved(buildReportUrl(props.definition, form, 'json'))) {
    loadPreview()
  }
})

const downloading = ref(false)

async function download() {
  if (!isReady.value || downloading.value) return
  downloading.value = true
  try {
    const url = buildReportUrl(props.definition, form, downloadFormat.value)
    const response = await api.get(url.replace(API_BASE, ''), {
      responseType: 'blob',
    })
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const ext = downloadFormat.value === 'excel' ? 'xlsx' : 'pdf'
    link.download = `${props.definition.id}.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (err) {
    console.error('Error al descargar reporte', err)
  } finally {
    downloading.value = false
  }
}

const hasData = computed(() => previewData.value && previewData.value.rows && previewData.value.rows.length > 0)
const columns = computed(() => previewData.value?.columns || [])
const rows = computed(() => previewData.value?.rows || [])
</script>

<template>
  <article class="report-card">
    <header class="report-card__header">
      <p class="report-card__eyebrow">{{ definition.eyebrow }}</p>
      <h2>{{ definition.title }}</h2>
      <p class="report-card__description">{{ definition.description }}</p>
    </header>

    <div class="report-card__fields">
      <label v-for="field in definition.fields" :key="field.key" class="report-card__field">
        <span>{{ field.label }}</span>
        <select
          v-if="field.key === 'courseId' && courses.length > 0"
          v-model="form[field.key]" @change="loadPreview"
        >
          <option value="" disabled>Selecciona un curso</option>
          <option v-for="c in courses" :key="c.id" :value="c.id">
            {{ c.codigo }} - {{ c.nombre }} (ID: {{ c.id }})
          </option>
        </select>
        <input
          v-else-if="field.autoFillRole === userRole"
          v-model="form[field.key]" type="text" disabled
        />
        <select
          v-else-if="field.key === 'courseId' && courses.length === 0"
          v-model="form[field.key]"
        >
          <option value="" disabled>No hay cursos disponibles</option>
        </select>
        <input
          v-else v-model="form[field.key]"
          :type="field.type || 'text'"
          :placeholder="field.placeholder || ''"
        />
      </label>
      <p v-if="isAutoFilled" class="report-card__autohint">
        Campo autocompletado con tus datos.
      </p>
    </div>

    <div v-if="isReady" class="report-card__preview-actions">
      <button v-if="!isAutoFilled" class="btn-preview" @click="loadPreview" :disabled="previewLoading">
        {{ previewLoading ? 'Cargando...' : 'Previsualizar' }}
      </button>
      <div v-if="hasData" class="preview-downloads">
        <div class="export-group">
          <select v-model="downloadFormat" class="format-select">
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
          <button class="btn-download" @click="download" :disabled="downloading">
            {{ downloading ? 'Descargando...' : 'Exportar' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="previewLoading" class="preview-status">Cargando datos...</div>

    <div v-else-if="previewError" class="preview-status error">{{ previewError }}</div>

    <div v-else-if="previewData && !hasData" class="preview-status">
      {{ previewData.emptyMessage || 'No se encontraron datos.' }}
    </div>

    <div v-else-if="hasData" class="report-card__preview">
      <table class="preview-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td v-for="col in columns" :key="col.key">{{ row[col.key] ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p class="preview-total">{{ rows.length }} registro(s)</p>
    </div>
  </article>
</template>

<style scoped>
.report-card {
  padding: 24px;
  background: var(--panel-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.report-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: var(--shadow-hover);
}
.report-card__header { margin-bottom: 4px; }
.report-card__eyebrow {
  margin: 0 0 6px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--accent); font-size: 0.75rem; font-weight: 700; font-family: var(--sans);
}
.report-card h2 { font-size: 1.5rem; margin: 0 0 6px; }
.report-card__description { margin: 0; color: var(--muted); font-size: 0.95rem; }
.report-card__fields { display: grid; gap: 12px; }
.report-card__field { display: grid; gap: 6px; font-weight: 600; font-size: 0.9rem; }
.report-card__field input:disabled { background: var(--bg); color: var(--text); opacity: 0.8; cursor: not-allowed; }
.report-card__autohint { margin: 0; font-size: 0.8rem; color: var(--accent); font-style: italic; }

.report-card__preview-actions {
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
}
.btn-preview {
  background: var(--accent); color: #fff; border: none;
  padding: 10px 20px; border-radius: var(--radius-md); font-weight: 600;
  cursor: pointer; transition: all 0.2s; font-family: var(--sans-body);
}
.btn-preview:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px var(--accent-soft); }
.btn-preview:disabled { opacity: 0.5; cursor: not-allowed; }
.preview-downloads { display: flex; gap: 8px; margin-left: auto; }

.export-group {
  display: flex;
  gap: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--line);
}
.format-select {
  border: none;
  border-right: 1px solid var(--line);
  background: var(--panel-strong);
  padding: 8px 6px;
  font-weight: 600;
  font-size: 0.8rem;
  font-family: var(--sans-body);
  cursor: pointer;
  outline: none;
}
.btn-download {
  border: none;
  background: var(--accent);
  color: white;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--sans-body);
  white-space: nowrap;
}
.btn-download:hover:not(:disabled) { background: var(--accent-hover, #4338ca); }
.btn-download:disabled { opacity: 0.5; cursor: not-allowed; }

.preview-status { padding: 20px; text-align: center; color: var(--muted); font-size: 0.95rem; }
.preview-status.error { color: var(--danger); background: rgba(239, 68, 68, 0.1); border-radius: var(--radius-md); }

.report-card__preview {
  border: 1px solid var(--line); border-radius: var(--radius-md); overflow-x: auto;
}
.preview-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.preview-table th {
  text-align: left; padding: 10px 12px; background: var(--bg);
  color: var(--muted); font-size: 0.8rem; text-transform: uppercase; font-weight: 700;
  border-bottom: 2px solid var(--line); white-space: nowrap;
}
.preview-table td { padding: 8px 12px; border-bottom: 1px solid var(--line); }
.preview-table tbody tr:hover { background: var(--bg); }
.preview-total { margin: 8px 0 0; font-size: 0.8rem; color: var(--muted); text-align: right; }
</style>
