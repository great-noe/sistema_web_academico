const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, cursosController.getCursos);
router.get('/materias', authMiddleware, cursosController.getMaterias);
router.get('/disponibles', authMiddleware, roleMiddleware(['estudiante']), cursosController.getCursosDisponibles);
router.post('/:id/inscribir', authMiddleware, roleMiddleware(['estudiante']), cursosController.inscribir);
router.get('/:id/calificaciones', authMiddleware, roleMiddleware(['admin', 'docente']), cursosController.getCalificaciones);
router.put('/:id/calificaciones', authMiddleware, roleMiddleware(['admin', 'docente']), cursosController.updateCalificaciones);
router.post('/', authMiddleware, roleMiddleware(['admin']), cursosController.createCurso);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), cursosController.updateCurso);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), cursosController.deleteCurso);

module.exports = router;
