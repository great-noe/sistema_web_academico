<script setup>
import { computed, reactive } from 'vue'
import { apiBase, buildReportUrl } from '../servicios/reportes'

const props = defineProps({
  definition: {
    type: Object,
    required: true,
  },
})

const form = reactive(
  props.definition.fields.reduce((accumulator, field) => {
    accumulator[field.name] = field.defaultValue ?? ''
    return accumulator
  }, {}),
)

const requiredFields = computed(() =>
  props.definition.fields.filter((field) => field.required),
)

const isReady = computed(() =>
  requiredFields.value.every((field) => String(form[field.name] ?? '').trim() !== ''),
)

const hintUrl = computed(() => {
  if (!isReady.value) {
    return ''
  }

  return buildReportUrl(props.definition, form, 'pdf')
})

function download(format) {
  if (!isReady.value) {
    return
  }

  const url = buildReportUrl(props.definition, form, format)
  window.open(url, '_blank', 'noopener')
}
</script>

<template>
  <article class="report-card">
    <header class="report-card__header">
      <p class="report-card__eyebrow">{{ definition.eyebrow }}</p>
      <h2>{{ definition.title }}</h2>
      <p class="report-card__description">{{ definition.description }}</p>
    </header>

    <div class="report-card__fields">
      <label
        v-for="field in definition.fields"
        :key="field.name"
        class="report-card__field"
      >
        <span>{{ field.label }}</span>
        <input
          v-model="form[field.name]"
          :type="field.type || 'text'"
          :placeholder="field.placeholder || ''"
        />
      </label>
    </div>

    <footer class="report-card__footer">
      <div class="report-card__actions">
        <button :disabled="!isReady" type="button" @click="download('pdf')">
          Descargar PDF
        </button>
        <button :disabled="!isReady" type="button" class="secondary" @click="download('excel')">
          Descargar Excel
        </button>
      </div>

      <p class="report-card__hint">
        <template v-if="hintUrl">
          Descarga directa desde <code>{{ apiBase }}</code>
        </template>
        <template v-else>
          Completa los campos requeridos para habilitar la descarga.
        </template>
      </p>
    </footer>
  </article>
</template>

<style scoped>
.report-card {
  padding: 24px;
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.report-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: var(--shadow-hover);
}

.report-card__header {
  margin-bottom: 20px;
}

.report-card__eyebrow {
  margin: 0 0 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--sans);
}

.report-card h2 {
  font-size: 1.5rem;
  margin: 0 0 8px;
}

.report-card__description {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.report-card__fields {
  display: grid;
  gap: 16px;
  margin: 20px 0;
  flex: 1;
}

.report-card__field {
  display: grid;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.report-card__footer {
  display: grid;
  gap: 16px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.report-card__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.report-card__actions button {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--sans-body);
}

.report-card__actions button.secondary {
  background: white;
  color: var(--text);
  border: 1px solid var(--line);
}

.report-card__actions button.secondary:hover:not(:disabled) {
  background: var(--bg);
}

.report-card__actions button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.report-card__actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.report-card__hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}
</style>
