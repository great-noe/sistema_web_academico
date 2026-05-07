const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { createUser } = require('../services/usuarios.service');

const JWT_SECRET = env.jwtSecret;

const authController = {
  // RF01 - Registro de usuarios
  async register(req, res) {
    try {
      const { ci, rol, nombres, apellidos, email, password } = req.body;
      const user = await createUser({ ci, rol, nombres, apellidos, email, password });
      res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message || 'Error en el servidor al registrar usuario' });
    }
  },

  // RF02 - Inicio de sesión
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const token = jwt.sign(
        { id: user.ci, rol: user.rol, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Determinar avatar/nombre
      const roleName = user.rol.charAt(0).toUpperCase() + user.rol.slice(1);
      const avatar = user.rol === 'admin' ? '💼' : user.rol === 'docente' ? '👨‍🏫' : '👨‍🎓';

      res.json({
        token,
        user: {
          ci: user.ci,
          name: `${user.nombres} ${user.apellidos}`,
          role: roleName,
          email: user.email,
          avatar
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
  },

  // RF03 - Perfil actual
  async getProfile(req, res) {
    try {
      const result = await pool.query(
        'SELECT ci, rol, nombres, apellidos, email FROM usuarios WHERE ci = $1',
        [req.user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
      
      res.json({ user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener perfil' });
    }
  },

  // RF03 - Actualizar datos personales
  async updateProfile(req, res) {
    try {
      const { nombres, apellidos, email } = req.body;
      const userId = req.user.id;

      // Check if email belongs to someone else
      const checkEmail = await pool.query('SELECT ci FROM usuarios WHERE email = $1 AND ci != $2', [email, userId]);
      if (checkEmail.rows.length > 0) {
        return res.status(400).json({ message: 'El correo ya está en uso por otra cuenta' });
      }

      const result = await pool.query(
        'UPDATE usuarios SET nombres = $1, apellidos = $2, email = $3 WHERE ci = $4 RETURNING ci, rol, nombres, apellidos, email',
        [nombres, apellidos, email, userId]
      );

      res.json({ message: 'Perfil actualizado exitosamente', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar perfil' });
    }
  },

  // RF03 - Cambiar contraseña
  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const userQuery = await pool.query('SELECT password_hash FROM usuarios WHERE ci = $1', [userId]);
      if (userQuery.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

      const user = userQuery.rows[0];
      const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

      if (!validPassword) {
        return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
      }

      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      await pool.query('UPDATE usuarios SET password_hash = $1 WHERE ci = $2', [newPasswordHash, userId]);

      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al cambiar contraseña' });
    }
  }
};

module.exports = authController;
