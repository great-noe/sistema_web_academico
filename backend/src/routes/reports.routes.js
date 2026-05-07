const express = require('express');
const controller = require('../controllers/reports.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/alumnos/:studentId/notas', authMiddleware, roleMiddleware(['admin', 'estudiante']), controller.checkReportAccess, controller.studentGrades);
router.get('/alumnos/:studentId/historial', authMiddleware, roleMiddleware(['admin', 'estudiante']), controller.checkReportAccess, controller.studentHistory);
router.get('/alumnos/:studentId/cursos', authMiddleware, roleMiddleware(['admin', 'estudiante']), controller.checkReportAccess, controller.studentCourses);
router.get('/cursos/:courseId/notas', authMiddleware, roleMiddleware(['admin', 'docente']), controller.checkReportAccess, controller.courseGrades);
router.get('/cursos/:courseId/alumnos', authMiddleware, roleMiddleware(['admin', 'docente']), controller.checkReportAccess, controller.courseStudents);
router.get('/docentes/:teacherId/cursos', authMiddleware, roleMiddleware(['admin', 'docente']), controller.checkReportAccess, controller.teacherCourses);

module.exports = router;
