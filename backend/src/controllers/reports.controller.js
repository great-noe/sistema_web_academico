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
  studentGrades,
  courseGrades,
  studentHistory,
  courseStudents,
  studentCourses,
  teacherCourses,
};
