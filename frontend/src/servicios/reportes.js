import { API_URL } from './api'

export const apiBase = API_URL

export const reportDefinitions = [
  {
    id: 'studentGrades',
    eyebrow: 'Notas',
    title: 'Notas por alumno',
    description: 'Notas de todos los cursos de un alumno específico.',
    endpoint: '/reportes/alumnos/:studentCi/notas',
    roles: ['Administrador', 'Estudiante'],
    fields: [
      { key: 'studentCi', label: 'Alumno', type: 'text', required: true, autoFillRole: 'Estudiante' },
    ]
  },
  {
    id: 'courseGrades',
    eyebrow: 'Notas',
    title: 'Notas por curso',
    description: 'Notas de todos los alumnos inscritos en un curso.',
    endpoint: '/reportes/cursos/:courseId/notas',
    roles: ['Administrador', 'Docente'],
    fields: [
      { key: 'courseId', label: 'Curso', type: 'number', required: true },
    ]
  },
  {
    id: 'studentHistory',
    eyebrow: 'Historial',
    title: 'Historial académico',
    description: 'Historial académico completo de un alumno.',
    endpoint: '/reportes/alumnos/:studentCi/historial',
    roles: ['Administrador', 'Estudiante'],
    fields: [
      { key: 'studentCi', label: 'Alumno', type: 'text', required: true, autoFillRole: 'Estudiante' },
    ]
  },
  {
    id: 'courseStudents',
    eyebrow: 'Listado',
    title: 'Alumnos inscritos',
    description: 'Listado de alumnos inscritos en un curso.',
    endpoint: '/reportes/cursos/:courseId/alumnos',
    roles: ['Administrador', 'Docente'],
    fields: [
      { key: 'courseId', label: 'Curso', type: 'number', required: true },
    ]
  },
  {
    id: 'studentCourses',
    eyebrow: 'Cursos',
    title: 'Cursos del alumno',
    description: 'Listado de cursos en los que está inscrito un alumno.',
    endpoint: '/reportes/alumnos/:studentCi/cursos',
    roles: ['Administrador', 'Estudiante'],
    fields: [
      { key: 'studentCi', label: 'Alumno', type: 'text', required: true, autoFillRole: 'Estudiante' },
    ]
  },
  {
    id: 'teacherCourses',
    eyebrow: 'Cursos',
    title: 'Cursos del docente',
    description: 'Listado de cursos asignados a un docente.',
    endpoint: '/reportes/docentes/:teacherCi/cursos',
    roles: ['Administrador', 'Docente'],
    fields: [
      { key: 'teacherCi', label: 'Docente', type: 'text', required: true, autoFillRole: 'Docente' },
    ]
  }
]

export function buildReportUrl(definition, form, format) {
  let url = `${API_URL}${definition.endpoint}`

  for (const field of definition.fields) {
    if (form[field.key]) {
      url = url.replace(`:${field.key}`, form[field.key])
    }
  }

  const queryParams = []
  const filterableFields = ['periodo', 'gestion', 'carrera', 'busqueda', 'estado']

  for (const key of filterableFields) {
    if (form[key] && form[key] !== '') {
      queryParams.push(`${key}=${encodeURIComponent(form[key])}`)
    }
  }

  queryParams.push(`formato=${format}`)

  return `${url}?${queryParams.join('&')}`
}
