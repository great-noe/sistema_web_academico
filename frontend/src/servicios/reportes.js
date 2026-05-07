export const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const reportDefinitions = [
  {
    id: 'student-grades',
    eyebrow: 'RF12',
    title: 'Notas por alumno',
    description: 'Consolida todos los cursos del alumno, con filtros por periodo, gestion y carrera.',
    endpoint: '/reportes/alumnos/:studentId/notas',
    fields: [
      { name: 'studentId', label: 'ID del alumno', placeholder: '101', required: true, type: 'number' },
      { name: 'periodo', label: 'Periodo', placeholder: '1-2026' },
      { name: 'gestion', label: 'Gestion', placeholder: '2026', type: 'number' },
      { name: 'carreraId', label: 'Carrera ID', placeholder: '3', type: 'number' },
      { name: 'busqueda', label: 'Buscar curso', placeholder: 'Base de Datos' },
    ],
  },
  {
    id: 'course-grades',
    eyebrow: 'RF12',
    title: 'Notas por curso',
    description: 'Lista las notas de todos los alumnos inscritos a un curso concreto.',
    endpoint: '/reportes/cursos/:courseId/notas',
    fields: [
      { name: 'courseId', label: 'ID del curso', placeholder: '55', required: true, type: 'number' },
      { name: 'periodo', label: 'Periodo', placeholder: '1-2026' },
      { name: 'gestion', label: 'Gestion', placeholder: '2026', type: 'number' },
      { name: 'carreraId', label: 'Carrera ID', placeholder: '3', type: 'number' },
      { name: 'estadoInscripcion', label: 'Estado inscripcion', placeholder: 'inscrito' },
    ],
  },
  {
    id: 'student-history',
    eyebrow: 'RF12 pendiente',
    title: 'Historial academico',
    description: 'Cierra el reporte faltante con vista cronologica, creditos y promedio general.',
    endpoint: '/reportes/alumnos/:studentId/historial',
    fields: [
      { name: 'studentId', label: 'ID del alumno', placeholder: '101', required: true, type: 'number' },
      { name: 'gestion', label: 'Gestion', placeholder: '2026', type: 'number' },
      { name: 'periodo', label: 'Periodo', placeholder: '2-2026' },
      { name: 'semestre', label: 'Semestre', placeholder: '5', type: 'number' },
    ],
  },
  {
    id: 'course-students',
    eyebrow: 'RF12 pendiente',
    title: 'Alumnos inscritos por curso',
    description: 'Listado detallado del curso con estado de inscripcion y nota final.',
    endpoint: '/reportes/cursos/:courseId/alumnos',
    fields: [
      { name: 'courseId', label: 'ID del curso', placeholder: '55', required: true, type: 'number' },
      { name: 'gestion', label: 'Gestion', placeholder: '2026', type: 'number' },
      { name: 'periodo', label: 'Periodo', placeholder: '2-2026' },
      { name: 'estadoInscripcion', label: 'Estado inscripcion', placeholder: 'inscrito' },
    ],
  },
  {
    id: 'student-courses',
    eyebrow: 'RF12 pendiente',
    title: 'Cursos del alumno',
    description: 'Listado detallado con filtros por carrera, periodo, estado y texto libre.',
    endpoint: '/reportes/alumnos/:studentId/cursos',
    fields: [
      { name: 'studentId', label: 'ID del alumno', placeholder: '101', required: true, type: 'number' },
      { name: 'gestion', label: 'Gestion', placeholder: '2026', type: 'number' },
      { name: 'periodo', label: 'Periodo', placeholder: '2-2026' },
      { name: 'estadoInscripcion', label: 'Estado inscripcion', placeholder: 'inscrito' },
      { name: 'carreraId', label: 'Carrera ID', placeholder: '3', type: 'number' },
      { name: 'busqueda', label: 'Buscar curso', placeholder: 'Programacion' },
    ],
  },
  {
    id: 'teacher-courses',
    eyebrow: 'RF12 pendiente',
    title: 'Cursos del docente',
    description: 'Listado detallado por docente con filtros de carrera, periodo y nombre de curso.',
    endpoint: '/reportes/docentes/:teacherId/cursos',
    fields: [
      { name: 'teacherId', label: 'ID del docente', placeholder: '17', required: true, type: 'number' },
      { name: 'gestion', label: 'Gestion', placeholder: '2026', type: 'number' },
      { name: 'periodo', label: 'Periodo', placeholder: '2-2026' },
      { name: 'carreraId', label: 'Carrera ID', placeholder: '3', type: 'number' },
      { name: 'busqueda', label: 'Buscar curso', placeholder: 'Arquitectura' },
    ],
  },
]

export function buildReportUrl(definition, form, format) {
  let endpoint = definition.endpoint
  const params = new URLSearchParams()

  definition.fields.forEach((field) => {
    const value = form[field.name]
    if (value === undefined || value === null || String(value).trim() === '') {
      return
    }

    const token = `:${field.name}`
    if (endpoint.includes(token)) {
      endpoint = endpoint.replace(token, encodeURIComponent(String(value).trim()))
      return
    }

    params.set(field.name, String(value).trim())
  })

  params.set('formato', format)
  return `${apiBase}${endpoint}?${params.toString()}`
}
