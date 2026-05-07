const { pool } = require('../config/db');

function appendFilter(clauses, values, sqlFragment, rawValue, transform = (value) => value) {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return;
  }

  values.push(transform(rawValue));
  clauses.push(`${sqlFragment} $${values.length}`);
}

function withWildcards(value) {
  return `%${String(value).trim()}%`;
}

async function runReportQuery(baseQuery, values) {
  const { rows } = await pool.query(baseQuery, values);
  return rows;
}

async function getStudentGradesReport(studentId, filters = {}) {
  const clauses = ['e.usuario_id = $1'];
  const values = [Number(studentId)];

  appendFilter(clauses, values, 'AND cu.periodo =', filters.periodo);
  appendFilter(clauses, values, 'AND cu.gestion =', filters.gestion, Number);
  appendFilter(clauses, values, 'AND ca.id =', filters.carreraId, Number);
  appendFilter(
    clauses,
    values,
    'AND (cu.nombre ILIKE',
    filters.busqueda,
    withWildcards,
  );

  if (filters.busqueda) {
    values.push(withWildcards(filters.busqueda));
    clauses[clauses.length - 1] += ` OR cu.codigo ILIKE $${values.length})`;
  }

  const query = `
    SELECT
      u.id AS alumno_id,
      CONCAT(u.nombres, ' ', u.apellidos) AS alumno,
      e.registro,
      ca.nombre AS carrera,
      cu.codigo AS curso_codigo,
      cu.nombre AS curso,
      COALESCE(m.nombre, cu.nombre) AS materia,
      cu.periodo,
      cu.gestion,
      ce.estado AS estado_inscripcion,
      COALESCE(cal.nota_final, 0) AS nota_final
    FROM estudiantes e
    INNER JOIN usuarios u ON u.id = e.usuario_id
    LEFT JOIN carreras ca ON ca.id = e.carrera_id
    INNER JOIN curso_estudiantes ce ON ce.estudiante_id = e.usuario_id
    INNER JOIN cursos cu ON cu.id = ce.curso_id
    LEFT JOIN materias m ON m.id = cu.materia_id
    LEFT JOIN calificaciones cal ON cal.curso_id = cu.id AND cal.estudiante_id = e.usuario_id
    WHERE ${clauses.join(' ')}
    ORDER BY cu.gestion DESC, cu.periodo DESC, curso ASC
  `;

  const rows = await runReportQuery(query, values);

  return {
    title: 'Notas por alumno',
    subtitle: `Alumno ID ${studentId}`,
    sheetName: 'Notas alumno',
    fileBaseName: `notas-alumno-${studentId}`,
    filters,
    columns: [
      { header: 'Alumno', key: 'alumno', width: 28 },
      { header: 'Registro', key: 'registro', width: 18 },
      { header: 'Carrera', key: 'carrera', width: 24 },
      { header: 'Curso', key: 'curso', width: 28 },
      { header: 'Materia', key: 'materia', width: 28 },
      { header: 'Periodo', key: 'periodo', width: 14 },
      { header: 'Gestion', key: 'gestion', width: 12 },
      { header: 'Estado', key: 'estado_inscripcion', width: 16 },
      { header: 'Nota final', key: 'nota_final', width: 12 },
    ],
    rows,
    emptyMessage: 'El alumno no tiene cursos o notas registradas con esos filtros.',
  };
}

async function getCourseGradesReport(courseId, filters = {}) {
  const clauses = ['cu.id = $1'];
  const values = [Number(courseId)];

  appendFilter(clauses, values, 'AND cu.periodo =', filters.periodo);
  appendFilter(clauses, values, 'AND cu.gestion =', filters.gestion, Number);
  appendFilter(clauses, values, 'AND ca.id =', filters.carreraId, Number);
  appendFilter(clauses, values, 'AND ce.estado =', filters.estadoInscripcion);

  const query = `
    SELECT
      cu.id AS curso_id,
      cu.codigo AS curso_codigo,
      cu.nombre AS curso,
      ca.nombre AS carrera,
      cu.periodo,
      cu.gestion,
      CONCAT(u.nombres, ' ', u.apellidos) AS alumno,
      e.registro,
      ce.estado AS estado_inscripcion,
      COALESCE(cal.nota_final, 0) AS nota_final
    FROM cursos cu
    LEFT JOIN carreras ca ON ca.id = cu.carrera_id
    INNER JOIN curso_estudiantes ce ON ce.curso_id = cu.id
    INNER JOIN usuarios u ON u.id = ce.estudiante_id
    LEFT JOIN estudiantes e ON e.usuario_id = u.id
    LEFT JOIN calificaciones cal ON cal.curso_id = cu.id AND cal.estudiante_id = u.id
    WHERE ${clauses.join(' ')}
    ORDER BY alumno ASC
  `;

  const rows = await runReportQuery(query, values);

  return {
    title: 'Notas por curso',
    subtitle: `Curso ID ${courseId}`,
    sheetName: 'Notas curso',
    fileBaseName: `notas-curso-${courseId}`,
    filters,
    columns: [
      { header: 'Curso', key: 'curso', width: 28 },
      { header: 'Carrera', key: 'carrera', width: 24 },
      { header: 'Alumno', key: 'alumno', width: 28 },
      { header: 'Registro', key: 'registro', width: 18 },
      { header: 'Periodo', key: 'periodo', width: 14 },
      { header: 'Gestion', key: 'gestion', width: 12 },
      { header: 'Estado', key: 'estado_inscripcion', width: 16 },
      { header: 'Nota final', key: 'nota_final', width: 12 },
    ],
    rows,
    emptyMessage: 'El curso no tiene estudiantes o notas registradas con esos filtros.',
  };
}

async function getStudentHistoryReport(studentId, filters = {}) {
  const clauses = ['e.usuario_id = $1'];
  const values = [Number(studentId)];

  appendFilter(clauses, values, 'AND cu.gestion =', filters.gestion, Number);
  appendFilter(clauses, values, 'AND cu.periodo =', filters.periodo);
  appendFilter(clauses, values, 'AND m.semestre =', filters.semestre, Number);

  const query = `
    SELECT
      CONCAT(u.nombres, ' ', u.apellidos) AS alumno,
      e.registro,
      ca.nombre AS carrera,
      COALESCE(m.semestre, 0) AS semestre_plan,
      COALESCE(m.nombre, cu.nombre) AS materia,
      COALESCE(m.creditos, 0) AS creditos,
      cu.periodo,
      cu.gestion,
      COALESCE(cal.nota_final, 0) AS nota_final
    FROM estudiantes e
    INNER JOIN usuarios u ON u.id = e.usuario_id
    LEFT JOIN carreras ca ON ca.id = e.carrera_id
    INNER JOIN curso_estudiantes ce ON ce.estudiante_id = e.usuario_id
    INNER JOIN cursos cu ON cu.id = ce.curso_id
    LEFT JOIN materias m ON m.id = cu.materia_id
    LEFT JOIN calificaciones cal ON cal.curso_id = cu.id AND cal.estudiante_id = e.usuario_id
    WHERE ${clauses.join(' ')}
    ORDER BY semestre_plan ASC, cu.gestion ASC, cu.periodo ASC, materia ASC
  `;

  const rows = await runReportQuery(query, values);
  const promedio =
    rows.length > 0
      ? Number((rows.reduce((sum, row) => sum + Number(row.nota_final || 0), 0) / rows.length).toFixed(2))
      : 0;

  return {
    title: 'Historial academico del alumno',
    subtitle: `Alumno ID ${studentId} | Promedio general ${promedio}`,
    sheetName: 'Historial academico',
    fileBaseName: `historial-academico-${studentId}`,
    filters,
    columns: [
      { header: 'Alumno', key: 'alumno', width: 28 },
      { header: 'Registro', key: 'registro', width: 18 },
      { header: 'Carrera', key: 'carrera', width: 24 },
      { header: 'Semestre', key: 'semestre_plan', width: 12 },
      { header: 'Materia', key: 'materia', width: 28 },
      { header: 'Creditos', key: 'creditos', width: 12 },
      { header: 'Periodo', key: 'periodo', width: 14 },
      { header: 'Gestion', key: 'gestion', width: 12 },
      { header: 'Nota final', key: 'nota_final', width: 12 },
    ],
    rows,
    emptyMessage: 'No hay historial academico disponible para el alumno y filtros indicados.',
  };
}

async function getCourseStudentsReport(courseId, filters = {}) {
  const clauses = ['cu.id = $1'];
  const values = [Number(courseId)];

  appendFilter(clauses, values, 'AND cu.gestion =', filters.gestion, Number);
  appendFilter(clauses, values, 'AND cu.periodo =', filters.periodo);
  appendFilter(clauses, values, 'AND ce.estado =', filters.estadoInscripcion);

  const query = `
    SELECT
      cu.codigo AS curso_codigo,
      cu.nombre AS curso,
      cu.periodo,
      cu.gestion,
      CONCAT(u.nombres, ' ', u.apellidos) AS alumno,
      e.registro,
      ce.estado AS estado_inscripcion,
      COALESCE(cal.nota_final, 0) AS nota_final
    FROM cursos cu
    INNER JOIN curso_estudiantes ce ON ce.curso_id = cu.id
    INNER JOIN usuarios u ON u.id = ce.estudiante_id
    LEFT JOIN estudiantes e ON e.usuario_id = u.id
    LEFT JOIN calificaciones cal ON cal.curso_id = cu.id AND cal.estudiante_id = u.id
    WHERE ${clauses.join(' ')}
    ORDER BY alumno ASC
  `;

  const rows = await runReportQuery(query, values);

  return {
    title: 'Listado de alumnos inscritos a un curso',
    subtitle: `Curso ID ${courseId}`,
    sheetName: 'Alumnos por curso',
    fileBaseName: `alumnos-curso-${courseId}`,
    filters,
    columns: [
      { header: 'Curso', key: 'curso', width: 28 },
      { header: 'Periodo', key: 'periodo', width: 14 },
      { header: 'Gestion', key: 'gestion', width: 12 },
      { header: 'Alumno', key: 'alumno', width: 28 },
      { header: 'Registro', key: 'registro', width: 18 },
      { header: 'Estado', key: 'estado_inscripcion', width: 16 },
      { header: 'Nota final', key: 'nota_final', width: 12 },
    ],
    rows,
    emptyMessage: 'No hay alumnos inscritos en el curso con esos filtros.',
  };
}

async function getStudentCoursesReport(studentId, filters = {}) {
  const clauses = ['e.usuario_id = $1'];
  const values = [Number(studentId)];

  appendFilter(clauses, values, 'AND cu.gestion =', filters.gestion, Number);
  appendFilter(clauses, values, 'AND cu.periodo =', filters.periodo);
  appendFilter(clauses, values, 'AND ce.estado =', filters.estadoInscripcion);
  appendFilter(clauses, values, 'AND ca.id =', filters.carreraId, Number);

  if (filters.busqueda) {
    values.push(withWildcards(filters.busqueda));
    clauses.push(`AND (cu.nombre ILIKE $${values.length} OR cu.codigo ILIKE $${values.length})`);
  }

  const query = `
    SELECT
      CONCAT(u.nombres, ' ', u.apellidos) AS alumno,
      e.registro,
      ca.nombre AS carrera,
      cu.codigo AS curso_codigo,
      cu.nombre AS curso,
      cu.periodo,
      cu.gestion,
      ce.estado AS estado_inscripcion,
      COALESCE(cal.nota_final, 0) AS nota_final
    FROM estudiantes e
    INNER JOIN usuarios u ON u.id = e.usuario_id
    LEFT JOIN carreras ca ON ca.id = e.carrera_id
    INNER JOIN curso_estudiantes ce ON ce.estudiante_id = e.usuario_id
    INNER JOIN cursos cu ON cu.id = ce.curso_id
    LEFT JOIN calificaciones cal ON cal.curso_id = cu.id AND cal.estudiante_id = e.usuario_id
    WHERE ${clauses.join(' ')}
    ORDER BY cu.gestion DESC, cu.periodo DESC, curso ASC
  `;

  const rows = await runReportQuery(query, values);

  return {
    title: 'Listado de cursos del alumno',
    subtitle: `Alumno ID ${studentId}`,
    sheetName: 'Cursos alumno',
    fileBaseName: `cursos-alumno-${studentId}`,
    filters,
    columns: [
      { header: 'Alumno', key: 'alumno', width: 28 },
      { header: 'Registro', key: 'registro', width: 18 },
      { header: 'Carrera', key: 'carrera', width: 24 },
      { header: 'Curso', key: 'curso', width: 28 },
      { header: 'Codigo', key: 'curso_codigo', width: 14 },
      { header: 'Periodo', key: 'periodo', width: 14 },
      { header: 'Gestion', key: 'gestion', width: 12 },
      { header: 'Estado', key: 'estado_inscripcion', width: 16 },
      { header: 'Nota final', key: 'nota_final', width: 12 },
    ],
    rows,
    emptyMessage: 'El alumno no tiene cursos registrados con esos filtros.',
  };
}

async function getTeacherCoursesReport(teacherId, filters = {}) {
  const clauses = ['cu.docente_id = $1'];
  const values = [Number(teacherId)];

  appendFilter(clauses, values, 'AND cu.gestion =', filters.gestion, Number);
  appendFilter(clauses, values, 'AND cu.periodo =', filters.periodo);
  appendFilter(clauses, values, 'AND ca.id =', filters.carreraId, Number);

  if (filters.busqueda) {
    values.push(withWildcards(filters.busqueda));
    clauses.push(`AND (cu.nombre ILIKE $${values.length} OR cu.codigo ILIKE $${values.length})`);
  }

  const query = `
    SELECT
      CONCAT(u.nombres, ' ', u.apellidos) AS docente,
      d.codigo_docente,
      ca.nombre AS carrera,
      cu.codigo AS curso_codigo,
      cu.nombre AS curso,
      cu.periodo,
      cu.gestion,
      COUNT(ce.estudiante_id) AS total_inscritos
    FROM cursos cu
    INNER JOIN usuarios u ON u.id = cu.docente_id
    LEFT JOIN docentes d ON d.usuario_id = u.id
    LEFT JOIN carreras ca ON ca.id = cu.carrera_id
    LEFT JOIN curso_estudiantes ce ON ce.curso_id = cu.id
    WHERE ${clauses.join(' ')}
    GROUP BY docente, d.codigo_docente, ca.nombre, cu.codigo, cu.nombre, cu.periodo, cu.gestion
    ORDER BY cu.gestion DESC, cu.periodo DESC, curso ASC
  `;

  const rows = await runReportQuery(query, values);

  return {
    title: 'Listado de cursos del docente',
    subtitle: `Docente ID ${teacherId}`,
    sheetName: 'Cursos docente',
    fileBaseName: `cursos-docente-${teacherId}`,
    filters,
    columns: [
      { header: 'Docente', key: 'docente', width: 28 },
      { header: 'Codigo', key: 'codigo_docente', width: 16 },
      { header: 'Carrera', key: 'carrera', width: 24 },
      { header: 'Curso', key: 'curso', width: 28 },
      { header: 'Codigo curso', key: 'curso_codigo', width: 16 },
      { header: 'Periodo', key: 'periodo', width: 14 },
      { header: 'Gestion', key: 'gestion', width: 12 },
      { header: 'Inscritos', key: 'total_inscritos', width: 12 },
    ],
    rows,
    emptyMessage: 'El docente no tiene cursos registrados con esos filtros.',
  };
}

module.exports = {
  getStudentGradesReport,
  getCourseGradesReport,
  getStudentHistoryReport,
  getCourseStudentsReport,
  getStudentCoursesReport,
  getTeacherCoursesReport,
};
