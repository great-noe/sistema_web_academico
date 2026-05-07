const express = require('express');
const controller = require('../controllers/reports.controller');

const router = express.Router();

router.get('/alumnos/:studentId/notas', controller.studentGrades);
router.get('/alumnos/:studentId/historial', controller.studentHistory);
router.get('/alumnos/:studentId/cursos', controller.studentCourses);
router.get('/cursos/:courseId/notas', controller.courseGrades);
router.get('/cursos/:courseId/alumnos', controller.courseStudents);
router.get('/docentes/:teacherId/cursos', controller.teacherCourses);

module.exports = router;
