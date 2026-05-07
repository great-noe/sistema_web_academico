const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');
const { registerRules, updateProfileRules } = require('../middlewares/validation.middleware');

router.get('/docentes', authMiddleware, roleMiddleware(['admin', 'docente']), usuariosController.getDocentes);
router.get('/estudiantes', authMiddleware, roleMiddleware(['admin', 'docente']), usuariosController.getEstudiantes);

// CRUD de Usuarios (Solo Admin)
router.get('/', authMiddleware, roleMiddleware(['admin']), usuariosController.getUsuarios);
router.post('/', authMiddleware, roleMiddleware(['admin']), registerRules, usuariosController.createUsuario);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateProfileRules, usuariosController.updateUsuario);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), usuariosController.deleteUsuario);

module.exports = router;
