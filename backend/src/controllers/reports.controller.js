const { pool } = require('../config/db');
const {
  getStudentGradesReport,
  getCourseGradesReport,
  getStudentHistoryReport,
  getCourseStudentsReport,
  getStudentCoursesReport,
  getTeacherCoursesReport,
} = require('../services/reports.service');
const { buildExcelReport, buildPdfReport, sanitizeFileName } = require('../utils/reportBuilders');

async function sendReport(req, res, reportPromise) {
  const report = await reportPromise;
  const format = String(req.query.formato || 'json').toLowerCase();

  if (format === 'json') {
    return res.json({
      title: report.title,
      subtitle: report.subtitle,
      filters: report.filters,
      columns: report.columns,
      rows: report.rows,
      total: report.rows.length,
    });
  }

  const fileBaseName = sanitizeFileName(report.fileBaseName || report.title || 'reporte');

  if (format === 'excel' || format === 'xlsx') {
    const buffer = await buildExcelReport(report);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileBaseName}.xlsx"`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    return res.send(buffer);
  }

  if (format === 'pdf') {
    const buffer = await buildPdfReport(report);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileBaseName}.pdf"`,
    );
    res.setHeader('Content-Type', 'application/pdf');
    return res.send(buffer);
  }

  return res.status(400).json({
    message: 'Formato no soportado. Usa json, pdf o excel.',
  });
}

async function resolveUserId(req) {
  if (req.user.id) return req.user.id;
  const result = await pool.query('SELECT ci FROM usuarios WHERE email = $1', [req.user.email]);
  return result.rows[0]?.ci;
}

async function checkReportAccess(req, res, next) {
  const { rol } = req.user;
  const userId = await resolveUserId(req);
  const { studentId, courseId, teacherId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  if (rol === 'admin') return next();

  if (rol === 'estudiante') {
    if (!studentId) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a este reporte' });
    }
    if (String(studentId) !== String(userId)) {
      return res.status(403).json({ message: 'Solo puedes consultar tus propios datos' });
    }
    return next();
  }

  if (rol === 'docente') {
    if (teacherId) {
      if (String(teacherId) !== String(userId)) {
        return res.status(403).json({ message: 'Solo puedes consultar tus propios cursos' });
      }
      return next();
    }
    if (courseId) {
      const check = await pool.query('SELECT id FROM cursos WHERE id = $1 AND docente_ci = $2', [courseId, userId]);
      if (check.rows.length === 0) {
        return res.status(403).json({ message: 'No tienes permisos para este curso' });
      }
      return next();
    }
    return res.status(403).json({ message: 'No tienes permisos para acceder a este reporte' });
  }

  return res.status(403).json({ message: 'Acceso denegado' });
}

async function studentGrades(req, res, next) {
  try {
    await sendReport(req, res, getStudentGradesReport(req.params.studentId, req.query));
  } catch (error) {
    next(error);
  }
}

async function courseGrades(req, res, next) {
  try {
    await sendReport(req, res, getCourseGradesReport(req.params.courseId, req.query));
  } catch (error) {
    next(error);
  }
}

async function studentHistory(req, res, next) {
  try {
    await sendReport(req, res, getStudentHistoryReport(req.params.studentId, req.query));
  } catch (error) {
    next(error);
  }
}

async function courseStudents(req, res, next) {
  try {
    await sendReport(req, res, getCourseStudentsReport(req.params.courseId, req.query));
  } catch (error) {
    next(error);
  }
}

async function studentCourses(req, res, next) {
  try {
    await sendReport(req, res, getStudentCoursesReport(req.params.studentId, req.query));
  } catch (error) {
    next(error);
  }
}

async function teacherCourses(req, res, next) {
  try {
    await sendReport(req, res, getTeacherCoursesReport(req.params.teacherId, req.query));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkReportAccess,
  studentGrades,
  courseGrades,
  studentHistory,
  courseStudents,
  studentCourses,
  teacherCourses,
};
