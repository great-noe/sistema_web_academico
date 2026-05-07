const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

router.get('/docentes', authMiddleware, roleMiddleware(['admin', 'docente']), usuariosController.getDocentes);

// CRUD de Usuarios (Solo Admin)
router.get('/', authMiddleware, roleMiddleware(['admin']), usuariosController.getUsuarios);
router.post('/', authMiddleware, roleMiddleware(['admin']), usuariosController.createUsuario);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), usuariosController.updateUsuario);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), usuariosController.deleteUsuario);

module.exports = router;
